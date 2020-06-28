/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { toggle, hide, el } from './dom.js'
import { getActiveTab } from '../tabs.js'

const LINK_PARENT_ELEMENT_ID = 'link'
const LINK_ELEMENT_ID = 'link-a'

const BOOKMARK_BUTTON = 'bookmark-a'

const BOOKMARK_CONFIRMATION_ID = 'bookmark-confirmation'
const BOOKMARK_CONFIRMATION_CONFIRM_ID = 'bookmark-confirmation-confirm'
const BOOKMARK_CONFIRMATION_CANCEL_ID = 'bookmark-confirmation-cancel'

function bookmarkUrl(tab, qs) {
    const bookmarkQS = new URLSearchParams({'favIconUrl': tab.favIconUrl})
    const encodedHash = encodeURIComponent(`ext+container:${qs.toString()}`)
    return browser.runtime.getURL(`/opener.html?${bookmarkQS.toString()}#${encodedHash}`)
}

function findBookmark(url) {
    return browser.bookmarks.search({
        url: url,
    })
}

function refreshBookmarks(url) {
    var existingBookmarks = findBookmark(url)

    existingBookmarks.then(b => {
        console.log(b)
    })

    existingBookmarks.then(bookmarks => {
        if (bookmarks.length > 0) {
            el(BOOKMARK_BUTTON).classList.add('created')
        } else {
            el(BOOKMARK_BUTTON).classList.remove('created')
        }
    })

    return existingBookmarks
}

export function updateBookmarkLink(tab, qs) {
    const url = bookmarkUrl(tab, qs)
    
    // link element
    const link = document.createElement('A')
    link.id = LINK_ELEMENT_ID
    link.href = url

    const linkIcon = document.createElement('IMG')
    linkIcon.src = tab.favIconUrl
    link.appendChild(linkIcon)

    const linkSpan = document.createElement('SPAN')
    const linkText = document.createTextNode(tab.title)
    linkSpan.appendChild(linkText)
    link.appendChild(linkSpan)

    link.onclick = async e => {
        e.preventDefault()
        browser.tabs.create({
            url: url,
            index: (await getActiveTab()).index + 1,
        })
    }

    el(LINK_PARENT_ELEMENT_ID)
        .replaceChild(link, el(LINK_ELEMENT_ID))

    // bookmark button
    refreshBookmarks(url)

    var createdBookmark = null
    el(BOOKMARK_BUTTON).onclick = () => {
        if (createdBookmark) {
            const bookmarkID = createdBookmark.id

            createdBookmark = null
            browser.bookmarks.remove(bookmarkID)
                .then(refreshBookmarks.bind(this, url))
            return
        }

        refreshBookmarks(url).then(async existingBookmarks => {
            if (existingBookmarks.length == 0) {
                createdBookmark = await browser.bookmarks.create({
                    title: `${tab.title}`,
                    url: bookmarkUrl(tab, qs),
                })
                refreshBookmarks(url)
            }
        })
    }
}

export function updateBookmarkConfirmation(tab, qs, containerName) {
    el(BOOKMARK_CONFIRMATION_CANCEL_ID).onclick = function () { hide(BOOKMARK_CONFIRMATION_ID) }
    el(BOOKMARK_CONFIRMATION_CONFIRM_ID).onclick = async function () {
        hide(BOOKMARK_CONFIRMATION_ID)
        await browser.bookmarks.create({
            title: `[${containerName}] ${tab.title}`,
            url: bookmarkUrl(tab, qs),
        })
    }
}