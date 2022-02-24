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
    h2.innerHTML = selectedText + '<span id="' + selectedText + '_show_add_ref_form_button" title="Add reference" class="glyphicon glyphicon-plus ext_show_add_ref_form_button"></span>';
    h2.style.textAlign = "center";
    h2.style.color = "purple";
    tooltip.innerText = "";
    tooltip.appendChild(h2);
    if (pageX) tooltip.style.left = pageX + "px";
    if (pageY) tooltip.style.top = pageY + "px";
    addLinksToTooltip(tooltip, keywordData, selectedText);
    document.getElementById(selectedText + "_show_add_ref_form_button").onclick = () => showAddRefForm(selectedText);
    tooltip.style.display = "block";
    
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
    let h2 = document.createElement("h2");
    h2.innerText = "Q & A";
    divEle2.appendChild(h2);
    if (keywordData) {
        let referencelist = keywordData.referencelist;
        let qalist = keywordData.questionAnswer;
        divEle1.innerHTML += '<div id="' + keyword + '_add_ref_form" class="ext_display_none"><input type="text" name="keyword" value="' + keywordData.keyword.toLowerCase() + '" class="ext_display_none"><input id="' + keyword +'_add_ref_desc_input" type="text" placeholder="description" name="description"><input id="' + keyword + '_add_ref_url_input" type="text" placeholder="url" name="url"><span id="' + keyword + '_cancel_add_ref_button" class="glyphicon glyphicon-remove ext_cancel_add_ref_button"></span><span id="' + keyword + '_add_ref_button" class="glyphicon glyphicon-ok ext_add_ref_button"></span>';
        divEle1.innerHTML += '<br>'
        for (let temp=0;referencelist && temp<referencelist.length;temp++) {
            let divEle1html = '<div  id="' + keyword + '_ref_refId_' + temp + '" class="ext_display_none">' + referencelist[temp]._id + '</div><div id="' + keyword + '_ref_item_' + temp + '">' + referencelist[temp].description + ': <a href="' + referencelist[temp].url + '">' + referencelist[temp].url + '</a><span id="' + keyword + '_ref_delete_button_' + temp + '" class="glyphicon glyphicon-remove-circle ext_delete_button"></span><span id="' + keyword + '_ref_edit_button_' + temp + '" class="glyphicon glyphicon-pencil ext_edit_button"></span></div><br>';
            divEle1html +=  '<div id="' + keyword + '_ref_edit_form_' + temp + '" class="ext_display_none"><input  id="' + keyword + '_ref_refId_input_' + temp + '" type="text" name="refId" value="' + referencelist[temp]._id + '" class="ext_display_none"><input  type="text" name="keyword" value="' + keyword.toLowerCase() + '" class="ext_display_none"><input id="' + keyword + '_ref_des_input_' + temp + '" type="text" placeholder="description" name="description"><input id="' + keyword + '_ref_url_input_' + temp + '" type="text" placeholder="url" name="url"><span id="' + keyword + '_ref_edit_cancel_button_' + temp + '" class="glyphicon glyphicon-remove ext_edit_cancel"></span><span id="' + keyword + '_ref_edit_submit_button_' + temp + '" class="glyphicon glyphicon-ok ext_edit_submit"></span><br>'
            divEle1.innerHTML += divEle1html;                           
        }
        for (var temp=0;qalist && temp<qalist.length;temp++) {
            let divEle2html = '<div>' + qalist[temp].question + '</div><div>' + qalist[temp].answer + '</div><br>';
            divEle2.innerHTML += divEle2html;
        }
        tooltip.appendChild(divEle1);
        tooltip.appendChild(divEle2);
        for (let temp=0;referencelist && temp<referencelist.length;temp++) {
            document.getElementById(keyword + "_ref_edit_button_" + temp).onclick = () =>  openEditForm(keyword, temp, referencelist[temp]);
            document.getElementById(keyword + "_ref_edit_cancel_button_" + temp).onclick = () => hideEditForm(keyword, temp);
            document.getElementById(keyword + "_ref_edit_submit_button_" + temp).onclick = () => editReference(keyword, temp);
            document.getElementById(keyword + "_ref_delete_button_" + temp).onclick = () => deleteReference(keyword, temp);           
        }
    } else {
        divEle1.innerHTML += '<div id="' + keyword + '_add_ref_form" class="ext_display_none"><input type="text" name="keyword" value="' + keyword.toLowerCase() + '" class="ext_display_none"><input id="' + keyword +'_add_ref_desc_input" type="text" placeholder="description" name="description"><input id="' + keyword + '_add_ref_url_input" type="text" placeholder="url" name="url"><span id="' + keyword + '_cancel_add_ref_button" class="glyphicon glyphicon-remove ext_cancel_add_ref_button"></span><span id="' + keyword + '_add_ref_button" class="glyphicon glyphicon-ok ext_add_ref_button"></span>';
        divEle1.innerHTML += '<br>'
        tooltip.appendChild(divEle1);
    }

    document.getElementById(keyword + "_add_ref_button").onclick = () => addReference(keyword);
    document.getElementById(keyword + "_cancel_add_ref_button").onclick = () => hideAddRefForm(keyword);   
}

