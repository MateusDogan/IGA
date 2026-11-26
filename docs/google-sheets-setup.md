# Formulário → Google Sheets (sem servidor)

O site envia o formulário para um Apps Script do Google. O script confere os dados, grava numa planilha privada, avisa o escritório por e-mail, manda uma confirmação para quem escreveu e devolve um número de protocolo. Toda segunda-feira ele manda ao escritório um resumo da semana.

## Primeira configuração

1. Crie uma planilha no Google Sheets, com a conta do escritório. A linha 1 pode ficar vazia: o passo 5 escreve os títulos.
2. Compartilhe a planilha só com as pessoas do escritório. Nunca use "qualquer pessoa com o link".
3. Menu **Extensões → Apps Script**, apague o conteúdo e cole `docs/apps-script.gs`.
4. Em **Configurações do projeto (engrenagem) → Propriedades do script**, adicione (as outras, `ULTIMO_PROTOCOLO` e `SEGREDO`, o script cria sozinho; não apague):
   - `EMAIL_ESCRITORIO`: o e-mail que recebe o aviso de cada contato, o alerta de envios recusados e o resumo semanal.
   - `FORMULARIO_ABERTO`: `true`. Troque para `false` para fechar o formulário na hora, sem mexer no site.
   - `CONFIRMACAO` (opcional): `false` para de mandar o e-mail de confirmação a quem escreveu.
5. No editor, escolha a função **configurar** na barra de cima e clique em **Executar**. Ela escreve os títulos que faltarem na linha 1, cria a lista de status e o resumo de segunda-feira às 8h.
6. **Implantar → Nova implantação → Tipo: App da Web**
   - Executar como: **Eu**
   - Quem tem acesso: **Qualquer pessoa**
7. Autorize. O Google pede estas permissões: esta planilha, enviar e-mail em seu nome, guardar dados temporários (limite de envios e alerta), acessar serviços externos (a consulta que confere se o domínio do e-mail existe) e rodar em segundo plano (o resumo semanal).
8. Copie a URL terminada em `/exec` e cole em `GOOGLE_SCRIPT_URL`, no topo de `Public/scripts/forms_validation.js`.

## Atualizar o script

1. Cole a versão nova de `docs/apps-script.gs` no editor e salve.
2. Se a versão nova pedir (veja abaixo), rode **configurar** e autorize de novo.
3. **Implantar → Gerenciar implantações → lápis (Editar) → Versão: Nova versão → Implantar.**

A URL continua a mesma. Sem uma nova versão, o site continua falando com o código antigo.

### Atualização de 25/11/2026 (status, resumo, confirmação e conferência do domínio do e-mail)

1. Cole o código novo e salve.
2. Rode **configurar** uma vez e aceite as novas permissões. Ela acrescenta os títulos `status` e `confirmado` no fim da linha 1, marca as linhas antigas como "Novo" e cria o resumo de segunda.
3. Publique uma **Nova versão** (passo 3 acima).
4. Teste como em "Testar", abaixo.

## Colunas

O script acha cada coluna pelo **título da linha 1**, não pela posição. Para mudar a ordem, arraste a coluna inteira (clique na letra da coluna e arraste) para onde quiser. Pode também acrescentar colunas da equipe, como "observações", em qualquer lugar. Só não renomeie nem apague estes títulos (maiúsculas e espaços não importam):

`data`, `nome`, `email`, `celular`, `cidade`, `mensagem`, `protocolo`, `tipo`, `status`, `confirmado`

Se algum faltar, o script o recria no fim da linha 1 no próximo envio (ou ao rodar **configurar**). Uma ordem prática para o dia a dia: `data | protocolo | status | confirmado | tipo | nome | email | celular | cidade | mensagem`.

| Título | O que guarda |
| --- | --- |
| `protocolo` | IGA-0001, IGA-0002… |
| `tipo` | Frente marcada no formulário, por exemplo "Arquitetura, Interiores" |
| `status` | Novo, Em contato, Proposta ou Fechado. Entra como "Novo"; a equipe muda pela lista da célula |
| `confirmado` | "não confirmado" até a pessoa clicar no link do e-mail; depois, "confirmado em dd/mm/aaaa hh:mm". "sem e-mail" quando a confirmação não saiu (cota do dia) e "-" com `CONFIRMACAO` em `false` |

Ninguém é bloqueado por não confirmar: a mensagem já está na planilha. A coluna só ajuda a saber se o e-mail digitado é de verdade.

## E-mails que o script manda

- **Aviso de cada contato**, para o escritório. "Responder" vai direto para quem escreveu.
- **Confirmação**, para quem escreveu: protocolo, prazo de resposta, resumo da mensagem e o botão "Confirmar meu e-mail". O botão preenche a coluna `confirmado`. O link é assinado, então trocar o número do protocolo no endereço não confirma a mensagem de outra pessoa.
- **Alerta**, para o escritório, quando o formulário recusa 15 envios ou mais numa hora (sinal de robô). No máximo um a cada 6 horas.
- **Resumo semanal**, toda segunda por volta das 8h: contatos dos últimos 7 dias por frente, a situação de todos os contatos e quem está como "Novo" há mais de dois dias.

**Cota:** uma conta Gmail manda cerca de 100 e-mails automáticos por dia; o Google Workspace, cerca de 1.500. Cada contato usa 2 (aviso e confirmação). Quando sobram 10 ou menos, o script pula a confirmação e mantém o aviso ao escritório.

## Testar

1. Abra o site publicado e envie uma mensagem com seus próprios dados.
2. Confira:
   - a confirmação no lugar do formulário mostra o protocolo e diz que uma cópia foi enviada;
   - a linha aparece na planilha com "Novo" em `status` e "não confirmado" em `confirmado`;
   - o e-mail de aviso chega, e "Responder" vai para o endereço digitado;
   - o e-mail de confirmação chega para o endereço digitado; o botão abre a página "E-mail confirmado" e a coluna `confirmado` muda para "confirmado em…";
   - "Editar mensagem" e um novo envio geram outra linha, com `[Correção de IGA-0001]` no começo da mensagem e "Correção de…" no assunto do aviso.
3. Para testar o resumo sem esperar a segunda-feira, escolha **resumoSemanal** no editor e clique em **Executar**.
4. Se der erro, veja **Execuções** no menu do Apps Script.

## O que o script recusa

As regras são as mesmas no site e no script:

| Campo | Regra |
| --- | --- |
| Nome | Precisa de pelo menos 2 letras, sem links |
| E-mail | Formato `nome@dominio.ext`, e o domínio precisa existir e receber e-mail. Domínio próprio de empresa passa normalmente |
| Celular (opcional) | DDD que existe. Celular com 9 dígitos começando com 9; fixo com 8 começando de 2 a 5. Sem todos os dígitos iguais e sem sequências (`12345678`) |
| Mensagem | De 20 a 3000 caracteres, no máximo 3 links |
| Frente do projeto | Pelo menos uma: Arquitetura, Interiores ou Design gráfico |

A conferência do domínio usa o DNS público do Google (`dns.google`) e fica guardada por 6 horas. Não há lista de domínios: todo domínio passa pela mesma consulta. Se a consulta falhar, o e-mail é aceito.

Também ficam de fora:

- **Mais de 3 envios por hora do mesmo e-mail, ou mais de 30 por hora no total:** o site pede para escrever por e-mail.
- **Robôs, ou seja, campo isca preenchido ou envio em menos de 3 s:** o script responde "ok" e não grava nada.

Todos os casos acima contam para o alerta de envios recusados.
