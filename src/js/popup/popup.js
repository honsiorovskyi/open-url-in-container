/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import {
    getSigningKey,
    saveState,
    restoreState,
    CONTAINER_SELECTOR_STATE,
} from '../config.js'

import { State } from '../state.js'
import { hide, show } from '../dom.js'
import { getActiveTab } from '../tabs.js'
import { Params } from '../params.js'

import { updateBookmarkLink, updateBookmarkConfirmation } from './bookmark.js'
import { updateURL } from './url.js'
import { updateTerminalCommand } from './terminal.js'
import { updateSignatureCommand } from './signature.js'
import { setupFolderFolding } from './folders.js'
import { updateContainerSelector, updateContainerOptions, setupContainerSelector } from './containers.js'

async function updateLinks(containers, containerState) {
    const selectedContainer = containers.find(c => c.cookieStoreId === containerState.selectedContainerId)

    const tab = await getActiveTab()
    const params = new Params({
        id: containerState.useContainerId ? selectedContainer.cookieStoreId : undefined,
        name: containerState.useContainerName ? selectedContainer.name : undefined,
        url: tab.url,
    })

    const signingKey = await getSigningKey()
    console.log(signingKey)
    await params.sign(signingKey)
    console.log(params.toString())

    updateBookmarkLink(tab, params)
    updateBookmarkConfirmation(tab, selectedContainer.name)
    updateURL(params)
    updateTerminalCommand(params)
    updateSignatureCommand(params)
}

async function main() {
    // get containers
    const containers = await browser.contextualIdentities.query({})

    const restoredContainerState = await restoreState(CONTAINER_SELECTOR_STATE, {
        selectedContainerId: null,
        useContainerId: true,
        useContainerName: false,
    })

    const initialContainerState = {
        ...restoredContainerState,
        ...{
            // ensure that previously selected container still exists
            selectedContainerId: containers.find(c => c.cookieStoreId === restoredContainerState.selectedContainerId) ?
                restoredContainerState.selectedContainerId : containers[0].cookieStoreId
        }
    }

    // create container state manager
    const containerStateManager = new State(initialContainerState, function ({ newState }) {
        updateLinks(containers, newState)
        updateContainerOptions(newState)
        saveState(CONTAINER_SELECTOR_STATE, newState)
    })

    // update container select & links & commands
    updateContainerSelector(containers, initialContainerState)
    updateLinks(containers, initialContainerState)

    // setup container selector
    setupContainerSelector(containers, containerStateManager)

    // setup folders & display the UI
    setupFolderFolding()

    hide('loader')
    show('mainContainer')
}

main()