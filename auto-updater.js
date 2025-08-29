// ===== Auto Website Updater =====
// سكريبت تحديث تلقائي للموقع الرئيسي

(function() {
    'use strict';
    
    console.log('🔄 تحميل نظام التحديث التلقائي...');
    
    // فحص وجود تحديثات معلقة
    function checkForUpdates() {
        try {
            // فحص التحديث الشامل
            const completeUpdate = localStorage.getItem('completeWebsiteUpdate');
            const lastUpdate = localStorage.getItem('lastCompleteUpdate');
            
            if (completeUpdate && lastUpdate) {
                const updateTime = parseInt(lastUpdate);
                const now = Date.now();
                const timeDiff = now - updateTime;
                
                // تطبيق التحديث إذا كان حديثاً (أقل من ساعة)
                if (timeDiff < 3600000) {
                    console.log('📥 تطبيق التحديث الشامل...');
                    applyUpdate(completeUpdate);
                    return;
                }
            }
            
            // فحص التحديثات الفردية
            checkIndividualUpdates();
            
        } catch (error) {
            console.error('خطأ في فحص التحديثات:', error);
        }
    }
    
    function checkIndividualUpdates() {
        const updates = [
            'personalInfoUpdate',
            'skillsUpdate', 
            'portfolioUpdate',
            'blogUpdate'
        ];
        
        updates.forEach(updateKey => {
            const updateScript = localStorage.getItem(updateKey);
            if (updateScript) {
                console.log(\`📥 تطبيق تحديث: \${updateKey}\`);
                applyUpdate(updateScript);
                // حذف التحديث بعد التطبيق
                localStorage.removeItem(updateKey);
            }
        });
    }
    
    function applyUpdate(script) {
        try {
            // تطبيق السكريبت
            eval(script);
            
            // إظهار رسالة نجاح
            showUpdateNotification('تم تحديث الموقع بنجاح!', 'success');
            
        } catch (error) {
            console.error('خطأ في تطبيق التحديث:', error);
            showUpdateNotification('حدث خطأ في التحديث', 'error');
        }
    }
    
    function showUpdateNotification(message, type = 'info') {
        // إنشاء إشعار بسيط
        const notification = document.createElement('div');
        notification.style.cssText = \`
            position: fixed;
            top: 20px;
            right: 20px;
            background: \${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#17a2b8'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            font-family: 'Cairo', sans-serif;
            max-width: 300px;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        \`;
        
        notification.innerHTML = \`
            <div style="display: flex; align-items: center; gap: 0.5rem;">
                <i class="fas fa-\${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
                <span>\${message}</span>
            </div>
        \`;
        
        document.body.appendChild(notification);
        
        // إظهار الإشعار
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // إخفاء الإشعار بعد 3 ثوان
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }, 3000);
    }
    
    // تحديث البيانات من localStorage
    function loadDataFromStorage() {
        try {
            // تحميل البيانات المحفوظة
            const personalInfo = localStorage.getItem('personalInfoData');
            const skills = localStorage.getItem('skillsData');
            const portfolio = localStorage.getItem('portfolioData');
            const blog = localStorage.getItem('blogData');
            
            if (personalInfo) {
                const data = JSON.parse(personalInfo);
                updatePersonalInfoElements(data);
            }
            
            if (skills) {
                const data = JSON.parse(skills);
                updateSkillsElements(data);
            }
            
            if (portfolio) {
                const data = JSON.parse(portfolio);
                updatePortfolioElements(data);
            }
            
            if (blog) {
                const data = JSON.parse(blog);
                updateBlogElements(data);
            }
            
        } catch (error) {
            console.error('خطأ في تحميل البيانات:', error);
        }
    }
    
    function updatePersonalInfoElements(info) {
        if (!info) return;
        
        // تحديث العنوان الرئيسي
        const heroTitle = document.querySelector('.hero-title');
        if (heroTitle && info.name) {
            heroTitle.innerHTML = \`مرحباً، أنا <span class="highlight">\${info.name}</span>\`;
        }
        
        // تحديث المسمى الوظيفي
        const heroSubtitle = document.querySelector('.hero-subtitle');
        if (heroSubtitle && info.title) {
            heroSubtitle.textContent = info.title;
        }
        
        // تحديث النبذة
        const heroDescription = document.querySelector('.hero-description');
        if (heroDescription && info.bio) {
            heroDescription.textContent = info.bio;
        }
        
        // تحديث معلومات التواصل
        updateContactInfo(info);
        
        // تحديث الصورة الشخصية
        if (info.avatar) {
            updateAvatarImages(info.avatar, info.name);
        }
        
        // تحديث عنوان الصفحة
        if (info.name && info.title) {
            document.title = \`\${info.name} - \${info.title}\`;
        }
    }
    
    function updateContactInfo(info) {
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
            updateSocialLinks(info.social);
        }
    }
    
    function updateSocialLinks(social) {
        const socialLinks = document.querySelectorAll('.social-link');
        socialLinks.forEach(link => {
            const icon = link.querySelector('i');
            if (icon) {
                if (icon.classList.contains('fa-linkedin') && social.linkedin) {
                    link.href = social.linkedin;
                } else if (icon.classList.contains('fa-github') && social.github) {
                    link.href = social.github;
                } else if (icon.classList.contains('fa-twitter') && social.twitter) {
                    link.href = social.twitter;
                } else if (icon.classList.contains('fa-instagram') && social.instagram) {
                    link.href = social.instagram;
                }
            }
        });
    }
    
    function updateAvatarImages(avatarSrc, name) {
        const avatars = document.querySelectorAll('.hero-avatar, .about-avatar');
        avatars.forEach(avatar => {
            avatar.innerHTML = \`<img src="\${avatarSrc}" alt="\${name || 'الصورة الشخصية'}" style="width: 100%; height: 100%; object-fit: cover; border-radius: inherit;">\`;
        });
    }
    
    function updateSkillsElements(skills) {
        const skillsGrid = document.querySelector('.skills-grid');
        if (!skillsGrid) return;
        
        if (!skills || skills.length === 0) {
            skillsGrid.innerHTML = '<div class="no-skills"><p>لم يتم إضافة مهارات بعد</p></div>';
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
    }
    
    function updatePortfolioElements(portfolio) {
        const portfolioGrid = document.querySelector('.portfolio-grid');
        if (!portfolioGrid) return;
        
        if (!portfolio || portfolio.length === 0) {
            portfolioGrid.innerHTML = '<div class="no-portfolio"><p>لم يتم إضافة مشاريع بعد</p></div>';
            return;
        }
        
        portfolioGrid.innerHTML = portfolio.map(project => \`
            <div class="portfolio-item" data-category="\${project.category}">
                <div class="portfolio-image">
                    \${project.image ? 
                        \`<img src="\${project.image}" alt="\${project.title}">\` : 
                        \`<div class="portfolio-placeholder">
                            <i class="fas fa-\${getProjectIcon(project.category)}"></i>
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
    
    function getProjectIcon(category) {
        switch(category) {
            case 'web': return 'globe';
            case 'app': return 'mobile-alt';
            case 'design': return 'paint-brush';
            default: return 'code';
        }
    }
    
    function updateBlogElements(articles) {
        // تحديث المدونة إذا كنا في صفحة المدونة
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
    }
    
    // تشغيل النظام
    function init() {
        console.log('✅ تم تحميل نظام التحديث التلقائي');
        
        // فحص التحديثات عند التحميل
        checkForUpdates();
        
        // تحميل البيانات المحفوظة
        loadDataFromStorage();
        
        // فحص التحديثات كل 30 ثانية
        setInterval(checkForUpdates, 30000);
        
        // إضافة مستمع لتغييرات localStorage
        window.addEventListener('storage', function(e) {
            if (e.key && e.key.includes('Update')) {
                checkForUpdates();
            }
        });
    }
    
    // تشغيل النظام عند تحميل الصفحة
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    // تصدير الوظائف للاستخدام الخارجي
    window.websiteAutoUpdater = {
        checkForUpdates,
        loadDataFromStorage,
        showUpdateNotification
    };
    
})();
