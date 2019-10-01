let w = 0, h = 0;
const ballImage = new Image();

let balls = [];
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

    ballImage.src = "ball.png";
    ballImage.onload = () => window.requestAnimationFrame(redraw);

    setInterval(addBall, 1000);

}

function addBall() {

    let x = markers[0].x;
    let y = markers[0].y;
    let r = 30;
    let v = 250;

    let nextMarker = 1;
    let progress = 0;

    balls.push({x, y, r, v, nextMarker, progress});

}

let lastTimestamp = 0;

function redraw(timestamp) {

    const canvas = document.getElementById('pathCanvas');
    const context = canvas.getContext('2d');

    context.fillStyle = '#000088';
    context.fillRect(0, 0, w, h);

    if (lastTimestamp === 0) lastTimestamp = timestamp;
    const frameLength = (timestamp - lastTimestamp) / 1000;
    lastTimestamp = timestamp;

    for (let b of balls) {
        context.drawImage(ballImage, 0,0, ballImage.width, ballImage.height, 						b.x-b.r, b.y-b.r, b.r*2, b.r*2);
    }

    window.requestAnimationFrame(redraw);

}