async function addReference(keyword) {
    let url = document.getElementById(keyword + "_add_ref_url_input");
    let description = document.getElementById(keyword + "_add_ref_desc_input");
    let payload = {};
    payload.keyword = keyword.toLowerCase();
    payload.url = url.value;
    payload.description = description.value;
    await fetch("http://localhost:3456/reference/add", { method: "post", body: JSON.stringify(payload), ...options }).catch(err=>console.log(err));
    refreshTooltip(keyword);
}

function showAddRefForm(keyword) {
    let addRefForm = document.getElementById(keyword + "_add_ref_form");
    let showAddRefFormButton = document.getElementById(keyword + "_show_add_ref_form_button");
    
    if (addRefForm && addRefForm.classList.contains(["ext_display_none"])) {
        addRefForm.classList.remove(["ext_display_none"]);
    } else {return;}

    if (showAddRefFormButton && !showAddRefFormButton.classList.contains(["ext_display_none"])) {
        showAddRefFormButton.classList.add(["ext_display_none"]);
    }
}

function hideAddRefForm(keyword) {
    let addRefForm = document.getElementById(keyword + "_add_ref_form");
    let showAddRefFormButton = document.getElementById(keyword + "_show_add_ref_form_button");

    if (addRefForm && !addRefForm.classList.contains(["ext_display_none"])) {
        addRefForm.classList.add(["ext_display_none"]);
    } else {return;}

    if (showAddRefFormButton && showAddRefFormButton.classList.contains(["ext_display_none"])) {
        showAddRefFormButton.classList.remove(["ext_display_none"]);
    }
}

async function editReference(keyword, index) {
    let editRefId = keyword + "_ref_refId_input_" + index;
    let editDescId = keyword + "_ref_des_input_" + index;
    let editUrlId = keyword + "_ref_url_input_" + index;
    
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
    let refEleId = keyword + "_ref_refId_" + index;
    let refIdDiv = document.getElementById(refEleId);
    let refId = refIdDiv.innerText;
    let payload = {keyword, refId};
    await fetch("http://localhost:3456/reference/remove", { method: "post", body: JSON.stringify(payload), ...options }).catch(err=>console.log(err));
    refreshTooltip(keyword);
}

function openEditForm(keyword, index, reference) {
    let refEleId = keyword + "_ref_item_" + index;
    let refEditId = keyword + "_ref_edit_form_" + index;
    let refItem = document.getElementById(refEleId);
    let editForm = document.getElementById(refEditId);
    if (editForm && editForm.classList.contains("ext_display_none")) {
        editForm.classList.remove(["ext_display_none"]);
    }
    if (refItem && !refItem.classList.contains("ext_display_none")) {
        refItem.classList.add(["ext_display_none"]);
    }
    let editDescId = keyword + "_ref_des_input_" + index;
    let editUrlId = keyword + "_ref_url_input_" + index;
    let desc_input = document.getElementById(editDescId);
    let url_input = document.getElementById(editUrlId);
    if (reference && reference.description)
        desc_input.setAttribute("value", reference.description);
    if (reference && reference.url) {
        url_input.setAttribute("value", reference.url);
    }
}

function hideEditForm(keyword, index) {
    let refId = keyword + "_ref_item_" + index;
    let refEditId = keyword + "_ref_edit_form_" + index;
    let refItem = document.getElementById(refId);
    let editForm = document.getElementById(refEditId);
    if (editForm && !editForm.classList.contains("ext_display_none")) {
        editForm.classList.add(["ext_display_none"]);
    }
    if (refItem && refItem.classList.contains("ext_display_none")) {
        refItem.classList.remove(["ext_display_none"]);
    }
}




function createTooltip() {
    let tooltip = document.createElement('div');
    tooltip.id = tooltipId;
    tooltip.style.display = "none";
    tooltip.className = "animate__animated animate__lightSpeedInRight";
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
