# Formulário → Google Sheets (sem servidor)

1. Crie uma planilha no Google Sheets. Na linha 1 coloque:
   `data | nome | email | celular | cidade | mensagem`
2. Menu **Extensões → Apps Script**, apague o conteúdo e cole `docs/apps-script.gs`.
3. **Implantar → Nova implantação → Tipo: App da Web**
   - Executar como: **Eu**
   - Quem tem acesso: **Qualquer pessoa**
4. Autorize e copie a URL terminada em `/exec`.
5. Cole a URL em `GOOGLE_SCRIPT_URL` no topo de `Public/scripts/forms_validation.js`.

Ao alterar o script, use **Implantar → Gerenciar implantações → Editar → Nova versão**
(a URL continua a mesma).

Opcional: descomente `MailApp` no script para receber e-mail a cada contato.
