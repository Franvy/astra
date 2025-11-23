'use client';

import { RootProvider } from 'fumadocs-ui/provider/base';
import dynamic from 'next/dynamic';
import type { ReactNode } from 'react';
import { TooltipProvider } from '@radix-ui/react-tooltip';
import { useEffect } from 'react';

const SearchDialog = dynamic(() => import('@/components/search'), {
  ssr: false,
});

const inject = `
// 立即更新 theme-color（在页面渲染前）
(function() {
  const updateThemeColor = () => {
    const isDark = document.documentElement.classList.contains('dark');
    const color = isDark ? '#020617' : '#ffffff';
    let metaThemeColor = document.querySelector('meta[name="theme-color"]');
    
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', color);
    } else {
      metaThemeColor = document.createElement('meta');
      metaThemeColor.setAttribute('name', 'theme-color');
      metaThemeColor.setAttribute('content', color);
      document.head.appendChild(metaThemeColor);
    }
  };
  
  // 立即执行
  updateThemeColor();
  
  // 监听主题变化
  const observer = new MutationObserver(updateThemeColor);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class'],
  });
})();

// uwu 模式处理
const urlParams = new URLSearchParams(window.location.search);
const uwuParam = urlParams.get("uwu");

if (typeof uwuParam === 'string') {
    localStorage.setItem('uwu', uwuParam);
}

const item = localStorage.getItem('uwu')

if (item === 'true') {
    document.documentElement.classList.add("uwu")
}
`;

function ThemeColorSync() {
  useEffect(() => {
    const updateThemeColor = () => {
      const isDark = document.documentElement.classList.contains('dark');
      const color = isDark ? '#020617' : '#ffffff';
      
      // 查找所有 theme-color meta 标签（可能有多个）
      const metaThemeColors = document.querySelectorAll('meta[name="theme-color"]');
      
      if (metaThemeColors.length > 0) {
        // 更新所有已存在的 meta 标签
        metaThemeColors.forEach((meta) => {
          meta.setAttribute('content', color);
        });
      } else {
        // 如果不存在，创建一个
        const metaThemeColor = document.createElement('meta');
        metaThemeColor.setAttribute('name', 'theme-color');
        metaThemeColor.setAttribute('content', color);
        document.head.appendChild(metaThemeColor);
      }
    };

    // 立即执行一次（在浏览器渲染前尽可能早地更新）
    updateThemeColor();
    
    // 使用 requestAnimationFrame 确保在下一帧更新（更早）
    requestAnimationFrame(updateThemeColor);

    // 监听主题变化
    const observer = new MutationObserver(updateThemeColor);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);

  return null;
}

export function Provider({ children }: { children: ReactNode }) {
  return (
    <RootProvider
      search={{
        SearchDialog,
      }}
    >
      <TooltipProvider>
        <ThemeColorSync />
        <script
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: inject }}
        />
        {children}
      </TooltipProvider>
    </RootProvider>
  );
}
