import { fetchProduct, formatPrice, addToCart, getSpecifications, setMessage } from "./store.js";

const status = document.getElementById("productStatus");
const content = document.getElementById("productContent");
const actionStatus = document.getElementById("productActionStatus");
const specsSection = document.getElementById("specificationsSection");
let currentProduct = null;

function renderSpecifications(specifications) {
  const list = document.getElementById("productSpecifications");
  list.replaceChildren();
  const entries = Object.entries(getSpecifications(specifications));
  if (!entries.length) {
    specsSection.hidden = true;
    return;
  }
  for (const [key, value] of entries) {
    const term = document.createElement("dt");
    term.textContent = key;
    const description = document.createElement("dd");
    description.textContent = String(value);
    list.append(term, description);
  }
  specsSection.hidden = false;
}

function renderProduct(product) {
  currentProduct = product;
  document.title = `${product.name} | PCBuilders`;
  const image = document.getElementById("productImage");
  image.src = product.image_url || "";
  image.alt = product.name;
  image.addEventListener("error", () => {
    image.removeAttribute("src");
    image.alt = "Product image unavailable";
    image.classList.add("image-missing");
  }, { once: true });
  document.getElementById("productCategory").textContent = product.category || "PC Component";
  document.getElementById("productName").textContent = product.name;
  document.getElementById("productPrice").textContent = formatPrice(product.price);
  document.getElementById("productStock").textContent = Number(product.stock) > 0
    ? `${product.stock} unit(s) in stock`
    : "Currently out of stock";
  document.getElementById("productDescription").textContent = product.description || "No description provided.";
  const quantity = document.getElementById("productQuantity");
  quantity.max = String(Math.max(1, Number(product.stock) || 1));
  const disabled = Number(product.stock) < 1;
  document.getElementById("addToCartButton").disabled = disabled;
  document.getElementById("buyNowButton").disabled = disabled;
  renderSpecifications(product.specifications);
  content.hidden = false;
  setMessage(status, "");
  status.hidden = true;
}

async function loadProduct() {
  const id = new URLSearchParams(location.search).get("id");
  if (!id) {
    setMessage(status, "No product was selected. Return to Discover and choose an item.", "error");
    return;
  }
  try {
    const product = await fetchProduct(id);
    if (!product) {
      setMessage(status, "This product is not available or has been removed.", "error");
      return;
    }
    renderProduct(product);
  } catch (error) {
    setMessage(status, `Could not load the product: ${error.message}`, "error");
  }
}

function handleAddToCart(goToCart) {
  if (!currentProduct) return;
  try {
    addToCart(currentProduct, document.getElementById("productQuantity").value);
    setMessage(actionStatus, `${currentProduct.name} added to your cart.`, "success");
    if (goToCart) location.href = "cart.html";
  } catch (error) {
    setMessage(actionStatus, error.message, "error");
  }
}

document.getElementById("addToCartButton").addEventListener("click", () => handleAddToCart(false));
document.getElementById("buyNowButton").addEventListener("click", () => handleAddToCart(true));
loadProduct();
