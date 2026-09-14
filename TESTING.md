# Manual Testing Checklist

Automated tests (`cd server && npm test`) cover auth logic, middleware, cart stock
validation, and order total math using mocked models — no database required.

The flows below touch a real MongoDB and must be run locally with `npm run dev`
in both `server/` and `client/` (see README for setup). Check each box as you verify it.

## Authentication
- [ ] Register a new account → redirected in, cookie set
- [ ] Register with an already-used email → clear error, no duplicate created
- [ ] Login with correct credentials → succeeds
- [ ] Login with wrong password → "Invalid email or password" (not "wrong password" — don't leak which field)
- [ ] Refresh the page while logged in → session persists (GET /auth/me works)
- [ ] Logout → cookie cleared, protected pages redirect to /login

## Products
- [ ] Product listing loads and paginates
- [ ] Search returns relevant results; nonsense query shows empty state
- [ ] Category, price, and rating filters narrow results correctly
- [ ] Each sort option changes order as expected
- [ ] Product details page loads; invalid ID shows a 404-style message
- [ ] Out-of-stock product disables Add to Cart / Buy Now

## Cart
- [ ] Add to cart as a guest → persists across page refresh (localStorage)
- [ ] Log in with items in the guest cart → items merge into the account cart
- [ ] Increase/decrease quantity; cannot exceed stock or go below 1
- [ ] Remove an item; cart updates immediately
- [ ] Empty cart shows the empty state, not a blank page

## Checkout & Orders
- [ ] Checkout with an empty cart is blocked (redirected / empty state)
- [ ] Submitting incomplete shipping info shows field-level errors
- [ ] Valid checkout creates an order, reduces product stock, and clears the cart
- [ ] Order confirmation shows correct totals (compare to cart subtotal + shipping + tax)
- [ ] "My Orders" lists the new order; "Order Details" matches what was purchased

## Admin
- [ ] A customer account cannot open /admin (redirected)
- [ ] Admin can create, edit, and delete a product
- [ ] Deleting a product asks for confirmation first
- [ ] Admin can change an order's status; customer sees the updated status
- [ ] Dashboard numbers (orders, revenue, users) match what's actually in the DB
- [ ] Low-stock list shows products at or below the threshold

## Authorization boundaries
- [ ] A logged-out user hitting a protected API route directly gets 401, not a crash
- [ ] User A cannot view User B's order by guessing the order ID (gets 403)
- [ ] Customer cannot hit admin-only endpoints (POST/PUT/DELETE /api/products, /api/admin/*) — gets 403

## Responsive
- [ ] Navbar collapses to the mobile menu below ~768px
- [ ] Product grid: 4 cols desktop → fewer on tablet/mobile
- [ ] Admin tables scroll horizontally on narrow screens instead of breaking layout
- [ ] Checkout form fields stack on mobile and remain usable
