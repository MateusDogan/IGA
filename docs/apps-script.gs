/**
 * Formulário de contato da IGA → planilha do Google.
 * Passo a passo em docs/google-sheets-setup.md.
 *
 * O endereço deste script é público (o site precisa dele), então tudo que
 * protege a planilha fica aqui: validação, limite de envios, trava de escrita
 * e armadilhas contra robôs. A planilha nunca é devolvida para quem chama.
 *
 * Propriedades do script (Configurações do projeto → Propriedades do script):
 *   EMAIL_ESCRITORIO   e-mail que recebe o aviso de cada contato (opcional)
 *   FORMULARIO_ABERTO  "false" fecha o formulário na hora (opcional)
 * O número do último protocolo também fica nas propriedades (ULTIMO_PROTOCOLO).
 *
 * Colunas da planilha (linha 1):
 *   data | nome | email | celular | cidade | mensagem | protocolo | tipo
 *
 * @OnlyCurrentDoc
 */

// As mesmas regras estão em Public/scripts/forms_validation.js. Mudou aqui, mude lá.
var LIMITES = { nome: 100, email: 254, cidade: 100, mensagemMin: 20, mensagemMax: 3000, links: 3 };
var ENVIOS_POR_EMAIL_HORA = 3;
var ENVIOS_TOTAL_HORA = 30;
var TEMPO_MINIMO_MS = 3000;
var DDDS = [11, 12, 13, 14, 15, 16, 17, 18, 19, 21, 22, 24, 27, 28, 31, 32, 33, 34, 35, 37, 38,
  41, 42, 43, 44, 45, 46, 47, 48, 49, 51, 53, 54, 55, 61, 62, 63, 64, 65, 66, 67, 68, 69,
  71, 73, 74, 75, 77, 79, 81, 82, 83, 84, 85, 86, 87, 88, 89, 91, 92, 93, 94, 95, 96, 97, 98, 99];
// Frente do projeto (obrigatória, uma ou mais); qualquer outro valor é descartado
var TIPOS = ['Arquitetura', 'Interiores', 'Design gráfico'];

function doPost(e) {
  var props = PropertiesService.getScriptProperties();
  if (props.getProperty('FORMULARIO_ABERTO') === 'false') return responder({ ok: false, erro: 'fechado' });

  var p = (e && e.parameter) || {};

  // Robô: campo isca preenchido ou envio rápido demais. Responde "ok" sem gravar,
  // para não ensinar o robô a contornar.
  if (p.website || !(Number(p.t) >= TEMPO_MINIMO_MS)) return responder({ ok: true });

  var dados = {
    nome: texto(p.name),
    email: texto(p.email).toLowerCase(),
    celular: String(p.phone || '').replace(/\D/g, ''),
    cidade: texto(p.city),
    mensagem: texto(p.message),
    tipo: String(p.tipo || '').split(',').map(texto).filter(function (t) { return TIPOS.indexOf(t) !== -1; }).join(', ')
  };
  // "Editar mensagem" no site reenvia com o protocolo da anterior
  var corrige = /^IGA-\d{4,}$/.test(String(p.corrige || '')) ? String(p.corrige) : '';
  var campos = validar(dados);
  if (campos.length) return responder({ ok: false, erro: 'campos', campos: campos });

  if (!dentroDoLimite(dados.email)) return responder({ ok: false, erro: 'limite' });

  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
  } catch (err) {
    return responder({ ok: false, erro: 'ocupado' });
  }
  var protocolo;
  try {
    var numero = Number(props.getProperty('ULTIMO_PROTOCOLO') || 0) + 1;
    props.setProperty('ULTIMO_PROTOCOLO', String(numero));
    protocolo = 'IGA-' + ('000' + numero).slice(-4);
    SpreadsheetApp.getActiveSpreadsheet().getSheets()[0].appendRow([
      new Date(), seguro(dados.nome), seguro(dados.email), seguro(dados.celular),
      seguro(dados.cidade), seguro((corrige ? '[Correção de ' + corrige + '] ' : '') + dados.mensagem), protocolo, dados.tipo
    ]);
  } finally {
    lock.releaseLock();
  }

  avisarEscritorio(props.getProperty('EMAIL_ESCRITORIO'), dados, protocolo, corrige);
  return responder({ ok: true, protocolo: protocolo });
}

// ---------- Validação ----------
function validar(d) {
  var erros = [];
  if (!(d.nome.length <= LIMITES.nome && /\p{L}.*\p{L}/u.test(d.nome) && !temLink(d.nome))) erros.push('name');
  if (!(d.email.length <= LIMITES.email && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(d.email))) erros.push('email');
  if (d.celular && !celularValido(d.celular)) erros.push('phone');
  if (d.cidade.length > LIMITES.cidade) erros.push('city');
  if (!d.tipo) erros.push('tipo');
  var links = (d.mensagem.match(/https?:\/\/|www\./gi) || []).length;
  if (d.mensagem.length < LIMITES.mensagemMin || d.mensagem.length > LIMITES.mensagemMax || links > LIMITES.links) erros.push('message');
  return erros;
}

// DDD que existe; celular com 9 dígitos começando com 9, fixo com 8 começando de 2 a 5;
// recusa número com todos os dígitos iguais ou em sequência
function celularValido(n) {
  if (n.length !== 10 && n.length !== 11) return false;
  if (DDDS.indexOf(Number(n.slice(0, 2))) === -1) return false;
  var numero = n.slice(2);
  if (numero.length === 9 && numero[0] !== '9') return false;
  if (numero.length === 8 && !/[2-5]/.test(numero[0])) return false;
  if (/^(\d)\1+$/.test(numero.slice(1))) return false;
  if ('0123456789'.indexOf(numero.slice(1)) !== -1 || '9876543210'.indexOf(numero.slice(1)) !== -1) return false;
  return true;
}

function temLink(v) { return /https?:\/\/|www\./i.test(v); }

// ---------- Limite de envios (janela de uma hora) ----------
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

// ---------- Aviso ao escritório ----------
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

// ---------- Utilitários ----------
function texto(v) { return String(v || '').trim(); }

// Corta no tamanho máximo e evita que o texto vire fórmula na planilha
function seguro(v) {
  v = String(v || '').slice(0, LIMITES.mensagemMax);
  return /^[=+\-@]/.test(v) ? "'" + v : v;
}

function responder(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
