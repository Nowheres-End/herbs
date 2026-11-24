import fs from 'node:fs/promises';
import path from 'node:path';
import { Presentation, PresentationFile } from '@oai/artifact-tool';
const root = path.resolve('herbs');
const data = JSON.parse(await fs.readFile(path.join(root,'data/herbs.json'),'utf8'));
const W=1280,H=720;
const p=Presentation.create({slideSize:{width:W,height:H}});
async function addImg(slide, opts){const ext=path.extname(opts.path).toLowerCase();const type=ext==='.webp'?'image/webp':ext==='.jpg'?'image/jpeg':'image/png';const bytes=new Uint8Array(await fs.readFile(opts.path));return slide.images.add({blob:bytes,contentType:type,...opts});}
const C={paper:'#F3EAD5',ink:'#2C2B24',muted:'#686454',gold:'#A17B3F',line:'#B9A77D',green:'#465640'};
function box(slide,name,text,x,y,w,h,style={}){
 const sh=slide.shapes.add({geometry:'textbox',name,position:{left:x,top:y,width:w,height:h},fill:'none',line:{style:'solid',fill:'none',width:0}});
 sh.text=text; sh.text.style={typeface:style.font||'Georgia',fontSize:style.size||22,color:style.color||C.ink,bold:!!style.bold,italic:!!style.italic,alignment:style.align||'left',verticalAlignment:'middle',wrap:true}; return sh;
}
function rect(slide,name,x,y,w,h,fill,line=C.line,lw=1){ return slide.shapes.add({geometry:'rect',name,position:{left:x,top:y,width:w,height:h},fill,line:{style:'solid',fill:line,width:lw}}); }
function base(slide,n){
 slide.background.fill=C.paper;
 rect(slide,'page-frame',24,20,W-48,H-40,'none',C.line,1.2);
 box(slide,'running-head','NOWHERE’S END  ·  HERBARIUM',58,36,650,22,{font:'Arial',size:13,bold:true,color:C.green});
 box(slide,'page-number',String(n).padStart(2,'0'),1160,35,55,22,{font:'Arial',size:12,color:C.muted,align:'right'});
 rect(slide,'header-rule',58,67,W-116,1,C.line,C.line,0);
}
// Cover
{
 const s=p.slides.add(); base(s,'');
 box(s,'eyebrow','A BOTANICAL FIELD GUIDE  ·  2026',76,115,510,24,{font:'Arial',size:14,bold:true,color:C.gold});
 box(s,'cover-title','The Herbs Behind\nNowhere’s End',72,169,575,170,{size:54,color:C.ink});
 box(s,'cover-subtitle','An apothecary book of the botanicals in four absinthes',78,362,500,60,{size:22,italic:true,color:C.muted});
 rect(s,'cover-ornament',80,448,120,2,C.gold,C.gold,0);
 box(s,'cover-intro','24 botanicals · 4 blends · 24 illustrated leaves',78,472,480,35,{font:'Arial',size:18,color:C.green});
 box(s,'disclaimer','Traditional and historical uses are recorded here for context; they are not proof of efficacy or medical advice. Absinthe is an alcoholic beverage, not medicine.',78,593,520,58,{font:'Arial',size:13,color:C.muted});
 await addImg(s,{path:path.join(root,'assets/generated/cover.jpg'),alt:'Antique botanical still life with absinthe herbs',fit:'contain',position:{left:640,top:100,width:560,height:500}});
 s.speakerNotes.text='Compiled from the public Nowhere’s End herb library (https://nowhere.terpedia.com/data/herbs.json), accessed 2026-11-24. Traditional use descriptions are historical context, not modern medical guidance. Blend membership follows the live public library. Generated botanical artwork.';
}
for(let i=0;i<data.botanicals.length;i++){
 const h=data.botanicals[i], s=p.slides.add(); base(s,String(i+1).padStart(2,'0'));
 box(s,'section-label','BOTANICAL  ·  '+String(i+1).padStart(2,'0'),72,90,500,20,{font:'Arial',size:12,bold:true,color:C.gold});
 box(s,'common-name',h.title,70,126,540,68,{size:38,color:C.ink});
 box(s,'latin-name',h.latin,74,196,520,34,{size:20,italic:true,color:C.green});
 box(s,'role-chip',h.chip.toUpperCase(),74,244,490,23,{font:'Arial',size:13,bold:true,color:C.gold});
 rect(s,'copy-rule',74,277,395,1,C.line,C.line,0);
 box(s,'traditional-use-heading','TRADITIONAL & HISTORICAL USE',74,297,470,24,{font:'Arial',size:13,bold:true,color:C.green});
 box(s,'traditional-use',h.traditional_use_summary,74,331,450,105,{size:20,color:C.ink});
 box(s,'caution','Historical descriptions only; not evidence of treatment or a recommendation for use.',74,444,450,42,{font:'Arial',size:13,color:C.muted});
 // QR plaque
 rect(s,'qr-frame',73,515,115,132,'#FAF6EA',C.line,1);
 await addImg(s,{path:path.join(root,'assets/qr',h.slug+'.png'),alt:'QR code to '+h.organism_url,fit:'contain',position:{left:81,top:523,width:99,height:99},hyperlink:{uri:h.organism_url,isExternal:true}});
 box(s,'qr-caption','TERPEDIA RECORD',79,624,104,14,{font:'Arial',size:9,bold:true,color:C.green,align:'center'});
 // Actual TTB label thumbnail icons
 box(s,'blend-heading','FOUND IN THESE BLENDS',218,518,340,18,{font:'Arial',size:12,bold:true,color:C.green});
 for(let j=0;j<h.blend_labels.length;j++){
  const label=h.blend_labels[j], key=label.blend;
  const x=218+j*83;
  const labelImg=path.join(root,'assets/ttb-labels',key+'.webp');
  await addImg(s,{path:labelImg,alt:label.label_name+' TTB label',fit:'contain',position:{left:x,top:543,width:64,height:78},hyperlink:{uri:label.ttb_url,isExternal:true}});
  box(s,'blend-name-'+key,label.label_name,x-7,624,78,16,{font:'Arial',size:9,bold:true,color:C.ink,align:'center'});
 }
 await addImg(s,{path:path.join(root,h.image_file),alt:h.title+' botanical plate, generated illustration',fit:'contain',position:{left:565,top:99,width:650,height:462}});
 box(s,'plate-caption','BOTANICAL PLATE  ·  ORIGINAL GENERATED ART',652,575,550,18,{font:'Arial',size:10,color:C.muted,align:'right'});
 rect(s,'footer-rule',58,670,W-116,1,C.line,C.line,0);
 box(s,'footer','Traditional uses are not proof of efficacy. Absinthe contains alcohol and is not medicine.',62,680,900,19,{font:'Arial',size:10,color:C.muted});
 s.speakerNotes.text=`Sources and context for ${h.title}:\n- Current public herb entry: ${h.source_page}\n- Public blend membership: https://nowhere.terpedia.com/data/herbs.json (accessed 2026-11-24). The TTB record verifies the label/name/art, not the herb-to-blend assignment.\n- TTB label records: ${h.blend_labels.map(x=>`${x.label_name}: ${x.ttb_url}`).join('\n  ')}\n- QR destination: ${h.organism_url}${h.organism_record_exact?'':' (specific organism page was unavailable when checked; QR points to the Terpedia organism directory)'}\nTraditional-use statement is summarized from the public herb entry and is historical context, not efficacy evidence or medical advice. Generated botanical illustration.`;
}
await fs.mkdir(path.join(root,'.build/renders'),{recursive:true});
for(let i=0;i<p.slides.items.length;i++){
 const blob=await p.export({slide:p.slides.items[i],format:'png',scale:1});
 await fs.writeFile(path.join(root,'.build/renders',`slide-${String(i+1).padStart(2,'0')}.png`),Buffer.from(await blob.arrayBuffer()));
}
const pptx=await PresentationFile.exportPptx(p); await pptx.save(path.join(root,'.build/draft.pptx'));
console.log(JSON.stringify({slides:p.slides.items.length,draft:path.join(root,'.build/draft.pptx')}));
