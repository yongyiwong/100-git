import * as fg from 'fast-glob';
import * as fs from 'fs';
import * as path from 'path';
function createEntitiesIndex() {
  console.log('Creating entity-index.ts for backend app');
  const src = `${path.dirname(__dirname)}/apps/backend/src`;
  if (!fs.existsSync(src)) {
    console.log(`App api cannot be found. Path not exist: ${src}`);
    process.exit(1);
  }
  const outDir = `${src}/database`;
  const tmpFile = `${outDir}/tmp-entities-index.ts`;
  const outFile = `${outDir}/entities-index.ts`;
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir);
  }
  console.log(fg.sync(`../apps/backend/src/app/user/*.entity.ts`));
  for (const item of fg.sync(`../apps/**/*.entity.ts`)) {
    console.log(item)
    const filePath = path.relative(outDir, item).replace(/\.ts$/, '');
    const data = `export * from '${filePath}'\n`;
    fs.writeFileSync(tmpFile, data, { flag: 'a+' });
  }

  if (fs.existsSync(outFile) && fs.existsSync(tmpFile)) {
    fs.unlinkSync(outFile);
    console.log(`Old file '${outFile}' removed`);
  }
  if (fs.existsSync(tmpFile)) {
    fs.renameSync(tmpFile, outFile);
    console.log(`New file ${outFile} saved`);
  }

}

createEntitiesIndex();
