import { test, expect } from '@playwright/test';

test.describe('シェア', () => {
  test('未選択時のガード表示', async ({ page }) => {
    // 外部通信は不要だが念のためブロック
    await page.route('https://pokeapi.co/**', route => route.abort());

    await page.goto('/share');

    await expect(page.getByText('ポケモンが選択されていません')).toBeVisible();
    const link = page.getByRole('link', { name: 'ポケモンを選ぶ' });
    await expect(link).toHaveAttribute('href', '/select');
  });
});
