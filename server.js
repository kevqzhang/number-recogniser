const express = require("express");
const app = express();
const mnist = require("mnist");

app.use(express.static(__dirname + "/static"));
app.set("views", "pages");

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/static/index.html");
}); 

app.get("/getTrainingData", (req, res) => {
    const set = mnist.set(8000, 2000);
    const trainingSet = set.training;
    res.send({data: trainingSet});
});

app.listen(3000);
console.log("Listening at http://localhost:3000");