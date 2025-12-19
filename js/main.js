/* ============================================================
   MAIN.JS – Funciones principales del sitio
   Proyecto: IWECOTECH – Rediseño Corporativo Premium
   ============================================================ */


/* ============================================================
   1. MENÚ MÓVIL (Cierre automático)
   ============================================================ */
const navToggle = document.querySelector("#nav-toggle");
const navMenuLinks = document.querySelectorAll(".navbar-menu a");

navMenuLinks.forEach(link => {
    link.addEventListener("click", () => {
        if (navToggle.checked) navToggle.checked = false;
    });
});


/* ============================================================
   2. SCROLL SUAVE PREMIUM
   ============================================================ */
document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener("click", e => {
        const target = document.querySelector(link.getAttribute("href"));
        if (target) {
            e.preventDefault();
            window.scrollTo({
                top: target.offsetTop - 80,
                behavior: "smooth"
            });
        }
    });
});


/* ============================================================
   3. CARRUSEL DE CLIENTES (Automático e infinito)
   ============================================================ */
function iniciarCarrusel() {
    const carousel = document.querySelector("[data-carousel]");
    if (!carousel) return;

    const track = carousel.querySelector(".carousel-track");
    const items = [...track.children];

    items.forEach(item => {
        const clone = item.cloneNode(true);
        clone.setAttribute("aria-hidden", "true");
        track.appendChild(clone);
    });

    let velocidad = 0.6;
    let posicion = 0;
    let pausa = false;

    function animar() {
        if (!pausa) {
            posicion -= velocidad;
            track.style.transform = `translateX(${posicion}px)`;
            if (Math.abs(posicion) > track.scrollWidth / 2) posicion = 0;
        }
        requestAnimationFrame(animar);
    }

    animar();

    carousel.addEventListener("mouseenter", () => pausa = true);
    carousel.addEventListener("mouseleave", () => pausa = false);

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => pausa = !entry.isIntersecting);
    }, { threshold: 0.2 });

    observer.observe(carousel);
}


/* ============================================================
   4. ANIMACIONES SUAVES AL HACER SCROLL
   ============================================================ */
const elementosAnimados = document.querySelectorAll(".fade-in");

const observerFade = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";
        }
    });
}, { threshold: 0.2 });

elementosAnimados.forEach(el => observerFade.observe(el));


/* ============================================================
   5. EFECTO HEADER AL HACER SCROLL
   ============================================================ */
const header = document.querySelector(".navbar-wrapper");

window.addEventListener("scroll", () => {
    header.classList.toggle("navbar-scrolled", window.scrollY > 40);
});


/* ============================================================
   6. CONTADOR ANIMADO
   ============================================================ */
function iniciarContadores() {
    const counters = document.querySelectorAll(".count-number");
    if (!counters.length) return;

    const speed = 80;

    const animate = counter => {
        const target = +counter.dataset.target;
        let count = +counter.innerText;
        const step = Math.ceil(target / speed);

        function update() {
            count += step;
            if (count >= target) counter.innerText = target + "+";
            else {
                counter.innerText = count;
                requestAnimationFrame(update);
            }
        }
        update();
    };

    const section = document.querySelector(".count-section");
    if (!section) return;

    const observer = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting) {
            counters.forEach(c => animate(c));
            observer.disconnect();
        }
    }, { threshold: 0.4 });

    observer.observe(section);
}


/* ============================================================
   7. HERO SLIDER MANUAL
   ============================================================ */
const heroItems = document.querySelectorAll(".hero-dual");
const heroIndicators = document.querySelectorAll(".indicator");
let heroIndex = 0;

function showHero(index) {
    heroItems.forEach(el => el.classList.remove("active"));
    heroIndicators.forEach(d => d.classList.remove("active"));
    heroItems[index].classList.add("active");
    heroIndicators[index].classList.add("active");
}

const prevBtn = document.getElementById("hero-prev");
if (prevBtn) prevBtn.addEventListener("click", () => {
    heroIndex = (heroIndex - 1 + heroItems.length) % heroItems.length;
    showHero(heroIndex);
});

const nextBtn = document.getElementById("hero-next");
if (nextBtn) nextBtn.addEventListener("click", () => {
    heroIndex = (heroIndex + 1) % heroItems.length;
    showHero(heroIndex);
});

heroIndicators.forEach(ind => {
    ind.addEventListener("click", () => {
        heroIndex = +ind.dataset.slide;
        showHero(heroIndex);
    });
});


/* ============================================================
   8. TRANSICIÓN ENTRE PÁGINAS
   ============================================================ */
document.addEventListener("DOMContentLoaded", () => {
    let overlay = document.querySelector(".page-overlay");
    if (!overlay) {
        overlay = document.createElement("div");
        overlay.classList.add("page-overlay");
        document.body.appendChild(overlay);
    }

    const body = document.body;
    body.classList.add("page-transition");

    setTimeout(() => body.classList.add("active"), 80);

    document.querySelectorAll("a[href]").forEach(link => {
        link.addEventListener("click", e => {
            const url = link.getAttribute("href");
            if (!url || url.startsWith("#") || url.startsWith("javascript:")) return;

            e.preventDefault();
            overlay.classList.add("active");
            body.classList.add("exit");

            setTimeout(() => window.location.href = url, 420);
        });
    });
});


/* ============================================================
   10. FORMULARIO AJAX
   ============================================================ */
const form = document.getElementById("contactForm");
const msg = document.getElementById("formMessage");

if (form) {
    form.addEventListener("submit", e => {
        e.preventDefault();
        msg.innerText = "Enviando...";

        fetch("send_mail.php", {
            method: "POST",
            body: new FormData(form)
        })
            .then(res => res.text())
            .then(data => {
                msg.innerText = data.includes("OK") ?
                    "¡Mensaje enviado correctamente!" :
                    "Hubo un error al enviar el mensaje.";
                if (data.includes("OK")) form.reset();
            });
    });
}


/* ============================================================
   11. PROTECCIONES (ANTI COPIA)
   ============================================================ */
document.addEventListener("contextmenu", e => e.preventDefault());

document.addEventListener("keyup", (e) => {
    if (e.key === "PrintScreen") {
        navigator.clipboard.writeText("");
        alert("Captura de pantalla bloqueada.");
    }
});


/* ============================================================
   12. BANNER LEGAL
   ============================================================ */
document.addEventListener("DOMContentLoaded", () => {
    const legalBanner = document.getElementById("legalBanner");
    const acceptLegal = document.getElementById("acceptLegal");

    if (legalBanner && acceptLegal) {
        if (localStorage.getItem("legalAccepted") !== "yes") {
            legalBanner.style.display = "flex";
        }

        acceptLegal.addEventListener("click", () => {
            legalBanner.style.display = "none";
            localStorage.setItem("legalAccepted", "yes");
        });
    }
});





/* ============================================================
   13. AÑO AUTOMÁTICO (FOOTER)
   ============================================================ */
function updateYear() {
    const yearSpan = document.getElementById("year");
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", updateYear);
} else {
    updateYear();
}
