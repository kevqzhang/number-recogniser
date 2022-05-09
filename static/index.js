const model = tf.sequential();

window.addEventListener("load", () => {

    const hidden1 = tf.layers.dense({
        units: 16,             
        inputShape: [784, 1],  
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

    trainModel();

    document.addEventListener("mousedown", startPainting);
    document.addEventListener("mouseup", stopPainting);
    document.addEventListener("mousemove", sketch);
    document.getElementById("erase").addEventListener("click", eraseCanvas);
    document.getElementById("predict").addEventListener("click", predict);

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
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if(this.readyState == 4 && this.status == 200) {
            let responseObject = JSON.parse(xhttp.responseText);
            let mnist = responseObject.data;
            let inputs = []
            let outputs = []

            for (let i = 0; i < mnist.length; ++i) {
                inputs[i] = mnist[i].input;
                outputs[i] = mnist[i].output;
            }

            const xs = tf.tensor2d(inputs);
            const ys = tf.tensor2d(outputs);

            model.fit(xs, ys, {
                shuffle: true,
                epochs: 1000
            });
        }
    };
    xhttp.open("GET", "http://localhost:3000/getTrainingData");
    xhttp.send();
}

function predict() {
    
    const res = tf.tidy(() => {
        ctx.drawImage(canvas, 0, 0, 28, 28);
        let imageData = ctx.getImageData(0, 0, 28, 28);
        let img = tf.browser.fromPixels(imageData, 1);
        img = img.reshape([784]);
        img = tf.cast(img, "float32");
        model.predict(img).print();
    });
}