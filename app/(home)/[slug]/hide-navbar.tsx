'use client';

import { useEffect } from 'react';

export function HideNavBar() {
  useEffect(() => {
    // 只在桌面端执行
    if (window.innerWidth < 768) return;

    // 隐藏父级导航栏的函数
    const hideParentHeader = () => {
      const headers = document.querySelectorAll('header');

      console.log('=== HideNavBar 执行 ===');
      console.log('找到的 header 数量:', headers.length);

      headers.forEach((header, index) => {
        console.log(`Header ${index}:`, header);
        console.log(`Header ${index} 的父元素:`, header.parentElement);

        // 跳过在 ArticleNavController 内的 header
        const inArticleNav = header.closest('[data-article-nav-controller]');
        console.log(`Header ${index} 在 ArticleNavController 内?:`, !!inArticleNav);

        if (!inArticleNav) {
          (header as HTMLElement).style.display = 'none';
          console.log(`✅ Header ${index} 已隐藏`);
        } else {
          console.log(`⏭️  Header ${index} 被跳过（在 ArticleNavController 内）`);
        }
      });

      console.log('=== HideNavBar 执行完毕 ===');
    };

    // 立即执行
    console.log('⏰ 立即执行 hideParentHeader');
    hideParentHeader();

    // 延迟执行，确保 DOM 完全加载
    console.log('⏰ 设置延迟执行 (100ms)');
    const timer1 = setTimeout(() => {
      console.log('⏰ 延迟执行 hideParentHeader (100ms)');
      hideParentHeader();
    }, 100);

    const timer2 = setTimeout(() => {
      console.log('⏰ 延迟执行 hideParentHeader (300ms)');
      hideParentHeader();
    }, 300);

    // 使用 MutationObserver 持续监听 DOM 变化
    console.log('👀 启动 MutationObserver');
    const observer = new MutationObserver(() => {
      console.log('🔄 检测到 DOM 变化，重新执行 hideParentHeader');
      hideParentHeader();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    // 清理：离开页面时恢复
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      observer.disconnect();
      console.log('🔄 清理：恢复所有 header');
      const headers = document.querySelectorAll('header');
      headers.forEach((header) => {
        (header as HTMLElement).style.display = '';
      });
    };
  }, []);

  return null;
}
