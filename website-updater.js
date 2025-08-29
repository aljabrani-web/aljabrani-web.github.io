// ===== Website Content Updater =====
class WebsiteUpdater {
    constructor() {
        this.mainWebsiteUrl = '../index.html';
        this.blogPageUrl = '../blog.html';
    }

    // ===== Update Main Website =====
    async updateMainWebsite(data) {
        try {
            // This would typically send data to a server
            // For now, we'll update localStorage and show instructions
            this.updateLocalStorage(data);
            this.generateUpdateInstructions(data);
            return true;
        } catch (error) {
            console.error('Error updating website:', error);
            return false;
        }
    }

    updateLocalStorage(data) {
        // Store all data in localStorage for the main website to read
        localStorage.setItem('websiteData', JSON.stringify({
            personalInfo: data.personalInfo,
            skills: data.skills,
            portfolio: data.portfolio,
            blog: data.blog,
            settings: data.settings,
            lastUpdated: Date.now()
        }));
    }

    generateUpdateInstructions(data) {
        const instructions = this.createUpdateScript(data);
        
        // Create a downloadable file with update instructions
        const blob = new Blob([instructions], { type: 'text/javascript' });
        const url = URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = 'website-update.js';
        link.style.display = 'none';
        document.body.appendChild(link);
        
        // Show modal with instructions
        this.showUpdateModal(url);
    }

