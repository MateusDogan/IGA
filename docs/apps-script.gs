/**
 * Formulário de contato da IGA → planilha do Google.
 * Passo a passo em docs/google-sheets-setup.md.
 *
 * O endereço deste script é público (o site precisa dele), então tudo que
 * protege a planilha fica aqui: validação, limite de envios, trava de escrita
 * e armadilhas contra robôs. A planilha nunca é devolvida para quem chama.
 *
 * Propriedades do script (Configurações do projeto → Propriedades do script):
 *   EMAIL_ESCRITORIO   e-mail que recebe o aviso de cada contato, o alerta e o resumo semanal
 *   FORMULARIO_ABERTO  "false" fecha o formulário na hora (opcional)
 *   CONFIRMACAO        "false" para de mandar o e-mail de confirmação a quem enviou (opcional)
 * Criadas pelo próprio script: ULTIMO_PROTOCOLO (número do último protocolo) e
 * SEGREDO (assina o link de confirmação; não apague).
 *
 * Títulos da linha 1, em qualquer ordem (o script acha cada coluna pelo título):
 *   data | nome | email | celular | cidade | mensagem | protocolo | tipo | status | confirmado
 * Para reordenar, arraste as colunas inteiras na planilha; não renomeie os títulos.
 * Colunas extras da equipe (ex.: "observações") podem ficar em qualquer lugar.
 *
 * Depois de colar este código, rode uma vez a função "configurar" (menu Executar):
 * ela cria os títulos que faltarem, a lista de status e o resumo de segunda-feira.
 *
 * Organização: configuração → entrada (doPost, doGet) → dados e validação →
 * proteção → planilha → e-mails → status e resumo → utilitários.
 *
 * @OnlyCurrentDoc
 */

// ==================== Configuração ====================

// Endereço do site (link do e-mail de confirmação). Mudou o domínio, mude aqui.
var SITE_URL = 'https://mateusdogan.github.io/IGA/';
var FUSO = 'America/Sao_Paulo';

// As mesmas regras estão em Public/scripts/forms_validation.js. Mudou aqui, mude lá.
var LIMITES = { nome: 100, email: 254, cidade: 100, mensagemMin: 20, mensagemMax: 3000, links: 3 };
var EMAIL_FORMATO = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
var DDDS = [11, 12, 13, 14, 15, 16, 17, 18, 19, 21, 22, 24, 27, 28, 31, 32, 33, 34, 35, 37, 38,
  41, 42, 43, 44, 45, 46, 47, 48, 49, 51, 53, 54, 55, 61, 62, 63, 64, 65, 66, 67, 68, 69,
  71, 73, 74, 75, 77, 79, 81, 82, 83, 84, 85, 86, 87, 88, 89, 91, 92, 93, 94, 95, 96, 97, 98, 99];
// Frente do projeto (obrigatória, uma ou mais); qualquer outro valor é descartado
var TIPOS = ['Arquitetura', 'Interiores', 'Design gráfico'];

// Proteção
var ENVIOS_POR_EMAIL_HORA = 3;
var ENVIOS_TOTAL_HORA = 30;
var TEMPO_MINIMO_MS = 3000;
var ALERTA_RECUSAS_HORA = 15;   // recusas numa hora que disparam o alerta (no máximo um a cada 6 h)
var DNS_CACHE_S = 21600;        // resultado da consulta do domínio fica guardado 6 h

// Planilha
var TITULOS = ['data', 'nome', 'email', 'celular', 'cidade', 'mensagem', 'protocolo', 'tipo', 'status', 'confirmado'];
var STATUS = ['Novo', 'Em contato', 'Proposta', 'Fechado'];
var PROTOCOLO_FORMATO = /^IGA-\d{4,}$/;

// E-mails: abaixo desta cota diária, a confirmação para quem enviou é pulada
// (o aviso ao escritório tem prioridade)
var COTA_RESERVA = 10;

// ==================== Entrada ====================

