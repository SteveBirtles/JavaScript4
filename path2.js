let w = 0, h = 0;
const backdrop = new Image();
const spriteStrip = new Image();

let sprites = [];
let markers = [];

function fixSize() {
    w = window.innerWidth;
    h = window.innerHeight;
    const canvas = document.getElementById('pathCanvas');
    canvas.width = w;
    canvas.height = h;
}

function pageLoad() {

    window.addEventListener("resize", fixSize);
    fixSize();

    markers.push({x: 50, y: h/2});
    markers.push({x: w-50, y: h/2, d: w-100});

    backdrop.src = "greenHillZone.png";
    spriteStrip.src = "sonic.png";
    window.requestAnimationFrame(redraw);

    setInterval(addSprite, 1000);

    const canvas = document.getElementById('pathCanvas');

    canvas.addEventListener('click', event => {
        addMarker(event.clientX, event.clientY);
    }, false);

    canvas.addEventListener('contextmenu', event => {
        removeMarker();
        event.preventDefault();
    }, false);

}

function separation(b1, b2) {
    return Math.sqrt(Math.pow(b1.x - b2.x, 2) + Math.pow(b1.y - b2.y, 2));
}

function addMarker(x, y) {

    let markerAfter = markers.pop();
    let markerBefore = markers[markers.length - 1];

    let d = separation(markerBefore, {x, y});
    markers.push({x, y, d});

    markerAfter.d = separation({x, y}, markerAfter);
    markers.push(markerAfter);

}

function removeMarker() {

    if (markers.length <= 2) return;

    markers.splice(markers.length - 2, 1);

    markers[markers.length - 1].d = separation(
        markers[markers.length - 1], markers[markers.length - 2]);

}



function addSprite() {

    let x = markers[0].x;
    let y = markers[0].y;
    let r = 30;
    let v = 250;
    let frame = 0;
    let frames = 8;

    let nextMarker = 1;
    let progress = 0;

    sprites.push({x, y, r, v, frame, frames, nextMarker, progress});

}

let lastTimestamp = 0;

function redraw(timestamp) {

    const canvas = document.getElementById('pathCanvas');
    const context = canvas.getContext('2d');

    context.drawImage(backdrop,
        0,0,backdrop.width, backdrop.height,
        0,0,w,h);

    if (lastTimestamp === 0) lastTimestamp = timestamp;
    const frameLength = (timestamp - lastTimestamp) / 1000;
    lastTimestamp = timestamp;

    for (let s of sprites) {

        if (s.nextMarker >= markers.length) continue;

        let n = s.nextMarker;
        s.x = markers[n-1].x + (markers[n].x - markers[n-1].x) * s.progress;
        s.y = markers[n-1].y + (markers[n].y - markers[n-1].y) * s.progress;

        s.progress += frameLength * s.v / markers[n].d;
        if (s.progress >= 1) {
            s.nextMarker++;
            s.progress = 0;
        }

        s.frame += frameLength*10;
        if (s.frame >= s.frames) s.frame = 0;

    }

    while (sprites.length > 0) {
        if (sprites[0].nextMarker < markers.length) break;
        sprites.shift();
    }

    context.strokeStyle = 'blue';
    context.lineWidth = 3;
    context.lineCap = 'round';
    context.setLineDash([5, 10]);

    let lastMarker = null;
    for (let marker of markers) {
        if (lastMarker != null) {
            context.beginPath();
            context.moveTo(lastMarker.x, lastMarker.y);
            context.lineTo(marker.x, marker.y);
            context.stroke();
        }
        lastMarker = marker;
    }

    for (let s of sprites) {
        context.drawImage(spriteStrip, Math.floor(s.frame)*spriteStrip.width/s.frames, 0,
            spriteStrip.width, spriteStrip.height,
            s.x-s.r, s.y-s.r, s.r*2, s.r*2);
    }

    window.requestAnimationFrame(redraw);

}
