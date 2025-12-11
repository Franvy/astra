"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const GrainGradient = dynamic(
  () => import("@paper-design/shaders-react").then((mod) => mod.GrainGradient),
  {
    ssr: false,
    loading: () => null,
  }
);

export function LiquidGlassCard({ onLoaded }: { onLoaded?: () => void }) {
  const [isDark, setIsDark] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [shaderReady, setShaderReady] = useState(false);
  const [shaderError, setShaderError] = useState(false);

  useEffect(() => {
    // 等待客户端挂载完成
    setMounted(true);

    // 初始检测
    const checkTheme = () => {
      const htmlElement = document.documentElement;
      setIsDark(htmlElement.classList.contains("dark"));
    };

    checkTheme();

    // 监听主题变化
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (mounted) {
      // 延迟加载 shader，确保纹理资源有时间加载
      const timer = setTimeout(() => {
        setShaderReady(true);
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [mounted]);

  useEffect(() => {
    if (shaderReady || shaderError) {
      // 通知父组件加载完成
      const timer = setTimeout(() => {
        onLoaded?.();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [shaderReady, shaderError, onLoaded]);

  // 捕获 shader 错误
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      if (event.message?.includes('u_noiseTexture') || event.message?.includes('Paper Shaders')) {
        console.warn('Shader 加载失败，使用降级方案');
        setShaderError(true);
        event.preventDefault();
      }
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  const theme = isDark
    ? {
        colors: ["#020617", "#0C4A6E", "#0369A1", "#0EA5E9"],
        bg: "#020617",
      }
    : {
        colors: ["#73D14C", "#599FDB", "#91B1D8", "#B08FBC"],
        bg: "rgba(115,209,76,0.08)",
      };

  // 在客户端挂载完成前不显示
  if (!mounted) {
    return null;
  }

  // 降级方案：使用纯 CSS 渐变
  if (shaderError) {
    return (
      <div
        className="absolute inset-0 size-full -z-1 overflow-hidden"
        style={{
          background: isDark
            ? 'radial-gradient(ellipse at top left, #0C4A6E 0%, #020617 50%, #020617 100%)'
            : 'radial-gradient(ellipse at top left, rgba(115,209,76,0.3) 0%, rgba(115,209,76,0.08) 50%, rgba(115,209,76,0.05) 100%)',
        }}
      />
    );
  }

  return (
    <div
      className="absolute inset-0 size-full -z-1 overflow-hidden"
      style={{ backgroundColor: theme.bg }}
    >
      {shaderReady && (
        <GrainGradient
          className="absolute inset-0"
          colors={theme.colors}
          colorBack={theme.bg}
          softness={0.6}
          intensity={1.2}
          noise={0.8}
          shape="corners"
        />
      )}
    </div>
  );
}
