const canvas = document.getElementById('test-canvas');
const context = canvas.getContext('2d');

canvas.height = canvas.clientHeight * (window.devicePixelRatio || 1);
canvas.width = canvas.clientWidth * (window.devicePixelRatio || 1);

let gui = new dat.GUI();

const displayOptions = ['boundedSin']
const display = { current: 'boundedSin' };

const params = {
    boundedSin: {
        lineWidth: canvas.width / 100,
        resolution: 24
    }
}

const sinBasic = crco.boundedSin(1, 1, -1, 0);
const sinInverted = crco.boundedSin(1, 1, -1, 0, true);

const draw = (name, params) => {

    switch (name) {

    }

    context.lineWidth = params.lineWidth;
    context.fillStyle = 'white';
    context.fillRect(0, 0, canvas.width, canvas.height);

    crco.drawLine2D(context, params.resolution, (i) => {
        return [
            i * canvas.width,
            canvas.height / 2 + sinBasic(i) * (canvas.height - params.lineWidth) / 2
        ];
    });

}

const updateGUI = () => {
    gui.destroy();
    gui = new dat.GUI;
    gui.add(display, 'current').options(displayOptions).onChange(updateGUI);
    switch (display.current) {
        case 'boundedSin':
            gui.add(params[display.current], 'lineWidth', 10, 100, 1).onChange(() => draw(display.current, params[display.current]));
            gui.add(params[display.current], 'resolution', 1, 128, 1).onChange(() => draw(display.current, params[display.current]));
            break;
    }
}

draw(display.current, params[display.current]);

updateGUI()