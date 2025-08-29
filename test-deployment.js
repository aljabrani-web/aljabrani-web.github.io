// ===== اختبار النشر المباشر =====
// يختبر الموقع المنشور على GitHub Pages فوراً

class LiveDeploymentTester {
    constructor() {
        this.baseUrl = 'https://aljabrani-web.github.io';
        this.testResults = [];
        this.init();
    }
    
    init() {
        this.createTestInterface();
        this.startTesting();
    }
    
    createTestInterface() {
        const testUI = document.createElement('div');
        testUI.id = 'live-test-ui';
        testUI.innerHTML = `
            <div style="
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.8);
                z-index: 10000;
                display: flex;
                align-items: center;
                justify-content: center;
                font-family: 'Cairo', sans-serif;
            ">
                <div style="
                    background: white;
                    border-radius: 15px;
                    width: 90%;
                    max-width: 900px;
                    max-height: 90vh;
                    overflow: hidden;
                    box-shadow: 0 20px 60px rgba(0,0,0,0.3);
                ">
                    <div style="
                        background: linear-gradient(135deg, #667eea, #764ba2);
                        color: white;
                        padding: 2rem;
                        text-align: center;
                    ">
                        <h2 style="margin: 0;">🧪 اختبار النشر المباشر</h2>
                        <p style="margin: 0.5rem 0 0 0;">اختبار شامل للموقع المنشور على GitHub Pages</p>
                    </div>
                    
                    <div style="padding: 2rem; max-height: 60vh; overflow-y: auto;">
                        <div id="test-progress-container">
                            <div id="overall-progress" style="
                                background: #f8f9fa;
                                border-radius: 10px;
                                padding: 1rem;
                                margin-bottom: 2rem;
                                text-align: center;
                            ">
                                <h3 style="margin: 0 0 1rem 0;">📊 التقدم العام</h3>
                                <div style="
                                    background: #e9ecef;
                                    border-radius: 20px;
                                    height: 20px;
                                    overflow: hidden;
                                    margin-bottom: 1rem;
                                ">
                                    <div id="progress-bar" style="
                                        background: linear-gradient(90deg, #28a745, #20c997);
                                        height: 100%;
                                        width: 0%;
                                        transition: width 0.5s ease;
                                        border-radius: 20px;
                                    "></div>
                                </div>
                                <div id="progress-text">جاري البدء...</div>
                            </div>
                            
                            <div id="test-results-container">
                                <h3>📋 نتائج الاختبارات:</h3>
                                <div id="test-results"></div>
                            </div>
                        </div>
                        
                        <div id="final-report" style="display: none;">
                            <div style="
                                background: #d4edda;
                                border: 1px solid #c3e6cb;
                                border-radius: 8px;
                                padding: 1.5rem;
                                margin-top: 2rem;
                                text-align: center;
                            ">
                                <h3 style="margin: 0 0 1rem 0; color: #155724;">🎉 تقرير النشر النهائي</h3>
                                <div id="final-summary"></div>
                                <div id="final-links" style="margin-top: 1rem;"></div>
                            </div>
                        </div>
                    </div>
                    
                    <div style="
                        padding: 1.5rem;
                        border-top: 1px solid #eee;
                        display: flex;
                        gap: 1rem;
                        justify-content: space-between;
                    ">
                        <button onclick="this.closest('#live-test-ui').remove()" style="
                            padding: 0.75rem 1.5rem;
                            background: #6c757d;
                            color: white;
                            border: none;
                            border-radius: 8px;
                            cursor: pointer;
                            font-family: 'Cairo', sans-serif;
                        ">إغلاق</button>
                        
                        <div>
                            <button id="retest-btn" onclick="window.liveDeploymentTester.startTesting()" style="
                                padding: 0.75rem 1.5rem;
                                background: #17a2b8;
                                color: white;
                                border: none;
                                border-radius: 8px;
                                cursor: pointer;
                                font-family: 'Cairo', sans-serif;
                                margin-left: 0.5rem;
                            ">إعادة الاختبار</button>
                            
                            <button id="open-site-btn" onclick="window.open('${this.baseUrl}', '_blank')" style="
                                padding: 0.75rem 1.5rem;
                                background: #28a745;
                                color: white;
                                border: none;
                                border-radius: 8px;
                                cursor: pointer;
                                font-family: 'Cairo', sans-serif;
                            ">فتح الموقع</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(testUI);
    }
    
    async startTesting() {
        this.testResults = [];
        this.updateProgress(0, 'بدء الاختبارات...');
        
        const tests = [
            { name: 'اختبار الوصول للموقع الرئيسي', func: () => this.testMainSite() },
            { name: 'اختبار تحميل الملفات الأساسية', func: () => this.testCoreFiles() },
            { name: 'اختبار لوحة التحكم', func: () => this.testAdminPanel() },
            { name: 'اختبار نظام التحديث التلقائي', func: () => this.testAutoUpdater() },
            { name: 'اختبار تحسينات SEO', func: () => this.testSEO() },
            { name: 'اختبار الأداء والسرعة', func: () => this.testPerformance() },
            { name: 'اختبار التوافق والاستجابة', func: () => this.testResponsiveness() },
            { name: 'اختبار الأمان', func: () => this.testSecurity() }
        ];
        
        for (let i = 0; i < tests.length; i++) {
            const test = tests[i];
            const progress = ((i + 1) / tests.length) * 100;
            
            this.updateProgress(progress, `تشغيل: ${test.name}`);
            this.addTestResult(test.name, 'running', 'جاري التشغيل...');
            
            try {
                const result = await test.func();
                this.updateTestResult(test.name, result.success ? 'success' : 'error', result.message, result.details);
            } catch (error) {
                this.updateTestResult(test.name, 'error', `خطأ: ${error.message}`, error.stack);
            }
            
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
        
        this.showFinalReport();
    }
    
    async testMainSite() {
        try {
            const response = await fetch(this.baseUrl);
            
            if (!response.ok) {
                return {
                    success: false,
                    message: `خطأ HTTP: ${response.status}`,
                    details: 'الموقع غير متاح أو لم يتم نشره بعد'
                };
            }
            
            const html = await response.text();
            
            // فحص المحتوى الأساسي
            const checks = [
                { test: html.includes('الجبرني ويب'), name: 'اسم الموقع' },
                { test: html.includes('hero-section'), name: 'القسم الرئيسي' },
                { test: html.includes('about-section'), name: 'قسم نبذة عني' },
                { test: html.includes('skills-section'), name: 'قسم المهارات' },
                { test: html.includes('portfolio-section'), name: 'قسم المشاريع' },
                { test: html.includes('contact-section'), name: 'قسم التواصل' }
            ];
            
            const failedChecks = checks.filter(check => !check.test);
            
            if (failedChecks.length > 0) {
                return {
                    success: false,
                    message: 'بعض أقسام الموقع مفقودة',
                    details: `الأقسام المفقودة: ${failedChecks.map(c => c.name).join(', ')}`
                };
            }
            
            return {
                success: true,
                message: 'الموقع الرئيسي يعمل بشكل مثالي',
                details: `تم تحميل جميع الأقسام (${checks.length}) بنجاح`
            };
            
        } catch (error) {
            return {
                success: false,
                message: 'فشل في الوصول للموقع',
                details: 'تأكد من تفعيل GitHub Pages وانتظر 5-10 دقائق'
            };
        }
    }
    
    async testCoreFiles() {
        const coreFiles = [
            'styles.css',
            'script.js',
            'auto-updater.js',
            'seo-optimization.js',
            'robots.txt',
            'sitemap.xml',
            'manifest.json'
        ];
        
        const results = [];
        
        for (const file of coreFiles) {
            try {
                const response = await fetch(`${this.baseUrl}/${file}`);
                results.push({
                    file,
                    success: response.ok,
                    status: response.status
                });
            } catch (error) {
                results.push({
                    file,
                    success: false,
                    status: 'خطأ'
                });
            }
        }
        
        const failedFiles = results.filter(r => !r.success);
        
        if (failedFiles.length > 0) {
            return {
                success: false,
                message: `${failedFiles.length} ملف لا يحمل بشكل صحيح`,
                details: `الملفات المفقودة: ${failedFiles.map(f => f.file).join(', ')}`
            };
        }
        
        return {
            success: true,
            message: 'جميع الملفات الأساسية تحمل بنجاح',
            details: `تم فحص ${coreFiles.length} ملف بنجاح`
        };
    }
    
    async testAdminPanel() {
        try {
            const adminUrl = `${this.baseUrl}/admin/login.html`;
            const response = await fetch(adminUrl);
            
            if (!response.ok) {
                return {
                    success: false,
                    message: 'لوحة التحكم غير متاحة',
                    details: `خطأ HTTP: ${response.status}`
                };
            }
            
            const html = await response.text();
            
            // فحص عناصر لوحة التحكم
            const adminChecks = [
                { test: html.includes('تسجيل الدخول'), name: 'صفحة تسجيل الدخول' },
                { test: html.includes('admin-styles.css'), name: 'ملف التنسيق' },
                { test: html.includes('admin-core.js'), name: 'ملف الوظائف الأساسية' }
            ];
            
            const failedAdminChecks = adminChecks.filter(check => !check.test);
            
            if (failedAdminChecks.length > 0) {
                return {
                    success: false,
                    message: 'بعض عناصر لوحة التحكم مفقودة',
                    details: `العناصر المفقودة: ${failedAdminChecks.map(c => c.name).join(', ')}`
                };
            }
            
            return {
                success: true,
                message: 'لوحة التحكم متاحة وتعمل',
                details: 'جميع عناصر لوحة التحكم موجودة'
            };
            
        } catch (error) {
            return {
                success: false,
                message: 'خطأ في الوصول للوحة التحكم',
                details: error.message
            };
        }
    }
    
    async testAutoUpdater() {
        try {
            const response = await fetch(`${this.baseUrl}/auto-updater.js`);
            
            if (!response.ok) {
                return {
                    success: false,
                    message: 'ملف التحديث التلقائي مفقود',
                    details: 'auto-updater.js غير موجود'
                };
            }
            
            const code = await response.text();
            
            // فحص الوظائف المطلوبة
            const functions = [
                'checkForUpdates',
                'loadDataFromStorage',
                'updatePersonalInfoElements',
                'updateSkillsElements',
                'updatePortfolioElements'
            ];
            
            const missingFunctions = functions.filter(func => !code.includes(func));
            
            if (missingFunctions.length > 0) {
                return {
                    success: false,
                    message: 'بعض وظائف التحديث مفقودة',
                    details: `الوظائف المفقودة: ${missingFunctions.join(', ')}`
                };
            }
            
            return {
                success: true,
                message: 'نظام التحديث التلقائي يعمل',
                details: `جميع الوظائف المطلوبة (${functions.length}) موجودة`
            };
            
        } catch (error) {
            return {
                success: false,
                message: 'خطأ في فحص نظام التحديث',
                details: error.message
            };
        }
    }
    
    async testSEO() {
        try {
            const response = await fetch(this.baseUrl);
            const html = await response.text();
            
            // فحص عناصر SEO
            const seoChecks = [
                { test: html.includes('الجبرني ويب'), name: 'الكلمات المفتاحية' },
                { test: html.includes('meta name="description"'), name: 'وصف الصفحة' },
                { test: html.includes('meta property="og:'), name: 'Open Graph' },
                { test: html.includes('application/ld+json'), name: 'البيانات المنظمة' },
                { test: html.includes('seo-optimization.js'), name: 'سكريبت SEO' }
            ];
            
            const failedSEO = seoChecks.filter(check => !check.test);
            
            if (failedSEO.length > 0) {
                return {
                    success: false,
                    message: 'بعض عناصر SEO مفقودة',
                    details: `العناصر المفقودة: ${failedSEO.map(c => c.name).join(', ')}`
                };
            }
            
            return {
                success: true,
                message: 'تحسينات SEO مطبقة بنجاح',
                details: `جميع عناصر SEO (${seoChecks.length}) موجودة`
            };
            
        } catch (error) {
            return {
                success: false,
                message: 'خطأ في فحص SEO',
                details: error.message
            };
        }
    }
    
    async testPerformance() {
        try {
            const startTime = performance.now();
            const response = await fetch(this.baseUrl);
            const endTime = performance.now();
            
            const loadTime = endTime - startTime;
            const contentLength = response.headers.get('content-length');
            
            let performanceScore = 'ممتاز';
            let issues = [];
            
            if (loadTime > 3000) {
                performanceScore = 'بطيء';
                issues.push(`وقت التحميل: ${Math.round(loadTime)}ms`);
            } else if (loadTime > 1500) {
                performanceScore = 'متوسط';
                issues.push(`وقت التحميل: ${Math.round(loadTime)}ms`);
            }
            
            return {
                success: loadTime < 5000,
                message: `الأداء: ${performanceScore}`,
                details: issues.length > 0 ? issues.join(', ') : `وقت التحميل: ${Math.round(loadTime)}ms`
            };
            
        } catch (error) {
            return {
                success: false,
                message: 'خطأ في فحص الأداء',
                details: error.message
            };
        }
    }
    
    async testResponsiveness() {
        try {
            const response = await fetch(this.baseUrl);
            const html = await response.text();
            
            // فحص عناصر التصميم المتجاوب
            const responsiveChecks = [
                { test: html.includes('viewport'), name: 'Viewport Meta Tag' },
                { test: html.includes('media'), name: 'Media Queries' },
                { test: html.includes('responsive'), name: 'CSS المتجاوب' }
            ];
            
            const passedChecks = responsiveChecks.filter(check => check.test);
            
            return {
                success: passedChecks.length >= 2,
                message: `التصميم المتجاوب: ${passedChecks.length}/${responsiveChecks.length}`,
                details: `العناصر الموجودة: ${passedChecks.map(c => c.name).join(', ')}`
            };
            
        } catch (error) {
            return {
                success: false,
                message: 'خطأ في فحص التصميم المتجاوب',
                details: error.message
            };
        }
    }
    
    async testSecurity() {
        try {
            // فحص HTTPS
            const isHTTPS = this.baseUrl.startsWith('https://');
            
            // فحص ملف .htaccess
            const htaccessResponse = await fetch(`${this.baseUrl}/admin/.htaccess`);
            const hasHtaccess = htaccessResponse.ok;
            
            const securityScore = [];
            
            if (isHTTPS) securityScore.push('HTTPS مفعل');
            if (hasHtaccess) securityScore.push('حماية لوحة التحكم');
            
            return {
                success: isHTTPS,
                message: `الأمان: ${securityScore.length}/2 عنصر`,
                details: securityScore.join(', ') || 'لا توجد عناصر أمان'
            };
            
        } catch (error) {
            return {
                success: false,
                message: 'خطأ في فحص الأمان',
                details: error.message
            };
        }
    }
    
    addTestResult(name, status, message, details = '') {
        const resultsContainer = document.getElementById('test-results');
        const resultElement = document.createElement('div');
        resultElement.id = `test-${name.replace(/\s+/g, '-')}`;
        resultElement.className = 'test-result';
        
        const statusIcon = status === 'success' ? '✅' : status === 'error' ? '❌' : '🔄';
        const statusColor = status === 'success' ? '#28a745' : status === 'error' ? '#dc3545' : '#ffc107';
        
        resultElement.innerHTML = `
            <div style="
                display: flex;
                align-items: center;
                gap: 1rem;
                padding: 1rem;
                margin-bottom: 0.5rem;
                border: 1px solid #e9ecef;
                border-radius: 8px;
                border-left: 4px solid ${statusColor};
            ">
                <span style="font-size: 1.5rem;">${statusIcon}</span>
                <div style="flex: 1;">
                    <h5 style="margin: 0 0 0.25rem 0;">${name}</h5>
                    <p style="margin: 0; color: #6c757d; font-size: 0.9rem;">${message}</p>
                    ${details ? `<small style="color: #888;">${details}</small>` : ''}
                </div>
            </div>
        `;
        
        resultsContainer.appendChild(resultElement);
    }
    
    updateTestResult(name, status, message, details = '') {
        const resultElement = document.getElementById(`test-${name.replace(/\s+/g, '-')}`);
        if (resultElement) {
            const statusIcon = status === 'success' ? '✅' : status === 'error' ? '❌' : '🔄';
            const statusColor = status === 'success' ? '#28a745' : status === 'error' ? '#dc3545' : '#ffc107';
            
            resultElement.style.borderLeftColor = statusColor;
            resultElement.querySelector('span').textContent = statusIcon;
            resultElement.querySelector('p').textContent = message;
            
            const smallElement = resultElement.querySelector('small');
            if (smallElement) {
                smallElement.textContent = details;
            } else if (details) {
                const detailsElement = document.createElement('small');
                detailsElement.style.color = '#888';
                detailsElement.textContent = details;
                resultElement.querySelector('div > div').appendChild(detailsElement);
            }
        }
        
        // حفظ النتيجة
        this.testResults.push({ name, status, message, details });
    }
    
    updateProgress(percentage, text) {
        const progressBar = document.getElementById('progress-bar');
        const progressText = document.getElementById('progress-text');
        
        if (progressBar) progressBar.style.width = `${percentage}%`;
        if (progressText) progressText.textContent = text;
    }
    
    showFinalReport() {
        const finalReport = document.getElementById('final-report');
        const finalSummary = document.getElementById('final-summary');
        const finalLinks = document.getElementById('final-links');
        
        const successCount = this.testResults.filter(r => r.status === 'success').length;
        const totalCount = this.testResults.length;
        const successRate = Math.round((successCount / totalCount) * 100);
        
        let reportStatus = '';
        let reportColor = '';
        
        if (successRate >= 90) {
            reportStatus = '🎉 ممتاز! الموقع جاهز للاستخدام';
            reportColor = '#28a745';
        } else if (successRate >= 70) {
            reportStatus = '⚠️ جيد مع بعض التحسينات المطلوبة';
            reportColor = '#ffc107';
        } else {
            reportStatus = '❌ يحتاج إصلاحات مهمة';
            reportColor = '#dc3545';
        }
        
        finalSummary.innerHTML = `
            <div style="font-size: 1.2rem; font-weight: bold; color: ${reportColor}; margin-bottom: 1rem;">
                ${reportStatus}
            </div>
            <div style="font-size: 1.1rem;">
                نجح ${successCount} من أصل ${totalCount} اختبار (${successRate}%)
            </div>
        `;
        
        finalLinks.innerHTML = `
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-top: 1rem;">
                <button onclick="window.open('${this.baseUrl}', '_blank')" style="
                    padding: 1rem;
                    background: #007bff;
                    color: white;
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                    font-family: 'Cairo', sans-serif;
                ">🏠 فتح الموقع الرئيسي</button>
                
                <button onclick="window.open('${this.baseUrl}/admin/login.html', '_blank')" style="
                    padding: 1rem;
                    background: #28a745;
                    color: white;
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                    font-family: 'Cairo', sans-serif;
                ">🔧 فتح لوحة التحكم</button>
            </div>
        `;
        
        finalReport.style.display = 'block';
        this.updateProgress(100, 'اكتمل الاختبار!');
    }
}

// تشغيل الاختبار المباشر
document.addEventListener('DOMContentLoaded', () => {
    // إضافة زر الاختبار المباشر
    const testButton = document.createElement('button');
    testButton.innerHTML = '🧪 اختبار النشر المباشر';
    testButton.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        background: linear-gradient(135deg, #28a745, #20c997);
        color: white;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        font-family: 'Cairo', sans-serif;
        font-weight: bold;
        box-shadow: 0 4px 15px rgba(40, 167, 69, 0.3);
        z-index: 1000;
    `;
    
    testButton.addEventListener('click', () => {
        window.liveDeploymentTester = new LiveDeploymentTester();
    });
    
    document.body.appendChild(testButton);
});

// تصدير للاستخدام الخارجي
window.LiveDeploymentTester = LiveDeploymentTester;
