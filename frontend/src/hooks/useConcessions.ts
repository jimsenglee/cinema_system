import { useState, useCallback, useMemo } from "react";
import { concessionItems, type ConcessionItem } from "@/data/mockData";

/**
 * Cart item with quantity and item reference
 */
export interface CartItem {
  item: ConcessionItem;
  quantity: number;
}

/**
 * Custom hook for managing concessions cart and operations
 * 
 * Features:
 * - Add/remove/update items in cart
 * - Calculate total price
 * - Filter by category
 * - Search functionality
 * 
 * @example
 * const { cart, addToCart, removeFromCart, totalPrice } = useConcessions();
 * addToCart("ci1"); // Add popcorn
 */
export function useConcessions() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  /**
   * Add item to cart or increment quantity if exists
   */
  const addToCart = useCallback((itemId: string) => {
    const item = concessionItems.find(i => i.id === itemId);
    if (!item || !item.isAvailable) return;

    setCart(prevCart => {
      const existingItem = prevCart.find(ci => ci.item.id === itemId);
      
      if (existingItem) {
        // Increment quantity
        return prevCart.map(ci => 
          ci.item.id === itemId 
            ? { ...ci, quantity: ci.quantity + 1 }
            : ci
        );
      } else {
        // Add new item
        return [...prevCart, { item, quantity: 1 }];
      }
    });
  }, []);

  /**
   * Remove item from cart completely
   */
  const removeFromCart = useCallback((itemId: string) => {
    setCart(prevCart => prevCart.filter(ci => ci.item.id !== itemId));
  }, []);

  /**
   * Update item quantity (or remove if quantity = 0)
   */
  const updateQuantity = useCallback((itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }

    setCart(prevCart => 
      prevCart.map(ci => 
        ci.item.id === itemId 
          ? { ...ci, quantity }
          : ci
      )
    );
  }, [removeFromCart]);

  /**
   * Clear entire cart
   */
  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  /**
   * Get quantity of specific item in cart
   */
  const getItemQuantity = useCallback((itemId: string): number => {
    const cartItem = cart.find(ci => ci.item.id === itemId);
    return cartItem ? cartItem.quantity : 0;
  }, [cart]);

  /**
   * Calculate total price of all items in cart
   */
  const totalPrice = useMemo(() => {
    return cart.reduce((sum, ci) => sum + (ci.item.price * ci.quantity), 0);
  }, [cart]);

  /**
   * Calculate total number of items in cart
   */
  const totalItems = useMemo(() => {
    return cart.reduce((sum, ci) => sum + ci.quantity, 0);
  }, [cart]);

  /**
   * Filter concession items by category
   */
  const filteredItems = useMemo(() => {
    let filtered = concessionItems.filter(item => item.isAvailable);

    // Filter by category
    if (selectedCategory !== "All") {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [selectedCategory, searchQuery]);

  /**
   * Get all available categories
   */
  const categories = useMemo(() => {
    const cats = new Set(concessionItems.map(item => item.category));
    return ["All", ...Array.from(cats)];
  }, []);

  /**
   * Check if cart is empty
   */
  const isCartEmpty = useMemo(() => cart.length === 0, [cart]);

  return {
    // Cart state
    cart,
    isCartEmpty,
    totalPrice,
    totalItems,
    
    // Cart actions
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getItemQuantity,
    
    // Filtering
    filteredItems,
    categories,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
  };
}
