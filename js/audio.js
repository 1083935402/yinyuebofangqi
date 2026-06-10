// ============================================================
// 音乐播放器 - 核心逻辑
// ============================================================

// ---------- 播放列表数据 ----------
const BASE = 'sucai';
const playlist = [
  {
    title: '洛春赋',
    author: '云汐',
    mp3: BASE + '/mp3/music0.mp3',
    mp4: BASE + '/mp4/video0.mp4',
    bg: BASE + '/img/bg0.png',
    record: BASE + '/img/record0.jpg'
  },
  {
    title: 'Yesterday',
    author: 'The Beatles',
    mp3: BASE + '/mp3/music1.mp3',
    mp4: BASE + '/mp4/video1.mp4',
    bg: BASE + '/img/bg1.png',
    record: BASE + '/img/record1.jpg'
  },
  {
    title: '江南烟雨色',
    author: '未知歌手',
    mp3: BASE + '/mp3/music2.mp3',
    mp4: BASE + '/mp4/video2.mp4',
    bg: BASE + '/img/bg2.png',
    record: BASE + '/img/record2.jpg'
  },
  {
    title: 'Vision pt.II',
    author: '未知歌手',
    mp3: BASE + '/mp3/music3.mp3',
    mp4: BASE + '/mp4/video3.mp4',
    bg: BASE + '/img/bg3.png',
    record: BASE + '/img/record3.jpg'
  }
];

// ---------- DOM 元素 ----------
const audio = document.getElementById('audioTag');
const recordImg = document.getElementById('record-img');
const musicTitle = document.getElementById('music-title');
const authorName = document.getElementById('author-name');
const playedTimeEl = document.getElementById('playedTime');
const audioTimeEl = document.getElementById('audioTime');
const progressBar = document.getElementById('progress');
const progressTotal = document.getElementById('progress-total');
const playPauseBtn = document.getElementById('playPause');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const playModeBtn = document.getElementById('playMode');
const volumeBtn = document.getElementById('volumeIcon');
const volumeSlider = document.getElementById('volumn-togger');
const listBtn = document.getElementById('listBtn');
const musicListEl = document.getElementById('music-list');
const speedBtn = document.getElementById('speed');
const mvBtn = document.getElementById('MV');
const mvModal = document.getElementById('mv-modal');
const mvCloseBtn = document.getElementById('mv-close');
const mvVideo = document.getElementById('mv-video');
const mvProgressTotal = document.getElementById('mv-progress-total');
const mvProgressBar = document.getElementById('mv-progress-bar');
const mvPlayedTime = document.getElementById('mv-played-time');
const mvTotalTime = document.getElementById('mv-total-time');
const mvPlayPauseBtn = document.getElementById('mv-play-pause');
const mvSpeedBtn = document.getElementById('mv-speed');
const songItems = [
  document.getElementById('music0'),
  document.getElementById('music1'),
  document.getElementById('music2'),
  document.getElementById('music3')
];

// ---------- 状态 ----------
let currentIndex = 0;
let isPlaying = false;
let playMode = 1;          // 0 = 顺序播放, 1 = 循环播放, 2 = 单曲循环
let playbackSpeed = 1.0;
let isMuted = false;
let lastVolume = 70;
let isMVOpen = false;

// 播放模式对应的图标
const modeIcons = [
  BASE + '/img/mode1.png',  // 顺序播放
  BASE + '/img/mode2.png',  // 循环播放
  BASE + '/img/mode3.png'   // 单曲循环
];

// ============================================================
// 辅助函数
// ============================================================

function formatTime(seconds) {
  if (isNaN(seconds) || seconds < 0) return '00:00';
  var total = Math.floor(seconds);
  var h = Math.floor(total / 3600);
  total %= 3600;
  var m = Math.floor(total / 60);
  var s = total % 60;

  function pad(n) { return n < 10 ? '0' + n : '' + n; }

  if (h > 0) {
    return pad(h) + ':' + pad(m) + ':' + pad(s);
  }
  return pad(m) + ':' + pad(s);
}

function getActiveMedia() {
  return isMVOpen ? mvVideo : audio;
}

// ============================================================
// 歌曲加载
// ============================================================

function loadSong(index) {
  currentIndex = index;
  var song = playlist[index];

  // 更新信息
  musicTitle.textContent = song.title;
  authorName.textContent = song.author;

  // 更新背景
  document.body.style.backgroundImage = 'url("' + song.bg + '")';

  // 更新唱片图片
  recordImg.style.backgroundImage = 'url("' + song.record + '")';

  // 更新播放列表高亮
  songItems.forEach(function(el, i) {
    el.style.color = i === index ? '#ffd700' : '#ddd';
    el.style.fontWeight = i === index ? 'bold' : 'normal';
  });

  // 加载音频
  audio.src = song.mp3;
  audio.load();

  // 如果MV开着，也切换MV视频源
  if (isMVOpen) {
    mvVideo.src = song.mp4;
    mvVideo.load();
  }
}