    createUpdateScript(data) {
        return `
// ===== Website Auto-Update Script =====
// Generated on: ${new Date().toLocaleString('ar-SA')}

(function() {
    'use strict';
    
    // Website data
    const websiteData = ${JSON.stringify(data, null, 2)};
    
    // Update personal information
    function updatePersonalInfo() {
        const info = websiteData.personalInfo;
        
        // Update hero section
        const heroTitle = document.querySelector('.hero-title');
        if (heroTitle) {
            heroTitle.innerHTML = 'مرحباً، أنا <span class="highlight">' + info.name + '</span>';
        }
        
        const heroSubtitle = document.querySelector('.hero-subtitle');
        if (heroSubtitle) {
            heroSubtitle.textContent = info.title;
        }
        
        const heroDescription = document.querySelector('.hero-description');
        if (heroDescription) {
            heroDescription.textContent = info.bio;
        }
        
        // Update about section
        const aboutText = document.querySelector('.about-text p');
        if (aboutText) {
            aboutText.textContent = info.bio;
        }
        
        // Update contact information
        const contactItems = document.querySelectorAll('.contact-item');
        contactItems.forEach(item => {
            const icon = item.querySelector('i');
            if (icon.classList.contains('fa-envelope')) {
                item.querySelector('p').textContent = info.email;
            } else if (icon.classList.contains('fa-phone')) {
                item.querySelector('p').textContent = info.phone;
            } else if (icon.classList.contains('fa-map-marker-alt')) {
                item.querySelector('p').textContent = info.location;
            }
        });
        
        // Update social links
        if (info.social) {
            const socialLinks = document.querySelectorAll('.social-link');
            socialLinks.forEach(link => {
                const icon = link.querySelector('i');
                if (icon.classList.contains('fa-linkedin') && info.social.linkedin) {
                    link.href = info.social.linkedin;
                } else if (icon.classList.contains('fa-github') && info.social.github) {
                    link.href = info.social.github;
                } else if (icon.classList.contains('fa-twitter') && info.social.twitter) {
                    link.href = info.social.twitter;
                } else if (icon.classList.contains('fa-instagram') && info.social.instagram) {
                    link.href = info.social.instagram;
                }
            });
        }
        
        // Update avatar if provided
        if (info.avatar) {
            const avatars = document.querySelectorAll('.hero-avatar, .about-avatar');
            avatars.forEach(avatar => {
                avatar.innerHTML = '<img src="' + info.avatar + '" alt="' + info.name + '" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;">';
            });
        }
    }
    
    // Update skills section
    function updateSkills() {
        const skillsGrid = document.querySelector('.skills-grid');
        if (!skillsGrid || !websiteData.skills) return;
        
        skillsGrid.innerHTML = websiteData.skills.map(skill => \`
            <div class="skill-card">
                <div class="skill-icon">
                    <i class="\${skill.icon}"></i>
                </div>
                <h3>\${skill.name}</h3>
                <div class="skill-bar">
                    <div class="skill-progress" data-width="\${skill.percentage}%"></div>
                </div>
                <span class="skill-percentage">\${skill.percentage}%</span>
            </div>
        \`).join('');
        
        // Animate skill bars
        setTimeout(() => {
            document.querySelectorAll('.skill-progress').forEach(bar => {
                const width = bar.getAttribute('data-width');
                bar.style.width = width;
            });
        }, 500);
    }
    
    // Update portfolio section
    function updatePortfolio() {
        const portfolioGrid = document.querySelector('.portfolio-grid');
        if (!portfolioGrid || !websiteData.portfolio) return;
        
        portfolioGrid.innerHTML = websiteData.portfolio.map(project => \`
            <div class="portfolio-item" data-category="\${project.category}">
                <div class="portfolio-image">
                    \${project.image ? 
                        \`<img src="\${project.image}" alt="\${project.title}">\` : 
                        \`<div class="portfolio-placeholder">
                            <i class="fas fa-\${project.category === 'web' ? 'globe' : project.category === 'app' ? 'mobile-alt' : 'paint-brush'}"></i>
                        </div>\`
                    }
                </div>
                <div class="portfolio-content">
                    <h3>\${project.title}</h3>
                    <p>\${project.description}</p>
                    <div class="portfolio-tech">
                        \${project.technologies ? project.technologies.map(tech => \`<span>\${tech}</span>\`).join('') : ''}
                    </div>
                    <div class="portfolio-links">
                        \${project.liveUrl ? \`<a href="\${project.liveUrl}" class="portfolio-link" target="_blank"><i class="fas fa-external-link-alt"></i></a>\` : ''}
                        \${project.githubUrl ? \`<a href="\${project.githubUrl}" class="portfolio-link" target="_blank"><i class="fab fa-github"></i></a>\` : ''}
                    </div>
                </div>
            </div>
        \`).join('');
    }
    
    // Update blog section (if blog page exists)
    function updateBlog() {
        if (!websiteData.blog || websiteData.blog.length === 0) return;
        
        // Update blog page if it exists
        const blogGrid = document.querySelector('.portfolio-grid'); // Reusing portfolio grid for blog
        if (blogGrid && window.location.pathname.includes('blog')) {
            const publishedArticles = websiteData.blog.filter(article => article.status === 'published');
            
            blogGrid.innerHTML = publishedArticles.map(article => \`
                <article class="blog-post">
                    <h2>\${article.title}</h2>
                    <div class="blog-meta">
                        <span><i class="fas fa-calendar"></i> \${new Date(article.publishDate).toLocaleDateString('ar-SA')}</span>
                        <span><i class="fas fa-user"></i> \${websiteData.personalInfo.name}</span>
                        <span><i class="fas fa-tag"></i> \${article.category}</span>
                    </div>
                    <p class="blog-excerpt">\${article.excerpt}</p>
                    <a href="#" class="read-more">اقرأ المزيد <i class="fas fa-arrow-left"></i></a>
                </article>
            \`).join('');
        }
    }
    
    // Update meta tags
    function updateMetaTags() {
        const info = websiteData.personalInfo;
        const settings = websiteData.settings;
        
        // Update title
        document.title = info.name + ' - ' + info.title;
        
        // Update meta description
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
            metaDescription.content = info.bio;
        }
        
        // Update Open Graph tags
        const ogTitle = document.querySelector('meta[property="og:title"]');
        if (ogTitle) {
            ogTitle.content = info.name + ' - ' + info.title;
        }
        
        const ogDescription = document.querySelector('meta[property="og:description"]');
        if (ogDescription) {
            ogDescription.content = info.bio;
        }
        
        // Update structured data
        const structuredData = document.querySelector('script[type="application/ld+json"]');
        if (structuredData) {
            const data = JSON.parse(structuredData.textContent);
            data.name = info.name;
            data.jobTitle = info.title;
            data.description = info.bio;
            data.contactPoint.email = info.email;
            data.contactPoint.telephone = info.phone;
            if (info.social) {
                data.sameAs = Object.values(info.social).filter(url => url);
            }
            structuredData.textContent = JSON.stringify(data, null, 2);
        }
    }
    
    // Main update function
    function updateWebsite() {
        try {
            updatePersonalInfo();
            updateSkills();
            updatePortfolio();
            updateBlog();
            updateMetaTags();
            
            console.log('✅ تم تحديث الموقع بنجاح!');
            
            // Show success notification if notification system exists
            if (typeof showNotification === 'function') {
                showNotification('تم تحديث الموقع بنجاح!', 'success');
            }
            
        } catch (error) {
            console.error('❌ خطأ في تحديث الموقع:', error);
        }
    }
    
    // Run update when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', updateWebsite);
    } else {
        updateWebsite();
    }
    
    // Store data in localStorage for future use
    localStorage.setItem('websiteData', JSON.stringify(websiteData));
    localStorage.setItem('lastUpdate', Date.now().toString());
    
})();

// ===== Instructions for manual integration =====
/*
لتطبيق هذا التحديث على موقعك:

1. احفظ هذا الملف باسم 'website-update.js'
2. أضف السطر التالي في نهاية ملف index.html قبل إغلاق </body>:
   <script src="website-update.js"></script>
3. أضف نفس السطر في ملف blog.html إذا كان موجوداً
4. ارفع الملفات على الخادم أو منصة الاستضافة

أو يمكنك نسخ محتوى هذا الملف ولصقه في console المتصفح لتطبيق التحديث فوراً.
*/
`;
    }

