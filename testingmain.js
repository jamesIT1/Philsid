document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    // Carousel
    const carouselContainer = document.querySelector('.carousel-container');
    if (carouselContainer) {
        const slides = document.getElementById('slides');
        const totalSlides = slides.children.length;
        let slideWidth = carouselContainer.clientWidth;
        let currentIndex = 0;

        function updateSlidePosition() {
            // Recalculate width on each update for responsiveness
            slideWidth = carouselContainer.clientWidth;
            slides.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
            slides.style.width = `${slideWidth * totalSlides}px`;
            Array.from(slides.children).forEach(slide => {
                slide.style.width = `${slideWidth}px`;
            });
        }

        function nextSlide() {
            currentIndex = (currentIndex + 1) % totalSlides;
            updateSlidePosition();
        }

        let autoSlideInterval = setInterval(nextSlide, 3000);

        carouselContainer.addEventListener('mouseenter', () => clearInterval(autoSlideInterval));
        carouselContainer.addEventListener('mouseleave', () => {
            autoSlideInterval = setInterval(nextSlide, 3000);
        });

        window.addEventListener('resize', updateSlidePosition);
        
        // Initial setup
        updateSlidePosition();
    }

    // "Contact Us" links scroll to form
    const contactLinks = Array.from(document.querySelectorAll('a, button'))
        .filter(el => el.textContent.trim().toLowerCase() === 'contact us');
    const contactForm = document.getElementById('contactForm');

    if (contactForm && contactLinks.length > 0) {
        contactLinks.forEach(link => {
            link.addEventListener('click', function(event) {
                event.preventDefault();
                contactForm.scrollIntoView({ behavior: 'smooth' });
            });
        });
    }

    // Search Bar Toggle
    const searchToggle = document.querySelector('.search-toggle');
    const searchBar = document.getElementById('searchBar');

    if (searchToggle && searchBar) {
        searchToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            const isHidden = searchBar.style.display === 'none' || searchBar.style.display === '';
            searchBar.style.display = isHidden ? 'flex' : 'none';
            if (isHidden) {
                searchBar.querySelector('input').focus();
            }
        });
        
        document.addEventListener('click', (e) => {
            if (!searchBar.contains(e.target) && e.target !== searchToggle && !searchToggle.contains(e.target)) {
                searchBar.style.display = 'none';
            }
        });
    }

    // Scroll-to-top button
    const scrollTopBtn = document.getElementById('scrollTopBtn');
    if (scrollTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                scrollTopBtn.classList.add('show');
            } else {
                scrollTopBtn.classList.remove('show');
            }
        });

        scrollTopBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // Simple search functionality
    const searchBtn = document.querySelector('.search-btn');
    const searchInput = document.querySelector('.search-input');
    if (searchBtn && searchInput) {
        const performSearch = () => {
            const query = searchInput.value.trim();
            if (query) {
                alert(`This is a demo search.\nYou searched for: "${query}"\nA real website would redirect to a search results page.`);
                searchInput.value = '';
                searchBar.style.display = 'none';
            }
        };
        searchBtn.addEventListener('click', performSearch);
        searchInput.addEventListener('keyup', (event) => {
            if (event.key === 'Enter') {
                performSearch();
            }
        });
    }
});
