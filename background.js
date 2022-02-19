let color = 'green';

chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.set({ color });
    console.log('Default color set to green');
});

// chrome.contextMenus.create({
//     "title": "show references",
//     "onclick": function() {
//         console.log("not added")
//     },
//     "contexts": ["selection"] 
// })




