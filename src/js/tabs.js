/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

export async function newTab(container, params) {
    try {
        let browserInfo = await browser.runtime.getBrowserInfo()
        let currentTab = await browser.tabs.getCurrent()

        let createTabParams = {
            cookieStoreId: container.cookieStoreId,
            url: params.url,
            index: params.index || currentTab.index + 1,
            pinned: params.pinned,
        }

        if (browserInfo.version >= 58) {
            createTabParams.openInReaderMode = params.openInReaderMode
        } else {
            console.warn('openInReaderMode parameter is not supported in Firefox < 58')
        }

        await browser.tabs.create(createTabParams)
        await browser.tabs.remove(currentTab.id)
    } catch (e) {
        throw new Error(`creating new tab: ${e}`)
    }
}

export async function closeCurrentTab() {
    let currentTab = await browser.tabs.getCurrent()
    await browser.tabs.remove(currentTab.id)
}

export async function getActiveTab() {
    return (await browser.tabs.query({
        active: true,
        windowId: browser.windows.WINDOW_ID_CURRENT
    }))[0]
}
