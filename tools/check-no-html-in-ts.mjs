import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const srcDir = 'src';

const legacyAllowedFiles = new Set([
  "src/app/backupRestoreEntry.ts",
  "src/app/createItemCatalogoUiApp.ts",
  "src/app/createKzeraAuthenticatedApp.ts",
  "src/app/createPerfilUiApp.ts",
  "src/infrastructure/backup/BrowserBackupExporter.ts",
  "src/presentation/configuracoes/ConfiguracoesOperacionaisView.ts",
  "src/presentation/importacao/ImportacaoTransacoesFinanceiroView.ts",
  "src/presentation/item/ItemCatalogoDomView.ts",
  "src/presentation/perfil/PerfilDomView.ts",
  "src/presentation/shared/components/AppMenuButton.ts",
  "src/presentation/shared/ui/Badge.ts",
  "src/presentation/shared/ui/EmptyState.ts",
  "src/presentation/shared/ui/FeedbackPresenter.ts",
  "src/presentation/shared/ui/InfoItem.ts",
  "src/presentation/shared/ui/LoadingState.ts",
  "src/presentation/shared/ui/MetricCard.ts",
  "src/presentation/shared/ui/Toast.ts",
  "src/presentation/perfil/binders/PerfilDuplicidadeBinder.ts",
  "src/presentation/perfil/binders/PerfilFormBinder.ts",
  "src/presentation/perfil/binders/PerfilListBinder.ts",
  "src/presentation/perfil/binders/PerfilSearchBinder.ts",
  "src/presentation/perfil/renderers/PerfilCardRenderer.ts",
  "src/presentation/perfil/renderers/PerfilTimelineRenderer.ts",
  "src/presentation/perfil/components/ImportacaoBottomSheet/ImportacaoBottomSheet.ts",
  "src/presentation/perfil/components/ImportacaoFab/ImportacaoFab.ts",
  "src/presentation/perfil/components/PerfilCard/PerfilCard.ts",
  "src/presentation/item/binders/ItemImportacaoBinder.ts",
  "src/presentation/item/binders/ItemListBinder.ts",
  "src/presentation/item/renderers/ItemCardRenderer.ts",
  "src/presentation/item/renderers/ItemEditCardRenderer.ts",
  "src/presentation/item/renderers/LoteOperacionalRenderer.ts",
  "src/presentation/item/templates/ItemCatalogoTemplate.ts",
  "src/presentation/item/templates/ItemImportacaoTemplate.ts",
  "src/presentation/importacao/components/ImportacaoTabs.ts"
]);

const blockedPatterns = [
  /document\.createElement\s*\(/,
  /\.innerHTML\s*=/,
  /insertAdjacentHTML\s*\(/,
  /<\/?(?:div|form|button|input|section|article|main|p|h[1-6]|label|span)\b/
];

function toPosix(path) {
  return path.replaceAll('\\\\', '/');
}

function listTsFiles(dir) {
  return readdirSync(dir).flatMap(name => {
    const path = join(dir, name);
    const stat = statSync(path);
    if (stat.isDirectory()) return listTsFiles(path);
    return path.endsWith('.ts') ? [path] : [];
  });
}

const violations = listTsFiles(srcDir).flatMap(path => {
  const normalizedPath = toPosix(path);

  if (legacyAllowedFiles.has(normalizedPath)) {
    return [];
  }

  const content = readFileSync(path, 'utf8');

  return blockedPatterns
    .filter(pattern => pattern.test(content))
    .map(pattern => `${normalizedPath} viola bloqueio HTML-em-TS: ${pattern}`);
});

if (violations.length > 0) {
  console.error('Falha bloqueante: HTML/DOM estrutural em TypeScript sem autorização expressa.');
  for (const violation of violations) console.error(`- ${violation}`);
  process.exit(1);
}
