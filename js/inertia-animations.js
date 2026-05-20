// Inertia Studios About Page Animations

(function() {
    'use strict';

    // Initialize all animations when DOM is ready
    document.addEventListener('DOMContentLoaded', function() {
        initWordAnimations();
        initScrollAnimations();
        initClientAnimations();
        initTeamCarousel();
        initVideoAnimations();
        initFooterAnimations();
        initBackToTop();
    });

    // Word-by-word animation function
    function animateWords(container, delay = 0.1) {
        if (!container) return;
        
        const words = container.querySelectorAll('.about-title-word, .about-info-words, .about-clients-word, .contact-title-split > div, .about-team-big-text h2 > div > div, .about-team-text > div > div, .about-hero-text > div > div, .about-hero-right p > div > div, .about-info-surtitle > div > div');
        
        words.forEach((word, index) => {
            setTimeout(() => {
                word.classList.add('animate');
            }, delay * 1000 * index);
        });
    }

    // Animate lines with transform effects
    function animateLines(container, delay = 0.15) {
        if (!container) return;
        
        const lines = container.querySelectorAll('.about-info-line, .about-title-line, .contact-title-split');
        
        lines.forEach((line, index) => {
            setTimeout(() => {
                const words = line.querySelectorAll('.about-info-words, .about-title-word, div');
                words.forEach((word, wordIndex) => {
                    setTimeout(() => {
                        word.classList.add('animate');
                    }, wordIndex * 80);
                });
            }, delay * 1000 * index);
        });
    }

    // Initialize word animations on scroll
    function initWordAnimations() {
        const heroTitle = document.querySelector('.about-hero-title');
        const heroText = document.querySelector('.about-hero-text');
        const clientsTitle = document.querySelector('.about-clients-title');
        const infoTitle = document.querySelector('.about-info-title');
        const infoSurtitle = document.querySelector('.about-info-surtitle');
        const teamTitle = document.querySelector('.about-team-big-text');
        const teamText = document.querySelector('.about-team-text');
        const contactTitle = document.querySelector('.footer-contact-title');

        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    
                    if (element === heroTitle || element.closest('.about-hero-title')) {
                        animateLines(heroTitle, 0.1);
                        if (heroText) animateWords(heroText, 0.1);
                    }
                    
                    if (element === clientsTitle || element.closest('.about-clients-top')) {
                        clientsTitle.classList.add('animate');
                    }
                    
                    if (element === infoTitle || element.closest('.about-info-title')) {
                        if (infoSurtitle) animateWords(infoSurtitle, 0.1);
                        animateLines(infoTitle, 0.15);
                    }
                    
                    if (element === teamTitle || element.closest('.about-team-top')) {
                        animateWords(teamTitle, 0.1);
                        if (teamText) animateWords(teamText, 0.08);
                    }
                    
                    if (element === contactTitle || element.closest('.footer-contact-title')) {
                        animateLines(contactTitle, 0.1);
                    }
                    
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.2,
            rootMargin: '0px 0px -100px 0px'
        });

        if (heroTitle) observer.observe(heroTitle);
        if (clientsTitle) observer.observe(clientsTitle);
        if (infoTitle) observer.observe(infoTitle);
        if (teamTitle) observer.observe(teamTitle);
        if (contactTitle) observer.observe(contactTitle);
    }

    // Scroll-triggered animations
    function initScrollAnimations() {
        const observerOptions = {
            threshold: 0.15,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observe elements that need scroll animations
        const animatedElements = document.querySelectorAll(`
            .about-clients-title,
            .about-team-title,
            .about-info-paragraph,
            .about-info-img-ctn,
            .footer-contact-subtitle,
            .footer-block
        `);

        animatedElements.forEach(element => {
            observer.observe(element);
        });
    }

    // Client grid animations
    function initClientAnimations() {
        const clientItems = document.querySelectorAll('.about-client-item');
        if (clientItems.length === 0) return;

        const observer = new IntersectionObserver(function(entries) {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        const highlighted = entry.target.querySelector('.resp-img-ctn.highlighted');
                        if (highlighted) {
                            highlighted.classList.add('animate');
                        }
                    }, index * 50);
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        clientItems.forEach(item => {
            observer.observe(item);
        });
    }

    // Team carousel functionality
    function initTeamCarousel() {
        const teamList = document.querySelector('.about-team-list-ctn');
        const bullets = document.querySelectorAll('.bullet');
        const teamItems = document.querySelectorAll('.about-team-item');
        
        if (!teamList || bullets.length === 0) return;

        // Animate team items on scroll
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.classList.add('animate');
                    }, index * 100);
                }
            });
        }, {
            threshold: 0.2
        });

        teamItems.forEach(item => {
            observer.observe(item);
        });

        // Bullet navigation
        let currentIndex = 0;
        const itemsPerView = Math.floor(teamList.offsetWidth / 400) || 1;

        function updateBullets() {
            bullets.forEach((bullet, index) => {
                bullet.classList.toggle('active', index === currentIndex);
            });
        }

        function scrollToIndex(index) {
            if (teamItems[index]) {
                teamItems[index].scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest',
                    inline: 'start'
                });
                currentIndex = index;
                updateBullets();
            }
        }

        bullets.forEach((bullet, index) => {
            bullet.addEventListener('click', () => {
                scrollToIndex(index);
            });
        });

        // Update bullets on scroll
        let scrollTimeout;
        teamList.addEventListener('scroll', () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                const scrollLeft = teamList.scrollLeft;
                const itemWidth = teamItems[0]?.offsetWidth || 400;
                const gap = 32;
                const newIndex = Math.round(scrollLeft / (itemWidth + gap));
                if (newIndex !== currentIndex && newIndex < bullets.length) {
                    currentIndex = newIndex;
                    updateBullets();
                }
            }, 100);
        });

        // Initialize
        updateBullets();
    }

    // Video animations
    function initVideoAnimations() {
        const videoContainer = document.querySelector('.about-info-img-ctn');
        if (!videoContainer) return;

        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.3
        });

        observer.observe(videoContainer);
    }

    // Footer animations
    function initFooterAnimations() {
        const footer = document.querySelector('#main-footer');
        if (!footer) return;

        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const blocks = entry.target.querySelectorAll('.footer-block');
                    blocks.forEach((block, index) => {
                        setTimeout(() => {
                            block.classList.add('animate');
                        }, index * 100);
                    });
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.2
        });

        observer.observe(footer);
    }

    // Back to top functionality
    function initBackToTop() {
        const backToTop = document.querySelector('.footer-back-to-top');
        if (!backToTop) return;

        backToTop.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#' || href === '') return;
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });


})();

