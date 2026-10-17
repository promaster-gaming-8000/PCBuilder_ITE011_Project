import { getCart, saveCart, formatPrice, setMessage } from "./store.js";

const itemsContainer = document.getElementById("cartItems");
const status = document.getElementById("cartStatus");
const countText = document.getElementById("cartItemCount");
const subtotalText = document.getElementById("cartSubtotal");

function renderCart() {
  const cart = getCart();
  itemsContainer.replaceChildren();
  let subtotal = 0;
  let itemCount = 0;

  if (!cart.length) {
    setMessage(status, "Your cart is empty. Browse Discover to find PC parts and accessories.");
    const link = document.createElement("a");
    link.href = "discover.html";
    link.className = "store-button store-button-primary";
    link.textContent = "Browse products";
    itemsContainer.appendChild(link);
  } else {
    setMessage(status, "Prices and stock must be checked again before a real order is placed.");
    for (const item of cart) {
      const quantity = Math.max(1, Number(item.quantity) || 1);
      const price = Math.max(0, Number(item.price) || 0);
      subtotal += price * quantity;
      itemCount += quantity;

      const row = document.createElement("article");
      row.className = "cart-item";
      const image = document.createElement("img");
      image.className = "cart-item-image";
      image.src = item.image_url || "";
      image.alt = item.name || "Product";
      image.addEventListener("error", () => image.classList.add("image-missing"), { once: true });

      const details = document.createElement("div");
      details.className = "cart-item-details";
      const name = document.createElement("a");
      name.href = `product.html?id=${encodeURIComponent(item.id)}`;
      name.className = "cart-item-name";
      name.textContent = item.name;
      const priceLine = document.createElement("p");
      priceLine.textContent = formatPrice(price);
      const quantityLabel = document.createElement("label");
      quantityLabel.textContent = "Qty ";
      const quantityInput = document.createElement("input");
      quantityInput.type = "number";
      quantityInput.min = "1";
      quantityInput.max = String(Math.max(1, Number(item.stock) || 1));
      quantityInput.value = String(quantity);
      quantityInput.className = "cart-quantity-input";
      quantityInput.addEventListener("change", () => {
        const next = Math.floor(Number(quantityInput.value));
        const latest = getCart();
        const target = latest.find(entry => entry.id === item.id);
        if (!target) return;
        if (!Number.isInteger(next) || next < 1 || next > Number(target.stock)) {
          setMessage(status, `Please choose a quantity from 1 to ${target.stock}.`, "error");
          renderCart();
          return;
        }
        target.quantity = next;
        saveCart(latest);
        renderCart();
      });
      quantityLabel.appendChild(quantityInput);
      const remove = document.createElement("button");
      remove.type = "button";
      remove.className = "text-button";
      remove.textContent = "Remove";
      remove.addEventListener("click", () => {
        saveCart(getCart().filter(entry => entry.id !== item.id));
        renderCart();
      });
      details.append(name, priceLine, quantityLabel, remove);
      const lineTotal = document.createElement("strong");
      lineTotal.className = "cart-line-total";
      lineTotal.textContent = formatPrice(price * quantity);
      row.append(image, details, lineTotal);
      itemsContainer.appendChild(row);
    }
  }
  countText.textContent = String(itemCount);
  subtotalText.textContent = formatPrice(subtotal);
}

document.getElementById("clearCartButton").addEventListener("click", () => {
  saveCart([]);
  renderCart();
});

document.getElementById("checkoutButton").addEventListener("click", () => {
  setMessage(status, "Checkout is not connected yet. This demo does not create orders or accept payments.", "error");
});

renderCart();
