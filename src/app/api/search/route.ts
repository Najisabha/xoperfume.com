import { NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/db"
import { Product } from "@/lib/models/product"
import { SearchResponse } from "@/types/search"
import { Product as ProductType } from "@/types"

// Helper function to normalize text for better searching
const normalizeText = (text: string): string => {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/[^a-z0-9\s]/g, '') // Remove special characters
    .trim();
};

export async function GET(req: NextRequest): Promise<NextResponse<SearchResponse>> {
  try {
    await connectDB();
    const searchParams = req.nextUrl.searchParams;
    const query = searchParams.get('q');
    const category = searchParams.get('category');

    if (!query) {
      return NextResponse.json(
        { products: [], error: "Search query is required" },
        { status: 400 }
      );
    }

    // Split search terms and normalize them
    const searchTerms = normalizeText(query).split(/\s+/).filter(term => term.length > 0);

    // Build search conditions
    const searchConditions = searchTerms.map(term => ({
      $or: [
        { name: { $regex: term, $options: 'i' } },
        { name_ar: { $regex: term, $options: 'i' } },
        { name_he: { $regex: term, $options: 'i' } },
        { 'variants.sku': { $regex: term, $options: 'i' } },
        { description: { $regex: term, $options: 'i' } },
        { description_ar: { $regex: term, $options: 'i' } },
        { description_he: { $regex: term, $options: 'i' } },
        { 'category.name': { $regex: term, $options: 'i' } },
        { 'category.name_ar': { $regex: term, $options: 'i' } },
        { 'category.name_he': { $regex: term, $options: 'i' } }
      ]
    }));

    // Base query
    const baseQuery: any = {
      $and: searchConditions
    };

    // Add category filter if provided
    if (category) {
      baseQuery.category = category;
    }

    const products = await Product.find(baseQuery)
      .populate('category')
      .sort({
        'variants.stock': -1, // Prioritize in-stock products
        name: 1 // Then sort alphabetically
      })
      .limit(10)
      .lean()
      .exec() as unknown as ProductType[];

    // Calculate relevance score for better sorting
    const scoredProducts = products.map(product => {
      let score = 0;
      const normalizedName = normalizeText(product.name);

      // Increase score based on term matches in name (all langs)
      searchTerms.forEach(term => {
        if (normalizedName.includes(term)) score += 2;
        if (product.name_ar && normalizeText(product.name_ar).includes(term)) score += 2;
        if (product.name_he && normalizeText(product.name_he).includes(term)) score += 2;
      });

      // Increase score for in-stock products
      const totalStock = product.variants.reduce((sum, v) => sum + (v.stock || 0), 0);
      if (totalStock > 0) score += 1;

      return { ...product, _score: score };
    });

    // Sort by score
    const sortedProducts = scoredProducts
      .sort((a, b) => b._score - a._score)
      .map(({ _score, ...product }) => product);

    return NextResponse.json({ products: sortedProducts });

  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { products: [], error: "Failed to search products" },
      { status: 500 }
    );
  }
}
