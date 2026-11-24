# IGA

Site institucional da **IGA Arquitetura**, escritório de três arquitetos e urbanistas que trabalha com arquitetura, interiores e design gráfico. É uma página única que apresenta o escritório, os serviços, os projetos e a equipe, e recebe pedidos de contato por um formulário.

Página estática em HTML, CSS e JavaScript puro, sem etapa de build. Publicada no GitHub Pages em `https://mateusdogan.github.io/IGA/`.

Para ver localmente, sirva a pasta com qualquer servidor estático (por exemplo `python -m http.server 8765`) e abra `http://localhost:8765`.

---

## Estado atual (novembro de 2026)

**O design e o código estão prontos.** O que falta é conteúdo real da cliente e alguns ajustes de publicação (lista abaixo).

O que já funciona:

- **Seções:** hero com 3 fotos que se alternam a cada 8 s, Serviços, Projetos (com galeria em tela cheia), Escritório (equipe com bio), faixa de marcas e Contato com formulário. Há também a política de privacidade e uma página 404.
- **Formulário:** validação nos campos, campo isca contra robôs e envio para uma planilha do Google (`docs/`).
- **Desktop:** cursor próprio. Ele vira o sublinhado nos links do menu e do rodapé, assume a forma do botão "Explore o espaço" e mostra "+" nas fotos. A navbar some ao rolar para baixo e volta ao rolar para cima.
- **Tablet (700 a 999 px):** menu em tela cheia e ícones de contato ao lado do título do formulário. O rodapé fica só com os direitos.
- **Celular (até 699 px):** textos de apoio cortados e rodapé só com os ícones de contato. O "Explore" vira uma linha animada no lugar do mouse.
- **Acessibilidade:** foco visível em todos os links e botões e navegação por teclado no menu e na galeria. Respeita "reduzir movimento". O site funciona sem JavaScript, mas sem o cursor e com as colunas do rodapé no lugar dos ícones.
- **Compartilhamento:** imagem e textos para WhatsApp e redes (`compartilhar.jpg`), `sitemap.xml` e `robots.txt`.

---

## O que falta

### Conteúdo da cliente

- [ ] **Fotos dos projetos**: as 7 fotos `generico-*.webp` em Projetos são ilustrações provisórias. Depois de trocar, apagar os genéricos.
- [ ] **Fotos 2 e 3 do hero**: `hero-generico-2-1440.webp` (interiores) e `hero-design-1440.webp` (design gráfico) também são provisórias. Trocar `src`, `alt`, `data-name` e `data-meta` em `index.html`.
- [ ] **Nomes e textos dos projetos**: os 7 itens se chamam "Nome do projeto". Os resumos e textos da galeria (`.portfolio-details`) são de exemplo.
- [ ] **Bios da equipe**: as três bios estão em inglês, com texto de exemplo ("It is a long established fact…"). Faltam o texto real e a função de cada pessoa.
- [ ] **Faixa de marcas**: mostra "Outro Ipsum." repetido. Trocar pelos logos dos clientes (o exemplo `nome.svg` está comentado em `index.html`) ou por uma frase real. Se nada chegar, dá para esconder a faixa.
- [ ] **Links e contatos**: os links de Instagram e LinkedIn apontam para a página inicial de cada rede. O e-mail `iga@e-mail.com` e o telefone `+55 01 29876-5432` são provisórios. Eles aparecem em `index.html` (aba de contato e rodapé), em `privacidade.html` e na mensagem de erro de `forms_validation.js`.
- [ ] **Textos do escritório e dos serviços**: revisar com a cliente. Os textos atuais foram escritos para o site e não vieram dela. Croquis, se ela quiser usar.

### Antes de publicar de vez

