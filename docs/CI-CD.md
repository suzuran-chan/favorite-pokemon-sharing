# CI/CD セットアップガイド (GitHub Actions → Vercel)

このドキュメントでは、GitHub Actions を使用して Vercel へ自動デプロイする方法について説明します。

## 概要

このプロジェクトでは以下のワークフローを実装しています：

1. **テスト**: すべてのブランチとPRに対して Jest と Playwright テストを実行
2. **プレビューデプロイ**: PR が開かれたときに Vercel プレビュー環境にデプロイ
3. **本番デプロイ**: `main` ブランチへのプッシュ時に Vercel 本番環境にデプロイ

## 必要な GitHub シークレット

Vercel デプロイを行うために、以下の GitHub シークレットが必要です：

1. `VERCEL_TOKEN` - Vercel の個人アクセストークン
2. `VERCEL_ORG_ID` - Vercel の組織 ID
3. `VERCEL_PROJECT_ID` - Vercel のプロジェクト ID

## シークレットの取得方法

### 1. Vercel トークンの取得

1. [Vercel ダッシュボード](https://vercel.com/dashboard) にログイン
2. 右上のプロフィールアイコン → Settings → Tokens に移動
3. 「Create」をクリック
4. トークン名を入力（例: `GITHUB_ACTIONS`）し、有効期限を設定
5. 「Create」をクリックしてトークンを生成
6. 表示されたトークンをコピー（この画面を閉じると二度と表示されないので注意）

### 2. Vercel 組織 ID とプロジェクト ID の取得

1. [Vercel ダッシュボード](https://vercel.com/dashboard) で対象プロジェクトを選択
2. プロジェクト設定画面に移動
3. 「General」タブの下部にある「Project ID」をコピー
4. [Vercel ダッシュボード](https://vercel.com/dashboard) に戻り、左メニューの「Settings」→「General」で「Your ID」をコピー（これが組織 ID）

## GitHub にシークレットを設定

1. GitHub リポジトリのページに移動
2. 「Settings」タブを選択
3. 左メニューの「Security」→「Secrets and variables」→「Actions」を選択
4. 「New repository secret」をクリック
5. 以下のシークレットを追加:
   - `VERCEL_TOKEN` - コピーした Vercel トークン
   - `VERCEL_ORG_ID` - コピーした組織 ID
   - `VERCEL_PROJECT_ID` - コピーしたプロジェクト ID

## ワークフロー確認方法

シークレットを設定した後:

1. PR を作成するか、既存の PR に変更をプッシュすると、テストが実行された後にプレビュー環境へデプロイされます
2. PR のコメントに Vercel ボットから「Preview」へのリンクが投稿されます
3. PR がマージされ `main` ブランチに変更が取り込まれると、本番環境へ自動的にデプロイされます

## CI ワークフローのカスタマイズ

ワークフローファイル (`.github/workflows/ci.yml`) を編集することで、CI/CD パイプラインをカスタマイズできます。

> **注意**: Playwright のインストールには `npx playwright install --with-deps` を使用してください。古い `microsoft/playwright-github-action@v1` アクションは非推奨となっています。

### テストの変更

```yaml
# テスト部分のカスタマイズ例
- name: Run unit tests (Jest)
  run: npm test --silent --coverage  # カバレッジレポートを追加

# Playwrightテストの変更
- name: Run E2E tests (Playwright)
  run: npm run test:e2e --silent --project=chromium  # Chromiumのみでテスト実行
```

### デプロイの変更

```yaml
# デプロイ設定のカスタマイズ例
- name: Deploy (production)
  run: vercel deploy --prebuilt --prod --token=${{ secrets.VERCEL_TOKEN }} --scope=${{ secrets.VERCEL_TEAM_SLUG }}
  env:
    VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
    VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}
```

## トラブルシューティング

### テストが失敗する場合

GitHub Actions のログを確認し、失敗の原因を特定してください。特に Playwright テストの場合、アーティファクトが自動的にアップロードされるので、失敗時のスクリーンショットやトレースを確認できます。

### デプロイが失敗する場合

1. GitHub シークレットが正しく設定されているか確認
2. Vercel トークンの権限が適切か確認
3. プロジェクト設定やビルド設定が正しいか確認

ワークフロー実行ログでエラーメッセージを確認し、必要に応じて Vercel CLI のデバッグモードを有効にしてください：

```yaml
- name: Pull Vercel Environment Information (debug)
  run: vercel pull --yes --environment=preview --token=${{ secrets.VERCEL_TOKEN }} --debug
```