    showUpdateModal(downloadUrl) {
        // Remove existing modal if any
        const existingModal = document.getElementById('updateModal');
        if (existingModal) {
            existingModal.remove();
        }

        const modal = document.createElement('div');
        modal.id = 'updateModal';
        modal.className = 'modal show';
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 600px;">
                <div class="modal-header">
                    <h3 class="modal-title">تحديث الموقع الرئيسي</h3>
                    <button type="button" class="modal-close" onclick="this.closest('.modal').remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="update-instructions">
                        <div class="instruction-step">
                            <div class="step-number">1</div>
                            <div class="step-content">
                                <h4>تحميل ملف التحديث</h4>
                                <p>اضغط على الزر أدناه لتحميل ملف JavaScript الذي يحتوي على آخر التحديثات</p>
                                <a href="${downloadUrl}" download="website-update.js" class="btn btn-primary">
                                    <i class="fas fa-download"></i>
                                    تحميل ملف التحديث
                                </a>
                            </div>
                        </div>
                        
                        <div class="instruction-step">
                            <div class="step-number">2</div>
                            <div class="step-content">
                                <h4>رفع الملف للموقع</h4>
                                <p>ارفع ملف <code>website-update.js</code> إلى نفس مجلد الموقع الرئيسي</p>
                            </div>
                        </div>
                        
                        <div class="instruction-step">
                            <div class="step-number">3</div>
                            <div class="step-content">
                                <h4>إضافة السكريبت للموقع</h4>
                                <p>أضف السطر التالي في نهاية ملف <code>index.html</code> قبل إغلاق <code>&lt;/body&gt;</code>:</p>
                                <div class="code-block">
                                    <code>&lt;script src="website-update.js"&gt;&lt;/script&gt;</code>
                                    <button class="copy-btn" onclick="this.previousElementSibling.select(); document.execCommand('copy'); this.textContent='تم النسخ!'">
                                        نسخ
                                    </button>
                                </div>
                            </div>
                        </div>
                        
                        <div class="instruction-step">
                            <div class="step-number">4</div>
                            <div class="step-content">
                                <h4>التحديث الفوري (اختياري)</h4>
                                <p>للتطبيق الفوري، انسخ محتوى الملف والصقه في console المتصفح</p>
                                <button class="btn btn-secondary" onclick="this.nextElementSibling.style.display='block'; this.style.display='none'">
                                    عرض الكود
                                </button>
                                <div class="code-block" style="display: none; max-height: 200px; overflow-y: auto;">
                                    <textarea readonly style="width: 100%; height: 150px; font-family: monospace; font-size: 12px;">${this.createUpdateScript(window.adminCore.data)}</textarea>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="update-options">
                        <h4>خيارات إضافية:</h4>
                        <button class="btn btn-info" onclick="window.open('../index.html', '_blank')">
                            <i class="fas fa-eye"></i>
                            معاينة الموقع الحالي
                        </button>
                        <button class="btn btn-success" id="autoUpdateBtn">
                            <i class="fas fa-magic"></i>
                            تحديث تلقائي (تجريبي)
                        </button>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" onclick="this.closest('.modal').remove()">
                        إغلاق
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Handle auto update button
        const autoUpdateBtn = document.getElementById('autoUpdateBtn');
        if (autoUpdateBtn) {
            autoUpdateBtn.addEventListener('click', () => {
                this.performAutoUpdate();
            });
        }

        // Clean up URL after modal is closed
        setTimeout(() => {
            URL.revokeObjectURL(downloadUrl);
        }, 60000); // Clean up after 1 minute
    }

