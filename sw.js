// Nova City - modo sin internet. Abrí el juego UNA vez con internet y queda guardado en el teléfono.
const C='nova-city-v4';
const LOCAL=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png'];
const CDN=['https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js',
'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/shaders/CopyShader.js',
'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/shaders/LuminosityHighPassShader.js',
'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/postprocessing/EffectComposer.js',
'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/postprocessing/MaskPass.js',
'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/postprocessing/ShaderPass.js',
'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/postprocessing/RenderPass.js',
'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/postprocessing/UnrealBloomPass.js',
'https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,500;0,700;1,700&display=swap'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>Promise.all(LOCAL.concat(CDN).map(u=>c.add(u).catch(()=>0)))));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
function net(req,ms){return new Promise((res,rej)=>{const t=setTimeout(()=>rej(new Error('lento')),ms);
 fetch(req).then(r=>{clearTimeout(t);if(r&&(r.ok||r.type==='opaque')){const k=r.clone();caches.open(C).then(c=>c.put(req,k)).catch(()=>0)}res(r)},e=>{clearTimeout(t);rej(e)})})}
self.addEventListener('fetch',e=>{const q=e.request;if(q.method!=='GET')return;const u=new URL(q.url);
 if(u.origin!==location.origin){ // librerías y fuentes: primero lo guardado, si no hay, internet
  e.respondWith(caches.match(q).then(r=>r||fetch(q).then(n=>{if(n&&(n.ok||n.type==='opaque')){const k=n.clone();caches.open(C).then(c=>c.put(q,k)).catch(()=>0)}return n}).catch(()=>new Response('',{status:504}))));return}
 // archivos propios: internet si responde rápido (así se actualiza), si no lo guardado
 e.respondWith(net(q,3000).catch(()=>caches.match(q,{ignoreSearch:true}).then(r=>r||(q.mode==='navigate'?caches.match('./index.html'):null)||new Response('',{status:504}))))});
