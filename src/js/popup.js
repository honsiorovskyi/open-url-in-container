/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { getSigningKey } from './config.js'
import { generateSignature } from './security.js'

const LINK_PARENT_ELEMENT_ID = 'link'
const LINK_ELEMENT_ID = 'link-a'

const CONTAINER_ELEMENT_ID = 'container'

const COMMAND_ELEMENT_ID = 'command-input'

const BOOKMARK_CONFIRMATION_ID = 'bookmark-confirmation'
const BOOKMARK_CONFIRMATION_CONFIRM_ID = 'bookmark-confirmation-confirm'
const BOOKMARK_CONFIRMATION_CANCEL_ID = 'bookmark-confirmation-cancel'

async function getCurrentTab() {
    return (await browser.tabs.query({
        active: true,
        windowId: browser.windows.WINDOW_ID_CURRENT
    }))[0]
}

function createLink(favIconUrl, title, url, callback) {
    const link = document.createElement('A')
    link.id = LINK_ELEMENT_ID
    link.href = url

    const linkIcon = document.createElement('IMG')
    linkIcon.src = favIconUrl
    link.appendChild(linkIcon)

    const linkSpan = document.createElement('SPAN')
    const linkText = document.createTextNode(title)
    linkSpan.appendChild(linkText)
    link.appendChild(linkSpan)

    link.onclick = callback

    document.getElementById(LINK_PARENT_ELEMENT_ID)
        .replaceChild(link, document.getElementById(LINK_ELEMENT_ID))
}

function createContainerOptions(containers, callback) {
    const parent = document.getElementById(CONTAINER_ELEMENT_ID)
    for (var i=0; i < containers.length; i++) {
        const option = document.createElement('OPTION')
        option.value = containers[i].cookieStoreId
        
        const optionName = document.createTextNode(containers[i].name)
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
        await browser.bookmarks.create({
            title: title,
            url: url,
        })
    }
}

async function updateLinks(containerId, containerName) {
    const tab = await getCurrentTab()
    const qs = new URLSearchParams()
    qs.set('favIconUrl', tab.favIconUrl)

    const signingKey = await getSigningKey()
    const signature = await generateSignature({key: signingKey}, {name: containerName})

    const hashQs = new URLSearchParams()
    hashQs.set('name', containerName)
    hashQs.set('url', tab.url)
    hashQs.set('signature', signature)

    const encodedHash = encodeURIComponent(`ext+container:${hashQs.toString()}`)
    const url = browser.runtime.getURL(`/opener.html?${qs.toString()}#${encodedHash}`)

    createLink(tab.favIconUrl, tab.title, url, function(e) {
        e.preventDefault()
        showBookmarkConfirmation(`[${containerName}] ${tab.title}`, url)
    })

    const cmd = `firefox-container --name '${containerName}' --signature '${signature}' '${tab.url}'`
    document.getElementById(COMMAND_ELEMENT_ID).value = cmd
}

async function main() {
    const containers = await browser.contextualIdentities.query({})

    createContainerOptions(containers, updateLinks)
    updateLinks(containers[0].cookieStoreId, containers[0].name)
}

main()