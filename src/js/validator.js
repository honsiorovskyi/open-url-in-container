/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

export function sanitizeURLSearchParams(qs, schema) {
    let params = {}

    // validate each key from the schema
    // except the __validators one
    for (let k of Object.keys(schema)) {
        if (k === '__validators') {
            continue
        }

        // apply each validator
        let param = qs.get(k)
        for (let v of schema[k]) {
            param = v(param, k)
        }

        // skip empty params
        if (isEmpty(param)) {
            continue
        }

        params[k] = param
    }

    // apply global validators
    for (let v of schema.__validators || []) {
        params = v(params)
    }

    return params
}

function isEmpty(v) {
    return v === null ||
        v === undefined ||
        v === ''
}

export function url(p) {
    if (isEmpty(p)) {
        return p
    }

    try {
        return new URL(p).toString()
    } catch {} // eslint-disable-line no-empty

    // let's try to add 'https://' prefix and try again
    p = 'https://' + p
    try {
        return new URL(p).toString()
    } catch (e) {
        throw new Error(e.message)
    }
}

export function required(p, name) {
    if (isEmpty(p)) {
        throw new Error(`"${name}" parameter is missing`)
    }
    return p
}

export function integer(p, name) {
    if (isEmpty(p)) {
        return p
    }

    if (!/^[-+]?(\d+|Infinity)$/.test(p)) {
        throw new Error(`"${name}" parameter should be an integer`)
    }

    return Number(p)
}

export function boolean(p, name) {
    if (isEmpty(p)) {
        return p
    }

    switch (p.toLowerCase()) {
        case 'true':
        case 'yes':
        case 'on':
        case '1':
            return true
        case 'false':
        case 'no':
        case 'off':
        case '0':
            return false
    }

    throw new Error(`"${name}" parameter should be a boolean (true/false, yes/no, on/off, 1/0)`)
}

export function fallback(val) {
    return function(p) {
        if (isEmpty(p)) {
            return val
        }

        return p
    }
}

export function oneOf(vals) {
    return function(p, name) {
        if (vals.indexOf(p) === -1) {
            throw new Error(`"${name}" parameter should be a in a list ${vals}`)
        }

        return p
    }
}

export function oneOfOrEmpty(vals) {
    const oneOfFunc = oneOf(vals)
    return function(p, name) {
        if (isEmpty(p)) {
            return p
        }

        return oneOfFunc(p, name)
    }
}

export function atLeastOneRequired(requiredParams) {
    return function(params) {
        let valid = false
        for (let p of requiredParams) {
            if (!isEmpty(params[p])) {
                valid = true
                break
            }
        }

        if (!valid) {
            throw new Error(`at least one of "${requiredParams.join('", "')}" should be specified`)
        }

        return params
    }
}