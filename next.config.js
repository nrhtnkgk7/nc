/** @type {import('next').NextConfig} */
const nextConfig = {
  images: { unoptimized: true },
  headers: async () => [
    {
      source: '/(.*)',
      headers: [
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'X-Frame-Options', value: 'DENY' },
        { key: 'X-XSS-Protection', value: '1; mode=block' },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        {
          key: 'Strict-Transport-Security',
          value: 'max-age=63072000; includeSubDomains; preload',
        },
      ],
    },
  ],
};

module.exports = nextConfig;
```

変更点は `output: 'export'` の行を削除しただけです。保存したら、pushします。
```
git add .
```
```
git commit -m "fix: remove static export for Vercel"
```
```
git push