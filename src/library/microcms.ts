import { createClient, type MicroCMSQueries, type MicroCMSListResponse } from 'microcms-js-sdk';

/**
 * カテゴリーの型定義
 */
export type Category = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  revisedAt: string;
};

/**
 * ニュース記事の型定義
 */
export type News = {
  id: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  revisedAt: string;
  title: string;
  content?: string;
  category?: Category;
  [key: string]: any;
};

/**
 * microCMS接続クライアントの初期化
 */
export const client = createClient({
  serviceDomain: import.meta.env.MICROCMS_SERVICE_DOMAIN,
  apiKey: import.meta.env.MICROCMS_API_KEY,
});

/**
 * ニュース一覧を取得する関数
 * @param queries クエリパラメータ（取得件数や並び順など）
 */
export const getNewsList = async (queries?: MicroCMSQueries) => {
  return await client.get<MicroCMSListResponse<News>>({
    endpoint: 'news',
    queries,
  });
};

/**
 * ニュース詳細を1件取得する関数
 * @param contentId 記事のID
 * @param queries クエリパラメータ
 */
export const getNewsDetail = async (contentId: string, queries?: MicroCMSQueries) => {
  return await client.getListDetail<News>({
    endpoint: 'news',
    contentId,
    queries,
  });
};

/**
 * バナーの型定義
 */
export type Banner = {
  image?: {
    url: string;
    height: number;
    width: number;
  };
  url?: string;
  description?: string;
};

/**
 * バナーを取得する関数
 */
export const getBanner = async () => {
  return await client.get<Banner>({
    endpoint: 'banner',
  });
};

/**
 * ブログ記事の型定義
 */
export type Blog = {
  id: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  revisedAt: string;
  title?: string;
  content?: string;
  mainVisual?: {
    url: string;
    height?: number;
    width?: number;
  };
  eyecatch?: {
    url: string;
    height?: number;
    width?: number;
  };
  category?: Category;
  [key: string]: any;
};

/**
 * ブログ一覧を取得する関数
 * @param queries クエリパラメータ（取得件数や並び順など）
 */
export const getBlogList = async (queries?: MicroCMSQueries) => {
  return await client.get<MicroCMSListResponse<Blog>>({
    endpoint: 'bulog',
    queries,
  });
};

/**
 * ブログ詳細を1件取得する関数
 * @param contentId 記事のID
 * @param queries クエリパラメータ
 */
export const getBlogDetail = async (contentId: string, queries?: MicroCMSQueries) => {
  return await client.getListDetail<Blog>({
    endpoint: 'bulog',
    contentId,
    queries,
  });
};