- [ ] **Domínio**: se houver domínio próprio, trocar `mateusdogan.github.io/IGA/` no `<head>` de `index.html` (`canonical`, `og:url`, `og:image`), em `robots.txt` e em `sitemap.xml`, e configurar o domínio no GitHub Pages.
- [ ] **Publicar o script novo do formulário**: colar `docs/apps-script.gs` no Apps Script, preencher as Propriedades do script e criar uma nova versão da implantação (ver `docs/google-sheets-setup.md`). Até lá o site continua funcionando com o script antigo, mas sem aviso por e-mail, sem protocolo e sem a validação do lado do servidor.
- [ ] **Teste do formulário**: enviar uma mensagem de teste pelo site publicado e conferir a linha na planilha (ver `docs/google-sheets-setup.md`).
- [ ] **Política de privacidade**: revisão jurídica de `privacidade.html`. A política deve citar que as fontes vêm do Google Fonts, que recebe o IP de quem visita. A outra saída é hospedar as fontes no próprio site.
- [ ] **Licença e marca**: `TRADEMARKS.md` ainda tem `[Client Name]`. Confirmar com a cliente se o código fica sob a licença MIT (`LICENSE`, em nome de Mateus Dogan); a marca e as fotos não entram nessa licença.
- [ ] **Teste em aparelhos reais**: um iPhone e um Android (menu, galeria, formulário, rodapé), além de Safari no Mac. Até aqui os testes foram feitos no navegador, simulando as larguras.

### Opcional

- Estatísticas de visitas (Plausible, GoatCounter ou Google Analytics). Se entrar, atualizar a política de privacidade, que hoje diz que o site não usa rastreamento.
- Versões menores das fotos do hero para celular (hoje há só a de 1440 px).

---

## Plano do formulário

O formulário não tem servidor próprio: o site envia para um Apps Script do Google, que grava numa planilha privada. O endereço do script é público por natureza (como a boca de uma caixa de correio), então toda a proteção fica no script. A validação no site só ajuda quem preenche; a que barra dado falso roda no script, porque um robô pode chamar o endereço direto.

**Regras de segurança do projeto**

- A planilha é compartilhada só com as contas do escritório, nunca por link. A conta Google dona usa verificação em duas etapas.
- O script roda como o dono, aceita envios de qualquer pessoa e nunca devolve dados da planilha (não tem `doGet`). Usa `@OnlyCurrentDoc` para só enxergar a própria planilha.
- Nada secreto no repositório. O endereço do script e a chave pública do Turnstile podem ficar no site; o e-mail do escritório, a chave secreta do Turnstile e o interruptor ficam nas Propriedades do script.
- Interruptor: `FORMULARIO_ABERTO = false` nas Propriedades fecha o formulário na hora. Se o endereço for muito abusado, uma nova implantação gera outro endereço; basta trocar uma linha em `forms_validation.js`.

### Fase 1: base (feita)

- [x] O site lê a resposta do script: só mostra "enviada" quando o script confirma, com o número de protocolo.
- [x] Validação no script: nome, e-mail, celular (DDD que existe, 8 ou 9 dígitos, sem números repetidos), mensagem (de 20 a 3000 caracteres, no máximo 3 links), tamanho de cada campo.
- [x] Mesmas regras no site, com a mensagem de erro de cada campo.
- [x] Máscara do celular enquanto digita e contador de caracteres da mensagem.
- [x] Sem pop-up: o botão mostra "Enviando…"; a confirmação (protocolo, prazo e resumo do que foi enviado) aparece no lugar dos campos, dentro do mesmo painel, com "Editar mensagem" (volta ao formulário com tudo escrito; o reenvio chega ao escritório como "Correção de IGA-0007", com protocolo novo) e "Enviar outra mensagem". Um erro aparece na linha do botão, com os campos marcados. Para formulário de contato, as referências de UX recomendam confirmar no lugar, sem passo extra de revisão.
- [x] Limite de envios: 3 por hora por e-mail e 30 por hora no total.
- [x] Trava de escrita (`LockService`): dois envios ao mesmo tempo não se atropelam.
- [x] Armadilha de tempo (envio em menos de 3 s) e campo isca conferidos no script. O robô recebe "ok" e nada é gravado.
- [x] Aviso por e-mail ao escritório a cada contato, com "responder" já endereçado ao cliente.
- [x] Interruptor `FORMULARIO_ABERTO`.
- [ ] Publicar o script novo e testar um envio real (depende de vocês; ver "Antes de publicar de vez").

### Fase 2: proteção

