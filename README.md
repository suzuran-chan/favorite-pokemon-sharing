# 好きなポケモン共有アプリ

![Pokemon Team Sharing App](https://img.shields.io/badge/Next.js-15.5.3-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css)

## 概要

このアプリは、すべてのポケモン世代から好きなポケモンを6匹まで選び、選んだポケモンをSNSで共有できるWebアプリケーションです。ポケモンファン同士が好きなポケモンを見せ合い、共有することを目的としています。

## 主な機能

### ✨ 核心機能

- **ポケモン選択**: 第1世代から最新世代まで全ポケモンから最大6匹を選択
- **検索・フィルタ**: 名前、タイプ、世代による絞り込み機能
- **カスタマイズ**: 背景テーマやレイアウトの変更
- **SNS共有**: Twitter、Facebook、LINEでの簡単共有
- **画像生成**: 選択したポケモンチームの画像を自動生成

### 🎯 追加機能

- **ランダム選択**: ワンクリックでランダムな6匹を提案
- **レスポンシブデザイン**: スマートフォン、タブレット、PC対応
- **リアルタイムプレビュー**: 選択中のポケモンをリアルタイム表示
- **画像ダウンロード/コピー**: 作成したチーム画像をダウンロード or クリップボードへコピー
- **テスト自動化**: Jest（単体/コンポーネント）と Playwright（E2E）を用意
- **CI/CD**: GitHub Actions でテスト→Vercel へデプロイ（PR はプレビュー、本番は main ブランチ）

## 技術スタック

### フロントエンド
- **Next.js 15.5.3** - React フレームワーク
- **TypeScript** - 型安全な開発
- **Tailwind CSS** - ユーティリティファーストのCSS
- **shadcn/ui** - モダンなUIコンポーネント

### 状態管理・API
- **Zustand** - 軽量な状態管理ライブラリ
- **PokeAPI** - ポケモンデータの取得

### その他
- **dom-to-image** - HTML要素の画像変換
- **Lucide React** - アイコンライブラリ

## セットアップ

### 必要な環境

- Node.js 18.0.0 以上
- npm または yarn

### インストール

開発環境の詳しい操作方法は [docs/Windows.md](docs/Windows.md) を参照してください。

ローカル最短手順（PowerShellの例）:

```powershell
# 依存関係のインストール
npm ci

# 開発サーバー起動
npm run dev

# 単体テスト実行（Jest）
npm test

# E2Eテスト（Playwright）
npm run pw:install  # ブラウザを一括インストール（初回のみ）
npm run test:e2e    # ヘッドレスモードでテスト実行
npm run test:e2e:ui # UIモードでテスト実行（対話的デバッグ）
```

[http://localhost:3000](http://localhost:3000) をブラウザで開くとアプリを確認できます。

`app/page.tsx` を編集すると、ページは自動的に更新されます。

このプロジェクトでは [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) を使用して [Geist](https://vercel.com/font) フォントを最適化して読み込んでいます。

## CI/CD（GitHub Actions → Vercel）

このリポジトリには `.github/workflows/ci.yml` が含まれており、以下を自動化します：

- push / PR 時に Jest + Playwright を実行
- PR の場合は Vercel プレビューにデプロイ
- main ブランチへの push は Vercel 本番デプロイ

セットアップ手順や必要なシークレットの詳細は [docs/CI-CD.md](docs/CI-CD.md) を参照してください。

## もっと詳しく

Next.jsについて詳しく知るには、以下のリソースを参照してください：

- [Next.js ドキュメント](https://nextjs.org/docs) - Next.jsの機能とAPIについて
- [Next.js 学習ガイド](https://nextjs.org/learn) - インタラクティブなNext.jsチュートリアル

[Next.js GitHubリポジトリ](https://github.com/vercel/next.js)もチェックしてみてください - フィードバックや貢献を歓迎しています！

## CI/CD（GitHub Actions → Vercel）

このリポジトリには `.github/workflows/ci.yml` が含まれており、以下を自動化します。

- push / PR 時に Jest + Playwright を実行
- PR の場合は Vercel プレビューにデプロイ
- main ブランチへの push は Vercel 本番デプロイ

セットアップ手順や必要なシークレットの詳細は docs/CI-CD.md を参照してください。
