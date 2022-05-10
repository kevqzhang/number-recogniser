const express = require("express");
const app = express();
const tf = require("@tensorflow/tfjs");
require("@tensorflow/tfjs-node")

app.use(express.static(__dirname + "/static"));
app.set("views", "pages");

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/static/index.html");
}); 

app.post("/imgData", express.json(), async (req, res) => {
    let imgArray = req.body.data;
    const imgData = tf.tensor(imgArray, [1, 28, 28, 1]);
    const model = await tf.loadLayersModel(
        "file://C:/Users/kcraf/Desktop/Untitled Workspace/Machine learning/number-recogniser/static/model/model.json"
    );
    model.predict(imgData).print();
    res.status(201).send(JSON.stringify({data: "hi"}));
});

app.listen(3000);
console.log("Listening at http://localhost:3000");