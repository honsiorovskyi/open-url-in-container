import { generateSignature, verifySignature } from './security.js'

export class SignatureError extends Error {}

export class Params extends URLSearchParams {
    constructor(params) {   
        if (params instanceof Object) {
            // filter empty values
            const filteredParams = {}
            for (let k of Object.keys(params)) {
                if (!params[k]) {
                    continue
                }

                filteredParams[k] = params[k]
            }
            super(filteredParams)
            return
        }
        super(...arguments)
    }

    // signature
    get signature() { return this.get('signature') }

    // container properties
    get id() { return this.get('id') }
    get name() { return this.get('name') }
    get color() { return this.get('color') }
    get icon() { return this.get('icon') }

    // tab properties
    get url() { return this.get('url') }
    get index() { return this.get('index') }
    get pinned() { return this.get('pinned') }
    get openInReaderMode() { return this.get('openInReaderMode') }

    setSignature(signature) { this.set('signature', signature) }

    async sign(key) {
        if (this.signature) {
            throw new Error('query string already contains signature')
        }
        this.sort()
        this.setSignature(await generateSignature(key, this.toString()))
    }

    async verifySignature(key) {
        if (!this.signature) {
            throw new SignatureError('signature not found')
        }

        const tempQS = new URLSearchParams()
        console.log('dfdf', this.signature)
        for (let [k, v] of this) {
            if (k === 'signature') {
                continue
            }

            tempQS.set(k, v)
        }

        tempQS.sort()
        console.log('dfdf', this.signature, key, tempQS.toString())


        if (!await verifySignature(key, this.signature, tempQS.toString())) {
            throw new SignatureError('signature invalid')
        }
    }
}