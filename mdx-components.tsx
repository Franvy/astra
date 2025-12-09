import defaultMdxComponents from 'fumadocs-ui/mdx';
import * as FilesComponents from 'fumadocs-ui/components/files';
import * as TabsComponents from 'fumadocs-ui/components/tabs';
import type { MDXComponents } from 'mdx/types';
import { Accordion, Accordions } from 'fumadocs-ui/components/accordion';
import * as icons from 'lucide-react';
import Image from 'next/image';

export function getMDXComponents(components?: MDXComponents) {
  return {
    ...(icons as unknown as MDXComponents),
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
