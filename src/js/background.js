/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { generateKey } from './security.js'
import { setSigningKey } from './config.js'

async function handleInstalled() {
    const key = generateKey()
    try {
        await setSigningKey(key)
    } catch (e) {
        console.log(e)
    }
}

browser.runtime.onInstalled.addListener(handleInstalled);