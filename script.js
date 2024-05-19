document.addEventListener('DOMContentLoaded', () => {
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');
    const videoPlayer = document.getElementById('videoPlayer');
    const videoInfo = document.getElementById('videoInfo');
    const prevButton = document.getElementById('prevButton');
    const nextButton = document.getElementById('nextButton');
    const prevSubtitleButton = document.getElementById('prevSubtitleButton');
    const nextSubtitleButton = document.getElementById('nextSubtitleButton');
    const randomButton = document.getElementById('randomButton');
    const hideVideoButton = document.getElementById('hideVideoButton');
    const togglePlayPauseButton = document.getElementById('togglePlayPauseButton');
    const textContainer = document.getElementById('textContainer');
    const container = document.querySelector('.container');
    const browse = document.getElementById('browse');
    const toggleTextContainerButton = document.getElementById('toggleTextContainerButton');
    const themeToggleButton = document.querySelector('.toggle-switch .checkbox'); // Tema geçiş butonu

    let videoFiles = [];
    let subtitleFiles = {};
    let currentVideoIndex = 0;
    let subtitles = [];
    let subtitleInterval;
    let currentSubtitleText = '';
    let isTextContainerVisible = true;

    // Video oynatıcıdaki kontrolleri gizle
    videoPlayer.controls = false;

    // Mouse sol tık işlevi (oynat/duraklat)
    videoPlayer.addEventListener('click', () => {
        if (videoPlayer.paused) {
            videoPlayer.play();
            togglePlayPauseButton.querySelector('img').src = 'images/pauseButton.svg'; // Simgeyi güncelle
        } else {
            videoPlayer.pause();
            togglePlayPauseButton.querySelector('img').src = 'images/playButton.svg'; // Simgeyi güncelle
        }
    });

    // Tema geçişi
    themeToggleButton.addEventListener('change', () => {
        if (themeToggleButton.checked) {
            document.body.classList.add('light-theme');
            document.body.classList.remove('dark-theme');
        } else {
            document.body.classList.add('dark-theme');
            document.body.classList.remove('light-theme');
        }
    });

    // Tema geçişi için başlangıç ayarı
    if (themeToggleButton.checked) {
        document.body.classList.add('light-theme');
    } else {
        document.body.classList.add('dark-theme');
    }

    // textContainer Göster/Gizle Butonu
    toggleTextContainerButton.addEventListener('click', () => {
        if (textContainer.style.display === 'none' || textContainer.style.display === '') {
            textContainer.style.display = 'flex';
            isTextContainerVisible = true;
        } else {
            textContainer.style.display = 'none';
            isTextContainerVisible = false;
        }
    });

    // Play/Pause butonu işlevselliği
    togglePlayPauseButton.addEventListener('click', () => {
        if (videoPlayer.paused) {
            videoPlayer.play();
            togglePlayPauseButton.querySelector('img').src = 'images/pauseButton.svg'; // Simgeyi güncelle
        } else {
            videoPlayer.pause();
            togglePlayPauseButton.querySelector('img').src = 'images/playButton.svg'; // Simgeyi güncelle
        }
    });

    // Geçerli videoyu gizle butonu
    hideVideoButton.addEventListener('click', () => {
        if (videoFiles[currentVideoIndex]) {
            videoFiles.splice(currentVideoIndex, 1);
            if (currentVideoIndex >= videoFiles.length) {
                currentVideoIndex = videoFiles.length - 1;
            }
            if (videoFiles.length > 0) {
                loadVideo(currentVideoIndex, true);
            } else {
                videoPlayer.src = '';
                textContainer.innerHTML = '';
                videoInfo.textContent = '0/0';
                // Tüm videolar gizlendiğinde dropZone ekranına dön
                container.style.display = 'none';
                dropZone.style.display = 'flex';
            }
            updateVideoInfo();
        }
    });

    browse.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', (event) => handleFiles(Array.from(event.target.files)));

    function handleFiles(files) {
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
            loadVideo(0, false);
            dropZone.style.display = 'none';
            container.style.display = 'block';
        } else {
            textContainer.innerHTML = 'No subtitles available';
            textContainer.style.display = 'flex';
        }
    }

    function updateVideoInfo() {
        videoInfo.textContent = `${currentVideoIndex + 1}/${videoFiles.length}`;
        videoInfo.title = videoFiles[currentVideoIndex] ? videoFiles[currentVideoIndex].name : '';
    }

    function updateSubtitleDisplay() {
        const videoFile = videoFiles[currentVideoIndex];
        const subtitleFile = subtitleFiles[videoFile.name];

        if (subtitleFile) {
            const reader = new FileReader();
            reader.onload = (event) => {
                subtitles = parseSRT(event.target.result);
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
            currentSubtitleText = ''; // Yine de currentSubtitleText'i boşalt
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
            // textContainer'ın görünürlük durumunu ayarla
            if (isTextContainerVisible) {
                textContainer.style.display = 'flex';
            } else {
                textContainer.style.display = 'none';
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

    function jumpToRandomVideo() {
        if (videoFiles.length > 1) {
            let randomIndex;
            do {
                randomIndex = Math.floor(Math.random() * videoFiles.length);
            } while (randomIndex === currentVideoIndex);
            loadVideo(randomIndex, true);
        }
    }

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
        handleFiles(files);
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

    randomButton.addEventListener('click', jumpToRandomVideo);

    prevSubtitleButton.addEventListener('click', () => jumpToSubtitle('prev'));
    nextSubtitleButton.addEventListener('click', () => jumpToSubtitle('next'));

    updateVideoInfo();
});