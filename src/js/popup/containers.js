/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { el, toggle } from '../dom.js'

const CONTAINER_ELEMENT_ID = 'container'
const CONTAINER_OPTIONS_TOGGLE = 'containerOptionsToggle'
const CONTAINER_OPTIONS = 'containerOptions'
const USE_CONTAINER_ID = 'useContainerId'
const USE_CONTAINER_NAME = 'useContainerName'

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

    el(USE_CONTAINER_ID).disabled = state.useContainerId && !state.useContainerName
    el(USE_CONTAINER_NAME).disabled = state.useContainerName && !state.useContainerId
}

export function updateContainerSelector(containers, state) {
    updateContainerList(containers, state)
    updateContainerOptions(state)
}

export function setupContainerSelector(containers, s) {
    el(CONTAINER_ELEMENT_ID).onchange = function (e) {
        const container = containers.find(c => c.cookieStoreId === e.target.value)
        s.update({selectedContainerId: container.cookieStoreId})
    }

    el(USE_CONTAINER_ID).onchange = function(e) {
        s.update({useContainerId: e.target.checked})
    }

    el(USE_CONTAINER_NAME).onchange = function(e) {
        s.update({useContainerName: e.target.checked})
    }

    // pure UI
    el(CONTAINER_OPTIONS_TOGGLE).onclick = function() {
        toggle(CONTAINER_OPTIONS)
    }
}