function loadAndPlay(index) {
  loadSong(index);
  playAudio();
}

function playAudio() {
  var promise = audio.play();
  if (promise !== undefined) {
    promise.then(function() {
      isPlaying = true;
      updatePlayPauseIcon();
      recordImg.classList.add('rotate-play');
    }).catch(function(err) {
      console.log('播放失败:', err);
      isPlaying = false;
      updatePlayPauseIcon();
      recordImg.classList.remove('rotate-play');
    });
  }
}

// ============================================================
// 播放/暂停
// ============================================================

function togglePlay() {
  if (isMVOpen) {
    toggleMVPlay();
    return;
  }

  if (isPlaying) {
    audio.pause();
    isPlaying = false;
    recordImg.classList.remove('rotate-play');
  } else {
    playAudio();
  }
  updatePlayPauseIcon();
}

function updatePlayPauseIcon() {
  if (isPlaying) {
    playPauseBtn.style.backgroundImage = 'url("' + BASE + '/img/暂停.png")';
  } else {
    playPauseBtn.style.backgroundImage = 'url("' + BASE + '/img/继续播放.png")';
  }
}

// ============================================================
// 上一首 / 下一首
// ============================================================

function playNext() {
  var nextIndex;
  if (playMode === 2) {
    nextIndex = currentIndex;
  } else {
    nextIndex = (currentIndex + 1) % playlist.length;
  }
  loadAndPlay(nextIndex);
}

function playPrev() {
  var prevIndex;
  if (audio.currentTime > 3) {
    prevIndex = currentIndex;
  } else {
    prevIndex = (currentIndex - 1 + playlist.length) % playlist.length;
  }
  loadAndPlay(prevIndex);
}

// ============================================================
// 进度条
// ============================================================

function updateProgress() {
  var media = getActiveMedia();
  if (isNaN(media.duration)) return;

  var pct = (media.currentTime / media.duration) * 100;
  progressBar.style.width = pct + '%';
  playedTimeEl.textContent = formatTime(media.currentTime);
}

function updateDuration() {
  var media = getActiveMedia();
  if (!isNaN(media.duration)) {
    audioTimeEl.textContent = formatTime(media.duration);
  }
}

function seekProgress(e) {
  var media = getActiveMedia();
  if (isNaN(media.duration)) return;

  var rect = progressTotal.getBoundingClientRect();
  var pct = (e.clientX - rect.left) / rect.width;
  pct = Math.max(0, Math.min(1, pct));
  media.currentTime = pct * media.duration;
  progressBar.style.width = (pct * 100) + '%';
}

// ============================================================
// 音量控制
// ============================================================

function setVolume(val) {
  lastVolume = val;
  audio.volume = val / 100;
  mvVideo.volume = val / 100;
  volumeSlider.value = val;

  if (val === 0) {
    isMuted = true;
  } else {
    isMuted = false;
  }
  updateVolumeIcon();
}

function toggleMute() {
  if (isMuted) {
    // 取消静音
    setVolume(lastVolume > 0 ? lastVolume : 70);
  } else {
    // 静音
    lastVolume = audio.volume * 100;
    audio.volume = 0;
    mvVideo.volume = 0;
    isMuted = true;
    volumeSlider.value = 0;
    updateVolumeIcon();
  }
}

function updateVolumeIcon() {
  if (isMuted || audio.volume === 0) {
    volumeBtn.style.backgroundImage = 'url("' + BASE + '/img/静音.png")';
  } else {
    volumeBtn.style.backgroundImage = 'url("' + BASE + '/img/音量.png")';
  }
}

// ============================================================
// 播放模式切换
// ============================================================

function togglePlayMode() {
  playMode = (playMode + 1) % 3;
  playModeBtn.style.backgroundImage = 'url("' + modeIcons[playMode] + '")';

  var tips = ['顺序播放', '循环播放', '单曲循环'];
  playModeBtn.title = tips[playMode];
}

// ============================================================
// 播放列表显示/隐藏
// ============================================================

function togglePlaylist() {
  if (musicListEl.classList.contains('show-list')) {
    musicListEl.classList.remove('show-list');
  } else {
    musicListEl.classList.add('show-list');
  }
}

function selectSong(index) {
  if (index === currentIndex && isPlaying) return;
  loadAndPlay(index);
}

// ============================================================
// 播放速度
// ============================================================

var speeds = [0.5, 0.75, 1.0, 1.25, 1.5, 2.0];

