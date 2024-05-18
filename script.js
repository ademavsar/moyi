document.addEventListener('DOMContentLoaded', () => {
    const videoPlayer = document.getElementById('videoPlayer');
    const dropZone = document.getElementById('dropZone');
    const videoInfo = document.getElementById('videoInfo');
    const prevButton = document.getElementById('prevButton');
    const nextButton = document.getElementById('nextButton');
    const prevSubtitleButton = document.getElementById('prevSubtitleButton');
    const nextSubtitleButton = document.getElementById('nextSubtitleButton');
    const textContainer = document.getElementById('textContainer');

    let videoFiles = [];
    let subtitleFiles = {};
    let currentVideoIndex = 0;
    let subtitles = [];
    let subtitleInterval;
    let currentSubtitleText = ''; // Mevcut altyazı metni

    function updateVideoInfo() {
        videoInfo.textContent = `${currentVideoIndex + 1}/${videoFiles.length}`;
    }

    function updateSubtitleDisplay() {
        const videoFile = videoFiles[currentVideoIndex];
        const subtitleFile = subtitleFiles[videoFile.name];

        if (subtitleFile) {
            const reader = new FileReader();
            reader.onload = (event) => {
                subtitles = parseSRT(event.target.result);
                textContainer.style.display = 'flex';
                startSubtitleSync();
            };
            reader.readAsText(subtitleFile);
        } else {
            subtitles = [];
            textContainer.innerHTML = 'No subtitles available';
            startSubtitleSync();
        }
    }

    function parseSRT(data) {
        const regex = /(\d+)\s+(\d{2}:\d{2}:\d{2},\d{3}) --> (\d{2}:\d{2}:\d{2},\d{3})\s+([\s\S]*?)(?=\n\d+\s|\n*$)/g;
        const subtitles = [];
        let match;
        while ((match = regex.exec(data)) !== null) {
            subtitles.push({
                start: timeToMs(match[2]),
                end: timeToMs(match[3]),
                text: match[4].trim().replace(/\n/g, '<br>')
            });
        }
        return subtitles;
    }

    function timeToMs(time) {
        const [hours, minutes, seconds] = time.split(':');
        const [secs, millis] = seconds.split(',');
        return (+hours) * 60 * 60 * 1000 + (+minutes) * 60 * 1000 + (+secs) * 1000 + (+millis);
    }

    function showSubtitles() {
        const currentTime = videoPlayer.currentTime * 1000;
        const subtitle = subtitles.find(sub => currentTime >= sub.start && currentTime <= sub.end);
        if (subtitle && subtitle.text !== currentSubtitleText) {
            textContainer.innerHTML = subtitle.text;
            currentSubtitleText = subtitle.text;
        } else if (!subtitle && currentSubtitleText !== '') {
            textContainer.innerHTML = '';
            currentSubtitleText = '';
        }
    }

    function startSubtitleSync() {
        if (subtitleInterval) {
            clearInterval(subtitleInterval);
        }
        subtitleInterval = setInterval(showSubtitles, 100);
    }

    function stopSubtitleSync() {
        if (subtitleInterval) {
            clearInterval(subtitleInterval);
        }
    }

    function loadVideo(index, autoplay = false) {
        if (videoFiles[index]) {
            const fileURL = URL.createObjectURL(videoFiles[index]);
            videoPlayer.src = fileURL;
            currentVideoIndex = index;
            updateVideoInfo();
            updateSubtitleDisplay();
            if (autoplay) {
                videoPlayer.play();
            }
        }
    }

    function jumpToSubtitle(direction) {
        if (subtitles.length === 0) return;
        const currentTime = videoPlayer.currentTime * 1000;
        let targetSubtitle;

        if (direction === 'prev') {
            targetSubtitle = subtitles.slice().reverse().find(sub => sub.end < currentTime);
        } else if (direction === 'next') {
            targetSubtitle = subtitles.find(sub => sub.start > currentTime);
        }

        if (targetSubtitle) {
            videoPlayer.currentTime = targetSubtitle.start / 1000;
            showSubtitles();
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
        const subtitleFilesArray = files.filter(file => file.name.endsWith('.srt'));

        if (videoFilesArray.length > 0) {
            videoFiles = videoFiles.concat(videoFilesArray);
            videoFilesArray.forEach(videoFile => {
                const matchingSubtitleFile = subtitleFilesArray.find(subFile => subFile.name === videoFile.name.replace(/\.[^/.]+$/, '') + '.srt');
                if (matchingSubtitleFile) {
                    subtitleFiles[videoFile.name] = matchingSubtitleFile;
                }
            });
            updateVideoInfo();
            loadVideo(0);  // İlk videoyu yükle, ancak otomatik olarak oynatma
        } else {
            textContainer.innerHTML = 'No subtitles available';
            textContainer.style.display = 'flex';
        }
    });

    prevButton.addEventListener('click', () => {
        if (currentVideoIndex > 0) {
            loadVideo(currentVideoIndex - 1, true);
        }
    });

    nextButton.addEventListener('click', () => {
        if (currentVideoIndex < videoFiles.length - 1) {
            loadVideo(currentVideoIndex + 1, true);
        }
    });

    prevSubtitleButton.addEventListener('click', () => jumpToSubtitle('prev'));
    nextSubtitleButton.addEventListener('click', () => jumpToSubtitle('next'));

    updateVideoInfo();
});