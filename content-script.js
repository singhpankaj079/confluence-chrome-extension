let tooltipId = "__tooltip__";
let options = {headers: {
    "Content-type": "application/json; charset=UTF-8", "Access-Control-Allow-Origin": "*",  "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept"
}};
function fetchInfo(key) {
    return fetch('http://localhost:3456/info/', {method: "post", body: JSON.stringify({"keyword": key.toLowerCase()}), ...options}).then(response => response.json()).catch(err=> console.log(err));
}

function addRef(question, data) {
    let payload = {"question": question, "data": data};
    return fetch('http://localhost:1234/questions', {
     
    // Adding method type
    method: "POST",
     
    // Adding body or contents to send
    body: JSON.stringify(payload),
     
    // Adding headers to the request
    headers: {
        "Content-type": "application/json; charset=UTF-8", "Access-Control-Allow-Origin": "*",  "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept"
    }
}).then(response => response.json());
}


function addOnSelect() {
    document.addEventListener('mouseup', event => {  
        let tooltip = document.getElementById(tooltipId);
        if (tooltip == null) {
            tooltip = createTooltip();
        }

        if(window.getSelection().toString().length) {
           let exactText = window.getSelection().toString();
           fetchInfo(exactText)
           .then(json => {updateTooltip(tooltip, exactText, json, event.pageX, event.pageY);}).catch(err=> {console.log(err);tooltip.style.display = "none"});
        }  else {
            tooltip.style.display = "none";
        }
    });
}

function actionOnSelect(event) {
        let tooltip = document.getElementById(tooltipId);
        if (tooltip == null) {
            tooltip = createTooltip();
        }

        if(window.getSelection().toString().length) {
           let exactText = window.getSelection().toString();
           fetchInfo(exactText)
           .then(json => {updateTooltip(tooltip, exactText, json, event.pageX, event.pageY);}).catch(err=> {console.log(err);tooltip.style.display = "none"});
        }  else {
            tooltip.style.display = "none";
        }
}

function updateTooltip(tooltip, selectedText, keywordData, pageX, pageY) {    
    let h2 = document.createElement("h2");
    h2.innerHTML = selectedText;
    h2.style.textAlign = "center";
    h2.style.color = "purple";
    tooltip.innerText = "";
    tooltip.appendChild(h2);
    if (pageX) tooltip.style.left = pageX + "px";
    if (pageY) tooltip.style.top = pageY + "px";
    addLinksToTooltip(tooltip, keywordData, selectedText);
    // tooltip.style.display = "block";
    
}

function refreshTooltip(keyword) {
    let tooltip = document.getElementById(tooltipId);
    if (tooltip == null) {
        tooltip = createTooltip();
    }
    fetchInfo(keyword)
        .then(json => {updateTooltip(tooltip, keyword, json);}).catch(err=> {console.log(err);tooltip.style.display = "none"});
}

