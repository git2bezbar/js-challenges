import type { Note } from './services/types.ts';

import { describe, it } from 'vitest';

import { summarizeText } from './services/utils.ts';

describe('Card', () => {
	it('should summarize title and description', ({ expect }) => {
		const note: Note = {
			title: 'I am currenly testing the text summarization',
			description: 'This is a long description that should be summarized',
			updatedAt: new Date(),
			createdAt: new Date(),
			uuid: '1234',
		};
    const summarizedTitle = 'I am currenly t...';
    const summarizedDescription = 'This is a long descr...';

		expect(summarizeText(note.title, 15)).toBe(summarizedTitle);
    expect(summarizeText(note.description, 20)).toBe(summarizedDescription);
	});
});
