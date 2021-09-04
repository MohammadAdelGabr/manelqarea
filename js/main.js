// more documentation available at
// https://github.com/tensorflow/tfjs-models/tree/master/speech-commands
let y;
// the link to your model provided by Teachable Machine export panel
const URL = "https://teachablemachine.withgoogle.com/models/u8er8X8d7/";
const readerName = document.querySelector(".reader");
let btn = document.querySelector(".how-to-work .voice .mic");

async function createModel() {
  const checkpointURL = URL + "model.json"; // model topology
  const metadataURL = URL + "metadata.json"; // model metadata
  const recognizers = speechCommands.create(
    "BROWSER_FFT", // fourier transform type, not useful to change
    undefined, // speech commands vocabulary feature, not useful for your models
    checkpointURL,
    metadataURL
  );

  // check that model and metadata are loaded via HTTPS requests.
  await recognizers.ensureModelLoaded();
  return recognizers;
}

async function init() {
  const recognizer = await createModel();
  const classLabels = recognizer.wordLabels(); // get class labels
  // listen() takes two arguments:
  // 1. A callback function that is invoked anytime a word is recognized.
  // 2. A configuration object with adjustable fields
  console.log("start");
  document.querySelector(".how-to-work .voice .mic").classList.remove("ze");
  document.querySelector(".how-to-work .voice .record").classList.add("ze");
  recognizer.listen(
    (result) => {
      const scores = result.scores; // probability of prediction for each class
      // render the probability scores per class
      let maxvalue = 0;
      let name = "";
      for (let i = 0; i < classLabels.length; i++) {
        var r = result.scores[i].toFixed(2);

        if (r > 0.75 && r > maxvalue) {
          maxvalue = r;
          name = classLabels[i];
        }
      }
      readerName.style.display = "flex";
      readerName.firstElementChild.innerHTML = name;
    },
    {
      includeSpectrogram: true, // in case listen should return result.spectrogram
      probabilityThreshold: 0.75,
      invokeCallbackOnNoiseAndUnknown: true,
      overlapFactor: 0.5, // probably want between 0.5 and 0.75. More info in README
    }
  );

  // Stop the recognition in 5 seconds.
  y = recognizer;
  // setTimeout(() => recognizer.stopListening(), 5000);
}

btn.addEventListener("click", init);

document.querySelector(".voice .record").addEventListener("click", () => {
  document.querySelector(".how-to-work .voice .record").classList.remove("ze");
  document.querySelector(".how-to-work .voice .mic").classList.add("ze");
  y.stopListening();
});
