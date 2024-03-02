from flask import Flask, render_template, request, send_from_directory, redirect, url_for
import os

app = Flask(__name__)

VIDEO_FOLDER = os.path.join(os.path.dirname(__file__), 'deck')
# Desteklenen video formatları listesi
supported_video_formats = ['.mkv', '.mp4', '.avi']

def get_video_files():
    video_files = []
    for f in os.listdir(VIDEO_FOLDER):
        if any(f.endswith(format) for format in supported_video_formats):
            video_files.append(f)
    return sorted(video_files)

videos = get_video_files()

def load_subtitles(video_file):
    # .mkv yerine video dosyasının uzantısını kaldır
    subtitle_file = os.path.splitext(video_file)[0] + '.srt'
    subtitles = []
    try:
        with open(os.path.join(VIDEO_FOLDER, subtitle_file), 'r', encoding='utf-8') as file:
            subtitle_parts = file.read().split('\n\n')  # Her bir alt yazı bloğunu ayır
            for part in subtitle_parts:
                lines = part.split('\n')
                if len(lines) >= 3:
                    time_range = lines[1].split(' --> ')
                    start_time = convert_to_seconds(time_range[0])
                    end_time = convert_to_seconds(time_range[1])
                    text = ' '.join(lines[2:])  # Tüm alt yazı satırlarını birleştir
                    subtitles.append({'start': start_time, 'end': end_time, 'text': text})
    except FileNotFoundError:
        pass
    return subtitles

def convert_to_seconds(time_str):
    parts = time_str.replace(',', ':').split(':')
    hours, minutes, seconds = map(int, parts[:3])
    milliseconds = int(parts[3]) if len(parts) > 3 else 0
    return hours * 3600 + minutes * 60 + seconds + milliseconds / 1000.0

@app.route('/')
def index():
    video_index = request.args.get('video_index', 0, type=int)
    if not videos:
        return render_template('done.html', image_file='done.gif')
    video_index = video_index % len(videos)
    video = videos[video_index]
    subtitles = load_subtitles(video)
    next_index = (video_index + 1) % len(videos)
    prev_index = (video_index - 1) % len(videos)
    return render_template('index.html', video=video, subtitles=subtitles, next_index=next_index, prev_index=prev_index, total=len(videos), current=video_index + 1)

@app.route('/hide_video/<int:video_index>')
def hide_video(video_index):
    if 0 <= video_index < len(videos):
        del videos[video_index]
        return redirect(url_for('index', video_index=video_index))
    else:
        return redirect(url_for('index'))

@app.route('/video/<filename>')
def video(filename):
    return send_from_directory(VIDEO_FOLDER, filename)

if __name__ == '__main__':
    app.run(debug=False)
