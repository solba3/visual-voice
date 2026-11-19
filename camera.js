// Answers page: shows the webcam in the <video> inside #container.
// It starts on page load; the "start" button tries again, e.g. after the
// person allowed the camera they had first blocked.

const cameraVideo = document.querySelector('#container video');
cameraVideo.autoplay = true;
cameraVideo.muted = true;
cameraVideo.playsInline = true; // play in the page on iPhones, not fullscreen

let cameraStream = null;

async function startCamera() {
  if (cameraStream) return; // already running

  // Only available on https:// pages, localhost, or files opened directly.
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    console.warn('Camera is not available on this page.');
    return;
  }

  try {
    cameraStream = await navigator.mediaDevices.getUserMedia({
      video: { width: 320, height: 240 }
    });
    cameraVideo.srcObject = cameraStream;
  } catch (err) {
    console.error('Could not start the camera:', err); // blocked, or no camera found
  }
}

document.getElementById('start').addEventListener('click', startCamera);

startCamera();
