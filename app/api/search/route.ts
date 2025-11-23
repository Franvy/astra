import { NextRequest, NextResponse } from 'next/server';
import { source, blog } from '@/lib/source';

// 使用动态渲染以支持实时搜索
export const dynamic = 'force-dynamic';

interface SearchResult {
  id: string;
  title: string;
  content: string;
  url: string;
  section?: string;
}

// 将标题转换为 URL 锚点 ID
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\u4e00-\u9fa5\s-]/g, '') // 移除特殊字符，保留中文
    .replace(/\s+/g, '-')                   // 空格转为横线
    .replace(/-+/g, '-')                    // 多个横线合并
    .trim();
}

// 从 Markdown 内容中提取标题和位置
function extractHeadings(content: string): Array<{ text: string; id: string; position: number }> {
  const headings: Array<{ text: string; id: string; position: number }> = [];
  const lines = content.split('\n');
  let currentPosition = 0;

  for (const line of lines) {
    const match = line.match(/^#{1,6}\s+(.+)$/);
    if (match) {
      const headingText = match[1].trim();
      headings.push({
        text: headingText,
        id: slugify(headingText),
        position: currentPosition,
      });
    }
    currentPosition += line.length + 1; // +1 for newline
  }

  return headings;
}

// 找到匹配位置最近的标题
function findNearestHeading(
  headings: Array<{ text: string; id: string; position: number }>,
  matchPosition: number
): string | undefined {
  let nearestHeading: string | undefined;

  for (const heading of headings) {
    if (heading.position <= matchPosition) {
      nearestHeading = heading.id;
    } else {
      break;
    }
  }

  return nearestHeading;
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('query') || '';

  if (!query) {
    return NextResponse.json([]);
  }

  // 限制搜索查询长度，防止内存溢出
  if (query.length > 100) {
    return NextResponse.json([]);
  }

  const results: SearchResult[] = [];
  const queryLower = query.toLowerCase();
  const MAX_RESULTS = 20; // 找到足够结果后提前退出

  // 搜索 docs 页面
  const docsPages = source.getPages();
  for (const page of docsPages) {
    // 早期退出：找到足够结果后停止
    if (results.length >= MAX_RESULTS) break;

    try {
      const titleMatch = page.data.title?.toLowerCase().includes(queryLower);
      const descMatch = page.data.description?.toLowerCase().includes(queryLower);

      let contentMatch = false;
      let matchedContent = page.data.description || '';
      let targetUrl = page.url;

      // 尝试搜索完整内容（只在标题和描述都不匹配时）
      if (!titleMatch && !descMatch && page.data.type !== 'openapi') {
        try {
          const fullContent = await page.data.getText('raw');
          if (fullContent) {
            const contentLower = fullContent.toLowerCase();
            contentMatch = contentLower.includes(queryLower);

            if (contentMatch) {
              const matchIndex = contentLower.indexOf(queryLower);

              // 提取所有标题
              const headings = extractHeadings(fullContent);

              // 找到最近的标题
              const nearestHeadingId = findNearestHeading(headings, matchIndex);

              // 添加锚点到 URL
              if (nearestHeadingId) {
                targetUrl = `${page.url}#${nearestHeadingId}`;
              }

              // 提取匹配上下文（前后各50个字符）
              const start = Math.max(0, matchIndex - 50);
              const end = Math.min(fullContent.length, matchIndex + queryLower.length + 50);
              matchedContent = '...' + fullContent.slice(start, end).trim() + '...';
            }
          }
        } catch (e) {
          // 如果无法加载内容，继续下一个
        }
      }

      if (titleMatch || descMatch || contentMatch) {
        results.push({
          id: page.url,
          title: page.data.title || '',
          content: matchedContent,
          url: targetUrl,
          section: page.data.title || '',
        });
      }
    } catch (error) {
      // 跳过有问题的页面
      console.error(`Error searching page ${page.url}:`, error);
    }
  }

  // 搜索 blog 文章
  const blogPages = blog.getPages();
  for (const page of blogPages) {
    // 早期退出：找到足够结果后停止
    if (results.length >= MAX_RESULTS) break;

    try {
      const titleMatch = page.data.title?.toLowerCase().includes(queryLower);
      const descMatch = page.data.description?.toLowerCase().includes(queryLower);

      let contentMatch = false;
      let matchedContent = page.data.description || '';
      let targetUrl = page.url;

      if (!titleMatch && !descMatch) {
        try {
          const fullContent = await page.data.getText('raw');
          if (fullContent) {
            const contentLower = fullContent.toLowerCase();
            contentMatch = contentLower.includes(queryLower);

            if (contentMatch) {
              const matchIndex = contentLower.indexOf(queryLower);

              // 提取所有标题
              const headings = extractHeadings(fullContent);

              // 找到最近的标题
              const nearestHeadingId = findNearestHeading(headings, matchIndex);

              // 添加锚点到 URL
              if (nearestHeadingId) {
                targetUrl = `${page.url}#${nearestHeadingId}`;
              }

              const start = Math.max(0, matchIndex - 50);
              const end = Math.min(fullContent.length, matchIndex + queryLower.length + 50);
              matchedContent = '...' + fullContent.slice(start, end).trim() + '...';
            }
          }
        } catch (e) {
          // 如果无法加载内容，继续下一个
        }
      }

      if (titleMatch || descMatch || contentMatch) {
        results.push({
          id: page.url,
          title: page.data.title || '',
          content: matchedContent,
          url: targetUrl,
          section: page.data.title || '',
        });
      }
    } catch (error) {
      console.error(`Error searching blog page ${page.url}:`, error);
    }
  }

  // 优先级排序：标题匹配 > 描述匹配 > 内容匹配
  results.sort((a, b) => {
    const aTitle = a.title.toLowerCase().includes(queryLower);
    const bTitle = b.title.toLowerCase().includes(queryLower);
    if (aTitle && !bTitle) return -1;
    if (!aTitle && bTitle) return 1;
    return 0;
  });

  return NextResponse.json(results);
}
