document.addEventListener('DOMContentLoaded', () => {
    // Animate-on-scroll functionality
    const productCards = document.querySelectorAll('.product-card');

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add a staggered delay for each card
                const delay = entry.target.dataset.index * 100; // 100ms delay per card
                setTimeout(() => {
                    entry.target.classList.add('is-visible');
                }, delay);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    productCards.forEach((card, index) => {
        card.dataset.index = index; // Add index for staggering
        observer.observe(card);
    });

    // Modal functionality
    const modal = document.getElementById('productModal');
    const closeModal = document.querySelector('.close-modal-btn');

    if (modal && closeModal) {
        const modalImage = document.getElementById('modalImage');
        const modalTitle = document.getElementById('modalTitle');
        const modalDescription = document.getElementById('modalDescription');
        const modalPrice = document.getElementById('modalPrice');

        document.querySelectorAll('.quick-view').forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const card = e.target.closest('.product-card');
                
                modalTitle.textContent = card.querySelector('.product-title').textContent;
                modalDescription.textContent = card.querySelector('.product-description').textContent;
                modalPrice.textContent = card.querySelector('.product-price').textContent;
                modalImage.src = card.querySelector('.product-image').src;
                
                modal.style.display = 'flex';
                setTimeout(() => modal.classList.add('visible'), 10);
            });
        });

        const hideModal = () => {
            modal.classList.remove('visible');
            setTimeout(() => modal.style.display = 'none', 300);
        };

        closeModal.addEventListener('click', hideModal);

        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                hideModal();
            }
        });
        
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('visible')) {
                hideModal();
            }
        });
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

    // --- Google Sheet Form Submission ---
    const googleForm = document.getElementById('contact-google-form');
    
    if (googleForm) {
        const statusDiv = document.getElementById('form-status');

        googleForm.addEventListener('submit', e => {
            e.preventDefault();
            
            const submitBtn = googleForm.querySelector('.submit-btn');
            submitBtn.disabled = true;
            submitBtn.textContent = 'Submitting...';

            // --- IMPORTANT ---
            // PASTE YOUR GOOGLE APPS SCRIPT WEB APP URL HERE
            const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycby1BVIKVz1sXHY99CoFCMvlYlgGJgz-bON5jiiiupGSWbYbbhwJukok1IRfWCgGNVKJ/exec';

            fetch(GOOGLE_SCRIPT_URL, {
                method: 'POST',
                body: new FormData(googleForm)
            })
            .then(response => response.json())
            .then(data => {
                if (data.result === 'success') {
                    statusDiv.textContent = 'Thank you! Your message has been sent successfully.';
                    statusDiv.className = 'success';
                    googleForm.reset();
                } else {
                    throw new Error(data.message || 'An unknown error occurred.');
                }
            })
            .catch(error => {
                statusDiv.textContent = `An error occurred: ${error.message}`;
                statusDiv.className = 'error';
            })
            .finally(() => {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Submit';
                setTimeout(() => {
                    statusDiv.style.display = 'none';
                    statusDiv.className = '';
                }, 6000);
            });
        });
    }

    // Scroll-to-top functionality
    const scrollBtn = document.getElementById('scrollTopBtn');

    if (scrollBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                scrollBtn.classList.add('show');
            } else {
                scrollBtn.classList.remove('show');
            }
        });

        scrollBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Search functionality with highlighting & smooth scroll
    const searchBtn = document.querySelector('.search-btn');
    const searchInput = document.querySelector('.search-input');

    if (searchBtn && searchInput) {
        const searchArea = document.querySelector('main') || document.body;

        function removeSearchHighlights() {
            const marks = searchArea.querySelectorAll('mark');
            marks.forEach(mark => {
                mark.replaceWith(mark.textContent);
            });
            searchArea.normalize();
        }

        const performSearch = () => {
            const query = searchInput.value.trim();
            removeSearchHighlights();

            if (!query) {
                searchInput.blur();
                return;
            }

            const regex = new RegExp(query, 'gi');
            let firstMatch = null;

            const treeWalker = document.createTreeWalker(searchArea, NodeFilter.SHOW_TEXT, {
                acceptNode(node) {
                    if (node.parentElement.closest('script, style, .search-bar-container')) {
                        return NodeFilter.FILTER_REJECT;
                    }
                    if (regex.test(node.nodeValue)) {
                        regex.lastIndex = 0;
                        return NodeFilter.FILTER_ACCEPT;
                    }
                    return NodeFilter.FILTER_REJECT;
                }
            });

            const nodesToHighlight = [];
            while (treeWalker.nextNode()) {
                nodesToHighlight.push(treeWalker.currentNode);
            }

            nodesToHighlight.forEach(node => {
                const parent = node.parentNode;
                const parts = node.nodeValue.split(regex);
                const matches = node.nodeValue.match(regex);

                if (matches) {
                    const fragment = document.createDocumentFragment();
                    parts.forEach((part, index) => {
                        fragment.appendChild(document.createTextNode(part));
                        if (index < matches.length) {
                            const mark = document.createElement('mark');
                            mark.textContent = matches[index];
                            fragment.appendChild(mark);
                            if (!firstMatch) {
                                firstMatch = mark;
                            }
                        }
                    });
                    parent.replaceChild(fragment, node);
                }
            });

            if (firstMatch) {
                setTimeout(() => {
                    const headerOffset = 70;
                    const elementPosition = firstMatch.getBoundingClientRect().top;
                    const pageYOffset = window.pageYOffset;
                    const offsetPosition = elementPosition + pageYOffset - headerOffset - 20;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: "smooth"
                    });
                }, 50);
            } else {
                alert(`The text "${query}" was not found on this page.`);
            }
            searchInput.blur();
        };

        searchBtn.addEventListener('click', e => {
            e.preventDefault();
            performSearch();
        });

        searchInput.addEventListener('keyup', (event) => {
            if (event.key === 'Enter') {
                event.preventDefault();
                performSearch();
            }
            if (searchInput.value.trim() === '') {
                removeSearchHighlights();
            }
        });
    }
});