export function hide(id) {
    document.getElementById(id).classList.add('hidden')
}

export function show(id) {
    document.getElementById(id).classList.remove('hidden')
}

export function toggle(id) {
    document.getElementById(id).classList.toggle('hidden')
}

export function el(id) {
    return document.getElementById(id)
}