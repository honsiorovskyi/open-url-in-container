/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { hex2array, array2hex } from './hex.js'

async function exportKey(key) {
    return array2hex(await window.crypto.subtle.exportKey('raw', key))
}

export async function importKey(rawHexKey) {
    const rawKey = hex2array(rawHexKey)
    return await window.crypto.subtle.importKey('raw', rawKey,
        { name: 'HMAC', 'hash': 'SHA-256', length: 256 },
        true,
        ['sign', 'verify']
    )
}

export async function generateKey() {
    return await exportKey(await window.crypto.subtle.generateKey(
        { name: 'HMAC', 'hash': 'SHA-256', length: 256 },
        true,
        ['sign', 'verify']
    ))
}

