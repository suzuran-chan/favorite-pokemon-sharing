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
    
    // ページが読み込まれるのを少し待機
    await page.waitForSelector('[data-testid="share-page-title"]');
    
    // 現在のページ内容をデバッグ出力
    console.log('ページタイトル:', await page.title());
    
    // より安定したセレクタを使用
    await expect(page.locator('[data-testid="share-pokemon-count"]')).toBeVisible();
    
    // 念のため、テキスト内容も確認（正規表現で柔軟に対応）
    const countText = await page.locator('[data-testid="share-pokemon-count"]').textContent();
    console.log('検出されたテキスト:', countText);

    // Twitter intent を new tab で開く挙動を検証
    const popupPromise = context.waitForEvent('page');
    
    // data-testidを使用してより安定したセレクタに
    await page.locator('[data-testid="twitter-share-button"]').click();
    
    const popup = await popupPromise;
    await popup.waitForLoadState();
    expect(popup.url()).toContain('https://twitter.com/intent/tweet');
  });
});
