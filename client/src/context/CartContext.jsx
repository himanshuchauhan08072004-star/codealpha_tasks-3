import { createContext, useState, useEffect, useCallback, useContext } from 'react';
import toast from 'react-hot-toast';
import { AuthContext } from './AuthContext';
import {
  fetchCart,
  addCartItem,
  updateCartItemQty,
  removeCartItemApi,
  clearCartApi,
} from '../services/cartService';

export const CartContext = createContext(null);
const GUEST_CART_KEY = 'shopsphere_guest_cart';

const readGuestCart = () => {
  try {
    return JSON.parse(localStorage.getItem(GUEST_CART_KEY)) || [];
  } catch {
    return [];
  }
};
const writeGuestCart = (items) => localStorage.setItem(GUEST_CART_KEY, JSON.stringify(items));

export function CartProvider({ children }) {
  const { user, loading: authLoading } = useContext(AuthContext);
  const [items, setItems] = useState([]); // [{ product, quantity }]
  const [loading, setLoading] = useState(true);

  // Load cart: backend if logged in, localStorage if guest. Merge guest->backend on login.
  useEffect(() => {
    if (authLoading) return;

    const load = async () => {
      setLoading(true);
      if (user) {
        const guestItems = readGuestCart();
        try {
          if (guestItems.length > 0) {
            for (const g of guestItems) {
              await addCartItem(g.product._id, g.quantity).catch(() => {});
            }
            localStorage.removeItem(GUEST_CART_KEY);
          }
          const res = await fetchCart();
          setItems(res.data.items || []);
        } catch {
          setItems([]);
        }
      } else {
        setItems(readGuestCart());
      }
      setLoading(false);
    };

    load();
  }, [user, authLoading]);

  const addItem = useCallback(
    async (product, quantity = 1) => {
      if (user) {
        try {
          const res = await addCartItem(product._id, quantity);
          setItems(res.data.items);
          toast.success(`${product.name} added to cart`);
        } catch (err) {
          toast.error(err.response?.data?.message || 'Could not add to cart');
        }
      } else {
        setItems((prev) => {
          const existing = prev.find((i) => i.product._id === product._id);
          let next;
          if (existing) {
            const newQty = existing.quantity + quantity;
            if (newQty > product.stock) {
              toast.error(`Only ${product.stock} units available`);
              return prev;
            }
            next = prev.map((i) =>
              i.product._id === product._id ? { ...i, quantity: newQty } : i
            );
          } else {
            next = [...prev, { product, quantity }];
          }
          writeGuestCart(next);
          toast.success(`${product.name} added to cart`);
          return next;
        });
      }
    },
    [user]
  );

  const updateQuantity = useCallback(
    async (productId, quantity) => {
      if (quantity < 1) return;
      if (user) {
        try {
          const res = await updateCartItemQty(productId, quantity);
          setItems(res.data.items);
        } catch (err) {
          toast.error(err.response?.data?.message || 'Could not update quantity');
        }
      } else {
        setItems((prev) => {
          const next = prev.map((i) =>
            i.product._id === productId
              ? { ...i, quantity: Math.min(quantity, i.product.stock) }
              : i
          );
          writeGuestCart(next);
          return next;
        });
      }
    },
    [user]
  );

  const removeItem = useCallback(
    async (productId) => {
      if (user) {
        try {
          const res = await removeCartItemApi(productId);
          setItems(res.data.items);
        } catch (err) {
          toast.error(err.response?.data?.message || 'Could not remove item');
        }
      } else {
        setItems((prev) => {
          const next = prev.filter((i) => i.product._id !== productId);
          writeGuestCart(next);
          return next;
        });
      }
    },
    [user]
  );

  const clearCart = useCallback(async () => {
    if (user) {
      await clearCartApi().catch(() => {});
    } else {
      localStorage.removeItem(GUEST_CART_KEY);
    }
    setItems([]);
  }, [user]);

  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, loading, itemCount, subtotal, addItem, updateQuantity, removeItem, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
}
