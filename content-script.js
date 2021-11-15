
// async function x() {
//     let [tab] = await chrome.tabs.query({active: true, currentWindow: true});
//     chrome.scripting.executeScript({
//     target: {tabId: tab.id},
//     function: addOnSelect,
//     });
// }

// x();
let tooltipId = "__tooltip__";
let options = {headers: {
    "Access-Control-Allow-Origin": "*"
    }};
function fetchAnswers(key) {
    return fetch('http://localhost:1234/questions/' + key, options).then(response => response.json());
    // return fetch('http://localhost:1234/questions/' + key, {mode: "no-cors", headers: {'Accept': 'application/json','Content-Type': 'application/json'}});
}

function addAnswer(question, data) {
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
           fetchAnswers(exactText)
           .then(json => {console.log(json); updateTooltip(tooltip, exactText, json.data.split('|#|'), event.pageX, event.pageY);});
        }
        //    .then(res => res.json()).then(data=>data).catch(err=>console.log(err));
        //    .then(data => {console.log(data);updateTooltip(tooltip, exactText, JSON.parse(data).questions, event.pageX, event.pageY); return data;})
        //    .catch(err => console.log(err));
         else {
            tooltip.style.display = "none";
        }
    });
}

function updateTooltip(tooltip, selectedText, linkText, pageX, pageY) {    
    let h2 = document.createElement("h2");
    h2.innerText = "Keyword:- " + selectedText;
    h2.style.textAlign = "center";
    h2.style.color = "purple";
    tooltip.innerText = "";
    tooltip.appendChild(h2);
    tooltip.style.left = pageX + "px";
    tooltip.style.top = pageY + "px";
    addLinksToTooltip(tooltip, linkText);
    tooltip.style.display = "block";
    
}

function addLinksToTooltip(tooltip, linkText) {
    let divEle1 = document.createElement('div');
    let divEle2 = document.createElement('div');
    let h2 = document.createElement("h2");
    h2.innerText = "Q & A";
    divEle2.appendChild(h2);
    console.log(linkText);
    for (var temp=0;temp<linkText.length;temp++) {
        if (linkText[temp].indexOf("|##|") > -1) {
            let [faq, answer] = linkText[temp].split("|##|");
            let faqdiv = document.createElement('div');
            faqdiv.innerText = faq;
            let ansdiv = document.createElement('div');
            ansdiv.innerText = answer;
            let divEle = document.createElement('div');
            divEle.appendChild(faqdiv);
            divEle.appendChild(ansdiv);
            divEle.appendChild(document.createElement("hr"));
            divEle2.appendChild(divEle);
        } else {
            let link = document.createElement('a');
            link.href = linkText[temp];
            link.appendChild(document.createTextNode(linkText[temp]));
            let divEle = document.createElement('div');
            divEle.appendChild(link);
            link.appendChild(document.createElement("hr"));                
            divEle1.appendChild(divEle);
        }
    }
    divEle1.appendChild(document.createElement("br"));
    console.log(divEle1);
    tooltip.appendChild(divEle1);
    tooltip.appendChild(divEle2);
}

function createTooltip() {
    let tooltip = document.createElement('div');
    tooltip.id = tooltipId;
    tooltip.style.display = "none";
    tooltip.className = "animate__animated animate__lightSpeedInRight";
    // tooltip.classList.add(["animate__animated animate__bounce"]);
    tooltip.onclick = function(e) {
        e.stopImmediatePropagation();
    }
    document.body.appendChild(tooltip);
    return tooltip;
}

addOnSelect();
