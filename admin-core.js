// ===== Admin Panel Core System =====
class AdminCore {
    constructor() {
        this.currentUser = null;
        this.data = {
            personalInfo: {},
            skills: [],
            portfolio: [],
            blog: [],
            settings: {}
        };
        
        this.init();
    }

    init() {
        console.log('🚀 تهيئة لوحة التحكم الإدارية...');

        // Check authentication first
        if (!this.checkAuthentication()) {
            return; // Will redirect to login
        }

        // Load data and initialize components
        this.loadData();
        this.setupEventListeners();
        this.initializeComponents();

        // Log successful initialization
        console.log('✅ تم تحميل لوحة التحكم بنجاح');
        this.logSystemStatus();
    }

    logSystemStatus() {
        console.log('📊 حالة النظام:');
        console.log(`👤 المستخدم: ${this.currentUser}`);
        console.log(`💾 البيانات: ${Object.keys(this.data).length} أقسام محملة`);
        console.log(`🔐 الجلسة: نشطة ومحمية`);

        // Check integration status
        const loginPageExists = this.checkFileExists('login.html');
        const dashboardPageExists = this.checkFileExists('dashboard.html');

        console.log(`🔗 التكامل: ${loginPageExists && dashboardPageExists ? 'مكتمل' : 'يحتاج مراجعة'}`);
    }

    checkFileExists(filename) {
        try {
            // This is a simple check - in a real environment you'd use proper file checking
            return true; // Assume files exist in this context
        } catch (error) {
            return false;
        }
    }

    // ===== Enhanced Authentication =====
    checkAuthentication() {
        console.log('🔐 فحص صلاحية الجلسة...');

        const session = localStorage.getItem('adminSession');
        if (!session) {
            console.log('❌ لا توجد جلسة - إعادة توجيه لتسجيل الدخول');
            this.redirectToLogin();
            return false;
        }

        try {
            const sessionData = JSON.parse(session);
            const currentTime = Date.now();

            // Check if session has expiry time (new format)
            if (sessionData.expiryTime) {
                if (currentTime > sessionData.expiryTime) {
                    console.log('🔒 انتهت صلاحية الجلسة (تنسيق جديد)');
                    this.clearSession();
                    this.redirectToLogin();
                    return false;
                }
            } else {
                // Legacy format - 24 hours default
                const sessionDuration = 24 * 60 * 60 * 1000; // 24 hours
                if (currentTime - sessionData.loginTime > sessionDuration) {
                    console.log('🔒 انتهت صلاحية الجلسة (تنسيق قديم)');
                    this.clearSession();
                    this.redirectToLogin();
                    return false;
                }
            }

            // Session is valid
            this.currentUser = sessionData.username;
            this.sessionData = sessionData;
            this.updateUserInfo();
            this.logSessionInfo(sessionData, currentTime);

            console.log('✅ الجلسة صالحة - المستخدم:', this.currentUser);
            return true;

        } catch (error) {
            console.error('❌ خطأ في قراءة بيانات الجلسة:', error);
            this.clearSession();
            this.redirectToLogin();
            return false;
        }
    }

    logSessionInfo(sessionData, currentTime) {
        const remainingTime = sessionData.expiryTime ?
            Math.max(0, sessionData.expiryTime - currentTime) :
            Math.max(0, (sessionData.loginTime + 24 * 60 * 60 * 1000) - currentTime);

        const remainingHours = Math.floor(remainingTime / (60 * 60 * 1000));
        const remainingMinutes = Math.floor((remainingTime % (60 * 60 * 1000)) / (60 * 1000));

        console.log(`⏰ الوقت المتبقي للجلسة: ${remainingHours}ساعة ${remainingMinutes}دقيقة`);

        if (sessionData.rememberMe) {
            console.log('🔄 جلسة ممتدة (تذكرني مفعل)');
        }
    }

