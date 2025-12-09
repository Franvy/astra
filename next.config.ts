import createBundleAnalyzer from '@next/bundle-analyzer';
import { createMDX } from 'fumadocs-mdx/next';
import type { NextConfig } from 'next';

const withAnalyzer = createBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

const config: NextConfig = {
  reactStrictMode: true,
  experimental: {
    viewTransitions: true,
  },
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  serverExternalPackages: [
    'ts-morph',
    'typescript',
    'oxc-transform',
    'twoslash',
    'shiki',
    '@takumi-rs/image-response',
  ],
  images: {
    remotePatterns: [
        {
            protocol: 'https',
            hostname: 's2.loli.net',
            port: '',
            pathname: '/**',
        },
        {
            protocol: 'https',
            hostname: 'i.loli.net',  // SM.MS 使用的图片域名
            port: '',
            pathname: '/**', // 匹配所有路径
        },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
        port: '',
      },
    ],
  },
  async rewrites() {
    return [];
  },
  async redirects() {
    return [];
  },
};

const withMDX = createMDX();

export default withAnalyzer(withMDX(config));
