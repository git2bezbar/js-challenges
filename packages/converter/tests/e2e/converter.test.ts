import { test, expect } from '@playwright/test';

test.beforeEach(async ({ context }) => {
	await context.route('https://api.freecurrencyapi.com/v1/currencies*', async (route) => {
		await route.fulfill({ json:
			{
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
			}
		});
	});

	await context.route('https://api.freecurrencyapi.com/v1/latest*', async (route) => {
		await route.fulfill({ json: {
			data: {
				USD: 1.0702396871
			}
		}});
	});

	const fakeNow = new Date(2024, 4, 15, 13, 30, 48).valueOf();

	await context.addInitScript(`{
		Date.now = () => {
			return ${fakeNow};
		}
		Date = class extends Date {
			constructor(...args) {
				(args.length === 0) ? super(${fakeNow}) : super(...args)
			}
		}
	}`);
});

test('should convert 92 € to $', async ({ page }) => {
	await page.goto('/');
	await page.locator('input[name="amount"]').fill('92');
	await page.locator('[name="base-currency"]').selectOption({ label: 'Euro' });
	await page.locator('[name="target-currency"]').selectOption({ label: 'US Dollar' });
	await page.locator('[type="submit"]').click();
	await page.waitForTimeout(1000);
	await expect(page.getByTestId('resultContainer')).toHaveText('92 € = 98.46 $');
});
