// IndexedDB wrapper
const DB_NAME='oticaDB'; const DB_VERSION=1; const STORES=['produtos','clientes','vendas'];
function openDB(){return new Promise((res,rej)=>{const r=indexedDB.open(DB_NAME,DB_VERSION);r.onupgradeneeded=e=>{const db=e.target.result;
if(!db.objectStoreNames.contains('produtos')){const s=db.createObjectStore('produtos',{keyPath:'id',autoIncrement:true});s.createIndex('nome','nome');s.createIndex('sku','sku');}
if(!db.objectStoreNames.contains('clientes')){db.createObjectStore('clientes',{keyPath:'id',autoIncrement:true});}
if(!db.objectStoreNames.contains('vendas')){db.createObjectStore('vendas',{keyPath:'id',autoIncrement:true});}};r.onsuccess=()=>res(r.result);r.onerror=()=>rej(r.error);});}
async function tx(store,mode='readonly'){const db=await openDB();return db.transaction(store,mode).objectStore(store);}
async function add(store,obj){return new Promise(async(res,rej)=>{const t=await tx(store,'readwrite');const a=t.add(obj);a.onsuccess=()=>res(a.result);a.onerror=()=>rej(a.error);});}
async function put(store,obj){return new Promise(async(res,rej)=>{const t=await tx(store,'readwrite');const a=t.put(obj);a.onsuccess=()=>res(a.result);a.onerror=()=>rej(a.error);});}
async function del(store,id){return new Promise(async(res,rej)=>{const t=await tx(store,'readwrite');const a=t.delete(id);a.onsuccess=()=>res(true);a.onerror=()=>rej(a.error);});}
async function getAll(store){return new Promise(async(res,rej)=>{const t=await tx(store);const a=t.getAll();a.onsuccess=()=>res(a.result||[]);a.onerror=()=>rej(a.error);});}
async function getById(store,id){return new Promise(async(res,rej)=>{const t=await tx(store);const a=t.get(id);a.onsuccess=()=>res(a.result||null);a.onerror=()=>rej(a.error);});}
async function clearAll(){const db=await openDB();return Promise.all(STORES.map(s=>new Promise((res,rej)=>{const a=db.transaction(s,'readwrite').objectStore(s).clear();a.onsuccess=()=>res(true);a.onerror=()=>rej(a.error);}))); }
window.db={add,put,del,getAll,getById,clearAll};
