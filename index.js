

//constasntes
const MODES = { 
DRAW: 'draw',
ERASE: 'erase',
RECTANGLE: 'rectangle',
ELLIPSE: 'ellipse',
PICKER: 'picker'

}


//utilities 
const $ = selector => document.querySelector(selector)
const $$ = selector  => document.querySelector(selector)
const $canvas = document.getElementById("canvas")
const ctx = $canvas.getContext('2d')
const $colorPicker = document.getElementById("color-picker")


//state

let isDrawing = false
let startX , startY

let lastX = 0
let lastY = 0

let mode = MODES.DRAW



//EVENTOS

$canvas.addEventListener('mousedown',startDrawing)
$canvas.addEventListener('mousemove', draw)
$canvas.addEventListener('mouseup', stopDrawing)
$canvas.addEventListener('mouseleave', stopDrawing)

$colorPicker.addEventListener ('change', handleChangeColor)

//metodos

function startDrawing (event) {
    isDrawing= true
    const { offsetX, offsetY } = event;
    //guardar cordenadas iniciales

   ;[startX, startY] = [offsetX, offsetY]
   ;[lastX , lastY] = [offsetX, offsetY]
   console.log({startX, startY , lastX, lastY});
   
}

function draw (event){
if (!isDrawing) return 

const {offsetX, offsetY} = event
//comenzar trazado

ctx.beginPath()


ctx.moveTo(lastX, lastY)

//dibujar una linea entre cordenasdas

ctx.lineTo(offsetX, offsetY)
    

ctx.stroke()

ctx.lineWidth = 3

//actualizar ultimas cordenadas
;[lastX,lastY] = [offsetX, offsetY]
}

function stopDrawing (event) {

    isDrawing = false
}

function handleChangeColor (event) { 
const {value } = $colorPicker
ctx.strokeStyle = value
}