
// async function x() {
//     let [tab] = await chrome.tabs.query({active: true, currentWindow: true});
//     chrome.scripting.executeScript({
//     target: {tabId: tab.id},
//     function: addOnSelect,
//     });
// }

// x();
async function fetchAnswers(key) {
    return fetch("http://127.0.0.1:1234/questions/" + key, {mode: "no-cors"});
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
           .then(res => {console.log(res); return res.json()})
           .then(data => {updateTooltip(tooltip, exactText, data.questions, event.pageX, event.pageY); return data;})
           .catch(err => console.log(err));
        } else {
            tooltip.style.display = "none";
        }
    });
}

function updateTooltip(tooltip, selectedText, linkText, pageX, pageY) {
    tooltip.style.display = "block";
    tooltip.innerText = selectedText;  
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
        tooltip.appendChild(divEle);
    }
}

function createTooltip() {
    let tooltip = document.createElement('div');
    tooltip.id = "tooltip";
    tooltip.style.position = "absolute";
    tooltip.style.zIndex = "100";
    tooltip.style.background = "white";
    tooltip.style.padding = "12px";
    tooltip.style.minHeight = "300px";
    tooltip.style.width = "300px";
    tooltip.style.border = "1px solid black";
    tooltip.onclick = function(e) {
        e.stopImmediatePropagation();
    }
    document.body.appendChild(tooltip);
    return tooltip;
}

addOnSelect();
