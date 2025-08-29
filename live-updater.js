// ===== Live Website Updater =====
// نظام تحديث الموقع الرئيسي مباشرة من لوحة التحكم

class LiveWebsiteUpdater {
    constructor() {
        this.mainWebsiteFiles = {
            'index.html': '../index.html',
            'blog.html': '../blog.html'
        };
        this.init();
    }

    init() {
        // إضافة أزرار التحديث المباشر
        this.addLiveUpdateButtons();
        
        // مراقبة تغييرات البيانات
        this.watchDataChanges();
    }

    addLiveUpdateButtons() {
        // إضافة زر التحديث المباشر لكل قسم
        const sections = ['personal-info', 'skills', 'portfolio', 'blog'];
        
        sections.forEach(section => {
            const sectionElement = document.getElementById(`${section}-section`);
            if (sectionElement) {
                const formActions = sectionElement.querySelector('.form-actions');
                if (formActions) {
                    const liveUpdateBtn = document.createElement('button');
                    liveUpdateBtn.type = 'button';
                    liveUpdateBtn.className = 'btn btn-info';
                    liveUpdateBtn.innerHTML = '<i class="fas fa-sync"></i> تحديث مباشر';
                    liveUpdateBtn.addEventListener('click', () => this.updateWebsiteLive(section));
                    
                    formActions.insertBefore(liveUpdateBtn, formActions.firstChild);
                }
            }
        });
    }

    watchDataChanges() {
        // مراقبة تغييرات localStorage
        const originalSetItem = localStorage.setItem;
        localStorage.setItem = (key, value) => {
            originalSetItem.call(localStorage, key, value);
            
            // إذا تم تحديث بيانات الموقع، قم بالتحديث التلقائي
            if (key.startsWith('website')) {
                this.scheduleAutoUpdate();
            }
        };
    }

    scheduleAutoUpdate() {
        // تأخير التحديث لتجنب التحديثات المتكررة
        clearTimeout(this.autoUpdateTimeout);
        this.autoUpdateTimeout = setTimeout(() => {
            this.updateAllWebsiteContent();
        }, 2000);
    }

    async updateWebsiteLive(section) {
        try {
            window.adminCore.showLoading(true);
            
            const data = window.adminCore.data;
            let updateSuccess = false;

            switch (section) {
                case 'personal-info':
                    updateSuccess = await this.updatePersonalInfo(data.personalInfo);
                    break;
                case 'skills':
                    updateSuccess = await this.updateSkills(data.skills);
                    break;
                case 'portfolio':
                    updateSuccess = await this.updatePortfolio(data.portfolio);
                    break;
                case 'blog':
                    updateSuccess = await this.updateBlog(data.blog);
                    break;
            }

            window.adminCore.showLoading(false);
            
            if (updateSuccess) {
                window.adminCore.showNotification('تم تحديث الموقع بنجاح!', 'success');
                this.showPreviewOption();
            } else {
                window.adminCore.showNotification('فشل في تحديث الموقع', 'error');
            }

        } catch (error) {
            window.adminCore.showLoading(false);
            console.error('Update error:', error);
            window.adminCore.showNotification('حدث خطأ أثناء التحديث', 'error');
        }
    }

    async updateAllWebsiteContent() {
        const data = window.adminCore.data;
        
        try {
            // تحديث جميع أجزاء الموقع
            await Promise.all([
                this.updatePersonalInfo(data.personalInfo),
                this.updateSkills(data.skills),
                this.updatePortfolio(data.portfolio),
                this.updateBlog(data.blog)
            ]);
            
            // إنشاء ملف التحديث الشامل
            this.generateCompleteUpdate(data);
            
        } catch (error) {
            console.error('Complete update failed:', error);
        }
    }

    async updatePersonalInfo(personalInfo) {
        try {
            // إنشاء سكريبت تحديث المعلومات الشخصية
            const updateScript = this.generatePersonalInfoScript(personalInfo);
            
            // حفظ السكريبت في localStorage للموقع الرئيسي
            localStorage.setItem('personalInfoUpdate', updateScript);
            localStorage.setItem('personalInfoData', JSON.stringify(personalInfo));
            
            return true;
        } catch (error) {
            console.error('Personal info update failed:', error);
            return false;
        }
    }

