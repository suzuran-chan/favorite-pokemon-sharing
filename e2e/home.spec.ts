import { test, expect } from '@playwright/test';

test.describe('ホーム', () => {
  test('ヒーローと遷移リンク', async ({ page }) => {
    // PokeAPI への外部通信を全てブロック（このテストでは不要）
    await page.route('https://pokeapi.co/**', route => route.abort());

    await page.goto('/');

    // ヒーロー見出し（部分一致）
    const heading = page.getByRole('heading', { name: /選んで/ });
    await expect(heading).toBeVisible();

    // 「ポケモンを選ぶ」リンクをクリックして /select に遷移
    await page.getByRole('link', { name: /ポケモンを選ぶ/ }).click();
    await expect(page).toHaveURL(/\/select$/);
  });
});
