// ===== سكريبت تحضير الملفات للنشر =====
// يقوم بفحص وتحضير جميع الملفات المطلوبة للنشر

class DeploymentPreparation {
    constructor() {
        this.requiredFiles = {
            main: [
                'index.html',
                'styles.css',
                'script.js',
                'auto-updater.js',
                'seo-optimization.js',
                'blog.html',
                '404.html',
                'robots.txt',
                'sitemap.xml',
                'manifest.json'
            ],
            admin: [
                'admin/login.html',
                'admin/dashboard.html',
                'admin/admin-styles.css',
                'admin/admin-core.js',
                'admin/live-updater.js',
                'admin/website-updater.js',
                'admin/dashboard.js',
                'admin/deployment-test.js',
                'admin/.htaccess',
                'admin/README.md'
            ]
        };
        
        this.deploymentStatus = {
            filesReady: false,
            githubReady: false,
            pagesEnabled: false,
            tested: false
        };
        
        this.init();
    }
    
    init() {
        this.createDeploymentInterface();
        this.checkFiles();
        this.setupEventListeners();
    }
    
    createDeploymentInterface() {
        const deploymentUI = document.createElement('div');
        deploymentUI.id = 'deployment-ui';
        deploymentUI.innerHTML = `
            <div style="
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 90%;
                max-width: 800px;
                max-height: 90vh;
                background: white;
                border-radius: 15px;
                box-shadow: 0 10px 40px rgba(0,0,0,0.2);
                z-index: 10000;
                font-family: 'Cairo', sans-serif;
                overflow: hidden;
            ">
                <div style="
                    background: linear-gradient(135deg, #667eea, #764ba2);
                    color: white;
                    padding: 2rem;
                    text-align: center;
                ">
                    <h2 style="margin: 0;">🚀 تحضير النشر - الجبرني ويب</h2>
                    <p style="margin: 0.5rem 0 0 0;">جاري فحص وتحضير جميع الملفات للنشر</p>
                </div>
                
                <div style="padding: 2rem; max-height: 60vh; overflow-y: auto;">
                    <div id="deployment-progress">
                        <div class="progress-step" id="step-files">
                            <div class="step-icon">📁</div>
                            <div class="step-content">
                                <h3>فحص الملفات</h3>
                                <div id="files-status">جاري الفحص...</div>
                            </div>
                            <div class="step-status" id="files-check">⏳</div>
                        </div>
                        
                        <div class="progress-step" id="step-github">
                            <div class="step-icon">🐙</div>
                            <div class="step-content">
                                <h3>إعداد GitHub</h3>
                                <div id="github-status">في الانتظار...</div>
                            </div>
                            <div class="step-status" id="github-check">⏳</div>
                        </div>
                        
                        <div class="progress-step" id="step-pages">
                            <div class="step-icon">🌐</div>
                            <div class="step-content">
                                <h3>تفعيل GitHub Pages</h3>
                                <div id="pages-status">في الانتظار...</div>
                            </div>
                            <div class="step-status" id="pages-check">⏳</div>
                        </div>
                        
                        <div class="progress-step" id="step-test">
                            <div class="step-icon">🧪</div>
                            <div class="step-content">
                                <h3>اختبار النشر</h3>
                                <div id="test-status">في الانتظار...</div>
                            </div>
                            <div class="step-status" id="test-check">⏳</div>
                        </div>
                    </div>
                    
                    <div id="deployment-actions" style="margin-top: 2rem;">
                        <div id="file-list" style="display: none;"></div>
                        <div id="github-instructions" style="display: none;"></div>
                        <div id="final-links" style="display: none;"></div>
                    </div>
                </div>
                
                <div style="
                    padding: 1.5rem;
                    border-top: 1px solid #eee;
                    display: flex;
                    gap: 1rem;
                    justify-content: flex-end;
                ">
                    <button onclick="this.closest('#deployment-ui').remove()" style="
                        padding: 0.75rem 1.5rem;
                        background: #6c757d;
                        color: white;
                        border: none;
                        border-radius: 8px;
                        cursor: pointer;
                        font-family: 'Cairo', sans-serif;
                    ">إغلاق</button>
                    
                    <button id="next-step-btn" onclick="window.deploymentPrep.nextStep()" style="
                        padding: 0.75rem 1.5rem;
                        background: #28a745;
                        color: white;
                        border: none;
                        border-radius: 8px;
                        cursor: pointer;
                        font-family: 'Cairo', sans-serif;
                    ">التالي</button>
                </div>
            </div>
            
            <style>
                .progress-step {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    padding: 1rem;
                    margin-bottom: 1rem;
                    border: 1px solid #e9ecef;
                    border-radius: 8px;
                    transition: all 0.3s ease;
                }
                
                .progress-step.active {
                    border-color: #667eea;
                    background: rgba(102, 126, 234, 0.05);
                }
                
                .progress-step.completed {
                    border-color: #28a745;
                    background: rgba(40, 167, 69, 0.05);
                }
                
                .step-icon {
                    font-size: 2rem;
                    width: 60px;
                    text-align: center;
                }
                
                .step-content {
                    flex: 1;
                }
                
                .step-content h3 {
                    margin: 0 0 0.5rem 0;
                    color: #495057;
                }
                
                .step-content div {
                    color: #6c757d;
                    font-size: 0.9rem;
                }
                
                .step-status {
                    font-size: 1.5rem;
                    width: 40px;
                    text-align: center;
                }
                
                .file-item {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 0.5rem;
                    margin-bottom: 0.25rem;
                    background: #f8f9fa;
                    border-radius: 4px;
                    font-size: 0.9rem;
                }
                
                .file-status {
                    padding: 0.25rem 0.5rem;
                    border-radius: 12px;
                    font-size: 0.8rem;
                    font-weight: bold;
                }
                
                .file-status.found {
                    background: #d4edda;
                    color: #155724;
                }
                
                .file-status.missing {
                    background: #f8d7da;
                    color: #721c24;
                }
                
                .file-status.updated {
                    background: #cce5ff;
                    color: #004085;
                }
            </style>
        `;
        
        document.body.appendChild(deploymentUI);
    }
    
