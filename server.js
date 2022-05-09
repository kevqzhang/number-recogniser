const express = require("express");
const app = express();

app.use(express.static(__dirname + "/static"));
app.set("views", "pages");

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/static/index.html");
}); 

app.get("/getTrainingData", (req, res) => {

});

app.listen(3000);
console.log("Listening at http://localhost:3000");