    generatePersonalInfoScript(info) {
        return `
// تحديث المعلومات الشخصية
(function() {
    const info = ${JSON.stringify(info, null, 2)};
    
    // تحديث العنوان الرئيسي
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle && info.name) {
        heroTitle.innerHTML = 'مرحباً، أنا <span class="highlight">' + info.name + '</span>';
    }
    
    // تحديث المسمى الوظيفي
    const heroSubtitle = document.querySelector('.hero-subtitle');
    if (heroSubtitle && info.title) {
        heroSubtitle.textContent = info.title;
    }
    
    // تحديث النبذة الشخصية
    const heroDescription = document.querySelector('.hero-description');
    if (heroDescription && info.bio) {
        heroDescription.textContent = info.bio;
    }
    
    // تحديث قسم نبذة عني
    const aboutText = document.querySelector('.about-text p');
    if (aboutText && info.bio) {
        aboutText.textContent = info.bio;
    }
    
    // تحديث معلومات التواصل
    const contactItems = document.querySelectorAll('.contact-item');
    contactItems.forEach(item => {
        const icon = item.querySelector('i');
        const textElement = item.querySelector('p');
        
        if (icon && textElement) {
            if (icon.classList.contains('fa-envelope') && info.email) {
                textElement.textContent = info.email;
            } else if (icon.classList.contains('fa-phone') && info.phone) {
                textElement.textContent = info.phone;
            } else if (icon.classList.contains('fa-map-marker-alt') && info.location) {
                textElement.textContent = info.location;
            }
        }
    });
    
    // تحديث الروابط الاجتماعية
    if (info.social) {
        const socialLinks = document.querySelectorAll('.social-link');
        socialLinks.forEach(link => {
            const icon = link.querySelector('i');
            if (icon) {
                if (icon.classList.contains('fa-linkedin') && info.social.linkedin) {
                    link.href = info.social.linkedin;
                } else if (icon.classList.contains('fa-github') && info.social.github) {
                    link.href = info.social.github;
                } else if (icon.classList.contains('fa-twitter') && info.social.twitter) {
                    link.href = info.social.twitter;
                } else if (icon.classList.contains('fa-instagram') && info.social.instagram) {
                    link.href = info.social.instagram;
                }
            }
        });
    }
    
    // تحديث الصورة الشخصية
    if (info.avatar) {
        const avatars = document.querySelectorAll('.hero-avatar, .about-avatar');
        avatars.forEach(avatar => {
            avatar.innerHTML = '<img src="' + info.avatar + '" alt="' + (info.name || 'الصورة الشخصية') + '" style="width: 100%; height: 100%; object-fit: cover; border-radius: inherit;">';
        });
    }
    
    // تحديث عنوان الصفحة
    if (info.name && info.title) {
        document.title = info.name + ' - ' + info.title;
    }
    
    console.log('✅ تم تحديث المعلومات الشخصية');
})();
`;
    }

    async updateSkills(skills) {
        try {
            const updateScript = this.generateSkillsScript(skills);
            localStorage.setItem('skillsUpdate', updateScript);
            localStorage.setItem('skillsData', JSON.stringify(skills));
            return true;
        } catch (error) {
            console.error('Skills update failed:', error);
            return false;
        }
    }

    generateSkillsScript(skills) {
        return `
// تحديث المهارات
(function() {
    const skills = ${JSON.stringify(skills, null, 2)};
    
    const skillsGrid = document.querySelector('.skills-grid');
    if (!skillsGrid || !skills || skills.length === 0) {
        if (skillsGrid) {
            skillsGrid.innerHTML = '<div class="no-skills"><p>لم يتم إضافة مهارات بعد</p></div>';
        }
        return;
    }
    
    skillsGrid.innerHTML = skills.map(skill => \`
        <div class="skill-card">
            <div class="skill-icon">
                <i class="\${skill.icon || 'fas fa-code'}"></i>
            </div>
            <h3>\${skill.name}</h3>
            <div class="skill-bar">
                <div class="skill-progress" data-width="\${skill.percentage}%"></div>
            </div>
            <span class="skill-percentage">\${skill.percentage}%</span>
        </div>
    \`).join('');
    
    // تحريك أشرطة المهارات
    setTimeout(() => {
        document.querySelectorAll('.skill-progress').forEach(bar => {
            const width = bar.getAttribute('data-width');
            bar.style.width = width;
        });
    }, 500);
    
    console.log('✅ تم تحديث المهارات');
})();
`;
    }

    async updatePortfolio(portfolio) {
        try {
            const updateScript = this.generatePortfolioScript(portfolio);
            localStorage.setItem('portfolioUpdate', updateScript);
            localStorage.setItem('portfolioData', JSON.stringify(portfolio));
            return true;
        } catch (error) {
            console.error('Portfolio update failed:', error);
            return false;
        }
    }

    generatePortfolioScript(portfolio) {
        return `
// تحديث معرض الأعمال
(function() {
    const portfolio = ${JSON.stringify(portfolio, null, 2)};
    
    const portfolioGrid = document.querySelector('.portfolio-grid');
    if (!portfolioGrid || !portfolio || portfolio.length === 0) {
        if (portfolioGrid) {
            portfolioGrid.innerHTML = '<div class="no-portfolio"><p>لم يتم إضافة مشاريع بعد</p></div>';
        }
        return;
    }
    
    portfolioGrid.innerHTML = portfolio.map(project => \`
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
    
    console.log('✅ تم تحديث معرض الأعمال');
})();
`;
    }

    async updateBlog(blog) {
        try {
            const publishedArticles = blog.filter(article => article.status === 'published');
            const updateScript = this.generateBlogScript(publishedArticles);
            localStorage.setItem('blogUpdate', updateScript);
            localStorage.setItem('blogData', JSON.stringify(publishedArticles));
            return true;
        } catch (error) {
            console.error('Blog update failed:', error);
            return false;
        }
    }

