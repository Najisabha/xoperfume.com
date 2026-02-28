"use client"

import { createContext, useContext, useReducer, useEffect } from 'react'
import { Product } from '@/types'

type WishlistState = {
  items: Product[]
}

type WishlistAction =
  | { type: 'ADD_ITEM'; payload: Product }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'CLEAR_WISHLIST' }

type WishlistContextType = {
  state: WishlistState
  addItem: (item: Product) => void
  removeItem: (id: string) => void
  clearWishlist: () => void
  isInWishlist: (id: string) => boolean
}

const WishlistContext = createContext<WishlistContextType | null>(null)

function wishlistReducer(state: WishlistState, action: WishlistAction): WishlistState {
  switch (action.type) {
    case 'ADD_ITEM': {
      if (state.items.find(item => item._id === action.payload._id)) {
        return state
      }
      return {
        ...state,
        items: [...state.items, action.payload]
      }
    }
    case 'REMOVE_ITEM': {
      return {
        ...state,
        items: state.items.filter(item => item._id !== action.payload)
      }
    }
    case 'CLEAR_WISHLIST':
      return { items: [] }
    default:
      return state
  }
}

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(wishlistReducer, { items: [] })

  useEffect(() => {
    const savedWishlist = localStorage.getItem('wishlist')
    if (savedWishlist) {
      const { items } = JSON.parse(savedWishlist)
      items?.forEach((item: Product) => {
        dispatch({ type: 'ADD_ITEM', payload: item })
      })
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(state))
  }, [state])

  const addItem = (item: Product) => {
    dispatch({ type: 'ADD_ITEM', payload: item })
  }

  const removeItem = (id: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id })
  }

  const clearWishlist = () => {
    dispatch({ type: 'CLEAR_WISHLIST' })
  }

  const isInWishlist = (id: string) => {
    return state.items.some(item => item._id === id)
  }

  return (
    <WishlistContext.Provider
      value={{ state, addItem, removeItem, clearWishlist, isInWishlist }}
    >
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const context = useContext(WishlistContext)
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider')
  }
  return context
}