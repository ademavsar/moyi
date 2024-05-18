document.addEventListener('DOMContentLoaded', () => {
    const videoPlayer = document.getElementById('videoPlayer');
    const dropZone = document.getElementById('dropZone');
    const videoInfo = document.getElementById('videoInfo');
    const prevButton = document.getElementById('prevButton');
    const nextButton = document.getElementById('nextButton');

    let videoFiles = [];
    let currentVideoIndex = 0;

    function updateVideoInfo() {
        videoInfo.textContent = `${currentVideoIndex + 1}/${videoFiles.length}`;
    }

    function playVideo(index) {
        if (videoFiles[index]) {
            const fileURL = URL.createObjectURL(videoFiles[index]);
            videoPlayer.src = fileURL;
            currentVideoIndex = index;
            updateVideoInfo();
        }
    }

    videoPlayer.addEventListener('click', () => {
        if (videoPlayer.paused) {
            videoPlayer.play();
        } else {
            videoPlayer.pause();
        }
    });

    dropZone.addEventListener('dragover', (event) => {
        event.preventDefault();
        dropZone.style.borderColor = '#fff';
    });

    dropZone.addEventListener('dragleave', () => {
        dropZone.style.borderColor = '#ccc';
    });

    dropZone.addEventListener('drop', (event) => {
        event.preventDefault();
        dropZone.style.borderColor = '#ccc';
        const files = Array.from(event.dataTransfer.files);
        const videoFilesArray = files.filter(file => file.type.startsWith('video/'));

        if (videoFilesArray.length > 0) {
            videoFiles = videoFiles.concat(videoFilesArray);
            updateVideoInfo();
            playVideo(0);  // İlk videoyu otomatik olarak yükle
        }
    });

    prevButton.addEventListener('click', () => {
        if (currentVideoIndex > 0) {
            playVideo(currentVideoIndex - 1);
        }
    });

    nextButton.addEventListener('click', () => {
        if (currentVideoIndex < videoFiles.length - 1) {
            playVideo(currentVideoIndex + 1);
        }
    });

    updateVideoInfo();
});
