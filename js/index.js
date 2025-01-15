function getStarted() {
    const video = document.getElementById('video');
    const videoContainer = document.getElementById('video-container');
    videoContainer.style.display = 'block';

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: true }).then(function(stream) {
            video.srcObject = stream;
            video.play();
        }).catch(function(error) {
            console.error("Error accessing the camera: ", error);
        });
    } else {
        alert("Sorry, your browser does not support accessing the camera.");
    }
}