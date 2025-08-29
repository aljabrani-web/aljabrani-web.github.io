// Google Analytics 4 Configuration
// Replace 'GA_MEASUREMENT_ID' with your actual Google Analytics 4 Measurement ID

// Google Analytics 4 (gtag.js)
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());

// Replace 'G-XXXXXXXXXX' with your actual GA4 Measurement ID
gtag('config', 'G-XXXXXXXXXX', {
    // Enhanced measurement settings
    enhanced_measurement: {
        scrolls: true,
        outbound_clicks: true,
        site_search: true,
        video_engagement: true,
        file_downloads: true
    },
    // Custom parameters
    custom_map: {
        'custom_parameter_1': 'dimension1'
    },
    // Cookie settings
    cookie_flags: 'SameSite=None;Secure',
    // Privacy settings
    anonymize_ip: true,
    allow_google_signals: false,
    allow_ad_personalization_signals: false
});

// Custom Events Tracking
document.addEventListener('DOMContentLoaded', function() {
    
    // Track portfolio item clicks
    document.querySelectorAll('.portfolio-link').forEach(link => {
        link.addEventListener('click', function() {
            gtag('event', 'portfolio_click', {
                'event_category': 'engagement',
                'event_label': this.closest('.portfolio-item').querySelector('h3').textContent,
                'value': 1
            });
        });
    });
    
    // Track contact form submissions
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function() {
            gtag('event', 'form_submit', {
                'event_category': 'engagement',
                'event_label': 'contact_form',
                'value': 1
            });
        });
    }
    
    // Track navigation clicks
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function() {
            gtag('event', 'navigation_click', {
                'event_category': 'navigation',
                'event_label': this.textContent.trim(),
                'value': 1
            });
        });
    });
    
    // Track scroll depth
    let maxScroll = 0;
    window.addEventListener('scroll', function() {
        const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
        
        if (scrollPercent > maxScroll && scrollPercent % 25 === 0) {
            maxScroll = scrollPercent;
            gtag('event', 'scroll_depth', {
                'event_category': 'engagement',
                'event_label': scrollPercent + '%',
                'value': scrollPercent
            });
        }
    });
    
    // Track time on page
    let startTime = Date.now();
    window.addEventListener('beforeunload', function() {
        const timeOnPage = Math.round((Date.now() - startTime) / 1000);
        gtag('event', 'time_on_page', {
            'event_category': 'engagement',
            'event_label': 'seconds',
            'value': timeOnPage
        });
    });
    
    // Track button clicks
    document.querySelectorAll('.btn').forEach(button => {
        button.addEventListener('click', function() {
            gtag('event', 'button_click', {
                'event_category': 'engagement',
                'event_label': this.textContent.trim(),
                'value': 1
            });
        });
    });
    
    // Track social media clicks
    document.querySelectorAll('.social-link').forEach(link => {
        link.addEventListener('click', function() {
            const platform = this.querySelector('i').className.includes('linkedin') ? 'LinkedIn' :
                            this.querySelector('i').className.includes('github') ? 'GitHub' :
                            this.querySelector('i').className.includes('twitter') ? 'Twitter' :
                            this.querySelector('i').className.includes('instagram') ? 'Instagram' : 'Unknown';
            
            gtag('event', 'social_click', {
                'event_category': 'social',
                'event_label': platform,
                'value': 1
            });
        });
    });
});

// Performance tracking
window.addEventListener('load', function() {
    // Track page load time
    const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
    gtag('event', 'page_load_time', {
        'event_category': 'performance',
        'event_label': 'milliseconds',
        'value': loadTime
    });
    
    // Track Core Web Vitals
    if ('web-vital' in window) {
        // This would require the web-vitals library
        // You can add it by including: <script src="https://unpkg.com/web-vitals"></script>
        
        // getCLS(console.log);
        // getFID(console.log);
        // getFCP(console.log);
        // getLCP(console.log);
        // getTTFB(console.log);
    }
});

// Error tracking
window.addEventListener('error', function(e) {
    gtag('event', 'javascript_error', {
        'event_category': 'error',
        'event_label': e.message,
        'value': 1
    });
});

// Track 404 errors (if on 404 page)
if (document.title.includes('404')) {
    gtag('event', '404_error', {
        'event_category': 'error',
        'event_label': window.location.pathname,
        'value': 1
    });
}

// Custom dimensions for user behavior
function trackUserBehavior() {
    // Track device type
    const isMobile = window.innerWidth <= 768;
    const isTablet = window.innerWidth > 768 && window.innerWidth <= 1024;
    const deviceType = isMobile ? 'mobile' : isTablet ? 'tablet' : 'desktop';
    
    gtag('config', 'G-XXXXXXXXXX', {
        'custom_map': {
            'device_type': deviceType
        }
    });
    
    // Track browser language
    const language = navigator.language || navigator.userLanguage;
    gtag('event', 'user_language', {
        'event_category': 'user_info',
        'event_label': language,
        'value': 1
    });
}

// Initialize user behavior tracking
trackUserBehavior();

// Privacy-compliant tracking
function initializeAnalytics() {
    // Check if user has consented to analytics
    const analyticsConsent = localStorage.getItem('analytics_consent');
    
    if (analyticsConsent === 'granted') {
        // Load Google Analytics script
        const script = document.createElement('script');
        script.async = true;
        script.src = 'https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX';
        document.head.appendChild(script);
        
        console.log('Analytics initialized with user consent');
    } else if (analyticsConsent === null) {
        // Show consent banner (you would implement this)
        console.log('Analytics consent not yet provided');
    }
}

// Initialize analytics based on consent
initializeAnalytics();

// Export functions for external use
window.trackCustomEvent = function(eventName, category, label, value) {
    gtag('event', eventName, {
        'event_category': category,
        'event_label': label,
        'value': value || 1
    });
};

// Console message for developers
console.log('Analytics tracking initialized. Remember to replace G-XXXXXXXXXX with your actual GA4 Measurement ID.');
