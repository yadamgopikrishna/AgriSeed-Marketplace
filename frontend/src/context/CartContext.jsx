import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem('agriseed_cart');
    return saved ? JSON.parse(saved) : [
      {
        id: 'prod_1',
        name: 'Pusa Basmati 1121 Paddy Seeds (Certified Lot)',
        category: 'Seeds',
        packSize: '10 kg Bag',
        price: 850,
        quantity: 2,
        imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80',
        cropSuitability: 'Paddy / Rice'
      }
    ];
  });

  const [appliedCoupon, setAppliedCoupon] = useState('KISAN50'); // Default 10% Kisan Subsidy
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('agriseed_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, packSize = null, quantity = 1) => {
    const selectedPack = packSize || (product.packSizes && product.packSizes[0]?.size) || product.unit;
    const selectedPrice = product.packSizes
      ? (product.packSizes.find(p => p.size === selectedPack)?.price || product.price)
      : product.price;

    setCartItems(prev => {
      const existingIndex = prev.findIndex(item => item.id === product.id && item.packSize === selectedPack);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        return [
          ...prev,
          {
            id: product.id,
            name: product.name,
            category: product.category,
            packSize: selectedPack,
            price: selectedPrice,
            quantity: quantity,
            imageUrl: product.imageUrl,
            cropSuitability: product.cropSuitability
          }
        ];
      }
    });
  };

  const updateQuantity = (productId, packSize, delta) => {
    setCartItems(prev =>
      prev
        .map(item => {
          if (item.id === productId && item.packSize === packSize) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const removeItem = (productId, packSize) => {
    setCartItems(prev => prev.filter(item => !(item.id === productId && item.packSize === packSize)));
  };

  const clearCart = () => {
    setCartItems([]);
    setAppliedCoupon('');
  };

  const applyCoupon = (code) => {
    const clean = code.trim().toUpperCase();
    if (clean === 'KISAN50') {
      setAppliedCoupon('KISAN50');
      return { success: true, message: '✅ 10% Direct Kisan Subsidy Applied!' };
    } else if (clean === 'AGRISEED100') {
      setAppliedCoupon('AGRISEED100');
      return { success: true, message: '✅ Flat ₹100 Agricultural Discount Applied!' };
    } else {
      return { success: false, message: '❌ Invalid Coupon. Try: KISAN50 or AGRISEED100' };
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon('');
  };

  // Calculations
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalItemsCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  let discount = 0;
  if (appliedCoupon === 'KISAN50') {
    discount = Math.round(subtotal * 0.10);
  } else if (appliedCoupon === 'AGRISEED100') {
    discount = Math.min(100, subtotal);
  }

  // Free delivery threshold: orders above ₹999 get free rural delivery
  const freeShippingThreshold = 999;
  const deliveryFee = subtotal >= freeShippingThreshold || subtotal === 0 ? 0 : 70;
  const totalAmount = Math.max(0, subtotal - discount + deliveryFee);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        updateQuantity,
        removeItem,
        clearCart,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        subtotal,
        discount,
        deliveryFee,
        totalAmount,
        totalItemsCount,
        freeShippingThreshold,
        isCartDrawerOpen,
        setIsCartDrawerOpen
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
