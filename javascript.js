document.addEventListener('DOMContentLoaded', () => {
    // --- Lógica del Header que se Oculta ---
    let lastScrollY = window.scrollY;
    const header = document.querySelector('header');

    function hideOnScroll() {
        const currentScrollY = window.scrollY;

        // Oculta el header si se hace scroll hacia abajo, una vez pasada la altura del header
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

    // 🔹 Configuración de la altura del contenedor
    const cardHeight = 1000;
    if (cardStackContainer) {
        // Establece una altura grande para permitir el scroll y la animación de 'stack'
        cardStackContainer.style.height = `${cards.length * cardHeight}px`;
    }

    let activeCardIndex = 0;

    // 🔹 Función para actualizar la tarjeta activa (la que se muestra)
    function updateActiveCard() {
        if (!cardStackContainer || cards.length === 0) return;

        const viewportHeight = window.innerHeight;
        const containerTop = cardStackContainer.getBoundingClientRect().top;

        // Calcula en qué índice de tarjeta debería estar la vista
        let newIndex = Math.floor((-containerTop + viewportHeight / 2) / cardHeight);
        newIndex = Math.max(0, Math.min(cards.length - 1, newIndex));

        // Evita animaciones innecesarias
        if (newIndex === activeCardIndex) {
            return;
        }

        // Anima la tarjeta actual para que desaparezca (opacidad y movimiento)
        const currentCard = cards[activeCardIndex];
        currentCard.style.opacity = '0';
        currentCard.style.transform = 'translateY(50px)';
        currentCard.style.zIndex = '1';

        // Anima la nueva tarjeta para que aparezca
        const newCard = cards[newIndex];
        newCard.style.opacity = '1';
        newCard.style.transform = 'translateY(0)';
        newCard.style.zIndex = '2';

        activeCardIndex = newIndex;
    }

    // 🔹 Inicializa la vista en la primera tarjeta al cargar
    if (cards.length > 0) {
        cards[0].style.opacity = '1';
        cards[0].style.transform = 'translateY(0)';
        cards[0].style.zIndex = '2';
    }


    // ===============================================
    // --- Lógica del Carrusel (Testimonios) ---
    // (Prepara las tarjetas para la animación continua por CSS)
    // ===============================================
    const carouselTrack = document.querySelector('.carousel-track');

    if (carouselTrack) {
        // Aseguramos que solo clonamos las tarjetas de testimonio
        const itemsToClone = Array.from(carouselTrack.querySelectorAll('.testimonio-card'));
        
        // 🔑 CLAVE: Clona y añade las tarjetas al final del track (duplica el contenido).
        // Esto crea el doble de contenido necesario para el efecto de bucle sin fin.
        itemsToClone.forEach(item => {
            const clone = item.cloneNode(true);
            carouselTrack.appendChild(clone);
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

    // ===================================
    // --- Lógica del Acordeón (FAQ) ---
    // ===================================
    const acordeonHeaders = document.querySelectorAll('.acordeon-header');

    // Inicializar la primera pregunta si tiene la clase 'abierta'
    const primerItem = document.querySelector('.acordeon-item.abierta');
    if (primerItem) {
        const content = primerItem.querySelector('.acordeon-contenido');
        // Asegura que la altura sea correcta al cargar
        content.style.maxHeight = content.scrollHeight + "px";
        primerItem.querySelector('.acordeon-header').setAttribute('aria-expanded', 'true');
    }

    acordeonHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const item = header.closest('.acordeon-item');
            const content = item.querySelector('.acordeon-contenido');
            
            // Verifica si el item ya está abierto
            const isAbierto = item.classList.contains('abierta');

            // Cierra todos los otros items (comportamiento de acordeón)
            document.querySelectorAll('.acordeon-item').forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('abierta')) {
                    otherItem.classList.remove('abierta');
                    otherItem.querySelector('.acordeon-contenido').style.maxHeight = 0;
                    otherItem.querySelector('.acordeon-header').setAttribute('aria-expanded', 'false');
                }
            });

            // Abre o cierra el item actual
            if (isAbierto) {
                // Cerrar
                item.classList.remove('abierta');
                content.style.maxHeight = 0;
                header.setAttribute('aria-expanded', 'false');
            } else {
                // Abrir
                item.classList.add('abierta');
                // Usa scrollHeight para que la transición de max-height funcione suavemente
                content.style.maxHeight = content.scrollHeight + "px";
                header.setAttribute('aria-expanded', 'true');
            }
        });
    });
    // ===================================


    // 🔹 Un solo oyente de eventos para optimizar el scroll
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