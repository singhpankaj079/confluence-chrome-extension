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
async function x() {
    let [tab] = await chrome.tabs.query({active: true, currentWindow: true});
    chrome.scripting.executeScript({
    target: {tabId: tab.id},
    function: addOnSelect,
    });
}

x();
async function addOnSelect() {
    document.addEventListener('mouseup', event => {  
        if(window.getSelection().toString().length){
           let exactText = window.getSelection().toString();        
           alert(exactText);
        }
    });
}


function setPageBackgroundColor(color) {
    // chrome.storage.sync.get("color", ({color}) => {
        console.log("clicked");
        document.body.style.backgroundColor = color;
        // chrome.storage.sync.set({color: color});
        // setTimeout(()=> {chrome.storage.sync.set({color: "yellow"});}, 5000);
    // });
}