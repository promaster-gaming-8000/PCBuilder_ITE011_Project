PCBUILDERS SUPABASE STOREFRONT STARTER
=====================================

This version replaces Firebase + Cloudinary with Supabase for the product database, admin sign-in, and product image hosting. The code uses Supabase's browser JavaScript module from a CDN, so it does not require Firebase or the Supabase npm package.

IMPORTANT: This is a MERGE into your existing PCBuilders folder, not a replacement for your images and fonts. Keep your existing folders and files such as images/, font/, logo/, svg/, assets/, main_three.js and any other assets your original site uses. Keep your original style.css and ui.css if you prefer them; the included storefront.css adds the styling needed for the new pages and product components. The HTML files load style.css, ui.css and storefront.css in that order.

FILES
-----
index.html              Existing-style homepage with product deals and Top Items populated from Supabase.
discover.html           Searchable product catalog loaded from Supabase.
product.html            Product detail page with quantity selection and Add to Cart / Buy Now.
cart.html               Browser-local cart with quantity controls and subtotal.
admin.html              Admin sign-in and product management interface, including image upload.
supabase-config.js      Supabase URL/key configuration (fill in before running).
schema.sql              SQL table, row-level security, admin access function and image storage policies.
store.js                Shared product, card, and local-cart functions.
discover.js             Catalog loading and search.
home-products.js        Homepage deals and Top Items loading.
product.js              Product details and add-to-cart handlers.
cart.js                 Cart display and local quantity controls.
cart-count.js           Updates the header cart count.
admin.js                Admin authentication, product CRUD, and image upload/deletion.
script.js               Announcement bar and two-row customer-review marquees.
storefront.css          Styles for catalog, product details, cart and admin screens.

SUPABASE FREE TIER NOTES
------------------------
Supabase's published free limits include 500 MB database size per project, 1 GB file storage, up to 50 MB per file upload, 50,000 monthly active users for Auth, and 5 GB cached + 5 GB uncached egress/bandwidth. Free projects may pause after a week of inactivity. Limits and plan details can change; check https://supabase.com/pricing and https://supabase.com/docs/guides/platform/billing-on-supabase.

SETUP (DO THESE IN ORDER)
-------------------------
1. Create a Supabase project at https://supabase.com/dashboard. Keep it on the Free plan to start.

2. Open Project Settings / API (or the project's Connect/API settings) and copy:
   - Project URL
   - Publishable key (or the legacy anon/public key)
   Paste them into supabase-config.js:
     SUPABASE_URL = "https://YOUR_PROJECT_REF.supabase.co"
     SUPABASE_PUBLISHABLE_KEY = "YOUR_SUPABASE_PUBLISHABLE_OR_ANON_KEY"
   Only use a publishable/anon key in browser code. NEVER paste a secret key or service_role key into any HTML or JavaScript file.

3. In Supabase Dashboard -> Storage, create a bucket named exactly:
     product-images
   Set it to PUBLIC so product images can be displayed without signing in. Set the file size limit to 50 MB (or smaller), and allow these image MIME types: image/jpeg, image/png, image/webp, image/gif.
   Public means visitors can view the product images. The SQL below restricts uploading, replacing and deleting images to the administrator.

4. Open SQL Editor -> New query. Paste all of schema.sql and run it. This creates the products table, the private admin-user allowlist, security policies, and the upload policies for the product-images bucket.

5. Create your admin login in Authentication -> Users -> Add user. Use your own admin email and a strong password. This starter intentionally does not include public sign-up.

6. Copy the admin user's UUID from Authentication -> Users. In SQL Editor, run the following with your actual UUID:

   insert into public.admin_users (user_id)
   values ('PASTE-ADMIN-USER-UUID-HERE')
   on conflict (user_id) do nothing;

   Only users whose UUID appears in public.admin_users can create or edit products and upload images. Do not allow public inserts into admin_users.

7. In Authentication settings, keep email/password sign-in enabled. If email confirmation is enabled, confirm the admin email before signing in.

8. Merge these files into your existing PCBuilders project directory. Preserve the existing images/, font/, logo/, svg/ and assets/ folders. Add/keep storefront.css. The HTML pages use your existing style.css and ui.css plus storefront.css.

9. Start a local HTTP server. In VS Code, use Live Server, or in PowerShell from your project folder run:
     python -m http.server 5500
   Then open http://localhost:5500. Do not open the pages as file:// URLs because ES modules and authentication storage require an HTTP/HTTPS origin.

10. Open admin.html and sign in. Add a product name, category, price, stock, description, optional specifications, optional deal label, and optionally mark it as a Top Item. Choose an image file and save. The image uploads to Supabase Storage; its public URL and product data are saved in the products table.

PRODUCT DISPLAY RULES
---------------------
- Active = on: product appears in Discover and can be opened by visitors.
- Is Top Item = on: product may appear in the homepage Top Items row (up to five items).
- Deal label non-empty: product may appear in Limited Time Deals (up to three items).
- Inactive products can be edited from the admin page, but are hidden from the public catalog.
- The shopping cart is stored in the current browser/device using localStorage.

IMPORTANT SECURITY NOTES
------------------------
- Never expose a Supabase secret or service_role key in frontend files.
- The `public.admin_users` table is the administrator allowlist. Add the admin UUID manually using SQL Editor. Do not add an admin-management UI that lets normal users change this table.
- The `product-images` bucket is public for image delivery, but write policies require an authenticated admin.
- Public product data and public images can be viewed by visitors, as intended for a storefront.
- The cart is only a frontend prototype. Checkout does not create an order, reserve stock, or take payment. Before real transactions, implement server-side price/stock validation and a secure order flow.

CURRENT PROJECT'S FIREBASE INSTALL
----------------------------------
Your previous `npm.cmd install firebase` is not used by this Supabase version. You may leave it installed; it will not affect these pages. If you want to remove it later, `npm.cmd uninstall firebase` removes the package from the npm project, but it is not required for this site to work. This starter uses the CDN module import in supabase-config.js, so no npm install is needed for Supabase.