function changeSpeed() {
  var curIdx = speeds.indexOf(playbackSpeed);
  var nextIdx = (curIdx + 1) % speeds.length;
  playbackSpeed = speeds[nextIdx];

  audio.playbackRate = playbackSpeed;
  mvVideo.playbackRate = playbackSpeed;

  var display = playbackSpeed.toFixed(2).replace(/0+$/, '').replace(/\.$/, '.0') + 'X';
  speedBtn.textContent = display;
  mvSpeedBtn.textContent = display;
}

// MV 专用：倍速切换
function changeMVSpeed() {
  changeSpeed();
}

// MV 专用：进度条拖拽
function seekMVProgress(e) {
  if (isNaN(mvVideo.duration)) return;
  var rect = mvProgressTotal.getBoundingClientRect();
  var pct = (e.clientX - rect.left) / rect.width;
  pct = Math.max(0, Math.min(1, pct));
  mvVideo.currentTime = pct * mvVideo.duration;
  mvProgressBar.style.width = (pct * 100) + '%';
}

// ============================================================
// MV 播放
// ============================================================

function openMV() {
  isMVOpen = true;
  mvModal.style.display = 'flex';

  // 设置 MV 控件初始状态
  mvProgressBar.style.width = '0%';
  mvPlayedTime.textContent = '00:00';
  mvTotalTime.textContent = '00:00';
  mvSpeedBtn.textContent = playbackSpeed.toFixed(1) + 'X';
  updateMVPlayPauseIcon();

  // 清除旧的监听器，避免重复绑定
  mvVideo.removeEventListener('timeupdate', onMVTimeUpdate);

  // 加载当前歌曲的MV
  mvVideo.src = playlist[currentIndex].mp4;
  mvVideo.load();

  // 同步进度（一次性）
  mvVideo.addEventListener('loadedmetadata', function syncMV() {
    mvVideo.removeEventListener('loadedmetadata', syncMV);
    mvVideo.currentTime = audio.currentTime;
    mvVideo.playbackRate = playbackSpeed;
    mvVideo.volume = audio.volume;
    updateMVTotalTime();
    updateDuration();

    if (isPlaying) {
      mvVideo.play().catch(function() {});
      audio.pause();
    }
  });

  // 持续同步进度条
  mvVideo.addEventListener('timeupdate', onMVTimeUpdate);
}

function onMVTimeUpdate() {
  if (!isMVOpen) return;
  updateProgress();

  // 更新 MV 专用进度条
  if (!isNaN(mvVideo.duration)) {
    var pct = (mvVideo.currentTime / mvVideo.duration) * 100;
    mvProgressBar.style.width = pct + '%';
    mvPlayedTime.textContent = formatTime(mvVideo.currentTime);
  }
}

function updateMVTotalTime() {
  if (!isNaN(mvVideo.duration)) {
    mvTotalTime.textContent = formatTime(mvVideo.duration);
  }
}

function closeMV(shouldResume) {
  isMVOpen = false;
  mvModal.style.display = 'none';

  // 同步回音频
  audio.currentTime = mvVideo.currentTime;
  audio.playbackRate = playbackSpeed;
  mvVideo.removeEventListener('timeupdate', onMVTimeUpdate);
  mvVideo.pause();
  mvVideo.src = '';

  updateDuration();

  // 手动关闭时恢复播放，MV自然结束时由ended事件处理
  if (shouldResume && isPlaying) {
    playAudio();
  }
}

function updateMVPlayPauseIcon() {
  if (mvVideo.paused) {
    mvPlayPauseBtn.style.backgroundImage = 'url("' + BASE + '/img/继续播放.png")';
    mvPlayPauseBtn.style.backgroundSize = '20px';
  } else {
    mvPlayPauseBtn.style.backgroundImage = 'url("' + BASE + '/img/暂停.png")';
    mvPlayPauseBtn.style.backgroundSize = '20px';
  }
}

function toggleMVPlay() {
  if (mvVideo.paused) {
    mvVideo.play().catch(function() {});
    isPlaying = true;
    updatePlayPauseIcon();
    updateMVPlayPauseIcon();
    recordImg.classList.add('rotate-play');
  } else {
    mvVideo.pause();
    isPlaying = false;
    updatePlayPauseIcon();
    updateMVPlayPauseIcon();
    recordImg.classList.remove('rotate-play');
  }
}

// ============================================================
// 事件监听
// ============================================================

// 音频事件
audio.addEventListener('timeupdate', function() {
  if (isMVOpen) return;
  updateProgress();
});

audio.addEventListener('loadedmetadata', updateDuration);

