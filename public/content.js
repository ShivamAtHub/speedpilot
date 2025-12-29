// Content script to control YouTube playback speed

(function () {
    'use strict';

    let currentSpeed = 2.0;
    let isEnabled = true;
    let smartResume = true;
    let videoObserver = null;
    let lastVideoSrc = null;

    // Get settings from storage
    function loadSettings() {
        chrome.storage.sync.get(
            ['speed', 'autoApply', 'smartResume'],
            (data) => {
                currentSpeed = data.speed || 2.0;
                isEnabled = data.autoApply !== false; // default true
                smartResume = data.smartResume !== false; // default true
                
                if (isEnabled) {
                    applySpeed();
                }
            }
        );
    }


    // Find video element
    function getVideoElement() {
        return document.querySelector('video.html5-main-video') || document.querySelector('video');
    }

    // Apply speed to video
    function applySpeed() {
        const video = getVideoElement();
        if (!video) return;

        // Apply speed
        if (video.playbackRate !== currentSpeed && currentSpeed > 0) {
            try {
                video.playbackRate = currentSpeed;
            } catch (e) {
                console.error('SpeedPilot: Error setting playback rate', e);
            }
        }
    }

    // Handle video speed restoration (smart resume)
    function handleSmartResume(video) {
        if (!smartResume || !video) return;

        // Remove existing listeners to avoid duplicates
        const rateChangeHandler = () => {
            if (video.playbackRate !== currentSpeed && video.playbackRate !== 0) {
                applySpeed();
            }
        };

        video.addEventListener('ratechange', rateChangeHandler, { once: false });

        // Restore speed after ads or buffering
        const playingHandler = () => {
            setTimeout(() => {
                applySpeed();
            }, 200);
        };

        video.addEventListener('playing', playingHandler, { once: false });
    }

    // Watch for video element changes (YouTube is a SPA)
    function observeVideoChanges() {
        // Clean up existing observer
        if (videoObserver) {
            videoObserver.disconnect();
        }

        videoObserver = new MutationObserver(() => {
            const video = getVideoElement();
            if (video) {
                const currentSrc = video.currentSrc || video.src;
                
                // Check if this is a new video or not yet processed
                if (currentSrc !== lastVideoSrc || !video.dataset.speedPilotObserved) {
                    lastVideoSrc = currentSrc;
                    video.dataset.speedPilotObserved = 'true';
                    
                    // Apply speed immediately
                    applySpeed();
                    handleSmartResume(video);

                    // Also listen for video events
                    const applySpeedHandler = () => applySpeed();
                    video.addEventListener('loadedmetadata', applySpeedHandler, { once: true });
                    video.addEventListener('canplay', applySpeedHandler, { once: true });
                    video.addEventListener('loadeddata', applySpeedHandler, { once: true });
                }
            }
        });

        // Observe the document body for changes
        videoObserver.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // Listen for storage changes
    chrome.storage.onChanged.addListener((changes, namespace) => {
        if (namespace === 'sync') {
            if (changes.speed) {
                currentSpeed = changes.speed.newValue;
                // Note: Channel-specific speed updates are handled via message from popup
                // This ensures we only update when user explicitly changes speed
            }
            if (changes.autoApply) {
                isEnabled = changes.autoApply.newValue;
            }
            if (changes.smartResume) {
                smartResume = changes.smartResume.newValue;
            }

            if (isEnabled) {
                applySpeed();
            }
        }
    });

    // Handle YouTube navigation (SPA)
    let currentUrl = location.href;
    const urlObserver = new MutationObserver(() => {
        const url = location.href;
        if (url !== currentUrl) {
            currentUrl = url;
            lastVideoSrc = null;
            // Re-observe for new video
            setTimeout(() => {
                const video = getVideoElement();
                if (video) {
                    video.dataset.speedPilotObserved = '';
                    applySpeed();
                }
            }, 500);
        }
    });

    // Initialize
    function init() {
        loadSettings();
        observeVideoChanges();

        // Watch for URL changes (YouTube navigation)
        urlObserver.observe(document, {
            subtree: true,
            childList: true
        });

        // Apply speed immediately if video is already loaded
        const video = getVideoElement();
        if (video) {
            lastVideoSrc = video.currentSrc || video.src;
            video.dataset.speedPilotObserved = 'true';
            applySpeed();
            handleSmartResume(video);
            
            video.addEventListener('loadedmetadata', () => applySpeed(), { once: true });
            video.addEventListener('canplay', () => applySpeed(), { once: true });
            video.addEventListener('loadeddata', () => applySpeed(), { once: true });
        }
    }

    // Wait for page to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        // Use a small delay to ensure YouTube's scripts have loaded
        setTimeout(init, 100);
    }
})();

