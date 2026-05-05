import React, { createContext, useContext, useState, useEffect } from 'react';
import { OrderItem, Cake } from '../types';

interface CartContextType {
  items: OrderItem[];
  addToCart: (item: OrderItem) => void;
  updateCartItem: (cakeId: string, updates: Partial<OrderItem>) => void;
  removeFromCart: (cakeId: string, flavor?: string, weight?: number) => void;
  clearCart: () => void;
  total: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<OrderItem[]>(() => {
    const saved = localStorage.getItem('mamaj_cart');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('mamaj_cart', JSON.stringify(items));
  }, [items]);

  const addToCart = (newItem: OrderItem) => {
    setItems(prev => {
      const existingIndex = prev.findIndex(item => 
        item.cakeId === newItem.cakeId && 
        item.flavor === newItem.flavor && 
        item.weight === newItem.weight &&
        JSON.stringify(item.themeColors) === JSON.stringify(newItem.themeColors) &&
        item.customMessage === newItem.customMessage
      );

      if (existingIndex > -1) {
        const updatedItems = [...prev];
        updatedItems[existingIndex].quantity += newItem.quantity;
        return updatedItems;
      }
      return [...prev, newItem];
    });
  };

  const updateCartItem = (cakeId: string, updates: Partial<OrderItem>) => {
    setItems(prev => prev.map(item => 
      item.cakeId === cakeId ? { ...item, ...updates } : item
    ));
  };

  const removeFromCart = (cakeId: string, flavor?: string, weight?: number) => {
    setItems(prev => prev.filter(item => 
      !(item.cakeId === cakeId && item.flavor === flavor && item.weight === weight)
    ));
  };

  const clearCart = () => setItems([]);

  const total = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);


  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, clearCart, total }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
}
