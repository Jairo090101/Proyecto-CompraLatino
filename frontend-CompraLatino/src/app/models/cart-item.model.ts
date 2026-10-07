/** Snapshot of the product data needed to render the cart without re-fetching. */
export interface CartItem {
  productId: number;
  name: string;
  image: string;
  categoryName: string;
  priceUsd: number;
  quantity: number;
}
