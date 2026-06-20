function a(c,m){if(!c)throw new Error(m)};
function calcular(custo,valor){const lucro=valor-custo;return{lucro,markup:custo===0?0:(lucro/custo)*100,margem:valor===0?0:(lucro/valor)*100}}
function estoqueVariacao(lotes){return lotes.filter(l=>l.status==='ativo').reduce((t,l)=>t+l.quantidade,0)}
const m=calcular(50,100);a(m.lucro===50,'lucro');a(m.markup===100,'markup');a(m.margem===50,'margem');
a(estoqueVariacao([{quantidade:10,status:'ativo'},{quantidade:5,status:'encerrado'},{quantidade:2,status:'ativo'}])===12,'estoque por lotes ativos');
console.log('item-catalogo-fluxo-comportamental.test.cjs OK');
