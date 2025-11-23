import { create, search as oramaSearch, insert, type AnyOrama } from '@orama/orama';

// 本地搜索索引类型
export interface SearchDocument {
  id: string;
  title: string;
  content: string;
  url: string;
  section?: string;
  tag?: string;
}

// 创建本地搜索实例
let oramaInstance: AnyOrama | null = null;

export async function getOramaInstance(): Promise<AnyOrama> {
  if (oramaInstance) {
    return oramaInstance;
  }

  // 创建 Orama 数据库
  oramaInstance = await create({
    schema: {
      id: 'string',
      title: 'string',
      content: 'string',
      url: 'string',
      section: 'string',
      tag: 'string',
    },
  });

  // 如果有预先构建的索引数据，在这里加载
  if (typeof window !== 'undefined') {
    try {
      const response = await fetch('/search-index.json');
      if (response.ok) {
        const documents: SearchDocument[] = await response.json();

        // 批量插入文档
        for (const doc of documents) {
          await insert(oramaInstance, doc);
        }

        console.log(`Loaded ${documents.length} documents into search index`);
      }
    } catch (error) {
      console.error('Failed to load search index:', error);
    }
  }

  return oramaInstance;
}

// 搜索函数
export async function searchDocuments(
  query: string,
  options?: {
    tag?: string;
    limit?: number;
  }
) {
  const db = await getOramaInstance();

  const results = await oramaSearch(db, {
    term: query,
    properties: ['title', 'content'],
    limit: options?.limit || 10,
    ...(options?.tag && {
      where: {
        tag: options.tag,
      },
    }),
  });

  return results;
}

// 重置索引（用于开发环境）
export async function resetOramaInstance() {
  oramaInstance = null;
}
