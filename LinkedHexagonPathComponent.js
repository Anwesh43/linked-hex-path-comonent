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
        this.state = new State()
    }
    draw(context) {
        const scale = this.state.scale
        context.beginPath()
        context.arc(this.x, this.y, 0, 2 * Math.PI)
        context.fill()
        if(this.neighbor) {
            context.beinPath()
            context.moveTo(this.x, this.y)
            const x = this.neighbor.x, y = this.neighbor.y
            context.lineTo(this.x + (x - this.x) * scale, this.y + (y - this.y) * scale)
            context.stroke()
        }
    }
    addNeighbor(neighbor) {
        this.neighbor = neighbor
    }
    update(stobcb) {
        this.state.update(stopcb)
    }
    startUpdating(startcb) {
        this.state.startUpdating(startcb)
    }
}
class State {
    constructor() {
        this.scale = 0
        this.prevScale = 0
        this.dir = 0
    }
    update(stopcb) {
        this.scale += this.dir * 0.1
        if(Math.abs(this.scale - this.prevScale) > 1) {
            this.scale = this.prevScale + this.dir
            this.dir *= -1
            this.prevScale = this.scale
            if(this.scale == 0) {
                stopcb()
            }
        }
    }
    startUpdating(startcb) {
        if(this.dir == 0) {
            this.dir = 1 - 2*this.scale
            startcb()
        }
    }
}
class LinkedHexagonPath {
    constructor() {
        this.root = new Node(0)
        this.curr = this.root
        this.initLinkedPath()
    }
    initLinkedPath() {
        var node = this.curr
        for(var i=1; i<=5; i++) {
            const currNode = new Node(1)
            node.addNeighbor(currNode)
            node = currNode
        }
        node.addNeighbor(this.curr)
    }
    draw(context) {
        const node = this.root
        node.draw(context)
        while(node.i != 5) {
            node = node.neighbor
            node.draw(context)
        }
    }
    update(stopcb) {
        this.curr.update(() => {
            this.curr = this.curr.neighbor
            if(this.curr.i == 0) {
                stopcb()
            }
        })
    }
    startUpdating(startcb) {
        this.curr.startUpdating()
    }
}
