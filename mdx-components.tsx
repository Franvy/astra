import defaultMdxComponents from 'fumadocs-ui/mdx';
import * as FilesComponents from 'fumadocs-ui/components/files';
import * as TabsComponents from 'fumadocs-ui/components/tabs';
import type { MDXComponents } from 'mdx/types';
import { Accordion, Accordions } from 'fumadocs-ui/components/accordion';
import Image from 'next/image';

// 只导入实际使用的图标，避免加载整个 lucide-react 库（1000+ 图标）
// 如需使用图标，请在此处按需导入，例如：
// import { Icon1, Icon2 } from 'lucide-react';

export function getMDXComponents(components?: MDXComponents) {
  return {
    // 移除了 ...(icons as unknown as MDXComponents) 以减少内存占用
    // 如需使用特定图标，请在此处添加：
    // Icon1,
    // Icon2,
    ...defaultMdxComponents,
    ...TabsComponents,
    ...FilesComponents,
    Accordion,
    Accordions,
    h1: (props) => <h1 className="text-gray-200" {...props} />,
    img: (props) => {
      // 如果是外部图片，使用原生 img 标签
      if (props.src?.startsWith('http')) {
        return (
          <img
            {...props}
            className="rounded-lg w-full h-auto my-4"
            loading="lazy"
          />
        );
      }
      // 本地图片使用 Next.js Image 组件
      return (
        <Image
          {...props}
          width={800}
          height={600}
          className="rounded-lg w-full h-auto my-4"
          alt={props.alt || ''}
        />
      );
    },
    ...components,
  } satisfies MDXComponents;
}

declare module 'mdx/types.js' {
  // Augment the MDX types to make it understand React.
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    type Element = React.JSX.Element;
    type ElementClass = React.JSX.ElementClass;
    type ElementType = React.JSX.ElementType;
    type IntrinsicElements = React.JSX.IntrinsicElements;
  }
}

declare global {
  type MDXProvidedComponents = ReturnType<typeof getMDXComponents>;
}
