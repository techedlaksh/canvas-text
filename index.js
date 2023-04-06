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

function createShape() {
    shape = {
        letter: 'L',
        color: 'hsl(170, 30%, 60%)',
        font: `normal 1000px sans-serif`,
        alignV: 'middle',
        alignH: 'center',
        rotation: (0 * Math.PI) / 180,
        stretchV: 1.0,
        stretchH: 1.0,
        propertiesToRandomise: []
    }
    return shape
}

let allProps = {
    'color': true,
    'rotation': false,
    'font': false,
    'stretchV': false,
    'stretchH': false,
    'alignV': false,
    'alignH': false,
}
let originalShape = createShape()
let renderCount = -1

function render() {
    renderCount += 1
  document.getElementById('quirk').innerHTML = `you clicked <span id='counter'>${renderCount} times</span><br> you sure have a lot of time`
    ctx.setTransform(scale, 0, 0, scale, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    function setProperty(p) {
        let value, randomProp
        randomProp = {
            'color': `hsl(${random(0, 360)}, 75%, 75%)`,
            'rotation': (random(0, 360) * Math.PI) / 180,
            'font': `normal ${choice([100, 400, 600])} ${random(500, 1200)}px sans-serif`,
            'stretchV': random(0, 100) / 50.0,
            'stretchH': random(0, 100) / 50.0,
            'alignV': choice(['top', 'middle', 'bottom']),
            'alignH': choice(['left', 'center', 'right'])
        }
        if (p) {
            value = randomProp[p]
        }
        return value
    }

    function randomise(s, r=[]) {
        while(r.length) {
            let currentProp = r.pop()
            s[currentProp] = setProperty(currentProp)
        }
        return s
    }
    let shape
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
function startup() {
    Object.entries(allProps)
        .filter(x => x[1])
        .reduce((placeholder, currentItem) => {
            placeholder.push(currentItem[0])
            return placeholder
        }, []).forEach((el) => {
                    originalShape.propertiesToRandomise.push(el)
                    btnVisual(document.getElementById(el), true)
                })
    render()
}
startup()

function btnVisual(target, toggle=false) {
    let text, backColor, frontColor
    if (toggle) {
        text = target.innerHTML.replace('enable', 'disable')
        backColor = 'hsl(170, 40%, 60%)'
        frontColor = 'hsl(170, 40%, 100%)'
    } else {
        text = target.innerHTML.replace('disable', 'enable')
        backColor = ''
        frontColor = ''
    }
    target.innerHTML = text
    target.style.background = backColor
    target.style.color = frontColor
}

function toggleProperties(evt) {
    let propsArr = originalShape.propertiesToRandomise
    let target = evt.currentTarget
    if (propsArr.includes(target.id)) {
        propsArr.splice(propsArr.indexOf(target.id), 1)
        allProps[target.id] = false
        btnVisual(target, false)
        return
    }
    propsArr.push(target.id)
    allProps[target.id] = true
    btnVisual(target, true)
    return
}
function clickEvents(evts=[]) {
    evts.forEach( (el) => {
        document.getElementById(el).click()
    })
    console.log(allProps)
    return
}
function clearAll() {
    let propsArr = originalShape.propertiesToRandomise.slice()
    console.log(propsArr)
    clickEvents(propsArr)
    originalShape = createShape()
    render()
    return
}
function enableAll() {
    let evtsToClick = Object.entries(allProps)
                        .filter(x => !x[1])
                        .reduce((placeholder, currentItem) => {
                            placeholder.push(currentItem[0])
                            return placeholder
                        }, [])
    console.log(evtsToClick)
    clickEvents(evtsToClick)
    return
}

document.getElementById('renderbtn').addEventListener('click', render, false)
document.getElementById('refreshbtn').addEventListener('click', () => window.location.reload(), false)
document.getElementById('enablebtn').addEventListener('click', enableAll, false)
document.getElementById('clearbtn').addEventListener('click', clearAll, false)
document.getElementById('color').addEventListener('click', toggleProperties, false)
document.getElementById('rotation').addEventListener('click', toggleProperties, false)
document.getElementById('font').addEventListener('click', toggleProperties, false)
document.getElementById('stretchV').addEventListener('click', toggleProperties, false)
document.getElementById('stretchH').addEventListener('click', toggleProperties, false)
document.getElementById('alignV').addEventListener('click', toggleProperties, false)
document.getElementById('alignH').addEventListener('click', toggleProperties, false)
