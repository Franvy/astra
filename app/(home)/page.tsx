import Link from 'next/link';
import { blog } from '@/lib/source';
import { PathUtils } from 'fumadocs-core/source';
import { HeroSection } from './hero-section';

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
      <HeroSection />
      <div className="grid grid-cols-1 gap-2 md:grid-cols-3 xl:grid-cols-4">
        {posts.map((post) => (
          <Link
            key={post.url}
            href={post.url}
            className="flex flex-col bg-fd-card rounded-2xl border shadow-sm p-4 transition-all duration-300 hover:bg-fd-accent hover:text-fd-accent-foreground hover:scale-[1.02] hover:shadow-md"
          >
            <p className="font-medium">{post.data.title}</p>
            <p className="text-sm text-fd-muted-foreground">
              {post.data.description}
            </p>

            <p className="mt-auto pt-4 text-xs text-brand">
              {new Date(post.data.date ?? getName(post.path)).toISOString().split('T')[0]}
            </p>
          </Link>
        ))}
      </div>
    </main>
  );
}
