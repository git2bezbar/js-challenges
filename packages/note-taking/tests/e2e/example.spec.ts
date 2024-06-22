import { test, expect } from '@playwright/test';

test('should add a note', async ({ page }) => {
	await page.goto('/');
	await page.getByTestId('addButton').click();
	await page.getByTestId('titleInput').fill('My first note');
	await page.getByTestId('descriptionInput').fill('This is my first note');
	await page.getByTestId('submitButton').click();
	await page.waitForTimeout(1000);
	expect(page.getByText('My first note')).toBeTruthy();
});

test('should throw an error while trying adding a note', async ({ page }) => {
	await page.goto('/');
	await page.getByTestId('addButton').click();
	await page.getByTestId('submitButton').click();
	expect(page.getByText('⚠️ Title and description are required')).toBeTruthy();
});
