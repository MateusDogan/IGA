# IGA

Site institucional da **IGA Arquitetura**, escritório de três arquitetos e urbanistas que trabalha com arquitetura, interiores e design gráfico. É uma página única que apresenta o escritório, os serviços, os projetos e a equipe, e recebe pedidos de contato por um formulário.

Página estática em HTML, CSS e JavaScript puro, sem etapa de build. Publicada no GitHub Pages em `https://mateusdogan.github.io/IGA/`.

Para ver localmente, sirva a pasta com qualquer servidor estático (por exemplo `python -m http.server 8765`) e abra `http://localhost:8765`.

---

## O que falta

### Conteúdo da cliente

- [ ] **Fotos dos projetos**: as 7 fotos `generico-*.webp` em Projetos são ilustrações provisórias. Trocar e apagar os genéricos.
- [ ] **Fotos 2 e 3 do hero**: `hero-generico-2-1440.webp` (interiores) e `hero-design-1440.webp` (design gráfico) são provisórias. Trocar `src`, `alt`, `data-name` e `data-meta` em `index.html`.
- [ ] **Nomes e textos dos projetos**: os 7 itens se chamam "Nome do projeto". Os resumos e textos da galeria (`.portfolio-details`) são de exemplo.
- [ ] **Bios da equipe**: estão em inglês, com texto de exemplo ("It is a long established fact…"). Faltam o texto real e a função de cada pessoa.
- [ ] **Faixa de marcas**: mostra "Outro Ipsum." repetido. Trocar pelos logos dos clientes (o exemplo `nome.svg` está comentado em `index.html`) ou por uma frase real. Se nada chegar, dá para esconder a faixa.
- [ ] **Links e contatos**: Instagram e LinkedIn apontam para a página inicial de cada rede. O e-mail `iga@e-mail.com` e o telefone `+55 01 29876-5432` são provisórios. Eles aparecem em `index.html` (aba de contato e rodapé), em `privacidade.html` e na mensagem de erro de `forms_validation.js`.
- [ ] **Textos do escritório e dos serviços**: revisar com a cliente. Os textos atuais foram escritos para o site e não vieram dela. Croquis, se ela quiser usar.
- [ ] **Etapas do processo** ("Do traço à entrega"): confirmar as quatro etapas de cada frente (Arquitetura, Interiores, Design gráfico) e o texto de cada uma.
- [ ] **Carimbo dos projetos**: local ("Cidade, UF") e área ("180 m²") de cada projeto. Campo vazio não aparece.
- [ ] **Cidade e região atendida**: entra numa linha de apoio no hero, nos dados estruturados (`LocalBusiness` com endereço) e no alt das fotos. É o que mais pesa para aparecer em buscas locais.
- [ ] **WhatsApp**: número para um botão ao lado do envio do formulário.
- [ ] **Perfil da Empresa no Google e Google Search Console**: criados pelo escritório; funcionam no endereço atual, sem domínio próprio. A meta tag de verificação do Search Console vai no `<head>`.

### Antes de publicar de vez

- [ ] **Domínio**: se houver domínio próprio, trocar `mateusdogan.github.io/IGA/` no `<head>` de `index.html` (`canonical`, `og:url`, `og:image`), em `robots.txt` e em `sitemap.xml`, e configurar o domínio no GitHub Pages.
- [ ] **Script do formulário**: confirmar que a versão atual de `docs/apps-script.gs` está publicada como "Nova versão" no Apps Script, com as propriedades `EMAIL_ESCRITORIO` e `FORMULARIO_ABERTO` e as colunas G `protocolo` e H `tipo` na planilha (passo a passo em `docs/google-sheets-setup.md`).
- [ ] **Teste do formulário**: enviar uma mensagem de teste pelo site publicado e conferir a confirmação com protocolo, a linha na planilha e o e-mail de aviso.
- [ ] **Política de privacidade**: revisão jurídica de `privacidade.html`. Ela precisa dizer que as fontes vêm do Google Fonts, que recebe o IP de quem visita, e que as mensagens do formulário ficam numa planilha do Google. A alternativa é hospedar as fontes no próprio site.
- [ ] **Licença e marca**: `TRADEMARKS.md` ainda tem `[Client Name]`. Confirmar com a cliente se o código fica sob a licença MIT (`LICENSE`, em nome de Mateus Dogan); a marca e as fotos não entram nessa licença.
- [ ] **Teste em aparelhos reais**: um iPhone e um Android (menu, galeria, formulário, rodapé), além de Safari no Mac. Os testes até aqui foram no navegador, simulando as larguras.

