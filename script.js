document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const links = document.querySelectorAll('.nav-links li');

    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');

        // Hamburger animation
        hamburger.classList.toggle('toggle');
    });

    // Close menu when clicking a link
    links.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
        });
    });

    // Scroll Animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    const fadeElements = document.querySelectorAll('.fade-in');
    fadeElements.forEach(el => {
        observer.observe(el);
    });

    // FAQ Accordion
    const faqQuestions = document.querySelectorAll('.faq-question');

    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const item = question.parentElement;

            // Close other items
            document.querySelectorAll('.faq-item').forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });

            item.classList.toggle('active');
        });
    });

    // Modal Logic
    const modal = document.getElementById('product-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalDetails = document.getElementById('modal-details');
    const closeBtn = document.querySelector('.close-modal');
    const openModalBtns = document.querySelectorAll('.open-modal');

    // Carousel Elements
    const carouselTrack = document.getElementById('carousel-track');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const carouselDots = document.getElementById('carousel-dots');

    let currentSlide = 0;
    let totalSlides = 0;

    function updateCarousel() {
        carouselTrack.style.transform = `translateX(-${currentSlide * 100}%)`;

        // Update dots
        const dots = document.querySelectorAll('.dot');
        dots.forEach((dot, index) => {
            if (index === currentSlide) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % totalSlides;
        updateCarousel();
    }

    function prevSlide() {
        currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
        updateCarousel();
    }

    function openModal(card) {
        const title = card.getAttribute('data-title');
        // Get images from data-images attribute (JSON array) or fallback to single data-image
        let images = [];
        const dataImages = card.getAttribute('data-images');
        if (dataImages) {
            try {
                images = JSON.parse(dataImages);
            } catch (e) {
                console.error("Error parsing data-images", e);
                images = [card.getAttribute('data-image')];
            }
        } else {
            images = [card.getAttribute('data-image')];
        }

        const detailsHtml = card.querySelector('.product-details').innerHTML;

        modalTitle.textContent = title;
        modalDetails.innerHTML = detailsHtml;

        // Setup Carousel
        carouselTrack.innerHTML = '';
        carouselDots.innerHTML = '';
        currentSlide = 0;
        totalSlides = images.length;

        images.forEach((imgSrc, index) => {
            // Create Slide
            const slide = document.createElement('div');
            slide.classList.add('carousel-slide');
            const img = document.createElement('img');
            img.src = imgSrc;
            img.alt = `${title} - Imagen ${index + 1}`;
            slide.appendChild(img);
            carouselTrack.appendChild(slide);

            // Create Dot
            const dot = document.createElement('div');
            dot.classList.add('dot');
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => {
                currentSlide = index;
                updateCarousel();
            });
            carouselDots.appendChild(dot);
        });

        // Show/Hide buttons if only 1 image
        if (totalSlides <= 1) {
            prevBtn.style.display = 'none';
            nextBtn.style.display = 'none';
            carouselDots.style.display = 'none';
        } else {
            prevBtn.style.display = 'flex';
            nextBtn.style.display = 'flex';
            carouselDots.style.display = 'flex';
        }

        updateCarousel(); // Reset position

        modal.classList.add('show');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }

    function closeModal() {
        modal.classList.remove('show');
        document.body.style.overflow = ''; // Restore scrolling
    }

    openModalBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent bubbling if card has listener too
            const card = btn.closest('.product-card');
            openModal(card);
        });
    });

    // Optional: Open modal when clicking the card image as well
    document.querySelectorAll('.card-image').forEach(imgContainer => {
        imgContainer.addEventListener('click', () => {
            const card = imgContainer.closest('.product-card');
            openModal(card);
        });
    });

    closeBtn.addEventListener('click', closeModal);

    prevBtn.addEventListener('click', prevSlide);
    nextBtn.addEventListener('click', nextSlide);

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('show')) {
            closeModal();
        }
        if (modal.classList.contains('show')) {
            if (e.key === 'ArrowLeft') prevSlide();
            if (e.key === 'ArrowRight') nextSlide();
        }
    });
});
