// Runs before React renders so the page never flashes the wrong theme.
(function () {
  var saved = null;
  try {
    saved = JSON.parse(localStorage.getItem('codearena:theme'));
  } catch (e) {
    saved = null;
  }
  var dark = saved ? saved === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
  document.documentElement.classList.toggle('dark', dark);
})();
