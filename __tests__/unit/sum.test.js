import sum from '../../src/app/utils/sum';

test('Calling sum with 4 and 5 should return 9', () => {
	const result = sum(4, 5);

	expect(result).toBe(9);
});

test('Calling sum with 10 and 3 should return 13', () => {
	const result = sum(10, 3);

	expect(result).toBe(13);
});
