{
    const canvas = document.getElementById('fullScreenCanvas');

    let dRight = document.createElement('div'),
        pRight = document.createElement('p'),
        dLeft = document.createElement('div'),
        pLeft = document.createElement('p'),
        x, y, t, i;

    Object.assign(canvas, { 'userData': {} })

    function onWindowResize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        t = new Date().toLocaleString();
        i = 0;
        pRight.innerHTML = i + ' - ' + t;
        pLeft.innerHTML = canvas.width + ' x ' + canvas.height
        dLeft.style.opacity = 1;
    }

    function getMousePos(canvas, evt) {
        const rect = canvas.getBoundingClientRect();
        return {
            x: evt.clientX - rect.left,
            y: evt.clientY - rect.top
        };
    }

    function handleMouseMove(evt) {
        const mousePos = getMousePos(canvas, evt);
        x = mousePos.x
        y = mousePos.y
        Object.assign(canvas.userData, { 'x': x, 'y': y })
        pLeft.innerHTML = x + ', ' + y + ' | ' + canvas.width + ' x ' + canvas.height
        dLeft.style.opacity = 1;
    }

    {
        dRight.className += ' capsule'
        Object.assign(dRight.style, {
            'position': 'fixed',
            'bottom': '0px',
            'right': '0px',
            'text-align': 'right',
        })
        dRight.appendChild(pRight)
        document.body.appendChild(dRight)
    }

    {
        dLeft.className += 'capsule'
        Object.assign(dLeft.style, {
            'position': 'fixed',
            'bottom': '0px',
            'left': '0px',
            'text-align': 'left'
        })
        dLeft.appendChild(pLeft)
        document.body.appendChild(dLeft)
    }


    {
        onWindowResize()
        window.onresize = onWindowResize
    }

    canvas.addEventListener('mousemove', handleMouseMove);

    function animate() {
        i += 1;
        if (dLeft.style.opacity > 0.1) {
            dLeft.style.opacity -= 1e-2;
        }
        pRight.innerHTML = i + ' - ' + t;
        requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);

}