// Envio do formulário. Responde {ok, protocolo, copia} ou {ok: false, erro, campos, motivo}.
function doPost(e) {
  var props = PropertiesService.getScriptProperties();
  if (props.getProperty('FORMULARIO_ABERTO') === 'false') return responder({ ok: false, erro: 'fechado' });

  var p = (e && e.parameter) || {};
  // Robô: campo isca preenchido ou envio rápido demais. Responde "ok" sem gravar,
  // para não ensinar o robô a contornar (mas conta para o alerta).
  if (p.website || !(Number(p.t) >= TEMPO_MINIMO_MS)) return recusar(props, { ok: true });

  var dados = lerDados(p);
  var campos = validar(dados);
  if (campos.length) return recusar(props, { ok: false, erro: 'campos', campos: campos });
  if (!dominioRecebeEmail(dados.email)) {
    return recusar(props, { ok: false, erro: 'campos', campos: ['email'], motivo: 'dominio' });
  }
  if (!dentroDoLimite(dados.email)) return recusar(props, { ok: false, erro: 'limite' });

  // "Editar mensagem" no site reenvia com o protocolo da anterior
  var corrige = PROTOCOLO_FORMATO.test(String(p.corrige || '')) ? String(p.corrige) : '';
  var querConfirmacao = props.getProperty('CONFIRMACAO') !== 'false';
  var gravado = gravarContato(props, dados, corrige, querConfirmacao);
  if (!gravado) return responder({ ok: false, erro: 'ocupado' });

  avisarEscritorio(props.getProperty('EMAIL_ESCRITORIO'), dados, gravado.protocolo, corrige);
  var copia = querConfirmacao && enviarConfirmacao(props, dados, gravado.protocolo, corrige);
  if (querConfirmacao && !copia) marcarConfirmado(gravado.linha, 'sem e-mail');
  return responder({ ok: true, protocolo: gravado.protocolo, copia: copia });
}

// Link do e-mail de confirmação: ?confirmar=IGA-0001&t=assinatura
function doGet(e) {
  var p = (e && e.parameter) || {};
  var protocolo = PROTOCOLO_FORMATO.test(String(p.confirmar || '')) ? String(p.confirmar) : '';
  if (!protocolo) return paginaConfirmacao('Link incompleto', 'Abra o link exatamente como ele veio no e-mail.');
  if (String(p.t || '') !== assinatura(protocolo)) {
    return paginaConfirmacao('Link inválido', 'Este link não confere. Abra o link exatamente como ele veio no e-mail.');
  }
  var linha = linhaDoProtocolo(protocolo);
  if (!linha) return paginaConfirmacao('Mensagem não encontrada', 'Não achamos a mensagem ' + protocolo + '. Escreva para nós pelo site.');
  marcarConfirmado(linha, 'confirmado em ' + agora('dd/MM/yyyy HH:mm'), true);
  return paginaConfirmacao('E-mail confirmado', 'Obrigado. Sua mensagem ' + protocolo + ' está com a equipe da IGA e respondemos em até dois dias úteis.');
}

// ==================== Dados e validação ====================

function lerDados(p) {
  return {
    nome: texto(p.name),
    email: texto(p.email).toLowerCase(),
    celular: String(p.phone || '').replace(/\D/g, ''),
    cidade: texto(p.city),
    mensagem: texto(p.message),
    tipo: String(p.tipo || '').split(',').map(texto).filter(function (t) { return TIPOS.indexOf(t) !== -1; }).join(', ')
  };
}

// Devolve os campos inválidos, com os nomes usados no site (name, email, phone, city, tipo, message)
function validar(d) {
  var erros = [];
  if (!(d.nome.length <= LIMITES.nome && /\p{L}.*\p{L}/u.test(d.nome) && !contarLinks(d.nome))) erros.push('name');
  if (!(d.email.length <= LIMITES.email && EMAIL_FORMATO.test(d.email))) erros.push('email');
  if (d.celular && !celularValido(d.celular)) erros.push('phone');
  if (d.cidade.length > LIMITES.cidade) erros.push('city');
  if (!d.tipo) erros.push('tipo');
  var n = d.mensagem.length;
  if (n < LIMITES.mensagemMin || n > LIMITES.mensagemMax || contarLinks(d.mensagem) > LIMITES.links) erros.push('message');
  return erros;
}

