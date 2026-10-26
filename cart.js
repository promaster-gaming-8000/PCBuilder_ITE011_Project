import { getCart, saveCart, formatPrice, setMessage } from "./store.js";

const itemsContainer = document.getElementById("cartItems");
const status = document.getElementById("cartStatus");
const subtotalText = document.getElementById("cartSubtotal");
const shippingText = document.getElementById("cartShipping");
const taxesText = document.getElementById("cartTaxes");
const grandTotalText = document.getElementById("cartGrandTotal");
const checkoutButton = document.getElementById("checkoutButton");
const clearCartButton = document.getElementById("clearCartButton");
let language = (() => {
  try {
    return localStorage.getItem("pcbuilders_language") === "fil" ? "fil" : "en";
  } catch {
    return "en";
  }
})();

const dynamicText = {
  en: {
    empty: "Your cart is empty. Browse our catalog to find PC parts and accessories.",
    browse: "Browse products",
    remove: "Remove",
    decrease: "Decrease quantity",
    increase: "Increase quantity",
    price: "Price",
    quantity: "Quantity",
    total: "Total",
    emptyCheckout: "Your cart is empty. Add a product before proceeding.",
    checkoutUnavailable: "Checkout is not connected yet. This demo does not create orders or accept payments.",
    invalidQuantity: "Choose a quantity between 1 and {stock}.",
    cartUpdated: "Cart updated. Prices and stock must be checked again before a real order is placed."
  },
  fil: {
    empty: "Walang laman ang iyong kariton. Tingnan ang katalogo para makahanap ng mga piyesa at aksesorya ng PC.",
    browse: "Tingnan ang mga produkto",
    remove: "Alisin",
    decrease: "Bawasan ang dami",
    increase: "Dagdagan ang dami",
    price: "Presyo",
    quantity: "Dami",
    total: "Kabuuan",
    emptyCheckout: "Walang laman ang iyong kariton. Magdagdag muna ng produkto bago magpatuloy.",
    checkoutUnavailable: "Hindi pa konektado ang pag-checkout. Hindi pa makakagawa ng order o makakatanggap ng bayad ang demo na ito.",
    invalidQuantity: "Pumili ng dami mula 1 hanggang {stock}.",
    cartUpdated: "Na-update ang kariton. Kailangang suriin muli ang presyo at stock bago gumawa ng tunay na order."
  }
};

function t(key, replacements = {}) {
  let value = dynamicText[language][key] || dynamicText.en[key] || key;
  for (const [name, replacement] of Object.entries(replacements)) {
    value = value.replaceAll(`{${name}}`, String(replacement));
  }
  return value;
}

function makeChevron(direction) {
  const svgNamespace = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(svgNamespace, "svg");
  svg.setAttribute("viewBox", "0 0 20 20");
  svg.setAttribute("aria-hidden", "true");
  const path = document.createElementNS(svgNamespace, "path");
  path.setAttribute("d", direction === "left" ? "m12.5 3.5-6.5 6.5 6.5 6.5" : "m7.5 3.5 6.5 6.5-6.5 6.5");
  svg.appendChild(path);
  return svg;
}

function makeCellLabel(label) {
  const span = document.createElement("span");
  span.className = "pc-cart-cell-label";
  span.textContent = label;
  return span;
}

function changeQuantity(productId, direction) {
  const latest = getCart();
  const target = latest.find(entry => String(entry.id) === String(productId));
  if (!target) return;

  const currentQuantity = Math.max(1, Number(target.quantity) || 1);
  const maximum = Math.max(1, Number(target.stock) || 1);
  const nextQuantity = currentQuantity + direction;
  if (nextQuantity < 1 || nextQuantity > maximum) {
    setMessage(status, t("invalidQuantity", { stock: maximum }), "error");
    return;
  }

  target.quantity = nextQuantity;
  saveCart(latest);
  renderCart();
}

