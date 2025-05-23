document.addEventListener('DOMContentLoaded', function() {
    
    gsap.registerPlugin(ScrollTrigger);
    
    
    const loadingScreen = document.createElement('div');
    loadingScreen.className = 'loading-screen';
    loadingScreen.innerHTML = `
        <div class="loading-logo">
            <img src="logos/title.png" alt="Teen Interns" class="loading-logo-img">
        </div>
        <div class="loading-spinner"></div>
        <div class="loading-message">Loading amazing content...</div>
    `;
    document.body.appendChild(loadingScreen);
    
    
    window.addEventListener('load', function() {
        setTimeout(() => {
            loadingScreen.classList.add('hide');
            setTimeout(() => {
                loadingScreen.remove();
                document.body.classList.remove('loading');
                
                // Initialize animations after DOM is fully loaded and ready
                initializeAnimations();
            }, 500);
        }, 1000); // Minimum 1 second loading screen for better UX
    });
    
    
    initNavigation();
    initLineToPhotoTransitions();
    initCounters();
    initTeamFilter();
    initTabs();
    setupIntersectionObserver();
    
    
    if (document.querySelector('.qr-page')) {
        initQrPage();
    }
});

// Centralized animation initialization
function initializeAnimations() {
    // Wait a bit more to ensure all elements are rendered
    setTimeout(() => {
        animateHero();
        initScrollAnimations();
        initHorizontalProfiles();
    }, 100);
}

function initNavigation() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-link');
    const siteHeader = document.querySelector('.site-header');
    
    
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function() {
            document.body.classList.toggle('mobile-menu-open');
            mobileMenu.classList.toggle('open');
        });
    }
    
    
    mobileLinks.forEach(link => {
        link.addEventListener('click', function() {
            document.body.classList.remove('mobile-menu-open');
            mobileMenu.classList.remove('open');
        });
    });
    
    
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        
        if (scrollTop > 50) {
            siteHeader.classList.add('scrolled');
        } else {
            siteHeader.classList.remove('scrolled');
        }
        
        
        if (scrollTop > lastScrollTop && scrollTop > 200) {
            
            siteHeader.style.transform = 'translateY(-100%)';
        } else {
            
            siteHeader.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
    });
    
    
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerHeight = siteHeader.offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                
                window.scrollTo({
                    top: targetPosition - headerHeight,
                    behavior: 'smooth'
                });
            }
        });
    });
}


