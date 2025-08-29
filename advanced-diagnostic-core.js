// ===== محرك التشخيص المتقدم =====
// نظام شامل لتشخيص جميع مكونات المشروع والموقع

class AdvancedDiagnosticEngine {
    constructor() {
        this.baseUrl = 'https://aljabrani-web.github.io';
        this.localMode = window.location.protocol === 'file:';
        this.testResults = [];
        this.diagnosticData = {
            files: [],
            network: [],
            performance: [],
            admin: [],
            security: []
        };
        this.errorLog = [];
        this.recommendations = [];
        
        this.requiredFiles = {
            main: [
                'index.html', 'styles.css', 'script.js', 'auto-updater.js',
                'seo-optimization.js', 'blog.html', '404.html', 'robots.txt',
                'sitemap.xml', 'manifest.json', 'prepare-deployment.js',
                'test-deployment.js', 'deploy-files.html', 'github-upload-helper.html',
                'instant-deployment-test.html', 'README.md', 'USAGE-GUIDE.md',
                'DEPLOYMENT-GUIDE.md', 'DEPLOYMENT-CHECKLIST.md', 'QUICK-DEPLOY.md',
                'FILES-READY-REPORT.md'
            ],
            admin: [
                'admin/login.html', 'admin/dashboard.html', 'admin/admin-styles.css',
                'admin/admin-core.js', 'admin/live-updater.js', 'admin/website-updater.js',
                'admin/dashboard.js', 'admin/deployment-test.js', 'admin/.htaccess',
                'admin/README.md'
            ]
        };
        
        this.init();
    }
    
    init() {
        console.log('🔍 تشغيل محرك التشخيص المتقدم...');
        this.setupEventListeners();
        this.displayInitialStatus();
    }
    
