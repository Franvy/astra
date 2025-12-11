'use client';

import { useEffect, useState } from 'react';
import { Header } from 'fumadocs-ui/layouts/home';
import { baseOptions, linkItems } from '@/lib/layout.shared';
import { ArticleThemeToggle } from './article-theme-toggle';

export function ArticleNavController() {
  const [showNav, setShowNav] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  // 调试：监听 showNav 变化
  useEffect(() => {
    console.log('🎯 [ArticleNavController] showNav 当前值:', showNav);
  }, [showNav]);

  useEffect(() => {
    // 检测是否为桌面端
    const checkDesktop = () => {
      const desktop = window.innerWidth >= 768;
      console.log('📱 [ArticleNavController] isDesktop:', desktop);
      setIsDesktop(desktop);
    };

    checkDesktop();
    window.addEventListener('resize', checkDesktop);

    return () => window.removeEventListener('resize', checkDesktop);
  }, []);

  useEffect(() => {
    if (!isDesktop) return;

    // 鼠标移动检测
    const handleMouseMove = (e: MouseEvent) => {
      const windowWidth = window.innerWidth;
      const rightExclusionZone = 120; // 右侧120px不触发（主题按钮区域）

      // 鼠标在顶部80px且在左侧或中间区域（不包括右侧120px）
      if (e.clientY < 80 && e.clientX < windowWidth - rightExclusionZone) {
        setShowNav(true);
      } else if (e.clientY > 120) {
        // 鼠标离开顶部区域
        setShowNav(false);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isDesktop]);

  // 移动端/平板：不渲染任何内容
  if (!isDesktop) {
    return null;
  }

  // 桌面端
  return (
    <div data-article-nav-controller="true">

       {/*导航栏 - 鼠标移到顶部左侧/中间时显示*/}
      <div
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-out ${
          showNav ? 'translate-y-0 visible opacity-100' : '-translate-y-full invisible opacity-0'
        }`}
        style={{
          willChange: 'transform, opacity',
        }}
      >
        <Header {...baseOptions()} links={linkItems} />
      </div>

      {/* 主题切换按钮 - 导航栏隐藏时显示 */}
      <div
        className={`transition-all duration-300 ${
          showNav ? 'opacity-0 invisible pointer-events-none' : 'opacity-100 visible'
        }`}
      >
        <ArticleThemeToggle />
      </div>
    </div>
  );
}
