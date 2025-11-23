import { loadEnvConfig } from '@next/env';
import { updateSearchIndexes } from './update-orama-index';

loadEnvConfig(process.cwd());

async function main() {
  await Promise.all([updateSearchIndexes()]);
}

main().catch((e) => {
  console.error('Failed to run post build script', e);
});
