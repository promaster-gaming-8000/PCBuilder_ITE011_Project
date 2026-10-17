import { fetchActiveProducts, buildProductCard, setMessage, isSupabaseConfigured } from "./store.js";

const dealsGrid = document.getElementById("homeDealsGrid");
const topGrid = document.getElementById("homeTopItemsGrid");

async function start() {
  if (!dealsGrid && !topGrid) return;
  if (!isSupabaseConfigured) {
    [dealsGrid, topGrid].filter(Boolean).forEach(el =>
      setMessage(el, "Configure Supabase in supabase-config.js to load products.", "error"));
    return;
  }

  try {
    const products = await fetchActiveProducts();
    if (dealsGrid) {
      const deals = products.filter(product => String(product.deal_label || "").trim()).slice(0, 3);
      dealsGrid.replaceChildren(...deals.map(product => buildProductCard(product, "home")));
      if (!deals.length) setMessage(dealsGrid, "No current deals. Add a deal label to a product in the admin page.");
    }
    if (topGrid) {
      const topItems = products.filter(product => product.is_top_item).slice(0, 5);
      topGrid.replaceChildren(...topItems.map(product => buildProductCard(product, "home")));
      if (!topItems.length) setMessage(topGrid, "No Top Items selected yet. Mark products as Top Items in the admin page.");
    }
  } catch (error) {
    [dealsGrid, topGrid].filter(Boolean).forEach(el =>
      setMessage(el, `Could not load products: ${error.message}`, "error"));
  }
}

start();
