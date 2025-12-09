"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const GrainGradient = dynamic(
  () => import("@paper-design/shaders-react").then((mod) => mod.GrainGradient),
  {
    ssr: false,
  }
);

export function LiquidGlassCard({ onLoaded }: { onLoaded?: () => void }) {
  const [isDark, setIsDark] = useState(true);
  const [mounted, setMounted] = useState(false);

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
      // 等待一个短暂的延迟确保 GrainGradient 完全渲染
      const timer = setTimeout(() => {
        onLoaded?.();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [mounted, onLoaded]);

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

  return (
    <div
      className="absolute inset-0 size-full -z-1 overflow-hidden"
      style={{ backgroundColor: theme.bg }}
    >
      <GrainGradient
        className="absolute inset-0"
        colors={theme.colors}
        colorBack={theme.bg}
        softness={0.6}
        intensity={1.2}
        noise={0.8}
        shape="corners"
      />
    </div>
  );
}
