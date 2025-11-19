// ===================================
// MAIN APPLICATION ROUTER
// Handles navigation and page rendering
// ===================================

import { renderHomePage } from './pages/HomePage.js';
import { renderDetectionPage, initDetectionPage } from './pages/DetectionPage.js';
import { renderDashboardPage, initDashboardPage } from './pages/DashboardPage.js';
import { renderChatPage, initChatPage } from './pages/ChatPage.js';
import { renderSettingsPage, initSettingsPage } from './pages/SettingsPage.js';

// Current page tracker
let currentPage = 'home';

// Page configurations
const pages = {
    home: {
        render: renderHomePage,
        init: null
    },
    detection: {
        render: renderDetectionPage,
        init: initDetectionPage
    },
    dashboard: {
        render: renderDashboardPage,
        init: initDashboardPage
    },
    chat: {
        render: renderChatPage,
        init: initChatPage
    },
    settings: {
        render: renderSettingsPage,
        init: initSettingsPage
    }
};

/**
 * Navigate to a page
 * @param {string} pageName - Page identifier
 */
function navigateTo(pageName) {
    if (!pages[pageName]) {
        console.error(`Page "${pageName}" not found`);
        return;
    }

    currentPage = pageName;

    // Update navigation active state
    document.querySelectorAll('.nav-link, .mobile-nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.dataset.page === pageName) {
            link.classList.add('active');
        }
    });

    // Render page
    const appContainer = document.getElementById('app');
    appContainer.innerHTML = pages[pageName].render();

    // Initialize page if it has init function
    if (pages[pageName].init) {
        // Wait for DOM to be ready
        setTimeout(() => {
            pages[pageName].init();
        }, 0);
    }

    // Close mobile menu if open
    closeMobileMenu();

    // Scroll to top
    window.scrollTo(0, 0);

    // Update URL hash
    window.location.hash = pageName;
}

/**
 * Initialize the application
 */
function init() {
    // Setup navigation
    setupNavigation();

    // Setup mobile menu
    setupMobileMenu();

    // Load initial page from URL hash or default to home
    const hash = window.location.hash.slice(1);
    const initialPage = pages[hash] ? hash : 'home';
    navigateTo(initialPage);

    // Handle browser back/forward
    window.addEventListener('hashchange', () => {
        const page = window.location.hash.slice(1) || 'home';
        if (pages[page]) {
            navigateTo(page);
        }
    });

    console.log('✅ Emotion Detection AI Assistant initialized');
}

/**
 * Setup navigation event listeners
 */
function setupNavigation() {
    document.querySelectorAll('.nav-link, .mobile-nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = e.currentTarget.dataset.page;
            navigateTo(page);
        });
    });
}

/**
 * Setup mobile menu
 */
function setupMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');

    mobileMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });

    mobileMenuOverlay.addEventListener('click', closeMobileMenu);
}

/**
 * Close mobile menu
 */
function closeMobileMenu() {
    const mobileMenu = document.getElementById('mobile-menu');
    mobileMenu.classList.add('hidden');
}

/**
 * Show loading overlay
 */
function showLoading() {
    document.getElementById('loading-overlay').classList.remove('hidden');
}

/**
 * Hide loading overlay
 */
function hideLoading() {
    document.getElementById('loading-overlay').classList.add('hidden');
}

// Export global functions
window.navigateTo = navigateTo;
window.showLoading = showLoading;
window.hideLoading = hideLoading;

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
