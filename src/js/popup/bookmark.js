/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { el } from './dom.js'
import { getActiveTab } from '../tabs.js'

const LINK_PARENT_ELEMENT_ID = 'link'
const LINK_ELEMENT_ID = 'link-a'

const BOOKMARK_BUTTON = 'bookmark-a'

function bookmarkUrl(tab, qs) {
    const bookmarkQS = new URLSearchParams({'favIconUrl': tab.favIconUrl})
    const encodedHash = encodeURIComponent(`ext+container:${qs.toString()}`)
    return browser.runtime.getURL(`/opener.html?${bookmarkQS.toString()}#${encodedHash}`)
}

function refreshBookmarks(url, title) {
    var existingBookmarks = browser.bookmarks.search({
        url: url,
        title: title,
    }).then(bookmarks =>
        bookmarks.filter(b => b.parentId === 'unfiled_____')
    )

    existingBookmarks.then(bookmarks => {
        if (bookmarks.length > 0) {
            el(BOOKMARK_BUTTON).classList.add('exists')
        } else {
            el(BOOKMARK_BUTTON).classList.remove('exists')
        }
    })

    return existingBookmarks
}

export function updateBookmarkLink(tab, qs, containerName) {
    const url = bookmarkUrl(tab, qs)
    const title = `[${containerName}] ${tab.title}`
    
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
    refreshBookmarks(url, title)

    el(BOOKMARK_BUTTON).onclick = () => {
        refreshBookmarks(url, title).then(bookmarksFound => {
            if (bookmarksFound.length == 0) {
                browser.bookmarks.create({
                    title: title,
                    url: url,
                }).then(refreshBookmarks.bind(this, url, title))
            } else {
                bookmarksFound.forEach(b => {
                    browser.bookmarks.remove(b.id)
                        .then(refreshBookmarks.bind(this, url, title))
                })
            }
        })
    }
}