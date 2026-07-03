# Manual de UX — Kzera

Documento normativo. Toda tela, componente ou estado novo deve seguir este manual sem exceção.  
Referência base: módulo Fidelidade (dashboard, configuração, cartão individual).

---

## 1. Dispositivo alvo

**iPhone 11 — 414 × 896 px — único dispositivo suportado.**

Não existe layout responsivo. Não existe breakpoint. Não existe adaptação para desktop, tablet ou outros celulares.  
O viewport do projeto é sempre 414 × 896 px.

### Consequências diretas

- Nunca adicionar `width: 414px` em `html` ou `body` — o viewport já é 414 px.
- Nunca centralizar conteúdo com `margin: auto` ou `max-width`.
- Nunca usar media queries.
- Todo elemento ocupa a largura total disponível.

---

## 2. Tokens de design

### 2.1 Cores

```css
:root {
  /* Marca */
  --purple:      #7B4DFF;
  --purple-dark: #5B2ECC;

  /* Base */
  --bg:          #F7F3FF;   /* fundo geral */
  --white:       #ffffff;
  --text:        #120B35;   /* texto principal */
  --muted:       #766BA8;   /* texto secundário / labels */
  --border:      #DDD6EE;   /* bordas neutras */

  /* Sucesso / verde */
  --green:       #087A36;
  --green-bg:    #DDF8E7;
  --green-bdr:   #A8E8BF;

  /* Perigo / vermelho */
  --danger:      #C62828;
  --danger-bg:   #FFF5F5;
  --danger-bdr:  #FFCDD2;

  /* Ouro (exclusivo cartão fidelidade) */
  --gold:        #C9A551;
  --gold-light:  #E8C57A;
  --gold-dim:    #8B6B2A;
  --gold-glow:   rgba(201,165,81,0.45);
}
```

Proibido usar cores fora desta lista sem aprovação. Proibido hardcodar hexadecimais fora do `:root`.

### 2.2 Tipografia

Fonte única: `-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif`  
Nunca importar fontes externas.

| Elemento | Tamanho | Peso | Observação |
|---|---|---|---|
| Título do header | 16px | 800 | letter-spacing: -0.02em |
| Título de bottom sheet | 20px | 900 | letter-spacing: -0.3px |
| Título de seção (tela normal) | 15px | 900 | letter-spacing: -0.02em |
| Cabeçalho de seção (label uppercase) | 13px | 900 | uppercase, letter-spacing: 0.07em, cor: --muted |
| Label de campo | 13px | 800 | cor: --muted |
| Valor de campo | 15px | 700 | |
| Botão primário | 16px | 800 | |
| Botão cancelar | 14px | 800 | |
| Botão ghost / perigo | 14px | 800 | |
| Botão do header | 13px | 800 | |
| Stat label (dashboard) | 12px | 800 | uppercase, letter-spacing: 0.06em |
| Stat value (dashboard) | 40px | 900 | letter-spacing: -0.03em, line-height: 1 |
| Hint / nota de campo | 11px | 700 | cor: #B0A8D0 |
| Badge de passo | 12px | 900 | |
| Descrição de bottom sheet | 13px | 700 | cor: --muted, line-height: 1.5 |

---

## 3. Estrutura base da tela

### 3.1 Tela normal (scrollável)

```css
body {
  background: var(--bg);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif;
  color: var(--text);
  min-height: 100vh;
}
```

```html
<div class="app-header"> ... </div>
<div class="screen"> ... </div>
```

`.screen` tem sempre `padding: 20px 16px 60px` — o padding-bottom de 60px garante que o último elemento não fique colado ao rodapé.

### 3.2 Tela com modal (bottom sheet ativo)

```css
html, body { overflow: hidden; }

body {
  background: var(--bg);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif;
  color: var(--text);
  position: fixed;
  width: 100%;
  height: 100%;
  overscroll-behavior: none;
}
```

Obrigatório incluir o script de bloqueio de scroll para WebKit iOS:

```html
<script>
document.addEventListener('touchmove', function(e) { e.preventDefault(); }, { passive: false });
</script>
```

Esse script deve estar imediatamente antes de `</body>`.  
**Motivo:** `overflow: hidden` sozinho não trava scroll no Safari/WebKit iOS. `position: fixed` + `overscroll-behavior: none` + `touchmove preventDefault` é a combinação obrigatória.

---

## 4. Componentes

### 4.1 App Header

Presente em todas as telas, sem exceção.

```css
.app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px 12px;
  background: #120B35;
  position: sticky;
  top: 0;
  z-index: 10;
}
```

**Estrutura interna:** hamburger (esquerda) · título (centro) · ação ou spacer (direita).

O elemento da direita pode ser:
- Um `<div class="spacer" style="width:28px">` quando não há ação — para manter o título centralizado.
- Um botão de ação (ex.: "Salvar", "Exportar").

