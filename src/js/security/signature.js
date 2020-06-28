/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { importKey } from './keys.js'
import { hex2array, array2hex } from './hex.js'

export async function verifySignature(rawHexKey, signature, data) {
    const key = await importKey(rawHexKey)
    const signatureArray = hex2array(signature)
    const dataArray = new TextEncoder().encode(data)
    return await window.crypto.subtle.verify('HMAC', key, signatureArray, dataArray)
}

export async function generateSignature(rawHexKey, data) {
    const key = await importKey(rawHexKey)
    const encoder = new TextEncoder()
    const dataArray = encoder.encode(data)
    const signatureArray = await window.crypto.subtle.sign('HMAC', key, dataArray)
    return array2hex(signatureArray)
}