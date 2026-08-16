/** Formats a number as an NPR amount, e.g. 12500 -> "NPR 12,500". */
export const formatNPR = (amount) => `NPR ${Number(amount || 0).toLocaleString()}`;

/** Total item count across cart lines (not the number of distinct lines). */
export const cartItemCount = (cart = []) =>
  cart.reduce((sum, item) => sum + (item.quantity || 0), 0);

/** Order value before delivery. */
export const cartSubtotal = (cart = []) =>
  cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