**Hamburger:**
```css
.hamburger {
  display: flex; flex-direction: column; gap: 4px;
  width: 28px; height: 28px;
  background: none; border: none; padding: 2px;
  cursor: pointer; justify-content: center;
}
.hamburger span {
  display: block; width: 18px; height: 2px;
  border-radius: 2px; background: #fff;
}
```

**Botão de ação no header:**
```css
.btn-header {
  background: rgba(255,255,255,0.12);
  border: 1px solid rgba(255,255,255,0.22);
  border-radius: 10px;
  color: #fff;
  font-size: 13px; font-weight: 800;
  font-family: inherit;
  padding: 6px 12px;
  cursor: pointer;
}
```

Telas com modal (estado 2) **não** usam `position: sticky` no header — o header fica sob o overlay.

---

### 4.2 Cards

Card padrão de conteúdo:

```css
.card {
  background: var(--white);
  border: 1px solid var(--border);
  border-radius: 18px;
  padding: 16px;
  box-shadow: 0 2px 10px rgba(30,14,70,0.06);
}
```

Seções de formulário agrupam campos dentro de um `.card`.

---

### 4.3 Stat Cards (dashboard)

Usados em par, em grid de 2 colunas.

```css
.stat-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 32px;
}

.stat-card {
  background: var(--white);
  border: 1px solid var(--border);
  border-radius: 20px;
  padding: 20px 16px;
  box-shadow: 0 2px 10px rgba(30,14,70,0.06);
}

.stat-label {
  font-size: 12px; font-weight: 800;
  color: var(--muted);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin-bottom: 10px;
  line-height: 1.3;
  min-height: 32px; /* alinha valores quando labels têm alturas diferentes */
}

.stat-value {
  font-size: 40px; font-weight: 900;
  letter-spacing: -0.03em;
  line-height: 1;
}
```

**Estados visuais:**

| Estado | Borda | Fundo | Cor do valor |
|---|---|---|---|
| Positivo (tem cartão) | `--green-bdr` | `--green-bg` | `--green` |
| Neutro (sem cartão) | `--border` | `--white` | `#B0A8D0` |

---

### 4.4 Campos de formulário

```css
.field { margin-bottom: 14px; }
.field:last-child { margin-bottom: 0; }

.field label {
  display: block;
  font-size: 13px; font-weight: 800;
  color: var(--muted);
  margin-bottom: 6px;
}

.field-input {
  width: 100%; height: 48px;
  padding: 0 14px;
  border: 1px solid var(--border);
  border-radius: 13px;
  background: var(--bg);
  color: var(--text);
  font-size: 15px; font-weight: 700;
  font-family: inherit;
  display: flex; align-items: center;
}

/* Campo preenchido */
.field-input.filled {
  background: var(--white);
  border-color: #C4BAE4;
}

/* Campo vazio / placeholder */
.field-input.empty { color: #B0A8D0; }
```

**Hint (nota abaixo do campo):**
```css
.hint {
  font-size: 11px; font-weight: 700;
  color: #B0A8D0;
  margin-top: 5px;
  padding-left: 2px;
}
```

**Campo duplo (side-by-side):**
```css
.field-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}
```

---

### 4.5 Botões

#### Primário
```css
.btn-primary {
  width: 100%; height: 54px;
  border-radius: 16px; border: none;
  background: linear-gradient(180deg, var(--purple) 0%, var(--purple-dark) 100%);
  color: #fff;
  font-size: 16px; font-weight: 800;
  font-family: inherit; cursor: pointer;
  box-shadow: 0 8px 24px rgba(91,46,204,0.35);
}
```

#### Cancelar (dentro de bottom sheet)
```css
.btn-cancel {
  width: 100%; height: 44px;
  border: none; background: transparent;
  color: var(--purple);
  font-size: 14px; font-weight: 800;
  font-family: inherit; cursor: pointer;
}
```

#### Ghost (ação secundária em tela)
```css
.btn-ghost {
  width: 100%; height: 48px;
  border-radius: 14px;
  border: 1px solid var(--border);
  background: #fff;
  color: var(--purple);
  font-size: 14px; font-weight: 800;
  font-family: inherit; cursor: pointer;
}
```

#### Perigo
```css
.btn-danger {
  width: 100%; height: 48px;
  border-radius: 14px;
  border: 1px solid var(--danger-bdr);
  background: var(--white);
  color: var(--danger);
  font-size: 14px; font-weight: 800;
  font-family: inherit; cursor: pointer;
}
```

#### Adicionar (pontilhado)
```css
.btn-add {
  width: 100%; height: 46px;
  border-radius: 13px;
  border: 1px dashed #C4BAE4;
  background: transparent;
  color: var(--purple);
  font-size: 14px; font-weight: 800;
  font-family: inherit; cursor: pointer;
  margin-top: 10px;
  display: flex; align-items: center; justify-content: center; gap: 6px;
}
```

