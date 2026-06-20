const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');
const app = fs.readFileSync(path.join(root, 'src/app/createKzeraAuthenticatedApp.ts'), 'utf8');
const css = fs.readFileSync(path.join(root, 'public/styles.css'), 'utf8');
function assert(condition, message) { if (!condition) { throw new Error(message); } }
assert(css.includes('1.9.46 dashboard/home sanity'), 'CSS de correção do dashboard deve existir.');
assert(app.includes('>+ Perfil</button>'), 'Atalho novo perfil deve ter texto, não só ícone.');
assert(app.includes('>+ Item</button>'), 'Atalho novo item deve ter texto, não só ícone.');
assert(app.includes('>Importação</button>') && app.includes('>Código</button>') && app.includes('>Configurações</button>'), 'Mais deve ter ações textuais.');
assert(app.includes('<span>Perfis</span><strong>${perfisAtivos}</strong><small>Abrir</small>'), 'Card de perfis deve ser linha operacional.');
assert(app.includes('<span>Itens</span><strong>${itensAtivos}</strong><small>Abrir</small>'), 'Card de itens deve ser linha operacional.');
