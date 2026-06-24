const sidebar = document.querySelector("#sidebar");
const menuToggle = document.querySelector("#menuToggle");
const trackTitle = document.querySelector("#trackTitle");
const mainPlay = document.querySelector("#mainPlay");
const playableItems = document.querySelectorAll("[data-track]");

let isPlaying = false;

function setTrack(title) {
  trackTitle.textContent = title;
  isPlaying = true;
  mainPlay.textContent = "⏸";
  document.title = `${title} - Spotify Web Player UI Clone`;
}

menuToggle.addEventListener("click", () => {
  sidebar.classList.toggle("open");
});

mainPlay.addEventListener("click", () => {
  isPlaying = !isPlaying;
  mainPlay.textContent = isPlaying ? "⏸" : "▶";
});

playableItems.forEach((item) => {
  item.addEventListener("click", () => {
    const title = item.dataset.track;
    if (title) {
      setTrack(title);
    }
  });
});

document.addEventListener("click", (event) => {
  const isMenuClick = event.target.closest("#menuToggle");
  const isSidebarClick = event.target.closest("#sidebar");

  if (!isMenuClick && !isSidebarClick && sidebar.classList.contains("open")) {
    sidebar.classList.remove("open");
  }
});
