// 这个文件现在不再需要，因为我们使用本地搜索
// 如果将来需要重新启用 Orama Cloud，可以恢复此文件

export async function updateSearchIndexes(): Promise<void> {
  console.log('Using local search, skipping Orama Cloud sync');
}