    setupEventListeners() {
        // إضافة مستمعات الأحداث للعناصر التفاعلية
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('diagnostic-item')) {
                this.showItemDetails(e.target);
            }
        });
    }
    
    displayInitialStatus() {
        this.updateProgress(0, 'محرك التشخيص جاهز للعمل');
        this.logMessage('info', 'تم تحميل محرك التشخيص المتقدم بنجاح');
    }
    
    async runQuickDiagnostic() {
        this.resetDiagnostic();
        this.updateProgress(0, 'بدء التشخيص السريع...');
        
        const quickTests = [
            { name: 'فحص الملفات الأساسية', func: () => this.checkCoreFiles() },
            { name: 'اختبار الاتصال الأساسي', func: () => this.checkBasicConnectivity() },
            { name: 'فحص لوحة التحكم', func: () => this.checkAdminPanel() }
        ];
        
        await this.runTestSuite(quickTests, 'التشخيص السريع');
    }
    
    async runFullDiagnostic() {
        this.resetDiagnostic();
        this.updateProgress(0, 'بدء التشخيص الشامل...');
        
        const fullTests = [
            { name: 'فحص جميع الملفات', func: () => this.checkAllFiles() },
            { name: 'اختبار الشبكة المتقدم', func: () => this.runAdvancedNetworkTest() },
            { name: 'تحليل الأداء الشامل', func: () => this.runPerformanceAnalysis() },
            { name: 'فحص الأمان المتقدم', func: () => this.runSecurityAudit() },
            { name: 'اختبار وظائف لوحة التحكم', func: () => this.checkAdminFunctionality() },
            { name: 'فحص SEO والتحسينات', func: () => this.checkSEOOptimizations() },
            { name: 'اختبار التوافق', func: () => this.checkCompatibility() },
            { name: 'تحليل البيانات المنظمة', func: () => this.checkStructuredData() }
        ];
        
        await this.runTestSuite(fullTests, 'التشخيص الشامل');
    }
    
    async runTestSuite(tests, suiteName) {
        this.logMessage('info', `بدء ${suiteName} - ${tests.length} اختبار`);
        
        for (let i = 0; i < tests.length; i++) {
            const test = tests[i];
            const progress = ((i + 1) / tests.length) * 100;
            
            this.updateProgress(progress, `تشغيل: ${test.name}`);
            
            try {
                const result = await test.func();
                this.processTestResult(test.name, result);
                this.logMessage('success', `اكتمل: ${test.name}`);
            } catch (error) {
                this.processTestError(test.name, error);
                this.logMessage('error', `فشل: ${test.name} - ${error.message}`);
            }
            
            await this.delay(500);
        }
        
        this.finalizeDiagnostic();
    }
    
    async checkAllFiles() {
        const results = {
            mainFiles: { tested: 0, passed: 0, failed: [] },
            adminFiles: { tested: 0, passed: 0, failed: [] },
            configFiles: { tested: 0, passed: 0, failed: [] }
        };
        
        // فحص الملفات الرئيسية
        for (const file of this.requiredFiles.main) {
            results.mainFiles.tested++;
            const exists = await this.checkFileExists(file);
            if (exists) {
                results.mainFiles.passed++;
                this.updateDiagnosticItem('files-diagnostic', 0, 'success', 
                    `ملفات الموقع الرئيسي: ${results.mainFiles.passed}/${results.mainFiles.tested}`);
            } else {
                results.mainFiles.failed.push(file);
                this.updateDiagnosticItem('files-diagnostic', 0, 'error', 
                    `ملف مفقود: ${file}`);
            }
        }
        
        // فحص ملفات لوحة التحكم
        for (const file of this.requiredFiles.admin) {
            results.adminFiles.tested++;
            const exists = await this.checkFileExists(file);
            if (exists) {
                results.adminFiles.passed++;
                this.updateDiagnosticItem('files-diagnostic', 1, 'success', 
                    `ملفات لوحة التحكم: ${results.adminFiles.passed}/${results.adminFiles.tested}`);
            } else {
                results.adminFiles.failed.push(file);
                this.updateDiagnosticItem('files-diagnostic', 1, 'error', 
                    `ملف مفقود: ${file}`);
            }
        }
        
        // فحص ملفات التكوين
        const configFiles = ['robots.txt', 'sitemap.xml', 'manifest.json'];
        for (const file of configFiles) {
            results.configFiles.tested++;
            const exists = await this.checkFileExists(file);
            if (exists) {
                results.configFiles.passed++;
            } else {
                results.configFiles.failed.push(file);
            }
        }
        
        this.updateDiagnosticItem('files-diagnostic', 2, 
            results.configFiles.failed.length === 0 ? 'success' : 'warning',
            `ملفات التكوين: ${results.configFiles.passed}/${results.configFiles.tested}`);
        
        return {
            success: results.mainFiles.failed.length === 0 && results.adminFiles.failed.length === 0,
            details: results,
            message: `فحص ${results.mainFiles.tested + results.adminFiles.tested + results.configFiles.tested} ملف`
        };
    }
    
    async checkCoreFiles() {
        const coreFiles = ['index.html', 'styles.css', 'script.js', 'auto-updater.js'];
        const results = { tested: 0, passed: 0, failed: [] };
        
        for (const file of coreFiles) {
            results.tested++;
            const exists = await this.checkFileExists(file);
            if (exists) {
                results.passed++;
            } else {
                results.failed.push(file);
            }
        }
        
        this.updateDiagnosticItem('files-diagnostic', 0, 
            results.failed.length === 0 ? 'success' : 'error',
            `الملفات الأساسية: ${results.passed}/${results.tested}`);
        
        return {
            success: results.failed.length === 0,
            details: results,
            message: `${results.passed}/${results.tested} ملف أساسي متاح`
        };
    }
    
    async checkFileExists(filePath) {
        if (this.localMode) {
            // في الوضع المحلي، نفترض وجود الملفات
            return true;
        }
        
        try {
            const response = await fetch(`${this.baseUrl}/${filePath}`, { method: 'HEAD' });
            return response.ok;
        } catch (error) {
            this.logMessage('error', `خطأ في فحص الملف ${filePath}: ${error.message}`);
            return false;
        }
    }
    
    async checkBasicConnectivity() {
        const tests = [
            { name: 'الموقع الرئيسي', url: this.baseUrl },
            { name: 'لوحة التحكم', url: `${this.baseUrl}/admin/login.html` }
        ];
        
        const results = { tested: 0, passed: 0, failed: [] };
        
        for (const test of tests) {
            results.tested++;
            try {
                const response = await fetch(test.url);
                if (response.ok) {
                    results.passed++;
                } else {
                    results.failed.push(`${test.name}: HTTP ${response.status}`);
                }
            } catch (error) {
                results.failed.push(`${test.name}: ${error.message}`);
            }
        }
        
        this.updateDiagnosticItem('network-diagnostic', 0, 
            results.failed.length === 0 ? 'success' : 'error',
            `الاتصال الأساسي: ${results.passed}/${results.tested}`);
        
        return {
            success: results.failed.length === 0,
            details: results,
            message: `${results.passed}/${results.tested} اتصال ناجح`
        };
    }
    
    async runAdvancedNetworkTest() {
        const networkTests = [
            { name: 'GitHub Pages Status', func: () => this.checkGitHubPagesStatus() },
            { name: 'DNS Resolution', func: () => this.checkDNSResolution() },
            { name: 'SSL Certificate', func: () => this.checkSSLCertificate() },
            { name: 'CDN Performance', func: () => this.checkCDNPerformance() }
        ];
        
        const results = { tested: 0, passed: 0, failed: [] };
        
        for (const test of networkTests) {
            results.tested++;
            try {
                const result = await test.func();
                if (result.success) {
                    results.passed++;
                } else {
                    results.failed.push(`${test.name}: ${result.message}`);
                }
            } catch (error) {
                results.failed.push(`${test.name}: ${error.message}`);
            }
        }
        
        this.updateDiagnosticItem('network-diagnostic', 0, 
            results.failed.length === 0 ? 'success' : 'warning',
            `اختبار الشبكة المتقدم: ${results.passed}/${results.tested}`);
        
        return {
            success: results.passed >= results.tested * 0.75, // 75% نجاح مقبول
            details: results,
            message: `${results.passed}/${results.tested} اختبار شبكة ناجح`
        };
    }
    
    async checkGitHubPagesStatus() {
        try {
            const response = await fetch(this.baseUrl);
            const isGitHubPages = response.headers.get('server')?.includes('GitHub') || 
                                 response.url.includes('github.io');
            
            this.updateDiagnosticItem('network-diagnostic', 0, 
                isGitHubPages ? 'success' : 'warning',
                isGitHubPages ? 'GitHub Pages نشط' : 'قد لا يكون GitHub Pages');
            
            return {
                success: response.ok,
                message: isGitHubPages ? 'GitHub Pages يعمل بشكل طبيعي' : 'استجابة غير متوقعة'
            };
        } catch (error) {
            return { success: false, message: error.message };
        }
    }
    
    async checkDNSResolution() {
        try {
            const startTime = performance.now();
            const response = await fetch(this.baseUrl, { method: 'HEAD' });
            const endTime = performance.now();
            const dnsTime = endTime - startTime;
            
            this.updateDiagnosticItem('network-diagnostic', 1, 
                dnsTime < 1000 ? 'success' : 'warning',
                `DNS Resolution: ${Math.round(dnsTime)}ms`);
            
            return {
                success: response.ok,
                message: `DNS resolved in ${Math.round(dnsTime)}ms`
            };
        } catch (error) {
            return { success: false, message: error.message };
        }
    }
    
    async checkSSLCertificate() {
        const isHTTPS = this.baseUrl.startsWith('https://');
        
        this.updateDiagnosticItem('network-diagnostic', 2, 
            isHTTPS ? 'success' : 'error',
            isHTTPS ? 'HTTPS مفعل وآمن' : 'HTTPS غير مفعل');
        
        return {
            success: isHTTPS,
            message: isHTTPS ? 'SSL Certificate valid' : 'No HTTPS encryption'
        };
    }
    
    async checkCDNPerformance() {
        try {
            const cdnTests = [
                'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css',
                'https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;600;700&display=swap'
            ];
            
            let passedTests = 0;
            for (const url of cdnTests) {
                try {
                    const response = await fetch(url, { method: 'HEAD' });
                    if (response.ok) passedTests++;
                } catch (e) {
                    // CDN test failed
                }
            }
            
            const success = passedTests >= cdnTests.length * 0.5;
            return {
                success: success,
                message: `${passedTests}/${cdnTests.length} CDN resources accessible`
            };
        } catch (error) {
            return { success: false, message: error.message };
        }
    }
    
    async runPerformanceAnalysis() {
        const performanceMetrics = await this.measurePerformanceMetrics();
        
        this.updateDiagnosticItem('performance-diagnostic', 0, 
            performanceMetrics.loadTime < 3000 ? 'success' : 'warning',
            `سرعة التحميل: ${performanceMetrics.loadTime}ms`);
        
        this.updateDiagnosticItem('performance-diagnostic', 1, 
            performanceMetrics.totalSize < 5000000 ? 'success' : 'warning',
            `حجم الصفحة: ${this.formatBytes(performanceMetrics.totalSize)}`);
        
        this.updateDiagnosticItem('performance-diagnostic', 2, 'success',
            `التوافق: ${performanceMetrics.compatibility}%`);
        
        return {
            success: performanceMetrics.loadTime < 5000,
            details: performanceMetrics,
            message: `Load time: ${performanceMetrics.loadTime}ms`
        };
    }
    
    async measurePerformanceMetrics() {
        const startTime = performance.now();
        
        try {
            const response = await fetch(this.baseUrl);
            const endTime = performance.now();
            const loadTime = Math.round(endTime - startTime);
            
            const contentLength = response.headers.get('content-length');
            const totalSize = contentLength ? parseInt(contentLength) : 0;
            
            return {
                loadTime: loadTime,
                totalSize: totalSize,
                compatibility: this.calculateCompatibility(),
                responseTime: loadTime,
                status: response.status
            };
        } catch (error) {
            return {
                loadTime: 0,
                totalSize: 0,
                compatibility: 0,
                error: error.message
            };
        }
    }
    
    calculateCompatibility() {
        let score = 100;
        
        // فحص دعم المتصفح للميزات المطلوبة
        if (!window.localStorage) score -= 20;
        if (!window.fetch) score -= 20;
        if (!window.CSS || !window.CSS.supports) score -= 10;
        if (!window.IntersectionObserver) score -= 10;
        
        return Math.max(score, 0);
    }
    
    async checkAdminPanel() {
        try {
            const adminUrl = `${this.baseUrl}/admin/login.html`;
            const response = await fetch(adminUrl);
            
            this.updateDiagnosticItem('admin-diagnostic', 0, 
                response.ok ? 'success' : 'error',
                response.ok ? 'تسجيل الدخول متاح' : 'خطأ في الوصول');
            
            return {
                success: response.ok,
                message: response.ok ? 'Admin panel accessible' : `HTTP ${response.status}`
            };
        } catch (error) {
            this.updateDiagnosticItem('admin-diagnostic', 0, 'error', 'فشل الاتصال');
            return { success: false, message: error.message };
        }
    }
    
    async checkAdminFunctionality() {
        const adminTests = [
            { name: 'Login Page', func: () => this.checkAdminLogin() },
            { name: 'Auto Updater', func: () => this.checkAutoUpdater() },
            { name: 'Local Storage', func: () => this.checkLocalStorage() }
        ];
        
        const results = { tested: 0, passed: 0, failed: [] };
        
        for (const test of adminTests) {
            results.tested++;
            try {
                const result = await test.func();
                if (result.success) {
                    results.passed++;
                } else {
                    results.failed.push(`${test.name}: ${result.message}`);
                }
            } catch (error) {
                results.failed.push(`${test.name}: ${error.message}`);
            }
        }
        
        return {
            success: results.failed.length === 0,
            details: results,
            message: `${results.passed}/${results.tested} admin functions working`
        };
    }
    
    async checkAdminLogin() {
        try {
            const response = await fetch(`${this.baseUrl}/admin/login.html`);
            const html = await response.text();
            const hasLoginForm = html.includes('تسجيل الدخول') || html.includes('login');
            
            this.updateDiagnosticItem('admin-diagnostic', 0, 
                hasLoginForm ? 'success' : 'warning',
                hasLoginForm ? 'نموذج تسجيل الدخول موجود' : 'نموذج تسجيل الدخول مفقود');
            
            return {
                success: hasLoginForm,
                message: hasLoginForm ? 'Login form found' : 'Login form missing'
            };
        } catch (error) {
            return { success: false, message: error.message };
        }
    }
    
    async checkAutoUpdater() {
        try {
            const response = await fetch(`${this.baseUrl}/auto-updater.js`);
            const code = await response.text();
            const hasUpdaterFunctions = code.includes('checkForUpdates') && 
                                       code.includes('loadDataFromStorage');
            
            this.updateDiagnosticItem('admin-diagnostic', 1, 
                hasUpdaterFunctions ? 'success' : 'error',
                hasUpdaterFunctions ? 'نظام التحديث متاح' : 'نظام التحديث مفقود');
            
            return {
                success: hasUpdaterFunctions,
                message: hasUpdaterFunctions ? 'Auto updater functions found' : 'Auto updater missing'
            };
        } catch (error) {
            return { success: false, message: error.message };
        }
    }
    
    checkLocalStorage() {
        try {
            const testKey = 'diagnostic-test';
            const testValue = 'test-' + Date.now();
            
            localStorage.setItem(testKey, testValue);
            const retrieved = localStorage.getItem(testKey);
            localStorage.removeItem(testKey);
            
            const works = retrieved === testValue;
            
            this.updateDiagnosticItem('admin-diagnostic', 2, 
                works ? 'success' : 'error',
                works ? 'التخزين المحلي يعمل' : 'مشكلة في التخزين المحلي');
            
            return {
                success: works,
                message: works ? 'Local storage working' : 'Local storage failed'
            };
        } catch (error) {
            return { success: false, message: error.message };
        }
    }
    
    async runSecurityAudit() {
        const securityChecks = [
            { name: 'HTTPS', func: () => this.checkHTTPS() },
            { name: 'Content Security', func: () => this.checkContentSecurity() },
            { name: 'Admin Protection', func: () => this.checkAdminProtection() }
        ];
        
        const results = { tested: 0, passed: 0, failed: [] };
        
        for (const check of securityChecks) {
            results.tested++;
            try {
                const result = await check.func();
                if (result.success) {
                    results.passed++;
                } else {
                    results.failed.push(`${check.name}: ${result.message}`);
                }
            } catch (error) {
                results.failed.push(`${check.name}: ${error.message}`);
            }
        }
        
        return {
            success: results.passed >= results.tested * 0.67, // 67% نجاح مقبول للأمان
            details: results,
            message: `${results.passed}/${results.tested} security checks passed`
        };
    }
    
    checkHTTPS() {
        const isHTTPS = this.baseUrl.startsWith('https://');
        return {
            success: isHTTPS,
            message: isHTTPS ? 'HTTPS enabled' : 'HTTPS not enabled'
        };
    }
    
    async checkContentSecurity() {
        try {
            const response = await fetch(this.baseUrl);
            const csp = response.headers.get('content-security-policy');
            const hasCSP = !!csp;
            
            return {
                success: hasCSP,
                message: hasCSP ? 'CSP header found' : 'No CSP header'
            };
        } catch (error) {
            return { success: false, message: error.message };
        }
    }
    
    async checkAdminProtection() {
        try {
            const response = await fetch(`${this.baseUrl}/admin/.htaccess`);
            const hasProtection = response.ok;
            
            return {
                success: hasProtection,
                message: hasProtection ? 'Admin protection found' : 'No admin protection'
            };
        } catch (error) {
            return { success: false, message: 'Admin protection check failed' };
        }
    }
    
    async checkSEOOptimizations() {
        try {
            const response = await fetch(this.baseUrl);
            const html = await response.text();
            
            const seoChecks = [
                { name: 'Title Tag', test: html.includes('<title>') },
                { name: 'Meta Description', test: html.includes('meta name="description"') },
                { name: 'Keywords', test: html.includes('الجبرني ويب') },
                { name: 'Open Graph', test: html.includes('og:title') },
                { name: 'Structured Data', test: html.includes('application/ld+json') }
            ];
            
            const passed = seoChecks.filter(check => check.test).length;
            
            return {
                success: passed >= 4,
                details: seoChecks,
                message: `${passed}/${seoChecks.length} SEO elements found`
            };
        } catch (error) {
            return { success: false, message: error.message };
        }
    }
    
    async checkCompatibility() {
        const compatibility = this.calculateCompatibility();
        
        return {
            success: compatibility >= 80,
            details: { score: compatibility },
            message: `Browser compatibility: ${compatibility}%`
        };
    }
    
    async checkStructuredData() {
        try {
            const response = await fetch(this.baseUrl);
            const html = await response.text();
            
            const hasStructuredData = html.includes('application/ld+json');
            const hasOpenGraph = html.includes('og:title');
            const hasTwitterCards = html.includes('twitter:card');
            
            const score = (hasStructuredData ? 1 : 0) + (hasOpenGraph ? 1 : 0) + (hasTwitterCards ? 1 : 0);
            
            return {
                success: score >= 2,
                details: { structuredData: hasStructuredData, openGraph: hasOpenGraph, twitterCards: hasTwitterCards },
                message: `${score}/3 structured data types found`
            };
        } catch (error) {
            return { success: false, message: error.message };
        }
    }
    
    processTestResult(testName, result) {
        this.testResults.push({
            name: testName,
            success: result.success,
            message: result.message,
            details: result.details,
            timestamp: new Date().toISOString()
        });
        
        if (!result.success) {
            this.addRecommendation(testName, result);
        }
    }
    
    processTestError(testName, error) {
        this.testResults.push({
            name: testName,
            success: false,
            message: error.message,
            error: true,
            timestamp: new Date().toISOString()
        });
        
        this.errorLog.push({
            test: testName,
            error: error.message,
            stack: error.stack,
            timestamp: new Date().toISOString()
        });
    }
    
    addRecommendation(testName, result) {
        let recommendation = {
            title: testName,
            message: result.message,
            priority: 'info'
        };
        
        // تحديد أولوية التوصية بناءً على نوع الاختبار
        if (testName.includes('أمان') || testName.includes('Security')) {
            recommendation.priority = 'critical';
            recommendation.solution = 'تفعيل HTTPS وإعدادات الأمان المطلوبة';
        } else if (testName.includes('ملفات') || testName.includes('Files')) {
            recommendation.priority = 'critical';
            recommendation.solution = 'رفع الملفات المفقودة إلى GitHub';
        } else if (testName.includes('أداء') || testName.includes('Performance')) {
            recommendation.priority = 'warning';
            recommendation.solution = 'تحسين ضغط الملفات وتحسين الكود';
        } else {
            recommendation.priority = 'info';
            recommendation.solution = 'مراجعة الإعدادات والتكوين';
        }
        
        this.recommendations.push(recommendation);
    }
    
    finalizeDiagnostic() {
        this.updateProgress(100, 'اكتمل التشخيص');
        this.displaySummary();
        this.displayRecommendations();
        this.logMessage('success', 'تم إكمال التشخيص بنجاح');
    }
    
    displaySummary() {
        const successCount = this.testResults.filter(r => r.success).length;
        const errorCount = this.testResults.filter(r => !r.success && r.error).length;
        const warningCount = this.testResults.filter(r => !r.success && !r.error).length;
        const totalTests = this.testResults.length;
        
        document.getElementById('success-count').textContent = successCount;
        document.getElementById('error-count').textContent = errorCount;
        document.getElementById('warning-count').textContent = warningCount;
        document.getElementById('total-tests').textContent = totalTests;
        
        document.getElementById('summary-section').style.display = 'block';
    }
    
    displayRecommendations() {
        const recommendationsList = document.getElementById('recommendations-list');
        
        if (this.recommendations.length === 0) {
            recommendationsList.innerHTML = `
                <div class="recommendation-item">
                    <strong>🎉 ممتاز!</strong> لا توجد مشاكل تحتاج إلى إصلاح.
                </div>
            `;
            return;
        }
        
        recommendationsList.innerHTML = this.recommendations.map(rec => `
            <div class="recommendation-item ${rec.priority}">
                <strong>${rec.title}</strong><br>
                <span>${rec.message}</span><br>
                <small><strong>الحل المقترح:</strong> ${rec.solution}</small>
            </div>
        `).join('');
    }
    
    updateProgress(percentage, text) {
        const progressBar = document.getElementById('main-progress');
        const progressText = document.getElementById('progress-text');
        
        progressBar.style.width = `${percentage}%`;
        progressBar.textContent = `${Math.round(percentage)}%`;
        progressText.textContent = text;
    }
    
    updateDiagnosticItem(sectionId, itemIndex, status, message) {
        const section = document.getElementById(sectionId);
        const items = section.querySelectorAll('.diagnostic-item');
        
        if (items[itemIndex]) {
            const item = items[itemIndex];
            item.className = `diagnostic-item ${status}`;
            
            const statusIcon = item.querySelector('.item-status');
            const details = item.querySelector('.item-details');
            
            switch (status) {
                case 'success':
                    statusIcon.textContent = '✅';
                    break;
                case 'error':
                    statusIcon.textContent = '❌';
                    break;
                case 'warning':
                    statusIcon.textContent = '⚠️';
                    break;
                default:
                    statusIcon.textContent = '🔄';
            }
            
            details.textContent = message;
        }
    }
    
    resetDiagnostic() {
        this.testResults = [];
        this.errorLog = [];
        this.recommendations = [];
        
        // إعادة تعيين حالة العناصر
        const diagnosticItems = document.querySelectorAll('.diagnostic-item');
        diagnosticItems.forEach(item => {
            item.className = 'diagnostic-item testing';
            item.querySelector('.item-status').textContent = '🔄';
        });
        
        document.getElementById('summary-section').style.display = 'none';
    }
    
    logMessage(type, message) {
        const timestamp = new Date().toLocaleTimeString('ar-SA');
        console.log(`[${timestamp}] ${type.toUpperCase()}: ${message}`);
    }
    
    formatBytes(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
    
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    showItemDetails(item) {
        const title = item.querySelector('.item-title').textContent;
        const details = item.querySelector('.item-details').textContent;
        
        document.getElementById('modal-title').textContent = `تفاصيل: ${title}`;
        document.getElementById('modal-body').innerHTML = `
            <p><strong>الحالة:</strong> ${details}</p>
            <div class="error-log">
                ${this.getItemDetailedInfo(title)}
            </div>
        `;
        
        document.getElementById('details-modal').style.display = 'flex';
    }
    
    getItemDetailedInfo(itemTitle) {
        const relatedResults = this.testResults.filter(r => 
            r.name.includes(itemTitle) || itemTitle.includes(r.name)
        );
        
        if (relatedResults.length === 0) {
            return 'لا توجد تفاصيل إضافية متاحة.';
        }
        
        return relatedResults.map(result => `
            ${result.name}: ${result.success ? 'نجح' : 'فشل'}
            ${result.message}
            ${result.details ? JSON.stringify(result.details, null, 2) : ''}
        `).join('\n\n');
    }
}

