const tf = require("@tensorflow/tfjs");
const mnist = require("mnist");
require("@tensorflow/tfjs-node");

const TRAINING_DATA_BATCHSIZE = 8000
const TESTING_DATA_BATCHSIZE = 10;

const model = tf.sequential();

model.add(tf.layers.flatten({
    inputShape: [28, 28, 1],  
}));
model.add(tf.layers.dense({
    units: 128,             
    activation: "sigmoid"
}));
model.add(tf.layers.dense({
    units: 128,             
    activation: "sigmoid"
}));
model.add(tf.layers.dense({
    units: 10,
    activation: "sigmoid"
}));

model.compile({
    optimizer: "adam",
    loss: tf.losses.meanSquaredError
});

const set = mnist.set(TRAINING_DATA_BATCHSIZE, TESTING_DATA_BATCHSIZE);
const trainingSet = set.training;
const testingSet = set.test;

let inputs = [], outputs = [];
let testX = [], testY = [];

for (let i = 0; i < trainingSet.length; ++i) {
    inputs[i] = trainingSet[i].input;
    outputs[i] = trainingSet[i].output;
}
for (let i = 0; i < testingSet.length; ++i) {
    testX[i] = testingSet[i].input;
    testY[i] = testingSet[i].output;
}

const xs = tf.tensor(inputs, [TRAINING_DATA_BATCHSIZE, 28, 28, 1]);
const ys = tf.tensor2d(outputs);

const test = tf.tensor(testX, [TESTING_DATA_BATCHSIZE, 28, 28, 1]);

model.fit(xs, ys, {
    shuffle: true,
    epochs: 100
}).then(() => {
    model.predict(test).print();
    console.log(testY);
    model.save("file://" + __dirname + "/static/model");
});