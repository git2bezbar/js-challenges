import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { afterAll, afterEach, beforeAll } from 'vitest';

const mockServer = setupServer(
	http.get('https://api.freecurrencyapi.com/v1/currencies*', () => {
		return HttpResponse.json({
			data: {
				EUR: {
					symbol: "€",
					name: "Euro",
					symbol_native: "€",
					decimal_digits: 2,
					rounding: 0,
					code: "EUR",
					name_plural: "Euros",
					type: "fiat"
				},
				USD: {
					symbol: "$",
					name: "US Dollar",
					symbol_native: "$",
					decimal_digits: 2,
					rounding: 0,
					code: "USD",
					name_plural: "US dollars",
					type: "fiat"
				},
			}
		});
	}),
	http.get('https://api.freecurrencyapi.com/v1/latest*', () => {
		return HttpResponse.json({
			data: {
				USD: 1.0702396871
			}
		});
	})
);

beforeAll(() => mockServer.listen({ onUnhandledRequest: 'error' }));
afterAll(() => mockServer.close());
afterEach(() => mockServer.resetHandlers());
