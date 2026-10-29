import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem('canteen_cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [notes, setNotes] = useState('');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('canteen_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addItem = (item) => {
    setCartItems((prev) => {
      const existing = prev.find((ci) => ci.item.id === item.id);
      if (existing) {
        return prev.map((ci) =>
          ci.item.id === item.id ? { ...ci, quantity: ci.quantity + 1 } : ci
        );
      }
      return [...prev, { item, quantity: 1 }];
    });
  };

  const removeItem = (itemId) => {
    setCartItems((prev) => {
      const existing = prev.find((ci) => ci.item.id === itemId);
      if (existing && existing.quantity > 1) {
        return prev.map((ci) =>
          ci.item.id === itemId ? { ...ci, quantity: ci.quantity - 1 } : ci
        );
      }
      return prev.filter((ci) => ci.item.id !== itemId);
    });
  };

  const deleteItem = (itemId) => {
    setCartItems((prev) => prev.filter((ci) => ci.item.id !== itemId));
  };

  const clearCart = () => {
    setCartItems([]);
    setNotes('');
  };

  const totalAmount = cartItems.reduce(
    (sum, ci) => sum + ci.item.price * ci.quantity,
    0
  );

  const totalCount = cartItems.reduce((sum, ci) => sum + ci.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addItem,
        removeItem,
        deleteItem,
        clearCart,
        totalAmount: Math.round(totalAmount * 100) / 100,
        totalCount,
        notes,
        setNotes,
        isDrawerOpen,
        setIsDrawerOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
