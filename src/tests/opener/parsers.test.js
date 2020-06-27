import { parseOpenerParams } from '../../js/opener/parser.js'

describe('opener/parser.js', () => {
    const hashString = function (params) {
        return `#ext+container:${new URLSearchParams(params).toString()}`
    }

    describe('opener/parser.js/parseOpenerParams', () => {
        it('should fail on invalid hash', () => {
            const hash = 'foo'
            expect(() => { parseOpenerParams(hash) }).to.throw()
        })

        it('should fail on invalid protocol', () => {
            const hash = '#gopher:foo'
            expect(() => { parseOpenerParams(hash) }).to.throw()
        })

        it('should fail on invalid parameters', () => {
            const hash = '#ext+container:nourl=true'
            expect(() => { parseOpenerParams(hash) }).to.throw()
        })

        it('should return params on proper payload', () => {
            const hash = '#ext+container:name=Personal&url=https%3A%2F%2Fwww.wikipedia.org%2F&signature=371e10dc31a535db220f453615735a1029874af7b2bfc066790ce938b84a884a'
            expect(parseOpenerParams(hash))
                .to.deep.equal({
                    name: 'Personal',
                    url: 'https://www.wikipedia.org/',
                    signature: '371e10dc31a535db220f453615735a1029874af7b2bfc066790ce938b84a884a',
                })
        })

        it('should sanitize url', () => {
            expect(parseOpenerParams(hashString({ url: 'http://example.org/', name: 'foo' })))
                .to.deep.equal({ name: 'foo', url: 'http://example.org/' })

            expect(() => { parseOpenerParams(hashString({})) }).to.throw()
            expect(() => { parseOpenerParams(hashString({ url: 'invalid_url' })) }).to.throw()
        })

        it('should sanitize name and id', () => {
            expect(() => { parseOpenerParams(hashString({ url: 'http://example.org/' })) }).to.throw()
            expect(parseOpenerParams(hashString({ url: 'http://example.org/', name: 'foo' })))
                .to.deep.equal({ name: 'foo', url: 'http://example.org/' })
            expect(parseOpenerParams(hashString({ url: 'http://example.org/', id: 'foo' })))
                .to.deep.equal({ id: 'foo', url: 'http://example.org/' })
            expect(parseOpenerParams(hashString({ url: 'http://example.org/', name: 'foo', id: 'foo' })))
                .to.deep.equal({ name: 'foo', id: 'foo', url: 'http://example.org/' })
        })

        it('should sanitize colors', () => {
            expect(parseOpenerParams(hashString({ color: 'red', url: 'http://example.org/', name: 'foo' })))
                .to.deep.equal({ color: 'red', url: 'http://example.org/', name: 'foo' })
            expect(() => { parseOpenerParams(hashString({ color: 'foo', url: 'http://example.org/', name: 'foo' })) }).to.throw()
        })

        it('should sanitize icons', () => {
            expect(parseOpenerParams(hashString({ icon: 'fingerprint', url: 'http://example.org/', name: 'foo' })))
                .to.deep.equal({ icon: 'fingerprint', url: 'http://example.org/', name: 'foo' })
            expect(() => { parseOpenerParams(hashString({ icon: 'foo', url: 'http://example.org/', name: 'foo' })) }).to.throw()
        })

        it('should sanitize index', () => {
            expect(parseOpenerParams(hashString({ index: 1, url: 'http://example.org/', name: 'foo' })))
                .to.deep.equal({ index: 1, url: 'http://example.org/', name: 'foo' })
            expect(parseOpenerParams(hashString({ index: '1', url: 'http://example.org/', name: 'foo' })))
                .to.deep.equal({ index: 1, url: 'http://example.org/', name: 'foo' })
            expect(() => { parseOpenerParams(hashString({ index: 'a', url: 'http://example.org/', name: 'foo' })) }).to.throw()
        })

        it('should sanitize pinned', () => {
            expect(parseOpenerParams(hashString({ pinned: true, url: 'http://example.org/', name: 'foo' })))
                .to.deep.equal({ pinned: true, url: 'http://example.org/', name: 'foo' })
            expect(parseOpenerParams(hashString({ pinned: 'true', url: 'http://example.org/', name: 'foo' })))
                .to.deep.equal({ pinned: true, url: 'http://example.org/', name: 'foo' })
            expect(() => { parseOpenerParams(hashString({ pinned: 'foo', url: 'http://example.org/', name: 'foo' })) }).to.throw()
        })

        it('should sanitize openInReaderMode', () => {
            expect(parseOpenerParams(hashString({ openInReaderMode: true, url: 'http://example.org/', name: 'foo' })))
                .to.deep.equal({ openInReaderMode: true, url: 'http://example.org/', name: 'foo' })
            expect(parseOpenerParams(hashString({ openInReaderMode: 'true', url: 'http://example.org/', name: 'foo' })))
                .to.deep.equal({ openInReaderMode: true, url: 'http://example.org/', name: 'foo' })
            expect(() => { parseOpenerParams(hashString({ openInReaderMode: 'foo', url: 'http://example.org/', name: 'foo' })) }).to.throw()
        })
    })
})