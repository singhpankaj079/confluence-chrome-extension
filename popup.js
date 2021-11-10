// Initialize button with user's preferred color
let changeColor = document.getElementById("changeColor");

chrome.storage.sync.get("color", ({color}) => {
  console.log("color : " + color);
  changeColor.style.backgroundColor = color;
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