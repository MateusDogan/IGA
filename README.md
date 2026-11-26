# IGA

Site institucional da **IGA Arquitetura**, escritório de três arquitetos e urbanistas que trabalha com arquitetura, interiores e design gráfico. É uma página única que apresenta o escritório, os serviços, os projetos e a equipe, e recebe pedidos de contato por um formulário.

Página estática em HTML, CSS e JavaScript puro, sem etapa de build. Publicada no GitHub Pages em `https://mateusdogan.github.io/IGA/`.

Para ver localmente, sirva a pasta com qualquer servidor estático (por exemplo `python -m http.server 8765`) e abra `http://localhost:8765`.

---

## O que falta

Lista revisada em 26/11/2026. Próximo passo: publicar a versão nova do script (bloco 1), enquanto o escritório reúne o conteúdo (bloco 2). Só entra aqui o que foi confirmado para o projeto. O que ficou de fora está no fim, em "Fora do projeto por enquanto".

### 1. Formulário: publicar a versão nova do script (você)

- [ ] **Publicar o script**: colar `docs/apps-script.gs`, rodar `configurar` uma vez, aceitar as permissões novas e publicar uma "Nova versão" (passo a passo em `docs/google-sheets-setup.md`, "Atualização de 25/11/2026"). Não é preciso criar propriedade nova: `EMAIL_ESCRITORIO`, `FORMULARIO_ABERTO` e `ULTIMO_PROTOCOLO` bastam; `SEGREDO` o script cria sozinho. Sem a versão nova, a conferência do domínio do e-mail, o alerta, o status, o resumo e a confirmação não funcionam.
- [ ] **Só depois, reordenar as colunas**: o script publicado hoje grava por posição. Com a versão nova, ele acha cada coluna pelo título, e a ordem fica livre (sugestão no guia).
- [ ] **Testar**: um envio real (aviso, confirmação, link "Confirmar meu e-mail", coluna `confirmado`) e `resumoSemanal` executado pelo editor.
- [ ] **Conferir a planilha**: se houver uma linha de teste "Maria Teste" (maria@empresa.com.br) de 26/11/2026, apagar. Ela pode ter vindo de um teste local.

### 2. Conteúdo do escritório

- [ ] **Imagens em alta**: Projetos e o hero usam renders tirados do Instagram (Residência CP, Salão JM e Estande Alux), com 900 a 1440 px. Pedir os arquivos originais e, se houver, fotos de obra pronta.
- [ ] **Projetos de design gráfico**: não há nenhum no site. O texto de Projetos diz "casas, interiores e estandes" até chegar algum.
- [ ] **Confirmar textos**: nomes, locais e textos dos projetos (vieram das legendas do Instagram), bios da equipe (resumidas do Instagram), textos do escritório e dos serviços (escritos para o site) e as quatro etapas de cada frente em "Do traço à entrega".
- [ ] **Área dos projetos**: m² de cada um, para o carimbo. Campo vazio não aparece.
- [ ] **Contatos reais**: e-mail e telefone são provisórios (`iga@e-mail.com`, `+55 01 29876-5432`) e o LinkedIn aponta para a página inicial da rede. Aparecem em `index.html` (aba de contato e rodapé), em `privacidade.html` e em `CONTACT_EMAIL`, no topo de `forms_validation.js`.
- [ ] **Endereço e região**: rua e CEP, para trocar `Organization` por `LocalBusiness` nos dados estruturados. Confirmar se o escritório quer dizer que atende a região (os projetos estão em Sorocaba e São Paulo).
- [ ] **Faixa de marcas**: mostra "Outro Ipsum." repetido. Trocar pelos logos dos clientes (exemplo `nome.svg` comentado em `index.html`) ou por uma frase real.
- [ ] **Perfil da Empresa no Google e Google Search Console**: criados pelo escritório. Funcionam no endereço atual. A meta tag do Search Console vai no `<head>`.
- [ ] **Licença e marca**: `TRADEMARKS.md` ainda tem `[Client Name]`. Confirmar a licença MIT do código (`LICENSE`); a marca e as fotos não entram nela.

