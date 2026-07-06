(function () {
  const toggle = document.querySelector('.nav-toggle');
  const menu = document.querySelector('.nav-menu');

  if (toggle && menu) {
    toggle.addEventListener('click', function () {
      menu.classList.toggle('active');
    });

    document.querySelectorAll('.nav-menu a').forEach(function (link) {
      link.addEventListener('click', function () {
        menu.classList.remove('active');
      });
    });
  }

  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  function readVisitorNumber(id) {
    const node = document.getElementById(id);
    if (!node) return 0;
    const value = Number(node.textContent.replace(/[^0-9]/g, ''));
    return Number.isFinite(value) ? value : 0;
  }

  function syncVisitorChart() {
    const pv = readVisitorNumber('busuanzi_value_site_pv');
    const uv = readVisitorNumber('busuanzi_value_site_uv');
    if (!pv && !uv) return false;

    document.querySelectorAll('[data-visitor-value="pv"]').forEach(function (node) {
      node.textContent = pv.toLocaleString();
    });
    document.querySelectorAll('[data-visitor-value="uv"]').forEach(function (node) {
      node.textContent = uv.toLocaleString();
    });

    document.querySelectorAll('.visitor-bars').forEach(function (chart) {
      const bars = chart.querySelectorAll('span');
      const seed = Math.max(pv, uv, 1);
      const heights = [0.26, 0.38, 0.34, 0.55, 0.48, 0.72, 0.9].map(function (ratio, index) {
        const lift = ((seed + index * 13) % 9) / 100;
        return Math.round((ratio + lift) * 100);
      });
      bars.forEach(function (bar, index) {
        bar.style.setProperty('--bar-height', Math.min(95, heights[index]) + '%');
      });
    });
    return true;
  }

  let visitorSyncAttempts = 0;
  const visitorSyncTimer = window.setInterval(function () {
    visitorSyncAttempts += 1;
    if (syncVisitorChart() || visitorSyncAttempts > 20) {
      window.clearInterval(visitorSyncTimer);
    }
  }, 500);
})();
