import type { Currency } from "./types";

export function formatCurrencyName(currencyObject: Currency) {
	return `${currencyObject.name} (${currencyObject.symbol})`;
}
