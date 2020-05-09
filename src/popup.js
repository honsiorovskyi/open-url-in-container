const LINK_PARENT_ELEMENT_ID = 'link'
const LINK_ELEMENT_ID = 'link-a'

const CONTAINER_ELEMENT_ID = 'container'

const COMMAND_ELEMENT_ID = 'command-input'

const BOOKMARK_CONFIRMATION_ID = 'bookmark-confirmation'
const BOOKMARK_CONFIRMATION_CONFIRM_ID = 'bookmark-confirmation-confirm'
const BOOKMARK_CONFIRMATION_CANCEL_ID = 'bookmark-confirmation-cancel'

const FAVICON_PARAM_NAME = 'favIconUrl'

async function getCurrentTab() {
    return (await browser.tabs.query({
        active: true,
        windowId: browser.windows.WINDOW_ID_CURRENT
    }))[0]
}

function createLink(favIconUrl, title, url, callback) {
    let link = document.createElement('A')
    link.id = LINK_ELEMENT_ID
    link.href = url

    let linkIcon = document.createElement('IMG')
    linkIcon.src = favIconUrl
    link.appendChild(linkIcon)

    let linkSpan = document.createElement('SPAN')
    let linkText = document.createTextNode(title)
    linkSpan.appendChild(linkText)
    link.appendChild(linkSpan)

    link.onclick = callback

    document.getElementById(LINK_PARENT_ELEMENT_ID)
        .replaceChild(link, document.getElementById(LINK_ELEMENT_ID))
}

function createContainerOptions(containers, callback) {
    let parent = document.getElementById(CONTAINER_ELEMENT_ID)
    for (var i=0; i < containers.length; i++) {
        let option = document.createElement('OPTION')
        option.value = containers[i].cookieStoreId
        
        let optionName = document.createTextNode(containers[i].name)
        option.appendChild(optionName)

        parent.appendChild(option)
    }

    parent.onchange = function(e) {
        callback(e.target.value, e.target.selectedOptions[0].textContent)
    }
}

function hideBookmarkConfirmation() {
    document.getElementById(BOOKMARK_CONFIRMATION_ID).classList.add('hidden')
    document.getElementById(BOOKMARK_CONFIRMATION_CANCEL_ID).onclick = null
    document.getElementById(BOOKMARK_CONFIRMATION_CONFIRM_ID).onclick = null
}

function showBookmarkConfirmation(title, url) {
    document.getElementById(BOOKMARK_CONFIRMATION_ID).classList.remove('hidden')
    document.getElementById(BOOKMARK_CONFIRMATION_CANCEL_ID).onclick = hideBookmarkConfirmation
    document.getElementById(BOOKMARK_CONFIRMATION_CONFIRM_ID).onclick = async function() {
        hideBookmarkConfirmation()
        console.log('creating bookmark', title, url)
        await browser.bookmarks.create({
            title: title,
            url: url,
        })
    }
}

async function updateLinks(containerId, containerName) {
    console.log(containerId, containerName)
    let tab = await getCurrentTab()
    let params = new URLSearchParams()
    params.set(FAVICON_PARAM_NAME, tab.favIconUrl)

    let url = browser.runtime.getURL(`/opener.html?${params.toString()}#ext+container:name=${containerName}&url=${tab.url}`)

    createLink(tab.favIconUrl, tab.title, url, function(e) {
        e.preventDefault()
        showBookmarkConfirmation(`[${containerName}] ${tab.title}`, url)
    })

    let cmd = `firefox-container --name '${containerName}' --url '${tab.url}' --yellow`
    document.getElementById(COMMAND_ELEMENT_ID).value = cmd
}

async function main() {
    let containers = await browser.contextualIdentities.query({})

    createContainerOptions(containers, updateLinks)
    updateLinks(containers[0].cookieStoreId, containers[0].name)
}

main()