/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { el } from './dom.js'

const SIGNATURE_INPUT_ID = 'signatureInput'

export function updateSignatureCommand(signature) {
    el(SIGNATURE_INPUT_ID).value = signature
}