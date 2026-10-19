import { fetchActiveProducts, buildProductCard, setMessage, isSupabaseConfigured } from "./store.js";

const grid = document.getElementById("discoverGrid");
const status = document.getElementById("discoverStatus");
const search = document.getElementById("discoverSearchInput");
const noResults = document.getElementById("noResults");
const showMoreButton = document.getElementById("showMoreProducts");
const PAGE_SIZE = 10;
let products = [];
let visibleCount = PAGE_SIZE;

const params = new URLSearchParams(window.location.search);
if (search && params.has("search")) search.value = params.get("search") || "";

function renderProducts(resetCount = false) {
  if (!grid) return;
  if (resetCount) visibleCount = PAGE_SIZE;
  const query = (search?.value || "").trim().toLowerCase();
  const filtered = products.filter(product => {
    const searchable = [product.name, product.category, product.description, product.deal_label,
      JSON.stringify(product.specifications || {})].join(" ").toLowerCase();
    return searchable.includes(query);
  });
  const visible = filtered.slice(0, visibleCount);
  grid.replaceChildren(...visible.map(product => buildProductCard(product, "discover")));
  if (noResults) noResults.classList.toggle("visible", filtered.length === 0);
  if (showMoreButton) {
    const hasMore = filtered.length > visible.length;
    showMoreButton.hidden = !hasMore;
    let language = "en";
    try { language = localStorage.getItem("pcbuilders_language") || "en"; } catch (_) {}
    showMoreButton.textContent = hasMore
      ? (language === "fil" ? `Magpakita pa (${filtered.length - visible.length} natitira)` : `Show More (${filtered.length - visible.length} remaining)`)
      : (language === "fil" ? "Magpakita pa" : "Show More");
  }
  if (status) {
    status.hidden = filtered.length > 0;
    let language = "en";
    try { language = localStorage.getItem("pcbuilders_language") || "en"; } catch (_) {}
    if (!products.length) setMessage(status, language === "fil" ? "Wala pang aktibong produkto." : "No active products have been added yet.");
    else if (!filtered.length) setMessage(status, language === "fil" ? "Walang katugmang produkto." : "No matching products found.");
    else status.textContent = language === "fil" ? `Ipinapakita ang ${visible.length} sa ${filtered.length} produkto` : `Showing ${visible.length} of ${filtered.length} product(s)`;
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

search?.addEventListener("input", () => renderProducts(true));
showMoreButton?.addEventListener("click", () => {
  visibleCount += PAGE_SIZE;
  renderProducts();
});
start();
