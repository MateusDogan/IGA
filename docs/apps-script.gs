function doPost(e) {
  var p = e.parameter;
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
  var clean = function (v) {
    v = String(v || '').slice(0, 2000);
    // evita injeção de fórmula na planilha
    return /^[=+\-@]/.test(v) ? "'" + v : v;
  };
  sheet.appendRow([new Date(), clean(p.name), clean(p.email), clean(p.phone), clean(p.city), clean(p.message)]);
  // MailApp.sendEmail('SEU_EMAIL@exemplo.com', 'Novo contato IGA', clean(p.name) + '\n' + clean(p.email) + '\n\n' + clean(p.message));
  return ContentService.createTextOutput('ok');
}
