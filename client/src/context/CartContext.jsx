import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { toast } from 'react-toastify';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const { api, isAuthenticated } = useAuth();
  const [cart, setCart] = useState({ items: [], totalAmount: 0 });
  const [loading, setLoading] = useState(false);
  
  // Fetch cart when user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    } else {
      // Clear cart when logged out
      setCart({ items: [], totalAmount: 0 });
    }
  }, [isAuthenticated]);
  
  // Fetch cart from API
  const fetchCart = async () => {
    if (!isAuthenticated) return;
    
    setLoading(true);
    try {
      console.log('Fetching cart data...');
      const res = await api.get('/cart');
      if (res.data && res.data.success) {
        console.log('Cart fetched successfully:', res.data.data);
        setCart(res.data.data);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
      }
      toast.error('Failed to load your cart. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Add item to cart
  const addToCart = async (productId, quantity = 1) => {
    if (!isAuthenticated) {
      toast.warning('Please login to add items to cart');
      return false;
    }
    setLoading(true);
    try {
      console.log('Adding to cart - Product:', productId, 'Quantity:', quantity);
      if (!productId) {
        toast.error('Invalid product');
        return false;
      }
      if (quantity < 1) {
        quantity = 1;
      }
      const res = await api.post('/cart', { productId, quantity: parseInt(quantity) });
      if (res.data && res.data.success) {
        console.log('Item added to cart successfully:', res.data.data);
        setCart(res.data.data);
        toast.success('Item added to cart!');
        return true;
      } else {
        // Log and show backend error message if present
        const backendMsg = res.data && res.data.message ? res.data.message : 'Something went wrong. Please try again.';
        console.error('Unexpected response format:', res.data);
        toast.error(backendMsg);
        return false;
      }
    } catch (error) {
      // Show backend error message in toast
      if (error.response) {
        console.error('Error response:', error.response.data);
        const errorMessage = error.response.data?.message || 'Failed to add item to cart';
        toast.error('Backend: ' + errorMessage);
      } else if (error.request) {
        console.error('No response received:', error.request);
        toast.error('No response from server. Please check your connection.');
      } else {
        console.error('Error message:', error.message);
        toast.error('Frontend: ' + (error.message || 'Failed to add item to cart. Please try again.'));
      }
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  // Update cart item quantity
  const updateCartItem = async (itemId, quantity) => {
    if (!isAuthenticated) return false;
    
    setLoading(true);
    try {
      console.log('Updating cart item - Item:', itemId, 'Quantity:', quantity);
      
      if (!itemId) {
        toast.error('Invalid item');
        return false;
      }
      
      if (quantity < 1) {
        quantity = 1;
      }
      
      const res = await api.put(`/cart/${itemId}`, { 
        quantity: parseInt(quantity) 
      });
      
      if (res.data && res.data.success) {
        console.log('Cart updated successfully:', res.data.data);
        setCart(res.data.data);
        toast.success('Cart updated!');
        return true;
      }
    } catch (error) {
      console.error('Error updating cart:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
      }
      toast.error('Failed to update cart. Please try again.');
      return false;
    } finally {
      setLoading(false);
    }
    return false;
  };
  
  // Remove item from cart
  const removeCartItem = async (itemId) => {
    if (!isAuthenticated) return false;
    
    setLoading(true);
    try {
      console.log('Removing item from cart - Item:', itemId);
      
      if (!itemId) {
        toast.error('Invalid item');
        return false;
      }
      
      const res = await api.delete(`/cart/${itemId}`);
      if (res.data && res.data.success) {
        console.log('Item removed successfully:', res.data.data);
        setCart(res.data.data);
        toast.success('Item removed from cart!');
        return true;
      }
    } catch (error) {
      console.error('Error removing from cart:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
      }
      toast.error('Failed to remove item. Please try again.');
      return false;
    } finally {
      setLoading(false);
    }
    return false;
  };
  
  // Clear cart
  const clearCart = async () => {
    if (!isAuthenticated) return false;
    
    setLoading(true);
    try {
      console.log('Clearing cart');
      const res = await api.delete('/cart');
      if (res.data && res.data.success) {
        console.log('Cart cleared successfully');
        setCart(res.data.data);
        toast.success('Cart cleared!');
        return true;
      }
    } catch (error) {
      console.error('Error clearing cart:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
      }
      toast.error('Failed to clear cart. Please try again.');
      return false;
    } finally {
      setLoading(false);
    }
    return false;
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        addToCart,
        updateCartItem,
        removeCartItem,
        clearCart,
        fetchCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;