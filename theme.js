(() => {
  var theme = 'light';

  try {
    theme = localStorage.getItem('solea-theme') === 'dark'
      ? 'dark'
      : 'light';
  } catch (error) {
    console.log('Theme storage is unavailable');
  }

  document.documentElement.dataset.theme = theme;

  document.addEventListener('DOMContentLoaded', () => {
    var button = document.createElement('button');

    button.type = 'button';
    button.className = 'theme-toggle';

    function applyTheme() {
      document.documentElement.dataset.theme = theme;

      button.textContent = theme === 'dark'
        ? '☀ DAY MODE'
        : '☾ NIGHT MODE';

      button.setAttribute('aria-pressed', theme === 'dark');
      button.setAttribute(
        'aria-label',
        theme === 'dark'
          ? 'Switch to day mode'
          : 'Switch to night mode'
      );
    }

    button.addEventListener('click', () => {
      theme = theme === 'light' ? 'dark' : 'light';

      applyTheme();

      try {
        localStorage.setItem('solea-theme', theme);
      } catch (error) {
        console.log('Theme could not be saved');
      }
    });

    document.body.appendChild(button);
    applyTheme();
  });
})();