function renderCart() {
  const cart = getCart();
  itemsContainer.replaceChildren();
  let subtotal = 0;

  if (!cart.length) {
    const empty = document.createElement("div");
    empty.className = "pc-cart-empty";
    const message = document.createElement("p");
    message.textContent = t("empty");
    const browseLink = document.createElement("a");
    browseLink.href = "discover.html";
    browseLink.textContent = t("browse");
    empty.append(message, browseLink);
    itemsContainer.appendChild(empty);
    setMessage(status, t("empty"));
  } else {
    setMessage(status, "");
    for (const item of cart) {
      const quantity = Math.max(1, Number(item.quantity) || 1);
      const price = Math.max(0, Number(item.price) || 0);
      const maximum = Math.max(1, Number(item.stock) || 1);
      const lineTotal = price * quantity;
      subtotal += lineTotal;

      const row = document.createElement("article");
      row.className = "pc-cart-item";

      const productCell = document.createElement("div");
      productCell.className = "pc-cart-product-cell";

      const imageWrap = document.createElement("div");
      imageWrap.className = "pc-cart-image-wrap";
      const image = document.createElement("img");
      image.className = "pc-cart-product-image";
      image.src = item.image_url || "";
      image.alt = item.name || "Product";
      image.loading = "lazy";
      image.addEventListener("error", () => image.classList.add("image-missing"), { once: true });

      const remove = document.createElement("button");
      remove.type = "button";
      remove.className = "pc-cart-remove";
      remove.textContent = "×";
      remove.setAttribute("aria-label", `${t("remove")} ${item.name || "product"}`);
      remove.title = t("remove");
      remove.addEventListener("click", () => {
        saveCart(getCart().filter(entry => String(entry.id) !== String(item.id)));
        renderCart();
      });
      imageWrap.append(image, remove);

      const productName = document.createElement("a");
      productName.className = "pc-cart-product-name";
      productName.href = `product.html?id=${encodeURIComponent(item.id)}`;
      productName.textContent = item.name || "Untitled product";
      productCell.append(imageWrap, productName);

      const priceCell = document.createElement("div");
      priceCell.className = "pc-cart-price-cell";
      const priceLabel = makeCellLabel(t("price"));
      const priceValue = document.createElement("strong");
      priceValue.textContent = formatPrice(price);
      priceCell.append(priceLabel, priceValue);

      const quantityCell = document.createElement("div");
      quantityCell.className = "pc-cart-quantity-cell";
      quantityCell.appendChild(makeCellLabel(t("quantity")));

      const quantityControl = document.createElement("div");
      quantityControl.className = "pc-cart-quantity-control";
      quantityControl.setAttribute("role", "group");
      quantityControl.setAttribute("aria-label", `${t("quantity")}: ${item.name || "product"}`);

      const decrement = document.createElement("button");
      decrement.type = "button";
      decrement.className = "pc-cart-qty-button";
      decrement.appendChild(makeChevron("left"));
      decrement.disabled = quantity <= 1;
      decrement.setAttribute("aria-label", `${t("decrease")} — ${item.name || "product"}`);
      decrement.title = t("decrease");
      decrement.addEventListener("click", () => changeQuantity(item.id, -1));

      const quantityValue = document.createElement("span");
      quantityValue.className = "pc-cart-quantity-value";
      quantityValue.textContent = String(quantity);
      quantityValue.setAttribute("aria-live", "polite");

      const increment = document.createElement("button");
      increment.type = "button";
      increment.className = "pc-cart-qty-button";
      increment.appendChild(makeChevron("right"));
      increment.disabled = quantity >= maximum;
      increment.setAttribute("aria-label", `${t("increase")} — ${item.name || "product"}`);
      increment.title = t("increase");
      increment.addEventListener("click", () => changeQuantity(item.id, 1));

      quantityControl.append(decrement, quantityValue, increment);
      quantityCell.appendChild(quantityControl);

      const totalCell = document.createElement("strong");
      totalCell.className = "pc-cart-line-total";
      totalCell.appendChild(makeCellLabel(t("total")));
      const totalAmount = document.createElement("span");
      totalAmount.textContent = formatPrice(lineTotal);
      totalCell.appendChild(totalAmount);

      row.append(productCell, priceCell, quantityCell, totalCell);
      itemsContainer.appendChild(row);
    }
  }

  // These are illustrative estimates matching the design mockup, not live checkout fees.
  const shipping = cart.length ? 50 : 0;
  const taxes = cart.length ? 5 : 0;
  subtotalText.textContent = formatPrice(subtotal);
  shippingText.textContent = formatPrice(shipping);
  taxesText.textContent = formatPrice(taxes);
  grandTotalText.textContent = formatPrice(subtotal + shipping + taxes);
  checkoutButton.disabled = !cart.length;
}

window.addEventListener("pcbuilders:languagechange", event => {
  language = event.detail?.language === "fil" ? "fil" : "en";
  renderCart();
});

clearCartButton.addEventListener("click", () => {
  saveCart([]);
  renderCart();
});

checkoutButton.addEventListener("click", () => {
  if (!getCart().length) {
    setMessage(status, t("emptyCheckout"), "error");
    return;
  }
  setMessage(status, t("checkoutUnavailable"), "error");
});

renderCart();
