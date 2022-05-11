const express = require("express");
const app = express();
const tf = require("@tensorflow/tfjs");
const { addN } = require("@tensorflow/tfjs");
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
    let result = model.predict(imgData);
    const ans = result.arraySync()[0];

    let index = 1;
    let max = 0;

    for (let i = 0; i < ans.length; ++i) {
        if (ans[i] > max) {
            max = ans[i];
            index = i;
        }
    }
    
    res.status(201).send(JSON.stringify({percent: max, num: index}));
});

app.listen(3000);
console.log("Listening at http://localhost:3000");