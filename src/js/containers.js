/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const defaultIcon = 'fingerprint'
const availableContainerColors = [
    'blue',
    'turquoise',
    'green',
    'yellow',
    'orange',
    'red',
    'pink',
    'purple',
]

function randomColor() {
    return availableContainerColors[Math.random() * availableContainerColors.length | 0]
}


async function getContainerByName(name) {
    const containers = await browser.contextualIdentities.query({
        name: name,
    })

    if (containers.length >= 1) {
        return containers[0]
    }

    return null
}

function lookupContainer({ id, name }) {
    if (id) {
        return browser.contextualIdentities.get(id)
    }

    if (name) {
        return getContainerByName(name)
    }

    throw new Error('looking up container: neither id, nor name is present in the params')
}

function createContainer({ name, color, icon }) {
    return browser.contextualIdentities.create({
        name: name,
        color: color || randomColor(),
        icon: icon || defaultIcon,
    })
}

export async function prepareContainer({ id, name, color, icon }) {
    const container = await lookupContainer({ id, name })

    if (!container) {
        return createContainer({ name, color, icon })
    }

    return container
}