function contarLinks(v) { return (v.match(/https?:\/\/|www\./gi) || []).length; }

// DDD que existe; celular com 9 dígitos começando com 9, fixo com 8 começando de 2 a 5;
// recusa número com todos os dígitos iguais ou em sequência
function celularValido(n) {
  if (n.length !== 10 && n.length !== 11) return false;
  if (DDDS.indexOf(Number(n.slice(0, 2))) === -1) return false;
  var numero = n.slice(2);
  if (numero.length === 9 && numero[0] !== '9') return false;
  if (numero.length === 8 && !/[2-5]/.test(numero[0])) return false;
  var resto = numero.slice(1);
  if (/^(\d)\1+$/.test(resto)) return false;
  if ('0123456789'.indexOf(resto) !== -1 || '9876543210'.indexOf(resto) !== -1) return false;
  return true;
}

// O domínio do e-mail existe e recebe mensagens? Consulta o DNS público do Google (registro MX;
// sem MX, um registro A também recebe, pela regra do e-mail). Domínio próprio de empresa passa
// normalmente. O resultado fica guardado 6 h. Se a consulta falhar, aceita (melhor receber um
// contato duvidoso que perder um real).
function dominioRecebeEmail(email) {
  var dominio = email.split('@')[1] || '';
  var cache = CacheService.getScriptCache();
  var chave = 'dns:' + dominio; // guarda 'sim' ou 'nao'
  var guardado = cache.get(chave);
  if (guardado !== null) return guardado === 'sim';
  var recebe = true;
  try {
    var mx = consultarDns(dominio, 'MX');
    if (mx.Status === 3) recebe = false; // domínio não existe
    else if (mx.Status === 0 && !temRegistro(mx, 15)) {
      var a = consultarDns(dominio, 'A');
      if (a.Status === 0 && !temRegistro(a, 1)) recebe = false;
    }
  } catch (err) {
    console.error('Consulta de DNS falhou: ' + err);
    return true; // sem guardar: a próxima tentativa consulta de novo
  }
  cache.put(chave, recebe ? 'sim' : 'nao', DNS_CACHE_S);
  return recebe;
}

function consultarDns(dominio, tipo) {
  var res = UrlFetchApp.fetch('https://dns.google/resolve?name=' + encodeURIComponent(dominio) + '&type=' + tipo,
    { muteHttpExceptions: true });
  if (res.getResponseCode() !== 200) throw new Error('DNS ' + res.getResponseCode());
  return JSON.parse(res.getContentText());
}

function temRegistro(resposta, tipoNumero) {
  return (resposta.Answer || []).some(function (r) { return r.type === tipoNumero; });
}

// ==================== Proteção ====================

// Limite de envios numa janela de uma hora (por e-mail e no total)
function dentroDoLimite(email) {
  var cache = CacheService.getScriptCache();
  var hora = Math.floor(Date.now() / 3600000);
  var chaves = { email: 'e:' + hora + ':' + email, total: 't:' + hora };
  var atual = cache.getAll([chaves.email, chaves.total]);
  var porEmail = Number(atual[chaves.email] || 0);
  var total = Number(atual[chaves.total] || 0);
  if (porEmail >= ENVIOS_POR_EMAIL_HORA || total >= ENVIOS_TOTAL_HORA) return false;
  var novo = {};
  novo[chaves.email] = String(porEmail + 1);
  novo[chaves.total] = String(total + 1);
  cache.putAll(novo, 3600);
  return true;
}

// Conta a recusa para o alerta e devolve a resposta
function recusar(props, resposta) {
  registrarRecusa(props);
  return responder(resposta);
}

// Conta recusas (robôs, campos inválidos, domínio de e-mail recusado, limite) por hora. Ao chegar em
// ALERTA_RECUSAS_HORA, avisa o escritório uma vez; o próximo aviso só sai 6 horas depois.
function registrarRecusa(props) {
  try {
    var cache = CacheService.getScriptCache();
    var chave = 'r:' + Math.floor(Date.now() / 3600000);
    var total = Number(cache.get(chave) || 0) + 1;
    cache.put(chave, String(total), 3600);
    if (total < ALERTA_RECUSAS_HORA || cache.get('alerta-enviado')) return;
    var destino = props.getProperty('EMAIL_ESCRITORIO');
    if (!destino) return;
    cache.put('alerta-enviado', '1', 21600);
    alertarEscritorio(destino, total);
  } catch (err) {
    console.error('Alerta falhou: ' + err);
  }
}

