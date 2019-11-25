browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message === "COOKIES") {
        sendResponse(document.cookie)
    }

    if (message === "LS") {
        sendResponse(localStorage)
    }
})

