let blockedDomainsContainer
let blockedDomainsButton
let cookiesContainer
let cookiesButton
let lsContainer
let lsButton

let sets = {}
let cookies = []

browser.runtime.onMessage.addListener((message) => {
    sets = message.sets
})

window.addEventListener('DOMContentLoaded', (event) => {
    const coll = document.getElementsByClassName("collapsible");
    blockedDomainsContainer = document.getElementById('blocked-domains')
    blockedDomainsButton = document.getElementById('blocked-domains-btn')
    cookiesContainer = document.getElementById('cookies')
    cookiesButton = document.getElementById('cookies-btn')
    lsContainer = document.getElementById('ls')
    lsButton = document.getElementById('ls-btn')

    for (let i = 0; i < coll.length; i++) {
        coll[i].addEventListener("click", function() {
          this.classList.toggle("active");
          var content = this.nextElementSibling;
          if (content.style.display === "block") {
            content.style.display = "none";
          } else {
            content.style.display = "block";
          }
        })
    }
})

function handleActivated(tabId, changeInfo, tabInfo) {
    if (tabInfo.url && sets[tabInfo.url]) {
        blockedDomainsContainer.innerHTML = ''
        sets[tabInfo.url].forEach((url) => {
            blockedDomainsContainer.innerHTML += `<span>${url}</span><br>`
        })
        blockedDomainsButton.innerText = `External URLs (${sets[tabInfo.url].size})`
    }
}

browser.tabs.onUpdated.addListener(handleActivated)

browser.tabs.query({currentWindow: true, active: true}).then(tabs => {
    if (tabs[0]) {
        browser.runtime.sendMessage('LIST').then(savedSets => {
            sets = savedSets
            blockedDomainsContainer.innerHTML = ''
            
            sets[tabs[0].url].forEach((url) => {
                blockedDomainsContainer.innerHTML += `<span>${url}</span><br>`
            })
            blockedDomainsButton.innerText = `External URLs (${sets[tabs[0].url].size})`
        })

        browser.tabs.sendMessage(tabs[0].id, "COOKIES").then(c => {
            cookies = c.split(';').map(item => item.split("="))
            cookiesContainer.innerHTML = ''
            cookies.forEach(cookie => {
                cookiesContainer.innerHTML += `<span>${cookie[0]} : ${cookie[1]}</span><br>`
            })
            cookiesButton.innerText = `Cookies (${cookies.length})`
        })

        browser.tabs.sendMessage(tabs[0].id, "LS").then(ls => {
            lsContainer.innerHTML = ''
            for ([k,v] of Object.entries(ls)) {
                lsContainer.innerHTML += `<span>${k} : ${v}</span><br>`
            }
            
            lsButton.innerText = `Local Storage (${lsContainer.children.length})`
        })

    }
})


