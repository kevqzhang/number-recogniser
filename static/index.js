window.addEventListener("load", () => {

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
    ctx.lineWidth = 20;

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

function predict() {
    
    const res = tf.tidy(() => {
        ctx.drawImage(canvas, 0, 0, 28, 28);
        
        let imageData = ctx.getImageData(0, 0, 28, 28);
        let img = tf.browser.fromPixels(imageData, 1);

        img = img.reshape([1, 28, 28, 1]);
        img = tf.cast(img, "float32");
        img.array().then((result) => {
            let req = new XMLHttpRequest()
            req.onreadystatechange = function(){
                if(this.readyState == 4 && this.status == 201){
                    console.log(this.responseText);
                }
            }
            req.open("POST", "http://localhost:3000/imgData");
            req.setRequestHeader("Content-Type", "application/json");
            req.send(JSON.stringify({data: result}));
        });
    });
}