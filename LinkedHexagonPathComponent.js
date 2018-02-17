const w = window.innerWidth, h = window.innerHeight, size = Math.min(w,h)/3
class LinkedHexagonPathComponent extends HTMLElement {
    constructor() {
        super()
        this.img = document.createElement('img')
        const shadow = this.attachShadow({mode:'open'})
        this.animator = new Animator()
        this.linkedPath = new LinkedHexagonPath()
    }
    render() {
        const canvas = document.createElement('canvas')
        canvas.width = size
        canvas.height = size
        const context = canvas.getContext('2d')
        context.fillStyle = '#212121'
        context.fillRect(0, 0, size, size)
        this.linkedPath.draw(context)
        this.img.src = canvas.toDataURL()
    }
    connectedCallback() {
        this.render()
        this.img.onmousedown  = (event) => {
            this.linkedPath.startUpdating(() => {
                this.animator.start(() => {
                    this.render()
                    this.linkedPath.update(() => {
                        this.animator.stop()
                    })
                })
            })
        }
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
        const scales = this.state.scales
        context.beginPath()
        context.arc(this.x, this.y, 0, 2 * Math.PI)
        context.fill()
        if(this.neighbor) {
            const x1 = this.x, y1 = this.y, x2 = this.neighbor.x, y2 = this.neighbor.y
            const updatePoints = (i) => {
                return {x:x1+(x2-x1)*scales[i], y:y1+(y2-y1)*scales[i]}
            }
            context.beinPath()
            const point1 = updatePoints(0)
            const point2 = updatePoints(1)
            context.moveTo(point2.x, point2.y)
            context.lineTo(point1.x, point1.y)
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
        this.init()
    }
    init() {
        this.scales = [0, 0]
        this.dir = 0
        this.j = 0
    }
    update(stopcb) {
        this.scales[this.j] += this.dir * 0.1
        if(Math.abs(this.scales[this.j]) > 1) {
            this.scales[this.j] = 1
            this.j++
            if(this.j == this.scales.length) {
                this.init()
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
        context.strokeStyle = '#2980b9'
        contet.lineWidth = size/30
        context.lineCap = 'round'
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
class Animator {
    constructor() {
        this.animated = false
    }
    start(updatecb) {
        if(!this.animated) {
            this.animated = true
            this.interval = setInterval(() => {
                updatecb()
            },50)
        }
    }
    stop() {
        if(this.animated) {
            this.animated = false
            clearInterval(this.interval)
        }
    }
}
customElements.define('linked-hex-path', LinkedHexagonPathComponent)
