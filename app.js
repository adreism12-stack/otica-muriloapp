const $=(q,ctx=document)=>ctx.querySelector(q);const $$=(q,ctx=document)=>Array.from(ctx.querySelectorAll(q));
const BRL=v=>(v||0).toLocaleString('pt-BR',{style:'currency',currency:'BRL'});const hojeISO=()=>new Date().toISOString().slice(0,10);

// Navegação
$$('.nav button[data-tab]').forEach(b=>b.addEventListener('click',()=>{$$('.tab').forEach(t=>t.classList.remove('active'));$('#tab-'+b.dataset.tab).classList.add('active');}));
$('#ano').textContent=new Date().getFullYear();

// PWA instalar
let promptEvent;window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();promptEvent=e;const btn=$('#instalar');btn.style.display='inline-block';btn.onclick=async()=>{promptEvent.prompt();await promptEvent.userChoice;btn.style.display='none';};});

// Estado da venda em edição
const venda={itens:[],desconto:0};

// ---- Produtos ----
async function carregarProdutos(filtro=''){const itens=await db.getAll('produtos');const tbody=$('#tbl-produtos tbody');tbody.innerHTML='';const q=filtro.trim().toLowerCase();
itens.filter(p=>!q||(p.nome?.toLowerCase().includes(q)||(p.sku||'').toLowerCase().includes(q))).forEach(p=>{const tr=document.createElement('tr');
tr.innerHTML=`<td>${p.sku||''}</td><td>${p.nome||''}</td><td>${p.categoria||''}</td><td>${BRL(p.preco)}</td><td class="${(p.qtd||0)<=(p.min||0)?'low':''}">${p.qtd||0}</td>`;tr.onclick=()=>carregarProdutoNoForm(p);tbody.appendChild(tr);});
$('#kpi-produtos').textContent=itens.length;const low=itens.filter(p=>(p.qtd||0)<=(p.min||0));const alTb=$('#tbl-alertas tbody');alTb.innerHTML='';
low.forEach(p=>{const tr=document.createElement('tr');tr.innerHTML=`<td>${p.sku||''}</td><td>${p.nome||''}</td><td>${p.qtd||0}</td><td>${p.min||0}</td>`;alTb.appendChild(tr);});window._todosProdutos=itens;}
function limparFormProduto(){$('#titulo-produto').textContent='Novo Produto';$('#prod-id').value='';$('#form-produto').reset();}
function carregarProdutoNoForm(p){$('#titulo-produto').textContent='Editar Produto';$('#prod-id').value=p.id||'';$('#prod-nome').value=p.nome||'';$('#prod-sku').value=p.sku||'';$('#prod-categoria').value=p.categoria||'';$('#prod-preco').value=p.preco||0;$('#prod-custo').value=p.custo||0;$('#prod-qtd').value=p.qtd||0;$('#prod-min').value=p.min||0;}
$('#btn-prod-novo').onclick=limparFormProduto;$('#btn-prod-excluir').onclick=async()=>{const id=Number($('#prod-id').value||0);if(!id)return alert('Selecione um produto para excluir.');if(!confirm('Excluir este produto?'))return;await db.del('produtos',id);limparFormProduto();carregarProdutos($('#busca-prod').value||'');};
$('#form-produto').addEventListener('submit',async e=>{e.preventDefault();const id=Number($('#prod-id').value||0);const fotoFile=$('#prod-foto').files?.[0];let fotoData=null;
if(fotoFile){fotoData=await new Promise(r=>{const fr=new FileReader();fr.onload=()=>r(fr.result);fr.readAsDataURL(fotoFile);});}
const obj={id:id||undefined,nome:$('#prod-nome').value.trim(),sku:$('#prod-sku').value.trim(),categoria:$('#prod-categoria').value.trim(),preco:Number($('#prod-preco').value||0),custo:Number($('#prod-custo').value||0),qtd:Number($('#prod-qtd').value||0),min:Number($('#prod-min').value||0),foto:fotoData||undefined};
if(id)await db.put('produtos',obj);else await db.add('produtos',obj);limparFormProduto();carregarProdutos($('#busca-prod').value||'');});
$('#busca-prod').addEventListener('input',e=>carregarProdutos(e.target.value));

