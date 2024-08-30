// Constantes
// Constantes
const MODES = { 
    DRAW: 'draw',
    ERASE: 'erase',
    RECTANGLE: 'rectangle',
    ELLIPSE: 'ellipse',
    PICKER: 'picker'
}

// Utilidades 
const $canvas = document.getElementById("canvas");
const ctx = $canvas.getContext('2d');

// Traer utilidades del DOM
const $colorPicker = document.getElementById("color-picker");
const $clearBtn = document.getElementById("clear-btn");
const $drawBtn = document.getElementById("draw-btn");
const $rectangleBtn = document.getElementById("rectangle-btn");
const $eraseBtn = document.getElementById('erase-btn')

// Estado
let isDrawing = false;
let startX, startY;
let lastX = 0, lastY = 0;
let mode = MODES.DRAW;
let imageData;

// Eventos
$canvas.addEventListener('mousedown', startDrawing);
$canvas.addEventListener('mousemove', draw);
$canvas.addEventListener('mouseup', stopDrawing);
$canvas.addEventListener('mouseleave', stopDrawing);

// Soporte para dispositivos táctiles
$canvas.addEventListener('touchstart', startDrawing);
$canvas.addEventListener('touchmove', draw);
$canvas.addEventListener('touchend', stopDrawing);

// Eventos de utilidades
$colorPicker.addEventListener('change', handleChangeColor);
$clearBtn.addEventListener('click', clearCanvas);
$rectangleBtn.addEventListener('click', () => setMode(MODES.RECTANGLE));
$drawBtn.addEventListener('click', () => setMode(MODES.DRAW));
$eraseBtn.addEventListener('click', () => {
setMode(MODES.ERASE) 
})



// Función para ajustar el tamaño del canvas dinámicamente
function resizeCanvas() {
    const main = document.getElementById('main');
    const width = main.clientWidth;
    const height = main.clientHeight;

    const tempImageData = ctx.getImageData(0, 0, $canvas.width, $canvas.height);

    $canvas.width = width;
    $canvas.height = height;

    ctx.putImageData(tempImageData, 0, 0);

    // Redibujar el canvas si es necesario (opcional)
    ctx.strokeStyle = $colorPicker.value;
}

// Ajustar el tamaño del canvas cuando la ventana cambia de tamaño
window.addEventListener('resize', resizeCanvas);

// Ajustar el tamaño del canvas cuando se carga la página
window.addEventListener('load', resizeCanvas);

// Métodos
function startDrawing(event) {
    isDrawing = true;
    const { offsetX, offsetY } = getEventCoordinates(event);

    // Guardar coordenadas iniciales
    [startX, startY] = [offsetX, offsetY];
    [lastX, lastY] = [offsetX, offsetY];
    imageData = ctx.getImageData(0, 0, $canvas.width, $canvas.height);
}

function draw(event) {
    if (!isDrawing) return;
    const { offsetX, offsetY } = getEventCoordinates(event);

    if (mode === MODES.DRAW || mode === MODES.ERASE) {
        // Comenzar trazado
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);

        // Dibujar una línea entre coordenadas
        ctx.lineTo(offsetX, offsetY);
        ctx.stroke();

        ctx.lineWidth = 3;

        // Actualizar últimas coordenadas
        [lastX, lastY] = [offsetX, offsetY];
        return;
    }

    if (mode === MODES.RECTANGLE) {
        ctx.putImageData(imageData, 0, 0);

        const width = offsetX - startX;
        const height = offsetY - startY;
        ctx.beginPath();
        ctx.rect(startX, startY, width, height);
        ctx.stroke();
        return;
    }
}


function stopDrawing() {
    isDrawing = false;
}

function handleChangeColor() {
    const { value } = $colorPicker;
    ctx.strokeStyle = value;
}

function clearCanvas() {
    ctx.clearRect(0, 0, $canvas.width, $canvas.height);
}

//set mode 

function setMode(newMode) {
    mode = newMode;
    document.querySelector('button.active')?.classList.remove('active');

    if (mode === MODES.DRAW) {
        $drawBtn.classList.add('active');
        $canvas.style.cursor = 'url("./cursors/pincel.png") 0 24, auto';
        ctx.lineWidth = 2;
        ctx.globalCompositeOperation = "source-over"

        return;
    }

    if (mode === MODES.RECTANGLE) {
        $rectangleBtn.classList.add('active');
        $canvas.style.cursor = 'nw-resize';
        ctx.lineWidth = 2;
        ctx.globalCompositeOperation = "source-over"

        return;
    }

    if (mode === MODES.ERASE) { 
        $eraseBtn.classList.add('active');
        $canvas.style.cursor = 'url("./cursors/erase.png") 0 24, auto';
        ctx.lineWidth = 20;
        ctx.globalCompositeOperation = "destination-out"
        return
    }
}

// Función para obtener las coordenadas del evento, tanto en dispositivos táctiles como no táctiles
function getEventCoordinates(event) {
    if (event.touches && event.touches.length > 0) {
        const rect = $canvas.getBoundingClientRect();
        return {
            offsetX: event.touches[0].clientX - rect.left,
            offsetY: event.touches[0].clientY - rect.top
        };
    } else {
        return {
            offsetX: event.offsetX,
            offsetY: event.offsetY
        };
    }
}