function initLineToPhotoTransitions() {
    
    const demoSvgPaths = [
        
        `<svg viewBox="0 0 600 400" xmlns="http://www.w3.org/2000/svg">
            <path class="line-element" d="M150,50 C150,50 200,30 250,50 C300,70 350,30 400,50 C450,70 500,40 550,60" style="--x: 30px; --y: -50px; --rotation: 15deg;"></path>
            <path class="line-element" d="M100,100 C150,80 200,120 250,100 C300,80 350,120 400,100" style="--x: -40px; --y: -30px; --rotation: -10deg;"></path>
            <path class="line-element" d="M50,150 C100,170 150,130 200,150 C250,170 300,130 350,150" style="--x: -20px; --y: 40px; --rotation: 5deg;"></path>
            <path class="line-element" d="M100,200 L200,200 L200,300 L100,300 Z" style="--x: 50px; --y: 10px; --rotation: 20deg;"></path>
            <path class="line-element" d="M300,200 L400,200 L400,300 L300,300 Z" style="--x: -30px; --y: 60px; --rotation: -25deg;"></path>
            <path class="line-element" d="M450,150 C500,170 550,130 600,150" style="--x: 20px; --y: -35px; --rotation: 15deg;"></path>
            <path class="line-element" d="M500,250 C450,230 400,270 350,250" style="--x: 40px; --y: 20px; --rotation: -5deg;"></path>
            <path class="line-element" d="M150,350 C200,330 250,370 300,350 C350,330 400,370 450,350" style="--x: -25px; --y: 45px; --rotation: 10deg;"></path>
        </svg>`,
        
        
        `<svg viewBox="0 0 600 400" xmlns="http://www.w3.org/2000/svg">
            <rect class="line-element" x="100" y="50" width="400" height="300" rx="20" style="--x: 0; --y: -60px; --rotation: 0deg;"></rect>
            <path class="line-element" d="M150,100 L350,100" style="--x: -40px; --y: -20px; --rotation: -5deg;"></path>
            <path class="line-element" d="M150,150 L450,150" style="--x: 30px; --y: 10px; --rotation: 5deg;"></path>
            <path class="line-element" d="M150,200 L400,200" style="--x: -20px; --y: 40px; --rotation: -8deg;"></path>
            <rect class="line-element" x="150" y="250" width="100" height="50" rx="10" style="--x: 40px; --y: 30px; --rotation: 15deg;"></rect>
            <rect class="line-element" x="350" y="250" width="100" height="50" rx="10" style="--x: -30px; --y: 50px; --rotation: -10deg;"></rect>
        </svg>`,
        
        
        `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <circle class="line-element" cx="100" cy="70" r="40" style="--x: 0; --y: -30px; --rotation: 0deg;"></circle>
            <path class="line-element" d="M60,80 C60,110 140,110 140,80" style="--x: 0; --y: -20px; --rotation: 0deg;"></path>
            <path class="line-element" d="M100,110 L100,160" style="--x: 0; --y: 30px; --rotation: 0deg;"></path>
            <path class="line-element" d="M100,130 L60,150" style="--x: -20px; --y: 20px; --rotation: -10deg;"></path>
            <path class="line-element" d="M100,130 L140,150" style="--x: 20px; --y: 20px; --rotation: 10deg;"></path>
        </svg>`,
        
        
        `<svg viewBox="0 0 600 400" xmlns="http://www.w3.org/2000/svg">
            <rect class="line-element" x="100" y="50" width="400" height="300" rx="10" style="--x: 0; --y: -50px; --rotation: 0deg;"></rect>
            <line class="line-element" x1="150" y1="100" x2="450" y2="100" style="--x: 30px; --y: -20px; --rotation: 5deg;"></line>
            <line class="line-element" x1="150" y1="150" x2="450" y2="150" style="--x: -40px; --y: 10px; --rotation: -8deg;"></line>
            <line class="line-element" x1="150" y1="200" x2="350" y2="200" style="--x: 20px; --y: 30px; --rotation: 10deg;"></line>
            <circle class="line-element" cx="200" cy="300" r="30" style="--x: -40px; --y: 20px; --rotation: -15deg;"></circle>
            <circle class="line-element" cx="400" cy="300" r="30" style="--x: 50px; --y: 10px; --rotation: 20deg;"></circle>
        </svg>`,
        
        
        `<svg viewBox="0 0 600 400" xmlns="http://www.w3.org/2000/svg">
            <path class="line-element" d="M100,100 C150,50 250,50 300,100 C350,150 450,150 500,100" style="--x: 0; --y: -40px; --rotation: 0deg;"></path>
            <path class="line-element" d="M100,200 C150,150 250,150 300,200 C350,250 450,250 500,200" style="--x: 0; --y: 50px; --rotation: 0deg;"></path>
            <circle class="line-element" cx="150" cy="250" r="30" style="--x: -30px; --y: 20px; --rotation: -10deg;"></circle>
            <circle class="line-element" cx="300" cy="150" r="30" style="--x: 0px; --y: -50px; --rotation: 0deg;"></circle>
            <circle class="line-element" cx="450" cy="250" r="30" style="--x: 40px; --y: 30px; --rotation: 15deg;"></circle>
        </svg>`
    ];
    
    
    const heroLineArt = document.getElementById('hero-line-art');
    if (heroLineArt) {
        heroLineArt.innerHTML = demoSvgPaths[0];
    }
    
    const aboutLineArt = document.getElementById('about-line-art');
    if (aboutLineArt) {
        aboutLineArt.innerHTML = demoSvgPaths[1];
    }
    
    
    const teamLineArts = document.querySelectorAll('.team-line-art');
    teamLineArts.forEach(art => {
        art.innerHTML = demoSvgPaths[2];
    });
    
    
    const previewLineArt = document.querySelector('.preview-line-art');
    if (previewLineArt) {
        previewLineArt.innerHTML = demoSvgPaths[3];
    }
    
    
    const impactLineArt = document.querySelector('.impact-line-art');
    if (impactLineArt) {
        impactLineArt.innerHTML = demoSvgPaths[4];
    }
    
    
    const containers = document.querySelectorAll('.image-transition-container[data-scroll-trigger]');
    
    containers.forEach(container => {
        ScrollTrigger.create({
            trigger: container,
            start: "top 75%",  // Start when the top of the container hits 75% of the viewport
            end: "bottom 25%", // End when the bottom of the container hits 25% of the viewport
            onEnter: () => {
                container.classList.add('lines-dissolving');
            },
            onLeaveBack: () => {
                container.classList.remove('lines-dissolving');
            },
            toggleActions: "play none none reverse"
        });
    });
}