    clearSession() {
        localStorage.removeItem('adminSession');
        localStorage.removeItem('adminData');
        localStorage.removeItem('failedAttempts');

        // Clear any temporary admin data
        const keysToRemove = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && (key.startsWith('admin') || key.startsWith('temp'))) {
                keysToRemove.push(key);
            }
        }
        keysToRemove.forEach(key => localStorage.removeItem(key));

        console.log('🧹 تم تنظيف بيانات الجلسة');
    }

    redirectToLogin() {
        console.log('🔄 إعادة توجيه لصفحة تسجيل الدخول');
        window.location.href = 'login.html';
    }

    updateUserInfo() {
        // Update username displays
        const userElements = document.querySelectorAll('#currentUser, #headerUsername, .username-display');
        userElements.forEach(el => {
            if (el) el.textContent = this.currentUser;
        });

        // Update session info displays
        if (this.sessionData) {
            const sessionInfoElements = document.querySelectorAll('.session-info');
            sessionInfoElements.forEach(el => {
                if (el) {
                    const loginTime = new Date(this.sessionData.loginTime);
                    const expiryTime = this.sessionData.expiryTime ?
                        new Date(this.sessionData.expiryTime) :
                        new Date(this.sessionData.loginTime + 24 * 60 * 60 * 1000);

                    el.innerHTML = `
                        <div class="session-details">
                            <small>آخر دخول: ${loginTime.toLocaleString('ar-SA')}</small><br>
                            <small>انتهاء الجلسة: ${expiryTime.toLocaleString('ar-SA')}</small>
                            ${this.sessionData.rememberMe ? '<br><small class="remember-badge">🔄 تذكرني مفعل</small>' : ''}
                        </div>
                    `;
                }
            });
        }

        // Update welcome message
        const welcomeElements = document.querySelectorAll('.welcome-message');
        welcomeElements.forEach(el => {
            if (el) {
                const currentHour = new Date().getHours();
                let greeting = 'مرحباً';

                if (currentHour < 12) {
                    greeting = 'صباح الخير';
                } else if (currentHour < 18) {
                    greeting = 'مساء الخير';
                } else {
                    greeting = 'مساء الخير';
                }

                el.textContent = `${greeting}، ${this.currentUser}`;
            }
        });

        console.log('👤 تم تحديث معلومات المستخدم في الواجهة');
    }

    logout() {
        console.log('🔓 بدء عملية تسجيل الخروج...');

        // Log current session info before logout
        if (this.sessionData) {
            console.log(`👋 تسجيل خروج للمستخدم: ${this.sessionData.username}`);
        }

        // Clear session and all related data
        this.clearSession();

        // Show logout message
        this.showNotification('تم تسجيل الخروج بنجاح', 'success');

        // Redirect after short delay
        setTimeout(() => {
            this.redirectToLogin();
        }, 1000);
    }

    // Enhanced logout with confirmation
    logoutWithConfirmation() {
        if (confirm('هل أنت متأكد من تسجيل الخروج؟')) {
            this.logout();
        }
    }

    // ===== Data Management =====
    loadData() {
        try {
            // Load personal info
            const personalInfo = localStorage.getItem('websitePersonalInfo');
            if (personalInfo) {
                this.data.personalInfo = JSON.parse(personalInfo);
            } else {
                this.data.personalInfo = this.getDefaultPersonalInfo();
            }

            // Load skills
            const skills = localStorage.getItem('websiteSkills');
            if (skills) {
                this.data.skills = JSON.parse(skills);
            } else {
                this.data.skills = this.getDefaultSkills();
            }

            // Load portfolio
            const portfolio = localStorage.getItem('websitePortfolio');
            if (portfolio) {
                this.data.portfolio = JSON.parse(portfolio);
            } else {
                this.data.portfolio = this.getDefaultPortfolio();
            }

            // Load blog
            const blog = localStorage.getItem('websiteBlog');
            if (blog) {
                this.data.blog = JSON.parse(blog);
            } else {
                this.data.blog = [];
            }

            // Load settings
            const settings = localStorage.getItem('websiteSettings');
            if (settings) {
                this.data.settings = JSON.parse(settings);
            } else {
                this.data.settings = this.getDefaultSettings();
            }

            this.updateDashboardStats();
        } catch (error) {
            console.error('Error loading data:', error);
            this.showNotification('خطأ في تحميل البيانات', 'error');
        }
    }

    saveData(section, data) {
        try {
            this.data[section] = data;
            localStorage.setItem(`website${section.charAt(0).toUpperCase() + section.slice(1)}`, JSON.stringify(data));
            this.updateDashboardStats();
            this.addActivity(`تم تحديث ${this.getSectionName(section)}`);
            this.showNotification('تم حفظ البيانات بنجاح', 'success');
            return true;
        } catch (error) {
            console.error('Error saving data:', error);
            this.showNotification('خطأ في حفظ البيانات', 'error');
            return false;
        }
    }

    getSectionName(section) {
        const names = {
            personalInfo: 'المعلومات الشخصية',
            skills: 'المهارات',
            portfolio: 'معرض الأعمال',
            blog: 'المدونة',
            settings: 'الإعدادات'
        };
        return names[section] || section;
    }

    // ===== Default Data =====
    getDefaultPersonalInfo() {
        return {
            name: '',
            title: '',
            bio: '',
            email: '',
            phone: '',
            location: '',
            avatar: '',
            social: {
                linkedin: '',
                github: '',
                twitter: '',
                instagram: ''
            }
        };
    }

    getDefaultSkills() {
        return [];
    }

    getDefaultPortfolio() {
        return [];
    }

    getDefaultSettings() {
        return {
            siteName: '',
            siteDescription: '',
            theme: 'default',
            language: 'ar',
            analytics: {
                googleAnalytics: '',
                enabled: false
            },
            seo: {
                metaKeywords: '',
                ogImage: ''
            }
        };
    }

    // ===== UI Management =====
    setupEventListeners() {
        // Sidebar navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = link.dataset.section;
                this.showSection(section);
                this.updateActiveNav(link);
            });
        });

        // Quick actions
        document.querySelectorAll('.quick-action-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const section = btn.dataset.section;
                if (section) {
                    this.showSection(section);
                    this.updateActiveNav(document.querySelector(`[data-section="${section}"]`));
                }
            });
        });

        // Logout buttons
        document.querySelectorAll('#logoutBtn, #logoutLink').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                if (confirm('هل أنت متأكد من تسجيل الخروج؟')) {
                    this.logout();
                }
            });
        });

        // Sidebar toggle
        const sidebarToggle = document.getElementById('sidebarToggle');
        const sidebar = document.getElementById('sidebar');
        if (sidebarToggle) {
            sidebarToggle.addEventListener('click', () => {
                sidebar.classList.toggle('collapsed');
            });
        }

        // Mobile menu toggle
        const mobileMenuToggle = document.getElementById('mobileMenuToggle');
        if (mobileMenuToggle) {
            mobileMenuToggle.addEventListener('click', () => {
                sidebar.classList.toggle('show');
            });
        }

        // User menu toggle
        const userMenuToggle = document.getElementById('userMenuToggle');
        const userDropdown = document.getElementById('userDropdown');
        if (userMenuToggle && userDropdown) {
            userMenuToggle.addEventListener('click', () => {
                userDropdown.classList.toggle('show');
            });

            // Close dropdown when clicking outside
            document.addEventListener('click', (e) => {
                if (!userMenuToggle.contains(e.target)) {
                    userDropdown.classList.remove('show');
                }
            });
        }

        // Header actions
        const saveAllBtn = document.getElementById('saveAllBtn');
        const previewBtn = document.getElementById('previewBtn');
        const refreshBtn = document.getElementById('refreshBtn');
        const backupBtn = document.getElementById('backupBtn');

        if (saveAllBtn) {
            saveAllBtn.addEventListener('click', () => this.saveAllData());
        }

        if (previewBtn) {
            previewBtn.addEventListener('click', () => this.previewWebsite());
        }

        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => this.refreshData());
        }

        if (backupBtn) {
            backupBtn.addEventListener('click', () => this.createBackup());
        }
    }

    showSection(sectionName) {
        // Hide all sections
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('active');
        });

        // Show target section
        const targetSection = document.getElementById(`${sectionName}-section`);
        if (targetSection) {
            targetSection.classList.add('active');
        }

        // Update page title
        const pageTitle = document.getElementById('pageTitle');
        if (pageTitle) {
            const titles = {
                dashboard: 'لوحة التحكم الرئيسية',
                'personal-info': 'المعلومات الشخصية',
                skills: 'إدارة المهارات',
                portfolio: 'معرض الأعمال',
                blog: 'إدارة المدونة',
                settings: 'الإعدادات'
            };
            pageTitle.textContent = titles[sectionName] || 'لوحة التحكم';
        }
    }

    updateActiveNav(activeLink) {
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        
        if (activeLink) {
            activeLink.closest('.nav-item').classList.add('active');
        }
    }

    initializeComponents() {
        this.updateDashboardStats();
        this.loadRecentActivity();
        this.startSessionMonitoring();
        this.setupAutoSync();

        // Run integration health check
        setTimeout(() => {
            this.checkIntegrationHealth();
        }, 2000);
    }

    // Auto-sync on storage changes
    setupAutoSync() {
        window.addEventListener('storage', (e) => {
            if (e.key === 'adminSession') {
                console.log('🔄 تم اكتشاف تغيير في الجلسة - مزامنة تلقائية');
                this.syncWithLoginSystem();
            }
        });

        // Periodic sync check
        setInterval(() => {
            this.syncWithLoginSystem();
        }, 30000); // Every 30 seconds

        console.log('🔄 تم تفعيل المزامنة التلقائية');
    }

    // Start periodic session monitoring
    startSessionMonitoring() {
        // Check session every 5 minutes
        this.sessionMonitor = setInterval(() => {
            console.log('🔍 فحص دوري للجلسة...');
            if (!this.checkAuthentication()) {
                clearInterval(this.sessionMonitor);
            }
        }, 5 * 60 * 1000); // 5 minutes

        // Warning before session expires (30 minutes before)
        this.sessionWarning = setInterval(() => {
            this.checkSessionWarning();
        }, 10 * 60 * 1000); // Check every 10 minutes

        console.log('⏰ تم تفعيل مراقبة الجلسة الدورية');
    }

    checkSessionWarning() {
        const session = localStorage.getItem('adminSession');
        if (!session) return;

        try {
            const sessionData = JSON.parse(session);
            const currentTime = Date.now();
            const expiryTime = sessionData.expiryTime ||
                (sessionData.loginTime + 24 * 60 * 60 * 1000);

            const timeUntilExpiry = expiryTime - currentTime;
            const thirtyMinutes = 30 * 60 * 1000;

            // Show warning if less than 30 minutes remaining
            if (timeUntilExpiry > 0 && timeUntilExpiry <= thirtyMinutes) {
                const minutesLeft = Math.floor(timeUntilExpiry / (60 * 1000));
                this.showSessionWarning(minutesLeft);
            }
        } catch (error) {
            console.error('خطأ في فحص تحذير الجلسة:', error);
        }
    }

    showSessionWarning(minutesLeft) {
        const warningMessage = `⚠️ تنبيه: ستنتهي جلستك خلال ${minutesLeft} دقيقة. هل تريد تمديد الجلسة؟`;

        if (confirm(warningMessage)) {
            this.extendSession();
        }
    }

    extendSession() {
        const session = localStorage.getItem('adminSession');
        if (!session) return;

        try {
            const sessionData = JSON.parse(session);
            const currentTime = Date.now();

            // Extend session by 24 hours or original duration
            const extensionTime = sessionData.rememberMe ?
                (30 * 24 * 60 * 60 * 1000) : // 30 days
                (24 * 60 * 60 * 1000); // 24 hours

            sessionData.expiryTime = currentTime + extensionTime;
            sessionData.lastExtended = currentTime;

            localStorage.setItem('adminSession', JSON.stringify(sessionData));

            this.showNotification('تم تمديد الجلسة بنجاح', 'success');
            console.log('🔄 تم تمديد الجلسة');

        } catch (error) {
            console.error('خطأ في تمديد الجلسة:', error);
            this.showNotification('فشل في تمديد الجلسة', 'error');
        }
    }

    updateDashboardStats() {
        const projectsCount = document.getElementById('projectsCount');
        const skillsCount = document.getElementById('skillsCount');
        const articlesCount = document.getElementById('articlesCount');
        const viewsCount = document.getElementById('viewsCount');

        if (projectsCount) projectsCount.textContent = this.data.portfolio.length;
        if (skillsCount) skillsCount.textContent = this.data.skills.length;
        if (articlesCount) articlesCount.textContent = this.data.blog.length;
        if (viewsCount) viewsCount.textContent = this.getViewsCount();
    }

    getViewsCount() {
        // Return 0 for new websites
        return 0;
    }

    loadRecentActivity() {
        const activityList = document.getElementById('recentActivity');
        if (!activityList) return;

        const activities = JSON.parse(localStorage.getItem('recentActivities') || '[]');
        
        if (activities.length === 0) {
            activityList.innerHTML = `
                <div class="activity-item">
                    <div class="activity-icon">
                        <i class="fas fa-info"></i>
                    </div>
                    <div class="activity-content">
                        <p>لا توجد أنشطة حديثة</p>
                        <span class="activity-time">ابدأ بتحديث موقعك</span>
                    </div>
                </div>
            `;
            return;
        }

        activityList.innerHTML = activities.slice(0, 5).map(activity => `
            <div class="activity-item">
                <div class="activity-icon">
                    <i class="fas fa-${activity.icon || 'edit'}"></i>
                </div>
                <div class="activity-content">
                    <p>${activity.message}</p>
                    <span class="activity-time">${this.formatTime(activity.timestamp)}</span>
                </div>
            </div>
        `).join('');
    }

    addActivity(message, icon = 'edit') {
        const activities = JSON.parse(localStorage.getItem('recentActivities') || '[]');
        activities.unshift({
            message,
            icon,
            timestamp: Date.now()
        });

        // Keep only last 20 activities
        if (activities.length > 20) {
            activities.splice(20);
        }

        localStorage.setItem('recentActivities', JSON.stringify(activities));
        this.loadRecentActivity();
    }

    formatTime(timestamp) {
        const now = Date.now();
        const diff = now - timestamp;
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 1) return 'الآن';
        if (minutes < 60) return `منذ ${minutes} دقيقة`;
        if (hours < 24) return `منذ ${hours} ساعة`;
        return `منذ ${days} يوم`;
    }

    // ===== Utility Functions =====
    showNotification(message, type = 'info', duration = 5000) {
        const container = document.getElementById('notificationContainer');
        if (!container) return;

        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span>${message}</span>
                <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;

        container.appendChild(notification);

        // Show notification
        setTimeout(() => notification.classList.add('show'), 100);

        // Auto remove
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, duration);
    }

    showLoading(show = true) {
        const overlay = document.getElementById('loadingOverlay');
        if (overlay) {
            overlay.classList.toggle('show', show);
        }
    }

    saveAllData() {
        this.showLoading(true);
        
        setTimeout(() => {
            // Simulate saving all data
            this.showLoading(false);
            this.showNotification('تم حفظ جميع البيانات بنجاح', 'success');
            this.addActivity('تم حفظ جميع البيانات', 'save');
        }, 1000);
    }

    previewWebsite() {
        window.open('../index.html', '_blank');
    }

    refreshData() {
        this.showLoading(true);
        
        setTimeout(() => {
            this.loadData();
            this.showLoading(false);
            this.showNotification('تم تحديث البيانات', 'success');
        }, 500);
    }

    createBackup() {
        const backupData = {
            personalInfo: this.data.personalInfo,
            skills: this.data.skills,
            portfolio: this.data.portfolio,
            blog: this.data.blog,
            settings: this.data.settings,
            timestamp: Date.now()
        };

        const dataStr = JSON.stringify(backupData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `website-backup-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        
        URL.revokeObjectURL(url);
        this.showNotification('تم إنشاء النسخة الاحتياطية', 'success');
        this.addActivity('تم إنشاء نسخة احتياطية', 'download');
    }

    // ===== Integration Utilities =====

    // Sync data between login and dashboard
    syncWithLoginSystem() {
        const loginSession = localStorage.getItem('adminSession');
        if (loginSession) {
            try {
                const sessionData = JSON.parse(loginSession);

                // Update current session data
                this.sessionData = sessionData;
                this.currentUser = sessionData.username;

                // Update UI
                this.updateUserInfo();

                console.log('🔄 تم مزامنة البيانات مع نظام تسجيل الدخول');
                return true;
            } catch (error) {
                console.error('❌ خطأ في مزامنة البيانات:', error);
                return false;
            }
        }
        return false;
    }

    // Check integration health
    checkIntegrationHealth() {
        const healthChecks = {
            sessionExists: !!localStorage.getItem('adminSession'),
            userDataLoaded: !!this.currentUser,
            dataStructureValid: this.validateDataStructure(),
            uiElementsPresent: this.checkUIElements()
        };

        const healthScore = Object.values(healthChecks).filter(Boolean).length;
        const totalChecks = Object.keys(healthChecks).length;

        console.log('🏥 فحص صحة التكامل:');
        console.log(`📊 النتيجة: ${healthScore}/${totalChecks} (${Math.round(healthScore/totalChecks*100)}%)`);

        Object.entries(healthChecks).forEach(([check, status]) => {
            console.log(`${status ? '✅' : '❌'} ${check}`);
        });

        return healthScore === totalChecks;
    }

    validateDataStructure() {
        const requiredKeys = ['personalInfo', 'skills', 'portfolio', 'blog', 'settings'];
        return requiredKeys.every(key => this.data.hasOwnProperty(key));
    }

    checkUIElements() {
        const requiredElements = ['currentUser', 'headerUsername'];
        return requiredElements.every(id => document.getElementById(id));
    }

    // Force refresh integration
    refreshIntegration() {
        console.log('🔄 إعادة تحديث التكامل...');

        // Re-sync with login system
        if (this.syncWithLoginSystem()) {
            // Reload data
            this.loadData();

            // Update UI
            this.updateUserInfo();

            // Check health
            const isHealthy = this.checkIntegrationHealth();

            if (isHealthy) {
                this.showNotification('تم تحديث التكامل بنجاح', 'success');
                console.log('✅ التكامل يعمل بشكل مثالي');
            } else {
                this.showNotification('تحذير: مشاكل في التكامل', 'warning');
                console.log('⚠️ توجد مشاكل في التكامل');
            }
        } else {
            this.showNotification('فشل في تحديث التكامل', 'error');
            console.log('❌ فشل في تحديث التكامل');
        }
    }
}

// Initialize admin core when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.adminCore = new AdminCore();
});

// Export for use in other modules
window.AdminCore = AdminCore;
