# microCMS + Astro + GitHub Actions + Cloudflare Pages

Astro で静的サイトをビルドし、コンテンツは microCMS、ホスティングは Cloudflare Pages で配信する Jamstack 構成です。コンテンツ更新時は microCMS の Webhook → GitHub Actions → 空コミット push → Cloudflare Pages の再ビルド、という流れで反映します。

## 関連リンク（このプロジェクト）

| サービス | URL |
| --- | --- |
| microCMS | https://xy5mh8k0b1.microcms.io/settings |
| GitHub | https://github.com/syooji/jamstack |
| Cloudflare Pages | https://dash.cloudflare.com/622e90324fdbf6f0fbffb88af47d55ab/pages/view/jamstack |

## 秘匿情報・認証情報の所在

**値そのものはこの README や Git 管理下のファイルに書かない。** 置き場所だけをここにまとめる。

| 情報 | 用途 | 置き場所 | Git 管理 |
| --- | --- | --- | --- |
| `MICROCMS_SERVICE_DOMAIN` | microCMS 接続（サービス ID） | ① ローカル `.env` ② Cloudflare Pages の Environment variables | `.env` は `.gitignore` 済み。リポジトリに直書きしない |
| `MICROCMS_API_KEY` | microCMS API 呼び出し | 同上 | 同上 |
| GitHub Personal Access Token（PAT） | microCMS Webhook が `repository_dispatch` を送るため | microCMS の各 API「Webhook」設定画面に保存。発行元は GitHub の Developer settings | リポジトリに置かない |
| （任意）GitHub Actions Secrets の `MICROCMS_*` | かつての GitHub Pages ビルド用 | リポジトリ Settings → Secrets and variables → Actions | GitHub 上のみ。現構成の Cloudflare ビルドでは **必須ではない** |

### コード上の参照（値は書かれていない）

- `src/library/microcms.ts` … `import.meta.env.MICROCMS_SERVICE_DOMAIN` / `MICROCMS_API_KEY` を参照
- `.github/workflows/deploy.yml` … トークンや API キーは含まない（空コミット push のみ）

### 画面上の設定場所（値の確認・更新）

| 場所 | 何があるか |
| --- | --- |
| プロジェクト直下の `.env` | ローカル開発用の `MICROCMS_*` |
| Cloudflare Pages（Compute > Workers & Pages） → 対象プロジェクト → Settings → Environment variables（Variables and secrets） | 本番ビルド用の `MICROCMS_*` |
| microCMS → 各 API → API設定 → Webhook | GitHub トークン・リポジトリ情報・トリガーイベント名 |
| GitHub → Settings → Developer settings → Personal access tokens | PAT の発行・失効 |
| GitHub → リポジトリ Settings → Secrets and variables → Actions | 旧 Pages 用 Secrets（残っている場合） |

### 注意

- パスワードや API キーを `memo.txt` などに書いてコミットしない（過去に同様のメモが追跡されたことがある）
- README の「関連リンク」にあるサービス ID やダッシュボード URL は識別子であり、API キーや PAT とは別物
- 漏えいが疑われたら、microCMS の API キー再発行と GitHub PAT の失効・再作成を行う

## 全体の流れ

```text
[コンテンツ更新]
      │
      ▼
 microCMS Webhook
      │  repository_dispatch (event_type: microcms)
      ▼
 GitHub Actions (deploy.yml)
      │  空コミットを main に push
      ▼
 Cloudflare Pages
      │  git push を検知してビルド
      │  （MICROCMS_* を使って Astro build）
      ▼
 静的サイト公開
```

コード変更を push したときも、Cloudflare Pages がビルドして公開します。  
microCMS だけ更新した場合はソースに差分がないため、Actions が空コミットを push して再ビルドを起こします。

## 前提

- GitHub リポジトリがあること
- microCMS のサービスがあること
- Cloudflare アカウントがあること

## 1. ローカル開発

### 依存関係のインストール

```sh
npm install
```

### 環境変数

プロジェクト直下に `.env` を作成します（Git 管理対象外）。

```env
MICROCMS_SERVICE_DOMAIN=あなたのサービスID
MICROCMS_API_KEY=あなたのAPIキー
```

| 変数名 | 内容 |
| --- | --- |
| `MICROCMS_SERVICE_DOMAIN` | `https://xxxxx.microcms.io` の `xxxxx` 部分 |
| `MICROCMS_API_KEY` | microCMS の API キー（取得用） |

### 開発サーバー

```sh
npm run dev
```

`http://localhost:4321` で確認できます。バックグラウンド起動する場合は `astro dev --background` を使います。

### 主なコマンド

| コマンド | 内容 |
| --- | --- |
| `npm run dev` | 開発サーバー起動 |
| `npm run build` | 本番ビルド（`./dist`） |
| `npm run preview` | ビルド結果のローカル確認 |

