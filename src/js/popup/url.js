/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { el } from './dom.js'

const URL_INPUT_ID = 'urlInput'

export function updateURL(qs) {
    el(URL_INPUT_ID).value = `ext+container:${qs.toString()}`
}