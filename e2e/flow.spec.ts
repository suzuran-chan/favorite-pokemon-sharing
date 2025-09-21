import { test, expect } from './fixtures/test';

test.describe('基本フロー', () => {
  test('Twitter共有リンク - 独立したテスト', async ({ page, context }) => {
    // Share ページにテスト用のスタブデータで直接アクセス
    // クエリパラメータを使って選択済みポケモンをシミュレート
    await page.goto('/share?test=true');
    
    // ページロードを待機
    await page.waitForTimeout(1000);
    
    // シェア画面のUIが表示されていることを確認
    await expect(page.getByRole('heading', { level: 1, name: 'シェアする' })).toBeVisible();
    
    // Twitter共有ボタンが表示されていることを確認
    const twitterButton = page.getByRole('button', { name: /Twitter/ });
    await expect(twitterButton).toBeVisible();
    
    // Twitter intentのポップアップをテスト
    const popupPromise = context.waitForEvent('page');
    await twitterButton.click();
    
    // ポップアップを検証
    const popup = await popupPromise;
    await popup.waitForLoadState();
    
    // TwitterはX.comに変わったのでURLを両方チェック
    const popupUrl = popup.url();
    expect(
      popupUrl.includes('twitter.com/intent/tweet') || 
      popupUrl.includes('x.com/intent/post')
    ).toBeTruthy();
    
    console.log('Popup URL:', popupUrl);
  });
});