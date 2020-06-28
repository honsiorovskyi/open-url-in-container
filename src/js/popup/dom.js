/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

export function hide(id) {
    document.getElementById(id).classList.add('hidden')
}

export function show(id) {
    document.getElementById(id).classList.remove('hidden')
}

export function toggle(id) {
    document.getElementById(id).classList.toggle('hidden')
}

export function el(id) {
    return document.getElementById(id)
}