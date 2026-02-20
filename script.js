class PortfolioApp {
    constructor() {
        this.projects = [];
        this.categories = [];
        this.currentFilter = 'all';
        this.isMenuOpen = false;
        this.isDarkTheme = true;
        this.loadingProgress = 0;

        this.initLoading();
    }

    initLoading() {
        document.body.classList.add('loading');
        window.addEventListener('load', () => {
            setTimeout(() => {
                this.hideLoadingScreen();
            }, 2000); 
        });
    }

    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        const body = document.body;

        if (loadingScreen) {
            setTimeout(() => {
                this.init();
            }, 500);
            setTimeout(() => {
                body.classList.remove('loading'); 
                this.delayLandingAnimations();
            }, 1400); 
            setTimeout(() => {
                loadingScreen.classList.add('fade-out');

                setTimeout(() => {
                    loadingScreen.remove();
                }, 600);
            }, 1600); 
        } else {
            body.classList.remove('loading');
            this.init();
        }
    }

    delayLandingAnimations() {
        const heroElements = document.querySelectorAll('.hero-title, .hero-subtitle, .hero-description, .hero-actions, .hero-image');

        heroElements.forEach((element, index) => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            element.style.transition = 'opacity 0.6s ease, transform 0.6s ease'; // Faster transitions

            setTimeout(() => {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, index * 100); // Reduced from 200ms to 100ms between elements
        });

        const floatingCards = document.querySelectorAll('.floating-card');
        floatingCards.forEach((card, index) => {
            card.style.animationDelay = `${0.3 + (index * 0.2)}s`; 
        });

        const scrollIndicator = document.querySelector('.scroll-indicator');
        if (scrollIndicator) {
            scrollIndicator.style.opacity = '0';
            scrollIndicator.style.transform = 'translateY(20px) translateX(-50%)'; // X-50% centered
            scrollIndicator.style.transition = 'opacity 0.5s ease, transform 0.5s ease';

            setTimeout(() => {
                scrollIndicator.style.opacity = '1';
                scrollIndicator.style.transform = 'translateY(0) translateX(-50%)';

            }, 800); // Reduced from 2000ms to 800ms
        }
    }

    async init() {
        this.setupEventListeners();
        this.initTheme();
        this.initTypingEffect();
        this.initScrollAnimations();
        this.initParallax();
        this.initActiveNavigation();
        // this.init3DCardEffects();
        this.init3DEffects();
        this.initAdvancedFeatures();
        this.setCurrentYear();
        await this.loadProjects();
        this.renderFilterButtons();
        this.renderProjects();

        this.initializeEmailJS();
    }

    setupEventListeners() {
        document.addEventListener('click', (e) => {
            if (e.target.matches('[href^="#"]')) {
                e.preventDefault();
                const targetId = e.target.getAttribute('href').substring(1);

                if (this.isMenuOpen) {
                    this.toggleMobileMenu();
                }

                if (targetId === 'home') {
                    this.scrollToTop();
                } else {
                    this.scrollToSection(targetId);
                }
            }
        });

        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggleTheme());
        }

        const mobileMenuToggle = document.getElementById('mobileMenuToggle');
        if (mobileMenuToggle) {
            mobileMenuToggle.addEventListener('click', () => this.toggleMobileMenu());
        }

        document.addEventListener('click', (e) => {
            if (e.target.matches('.filter-btn')) {
                this.setActiveFilter(e.target);
                this.filterProjects(e.target.dataset.filter);
            }
        });

        const contactForm = document.getElementById('contactForm');
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => this.handleContactForm(e));
        }

        window.addEventListener('scroll', () => {
            this.updateNavbar();
            this.updateParallax();
            this.updateActiveNavigation();
        });

        window.addEventListener('resize', () => {
            this.handleResize();
        });
    }

    scrollToSection(targetId) {
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
            const navHeight = document.querySelector('.navbar').offsetHeight;
            const targetPosition = targetElement.offsetTop - navHeight - 20;

            const navLinks = document.querySelectorAll('.nav-link');
            navLinks.forEach(link => link.classList.remove('active'));

            const activeLink = document.querySelector(`.nav-link[href="#${targetId}"]`);
            if (activeLink) {
                activeLink.classList.add('active');
            }

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    }

    scrollToTop() {
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => link.classList.remove('active'));

        const homeLink = document.querySelector('.nav-link[href="#home"]');
        if (homeLink) {
            homeLink.classList.add('active');
        }
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    initTheme() {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            this.isDarkTheme = savedTheme === 'dark';
        } else {
            this.isDarkTheme = !window.matchMedia('(prefers-color-scheme: light)').matches;
        }

        this.applyTheme();
    }

    toggleTheme() {
        this.isDarkTheme = !this.isDarkTheme;
        this.applyTheme();
    }

    applyTheme() {
        const themeToggle = document.getElementById('themeToggle');
        const profileImage = document.querySelector('.profile-image');
        
        if (this.isDarkTheme) {
            document.documentElement.removeAttribute('data-theme');
            if (themeToggle) {
                themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
            }
            
            if (profileImage) {
                this.switchProfileImage(profileImage, './assets/ele/profile_pic.png', 'Tirth Patel - Developer Illustration (Dark Theme)', 'brightness(0.7) contrast(1.1) hue-rotate(0) saturate(1)');

            }
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            if (themeToggle) {
                themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
            }
            if (profileImage) {
                this.switchProfileImage(profileImage, './assets/ele/profile2.jpg', 'Tirth Patel - Developer Illustration (Light Theme)', 'none');
            }
        }
        
        localStorage.setItem('theme', this.isDarkTheme ? 'dark' : 'light');
    }

    switchProfileImage(imageElement, newSrc, newAlt, filterStyle = 'none') {
        imageElement.style.opacity = '0.3';
        
        const newImage = new Image();
        newImage.onload = () => {
            imageElement.src = newSrc;
            imageElement.alt = newAlt;
            imageElement.style.filter = filterStyle;
            
            setTimeout(() => {
                imageElement.style.opacity = '1';
            }, 150);
        };
        
        newImage.onerror = () => {
            console.warn(`Failed to load profile image: ${newSrc}`);
            setTimeout(() => {
                imageElement.style.opacity = '1';
            }, 150);
        };
        
        newImage.src = newSrc;
    }

    toggleMobileMenu() {
        this.isMenuOpen = !this.isMenuOpen;
        const navMenu = document.querySelector('.nav-menu');
        const mobileMenuToggle = document.getElementById('mobileMenuToggle');

        if (navMenu && mobileMenuToggle) {
            if (this.isMenuOpen) {
                navMenu.style.display = 'flex';
                mobileMenuToggle.classList.add('active');
            } else {
                navMenu.style.display = 'none';
                mobileMenuToggle.classList.remove('active');
            }
        }
    }

    initTypingEffect() {
        const typingText = document.querySelector('.typing-text');
        if (!typingText) return;

        const roles = [
            'Full Stack Developer',
            'User-Centered Thinking',
            'AI Enthusiast',
            'Problem Solver',
            'Creative Thinker',
            'Tech Explorer'
        ];

        let currentRole = 0;
        let currentChar = 0;
        let isDeleting = false;
        let isPaused = false;

        const typeRole = () => {
            const current = roles[currentRole];

            if (isPaused) {
                isPaused = false;
                setTimeout(typeRole, 1000);
                return;
            }

            if (isDeleting) {
                typingText.textContent = current.substring(0, currentChar - 1);
                currentChar--;
            } else {
                typingText.textContent = current.substring(0, currentChar + 1);
                currentChar++;
            }

            let typeSpeed = isDeleting ? 50 : 100;

            if (!isDeleting && currentChar === current.length) {
                isPaused = true;
                isDeleting = true;
                typeSpeed = 2000;
            } else if (isDeleting && currentChar === 0) {
                isDeleting = false;
                currentRole = (currentRole + 1) % roles.length;
                typeSpeed = 300;
            }

            setTimeout(typeRole, typeSpeed);
        };

        setTimeout(typeRole, 1000);
    }

    initScrollAnimations() {
        const scrollObserverOptions = {
            threshold: [0, 0.1, 0.25, 0.5, 0.75, 1],
            rootMargin: '0px 0px -100px 0px'
        };

        const scrollObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                const element = entry.target;
                const intersectionRatio = entry.intersectionRatio;

                if (entry.isIntersecting && intersectionRatio > 0.1) {
                    setTimeout(() => {
                        element.classList.add('revealed', 'in-view', 'animation-completed');
                        this.animateChildElements(element);

                        if (element.classList.contains('float-on-scroll')) {
                            element.classList.add('in-view');
                        }

                        if (element.classList.contains('glow-border')) {
                            element.classList.add('in-view');
                        }
                        scrollObserver.unobserve(element);

                    }, this.getAnimationDelay(element));
                }
            });
        }, scrollObserverOptions);

        const scrollElements = document.querySelectorAll(`
            .scroll-reveal:not(.animation-completed),
            .scroll-reveal-left:not(.animation-completed),
            .scroll-reveal-right:not(.animation-completed),
            .scroll-reveal-scale:not(.animation-completed),
            .scroll-reveal-rotate:not(.animation-completed),
            .float-on-scroll:not(.animation-completed),
            .glow-border:not(.animation-completed),
            .enhanced-hover:not(.animation-completed)
        `);

        scrollElements.forEach(element => {
            scrollObserver.observe(element);
        });

        this.initParallaxScrollEffects();

        this.initProjectCardAnimations();
    }

    animateChildElements(parent) {
        const children = parent.querySelectorAll('.tech-badge, .stat, .contact-card, .bento-card');
        children.forEach((child, index) => {
            setTimeout(() => {
                child.classList.add('revealed', 'in-view', 'animation-completed');
            }, index * 100);
        });
    }

    getAnimationDelay(element) {
        const staggerClasses = ['scroll-stagger-1', 'scroll-stagger-2', 'scroll-stagger-3',
            'scroll-stagger-4', 'scroll-stagger-5', 'scroll-stagger-6'];

        for (let i = 0; i < staggerClasses.length; i++) {
            if (element.classList.contains(staggerClasses[i])) {
                return (i + 1) * 150; // 150ms between each staggered element
            }
        }
        return 0;
    }

    initParallaxScrollEffects() {
        const parallaxElements = document.querySelectorAll('.parallax-slow, .parallax-medium, .parallax-fast');

        const parallaxObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    window.addEventListener('scroll', () => this.updateParallaxElement(entry.target));
                }
            });
        }, { rootMargin: '0px 0px -100px 0px' });

        parallaxElements.forEach(element => {
            parallaxObserver.observe(element);
        });
    }

    updateParallaxElement(element) {
        const rect = element.getBoundingClientRect();
        const speed = this.getParallaxSpeed(element);
        const yPos = rect.top * speed;
        element.style.transform = `translate3d(0, ${yPos}px, 0)`;
    }

    getParallaxSpeed(element) {
        if (element.classList.contains('parallax-slow')) return -0.2;
        if (element.classList.contains('parallax-medium')) return -0.4;
        if (element.classList.contains('parallax-fast')) return -0.6;
        return 0;
    }

    initProjectCardAnimations() {
        const projectObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.classList.add('revealed', 'enhanced-hover', 'animation-completed');
                        this.addAdvancedCardEffects(entry.target);
                        projectObserver.unobserve(entry.target);
                    }, index * 100);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        this.observeProjectCards = () => {
            setTimeout(() => {
                const projectCards = document.querySelectorAll('.project-card:not(.animation-completed)');
                projectCards.forEach(card => {
                    if (!card.hasAttribute('data-observed')) {
                        projectObserver.observe(card);
                        card.setAttribute('data-observed', 'true');
                    }
                });
            }, 100);
        };
    }

    addAdvancedCardEffects(card) {
        
    }

    addShimmerEffect(element) {
        const shimmer = document.createElement('div');
        shimmer.className = 'shimmer-effect';
        shimmer.style.cssText = `
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
            transition: left 0.6s ease;
            pointer-events: none;
            z-index: 1;
        `;

        element.style.position = 'relative';
        element.style.overflow = 'hidden';
        element.appendChild(shimmer);

        setTimeout(() => {
            shimmer.style.left = '100%';
        }, 50);

        setTimeout(() => {
            if (shimmer.parentNode) {
                shimmer.remove();
            }
        }, 700);
    }

    initAdvancedFeatures() {
        
        this.initCounterAnimations();

       
        this.initMorphingBackgrounds();
    }

    initMagneticHover() {
        const magneticElements = document.querySelectorAll('.btn, .tech-badge, .contact-card');

        magneticElements.forEach(element => {
            element.addEventListener('mousemove', (e) => {
                if (window.innerWidth > 960) {
                    const rect = element.getBoundingClientRect();
                    const x = e.clientX - rect.left - rect.width / 2;
                    const y = e.clientY - rect.top - rect.height / 2;

                    const moveX = x * 0.15;
                    const moveY = y * 0.15;

                    element.style.transform = `translate(${moveX}px, ${moveY}px)`;
                }
            });

            element.addEventListener('mouseleave', () => {
                element.style.transform = 'translate(0, 0)';
            });
        });
    }

    initCounterAnimations() {
        const statNumbers = document.querySelectorAll('.stat-number');

        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = entry.target;
                    const finalValue = target.textContent;
                    if (!isNaN(parseInt(finalValue))) {
                        this.animateCounter(target, parseInt(finalValue));
                    }

                    target.parentElement.classList.add('counter-animate');
                }
            });
        }, { threshold: 0.7 });

        statNumbers.forEach(stat => {
            counterObserver.observe(stat);
        });
    }

    animateCounter(element, finalValue) {
        let currentValue = 0;
        const increment = finalValue / 30; 
        const duration = 1000; // 1 second
        const frameRate = duration / 30;

        const timer = setInterval(() => {
            currentValue += increment;
            if (currentValue >= finalValue) {
                element.textContent = finalValue + (element.textContent.includes('+') ? '+' : '');
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(currentValue) + (element.textContent.includes('+') ? '+' : '');
            }
        }, frameRate);
    }

    initMorphingBackgrounds() {
        const morphElements = document.querySelectorAll('.bento-card, .contact-card');

        morphElements.forEach(element => {
            element.classList.add('morph-bg');
        });
    }

    initParallax() {
        this.floatingElements = document.querySelectorAll('.floating-card');
    }

    updateParallax() {
        if (!this.floatingElements) return;

        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;

        this.floatingElements.forEach((element) => {
            const speed = element.dataset.speed || 1;
            const yPos = -(scrolled * speed * 0.1);
            element.style.transform = `translateY(${yPos}px)`;
        });
    }

    updateNavbar() {
        const navbar = document.querySelector('.navbar');
        if (!navbar) return;

        if (window.scrollY > 500) {
            
            navbar.classList.add('scrolled');


        } else {
            navbar.classList.remove('scrolled');

        }
    }

    initActiveNavigation() {
        this.updateActiveNavigation();
    }

    updateActiveNavigation() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');

        if (sections.length === 0 || navLinks.length === 0) return;

        const navHeight = document.querySelector('.navbar')?.offsetHeight || 70;
        const scrollPosition = window.scrollY + navHeight + 50;

        let activeSection = null;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionBottom = sectionTop + section.offsetHeight;

            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                activeSection = section;
            }
        });

        if (window.scrollY < 100) {
            const homeSection = document.getElementById('home');
            if (homeSection) {
                activeSection = homeSection;
            }
        }
        if (activeSection) {
            navLinks.forEach(link => link.classList.remove('active'));
            const activeLink = document.querySelector(`.nav-link[href="#${activeSection.id}"]`);
            if (activeLink) {
                activeLink.classList.add('active');
            }
        }
    }

    setInitialActiveNav() {
        this.updateActiveNavigation();
    }

    init3DCardEffects() {
        if (!window.matchMedia('(hover: hover)').matches) {
            return; // Skip 3D effects on touch devices
        }

        const projectCards = document.querySelectorAll('.project-card');

        projectCards.forEach(card => {
            const handleMouseMove = (e) => {
                const cardRect = card.getBoundingClientRect();
                const cardWidth = cardRect.width;
                const cardHeight = cardRect.height;

                const centerX = cardRect.left + cardWidth / 2;
                const centerY = cardRect.top + cardHeight / 2;

                const mouseX = e.clientX - centerX;
                const mouseY = e.clientY - centerY;

                const rotateX = (mouseY / cardHeight) * -15;
                const rotateY = (mouseX / cardWidth) * 15;

                const distance = Math.sqrt(mouseX * mouseX + mouseY * mouseY);
                const maxDistance = Math.sqrt(cardWidth * cardWidth + cardHeight * cardHeight) / 2;
                const scale = 1 + (1 - distance / maxDistance) * 0.03;

                const mouseXPercent = ((e.clientX - cardRect.left) / cardWidth) * 100;
                const mouseYPercent = ((e.clientY - cardRect.top) / cardHeight) * 100;

                card.style.setProperty('--rotateX', `${rotateX}deg`);
                card.style.setProperty('--rotateY', `${rotateY}deg`);
                card.style.setProperty('--scale', scale);
                card.style.setProperty('--mouse-x', `${mouseXPercent}%`);
                card.style.setProperty('--mouse-y', `${mouseYPercent}%`);

                card.style.transition = 'all 0.1s ease-out';
            };

            const handleMouseEnter = (e) => {
                card.style.transition = 'all 0.1s ease-out';
            };

            const handleMouseLeave = (e) => {
                card.style.setProperty('--rotateX', '0deg');
                card.style.setProperty('--rotateY', '0deg');
                card.style.setProperty('--scale', '1');
                card.style.setProperty('--mouse-x', '50%');
                card.style.setProperty('--mouse-y', '50%');
                card.style.transition = 'all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
            };

            card.addEventListener('mousemove', handleMouseMove);
            card.addEventListener('mouseenter', handleMouseEnter);
            card.addEventListener('mouseleave', handleMouseLeave);
        });

        this.reinit3DEffects = () => {
            document.querySelectorAll('.project-card').forEach(card => {
                const newCard = card.cloneNode(true);
                card.parentNode.replaceChild(newCard, card);
            });

            setTimeout(() => this.init3DEffects(), 100);

        };
    }

    async loadProjects() {
        try {
            const response = await fetch('./assets/config/projects.json');
            const data = await response.json();
            this.projects = data.projects;
            this.categories = data.categories || [
                { id: "all", name: "All", icon: "fas fa-th-large", visible: true },
                { id: "web", name: "Web Dev", icon: "fas fa-globe", visible: true },
                { id: "automation", name: "Automation", icon: "fas fa-robot", visible: true }
            ];
        } catch (error) {
            console.error('Error loading projects:', error);
            this.projects = [
                {
                    id: 1,
                    title: "Modern Portfolio Website",
                    description: "A responsive personal website showcasing projects with modern design patterns and animations.",
                    technologies: ["HTML5", "CSS3", "JavaScript", "Modern Design"],
                    category: "web",
                    githubUrl: "https://github.com/rushhiii/portfolio",
                    liveUrl: "#",
                    featured: true
                },
                {
                    id: 2,
                    title: "Task Management System",
                    description: "Full-stack web application for task management with real-time updates and user authentication.",
                    technologies: ["React", "Node.js", "MongoDB", "Express"],
                    category: "web",
                    githubUrl: "https://github.com/rushhiii/task-manager",
                    liveUrl: "#",
                    featured: true
                },
                {
                    id: 3,
                    title: "AI Chatbot Assistant",
                    description: "Intelligent chatbot using natural language processing for automated customer support.",
                    technologies: ["Python", "Machine Learning", "NLP", "TensorFlow"],
                    category: "ai",
                    githubUrl: "https://github.com/rushhiii/ai-chatbot",
                    liveUrl: "#",
                    featured: true
                }
            ];
            this.categories = [
                { id: "all", name: "All", icon: "fas fa-th-large", visible: true },
                { id: "web", name: "Web Dev", icon: "fas fa-globe", visible: true },
                { id: "automation", name: "Automation", icon: "fas fa-robot", visible: true }
            ];
        }
    }

    renderFilterButtons() {
        const filterContainer = document.querySelector('.project-filters');
        if (!filterContainer) return;

        filterContainer.innerHTML = '';

        this.categories
            .filter(category => category.visible !== false) 
            .forEach(category => {
                const button = document.createElement('button');
                button.className = `filter-btn ${category.id === 'all' ? 'active' : ''}`;
                button.setAttribute('data-filter', category.id);

                if (category.icon) {
                    button.innerHTML = `<i class="${category.icon}"></i> ${category.name}`;
                } else {
                    button.textContent = category.name;
                }

                button.addEventListener('click', (e) => {
                    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
                    e.target.classList.add('active');
                    this.filterProjects(category.id);
                });

                filterContainer.appendChild(button);
            });
    }

    renderProjects() {
        const projectsGrid = document.getElementById('projectsGrid');
        if (!projectsGrid) return;

        projectsGrid.innerHTML = '';

        let filteredProjects = this.projects.filter(project => {
            if (project.displayCard === false) {
                return false;
            }

            return this.currentFilter === 'all' || project.category === this.currentFilter;
        });

        filteredProjects.forEach((project, index) => {
            const projectCard = this.createProjectCard(project, index);
            projectsGrid.appendChild(projectCard);
        });
        setTimeout(() => {
            this.init3DEffects();
            if (this.observeProjectCards) {
                this.observeProjectCards();
            }
        }, 500); 
    }

    createProjectCard(project, index = 0) {
        const card = document.createElement('div');
        card.className = 'project-card scroll-reveal enhanced-hover';

        const staggerClass = `scroll-stagger-${Math.min(index % 6 + 1, 6)}`;
        card.classList.add(staggerClass);

        const techStack = project.technologies.map(tech =>
            `<span class="tag">${tech}</span>`
        ).join('');

        const projectImage = project.image || 'assets/default-project.png';

        const buttons = this.generateProjectButtons(project);

        card.innerHTML = `
            <img src="${projectImage}" alt="${project.title}" class="project-image parallax-slow" loading="lazy" 
                 onerror="this.src='https://via.placeholder.com/400x200/1a1a2e/6366f1?text=${encodeURIComponent(project.title)}'">
            <div class="project-content">
                <div class="project-header">
                    <h3>${project.title}</h3>
                    ${project.featured ? '<span class="featured-badge">Featured</span>' : ''}
                </div>
                <p class="project-description">${project.description}</p>
                <div class="tech-stack">
                    ${techStack}
                </div>
                <div class="project-links">
                    ${buttons}
                </div>
            </div>
        `;

        return card;
    }

    generateProjectButtons(project) {
        let buttons = [];

        const codeLabel = project.codeLabel || 'Code';
        const codeIcon = project.codeIcon || 'fab fa-github';
        buttons.push(`
            <a href="${project.githubUrl}" target="_blank" rel="noopener" class="btn btn-outline">
                <i class="${codeIcon}"></i>
                <span>${codeLabel}</span>
            </a>
        `);
        if (project.liveUrl && project.liveUrl !== '#' && project.liveUrl !== null) {
            const liveLabel = project.liveLabel || 'Live Demo';
            const liveIcon = project.liveIcon || 'fas fa-external-link-alt';
            buttons.push(`
                <a href="${project.liveUrl}" target="_blank" rel="noopener" class="btn btn-primary">
                    <i class="${liveIcon}"></i>
                    <span>${liveLabel}</span>
                </a>
            `);
        } else if (project.secondButton !== false) {
            const fallbackLabel = project.fallbackLabel || 'View Project';
            const fallbackIcon = project.fallbackIcon || 'fas fa-eye';
            buttons.push(`
                <a href="${project.githubUrl}" target="_blank" rel="noopener" class="btn btn-primary">
                    <i class="${fallbackIcon}"></i>
                    <span>${fallbackLabel}</span>
                </a>
            `);
        }

        return buttons.join('');
    }

    setActiveFilter(activeBtn) {
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        activeBtn.classList.add('active');
    }

    filterProjects(filter) {
        this.currentFilter = filter;

        let filteredProjects = this.projects.filter(project => {
            if (project.displayCard === false) {
                return false;
            }
            return filter === 'all' || project.category === filter;
        });

        const projectsGrid = document.getElementById('projectsGrid');

        if (projectsGrid) {
            if (filter !== 'all' && filteredProjects.length < 3) {
                projectsGrid.classList.add('few-cards');
            } else {
                projectsGrid.classList.remove('few-cards');
            }
        }

        this.renderProjects();
    }

    handleContactForm(e) {
        e.preventDefault();

        const submitBtn = e.target.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;

        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;

        const formData = new FormData(e.target);
        const data = new URLSearchParams();

        data.append('form-name', 'portfolio-contact');

        for (const [key, value] of formData.entries()) {
            data.append(key, value);
        }

        fetch('/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: data.toString()
        })
            .then(response => {
                if (response.ok) {
                    this.showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
                    e.target.reset();
                } else {
                    throw new Error('Network response was not ok');
                }
            })
            .catch((error) => {
                console.error('Form submission failed:', error);
                this.showNotification('❌ Failed to send message. Please try emailing me directly at piyushapatil2410@gmail.com', 'error');
            })
            .finally(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            });
    }

    initializeEmailJS() {
        console.log('Using Netlify forms for contact form submission');
    }

    showNotification(message, type = 'info') {
        const existingNotifications = document.querySelectorAll('.notification');
        if (existingNotifications.length >= 3) {
            existingNotifications[0].remove();
        }

        const currentNotifications = document.querySelectorAll('.notification');
        const notificationHeight = 85; // Height + margin
        const topOffset = 20 + (currentNotifications.length * notificationHeight);

        const notification = document.createElement('div');
        notification.className = `notification ${type}`;

        const maxTop = 20 + (2 * notificationHeight); // Max 3 notifications
        const finalTop = Math.min(topOffset, maxTop);
        notification.style.top = `${finalTop}px`;

        if (window.innerWidth <= 960) {
            notification.style.transform = 'translateY(-120px)';
        } else {
            notification.style.transform = 'translateX(-50%) translateY(-120px)';
        }

        let icon = 'info-circle';
        if (type === 'success') icon = 'check-circle';
        if (type === 'error') icon = 'exclamation-circle';

        notification.innerHTML = `
            <i class="fas fa-${icon}"></i>
            <span>${message}</span>
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            if (window.innerWidth <= 960) {
                notification.style.transform = 'translateY(0)';
            } else {
                notification.style.transform = 'translateX(-50%) translateY(0)';
            }
            notification.style.opacity = '1';
        }, 150);

        const dismissTimer = setTimeout(() => {
            this.dismissNotification(notification);
        }, 8000);

        notification.addEventListener('click', () => {
            clearTimeout(dismissTimer);
            this.dismissNotification(notification);
        });

        notification.addEventListener('mouseenter', () => {
            clearTimeout(dismissTimer);
        });

        notification.addEventListener('mouseleave', () => {
            setTimeout(() => {
                this.dismissNotification(notification);
            }, 8000);
        });
    }

    dismissNotification(notification) {
        if (!notification || !notification.parentNode) return;

        if (window.innerWidth <= 960) {
            notification.style.transform = 'translateY(-120px)';
        } else {
            notification.style.transform = 'translateX(-50%) translateY(-120px)';
        }
        notification.style.opacity = '0';

        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
                this.repositionNotifications();
                this.cleanupNotifications();
            }
        }, 400);
    }

    cleanupNotifications() {
        const notifications = document.querySelectorAll('.notification');
        notifications.forEach(notification => {
            if (notification.style.opacity === '0' ||
                getComputedStyle(notification).opacity === '0') {
                notification.remove();
            }
        });
    }

    repositionNotifications() {
        const notifications = document.querySelectorAll('.notification');
        notifications.forEach((notification, index) => {
            const notificationHeight = 85;
            const newTop = 20 + (index * notificationHeight);

            const maxTop = 20 + (2 * notificationHeight);
            const finalTop = Math.min(newTop, maxTop);

            notification.style.top = `${finalTop}px`;

            if (window.innerWidth <= 960) {
                if (notification.style.opacity === '1') {
                    notification.style.transform = 'translateY(0)';
                }
            } else {
                if (notification.style.opacity === '1') {
                    notification.style.transform = 'translateX(-50%) translateY(0)';
                }
            }
        });
    }

    setCurrentYear() {
        const currentYearElement = document.getElementById('currentYear');
        if (currentYearElement) {
            currentYearElement.textContent = new Date().getFullYear();
        }
    }

    handleResize() {
        if (window.innerWidth > 960 && this.isMenuOpen) {
            this.toggleMobileMenu();
        }

        this.repositionNotifications();
    }

    init3DEffects() {
        if (!window.matchMedia('(hover: hover)').matches) {
            console.log('Skipping 3D effects - touch device detected');
            return; 
        }

        const cards = document.querySelectorAll('.project-card');
        console.log(`Initializing 3D effects for ${cards.length} project cards`);

        cards.forEach((card, index) => {
            const newCard = card.cloneNode(true);
            card.parentNode.replaceChild(newCard, card);
            
            newCard.addEventListener('mouseenter', () => {
                newCard.style.transition = 'transform all 400ms ease-in-out';
                console.log(`Mouse enter on card ${index}`);
            });

            newCard.addEventListener('mouseleave', () => {
                newCard.style.transition = 'transform all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
                newCard.style.setProperty('transform', 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px) scale(1)');
                console.log(`Mouse leave on card ${index}`);
            });

            newCard.addEventListener('mousemove', (e) => {
                const cardRect = newCard.getBoundingClientRect();
                const cardCenterX = cardRect.left + cardRect.width / 2;
                const cardCenterY = cardRect.top + cardRect.height / 2;

                const deltaX = e.clientX - cardCenterX;
                const deltaY = e.clientY - cardCenterY;

                const rotateX = (deltaY / cardRect.height) * 15;
                const rotateY = (deltaX / cardRect.width) * -15;

                const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
                const maxDistance = Math.sqrt(cardRect.width * cardRect.width + cardRect.height * cardRect.height) / 2;
                const proximity = 1 - Math.min(distance / maxDistance, 1);

                const scale = (1 + (proximity * 0.03));
                const translateZ = proximity * 10;

                const transformValue = `perspective(1500px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(${translateZ}px) scale(${scale})`;
                newCard.style.setProperty('transform', transformValue, 'important');

                if (Math.random() < 0.01) { 
                    console.log(`Card ${index}: rotateX=${rotateX.toFixed(1)}, rotateY=${rotateY.toFixed(1)}, scale=${scale.toFixed(2)}`);
                    console.log(`Transform applied: ${transformValue}`);
                }
            });
        });
    }

}
const notificationStyles = `
    .notification {
        position: fixed;
        left: 50%;
        transform: translateX(-50%);
        background: linear-gradient(
            135deg,
            var(--bg-primary) 0%,
            var(--bg-secondary) 50%,
            var(--bg-primary) 100%
        );
        /* Retro slant stripes background */
        background-image: repeating-linear-gradient(
            45deg,
            transparent,
            transparent 8px,
            rgba(99, 102, 241, 0.1) 8px,
            rgba(99, 102, 241, 0.1) 16px
        );
        backdrop-filter: blur(25px);
        border: 2px solid transparent;
        background-clip: padding-box;
        border-radius: 16px;
        padding: 18px 24px;
        color: var(--text-primary);
        display: flex;
        align-items: center;
        gap: 16px;
        z-index: 10000;
        opacity: 0;
        transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        box-shadow: 
            0 20px 40px rgba(0, 0, 0, 0.3),
            0 8px 16px rgba(0, 0, 0, 0.2),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
        min-width: 350px;
        max-width: 500px;
        font-weight: 500;
        overflow: hidden;
        /* Start above screen and animate down */
        transform: translateX(-50%) translateY(-120px);
    }

    .notification::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.1),
            transparent
        );
        transition: left 0.6s ease;
    }

    .notification:hover::before {
        left: 100%;
    }
    
    .notification.success {
        border-color: rgba(34, 197, 94, 0.5);
        background-image: repeating-linear-gradient(
            45deg,
            transparent,
            transparent 8px,
            rgba(34, 197, 94, 0.15) 8px,
            rgba(34, 197, 94, 0.15) 16px
        );
        box-shadow: 
            0 20px 40px rgba(34, 197, 94, 0.2),
            0 8px 16px rgba(34, 197, 94, 0.1),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
    }

    .notification.error {
        border-color: rgba(239, 68, 68, 0.5);
        background-image: repeating-linear-gradient(
            45deg,
            transparent,
            transparent 8px,
            rgba(239, 68, 68, 0.15) 8px,
            rgba(239, 68, 68, 0.15) 16px
        );
        box-shadow: 
            0 20px 40px rgba(239, 68, 68, 0.2),
            0 8px 16px rgba(239, 68, 68, 0.1),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
    }

    .notification.info {
        border-color: rgba(99, 102, 241, 0.5);
        background-image: repeating-linear-gradient(
            45deg,
            transparent,
            transparent 8px,
            rgba(99, 102, 241, 0.15) 8px,
            rgba(99, 102, 241, 0.15) 16px
        );
        box-shadow: 
            0 20px 40px rgba(99, 102, 241, 0.2),
            0 8px 16px rgba(99, 102, 241, 0.1),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
    }
    
    .notification i {
        font-size: 24px;
        flex-shrink: 0;
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(10px);
        animation: notificationIconPulse 0.6s ease-out;
    }

    .notification.success i {
        color: #22c55e;
        background: rgba(34, 197, 94, 0.2);
        animation: successBounce 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }

    .notification.error i {
        color: #ef4444;
        background: rgba(239, 68, 68, 0.2);
        animation: errorShake 0.5s ease-in-out;
    }

    .notification.info i {
        color: #6366f1;
        background: rgba(99, 102, 241, 0.2);
        animation: infoPulse 0.6s ease-out;
    }

    .notification span {
        flex: 1;
        font-size: 16px;
        line-height: 1.4;
        font-weight: 500;
    }

    @keyframes notificationIconPulse {
        0% { transform: scale(0.8); opacity: 0.5; }
        50% { transform: scale(1.1); opacity: 1; }
        100% { transform: scale(1); opacity: 1; }
    }

    @keyframes successBounce {
        0% { transform: scale(0.3) rotate(-10deg); }
        50% { transform: scale(1.2) rotate(5deg); }
        100% { transform: scale(1) rotate(0deg); }
    }

    @keyframes errorShake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-4px) rotate(-2deg); }
        75% { transform: translateX(4px) rotate(2deg); }
    }

    @keyframes infoPulse {
        0% { transform: scale(0.8); opacity: 0.6; }
        50% { transform: scale(1.1); opacity: 1; }
        100% { transform: scale(1); opacity: 1; }
    }

    /* Mobile responsive */
    @media (max-width: 960px) {
        .notification {
            left: 16px;
            right: 16px;
            transform: translateY(-120px);
            min-width: auto;
            max-width: none;
            padding: 16px 20px;
        }

        .notification span {
            font-size: 14px;
        }

        .notification i {
            width: 28px;
            height: 28px;
            font-size: 20px;
        }
    }
