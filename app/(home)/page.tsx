import Link from 'next/link';
import { blog } from '@/lib/source';
import { PathUtils } from 'fumadocs-core/source';
import { LiquidGlassCard } from './liquid-glass-card';

function getName(path: string) {
  return PathUtils.basename(path, PathUtils.extname(path));
}

export default function Page() {
  const posts = [...blog.getPages()].sort(
    (a, b) =>
      new Date(b.data.date ?? getName(b.path)).getTime() -
      new Date(a.data.date ?? getName(a.path)).getTime(),
  );

  return (
    <main className="mx-auto w-full max-w-fd-container px-4 pt-6 pb-12 md:py-12">
      <div className="relative mb-6 aspect-[3.2] px-4 py-8 sm:px-6 md:px-12 md:py-12 flex items-center justify-center overflow-hidden rounded-2xl border border-fd-border bg-fd-background/50 backdrop-blur-sm">
        <LiquidGlassCard />
        <h1
          className="relative z-10 text-center text-fd-info dark:text-fd-card-foreground font-mono font-medium tracking-tight leading-relaxed max-w-full"
          style={{ fontSize: 'clamp(0.75rem, 2.5vw, 1.25rem)' }}
        >
            The creators, developers, and innovators leaving the world better than they found it.
        </h1>
        {/*<p className="text-sm font-mono text-blue-400">*/}
        {/*    The creators, developers, and innovators leaving the world better than they found it.*/}
        {/*</p>*/}
      </div>
      <div className="grid grid-cols-1 gap-2 md:grid-cols-3 xl:grid-cols-4">
        {posts.map((post) => (
          <Link
            key={post.url}
            href={post.url}
            className="flex flex-col bg-fd-card rounded-2xl border shadow-sm p-4 transition-colors hover:bg-fd-accent hover:text-fd-accent-foreground"
          >
            <p className="font-medium">{post.data.title}</p>
            <p className="text-sm text-fd-muted-foreground">
              {post.data.description}
            </p>

            <p className="mt-auto pt-4 text-xs text-brand">
              {new Date(post.data.date ?? getName(post.path)).toDateString()}
            </p>
          </Link>
        ))}
      </div>
    </main>
  );
}
