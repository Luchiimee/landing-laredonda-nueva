document.addEventListener('DOMContentLoaded', () => {

    // =======================================
    // LÓGICA DEL POP-UP (MODAL)
    // =======================================
    const modal = document.getElementById('modal-plataforma');
    const btnRegistro = document.getElementById('btn-plataforma-reg');
    const btnFooter = document.getElementById('btn-plataforma-footer');
    const spanCerrar = document.getElementById('cerrar-modal');

    function abrirModal() {
        if (modal) {
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        }
    }

    function cerrarModal() {
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = '';
        }
    }

    if (btnRegistro) btnRegistro.addEventListener('click', abrirModal);
    if (btnFooter) btnFooter.addEventListener('click', (e) => {
        e.preventDefault();
        abrirModal();
    });
    if (spanCerrar) spanCerrar.addEventListener('click', cerrarModal);
    if (modal) {
        window.addEventListener('click', (event) => {
            if (event.target === modal) cerrarModal();
        });
    }

    // =======================================
    // HEADER QUE SE OCULTA AL SCROLLEAR
    // =======================================
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

    // =======================================
    // LÓGICA DE LAS TARJETAS (SECCIÓN PAGOS)
    // =======================================
    const cards = document.querySelectorAll('.card');
    const cardStackContainer = document.querySelector('.card-stack-container');
    const cardHeight = 700;
    let activeCardIndex = 0;

    // Solo aplicar animación si es escritorio
    if (window.innerWidth > 768 && cardStackContainer && cards.length > 0) {

        const cardRealHeight = cards[0].offsetHeight;
        const spacing = 200;
        cardStackContainer.style.height = `${cards.length * (cardRealHeight + spacing)}px`;

        // Mostrar la primera card
        cards[0].style.opacity = '1';
        cards[0].style.transform = 'translateY(0)';
        cards[0].style.zIndex = '2';

        function updateActiveCard() {
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

        window.addEventListener('scroll', () => {
            requestAnimationFrame(updateActiveCard);
        });

    } else if (window.innerWidth <= 768 && cards.length > 0 && cardStackContainer) {
        // Vista móvil → mostrar todas las cards visibles, sin animación
        cards.forEach(card => {
            card.style.opacity = '1';
            card.style.transform = 'none';
            card.style.transition = 'none';
            card.style.position = 'relative';
            card.style.zIndex = '1';
        });
        cardStackContainer.style.height = 'auto';
    }

    // =======================================
    // MENÚ HAMBURGUESA
    // =======================================
    const menuToggle = document.getElementById("menu-toggle");
    const navLinks = document.querySelector(".nav-links");

    if (menuToggle && navLinks) {
        menuToggle.addEventListener("click", () => {
            navLinks.classList.toggle("active");
        });
    }

    // =======================================
    // ACORDEÓN (FAQ)
    // =======================================
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

    // =======================================
    // CARRUSEL DE TESTIMONIOS
    // =======================================
    const carouselTestimonio = document.querySelector(".carousel-testimonio");

    if (carouselTestimonio) {
        carouselTestimonio.innerHTML += carouselTestimonio.innerHTML;
        let pos1 = 0, speed1 = 0.6, paused1 = false;
        let resetLimit = carouselTestimonio.scrollWidth / 2;

        function moveTestimonios() {
            if (!paused1) {
                pos1 -= speed1;
                if (Math.abs(pos1) >= resetLimit) pos1 = 0;
                carouselTestimonio.style.transform = `translateX(${pos1}px)`;
            }
            requestAnimationFrame(moveTestimonios);
        }

        carouselTestimonio.addEventListener("mouseenter", () => (paused1 = true));
        carouselTestimonio.addEventListener("mouseleave", () => (paused1 = false));
        window.addEventListener('resize', () => {
            resetLimit = carouselTestimonio.scrollWidth / 2;
        });

        moveTestimonios();
    }

    // =======================================
    // CARRUSEL DE IMÁGENES (section-info)
    // =======================================
    const carouselTrack = document.querySelector(".carousel-track");

    if (carouselTrack && window.innerWidth > 768) {
        carouselTrack.innerHTML += carouselTrack.innerHTML;
        let pos2 = 0, speed2 = 0.6, paused2 = false;

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

    // =======================================
    // HEADER SCROLL
    // =======================================
    window.addEventListener('scroll', () => {
        requestAnimationFrame(hideOnScroll);
    });
});


// =======================================
// EFECTO EN LOS MARCOS DE VIDEO
// =======================================
document.querySelectorAll('.marco-video').forEach(marco => {
    marco.addEventListener('click', () => {
        if (marco.classList.contains('mostrar-texto')) return;
        marco.classList.add('mostrar-texto');
        setTimeout(() => marco.classList.remove('mostrar-texto'), 2500);
    });
});
