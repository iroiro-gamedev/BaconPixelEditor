// Bacon Pixel Editor — I/O Mixin
import { parseHex, toHex8, DEFAULT_PALETTE } from '../color-utils.js';
import GIFEncoder from '../gif-encoder.js';

export default {
  _saveBPE() {
    const data={bpe:'2.0',name:'untitled',width:this.canvasW,height:this.canvasH,fps:this.fps,palette:this.palette,frameCount:this.frameCount,
      memo:document.getElementById('memo-textarea').value,
      layers:this.layers.map((layer,li)=>({name:layer.name,visible:layer.visible,frames:this.pixels[li].map(f=>Array.from(f))}))};
    const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'});
    this._pendingSaveBPE=true;
    this._saveWithDialog(blob,'pixel-art.bpe');
  },
  _loadBPE(file){const r=new FileReader();r.onload=e=>{try{this._importBPE(JSON.parse(e.target.result),file.name.replace(/\.bpe$/i,''));}catch(err){alert('Load error: '+err.message);}};r.readAsText(file);},
  _importPaletteFromImage(file){
    const reader=new FileReader();
    reader.onload=ev=>{
      const img=new Image();
      img.onload=()=>{
        const MAX=128;
        const scale=Math.min(1,MAX/Math.max(img.width,img.height));
        const w=Math.max(1,Math.round(img.width*scale));
        const h=Math.max(1,Math.round(img.height*scale));
        const oc=document.createElement('canvas');
        oc.width=w;oc.height=h;
        const octx=oc.getContext('2d');
        octx.drawImage(img,0,0,w,h);
        const data=octx.getImageData(0,0,w,h).data;
        const freq=new Map();
        for(let i=0;i<data.length;i+=4){
          if(data[i+3]<16)continue;
          const r=Math.round(data[i]/16)*16;
          const g=Math.round(data[i+1]/16)*16;
          const b=Math.round(data[i+2]/16)*16;
          const key=(r<<16)|(g<<8)|b;
          freq.set(key,(freq.get(key)||0)+1);
        }
        const sorted=[...freq.entries()].sort((a,b)=>b[1]-a[1]).slice(0,64);
        if(!sorted.length){alert(this.lang==='ja'?'色が見つかりませんでした。':this.lang==='zh'?'未找到颜色。':'No colors found.');return;}
        const msg=this.lang==='ja'
          ?`画像から ${sorted.length} 色を読み込みます。\nパレットを置き換えますか？`
          :this.lang==='zh'
          ?`从图片导入 ${sorted.length} 种颜色。\n这将替换当前调色板。`
          :`Import ${sorted.length} colors from image?\nThis will replace the current palette.`;
        if(!confirm(msg))return;
        this.palette=['#00000000',...sorted.map(([k])=>{
          const r=(k>>16)&0xff,g=(k>>8)&0xff,b=k&0xff;
          return toHex8(r,g,b,255);
        })];
        this.fgIdx=1;this.bgIdx=0;
        this._syncColorUI();this._renderPalette();
      };
      img.src=ev.target.result;
    };
    reader.readAsDataURL(file);
  },
  _importBPE(data, label='Untitled') {
    if(!data.bpe)throw new Error('Not a BPE file');
    const cw=data.width||16,ch=data.height||16;
    const fps=data.fps||12;
    const palette=data.palette||DEFAULT_PALETTE.slice();
    const frameCount=data.frameCount||1;
    let layers,pixels;
    if(data.bpe==='1.0'&&data.frames){
      layers=[{name:'Layer 1',visible:true}];
      const tmp=(data.frames||[]).map(f=>{const a=new Int16Array(cw*ch);a.fill(-1);(f.pixels||f||[]).forEach((v,i)=>a[i]=v);return Array.from(a);});
      pixels=[tmp];
    }else{
      layers=[];pixels=[];
      (data.layers||[]).forEach(ld=>{
        layers.push({name:ld.name||'Layer',visible:ld.visible!==false});
        const lf=[];
        for(let fi=0;fi<frameCount;fi++){
          const src=(ld.frames||[])[fi]||[];const a=new Int16Array(cw*ch);a.fill(-1);
          src.forEach((v,i)=>{if(i<a.length)a[i]=v;});lf.push(Array.from(a));
        }
        pixels.push(lf);
      });
      if(!layers.length){layers=[{name:'Layer 1',visible:true}];pixels=[Array.from({length:frameCount},()=>Array.from(new Int16Array(cw*ch).fill(-1)))];}
    }
    const state={canvasW:cw,canvasH:ch,frameCount,layerIdx:0,frameIdx:0,layers,pixels,palette,fgIdx:1,bgIdx:0,zoom:8,offsetX:0,offsetY:0,fps,showGrid:true,undoStack:[],redoStack:[],memo:data.memo||''};
    // Save current tab and open in new tab
    const cur=this.tabs.find(t=>t.id===this.activeTabId);
    if(cur)cur.state=this._serializeTab();
    const id=this._nextTabId++;
    this.tabs.push({id,label,state});
    this.activeTabId=id;
    this._restoreTab(state);
    this._fitZoom();this._render();
    this._renderTabBar();
  },

  _exportPNG(scale=1) {
    const src=document.createElement('canvas');src.width=this.canvasW;src.height=this.canvasH;
    const sctx=src.getContext('2d');const img=sctx.createImageData(this.canvasW,this.canvasH);
    const d=img.data;const comp=this._compositFrame(this.frameIdx);
    for(let i=0;i<comp.length;i++){
      const ci=comp[i],b=i*4;
      if(ci<0){d[b+3]=0;continue;}
      const c=parseHex(this.palette[ci]||'#00000000');
      d[b]=c.r;d[b+1]=c.g;d[b+2]=c.b;d[b+3]=c.a;
    }
    sctx.putImageData(img,0,0);
    if(scale===1){src.toBlob(blob=>this._saveWithDialog(blob,'pixel-art.png'));return;}
    const oc=document.createElement('canvas');oc.width=this.canvasW*scale;oc.height=this.canvasH*scale;
    const octx=oc.getContext('2d');octx.imageSmoothingEnabled=false;
    octx.drawImage(src,0,0,oc.width,oc.height);
    oc.toBlob(blob=>this._saveWithDialog(blob,'pixel-art.png'));
  },

  _exportGIF(scale=1) {
    try{
      const enc=new GIFEncoder(this.canvasW*scale,this.canvasH*scale);enc.setRepeat(0);
      const delay=Math.round(1000/this.fps);
      for(let fi=0;fi<this.frameCount;fi++){
        const comp=this._compositFrame(fi);
        if(scale===1){enc.addFrame(Array.from(comp),this.palette,delay);continue;}
        const scaled=[];
        for(let y=0;y<this.canvasH*scale;y++)for(let x=0;x<this.canvasW*scale;x++)scaled.push(comp[Math.floor(y/scale)*this.canvasW+Math.floor(x/scale)]);
        enc.addFrame(scaled,this.palette,delay);
      }
      this._saveWithDialog(new Blob([enc.encode()],{type:'image/gif'}),'pixel-art.gif');
    }catch(err){alert('GIF error: '+err.message);console.error(err);}
  },

  _exportSpriteSheet(){
    const w=this.canvasW*this.frameCount,h=this.canvasH;
    const pixelData=new Int16Array(w*h).fill(-1);
    for(let fi=0;fi<this.frameCount;fi++){
      const comp=this._compositFrame(fi);
      for(let py=0;py<h;py++) for(let px=0;px<this.canvasW;px++)
        pixelData[py*w+(fi*this.canvasW+px)]=comp[py*this.canvasW+px];
    }
    const label=this._t('lyr.sprite').toLowerCase().replace(/\s+/g,'-');
    const state={
      canvasW:w,canvasH:h,frameCount:1,layerIdx:0,frameIdx:0,
      layers:[{name:this._t('lyr.sprite'),visible:true}],
      pixels:[[Array.from(pixelData)]],
      palette:this.palette.slice(),fgIdx:this.fgIdx,bgIdx:this.bgIdx,
      zoom:1,offsetX:0,offsetY:0,fps:this.fps,showGrid:false,
      undoStack:[],redoStack:[]
    };
    this._newTab(state,label);
    this._fitZoom();this._render();
  },
};
