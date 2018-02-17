const w = window.innerWidth, h = window.innerHeight, size = Math.min(w,h)/3
class LinkedHexagonPathComponent extends HTMLElement {
    constructor() {
        super()
        this.img = document.createElement('img')
        const shadow = this.attachShadow({mode:'open'})
    }
    render() {
        const canvas = document.createElement('canvas')
        canvas.width = size
        canvas.height = size
        const context = canvas.getContext('2d')
        context.fillStyle = '#212121'
        context.fillRect(0, 0, size, size)
        this.img.src = canvas.toDataURL()
    }
    connectedCallback() {
        this.render()
    }
}
class Node {
    constructor(i) {
        this.i = i
        const deg = i * Math.PI/3
        this.x = (size/3)*Math.cos(deg)
        this.y = (size/3)*Math.sin(deg)
    }
    draw(context) {
        context.beginPath()
        context.arc(this.x, this.y, 0, 2 * Math.PI)
        context.fill()
        if(this.neighbor) {
            context.beinPath()
            context.moveTo(this.x, this.y)
            const x = this.neighbor.x, y = this.neighbor.y
            context.lineTo(this.x + (x - this.x), this.y + (y - this.y))
            context.stroke()
        }
    }
    addNeighbor(neighbor) {
        this.neighbor = neighbor
    }
    update(stobcb) {

    }
    startUpdating(startcb) {
        
    }
}
