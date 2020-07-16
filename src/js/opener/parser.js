/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import {
    sanitizeURLSearchParams,
    required,
    url,
    integer,
    boolean,
    atLeastOneRequired,
    oneOfOrEmpty,
} from './validator.js'

const customProtocolPrefix = 'ext+container:'

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
    // signature
    signature: [],

    // container params
    id: [],
    name: [],
    color: [oneOfOrEmpty(allowedContainerColors)],
    icon: [oneOfOrEmpty(allowedContainerIcons)],

    // url params
    url: [required, url],
    index: [integer],
    pinned: [boolean],
    openInReaderMode: [boolean],

    // global validators
    __validators: [atLeastOneRequired(['id', 'name'])],
}

export function parseOpenerParams(rawHash) {
    if (rawHash[0] != '#') {
        throw new Error('not a valid location hash')
    }

    const uri = decodeURIComponent(rawHash.substring(1))

    if (!uri.startsWith(customProtocolPrefix)) {
        throw new Error('unknown URI protocol')
    }

    const qs = new URLSearchParams(uri.substring(customProtocolPrefix.length))
    
    return sanitizeURLSearchParams(qs, openerParamsSchema)
}
