import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { blog } from '@/lib/source';
import { createMetadata } from '@/lib/metadata';
import { getMDXComponents } from '@/mdx-components';
import path from 'node:path';
import { ArticleNavController } from './article-nav-controller';
import { HideNavBar } from './hide-navbar';

export default async function Page(props: PageProps<'/[slug]'>) {
  const params = await props.params;
  const page = blog.getPage([params.slug]);

  if (!page) notFound();
  const { body: Mdx } = await page.data.load();

  return (
    <>
        <HideNavBar />
        <ArticleNavController />

        <article className="article-page flex flex-col mx-auto w-full max-w-[750px] px-4 py-8 md:pt-8 article-fade-in">


      <h1 className="text-4xl dark:text-gray-200 font-semibold mt-16 mb-10 font-[family-name:var(--font-nunito)]">{page.data.title}</h1>
      <p className="text-fd-muted-foreground mb-10 font-[family-name:var(--font-nunito)]">来自「Franvy」分享的技术方案和生活博客</p>

      <div className="flex flex-row gap-2 items-center text-sm mb-8 not-prose font-[family-name:var(--font-nunito)]">
        <Link
          href={`https://github.com/${page.data.author}`}
          target="_blank"
          rel="noopener noreferrer"
          className="block rounded-full overflow-hidden w-8 h-8 flex-shrink-0 hover:opacity-80 transition-opacity"
        >
          <img
            src={`https://s2.loli.net/2025/09/17/ToIiyLfOn49NPaG.png`}
            alt={page.data.author}
            className="w-full h-full object-cover block"
          />
        </Link>
          <div>
              <p className="font-bold">
                  Franvy
              </p>
          </div>
        <div className="ml-auto">
          <p className="font-bold border border-white rounded-full px-4 py-1">
            {new Date(
              page.data.date ??
                path.basename(page.path, path.extname(page.path)),
            ).toISOString().split('T')[0]}
          </p>
        </div>
      </div>

      <div className="prose min-w-0 flex-1">


        <Mdx components={getMDXComponents()} />
      </div>
    </article>
    </>
  );
}

export async function generateMetadata(
  props: PageProps<'/[slug]'>,
): Promise<Metadata> {
  const params = await props.params;
  const page = blog.getPage([params.slug]);

  if (!page) notFound();

  return createMetadata({
    title: page.data.title,
    description:
      page.data.description ?? 'The library for building documentation sites',
  });
}

export function generateStaticParams(): { slug: string }[] {
  return blog.getPages().map((page) => ({
    slug: page.slugs[0],
  }));
}
