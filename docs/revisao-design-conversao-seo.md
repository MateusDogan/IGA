# Revisão: marca, conversão e SEO

Revisão do site atual (novembro de 2026), sem domínio próprio, sem conta Cloudflare e com fotos ainda provisórias. A paleta terrosa fica como está; nenhuma recomendação troca cores. O objetivo é levar quem visita do interesse ao contato.

## Diagnóstico em uma linha por área

| Área | Situação | O que pesa mais |
| --- | --- | --- |
| Visual e marca | Forte: paleta terrosa, Libre Caslon nos títulos, painel oliva, cursor próprio | Falta um elemento que seja só da IGA e se repita com intenção |
| Clareza (teste de 5 segundos) | O título "Espaços e marcas, desenhados juntos." é bonito, mas não diz "arquitetura" nem onde o escritório atua | Uma linha de apoio no hero resolve |
| Conversão | Há um caminho só: rolar até o fim e preencher o formulário | Faltam chamadas no meio da página, WhatsApp e algo que reduza a insegurança (processo, prazos) |
| Confiança | Equipe com foto é ótimo; bios, projetos e marcas ainda são provisórios | Depoimentos e dados reais dos projetos |
| SEO local | Nenhuma cidade aparece no site | Cidade/região, Perfil da Empresa no Google e dados estruturados |
| SEO técnico | Bom: título, descrição, canonical, Open Graph, sitemap, robots, 404, imagens WebP com `width`/`height` | Detalhes listados abaixo |
| Medição | Nenhuma | Sem números não dá para saber o que converte |

`design.md` não existe no repositório. As decisões de marca estão espalhadas entre `README.md` (paleta e fontes) e os comentários do CSS. A seção "Direção de marca" abaixo pode virar esse arquivo.

---

## 1. Direção de marca: estilo único sem sair da paleta

A ideia é usar o vocabulário do próprio ofício (prancha, carimbo, traço, escala) em vez de enfeites de template. O site já começou isso com o "A1" no botão Contato.

### O ponto terracota como sinal de ação

O logo termina num ponto terracota (`circle` no fim do "a"). Hoje ele só aparece no logo. Proposta: o ponto passa a significar "aqui você age" ou "você está aqui", e só isso.

- Marca a seção atual no menu (no lugar do sublinhado, ou junto dele).
- Aparece no botão "Enviar mensagem" e nas chamadas de contato no meio da página.
- Fecha a confirmação de envio ("Mensagem enviada" + ponto).

Uma regra única, repetida, ensina o olho a procurar o ponto. Isso ajuda a conversão (o destaque fica reservado para a ação) e dá à marca um gesto reconhecível.

### Carimbo de prancha nas legendas dos projetos

Toda prancha de arquitetura tem um carimbo com projeto, local, área, data e escala. A legenda de cada projeto (e a galeria) pode seguir esse formato, em linhas finas e com Julius Sans One pequena:

```
┌──────────────────────────────────────┐
│ CASA JARDIM                          │
│ Interiores · São José dos Campos, SP │
│ 180 m²            2025        01/07  │
└──────────────────────────────────────┘
```

Além de ser do ofício, o carimbo obriga a ter cidade, área e tipo de cada projeto, que é exatamente o que o SEO local e a confiança pedem.

### Processo em pranchas: "Do traço à obra"

Arquitetura é compra cara e demorada; o maior freio é a insegurança ("quanto custa", "quanto demora", "como funciona"). Uma faixa curta entre Projetos e Escritório, com 4 ou 5 etapas, resolve isso. É uma sequência de verdade, então a numeração faz sentido:

1. Conversa inicial: entender o lugar, a rotina e o orçamento.
2. Estudo preliminar: primeiras ideias e plantas.
3. Projeto: executivo, interiores e identidade, conforme o caso.
4. Obra: acompanhamento até a entrega.

O texto precisa ser validado com o escritório (prazos médios e se a primeira conversa é gratuita, por exemplo).

### Posicionamento: o que só a IGA faz

