/** サイト共通の仮情報（ロゴ画像の代わりに社名テキストを使用） */
export const SITE_NAME = 'Demo Site';

export type NavItem = {
  href: string;
  label: string;
};

/** グローバルメニュー / フッターサイトマップ用（仮） */
export const NAV_ITEMS: NavItem[] = [
  { href: '/', label: 'ホーム' },
  { href: '/#news', label: 'お知らせ' },
  { href: '/#blog', label: 'ブログ' },
  { href: '/about/', label: 'About' },
];

/** Astro の BASE_URL を考慮したパス生成 */
export function sitePath(path: string): string {
  const base = import.meta.env.BASE_URL || '/';
  if (path.startsWith('#')) {
    return `${base}${path}`.replace(/\/+#/, '/#');
  }
  if (path === '/') {
    return base;
  }
  return `${base}${path.replace(/^\//, '')}`.replace(/\/{2,}/g, '/');
}