**Ordem de botões em qualquer tela:**
1. Botão primário (ação principal)
2. Botão perigo (ação destrutiva, quando existir)
3. Botão cancelar (dentro de bottom sheet)

Nunca inverter essa ordem.

---

### 4.6 Toggle

```css
.toggle {
  width: 42px; height: 24px;
  border-radius: 12px;
  position: relative; cursor: pointer; flex-shrink: 0;
}

/* Ligado */
.toggle {
  background: var(--green-bg);
  border: 1px solid var(--green-bdr);
}
.toggle::after {
  content: '';
  position: absolute;
  top: 3px; right: 3px;
  width: 16px; height: 16px;
  border-radius: 50%;
  background: var(--green);
}

/* Desligado */
.toggle.off {
  background: #F0EDF8;
  border: 1px solid var(--border);
}
.toggle.off::after {
  right: auto; left: 3px;
  background: #C4BAE4;
}
```

Sempre usado em `.toggle-row`:
```css
.toggle-row {
  display: flex; align-items: center;
  justify-content: space-between; gap: 10px;
}
.toggle-label { font-size: 13px; font-weight: 700; color: var(--muted); }
```

---

### 4.7 Seletor de status (3 opções)

```css
.status-selector {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 6px;
}

.status-option {
  height: 40px; border-radius: 11px;
  border: 1px solid var(--border);
  background: var(--bg); color: var(--muted);
  font-size: 12px; font-weight: 800;
  font-family: inherit; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
}

.status-option.active-green  { background: var(--green-bg);  border-color: var(--green-bdr); color: var(--green); }
.status-option.active-muted  { background: #F0EDF8; border-color: #C4BAE4; color: #4A3880; }
.status-option.active-danger { background: var(--danger-bg); border-color: var(--danger-bdr); color: var(--danger); }
```

Padrão de 3 opções de status: **Ativa · Inativa · Arquivada**.

---

### 4.8 Seção de formulário

```css
.section { margin-bottom: 28px; }

.section-head {
  font-size: 13px; font-weight: 900;
  color: var(--muted);
  text-transform: uppercase;
  letter-spacing: 0.07em;
  margin-bottom: 10px;
}
```

Estrutura:
```html
<div class="section">
  <div class="section-head">Nome da seção</div>
  <div class="card">
    <!-- campos -->
  </div>
</div>
```

---

### 4.9 Badge de passo (prêmio)

```css
.prize-step-badge {
  font-size: 12px; font-weight: 900;
  color: #8B6B2A;
  background: #FFF3CC;
  border: 1px solid #DDB84A;
  border-radius: 8px;
  padding: 3px 10px;
}
```

---

## 5. Padrão de modal — Bottom Sheet

**Todo modal do sistema é um bottom sheet. Nenhuma exceção.**  
Modais centralizados, drawers laterais ou qualquer outro padrão são proibidos.

### 5.1 Estrutura HTML

```html
<!-- Conteúdo de fundo (desfocado) -->
<div class="bg-content">
  <!-- header + conteúdo da tela anterior -->
</div>

<!-- Overlay escuro -->
<div class="overlay"></div>

<!-- Painel do modal -->
<div class="bottom-sheet">
  <div class="sheet-handle"></div>
  <div class="sheet-title">Título</div>
  <div class="sheet-desc">Descrição opcional.</div>

  <!-- conteúdo do modal -->

  <button class="btn-primary">Ação principal</button>
  <button class="btn-cancel">Cancelar</button>
</div>
```

### 5.2 CSS obrigatório

```css
.bg-content {
  opacity: 0.35;
  pointer-events: none;
  filter: blur(1px);
}

.overlay {
  position: fixed;
  inset: 0;
  background: rgba(8,4,22,0.5);
  z-index: 20;
}

.bottom-sheet {
  position: fixed;
  bottom: 0; left: 0; right: 0;
  background: var(--bg);
  border-radius: 28px 28px 0 0;
  padding: 12px 16px 40px;
  box-shadow: 0 -12px 48px rgba(18,8,45,0.3);
  z-index: 30;
}

.sheet-handle {
  width: 40px; height: 4px;
  border-radius: 2px;
  background: #C4BAE4;
  margin: 0 auto 20px;
}

.sheet-title {
  font-size: 20px; font-weight: 900;
  color: var(--text);
  letter-spacing: -0.3px;
  margin-bottom: 4px;
}

.sheet-desc {
  font-size: 13px; font-weight: 700;
  color: var(--muted);
  line-height: 1.5;
  margin-bottom: 20px;
}
```

### 5.3 z-index obrigatório