function addLinksToTooltip(tooltip, keywordData, keyword) {
    let divEle1 = document.createElement('div');
    let divEle2 = document.createElement('div');
    divEle1.innerHTML += `<h2> References <span id="${keyword}_show_add_ref_form_button" title="Add reference" class="glyphicon glyphicon-plus ext_show_add_ref_form_button"></span></h2>`;
    let h2 = document.createElement("h2");
    h2.innerHTML = `FAQs <span id="${keyword}_show_add_qa_form_button" class="glyphicon glyphicon-plus ext_show_add_qa_form_button"></span>`;
    divEle2.appendChild(h2);
    if (keywordData) {
        let referencelist = keywordData.referencelist;
        let qalist = keywordData.questionAnswer;
        divEle1.innerHTML += `<div id="${keyword}_add_ref_form" class="ext_display_none"><input type="text" name="keyword" value="${keywordData.keyword.toLowerCase()}" class="ext_display_none"><input id="${keyword}_add_ref_desc_input" type="text" placeholder="description" name="description"><input id="${keyword}_add_ref_url_input" type="text" placeholder="url" name="url"><span id="${keyword}_cancel_add_ref_button" class="glyphicon glyphicon-remove ext_cancel_add_ref_button"></span><span id="${keyword}_add_ref_button" class="glyphicon glyphicon-ok ext_add_ref_button"></span>`;
        divEle1.innerHTML += '<br>'
        for (let temp=0;referencelist && temp<referencelist.length;temp++) {
            let divEle1html = `<div id="${keyword}_ref_item_${temp}"><div  id="${keyword}_ref_refId_${temp}" class="ext_display_none">${referencelist[temp]._id}</div>${referencelist[temp].description}: <a target="_blank" href="//${referencelist[temp].url}">${referencelist[temp].url}</a><span id="${keyword}_ref_delete_button_${temp}" class="glyphicon glyphicon-remove-circle ext_delete_button"></span><span id="${keyword}_ref_edit_button_${temp}" class="glyphicon glyphicon-pencil ext_edit_button"></span></div><br>`;
            divEle1html +=  `<div id="${keyword}_ref_edit_form_${temp}" class="ext_display_none"><input  id="${keyword}_ref_refId_input_${temp}" type="text" name="refId" value="${referencelist[temp]._id}" class="ext_display_none"><input  type="text" name="keyword" value="${keyword.toLowerCase()}" class="ext_display_none"><input id="${keyword}_ref_des_input_${temp}" type="text" placeholder="description" name="description"><input id="${keyword}_ref_url_input_${temp}" type="text" placeholder="url" name="url"><span id="${keyword}_ref_edit_cancel_button_${temp}" class="glyphicon glyphicon-remove ext_edit_cancel"></span><span id="${keyword}_ref_edit_submit_button_${temp}" class="glyphicon glyphicon-ok ext_edit_submit"></span><br>`;
            divEle1.innerHTML += divEle1html;                           
        }
        divEle2.innerHTML += `<div id="${keyword}_add_qa_form" class="ext_display_none"><input type="text" name="keyword" value="${keywordData.keyword.toLowerCase()}" class="ext_display_none"><input id="${keyword}_add_qa_question_input" type="text" placeholder="question" name="question"><input id="${keyword}_add_qa_answer_input" type="text" placeholder="answer" name="answer"><span id="${keyword}_cancel_add_qa_button" class="glyphicon glyphicon-remove ext_cancel_add_qa_button"></span><span id="${keyword}_add_qa_button" class="glyphicon glyphicon-ok ext_add_qa_button"></span>`;
        divEle2.innerHTML += '<br>';
        for (var temp=0;qalist && temp<qalist.length;temp++) {
            let divEle2html = `<div id="${keyword}_qa_item_${temp}"><div  id="${keyword}_qa_qaId_${temp}" class="ext_display_none">${qalist[temp]._id}</div><div>${qalist[temp].question}</div><div>${qalist[temp].answer}</div><span id="${keyword}_qa_delete_button_${temp}" class="glyphicon glyphicon-remove-circle ext_delete_button"></span><span id="${keyword}_qa_edit_button_${temp}" class="glyphicon glyphicon-pencil ext_edit_button"></span></div><br>`;
            divEle2html += `<div id="${keyword}_qa_edit_form_${temp}" class="ext_display_none"><input id="${keyword}_qa_qaId_input_${temp}" value="${qalist[temp]._id}" class="ext_display_none"></input><input id="${keyword}_qa_question_input_${temp}"></input><input id="${keyword}_qa_answer_input_${temp}"></input><span id="${keyword}_qa_edit_cancel_button_${temp}" class="glyphicon glyphicon-remove ext_edit_cancel"></span><span id="${keyword}_qa_edit_submit_button_${temp}" class="glyphicon glyphicon-ok ext_edit_submit"></span></div><br>`;
            divEle2.innerHTML += divEle2html;
        }
        tooltip.appendChild(divEle1);
        tooltip.appendChild(divEle2);
        for (let temp=0;referencelist && temp<referencelist.length;temp++) {
            document.getElementById(`${keyword}_ref_edit_button_${temp}`).onclick = () =>  openRefEditForm(keyword, temp, referencelist[temp]);
            document.getElementById(`${keyword}_ref_edit_cancel_button_${temp}`).onclick = () => hideRefEditForm(keyword, temp);
            document.getElementById(`${keyword}_ref_edit_submit_button_${temp}`).onclick = () => editReference(keyword, temp);
            document.getElementById(`${keyword}_ref_delete_button_${temp}`).onclick = () => deleteReference(keyword, temp);           
        }

        for (let temp=0;qalist && temp<qalist.length;temp++) {            
            document.getElementById(`${keyword}_qa_edit_button_${temp}`).onclick = () =>  openQaEditForm(keyword, temp, qalist[temp]);
            document.getElementById(`${keyword}_qa_edit_cancel_button_${temp}`).onclick = () => hideQaEditForm(keyword, temp);
            document.getElementById(`${keyword}_qa_edit_submit_button_${temp}`).onclick = () => editQa(keyword, temp);
            document.getElementById(`${keyword}_qa_delete_button_${temp}`).onclick = () => deleteQa(keyword, temp);
        }
    } else {
        divEle1.innerHTML += `<div id="${keyword}_add_ref_form" class="ext_display_none"><input type="text" name="keyword" value="${keyword.toLowerCase()}" class="ext_display_none"><input id="${keyword}_add_ref_desc_input" type="text" placeholder="description" name="description"><input id="${keyword}_add_ref_url_input" type="text" placeholder="url" name="url"><span id="${keyword}_cancel_add_ref_button" class="glyphicon glyphicon-remove ext_cancel_add_ref_button"></span><span id="${keyword}_add_ref_button" class="glyphicon glyphicon-ok ext_add_ref_button"></span>`;
        divEle1.innerHTML += '<br>'
        tooltip.appendChild(divEle1);
        divEle2.innerHTML += `<div id="${keyword}_add_qa_form" class="ext_display_none"><input type="text" name="keyword" value="${keyword.toLowerCase()}" class="ext_display_none"><input id="${keyword}_add_qa_question_input" type="text" placeholder="question" name="question"><input id="${keyword}_add_qa_answer_input" type="text" placeholder="answer" name="answer"><span id="${keyword}_cancel_add_qa_button" class="glyphicon glyphicon-remove ext_cancel_add_qa_button"></span><span id="${keyword}_add_qa_button" class="glyphicon glyphicon-ok ext_add_qa_button"></span>`;
        divEle2.innerHTML += '<br>';
        tooltip.appendChild(divEle2);
    }

    document.getElementById(`${keyword}_show_add_ref_form_button`).onclick = () => showAddRefForm(keyword);
    document.getElementById(`${keyword}_add_ref_button`).onclick = () => addReference(keyword);
    document.getElementById(`${keyword}_cancel_add_ref_button`).onclick = () => hideAddRefForm(keyword);

    document.getElementById(`${keyword}_show_add_qa_form_button`).onclick = () => showAddQaForm(keyword);
    document.getElementById(`${keyword}_add_qa_button`).onclick = () => addQa(keyword);
    document.getElementById(`${keyword}_cancel_add_qa_button`).onclick = () => hideAddQaForm(keyword);   
}