    async checkFiles() {
        this.updateStepStatus('step-files', 'active');
        this.updateStatus('files-status', 'جاري فحص الملفات...');
        
        const allFiles = [...this.requiredFiles.main, ...this.requiredFiles.admin];
        const fileResults = [];
        
        for (const file of allFiles) {
            try {
                const response = await fetch(file);
                const status = response.ok ? 'found' : 'missing';
                const size = response.ok ? response.headers.get('content-length') || 'غير معروف' : 'مفقود';
                
                fileResults.push({
                    name: file,
                    status: status,
                    size: size
                });
            } catch (error) {
                fileResults.push({
                    name: file,
                    status: 'missing',
                    size: 'مفقود'
                });
            }
        }
        
        this.displayFileResults(fileResults);
        
        const missingFiles = fileResults.filter(f => f.status === 'missing');
        
        if (missingFiles.length === 0) {
            this.updateStepStatus('step-files', 'completed');
            this.updateStatus('files-status', `✅ جميع الملفات موجودة (${fileResults.length} ملف)`);
            this.deploymentStatus.filesReady = true;
        } else {
            this.updateStatus('files-status', `❌ ${missingFiles.length} ملف مفقود من أصل ${fileResults.length}`);
        }
    }
    
    displayFileResults(results) {
        const fileList = document.getElementById('file-list');
        fileList.style.display = 'block';
        
        let html = '<h4>📋 حالة الملفات:</h4>';
        
        // ملفات الموقع الرئيسي
        html += '<h5>ملفات الموقع الرئيسي:</h5>';
        results.filter(f => this.requiredFiles.main.includes(f.name)).forEach(file => {
            html += `
                <div class="file-item">
                    <span>${file.name}</span>
                    <span class="file-status ${file.status}">${file.status === 'found' ? '✅ موجود' : '❌ مفقود'}</span>
                </div>
            `;
        });
        
        // ملفات لوحة التحكم
        html += '<h5>ملفات لوحة التحكم:</h5>';
        results.filter(f => this.requiredFiles.admin.includes(f.name)).forEach(file => {
            html += `
                <div class="file-item">
                    <span>${file.name}</span>
                    <span class="file-status ${file.status}">${file.status === 'found' ? '✅ موجود' : '❌ مفقود'}</span>
                </div>
            `;
        });
        
        fileList.innerHTML = html;
    }
    