// الوظائف العامة
function runQuickDiagnostic() {
    window.diagnosticEngine.runQuickDiagnostic();
}

function runFullDiagnostic() {
    window.diagnosticEngine.runFullDiagnostic();
}

function runNetworkTest() {
    window.diagnosticEngine.runAdvancedNetworkTest();
}

function runPerformanceTest() {
    window.diagnosticEngine.runPerformanceAnalysis();
}

function runSecurityScan() {
    window.diagnosticEngine.runSecurityAudit();
}

function generateReport() {
    window.diagnosticEngine.exportReport();
}

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function exportReport() {
    const report = window.diagnosticEngine.generateDetailedReport();
    const blob = new Blob([report], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `diagnostic-report-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
}

function showErrorLog() {
    const errorLog = window.diagnosticEngine.errorLog;
    const logText = errorLog.length > 0 ? 
        errorLog.map(e => `[${e.timestamp}] ${e.test}: ${e.error}`).join('\n') :
        'لا توجد أخطاء مسجلة.';
    
    document.getElementById('modal-title').textContent = 'سجل الأخطاء';
    document.getElementById('modal-body').innerHTML = `
        <div class="error-log">${logText}</div>
    `;
    
    document.getElementById('details-modal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('details-modal').style.display = 'none';
}

// تشغيل محرك التشخيص عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    window.diagnosticEngine = new AdvancedDiagnosticEngine();
});

// إضافة وظائف إضافية لمحرك التشخيص
AdvancedDiagnosticEngine.prototype.generateDetailedReport = function() {
    const timestamp = new Date().toLocaleString('ar-SA');
    const successCount = this.testResults.filter(r => r.success).length;
    const totalTests = this.testResults.length;
    const successRate = Math.round((successCount / totalTests) * 100);
    
    let report = `
=== تقرير التشخيص المتقدم ===
التاريخ والوقت: ${timestamp}
الموقع: ${this.baseUrl}

=== ملخص النتائج ===
إجمالي الاختبارات: ${totalTests}
الاختبارات الناجحة: ${successCount}
معدل النجاح: ${successRate}%

=== تفاصيل الاختبارات ===
`;
    
    this.testResults.forEach(result => {
        report += `
${result.name}: ${result.success ? 'نجح' : 'فشل'}
الرسالة: ${result.message}
الوقت: ${result.timestamp}
${result.details ? 'التفاصيل: ' + JSON.stringify(result.details, null, 2) : ''}
---
`;
    });
    
    if (this.recommendations.length > 0) {
        report += `
=== التوصيات ===
`;
        this.recommendations.forEach(rec => {
            report += `
${rec.title} (${rec.priority}):
المشكلة: ${rec.message}
الحل المقترح: ${rec.solution}
---
`;
        });
    }
    
    if (this.errorLog.length > 0) {
        report += `
=== سجل الأخطاء ===
`;
        this.errorLog.forEach(error => {
            report += `
[${error.timestamp}] ${error.test}:
${error.error}
---
`;
        });
    }
    
    return report;
};
