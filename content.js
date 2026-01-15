////////////////////////////////////////////////////////////////////////////////
// Show blocked.html when trying to access YT shorts
////////////////////////////////////////////////////////////////////////////////

function checkAndBlock() {
  if (window.location.pathname.startsWith('/shorts')) {
    window.location.replace(chrome.runtime.getURL('blocked.html'));
  }
}

checkAndBlock();

let lastUrl = location.href;
new MutationObserver(() => {
  const currentUrl = location.href;
  if (currentUrl !== lastUrl) {
    lastUrl = currentUrl;
    checkAndBlock();
  }
}).observe(document, { subtree: true, childList: true });

////////////////////////////////////////////////////////////////////////////////
// Remove the shorts button from the sidebar
////////////////////////////////////////////////////////////////////////////////

function removeShortsFromSidebar() {
  const shortsLink = document.querySelector('a[title="Shorts"]#endpoint');
  if (shortsLink) {
    const sidebarEntry = shortsLink.closest('ytd-guide-entry-renderer');
    if (sidebarEntry) {
      sidebarEntry.remove();
    }
  }
}

// Wait for body to exist, then start observing
if (document.body) {
  removeShortsFromSidebar();
  new MutationObserver(() => {
    removeShortsFromSidebar();
  }).observe(document.body, { childList: true, subtree: true });
} else {
  document.addEventListener('DOMContentLoaded', () => {
    removeShortsFromSidebar();
    new MutationObserver(() => {
      removeShortsFromSidebar();
    }).observe(document.body, { childList: true, subtree: true });
  });
}

////////////////////////////////////////////////////////////////////////////////
// Remove ytd-browse element on home page and inject message
////////////////////////////////////////////////////////////////////////////////

function removeYtdBrowse() {
  const ytdBrowseHome = document.querySelector('ytd-browse[page-subtype="home"]');
  const existingMessage = document.getElementById('freedom-message-injected');
  
  // Check if we're actually on the home page by looking at the URL
  const isHomePage = window.location.pathname === '/' || window.location.pathname === '/home';
  
  // If on home page and message doesn't exist, inject it
  if (isHomePage && ytdBrowseHome && !existingMessage) {
    const message = document.createElement('div');
    message.id = 'freedom-message-injected';
    message.style.cssText = 'width: 100%; padding-top: 100px; text-align: center; font-size: 24px; color: white;';
    message.innerHTML = '<h1>Auto-suggest ruins lives. Be FREE!</h1>';
    ytdBrowseHome.replaceWith(message);
  }
  
  // Remove message only if we're NOT on the home page anymore
  if (!isHomePage && existingMessage) {
    existingMessage.remove();
  }
}

// Wait for body to exist, then start observing
if (document.body) {
  removeYtdBrowse();
  const observer = new MutationObserver(() => {
    removeYtdBrowse();
  });
  observer.observe(document.body, { childList: true, subtree: true });
} else {
  document.addEventListener('DOMContentLoaded', () => {
    removeYtdBrowse();
    const observer = new MutationObserver(() => {
      removeYtdBrowse();
    });
    observer.observe(document.body, { childList: true, subtree: true });
  });
}