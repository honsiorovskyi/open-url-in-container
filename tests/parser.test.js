import { parse, required, url, integer, boolean, fallback, oneOf, atLeastOneRequired} from '../src/parser'

describe('parser', () => {
    let data = 'a=5&b=6&c=foo.com&d=yes&__validators=abc'

    it('should apply validators to values', () => {
        expect(parse(data, {
            a: [required, integer],
            b: [required],
            c: [url],
            d: [boolean],
        })).toStrictEqual({
            a: 5,
            b: '6',
            c: 'https://foo.com/',
            d: true,
        })
    })
    
    it('should fail on validators failure', () => {
        expect(() => { parse(data, {
            f: [required],
        })}).toThrow()
    })

    it('should ignore __validators property', () => {
        expect(parse(data, {
            __validators: [],
        })).toStrictEqual({})
    })

    it('should apply __validators', () => {
        expect(parse(data, {
            a: [],
            f: [],
            __validators: [atLeastOneRequired('a', 'f')]
        })).toStrictEqual({a: '5'})

        expect(() => { parse(data, {
            f: [],
            g: [],
            __validators: [atLeastOneRequired('f', 'g')]
        })}).toThrow()
    })

    it('ignore invalid string', () => {
        expect(parse('&=?=abc&a=5', {
            __validators: [],
        })).toStrictEqual({})
    })
})

describe('required', () => {
    it('should throw on empty value', () => {
        expect(() => { required('', 'whatever') }).toThrow()
        expect(() => { required(null, 'whatever') }).toThrow()
        expect(() => { required(undefined, 'whatever') }).toThrow()
    })

    it('should pass on normal strings', () => {
        expect(required('foo', 'whatever')).toBe('foo')
    })
})

describe('httpUrl', () => {
    it('should accept urls with scheme', () => {
        expect(url('http://foo.com', 'whatever')).toBe('http://foo.com/')
        expect(url('https://foo.com', 'whatever')).toBe('https://foo.com/')
        expect(url('https://foo.com?q=a', 'whatever')).toBe('https://foo.com/?q=a')
        expect(url('about:blank', 'whatever')).toBe('about:blank')
        expect(url('magnet:foo', 'whatever')).toBe('magnet:foo')
    })

    it('should rewrite urls without scheme to https', () => {
        expect(url('foo.com', 'whatever')).toBe('https://foo.com/')
        expect(url('foo', 'whatever')).toBe('https://foo/')
        expect(url('/foo', 'whatever')).toBe('https://foo/')
        expect(url('//foo', 'whatever')).toBe('https://foo/')
        expect(url('///foo', 'whatever')).toBe('https://foo/')
        expect(url('+abc', 'whatever')).toBe('https://+abc/')
    })

    it('should throw on invalid urls', () => {
        expect(() => { url('?abc', 'whatever') }).toThrow()
        expect(() => { url('/', 'whatever') }).toThrow()
        expect(() => { url('//', 'whatever') }).toThrow()
    })

    it('should ignore null, undefined and empty strings', () => {
        expect(integer(null, 'whatever')).toBe(null)
        expect(integer(undefined, 'whatever')).toBe(undefined)
        expect(integer('', 'whatever')).toBe('')
    })
})

describe('integer', () => {
    it('should accept integers', () => {
        expect(integer('1', 'whatever')).toBe(1)
        expect(integer('-1', 'whatever')).toBe(-1)
    })

    it('should not accept floats and strings', () => {
        expect(() => { integer('1.01', 'whatever') }).toThrow()
        expect(() => { integer('foo', 'whatever') }).toThrow()
        expect(() => { integer('1foo', 'whatever') }).toThrow()
    })

    it('should ignore null, undefined and empty strings', () => {
        expect(integer(null, 'whatever')).toBe(null)
        expect(integer(undefined, 'whatever')).toBe(undefined)
        expect(integer('', 'whatever')).toBe('')
    })
})

describe('boolean', () => {
    it('should accept booleans', () => {
        expect(boolean('true', 'whatever')).toBe(true)
        expect(boolean('TrUe', 'whatever')).toBe(true)
        expect(boolean('yes', 'whatever')).toBe(true)
        expect(boolean('on', 'whatever')).toBe(true)
        expect(boolean('1', 'whatever')).toBe(true)

        expect(boolean('false', 'whatever')).toBe(false)
        expect(boolean('FaLsE', 'whatever')).toBe(false)
        expect(boolean('no', 'whatever')).toBe(false)
        expect(boolean('off', 'whatever')).toBe(false)
        expect(boolean('0', 'whatever')).toBe(false)
    })

    it('should not accept anything else', () => {
        expect(() => { boolean('abc', 'whatever') }).toThrow()
        expect(() => { boolean('10', 'whatever') }).toThrow()
        expect(() => { boolean('01', 'whatever') }).toThrow()
    })

    it('should ignore null, undefined and empty strings', () => {
        expect(integer(null, 'whatever')).toBe(null)
        expect(integer(undefined, 'whatever')).toBe(undefined)
        expect(integer('', 'whatever')).toBe('')
    })
})

describe('fallback', () => {
    it('should not change non-empty values', () => {
        expect(fallback('foo')('bar', 'whatever')).toBe('bar')
        expect(fallback('foo')(1, 'whatever')).toBe(1)
        expect(fallback('foo')(true, 'whatever')).toBe(true)
    })

    it('should change empty values', () => {
        expect(fallback('foo')(null, 'whatever')).toBe('foo')
        expect(fallback('foo')(undefined, 'whatever')).toBe('foo')
        expect(fallback('foo')('', 'whatever')).toBe('foo')
    })
})

describe('oneOf', () => {
    it('should pass if the parameter is in the preconfigured list', () => {
        expect(oneOf(['a', 'b'])('a')).toBe('a')
        expect(oneOf(['a', 'b'])('b')).toBe('b')
        expect(oneOf(['a'])('a')).toBe('a')
    })

    it('should throw if the parameter is not in the precofigured list', () => {
        expect(() => { oneOf(['a', 'b'])('c') }).toThrow()
        expect(() => { oneOf(['a', 'b'])('') }).toThrow()
        expect(() => { oneOf([])('a') }).toThrow()
    })
})

describe('atLeastOneRequired', () => {
    it('should pass when at least one parameter is present', () => {
        expect(atLeastOneRequired(['a', 'b'])({a: 5, b: null})).toStrictEqual({a: 5, b: null})
        expect(atLeastOneRequired(['a', 'b'])({a: null, b: 5})).toStrictEqual({a: null, b: 5})
        expect(atLeastOneRequired(['a', 'b'])({a: 5, b: 5})).toStrictEqual({a: 5, b: 5})
        expect(atLeastOneRequired(['a', 'b'])({a: 5})).toStrictEqual({a: 5})  
    })

    it('should fail when none of the parameters is present', () => {
        expect(() => { atLeastOneRequired(['a', 'b'])({c: 5}) }).toThrow()
        expect(() => { atLeastOneRequired(['a', 'b'])({a: null, b: '', c: 5}) }).toThrow()
        expect(() => { atLeastOneRequired(['a', 'b'])({a: null, c: 5}) }).toThrow()
    })
})