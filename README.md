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
- **画像ダウンロード**: 作成したチーム画像のローカル保存

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

```bash
# リポジトリをクローン
git clone https://github.com/your-username/favorite-pokemon-sharing.git
cd favorite-pokemon-sharing

# 依存関係をインストール
npm install

# 開発サーバーを起動
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
