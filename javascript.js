document.addEventListener('DOMContentLoaded', () => {
    // --- Lógica del Header ---
    let lastScrollY = window.scrollY;
    const header = document.querySelector('header');

    function hideOnScroll() {
        const currentScrollY = window.scrollY;

        // Comprueba si el usuario está scrolleando hacia abajo
        if (currentScrollY > lastScrollY && currentScrollY > header.offsetHeight) {
            header.classList.add('header-hidden');
        } else {
            header.classList.remove('header-hidden');
        }

        lastScrollY = currentScrollY;
    }

    // --- Lógica de las Tarjetas (Sección de Pagos) ---
    const cards = document.querySelectorAll('.card');
    const cardStackContainer = document.querySelector('.card-stack-container');

    // 🔹 Configuración de la altura del contenedor
    const cardHeight = 1000;
    if (cardStackContainer) {
        cardStackContainer.style.height = `${cards.length * cardHeight}px`;
    }

    let activeCardIndex = 0;

    // 🔹 Función para actualizar la tarjeta activa
    function updateActiveCard() {
        if (!cardStackContainer || cards.length === 0) return;

        const viewportHeight = window.innerHeight;
        const containerTop = cardStackContainer.getBoundingClientRect().top;

        // Calcula en qué tarjeta debería estar la vista actualmente
        let newIndex = Math.floor((-containerTop + viewportHeight / 2) / cardHeight);
        newIndex = Math.max(0, Math.min(cards.length - 1, newIndex));

        // Evita actualizaciones innecesarias
        if (newIndex === activeCardIndex) {
            return;
        }

        // 🔹 Anima la tarjeta actual para que desaparezca
        const currentCard = cards[activeCardIndex];
        currentCard.style.opacity = '0';
        currentCard.style.transform = 'translateY(50px)';
        currentCard.style.zIndex = '1';

        // 🔹 Anima la nueva tarjeta para que aparezca
        const newCard = cards[newIndex];
        newCard.style.opacity = '1';
        newCard.style.transform = 'translateY(0)';
        newCard.style.zIndex = '2';

        activeCardIndex = newIndex;
    }

    // 🔹 Inicializa la vista en la primera tarjeta
    if (cards.length > 0) {
        cards[0].style.opacity = '1';
        cards[0].style.transform = 'translateY(0)';
        cards[0].style.zIndex = '2';
    }

    // --- Lógica del Carrusel (Sección Info) ---
    const carouselTrack = document.querySelector('.carousel-track');

    if (carouselTrack) {
        const images = Array.from(carouselTrack.children);
        // Duplica las imágenes para el efecto de carrusel infinito
        images.forEach(img => {
            const clone = img.cloneNode(true);
            carouselTrack.appendChild(clone);
        });
    }

    // --- Lógica del Menú Hamburguesa ---
    const menuToggle = document.getElementById("menu-toggle");
    const navLinks = document.querySelector(".nav-links");

    if (menuToggle && navLinks) {
        menuToggle.addEventListener("click", () => {
            navLinks.classList.toggle("active");
        });
    }

    // 🔹 Un solo oyente de eventos para optimizar
    let isScrolling = false;
    window.addEventListener('scroll', () => {
        // Lógica del header
        requestAnimationFrame(hideOnScroll);

        // Lógica de las tarjetas (scroll-snap)
        if (!isScrolling) {
            window.requestAnimationFrame(() => {
                updateActiveCard();
                isScrolling = false;
            });
        }
        isScrolling = true;
    });
});
