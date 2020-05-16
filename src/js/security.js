import { hex2array, array2hex } from './hex.js'

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

export async function generateKey() {
    return await exportKey(await window.crypto.subtle.generateKey(
        { name: 'HMAC', 'hash': 'SHA-256', length: 256 },
        true,
        ['sign', 'verify']
    ))
}

export async function importKey(rawHexKey) {
    const rawKey = hex2array(rawHexKey)
    return await window.crypto.subtle.importKey('raw', rawKey,
        { name: 'HMAC', 'hash': 'SHA-256', length: 256 },
        true,
        ['sign', 'verify']
    )
}

export async function exportKey(key) {
    return array2hex(await window.crypto.subtle.exportKey('raw', key))
}

