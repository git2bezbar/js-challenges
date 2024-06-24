import type { Currency } from "./types/currency";

export function formatCurrencyName(currencyObject: Currency) {
	return `${currencyObject.name} (${currencyObject.symbol})`;
}
