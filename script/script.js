// Service Worker regisztrálása a teljesítmény javításához
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('SW registered: ', registration);
            })
            .catch(function(registrationError) {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

document.addEventListener('DOMContentLoaded', function () {
    const header = document.querySelector('header');
    const desktopLinks = document.querySelectorAll('header .container .header-flex ul li a');
    const sections = document.querySelectorAll('section');
    const mobilePanel = document.querySelector('.mobile-panel');
    const mobileToggle = document.querySelector('.header-mobile i.fa-bars');
    const mobileLinks = document.querySelectorAll('.mobile-panel ul li a');
    const offset = 0;

    const handleScroll = () => {
        if (window.scrollY > 0) {
            header.classList.add('sticky');
        } else {
            header.classList.remove('sticky');
        }

        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };

    window.addEventListener('scroll', handleScroll);

    const scrollToSection = (targetId) => {
        if (targetId === '') {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        } else {
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                window.scrollTo({
                    top: targetSection.offsetTop - header.offsetHeight - offset,
                    behavior: 'smooth'
                });
            }
        }
    };

    const setActiveLink = (targetId) => {
        desktopLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href').substring(1) === targetId);
        });
        mobileLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href').substring(1) === targetId);
        });
    };

    desktopLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            scrollToSection(targetId);
            setTimeout(() => {
                setActiveLink(targetId);
            }, 500); 
        });
    });

    mobileLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            scrollToSection(targetId);
            setTimeout(() => {
                setActiveLink(targetId);
            }, 500); 
            mobilePanel.classList.remove('dropdown');
        });
    });

    const observerOptions = {
        root: null,
        rootMargin: `-${header.offsetHeight + offset}px 0px 0px 0px`,
        threshold: 0.6
    };

    const observerCallback = (entries) => {
        entries.forEach(entry => {
            const sectionId = entry.target.id;
            const desktopLink = document.querySelector(`header .container .header-flex ul li a[href="#${sectionId}"]`);
            const mobileLink = document.querySelector(`.mobile-panel ul li a[href="#${sectionId}"]`);
            if (entry.isIntersecting) {
                if (desktopLink) {
                    desktopLinks.forEach(l => l.classList.remove('active'));
                    desktopLink.classList.add('active');
                }
                if (mobileLink) {
                    mobileLinks.forEach(l => l.classList.remove('active'));
                    mobileLink.classList.add('active');
                }
            }
        });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    sections.forEach(section => {
        observer.observe(section);
    });

    mobileToggle.addEventListener('click', function () {
        mobilePanel.classList.toggle('dropdown');
    });

    mobileLinks.forEach(link => {
        link.addEventListener('click', function () {
            mobileLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });

    const scrollUp = () => {
        const scrollUp = document.getElementById('scroll-up');
        window.scrollY >= 350 ? scrollUp.classList.add('show-scroll')
            : scrollUp.classList.remove('show-scroll');
    }
    window.addEventListener('scroll', scrollUp);

    const accordions = document.querySelectorAll('.accordion');

    accordions.forEach(accordion => {
        accordion.addEventListener('click', function () {
            const description = this.querySelector('.description');
            const icon = this.querySelector('i');

            if (description && icon) {
                if (description.classList.contains('show')) {
                    description.classList.remove('show');
                    icon.classList.remove('fa-minus');
                    icon.classList.add('fa-plus');
                } else {
                    description.classList.add('show');
                    icon.classList.remove('fa-plus');
                    icon.classList.add('fa-minus');
                }
            }

            accordions.forEach(a => {
                if (a !== accordion) {
                    const otherDescription = a.querySelector('.description');
                    const otherIcon = a.querySelector('i');

                    if (otherDescription && otherIcon) {
                        otherDescription.classList.remove('show');
                        otherIcon.classList.remove('fa-minus');
                        otherIcon.classList.add('fa-plus');
                    }
                }
            });
        });
    });

    let currentlyExpandedBlog = null; // Track the currently expanded blog globally

    document.querySelectorAll('.blog').forEach(function(blog) {
        blog.addEventListener('click', function() {
            // If there's a currently expanded blog and it's not the one just clicked, reset it
            if (currentlyExpandedBlog && currentlyExpandedBlog !== blog) {
                currentlyExpandedBlog.style.width = '22em';
                currentlyExpandedBlog.style.height = '30em';
                currentlyExpandedBlog.style.backgroundSize = '22em 30em';
                // No need to set clickedBlog to false, as we're tracking the expanded blog globally
            }
    
            // If the clicked blog is already expanded, shrink it
            if (currentlyExpandedBlog === blog) {
                blog.style.width = '22em';
                blog.style.height = '30em';
                blog.style.backgroundSize = '22em 30em';
                currentlyExpandedBlog = null; // Reset the tracker as no blog is expanded
            } else {
                // Expand the clicked blog
                blog.style.width = '50em';
                blog.style.height = '35em';
                blog.style.backgroundSize = '52em 37em';
                currentlyExpandedBlog = blog; // Update the tracker to the newly expanded blog
            }
        });
    });
});