// ==================== Planilha ====================

function aba() { return SpreadsheetApp.getActiveSpreadsheet().getSheets()[0]; }

// Posição de cada coluna, lida dos títulos da linha 1 (maiúsculas e espaços não importam).
// Assim a ordem das colunas pode mudar na planilha à vontade: basta manter os títulos.
// Título que faltar é criado no fim da linha 1. Colunas extras da equipe são ignoradas.
// Devolve { data: 1, nome: 2, ..., _total: número de colunas }.
function colunas(planilha) {
  var total = Math.max(planilha.getLastColumn(), 1);
  var titulos = planilha.getRange(1, 1, 1, total).getValues()[0]
    .map(function (t) { return String(t).trim().toLowerCase(); });
  var col = {};
  titulos.forEach(function (t, i) { if (TITULOS.indexOf(t) !== -1 && !col[t]) col[t] = i + 1; });
  var faltam = TITULOS.filter(function (t) { return !col[t]; });
  if (faltam.length) {
    var inicio = titulos.every(function (t) { return !t; }) ? 1 : total + 1; // planilha vazia: começa em A
    planilha.getRange(1, inicio, 1, faltam.length).setValues([faltam]);
    faltam.forEach(function (t, i) { col[t] = inicio + i; });
    total = Math.max(total, inicio + faltam.length - 1);
  }
  col._total = total;
  return col;
}

// Grava o contato com o próximo protocolo. Devolve {protocolo, linha}, ou null se a
// planilha estiver ocupada por mais de 10 s.
function gravarContato(props, dados, corrige, querConfirmacao) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
  } catch (err) {
    return null;
  }
  try {
    var numero = Number(props.getProperty('ULTIMO_PROTOCOLO') || 0) + 1;
    props.setProperty('ULTIMO_PROTOCOLO', String(numero));
    var protocolo = 'IGA-' + ('000' + numero).slice(-4);
    var planilha = aba();
    var col = colunas(planilha);
    var valores = {
      data: new Date(),
      nome: seguro(dados.nome),
      email: seguro(dados.email),
      celular: seguro(dados.celular),
      cidade: seguro(dados.cidade),
      mensagem: seguro((corrige ? '[Correção de ' + corrige + '] ' : '') + dados.mensagem),
      protocolo: protocolo,
      tipo: dados.tipo,
      status: STATUS[0],
      confirmado: querConfirmacao ? 'não confirmado' : '-'
    };
    var linha = [];
    for (var i = 0; i < col._total; i++) linha.push('');
    TITULOS.forEach(function (t) { linha[col[t] - 1] = valores[t]; });
    planilha.appendRow(linha);
    return { protocolo: protocolo, linha: planilha.getLastRow() };
  } finally {
    lock.releaseLock();
  }
}

function linhaDoProtocolo(protocolo) {
  var planilha = aba();
  var col = colunas(planilha);
  var celula = planilha.getRange(1, col.protocolo, planilha.getMaxRows(), 1)
    .createTextFinder(protocolo).matchEntireCell(true).findNext();
  return celula ? celula.getRow() : 0;
}

// Escreve na coluna "confirmado". Com manterConfirmacao, não sobrescreve uma confirmação anterior.
function marcarConfirmado(linha, valor, manterConfirmacao) {
  var planilha = aba();
  var celula = planilha.getRange(linha, colunas(planilha).confirmado);
  if (manterConfirmacao && String(celula.getValue()).indexOf('confirmado em') === 0) return;
  celula.setValue(valor);
}

// ==================== E-mails ====================

