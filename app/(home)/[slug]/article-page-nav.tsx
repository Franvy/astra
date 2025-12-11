'use client';

import { useEffect, useState } from 'react';
import { Header } from 'fumadocs-ui/layouts/home';
import { baseOptions, linkItems } from '@/lib/layout.shared';
import { ArticleThemeToggle } from './article-theme-toggle';

export function ArticlePageNav() {
  const [showNav, setShowNav] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    // 检测是否为桌面端
    const checkDesktop = () => {
      setIsDesktop(window.innerWidth >= 768);
    };

    checkDesktop();
    window.addEventListener('resize', checkDesktop);

    return () => window.removeEventListener('resize', checkDesktop);
  }, []);

  useEffect(() => {
    if (!isDesktop) return;

    // 隐藏父级导航栏的函数
    const hideParentNav = () => {
      const headers = document.querySelectorAll('header');

      // 将 headers 转为数组并只隐藏第一个（父级的）
      // 第二个是我们文章页渲染的
      if (headers.length >= 2) {
        // 隐藏第一个 header（父级的）
        (headers[0] as HTMLElement).style.display = 'none';
      } else if (headers.length === 1) {
        // 如果只有一个，检查是否在 article-page-nav 内
        const header = headers[0] as HTMLElement;
        const isArticleNav = header.closest('[data-article-page-nav]');
        if (!isArticleNav) {
          header.style.display = 'none';
        }
      }
    };

    // 立即执行
    hideParentNav();

    // 使用 setTimeout 确保 DOM 完全加载
    const timer = setTimeout(hideParentNav, 100);

    // 使用 MutationObserver 监听 DOM 变化
    const observer = new MutationObserver(hideParentNav);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    // 鼠标移动检测
    const handleMouseMove = (e: MouseEvent) => {
      const windowWidth = window.innerWidth;
      const rightExclusionZone = 120; // 右侧120px不触发

      // 鼠标在顶部80px且不在右侧区域
      if (e.clientY < 80 && e.clientX < windowWidth - rightExclusionZone) {
        setShowNav(true);
      } else if (e.clientY > 120) {
        setShowNav(false);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);

    // 清理：恢复父级导航栏
    return () => {
      clearTimeout(timer);
      observer.disconnect();

      const headers = document.querySelectorAll('header');
      if (headers.length >= 1) {
        (headers[0] as HTMLElement).style.display = '';
      }

      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isDesktop]);

  // 移动端/平板：不渲染任何内容
  if (!isDesktop) {
    return null;
  }

  // 桌面端
  return (
    <div data-article-page-nav="true">
      {/* 导航栏 - 鼠标悬停时显示 */}
      <div
        className={`fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ease-out ${
          showNav ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        <Header {...baseOptions()} links={linkItems} />
      </div>

      {/* 主题切换按钮 - 默认显示 */}
      <div
        className={`transition-all duration-300 ${
          showNav ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      >
        <ArticleThemeToggle />
      </div>
    </div>
  );
}
