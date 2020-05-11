/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

export function State(initialState, callback) {
    this._state = initialState
    this._callback = callback
}

State.prototype.update = function (update) {
    const oldState = { ...this._state }
    this._state = { ...this._state, ...update }
    this._callback({
        newState: { ...this._state },
        oldState: oldState,
        update: {...update}
    })
}

State.prototype.state = function () {
    return { ...this._state }
}