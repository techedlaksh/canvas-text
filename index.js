const canvasSize = 800
const canvas = document.createElement('canvas')
const ctx = canvas.getContext('2d')
const scale = 2
const canvasResolution = canvasSize * scale
canvas.width = Math.floor(canvasResolution)
canvas.height = Math.floor(canvasResolution)
canvas.style.width = `${canvasSize}px`
canvas.style.height = `${canvasSize}px`

document.getElementById('canvas').appendChild(canvas)
ctx.scale(scale, scale)

function random(a=0, b=100) {
    return Math.round((Math.random() * (b - a)) + a)
}

function choice(z=[]) {
    let firstIndex = 0
    let lastIndex = z.length - 1
    return z[random(firstIndex, lastIndex)]
}

function render() {
    ctx.setTransform(scale, 0, 0, scale, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    let shape 
    originalShape = {
        letter: 'L',
        color: 'hsl(170, 30%, 60%)',
        font: `normal 1000px sans-serif`,
        alignV: 'middle',
        alignH: 'center',
        rotation: (0 * Math.PI) / 180,
        stretchV: 1.0,
        stretchH: 1.0,
        propertiesToRandomise: ['color']
    }

    function setProperty(p) {
        let value, randomProp
        randomProp = {
            'color': `hsl(${random(0, 360)}, 75%, 75%)`,
            'font': `normal ${choice([100, 400, 600])} ${random(500, 1200)}px sans-serif`,
            'alignV': choice(['top', 'middle', 'bottom']),
            'alignH': choice(['left', 'center', 'right']),
            'rotation': (random(0, 360) * Math.PI) / 180,
            'stretchV': random(0, 100) / 50.0,
            'stretchH': random(0, 100) / 50.0
        }
        if (p) {
            value = randomProp[p]
            console.log(p, value)
        }
        return value
    }

    function randomise(s, r=[]) {
        console.log(s, r)
        while(r.length) {
            let currentProp = r.pop()
            s[currentProp] = setProperty(currentProp)
        }
        return s
    }
    shape = randomise({...originalShape}, originalShape.propertiesToRandomise.slice())
    // shape = randomise({...originalShape}, ['rotation'])
    // shape = randomise({...originalShape}, ['stretchH', 'stretchV'])
    // shape = randomise({...originalShape}, [''])

    ctx.fillStyle = shape.color
    ctx.font = shape.font
    ctx.textBaseline = shape.alignV
    ctx.textAlign = shape.alignH

    ctx.translate(canvasSize / 2, canvasSize / 2)
    ctx.rotate(shape.rotation)
    ctx.scale( 1.0 * shape.stretchV, 1.0 * shape.stretchH )
    ctx.translate(-canvasSize / 2, -canvasSize / 2)

    ctx.fillText(shape.letter, canvasSize / 2, canvasSize / 2)
}
render()
document.getElementById('renderbtn').onclick = render