/* Shared logo + menu trigger cursor followers (homepage behavior) */
(function () {
  if (window.__gatoradeCursorBound) return;
  window.__gatoradeCursorBound = true;

  function shouldSkip() {
    return (
      document.documentElement.classList.contains('is-touch') ||
      window.matchMedia('(hover: none), (pointer: coarse)').matches ||
      window.matchMedia('(max-width: 1280px)').matches
    );
  }

  function bindFollower(target, cursorEl) {
    if (!target || !cursorEl) return;
    var mouseX = 0;
    var mouseY = 0;
    var cursorX = 0;
    var cursorY = 0;
    var isHovering = false;

    function updateCursor() {
      if (!isHovering) return;
      cursorX += (mouseX - cursorX) * 0.15;
      cursorY += (mouseY - cursorY) * 0.15;
      cursorEl.style.left = cursorX + 'px';
      cursorEl.style.top = cursorY + 'px';
      requestAnimationFrame(updateCursor);
    }

    target.addEventListener('mouseenter', function (e) {
      isHovering = true;
      cursorEl.classList.add('is-active');
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursorX = mouseX;
      cursorY = mouseY;
      cursorEl.style.left = cursorX + 'px';
      cursorEl.style.top = cursorY + 'px';
      updateCursor();
    });

    target.addEventListener('mousemove', function (e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    target.addEventListener('mouseleave', function () {
      isHovering = false;
      cursorEl.classList.remove('is-active');
    });
  }

  function init() {
    if (shouldSkip()) {
      document.querySelectorAll('.menu-trigger-cursor, .page-logo-cursor').forEach(function (el) {
        el.style.display = 'none';
      });
      return;
    }

    var menuTrigger = document.querySelector('.menu-trigger-container');
    var menuCursor = document.querySelector('.menu-trigger-cursor');
    if (menuTrigger && menuCursor && !menuTrigger.dataset.gCursorBound) {
      menuTrigger.dataset.gCursorBound = '1';
      bindFollower(menuTrigger, menuCursor);
    }

    var pageLogo = document.querySelector('.page-logo__item');
    var pageLogoCursor = document.querySelector('.page-logo-cursor');
    if (pageLogo && pageLogoCursor && !pageLogo.dataset.gCursorBound) {
      pageLogo.dataset.gCursorBound = '1';
      bindFollower(pageLogo, pageLogoCursor);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
