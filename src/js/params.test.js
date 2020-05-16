import { Params } from './params.js'

describe('params.js', () => {
    describe('params.js/constructor', () => {
        it('should filter empty parameters', () => {
            const p = new Params({id: 'id', name: undefined, color: null, icon: '', url: 'url'})
            expect(p.toString()).to.equal('id=id&url=url')
        })
    })

    describe('params.js/getters', () => {
        it('should have getters for all parameters', () => {
            const p = new Params('id=ID&name=Name&url=URL&color=Color&icon=Icon&index=Index&pinned=Pinned&openInReaderMode=OpenInReaderMode&signature=Signature')
            expect(p.id).to.equal('ID')
            expect(p.name).to.equal('Name')
            expect(p.color).to.equal('Color')
            expect(p.icon).to.equal('Icon')
            expect(p.url).to.equal('URL')
            expect(p.index).to.equal('Index')
            expect(p.pinned).to.equal('Pinned')
            expect(p.openInReaderMode).to.equal('OpenInReaderMode')
            expect(p.signature).to.equal('Signature')
        })
    })
})