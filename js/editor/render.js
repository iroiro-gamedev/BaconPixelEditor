// Bacon Pixel Editor — Render Mixin
import { parseHex, hex8to6 } from '../color-utils.js';

export default {
  _buildPaletteCache(){
    this._paletteRGBA=this.palette.map(c=>parseHex(c));
  },

  _render() {
    this._buildPaletteCache();
    const ctx=this.mainCtx,w=this.mainCanvas.width,h=this.mainCanvas.height;
    const z=this.zoom,ox=this.offsetX,oy=this.offsetY,cw=this.canvasW,ch=this.canvasH;
    const _light=document.documentElement.getAttribute('data-theme')==='light';
    ctx.clearRect(0,0,w,h);
    ctx.fillStyle=_light?'#b8b8b8':'#1e1e1e';ctx.fillRect(0,0,w,h);

    // Checkerboard
    for(let py=0;py<ch;py++)for(let px=0;px<cw;px++){
      const sx=ox+px*z,sy=oy+py*z;
      if(sx+z<0||sy+z<0||sx>=w||sy>=h)continue;
      ctx.fillStyle=(px+py)%2===0?(_light?'#c8c8c8':'#2a2a2a'):(_light?'#b8b8b8':'#222222');ctx.fillRect(sx,sy,z,z);
    }

    // Composite all visible layers into an ImageData, then draw via offscreen canvas
    const pal=this._paletteRGBA;
    const offsc=document.createElement('canvas');offsc.width=cw;offsc.height=ch;
    const offctx=offsc.getContext('2d');
    const imgData=offctx.createImageData(cw,ch);
    const d=imgData.data;
    for(let li=0;li<this.layers.length;li++){
      if(!this.layers[li].visible)continue;
      const lp=this.pixels[li][this.frameIdx];
      for(let i=0;i<lp.length;i++){
        const idx=lp[i];if(idx<0)continue;
        const c=pal[idx];if(!c||c.a===0)continue;
        const b=i*4;
        if(c.a===255){d[b]=c.r;d[b+1]=c.g;d[b+2]=c.b;d[b+3]=255;}
        else{
          const sa=c.a/255,da=d[b+3]/255,oa=sa+da*(1-sa);
          if(oa>0){d[b]=Math.round((c.r*sa+d[b]*da*(1-sa))/oa);d[b+1]=Math.round((c.g*sa+d[b+1]*da*(1-sa))/oa);d[b+2]=Math.round((c.b*sa+d[b+2]*da*(1-sa))/oa);}
          d[b+3]=Math.round(oa*255);
        }
      }
    }
    offctx.putImageData(imgData,0,0);
    ctx.imageSmoothingEnabled=false;
    ctx.drawImage(offsc,ox,oy,cw*z,ch*z);

    // Float buffer
    if(this.floatBuf){
      const fb=this.floatBuf;
      const fOff=document.createElement('canvas');fOff.width=fb.w;fOff.height=fb.h;
      const fCtx=fOff.getContext('2d');
      const fImg=fCtx.createImageData(fb.w,fb.h);
      const fd=fImg.data;
      for(let i=0;i<fb.data.length;i++){
        const ci=fb.data[i];if(ci<0)continue;
        const c=pal[ci];if(!c||c.a===0)continue;
        const b=i*4;fd[b]=c.r;fd[b+1]=c.g;fd[b+2]=c.b;fd[b+3]=c.a;
      }
      fCtx.putImageData(fImg,0,0);
      ctx.imageSmoothingEnabled=false;
      ctx.drawImage(fOff,ox+fb.x*z,oy+fb.y*z,fb.w*z,fb.h*z);
    }

    // Grid
    if(this.showGrid&&z>=3){
      ctx.strokeStyle='rgba(255,255,255,0.10)';ctx.lineWidth=0.5;
      for(let px=0;px<=cw;px++){const sx=ox+px*z;if(sx<-1||sx>w+1)continue;ctx.beginPath();ctx.moveTo(sx,oy);ctx.lineTo(sx,oy+ch*z);ctx.stroke();}
      for(let py=0;py<=ch;py++){const sy=oy+py*z;if(sy<-1||sy>h+1)continue;ctx.beginPath();ctx.moveTo(ox,sy);ctx.lineTo(ox+cw*z,sy);ctx.stroke();}
    }

    // Mirror axis guides — drawn whenever mirror is active
    if((this.mirrorH||this.mirrorV)&&z>=2){
      ctx.save();ctx.strokeStyle='rgba(77,157,224,0.55)';ctx.lineWidth=1.5;ctx.setLineDash([4,4]);
      if(this.mirrorH){const sx=ox+cw*z/2;ctx.beginPath();ctx.moveTo(sx,oy);ctx.lineTo(sx,oy+ch*z);ctx.stroke();}
      if(this.mirrorV){const sy=oy+ch*z/2;ctx.beginPath();ctx.moveTo(ox,sy);ctx.lineTo(ox+cw*z,sy);ctx.stroke();}
      ctx.restore();
    }

    // Canvas border
    ctx.strokeStyle='rgba(255,255,255,0.20)';ctx.lineWidth=1;ctx.setLineDash([]);
    ctx.strokeRect(ox-0.5,oy-0.5,cw*z+1,ch*z+1);

    // Instant thumb update (only current cell, no full table rebuild)
    this._updateThumb(this.layerIdx,this.frameIdx);
    this._renderPreview(this.animPlaying?this.animFrameIdx:this.frameIdx);
    this._renderOverlay(-1,-1);
    this._updateStatus(null,null);
    this._scheduleSave();
  },

  _renderOverlay(hx,hy) {
    const ctx=this.overlayCtx,w=this.overlayCanvas.width,h=this.overlayCanvas.height;
    const z=this.zoom,ox=this.offsetX,oy=this.offsetY;
    ctx.clearRect(0,0,w,h);

    // Shape preview
    if(this.overlayPxMap&&this.overlayPxMap.size>0){
      for(const[key,ci]of this.overlayPxMap){
        const[px,py]=key.split(',').map(Number);
        const sx=ox+px*z,sy=oy+py*z;
        if(sx+z<0||sy+z<0||sx>=w||sy>=h)continue;
        const col=(ci>=0&&ci<this.palette.length)?this.palette[ci]:'#88888880';
        const c=parseHex(col);
        ctx.globalAlpha=Math.min(1,c.a/255*0.85);ctx.fillStyle=`rgb(${c.r},${c.g},${c.b})`;ctx.fillRect(sx,sy,z,z);
      }
      ctx.globalAlpha=1;
    }

    // Selection marching ants
    const drawAnts=(rect,color1,color2)=>{
      const{x1,y1,x2,y2}=rect;
      const sx=ox+x1*z,sy=oy+y1*z,sw=(x2-x1+1)*z,sh=(y2-y1+1)*z;
      ctx.save();
      ctx.strokeStyle=color1;ctx.lineWidth=1.5;ctx.setLineDash([4,4]);ctx.lineDashOffset=-this._marchOffset;
      ctx.strokeRect(sx+0.5,sy+0.5,sw-1,sh-1);
      ctx.strokeStyle=color2;ctx.lineDashOffset=4-this._marchOffset;
      ctx.strokeRect(sx+0.5,sy+0.5,sw-1,sh-1);
      ctx.restore();
    };
    if(this.selection)drawAnts(this.selection,'#fff','#000');
    if(this.floatBuf){
      const fb=this.floatBuf;
      const angle=fb.rotAngle||0;
      const cx_s=ox+(fb.x+fb.w/2)*z,cy_s=oy+(fb.y+fb.h/2)*z;
      const fw=fb.w*z,fh=fb.h*z;
      // Rotated outline using canvas transform
      ctx.save();
      ctx.translate(cx_s,cy_s);ctx.rotate(angle);
      ctx.strokeStyle='#4d9de0';ctx.lineWidth=1.5;ctx.setLineDash([4,4]);ctx.lineDashOffset=-this._marchOffset;
      ctx.strokeRect(-fw/2+0.5,-fh/2+0.5,fw-1,fh-1);
      ctx.strokeStyle='#222';ctx.lineDashOffset=4-this._marchOffset;
      ctx.strokeRect(-fw/2+0.5,-fh/2+0.5,fw-1,fh-1);
      ctx.restore();
      // Bottom-center handle
      const hh=fb.h/2*z;
      const bx=cx_s-Math.sin(angle)*hh,by=cy_s+Math.cos(angle)*hh;
      const rhx=bx-Math.sin(angle)*20,rhy=by+Math.cos(angle)*20;
      ctx.save();
      ctx.strokeStyle='#4d9de0';ctx.lineWidth=1.5;ctx.setLineDash([2,2]);
      ctx.beginPath();ctx.moveTo(bx,by);ctx.lineTo(rhx,rhy);ctx.stroke();
      ctx.fillStyle='#4d9de0';ctx.strokeStyle='#fff';ctx.lineWidth=1.5;ctx.setLineDash([]);
      ctx.beginPath();ctx.arc(rhx,rhy,6,0,Math.PI*2);ctx.fill();ctx.stroke();
      ctx.restore();
    }
    if(this.selection&&!this.floatBuf){
      // Bottom-center rotation handle (plain selection)
      const{x1,x2,y2}=this.selection;
      const bx=ox+((x1+x2+1)/2)*z,by=oy+(y2+1)*z;
      const rhx=bx,rhy=by+20;
      ctx.save();
      ctx.strokeStyle='#4d9de0';ctx.lineWidth=1.5;ctx.setLineDash([2,2]);
      ctx.beginPath();ctx.moveTo(bx,by);ctx.lineTo(rhx,rhy);ctx.stroke();
      ctx.fillStyle='#4d9de0';ctx.strokeStyle='#fff';ctx.lineWidth=1.5;ctx.setLineDash([]);
      ctx.beginPath();ctx.arc(rhx,rhy,6,0,Math.PI*2);ctx.fill();ctx.stroke();
      ctx.restore();
    }
    // New selection preview
    if(this.tool==='select'&&this.selDragging&&this.startPx&&this.selection){
      const{x1,y1,x2,y2}=this.selection;
      const sx=ox+x1*z,sy=oy+y1*z,sw=(x2-x1+1)*z,sh=(y2-y1+1)*z;
      ctx.save();ctx.strokeStyle='rgba(255,255,255,0.7)';ctx.lineWidth=1;ctx.setLineDash([3,3]);
      ctx.strokeRect(sx+0.5,sy+0.5,sw,sh);ctx.restore();
    }
    // Cursor highlight
    if(this.tool!=='select'&&this._inBounds(hx,hy)&&!this.drawing){
      const s=this.brushSize||1;
      ctx.save();
      ctx.strokeStyle='rgba(255,255,255,0.65)';ctx.lineWidth=1.5;ctx.setLineDash([]);
      if(s<=1){
        const sx=ox+hx*z,sy=oy+hy*z;
        ctx.strokeRect(sx+0.5,sy+0.5,z-1,z-1);
      }else{
        // Draw boundary of circular brush (Euclidean disk, radius=s/2)
        const r=s/2;
        const inB=(dx,dy)=>Math.sqrt(dx*dx+dy*dy)<=r;
        const lo=-Math.ceil(r),hi=Math.ceil(r);
        ctx.beginPath();
        for(let dy=lo;dy<=hi;dy++){
          for(let dx=lo;dx<=hi;dx++){
            if(!inB(dx,dy))continue;
            const cx=ox+(hx+dx)*z,cy=oy+(hy+dy)*z;
            if(!inB(dx-1,dy)){ctx.moveTo(cx+0.5,cy+0.5);ctx.lineTo(cx+0.5,cy+z-0.5);}
            if(!inB(dx+1,dy)){ctx.moveTo(cx+z-0.5,cy+0.5);ctx.lineTo(cx+z-0.5,cy+z-0.5);}
            if(!inB(dx,dy-1)){ctx.moveTo(cx+0.5,cy+0.5);ctx.lineTo(cx+z-0.5,cy+0.5);}
            if(!inB(dx,dy+1)){ctx.moveTo(cx+0.5,cy+z-0.5);ctx.lineTo(cx+z-0.5,cy+z-0.5);}
          }
        }
        ctx.stroke();
      }
      ctx.restore();
    }
  },

  _resizeCanvases(){
    const w=this.viewport.clientWidth||600,h=this.viewport.clientHeight||400;
    this.mainCanvas.width=w;this.mainCanvas.height=h;
    this.overlayCanvas.width=w;this.overlayCanvas.height=h;
  },
  _fitZoom(){
    const vw=this.viewport.clientWidth||600,vh=this.viewport.clientHeight||400,m=40;
    const z=Math.max(1,Math.min(64,Math.min(Math.floor((vw-m)/this.canvasW),Math.floor((vh-m)/this.canvasH))));
    this.zoom=z;this.offsetX=Math.round((vw-this.canvasW*z)/2);this.offsetY=Math.round((vh-this.canvasH*z)/2);
    document.getElementById('zoom-display').textContent=`${z}x`;
    document.getElementById('st-zoom').textContent=`${z}x`;
  },
  _zoom(dir){this._zoomAt(dir,this.viewport.clientWidth/2,this.viewport.clientHeight/2);},
  _zoomAt(dir,mx,my){
    const L=[1,2,3,4,6,8,10,12,16,20,24,32,48,64];
    let cur=L.indexOf(this.zoom);if(cur<0)cur=L.findIndex(z=>z>=this.zoom);
    const next=Math.max(0,Math.min(L.length-1,cur+dir)),nz=L[next];
    if(nz===this.zoom)return;
    const ratio=nz/this.zoom;
    this.offsetX=Math.round(mx-(mx-this.offsetX)*ratio);this.offsetY=Math.round(my-(my-this.offsetY)*ratio);
    this.zoom=nz;document.getElementById('zoom-display').textContent=`${nz}x`;document.getElementById('st-zoom').textContent=`${nz}x`;
    this._render();
  },

  _updateThumb(li,fi) {
    const tc=this._thumbCanvas.get(`${li}_${fi}`);
    if(tc)this._renderLayerToThumb(tc.getContext('2d'),this.pixels[li][fi],tc.width,tc.height);
  },

  _renderLayerToThumb(ctx,layerPx,w,h) {
    const cw=this.canvasW,ch=this.canvasH,pw=w/cw,ph=h/ch;
    const _light=document.documentElement.getAttribute('data-theme')==='light';
    for(let py=0;py<ch;py++)for(let px=0;px<cw;px++){
      ctx.fillStyle=(px+py)%2===0?(_light?'#c8c8c8':'#2a2a2a'):(_light?'#b8b8b8':'#222222');ctx.fillRect(px*pw,py*ph,pw,ph);
    }
    if(!this._paletteRGBA.length)this._buildPaletteCache();
    const pal=this._paletteRGBA;
    for(let py=0;py<ch;py++)for(let px=0;px<cw;px++){
      const idx=layerPx[py*cw+px];if(idx<0)continue;
      const c=pal[idx];if(!c||c.a===0)continue;
      ctx.globalAlpha=c.a/255;ctx.fillStyle=`rgb(${c.r},${c.g},${c.b})`;ctx.fillRect(px*pw,py*ph,pw,ph);
    }
    ctx.globalAlpha=1;
  },

  _renderPreview(fi) {
    const pc=this.previewCanvas;
    const baseS=Math.max(20,Math.round(60*this.previewZoom));
    const scale=Math.min(baseS/this.canvasW,baseS/this.canvasH);
    pc.width=Math.round(this.canvasW*scale);pc.height=Math.round(this.canvasH*scale);
    this._renderLayerToThumb(this.previewCtx,this._compositFrame(fi),pc.width,pc.height);
    const zd=document.getElementById('preview-zoom-display');
    if(zd)zd.textContent=`${this.previewZoom.toFixed(1)}x`;
  },

  _renderLFTable() {
    this._thumbCanvas.clear();
    const table=document.getElementById('lf-table');
    table.innerHTML='';

    const thead=document.createElement('thead');
    const hRow=document.createElement('tr');

    // Drag handle header (empty)
    const thHandle=document.createElement('th');
    thHandle.className='lf-th-handle';hRow.appendChild(thHandle);

    // Layer name header (corner)
    const corner=document.createElement('th');
    corner.className='lf-corner';hRow.appendChild(corner);

    // Frame headers
    for(let fi=0;fi<this.frameCount;fi++){
      const th=document.createElement('th');
      th.className='lf-fh'+(fi===this.frameIdx?' af':'');
      th.textContent=`F${fi+1}`;
      th.addEventListener('click',()=>this._selectCell(this.layerIdx,fi));
      hRow.appendChild(th);
    }
    // Add frame cell
    const addTh=document.createElement('th');
    addTh.className='lf-add-f-cell';
    const addBtn=document.createElement('button');
    addBtn.className='lf-add-f-btn';addBtn.textContent='+';
    addBtn.addEventListener('click',()=>this._addFrame());
    addTh.appendChild(addBtn);hRow.appendChild(addTh);
    thead.appendChild(hRow);table.appendChild(thead);

    // Body: layers displayed top→bottom (highest index first)
    const tbody=document.createElement('tbody');
    const N=this.layers.length;

    for(let di=0;di<N;di++){
      const li=N-1-di;
      const layer=this.layers[li];
      const tr=document.createElement('tr');
      tr.className='lf-layer-row'+(li===this.layerIdx?' al':'');
      tr.dataset.di=di;
      tr.dataset.li=li;

      // ---- Drag handle cell ----
      const handleCell=document.createElement('td');
      handleCell.className='lf-td-handle';
      const handle=document.createElement('div');
      handle.className='drag-handle';
      handle.innerHTML='⠿';
      handle.title=this._t('tip.dragReorder');

      handle.addEventListener('mousedown',()=>{ tr.draggable=true; });
      window.addEventListener('mouseup',()=>{ tr.draggable=false; },{once:true});

      handleCell.appendChild(handle);tr.appendChild(handleCell);

      // Drag events on the row
      tr.addEventListener('dragstart',e=>{
        this._layerDragSrc=parseInt(tr.dataset.di);
        tr.classList.add('drag-src');
        e.dataTransfer.effectAllowed='move';
        e.dataTransfer.setData('text/plain',tr.dataset.di);
      });
      tr.addEventListener('dragend',()=>{
        document.querySelectorAll('.lf-layer-row').forEach(r=>r.classList.remove('drag-src','drag-over-top','drag-over-bot'));
        tr.draggable=false;
      });
      tr.addEventListener('dragover',e=>{
        e.preventDefault();e.dataTransfer.dropEffect='move';
        document.querySelectorAll('.lf-layer-row').forEach(r=>r.classList.remove('drag-over-top','drag-over-bot'));
        const rect=tr.getBoundingClientRect();
        if(e.clientY<rect.top+rect.height/2){tr.classList.add('drag-over-top');this._layerDragDst=di;}
        else{tr.classList.add('drag-over-bot');this._layerDragDst=di+1;}
      });
      tr.addEventListener('drop',e=>{
        e.preventDefault();
        document.querySelectorAll('.lf-layer-row').forEach(r=>r.classList.remove('drag-over-top','drag-over-bot','drag-src'));
        if(this._layerDragSrc===null||this._layerDragDst===null)return;
        let dst=this._layerDragDst;
        if(dst>this._layerDragSrc)dst--;
        this._reorderLayerByDispIdx(this._layerDragSrc,dst);
        this._layerDragSrc=null;this._layerDragDst=null;
      });

      // ---- Layer name cell ----
      const nameTd=document.createElement('td');nameTd.className='lf-layer-name';
      const nameRow=document.createElement('div');nameRow.className='lf-name-row';

      // Eye button
      const visBtn=document.createElement('button');
      visBtn.className='vis-btn'+(layer.visible?'':' hidden-layer');
      visBtn.innerHTML=layer.visible
        ? `<svg viewBox="0 0 16 16"><ellipse cx="8" cy="8" rx="6" ry="4" fill="none" stroke="white" stroke-width="1.5"/><circle cx="8" cy="8" r="2" fill="white"/></svg>`
        : `<svg viewBox="0 0 16 16"><line x1="2" y1="2" x2="14" y2="14" stroke="white" stroke-width="1.5"/><ellipse cx="8" cy="8" rx="6" ry="4" fill="none" stroke="white" stroke-width="1.5" opacity="0.5"/></svg>`;
      visBtn.title=this._t(layer.visible?'tip.hide':'tip.show');
      visBtn.addEventListener('click',ev=>{
        ev.stopPropagation();
        this.layers[li].visible=!this.layers[li].visible;
        this._render();this._renderLFTable();
      });

      // Layer name — span for display, dblclick to edit
      const nameText=document.createElement('span');
      nameText.className='layer-name-text';
      nameText.textContent=layer.name;
      nameText.title=this._t('lyr.rename');

      nameText.addEventListener('click',ev=>{
        ev.stopPropagation();
        if(this.layerIdx!==li){
          this.layerIdx=li;
          this._updateLayerActiveVisuals();
          this._render();
          this._updateStatus(null,null);
        }
      });
      nameText.addEventListener('dblclick',ev=>{
        ev.stopPropagation();
        this._startLayerNameEdit(li,nameText);
      });

      nameRow.appendChild(visBtn);nameRow.appendChild(nameText);
      nameTd.appendChild(nameRow);tr.appendChild(nameTd);

      // ---- Frame cells ----
      for(let fi=0;fi<this.frameCount;fi++){
        const td=document.createElement('td');
        td.className='lf-cell'
          +(fi===this.frameIdx?' af':'')
          +(li===this.layerIdx?' al':'')
          +(li===this.layerIdx&&fi===this.frameIdx?' active':'');
        td.dataset.li=li;
        td.dataset.fi=fi;

        const tc=document.createElement('canvas');
        tc.width=tc.height=36;
        this._renderLayerToThumb(tc.getContext('2d'),this.pixels[li][fi],36,36);
        this._thumbCanvas.set(`${li}_${fi}`,tc);

        td.appendChild(tc);
        td.addEventListener('click',()=>this._selectCell(li,fi));
        tr.appendChild(td);
      }

      tbody.appendChild(tr);
    }
    table.appendChild(tbody);
  },

  _startLayerNameEdit(li, nameText) {
    const input=document.createElement('input');
    input.type='text';
    input.className='layer-name-input';
    input.value=this.layers[li].name;
    if(nameText.parentNode)nameText.parentNode.replaceChild(input,nameText);
    input.focus();
    input.select();

    const commit=()=>{
      this.layers[li].name=input.value.trim()||this.layers[li].name;
      nameText.textContent=this.layers[li].name;
      if(input.parentNode)input.parentNode.replaceChild(nameText,input);
    };
    input.addEventListener('blur',commit);
    input.addEventListener('keydown',e=>{
      e.stopPropagation();
      if(e.key==='Enter'){e.preventDefault();input.blur();}
      if(e.key==='Escape'){input.value=this.layers[li].name;input.blur();}
    });
  },

  _updateLayerActiveVisuals() {
    const li=this.layerIdx,fi=this.frameIdx;
    document.querySelectorAll('.lf-layer-row').forEach(r=>{
      r.classList.toggle('al',parseInt(r.dataset.li)===li);
    });
    document.querySelectorAll('.lf-cell').forEach(c=>{
      const cLi=parseInt(c.dataset.li),cFi=parseInt(c.dataset.fi);
      c.classList.toggle('al',cLi===li);
      c.classList.toggle('af',cFi===fi);
      c.classList.toggle('active',cLi===li&&cFi===fi);
    });
    document.querySelectorAll('.lf-fh').forEach((fh,idx)=>{
      fh.classList.toggle('af',idx===fi);
    });
  },

  _renderPalette() {
    const grid=document.getElementById('palette-grid');grid.innerHTML='';
    this.palette.forEach((hex,i)=>{
      const sw=document.createElement('div');
      sw.className='pal-swatch'+(i===this.fgIdx?' fg-sel':'')+(i===this.bgIdx?' bg-sel':'');
      sw.title=hex;
      const inner=document.createElement('div');inner.className='sw-inner';
      const c=parseHex(hex);inner.style.background=`rgba(${c.r},${c.g},${c.b},${c.a/255})`;
      sw.appendChild(inner);
      sw.addEventListener('click',()=>{this.fgIdx=i;this._syncColorUI();this._renderPalette();});
      sw.addEventListener('contextmenu',e=>{e.preventDefault();this.bgIdx=i;this._syncColorUI();this._renderPalette();});
      grid.appendChild(sw);
    });
  },

  _syncColorUI() {
    const mfg=document.getElementById('mini-fg');
    if(this.fgIdx>=0&&this.fgIdx<this.palette.length){
      const c=parseHex(this.palette[this.fgIdx]);
      mfg.style.backgroundColor=`rgba(${c.r},${c.g},${c.b},${c.a/255})`;
      document.getElementById('fg-color-input').value=hex8to6(this.palette[this.fgIdx]);
      document.getElementById('fg-alpha-input').value=c.a;
    }else{mfg.style.backgroundColor='transparent';}
    const mbg=document.getElementById('mini-bg');
    if(this.bgIdx>=0&&this.bgIdx<this.palette.length){
      const c=parseHex(this.palette[this.bgIdx]);
      mbg.style.backgroundColor=`rgba(${c.r},${c.g},${c.b},${c.a/255})`;
      document.getElementById('bg-color-input').value=hex8to6(this.palette[this.bgIdx]);
    }else{mbg.style.backgroundColor='transparent';}
  },

  _applyFgHex6(hex6) {
    if(this.fgIdx<0||this.fgIdx>=this.palette.length){this.palette.push(hex6+'ff');this.fgIdx=this.palette.length-1;}
    else{const a=this.palette[this.fgIdx].slice(7,9)||'ff';this.palette[this.fgIdx]=hex6+a;}
    this._syncColorUI();this._renderPalette();
  },
  _applyBgHex6(hex6) {
    if(this.bgIdx<0||this.bgIdx>=this.palette.length){this.palette.push(hex6+'ff');this.bgIdx=this.palette.length-1;}
    else{const a=this.palette[this.bgIdx].slice(7,9)||'ff';this.palette[this.bgIdx]=hex6+a;}
    this._syncColorUI();this._renderPalette();
  },

  _updateStatus(x,y) {
    if(x!==null&&y!==null){
      document.getElementById('st-coords').textContent=`x:${x}  y:${y}`;
      if(this._inBounds(x,y)){
        const ci=this._getPixel(x,y);
        document.getElementById('st-color').textContent=ci>=0?this.palette[ci]:this._t('ui.transparent');
      }
    }
    document.getElementById('st-lf').textContent=
      `${this._t('st.layer')} ${this.layerIdx+1}/${this.layers.length}  ${this._t('st.frame')} ${this.frameIdx+1}/${this.frameCount}`;
    document.getElementById('st-size').textContent=`${this.canvasW}×${this.canvasH}`;
    document.getElementById('st-tool').textContent=this._t(`tool.${this.tool}`)||this.tool;
  },
};