    performAutoUpdate() {
        try {
            // Execute the update script in the main window context
            const script = this.createUpdateScript(window.adminCore.data);
            
            // Try to update if we have access to the main window
            if (window.opener && !window.opener.closed) {
                window.opener.eval(script);
                window.adminCore.showNotification('تم تحديث الموقع الرئيسي تلقائياً!', 'success');
            } else {
                // Store the script for the main website to pick up
                localStorage.setItem('pendingWebsiteUpdate', script);
                localStorage.setItem('updateTimestamp', Date.now().toString());
                window.adminCore.showNotification('تم حفظ التحديث. سيتم تطبيقه عند زيارة الموقع الرئيسي.', 'info');
            }
        } catch (error) {
            console.error('Auto update failed:', error);
            window.adminCore.showNotification('فشل التحديث التلقائي. استخدم الطريقة اليدوية.', 'error');
        }
    }

    // ===== Export/Import Functions =====
    exportAllData() {
        const data = {
            personalInfo: window.adminCore.data.personalInfo,
            skills: window.adminCore.data.skills,
            portfolio: window.adminCore.data.portfolio,
            blog: window.adminCore.data.blog,
            settings: window.adminCore.data.settings,
            exportDate: new Date().toISOString(),
            version: '1.0'
        };

        const dataStr = JSON.stringify(data, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `website-data-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        
        URL.revokeObjectURL(url);
        window.adminCore.showNotification('تم تصدير البيانات بنجاح', 'success');
    }

    importData(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = (e) => {
                try {
                    const data = JSON.parse(e.target.result);
                    
                    // Validate data structure
                    if (!this.validateImportData(data)) {
                        reject(new Error('ملف البيانات غير صحيح'));
                        return;
                    }
                    
                    // Import data
                    if (data.personalInfo) window.adminCore.data.personalInfo = data.personalInfo;
                    if (data.skills) window.adminCore.data.skills = data.skills;
                    if (data.portfolio) window.adminCore.data.portfolio = data.portfolio;
                    if (data.blog) window.adminCore.data.blog = data.blog;
                    if (data.settings) window.adminCore.data.settings = data.settings;
                    
                    // Save to localStorage
                    Object.keys(window.adminCore.data).forEach(key => {
                        if (data[key]) {
                            localStorage.setItem(`website${key.charAt(0).toUpperCase() + key.slice(1)}`, JSON.stringify(data[key]));
                        }
                    });
                    
                    resolve(data);
                } catch (error) {
                    reject(error);
                }
            };
            
            reader.onerror = () => reject(new Error('خطأ في قراءة الملف'));
            reader.readAsText(file);
        });
    }

    validateImportData(data) {
        // Basic validation
        if (!data || typeof data !== 'object') return false;
        
        // Check for required fields
        const requiredFields = ['personalInfo', 'skills', 'portfolio'];
        return requiredFields.some(field => data.hasOwnProperty(field));
    }
}

// Initialize website updater
window.websiteUpdater = new WebsiteUpdater();
