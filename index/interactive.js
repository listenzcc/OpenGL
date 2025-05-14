const stats = new Stats();
stats.showPanel(0); // 0: FPS, 1: MS (Rendering time), 2: MB (Memory)
stats.dom.style.left = ''
stats.dom.style.right = '0px'
document.getElementById('glCanvas').parentElement.appendChild(stats.dom)
console.log('Append stats')

const myObject = {
    myBoolean: true,
    myFunction: function () { console.log(myObject) },
    myString: 'lil-gui',
    myNumber: 1
};

setInterval(() => {
    console.log(myObject)
    stats.update()
}, 1000)

// import { GUI } from '/node_modules/lil-gui/dist/lil-gui.esm.min.js';
// console.log(GUI)
import('/node_modules/lil-gui/dist/lil-gui.esm.min.js').then(module => {
    console.log(module)
    const { GUI } = module;
    console.log(GUI)
    console.log('--')
    const gui = new GUI();


    gui.add(myObject, 'myBoolean');  // Checkbox
    gui.add(myObject, 'myFunction'); // Button
    gui.add(myObject, 'myString');   // Text Field
    gui.add(myObject, 'myNumber');   // Number Field

    // Add sliders to number fields by passing min and max
    gui.add(myObject, 'myNumber', 0, 1);
    gui.add(myObject, 'myNumber', 0, 100, 2); // snap to even numbers

    // Create dropdowns by passing an array or object of named values
    gui.add(myObject, 'myNumber', [0, 1, 2]);
    gui.add(myObject, 'myNumber', { Label1: 0, Label2: 1, Label3: 2 });

    // Chainable methods
    // gui.add(myObject, 'myProperty')
    //     .name('Custom Name')
    //     .onChange(value => {
    //         console.log(value);
    //     });

    // Create color pickers for multiple color formats
    const colorFormats = {
        string: '#ffffff',
        int: 0xffffff,
        object: { r: 1, g: 1, b: 1 },
        array: [1, 1, 1]
    };

    gui.addColor(colorFormats, 'string');
});