import createBundleAnalyzer from '@next/bundle-analyzer';
import { createMDX } from 'fumadocs-mdx/next';
import type { NextConfig } from 'next';

const withAnalyzer = createBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

const config: NextConfig = {
  reactStrictMode: true,
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
  // Webpack 内存优化配置
  webpack: (config, { dev, isServer }) => {
    if (dev) {
      // 开发模式下的内存优化
      config.optimization = {
        ...config.optimization,
        // 减少内存使用
        minimize: false,
        // 移除未使用的导出
        usedExports: true,
        // 减少模块图
        removeAvailableModules: true,
        // 移除空的 chunks
        removeEmptyChunks: true,
      };

      // 减少并行处理数量以降低内存峰值
      config.parallelism = 1;

      // 禁用源映射以节省内存（开发时可选）
      // config.devtool = false;
    }

    // 配置外部化某些大型依赖，减少打包体积
    if (isServer) {
      config.externals = [...(config.externals || []), 'shiki', 'twoslash'];
    }

    return config;
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
