/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { el } from './dom.js'

const LINK_ELEMENT = 'linkElement'
const LINK_ICON = 'linkIcon'
const LINK_TITLE = 'linkTitle'

const BOOKMARK_BUTTON = 'bookmarkButton'

function bookmarkUrl(tab, qs) {
    const bookmarkQS = new URLSearchParams({ 'favIconUrl': tab.favIconUrl })
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

function toggleBookmark(url, title) {
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

export function updateBookmarkLink(tab, qs, containerName) {
    const url = bookmarkUrl(tab, qs)
    const title = `[${containerName}] ${tab.title}`

    // link element
    el(LINK_ELEMENT).href = url
    el(LINK_ICON).style.backgroundImage = `url(${tab.favIconUrl})`
    el(LINK_TITLE).textContent = tab.title

    el(LINK_ELEMENT).onclick = e => {
        e.preventDefault()
        toggleBookmark(url, title)
    }

    // drag & drop handling
    el(LINK_ELEMENT).onmouseenter = e => {
        e.target.classList.add('hovered')
    }

    el(LINK_ELEMENT).onmouseleave = e => {
        e.target.classList.remove('hovered')
    }

    el(LINK_ELEMENT).ondragstart = e => {
        e.target.classList.remove('hovered')
        e.target.classList.add('dragged')
    }

    el(LINK_ELEMENT).ondragend = e => {
        e.target.classList.remove('dragged')
    }

    // bookmark button
    refreshBookmarks(url, title)

    el(BOOKMARK_BUTTON).onclick = e => {
        e.preventDefault()
        toggleBookmark(url, title)
    }
}