### Formulário: proteção (fase 2)

- [ ] **Cloudflare Turnstile**: o site envia um token de "humano" e o script confere com a Cloudflare, exigindo o domínio da IGA. Depende de uma conta gratuita na Cloudflare, criada pelo escritório, para gerar as chaves. A chave pública vai no site; a secreta fica nas Propriedades do script.
- [ ] **Aba "Suspeitos"**: o que falha em regras que podem pegar gente real (e-mail descartável, domínio sem e-mail) vai para outra aba em vez de ser recusado.
- [ ] **E-mail mais rigoroso**: recusar domínios descartáveis, conferir se o domínio recebe e-mail (consulta MX) e sugerir correção de erros comuns ("gmial.com").
- [ ] **Alerta ao escritório** se a aba de suspeitos crescer de repente.

### Formulário: e-mail para quem enviou (fase 3)

- [ ] **Confirmação por e-mail** com o protocolo, o resumo e o prazo de resposta, no visual da marca. Só sai depois da fase 2, para o formulário não virar disparador de e-mails.
- [ ] **Link de verificação**: a linha entra como "não confirmado" e vira "confirmado" com o clique. Ninguém é bloqueado por não clicar.
- [ ] **Cota de e-mails**: conta Gmail envia cerca de 100 e-mails automáticos por dia; Google Workspace, cerca de 1.500.

### Formulário: extras (fase 4, a escolher)

- [ ] Tipo de projeto em etiquetas, faixa de orçamento, prazo e área aproximada.
- [ ] Anexos (planta, fotos, referências) numa pasta do Drive.
- [ ] Colunas de status na planilha (Novo, Em contato, Proposta, Fechado) e resumo semanal por e-mail.
- [ ] Rascunho salvo no navegador, botão de WhatsApp e agendamento de conversa (cal.com, só como link).
- [ ] Consentimento LGPD com data e hora, e limpeza automática de contatos antigos.

### Opcional

- [ ] Estatísticas de visitas (Plausible, GoatCounter ou Google Analytics). Se entrar, atualizar a política de privacidade, que hoje diz que o site não usa rastreamento.
- [ ] Versões menores das fotos do hero para celular (hoje há só a de 1440 px).

---

## Dependências do projeto

O site não tem etapa de build nem gerenciador de pacotes (sem npm, sem bundler).

**Em produção**

- **GitHub Pages:** hospeda a pasta inteira a partir da branch `main`. O endereço atual é `https://mateusdogan.github.io/IGA/`.
- **Google Fonts:** carrega Jost, Libre Caslon Display e Julius Sans One em `index.html`. `404.html` e `privacidade.html` carregam só Jost e Libre Caslon Display.
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
- `Public/assets/`: imagens em WebP, separadas por `marca`, `projetos` e `equipe`.
- `docs/`: passo a passo do formulário no Google Sheets, o script do Apps Script e a revisão de marca, conversão e SEO (`revisao-design-conversao-seo.md`).

### Como trocar o conteúdo

- **Foto de projeto**: em Projetos, troque o `src` e o `alt` do `<img>`, o carimbo da `<figcaption>` (nome, tipo, local, área, ano) e o texto em `.portfolio-details`. O número da prancha é automático e a galeria lê tudo isso sozinha.
- **Foto do hero**: cada `<img class="hero-slide">` tem `data-name` e `data-meta`, que viram a legenda. Com uma foto só, a troca automática desliga.
- **Links de contato**: edite só a aba `#social-links` em `index.html`. No celular e no tablet o site copia esses links para o rodapé e para o formulário. Os links das colunas do rodapé do desktop ficam em `#footer-row` e precisam ser trocados também.
- **Versão dos arquivos**: todo CSS e JS em `index.html` termina em `?v=AAAAMMDD` (hoje `?v=20261125f`). Troque esse valor em todos os links a cada publicação. Sem isso, o navegador de quem já visitou o site continua usando os arquivos antigos.

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

Fontes, todas do Google Fonts:

- **Jost:** texto.
- **Libre Caslon Display:** títulos.
- **Julius Sans One:** navegação e botão Contato.
