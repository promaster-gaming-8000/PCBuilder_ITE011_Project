import { fetchActiveProducts, buildProductCard, setMessage, isSupabaseConfigured } from "./store.js";

const grid = document.getElementById("discoverGrid");
const status = document.getElementById("discoverStatus");
const search = document.getElementById("discoverSearchInput");
const noResults = document.getElementById("noResults");
let products = [];

function renderProducts() {
  if (!grid) return;
  const query = (search?.value || "").trim().toLowerCase();
  const filtered = products.filter(product => {
    const searchable = [product.name, product.category, product.description, product.deal_label,
      JSON.stringify(product.specifications || {})].join(" ").toLowerCase();
    return searchable.includes(query);
  });
  grid.replaceChildren(...filtered.map(product => buildProductCard(product, "discover")));
  if (noResults) noResults.classList.toggle("visible", filtered.length === 0);
  if (status) {
    status.hidden = filtered.length > 0;
    if (!products.length) setMessage(status, "No active products have been added yet.");
    else if (!filtered.length) setMessage(status, "No matching products found.");
    else status.textContent = `${filtered.length} product(s)`;
  }
}

async function start() {
  if (!isSupabaseConfigured) {
    setMessage(status, "Add your Supabase Project URL and publishable key in supabase-config.js.", "error");
    return;
  }
  try {
    products = await fetchActiveProducts();
    renderProducts();
  } catch (error) {
    setMessage(status, `Could not load products: ${error.message}`, "error");
  }
}

search?.addEventListener("input", renderProducts);
start();