`;

const style = document.createElement('style');
style.textContent = notificationStyles;
document.head.appendChild(style);

document.addEventListener('DOMContentLoaded', () => {
    new PortfolioApp();
});

class EnhancedFeatures {
    constructor() {
        this.initCursorEffects();
        this.initKeyboardNavigation();
        this.initAccessibility();
    }

    initCursorEffects() {
        const cursor = document.createElement('div');
        cursor.className = 'custom-cursor';
        cursor.style.cssText = `
            position: fixed;
            width: 20px;
            height: 20px;
            background: var(--primary);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            mix-blend-mode: difference;
            transition: transform 0.1s ease;
            opacity: 0;
        `;
        document.body.appendChild(cursor);

        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX - 10 + 'px';
            cursor.style.top = e.clientY - 10 + 'px';
            cursor.style.opacity = '1';
        });

        document.addEventListener('mouseenter', () => {
            cursor.style.opacity = '1';
        });

        document.addEventListener('mouseleave', () => {
            cursor.style.opacity = '0';
        });

        document.addEventListener('mouseover', (e) => {
            if (e.target.matches('a, button, .btn, .filter-btn, .project-card')) {
                cursor.style.transform = 'scale(1.5)';
            } else {
                cursor.style.transform = 'scale(1)';
            }
        });
    }

    initKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-navigation');
            }

            if (e.key === 'Escape') {
                const mobileMenu = document.querySelector('.nav-menu');
                if (mobileMenu && window.getComputedStyle(mobileMenu).display !== 'none') {
                    const app = window.portfolioApp;
                    if (app && app.isMenuOpen) {
                        app.toggleMobileMenu();
                    }
                }
            }
        });

        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-navigation');
        });
    }

    initAccessibility() {
        const skipLink = document.createElement('a');
        skipLink.href = '#main-content';
        skipLink.className = 'skip-link';
        skipLink.textContent = '';
        skipLink.style.cssText = `
           
        `;

        skipLink.addEventListener('focus', () => {
            skipLink.style.top = '6px';
        });

        skipLink.addEventListener('blur', () => {
            skipLink.style.top = '-40px';
        });

        document.body.insertBefore(skipLink, document.body.firstChild);

        const heroSection = document.getElementById('home');
        if (heroSection) {
            heroSection.id = 'main-content';
        }
        const focusStyles = `
            .keyboard-navigation *:focus {
                outline: 2px solid var(--primary);
                outline-offset: 2px;
            }
        `;

        const style = document.createElement('style');
        style.textContent = focusStyles;
        document.head.appendChild(style);
    }

}
document.addEventListener('DOMContentLoaded', () => {
    new EnhancedFeatures();
});
