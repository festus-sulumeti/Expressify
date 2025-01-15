async function getStarted() {
    const video = document.getElementById('video');
    const videoContainer = document.getElementById('video-container');
    videoContainer.style.display = 'block'; // Show the video container

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            video.srcObject = stream;
            video.play();
            window.currentStream = stream; // Store the current stream

            // Load face-api.js models
            await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
            await faceapi.nets.faceExpressionNet.loadFromUri('/models');
            await faceapi.nets.ageGenderNet.loadFromUri('/models');

            // Start detecting expressions and gender
            detectExpressionsAndGender(video);
        } catch (error) {
            console.error("Error accessing the camera: ", error);
            alert("Error accessing the camera. Please make sure it's enabled.");
        }
    } else {
        alert("Sorry, your browser does not support accessing the camera.");
    }
}

function closeCamera() {
    const videoContainer = document.getElementById('video-container');
    videoContainer.style.display = 'none'; // Hide the video container

    if (window.currentStream) {
        window.currentStream.getTracks().forEach(track => track.stop()); // Stop the video stream
    }
}

async function detectExpressionsAndGender(video) {
    const displaySize = { width: video.width, height: video.height };
    faceapi.matchDimensions(video, displaySize);

    setInterval(async () => {
        const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceExpressions().withAgeAndGender();
        const resizedDetections = faceapi.resizeResults(detections, displaySize);

        // Clear previous detections
        const canvas = document.getElementById('overlay');
        const context = canvas.getContext('2d');
        context.clearRect(0, 0, canvas.width, canvas.height);

        // Draw new detections
        faceapi.draw.drawDetections(canvas, resizedDetections);
        faceapi.draw.drawFaceExpressions(canvas, resizedDetections);

        // Draw age and gender
        resizedDetections.forEach(detection => {
            const { age, gender, genderProbability } = detection;
            new faceapi.draw.DrawTextField(
                [`${faceapi.utils.round(age, 0)} years`, `${gender} (${faceapi.utils.round(genderProbability)})`],
                detection.detection.box.bottomRight
            ).draw(canvas);
        });
    }, 100);
}