function animateHero() {
    const heroTitle = document.querySelector('.hero-title');
    const heroSubtitle = document.querySelector('.hero-subtitle');
    const heroStats = document.querySelectorAll('.stat-item');
    const heroCta = document.querySelectorAll('.hero-cta .cta-button');
    
    
    const tl = gsap.timeline();
    
    
    if (heroTitle) {
        const titleLines = document.querySelectorAll('.title-line');
        if (titleLines.length > 0) {
            tl.from(titleLines, {
                y: 50,
                opacity: 0,
                duration: 0.8,
                stagger: 0.2,
                ease: "power3.out"
            });
        }
    }
    
    if (heroSubtitle) {
        tl.from(heroSubtitle, {
            y: 30,
            opacity: 0,
            duration: 0.6,
            ease: "power2.out"
        }, "-=0.4");
    }
    
    if (heroStats.length) {
        tl.from(heroStats, {
            y: 20,
            opacity: 0,
            duration: 0.5,
            stagger: 0.1,
            ease: "power2.out"
        }, "-=0.3");
    }
    
    if (heroCta.length) {
        tl.from(heroCta, {
            y: 20,
            opacity: 0,
            duration: 0.5,
            stagger: 0.1,
            ease: "power2.out"
        }, "-=0.2");
    }
    
    // Check if floating elements exist before animating
    const floatElements = document.querySelectorAll('.float-element');
    if (floatElements.length > 0) {
        gsap.from(floatElements, {
            y: 30,
            opacity: 0,
            duration: 1,
            stagger: 0.2,
            ease: "power2.out"
        });
    }
}


function initScrollAnimations() {
    // Safely animate section headers
    gsap.utils.toArray('section').forEach(section => {
        const sectionHeader = section.querySelector('.section-header');
        if (sectionHeader) {
            gsap.from(sectionHeader, {
                y: 50,
                opacity: 0,
                duration: 0.8,
                scrollTrigger: {
                    trigger: section,
                    start: "top 80%",
                    end: "top 50%",
                    toggleActions: "play none none none"
                }
            });
        }
    });
}


function initCounters() {
    
    const counters = document.querySelectorAll('[data-count]');
    
    counters.forEach(counter => {
        const target = parseInt(counter.dataset.count, 10);
        
        ScrollTrigger.create({
            trigger: counter,
            start: "top 80%",
            onEnter: () => {
                gsap.to(counter, {
                    innerText: target,
                    duration: 2,
                    snap: { innerText: 1 },
                    ease: "power2.out",
                    onUpdate: function() {
                        counter.innerText = Math.ceil(parseFloat(counter.innerText));
                    }
                });
            },
            once: true
        });
    });
}


function initTeamFilter() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const teamCards = document.querySelectorAll('.team-card');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            
            filterBtns.forEach(b => b.classList.remove('active'));
            
            
            this.classList.add('active');
            
            
            const filter = this.getAttribute('data-filter');
            
            
            teamCards.forEach(card => {
                const category = card.getAttribute('data-category');
                
                if (filter === 'all' || filter === category) {
                    gsap.to(card, {
                        opacity: 1,
                        scale: 1,
                        duration: 0.3,
                        ease: "power2.out",
                        onStart: function() {
                            card.style.display = 'block';
                        }
                    });
                } else {
                    gsap.to(card, {
                        opacity: 0,
                        scale: 0.9,
                        duration: 0.3,
                        ease: "power2.out",
                        onComplete: function() {
                            card.style.display = 'none';
                        }
                    });
                }
            });
        });
    });
}


function initTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanels = document.querySelectorAll('.tab-panel');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            
            tabBtns.forEach(b => b.classList.remove('active'));
            tabPanels.forEach(p => p.classList.remove('active'));
            
            
            this.classList.add('active');
            
            
            const tab = this.getAttribute('data-tab');
            
            
            const targetPanel = document.querySelector(`.tab-panel[data-tab="${tab}"]`);
            if (targetPanel) {
                targetPanel.classList.add('active');
            }
        });
    });
}


function setupIntersectionObserver() {
    const animatedElements = document.querySelectorAll('.animate-fade-up, .animate-fade-right, .animate-fade-left, .animate-pop');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                
                
                // observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    animatedElements.forEach(el => {
        observer.observe(el);
    });
}


