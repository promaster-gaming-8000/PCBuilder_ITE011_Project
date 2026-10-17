import { supabase, isSupabaseConfigured, PRODUCT_IMAGE_BUCKET } from "./supabase-config.js";
import { formatPrice, setMessage } from "./store.js";

const loginPanel = document.getElementById("loginPanel");
const dashboard = document.getElementById("adminDashboard");
const loginStatus = document.getElementById("adminLoginStatus");
const saveStatus = document.getElementById("productSaveStatus");
const form = document.getElementById("productForm");
const productList = document.getElementById("adminProductList");
let signedInUser = null;
let oldImagePath = null;

function specificationsToText(value) {
  if (!value || typeof value !== "object") return "";
  return Object.entries(value).map(([key, item]) => `${key}: ${item}`).join("\n");
}

function parseSpecifications(value) {
  const result = {};
  for (const line of value.split("\n")) {
    const separator = line.indexOf(":");
    if (separator <= 0) continue;
    const key = line.slice(0, separator).trim();
    const itemValue = line.slice(separator + 1).trim();
    if (key && itemValue) result[key] = itemValue;
  }
  return result;
}

function showDashboard(user) {
  signedInUser = user;
  loginPanel.hidden = true;
  dashboard.hidden = false;
  document.getElementById("signedInEmail").textContent = user.email || "Admin";
  loadProducts();
}

async function isCurrentUserAdmin() {
  const { data, error } = await supabase.rpc("is_admin");
  if (error) throw error;
  return data === true;
}

async function verifySession() {
  if (!isSupabaseConfigured) {
    setMessage(loginStatus, "Configure your Supabase Project URL and publishable key in supabase-config.js.", "error");
    return;
  }
  const { data, error } = await supabase.auth.getSession();
  if (error) {
    setMessage(loginStatus, error.message, "error");
    return;
  }
  if (!data.session) return;
  try {
    if (await isCurrentUserAdmin()) showDashboard(data.session.user);
    else setMessage(loginStatus, "This account is signed in but is not authorized as a PCBuilders admin.", "error");
  } catch (error) {
    setMessage(loginStatus, `Could not verify admin permissions: ${error.message}`, "error");
  }
}

async function uploadProductImage(file) {
  if (!file) return null;
  if (!file.type.startsWith("image/")) throw new Error("Please choose an image file.");
  if (file.size > 50 * 1024 * 1024) throw new Error("The free bucket is configured for files up to 50 MB. Please choose a smaller image.");
  const safeName = file.name.toLowerCase().replace(/[^a-z0-9._-]+/g, "-").slice(-100) || "product-image";
  const unique = globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  const path = `${signedInUser.id}/${unique}-${safeName}`;
  const { error } = await supabase.storage.from(PRODUCT_IMAGE_BUCKET).upload(path, file, {
    cacheControl: "3600",
    upsert: false,
    contentType: file.type
  });
  if (error) throw error;
  const { data } = supabase.storage.from(PRODUCT_IMAGE_BUCKET).getPublicUrl(path);
  return { path, url: data.publicUrl };
}

function resetForm() {
  form.reset();
  document.getElementById("editingProductId").value = "";
  document.getElementById("productFormTitle").textContent = "Add a Product";
  document.getElementById("saveProductButton").textContent = "Add Product";
  document.getElementById("cancelEditButton").hidden = true;
  document.getElementById("adminProductStock").value = "1";
  document.getElementById("adminProductActive").checked = true;
  document.getElementById("imageHelp").textContent = "Choose an image to upload it directly to Supabase Storage. Leave blank when editing to keep the current image.";
  oldImagePath = null;
}

function startEditing(product) {
  document.getElementById("editingProductId").value = product.id;
  document.getElementById("adminProductName").value = product.name || "";
  document.getElementById("adminProductPrice").value = product.price ?? 0;
  document.getElementById("adminProductStock").value = product.stock ?? 0;
  document.getElementById("adminProductCategory").value = product.category || "";
  document.getElementById("adminProductDescription").value = product.description || "";
  document.getElementById("adminProductSpecifications").value = specificationsToText(product.specifications);
  document.getElementById("adminProductDealLabel").value = product.deal_label || "";
  document.getElementById("adminProductTopItem").checked = Boolean(product.is_top_item);
  document.getElementById("adminProductActive").checked = Boolean(product.active);
  document.getElementById("adminProductImage").value = "";
  document.getElementById("imageHelp").textContent = product.image_url
    ? "Current image is saved. Choose a new file only if you want to replace it."
    : "No current image. Choose a file to upload.";
  oldImagePath = product.image_path || null;
  document.getElementById("productFormTitle").textContent = "Edit Product";
  document.getElementById("saveProductButton").textContent = "Save Changes";
  document.getElementById("cancelEditButton").hidden = false;
  form.scrollIntoView({ behavior: "smooth", block: "start" });
}

function productListItem(product) {
  const row = document.createElement("article");
  row.className = "admin-product-row";
  const image = document.createElement("img");
  image.src = product.image_url || "";
  image.alt = "";
  image.className = "admin-product-thumb";
  image.addEventListener("error", () => image.classList.add("image-missing"), { once: true });
  const info = document.createElement("div");
  info.className = "admin-product-info";
  const name = document.createElement("strong");
  name.textContent = product.name;
  const meta = document.createElement("p");
  meta.textContent = `${formatPrice(product.price)} · Stock: ${product.stock} · ${product.active ? "Visible" : "Hidden"}`;
  info.append(name, meta);
  const actions = document.createElement("div");
  actions.className = "admin-row-actions";
  const edit = document.createElement("button");
  edit.type = "button";
  edit.className = "store-button store-button-secondary";
  edit.textContent = "Edit";
  edit.addEventListener("click", () => startEditing(product));
  const remove = document.createElement("button");
  remove.type = "button";
  remove.className = "store-button store-button-danger";
  remove.textContent = "Delete";
  remove.addEventListener("click", () => deleteProduct(product));
  actions.append(edit, remove);
  row.append(image, info, actions);
  return row;
}

