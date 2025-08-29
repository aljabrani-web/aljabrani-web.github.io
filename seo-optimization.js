// ===== SEO Optimization for "الجبرني ويب" =====
// تحسين محركات البحث للظهور عند البحث عن "الجبرني ويب"

(function() {
    'use strict';
    
    // إضافة الكلمات المفتاحية المحسنة
    function addSEOKeywords() {
        // إضافة meta keywords إذا لم تكن موجودة
        let keywordsTag = document.querySelector('meta[name="keywords"]');
        if (!keywordsTag) {
            keywordsTag = document.createElement('meta');
            keywordsTag.name = 'keywords';
            document.head.appendChild(keywordsTag);
        }
        
        const keywords = [
            'الجبرني ويب',
            'الجبرني',
            'مطور ويب',
            'تطوير مواقع',
            'مطور مواقع',
            'مبرمج',
            'HTML',
            'CSS', 
            'JavaScript',
            'React',
            'Node.js',
            'portfolio',
            'معرض أعمال',
            'مطور عربي',
            'تصميم مواقع',
            'برمجة',
            'تطوير تطبيقات',
            'مطور محترف',
            'خدمات تطوير',
            'استشارات تقنية'
        ];
        
        keywordsTag.content = keywords.join(', ');
    }
    
    // تحسين العنوان والوصف
    function optimizeMetaTags() {
        // تحسين العنوان
        document.title = 'الجبرني ويب - مطور ويب محترف | تطوير مواقع وتطبيقات';
        
        // تحسين الوصف
        const descriptionTag = document.querySelector('meta[name="description"]');
        if (descriptionTag) {
            descriptionTag.content = 'الجبرني ويب - مطور ويب محترف متخصص في تطوير المواقع والتطبيقات الحديثة. خدمات تطوير مواقع، تصميم واجهات المستخدم، وحلول تقنية متقدمة.';
        }
        
        // تحسين Open Graph
        updateOpenGraphTags();
        
        // تحسين Twitter Cards
        updateTwitterCards();
    }
    
    function updateOpenGraphTags() {
        const ogTags = {
            'og:title': 'الجبرني ويب - مطور ويب محترف',
            'og:description': 'مطور ويب محترف متخصص في تطوير المواقع والتطبيقات الحديثة. معرض أعمال ومهارات تقنية متقدمة.',
            'og:type': 'website',
            'og:url': 'https://aljabrani-web.github.io',
            'og:site_name': 'الجبرني ويب',
            'og:locale': 'ar_SA',
            'og:image': 'https://aljabrani-web.github.io/og-image.jpg',
            'og:image:alt': 'الجبرني ويب - مطور ويب محترف'
        };
        
        Object.keys(ogTags).forEach(property => {
            let tag = document.querySelector(`meta[property="${property}"]`);
            if (!tag) {
                tag = document.createElement('meta');
                tag.setAttribute('property', property);
                document.head.appendChild(tag);
            }
            tag.content = ogTags[property];
        });
    }
    
    function updateTwitterCards() {
        const twitterTags = {
            'twitter:card': 'summary_large_image',
            'twitter:title': 'الجبرني ويب - مطور ويب محترف',
            'twitter:description': 'مطور ويب محترف متخصص في تطوير المواقع والتطبيقات الحديثة',
            'twitter:image': 'https://aljabrani-web.github.io/og-image.jpg',
            'twitter:creator': '@aljabrani_web'
        };
        
        Object.keys(twitterTags).forEach(name => {
            let tag = document.querySelector(`meta[name="${name}"]`);
            if (!tag) {
                tag = document.createElement('meta');
                tag.name = name;
                document.head.appendChild(tag);
            }
            tag.content = twitterTags[name];
        });
    }
    
    // إضافة البيانات المنظمة (Schema.org)
    function addStructuredData() {
        const structuredData = {
            "@context": "https://schema.org",
            "@type": "Person",
            "name": "الجبرني ويب",
            "alternateName": "الجبرني",
            "jobTitle": "مطور ويب محترف",
            "description": "مطور ويب محترف متخصص في تطوير المواقع والتطبيقات الحديثة",
            "url": "https://aljabrani-web.github.io",
            "sameAs": [
                "https://github.com/aljabrani-web",
                "https://linkedin.com/in/aljabrani-web",
                "https://twitter.com/aljabrani_web"
            ],
            "knowsAbout": [
                "تطوير الويب",
                "HTML5",
                "CSS3", 
                "JavaScript",
                "React",
                "Node.js",
                "تصميم واجهات المستخدم",
                "تطوير تطبيقات الويب",
                "البرمجة",
                "تحسين محركات البحث"
            ],
            "worksFor": {
                "@type": "Organization",
                "name": "مطور مستقل"
            },
            "address": {
                "@type": "PostalAddress",
                "addressCountry": "SA"
            },
            "offers": {
                "@type": "Offer",
                "itemOffered": {
                    "@type": "Service",
                    "name": "خدمات تطوير الويب",
                    "description": "تطوير مواقع وتطبيقات ويب حديثة ومتجاوبة"
                }
            }
        };
        
        // إزالة البيانات المنظمة الموجودة
        const existingScript = document.querySelector('script[type="application/ld+json"]');
        if (existingScript) {
            existingScript.remove();
        }
        
        // إضافة البيانات المنظمة الجديدة
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.textContent = JSON.stringify(structuredData, null, 2);
        document.head.appendChild(script);
    }
    
    // إضافة canonical URL
    function addCanonicalURL() {
        let canonicalTag = document.querySelector('link[rel="canonical"]');
        if (!canonicalTag) {
            canonicalTag = document.createElement('link');
            canonicalTag.rel = 'canonical';
            document.head.appendChild(canonicalTag);
        }
        canonicalTag.href = 'https://aljabrani-web.github.io/';
    }
    
    // إضافة hreflang للغة العربية
    function addHreflang() {
        let hreflangTag = document.querySelector('link[rel="alternate"][hreflang="ar"]');
        if (!hreflangTag) {
            hreflangTag = document.createElement('link');
            hreflangTag.rel = 'alternate';
            hreflangTag.hreflang = 'ar';
            document.head.appendChild(hreflangTag);
        }
        hreflangTag.href = 'https://aljabrani-web.github.io/';
    }
    
    // تحسين المحتوى للبحث المحلي
    function optimizeLocalSEO() {
        // إضافة معلومات الموقع الجغرافي
        const geoTags = {
            'geo.region': 'SA',
            'geo.placename': 'المملكة العربية السعودية',
            'ICBM': '24.7136, 46.6753' // إحداثيات الرياض كمثال
        };
        
        Object.keys(geoTags).forEach(name => {
            let tag = document.querySelector(`meta[name="${name}"]`);
            if (!tag) {
                tag = document.createElement('meta');
                tag.name = name;
                document.head.appendChild(tag);
            }
            tag.content = geoTags[name];
        });
    }
    
    // إضافة breadcrumb schema
    function addBreadcrumbSchema() {
        const breadcrumbData = {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
                {
                    "@type": "ListItem",
                    "position": 1,
                    "name": "الرئيسية",
                    "item": "https://aljabrani-web.github.io/"
                },
                {
                    "@type": "ListItem", 
                    "position": 2,
                    "name": "معرض الأعمال",
                    "item": "https://aljabrani-web.github.io/#portfolio"
                },
                {
                    "@type": "ListItem",
                    "position": 3,
                    "name": "المدونة",
                    "item": "https://aljabrani-web.github.io/blog.html"
                }
            ]
        };
        
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.textContent = JSON.stringify(breadcrumbData, null, 2);
        document.head.appendChild(script);
    }
    
    // تحسين سرعة التحميل
    function optimizePageSpeed() {
        // إضافة preconnect للخطوط
        const preconnectLinks = [
            'https://fonts.googleapis.com',
            'https://fonts.gstatic.com',
            'https://cdnjs.cloudflare.com'
        ];
        
        preconnectLinks.forEach(href => {
            const link = document.createElement('link');
            link.rel = 'preconnect';
            link.href = href;
            if (href.includes('gstatic')) {
                link.crossOrigin = 'anonymous';
            }
            document.head.appendChild(link);
        });
        
        // إضافة dns-prefetch
        const dnsPrefetchLinks = [
            'https://github.com',
            'https://linkedin.com',
            'https://twitter.com'
        ];
        
        dnsPrefetchLinks.forEach(href => {
            const link = document.createElement('link');
            link.rel = 'dns-prefetch';
            link.href = href;
            document.head.appendChild(link);
        });
    }
    
    // تشغيل جميع التحسينات
    function initializeSEO() {
        addSEOKeywords();
        optimizeMetaTags();
        addStructuredData();
        addCanonicalURL();
        addHreflang();
        optimizeLocalSEO();
        addBreadcrumbSchema();
        optimizePageSpeed();
        
        console.log('✅ تم تطبيق تحسينات SEO للبحث عن "الجبرني ويب"');
    }
    
    // تشغيل التحسينات عند تحميل الصفحة
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeSEO);
    } else {
        initializeSEO();
    }
    
    // تصدير الوظائف للاستخدام الخارجي
    window.seoOptimizer = {
        initializeSEO,
        addSEOKeywords,
        optimizeMetaTags,
        addStructuredData
    };
    
})();
