const video = document.getElementById("video");

Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri("./js-face-api-model/models"),
  faceapi.nets.faceLandmark68Net.loadFromUri("./js-face-api-model/models"),
  faceapi.nets.faceExpressionNet.loadFromUri("./js-face-api-model/models"),
]).then(startVideo());
async function startVideo() {
  console.log("start working");
  let stream = null;
  try {
    stream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: true,
    });
    video.srcObject = stream;
  } catch (error) {
    alert("Unable to connect device");
    console.log(error);
  }
}

video.addEventListener("play", () => {
  const canvas = faceapi.createCanvasFromMedia(video);
  document.body.append(canvas);
  const canvasDim = { width: video.width, height: video.height };
  faceapi.matchDimensions(canvas, canvasDim);
  setInterval(async () => {
    const faceDetection = await faceapi
      .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceExpressions();
    //   console.log(faceDetection);
    const resizeFaceDetection = faceapi.resizeResults(faceDetection, canvasDim);
    canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
    faceapi.draw.drawDetections(canvas, resizeFaceDetection);
    faceapi.draw.drawFaceLandmarks(canvas, resizeFaceDetection);
    faceapi.draw.drawFaceExpressions(canvas, resizeFaceDetection);
  }, 100);
});