    setupGitHubInstructions() {
        this.updateStepStatus('step-github', 'active');
        this.updateStatus('github-status', 'جاري إعداد التعليمات...');
        
        const githubInstructions = document.getElementById('github-instructions');
        githubInstructions.style.display = 'block';
        githubInstructions.innerHTML = `
            <h4>📤 تعليمات رفع الملفات إلى GitHub:</h4>
            
            <div style="background: #e7f3ff; padding: 1rem; border-radius: 8px; margin-bottom: 1rem;">
                <h5>🔗 معلومات الحساب:</h5>
                <p><strong>المستودع:</strong> <a href="https://github.com/aljabrani-web/aljabrani-web.github.io" target="_blank">aljabrani-web.github.io</a></p>
                <p><strong>اسم المستخدم:</strong> aljabrani-web</p>
            </div>
            
            <div style="background: #fff3cd; padding: 1rem; border-radius: 8px; margin-bottom: 1rem;">
                <h5>⚠️ خطوات مهمة:</h5>
                <ol style="margin: 0; padding-right: 1.5rem;">
                    <li>اذهب إلى المستودع على GitHub</li>
                    <li>اضغط "uploading an existing file"</li>
                    <li>ارفع جميع الملفات (يمكن رفعها دفعة واحدة)</li>
                    <li>اكتب رسالة commit: "نشر الموقع مع لوحة التحكم"</li>
                    <li>اضغط "Commit changes"</li>
                </ol>
            </div>
            
            <div style="text-align: center; margin: 1rem 0;">
                <button onclick="window.open('https://github.com/aljabrani-web/aljabrani-web.github.io', '_blank')" style="
                    padding: 1rem 2rem;
                    background: #24292e;
                    color: white;
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                    font-size: 16px;
                    font-family: 'Cairo', sans-serif;
                ">
                    🐙 فتح GitHub الآن
                </button>
            </div>
        `;
        
        this.updateStatus('github-status', '📤 تعليمات الرفع جاهزة');
        this.deploymentStatus.githubReady = true;
    }
    
    setupPagesInstructions() {
        this.updateStepStatus('step-pages', 'active');
        this.updateStatus('pages-status', 'جاري إعداد تعليمات Pages...');
        
        const pagesInstructions = `
            <h4>🌐 تفعيل GitHub Pages:</h4>
            
            <div style="background: #d4edda; padding: 1rem; border-radius: 8px; margin-bottom: 1rem;">
                <h5>📋 خطوات التفعيل:</h5>
                <ol style="margin: 0; padding-right: 1.5rem;">
                    <li>في صفحة المستودع، اضغط تبويب "Settings"</li>
                    <li>انزل في القائمة الجانبية إلى "Pages"</li>
                    <li>في Source، اختر "Deploy from a branch"</li>
                    <li>اختر Branch: "main"</li>
                    <li>اختر Folder: "/ (root)"</li>
                    <li>اضغط "Save"</li>
                </ol>
            </div>
            
            <div style="text-align: center; margin: 1rem 0;">
                <button onclick="window.open('https://github.com/aljabrani-web/aljabrani-web.github.io/settings/pages', '_blank')" style="
                    padding: 1rem 2rem;
                    background: #28a745;
                    color: white;
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                    font-size: 16px;
                    font-family: 'Cairo', sans-serif;
                ">
                    ⚙️ فتح إعدادات Pages
                </button>
            </div>
        `;
        
        document.getElementById('github-instructions').innerHTML += pagesInstructions;
        this.updateStatus('pages-status', '⚙️ تعليمات التفعيل جاهزة');
        this.deploymentStatus.pagesEnabled = true;
    }
    
