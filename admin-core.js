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
        this.checkAuthentication();
        this.loadData();
        this.setupEventListeners();
        this.initializeComponents();
    }

    // ===== Authentication =====
    checkAuthentication() {
        const session = localStorage.getItem('adminSession');
        if (!session) {
            window.location.href = 'login.html';
            return;
        }

        const sessionData = JSON.parse(session);
        const currentTime = Date.now();
        const sessionDuration = 24 * 60 * 60 * 1000; // 24 hours

        if (currentTime - sessionData.loginTime > sessionDuration) {
            localStorage.removeItem('adminSession');
            window.location.href = 'login.html';
            return;
        }

        this.currentUser = sessionData.username;
        this.updateUserInfo();
    }

    updateUserInfo() {
        const userElements = document.querySelectorAll('#currentUser, #headerUsername');
        userElements.forEach(el => {
            if (el) el.textContent = this.currentUser;
        });
    }

    logout() {
        localStorage.removeItem('adminSession');
        window.location.href = 'login.html';
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
}

// Initialize admin core when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.adminCore = new AdminCore();
});

// Export for use in other modules
window.AdminCore = AdminCore;
