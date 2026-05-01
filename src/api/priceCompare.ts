'use server';
/**
 * @fileOverview Price comparison engine across multiple platforms.
 */

import { searchAmazonProducts } from './amazon';
import { searchFlipkartProducts } from './flipkart';
import type { Product } from './amazon';

export type ComparisonResult = Product & {
  bestDeal: boolean;
};

/**
 * Compares a product across Amazon, Flipkart, and Meesho.
 */
export async function compareAcrossPlatforms(
  productName: string,
  priceRange?: [number, number]
): Promise<ComparisonResult[]> {
  const [min, max] = priceRange || [0, 100000];
  
  const [amazonResults, flipkartResults] = await Promise.all([
    searchAmazonProducts(productName, min, max),
    searchFlipkartProducts(productName, min, max),
  ]);

  // Combine and sort by price
  const allResults: ComparisonResult[] = [...amazonResults, ...flipkartResults]
    .map(p => ({ ...p, bestDeal: false }))
    .sort((a, b) => a.price - b.price);

  if (allResults.length > 0) {
    allResults[0].bestDeal = true;
  }

  return allResults;
}