| Camada | z-index |
|---|---|
| Conteúdo normal | — |
| Header sticky | 10 |
| Overlay | 20 |
| Bottom sheet | 30 |

Nunca usar valores diferentes sem razão técnica documentada.

### 5.4 Scroll lock (obrigatório em toda tela com modal)

```css
html, body { overflow: hidden; }

body {
  position: fixed;
  width: 100%;
  height: 100%;
  overscroll-behavior: none;
}
```

```html
<script>
document.addEventListener('touchmove', function(e) { e.preventDefault(); }, { passive: false });
</script>
```

**Regra:** `overflow: hidden` sozinho não trava o scroll no WebKit iOS. As três técnicas devem ser aplicadas juntas.

---

## 6. Padrões de opção com radio (dentro de bottom sheet)

```css
.option-list { display: flex; flex-direction: column; gap: 10px; margin-bottom: 20px; }

.option-btn {
  width: 100%; padding: 16px;
  border-radius: 16px;
  border: 2px solid var(--border);
  background: var(--white);
  cursor: pointer; text-align: left;
  font-family: inherit;
  display: flex; align-items: center; gap: 14px;
}
.option-btn.selected { border-color: var(--purple); }

.option-radio {
  width: 20px; height: 20px;
  border-radius: 50%;
  border: 2px solid var(--border);
  flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
}
.option-btn.selected .option-radio {
  border-color: var(--purple);
  background: var(--purple);
}
.option-btn.selected .option-radio::after {
  content: '';
  width: 7px; height: 7px;
  border-radius: 50%;
  background: #fff;
}

.option-label { font-size: 15px; font-weight: 800; color: var(--text); margin-bottom: 2px; }
.option-sublabel { font-size: 12px; font-weight: 700; color: var(--muted); }
```

---

## 7. Espaçamentos

| Contexto | Valor |
|---|---|
| Padding lateral da tela | 16px |
| Padding topo da tela | 20px ou 24px |
| Padding rodapé da tela (scrollável) | 60px |
| Gap entre seções | 28px |
| Gap entre campos dentro de card | 14px |
| Gap entre cards em grid | 12px |
| Gap entre botões de ação | 8px |
| Padding interno do bottom sheet | 12px 16px 40px |

---

## 8. Regras de engine — WebKit iOS

Todo novo arquivo deve ser testado considerando o WebKit (Safari iOS / app Claude). As seguintes regras nunca podem ser ignoradas:

1. **`overflow: hidden` em `body` não basta** para travar scroll — sempre combinar com `position: fixed`, `overscroll-behavior: none` e `touchmove preventDefault`.
2. **`position: fixed`** é o posicionamento correto para overlay e bottom sheet — o viewport do projeto é o próprio iPhone.
3. **Nunca usar `position: absolute`** para overlay/modal — depende de um pai com `position: relative` e quebraria em scroll.
4. **Não adicionar `width: 414px`** em `html` ou `body` — causa conteúdo deslocado no WebKit real.
5. **`min-height: 32px` em labels** quando dois stat cards ficam lado a lado e os labels podem ter alturas diferentes — garante alinhamento dos valores.

---

## 9. Nomenclatura de arquivos

Formato: `[módulo]-[número-estado]-[descrição].html`

Exemplos:
- `dashboard-fidelidade-1.html` — estado padrão
- `dashboard-fidelidade-2.html` — estado com bottom sheet ativo
- `config-fidelidade-1-formulario.html`
- `config-fidelidade-2-adicionar-premio.html`
- `fidelidade-individual.html`

Cada estado de UI que difere visualmente é um arquivo separado.

---

## 10. Checklist de validação antes de entregar qualquer tela

- [ ] Validado com Playwright a 414 × 896 px, `deviceScaleFactor: 1`
- [ ] Nenhum espaço em branco extra no topo (ausência de width hacks em html/body)
- [ ] Header está fixo no topo sem deslocamento
- [ ] Tela com modal: scroll travado (testar arraste no WebKit)
- [ ] Labels de stat cards com `min-height` quando lado a lado
- [ ] Overlay com `z-index: 20`, bottom sheet com `z-index: 30`
- [ ] Cores exclusivamente das variáveis CSS definidas no `:root`
- [ ] Fontes exclusivamente do stack system-ui (sem imports externos)
- [ ] Botão primário sempre antes do botão cancelar
- [ ] `touchmove preventDefault` presente em toda tela com modal ativo
- [ ] Print enviado ao líder somente após validação passar 100%

---

## 11. O que é proibido

- Modais centralizados, sidesheets, drawers laterais
- Media queries ou qualquer lógica responsiva
- Importação de fontes externas
- Cores fora das variáveis do `:root`
- `width: 414px` ou `max-width` em `html`/`body`
- `position: absolute` para overlay ou modal
- Commitar sem autorização explícita do líder
- Enviar print ao líder sem validação prévia no Playwright
