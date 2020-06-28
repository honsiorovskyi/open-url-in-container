/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { getSigningKey, regenerateSigningKey } from '../config.js'
import { el, toggle, hide } from './dom.js'

const CONTAINER_ELEMENT_ID = 'container'
const CONTAINER_OPTIONS_TOGGLE = 'containerOptionsToggle'
const CONTAINER_OPTIONS = 'containerOptions'
const USE_HOSTNAME_FOR_CONTAINER_NAME = 'useHostnameForContainerName'
const USE_CONTAINER_ID = 'useContainerId'
const USE_CONTAINER_NAME = 'useContainerName'
const SIGNING_KEY_TOGGLE = 'toggleSigningKey'
const SIGNING_KEY_CONTAINER = 'signingKeyContainer'
const SIGNING_KEY = 'signingKey'
const REGENERATE_SIGNING_KEY = 'regenerateSigningKey'
const SIGNING_KEY_REGENERATION_CONFIRMATION = 'signingKeyRegenerationConfirmation'
const SIGNING_KEY_REGENERATION_CONFIRMATION_CONFIRM = 'signingKeyRegenerationConfirmationConfirm'
const SIGNING_KEY_REGENERATION_CONFIRMATION_CANCEL = 'signingKeyRegenerationConfirmationCancel'

function updateContainerList(containers, state) {
    const parent = el(CONTAINER_ELEMENT_ID)
    for (var i = 0; i < containers.length; i++) {
        const option = document.createElement('OPTION')
        option.value = containers[i].cookieStoreId

        if (containers[i].cookieStoreId === state.selectedContainerId) {
            option.selected = true
        }

        const optionName = document.createTextNode(containers[i].name)
        option.appendChild(optionName)

        parent.appendChild(option)
    }
}

export function updateContainerOptions(state) {
    el(USE_CONTAINER_ID).checked = state.useContainerId
    el(USE_CONTAINER_NAME).checked = state.useContainerName

    el(USE_HOSTNAME_FOR_CONTAINER_NAME).checked = state.useHostnameForContainerName

    el(USE_CONTAINER_ID).disabled = state.useContainerId && !state.useContainerName
    el(USE_CONTAINER_NAME).disabled = state.useContainerName && !state.useContainerId

    el(CONTAINER_ELEMENT_ID).disabled = state.useHostnameForContainerName
}

async function updateSigningKey() {
    el(SIGNING_KEY).value = await getSigningKey()
}

export function updateContainerSelector(containers, state) {
    updateContainerList(containers, state)
    updateContainerOptions(state)
}

export function setupContainerSelector(containers, s) {
    el(CONTAINER_ELEMENT_ID).onchange = function (e) {
        const container = containers.find(c => c.cookieStoreId === e.target.value)
        s.update({ selectedContainerId: container.cookieStoreId })
    }

    el(USE_CONTAINER_ID).onchange = function (e) {
        s.update({ useContainerId: e.target.checked })
    }

    el(USE_CONTAINER_NAME).onchange = function (e) {
        s.update({ useContainerName: e.target.checked })
    }

    el(USE_HOSTNAME_FOR_CONTAINER_NAME).onchange = function (e) {
        s.update({ useHostnameForContainerName: e.target.checked })
    }

    el(SIGNING_KEY_REGENERATION_CONFIRMATION_CONFIRM).onclick = async function () {
        await regenerateSigningKey()
        s.update({}) // trigger an empty update to refresh links
        updateSigningKey()
        hide(SIGNING_KEY_REGENERATION_CONFIRMATION)
    }

    el(SIGNING_KEY_REGENERATION_CONFIRMATION_CANCEL).onclick = function () {
        hide(SIGNING_KEY_REGENERATION_CONFIRMATION)
    }

    // pure UI
    el(CONTAINER_OPTIONS_TOGGLE).onclick = function () {
        toggle(CONTAINER_OPTIONS)
    }

    el(SIGNING_KEY_TOGGLE).onclick = function () {
        updateSigningKey()
        toggle(SIGNING_KEY_CONTAINER)
    }

    el(REGENERATE_SIGNING_KEY).onclick = function () {
        toggle(SIGNING_KEY_REGENERATION_CONFIRMATION)
    }
}