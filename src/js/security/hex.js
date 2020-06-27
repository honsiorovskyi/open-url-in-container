/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const hexEncodeArray = [
    '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f',
]

const hexDecodeMap = {
    '0': 0,
    '1': 1,
    '2': 2,
    '3': 3,
    '4': 4,
    '5': 5,
    '6': 6,
    '7': 7,
    '8': 8,
    '9': 9,
    'a': 0xa,
    'b': 0xb,
    'c': 0xc,
    'd': 0xd,
    'e': 0xe,
    'f': 0xf,
}

export function hex2array(hex) {
    if (hex.length % 2 === 1) {
        throw new Error('invalid hex string length')
    }

    const lHex = hex.toLowerCase()
    let arr = new Uint8Array(hex.length / 2)

    for (let i = 0; i < lHex.length; i += 2) {
        const hi = hexDecodeMap[lHex[i]]
        const lo = hexDecodeMap[lHex[i+1]]
        if (hi === undefined || lo === undefined) {
            throw new Error('invalid character in hex string')
        }
        arr[i / 2] = hi << 4 | lo
    }

    return arr
}

export function array2hex(arr) {
    var s = ''
    const uintArr = new Uint8Array(arr)
    for (var i = 0; i < uintArr.length; i++) {
        var code = uintArr[i]
        s += hexEncodeArray[code >>> 4]
        s += hexEncodeArray[code & 0x0F]
    }
    return s
}