import { describe, it } from 'vitest';

import { formatCurrencyName } from '../../src/utils';

describe('Currency', () => {
	it('should format currency name', ({ expect }) => {
		const currency = {
			"symbol": "€",
			"name": "Euro",
			"symbol_native": "€",
			"decimal_digits": 2,
			"rounding": 0,
			"code": "EUR",
			"name_plural": "Euros",
			"type": "fiat"
	};
		expect(formatCurrencyName(currency)).toBe("Euro (€)");
	});
});
