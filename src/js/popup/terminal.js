/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { el } from './dom.js'

const TERMINAL_INPUT_ID = 'terminalInput'

export function updateTerminalCommand(params, signature) {
    let propParams = []
    if (params.id) {
        propParams.push(`--id '${params.id}'`)
    }

    if (params.name) {
        propParams.push(`--name '${params.name}'`)
    }

    el(TERMINAL_INPUT_ID).value = `firefox-container ${propParams.join(' ')} --signature '${signature}' '${params.url}'`
}