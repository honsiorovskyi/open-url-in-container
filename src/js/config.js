/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const SIGNING_KEY_NAME = 'signing_key'
const POPUP_FOLDER_STATE_NAME = 'popup_folder_state'
const MOST_RECENTLY_USED_CONTAINER_ID_NAME = 'most_recently_used_container_id'

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

export async function getPopupFolderState() {
    return (await browser.storage.local.get(POPUP_FOLDER_STATE_NAME))[POPUP_FOLDER_STATE_NAME] || {}
}

export async function setPopupFolderState(state) {
    await browser.storage.local.set({
        [POPUP_FOLDER_STATE_NAME]: state
    })
}

export async function getMostRecentlyUsedContainerId() {
    return (await browser.storage.local.get(MOST_RECENTLY_USED_CONTAINER_ID_NAME))[MOST_RECENTLY_USED_CONTAINER_ID_NAME]
}

export async function setMostRecentlyUsedContainerId(id) {
    await browser.storage.local.set({
        [MOST_RECENTLY_USED_CONTAINER_ID_NAME]: id
    })
}