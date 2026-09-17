import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../api/client';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);
const LOCAL_CART_KEY = 'tfs_guest_cart_v1';

export function CartProvider({ children }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem(LOCAL_CART_KEY);
      return saved ? JSON.parse(saved) : { items: [] };
    } catch {
      return { items: [] };
    }
  });
  const [loading, setLoading] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const requireAuth = useCallback(() => {
    if (user) return true;
    toast('Please log in to use your shopping bag.');
    navigate('/login', { state: { from: location.pathname + location.search } });
    return false;
  }, [location.pathname, location.search, navigate, user]);

  const openCartDrawer = () => {
    if (requireAuth()) setIsDrawerOpen(true);
  };
  const closeCartDrawer = () => setIsDrawerOpen(false);
  const toggleCartDrawer = () => setIsDrawerOpen((prev) => !prev);

  // Sync to localStorage for guests
  useEffect(() => {
    if (!user) {
      try {
        localStorage.setItem(LOCAL_CART_KEY, JSON.stringify(cart));
      } catch {
        // ignore storage errors
      }
    }
  }, [cart, user]);

  // Remove offline fallback cards from a guest cart once the API is available.
  useEffect(() => {
    if (user) return;
    setCart((prev) => {
      const items = (prev.items || []).filter((item) => {
        const productId = item.product?._id || item.product;
        return /^[0-9a-fA-F]{24}$/.test(String(productId));
      });
      return items.length === (prev.items || []).length ? prev : { ...prev, items };
    });
  }, [user]);

  const refreshCart = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await api.get('/cart');
      setCart(res.data);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Sync local cart to server when user logs in
  useEffect(() => {
    if (user) {
      const saved = localStorage.getItem(LOCAL_CART_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed.items && parsed.items.length > 0) {
            Promise.all(
              parsed.items.map((i) =>
                api.post('/cart/items', {
                  productId: i.product?._id || i.product,
                  variantId: i.variantId,
                  quantity: i.quantity,
                }).catch(() => null)
              )
            ).then(() => {
              localStorage.removeItem(LOCAL_CART_KEY);
              refreshCart();
            });
            return;
          }
        } catch {
          // ignore
        }
      }
      refreshCart();
    }
  }, [user, refreshCart]);

  const addToCart = async (productId, variantId, quantity = 1, productSnapshot = null) => {
    if (!requireAuth()) return false;

    try {
      const res = await api.post('/cart/items', { productId, variantId, quantity });
      setCart(res.data);
      toast.success('Added to bag!');
      setIsDrawerOpen(true);
      return true;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not add to cart');
      return false;
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    if (user) {
      try {
        const res = await api.put(`/cart/items/${itemId}`, { quantity });
        setCart(res.data);
      } catch {
        toast.error('Could not update quantity');
      }
      return;
    }

    // Guest update
    setCart((prev) => {
      let items = [...(prev.items || [])];
      if (quantity <= 0) {
        items = items.filter((i) => i._id !== itemId && i.variantId !== itemId);
      } else {
        items = items.map((i) => (i._id === itemId || i.variantId === itemId ? { ...i, quantity } : i));
      }
      return { ...prev, items };
    });
  };

  const removeItem = async (itemId) => {
    if (user) {
      try {
        const res = await api.delete(`/cart/items/${itemId}`);
        setCart(res.data);
        toast.success('Removed from bag');
      } catch {
        toast.error('Could not remove item');
      }
      return;
    }

    // Guest remove
    setCart((prev) => ({
      ...prev,
      items: (prev.items || []).filter((i) => i._id !== itemId && i.variantId !== itemId),
    }));
    toast.success('Removed from bag');
  };

  const clearCart = async () => {
    if (user) {
      await api.delete('/cart').catch(() => null);
    }
    setCart({ items: [] });
    localStorage.removeItem(LOCAL_CART_KEY);
  };

  const itemCount = cart.items?.reduce((sum, i) => sum + (i.quantity || 0), 0) || 0;
  const subtotal = cart.items?.reduce((sum, i) => sum + (i.priceAtAdd || i.product?.price || 0) * i.quantity, 0) || 0;
  const freeShippingThreshold = 3000;
  const freeShippingLeft = Math.max(0, freeShippingThreshold - subtotal);
  const freeShippingPercent = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        itemCount,
        subtotal,
        freeShippingThreshold,
        freeShippingLeft,
        freeShippingPercent,
        isDrawerOpen,
        openCartDrawer,
        requireAuth,
        closeCartDrawer,
        toggleCartDrawer,
        addToCart,
        updateQuantity,
        removeItem,
        clearCart,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