async function addReference(keyword) {
    let url = document.getElementById(`${keyword}_add_ref_url_input`);
    let description = document.getElementById(`${keyword}_add_ref_desc_input`);
    let payload = {};
    payload.keyword = keyword.toLowerCase();
    payload.url = url.value;
    payload.description = description.value;
    await fetch("http://localhost:3456/reference/add", { method: "post", body: JSON.stringify(payload), ...options }).catch(err=>console.log(err));
    refreshTooltip(keyword);
}

function showAddRefForm(keyword) {
    let addRefForm = document.getElementById(`${keyword}_add_ref_form`);
    let showAddRefFormButton = document.getElementById(`${keyword}_show_add_ref_form_button`);
    
    if (addRefForm && addRefForm.classList.contains(["ext_display_none"])) {
        addRefForm.classList.remove(["ext_display_none"]);
    } else {return;}

    if (showAddRefFormButton && !showAddRefFormButton.classList.contains(["ext_display_none"])) {
        showAddRefFormButton.classList.add(["ext_display_none"]);
    }
}

function hideAddRefForm(keyword) {
    let addRefForm = document.getElementById(`${keyword}_add_ref_form`);
    let showAddRefFormButton = document.getElementById(`${keyword}_show_add_ref_form_button`);

    if (addRefForm && !addRefForm.classList.contains(["ext_display_none"])) {
        addRefForm.classList.add(["ext_display_none"]);
    } else {return;}

    if (showAddRefFormButton && showAddRefFormButton.classList.contains(["ext_display_none"])) {
        showAddRefFormButton.classList.remove(["ext_display_none"]);
    }
}

