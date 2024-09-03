// constantes de los modos
const MODES = { 
    DRAW: 'draw',
    ERASE: 'erase',
    RECTANGLE: 'rectangle',
    ELLIPSE: 'ellipse',
    PICKER: 'picker',
    ARROW: 'arrow'
};

// Utilidades 
const $canvas = document.getElementById("canvas");
const ctx = $canvas.getContext('2d');

// Traer utilidades del DOM
const $colorPicker = document.getElementById("color-picker");
const $clearBtn = document.getElementById("clear-btn");
const $drawBtn = document.getElementById("draw-btn");
const $rectangleBtn = document.getElementById("rectangle-btn");
const $eraseBtn = document.getElementById('erase-btn');
const $arrowBtn = document.getElementById("arrow-btn");

// Estados
let isDrawing = false;
let startX, startY;
let lastX = 0, lastY = 0;
let mode = MODES.DRAW;
let imageData;

// Ajustar el tamaño del canvas dinámicamente
function resizeCanvas() {
    const main = document.getElementById('main');
    const width = main.clientWidth;
    const height = main.clientHeight;

    const tempImageData = ctx.getImageData(0, 0, $canvas.width, $canvas.height);

    $canvas.width = width;
    $canvas.height = height;

    ctx.putImageData(tempImageData, 0, 0);

    ctx.strokeStyle = $colorPicker.value;
}

window.addEventListener('resize', resizeCanvas);
window.addEventListener('load', resizeCanvas);

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
$eraseBtn.addEventListener('click', () => setMode(MODES.ERASE));
$arrowBtn.addEventListener('click', () => setMode(MODES.ARROW));

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
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(offsetX, offsetY);
        ctx.stroke();
        ctx.lineWidth = mode === MODES.ERASE ? 20 : 3;
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

    if (mode === MODES.ARROW) {
        // Actualizar las coordenadas finales mientras se mueve el mouse
        [lastX, lastY] = [offsetX, offsetY];
    }
}

function stopDrawing() {
    if (mode === MODES.ARROW) {
        // Dibuja la flecha cuando se suelta el botón del mouse
        drawArrow(startX, startY, lastX, lastY);
    }
    isDrawing = false;
}

function handleChangeColor() {
    const { value } = $colorPicker;
    ctx.strokeStyle = value;
}

function clearCanvas() {
    ctx.clearRect(0, 0, $canvas.width, $canvas.height);
}

// Función para dibujar una flecha en el canvas
function drawArrow(startX, startY, endX, endY) {
    const headLength = 10; // Longitud de la cabeza de la flecha
    const angle = Math.atan2(endY - startY, endX - startX); // Ángulo de la flecha

    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);

    // Dibuja la cabeza de la flecha
    const headAngle = Math.PI / 6;
    ctx.lineTo(endX - headLength * Math.cos(angle - headAngle), endY - headLength * Math.sin(angle - headAngle));
    ctx.moveTo(endX, endY);
    ctx.lineTo(endX - headLength * Math.cos(angle + headAngle), endY - headLength * Math.sin(angle + headAngle));

    ctx.stroke();
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

// Setmodes
function setMode(newMode) {
    mode = newMode;
    document.querySelector('button.active')?.classList.remove('active');

    if (mode === MODES.DRAW) {
        $drawBtn.classList.add('active');
        $canvas.style.cursor = 'url("./cursors/pincel.png") 0 24, auto';
        ctx.lineWidth = 2;
        ctx.globalCompositeOperation = "source-over";
        return;
    }

    if (mode === MODES.RECTANGLE) {
        $rectangleBtn.classList.add('active');
        $canvas.style.cursor = 'nw-resize';
        ctx.lineWidth = 2;
        ctx.globalCompositeOperation = "source-over";
        return;
    }

    if (mode === MODES.ERASE) { 
        $eraseBtn.classList.add('active');
        $canvas.style.cursor = 'url("./cursors/erase.png") 0 24, auto';
        ctx.lineWidth = 20;
        ctx.globalCompositeOperation = "destination-out";
        return;
    }

    if (mode === MODES.ARROW) {
        $arrowBtn.classList.add('active');
        $canvas.style.cursor = 'crosshair';
        ctx.lineWidth = 2; 
        ctx.globalCompositeOperation = "source-over";
        return;
    }
}