## 2. プロジェクト構成（概要）

```text
/
├── .github/workflows/
│   └── deploy.yml          # microCMS 更新時に CF 再ビルドをトリガー
├── src/
│   ├── library/
│   │   └── microcms.ts     # microCMS クライアント・型・取得関数
│   └── pages/
│       ├── index.astro     # トップ（お知らせ・ブログ・バナー）
│       ├── about.astro     # About（オブジェクト型 API）
│       ├── news/[contentId].astro
│       └── blog/[contentId].astro
├── public/
├── astro.config.mjs
└── package.json
```

コンテンツ取得は `src/library/microcms.ts` に集約しています。  
新しい API（リスト型・オブジェクト型どちらも）を追加する場合は、ここへの取得関数追加と、対応する `.astro` ページの実装が必要です。

## 3. Cloudflare Pages の設定

1. [Cloudflare Dashboard](https://dash.cloudflare.com/) → **Workers & Pages** → **Create** → **Pages** → Git リポジトリを接続
2. ビルド設定例

| 項目 | 値 |
| --- | --- |
| Production branch | `main` |
| Framework preset | Astro（または None） |
| Build command | `npm run build` |
| Build output directory | `dist` |

3. **Settings → Environment variables** に本番用の変数を追加

| 変数名 | 値 |
| --- | --- |
| `MICROCMS_SERVICE_DOMAIN` | サービス ID |
| `MICROCMS_API_KEY` | API キー |

ビルドは Cloudflare 側で実行されるため、これらの変数は **GitHub Secrets ではなく Cloudflare** に置く必要があります。

4. 接続後、`main` への push で自動デプロイされることを確認する

## 4. GitHub Actions の設定（コンテンツ更新トリガー）

ワークフロー: [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml)

- `repository_dispatch`（`types: [microcms]`）で起動
- 空コミットを push し、Cloudflare Pages のビルドを発火
- GitHub 画面からの手動実行（`workflow_dispatch`）にも対応

### GitHub パーソナルアクセストークン

microCMS の Webhook から `repository_dispatch` を送るために必要です。

1. GitHub → **Settings → Developer settings → Personal access tokens**
2. トークンを発行（Classic の場合は少なくとも `repo` スコープ）
3. 発行したトークンを控える（microCMS 側で使用）

Actions の空コミット push には、リポジトリの **Actions 権限（読み書き）** が必要です。  
GitHub リポジトリ → **Settings → Actions → General → Workflow permissions** で **Read and write permissions** を選びます。

## 5. microCMS の Webhook 設定

コンテンツを更新した API ごとに Webhook を設定します（リスト型・オブジェクト型どちらも同様）。

1. 対象 API の **API設定 → Webhook → 追加**
2. **GitHub Actions** を選択
3. 次を入力

| 項目 | 例 |
| --- | --- |
| Webhook の識別名 | 任意（例: Cloudflare 再ビルド） |
| GitHub トークン | 手順 4 で発行したトークン |
| リポジトリのユーザー名 | GitHub のユーザー名または Organization |
| リポジトリ名 | `jamstack` など |
| トリガーイベント名 | `microcms`（`deploy.yml` の `types` と一致させる） |

4. 通知したいタイミング（公開・更新・削除など）を選んで保存

### 重要なポイント

- **トリガーイベント名** と `deploy.yml` の `types: [microcms]` は完全一致させる
- Webhook は **API 単位**。新しい固定ページ用 API（オブジェクト型）を追加したら、その API にも同様の Webhook を設定する
- Webhook は再ビルドのきっかけに過ぎない。サイトに出すには Astro 側の取得・ページ実装も必要

## 6. 動作確認チェックリスト

1. コードを `main` に push → Cloudflare Pages がビルド成功するか
2. microCMS で記事を更新 → GitHub Actions の **Trigger Cloudflare Pages Deploy** が走るか
3. Actions 成功後、Cloudflare Pages に新しいデプロイが作成されるか
4. 公開 URL でコンテンツが更新されているか

## 7. よくあるつまずき

| 症状 | 確認すること |
| --- | --- |
| microCMS 更新しても Actions が動かない | Webhook のトリガーイベント名と `types` の一致、対象 API に Webhook があるか |
| Actions は成功するがサイトが変わらない | Cloudflare の環境変数、ビルドログ、Astro 側がその API を取得しているか |
| Actions の push が失敗する | Workflow permissions が Read and write か |
| ローカルと remote が分岐する | Actions の空コミットとローカルコミットの競合。`git pull --rebase` してから `git push` |

## 参考リンク

- [Astro ドキュメント](https://docs.astro.build)
- [microCMS: GitHub Actions の Webhook 設定](https://help.microcms.io/ja/knowledge/webhook-github-actions-settings)
- [Cloudflare Pages](https://developers.cloudflare.com/pages/)