### 3. Depende de conta ou domínio

- [ ] **Cloudflare Turnstile**: verificação anti-robô conferida pelo script. Depende de uma conta gratuita na Cloudflare, criada pelo escritório, e do domínio próprio. A chave pública vai no site; a secreta, nas Propriedades do script. Até lá, a confirmação por e-mail se apoia no limite de envios (3 por hora por e-mail, 30 no total) e nas armadilhas contra robôs. Se houver abuso, `CONFIRMACAO` = `false` desliga a confirmação na hora.
- [ ] **Domínio**: se houver, trocar `mateusdogan.github.io/IGA/` no `<head>` de `index.html` (`canonical`, `og:url`, `og:image`), em `robots.txt` e em `sitemap.xml`, nos caminhos `/IGA/` de `404.html` (ícone, fontes e link de volta), em `SITE_URL` de `docs/apps-script.gs`, e configurar no GitHub Pages.

### 4. Antes de publicar de vez

- [ ] **Política de privacidade**: revisão jurídica de `privacidade.html`. Ela já cita a planilha do Google, as fontes locais, o rascunho salvo no navegador, o e-mail de confirmação e a consulta do domínio.
- [ ] **Teste em aparelhos reais**: iPhone, Android e Safari no Mac (menu, galeria e seus controles, formulário, rodapé, rascunho, hero em pé, navbar ao rolar).

### Feito

**Marca e conversão**
- [x] Revisão de marca, conversão e SEO em `docs/revisao-design-conversao-seo.md`.
- [x] Seção "Do traço à entrega" em painel terracota, com abas e etapas próprias para Arquitetura, Interiores e Design gráfico.
- [x] Carimbo de prancha nas legendas dos projetos e na galeria, com número da prancha.
- [x] Chamadas "Começar um projeto de…" nos serviços e em Projetos, com o ponto terracota.
- [x] Painel de contato com o formulário em 2/3 da largura no desktop largo.
- [x] Galeria com controles na linguagem de prancha: "Fechar" e "Anterior / Próximo" em células retas com fio de 1px e setas de traço fino; no celular, barra fixa embaixo.

**Navegação e interação**
- [x] Navbar não some com o mouse em cima nem durante a rolagem depois de um clique no menu.
- [x] Clique no hero troca a foto.
- [x] Cursor: barra de digitação nos campos, círculo com seta nas fotos, moldura terracota só no hover e formato atualizado ao rolar a página.

**Conteúdo e SEO local**
- [x] Campinas no título, na descrição, no hero e nos dados estruturados; Instagram real (`@iga.arquitetura`).
- [x] Projetos (Residência CP, Salão JM, Estande Alux), fotos 2 e 3 do hero e bios da equipe com o conteúdo do Instagram; imagens provisórias apagadas.

**Formulário** (as linhas com "script" valem depois de publicar a versão nova, bloco 1)
- [x] Frente do projeto obrigatória, gravada na coluna `tipo`.
- [x] Rascunho salvo só no navegador (localStorage, sem cookies), apagado após o envio ou em 30 dias.
- [x] Script: conferência do domínio do e-mail. Recusa só domínio que não existe ou não recebe e-mail (consulta MX). Domínio próprio de empresa passa.
- [x] Script: alerta ao escritório quando os envios recusados passam de 15 numa hora.
- [x] Script: coluna `status` (Novo, Em contato, Proposta, Fechado) e resumo semanal por e-mail às segundas.
- [x] Script: colunas achadas pelo título da linha 1, com ordem livre na planilha.
- [x] Script: e-mail de confirmação para quem enviou, com protocolo, resumo e link assinado que preenche a coluna `confirmado`.

**Desempenho e privacidade**
- [x] Fontes servidas pelo próprio site (sem Google Fonts).
- [x] Hero com versão retrato mais leve no celular.
- [x] Política de privacidade atualizada com fontes locais, rascunho, frente do projeto, e-mail de confirmação e consulta do domínio.
- [x] Página 404 conferida no site publicado (fontes e ícone carregam).

