
const canvas = document.getElementById('test-canvas');
const context = canvas.getContext('2d');

canvas.height = canvas.clientHeight * (window.devicePixelRatio || 1);
canvas.width = canvas.clientWidth * (window.devicePixelRatio || 1);

context.strokeStyle = 'black';
context.lineWidth = canvas.height / 100;

const resolution = 256;

const sinOne = crco.MathUtil.boundedSin(1, 1, -1, 0);

context.beginPath()

for (let i = 0; i <= resolution; i++) {
    console.log(i, sinOne(i));
    if (i === 0) {
        context.moveTo(i * canvas.width / resolution, canvas.height / 2 + sinOne(i / resolution) * (canvas.height - context.lineWidth) / 2);
    } else {
        context.lineTo(i * canvas.width / resolution, canvas.height / 2 + sinOne(i / resolution) * (canvas.height - context.lineWidth) / 2);
    }
}

context.stroke();