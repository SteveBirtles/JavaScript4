let w = 0, h = 0;
const spriteStrip = new Image();
const backdrop = new Image();

function fixSize() {
    w = window.innerWidth;
    h = window.innerHeight;
    const canvas = document.getElementById('pathCanvas');
    canvas.width = w;
    canvas.height = h;
}

let sprites = [];
let markers = [];

function pageLoad() {

    window.addEventListener("resize", fixSize);
    fixSize();

    markers.push({x: 50, y: h/2});
    markers.push({x: w-50, y: h/2, d: w-100});

    spriteStrip.src = "sonic.png";
    backdrop.src = "greenHillZone.png";

    window.requestAnimationFrame(redraw);

    setInterval(addSprite, 1000);

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

    context.drawImage(backdrop, 0, 0, backdrop.width, backdrop.height, 0, 0, w, h);

    if (lastTimestamp === 0) lastTimestamp = timestamp;
    const frameLength = (timestamp - lastTimestamp) / 1000;
    lastTimestamp = timestamp;

    for (let s of sprites) {
        context.drawImage(spriteStrip,
            Math.floor(s.frame)*spriteStrip.width/s.frames, 0,
            spriteStrip.width/s.frames, spriteStrip.height,
            s.x-s.r, s.y-s.r, s.r*2, s.r*2);
    }

    window.requestAnimationFrame(redraw);

}
