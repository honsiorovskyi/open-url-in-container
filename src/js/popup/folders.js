/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { saveState, restoreState, POPUP_FOLDER_STATE } from '../config.js'
import { State } from './state.js'
import { el } from './dom.js'

function updateFolderFoldingState({ newState, update }) { // eslint-disable-line no-unused-vars
    saveState(POPUP_FOLDER_STATE, newState)

    for (let id of Object.keys(update)) {
        if (newState[id]) {
            el(id).classList.remove('folded')
        } else {
            el(id).classList.add('folded')
        }
    }
}

function setupFolderFoldingListeners(s) {
    const folderIds = Object.keys(s.state())
    for (let i = 0; i < folderIds.length; i++) {
        const folderId = folderIds[i]
        el(folderId).querySelector('.title').onclick = function () {
            const state = s.state()
            s.update({
                [folderId]: !state[folderId]
            })
        }
    }
}

export async function setupFolderFolding() {
    // update folder state
    const initialState = {
        containerFolder: true,
        bookmarkFolder: true,
        urlFolder: false,
        terminalFolder: false,
        signatureFolder: false,
    }
    const folderState = {
        ...initialState,
        ...await restoreState(POPUP_FOLDER_STATE, initialState),
    }

    updateFolderFoldingState({
        newState: folderState,
        update: folderState
    })

    // setup callbacks
    setupFolderFoldingListeners(new State(folderState, updateFolderFoldingState))
}