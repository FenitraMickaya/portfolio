(function () {
  "use strict";

  // Année dynamique dans le footer
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Header : bordure au scroll
  var header = document.getElementById("site-header");

  function onScroll() {
    if (!header) return;

    if (window.scrollY > 8) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Menu mobile
  var toggle = document.getElementById("menu-toggle");
  var mobileNav = document.getElementById("mobile-nav");

  if (toggle && mobileNav) {
    toggle.addEventListener("click", function () {
      var open = mobileNav.classList.toggle("open");

      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute(
        "aria-label",
        open ? "Fermer le menu" : "Ouvrir le menu"
      );
    });

    mobileNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        mobileNav.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // Animations au défilement
  var revealEls = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -40px 0px"
      }
    );

    revealEls.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add("visible");
    });
  }

  // Formulaire de contact
  var form = document.getElementById("contact-form");
  var success = document.getElementById("form-success");

  function setError(name, msg) {
    var el = form.querySelector('.error[data-for="' + name + '"]');

    if (el) {
      el.textContent = msg || "";
    }
  }

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      var valid = true;

      var name = form.name.value.trim();
      var email = form.email.value.trim();
      var message = form.message.value.trim();

      // Validation du nom
      if (!name) {
        setError("name", "Merci d'indiquer votre nom.");
        valid = false;
      } else {
        setError("name", "");
      }

      // Validation de l'email
      var emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!email) {
        setError("email", "Merci d'indiquer votre email.");
        valid = false;
      } else if (!emailRe.test(email)) {
        setError("email", "Adresse email invalide.");
        valid = false;
      } else {
        setError("email", "");
      }

      // Validation du message
      if (!message) {
        setError("message", "Merci d'écrire un message.");
        valid = false;
      } else {
        setError("message", "");
      }

      if (!valid) return;

      // Envoi réel de l'email avec EmailJS
      emailjs
        .sendForm(
          "service_vl9r837",
          "template_mzc44xw",
          form
        )
        .then(
          function () {
            form.reset();

            if (success) {
              success.hidden = false;

              setTimeout(function () {
                success.hidden = true;
              }, 5000);
            }
          },
          function (error) {
            console.error("Erreur :", error);

            alert(
              "Une erreur est survenue lors de l'envoi du message. Veuillez réessayer."
            );
          }
        );
    });
  }
})();