async function editReference(keyword, index) {
    let editRefId = `${keyword}_ref_refId_input_${index}`;
    let editDescId = `${keyword}_ref_des_input_${index}`;
    let editUrlId = `${keyword}_ref_url_input_${index}`;
    
    let refId_input = document.getElementById(editRefId);
    let desc_input = document.getElementById(editDescId);
    let url_input = document.getElementById(editUrlId);
    let refId = refId_input.value;
    let desc = desc_input.value;
    let url = url_input.value;
    let payload = {url, description: desc, refId, keyword};
    await fetch("http://localhost:3456/reference/update", { method: "post", body: JSON.stringify(payload), ...options }).catch(err=>console.log(err));
    refreshTooltip(keyword);
}

async function deleteReference(keyword, index) {
    let refEleId = `${keyword}_ref_refId_${index}`;
    let refIdDiv = document.getElementById(refEleId);
    let refId = refIdDiv.innerText;
    let payload = {keyword, refId};
    await fetch("http://localhost:3456/reference/remove", { method: "post", body: JSON.stringify(payload), ...options }).catch(err=>console.log(err));
    refreshTooltip(keyword);
}

function openRefEditForm(keyword, index, reference) {
    let refEleId = `${keyword}_ref_item_${index}`;
    let refEditId = `${keyword}_ref_edit_form_${index}`;
    let refItem = document.getElementById(refEleId);
    let editForm = document.getElementById(refEditId);
    if (editForm && editForm.classList.contains("ext_display_none")) {
        editForm.classList.remove(["ext_display_none"]);
    }
    if (refItem && !refItem.classList.contains("ext_display_none")) {
        refItem.classList.add(["ext_display_none"]);
    }
    let editDescId = `${keyword}_ref_des_input_${index}`;
    let editUrlId = `${keyword}_ref_url_input_${index}`;
    let desc_input = document.getElementById(editDescId);
    let url_input = document.getElementById(editUrlId);
    if (reference && reference.description)
        desc_input.setAttribute("value", reference.description);
    if (reference && reference.url) {
        url_input.setAttribute("value", reference.url);
    }
}

function hideRefEditForm(keyword, index) {
    let refId = `${keyword}_ref_item_${index}`;
    let refEditId = `${keyword}_ref_edit_form_${index}`;
    let refItem = document.getElementById(refId);
    let editForm = document.getElementById(refEditId);
    if (editForm && !editForm.classList.contains("ext_display_none")) {
        editForm.classList.add(["ext_display_none"]);
    }
    if (refItem && refItem.classList.contains("ext_display_none")) {
        refItem.classList.remove(["ext_display_none"]);
    }
}




async function addQa(keyword) {
    let question = document.getElementById(`${keyword}_add_qa_question_input`);
    let answer = document.getElementById(`${keyword}_add_qa_answer_input`);
    let payload = {question: question.value, answer: answer.value, keyword: keyword.toLowerCase()};
    await fetch("http://localhost:3456/questionanswer/add", { method: "post", body: JSON.stringify(payload), ...options }).catch(err=>console.log(err));
    refreshTooltip(keyword);
}

function showAddQaForm(keyword) {
    let addQaForm = document.getElementById(`${keyword}_add_qa_form`);
    let showAddQaFormButton = document.getElementById(`${keyword}_show_add_qa_form_button`);
    
    if (addQaForm && addQaForm.classList.contains(["ext_display_none"])) {
        addQaForm.classList.remove(["ext_display_none"]);
    } else {return;}

    if (showAddQaFormButton && !showAddQaFormButton.classList.contains(["ext_display_none"])) {
        showAddQaFormButton.classList.add(["ext_display_none"]);
    }
}

