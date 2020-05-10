
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { parseBookmarkParams, parseOpenerParams } from './parsers.js'
import { getSigningKey } from './config.js'
import { verifySignature } from './security.js'
import { prepareContainer } from './containers.js'
import { newTab, closeCurrentTab } from './tabs.js'

function error(e) {
	console.error(e)

	document.getElementById('internalErrorBody').textContent = e;
	document.getElementById('internalErrorContainer').classList.remove('hidden');
}

function changeFavicon(favIconUrl) {
	const dataUrlMatch = favIconUrl.match(/data:(.+)[;,]/)
	if (!dataUrlMatch) {
		console.warn('favIconUrl is not a data URL, skipping')
		return
	}

	var link = document.createElement('link');
	link.rel = 'icon'
	link.type = dataUrlMatch[1]
	link.href = favIconUrl

	document.getElementsByTagName('head')[0].appendChild(link);
}


async function openTabInContainer(params) {
	await newTab(await prepareContainer(params), params)
}

function requestConfirmation(params) {
	document.getElementById('securityConfirmationContainerName').textContent = params.name
	document.getElementById('securityConfirmationUrl').textContent = params.url
	document.getElementById('securityConfirmationContainer').classList.remove('hidden');

	document.getElementById('securityConfirmationConfirm').onclick = function() {
		openTabInContainer(params)
	}
	
	document.getElementById('securityConfirmationGoBack').onclick = async function() {
		if (window.history.length > 1) {
			window.history.back()
		} else {
			await closeCurrentTab()
		}
	}
}

async function main() {
	try {
		// setup favicon if possible
		const bookmarkParams = parseBookmarkParams(window.location.search)
		if (bookmarkParams.favIconUrl) {
			changeFavicon(bookmarkParams.favIconUrl)
		}

		// get extension parameters
		const params = parseOpenerParams(window.location.hash)
		const key = await getSigningKey()

		// verify input signature to prevent clickjacking
		const secure = await verifySignature({key}, params)

		// require user confirmation if signature verification failed
		if (!secure) {
			requestConfirmation(params)
			return
		}

		// finally, open a new tab
		openTabInContainer(params)
	} catch (e) {
		error(e)
		return
	}
}

main()
