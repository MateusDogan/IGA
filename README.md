# IGA

Site institucional da IGA Arquitetura. Página estática em HTML, CSS e JavaScript puro, sem etapa de build.

Para ver localmente, sirva a pasta com qualquer servidor estático (por exemplo `python -m http.server 8765`) e abra `http://localhost:8765`.

## Estrutura

- `index.html`: página única, com todas as seções.
- `404.html`: página de erro, independente (estilos embutidos), para o GitHub Pages.
- `privacidade.html`: política de privacidade.
- `Public/css/base/`: cores (`colors.css`), fontes (`fonts.css`) e estilo geral (`style.css`).
- `Public/css/components/`: navbar, cursor personalizado, faixa de marcas, barra de rolagem.
- `Public/css/sections/`: uma folha por seção (hero, escritório, serviços, portfólio, contato, rodapé).
- `Public/scripts/`: um script por comportamento (cursor, navbar, hero, formulário, equipe, galeria, revelação ao rolar).
- `Public/assets/`: imagens em WebP, separadas por `marca`, `projetos` e `equipe`.
- `docs/`: passo a passo para ligar o formulário a uma planilha do Google Sheets.

## Paleta e tipografia

As cores ficam só em `Public/css/base/colors.css`. Use sempre as variáveis. As variáveis antigas (`--rosa`, `--musgo`, `--musgo-hover`, `--jet`, `--navy-dark`) são apelidos das novas e ainda estão em uso (ver a seção de limpeza).

Fontes: Jost (texto) e Libre Caslon Display (títulos), além de Julius Sans One na navegação e no carimbo do Contato.

---

## Limpeza e melhorias pendentes

Revisão feita sem alterar nenhum arquivo do site. Cada item indica o arquivo e o que fazer. Ordem: primeiro o que afeta contraste e consistência, depois a limpeza de código.

### 1. Contraste e legibilidade

- [x] **Títulos do rodapé em argila** (`Public/css/sections/footer.css`, regra `.footer-col h3`): argila `#D9A58A` sobre oliva `#6B7A3F` dá cerca de 2,2:1, quase invisível. Trocar `color` para `var(--linho)`, o que dá cerca de 3,8:1 (aceitável para texto grande). Atualizar o comentário da regra.
- [x] **Hover do carimbo do Contato** (`Public/css/components/navbar.css`, `.header-cta:hover`): creme sobre `#B5583A` fica perto do limite para texto pequeno em maiúsculas. Trocar o fundo do hover para `var(--terracota)` (`#8F3F24`), o que dá cerca de 6,5:1. Ajustar também a borda do hover.
- [x] **Placeholders do formulário** (`Public/css/sections/contact.css`, `::placeholder`): `rgba(247, 242, 236, 0.6)` sobre o painel oliva fica baixo. Testar com 0.75 ou usar o creme sólido.

### 2. Consistência visual

- [x] **Duas linguagens de forma**: o carimbo do Contato tem cantos retos, mas o botão Menu no celular (`navbar.css`, `.menu-toggle`) e o botão da página 404 (`404.html`, `a.voltar`) são pílulas (`border-radius: 999px`). Decidir: se o carimbo é a marca, os botões secundários também podem ter cantos retos. Feito: botão Menu, botão de envio, etiquetas de Serviços e botão da 404 agora são retos. Os botões redondos de ícone da galeria ficaram.
- [x] **Cursor sobre a galeria**: o cursor personalizado fica abaixo do `<dialog>` (top layer), então aparece o cursor nativo dentro da galeria. Opção: mover o elemento `#custom-cursor` para dentro do `<dialog>` ao abrir (`Public/scripts/gallery.js` e `mouse.js`). Feito: o cursor entra no `<dialog>` ao abrir e volta ao `body` ao fechar (`gallery.js`).
- [x] **Seta ↗ nas fotos do portfólio**: sugere link externo, mas abre a galeria. Trocar por "+" ou por uma etiqueta "ver" (`portfolio.css`). Feito: virou "+".
- [x] **Sublinhado duplicado no menu**: o item atual já tem sublinhado terracota e o hover também sublinha. Remover um dos dois (`navbar.css`, `.nav-link[aria-current]`). Feito: com o cursor sobre o item atual, o sublinhado fixo some.
- [x] **Imagem de compartilhamento** (`Public/assets/marca/compartilhar.jpg`): ainda usa as cores antigas. Refazer com a paleta atual. Feito: mesma foto e texto, em tons quentes da paleta.
- [x] **Pretos fora da paleta**: `office.css` usa `rgba(21, 21, 21, …)` e `rgba(58, 58, 58, …)`; `portfolio.css` usa `rgba(21, 18, 16, …)` e `#38312C`. Trocar por `--grafite` (`#2B2622`) ou `--night` (`#1F1B18`) para manter a paleta quente.

### 3. Limpeza de código

- [x] **Apelidos antigos de cor**: substituir por nomes da paleta atual e depois remover os apelidos de `colors.css`.
  - `--rosa` vira `--linho`: `style.css`, `contact.css`.
  - `--musgo` e `--musgo-hover` viram `--oliva` e `--oliva-escura`: `contact.css`, `footer.css`.
  - `--jet` e `--navy-dark` viram `--grafite`: `marquee.css`, `office.css`, `contact.css`.