function hideAddQaForm(keyword) {
    let addQaForm = document.getElementById(`${keyword}_add_qa_form`);
    let showAddQaFormButton = document.getElementById(`${keyword}_show_add_qa_form_button`);

    if (addQaForm && !addQaForm.classList.contains(["ext_display_none"])) {
        addQaForm.classList.add(["ext_display_none"]);
    } else {return;}

    if (showAddQaFormButton && showAddQaFormButton.classList.contains(["ext_display_none"])) {
        showAddQaFormButton.classList.remove(["ext_display_none"]);
    }
}

async function editQa(keyword, index) {
    let editQaId = `${keyword}_qa_qaId_input_${index}`;
    let editQuestionId = `${keyword}_qa_question_input_${index}`;
    let editAnswerId = `${keyword}_qa_answer_input_${index}`;
    
    let qaId_input = document.getElementById(editQaId);
    let question_input = document.getElementById(editQuestionId);
    let answer_input = document.getElementById(editAnswerId);
    let qaId = qaId_input.value;
    let question = question_input.value;
    let answer = answer_input.value;
    let payload = {question, answer, qaId, keyword};
    await fetch("http://localhost:3456/questionanswer/update", { method: "post", body: JSON.stringify(payload), ...options }).catch(err=>console.log(err));
    refreshTooltip(keyword);
}

async function deleteQa(keyword, index) {
    let qaEleId = `${keyword}_qa_qaId_${index}`;
    let qaIdDiv = document.getElementById(qaEleId);
    let qaId = qaIdDiv.innerText;
    let payload = {keyword, qaId};
    await fetch("http://localhost:3456/questionanswer/remove", { method: "post", body: JSON.stringify(payload), ...options }).catch(err=>console.log(err));
    refreshTooltip(keyword);
}

function openQaEditForm(keyword, index, qa) {
    let qaEleId = `${keyword}_qa_item_${index}`;
    let qaEditId = `${keyword}_qa_edit_form_${index}`;
    let qaItem = document.getElementById(qaEleId);
    let editForm = document.getElementById(qaEditId);
    if (editForm && editForm.classList.contains("ext_display_none")) {
        editForm.classList.remove(["ext_display_none"]);
    }
    if (qaItem && !qaItem.classList.contains("ext_display_none")) {
        qaItem.classList.add(["ext_display_none"]);
    }
    let editQuestionId = `${keyword}_qa_question_input_${index}`;
    let editAnswerId = `${keyword}_qa_answer_input_${index}`;
    let question_input = document.getElementById(editQuestionId);
    let answer_input = document.getElementById(editAnswerId);
    if (qa && qa.question)
        question_input.setAttribute("value", qa.question);
    if (qa && qa.answer) {
        answer_input.setAttribute("value", qa.answer);
    }
}

function hideQaEditForm(keyword, index) {
    let qaId = `${keyword}_qa_item_${index}`;
    let qaEditId = `${keyword}_qa_edit_form_${index}`;
    let qaItem = document.getElementById(qaId);
    let editForm = document.getElementById(qaEditId);
    if (editForm && !editForm.classList.contains("ext_display_none")) {
        editForm.classList.add(["ext_display_none"]);
    }
    if (qaItem && qaItem.classList.contains("ext_display_none")) {
        qaItem.classList.remove(["ext_display_none"]);
    }
}


function createTooltip() {
    let tooltip = document.createElement('div');
    tooltip.id = tooltipId;
    tooltip.className = "animate__animated animate__lightSpeedInRight ext_display_none";
    tooltip.onclick = function(e) {
        e.stopImmediatePropagation();
    }
    tooltip.onmouseup = function(e) {
        e.stopImmediatePropagation();
    }
    document.body.appendChild(tooltip);
    return tooltip;
}

document.head.innerHTML = '<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css"></link>' + document.head.innerHTML;
addOnSelect();
function showTooltip() {
    let tooltipEle = document.getElementById(tooltipId);
    if (tooltipEle && tooltipEle.style) {
        tooltipEle.style.display = "block";
    }
}

function hideTooltip() {
    let tooltipEle = document.getElementById(tooltipId);
    if (tooltipEle && tooltipEle.style) {
        tooltipEle.style.display = "none";
    }
}

chrome.runtime.onMessage.addListener((message) => {
    console.log(message);
    switch(message.value) {
        case "SHOW_TOOLTIP": showTooltip();
        break;
        case "HIDE_TOOLTIP": hideTooltip();
        break;
    }
})