async function loadProducts() {
  productList.replaceChildren();
  const loading = document.createElement("p");
  loading.textContent = "Loading products...";
  productList.appendChild(loading);
  const { data, error } = await supabase.from("products").select("*").order("created_at", { ascending: false });
  if (error) {
    productList.replaceChildren();
    setMessage(productList, `Could not load products: ${error.message}`, "error");
    return;
  }
  productList.replaceChildren();
  if (!data.length) {
    const empty = document.createElement("p");
    empty.textContent = "No products yet. Use the form above to add the first one.";
    productList.appendChild(empty);
    return;
  }
  productList.append(...data.map(productListItem));
}

async function deleteProduct(product) {
  if (!confirm(`Delete "${product.name}"? This cannot be undone.`)) return;
  setMessage(saveStatus, "Deleting product...");
  const { error } = await supabase.from("products").delete().eq("id", product.id);
  if (error) {
    setMessage(saveStatus, `Delete failed: ${error.message}`, "error");
    return;
  }
  if (product.image_path) {
    const { error: imageError } = await supabase.storage.from(PRODUCT_IMAGE_BUCKET).remove([product.image_path]);
    if (imageError) console.warn("Product row deleted but image cleanup failed:", imageError.message);
  }
  setMessage(saveStatus, "Product deleted.", "success");
  await loadProducts();
}

document.getElementById("adminLoginForm").addEventListener("submit", async event => {
  event.preventDefault();
  if (!isSupabaseConfigured) {
    setMessage(loginStatus, "Configure Supabase in supabase-config.js first.", "error");
    return;
  }
  setMessage(loginStatus, "Signing in...");
  const email = document.getElementById("adminEmail").value.trim();
  const password = document.getElementById("adminPassword").value;
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    setMessage(loginStatus, error.message, "error");
    return;
  }
  try {
    if (!(await isCurrentUserAdmin())) {
      await supabase.auth.signOut();
      setMessage(loginStatus, "Login worked, but this account is not in public.admin_users. Follow the setup guide to grant admin access.", "error");
      return;
    }
    setMessage(loginStatus, "");
    showDashboard(data.user);
  } catch (checkError) {
    await supabase.auth.signOut();
    setMessage(loginStatus, `Could not verify permissions: ${checkError.message}`, "error");
  }
});

document.getElementById("adminSignOut").addEventListener("click", async () => {
  await supabase.auth.signOut();
  dashboard.hidden = true;
  loginPanel.hidden = false;
  signedInUser = null;
  setMessage(loginStatus, "Signed out.");
});

document.getElementById("cancelEditButton").addEventListener("click", resetForm);

form.addEventListener("submit", async event => {
  event.preventDefault();
  if (!signedInUser) {
    setMessage(saveStatus, "Please sign in as an administrator.", "error");
    return;
  }
  const editingId = document.getElementById("editingProductId").value;
  const file = document.getElementById("adminProductImage").files[0] || null;
  let newUpload = null;
  setMessage(saveStatus, "Saving product...");
  document.getElementById("saveProductButton").disabled = true;

  try {
    if (file) newUpload = await uploadProductImage(file);
    const existingProduct = editingId
      ? (await supabase.from("products").select("image_url,image_path").eq("id", editingId).single()).data
      : null;
    if (editingId && !existingProduct) throw new Error("Could not find the product you are editing.");
    if (!editingId && !file) throw new Error("Please choose a product image.");

    const payload = {
      name: document.getElementById("adminProductName").value.trim(),
      price: Number(document.getElementById("adminProductPrice").value),
      stock: Math.floor(Number(document.getElementById("adminProductStock").value)),
      category: document.getElementById("adminProductCategory").value.trim(),
      description: document.getElementById("adminProductDescription").value.trim(),
      specifications: parseSpecifications(document.getElementById("adminProductSpecifications").value),
      image_url: newUpload?.url || existingProduct?.image_url || "",
      image_path: newUpload?.path || existingProduct?.image_path || null,
      deal_label: document.getElementById("adminProductDealLabel").value.trim(),
      is_top_item: document.getElementById("adminProductTopItem").checked,
      active: document.getElementById("adminProductActive").checked,
      updated_at: new Date().toISOString()
    };

    if (!payload.name || !payload.category || !payload.image_url || !Number.isFinite(payload.price) || payload.price < 0 || !Number.isInteger(payload.stock) || payload.stock < 0) {
      throw new Error("Check the product name, category, image, price and stock values.");
    }

    const result = editingId
      ? await supabase.from("products").update(payload).eq("id", editingId).select().single()
      : await supabase.from("products").insert(payload).select().single();
    if (result.error) throw result.error;

    if (newUpload && existingProduct?.image_path && existingProduct.image_path !== newUpload.path) {
      const { error: oldImageError } = await supabase.storage.from(PRODUCT_IMAGE_BUCKET).remove([existingProduct.image_path]);
      if (oldImageError) console.warn("Product saved, but the old image could not be removed:", oldImageError.message);
    }
    setMessage(saveStatus, editingId ? "Product updated successfully." : "Product added successfully.", "success");
    resetForm();
    await loadProducts();
  } catch (error) {
    if (newUpload?.path) {
      await supabase.storage.from(PRODUCT_IMAGE_BUCKET).remove([newUpload.path]);
    }
    setMessage(saveStatus, `Could not save product: ${error.message}`, "error");
  } finally {
    document.getElementById("saveProductButton").disabled = false;
  }
});

verifySession();
