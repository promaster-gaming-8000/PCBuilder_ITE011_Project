(() => {
  const $ = (selector, root = document) => root.querySelector(selector);
  const languageButton = $("#languageButton");
  const languageMenu = $("#languageMenu");
  const currentLanguage = $("#currentLanguage");
  const notificationButton = $("#notificationButton");
  const notificationPanel = $("#notificationPanel");
  const navbarSearch = $("#navbarSearchInput");

  const translations = {
    en: {
      home: "Home", about: "About Us", contact: "Contact Us", pcParts: "PC Parts", pcBuilder: "PC Builder",
      signupLogin: "SIGNUP | LOGIN", notifications: "Notifications", noNotifications: "You have no new notifications.",
      aboutEyebrow: "ABOUT PCBUILDERS", aboutHeading: "Build your dream setup with confidence.",
      aboutBody: "PCBuilders brings PC parts and accessories together in one place, making it easier to explore products for your next build.",
      browseParts: "Browse PC Parts", quickLinks: "Quick links", contactUsHeading: "Contact Us", getInTouch: "Get in touch",
      yourEmail: "Your email address", yourMessage: "Your message", submit: "SUBMIT", allRightsReserved: "All Rights Reserved.",
      heroCopy: "Build your dream PC Build here with us in PCBuilders.", buyNow: "BUY NOW", limitedTime: "LIMITED TIME", deals: "DEALS",
      dealsDescription: "Here at PCBuilders, we offer the BEST of the BEST deals to our customers. Never miss out with the BEST deals and buy them NOW!",
      top: "TOP", items: "ITEMS", topItemsDescription: "See what people buy the most here at PCBuilders!",
      shopFor: "SHOP FOR:", shopDescription: "Buy PC Parts or Complete PC builds here in our large catalog of PC Related items",
      searchProducts: "Search products...",
      provenHeading: "PROVEN AND", trustedHeading: "TRUSTED",
      provenDescription: "We build trust through quality, transparency, and reliable service. Every PC build is carefully selected with compatible, genuine components, helping customers get dependable performance and peace of mind. Component authenticity and traceability are important foundations of trust in computing hardware."
    },
    fil: {
      home: "Home", about: "Tungkol sa Amin", contact: "Makipag-ugnayan", pcParts: "Mga Bahagi ng PC", pcBuilder: "PC Builder",
      signupLogin: "MAG-SIGN UP | MAG-LOGIN", notifications: "Mga Abiso", noNotifications: "Wala kang bagong abiso.",
      aboutEyebrow: "TUNGKOL SA PCBUILDERS", aboutHeading: "Buuin ang iyong pinapangarap na setup nang may kumpiyansa.",
      aboutBody: "Pinagsasama ng PCBuilders ang mga piyesa at aksesorya ng PC sa iisang lugar para mas madaling makapili para sa susunod mong build.",
      browseParts: "Tingnan ang mga PC Parts", quickLinks: "Mga mabilisang link", contactUsHeading: "Makipag-ugnayan sa Amin", getInTouch: "Makipag-ugnayan",
      yourEmail: "Iyong email address", yourMessage: "Iyong mensahe", submit: "IPADALA", allRightsReserved: "Lahat ng Karapatan ay Nakalaan.",
      heroCopy: "Buuin ang pinapangarap mong PC kasama ang PCBuilders.", buyNow: "BUMILI NA", limitedTime: "LIMITADONG ORAS", deals: "MGA DEAL",
      dealsDescription: "Nag-aalok ang PCBuilders ng magagandang deal para sa aming mga customer. Huwag palampasin ang mga deal at bumili na!",
      top: "NANGUNGUNA", items: "MGA ITEM", topItemsDescription: "Tingnan ang mga produktong madalas bilhin sa PCBuilders!",
      shopFor: "PUMILI NG:", shopDescription: "Bumili ng PC parts o kumpletong PC build mula sa aming malaking katalogo ng mga produkto.",
      searchProducts: "Maghanap ng mga produkto...",
      provenHeading: "SUBOK AT", trustedHeading: "PINAGKAKATIWALAAN",
      provenDescription: "Bumubuo kami ng tiwala sa pamamagitan ng kalidad, malinaw na impormasyon, at maaasahang serbisyo. Maingat na pinipili ang bawat PC build gamit ang mga tunay at magkatugmang piyesa upang makapagbigay ng maaasahang performance at kapanatagan ng loob. Mahalaga sa amin ang pagiging tunay at masusubaybayang pinagmulan ng mga piyesa."
    }
  };

  function applyLanguage(language) {
    const lang = translations[language] ? language : "en";
    document.documentElement.lang = lang === "fil" ? "fil" : "en";
    document.querySelectorAll("[data-i18n]").forEach(element => {
      const key = element.getAttribute("data-i18n");
      if (translations[lang][key]) element.textContent = translations[lang][key];
    });
    document.querySelectorAll("[data-i18n-placeholder]").forEach(element => {
      const key = element.getAttribute("data-i18n-placeholder");
      if (translations[lang][key]) element.setAttribute("placeholder", translations[lang][key]);
    });
    if (currentLanguage) currentLanguage.textContent = lang === "fil" ? "Filipino" : "English";
    try { localStorage.setItem("pcbuilders_language", lang); } catch (_) {}
    if (languageMenu) languageMenu.hidden = true;
    if (languageButton) languageButton.setAttribute("aria-expanded", "false");
  }

  if (languageButton && languageMenu) {
    languageButton.addEventListener("click", () => {
      languageMenu.hidden = !languageMenu.hidden;
      languageButton.setAttribute("aria-expanded", String(!languageMenu.hidden));
    });
    languageMenu.querySelectorAll("[data-language]").forEach(button => {
      button.addEventListener("click", () => applyLanguage(button.dataset.language));
    });
    document.addEventListener("click", event => {
      if (!languageMenu.contains(event.target) && !languageButton.contains(event.target)) {
        languageMenu.hidden = true;
        languageButton.setAttribute("aria-expanded", "false");
      }
    });
  }

  if (notificationButton && notificationPanel) {
    notificationButton.addEventListener("click", () => {
      notificationPanel.hidden = !notificationPanel.hidden;
      notificationButton.setAttribute("aria-expanded", String(!notificationPanel.hidden));
    });
    document.addEventListener("click", event => {
      if (!notificationPanel.contains(event.target) && !notificationButton.contains(event.target)) {
        notificationPanel.hidden = true;
        notificationButton.setAttribute("aria-expanded", "false");
      }
    });
  }

  navbarSearch?.addEventListener("keydown", event => {
    if (event.key === "Enter") {
      event.preventDefault();
      const query = navbarSearch.value.trim();
      window.location.href = `discover.html${query ? `?search=${encodeURIComponent(query)}` : ""}`;
    }
  });

  document.querySelectorAll(".pcbuilder-coming-soon").forEach(link => {
    link.addEventListener("click", event => {
      event.preventDefault();
      window.alert("The PC Builder page is not available yet. It will be added later.");
    });
  });

  const contactForm = $("#footerContactForm");
  contactForm?.addEventListener("submit", event => {
    event.preventDefault();
    const email = $("#footerEmail")?.value.trim();
    const message = $("#footerMessage")?.value.trim();
    const status = $("#footerFormStatus");
    if (!email || !message) return;
    const subject = encodeURIComponent("Message from the PCBuilders website");
    const body = encodeURIComponent(`From: ${email}\n\n${message}`);
    if (status) status.textContent = "Opening your email app with your message...";
    window.location.href = `mailto:pcbuilder@gmail.com?subject=${subject}&body=${body}`;
  });

  try { applyLanguage(localStorage.getItem("pcbuilders_language") || "en"); }
  catch (_) { applyLanguage("en"); }
})();