- [ ] Cloudflare Turnstile: o site recebe um token de "humano" e o script confere com a Cloudflare, exigindo o domínio da IGA. Precisa de uma conta gratuita na Cloudflare (só para gerar as chaves, sem mudar o domínio).
- [ ] Aba "Suspeitos": o que falha em regras que podem pegar gente real (e-mail descartável, domínio sem e-mail) vai para outra aba em vez de ser recusado.
- [ ] E-mail: recusar domínios descartáveis, conferir se o domínio recebe e-mail (consulta MX) e sugerir correção de erros comuns ("gmial.com").
- [ ] Alerta ao escritório se a aba de suspeitos crescer de repente.

### Fase 3: e-mail para quem enviou

- [ ] Confirmação com o protocolo, o resumo e o prazo de resposta, no visual da marca. Só sai depois da fase 2, para o formulário não virar disparador de e-mails.
- [ ] Link de verificação no e-mail: a linha entra como "não confirmado" e vira "confirmado" com o clique. Ninguém é bloqueado por não clicar.
- [ ] Atenção à cota: conta Gmail envia cerca de 100 e-mails automáticos por dia; Google Workspace, cerca de 1.500.

### Fase 4: extras (escolher)

- Tipo de projeto em etiquetas, faixa de orçamento, prazo e área aproximada.
- Anexos (planta, fotos, referências) numa pasta do Drive.
- Colunas de status na planilha (Novo, Em contato, Proposta, Fechado) e resumo semanal por e-mail.
- Rascunho salvo no navegador, botão de WhatsApp, agendamento de conversa.
- Consentimento LGPD com data e hora, e limpeza automática de contatos antigos.

---

## Estrutura

- `index.html`: página única, com todas as seções.
- `404.html`: página de erro, com estilos embutidos para não depender do resto.
- `privacidade.html`: política de privacidade.
- `Public/css/base/`: cores (`colors.css`), fontes (`fonts.css`) e estilo geral (`style.css`).
- `Public/css/components/`: navbar, cursor, faixa de marcas, barra de rolagem.
- `Public/css/sections/`: uma folha por seção (hero, escritório, serviços, portfólio, contato, rodapé).
- `Public/scripts/`: um script por comportamento:
  - `mouse.js`: cursor
  - `header.js`: navbar, menu do celular e cópia dos ícones de contato
  - `hero.js`: troca de fotos
  - `forms_validation.js`: formulário
  - `team.js`: bios da equipe no toque
  - `gallery.js`: galeria
  - `reveal.js`: revelação ao rolar
- `Public/assets/`: imagens em WebP, separadas por `marca`, `projetos` e `equipe`.
- `docs/`: passo a passo para ligar o formulário a uma planilha do Google Sheets.

### Como trocar o conteúdo

- **Foto de projeto**: em Projetos, troque o `src` e o `alt` do `<img>`, o título e a linha da `<figcaption>` e o texto em `.portfolio-details`. A galeria lê tudo isso sozinha.
- **Foto do hero**: cada `<img class="hero-slide">` tem `data-name` e `data-meta`, que viram a legenda. Com uma foto só, a troca automática desliga.
- **Links de contato**: edite só a aba `#social-links` em `index.html`. No celular e no tablet o site copia esses links para o rodapé e para o formulário. Os links das colunas do rodapé do desktop ficam em `#footer-row` e precisam ser trocados também.

## Paleta e tipografia

As cores ficam só em `Public/css/base/colors.css`. Use sempre as variáveis:

| Variável | Cor | Uso |
| --- | --- | --- |
| `--linho` | `#F2E8DC` | fundo creme, texto sobre escuro |
| `--argila` | `#D9A58A` | acentos sobre a oliva |
| `--new-terracota` | `#B5583A` | acento principal |
| `--terracota` | `#8F3F24` | hover do botão Contato |
| `--oliva` / `--oliva-escura` | `#6B7A3F` / `#5A6735` | painel de contato e rodapé |
| `--grafite` / `--night` | `#2B2622` / `#1F1B18` | Projetos, textos escuros |
| `--white` | `#F7F2EC` | branco quente |

Fontes, todas do Google Fonts:

- **Jost:** texto.
- **Libre Caslon Display:** títulos.
- **Julius Sans One:** navegação e botão Contato.
