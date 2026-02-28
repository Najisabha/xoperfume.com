import { Product } from "./index"

export interface SearchResponse {
  products: Product[]
  error?: string
}

export interface SearchResult {
  products: Product[]
  isLoading: boolean
  error?: string
}
