// ===== Dashboard Specific Functions =====
class DashboardManager {
    constructor() {
        this.init();
    }

    init() {
        this.loadPersonalInfoForm();
        this.setupFormHandlers();
    }

    // ===== Personal Info Management =====
    loadPersonalInfoForm() {
        const personalInfoSection = document.getElementById('personal-info-section');
        if (!personalInfoSection) return;

        const formContainer = personalInfoSection.querySelector('.form-container');
        const data = window.adminCore.data.personalInfo;

        formContainer.innerHTML = `
            <form id="personalInfoForm" class="admin-form">
                <div class="form-row">
                    <div class="form-group">
                        <label for="fullName">الاسم الكامل</label>
                        <input type="text" id="fullName" name="name" value="${data.name || ''}" required>
                    </div>
                    <div class="form-group">
                        <label for="jobTitle">المسمى الوظيفي</label>
                        <input type="text" id="jobTitle" name="title" value="${data.title || ''}" required>
                    </div>
                </div>

                <div class="form-group">
                    <label for="bio">النبذة الشخصية</label>
                    <textarea id="bio" name="bio" rows="4" placeholder="اكتب نبذة عن نفسك...">${data.bio || ''}</textarea>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label for="email">البريد الإلكتروني</label>
                        <input type="email" id="email" name="email" value="${data.email || ''}" required>
                    </div>
                    <div class="form-group">
                        <label for="phone">رقم الهاتف</label>
                        <input type="tel" id="phone" name="phone" value="${data.phone || ''}">
                    </div>
                </div>

                <div class="form-group">
                    <label for="location">الموقع</label>
                    <input type="text" id="location" name="location" value="${data.location || ''}" placeholder="المدينة، البلد">
                </div>

                <div class="form-group">
                    <label for="avatar">الصورة الشخصية</label>
                    <div class="file-upload">
                        <input type="file" id="avatar" name="avatar" accept="image/*">
                        <div class="file-upload-label">
                            <i class="fas fa-cloud-upload-alt"></i>
                            <span>اختر صورة أو اسحبها هنا</span>
                        </div>
                    </div>
                    ${data.avatar ? `<img src="${data.avatar}" alt="الصورة الحالية" class="image-preview" id="currentAvatar">` : ''}
                </div>

                <div class="form-group">
                    <label>روابط التواصل الاجتماعي</label>
                    <div class="social-links-form">
                        <div class="form-row">
                            <div class="form-group">
                                <label for="linkedin">LinkedIn</label>
                                <input type="url" id="linkedin" name="linkedin" value="${data.social?.linkedin || ''}" placeholder="https://linkedin.com/in/username">
                            </div>
                            <div class="form-group">
                                <label for="github">GitHub</label>
                                <input type="url" id="github" name="github" value="${data.social?.github || ''}" placeholder="https://github.com/username">
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label for="twitter">Twitter</label>
                                <input type="url" id="twitter" name="twitter" value="${data.social?.twitter || ''}" placeholder="https://twitter.com/username">
                            </div>
                            <div class="form-group">
                                <label for="instagram">Instagram</label>
                                <input type="url" id="instagram" name="instagram" value="${data.social?.instagram || ''}" placeholder="https://instagram.com/username">
                            </div>
                        </div>
                    </div>
                </div>

                <div class="form-actions">
                    <button type="button" class="btn btn-secondary" id="resetPersonalInfo">
                        <i class="fas fa-undo"></i>
                        إعادة تعيين
                    </button>
                    <button type="submit" class="btn btn-primary">
                        <i class="fas fa-save"></i>
                        حفظ التغييرات
                    </button>
                </div>
            </form>
        `;

        this.setupPersonalInfoHandlers();
    }

    setupPersonalInfoHandlers() {
        const form = document.getElementById('personalInfoForm');
        const avatarInput = document.getElementById('avatar');
        const resetBtn = document.getElementById('resetPersonalInfo');

        if (form) {
            form.addEventListener('submit', (e) => this.savePersonalInfo(e));
        }

        if (avatarInput) {
            avatarInput.addEventListener('change', (e) => this.handleAvatarUpload(e));
        }

        if (resetBtn) {
            resetBtn.addEventListener('click', () => this.resetPersonalInfo());
        }
    }

    handleAvatarUpload(e) {
        const file = e.target.files[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            window.adminCore.showNotification('يرجى اختيار ملف صورة صحيح', 'error');
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            window.adminCore.showNotification('حجم الصورة يجب أن يكون أقل من 5 ميجابايت', 'error');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const imageData = e.target.result;
            
            // Remove existing preview
            const existingPreview = document.getElementById('currentAvatar');
            if (existingPreview) {
                existingPreview.remove();
            }

            // Create new preview
            const preview = document.createElement('img');
            preview.src = imageData;
            preview.alt = 'معاينة الصورة';
            preview.className = 'image-preview';
            preview.id = 'currentAvatar';

            const fileUpload = document.querySelector('.file-upload');
            fileUpload.parentNode.insertBefore(preview, fileUpload.nextSibling);

            window.adminCore.showNotification('تم تحميل الصورة بنجاح', 'success');
        };

        reader.readAsDataURL(file);
    }

    savePersonalInfo(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const data = {};

        // Get form data
        for (let [key, value] of formData.entries()) {
            if (key === 'avatar') continue; // Handle avatar separately
            data[key] = value;
        }

        // Handle social media links
        data.social = {
            linkedin: formData.get('linkedin') || '',
            github: formData.get('github') || '',
            twitter: formData.get('twitter') || '',
            instagram: formData.get('instagram') || ''
        };

        // Handle avatar
        const avatarPreview = document.getElementById('currentAvatar');
        if (avatarPreview) {
            data.avatar = avatarPreview.src;
        }

        // Save data
        if (window.adminCore.saveData('personalInfo', data)) {
            window.adminCore.addActivity('تم تحديث المعلومات الشخصية', 'user');
            this.updateWebsiteContent(data);
        }
    }

    resetPersonalInfo() {
        if (confirm('هل أنت متأكد من إعادة تعيين المعلومات الشخصية؟')) {
            this.loadPersonalInfoForm();
            window.adminCore.showNotification('تم إعادة تعيين النموذج', 'info');
        }
    }

    updateWebsiteContent(data) {
        // This function would update the main website content
        // For now, we'll just show a notification
        window.adminCore.showNotification('سيتم تحديث الموقع الرئيسي قريباً', 'info');
    }