- [x] **Cores fixas fora de `colors.css`**: `#2B2622` em `navbar.css` (5 vezes) e `portfolio.css` (2 vezes) vira `var(--grafite)`. `#fff` em `mouse.css`, `hero.css` e `portfolio.css` vira `var(--white)`. `#F2E8DC` em `portfolio.css` vira `var(--linho)`. A página 404 tem cores embutidas de propósito, porque é independente.
- [x] **Typo de id**: `#socila-links` em `index.html` (linha 278) e `contact.css` (linhas 48, 56, 63, 250, 251). Renomear para `#social-links` nos dois arquivos, de uma vez.
- [x] **Regras duplicadas entre arquivos**: `.service-body` e `.service-photo` aparecem em `services.css` e `portfolio.css`. `.field textarea`, `.hero-caption` e `.hero-line` aparecem em dois arquivos cada. `body {` aparece em três. Conferir qual definição vale e apagar a outra, provavelmente cópias de quando o CSS foi dividido. Revisto: não havia cópias entre arquivos (o levantamento contou regras repetidas dentro do mesmo arquivo). As de `hero.css` foram unidas; as de `services.css` separam estado normal e transição, de propósito.
- [x] **Propriedades sem efeito**: `font-stretch` (`style.css`, em `strong` e `p`) e `font-variation-settings: 'ital' 0` (`style.css`, em `body`). A Jost não tem eixo de largura, então `font-stretch` provavelmente não faz nada. Confirmar no navegador e remover.
- [x] **`!important` no cursor** (`mouse.css` linhas 5 e 56; `portfolio.css` linhas 272 e 273): são intencionais, para vencer o `cursor: pointer` dos links. Manter, mas documentar no comentário. Feito: comentários adicionados; as regras da galeria saíram junto com o ajuste do cursor.
- [x] **`.gitignore`**: as linhas `server`, `Public/assets/icons/` e `Public/assets/img/` apontam para pastas que não existem. Remover ou confirmar se são de uso futuro. Feito: agora ignora só `.DS_Store` e `Thumbs.db`.
- [x] **Classe possivelmente sobrando**: `.field textarea` em `portfolio.css` parece cópia do formulário de contato. Conferir se é usada. Revisto: `.field textarea` só existe em `contact.css`; não há sobra.

### 4. Arquivos de imagem

- [ ] **`Public/assets/projetos/Mata-Atlantica.webp`** (351 KB): não é referenciado em nenhuma página. Ou usar em um projeto do portfólio, ou apagar para reduzir o peso do repositório. Não apagar sem confirmar com a cliente, porque pode ser foto de projeto liberada.
- [ ] **Imagens genéricas `generico-*.webp`**: são placeholders. Substituir pelas fotos reais quando a cliente enviar, e apagar os genéricos.
- [x] **Foto3**: o `Foto3.jpg` original foi removido e substituído por `Foto3-900.webp`. Conferir no GitHub que a versão antiga não ficou referenciada em outro lugar. Feito: nenhuma referência a `Foto3.jpg`.

### 5. Verificações antes de publicar

- [x] Conferir o carimbo do Contato e o painel oliva em largura de celular (menos de 999 px). Feito: carimbo ok; no celular a aba dos ícones foi para o alto e o rodapé ganhou duas colunas.
- [ ] Enviar uma mensagem de teste pelo formulário (feito por você, com dados de teste) e confirmar a linha na planilha. Ver `docs/google-sheets-setup.md`.
- [x] Testar com `prefers-reduced-motion` ativado: o cursor, a navbar e a revelação ao rolar devem ficar sem animação. Conferido no código: cursor, hero, revelação e navbar respeitam a preferência.
- [x] Checar a navegação por teclado: foco visível em links, botões, carimbo e itens da galeria. Feito: contorno de foco em todos os links e botões (argila sobre a oliva); os links do rodapé tinham o contorno removido.

### 6. Depende da cliente (bloqueado)

- [ ] Links reais de Instagram e LinkedIn (`index.html`; hoje são `https://www.instagram.com/` e `https://www.linkedin.com/`).
- [ ] E-mail (`iga@e-mail.com`) e telefone (`tel:+5501298765432`) de contato, que parecem provisórios.
- [ ] Fotos, nomes e descrições reais do portfólio e da equipe (`generico-*`, `Bel`, `Ga_muhein`, `Gu_Henrique`).
- [ ] Logos das marcas para a faixa de marcas. O exemplo `nome.svg` está dentro de um comentário em `index.html`, não quebra a página.
- [ ] Domínio definitivo em `<head>`, `robots.txt` e `sitemap.xml` (hoje apontam para `mateusdogan.github.io/IGA/`).
- [ ] Revisão jurídica de `privacidade.html`.
- [ ] `TRADEMARKS.md` ainda tem o placeholder `[Client Name]`.
- [ ] Croquis e textos finais do escritório e dos serviços.

---

## Já revisado, sem problema encontrado

- Todas as folhas de estilo e scripts listados em `index.html` existem.
- Nenhuma imagem referenciada em uso está faltando.
- Nenhum `console.log`, `TODO` ou `debugger` nos arquivos do site.
- Nenhum código comentado solto nos scripts.
- Os scripts verificam `prefers-reduced-motion` e `IntersectionObserver`, com fallback.
