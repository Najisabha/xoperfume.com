"use client"

import { CartItem } from '@/types'
import { createContext, useContext, useReducer, useEffect } from 'react'

type CartState = {
  items: CartItem[]
  total: number
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: { productId: string; variantId: string } }
  | { type: 'UPDATE_QUANTITY'; payload: { productId: string; variantId: string; quantity: number } }
  | { type: 'CLEAR_CART' }

type CartContextType = {
  state: CartState
  addItem: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void
  removeItem: (productId: string, variantId: string) => void
  updateQuantity: (productId: string, variantId: string, quantity: number) => void
  clearCart: () => void
}

const CartContext = createContext<CartContextType | null>(null)

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItemIndex = state.items.findIndex(item => {
        // Check both product ID and variant ID for exact match
        return item._id === action.payload._id &&
          item.selectedVariant._id === action.payload.selectedVariant._id;
      });

      if (existingItemIndex !== -1) {
        // If item with same variant exists, update quantity
        const updatedItems = [...state.items];
        const existingItem = updatedItems[existingItemIndex];

        // Check if adding more would exceed stock
        const newQuantity = existingItem.quantity + (action.payload.quantity || 1);
        if (newQuantity > action.payload?.selectedVariant?.stock) {
          throw new Error('Not enough stock available');
        }

        updatedItems[existingItemIndex] = {
          ...existingItem,
          quantity: newQuantity
        };

        return {
          ...state,
          items: updatedItems,
          total: state.total + (action.payload.selectedVariant.price * (action.payload.quantity || 1))
        };
      }

      // Check if adding new item exceeds stock
      if ((action.payload.quantity || 1) > action.payload?.selectedVariant?.stock) {
        throw new Error('Not enough stock available');
      }

      // If item doesn't exist, add new item
      return {
        ...state,
        items: [...state.items, { ...action.payload, quantity: action.payload.quantity || 1 }],
        total: state.total + (action.payload.selectedVariant.price * (action.payload.quantity || 1))
      };
    }
    case 'REMOVE_ITEM': {
      const item = state.items.find(
        item =>
          item._id === action.payload.productId &&
          item.selectedVariant._id === action.payload.variantId
      )
      return {
        ...state,
        items: state.items.filter(
          item =>
            !(item._id === action.payload.productId &&
              item.selectedVariant._id === action.payload.variantId)
        ),
        total: state.total - (item ? item.selectedVariant.price * item.quantity : 0)
      }
    }
    case 'UPDATE_QUANTITY': {
      const existingItem = state.items.find(
        item =>
          item._id === action.payload.productId &&
          item.selectedVariant._id === action.payload.variantId
      )
      if (!existingItem) return state

      const quantityDiff = action.payload.quantity - existingItem.quantity

      return {
        ...state,
        items: state.items.map(item =>
          (item._id === action.payload.productId &&
            item.selectedVariant._id === action.payload.variantId)
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
        total: state.total + (existingItem.selectedVariant.price * quantityDiff)
      }
    }
    case 'CLEAR_CART':
      return { items: [], total: 0 }
    default:
      return state
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [], total: 0 })

  useEffect(() => {
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      const { items } = JSON.parse(savedCart)
      items?.forEach((item: CartItem) => {
        dispatch({ type: 'ADD_ITEM', payload: item })
      })
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(state))
  }, [state])

  const addItem = (item: Omit<CartItem, "quantity"> & { quantity?: number }) => {
    try {
      // Validate stock before adding
      if (item.selectedVariant.stockStatus === 'out_of_stock') {
        throw new Error('Item is out of stock');
      }

      dispatch({
        type: 'ADD_ITEM',
        payload: { ...item, quantity: item.quantity || 1 }
      });

      return true; // Return success
    } catch (error) {
      console.error('Error adding item to cart:', error);
      throw error; // Re-throw to be handled by components
    }
  };

  const removeItem = (productId: string, variantId: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { productId, variantId } })
  }

  const updateQuantity = (productId: string, variantId: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { productId, variantId, quantity } })
  }

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' })
  }

  return (
    <CartContext.Provider
      value={{ state, addItem, removeItem, updateQuantity, clearCart }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}