    // ===== Form Handlers Setup =====
    setupFormHandlers() {
        // Handle section switching
        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-section]')) {
                const section = e.target.dataset.section;
                this.loadSectionContent(section);
            }
        });
    }

    loadSectionContent(section) {
        switch (section) {
            case 'personal-info':
                this.loadPersonalInfoForm();
                break;
            case 'skills':
                this.loadSkillsForm();
                break;
            case 'portfolio':
                this.loadPortfolioForm();
                break;
            case 'blog':
                this.loadBlogForm();
                break;
            case 'settings':
                this.loadSettingsForm();
                break;
        }
    }

    // ===== Skills Management =====
    loadSkillsForm() {
        const skillsSection = document.getElementById('skills-section');
        if (!skillsSection) return;

        const formContainer = skillsSection.querySelector('.form-container');
        const skills = window.adminCore.data.skills;

        formContainer.innerHTML = `
            <div class="skills-manager">
                <div class="section-actions">
                    <button type="button" class="btn btn-primary" id="addSkillBtn">
                        <i class="fas fa-plus"></i>
                        إضافة مهارة جديدة
                    </button>
                </div>

                <div class="skills-list" id="skillsList">
                    ${skills.map((skill, index) => this.createSkillItem(skill, index)).join('')}
                </div>

                <div class="form-actions">
                    <button type="button" class="btn btn-success" id="saveSkillsBtn">
                        <i class="fas fa-save"></i>
                        حفظ جميع المهارات
                    </button>
                </div>
            </div>

            <!-- Add Skill Modal -->
            <div class="modal" id="addSkillModal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3 class="modal-title">إضافة مهارة جديدة</h3>
                        <button type="button" class="modal-close" data-close="addSkillModal">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="modal-body">
                        <form id="addSkillForm">
                            <div class="form-group">
                                <label for="skillName">اسم المهارة</label>
                                <input type="text" id="skillName" name="name" required>
                            </div>
                            <div class="form-group">
                                <label for="skillPercentage">نسبة الإتقان (%)</label>
                                <input type="range" id="skillPercentage" name="percentage" min="0" max="100" value="50">
                                <span id="percentageValue">50%</span>
                            </div>
                            <div class="form-group">
                                <label for="skillIcon">أيقونة المهارة</label>
                                <select id="skillIcon" name="icon">
                                    <option value="fas fa-code">كود عام</option>
                                    <option value="fab fa-html5">HTML5</option>
                                    <option value="fab fa-css3-alt">CSS3</option>
                                    <option value="fab fa-js-square">JavaScript</option>
                                    <option value="fab fa-react">React</option>
                                    <option value="fab fa-vue">Vue.js</option>
                                    <option value="fab fa-angular">Angular</option>
                                    <option value="fab fa-node-js">Node.js</option>
                                    <option value="fab fa-python">Python</option>
                                    <option value="fab fa-php">PHP</option>
                                    <option value="fas fa-database">قواعد البيانات</option>
                                    <option value="fab fa-git-alt">Git</option>
                                    <option value="fab fa-docker">Docker</option>
                                    <option value="fab fa-aws">AWS</option>
                                </select>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-close="addSkillModal">إلغاء</button>
                        <button type="submit" form="addSkillForm" class="btn btn-primary">إضافة المهارة</button>
                    </div>
                </div>
            </div>
        `;

        this.setupSkillsHandlers();
    }

    createSkillItem(skill, index) {
        return `
            <div class="skill-item" data-index="${index}">
                <div class="skill-info">
                    <div class="skill-icon">
                        <i class="${skill.icon}"></i>
                    </div>
                    <div class="skill-details">
                        <h4>${skill.name}</h4>
                        <div class="skill-bar">
                            <div class="skill-progress" style="width: ${skill.percentage}%"></div>
                        </div>
                        <span class="skill-percentage">${skill.percentage}%</span>
                    </div>
                </div>
                <div class="skill-actions">
                    <button type="button" class="btn btn-sm btn-secondary edit-skill" data-index="${index}">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button type="button" class="btn btn-sm btn-danger delete-skill" data-index="${index}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
    }

    setupSkillsHandlers() {
        const addSkillBtn = document.getElementById('addSkillBtn');
        const saveSkillsBtn = document.getElementById('saveSkillsBtn');
        const addSkillForm = document.getElementById('addSkillForm');
        const skillPercentage = document.getElementById('skillPercentage');
        const percentageValue = document.getElementById('percentageValue');

        if (addSkillBtn) {
            addSkillBtn.addEventListener('click', () => this.showModal('addSkillModal'));
        }

        if (saveSkillsBtn) {
            saveSkillsBtn.addEventListener('click', () => this.saveSkills());
        }

        if (addSkillForm) {
            addSkillForm.addEventListener('submit', (e) => this.addSkill(e));
        }

        if (skillPercentage && percentageValue) {
            skillPercentage.addEventListener('input', (e) => {
                percentageValue.textContent = e.target.value + '%';
            });
        }

        // Handle skill actions
        document.addEventListener('click', (e) => {
            if (e.target.matches('.edit-skill') || e.target.closest('.edit-skill')) {
                const index = e.target.closest('.edit-skill').dataset.index;
                this.editSkill(index);
            }

            if (e.target.matches('.delete-skill') || e.target.closest('.delete-skill')) {
                const index = e.target.closest('.delete-skill').dataset.index;
                this.deleteSkill(index);
            }
        });

        // Modal handlers
        this.setupModalHandlers();
    }

    showModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('show');
        }
    }

    hideModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('show');
        }
    }

    setupModalHandlers() {
        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-close]')) {
                const modalId = e.target.dataset.close;
                this.hideModal(modalId);
            }

            if (e.target.matches('.modal')) {
                e.target.classList.remove('show');
            }
        });
    }

    addSkill(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const skill = {
            name: formData.get('name'),
            percentage: parseInt(formData.get('percentage')),
            icon: formData.get('icon')
        };

        window.adminCore.data.skills.push(skill);
        this.loadSkillsForm();
        this.hideModal('addSkillModal');
        window.adminCore.showNotification('تم إضافة المهارة بنجاح', 'success');
    }

    editSkill(index) {
        // Implementation for editing skills
        window.adminCore.showNotification('ميزة التعديل قيد التطوير', 'info');
    }

    deleteSkill(index) {
        if (confirm('هل أنت متأكد من حذف هذه المهارة؟')) {
            window.adminCore.data.skills.splice(index, 1);
            this.loadSkillsForm();
            window.adminCore.showNotification('تم حذف المهارة', 'success');
        }
    }

    saveSkills() {
        if (window.adminCore.saveData('skills', window.adminCore.data.skills)) {
            window.adminCore.addActivity('تم تحديث المهارات', 'code');
        }
    }

    // ===== Portfolio Management =====
    loadPortfolioForm() {
        const portfolioSection = document.getElementById('portfolio-section');
        if (!portfolioSection) return;

        const formContainer = portfolioSection.querySelector('.form-container');
        const portfolio = window.adminCore.data.portfolio;

        formContainer.innerHTML = `
            <div class="portfolio-manager">
                <div class="section-actions">
                    <button type="button" class="btn btn-primary" id="addProjectBtn">
                        <i class="fas fa-plus"></i>
                        إضافة مشروع جديد
                    </button>
                    <div class="filter-actions">
                        <select id="portfolioFilter" class="form-control">
                            <option value="all">جميع المشاريع</option>
                            <option value="web">مواقع ويب</option>
                            <option value="app">تطبيقات</option>
                            <option value="design">تصميم</option>
                        </select>
                    </div>
                </div>

                <div class="portfolio-grid" id="portfolioGrid">
                    ${portfolio.map((project, index) => this.createProjectCard(project, index)).join('')}
                </div>

                <div class="form-actions">
                    <button type="button" class="btn btn-success" id="savePortfolioBtn">
                        <i class="fas fa-save"></i>
                        حفظ جميع المشاريع
                    </button>
                </div>
            </div>

            <!-- Add/Edit Project Modal -->
            <div class="modal" id="projectModal">
                <div class="modal-content" style="max-width: 800px;">
                    <div class="modal-header">
                        <h3 class="modal-title" id="projectModalTitle">إضافة مشروع جديد</h3>
                        <button type="button" class="modal-close" data-close="projectModal">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="modal-body">
                        <form id="projectForm">
                            <input type="hidden" id="projectIndex" name="index">

                            <div class="form-row">
                                <div class="form-group">
                                    <label for="projectTitle">عنوان المشروع</label>
                                    <input type="text" id="projectTitle" name="title" required>
                                </div>
                                <div class="form-group">
                                    <label for="projectCategory">التصنيف</label>
                                    <select id="projectCategory" name="category" required>
                                        <option value="">اختر التصنيف</option>
                                        <option value="web">موقع ويب</option>
                                        <option value="app">تطبيق</option>
                                        <option value="design">تصميم</option>
                                    </select>
                                </div>
                            </div>

                            <div class="form-group">
                                <label for="projectDescription">وصف المشروع</label>
                                <textarea id="projectDescription" name="description" rows="3" required></textarea>
                            </div>

                            <div class="form-group">
                                <label for="projectImage">صورة المشروع</label>
                                <div class="file-upload">
                                    <input type="file" id="projectImage" name="image" accept="image/*">
                                    <div class="file-upload-label">
                                        <i class="fas fa-image"></i>
                                        <span>اختر صورة المشروع</span>
                                    </div>
                                </div>
                                <img id="projectImagePreview" class="image-preview" style="display: none;">
                            </div>

                            <div class="form-group">
                                <label for="projectTechnologies">التقنيات المستخدمة</label>
                                <input type="text" id="projectTechnologies" name="technologies"
                                       placeholder="HTML, CSS, JavaScript (افصل بفاصلة)">
                                <small>افصل التقنيات بفاصلة</small>
                            </div>

                            <div class="form-row">
                                <div class="form-group">
                                    <label for="projectLiveUrl">رابط المشروع المباشر</label>
                                    <input type="url" id="projectLiveUrl" name="liveUrl" placeholder="https://example.com">
                                </div>
                                <div class="form-group">
                                    <label for="projectGithubUrl">رابط GitHub</label>
                                    <input type="url" id="projectGithubUrl" name="githubUrl" placeholder="https://github.com/username/repo">
                                </div>
                            </div>

                            <div class="form-group">
                                <label class="checkbox-label">
                                    <input type="checkbox" id="projectFeatured" name="featured">
                                    <span class="checkmark"></span>
                                    مشروع مميز
                                </label>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-close="projectModal">إلغاء</button>
                        <button type="submit" form="projectForm" class="btn btn-primary" id="saveProjectBtn">حفظ المشروع</button>
                    </div>
                </div>
            </div>
        `;

        this.setupPortfolioHandlers();
    }

    createProjectCard(project, index) {
        const imageUrl = project.image || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPuS4jeKAjdmI2KzYryDYtdmI2LHYqTwvdGV4dD48L3N2Zz4=';

        return `
            <div class="project-card" data-category="${project.category}" data-index="${index}">
                <div class="project-image">
                    <img src="${imageUrl}" alt="${project.title}">
                    ${project.featured ? '<div class="featured-badge"><i class="fas fa-star"></i></div>' : ''}
                </div>
                <div class="project-content">
                    <h3>${project.title}</h3>
                    <p class="project-description">${project.description}</p>
                    <div class="project-technologies">
                        ${project.technologies ? project.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('') : ''}
                    </div>
                    <div class="project-links">
                        ${project.liveUrl ? `<a href="${project.liveUrl}" target="_blank" class="project-link"><i class="fas fa-external-link-alt"></i></a>` : ''}
                        ${project.githubUrl ? `<a href="${project.githubUrl}" target="_blank" class="project-link"><i class="fab fa-github"></i></a>` : ''}
                    </div>
                </div>
                <div class="project-actions">
                    <button type="button" class="btn btn-sm btn-secondary edit-project" data-index="${index}">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button type="button" class="btn btn-sm btn-danger delete-project" data-index="${index}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
    }

    setupPortfolioHandlers() {
        const addProjectBtn = document.getElementById('addProjectBtn');
        const savePortfolioBtn = document.getElementById('savePortfolioBtn');
        const projectForm = document.getElementById('projectForm');
        const projectImage = document.getElementById('projectImage');
        const portfolioFilter = document.getElementById('portfolioFilter');

        if (addProjectBtn) {
            addProjectBtn.addEventListener('click', () => this.showAddProjectModal());
        }

        if (savePortfolioBtn) {
            savePortfolioBtn.addEventListener('click', () => this.savePortfolio());
        }

        if (projectForm) {
            projectForm.addEventListener('submit', (e) => this.saveProject(e));
        }

        if (projectImage) {
            projectImage.addEventListener('change', (e) => this.handleProjectImageUpload(e));
        }

        if (portfolioFilter) {
            portfolioFilter.addEventListener('change', (e) => this.filterProjects(e.target.value));
        }

        // Handle project actions
        document.addEventListener('click', (e) => {
            if (e.target.matches('.edit-project') || e.target.closest('.edit-project')) {
                const index = e.target.closest('.edit-project').dataset.index;
                this.editProject(index);
            }

            if (e.target.matches('.delete-project') || e.target.closest('.delete-project')) {
                const index = e.target.closest('.delete-project').dataset.index;
                this.deleteProject(index);
            }
        });
    }

    showAddProjectModal() {
        document.getElementById('projectModalTitle').textContent = 'إضافة مشروع جديد';
        document.getElementById('projectForm').reset();
        document.getElementById('projectIndex').value = '';
        document.getElementById('projectImagePreview').style.display = 'none';
        document.getElementById('saveProjectBtn').textContent = 'إضافة المشروع';
        this.showModal('projectModal');
    }

    editProject(index) {
        const project = window.adminCore.data.portfolio[index];
        if (!project) return;

        document.getElementById('projectModalTitle').textContent = 'تعديل المشروع';
        document.getElementById('projectIndex').value = index;
        document.getElementById('projectTitle').value = project.title;
        document.getElementById('projectCategory').value = project.category;
        document.getElementById('projectDescription').value = project.description;
        document.getElementById('projectTechnologies').value = project.technologies ? project.technologies.join(', ') : '';
        document.getElementById('projectLiveUrl').value = project.liveUrl || '';
        document.getElementById('projectGithubUrl').value = project.githubUrl || '';
        document.getElementById('projectFeatured').checked = project.featured || false;

        const preview = document.getElementById('projectImagePreview');
        if (project.image) {
            preview.src = project.image;
            preview.style.display = 'block';
        } else {
            preview.style.display = 'none';
        }

        document.getElementById('saveProjectBtn').textContent = 'حفظ التغييرات';
        this.showModal('projectModal');
    }

    handleProjectImageUpload(e) {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            window.adminCore.showNotification('يرجى اختيار ملف صورة صحيح', 'error');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            window.adminCore.showNotification('حجم الصورة يجب أن يكون أقل من 5 ميجابايت', 'error');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const preview = document.getElementById('projectImagePreview');
            preview.src = e.target.result;
            preview.style.display = 'block';
        };

        reader.readAsDataURL(file);
    }

    saveProject(e) {
        e.preventDefault();

        const formData = new FormData(e.target);
        const index = formData.get('index');

        const project = {
            title: formData.get('title'),
            description: formData.get('description'),
            category: formData.get('category'),
            technologies: formData.get('technologies') ? formData.get('technologies').split(',').map(t => t.trim()) : [],
            liveUrl: formData.get('liveUrl') || '',
            githubUrl: formData.get('githubUrl') || '',
            featured: formData.get('featured') === 'on'
        };

        // Handle image
        const preview = document.getElementById('projectImagePreview');
        if (preview.style.display !== 'none' && preview.src) {
            project.image = preview.src;
        }

        if (index === '' || index === null) {
            // Add new project
            project.id = Date.now();
            window.adminCore.data.portfolio.push(project);
            window.adminCore.showNotification('تم إضافة المشروع بنجاح', 'success');
        } else {
            // Update existing project
            const existingProject = window.adminCore.data.portfolio[index];
            project.id = existingProject.id;
            window.adminCore.data.portfolio[index] = project;
            window.adminCore.showNotification('تم تحديث المشروع بنجاح', 'success');
        }

        this.loadPortfolioForm();
        this.hideModal('projectModal');
    }

    deleteProject(index) {
        if (confirm('هل أنت متأكد من حذف هذا المشروع؟')) {
            window.adminCore.data.portfolio.splice(index, 1);
            this.loadPortfolioForm();
            window.adminCore.showNotification('تم حذف المشروع', 'success');
        }
    }

    filterProjects(category) {
        const projectCards = document.querySelectorAll('.project-card');

        projectCards.forEach(card => {
            if (category === 'all' || card.dataset.category === category) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }

    savePortfolio() {
        if (window.adminCore.saveData('portfolio', window.adminCore.data.portfolio)) {
            window.adminCore.addActivity('تم تحديث معرض الأعمال', 'briefcase');
        }
    }

    // ===== Blog Management =====
    loadBlogForm() {
        const blogSection = document.getElementById('blog-section');
        if (!blogSection) return;

        const formContainer = blogSection.querySelector('.form-container');
        const articles = window.adminCore.data.blog;

        formContainer.innerHTML = `
            <div class="blog-manager">
                <div class="section-actions">
                    <button type="button" class="btn btn-primary" id="addArticleBtn">
                        <i class="fas fa-plus"></i>
                        كتابة مقال جديد
                    </button>
                    <div class="filter-actions">
                        <select id="blogFilter" class="form-control">
                            <option value="all">جميع المقالات</option>
                            <option value="published">منشور</option>
                            <option value="draft">مسودة</option>
                        </select>
                    </div>
                </div>

                <div class="articles-list" id="articlesList">
                    ${articles.length > 0 ? articles.map((article, index) => this.createArticleCard(article, index)).join('') : '<div class="empty-state"><i class="fas fa-edit"></i><p>لا توجد مقالات بعد. ابدأ بكتابة مقالك الأول!</p></div>'}
                </div>

                <div class="form-actions">
                    <button type="button" class="btn btn-success" id="saveBlogBtn">
                        <i class="fas fa-save"></i>
                        حفظ جميع المقالات
                    </button>
                </div>
            </div>

            <!-- Add/Edit Article Modal -->
            <div class="modal" id="articleModal">
                <div class="modal-content" style="max-width: 900px; max-height: 90vh;">
                    <div class="modal-header">
                        <h3 class="modal-title" id="articleModalTitle">كتابة مقال جديد</h3>
                        <button type="button" class="modal-close" data-close="articleModal">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="modal-body" style="max-height: 70vh; overflow-y: auto;">
                        <form id="articleForm">
                            <input type="hidden" id="articleIndex" name="index">

                            <div class="form-row">
                                <div class="form-group">
                                    <label for="articleTitle">عنوان المقال</label>
                                    <input type="text" id="articleTitle" name="title" required>
                                </div>
                                <div class="form-group">
                                    <label for="articleCategory">التصنيف</label>
                                    <select id="articleCategory" name="category" required>
                                        <option value="">اختر التصنيف</option>
                                        <option value="تطوير ويب">تطوير ويب</option>
                                        <option value="JavaScript">JavaScript</option>
                                        <option value="CSS">CSS</option>
                                        <option value="HTML">HTML</option>
                                        <option value="React">React</option>
                                        <option value="Node.js">Node.js</option>
                                        <option value="الأداء">الأداء</option>
                                        <option value="تصميم">تصميم</option>
                                        <option value="نصائح">نصائح</option>
                                        <option value="أخرى">أخرى</option>
                                    </select>
                                </div>
                            </div>

                            <div class="form-group">
                                <label for="articleExcerpt">مقتطف المقال</label>
                                <textarea id="articleExcerpt" name="excerpt" rows="2"
                                         placeholder="مقتطف قصير يظهر في قائمة المقالات..." required></textarea>
                            </div>

                            <div class="form-group">
                                <label for="articleContent">محتوى المقال</label>
                                <div class="editor-toolbar">
                                    <button type="button" class="editor-btn" data-command="bold" title="عريض">
                                        <i class="fas fa-bold"></i>
                                    </button>
                                    <button type="button" class="editor-btn" data-command="italic" title="مائل">
                                        <i class="fas fa-italic"></i>
                                    </button>
                                    <button type="button" class="editor-btn" data-command="underline" title="تحته خط">
                                        <i class="fas fa-underline"></i>
                                    </button>
                                    <div class="toolbar-separator"></div>
                                    <button type="button" class="editor-btn" data-command="insertUnorderedList" title="قائمة نقطية">
                                        <i class="fas fa-list-ul"></i>
                                    </button>
                                    <button type="button" class="editor-btn" data-command="insertOrderedList" title="قائمة مرقمة">
                                        <i class="fas fa-list-ol"></i>
                                    </button>
                                    <div class="toolbar-separator"></div>
                                    <button type="button" class="editor-btn" data-command="createLink" title="رابط">
                                        <i class="fas fa-link"></i>
                                    </button>
                                    <button type="button" class="editor-btn" data-command="insertImage" title="صورة">
                                        <i class="fas fa-image"></i>
                                    </button>
                                </div>
                                <div id="articleContent" class="rich-editor" contenteditable="true"
                                     placeholder="اكتب محتوى مقالك هنا..."></div>
                                <textarea id="articleContentHidden" name="content" style="display: none;"></textarea>
                            </div>

                            <div class="form-row">
                                <div class="form-group">
                                    <label for="articleTags">الكلمات المفتاحية</label>
                                    <input type="text" id="articleTags" name="tags"
                                           placeholder="JavaScript, تطوير ويب, نصائح (افصل بفاصلة)">
                                    <small>افصل الكلمات المفتاحية بفاصلة</small>
                                </div>
                                <div class="form-group">
                                    <label for="articleStatus">حالة المقال</label>
                                    <select id="articleStatus" name="status" required>
                                        <option value="draft">مسودة</option>
                                        <option value="published">منشور</option>
                                    </select>
                                </div>
                            </div>

                            <div class="form-group">
                                <label class="checkbox-label">
                                    <input type="checkbox" id="articleFeatured" name="featured">
                                    <span class="checkmark"></span>
                                    مقال مميز
                                </label>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-close="articleModal">إلغاء</button>
                        <button type="button" class="btn btn-secondary" id="saveAsDraftBtn">حفظ كمسودة</button>
                        <button type="submit" form="articleForm" class="btn btn-primary" id="saveArticleBtn">نشر المقال</button>
                    </div>
                </div>
            </div>
        `;

        this.setupBlogHandlers();
    }

    createArticleCard(article, index) {
        const publishDate = new Date(article.publishDate || article.createdDate).toLocaleDateString('ar-SA');
        const statusClass = article.status === 'published' ? 'success' : 'warning';
        const statusText = article.status === 'published' ? 'منشور' : 'مسودة';

        return `
            <div class="article-card" data-status="${article.status}" data-index="${index}">
                <div class="article-content">
                    <div class="article-header">
                        <h3>${article.title}</h3>
                        <div class="article-meta">
                            <span class="article-status ${statusClass}">${statusText}</span>
                            ${article.featured ? '<span class="featured-badge"><i class="fas fa-star"></i> مميز</span>' : ''}
                        </div>
                    </div>
                    <p class="article-excerpt">${article.excerpt}</p>
                    <div class="article-info">
                        <div class="article-details">
                            <span><i class="fas fa-calendar"></i> ${publishDate}</span>
                            <span><i class="fas fa-tag"></i> ${article.category}</span>
                            ${article.tags ? `<span><i class="fas fa-tags"></i> ${article.tags.slice(0, 2).join(', ')}${article.tags.length > 2 ? '...' : ''}</span>` : ''}
                        </div>
                        <div class="article-actions">
                            <button type="button" class="btn btn-sm btn-secondary edit-article" data-index="${index}">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button type="button" class="btn btn-sm btn-info preview-article" data-index="${index}">
                                <i class="fas fa-eye"></i>
                            </button>
                            <button type="button" class="btn btn-sm btn-danger delete-article" data-index="${index}">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    setupBlogHandlers() {
        const addArticleBtn = document.getElementById('addArticleBtn');
        const saveBlogBtn = document.getElementById('saveBlogBtn');
        const articleForm = document.getElementById('articleForm');
        const blogFilter = document.getElementById('blogFilter');
        const saveAsDraftBtn = document.getElementById('saveAsDraftBtn');
        const richEditor = document.getElementById('articleContent');

        if (addArticleBtn) {
            addArticleBtn.addEventListener('click', () => this.showAddArticleModal());
        }

        if (saveBlogBtn) {
            saveBlogBtn.addEventListener('click', () => this.saveBlog());
        }

        if (articleForm) {
            articleForm.addEventListener('submit', (e) => this.saveArticle(e, 'published'));
        }

        if (saveAsDraftBtn) {
            saveAsDraftBtn.addEventListener('click', () => this.saveArticle(null, 'draft'));
        }

        if (blogFilter) {
            blogFilter.addEventListener('change', (e) => this.filterArticles(e.target.value));
        }

        if (richEditor) {
            this.setupRichEditor();
        }

        // Handle article actions
        document.addEventListener('click', (e) => {
            if (e.target.matches('.edit-article') || e.target.closest('.edit-article')) {
                const index = e.target.closest('.edit-article').dataset.index;
                this.editArticle(index);
            }

            if (e.target.matches('.delete-article') || e.target.closest('.delete-article')) {
                const index = e.target.closest('.delete-article').dataset.index;
                this.deleteArticle(index);
            }

            if (e.target.matches('.preview-article') || e.target.closest('.preview-article')) {
                const index = e.target.closest('.preview-article').dataset.index;
                this.previewArticle(index);
            }
        });
    }

    setupRichEditor() {
        const editor = document.getElementById('articleContent');
        const hiddenTextarea = document.getElementById('articleContentHidden');

        // Update hidden textarea when editor content changes
        editor.addEventListener('input', () => {
            hiddenTextarea.value = editor.innerHTML;
        });

        // Handle toolbar buttons
        document.addEventListener('click', (e) => {
            if (e.target.matches('.editor-btn') || e.target.closest('.editor-btn')) {
                e.preventDefault();
                const btn = e.target.closest('.editor-btn');
                const command = btn.dataset.command;
                this.executeEditorCommand(command);
            }
        });
    }

    executeEditorCommand(command) {
        const editor = document.getElementById('articleContent');
        editor.focus();

        if (command === 'createLink') {
            const url = prompt('أدخل رابط URL:');
            if (url) {
                document.execCommand(command, false, url);
            }
        } else if (command === 'insertImage') {
            const url = prompt('أدخل رابط الصورة:');
            if (url) {
                document.execCommand(command, false, url);
            }
        } else {
            document.execCommand(command, false, null);
        }

        // Update hidden textarea
        document.getElementById('articleContentHidden').value = editor.innerHTML;
    }

    showAddArticleModal() {
        document.getElementById('articleModalTitle').textContent = 'كتابة مقال جديد';
        document.getElementById('articleForm').reset();
        document.getElementById('articleIndex').value = '';
        document.getElementById('articleContent').innerHTML = '';
        document.getElementById('articleContentHidden').value = '';
        document.getElementById('saveArticleBtn').textContent = 'نشر المقال';
        this.showModal('articleModal');
    }

    editArticle(index) {
        const article = window.adminCore.data.blog[index];
        if (!article) return;

        document.getElementById('articleModalTitle').textContent = 'تعديل المقال';
        document.getElementById('articleIndex').value = index;
        document.getElementById('articleTitle').value = article.title;
        document.getElementById('articleCategory').value = article.category;
        document.getElementById('articleExcerpt').value = article.excerpt;
        document.getElementById('articleContent').innerHTML = article.content || '';
        document.getElementById('articleContentHidden').value = article.content || '';
        document.getElementById('articleTags').value = article.tags ? article.tags.join(', ') : '';
        document.getElementById('articleStatus').value = article.status;
        document.getElementById('articleFeatured').checked = article.featured || false;
        document.getElementById('saveArticleBtn').textContent = 'حفظ التغييرات';
        this.showModal('articleModal');
    }

    saveArticle(e, status = null) {
        if (e) e.preventDefault();

        const form = document.getElementById('articleForm');
        const formData = new FormData(form);
        const index = formData.get('index');

        const article = {
            title: formData.get('title'),
            category: formData.get('category'),
            excerpt: formData.get('excerpt'),
            content: document.getElementById('articleContentHidden').value,
            tags: formData.get('tags') ? formData.get('tags').split(',').map(t => t.trim()) : [],
            status: status || formData.get('status'),
            featured: formData.get('featured') === 'on',
            createdDate: Date.now(),
            publishDate: status === 'published' ? Date.now() : null
        };

        if (index === '' || index === null) {
            // Add new article
            article.id = Date.now();
            window.adminCore.data.blog.unshift(article);
            window.adminCore.showNotification('تم إضافة المقال بنجاح', 'success');
        } else {
            // Update existing article
            const existingArticle = window.adminCore.data.blog[index];
            article.id = existingArticle.id;
            article.createdDate = existingArticle.createdDate;
            if (article.status === 'published' && existingArticle.status === 'draft') {
                article.publishDate = Date.now();
            } else {
                article.publishDate = existingArticle.publishDate;
            }
            window.adminCore.data.blog[index] = article;
            window.adminCore.showNotification('تم تحديث المقال بنجاح', 'success');
        }

        this.loadBlogForm();
        this.hideModal('articleModal');
    }

    deleteArticle(index) {
        if (confirm('هل أنت متأكد من حذف هذا المقال؟')) {
            window.adminCore.data.blog.splice(index, 1);
            this.loadBlogForm();
            window.adminCore.showNotification('تم حذف المقال', 'success');
        }
    }

    previewArticle(index) {
        const article = window.adminCore.data.blog[index];
        if (!article) return;

        // Create a preview window
        const previewWindow = window.open('', '_blank', 'width=800,height=600');
        previewWindow.document.write(`
            <!DOCTYPE html>
            <html lang="ar" dir="rtl">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>${article.title}</title>
                <style>
                    body { font-family: 'Cairo', sans-serif; padding: 2rem; line-height: 1.6; }
                    h1 { color: #333; border-bottom: 2px solid #667eea; padding-bottom: 1rem; }
                    .meta { color: #666; margin-bottom: 2rem; }
                    .content { max-width: 800px; }
                </style>
            </head>
            <body>
                <h1>${article.title}</h1>
                <div class="meta">
                    <p><strong>التصنيف:</strong> ${article.category}</p>
                    <p><strong>الحالة:</strong> ${article.status === 'published' ? 'منشور' : 'مسودة'}</p>
                    ${article.tags ? `<p><strong>الكلمات المفتاحية:</strong> ${article.tags.join(', ')}</p>` : ''}
                </div>
                <div class="content">
                    ${article.content}
                </div>
            </body>
            </html>
        `);
        previewWindow.document.close();
    }

    filterArticles(status) {
        const articleCards = document.querySelectorAll('.article-card');

        articleCards.forEach(card => {
            if (status === 'all' || card.dataset.status === status) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }

    saveBlog() {
        if (window.adminCore.saveData('blog', window.adminCore.data.blog)) {
            window.adminCore.addActivity('تم تحديث المدونة', 'blog');
        }
    }

    // ===== Settings Management =====
    loadSettingsForm() {
        const settingsSection = document.getElementById('settings-section');
        if (!settingsSection) return;

        const formContainer = settingsSection.querySelector('.form-container');
        const settings = window.adminCore.data.settings;

        formContainer.innerHTML = `
            <div class="settings-manager">
                <div class="settings-section">
                    <div class="settings-card">
                        <h3><i class="fas fa-globe"></i> إعدادات الموقع العامة</h3>

                        <div class="setting-item">
                            <label class="setting-label" for="siteName">اسم الموقع</label>
                            <p class="setting-description">الاسم الذي يظهر في عنوان المتصفح</p>
                            <input type="text" id="siteName" class="form-control" value="${settings.siteName || ''}" placeholder="موقعي الشخصي">
                        </div>

                        <div class="setting-item">
                            <label class="setting-label" for="siteDescription">وصف الموقع</label>
                            <p class="setting-description">وصف مختصر للموقع يظهر في محركات البحث</p>
                            <textarea id="siteDescription" class="form-control" rows="2" placeholder="موقع شخصي لمطور ويب محترف">${settings.siteDescription || ''}</textarea>
                        </div>

                        <div class="setting-item">
                            <label class="setting-label" for="siteLanguage">لغة الموقع</label>
                            <p class="setting-description">اللغة الافتراضية للموقع</p>
                            <select id="siteLanguage" class="form-control">
                                <option value="ar" ${settings.language === 'ar' ? 'selected' : ''}>العربية</option>
                                <option value="en" ${settings.language === 'en' ? 'selected' : ''}>English</option>
                            </select>
                        </div>

                        <div class="setting-item">
                            <label class="setting-label" for="siteTheme">نمط الموقع</label>
                            <p class="setting-description">النمط البصري للموقع</p>
                            <select id="siteTheme" class="form-control">
                                <option value="default" ${settings.theme === 'default' ? 'selected' : ''}>الافتراضي</option>
                                <option value="dark" ${settings.theme === 'dark' ? 'selected' : ''}>الوضع الليلي</option>
                                <option value="minimal" ${settings.theme === 'minimal' ? 'selected' : ''}>البسيط</option>
                            </select>
                        </div>
                    </div>

                    <div class="settings-card">
                        <h3><i class="fas fa-chart-line"></i> إعدادات التحليلات</h3>

                        <div class="setting-item">
                            <label class="setting-label">تفعيل Google Analytics</label>
                            <p class="setting-description">تتبع زوار الموقع وإحصائيات الاستخدام</p>
                            <label class="toggle-switch">
                                <input type="checkbox" id="analyticsEnabled" ${settings.analytics?.enabled ? 'checked' : ''}>
                                <span class="toggle-slider"></span>
                            </label>
                        </div>

                        <div class="setting-item">
                            <label class="setting-label" for="googleAnalyticsId">معرف Google Analytics</label>
                            <p class="setting-description">معرف التتبع الخاص بـ Google Analytics (مثل: G-XXXXXXXXXX)</p>
                            <input type="text" id="googleAnalyticsId" class="form-control" value="${settings.analytics?.googleAnalytics || ''}" placeholder="G-XXXXXXXXXX">
                        </div>
                    </div>
                </div>

                <div class="settings-section">
                    <div class="settings-card">
                        <h3><i class="fas fa-search"></i> إعدادات SEO</h3>

                        <div class="setting-item">
                            <label class="setting-label" for="metaKeywords">الكلمات المفتاحية</label>
                            <p class="setting-description">كلمات مفتاحية تساعد في ظهور الموقع في محركات البحث</p>
                            <input type="text" id="metaKeywords" class="form-control" value="${settings.seo?.metaKeywords || ''}" placeholder="مطور ويب, تطوير مواقع, HTML, CSS, JavaScript">
                        </div>

                        <div class="setting-item">
                            <label class="setting-label" for="ogImage">صورة المشاركة</label>
                            <p class="setting-description">الصورة التي تظهر عند مشاركة الموقع على الشبكات الاجتماعية</p>
                            <div class="file-upload">
                                <input type="file" id="ogImage" accept="image/*">
                                <div class="file-upload-label">
                                    <i class="fas fa-image"></i>
                                    <span>اختر صورة المشاركة</span>
                                </div>
                            </div>
                            ${settings.seo?.ogImage ? `<img src="${settings.seo.ogImage}" alt="صورة المشاركة الحالية" class="image-preview">` : ''}
                        </div>
                    </div>

                    <div class="settings-card">
                        <h3><i class="fas fa-shield-alt"></i> إعدادات الأمان</h3>

                        <div class="setting-item">
                            <label class="setting-label" for="currentPassword">كلمة المرور الحالية</label>
                            <p class="setting-description">أدخل كلمة المرور الحالية لتغييرها</p>
                            <input type="password" id="currentPassword" class="form-control" placeholder="كلمة المرور الحالية">
                        </div>

                        <div class="setting-item">
                            <label class="setting-label" for="newPassword">كلمة المرور الجديدة</label>
                            <p class="setting-description">كلمة مرور جديدة (6 أحرف على الأقل)</p>
                            <input type="password" id="newPassword" class="form-control" placeholder="كلمة المرور الجديدة">
                        </div>

                        <div class="setting-item">
                            <label class="setting-label" for="confirmPassword">تأكيد كلمة المرور</label>
                            <p class="setting-description">أعد إدخال كلمة المرور الجديدة</p>
                            <input type="password" id="confirmPassword" class="form-control" placeholder="تأكيد كلمة المرور">
                        </div>

                        <button type="button" class="btn btn-warning" id="changePasswordBtn">
                            <i class="fas fa-key"></i>
                            تغيير كلمة المرور
                        </button>
                    </div>
                </div>

                <div class="import-export-section">
                    <div class="export-area">
                        <h3><i class="fas fa-download"></i> تصدير البيانات</h3>
                        <p>احفظ نسخة احتياطية من جميع بيانات موقعك</p>
                        <button type="button" class="btn btn-primary" id="exportDataBtn">
                            <i class="fas fa-download"></i>
                            تصدير البيانات
                        </button>
                        <button type="button" class="btn btn-info" id="updateWebsiteBtn">
                            <i class="fas fa-sync"></i>
                            تحديث الموقع الرئيسي
                        </button>
                    </div>

                    <div class="import-area">
                        <h3><i class="fas fa-upload"></i> استيراد البيانات</h3>
                        <p>استعادة البيانات من نسخة احتياطية سابقة</p>
                        <div class="file-drop-zone" id="importDropZone">
                            <i class="fas fa-cloud-upload-alt"></i>
                            <p>اسحب ملف البيانات هنا أو اضغط للاختيار</p>
                            <input type="file" id="importFile" accept=".json">
                        </div>
                        <button type="button" class="btn btn-success" id="importDataBtn" style="display: none;">
                            <i class="fas fa-upload"></i>
                            استيراد البيانات
                        </button>
                    </div>
                </div>

                <div class="danger-zone">
                    <h4><i class="fas fa-exclamation-triangle"></i> منطقة خطر</h4>
                    <p>هذه الإجراءات لا يمكن التراجع عنها. تأكد من إنشاء نسخة احتياطية قبل المتابعة.</p>
                    <button type="button" class="btn btn-danger" id="resetAllDataBtn">
                        <i class="fas fa-trash-alt"></i>
                        إعادة تعيين جميع البيانات
                    </button>
                    <button type="button" class="btn btn-danger" id="clearCacheBtn">
                        <i class="fas fa-broom"></i>
                        مسح ذاكرة التخزين المؤقت
                    </button>
                </div>

                <div class="form-actions">
                    <button type="button" class="btn btn-secondary" id="resetSettingsBtn">
                        <i class="fas fa-undo"></i>
                        إعادة تعيين
                    </button>
                    <button type="button" class="btn btn-primary" id="saveSettingsBtn">
                        <i class="fas fa-save"></i>
                        حفظ الإعدادات
                    </button>
                </div>
            </div>
        `;

        this.setupSettingsHandlers();
    }

    setupSettingsHandlers() {
        const saveSettingsBtn = document.getElementById('saveSettingsBtn');
        const resetSettingsBtn = document.getElementById('resetSettingsBtn');
        const changePasswordBtn = document.getElementById('changePasswordBtn');
        const exportDataBtn = document.getElementById('exportDataBtn');
        const updateWebsiteBtn = document.getElementById('updateWebsiteBtn');
        const importFile = document.getElementById('importFile');
        const importDropZone = document.getElementById('importDropZone');
        const importDataBtn = document.getElementById('importDataBtn');
        const resetAllDataBtn = document.getElementById('resetAllDataBtn');
        const clearCacheBtn = document.getElementById('clearCacheBtn');
        const ogImageInput = document.getElementById('ogImage');

        if (saveSettingsBtn) {
            saveSettingsBtn.addEventListener('click', () => this.saveSettings());
        }

        if (resetSettingsBtn) {
            resetSettingsBtn.addEventListener('click', () => this.resetSettings());
        }

        if (changePasswordBtn) {
            changePasswordBtn.addEventListener('click', () => this.changePassword());
        }

        if (exportDataBtn) {
            exportDataBtn.addEventListener('click', () => window.websiteUpdater.exportAllData());
        }

        if (updateWebsiteBtn) {
            updateWebsiteBtn.addEventListener('click', () => window.websiteUpdater.updateMainWebsite(window.adminCore.data));
        }

        if (importFile && importDropZone) {
            this.setupImportHandlers(importFile, importDropZone, importDataBtn);
        }

        if (resetAllDataBtn) {
            resetAllDataBtn.addEventListener('click', () => this.resetAllData());
        }

        if (clearCacheBtn) {
            clearCacheBtn.addEventListener('click', () => this.clearCache());
        }

        if (ogImageInput) {
            ogImageInput.addEventListener('change', (e) => this.handleOgImageUpload(e));
        }
    }

    setupImportHandlers(fileInput, dropZone, importBtn) {
        // File input change
        fileInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                importBtn.style.display = 'block';
                dropZone.querySelector('p').textContent = `تم اختيار: ${e.target.files[0].name}`;
            }
        });

        // Drag and drop
        dropZone.addEventListener('click', () => fileInput.click());

        dropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropZone.classList.add('dragover');
        });

        dropZone.addEventListener('dragleave', () => {
            dropZone.classList.remove('dragover');
        });

        dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropZone.classList.remove('dragover');

            const files = e.dataTransfer.files;
            if (files.length > 0) {
                fileInput.files = files;
                importBtn.style.display = 'block';
                dropZone.querySelector('p').textContent = `تم اختيار: ${files[0].name}`;
            }
        });

        // Import button
        if (importBtn) {
            importBtn.addEventListener('click', () => this.importData());
        }
    }

    async importData() {
        const fileInput = document.getElementById('importFile');
        const file = fileInput.files[0];

        if (!file) {
            window.adminCore.showNotification('يرجى اختيار ملف للاستيراد', 'error');
            return;
        }

        try {
            window.adminCore.showLoading(true);
            const data = await window.websiteUpdater.importData(file);

            // Refresh all forms
            this.loadPersonalInfoForm();
            this.loadSkillsForm();
            this.loadPortfolioForm();
            this.loadBlogForm();
            this.loadSettingsForm();

            window.adminCore.updateDashboardStats();
            window.adminCore.showLoading(false);
            window.adminCore.showNotification('تم استيراد البيانات بنجاح!', 'success');
            window.adminCore.addActivity('تم استيراد البيانات', 'upload');

        } catch (error) {
            window.adminCore.showLoading(false);
            window.adminCore.showNotification('خطأ في استيراد البيانات: ' + error.message, 'error');
        }
    }

    saveSettings() {
        const settings = {
            siteName: document.getElementById('siteName').value,
            siteDescription: document.getElementById('siteDescription').value,
            language: document.getElementById('siteLanguage').value,
            theme: document.getElementById('siteTheme').value,
            analytics: {
                enabled: document.getElementById('analyticsEnabled').checked,
                googleAnalytics: document.getElementById('googleAnalyticsId').value
            },
            seo: {
                metaKeywords: document.getElementById('metaKeywords').value,
                ogImage: window.adminCore.data.settings.seo?.ogImage || ''
            }
        };

        if (window.adminCore.saveData('settings', settings)) {
            window.adminCore.addActivity('تم تحديث الإعدادات', 'cogs');
        }
    }

    resetSettings() {
        if (confirm('هل أنت متأكد من إعادة تعيين الإعدادات؟')) {
            this.loadSettingsForm();
            window.adminCore.showNotification('تم إعادة تعيين الإعدادات', 'info');
        }
    }

    changePassword() {
        const currentPassword = document.getElementById('currentPassword').value;
        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        if (!currentPassword || !newPassword || !confirmPassword) {
            window.adminCore.showNotification('يرجى ملء جميع حقول كلمة المرور', 'error');
            return;
        }

        if (newPassword !== confirmPassword) {
            window.adminCore.showNotification('كلمة المرور الجديدة غير متطابقة', 'error');
            return;
        }

        if (newPassword.length < 6) {
            window.adminCore.showNotification('كلمة المرور يجب أن تكون 6 أحرف على الأقل', 'error');
            return;
        }

        // Verify current password (simplified)
        const credentials = JSON.parse(localStorage.getItem('adminCredentials') || '{}');
        const hashedCurrentPassword = this.hashPassword(currentPassword);

        if (hashedCurrentPassword !== credentials.password) {
            window.adminCore.showNotification('كلمة المرور الحالية غير صحيحة', 'error');
            return;
        }

        // Update password
        credentials.password = this.hashPassword(newPassword);
        localStorage.setItem('adminCredentials', JSON.stringify(credentials));

        // Clear form
        document.getElementById('currentPassword').value = '';
        document.getElementById('newPassword').value = '';
        document.getElementById('confirmPassword').value = '';

        window.adminCore.showNotification('تم تغيير كلمة المرور بنجاح', 'success');
        window.adminCore.addActivity('تم تغيير كلمة المرور', 'key');
    }

    hashPassword(password) {
        // Simple hash function (same as in login)
        let hash = 0;
        for (let i = 0; i < password.length; i++) {
            const char = password.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return hash.toString();
    }

    handleOgImageUpload(e) {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            window.adminCore.showNotification('يرجى اختيار ملف صورة صحيح', 'error');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const imageData = e.target.result;

            // Update settings data
            if (!window.adminCore.data.settings.seo) {
                window.adminCore.data.settings.seo = {};
            }
            window.adminCore.data.settings.seo.ogImage = imageData;

            // Update preview
            const existingPreview = document.querySelector('#ogImage + .file-upload + .image-preview');
            if (existingPreview) {
                existingPreview.src = imageData;
            } else {
                const preview = document.createElement('img');
                preview.src = imageData;
                preview.alt = 'صورة المشاركة';
                preview.className = 'image-preview';

                const fileUpload = document.querySelector('#ogImage').closest('.file-upload');
                fileUpload.parentNode.insertBefore(preview, fileUpload.nextSibling);
            }

            window.adminCore.showNotification('تم تحميل صورة المشاركة بنجاح', 'success');
        };

        reader.readAsDataURL(file);
    }

    resetAllData() {
        const confirmation = prompt('هذا الإجراء سيحذف جميع البيانات نهائياً. اكتب "حذف" للتأكيد:');

        if (confirmation === 'حذف') {
            // Clear all data
            localStorage.removeItem('websitePersonalInfo');
            localStorage.removeItem('websiteSkills');
            localStorage.removeItem('websitePortfolio');
            localStorage.removeItem('websiteBlog');
            localStorage.removeItem('websiteSettings');
            localStorage.removeItem('recentActivities');

            // Reload data
            window.adminCore.loadData();

            // Reload all forms
            this.loadPersonalInfoForm();
            this.loadSkillsForm();
            this.loadPortfolioForm();
            this.loadBlogForm();
            this.loadSettingsForm();

            window.adminCore.showNotification('تم حذف جميع البيانات', 'success');
            window.adminCore.addActivity('تم إعادة تعيين جميع البيانات', 'trash');
        } else {
            window.adminCore.showNotification('تم إلغاء العملية', 'info');
        }
    }

    clearCache() {
        if (confirm('هل أنت متأكد من مسح ذاكرة التخزين المؤقت؟')) {
            // Clear browser cache (limited to localStorage)
            const keysToKeep = ['adminSession', 'adminCredentials'];
            const allKeys = Object.keys(localStorage);

            allKeys.forEach(key => {
                if (!keysToKeep.includes(key)) {
                    localStorage.removeItem(key);
                }
            });

            window.adminCore.showNotification('تم مسح ذاكرة التخزين المؤقت', 'success');
            window.adminCore.addActivity('تم مسح ذاكرة التخزين المؤقت', 'broom');
        }
    }
}

// Initialize dashboard manager
document.addEventListener('DOMContentLoaded', () => {
    window.dashboardManager = new DashboardManager();
});
