const players = [...document.querySelectorAll("[data-player]")];

function formatTime(value) {
  if (!Number.isFinite(value)) return "00:00";

  const totalSeconds = Math.max(0, Math.floor(value));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }

  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

players.forEach((player) => {
  const video = player.querySelector(".demo-video");
  const timeline = player.querySelector(".timeline");
  const timeDisplay = player.querySelector(".time-display");
  const speed = player.querySelector(".speed");
  const backward = player.querySelector(".backward");
  const forward = player.querySelector(".forward");
  const status = player.querySelector(".status");
  let userIsSeeking = false;

  function updateTimeDisplay(currentTime = video.currentTime) {
    timeDisplay.value = `${formatTime(currentTime)} / ${formatTime(video.duration)}`;
  }

  video.addEventListener("loadedmetadata", () => {
    timeline.max = String(video.duration);
    updateTimeDisplay();
    status.textContent = "可拖动进度 · 当前 1.0×";
  });

  video.addEventListener("play", () => {
    players.forEach((otherPlayer) => {
      if (otherPlayer !== player) otherPlayer.querySelector(".demo-video").pause();
    });
  });

  video.addEventListener("timeupdate", () => {
    if (!userIsSeeking) timeline.value = String(video.currentTime);
    updateTimeDisplay(userIsSeeking ? Number(timeline.value) : video.currentTime);
  });

  timeline.addEventListener("pointerdown", () => {
    userIsSeeking = true;
  });

  timeline.addEventListener("input", () => {
    userIsSeeking = true;
    updateTimeDisplay(Number(timeline.value));
  });

  timeline.addEventListener("change", () => {
    video.currentTime = Number(timeline.value);
    userIsSeeking = false;
  });

  timeline.addEventListener("pointerup", () => {
    video.currentTime = Number(timeline.value);
    userIsSeeking = false;
  });

  speed.addEventListener("change", () => {
    video.playbackRate = Number(speed.value);
    status.textContent = `可拖动进度 · 当前 ${speed.options[speed.selectedIndex].text}`;
  });

  backward.addEventListener("click", () => {
    video.currentTime = Math.max(0, video.currentTime - 10);
  });

  forward.addEventListener("click", () => {
    video.currentTime = Math.min(video.duration || Infinity, video.currentTime + 10);
  });

  video.addEventListener("error", () => {
    status.textContent = "视频加载失败。请检查网络，或确认托管地址能直接访问 MP4 文件。";
  });
});
