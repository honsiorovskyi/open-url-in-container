/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { toggle, hide, el } from '../dom.js'

const LINK_PARENT_ELEMENT_ID = 'link'
const LINK_ELEMENT_ID = 'link-a'

const BOOKMARK_CONFIRMATION_ID = 'bookmark-confirmation'
const BOOKMARK_CONFIRMATION_CONFIRM_ID = 'bookmark-confirmation-confirm'
const BOOKMARK_CONFIRMATION_CANCEL_ID = 'bookmark-confirmation-cancel'

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

    el(LINK_PARENT_ELEMENT_ID)
        .replaceChild(link, el(LINK_ELEMENT_ID))
}

function updateBookmarkConfirmation(bookmarkTitle, url) {
    el(BOOKMARK_CONFIRMATION_CANCEL_ID).onclick = function () { hide(BOOKMARK_CONFIRMATION_ID) }
    el(BOOKMARK_CONFIRMATION_CONFIRM_ID).onclick = async function () {
        hide(BOOKMARK_CONFIRMATION_ID)
        await browser.bookmarks.create({
            title: bookmarkTitle,
            url: url,
        })
    }
}

export function updateBookmarkLink(tab, containerName, signature) {
    const qs = new URLSearchParams()
    qs.set('favIconUrl', tab.favIconUrl)

    const hashQs = new URLSearchParams()
    hashQs.set('name', containerName)
    hashQs.set('url', tab.url)
    hashQs.set('signature', signature)

    const encodedHash = encodeURIComponent(`ext+container:${hashQs.toString()}`)
    const url = browser.runtime.getURL(`/opener.html?${qs.toString()}#${encodedHash}`)

    createLink(tab.favIconUrl, tab.title, url, function (e) {
        e.preventDefault()
        toggle(BOOKMARK_CONFIRMATION_ID)
    })

    updateBookmarkConfirmation(`[${containerName}] ${tab.title}`, url)
}