**Código**
- [x] Revisão dos scripts (26/11/2026): formulário e Apps Script reorganizados por partes, sem duplicação de regras e sem lista de domínios. Comportamento conferido no navegador e com uma planilha simulada.

### Fora do projeto por enquanto

Podem voltar se o escritório pedir.

- Aba "Suspeitos" na planilha (25/11/2026).
- Lista de e-mails temporários e sugestão de correção de digitação no e-mail: recusariam ou corrigiriam endereços reais de domínios fora das listas (26/11/2026).
- Campos de orçamento, prazo e área no formulário; anexos no Drive (25/11/2026).
- Botão de WhatsApp, agendamento de conversa e registro de consentimento LGPD com limpeza automática (25/11/2026).
- Estatísticas de visitas (25/11/2026).
- Esconder a faixa de marcas: ela fica até chegarem os logos (25/11/2026).

---

## Dependências do projeto

O site não tem etapa de build nem gerenciador de pacotes (sem npm, sem bundler).

**Em produção**

- **GitHub Pages:** hospeda a pasta inteira a partir da branch `main`. O endereço atual é `https://mateusdogan.github.io/IGA/`.
- **Fontes:** Jost, Libre Caslon Display e Julius Sans One ficam em `Public/assets/fontes/` (WOFF2, só alfabetos latinos, licença SIL OFL nos arquivos `OFL-*.txt`). As regras estão em `Public/css/base/fonts.css`; `404.html` e `privacidade.html` declaram só Jost e Libre Caslon Display no próprio `<style>`. Nenhuma página consulta o Google Fonts.
- **Google Apps Script:** recebe o formulário, valida, grava na planilha, avisa o escritório por e-mail e devolve o protocolo. A URL está em `GOOGLE_SCRIPT_URL`, em `Public/scripts/forms_validation.js`.
- **Google Sheets:** planilha privada onde ficam as mensagens. Compartilhada só com o escritório. Colunas em `docs/google-sheets-setup.md`.
- **Gmail (via `MailApp`):** envia o aviso de cada contato. A cota depende da conta: cerca de 100 e-mails automáticos por dia numa conta Gmail comum, cerca de 1.500 no Google Workspace.

**Previstas**

- **Cloudflare Turnstile:** confere se quem envia é humano. Conta gratuita na Cloudflare, só para gerar as chaves.
- **cal.com:** só como link para agendar conversa, sem embutir no site.

**Para trabalhar no projeto**

- **Git** para versionar. O site não exige nenhum software para rodar.
- **Um servidor estático local**, como `python -m http.server 8765`.

---

## Estrutura

- `index.html`: página única, com todas as seções.
- `404.html`: página de erro, com estilos embutidos para não depender do resto.
- `privacidade.html`: política de privacidade.
- `Public/css/base/`: cores (`colors.css`), fontes (`fonts.css`) e estilo geral (`style.css`).
- `Public/css/components/`: navbar, cursor, faixa de marcas, barra de rolagem e `actions.css` (chamadas de contato e o ponto terracota).
- `Public/css/sections/`: uma folha por seção (hero, serviços, portfólio, processo, escritório, contato, rodapé).
- `Public/scripts/`: um script por comportamento:
  - `mouse.js`: cursor
  - `header.js`: navbar, menu do celular e cópia dos ícones de contato
  - `hero.js`: troca de fotos, automática e pelo clique
  - `process.js`: abas por frente em "Do traço à entrega"
  - `forms_validation.js`: formulário
  - `team.js`: bios da equipe no toque
  - `gallery.js`: galeria
  - `reveal.js`: revelação ao rolar
- `Public/assets/`: imagens em WebP, separadas por `marca`, `projetos` e `equipe`, e as fontes em `fontes`.
- `docs/`: passo a passo do formulário no Google Sheets, o script do Apps Script e a revisão de marca, conversão e SEO (`revisao-design-conversao-seo.md`).

### Como trocar o conteúdo

