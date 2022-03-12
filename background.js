chrome.runtime.onInstalled.addListener(() => {
    
});

chrome.contextMenus.create({
    "title": "References and FAQs",
    id: "ext_show_ref_qa_id_1",
    contexts: ["selection"]
})

chrome.contextMenus.onClicked.addListener(function(info) {
    if (info.menuItemId && info.menuItemId === "ext_show_ref_qa_id_1") {
        // console.log("here too");
        chrome.tabs.query({
            active: true, currentWindow: true
        }, (tabs) => {
            chrome.tabs.sendMessage(tabs[0].id, {value: "SHOW_TOOLTIP"});
        })    
        
    }
});