// ---- Clientes ----
async function carregarClientes(filtro=''){const itens=await db.getAll('clientes');const tbody=$('#tbl-clientes tbody');tbody.innerHTML='';const q=filtro.trim().toLowerCase();
itens.filter(c=>!q||(c.nome?.toLowerCase().includes(q)||(c.fone||'').toLowerCase().includes(q))).forEach(c=>{const tr=document.createElement('tr');tr.innerHTML=`<td>${c.nome||''}</td><td>${c.fone||''}</td><td>${c.email||''}</td>`;tr.onclick=()=>carregarClienteNoForm(c);tbody.appendChild(tr);});
$('#kpi-clientes').textContent=itens.length;const sel=$('#vnd-cliente');sel.innerHTML='<option value=\"\">-- Cliente (opcional) --</option>';itens.forEach(c=>{const opt=document.createElement('option');opt.value=c.id;opt.textContent=c.nome;sel.appendChild(opt);});}
function limparFormCliente(){$('#titulo-cliente').textContent='Novo Cliente';$('#cli-id').value='';$('#form-cliente').reset();$('#btn-cli-whats').href='#';$('#btn-cli-whats').style.pointerEvents='none';}
function carregarClienteNoForm(c){$('#titulo-cliente').textContent='Editar Cliente';$('#cli-id').value=c.id||'';$('#cli-nome').value=c.nome||'';$('#cli-fone').value=c.fone||'';$('#cli-email').value=c.email||'';$('#cli-notas').value=c.notas||'';const link=c.fone?`https://wa.me/${c.fone}`:'#';$('#btn-cli-whats').href=link;$('#btn-cli-whats').style.pointerEvents=c.fone?'auto':'none';}
$('#btn-cli-novo').onclick=limparFormCliente;$('#btn-cli-excluir').onclick=async()=>{const id=Number($('#cli-id').value||0);if(!id)return alert('Selecione um cliente para excluir.');if(!confirm('Excluir este cliente?'))return;await db.del('clientes',id);limparFormCliente();carregarClientes($('#busca-cli').value||'');};
$('#form-cliente').addEventListener('submit',async e=>{e.preventDefault();const id=Number($('#cli-id').value||0);const obj={id:id||undefined,nome:$('#cli-nome').value.trim(),fone:($('#cli-fone').value||'').replace(/\D/g,''),email:$('#cli-email').value.trim(),notas:$('#cli-notas').value.trim()};
if(id)await db.put('clientes',obj);else await db.add('clientes',obj);limparFormCliente(){function limparFormCliente(){
  $('#titulo-cliente').textContent='Novo Cliente';
  $('#cli-id').value=''; $('#form-cliente').reset();
  $('#btn-cli-whats').href='#'; $('#btn-cli-whats').style.pointerEvents='none';
}
;carregarClientes($('#busca-cli').value||'');});
function atualizarLinkWhats(){
 const link = c.fone ? `https://wa.me/${c.fone}` : '#';
$('#btn-cli-whats').href = link;
$('#btn-cli-whats').style.pointerEvents = c.fone ? 'auto' : 'none';
}

async function salvarCliente(){
  const id = Number($('#cli-id').value||0);
  const nome = $('#cli-nome').value.trim();
  const fone = ($('#cli-fone').value||'').replace(/\D/g,'');
  const email = $('#cli-email').value.trim();
  const notas = $('#cli-notas').value.trim();

  if(!nome){ alert('Informe o nome do cliente.'); $('#cli-nome').focus(); return; }

  const obj = { id: id||undefined, nome, fone, email, notas };
  if(id) await db.put('clientes', obj); else await db.add('clientes', obj);

  limparFormCliente();
  await carregarClientes($('#busca-cli').value||'');
  alert('Cliente salvo com sucesso!');
}

// ligar eventos do botão e do campo telefone
$('#btn-cli-salvar').onclick = salvarCliente;
$('#cli-fone').addEventListener('input', atualizarLinkWhats);

$('#busca-cli').addEventListener('input',e=>carregarClientes(e.target.value));

// ---- Vendas ----
function renderItensVenda(){const box=$('#vnd-itens');box.innerHTML='';venda.itens.forEach((it,idx)=>{const row=document.createElement('div');row.className='panel';row.innerHTML=`
<div class="grid-3"><div><strong>${it.nome}</strong><div class="badge">SKU: ${it.sku||'-'}</div></div>
<label>Qtd <input type="number" step="1" min="1" value="${it.qtd}" data-idx="${idx}" class="inp-qtd"></label>
<div><strong>${BRL(it.preco)} / ${BRL(it.qtd*it.preco)}</strong></div></div>
<button class="danger" data-rm="${idx}">Remover</button>`;box.appendChild(row);});
$$('.inp-qtd',box).forEach(i=>i.addEventListener('input',e=>{const ixd=Number(e.target.dataset.idx);venda.itens[ixd].qtd=Number(e.target.value||1);atualizarTotal();}));
$$('button[data-rm]',box).forEach(b=>b.onclick=()=>{const ixd=Number(b.dataset.rm);venda.itens.splice(ixd,1);renderItensVenda();atualizarTotal();});}
function atualizarTotal(){venda.desconto=Number($('#vnd-desconto').value||0);const subtotal=venda.itens.reduce((s,it)=>s+(it.qtd*it.preco),0);const total=Math.max(0,subtotal-venda.desconto);$('#vnd-total').textContent=total.toLocaleString('pt-BR',{minimumFractionDigits:2});}
$('#vnd-desconto').addEventListener('input',atualizarTotal);
$('#vnd-busca-prod').addEventListener('keydown',e=>{if(e.key!=='Enter')return;e.preventDefault();const q=e.target.value.trim().toLowerCase();if(!q)return;
const p=(window._todosProdutos||[]).find(p=>(p.sku||'').toLowerCase()===q||(p.nome||'').toLowerCase().includes(q));if(!p){alert('Produto não encontrado.');return;}
const ja=venda.itens.find(it=>it.id===p.id);if(ja)ja.qtd+=1;else venda.itens.push({id:p.id,sku:p.sku,nome:p.nome,preco:p.preco||0,qtd:1});e.target.value='';renderItensVenda();atualizarTotal();});
$('#btn-vnd-limpar').onclick=()=>{venda.itens=[];$('#vnd-desconto').value=0;renderItensVenda();atualizarTotal();};
$('#form-venda').addEventListener('submit',async e=>{e.preventDefault();if(!venda.itens.length)return alert('Adicione itens.');
const clienteId=Number($('#vnd-cliente').value||0)||null;const data=new Date();const registro={data:data.toISOString(),clienteId,itens:venda.itens.map(it=>({id:it.id,nome:it.nome,sku:it.sku,preco:it.preco,qtd:it.qtd})),desconto:venda.desconto||0,total:Math.max(0,venda.itens.reduce((s,it)=>s+(it.qtd*it.preco),0)-(venda.desconto||0)),pagamento:$('#vnd-pag').value};
await db.add('vendas',registro);const produtos=await db.getAll('produtos');for(const it of registro.itens){const p=produtos.find(x=>x.id===it.id);if(p){p.qtd=Math.max(0,(p.qtd||0)-it.qtd);await db.put('produtos',p);}}
venda.itens=[];renderItensVenda();atualizarTotal();carregarProdutos($('#busca-prod').value||'');listarVendas();imprimirRecibo(registro,clienteId);});
async function listarVendas(){const vs=await db.getAll('vendas');const hoje=hojeISO();const hojeVendas=vs.filter(v=>(v.data||'').slice(0,10)===hoje);
$('#kpi-vendas-hoje').textContent=hojeVendas.length;const fat=hojeVendas.reduce((s,v)=>s+(v.total||0),0);$('#kpi-fat-hoje').textContent=BRL(fat);
const tbody=$('#tbl-vendas tbody');tbody.innerHTML='';for(const v of vs.slice(-20).reverse()){const tr=document.createElement('tr');const cliente=v.clienteId?await db.getById('clientes',v.clienteId):null;
const itensStr=v.itens.map(i=>`${i.nome} x${i.qtd}`).join(', ');tr.innerHTML=`<td>${new Date(v.data).toLocaleString('pt-BR')}</td><td>${cliente?.nome||'-'}</td><td>${itensStr}</td><td>${BRL(v.total)}</td>`;tbody.appendChild(tr);}}
async function imprimirRecibo(v,clienteId){const cli=clienteId?await db.getById('clientes',clienteId):null;const div=$('#recibo');
const itensHtml=v.itens.map(i=>`<tr><td>${i.nome}</td><td>${i.qtd}</td><td>${BRL(i.preco)}</td><td>${BRL(i.qtd*i.preco)}</td></tr>`).join('');
div.innerHTML=`<h3>Ótica - Recibo</h3><div><strong>Data:</strong> ${new Date(v.data).toLocaleString('pt-BR')}</div><div><strong>Cliente:</strong> ${cli?.nome||'-'}</div>
<table class="table" style="margin-top:8px"><thead><tr><th>Item</th><th>Qtd</th><th>Preço</th><th>Total</th></tr></thead><tbody>${itensHtml}</tbody></table>
<div style="text-align:right;margin-top:8px"><div>Desconto: ${BRL(v.desconto)}</div><div><strong>Total: ${BRL(v.total)}</strong></div></div>`;div.style.display='block';setTimeout(()=>window.print(),200);}
$('#btn-gerar-rel').addEventListener('click',async()=>{const ini=$('#rep-inicio').value||'1970-01-01';const fim=$('#rep-fim').value||'2999-12-31';const vs=await db.getAll('vendas');
const sel=vs.filter(v=>{const d=(v.data||'').slice(0,10);return d>=ini&&d<=fim;});const fat=sel.reduce((s,v)=>s+(v.total||0),0);const ticket=sel.length?fat/sel.length:0;
$('#rep-qtd').textContent=sel.length;$('#rep-fat').textContent=BRL(fat);$('#rep-ticket').textContent=BRL(ticket);const tbody=$('#tbl-rel tbody');tbody.innerHTML='';
for(const v of sel){const cli=v.clienteId?await db.getById('clientes',v.clienteId):null;const itensStr=v.itens.map(i=>`${i.nome} x${i.qtd}`).join(', ');const tr=document.createElement('tr');
tr.innerHTML=`<td>${new Date(v.data).toLocaleDateString('pt-BR')}</td><td>${cli?.nome||'-'}</td><td>${itensStr}</td><td>${BRL(v.total)}</td><td>${v.pagamento||'-'}</td>`;tbody.appendChild(tr);}});
// CSV
function toCSV(rows){const esc=s=>('\"'+String(s||'').replace(/\"/g,'\"\"')+'\"');return rows.map(r=>r.map(esc).join(',')).join('\n');}
$('#btn-exportar-produtos').onclick=async()=>{const ps=await db.getAll('produtos');const rows=[['id','nome','sku','categoria','preco','custo','qtd','min']].concat(ps.map(p=>[p.id,p.nome,p.sku,p.categoria,p.preco,p.custo,p.qtd,p.min]));
const blob=new Blob([toCSV(rows)],{type:'text/csv;charset=utf-8'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='produtos.csv';a.click();URL.revokeObjectURL(url);};
$('#btn-rel-csv').onclick=async()=>{const vs=await db.getAll('vendas');const rows=[['id','data','clienteId','itens','desconto','total','pagamento']].concat(vs.map(v=>[v.id,v.data,v.clienteId,v.itens.map(i=>`${i.nome} x${i.qtd} (${i.preco})`).join(' | '),v.desconto,v.total,v.pagamento]));
const blob=new Blob([toCSV(rows)],{type:'text/csv;charset=utf-8'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='vendas.csv';a.click();URL.revokeObjectURL(url);};
// Backup
$('#btn-exportar').onclick=async()=>{const [prod,cli,ven]=await Promise.all([db.getAll('produtos'),db.getAll('clientes'),db.getAll('vendas')]);const data={exportadoEm:new Date().toISOString(),produtos:prod,clientes:cli,vendas:ven};
const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='backup-otica.json';a.click();URL.revokeObjectURL(url);};
$('#inp-importar').addEventListener('change',async e=>{const file=e.target.files?.[0];if(!file)return;const text=await file.text();try{const data=JSON.parse(text);for(const p of (data.produtos||[])){await db.add('produtos',p);}for(const c of (data.clientes||[])){await db.add('clientes',c);}for(const v of (data.vendas||[])){await db.add('vendas',v);}alert('Importado com sucesso!');carregarTudo();}catch(err){alert('Arquivo inválido.');}});
$('#btn-reset').onclick=async()=>{if(!confirm('Tem certeza? Isso apagará todos os dados locais deste dispositivo.'))return;await db.clearAll();carregarTudo();};
// Init
async function carregarTudo(){await carregarProdutos();await carregarClientes();await listarVendas();}
carregarTudo();
