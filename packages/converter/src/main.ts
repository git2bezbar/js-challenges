import type { CurrenciesList } from './types';

import { convertAmount, getCurrencies } from './converter';
import './style.css';
import { formatCurrencyName } from './utils';

const amountInput = document.querySelector<HTMLInputElement>('[name="amount"]');
const baseCurrencySelect = document.querySelector<HTMLSelectElement>('[name="base-currency"]');
const targetCurrencySelect = document.querySelector<HTMLSelectElement>('[name="target-currency"]');
const submitButton = document.querySelector<HTMLButtonElement>('[type="submit"]');
const firstCard = document.querySelector<HTMLDivElement>('article:first-of-type');
const tableBody = document.querySelector<HTMLTableSectionElement>('tbody');
let currenciesList: CurrenciesList = {};

if (!!amountInput && !!baseCurrencySelect && !!targetCurrencySelect && !!submitButton && !!firstCard && !!tableBody) {

	currenciesList = await getCurrencies();
	baseCurrencySelect.innerHTML += Object.entries(currenciesList).map(([code, currency]) =>
		`<option value="${code}">${currency.name}</option>`).join('');
	targetCurrencySelect.innerHTML += Object.entries(currenciesList).map(([code, currency]) =>
		`<option value="${code}">${currency.name}</option>`).join('');

	const convertCurrency = async (event: Event) => {
		event.preventDefault();
		event.stopPropagation();
		const result = await convertAmount(baseCurrencySelect.value, targetCurrencySelect.value, Number.parseFloat(amountInput.value))
		renderResult(Number.parseFloat(amountInput.value), baseCurrencySelect.value, result, targetCurrencySelect.value);
	}

	const renderResult = (amount: number, baseCurrency: string, newAmount: number, targetCurrency: string) => {
		const resultTitle = document.querySelector<HTMLHeadingElement>('h3');
		const baseCurrencyObject = currenciesList[baseCurrency];
		const targetCurrencyObject = currenciesList[targetCurrency];

		if (!!baseCurrencyObject && !!targetCurrencyObject) {
			const resultText = `${amount} ${baseCurrencyObject.symbol} = ${Math.round(newAmount * 100) / 100} ${targetCurrencyObject.symbol}`;

			if (resultTitle) {
				resultTitle.textContent = resultText;
			} else {
				firstCard.insertAdjacentHTML('afterend',
					`
					<article>
						<h3 class="text-center">${ resultText }<h3>
					</article>
					`
				);
			}
			tableBody.insertAdjacentHTML('beforeend',
				`
				<tr>
					<td>${ amount }</td>
					<td> ${ formatCurrencyName(baseCurrencyObject) }</td>
					<td> ${ formatCurrencyName(targetCurrencyObject) }</td>
					<td>${ Math.round(newAmount * 100) / 100 }</td>
					<td>${ new Date().toLocaleString() }</td>
				</tr>
				`
			);
		}
	}

	baseCurrencySelect.addEventListener("change", () => {
		const optionToDisable = targetCurrencySelect.querySelector<HTMLOptionElement>(`option[value="${baseCurrencySelect.value}"]`);
		for (const option of targetCurrencySelect.querySelectorAll(`option`)) { option.disabled = false }
		if (optionToDisable) optionToDisable.disabled = true;
	});

	targetCurrencySelect.addEventListener("change", () => {
		for (const option of baseCurrencySelect.querySelectorAll(`option`)) { option.disabled = false }
		const optionToDisable = baseCurrencySelect.querySelector<HTMLOptionElement>(`option[value="${targetCurrencySelect.value}"]`);
		if (optionToDisable) optionToDisable.disabled = true;
	});

	submitButton.addEventListener("click", convertCurrency);
}
