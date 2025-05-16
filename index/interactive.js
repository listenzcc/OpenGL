const stats = new Stats();
stats.showPanel(0); // 0: FPS, 1: MS (Rendering time), 2: MB (Memory)
document.getElementById('glCanvas').parentElement.appendChild(stats.dom)
console.log('Append stats')

const myObject = {
    myBoolean: true,
    myFunction: function () { alert(myObject) },
    myString: 'lil-gui',
    myNumber: 1,
    myProperty: 'my-property',
    myTime: 0,
};

function callback() {
    stats.update()
    myObject.myTime = Math.cos(Date.now() / 1000)
    requestAnimationFrame(callback)
}
requestAnimationFrame(callback)

import('/node_modules/lil-gui/dist/lil-gui.esm.min.js').then(module => {
    const { GUI } = module,
        gui = new GUI({ title: 'Controls (lil-gui)' }),
        outputDiv = document.getElementById('controlsOutputArea'),
        defaultFolder = gui.addFolder('Default setup'),
        numberFolder = gui.addFolder('Number setups'),
        colorFolder = gui.addFolder('Color setups'),
        // Create color pickers for multiple color formats
        colorFormats = {
            string: '#f30303',
            int: 0x02a2af,
            object: { r: 0.1, g: 0.3, b: 0.5 },
            array: [0.84, 0.93, 0.14]
        };

    function cb() {
        let innerHTML = '';
        for (let key in myObject) {
            innerHTML += `<p>${key}: ${myObject[key]}</p>`
        }
        outputDiv.innerHTML = innerHTML;
        outputDiv.style.color = colorFormats.string;
    }

    gui.onChange(cb)
    cb()

    // Running timer
    gui.add(myObject, 'myTime', -1, 1).listen().disable()

    // Chainable methods
    gui.add(myObject, 'myProperty')
        .name('Chainable setup')
        .onChange(value => {
            alert(`Setup to ${value}`);
        });


    for (let key in colorFormats) {
        colorFolder.addColor(colorFormats, key).onChange(value => {
            console.log(`${key} = ${value}`)
            outputDiv.style.color = value;
        });
    }

    // Default controls
    defaultFolder.add(myObject, 'myBoolean');  // Checkbox
    defaultFolder.add(myObject, 'myFunction').name('Click to call myFunction'); // Button
    defaultFolder.add(myObject, 'myString');   // Text Field
    defaultFolder.add(myObject, 'myNumber');   // Number Field


    // Add sliders to number fields by passing min and max
    numberFolder.add(myObject, 'myNumber', 0, 1);
    numberFolder.add(myObject, 'myNumber', 0, 100, 2); // snap to even numbers

    // Create dropdowns by passing an array or object of named values
    numberFolder.add(myObject, 'myNumber', [0, 1, 2]);
    numberFolder.add(myObject, 'myNumber', { setTo0: 0, setTo1: 1, setTo314: 3.14 });


});