import { hex2array, array2hex } from '../../js/security/hex.js'

describe('security/hex.js', () => {
    describe('security/hex.js/hex2array', () => {
        it('should do conversion correctly', () => {
            const cases = [
                {in: 'ab1ac4', e: Uint8Array.from([0xab, 0x1a, 0xc4])},
                {in: '12', e: Uint8Array.from([0x12])},
                {in: '01', e: Uint8Array.from([0x01])},
                {in: '', e: Uint8Array.from([])},
            ]
            
            cases.forEach(c => {
                expect(hex2array(c.in)).to.deep.equal(c.e)
            })
        })

        it('should throw an error on malformed input', () => {
            const cases = [
                '123',
                'a',
                'az',
                'az4',
            ]

            cases.forEach(c => {
                expect(() => { hex2array(c) }).to.throw()
            })
        })
    })

    describe('security/hex.js/array2hex', () => {
        it('should do the conversion correctly', () => {
            const cases = [
                {in: Uint8Array.from([0xab, 0x1a, 0xc4]), e: 'ab1ac4'},
                {in: Uint8Array.from([0x12]), e: '12'},
                {in: Uint8Array.from([0x01]), e: '01'},
                {in: Uint8Array.from([]), e: ''},
            ]

            cases.forEach(c => {
                expect(array2hex(c.in)).to.equal(c.e)
            })
        })
    })
})