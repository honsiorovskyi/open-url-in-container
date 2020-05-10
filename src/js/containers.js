/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

export async function getContainerByName(name) {
    let containers = await browser.contextualIdentities.query({
		name: name,
    })
    
    if (containers.length >= 1) {
        return containers[0]
    }

    return null
}

export async function lookupContainer({id, name}) {
    if (id) {
        return await browser.contextualIdentities.get(id)
    }

    if (name) {
        return await getContainerByName(name)
    }

    throw 'looking up container: neither id, nor name is present in the params'
}

export async function createContainer({name, color, icon}) {
	return await browser.contextualIdentities.create({
		name: name,
		color: color,
		icon: icon,
	})
}

export async function prepareContainer({ id, name, color, icon } = params) {
	const container = await lookupContainer({id, name})

	if (!container) {
		return await createContainer({name, color, icon})
	}

	return container
}
