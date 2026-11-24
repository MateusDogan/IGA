# Formulário → Google Sheets (sem servidor)

O site envia o formulário para um Apps Script do Google, que confere os dados, grava numa planilha privada, avisa o escritório por e-mail e devolve um número de protocolo.

## Primeira configuração

1. Crie uma planilha no Google Sheets, com a conta do escritório. Na linha 1 coloque:
   `data | nome | email | celular | cidade | mensagem | protocolo`
2. Compartilhe a planilha só com as pessoas do escritório. Nunca use "qualquer pessoa com o link".
3. Menu **Extensões → Apps Script**, apague o conteúdo e cole `docs/apps-script.gs`.
4. Em **Configurações do projeto (engrenagem) → Propriedades do script**, adicione:
   - `EMAIL_ESCRITORIO`: o e-mail que recebe o aviso de cada contato.
   - `FORMULARIO_ABERTO`: `true`. Troque para `false` para fechar o formulário na hora, sem mexer no site.
5. **Implantar → Nova implantação → Tipo: App da Web**
   - Executar como: **Eu**
   - Quem tem acesso: **Qualquer pessoa**
6. Autorize. O Google pede três permissões: esta planilha, enviar e-mail em seu nome e guardar dados temporários (o limite de envios).
7. Copie a URL terminada em `/exec` e cole em `GOOGLE_SCRIPT_URL`, no topo de `Public/scripts/forms_validation.js`.

## Atualizar o script

1. Cole a versão nova de `docs/apps-script.gs` no editor e salve.
2. **Implantar → Gerenciar implantações → lápis (Editar) → Versão: Nova versão → Implantar.**

A URL continua a mesma. Sem uma nova versão, o site continua falando com o código antigo.

Se a planilha já existia com 6 colunas, escreva `protocolo` na célula G1.

## Testar

1. Abra o site publicado e envie uma mensagem com seus próprios dados.
2. Confira:
   - a confirmação no lugar do formulário mostra o protocolo (IGA-0001, IGA-0002…);
   - a linha aparece na planilha;
   - o e-mail de aviso chega, e "Responder" vai para o endereço digitado;
   - "Editar mensagem" e um novo envio geram outra linha, com `[Correção de IGA-0001]` no começo da mensagem e "Correção de…" no assunto do aviso.
3. Se der erro, veja **Execuções** no menu do Apps Script.

## O que o script recusa

As regras são as mesmas no site e no script:

| Campo | Regra |
| --- | --- |
| Nome | Precisa de pelo menos 2 letras, sem links |
| E-mail | Formato `nome@dominio.ext` |
| Celular (opcional) | DDD que existe. Celular com 9 dígitos começando com 9; fixo com 8 começando de 2 a 5. Sem todos os dígitos iguais e sem sequências (`12345678`) |
| Mensagem | De 20 a 3000 caracteres, no máximo 3 links |

Também ficam de fora:

- **Mais de 3 envios por hora do mesmo e-mail, ou mais de 30 por hora no total:** o site pede para escrever por e-mail.
- **Robôs, ou seja, campo isca preenchido ou envio em menos de 3 s:** o script responde "ok" e não grava nada.
