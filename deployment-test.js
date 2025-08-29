// ===== اختبار شامل للموقع بعد النشر =====
// يختبر جميع المكونات للتأكد من عملها بعد النشر على GitHub Pages

class DeploymentTester {
    constructor() {
        this.testResults = [];
        this.baseUrl = window.location.origin;
        this.init();
    }

    init() {
        this.createTestInterface();
        this.runAllTests();
    }

    createTestInterface() {
        // إنشاء واجهة الاختبار
        const testContainer = document.createElement('div');
        testContainer.id = 'deployment-test-container';
        testContainer.innerHTML = `
            <div style="
                position: fixed;
                top: 20px;
                right: 20px;
                width: 400px;
                max-height: 80vh;
                background: white;
                border-radius: 10px;
                box-shadow: 0 4px 20px rgba(0,0,0,0.15);
                z-index: 10000;
                font-family: 'Cairo', sans-serif;
                overflow-y: auto;
            ">
                <div style="
                    background: linear-gradient(135deg, #667eea, #764ba2);
                    color: white;
                    padding: 1rem;
                    border-radius: 10px 10px 0 0;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                ">
                    <h3>🧪 اختبار النشر</h3>
                    <button onclick="this.closest('#deployment-test-container').remove()" style="
                        background: none;
                        border: none;
                        color: white;
                        font-size: 1.2rem;
                        cursor: pointer;
                    ">×</button>
                </div>
                <div id="test-results" style="padding: 1rem; max-height: 60vh; overflow-y: auto;">
                    <div id="test-progress">جاري تشغيل الاختبارات...</div>
                </div>
                <div style="padding: 1rem; border-top: 1px solid #eee;">
                    <button onclick="window.deploymentTester.runAllTests()" style="
                        width: 100%;
                        padding: 0.75rem;
                        background: #667eea;
                        color: white;
                        border: none;
                        border-radius: 5px;
                        cursor: pointer;
                        font-family: 'Cairo', sans-serif;
                    ">إعادة تشغيل الاختبارات</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(testContainer);
    }

    async runAllTests() {
        this.testResults = [];
        this.updateProgress('بدء الاختبارات...');

        const tests = [
            { name: 'اختبار تحميل الصفحة الرئيسية', func: () => this.testMainPage() },
            { name: 'اختبار ملفات CSS و JavaScript', func: () => this.testAssets() },
            { name: 'اختبار لوحة التحكم', func: () => this.testAdminPanel() },
            { name: 'اختبار localStorage', func: () => this.testLocalStorage() },
            { name: 'اختبار نظام التحديث', func: () => this.testUpdateSystem() },
            { name: 'اختبار SEO والمعلومات المنظمة', func: () => this.testSEO() },
            { name: 'اختبار الروابط والتنقل', func: () => this.testNavigation() },
            { name: 'اختبار الاستجابة للأجهزة', func: () => this.testResponsiveness() },
            { name: 'اختبار الأداء', func: () => this.testPerformance() },
            { name: 'اختبار الأمان', func: () => this.testSecurity() }
        ];

        for (let i = 0; i < tests.length; i++) {
            const test = tests[i];
            this.updateProgress(`تشغيل: ${test.name} (${i + 1}/${tests.length})`);
            
            try {
                const result = await test.func();
                this.addTestResult(test.name, result.success, result.message, result.details);
            } catch (error) {
                this.addTestResult(test.name, false, `خطأ: ${error.message}`, error.stack);
            }
            
            // تأخير قصير بين الاختبارات
            await new Promise(resolve => setTimeout(resolve, 500));
        }

        this.displayResults();
    }

    async testMainPage() {
        try {
            // اختبار تحميل الصفحة الرئيسية
            const response = await fetch(this.baseUrl + '/');
            if (!response.ok) {
                return { success: false, message: `خطأ HTTP: ${response.status}` };
            }

            // اختبار وجود العناصر الأساسية
            const requiredElements = [
                '.hero-section',
                '.about-section', 
                '.skills-section',
                '.portfolio-section',
                '.contact-section'
            ];

            const missingElements = requiredElements.filter(selector => !document.querySelector(selector));
            
            if (missingElements.length > 0) {
                return { 
                    success: false, 
                    message: 'عناصر مفقودة في الصفحة الرئيسية',
                    details: `العناصر المفقودة: ${missingElements.join(', ')}`
                };
            }

            return { success: true, message: 'الصفحة الرئيسية تعمل بشكل صحيح' };
        } catch (error) {
            return { success: false, message: `خطأ في تحميل الصفحة: ${error.message}` };
        }
    }

    async testAssets() {
        const assets = [
            '/styles.css',
            '/script.js',
            '/auto-updater.js',
            '/seo-optimization.js'
        ];

        const failedAssets = [];

        for (const asset of assets) {
            try {
                const response = await fetch(this.baseUrl + asset);
                if (!response.ok) {
                    failedAssets.push(asset);
                }
            } catch (error) {
                failedAssets.push(asset);
            }
        }

        if (failedAssets.length > 0) {
            return {
                success: false,
                message: 'بعض الملفات لا تحمل بشكل صحيح',
                details: `الملفات المفقودة: ${failedAssets.join(', ')}`
            };
        }

        return { success: true, message: 'جميع ملفات CSS و JavaScript تحمل بشكل صحيح' };
    }

    async testAdminPanel() {
        try {
            // اختبار تحميل صفحة تسجيل الدخول
            const response = await fetch(this.baseUrl + '/admin/login.html');
            if (!response.ok) {
                return { success: false, message: `لا يمكن الوصول لصفحة تسجيل الدخول: ${response.status}` };
            }

            // اختبار ملفات لوحة التحكم
            const adminAssets = [
                '/admin/admin-styles.css',
                '/admin/admin-core.js',
                '/admin/dashboard.js',
                '/admin/live-updater.js'
            ];

            const failedAdminAssets = [];
            for (const asset of adminAssets) {
                try {
                    const assetResponse = await fetch(this.baseUrl + asset);
                    if (!assetResponse.ok) {
                        failedAdminAssets.push(asset);
                    }
                } catch (error) {
                    failedAdminAssets.push(asset);
                }
            }

            if (failedAdminAssets.length > 0) {
                return {
                    success: false,
                    message: 'بعض ملفات لوحة التحكم مفقودة',
                    details: `الملفات المفقودة: ${failedAdminAssets.join(', ')}`
                };
            }

            return { success: true, message: 'لوحة التحكم متاحة وجميع ملفاتها موجودة' };
        } catch (error) {
            return { success: false, message: `خطأ في اختبار لوحة التحكم: ${error.message}` };
        }
    }

    testLocalStorage() {
        try {
            // اختبار إمكانية الكتابة والقراءة من localStorage
            const testKey = 'deployment-test';
            const testValue = 'test-data-' + Date.now();
            
            localStorage.setItem(testKey, testValue);
            const retrievedValue = localStorage.getItem(testKey);
            localStorage.removeItem(testKey);

            if (retrievedValue !== testValue) {
                return { success: false, message: 'localStorage لا يعمل بشكل صحيح' };
            }

            // اختبار وجود بيانات النظام
            const systemKeys = ['adminCredentials'];
            const missingKeys = systemKeys.filter(key => !localStorage.getItem(key));

            return { 
                success: true, 
                message: 'localStorage يعمل بشكل صحيح',
                details: missingKeys.length > 0 ? `مفاتيح مفقودة: ${missingKeys.join(', ')}` : 'جميع المفاتيح موجودة'
            };
        } catch (error) {
            return { success: false, message: `خطأ في localStorage: ${error.message}` };
        }
    }

    testUpdateSystem() {
        try {
            // اختبار وجود نظام التحديث التلقائي
            if (typeof window.websiteAutoUpdater === 'undefined') {
                return { success: false, message: 'نظام التحديث التلقائي غير محمل' };
            }

            // اختبار وجود وظائف التحديث
            const requiredFunctions = ['checkForUpdates', 'loadDataFromStorage'];
            const missingFunctions = requiredFunctions.filter(func => 
                typeof window.websiteAutoUpdater[func] !== 'function'
            );

            if (missingFunctions.length > 0) {
                return {
                    success: false,
                    message: 'بعض وظائف التحديث مفقودة',
                    details: `الوظائف المفقودة: ${missingFunctions.join(', ')}`
                };
            }

            return { success: true, message: 'نظام التحديث يعمل بشكل صحيح' };
        } catch (error) {
            return { success: false, message: `خطأ في نظام التحديث: ${error.message}` };
        }
    }

    testSEO() {
        try {
            const seoChecks = [];

            // اختبار العنوان
            const title = document.title;
            if (!title || title.length < 10) {
                seoChecks.push('العنوان مفقود أو قصير جداً');
            }

            // اختبار الوصف
            const description = document.querySelector('meta[name="description"]');
            if (!description || description.content.length < 50) {
                seoChecks.push('وصف الصفحة مفقود أو قصير جداً');
            }

            // اختبار الكلمات المفتاحية
            const keywords = document.querySelector('meta[name="keywords"]');
            if (!keywords || !keywords.content.includes('الجبرني ويب')) {
                seoChecks.push('الكلمات المفتاحية مفقودة أو لا تحتوي على "الجبرني ويب"');
            }

            // اختبار Open Graph
            const ogTitle = document.querySelector('meta[property="og:title"]');
            if (!ogTitle) {
                seoChecks.push('Open Graph title مفقود');
            }

            // اختبار البيانات المنظمة
            const structuredData = document.querySelector('script[type="application/ld+json"]');
            if (!structuredData) {
                seoChecks.push('البيانات المنظمة (Schema.org) مفقودة');
            }

            if (seoChecks.length > 0) {
                return {
                    success: false,
                    message: 'بعض عناصر SEO مفقودة',
                    details: seoChecks.join(', ')
                };
            }

            return { success: true, message: 'جميع عناصر SEO موجودة وصحيحة' };
        } catch (error) {
            return { success: false, message: `خطأ في اختبار SEO: ${error.message}` };
        }
    }

    testNavigation() {
        try {
            // اختبار الروابط الداخلية
            const internalLinks = document.querySelectorAll('a[href^="#"], a[href^="/"], a[href^="./"]');
            const brokenLinks = [];

            internalLinks.forEach(link => {
                const href = link.getAttribute('href');
                if (href.startsWith('#')) {
                    // اختبار الروابط المرساة
                    const targetId = href.substring(1);
                    if (targetId && !document.getElementById(targetId)) {
                        brokenLinks.push(href);
                    }
                }
            });

            // اختبار قائمة التنقل
            const navLinks = document.querySelectorAll('.nav-link');
            if (navLinks.length === 0) {
                return { success: false, message: 'قائمة التنقل مفقودة' };
            }

            if (brokenLinks.length > 0) {
                return {
                    success: false,
                    message: 'بعض الروابط معطلة',
                    details: `الروابط المعطلة: ${brokenLinks.join(', ')}`
                };
            }

            return { success: true, message: 'جميع الروابط والتنقل يعمل بشكل صحيح' };
        } catch (error) {
            return { success: false, message: `خطأ في اختبار التنقل: ${error.message}` };
        }
    }

    testResponsiveness() {
        try {
            // اختبار وجود viewport meta tag
            const viewport = document.querySelector('meta[name="viewport"]');
            if (!viewport) {
                return { success: false, message: 'viewport meta tag مفقود' };
            }

            // اختبار CSS المتجاوب
            const mediaQueries = Array.from(document.styleSheets).some(sheet => {
                try {
                    return Array.from(sheet.cssRules).some(rule => 
                        rule.type === CSSRule.MEDIA_RULE
                    );
                } catch (e) {
                    return false;
                }
            });

            if (!mediaQueries) {
                return { success: false, message: 'لا توجد media queries للتصميم المتجاوب' };
            }

            return { success: true, message: 'الموقع متجاوب ويدعم جميع الأجهزة' };
        } catch (error) {
            return { success: false, message: `خطأ في اختبار الاستجابة: ${error.message}` };
        }
    }

    testPerformance() {
        try {
            if (!window.performance || !window.performance.timing) {
                return { success: false, message: 'Performance API غير متاح' };
            }

            const timing = window.performance.timing;
            const loadTime = timing.loadEventEnd - timing.navigationStart;
            const domReady = timing.domContentLoadedEventEnd - timing.navigationStart;

            const performanceIssues = [];

            if (loadTime > 5000) {
                performanceIssues.push(`وقت التحميل بطيء: ${loadTime}ms`);
            }

            if (domReady > 3000) {
                performanceIssues.push(`DOM بطيء في التحميل: ${domReady}ms`);
            }

            // اختبار عدد الطلبات
            const resources = window.performance.getEntriesByType('resource');
            if (resources.length > 50) {
                performanceIssues.push(`عدد كبير من الطلبات: ${resources.length}`);
            }

            if (performanceIssues.length > 0) {
                return {
                    success: false,
                    message: 'مشاكل في الأداء',
                    details: performanceIssues.join(', ')
                };
            }

            return { 
                success: true, 
                message: 'الأداء جيد',
                details: `وقت التحميل: ${loadTime}ms, DOM: ${domReady}ms`
            };
        } catch (error) {
            return { success: false, message: `خطأ في اختبار الأداء: ${error.message}` };
        }
    }

    testSecurity() {
        try {
            const securityIssues = [];

            // اختبار HTTPS
            if (window.location.protocol !== 'https:' && window.location.hostname !== 'localhost') {
                securityIssues.push('الموقع لا يستخدم HTTPS');
            }

            // اختبار Content Security Policy
            const csp = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
            if (!csp) {
                securityIssues.push('Content Security Policy مفقود');
            }

            // اختبار X-Frame-Options
            // هذا يتم فحصه عادة في headers، لكن يمكن فحصه في meta tags أيضاً

            if (securityIssues.length > 0) {
                return {
                    success: false,
                    message: 'مشاكل أمنية محتملة',
                    details: securityIssues.join(', ')
                };
            }

            return { success: true, message: 'الإعدادات الأمنية الأساسية موجودة' };
        } catch (error) {
            return { success: false, message: `خطأ في اختبار الأمان: ${error.message}` };
        }
    }

    addTestResult(testName, success, message, details = '') {
        this.testResults.push({
            name: testName,
            success,
            message,
            details,
            timestamp: new Date().toLocaleTimeString('ar-SA')
        });
    }

    updateProgress(message) {
        const progressElement = document.getElementById('test-progress');
        if (progressElement) {
            progressElement.textContent = message;
        }
    }

    displayResults() {
        const resultsContainer = document.getElementById('test-results');
        if (!resultsContainer) return;

        const successCount = this.testResults.filter(r => r.success).length;
        const totalCount = this.testResults.length;
        const successRate = Math.round((successCount / totalCount) * 100);

        let html = `
            <div style="margin-bottom: 1rem; padding: 1rem; border-radius: 5px; background: ${successRate >= 80 ? '#d4edda' : successRate >= 60 ? '#fff3cd' : '#f8d7da'};">
                <h4>نتائج الاختبار: ${successCount}/${totalCount} (${successRate}%)</h4>
                <p>${successRate >= 80 ? '✅ ممتاز! الموقع جاهز للاستخدام' : successRate >= 60 ? '⚠️ جيد مع بعض التحسينات المطلوبة' : '❌ يحتاج إصلاحات مهمة'}</p>
            </div>
        `;

        this.testResults.forEach(result => {
            html += `
                <div style="margin-bottom: 0.5rem; padding: 0.75rem; border-radius: 5px; border-left: 4px solid ${result.success ? '#28a745' : '#dc3545'}; background: ${result.success ? '#f8fff9' : '#fff8f8'};">
                    <div style="display: flex; align-items: center; gap: 0.5rem;">
                        <span style="font-size: 1.2rem;">${result.success ? '✅' : '❌'}</span>
                        <strong>${result.name}</strong>
                    </div>
                    <p style="margin: 0.25rem 0; color: #666;">${result.message}</p>
                    ${result.details ? `<small style="color: #888;">${result.details}</small>` : ''}
                    <small style="display: block; margin-top: 0.25rem; color: #999;">${result.timestamp}</small>
                </div>
            `;
        });

        resultsContainer.innerHTML = html;
    }
}

// تشغيل الاختبار عند تحميل الصفحة (فقط في لوحة التحكم)
if (window.location.pathname.includes('/admin/')) {
    document.addEventListener('DOMContentLoaded', () => {
        // إضافة زر اختبار النشر
        const testButton = document.createElement('button');
        testButton.innerHTML = '🧪 اختبار النشر';
        testButton.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 20px;
            padding: 0.75rem 1rem;
            background: #17a2b8;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-family: 'Cairo', sans-serif;
            z-index: 1000;
        `;
        
        testButton.addEventListener('click', () => {
            window.deploymentTester = new DeploymentTester();
        });
        
        document.body.appendChild(testButton);
    });
}

// تصدير للاستخدام الخارجي
window.DeploymentTester = DeploymentTester;