    generateBlogScript(articles) {
        return `
// تحديث المدونة
(function() {
    const articles = ${JSON.stringify(articles, null, 2)};
    
    // تحديث صفحة المدونة إذا كانت موجودة
    if (window.location.pathname.includes('blog.html')) {
        const blogContainer = document.querySelector('.blog-container');
        if (blogContainer && articles && articles.length > 0) {
            const articlesHtml = articles.map(article => \`
                <article class="blog-post">
                    <h2>\${article.title}</h2>
                    <div class="blog-meta">
                        <span><i class="fas fa-calendar"></i> \${new Date(article.publishDate).toLocaleDateString('ar-SA')}</span>
                        <span><i class="fas fa-tag"></i> \${article.category}</span>
                    </div>
                    <p class="blog-excerpt">\${article.excerpt}</p>
                    <a href="#" class="read-more">اقرأ المزيد <i class="fas fa-arrow-left"></i></a>
                </article>
            \`).join('');
            
            blogContainer.innerHTML = articlesHtml;
        }
    }
    
    console.log('✅ تم تحديث المدونة');
})();
`;
    }

    generateCompleteUpdate(data) {
        const completeScript = `
// تحديث شامل للموقع
(function() {
    console.log('🚀 بدء التحديث الشامل للموقع...');
    
    ${this.generatePersonalInfoScript(data.personalInfo)}
    ${this.generateSkillsScript(data.skills)}
    ${this.generatePortfolioScript(data.portfolio)}
    ${this.generateBlogScript(data.blog.filter(article => article.status === 'published'))}
    
    console.log('✅ تم التحديث الشامل للموقع بنجاح!');
    
    // إظهار رسالة نجاح
    if (typeof showNotification === 'function') {
        showNotification('تم تحديث الموقع بنجاح!', 'success');
    }
})();
`;

        // حفظ السكريبت الشامل
        localStorage.setItem('completeWebsiteUpdate', completeScript);
        localStorage.setItem('lastCompleteUpdate', Date.now().toString());
        
        // إنشاء ملف قابل للتحميل
        this.createDownloadableUpdate(completeScript);
    }

    createDownloadableUpdate(script) {
        const blob = new Blob([script], { type: 'text/javascript' });
        const url = URL.createObjectURL(blob);
        
        // إنشاء رابط تحميل مخفي
        const link = document.createElement('a');
        link.href = url;
        link.download = `website-update-${new Date().toISOString().split('T')[0]}.js`;
        link.style.display = 'none';
        document.body.appendChild(link);
        
        // عرض خيار التحميل
        this.showDownloadOption(url, link);
        
        // تنظيف الرابط بعد دقيقة
        setTimeout(() => {
            URL.revokeObjectURL(url);
            link.remove();
        }, 60000);
    }

    showDownloadOption(url, link) {
        const notification = document.createElement('div');
        notification.className = 'update-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <h4>تم إنشاء ملف التحديث</h4>
                <p>يمكنك تحميل ملف التحديث وتطبيقه على الموقع</p>
                <div class="notification-actions">
                    <button onclick="this.closest('.update-notification').previousElementSibling.click()" class="btn btn-primary btn-sm">
                        تحميل الملف
                    </button>
                    <button onclick="window.liveUpdater.applyUpdateDirectly()" class="btn btn-success btn-sm">
                        تطبيق مباشر
                    </button>
                    <button onclick="this.closest('.update-notification').remove()" class="btn btn-secondary btn-sm">
                        إغلاق
                    </button>
                </div>
            </div>
        `;
        
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: white;
            border-radius: 10px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.15);
            padding: 1.5rem;
            max-width: 350px;
            z-index: 10001;
            border-left: 4px solid #28a745;
        `;
        
        document.body.appendChild(link);
        document.body.appendChild(notification);
    }

    applyUpdateDirectly() {
        try {
            const script = localStorage.getItem('completeWebsiteUpdate');
            if (script) {
                // تطبيق التحديث على النافذة الحالية (للاختبار)
                eval(script);
                window.adminCore.showNotification('تم تطبيق التحديث مباشرة!', 'success');
            }
        } catch (error) {
            console.error('Direct update failed:', error);
            window.adminCore.showNotification('فشل في التطبيق المباشر', 'error');
        }
    }

    showPreviewOption() {
        const previewBtn = document.createElement('button');
        previewBtn.className = 'btn btn-info floating-preview-btn';
        previewBtn.innerHTML = '<i class="fas fa-eye"></i> معاينة التحديث';
        previewBtn.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 20px;
            z-index: 1000;
            animation: pulse 2s infinite;
        `;
        
        previewBtn.addEventListener('click', () => {
            window.open('../index.html', '_blank');
            previewBtn.remove();
        });
        
        document.body.appendChild(previewBtn);
        
        // إزالة الزر بعد 10 ثوان
        setTimeout(() => {
            if (previewBtn.parentNode) {
                previewBtn.remove();
            }
        }, 10000);
    }
}

// تهيئة النظام
window.addEventListener('DOMContentLoaded', () => {
    window.liveUpdater = new LiveWebsiteUpdater();
});

// تصدير للاستخدام الخارجي
window.LiveWebsiteUpdater = LiveWebsiteUpdater;
