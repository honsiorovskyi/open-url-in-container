/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import {
    getSigningKey,
    getMostRecentlyUsedContainerId,
    setMostRecentlyUsedContainerId,
} from '../config.js'

import { hide, show } from '../dom.js'
import { getActiveTab } from '../tabs.js'
import { generateSignature } from '../security.js'

import { updateBookmarkLink } from './bookmark.js'
import { updateTerminalCommand } from './terminal.js'
import { updateSignatureCommand } from './signature.js'
import { setupFolderFolding } from './folders.js'
import { updateContainerList, setupContainerChangeListener } from './containers.js'

async function updateLinks(containerId, containerName) {
    const tab = await getActiveTab()
    const signingKey = await getSigningKey()
    const signature = await generateSignature({ key: signingKey }, { name: containerName })

    updateBookmarkLink(tab, containerName, signature)
    updateTerminalCommand(tab, containerName, signature)
    updateSignatureCommand(signature)
}

async function main() {
    // get containers
    const containers = await browser.contextualIdentities.query({})
    const mostRecentlyUsedContainerId = await getMostRecentlyUsedContainerId()

    const selectedContainer = containers.filter(c =>
        c.cookieStoreId === mostRecentlyUsedContainerId
    )[0] || containers[0]

    // update container select & links & commands
    updateContainerList(containers, selectedContainer)
    updateLinks(selectedContainer.cookieStoreId, selectedContainer.name)

    // setup container change callback
    setupContainerChangeListener(containers, function (containerId, containerName) {
        updateLinks(containerId, containerName)
        setMostRecentlyUsedContainerId(containerId)
    })

    // setup folders & display the UI
    setupFolderFolding()

    hide('loader')
    show('mainContainer')
}

main()