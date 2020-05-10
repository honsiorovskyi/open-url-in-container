/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

export async function sha256(value) {
    const encoder = new TextEncoder()
    const data = encoder.encode(value)
    const hashBuffer = await crypto.subtle.digest('SHA-256', data)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
    return hashHex
}

function serializeData(id, name, key) {
    return `${id || ''}${name || ''}${key}`
}

export async function verifySignature({ key }, { signature, id, name }) {
    if (!key) {
        throw new Error('key cannot be empty')
    }

    const digest = await sha256(serializeData(id, name, key))
    if (digest === signature) {
        return true
    }

    return false
}

export function generateSignature({ key }, { id, name }) {
    if (!key) {
        throw new Error('key cannot be empty')
    }

    return sha256(serializeData(id, name, key))
}

export function generateKey() {
    var byteArray = new Uint8Array(24)
    crypto.getRandomValues(byteArray)
    const byteString = String.fromCharCode(...byteArray)
    return btoa(byteString)
}