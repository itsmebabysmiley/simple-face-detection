let vdo = document.getElementById("video");
let canvas
var img = document.querySelector('img') || document.createElement('img');
const setUpCam = () => {
    navigator.mediaDevices
      .getUserMedia({
        video: { width: 720, height: 560 },
        audio: false,
      })
      .then((stream) => {
        vdo.srcObject = stream;
      });
  };

Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
    faceapi.nets.ssdMobilenetv1.loadFromUri('/models'),
    faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
    faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
]).then( ()=> {
    console.log('model loaded');
    setUpCam();
})

// tiny_face_detector options
let inputSize = 224
let scoreThreshold = 0.4
  

setUpCam();
vdo.addEventListener("loadeddata", async () => {
    // const canvas = faceapi.createCanvasFromMedia(vdo);
    // document.body.append(canvas);
    // const displaySize = {width: 720, height: 560};
    // faceapi.matchDimensions(canvas, displaySize);
    // setInterval(async () => {
    //     let detections = await faceapi.detectAllFaces(vdo, new faceapi.TinyFaceDetectorOptions({ inputSize, scoreThreshold })).withFaceLandmarks();
    //     // const detections = await faceapi.detectAllFaces(vdo, new faceapi.SsdMobilenetv1Options({minConfidence :0.5}))
    //     // .withFaceLandmarks();
    //     if(detections != null){
    //         console.log('detected something?');
    //         console.log(detections);
    //         // console.log(detections.detection._score);
    //         const resizedDetections = faceapi.resizeResults(detections, displaySize);
    //         canvas.getContext('2d').clearRect(0,0,canvas.width, canvas.height);
    //         faceapi.draw.drawDetections(canvas, resizedDetections);
    //     }
    //     console.log("can't detected");
    // }, 100)

    // setInterval(async () => {
    //   take_snapshot();
    // },1000);
});

async function take_snapshot () {
  
  var context;
  var width = video.offsetWidth
    , height = video.offsetHeight;

  canvas = canvas || document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  context = canvas.getContext('2d');
  context.drawImage(video, 0, 0, width, height);
  img.src = canvas.toDataURL('image/png');
  let results = document.getElementById('results');
  results.innerHTML = '';
  results.appendChild(img);


  let fullFaceDescriptions = await faceapi.detectAllFaces(img, new faceapi.TinyFaceDetectorOptions({ inputSize, scoreThreshold })).withFaceLandmarks().withFaceDescriptors();
  console.log(fullFaceDescriptions);
  if(fullFaceDescriptions.length>0){
    document.getElementById('results').innerHTML += `<br/> <p style="font-size: 30px; color:blue"> prob score = ${fullFaceDescriptions[0].detection._score}</p>`;
  }else{
    document.getElementById('results').innerHTML += `<br/> can't detect face`;
  }
  const displaySize = {width: 720, height: 560};
  fullFaceDescriptions = faceapi.resizeResults(fullFaceDescriptions,displaySize);
  faceapi.draw.drawDetections(canvas, fullFaceDescriptions);
  // faceapi.draw.drawLandmarks(canvas, fullFaceDescriptions);
}
