
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { parse, required, url, integer, boolean, fallback, oneOf, atLeastOneRequired} from './parser.js'

const hashPrefix = '#ext+container:'
const allowedContainerColors = ['blue', 'turquoise', 'green', 'yellow', 'orange', 'red', 'pink', 'purple']
const allowedContainerIcons = ['fingerprint', 'briefcase', 'dollar', 'cart', 'circle', 'gift', 'vacation', 'food', 'fruit', 'pet', 'tree', 'chill']


const schema = {
	// container params
	id: [],
	name: [],
	color: [fallback('yellow'), oneOf(allowedContainerColors)],
	icon: [fallback('fingerprint'), oneOf(allowedContainerIcons)],


	// url params
	url: [required, url],
	index: [integer],
	pinned: [boolean],
	openInReaderMode: [boolean],
	
	// global validators
	__validators: [atLeastOneRequired(['id', 'name'])],
}

function error(e) {
	console.error(e)

	document.getElementById('errorBody').textContent = e;
	document.getElementById('errorPageContainer').classList.remove('hidden');
}

async function main() {
	let params, container = null;
	try {
		params = parseQuery()
	} catch(e) {
		error(`Error opening URL: ${e}.`)
		return
	}

	if(params.name !== 'default'){
		try {
			container = await getContainer(params)
		} catch (e) {
			error(`Error getting container: ${e}.`)
			return
		}

		if (!container) {
			try {
				container = await createContainer(params)
			} catch (e) {
				error(`Error creating container: ${e}.`)
				return
			}
		}
	}

	try {
		await newTab(container, params)
	} catch (e) {
		error(`Error creating new tab: ${e}.`)
		return
	}
}

function parseQuery() {
	let hash = decodeURIComponent(window.location.hash)
	if (!hash.startsWith(hashPrefix)) {
		throw('cannot parse url')
	}

	let query = hash.substr(hashPrefix.length)
	let params = parse(query, schema)

	return params
}

async function getContainer(params) {
	if (params.id) {
		return await browser.contextualIdentities.get(params.id)
	}
	
	let containers = await browser.contextualIdentities.query({
		name: params.name,
	})
	return containers[0]
}

async function createContainer(params) {
	return await browser.contextualIdentities.create({
		name: params.name,
		color: params.color,
		icon: params.icon,
	})
}

async function newTab(container, params) {
	const browserInfo = await browser.runtime.getBrowserInfo()
	const currentTab = await browser.tabs.getCurrent()
	let cookieStoreId = 'firefox-default'

	if(container !== null){
		cookieStoreId = container.cookieStoreId
	}

	let createTabParams = {
		cookieStoreId: cookieStoreId,
		url: params.url,
		index: currentTab.index,
		pinned: params.pinned,
	}

	if (browserInfo.version >= 58) {
		createTabParams.openInReaderMode = params.openInReaderMode
	} else {
		console.warn('openInReaderMode parameter is not supported in Firefox < 58')
	}

	browser.tabs.create(createTabParams)
	browser.tabs.remove(currentTab.id)
}

main()
