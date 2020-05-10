/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { sha256 } from './security.js'

describe('security.js', () => {
    describe('security.js/sha256', () => {
        it('should generate correct SHA-256 hashes', async () => {
            expect(await sha256('ab')).to.equal('fb8e20fc2e4c3f248c60c39bd652f3c1347298bb977b8b4d5903b85055620603')
        })
    })
})