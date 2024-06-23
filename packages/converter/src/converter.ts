import type { APIResponse, CurrenciesList } from "./types";

const apiUrl = import.meta.env.VITE_CONVERTER_API_URL;
const apiKey = import.meta.env.VITE_CONVERTER_API_KEY;

export const getCurrencies = async (): Promise<CurrenciesList> => {
	const cache = await caches.open("currencies-cache");
	const cachedResponse = await cache.match(`${apiUrl}/currencies?apikey=${apiKey}`);

	if (cachedResponse) {
		const { data } = await cachedResponse.json() as APIResponse;
		return data;
	}

	const response = await fetch(`${apiUrl}/currencies?apikey=${apiKey}`);

	if (!response.ok) {
		throw new Error('Échec de la récupération des devises');
	}

	const { data } = await response.clone().json() as APIResponse;
	if (typeof data !== 'object') {
		await cache.put(`${apiUrl}/currencies?apikey=${apiKey}`, data);
	}
	return data;
}

export const convertAmount = async (from: string, to: string, amount: number): Promise<number> => {
	const response = await fetch(`${apiUrl}/latest?base_currency=${from}&currencies=${to}&apikey=${apiKey}`);

	if (!response.ok) {
		throw new Error('Échec de la récupération du dernier taux de change');
	}

	const { data } = await response.clone().json() as { data: Record<string, number> };
	const latestExchangeRate = data[to];

	if (!latestExchangeRate) {
		throw new Error(`Impossible de trouver le taux de change pour la devise ${to}`);
	}

	return amount * latestExchangeRate;
}
