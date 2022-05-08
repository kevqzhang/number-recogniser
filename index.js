const model = tf.sequential();

const hidden1 = tf.layers.dense({
    units: 16,             
    inputShape: [784],  
    activation: "sigmoid"
});
const hidden2 = tf.layers.dense({
    units: 16,             
    inputShape: [16],  
    activation: "sigmoid"
});
const output = tf.layers.dense({
    units: 10,
    activation: "sigmoid"
});

model.add(hidden1);
model.add(hidden2);
model.add(output);

model.compile({
    optimizer: tf.train.sgd(0.1),
    loss: tf.losses.meanSquaredError
});

window.addEventListener("load", () => {
    document.addEventListener("mousedown", startPainting);
    document.addEventListener("mouseup", stopPainting);
    document.addEventListener("mousemove", sketch);
    document.getElementById("erase").addEventListener("click", eraseCanvas);
    document.getElementById("predict").addEventListener("click", predict);
    
    trainModel();
});

const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d");

let coord = {x: 0, y: 0};
let paint = false;

function getPosition(event) {
    coord.x = event.clientX - canvas.offsetLeft;
    coord.y = event.clientY - canvas.offsetTop;
}

function startPainting(event) {
    paint = true;
    getPosition(event);
}

function stopPainting(event) {
    paint = false;
}
function sketch(event) {
    if (!paint) return;
    ctx.beginPath();
    ctx.lineWidth = 5;

    ctx.lineCap = "round";
    ctx.strokeStyle = "black";
    
    ctx.moveTo(coord.x, coord.y);
    getPosition(event);
    ctx.lineTo(coord.x, coord.y);

    ctx.stroke();
}

function eraseCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function trainModel() {
    
}

function predict() {
    const test = tf.tensor1d([1,2,3]);
    test.print();
    
    const res = tf.tidy(() => {
        ctx.drawImage(canvas, 0, 0, 28, 28);
        let imageData = ctx.getImageData(0, 0, 28, 28);
        let img = tf.browser.fromPixels(imageData, 1);
        console.log(img);
        img = img.reshape([1, 28, 28, 1]);
        img = tf.cast(img, "float32");
    });
}