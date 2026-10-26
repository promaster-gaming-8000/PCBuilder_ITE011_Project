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
      searchLabel: "Search:", help: "Help", shoppingCart: "Shopping cart",
      cartDocumentTitle: "Shopping Cart | PCBuilders",
      cartHeroTop: "SHOPPING", cartHeroBottom: "CART",
      cartHeroDescription: "Review your cart before you proceed to checkout!",
      cartProductLabel: "PRODUCT", cartPriceLabel: "PRICE", cartQuantityLabel: "QUANTITY", cartTotalLabel: "TOTAL",
      cartSubtotalLabel: "Subtotal", cartShippingLabel: "Shipping", cartTaxLabel: "Estimated Taxes", cartGrandTotalLabel: "Total",
      cartCheckoutButton: "Proceed to Checkout", cartContinueShopping: "Continue shopping", cartClearButton: "Clear cart",
      cartEstimateNote: "Shipping and taxes are estimates for this prototype. Checkout is not connected yet.",
      cartIllustrationAlt: "Shopping cart illustration",
      documentTitle: "About Us | PCBuilders",
      metaDescription: "Learn more about PCBuilders and our approach to PC parts and custom builds.",
      aboutHeroImageAlt: "A collection of custom PC builds and gaming setups",
      teamPhotoAlt01: "Portrait of Dan Lynnl Carl Zantua", teamPhotoAlt02: "Portrait of Lilian Mae Lising",
      teamPhotoAlt03: "Portrait of Jerome Macabata", teamPhotoAlt04: "Portrait of Randy Miguel M. Mazo",
      teamPhotoAlt05: "Portrait of John Mark Sazon",
      aboutTitleSolid: "BUILD YOUR", aboutTitleOutline: "DREAMS", whoWeAre: "WHO WE ARE",
      aboutIntro: "PCBuilders is your go-to destination for exploring PC parts and finding the right components for your setup. Whether you are planning your first PC or upgrading an existing build, we aim to make the process easier to understand, compare, and enjoy.",
      explorePcParts: "Explore PC Parts", whatWeDoHeading: "What We Do",
      whatWeDoBody: "We bring PC-related products together in one catalog so customers can compare options and learn more about the components they are interested in. Our goal is to make finding parts easier to follow.",
      ourApproachHeading: "Our Approach",
      ourApproachBody: "A good PC starts with choosing components that suit your needs. We focus on clear product information, organized categories, and a shopping experience that works across desktop, tablet, and mobile screens.",
      qualityClarityHeading: "Quality, Clarity, and Customer Support",
      qualityClarityBody: "We believe customers should be able to browse products with confidence. PCBuilders is designed around accessible information, a straightforward catalog, and support when questions come up. As the project grows, these principles will continue to guide the experience.",
      whyWord: "WHY", chooseWord: "CHOOSE", usQuestion: "US?", whyIntroStart: "At ",
      whyIntroEnd: ", we make it easy to find and build the right PC for your needs and budget. We focus on quality components, reliable performance, and personalized builds so every customer gets a setup they can be proud of.",
      qualityComponents: "Quality Components", qualityComponentsBody: "We choose reliable, high-performance parts designed to deliver great results.",
      builtForNeeds: "Built for Your Needs", builtForNeedsBody: "Get the performance you need without spending more than necessary.",
      budgetFriendlyOptions: "Budget-Friendly Options", budgetFriendlyOptionsBody: "Choose the parts and specifications that match your style, performance goals, and budget.",
      customerFocused: "Customer-Focused", customerFocusedBody: "We're here to make PC building simple, straightforward, and stress-free.",
      monthlyUsers: "Monthly Users", monthlyUsersDescription: "People discovering PCBuilders every month.",
      footerTagline: "PCBuilders - Build Your Dreams.", locationLabel: "Quezon City, Philippines",
      aboutPageLabel: "About PCBuilders", customerReviews: "Customer reviews", moreCustomerReviews: "More customer reviews",
      provenHeading: "PROVEN AND", trustedHeading: "TRUSTED",
      provenDescription: "We build trust through quality, transparency, and reliable service. Every PC build is carefully selected with compatible, genuine components, helping customers get dependable performance and peace of mind. Component authenticity and traceability are important foundations of trust in computing hardware.",
      teamHeading: "Meet the Team",
      teamSubheading: "PCBuilders was developed through teamwork, combining programming, design, product management, and testing to create an organized and accessible PC parts shopping experience.",

      teamMember01: "Team Member 01",
      teamMember02: "Team Member 02",
      teamMember03: "Team Member 03",
      teamMember04: "Team Member 04",
      teamMember05: "Team Member 05",

      teamRole01: "Lead Developer & Programmer",
      teamRole02: "UI/UX Designer",
      teamRole03: "Website Manager & Developer",
      teamRole04: "Website & Product Manager",
      teamRole05: "Quality Assurance Tester",

      teamDescription01: "Dan leads the technical development of PCBuilders. He built the website's HTML structure, implemented its JavaScript functionality, worked on the database, and developed the core logic that allows the website's features to operate. His work brings the team's ideas together into a functional online platform.",

      teamDescription02: "Lilian proposed the website's visual design and helped establish its overall presentation. She contributed ideas for the interface, layout, and visual consistency, helping make PCBuilders more attractive, organized, and easier for visitors to navigate.",

      teamDescription03: "Jerome helps manage the website's content and maintain its product catalog by adding and organizing shop items. He also contributed to programming alongside Dan Zantua, supporting the development and improvement of the website's features.",

      teamDescription04: "Randy helps manage the website's shop and keeps the product catalog updated by adding items and organizing product information. His contributions help maintain a useful, organized catalog so visitors can browse the available PC components more easily.",

      teamDescription05: "John Mark tests the website to identify bugs, check its features, and evaluate its compatibility with different devices and screen sizes. His testing helps the team detect issues, improve reliability, and provide a smoother browsing experience on desktop, tablet, and mobile."
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
      searchLabel: "Maghanap:", help: "Tulong", shoppingCart: "Kariton ng mga Binili",
      cartDocumentTitle: "Kariton ng mga Binili | PCBuilders",
      cartHeroTop: "MGA BINILI", cartHeroBottom: "KARITON",
      cartHeroDescription: "Suriin ang iyong mga binili bago magpatuloy sa pag-checkout!",
      cartProductLabel: "PRODUKTO", cartPriceLabel: "PRESYO", cartQuantityLabel: "DAMING BILANG", cartTotalLabel: "KABUUAN",
      cartSubtotalLabel: "Subtotal", cartShippingLabel: "Pagpapadala", cartTaxLabel: "Tinatayang Buwis", cartGrandTotalLabel: "Kabuuan",
      cartCheckoutButton: "Magpatuloy sa Pag-checkout", cartContinueShopping: "Magpatuloy sa pamimili", cartClearButton: "I-clear ang kariton",
      cartEstimateNote: "Tinatayang halaga lamang ang pagpapadala at buwis para sa prototype na ito. Hindi pa konektado ang pag-checkout.",
      cartIllustrationAlt: "Ilustrasyon ng kariton sa pamimili",
      documentTitle: "Tungkol sa Amin | PCBuilders",
      metaDescription: "Alamin ang higit pa tungkol sa PCBuilders at sa aming paraan ng pagpili ng mga piyesa ng PC at paggawa ng custom build.",
      aboutHeroImageAlt: "Koleksyon ng mga custom PC build at gaming setup",
      teamPhotoAlt01: "Larawan ni Dan Lynnl Carl Zantua", teamPhotoAlt02: "Larawan ni Lilian Mae Lising",
      teamPhotoAlt03: "Larawan ni Jerome Macabata", teamPhotoAlt04: "Larawan ni Randy Miguel M. Mazo",
      teamPhotoAlt05: "Larawan ni John Mark Sazon",
      aboutTitleSolid: "BUUIN ANG", aboutTitleOutline: "PANGARAP MO", whoWeAre: "SINO KAMI",
      aboutIntro: "Ang PCBuilders ang iyong destinasyon para tumuklas ng mga piyesa ng PC at mahanap ang mga sangkap na angkop sa iyong setup. Naghahanda ka man sa iyong unang PC o nag-a-upgrade ng kasalukuyang build, layunin naming gawing mas madaling unawain, paghambingin, at masiyahan ang proseso.",
      explorePcParts: "Tingnan ang mga PC Parts", whatWeDoHeading: "Ano ang Ginagawa Namin",
      whatWeDoBody: "Pinagsasama namin ang mga produktong may kaugnayan sa PC sa iisang katalogo upang maikumpara ng mga customer ang iba't ibang opsyon at matuto tungkol sa mga piyesang interesado silang bilhin. Layunin naming gawing mas madali ang paghahanap ng mga piyesa.",
      ourApproachHeading: "Ang Aming Paraan",
      ourApproachBody: "Nagsisimula ang isang mahusay na PC sa pagpili ng mga piyesang akma sa iyong pangangailangan. Nakatuon kami sa malinaw na impormasyon ng produkto, organisadong mga kategorya, at karanasang madaling gamitin sa desktop, tablet, at mobile.",
      qualityClarityHeading: "Kalidad, Linaw, at Suporta sa Customer",
      qualityClarityBody: "Naniniwala kaming dapat makapili ang mga customer ng produkto nang may kumpiyansa. Dinisenyo ang PCBuilders upang magbigay ng madaling maunawaang impormasyon, payak na katalogo, at suporta kapag may mga tanong. Habang lumalago ang proyekto, patuloy na gagabay sa aming karanasan ang mga prinsipyong ito.",
      whyWord: "BAKIT", chooseWord: "PILIIN", usQuestion: "KAMI?", whyIntroStart: "Sa ",
      whyIntroEnd: ", pinapadali namin ang paghahanap at pagbuo ng PC na angkop sa iyong pangangailangan at badyet. Binibigyang-pansin namin ang de-kalidad na mga piyesa, maaasahang performance, at mga build na iniangkop sa bawat customer upang magkaroon ang bawat isa ng setup na maipagmamalaki.",
      qualityComponents: "De-kalidad na mga Piyesa", qualityComponentsBody: "Pinipili namin ang maaasahan at mataas ang performance na mga piyesang idinisenyo upang magbigay ng mahusay na resulta.",
      builtForNeeds: "Iniayon sa Iyong Pangangailangan", builtForNeedsBody: "Makamit ang performance na kailangan mo nang hindi gumagastos nang higit sa kinakailangan.",
      budgetFriendlyOptions: "Mga Opsyong Abot-kaya", budgetFriendlyOptionsBody: "Piliin ang mga piyesa at espesipikasyong tugma sa iyong estilo, layunin sa performance, at badyet.",
      customerFocused: "Nakatuon sa Customer", customerFocusedBody: "Layunin naming gawing simple, malinaw, at hindi nakaka-stress ang pagbuo ng PC.",
      monthlyUsers: "Mga Bisita Bawat Buwan", monthlyUsersDescription: "Mga taong tumutuklas sa PCBuilders bawat buwan.",
      footerTagline: "PCBuilders - Buuin ang Iyong mga Pangarap.", locationLabel: "Quezon City, Pilipinas",
      aboutPageLabel: "Tungkol sa PCBuilders", customerReviews: "Mga review ng customer", moreCustomerReviews: "Higit pang review ng customer",
      provenHeading: "SUBOK AT", trustedHeading: "PINAGKAKATIWALAAN",
      provenDescription: "Bumubuo kami ng tiwala sa pamamagitan ng kalidad, malinaw na impormasyon, at maaasahang serbisyo. Maingat na pinipili ang bawat PC build gamit ang mga tunay at magkatugmang piyesa upang makapagbigay ng maaasahang performance at kapanatagan ng loob. Mahalaga sa amin ang pagiging tunay at masusubaybayang pinagmulan ng mga piyesa.",
      teamHeading: "Kilalanin ang Aming Koponan",
      teamSubheading: "Binuo ang PCBuilders sa pamamagitan ng pagtutulungan sa programming, disenyo, pamamahala ng produkto, at pagsusuri upang makagawa ng organisado at madaling gamitin na karanasan sa pamimili ng mga piyesa ng PC.",

      teamMember01: "Miyembro ng Koponan 01",
      teamMember02: "Miyembro ng Koponan 02",
      teamMember03: "Miyembro ng Koponan 03",
      teamMember04: "Miyembro ng Koponan 04",
      teamMember05: "Miyembro ng Koponan 05",

      teamRole01: "Pangunahing Developer at Programmer",
      teamRole02: "Tagadisenyo ng UI/UX",
      teamRole03: "Tagapamahala at Developer ng Website",
      teamRole04: "Tagapamahala ng Website at mga Produkto",
      teamRole05: "Tagasuri ng Kalidad ng Website",

      teamDescription01: "Pinamumunuan ni Dan ang teknikal na pagbuo ng PCBuilders. Siya ang gumawa ng HTML structure ng website, nagpatupad ng mga function gamit ang JavaScript, tumulong sa database, at bumuo ng pangunahing lohika na nagpapatakbo sa mga feature ng website. Pinagsasama ng kanyang trabaho ang mga ideya ng koponan upang makabuo ng isang gumaganang online platform.",

      teamDescription02: "Iminungkahi ni Lilian ang visual na disenyo ng website at tumulong sa pagbuo ng pangkalahatang presentasyon nito. Nagbahagi siya ng mga ideya tungkol sa interface, layout, at pagkakapare-pareho ng disenyo upang maging mas kaakit-akit, organisado, at madaling gamitin ang PCBuilders.",

      teamDescription03: "Tumutulong si Jerome sa pamamahala ng nilalaman ng website at sa pag-aayos ng katalogo ng mga produkto sa pamamagitan ng pagdaragdag at pag-oorganisa ng mga item. Tumulong din siya sa programming kasama si Dan Zantua upang mapaunlad at mapahusay ang mga feature ng website.",

      teamDescription04: "Tumutulong si Randy sa pamamahala ng tindahan sa website at sa pag-update ng katalogo sa pamamagitan ng pagdaragdag ng mga item at pag-aayos ng impormasyon ng mga produkto. Nakakatulong ang kanyang trabaho upang maging organisado at madaling tingnan ang mga available na piyesa ng PC.",

      teamDescription05: "Sinusuri ni John Mark ang website upang matukoy ang mga bug, masubukan ang mga feature, at masuri ang pagiging tugma nito sa iba't ibang device at laki ng screen. Nakakatulong ang kanyang pagsusuri upang matukoy at maayos ang mga problema at mapabuti ang paggamit ng website sa desktop, tablet, at mobile."
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
    [
      ["data-i18n-aria-label", "aria-label"],
      ["data-i18n-alt", "alt"],
      ["data-i18n-title", "title"],
      ["data-i18n-content", "content"]
    ].forEach(([dataAttribute, targetAttribute]) => {
      document.querySelectorAll(`[${dataAttribute}]`).forEach(element => {
        const key = element.getAttribute(dataAttribute);
        if (translations[lang][key]) element.setAttribute(targetAttribute, translations[lang][key]);
      });
    });
    if (currentLanguage) currentLanguage.textContent = lang === "fil" ? "Filipino" : "English";
    try { localStorage.setItem("pcbuilders_language", lang); } catch (_) { }
    if (languageMenu) languageMenu.hidden = true;
    if (languageButton) languageButton.setAttribute("aria-expanded", "false");
    window.dispatchEvent(new CustomEvent("pcbuilders:languagechange", { detail: { language: lang } }));
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
