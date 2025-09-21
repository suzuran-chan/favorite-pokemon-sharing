import { test, expect } from '@playwright/test';

test.describe('ポケモン選択', () => {
  test('エラー表示と再試行', async ({ page }) => {
    // すべての PokeAPI リクエストを 500 にしてエラー状態を出す
    await page.route('https://pokeapi.co/**', route => route.fulfill({ status: 500, body: 'error' }));

    await page.goto('/select');

    // エラーメッセージ表示
    await expect(page.getByText('ポケモンデータの取得に失敗しました', { exact: false })).toBeVisible();

    // 再試行で reload が走る（URL はそのままだがページはリロードされる）
    await page.getByRole('button', { name: '再試行' }).click();

    // 再読み込み後も同じメッセージ（インターセプトは継続）
    await expect(page.getByText('ポケモンデータの取得に失敗しました', { exact: false })).toBeVisible();
  });
});