O diferencial real é ter arquitetura, interiores e design gráfico no mesmo time. Isso vale mais para negócios (lojas, restaurantes, consultórios, estandes) do que para casas, porque ali marca e espaço precisam conversar. O estande Alux já prova isso. Sugestão: dizer isso com todas as letras em Serviços, por exemplo "Para negócios: o espaço, a marca e o estande desenhados pelo mesmo time".

---

## 2. Conversão: do interesse ao contato

### O caminho hoje

```
Hero → Serviços → Projetos → Escritório → Formulário (fim da página)
                                          ↑ único ponto de contato, além do botão Contato no topo
```

### O caminho proposto

```
Hero (linha de apoio + Contato)
 → Serviços (cada serviço: "Pedir orçamento de interiores" → formulário com o tipo já marcado)
 → Projetos (fim da seção: "Tem um projeto parecido? Conte para a gente")
 → Processo (reduz a insegurança)
 → Escritório
 → Formulário com tipo de projeto em etiquetas + WhatsApp ao lado
```

| Mudança | Por quê | Depende de |
| --- | --- | --- |
| Linha de apoio no hero: "Arquitetura, interiores e design gráfico em [cidade]" | Responde em 5 s o que é e onde atua; ajuda o SEO | Cidade |
| Chamadas de contato no fim de Serviços e de Projetos | Quem se convence no meio da página não precisa rolar até o fim | Nada |
| Etiquetas de tipo de projeto no formulário (Arquitetura, Interiores, Design gráfico, Estande, Ainda não sei) | Escolher é mais fácil que escrever; o escritório recebe o contato já classificado | Nada (o script ganha uma coluna) |
| A chamada do serviço já marca a etiqueta certa | Menos trabalho para quem preenche | Etiquetas |
| WhatsApp ao lado do botão de envio | No Brasil, boa parte dos contatos de arquitetura chega por WhatsApp; quem não quer formulário tem outra porta | Número |
| Faixa de processo | Reduz a insegurança antes do contato | Texto validado |
| Depoimentos curtos (2 ou 3) | Prova social perto do formulário | Textos e autorização dos clientes |
| Perguntas frequentes (prazo, atendimento a distância, primeira conversa) | Responde as dúvidas que travam o contato | Respostas do escritório |

Não recomendo pop-up de captura, contador de urgência ou "baixe nosso e-book". Para um escritório que vende seriedade, isso pesa contra.

---

## 3. SEO

### Rápido, só código (dá para fazer agora)

| Item | Situação | Correção |
| --- | --- | --- |
| Faixa de marcas | 10 títulos `<h2>` "Outro Ipsum." que robôs leem como títulos da página | Trocar por `<span>` ou `<p>` |
| Nomes inconsistentes | Menu diz "Projetos" e "Escritório"; rodapé diz "Portfólio" e "Equipe" | Usar os mesmos nomes nos dois |
| Coluna "Portfólio" do rodapé | Três links diferentes levam ao mesmo lugar (`#Projects`) | Apontar para cada serviço, ou filtrar a galeria por tipo |
| Dados estruturados | Nenhum | JSON-LD `LocalBusiness` com nome, URL, logo, imagem, serviços (`knowsAbout`), redes (`sameAs`) e equipe; endereço e área atendida entram quando houver cidade |
| Fontes | Jost carrega todos os pesos de 100 a 900 e o itálico; o site usa 300, 400, 500 e 700, sem itálico | Pedir só `wght@300..700`, sem itálico: menos dados, texto aparece antes |
| `sitemap.xml` | Sem data | Acrescentar `lastmod` |

### Depende de informação do escritório

| Item | Por quê |
| --- | --- |
| **Cidade e região atendida** | Busca de arquiteto é local ("arquiteto em São José dos Campos", "projeto de interiores Taubaté"). Sem cidade no site, essas buscas não acham a IGA. O DDD provisório (12) sugere o Vale do Paraíba, mas isso precisa ser confirmado. |
| **Perfil da Empresa no Google** | Para escritórios locais, costuma ser a maior fonte de contato via busca, aparece no mapa e é gratuito. Não precisa de domínio: o endereço do GitHub Pages serve de site. Quem cria é o escritório. |
| **Google Search Console** | Mostra por quais buscas o site aparece e avisa de erros. Funciona no endereço atual (verificação por meta tag). Quem cria é o escritório; eu coloco a meta tag. |
| **Textos e alt reais dos projetos** | Hoje o alt diz "imagem provisória". Com tipo, cidade e material, cada foto vira conteúdo pesquisável. |

