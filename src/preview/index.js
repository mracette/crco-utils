const canvas = document.getElementById('test-canvas');
const context = canvas.getContext('2d');

canvas.height = canvas.clientHeight * (window.devicePixelRatio || 1);
canvas.width = canvas.clientWidth * (window.devicePixelRatio || 1);

let gui = new dat.GUI();

const displayOptions = ['boundedSin', 'canvasCoordinates']
const display = { current: 'canvasCoordinates' };

const params = {
    boundedSin: {
        lineWidth: canvas.width / 100,
        resolution: 128,
        period: 1,
        yMin: -1,
        yMax: 1,
        translateX: 0,
        translateY: 0,
        inverse: false
    },
    canvasCoordinates: {
        padding: 0.05,
        orientationY: 'down'
    }
}

const draw = (name, params) => {

    context.fillStyle = 'white';
    context.fillRect(0, 0, canvas.width, canvas.height);

    switch (name) {
        case 'boundedSin': {
            context.lineWidth = params.lineWidth;
            const curve = crco.boundedSin(params.period, params.yMin, params.yMax, params.translateX, params.translateY, params.inverse);
            crco.drawLine2D(context, params.resolution, (i) => {
                return [
                    i * canvas.width,
                    canvas.height / 2 + curve(i) * (canvas.height - params.lineWidth) / 2
                ];
            });
            break;
        }
        case 'canvasCoordinates': {
            const coords = new crco.CanvasCoordinates({
                canvas,
                baseWidth: 1500,
                baseHeight: 1500,
                padding: params.padding,
                orientationY: params.orientationY
            });
            context.lineWidth = 20;
            context.fillStyle = 'black';
            context.beginPath();
            context.arc(coords.nx(-1), coords.ny(-1), 50, 0, crco.TAU);
            context.fill();
            crco.drawLine2D(context, 2, (i) => [coords.nx(-1 + 2 * i), coords.ny(-1)]);
            context.beginPath();
            context.arc(coords.nx(-1), coords.ny(-1), 50, 0, crco.TAU);
            context.fill();
            crco.drawLine2D(context, 2, (i) => [coords.nx(-1 + 2 * i), coords.ny(1)]);
            context.beginPath();
            context.arc(coords.nx(1), coords.ny(-1), 50, 0, crco.TAU);
            context.fill();
            crco.drawLine2D(context, 2, (i) => [coords.nx(-1), coords.ny(-1 + 2 * i)]);
            context.beginPath();
            context.arc(coords.nx(-1), coords.ny(1), 50, 0, crco.TAU);
            context.fill();
            crco.drawLine2D(context, 2, (i) => [coords.nx(1), coords.ny(-1 + 2 * i)]);
            context.beginPath();
            context.arc(coords.nx(1), coords.ny(1), 50, 0, crco.TAU);
            context.fill();
        }
    }


}

const updateGUI = () => {
    gui.destroy();
    gui = new dat.GUI;
    gui.add(display, 'current').options(displayOptions).onChange(updateGUI);
    switch (display.current) {
        case 'boundedSin': {
            const displayParams = params[display.current];
            const controllers = [];
            const f = gui.addFolder('drawLine2D');
            const ff = gui.addFolder('boundedSin');
            controllers.push(f.add(displayParams, 'lineWidth', 10, 100, 1));
            controllers.push(f.add(displayParams, 'resolution', 1, 256, 1));
            controllers.push(ff.add(displayParams, 'period', 0.1, 10, .1));
            controllers.push(ff.add(displayParams, 'yMin', -1, 0, .1));
            controllers.push(ff.add(displayParams, 'yMax', 0, 1, .1));
            controllers.push(ff.add(displayParams, 'translateX', -10, 10, .1));
            controllers.push(ff.add(displayParams, 'translateY', -10, 10, .1));
            controllers.push(ff.add(displayParams, 'inverse'));
            controllers.forEach((c) => c.onChange(() => draw(display.current, displayParams)));
            break;
        }
        case 'canvasCoordinates': {
            const displayParams = params[display.current];
            const controllers = [];
            const f = gui.addFolder('canvasCoordinates');
            controllers.push(f.add(displayParams, 'padding', 0, 0.5, 0.01));
            controllers.push(f.add(displayParams, 'orientationY').options(['down', 'up']));
            controllers.forEach((c) => c.onChange(() => draw(display.current, displayParams)));
            break;
        }
    }
}

draw(display.current, params[display.current]);

updateGUI()