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

export type CurrenciesList = Record<string, Currency>;

export interface CurrencyResponse extends Response {
	data: CurrenciesList;
}

export type CurrencyRate = Record<string, number>;