function initQrPage() {
    
    if (!document.querySelector('.qr-back-to-book')) {
        const backButton = document.createElement('div');
        backButton.className = 'qr-back-to-book';
        backButton.innerHTML = `
            <a href="javascript:history.back()" class="back-to-book-btn">
                <span>↩</span> Back to book
            </a>
        `;
        
        const qrPage = document.querySelector('.qr-page');
        if (qrPage) {
            qrPage.appendChild(backButton);
        }
    }
    
    
    const qrContent = document.querySelector('.qr-content');
    if (qrContent) {
        gsap.from(qrContent, {
            y: 50,
            opacity: 0,
            duration: 0.8,
            ease: "power2.out",
            delay: 0.5
        });
    }
}


function initPageTransitions() {
    
    
    
    console.log('Page transitions now managed by page-transition.js');
}


// Horizontal Scrolling Team Profiles
function initHorizontalProfiles() {
    const profilesSection = document.querySelector('.team-profiles');
    const profilesContainer = document.querySelector('.profiles-container');
    const profileCards = document.querySelectorAll('.profile-card');
    const progressDots = document.querySelector('#progressDots');
    const scrollIndicator = document.querySelector('#scrollIndicator');
    
    if (!profilesSection || !profilesContainer || !profileCards.length) {
        console.log('Team profiles elements not found, skipping horizontal scroll initialization');
        return; // Exit if elements don't exist
    }
    
    // Clear existing dots to prevent duplicates
    if (progressDots) {
        progressDots.innerHTML = '';
        
        // Create progress dots
        profileCards.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.className = 'progress-dot';
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => scrollToProfile(index));
            progressDots.appendChild(dot);
        });
    }
    
    // Get all progress dots
    const dots = document.querySelectorAll('.progress-dot');
    
    // Calculate total width of all profile cards
    const totalWidth = profileCards.length * window.innerWidth;
    
    // Create the horizontal scroll animation
    const horizontalScroll = gsap.to(profilesContainer, {
        x: () => -(totalWidth - window.innerWidth),
        ease: "none",
        scrollTrigger: {
            trigger: profilesSection,
            start: "top top",
            end: () => `+=${totalWidth}`,
            scrub: 1,
            pin: true,
            anticipatePin: 1,
            onUpdate: (self) => {
                // Update progress dots based on scroll progress
                const progress = self.progress;
                const currentIndex = Math.round(progress * (profileCards.length - 1));
                
                dots.forEach((dot, index) => {
                    dot.classList.toggle('active', index === currentIndex);
                });
                
                // Hide scroll indicator after first scroll
                if (progress > 0.1 && scrollIndicator) {
                    scrollIndicator.style.opacity = '0';
                } else if (progress <= 0.1 && scrollIndicator) {
                    scrollIndicator.style.opacity = '1';
                }
            }
        }
    });
    
    // Function to scroll to specific profile
    function scrollToProfile(index) {
        const targetProgress = index / (profileCards.length - 1);
        const scrollTriggerInstance = horizontalScroll.scrollTrigger;
        const targetScroll = scrollTriggerInstance.start + (targetProgress * (scrollTriggerInstance.end - scrollTriggerInstance.start));
        
        gsap.to(window, {
            scrollTo: targetScroll,
            duration: 1,
            ease: "power2.inOut"
        });
    }
    
    // Animate profile cards on enter
    profileCards.forEach((card, index) => {
        ScrollTrigger.create({
            trigger: card,
            start: "left 80%",
            end: "right 20%",
            horizontal: true,
            containerAnimation: horizontalScroll,
            onEnter: () => {
                const profileImage = card.querySelector('.profile-image');
                const profileInfo = card.querySelector('.profile-info');
                
                if (profileImage) {
                    gsap.from(profileImage, {
                        scale: 0.8,
                        opacity: 0,
                        duration: 0.8,
                        ease: "power2.out"
                    });
                }
                
                if (profileInfo) {
                    gsap.from(profileInfo, {
                        x: 50,
                        opacity: 0,
                        duration: 0.8,
                        delay: 0.2,
                        ease: "power2.out"
                    });
                }
            }
        });
    });
    
    // Handle window resize
    window.addEventListener('resize', () => {
        ScrollTrigger.refresh();
    });
}

// Initialize page transitions
initPageTransitions();