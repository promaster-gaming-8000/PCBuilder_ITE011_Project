import { updateCartCount } from "./store.js";
updateCartCount();
window.addEventListener("storage", updateCartCount);
