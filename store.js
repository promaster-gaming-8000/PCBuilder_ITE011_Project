import { supabase, isSupabaseConfigured, PRODUCT_IMAGE_BUCKET } from "./supabase-config.js";

export { supabase, isSupabaseConfigured, PRODUCT_IMAGE_BUCKET };
export const CART_KEY = "pcbuilders_cart_v1";

export function formatPrice(value) {
  const amount = Number(value) || 0;
  return "PHP" + amount.toLocaleString("en-PH", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  });
}

export function getCart() {
  try {
    const saved = JSON.parse(localStorage.getItem(CART_KEY) || "[]");
    return Array.isArray(saved) ? saved.filter(item => item && item.id) : [];
  } catch {
    return [];
  }
}

export function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartCount();
}

export function updateCartCount() {
  const count = getCart().reduce((sum, item) => sum + (Number(item.quantity) || 0), 0);
  document.querySelectorAll("#cartCount").forEach(element => {
    element.textContent = String(count);
  });
}

export function addToCart(product, quantity = 1) {
  const requested = Math.floor(Number(quantity));
  if (!Number.isInteger(requested) || requested < 1) {
    throw new Error("Please enter a valid quantity.");
  }
  if (Number(product.stock) < 1) throw new Error("This item is currently out of stock.");

  const cart = getCart();
  const existing = cart.find(item => item.id === product.id);
  const nextQuantity = (existing ? Number(existing.quantity) : 0) + requested;
  if (nextQuantity > Number(product.stock)) {
    throw new Error(`Only ${product.stock} unit(s) are currently listed in stock.`);
  }

  const entry = {
    id: product.id,
    name: product.name,
    price: Number(product.price),
    stock: Number(product.stock),
    category: product.category || "Other",
    image_url: product.image_url || "",
    quantity: nextQuantity
  };

  if (existing) Object.assign(existing, entry);
  else cart.push(entry);
  saveCart(cart);
}

export function buildProductCard(product, mode = "discover") {
  const article = document.createElement("article");
  article.className = mode === "discover" ? "discover-item" : "topitems_item_container";

  const link = document.createElement("a");
  link.className = "product-card-link";
  link.href = `product.html?id=${encodeURIComponent(product.id)}`;
  link.setAttribute("aria-label", `View ${product.name}`);

  const imageWrap = document.createElement("div");
  imageWrap.className = "topitem_item";

  const image = document.createElement("img");
  image.className = "topitem_product_image";
  image.src = product.image_url || "";
  image.alt = product.name || "Product image";
  image.loading = "lazy";
  image.addEventListener("error", () => {
    image.remove();
    imageWrap.classList.add("image-missing");
    imageWrap.textContent = "Product image unavailable";
  }, { once: true });
  imageWrap.appendChild(image);

  const overlay = document.createElement("div");
  overlay.className = "top_item_innerui";
  const top = document.createElement("div");
  if (product.is_top_item) {
    const topBadge = document.createElement("span");
    topBadge.className = "topitem-badge";
    topBadge.textContent = "TOP ITEM";
    top.appendChild(topBadge);
  } else if (product.deal_label) {
    const dealBadge = document.createElement("span");
    dealBadge.className = "topitem-badge deal-badge";
    dealBadge.textContent = product.deal_label;
    top.appendChild(dealBadge);
  }
  const price = document.createElement("div");
  price.className = "topitem_price";
  const priceText = document.createElement("p");
  priceText.textContent = formatPrice(product.price);
  price.appendChild(priceText);
  overlay.append(top, price);
  imageWrap.appendChild(overlay);
  link.appendChild(imageWrap);

  const description = document.createElement("div");
  description.className = "topitem_description";
  const name = document.createElement("p");
  name.textContent = product.name || "Untitled product";
  description.appendChild(name);
  link.appendChild(description);
  article.appendChild(link);

  if (Number(product.stock) < 1) {
    const stock = document.createElement("span");
    stock.className = "out-of-stock-label";
    stock.textContent = "OUT OF STOCK";
    article.appendChild(stock);
  }
  return article;
}

export async function fetchActiveProducts() {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error("Supabase is not configured yet. Update supabase-config.js first.");
  }
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("active", true)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function fetchProduct(id, includeInactive = false) {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error("Supabase is not configured yet. Update supabase-config.js first.");
  }
  let query = supabase.from("products").select("*").eq("id", id);
  if (!includeInactive) query = query.eq("active", true);
  const { data, error } = await query.maybeSingle();
  if (error) throw error;
  return data;
}

export function getSpecifications(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  return value;
}

export function setMessage(element, message, kind = "") {
  if (!element) return;
  element.textContent = message;
  element.classList.remove("is-error", "is-success");
  if (kind) element.classList.add(kind === "error" ? "is-error" : "is-success");
}