- **Foto de projeto**: em Projetos, troque o `src` e o `alt` do `<img>`, o carimbo da `<figcaption>` (nome, tipo, local, área, ano) e o texto em `.portfolio-details`. O número da prancha é automático e a galeria lê tudo isso sozinha.
- **Foto do hero**: cada `<img class="hero-slide">` tem `data-name` e `data-meta`, que viram a legenda. Cada foto fica num `<picture>` com uma versão retrato (`*-retrato.webp`, recorte central de 4:5) para celular em pé; ao trocar a foto, gere o recorte também. Com uma foto só, a troca automática desliga.
- **Links de contato**: edite só a aba `#social-links` em `index.html`. No celular e no tablet o site copia esses links para o rodapé e para o formulário. Os links das colunas do rodapé do desktop ficam em `#footer-row` e precisam ser trocados também.
- **Versão dos arquivos**: todo CSS e JS em `index.html` termina em `?v=AAAAMMDD` (hoje `?v=20261126c`). Troque esse valor em todos os links a cada publicação. Sem isso, o navegador de quem já visitou o site continua usando os arquivos antigos.

### Cursor

O cursor customizado (`mouse.js` e `mouse.css`) só aparece em aparelhos com mouse e muda de forma conforme o lugar:

- **Padrão**: anel creme que inverte as cores do fundo. Sobre o painel oliva, fica creme sem inverter.
- **Links e botões**: o anel cresce. No menu e no rodapé, ele vira o sublinhado da palavra.
- **Campos do formulário**: barra de digitação creme, sem atraso, para enxergar e selecionar texto sobre a oliva.
- **Fotos de Projetos**: círculo creme com a seta ↗, que abre a galeria. A foto ganha uma moldura terracota só no hover. Quando a galeria é aberta pelo teclado, a moldura volta como foco ao fechar.

### Painel de contato

No desktop largo (a partir de 1200 px), o formulário ocupa 2/3 do painel oliva e o rodapé vira uma coluna de índice separada por um fio fino. A altura do painel fica em torno de 670 px numa tela de 1536 × 730. Não diminua essa altura.

---

## Paleta e tipografia

As cores ficam só em `Public/css/base/colors.css`. Use sempre as variáveis:

| Variável | Cor | Uso |
| --- | --- | --- |
| `--linho` | `#F2E8DC` | fundo creme, texto sobre escuro |
| `--argila` | `#D9A58A` | acentos sobre a oliva |
| `--new-terracota` | `#B5583A` | acento principal: faixa de marcas, linha de cada serviço, sublinhado do menu, ponto de ação (ver abaixo) |
| `--terracota` | `#8F3F24` | painel "Do traço à entrega", etiquetas de Serviços, ícones da aba de contato, hover do botão Contato |
| `--oliva` / `--oliva-escura` | `#6B7A3F` / `#5A6735` | painel de contato e rodapé |
| `--grafite` / `--night` | `#2B2622` / `#1F1B18` | Projetos, textos escuros |
| `--white` | `#F7F2EC` | branco quente |

O verde ocupa o painel de Contato e o rodapé, então o terracota precisa aparecer em repouso, não só em hover.

**Ponto terracota.** O ponto do símbolo IGA marca onde a pessoa age ou onde ela está: chamadas de contato, botão de envio e o fim da confirmação de envio (em argila sobre a oliva). Ele também fecha o traço de "Do traço à entrega" (em creme sobre o painel terracota) e fica no canto de Projetos, como no logo. Não use o ponto como enfeite em outros lugares.

**Linguagem de prancha.** Botão Contato com "A1", carimbo nas legendas dos projetos, etiquetas retas, o seletor em células (`.segmented`, usado na frente do projeto do formulário e nas abas do processo) e o traço do processo vêm do desenho de arquitetura. Elementos novos devem seguir essa linguagem: cantos retos, linhas de 1px e nenhuma sombra.

Fontes (servidas pelo próprio site):

- **Jost:** texto.
- **Libre Caslon Display:** títulos.
- **Julius Sans One:** navegação e botão Contato.
