const canvas = document.getElementById('fullScreenCanvas'),
    context = canvas.getContext('2d');
console.log(canvas, context)


const ControlOptions = {
    boolean1: true,
    fun1: function () { alert(ControlOptions) },
    text1: 'Text-1',
    property1: 'Property-1',
    num1: 1,
    time1: 0,
    color1: '#c77f7f',
}

const stats = new Stats();
{
    stats.showPanel(0); // 0: FPS, 1: MS (Rendering time), 2: MB (Memory)
    document.body.appendChild(stats.dom)
}

import('/node_modules/lil-gui/dist/lil-gui.esm.min.js').then(module => {
    const { GUI } = module,
        gui = new GUI({ title: 'Controls (lil-gui)' }),
        defaultFolder = gui.addFolder('Default setup'),
        numberFolder = gui.addFolder('Number setups'),
        colorFolder = gui.addFolder('Color setups'),
        // Create color pickers for multiple color formats
        colorFormats = {
            string: '#c77f7f',
        };

    function onChange() {
        console.log('LilGui changed')
    }

    gui.onChange(onChange)

    // Running timer
    defaultFolder.add(ControlOptions, 'time1', -1, 1).listen().disable()
    {
        function cb() {
            stats.update()
            ControlOptions.time1 = Math.cos(Date.now() / 1000)

            // context.clearRect(0, 0, canvas.width, canvas.height)
            context.fillStyle = ControlOptions.color1
            context.fillRect(0, 0, canvas.width, canvas.height)
            context.fillStyle = 'white'
            context.font = parseInt(canvas.width / 80) + 'px serif'
            context.fillText(Date().toLocaleString(), 100, 100)
            requestAnimationFrame(cb)
        }
        requestAnimationFrame(cb)
    }

    // Chainable methods
    gui.add(ControlOptions, 'property1')
        .name('Chainable setup')
        .onChange(value => {
            alert(`Setup to ${value}`);
        });

    for (let key in colorFormats) {
        colorFolder.addColor(colorFormats, key).onChange(value => {
            console.log(`${key} = ${value}`)
            ControlOptions.color1 = value
        });
    }

    // Default controls
    defaultFolder.add(ControlOptions, 'boolean1');  // Checkbox
    defaultFolder.add(ControlOptions, 'fun1').name('Click to call myFunction'); // Button
    defaultFolder.add(ControlOptions, 'text1');   // Text Field
    numberFolder.add(ControlOptions, 'num1');   // Number Field
});