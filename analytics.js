(() => {
    const measurementId = String(window.ANGELIQUE_ANALYTICS?.measurementId || '').trim();
    const productionHosts = new Set(['angelique-tarot.com', 'www.angelique-tarot.com']);
    const isAllowedHost = productionHosts.has(window.location.hostname)
        || window.ANGELIQUE_ANALYTICS?.allowLocalhost === true;
    const isConfigured = /^G-[A-Z0-9]+$/i.test(measurementId) && isAllowedHost;

    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function gtag() {
        window.dataLayer.push(arguments);
    };

    const cleanParams = (params = {}) => Object.fromEntries(
        Object.entries(params).filter(([, value]) => value !== undefined && value !== null && value !== '')
    );

    window.angeliqueAnalytics = Object.freeze({
        enabled: isConfigured,
        track(eventName, params = {}) {
            if (!isConfigured || !/^[a-z][a-z0-9_]{0,39}$/i.test(eventName)) return;
            window.gtag('event', eventName, cleanParams(params));
        },
    });

    if (!isConfigured) return;

    window.gtag('js', new Date());
    window.gtag('config', measurementId, {
        allow_google_signals: false,
        allow_ad_personalization_signals: false,
        transport_type: 'beacon',
    });

    const tag = document.createElement('script');
    tag.async = true;
    tag.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
    document.head.appendChild(tag);

    const allowedAngels = new Set(['michael', 'raphael', 'gabriel', 'uriel']);
    const angelIntent = new URLSearchParams(window.location.search).get('angel');
    if (allowedAngels.has(angelIntent)) {
        window.angeliqueAnalytics.track('angel_intent', { angel: angelIntent });
    }

    document.addEventListener('DOMContentLoaded', () => {
        document.querySelectorAll('.faq-video video').forEach((video) => {
            const videoName = video.getAttribute('aria-label') || video.currentSrc.split('/').pop() || 'guide';
            let started = false;
            let completed = false;

            video.addEventListener('play', () => {
                if (started) return;
                started = true;
                window.angeliqueAnalytics.track('video_start', { video_title: videoName });
            });

            video.addEventListener('ended', () => {
                if (completed) return;
                completed = true;
                window.angeliqueAnalytics.track('video_complete', { video_title: videoName });
            });
        });
    });
})();
