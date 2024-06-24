import type { CurrenciesList, CurrencyRate, CurrencyResponse } from "./types/currency";

const apiUrl = import.meta.env.VITE_CONVERTER_API_URL;
const apiKey = import.meta.env.VITE_CONVERTER_API_KEY;

class CurrencyConverter {
	private static instance: CurrencyConverter;
	private exchangeRates: CurrencyRate;

	private constructor() {
		this.exchangeRates = {};
	}

	public static getInstance(): CurrencyConverter {
		if (!CurrencyConverter.instance) {
				CurrencyConverter.instance = new CurrencyConverter();
		}
		return CurrencyConverter.instance;
	}

	public async getCurrencies(): Promise<CurrenciesList> {
		const cache = await caches.open("currencies-cache");
		const cachedResponse = await cache.match(`${apiUrl}/currencies?apikey=${apiKey}`);

		if (cachedResponse) {
				const { data } = await cachedResponse.json() as CurrencyResponse;
				return data;
		}

		const response = await fetch(`${apiUrl}/currencies?apikey=${apiKey}`);

		if (!response.ok) {
				throw new Error('Échec de la récupération des devises');
		}

		const { data } = await response.clone().json() as CurrencyResponse;
		if (typeof data === 'object') {
				await cache.put(`${apiUrl}/currencies?apikey=${apiKey}`, response.clone());
		}
		return data;
	}

	public async setExchangeRates(from: string, to: string): Promise<void> {
		const response = await fetch(`${apiUrl}/latest?base_currency=${from}&currencies=${to}&apikey=${apiKey}`);

		if (!response.ok) {
				throw new Error('Échec de la récupération des taux de change');
		}

		const { data } = await response.json() as { data: Record<string, number> };
		this.exchangeRates = data;
	}

	public async convertAmount(from: string, to: string, amount: number): Promise<number> {
		await this.setExchangeRates(from, to);
		const toRate = this.exchangeRates[to];
		console.log(this.exchangeRates, toRate)
		if (!toRate) {
			throw new Error("Currency not supported");
		}
		return amount * toRate;
	}
}

export default CurrencyConverter;
