/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import {
    parseQueryString,
    fallback,
    oneOf,
    required,
    url,
    integer,
    boolean,
    atLeastOneRequired,
} from './validator.js'

const bookmarkParamsSchema = {
    favIconUrl: [url],
}

const hashPrefix = '#ext+container:'
const allowedContainerColors = [
    'blue',
    'turquoise',
    'green',
    'yellow',
    'orange',
    'red',
    'pink',
    'purple',
]
const allowedContainerIcons = [
    'fingerprint',
    'briefcase',
    'dollar',
    'cart',
    'circle',
    'gift',
    'vacation',
    'food',
    'fruit',
    'pet',
    'tree',
    'chill',
]


const openerParamsSchema = {
    // container params
    id: [],
    name: [],
    color: [fallback('yellow'), oneOf(allowedContainerColors)],
    icon: [fallback('fingerprint'), oneOf(allowedContainerIcons)],
    signature: [],

    // url params
    url: [required, url],
    index: [integer],
    pinned: [boolean],
    openInReaderMode: [boolean],

    // global validators
    __validators: [atLeastOneRequired(['id', 'name'])],
}

export function parseBookmarkParams(qs) {
    try {
        return parseQueryString(qs, bookmarkParamsSchema)
    } catch (e) {
        return {}
    }
}

export function parseOpenerParams(encodedHash) {
    try {
        const hash = decodeURIComponent(encodedHash)
        if (!hash.startsWith(hashPrefix)) {
            throw ('invalid parameters scheme')
        }

        const queryString = hash.substr(hashPrefix.length)
        return parseQueryString(queryString, openerParamsSchema)
    } catch (e) {
        throw `parsing parameters: ${e}`
    }
}