// Aviso de cada contato ao escritório; "Responder" vai para quem escreveu
function avisarEscritorio(destino, d, protocolo, corrige) {
  if (!destino) return;
  try {
    MailApp.sendEmail({
      to: destino,
      replyTo: d.email,
      name: 'Site IGA',
      subject: (corrige ? 'Correção de ' + corrige + ' (' + protocolo + ')' : 'Novo contato ' + protocolo) + ': ' + d.nome,
      body: [
        corrige
          ? 'Correção pelo site (' + protocolo + '). Substitui a mensagem ' + corrige + '.'
          : 'Novo contato pelo site (' + protocolo + ').',
        '',
        'Frente: ' + d.tipo,
        'Nome: ' + d.nome,
        'E-mail: ' + d.email,
        'Celular: ' + (d.celular || '-'),
        'Cidade: ' + (d.cidade || '-'),
        '',
        d.mensagem,
        '',
        'Responda este e-mail para falar direto com ' + d.nome + '.'
      ].join('\n')
    });
  } catch (err) {
    console.error('Aviso por e-mail falhou: ' + err); // a linha já está na planilha
  }
}

function alertarEscritorio(destino, total) {
  MailApp.sendEmail({
    to: destino,
    name: 'Site IGA',
    subject: 'Alerta: muitos envios recusados no formulário do site',
    body: [
      'O formulário do site recusou ' + total + ' envios na última hora.',
      '',
      'Isso costuma ser um robô tentando enviar mensagens. A planilha está protegida: nada recusado é gravado.',
      '',
      'Se continuar, dá para fechar o formulário na hora: no Apps Script, abra',
      'Configurações do projeto → Propriedades do script e mude FORMULARIO_ABERTO para false.',
      'Para reabrir, volte para true (ou apague a propriedade).',
      '',
      'Próximo alerta, se houver, em 6 horas.'
    ].join('\n')
  });
}

// Confirmação para quem enviou: protocolo, resumo, prazo e o link que preenche a coluna
// "confirmado". Ninguém é bloqueado por não clicar: a mensagem já está na planilha.
// Devolve true se o e-mail saiu.
function enviarConfirmacao(props, d, protocolo, corrige) {
  try {
    if (MailApp.getRemainingDailyQuota() <= COTA_RESERVA) return false;
    var link = ScriptApp.getService().getUrl() + '?confirmar=' + protocolo + '&t=' + assinatura(protocolo);
    var titulo = corrige ? 'Recebemos sua correção.' : 'Recebemos sua mensagem.';
    var resumo = [['Frente', d.tipo], ['Nome', d.nome], ['E-mail', d.email], ['Celular', d.celular],
      ['Cidade', d.cidade], ['Mensagem', d.mensagem]].filter(function (x) { return x[1]; });
    var envio = {
      to: d.email,
      name: 'IGA Arquitetura',
      subject: titulo.replace('.', '') + ' (' + protocolo + ')',
      body: [
        titulo, '',
        'Seu protocolo é ' + protocolo + ' e respondemos em até dois dias úteis.', '',
        'Confirme seu e-mail: ' + link, '',
        resumo.map(function (x) { return x[0] + ': ' + x[1]; }).join('\n'), '',
        'Se não foi você que escreveu, ignore este e-mail.'
      ].join('\n'),
      htmlBody: htmlConfirmacao(titulo, d.nome.split(' ')[0], protocolo, link, resumo)
    };
    var escritorio = props.getProperty('EMAIL_ESCRITORIO');
    if (escritorio) envio.replyTo = escritorio;
    MailApp.sendEmail(envio);
    return true;
  } catch (err) {
    console.error('Confirmação por e-mail falhou: ' + err);
    return false;
  }
}

