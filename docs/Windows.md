# Windows環境での開発手順

このドキュメントではWindows環境でのセットアップ、テスト実行、E2Eテストの実行方法について説明します。

## 開発環境のセットアップ

### 前提条件
- Node.js 18以上
- npm 9以上
- PowerShell 5.1以上または Windows Terminal

### 依存関係のインストール

PowerShellで以下のコマンドを実行してください：

```powershell
# プロジェクトルートで実行
npm ci
```

> **注意**: `npm install`ではなく`npm ci`を使用することで、package-lock.jsonを基に厳密にバージョン管理されたインストールが行われます。

### 開発サーバーの起動

```powershell
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いてアプリケーションが動作していることを確認してください。

## テスト実行

### 単体テスト (Jest)

```powershell
# すべてのテストを実行
npm test

# 特定のテストファイルを実行
npm test -- -t "特定のテスト名"

# 変更のあったファイルのみテスト
npm test -- --watch
```

### E2Eテスト (Playwright)

#### Playwrightブラウザのインストール

初回実行時は、必要なブラウザをインストールする必要があります：

```powershell
npm run pw:install
```

#### テストの実行

```powershell
# ヘッドレスモードでテスト実行（CI向き）
npm run test:e2e

# ブラウザ表示ありでテスト実行
npm run test:e2e:headed

# UIモードでテスト実行（対話的デバッグ）
npm run test:e2e:ui
```

#### 特定のテストの実行

```powershell
# 特定のテストファイルを実行
npx playwright test e2e/home.spec.ts

# タグでテストをフィルター
npx playwright test --grep @smoke
```

## トラブルシューティング

### Playwrightブラウザのインストールエラー

もし`pw:install`コマンドでブラウザのインストールに失敗する場合は、以下を試してください：

```powershell
# 管理者権限でPowerShellを開き
npx playwright install --with-deps
```

### テスト実行が遅い場合

E2Eテストが遅い場合、以下のオプションを試してください：

```powershell
# 並列実行数を減らす
npx playwright test --workers=1

# 特定のブラウザのみでテスト
npx playwright test --project=chromium
```

### その他の便利なコマンド

```powershell
# プロジェクトのビルド
npm run build

# 本番モードでの起動（ビルド後）
npm run start
```