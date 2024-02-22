from flask import Flask, render_template, request, send_from_directory, redirect, url_for
import os
import re
import webbrowser
import threading
from PIL import Image
import pystray
from pystray import MenuItem as item
import requests

app = Flask(__name__)

VIDEO_FOLDER = os.path.join(os.path.dirname(__file__), 'deck')
videos = sorted([f for f in os.listdir(VIDEO_FOLDER) if f.endswith('.mkv')])

def load_subtitles(video_file):
    subtitle_file = video_file.replace('.mkv', '.srt')
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

@app.route('/shutdown', methods=['POST'])
def shutdown():
    func = request.environ.get('werkzeug.server.shutdown')
    if func is None:
        raise RuntimeError('Not running with the Werkzeug Server')
    func()
    return 'Server shutting down...'

@app.route('/')
def index():
    video_index = request.args.get('video_index', 0, type=int)
    if not videos:
        return render_template('done.html', image_file='tebriks.gif')
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

def open_browser():
    webbrowser.open_new('http://127.0.0.1:5000/')

def on_exit(icon, item):
    icon.stop()
    requests.post('http://127.0.0.1:5000/shutdown')
    os._exit(0)

def setup_tray_icon():
    icon_image = Image.open(os.path.join(os.path.dirname(__file__), 'static/favicon/favicon.ico'))
    menu = (item('Exit', on_exit),)
    icon = pystray.Icon("moyi", icon_image, "moyi Application", menu)
    icon.run()

if __name__ == '__main__':
    threading.Thread(target=open_browser).start()
    threading.Thread(target=lambda: app.run(debug=False)).start()
    setup_tray_icon()
