
// async function x() {
//     let [tab] = await chrome.tabs.query({active: true, currentWindow: true});
//     chrome.scripting.executeScript({
//     target: {tabId: tab.id},
//     function: addOnSelect,
//     });
// }

// x();
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
        let tooltip = document.getElementById("tooltip");
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
    tooltip.style.display = "block";
    let h2 = document.createElement("h2");
    h2.innerText = "Keyword:- " + selectedText;
    h2.style.textAlign = "center";
    h2.style.color = "purple";
    tooltip.innerText = "";
    tooltip.appendChild(h2);
    tooltip.style.left = pageX + "px";
    tooltip.style.top = pageY + "px";
    addLinksToTooltip(tooltip, linkText);
    
}

function addLinksToTooltip(tooltip, linkText) {
    for (var temp=0;temp<linkText.length;temp++) {
        let link = document.createElement('a');
        link.href = linkText[temp];
        link.appendChild(document.createTextNode(linkText[temp]));
        let divEle = document.createElement('div');
        divEle.appendChild(link);
        link.appendChild(document.createElement("hr"));                
        tooltip.appendChild(divEle);
    }
}

function createTooltip() {
    let tooltip = document.createElement('div');
    tooltip.id = "tooltip";
    tooltip.className = "animate__animated animate__lightSpeedInRight";
    // tooltip.classList.add(["animate__animated animate__bounce"]);
    tooltip.onclick = function(e) {
        e.stopImmediatePropagation();
    }
    document.body.appendChild(tooltip);
    return tooltip;
}

addOnSelect();