    setupFinalTest() {
        this.updateStepStatus('step-test', 'active');
        this.updateStatus('test-status', 'جاري إعداد الاختبار النهائي...');
        
        const finalLinks = document.getElementById('final-links');
        finalLinks.style.display = 'block';
        finalLinks.innerHTML = `
            <h4>🎯 الروابط النهائية للاختبار:</h4>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">
                <div style="background: #e7f3ff; padding: 1rem; border-radius: 8px; text-align: center;">
                    <h5>🏠 الموقع الرئيسي</h5>
                    <p style="font-family: monospace; background: white; padding: 0.5rem; border-radius: 4px; margin: 0.5rem 0;">
                        https://aljabrani-web.github.io
                    </p>
                    <button onclick="window.open('https://aljabrani-web.github.io', '_blank')" style="
                        padding: 0.5rem 1rem;
                        background: #007bff;
                        color: white;
                        border: none;
                        border-radius: 4px;
                        cursor: pointer;
                        font-family: 'Cairo', sans-serif;
                    ">اختبار الموقع</button>
                </div>
                
                <div style="background: #fff3cd; padding: 1rem; border-radius: 8px; text-align: center;">
                    <h5>🔧 لوحة التحكم</h5>
                    <p style="font-family: monospace; background: white; padding: 0.5rem; border-radius: 4px; margin: 0.5rem 0;">
                        /admin/login.html
                    </p>
                    <p style="font-size: 0.9rem; margin: 0.5rem 0;">
                        <strong>الدخول:</strong> admin / admin123
                    </p>
                    <button onclick="window.open('https://aljabrani-web.github.io/admin/login.html', '_blank')" style="
                        padding: 0.5rem 1rem;
                        background: #ffc107;
                        color: #212529;
                        border: none;
                        border-radius: 4px;
                        cursor: pointer;
                        font-family: 'Cairo', sans-serif;
                    ">اختبار لوحة التحكم</button>
                </div>
            </div>
            
            <div style="background: #d1ecf1; padding: 1rem; border-radius: 8px; text-align: center;">
                <h5>⏰ ملاحظة مهمة</h5>
                <p>قد يستغرق النشر الأول 5-10 دقائق. إذا لم تعمل الروابط فوراً، انتظر قليلاً ثم جرب مرة أخرى.</p>
            </div>
            
            <div style="text-align: center; margin-top: 1rem;">
                <button onclick="window.deploymentPrep.runFinalTest()" style="
                    padding: 1rem 2rem;
                    background: linear-gradient(135deg, #667eea, #764ba2);
                    color: white;
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                    font-size: 16px;
                    font-family: 'Cairo', sans-serif;
                    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
                ">
                    🧪 تشغيل الاختبار الشامل
                </button>
            </div>
        `;
        
        this.updateStatus('test-status', '🎯 روابط الاختبار جاهزة');
        this.deploymentStatus.tested = true;
    }
    
    runFinalTest() {
        // فتح الموقع الرئيسي
        window.open('https://aljabrani-web.github.io', '_blank');
        
        // فتح لوحة التحكم بعد ثانيتين
        setTimeout(() => {
            window.open('https://aljabrani-web.github.io/admin/login.html', '_blank');
        }, 2000);
        
        // تحديث حالة الاختبار
        this.updateStepStatus('step-test', 'completed');
        this.updateStatus('test-status', '✅ تم تشغيل الاختبار');
        
        // إظهار رسالة نجاح
        setTimeout(() => {
            alert('🎉 تم تشغيل الاختبار! تحقق من الروابط المفتوحة للتأكد من عمل الموقع ولوحة التحكم.');
        }, 3000);
    }
    
    nextStep() {
        if (!this.deploymentStatus.filesReady) {
            this.checkFiles();
        } else if (!this.deploymentStatus.githubReady) {
            this.setupGitHubInstructions();
        } else if (!this.deploymentStatus.pagesEnabled) {
            this.setupPagesInstructions();
        } else if (!this.deploymentStatus.tested) {
            this.setupFinalTest();
        } else {
            this.runFinalTest();
        }
    }
    
    updateStepStatus(stepId, status) {
        const step = document.getElementById(stepId);
        const statusIcon = step.querySelector('.step-status');
        
        step.className = `progress-step ${status}`;
        
        switch (status) {
            case 'active':
                statusIcon.textContent = '🔄';
                break;
            case 'completed':
                statusIcon.textContent = '✅';
                break;
            default:
                statusIcon.textContent = '⏳';
        }
    }
    
    updateStatus(elementId, message) {
        const element = document.getElementById(elementId);
        if (element) {
            element.textContent = message;
        }
    }
    
    setupEventListeners() {
        // إضافة مستمعات الأحداث حسب الحاجة
    }
}

// تشغيل تحضير النشر
document.addEventListener('DOMContentLoaded', () => {
    // إضافة زر تحضير النشر
    const prepButton = document.createElement('button');
    prepButton.innerHTML = '🚀 تحضير النشر';
    prepButton.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        background: linear-gradient(135deg, #667eea, #764ba2);
        color: white;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        font-family: 'Cairo', sans-serif;
        font-weight: bold;
        box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
        z-index: 1000;
    `;
    
    prepButton.addEventListener('click', () => {
        window.deploymentPrep = new DeploymentPreparation();
    });
    
    document.body.appendChild(prepButton);
});

// تصدير للاستخدام الخارجي
window.DeploymentPreparation = DeploymentPreparation;