### Médio prazo: uma página por projeto

O site é uma página só, então concorre por uma única URL. Uma página por projeto (`projetos/casa-jardim.html`) com fotos, carimbo, texto de 200 a 400 palavras (problema, solução, materiais) e uma chamada de contato no fim é o que mais rende em buscas específicas ("reforma de casa térrea", "estande para feira"). A galeria atual continua; ela só ganharia um link "Ver projeto completo". Vale fazer quando as fotos reais chegarem.

### Domínio próprio depois

Fazer SEO agora no endereço do GitHub Pages não se perde. Ao configurar um domínio próprio no GitHub Pages, o endereço antigo deve redirecionar para o novo, mas confirme isso quando o domínio for configurado. Aí basta trocar o canonical, o `og:url`, o sitemap e o robots, já listados no README.

---

## 4. Medição

Sem números não dá para saber se uma mudança funcionou. Sugestão: **GoatCounter** (gratuito para uso pequeno, sem cookies, dispensa aviso de cookies) ou **Plausible** (pago). A política de privacidade precisa ser atualizada se entrar.

O que medir, como funil:

```
Visitas → abriu a galeria / rolou até Projetos → clicou em Contato, WhatsApp ou e-mail → começou o formulário → enviou
```

Métrica principal: **contatos por mês**. Com as etiquetas, dá para ver também quantos são de cada serviço.

---

## 5. Plano

### Agora, sem depender de ninguém

Feito em 24/11/2026. O JSON-LD saiu como `Organization` (sem endereço, `LocalBusiness` gera aviso no Google); vira `LocalBusiness` quando houver cidade. O painel de contato continua com 670 px no desktop.

1. Faixa de marcas sem `<h2>`; nomes iguais no menu e no rodapé; links da coluna "Portfólio".
2. Fontes só com os pesos usados.
3. JSON-LD básico (sem endereço por enquanto).
4. Chamadas de contato no fim de Serviços e de Projetos.
5. Etiquetas de tipo de projeto no formulário, marcadas pela chamada de cada serviço; coluna nova no script.
6. Ponto terracota como sinal de ação (menu, botões, confirmação).
7. Carimbo nas legendas e na galeria, com os campos vazios ou provisórios até chegarem os dados.
8. Faixa "Do traço à obra" com texto provisório para o escritório validar.

### Com o escritório

- Cidade e região atendida → linha do hero, JSON-LD, alt das fotos.
- Número de WhatsApp → botão ao lado do envio.
- Perfil da Empresa no Google e Search Console.
- Depoimentos, perguntas frequentes, prazos do processo.
- Escolha da ferramenta de medição.

### Quando chegarem as fotos

- Carimbos preenchidos, alt descritivos e uma página por projeto.

## Fontes consultadas

- [Workflowmax: por que sites de escritórios de arquitetura não convertem](https://workflowmax.com/blog/why-most-architecture-firm-websites-fail-to-convert-visitors-into-enquiries)
- [Workflowmax: SEO para escritórios de arquitetura](https://workflowmax.com/blog/seo-strategies-architecture-firms-can-use-to-attract-better-project-leads)
- [BQE: o site ajuda ou atrapalha o escritório](https://www.bqe.com/blog/is-your-website-helping-or-hurting-your-architecture-firm)
- [Conveyor: geração de contatos para AEC (PDF)](https://conveyormg.com/hubfs/2024_Conveyor%20Website/PDFs/CMG_Guide_Digital%20Lead%20Generation%20for%20AEC.pdf?hsLang=en)
- [BrightLocal: dados estruturados para negócios locais](https://www.brightlocal.com/blog/schema-markup-critical-local-business/)
- [schema.org: ProfessionalService (descontinuado)](https://attic.schema.org/ProfessionalService)
