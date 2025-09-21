import { test, expect } from './fixtures/test';

test.describe('基本フロー', () => {
  test('選択→シェア画面→Twitter 共有リンク', async ({ page, context }) => {

    // Home → Select
    await page.goto('/');
    await page.getByRole('link', { name: /ポケモンを選ぶ/ }).click();
    await expect(page).toHaveURL(/\/select$/);

    // 少数データの表示確認
    await expect(page.getByText('フシギダネ')).toBeVisible();

    // 2匹選択
    await page.getByText('フシギダネ').click();
    await page.getByText('フシギソウ').click();

    // Share ページへ（ヘッダー戻るの横にリンクはないので /share 直行）
    await page.goto('/share');

    // プレビューが表示される
    await expect(page.getByText('選択した2匹のポケモンを共有')).toBeVisible();

    // Twitter intent を new tab で開く挙動を検証
    const popupPromise = context.waitForEvent('page');
    await page.getByRole('button', { name: 'Twitterで共有' }).click();
    const popup = await popupPromise;
    await popup.waitForLoadState();
    expect(popup.url()).toContain('https://twitter.com/intent/tweet');
  });
});
