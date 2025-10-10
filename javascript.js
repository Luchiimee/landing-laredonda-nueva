document.addEventListener('DOMContentLoaded', () => {
    // --- Lógica del Header que se Oculta ---
    let lastScrollY = window.scrollY;
    const header = document.querySelector('header');

    function hideOnScroll() {
        const currentScrollY = window.scrollY;

        if (currentScrollY > lastScrollY && currentScrollY > header.offsetHeight) {
            header.classList.add('header-hidden');
        } else {
            header.classList.remove('header-hidden');
        }

        lastScrollY = currentScrollY;
    }

    // --- Lógica de las Tarjetas Apilables (Sección de Pagos) ---
    const cards = document.querySelectorAll('.card');
    const cardStackContainer = document.querySelector('.card-stack-container');
    const cardHeight = 1000;

    if (cardStackContainer) {
        cardStackContainer.style.height = `${cards.length * cardHeight}px`;
    }

    let activeCardIndex = 0;

    function updateActiveCard() {
        if (!cardStackContainer || cards.length === 0) return;

        const viewportHeight = window.innerHeight;
        const containerTop = cardStackContainer.getBoundingClientRect().top;

        let newIndex = Math.floor((-containerTop + viewportHeight / 2) / cardHeight);
        newIndex = Math.max(0, Math.min(cards.length - 1, newIndex));

        if (newIndex === activeCardIndex) return;

        const currentCard = cards[activeCardIndex];
        currentCard.style.opacity = '0';
        currentCard.style.transform = 'translateY(50px)';
        currentCard.style.zIndex = '1';

        const newCard = cards[newIndex];
        newCard.style.opacity = '1';
        newCard.style.transform = 'translateY(0)';
        newCard.style.zIndex = '2';

        activeCardIndex = newIndex;
    }

    if (cards.length > 0) {
        cards[0].style.opacity = '1';
        cards[0].style.transform = 'translateY(0)';
        cards[0].style.zIndex = '2';
    }

    // ===============================================
    // --- Lógica del Carrusel Infinito Suave (Testimonios) ---
    // ===============================================
    const carouselTrack = document.querySelector('.carousel-testimonio');

    if (carouselTrack) {
        const items = Array.from(carouselTrack.children);
        let scrollSpeed = 0.4; // 🔹 Ajustá la velocidad a gusto
        let position = 0;

        // Clonamos dinámicamente las tarjetas para permitir el bucle infinito
        items.forEach(item => {
            const clone = item.cloneNode(true);
            carouselTrack.appendChild(clone);
        });

        // Aplicamos transición suave al movimiento
        carouselTrack.style.transition = "transform 0.05s linear";

        function animateCarousel() {
            position -= scrollSpeed;
            const firstCard = carouselTrack.children[0];
            const cardWidth = firstCard.offsetWidth + 25; // ancho + gap

            // Si la primera card sale completamente de la vista
            if (Math.abs(position) >= cardWidth) {
                // Quitamos transición temporalmente
                carouselTrack.style.transition = "none";

                // Movemos la primera card al final
                carouselTrack.appendChild(carouselTrack.children[0]);

                // Reajustamos la posición sin salto
                position += cardWidth;
                carouselTrack.style.transform = `translateX(${position}px)`;

                // Forzamos reflow (reinicia el render para suavizar)
                void carouselTrack.offsetWidth;

                // Reactivamos transición
                carouselTrack.style.transition = "transform 0.05s linear";
            }

            // Aplicamos la posición actual
            carouselTrack.style.transform = `translateX(${position}px)`;

            requestAnimationFrame(animateCarousel);
        }

        animateCarousel();

        // (Opcional) Pausa al pasar el mouse sobre el carrusel
        carouselTrack.addEventListener("mouseenter", () => {
            scrollSpeed = 0;
        });
        carouselTrack.addEventListener("mouseleave", () => {
            scrollSpeed = 0.4;
        });
    }

    // ===============================================

    // --- Lógica del Menú Hamburguesa ---
    const menuToggle = document.getElementById("menu-toggle");
    const navLinks = document.querySelector(".nav-links");

    if (menuToggle && navLinks) {
        menuToggle.addEventListener("click", () => {
            navLinks.classList.toggle("active");
        });
    }

    // --- Lógica del Acordeón (FAQ) ---
    const acordeonHeaders = document.querySelectorAll('.acordeon-header');

    const primerItem = document.querySelector('.acordeon-item.abierta');
    if (primerItem) {
        const content = primerItem.querySelector('.acordeon-contenido');
        content.style.maxHeight = content.scrollHeight + "px";
        primerItem.querySelector('.acordeon-header').setAttribute('aria-expanded', 'true');
    }

    acordeonHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const item = header.closest('.acordeon-item');
            const content = item.querySelector('.acordeon-contenido');
            const isAbierto = item.classList.contains('abierta');

            document.querySelectorAll('.acordeon-item').forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('abierta')) {
                    otherItem.classList.remove('abierta');
                    otherItem.querySelector('.acordeon-contenido').style.maxHeight = 0;
                    otherItem.querySelector('.acordeon-header').setAttribute('aria-expanded', 'false');
                }
            });

            if (isAbierto) {
                item.classList.remove('abierta');
                content.style.maxHeight = 0;
                header.setAttribute('aria-expanded', 'false');
            } else {
                item.classList.add('abierta');
                content.style.maxHeight = content.scrollHeight + "px";
                header.setAttribute('aria-expanded', 'true');
            }
        });
    });

    // --- Scroll optimizado ---
    let isScrolling = false;
    window.addEventListener('scroll', () => {
        requestAnimationFrame(hideOnScroll);

        if (!isScrolling) {
            window.requestAnimationFrame(() => {
                updateActiveCard();
                isScrolling = false;
            });
        }
        isScrolling = true;
    });
});