audio.addEventListener('ended', function() {
  if (playMode === 2) {
    // 单曲循环
    audio.currentTime = 0;
    playAudio();
  } else if (playMode === 1) {
    // 循环播放
    playNext();
  } else {
    // 顺序播放：最后一首播完停止
    if (currentIndex >= playlist.length - 1) {
      isPlaying = false;
      updatePlayPauseIcon();
      recordImg.classList.remove('rotate-play');
      audio.currentTime = 0;
    } else {
      playNext();
    }
  }
});

audio.addEventListener('play', function() {
  isPlaying = true;
  updatePlayPauseIcon();
  recordImg.classList.add('rotate-play');
});

audio.addEventListener('pause', function() {
  if (!isMVOpen) {
    isPlaying = false;
    updatePlayPauseIcon();
    recordImg.classList.remove('rotate-play');
  }
});

// MV视频事件
mvVideo.addEventListener('ended', function() {
  closeMV(false);
  if (playMode === 2) {
    audio.currentTime = 0;
    playAudio();
  } else if (playMode === 1) {
    playNext();
  } else {
    if (currentIndex >= playlist.length - 1) {
      isPlaying = false;
      updatePlayPauseIcon();
      recordImg.classList.remove('rotate-play');
    } else {
      playNext();
    }
  }
});

mvVideo.addEventListener('play', function() {
  recordImg.classList.add('rotate-play');
  updateMVPlayPauseIcon();
});

mvVideo.addEventListener('pause', function() {
  updateMVPlayPauseIcon();
  if (!isMVOpen) {
    recordImg.classList.remove('rotate-play');
  }
});

// MV 专用控件事件
mvPlayPauseBtn.addEventListener('click', togglePlay);
mvSpeedBtn.addEventListener('click', changeMVSpeed);

// MV 进度条点击
mvProgressTotal.addEventListener('click', seekMVProgress);

// 按钮事件
playPauseBtn.addEventListener('click', togglePlay);
prevBtn.addEventListener('click', playPrev);
nextBtn.addEventListener('click', playNext);
listBtn.addEventListener('click', togglePlaylist);
playModeBtn.addEventListener('click', togglePlayMode);
speedBtn.addEventListener('click', changeSpeed);
volumeBtn.addEventListener('click', toggleMute);

// 音量滑块
volumeSlider.addEventListener('input', function() {
  setVolume(parseInt(this.value));
});

// 进度条点击
progressTotal.addEventListener('click', seekProgress);

// 进度条拖拽（主播放器 + MV共用）
var isDragging = false;
var isMVDragging = false;

progressTotal.addEventListener('mousedown', function(e) {
  isDragging = true;
  seekProgress(e);
});

mvProgressTotal.addEventListener('mousedown', function(e) {
  isMVDragging = true;
  seekMVProgress(e);
});

document.addEventListener('mousemove', function(e) {
  if (isDragging) {
    seekProgress(e);
  }
  if (isMVDragging) {
    seekMVProgress(e);
  }
});

document.addEventListener('mouseup', function() {
  isDragging = false;
  isMVDragging = false;
});

// 播放列表点击
songItems.forEach(function(el, i) {
  el.addEventListener('click', function() {
    selectSong(i);
  });
});

// MV按钮
mvBtn.addEventListener('click', openMV);
mvCloseBtn.addEventListener('click', function() { closeMV(true); });

// 点击MV遮罩关闭
mvModal.addEventListener('click', function(e) {
  if (e.target === mvModal) {
    closeMV(true);
  }
});

// ============================================================
// 键盘快捷键
// ============================================================

document.addEventListener('keydown', function(e) {
  // 防止在输入框中触发
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

  switch (e.key) {
    case ' ':
      e.preventDefault();
      togglePlay();
      break;
    case 'ArrowRight':
      e.preventDefault();
      getActiveMedia().currentTime += 5;
      break;
    case 'ArrowLeft':
      e.preventDefault();
      getActiveMedia().currentTime -= 5;
      break;
    case 'ArrowUp':
      e.preventDefault();
      setVolume(Math.min(100, (audio.volume * 100) + 5));
      break;
    case 'ArrowDown':
      e.preventDefault();
      setVolume(Math.max(0, (audio.volume * 100) - 5));
      break;
    case 'm':
    case 'M':
      if (!e.ctrlKey && !e.metaKey) {
        toggleMute();
      }
      break;
    case 'Escape':
      if (isMVOpen) {
        closeMV(true);
      }
      break;
  }
});

// ============================================================
// 初始化
// ============================================================

function init() {
  audio.volume = lastVolume / 100;
  mvVideo.volume = lastVolume / 100;
  volumeSlider.value = lastVolume;
  updateVolumeIcon();
  updatePlayPauseIcon();
  playModeBtn.style.backgroundImage = 'url("' + modeIcons[playMode] + '")';
  speedBtn.textContent = playbackSpeed.toFixed(1) + 'X';
  loadSong(0);
}

init();
