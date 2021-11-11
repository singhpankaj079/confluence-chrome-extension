// Initialize button with user's preferred color
let changeColor = document.getElementById("changeColor");
let addButton = document.getElementById("add");
let deleteButton = document.getElementById("delete");
chrome.storage.sync.get("color", ({color}) => {
  console.log("color : " + color);
  changeColor.style.backgroundColor = color;
});

addButton.addEventListener("click", async () => {
    let [tab] = await chrome.tabs.query({active: true, currentWindow: true});
    // console.log("before action");
    let question = document.getElementById("question").value;
    let data = document.getElementById("data").value;
    addAnswer(question, data);
    // console.log("after action");
});
deleteButton.addEventListener("click", async () => {
    let [tab] = await chrome.tabs.query({active: true, currentWindow: true});
    // console.log("before action");
    let question = document.getElementById("question").value;
    let data = document.getElementById("data").value;
    deleteAnswer(question, data);
    // console.log("after action");
});
changeColor.addEventListener("click", async () => {
    let [tab] = await chrome.tabs.query({active: true, currentWindow: true});
    // console.log("before action");
    let color = document.getElementById("exinput").value;
    console.log(color);
    chrome.scripting.executeScript({
        target: {tabId: tab.id},
        function: setPageBackgroundColor,
        args: [color],
    });
    // console.log("after action");
});
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

function deleteAnswer(question, data) {
    let payload = {"question": question, "data": data};
    return fetch('http://localhost:1234/questions/deleteAnswer', {
     
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
// async function x() {
//     let [tab] = await chrome.tabs.query({active: true, currentWindow: true});
//     chrome.scripting.executeScript({
//     target: {tabId: tab.id},
//     function: addOnSelect,
//     });
// }

// x();
// async function addOnSelect() {
//     document.addEventListener('mouseup', event => {  
//         let tooltip = document.getElementById("tooltip");
//         if (tooltip == null) {
//             tooltip = document.createElement('div');
//             tooltip.id = "tooltip";
//             tooltip.style.position = "absolute";
//             tooltip.style.zIndex = "100";
//             tooltip.style.background = "white";
//             tooltip.style.padding = "12px";
//             tooltip.style.minHeight = "300px";
//             tooltip.style.width = "300px";
//             tooltip.style.border = "1px solid black";
//             document.body.appendChild(tooltip);
//         }
//         if(window.getSelection().toString().length) {
//            let exactText = window.getSelection().toString();        
//            tooltip.style.display = "block";
//            tooltip.innerText = exactText;  
//            tooltip.style.left = event.pageX + "px";
//             tooltip.style.top = event.pageY + "px";         
//             event.stopImmediatePropagation();
//         } else {
//             tooltip.style.display = "none";
//         }
//     });
// }

function setPageBackgroundColor(color) {
    // chrome.storage.sync.get("color", ({color}) => {
        console.log("clicked");
        document.body.style.backgroundColor = color;
        // chrome.storage.sync.set({color: color});
        // setTimeout(()=> {chrome.storage.sync.set({color: "yellow"});}, 5000);
    // });
}