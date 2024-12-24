import {
  Tree,
} from '@nx/devkit';
import { GenerateAngularApplicationGeneratorSchema } from './schema';
import { applicationGenerator } from '@nx/angular/generators';

export async function generateAngularApplicationGenerator(
  tree: Tree,
  options: GenerateAngularApplicationGeneratorSchema
) {
  await applicationGenerator(tree, {
    ...options,
    standalone: true,
    style: 'scss',
    directory: `${options.domain}`,
    tags: `domain:${options.domain}, type:app`,
    routing: true
  });

  const indexHtmlPath = `apps/${options.domain}/${options.name}/src/index.html`;
  const appCompHtml = `apps/${options.domain}/${options.name}/src/app/app.component.html`
  const appCompTs = `apps/${options.domain}/${options.name}/src/app/app.component.ts`
  const appCompSpec = `apps/${options.domain}/${options.name}/src/app/app.component.spec.ts`

  tree.delete(`apps/${options.domain}/${options.name}/src/app/nx-welcome.component.ts`);

  const appCompHtmlContent = tree.read(appCompHtml);
  if (appCompHtmlContent) {
    tree.write(appCompHtml, appCompHtmlContent.toString().replace('<business-tools-monorepo-nx-welcome></business-tools-monorepo-nx-welcome>', ''));
  }

  const appCompTsContent = tree.read(appCompTs);
  if (appCompTsContent) {
    tree.write(appCompTs, appCompTsContent.toString().replace('NxWelcomeComponent, ', ''));
    tree.write(appCompTs, appCompTsContent.toString().replace(`import { NxWelcomeComponent } from './nx-welcome.component';`, ''));
  }

  const appCompSpecContent = tree.read(appCompSpec);
  if (appCompSpecContent) {
    tree.write(appCompSpec, appCompSpecContent.toString().replace('NxWelcomeComponent, ', ''));
    tree.write(appCompSpec, appCompSpecContent.toString().replace(`import { NxWelcomeComponent } from './nx-welcome.component';`, ''));
  }

  // Add external CSS to index.html
  const indexHtmlContent = tree.read(indexHtmlPath);
  if (indexHtmlContent) {
    tree.write(`${indexHtmlPath}`,
      indexHtmlContent.toString().replace('</head>',
      `    <link rel="stylesheet" href="https://necolas.github.io/normalize.css/7.0.0/normalize.css">
  </head>`
    ));
  }
}

export default generateAngularApplicationGenerator;

