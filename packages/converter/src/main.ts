import type { CurrenciesList } from './types/currency';

import './style.css';
import CurrencyConverter from './converter';
import { formatCurrencyName } from './utils';

const amountInput = document.querySelector<HTMLInputElement>('[name="amount"]');
const baseCurrencySelect = document.querySelector<HTMLSelectElement>('[name="base-currency"]');
const targetCurrencySelect = document.querySelector<HTMLSelectElement>('[name="target-currency"]');
const submitButton = document.querySelector<HTMLButtonElement>('[type="submit"]');
const firstCard = document.querySelector<HTMLDivElement>('article:first-of-type');
const tableBody = document.querySelector<HTMLTableSectionElement>('tbody');
let currenciesList: CurrenciesList = {};

const currencyConverter = CurrencyConverter.getInstance();

const fetchCurrencies = async () => {
	currenciesList = await currencyConverter.getCurrencies();
};

const convertCurrency = async (event: Event) => {
	event.preventDefault();
	event.stopPropagation();

	if (!amountInput || !baseCurrencySelect || !targetCurrencySelect) return;

	const baseCurrency = baseCurrencySelect.value;
	const targetCurrency = targetCurrencySelect.value;
	const amount = Number.parseFloat(amountInput.value);

	if (!baseCurrency || !targetCurrency) return;

	const convertedAmount = await currencyConverter.convertAmount(baseCurrency, targetCurrency, amount);
	renderResult(amount, baseCurrency, convertedAmount, targetCurrency);
};

const renderResult = (amount: number, baseCurrency: string, newAmount: number, targetCurrency: string) => {
	const resultTitle = document.querySelector<HTMLHeadingElement>('h3');
	const baseCurrencyObject = currenciesList[baseCurrency];
	const targetCurrencyObject = currenciesList[targetCurrency];

	if (!baseCurrencyObject || !targetCurrencyObject) return;

	const resultText = `${amount} ${baseCurrencyObject.symbol} = ${Math.round(newAmount * 100) / 100} ${targetCurrencyObject.symbol}`;

	if (resultTitle) {
		resultTitle.textContent = resultText;
	} else {
		if (firstCard) {
			firstCard.insertAdjacentHTML('afterend',
				`<article><h3 class="text-center" data-testid="resultContainer">${resultText}</h3></article>`
			);
		}
	}

	if (tableBody) {
		tableBody.insertAdjacentHTML('beforeend',
			`<tr>
				<td>${amount}</td>
				<td>${formatCurrencyName(baseCurrencyObject)}</td>
				<td>${formatCurrencyName(targetCurrencyObject)}</td>
				<td>${Math.round(newAmount * 100) / 100}</td>
				<td>${new Date().toLocaleString()}</td>
			</tr>`
		);
	}
};

const updateCurrencyOptions = () => {
	if (!baseCurrencySelect || !targetCurrencySelect) return;

	for (const [code, currency] of Object.entries(currenciesList)) {
		const option = document.createElement('option');
		option.value = code;
		option.textContent = currency.name;
		baseCurrencySelect.append(option.cloneNode(true));
		targetCurrencySelect.append(option);
	}
};

const setup = async () => {
	await fetchCurrencies();
	updateCurrencyOptions();

	if (baseCurrencySelect && targetCurrencySelect) {
		baseCurrencySelect.addEventListener("change", () => {
			const optionToDisable = targetCurrencySelect.querySelector<HTMLOptionElement>(`option[value="${baseCurrencySelect.value}"]`);
			for (const option of targetCurrencySelect.querySelectorAll<HTMLOptionElement>(`option:not([data-type])`)) { option.disabled = false }
			if (optionToDisable) optionToDisable.disabled = true;
		});
		targetCurrencySelect.addEventListener("change", () => {
			for (const option of baseCurrencySelect.querySelectorAll<HTMLOptionElement>(`option:not([data-type])`)) { option.disabled = false }
			const optionToDisable = baseCurrencySelect.querySelector<HTMLOptionElement>(`option[value="${targetCurrencySelect.value}"]`);
			if (optionToDisable) optionToDisable.disabled = true;
		});
	}

	if (submitButton) {
		submitButton.addEventListener('click', convertCurrency);
	}
};

await setup();
