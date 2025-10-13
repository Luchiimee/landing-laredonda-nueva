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

   /* =======================================
   CARRUSEL DE TESTIMONIOS (igual al carousel-track)
======================================= */
const carouselTestimonio = document.querySelector(".carousel-testimonio");

if (carouselTestimonio) {
    // Duplicamos el contenido una sola vez
    const originalContent = carouselTestimonio.innerHTML;
    carouselTestimonio.innerHTML = originalContent + originalContent;

    let pos1 = 0;
    const speed1 = 0.6; // velocidad
    let paused1 = false;

    // Ancho de la mitad (la parte visible original)
    let resetLimit = carouselTestimonio.scrollWidth / 2;

    function moveTestimonios() {
        if (!paused1) {
            pos1 -= speed1;

            // Reinicio exacto al terminar el primer bloque
            if (Math.abs(pos1) >= resetLimit) pos1 = 0;

            carouselTestimonio.style.transform = `translateX(${pos1}px)`;
        }
        requestAnimationFrame(moveTestimonios);
    }

    // Pausar en hover
    carouselTestimonio.addEventListener("mouseenter", () => (paused1 = true));
    carouselTestimonio.addEventListener("mouseleave", () => (paused1 = false));

    // Recalcular si cambia el tamaño de pantalla (para que no se desincronice en mobile)
    window.addEventListener('resize', () => {
        resetLimit = carouselTestimonio.scrollWidth / 2;
    });

    moveTestimonios();
}


    /* =======================================
       CARRUSEL DE IMÁGENES (section-info)
       → mismo sistema infinito que testimonios
    ======================================= */
    const carouselTrack = document.querySelector(".carousel-track");

    if (carouselTrack) {
        carouselTrack.innerHTML += carouselTrack.innerHTML;

        let pos2 = 0;
        const speed2 = 0.6;
        let paused2 = false;

        function moveTrack() {
            if (!paused2) {
                pos2 -= speed2;
                if (Math.abs(pos2) >= carouselTrack.scrollWidth / 2) pos2 = 0;
                carouselTrack.style.transform = `translateX(${pos2}px)`;
            }
            requestAnimationFrame(moveTrack);
        }

        carouselTrack.addEventListener("mouseenter", () => (paused2 = true));
        carouselTrack.addEventListener("mouseleave", () => (paused2 = false));

        moveTrack();
    }

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
