/** One line stored with a completed checkout. */
export interface OrderLine {
  name: string;
  quantity: number;
  priceUsd: number;
  image: string;
}

/** Local purchase record, keyed by the email used at checkout. */
export interface Order {
  id: string;
  email: string;
  createdAt: string;
  total: number;
  lines: OrderLine[];
}
