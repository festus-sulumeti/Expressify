// This function starts the camera and shows the video container
function getStarted() {
    const video = document.getElementById('video');
    const videoContainer = document.getElementById('video-container');
    videoContainer.style.display = 'block'; // Show the video container

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: true }).then(function(stream) {
            video.srcObject = stream;
            video.play();
            window.currentStream = stream; // Store the current stream
        }).catch(function(error) {
            console.error("Error accessing the camera: ", error);
            alert("Error accessing the camera. Please make sure it's enabled.");
        });
    } else {
        alert("Sorry, your browser does not support accessing the camera.");
    }
}

// This function stops the camera stream and hides the video container
function closeCamera() {
    const videoContainer = document.getElementById('video-container');
    videoContainer.style.display = 'none'; // Hide the video container

    if (window.currentStream) {
        window.currentStream.getTracks().forEach(track => track.stop()); // Stop the video stream
    }
}