// Versão HTML da confirmação, nas cores da marca (estilos inline: clientes de e-mail ignoram <style>)
function htmlConfirmacao(titulo, primeiroNome, protocolo, link, resumo) {
  var linhas = resumo.map(function (x) {
    return '<tr><td style="padding:8px 12px 8px 0;border-top:1px solid #D9A58A;color:#8F3F24;vertical-align:top;width:90px">' +
      x[0] + '</td><td style="padding:8px 0;border-top:1px solid #D9A58A;white-space:pre-wrap">' + html_(x[1]) + '</td></tr>';
  }).join('');
  return '<div style="background:#F2E8DC;padding:32px 16px;font-family:Helvetica,Arial,sans-serif;color:#2B2622">' +
    '<div style="max-width:560px;margin:0 auto;background:#F7F2EC;border:1px solid #D9A58A;padding:32px">' +
    '<p style="margin:0 0 24px;font-size:22px;letter-spacing:2px">iga<span style="color:#B5583A">.</span></p>' +
    '<h1 style="margin:0 0 12px;font-family:Georgia,serif;font-weight:400;font-size:26px">' + titulo + '</h1>' +
    '<p style="margin:0 0 20px;font-size:15px;line-height:1.5">Olá, ' + html_(primeiroNome) +
    '. Seu protocolo é <strong>' + protocolo + '</strong> e respondemos em até dois dias úteis.</p>' +
    '<p style="margin:0 0 28px"><a href="' + link + '" style="display:inline-block;background:#2B2622;color:#F7F2EC;' +
    'text-decoration:none;padding:12px 20px;font-size:14px;letter-spacing:1px">Confirmar meu e-mail</a></p>' +
    '<table style="width:100%;border-collapse:collapse;font-size:14px;line-height:1.5">' + linhas + '</table>' +
    '<p style="margin:28px 0 0;font-size:12px;line-height:1.5;color:#6B7A3F">Se não foi você que escreveu, ignore este e-mail. ' +
    'Para falar com a gente, responda esta mensagem ou acesse <a href="' + SITE_URL + '" style="color:#6B7A3F">o site da IGA</a>.</p>' +
    '</div></div>';
}

// Assinatura do link (HMAC com um segredo guardado nas propriedades): ninguém confirma
// a mensagem de outra pessoa trocando o número do protocolo.
function assinatura(protocolo) {
  var props = PropertiesService.getScriptProperties();
  var segredo = props.getProperty('SEGREDO');
  if (!segredo) {
    segredo = Utilities.getUuid() + Utilities.getUuid();
    props.setProperty('SEGREDO', segredo);
  }
  var bytes = Utilities.computeHmacSha256Signature(protocolo, segredo);
  return bytes.slice(0, 12).map(function (b) { return ('0' + (b & 0xff).toString(16)).slice(-2); }).join('');
}

// Página que abre ao clicar no link de confirmação
function paginaConfirmacao(titulo, mensagem) {
  var html = '<!doctype html><html lang="pt-BR"><head><meta charset="utf-8">' +
    '<meta name="viewport" content="width=device-width, initial-scale=1"><title>' + html_(titulo) + ' | IGA Arquitetura</title></head>' +
    '<body style="margin:0;min-height:100vh;display:grid;place-items:center;background:#1F1B18;color:#F2E8DC;' +
    'font-family:Helvetica,Arial,sans-serif;padding:24px;box-sizing:border-box">' +
    '<main style="max-width:480px;text-align:center">' +
    '<p style="margin:0 0 24px;font-size:24px;letter-spacing:2px">iga<span style="color:#B5583A">.</span></p>' +
    '<h1 style="margin:0 0 12px;font-family:Georgia,serif;font-weight:400;font-size:30px">' + html_(titulo) + '</h1>' +
    '<p style="margin:0 0 28px;line-height:1.5">' + html_(mensagem) + '</p>' +
    '<a href="' + SITE_URL + '" target="_top" style="display:inline-block;background:#F2E8DC;color:#2B2622;' +
    'text-decoration:none;padding:12px 20px;font-size:14px">Ir para o site</a></main></body></html>';
  return HtmlService.createHtmlOutput(html).setTitle(titulo + ' | IGA Arquitetura');
}

// ==================== Status e resumo semanal ====================

