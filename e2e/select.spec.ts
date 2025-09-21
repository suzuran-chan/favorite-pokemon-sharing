import { test, expect } from '@playwright/test';

test.describe('ポケモン選択', () => {
  test('データが空のとき空状態を表示する', async ({ page }) => {
    // リストを空で返す（getAllPokemon の結果 [] 想定）
    await page.route('https://pokeapi.co/api/v2/pokemon?limit=1010', route => route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ count: 0, results: [] }),
    }));
    // その他の PokeAPI は不要なので遮断
    await page.route('https://pokeapi.co/**', route => route.abort());

    await page.goto('/select');

    // 空状態のメッセージ
    await expect(page.getByText('条件に一致するポケモンが見つかりません')).toBeVisible();
  });
});
