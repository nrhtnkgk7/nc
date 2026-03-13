# No Code — Interactive Website

## 技術スタック
- **Framework**: Next.js 14 (App Router, Static Export)
- **3D/WebGL**: Three.js + React Three Fiber
- **Animation**: Framer Motion + GSAP (追加予定)
- **Smooth Scroll**: Lenis
- **Styling**: Tailwind CSS
- **Fonts**: Bebas Neue, Noto Sans JP, Jost
- **Hosting**: Vercel
- **Forms**: Formspree (serverless)

## セットアップ

```bash
# 1. 依存パッケージのインストール
npm install

# 2. 開発サーバー起動
npm run dev

# 3. ブラウザで開く
open http://localhost:3000
```

## デプロイ (Vercel)

```bash
# 1. GitHubリポジトリを作成
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/nocode-website.git
git push -u origin main

# 2. Vercelに接続
# https://vercel.com/new からGitHubリポジトリをインポート
# Framework: Next.js (自動検出)
# Build Command: next build (デフォルト)
# Output Directory: out (Static Export)
```

## 3つのデザインパターン

上部のタブで切り替え可能:

- **X — Fluid**: WebGLパーティクル + スクロール連動パララックス + 画像ディストーション
- **Y — Swipe**: カードスワイプUI + モーフィングメッシュ背景 + アニメーションフレーム
- **Z — Snap**: フルスクリーンスナップスクロール + グリッドライン + 3D文字回転

## ディレクトリ構成

```
src/
  app/
    layout.tsx          # ルートレイアウト (フォント, メタデータ)
    page.tsx            # メインページ (パターン切替)
  components/
    shared/
      Header.tsx        # ハンバーガーメニュー
      ScrollUtils.tsx   # Lenis, useReveal, Reveal
    interactive/
      ParticleHero.tsx  # WebGLパーティクルシステム
      ImageDistortion.tsx # GLSL画像ディストーション
      CardSwipe.tsx     # カードスワイプUI
    patterns/
      PatternX.tsx      # Fluid パターン
      PatternY.tsx      # Swipe パターン
      PatternZ.tsx      # Snap パターン
  lib/
    content.ts          # コンテンツデータ
  styles/
    globals.css         # グローバルCSS + Tailwind
```

## 本番化に向けて追加すべき項目

- [ ] 実写真の差し替え (hero, about×3, chef×2, restaurant×4)
- [ ] GSAP ScrollTriggerによるピン留めアニメーション
- [ ] Contact フォームページ (Formspree接続)
- [ ] Privacy Policyページ
- [ ] 台湾サイト (i18nルーティング)
- [ ] 構造化データ (JSON-LD)
- [ ] OGP画像
- [ ] sitemap.xml / robots.txt (next-sitemap)
- [ ] パフォーマンス最適化 (next/image, lazy loading)
- [ ] カスタムドメイン設定

## セキュリティ

- PHPなし、MySQLなし、WordPress完全廃止
- 静的HTML出力のみ → サーバーサイド攻撃面ゼロ
- セキュリティヘッダー: next.config.js で設定済み
- フォーム: サーバーレス (Formspree) → send.php不要