// Rode uma vez pelo editor (Executar → configurar). Pode rodar de novo sem problema.
function configurar() {
  var planilha = aba();
  var col = colunas(planilha); // cria no fim os títulos que faltarem
  var regra = SpreadsheetApp.newDataValidation().requireValueInList(STATUS, true).setAllowInvalid(false).build();
  planilha.getRange(2, col.status, planilha.getMaxRows() - 1, 1).setDataValidation(regra);
  // linhas antigas sem status entram como "Novo"
  var ultima = planilha.getLastRow();
  if (ultima > 1) {
    var faixa = planilha.getRange(2, col.status, ultima - 1, 1);
    faixa.setValues(faixa.getValues().map(function (r) { return [r[0] || STATUS[0]]; }));
  }
  // um único gatilho: segunda-feira, por volta das 8h
  ScriptApp.getProjectTriggers().forEach(function (t) {
    if (t.getHandlerFunction() === 'resumoSemanal') ScriptApp.deleteTrigger(t);
  });
  ScriptApp.newTrigger('resumoSemanal').timeBased().onWeekDay(ScriptApp.WeekDay.MONDAY).atHour(8).create();
  // cria o segredo do link de confirmação agora (pede a autorização de uma vez)
  assinatura('IGA-0000');
  console.log('Pronto: títulos conferidos, lista de status e resumo de segunda às 8h.');
}

// E-mail de segunda-feira para o escritório: contatos da semana, por frente e por status,
// e a lista de quem ainda está como "Novo" há mais de dois dias.
function resumoSemanal() {
  var destino = PropertiesService.getScriptProperties().getProperty('EMAIL_ESCRITORIO');
  if (!destino) return;
  var planilha = aba();
  var col = colunas(planilha);
  var valor = function (r, titulo) { return r[col[titulo] - 1]; };
  var status = function (r) { return valor(r, 'status') || STATUS[0]; };
  var idade = function (r) { return Date.now() - new Date(valor(r, 'data')).getTime(); };
  var dia = 864e5;

  var linhas = planilha.getDataRange().getValues().slice(1).filter(function (r) { return valor(r, 'data'); });
  var semana = linhas.filter(function (r) { return idade(r) <= 7 * dia; });
  var parados = linhas.filter(function (r) { return status(r) === STATUS[0] && idade(r) > 2 * dia; });
  var porFrente = contar(TIPOS, semana, function (r) { return String(valor(r, 'tipo') || '').split(', '); });
  var porStatus = contar(STATUS, linhas, function (r) { return [status(r)]; });
  var listar = function (nomes, contagem) {
    return nomes.map(function (n) { return '  ' + n + ': ' + contagem[n]; }).join('\n');
  };

  var corpo = [
    'Resumo do formulário do site, ' + agora('dd/MM/yyyy') + '.',
    '',
    'Últimos 7 dias: ' + semana.length + (semana.length === 1 ? ' contato' : ' contatos') + '.',
    listar(TIPOS, porFrente),
    '',
    'Situação de todos os contatos:',
    listar(STATUS, porStatus),
    '',
    parados.length
      ? 'Ainda como "Novo" há mais de dois dias (' + parados.length + '):\n' + parados.map(function (r) {
          return '  ' + valor(r, 'protocolo') + ', ' + Utilities.formatDate(new Date(valor(r, 'data')), FUSO, 'dd/MM') +
            ', ' + valor(r, 'nome') + ' (' + (valor(r, 'tipo') || '-') + ')';
        }).join('\n')
      : 'Nenhum contato parado como "Novo".',
    '',
    'Para mudar a situação de um contato, use a lista da coluna "status" na planilha.'
  ].join('\n');
  MailApp.sendEmail({ to: destino, name: 'Site IGA', subject: 'Resumo semanal do formulário: ' + semana.length + ' contatos', body: corpo });
}

// Conta quantas linhas caem em cada nome (uma linha pode contar em mais de um)
function contar(nomes, linhas, nomesDaLinha) {
  var contagem = {};
  nomes.forEach(function (n) { contagem[n] = 0; });
  linhas.forEach(function (r) {
    nomesDaLinha(r).forEach(function (n) { if (n in contagem) contagem[n]++; });
  });
  return contagem;
}

// ==================== Utilitários ====================

function texto(v) { return String(v || '').trim(); }

function agora(formato) { return Utilities.formatDate(new Date(), FUSO, formato); }

function html_(v) {
  return String(v || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// Corta no tamanho máximo e evita que o texto vire fórmula na planilha
function seguro(v) {
  v = String(v || '').slice(0, LIMITES.mensagemMax);
  return /^[=+\-@]/.test(v) ? "'" + v : v;
}

function responder(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
