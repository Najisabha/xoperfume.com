import { NextResponse } from 'next/server';
import * as XLSX from 'xlsx';
import { Product } from '@/lib/models/product';
import { Category } from '@/lib/models/category';
import connectDB from '@/lib/db';

interface ProductGroup {
    baseName: string;
    category: any;
    description: string;
    variants: {
        goldColour: string;
        enamelColour: string;
        stones: string;
    }[];
}

export async function POST(req: Request) {
    try {
        await connectDB();

        // Handle file upload
        const formData = await req.formData();
        const file = formData.get('file') as File;
        
        if (!file) {
            return NextResponse.json({ 
                success: false, 
                error: 'No file uploaded' 
            }, { status: 400 });
        }

        // Convert File to Buffer
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Read from buffer instead of file
        const workbook = XLSX.read(buffer, { type: 'buffer' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const data: {
            'Product Name': string;
            'Article': string;
            'Stones': string;
            'Gold Colour': string;
            'Enamel Colour': string;
            'Description': string;
        }[] = XLSX.utils.sheet_to_json(worksheet);

        // Limit to first 5 products
        const limitedData = data;

        // Group products by base name
        const productGroups = new Map<string, ProductGroup>();

        for (const row of limitedData) {
            const {
                'Product Name': fullProductName,
                'Article': articleCategory,
                'Stones': stones,
                'Gold Colour': goldColour,
                'Enamel Colour': enamelColour,
                'Description': description
            } = row;

            // Clean and normalize the product name
            const baseName = fullProductName.split('Earrings').join('').split('Bracelet').join('').trim();

            if (!productGroups.has(baseName)) {
                // Try to find specific category first
                let category = await Category.findOne({
                    name: { $regex: new RegExp(articleCategory, 'i') }
                });

                // If category not found, fall back to "hoops-charms"
                if (!category) {
                    console.log(`Category not found for: ${articleCategory}, falling back to hoops-charms`);
                    category = await Category.findOne({ slug: 'hoops-charms' });
                    
                    if (!category) {
                        console.log('Fallback category not found either, skipping product');
                        continue;
                    }
                }

                productGroups.set(baseName, {
                    baseName,
                    category,
                    description,
                    variants: []
                });
            }

            // Add variant to the group with validation
            const group = productGroups.get(baseName)!;
            const normalizedStones = String(stones || '').trim().toLowerCase();
            const normalizedGoldColour = String(goldColour || '').trim();
            const normalizedEnamelColour = String(enamelColour || '').trim();

            group.variants.push({
                goldColour: normalizedGoldColour === 'none' ? '' : normalizedGoldColour,
                enamelColour: normalizedEnamelColour === 'none' ? '' : normalizedEnamelColour,
                stones: normalizedStones === 'none' ? '' : normalizedStones
            });
        }

        // Create products from groups
        for (const [_, group] of productGroups) {
            // Group variants by gold colour
            const variantsByGold = new Map<string, Map<string, string[]>>();
            
            group.variants.forEach(variant => {
                if (!variantsByGold.has(variant.goldColour)) {
                    variantsByGold.set(variant.goldColour, new Map());
                }
                
                const goldVariants = variantsByGold.get(variant.goldColour)!;
                
                // Group by stones
                if (!goldVariants.has(variant.stones)) {
                    goldVariants.set(variant.stones, []);
                }
                
                // Add enamel colour if not already present
                if (!goldVariants.get(variant.stones)?.includes(variant.enamelColour)) {
                    goldVariants.get(variant.stones)?.push(variant.enamelColour);
                }
            });

            // Create a product for each gold colour
            for (const [goldColour, stoneVariants] of variantsByGold) {
                const slug = `${group.baseName}-${goldColour}`.toLowerCase()
                    .replace(/['"]/g, '')
                    .replace(/[^a-z0-9]+/g, '-')
                    .replace(/(^-|-$)+/g, '');

                // Check if product exists
                const existingProduct = await Product.findOne({ slug });
                if (existingProduct) {
                    console.log(`Product already exists with slug: ${slug}`);
                    continue;
                }

                // Create variants combining stones and enamel colours
                const variants = [];
                for (const [stone, enamelColours] of stoneVariants) {
                    for (const enamelColour of enamelColours) {
                        const variantData: any = {
                            sku: `${group.baseName}-${goldColour}`
                                .toUpperCase()
                                .replace(/['"]/g, '')
                                .replace(/\s+/g, '-'),
                            size: goldColour,
                            price: 0,
                            stock: 20,
                            images: [],
                            description: group.description,
                            stockStatus: 'in_stock'
                        };

                        // Only add non-empty values
                        if (enamelColour) variantData.color = enamelColour;
                        if (stone) variantData.caratSize = stone;

                        // Add stone and enamel color to SKU only if they exist
                        if (stone) variantData.sku += `-${stone}`;
                        if (enamelColour) variantData.sku += `-${enamelColour}`;

                        variants.push(variantData);
                    }
                }

                // Create the product
                const product = await Product.create({
                    name: `${group.baseName} ${goldColour}`.trim(),
                    basePrice: 0,
                    slug,
                    category: group.category._id,
                    variants,
                    description: group.description
                });

                console.log('New product created:', product.name);
            }
        }

        return NextResponse.json({
            success: true,
            message: 'products imported successfully'
        });

    } catch (error: any) {
        console.error('Import error:', error);
        return NextResponse.json({
            success: false,
            error: error.message
        }, { status: 500 });
    }
}
