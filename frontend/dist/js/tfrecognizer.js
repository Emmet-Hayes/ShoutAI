let recognizer;

const NUM_FRAMES = 7; // One frame is ~23ms of audio.
let examples = [];

///////////////////////////////////////////////////////
// Collect audio data for recognizer to retrain on
///////////////////////////////////////////////////////

function collect(label) {
    if (recognizer.isListening()) {
        return recognizer.stopListening();
    }
    if (label == null) {
        return;
    }
    recognizer.listen(async ({spectrogram: {frameSize, data}}) => {
        let vals = normalize(data.subarray(-frameSize * NUM_FRAMES));
        examples.push({vals, label});
        document.querySelector('#console').textContent = `${examples.length} examples collected`;
    }, {
        overlapFactor: 0.999,
        includeSpectrogram: true,
        invokeCallbackOnNoiseAndUnknown: true
    });
}

function normalize(x) {
    const mean = -100;
    const std = 10;
    return x.map(x => (x - mean) / std);
}

//////////////////////////////////////////////////////////////
// Retrain the model to recognize different set of inputs
//////////////////////////////////////////////////////////////

const INPUT_SHAPE = [NUM_FRAMES, 232, 1];
let model;
const NUM_COMMANDS = 5;

async function train() {
    toggleButtons(false);
    const ys = tf.oneHot(examples.map(e => e.label), NUM_COMMANDS);
    const xsShape = [examples.length, ...INPUT_SHAPE];
    const xs = tf.tensor(flatten(examples.map(e => e.vals)), xsShape);

    await model.fit(xs, ys, {
        batchSize: 16,
        epochs: 10,
        callbacks: {
            onEpochEnd: (epoch, logs) => {
                document.querySelector('#console').textContent =
                    `Accuracy: ${(logs.acc * 100).toFixed(1)}% Epoch: ${epoch + 1}`;
            }
        }
    });
    tf.dispose([xs, ys]);
    await model.save('indexeddb://speech-model');
    toggleButtons(true);
}

function buildModel() {
    model = tf.sequential();
    model.add(tf.layers.depthwiseConv2d({
        depthMultiplier: 8,
        kernelSize: [NUM_FRAMES, NUM_COMMANDS],
        activation: 'relu',
        inputShape: INPUT_SHAPE
    }));
    model.add(tf.layers.maxPooling2d({poolSize: [1, 2], strides: [2, 2]}));
    model.add(tf.layers.flatten());
    model.add(tf.layers.dense({units: NUM_COMMANDS, activation: 'softmax'}));
    const optimizer = tf.train.adam(0.01);
    model.compile({
        optimizer,
        loss: 'categoricalCrossentropy',
        metrics: ['accuracy']
    });
    return model;
}

function toggleButtons(enable) {
    document.querySelectorAll('button').forEach(b => b.disabled = !enable);
}

function flatten(tensors) {
    const size = tensors[0].length;
    const result = new Float32Array(tensors.length * size);
    tensors.forEach((arr, i) => result.set(arr, i * size));
    return result;
}

////////////////////////////////////////////////////////////
//  Update Player in real-time based on voice input
////////////////////////////////////////////////////////////

async function moveMazePlayer(labelTensor) {
    const label = (await labelTensor.data())[0];
    document.getElementById('console').textContent = label;

    // move the player in the direction detected by the tensorflowJS model
    switch (label) {
        case 0: // down
            if (y + dy < HEIGHT) {
                y += dy;
                checkcollision();
                checkwincondition();
                if (collision == 1) {
                    y -= dy;
                    collision = 0;
                }
            }
            break;
        case 1: // left
            if (x - dx > 0) {
                x -= dx;
                checkcollision();
                checkwincondition();
                if (collision == 1){
                    x += dx;
                    collision = 0;
                }
            }
            break;
        case 2: // right
            if (x + dx < WIDTH) {
                x += dx;
                checkcollision();
                checkwincondition();
                if (collision == 1){
                    x -= dx;
                    collision = 0;
                }
            }
            break;
        case 3: // up
            if (y - dy > 0) {
                y -= dy;
                checkcollision();
                checkwincondition();
                if (collision == 1) {
                    y += dy;
                    collision = 0;
                }
            }
            break;

        default:;
    }
}

function listen() {
    if (recognizer.isListening()) {
        recognizer.stopListening();
        toggleButtons(true);
        document.getElementById('listen').textContent = 'Listen';
        return;
    }
    toggleButtons(false);
    document.getElementById('listen').textContent = 'Stop';
    document.getElementById('listen').disabled = false;

    recognizer.listen(async ({spectrogram: {frameSize, data}}) => {
        const vals = normalize(data.subarray(-frameSize * NUM_FRAMES));
        const input = tf.tensor(vals, [1, ...INPUT_SHAPE]);
        const probs = model.predict(input);
        const predLabel = probs.argMax(1);
        await moveMazePlayer(predLabel);
        tf.dispose([input, probs, predLabel]);
    }, {
        overlapFactor: 0.999,
        includeSpectrogram: true,
        invokeCallbackOnNoiseAndUnknown: true
    });
}

async function app() {
    recognizer = speechCommands.create('BROWSER_FFT', 'directional4w');
    await recognizer.ensureModelLoaded();
    await buildModel();
}

app();