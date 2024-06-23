export type CurrenciesList = Record<string, Currency>;

export interface Currency {
	symbol: string,
	name: string,
	symbol_native: string,
	decimal_digits: number,
	rounding: number,
	code: string,
	name_plural: string
	type: string;
}

export interface APIResponse extends Response {
	data: CurrenciesList;
}
