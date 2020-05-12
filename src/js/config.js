/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const SIGNING_KEY_NAME = 'signing_key'
export const POPUP_FOLDER_STATE = 'popup_folder_state'
export const CONTAINER_SELECTOR_STATE = 'container_selector_config'

export async function getSigningKey() {
    return (await browser.storage.local.get(SIGNING_KEY_NAME))[SIGNING_KEY_NAME]
}

export async function setSigningKey(key, force) {
    const existingKey = await getSigningKey()

    if (existingKey && !force) {
        throw new Error('signing key already exists, use force to overwrite')
    }

    await browser.storage.local.set({
        [SIGNING_KEY_NAME]: key
    })
}

export async function restoreState(component, initialState = {}) {
    return (await browser.storage.local.get(component))[component] || initialState
}

export async function saveState(component, state) {
    await browser.storage.local.set({
        [component]: state
    })
}
