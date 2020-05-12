/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { el } from '../dom.js'

const TERMINAL_INPUT_ID = 'terminalInput'

export function updateTerminalCommand(tab, containerProps, signature) {
    let propParams = []
    if (containerProps.id) {
        propParams.push(`--id '${containerProps.id}'`)
    }

    if (containerProps.name) {
        propParams.push(`--name '${containerProps.name}'`)
    }

    el(TERMINAL_INPUT_ID).value = `firefox-container ${propParams.join(' ')} --signature '${signature}' '${tab.url}'`
}