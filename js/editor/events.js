// Bacon Pixel Editor — Events Mixin
import { CONFIG, clamp } from '../constants.js';
import { parseHex, toHex8 } from '../color-utils.js';

function makeResizer({resizerId,axis,getSize,applySize,min,max,onDone}){
  const el=document.getElementById(resizerId);
  let state=null;
  el.addEventListener('mousedown',e=>{
    e.preventDefault();
    state={start:axis==='y'?e.clientY:e.clientX,size:getSize()};
    el.classList.add('resizing');
    document.body.style.cursor=axis==='y'?'row-resize':'col-resize';
    const onMove=ev=>{
      if(!state)return;
      const d=(axis==='y'?ev.clientY:ev.clientX)-state.start;
      applySize(clamp(state.size+d,min,max));
    };
    const onUp=()=>{
      state=null;el.classList.remove('resizing');document.body.style.cursor='';
      document.removeEventListener('mousemove',onMove);
      document.removeEventListener('mouseup',onUp);
      if(onDone)onDone();
    };
    document.addEventListener('mousemove',onMove);
    document.addEventListener('mouseup',onUp);
  });
}

export default {
  _bindEvents(){
    this._bindCanvasEvents();
    this._bindMenuEvents();
    this._bindToolEvents();
    this._bindColorEvents();
    this._bindLayerFrameEvents();
    this._bindModalEvents();
    this._bindResizerEvents();
    this._bindTabEvents();
  },

  _bindCanvasEvents(){
    const vp=this.viewport;
    vp.addEventListener('mousedown',e=>this._onMouseDown(e));
    vp.addEventListener('mousemove',e=>this._onMouseMove(e));
    vp.addEventListener('mouseup',e=>this._onMouseUp(e));
    vp.addEventListener('mouseleave',e=>this._onMouseUp(e));
    vp.addEventListener('wheel',e=>this._onWheel(e),{passive:false});
    vp.addEventListener('contextmenu',e=>e.preventDefault());
    window.addEventListener('keydown',e=>this._onKeyDown(e));
    window.addEventListener('keyup',e=>this._onKeyUp(e));
    window.addEventListener('resize',()=>{this._resizeCanvases();this._render();});
  },

  _bindMenuEvents(){
    document.querySelectorAll('[data-action]').forEach(b=>b.addEventListener('click',e=>{e.stopPropagation();this._closeAllMenus();this._handleAction(b.dataset.action);}));
    // Menu open/close
    document.querySelectorAll('.menu-item').forEach(mi=>{
      const btn=mi.querySelector('.menu-btn');
      btn.addEventListener('click',e=>{e.stopPropagation();const wasOpen=mi.classList.contains('open');this._closeAllMenus();if(!wasOpen)mi.classList.add('open');});
      btn.addEventListener('mouseenter',()=>{if(document.querySelector('.menu-item.open')){this._closeAllMenus();mi.classList.add('open');}});
    });
    document.addEventListener('click',()=>this._closeAllMenus());
  },

  _bindToolEvents(){
    document.querySelectorAll('.tool-btn').forEach(b=>b.addEventListener('click',()=>this._selectTool(b.dataset.tool)));

    document.getElementById('btn-zoom-in') .addEventListener('click',()=>this._zoom(1));
    document.getElementById('btn-zoom-out').addEventListener('click',()=>this._zoom(-1));
    document.getElementById('btn-zoom-fit').addEventListener('click',()=>{this._fitZoom();this._render();});
    document.getElementById('btn-grid-toggle').addEventListener('click',()=>{
      this.showGrid=!this.showGrid;
      document.getElementById('btn-grid-toggle').classList.toggle('active',this.showGrid);
      this._render();
    });

    document.getElementById('fill-mode-toggle').addEventListener('click',()=>{
      this.fillMode=this.fillMode==='contiguous'?'all':'contiguous';
      const btn=document.getElementById('fill-mode-toggle');
      btn.dataset.i18n=this.fillMode==='contiguous'?'ui.fillContiguous':'ui.fillAll';
      btn.textContent=this._t(btn.dataset.i18n);
    });
    const _setBrushSize=v=>{
      this.brushSize=clamp(v,CONFIG.BRUSH_MIN,CONFIG.BRUSH_MAX);
      document.getElementById('brush-size-display').textContent=this.brushSize;
    };
    document.getElementById('btn-brush-minus').addEventListener('click',()=>_setBrushSize(this.brushSize-1));
    document.getElementById('btn-brush-plus').addEventListener('click',()=>_setBrushSize(this.brushSize+1));

    // Mirror buttons — toggle state AND re-render to show/hide guide lines immediately
    document.getElementById('btn-mirror-h').addEventListener('click',()=>{
      this.mirrorH=!this.mirrorH;
      document.getElementById('btn-mirror-h').classList.toggle('active',this.mirrorH);
      this._render();
    });
    document.getElementById('btn-mirror-v').addEventListener('click',()=>{
      this.mirrorV=!this.mirrorV;
      document.getElementById('btn-mirror-v').classList.toggle('active',this.mirrorV);
      this._render();
    });

    document.getElementById('opt-filled').addEventListener('change',e=>this.optFilled=e.target.checked);
  },

  _bindColorEvents(){
    document.getElementById('fg-color-input').addEventListener('input',e=>this._applyFgHex6(e.target.value));
    document.getElementById('bg-color-input').addEventListener('input',e=>this._applyBgHex6(e.target.value));
    document.getElementById('fg-alpha-input').addEventListener('input',e=>{
      if(this.fgIdx>=0&&this.fgIdx<this.palette.length){
        const c=parseHex(this.palette[this.fgIdx]);
        this.palette[this.fgIdx]=toHex8(c.r,c.g,c.b,parseInt(e.target.value));
        this._syncColorUI();this._renderPalette();
      }
    });
    document.getElementById('mini-fg').addEventListener('click',()=>document.getElementById('fg-color-input').click());
    document.getElementById('mini-bg').addEventListener('click',()=>document.getElementById('bg-color-input').click());
    document.getElementById('swap-colors').addEventListener('click',()=>{[this.fgIdx,this.bgIdx]=[this.bgIdx,this.fgIdx];this._syncColorUI();this._renderPalette();});
    document.getElementById('reset-colors').addEventListener('click',()=>{this.fgIdx=1;this.bgIdx=0;this._syncColorUI();this._renderPalette();});
    document.getElementById('btn-add-color').addEventListener('click',()=>{this.palette.push('#888888ff');this.fgIdx=this.palette.length-1;this._renderPalette();this._syncColorUI();});
    document.getElementById('btn-palette-from-img').addEventListener('click',()=>document.getElementById('img-palette-input').click());
    document.getElementById('img-palette-input').addEventListener('change',e=>{const f=e.target.files[0];if(f)this._importPaletteFromImage(f);e.target.value='';});
  },

  _bindLayerFrameEvents(){
    document.getElementById('btn-layer-add').addEventListener('click',()=>this._addLayer());
    document.getElementById('btn-layer-dup').addEventListener('click',()=>this._addLayer(this.layerIdx));
    document.getElementById('btn-layer-del').addEventListener('click',()=>this._deleteLayer());
    document.getElementById('btn-layer-up') .addEventListener('click',()=>this._moveLayerUp());
    document.getElementById('btn-layer-dn') .addEventListener('click',()=>this._moveLayerDown());

    document.getElementById('btn-frame-add').addEventListener('click',()=>this._addFrame());
    document.getElementById('btn-frame-dup').addEventListener('click',()=>this._addFrame(this.frameIdx));
    document.getElementById('btn-frame-del').addEventListener('click',()=>this._deleteFrame());

    document.getElementById('fps-input').addEventListener('change',e=>{this.fps=clamp(parseInt(e.target.value)||12,CONFIG.FPS_MIN,CONFIG.FPS_MAX);e.target.value=this.fps;});
    document.getElementById('btn-play').addEventListener('click',()=>this._toggleAnim());
    document.getElementById('btn-stop').addEventListener('click',()=>this._stopAnim());
  },

  _bindModalEvents(){
    // Language and theme toggles
    document.getElementById('lang-toggle').addEventListener('click',()=>this._toggleLang());
    document.getElementById('theme-toggle').addEventListener('click',()=>this._toggleTheme());

    document.getElementById('file-input').addEventListener('change',e=>{const f=e.target.files[0];if(f)this._loadBPE(f);e.target.value='';});

    // Memo auto-save on input
    document.getElementById('memo-textarea').addEventListener('input',()=>this._scheduleSave());

    document.querySelectorAll('.modal-presets button').forEach(b=>b.addEventListener('click',()=>{document.getElementById('new-width').value=b.dataset.w;document.getElementById('new-height').value=b.dataset.h;}));
    document.getElementById('modal-ok').addEventListener('click',()=>{
      const w=clamp(parseInt(document.getElementById('new-width').value)||16,CONFIG.CANVAS_MIN,CONFIG.CANVAS_MAX);
      const h=clamp(parseInt(document.getElementById('new-height').value)||16,CONFIG.CANVAS_MIN,CONFIG.CANVAS_MAX);
      this._hideModal();
      const cur=this.tabs.find(t=>t.id===this.activeTabId);
      if(cur)cur.state=this._serializeTab();
      this._newProject(w,h); // calls _afterStructureChange internally
      const id=this._nextTabId++;
      this.tabs.push({id,label:'Untitled',state:this._serializeTab()});
      this.activeTabId=id;
      this._renderTabBar();
    });
    document.getElementById('modal-cancel').addEventListener('click',()=>this._hideModal());
    document.getElementById('modal-overlay').addEventListener('click',e=>{if(e.target===document.getElementById('modal-overlay'))this._hideModal();});

    // Save modal
    document.getElementById('save-modal-cancel').addEventListener('click',()=>this._hideSaveModal());
    document.getElementById('save-modal-ok').addEventListener('click',()=>{
      const rawName=(document.getElementById('save-fname-input').value||'pixel-art').trim();
      const ext=document.getElementById('save-ext-display').textContent||'';
      const filename=rawName.endsWith(ext)?rawName:rawName+ext;
      if(this._pendingSaveBlob){
        this._download(this._pendingSaveBlob,filename);
        this._pendingSaveBlob=null;
        if(ext==='.bpe'){
          const cur=this.tabs.find(t=>t.id===this.activeTabId);
          if(cur){cur.label=rawName;this._renderTabBar();}
        }
      }
      this._hideSaveModal();
    });
    document.getElementById('save-modal-overlay').addEventListener('click',e=>{
      if(e.target===document.getElementById('save-modal-overlay'))this._hideSaveModal();
    });
    // Allow Enter key in save filename input
    document.getElementById('save-fname-input').addEventListener('keydown',e=>{
      if(e.key==='Enter'){e.preventDefault();document.getElementById('save-modal-ok').click();}
      if(e.key==='Escape'){e.preventDefault();this._hideSaveModal();}
    });

    // Export modal
    document.getElementById('export-modal-ok').addEventListener('click',()=>this._confirmExport());
    document.getElementById('export-modal-cancel').addEventListener('click',()=>this._hideExportModal());
    document.getElementById('export-modal-overlay').addEventListener('click',e=>{if(e.target===document.getElementById('export-modal-overlay'))this._hideExportModal();});

    // Add Outline modal
    document.getElementById('outline-ok').addEventListener('click',()=>{
      this.outlineCorners=document.getElementById('outline-diag-check').checked;
      this._hideOutlineModal();
      this._addOutline();
    });
    document.getElementById('outline-cancel').addEventListener('click',()=>this._hideOutlineModal());
    document.getElementById('outline-modal-overlay').addEventListener('click',e=>{if(e.target===document.getElementById('outline-modal-overlay'))this._hideOutlineModal();});

    // Resize canvas modal
    document.querySelectorAll('.resize-anchor-btn').forEach(b=>{
      b.addEventListener('click',()=>{
        document.querySelectorAll('.resize-anchor-btn').forEach(x=>x.classList.remove('active'));
        b.classList.add('active');
        this._resizeAnchor={x:parseFloat(b.dataset.ax),y:parseFloat(b.dataset.ay)};
      });
    });
    document.getElementById('resize-ok').addEventListener('click',()=>{
      const nw=clamp(parseInt(document.getElementById('resize-w').value)||this.canvasW,CONFIG.CANVAS_MIN,CONFIG.CANVAS_MAX);
      const nh=clamp(parseInt(document.getElementById('resize-h').value)||this.canvasH,CONFIG.CANVAS_MIN,CONFIG.CANVAS_MAX);
      this._hideResizeModal();
      this._resizeCanvas(nw,nh,this._resizeAnchor.x,this._resizeAnchor.y);
    });
    document.getElementById('resize-cancel').addEventListener('click',()=>this._hideResizeModal());
    document.getElementById('resize-modal-overlay').addEventListener('click',e=>{if(e.target===document.getElementById('resize-modal-overlay'))this._hideResizeModal();});
  },

  _bindResizerEvents(){
    const self=this;

    // Horizontal resizer (between canvas and layer panel) — drag up = taller (inverted)
    const lfHR=document.getElementById('lf-h-resizer');
    let lfHRState=null;
    lfHR.addEventListener('mousedown',e=>{
      e.preventDefault();
      lfHRState={startY:e.clientY,startH:document.getElementById('lf-section').offsetHeight};
      lfHR.classList.add('resizing');
      document.body.style.cursor='row-resize';
      const onMove=ev=>{
        if(!lfHRState)return;
        const dy=lfHRState.startY-ev.clientY;
        const newH=clamp(lfHRState.startH+dy,CONFIG.LF_PANEL_MIN_H,CONFIG.LF_PANEL_MAX_H);
        document.getElementById('lf-section').style.height=newH+'px';
      };
      const onUp=()=>{
        lfHRState=null;lfHR.classList.remove('resizing');document.body.style.cursor='';
        document.removeEventListener('mousemove',onMove);
        document.removeEventListener('mouseup',onUp);
        self._resizeCanvases();self._render();
      };
      document.addEventListener('mousemove',onMove);
      document.addEventListener('mouseup',onUp);
    });

    // Vertical resizer (between palette and animation in right panel) — drag down = taller
    makeResizer({
      resizerId:'right-v-resizer',
      axis:'y',
      getSize:()=>document.getElementById('palette-section').offsetHeight,
      applySize:h=>{ document.getElementById('palette-section').style.height=h+'px'; },
      min:CONFIG.PALETTE_PANEL_MIN_H,
      max:CONFIG.PALETTE_PANEL_MAX_H,
    });

    // Memo resizer (between animation and memo sections) — drag up = taller (inverted)
    const memoEl=document.getElementById('memo-resizer');
    let memoState=null;
    memoEl.addEventListener('mousedown',e=>{
      e.preventDefault();
      const ta=document.getElementById('memo-textarea');
      memoState={start:e.clientY,size:ta.offsetHeight};
      memoEl.classList.add('resizing');
      document.body.style.cursor='row-resize';
      const onMove=ev=>{
        if(!memoState)return;
        const dy=memoState.start-ev.clientY;
        const newH=clamp(memoState.size+dy,CONFIG.MEMO_MIN_H,CONFIG.MEMO_MAX_H);
        ta.style.height=newH+'px';
      };
      const onUp=()=>{
        memoState=null;memoEl.classList.remove('resizing');document.body.style.cursor='';
        document.removeEventListener('mousemove',onMove);
        document.removeEventListener('mouseup',onUp);
      };
      document.addEventListener('mousemove',onMove);
      document.addEventListener('mouseup',onUp);
    });

    // Right panel resize — drag left = wider (direction inverted)
    const rrEl=document.getElementById('right-resizer');
    let rrState=null;
    rrEl.addEventListener('mousedown',e=>{
      e.preventDefault();
      rrState={start:e.clientX,size:document.getElementById('right-panel').offsetWidth};
      rrEl.classList.add('resizing');
      document.body.style.cursor='col-resize';
      const onMove=ev=>{
        if(!rrState)return;
        const dx=rrState.start-ev.clientX;
        const newW=clamp(rrState.size+dx,CONFIG.RIGHT_PANEL_MIN_W,CONFIG.RIGHT_PANEL_MAX_W);
        document.documentElement.style.setProperty('--right-w',newW+'px');
      };
      const onUp=()=>{
        rrState=null;rrEl.classList.remove('resizing');document.body.style.cursor='';
        document.removeEventListener('mousemove',onMove);
        document.removeEventListener('mouseup',onUp);
        self._resizeCanvases();
        self._render();
      };
      document.addEventListener('mousemove',onMove);
      document.addEventListener('mouseup',onUp);
    });
  },

  _bindTabEvents(){
    // New tab button
    document.getElementById('btn-new-tab').addEventListener('click',()=>this._newTab());

    // Preview zoom buttons
    document.getElementById('btn-preview-zoom-in').addEventListener('click',()=>{
      this.previewZoom=Math.min(CONFIG.PREVIEW_ZOOM_MAX,parseFloat((this.previewZoom*1.5).toFixed(1)));
      this._renderPreview(this.animPlaying?this.animFrameIdx:this.frameIdx);
    });
    document.getElementById('btn-preview-zoom-out').addEventListener('click',()=>{
      this.previewZoom=Math.max(CONFIG.PREVIEW_ZOOM_MIN,parseFloat((this.previewZoom/1.5).toFixed(1)));
      this._renderPreview(this.animPlaying?this.animFrameIdx:this.frameIdx);
    });
    document.getElementById('preview-canvas').addEventListener('wheel',e=>{
      e.preventDefault();
      const factor=e.deltaY<0?1.25:0.8;
      this.previewZoom=clamp(parseFloat((this.previewZoom*factor).toFixed(2)),CONFIG.PREVIEW_ZOOM_MIN,CONFIG.PREVIEW_ZOOM_MAX);
      this._renderPreview(this.animPlaying?this.animFrameIdx:this.frameIdx);
    },{passive:false});
  },

  _onMouseDown(e) {
    const{mx,my}=this._vpPos(e);const{x,y}=this._screenToPixel(mx,my);const btn=e.button;
    if(this.spaceDown||btn===1){e.preventDefault();this.panning=true;this.panStart={mx,my,ox:this.offsetX,oy:this.offsetY};this.viewport.style.cursor='grabbing';return;}
    const ci=btn===2?this.bgIdx:this.fgIdx;
    if(this.tool==='select'){
      if(this.floatBuf&&this._overRotHandle){
        // Start rotation drag (floatBuf already exists)
        const fb=this.floatBuf;
        const rotCX=this.offsetX+(fb.x+fb.w/2)*this.zoom;
        const rotCY=this.offsetY+(fb.y+fb.h/2)*this.zoom;
        this.rotDrag={startAngle:Math.atan2(my-rotCY,mx-rotCX),origData:this.floatBuf.data.slice(),origW:fb.w,origH:fb.h,cx:rotCX,cy:rotCY};
        this.drawing=true;return;
      }
      if(!this.floatBuf&&this.selection&&this._overRotHandle){
        // Lift selection then start rotation drag
        this._liftFloat();
        if(this.floatBuf){
          const fb=this.floatBuf;
          const rotCX=this.offsetX+(fb.x+fb.w/2)*this.zoom;
          const rotCY=this.offsetY+(fb.y+fb.h/2)*this.zoom;
          this.rotDrag={startAngle:Math.atan2(my-rotCY,mx-rotCX),origData:fb.data.slice(),origW:fb.w,origH:fb.h,cx:rotCX,cy:rotCY};
          this.drawing=true;return;
        }
      }
      // Modifier keys for additive/subtractive selection
      const selModifier=e.shiftKey?'add':e.ctrlKey?'sub':null;
      if(selModifier){
        if(this.floatBuf)this._commitFloat();
        this._prevSelection=this.selection?{...this.selection}:null;
        this.selMode=selModifier;
        this.selection=null;this.selDragging=true;this.drawing=true;this.startPx={x,y};
        this._stopMarchingAnts();this._renderOverlay(x,y);return;
      }
      if(this.floatBuf){
        const fb=this.floatBuf;
        if(x>=fb.x&&x<fb.x+fb.w&&y>=fb.y&&y<fb.y+fb.h){
          this.floatDrag={startMx:mx,startMy:my,origFx:fb.x,origFy:fb.y};this.drawing=true;return;
        } else this._commitFloat();
      }
      if(this.selection&&this._isInSel(x,y)){
        this._liftFloat();
        if(this.floatBuf){this.floatDrag={startMx:mx,startMy:my,origFx:this.floatBuf.x,origFy:this.floatBuf.y};this.drawing=true;return;}
      }
      this._prevSelection=null;this.selMode='new';
      this.selection=null;this.selDragging=true;this.drawing=true;this.startPx={x,y};
      this._stopMarchingAnts();this._renderOverlay(x,y);return;
    }
    this.drawing=true;this.startPx={x,y};this.lastPx=null;this._beginDraw(x,y,ci);
  },

  _onMouseMove(e) {
    const{mx,my}=this._vpPos(e);const{x,y}=this._screenToPixel(mx,my);
    this._updateStatus(x,y);
    if(this.panning){this.offsetX=this.panStart.ox+(mx-this.panStart.mx);this.offsetY=this.panStart.oy+(my-this.panStart.my);this._render();return;}
    if(this.rotDrag){
      const angle=Math.atan2(my-this.rotDrag.cy,mx-this.rotDrag.cx)-this.rotDrag.startAngle;
      this.floatBuf.data=this._rotatePixels(this.rotDrag.origData,this.rotDrag.origW,this.rotDrag.origH,angle);
      this.floatBuf.rotAngle=angle;
      this._render();this._renderOverlay(x,y);return;
    }
    if(this.tool==='select'){
      if(this.floatBuf){
        const fb=this.floatBuf;
        const z=this.zoom,ox=this.offsetX,oy=this.offsetY;
        const angle=fb.rotAngle||0;
        const cx_s=ox+(fb.x+fb.w/2)*z,cy_s=oy+(fb.y+fb.h/2)*z;
        const hh=fb.h/2*z;
        const bx=cx_s-Math.sin(angle)*hh,by=cy_s+Math.cos(angle)*hh;
        const rhx=bx-Math.sin(angle)*20,rhy=by+Math.cos(angle)*20;
        this._overRotHandle=Math.hypot(mx-rhx,my-rhy)<=10;
        if(this._overRotHandle){this.viewport.classList.add('cursor-rotate');this.viewport.style.cursor='';}
        else{this.viewport.classList.remove('cursor-rotate');this.viewport.style.cursor=(x>=fb.x&&x<fb.x+fb.w&&y>=fb.y&&y<fb.y+fb.h)?'move':'crosshair';}
      }
      else if(this.selection){
        const{x1,x2,y2}=this.selection;
        const z=this.zoom,ox=this.offsetX,oy=this.offsetY;
        const rhx=ox+((x1+x2+1)/2)*z,rhy=oy+(y2+1)*z+20;
        this._overRotHandle=Math.hypot(mx-rhx,my-rhy)<=10;
        if(this._overRotHandle){this.viewport.classList.add('cursor-rotate');this.viewport.style.cursor='';}
        else if(this._isInSel(x,y)){this.viewport.classList.remove('cursor-rotate');this.viewport.style.cursor='move';}
        else{this.viewport.classList.remove('cursor-rotate');this.viewport.style.cursor='crosshair';}
      }
      else{this.viewport.classList.remove('cursor-rotate');this._overRotHandle=false;this.viewport.style.cursor='crosshair';}
    }
    if(!this.drawing){this._renderOverlay(x,y);return;}
    if(this.floatDrag){
      const dx=Math.round((mx-this.floatDrag.startMx)/this.zoom);
      const dy=Math.round((my-this.floatDrag.startMy)/this.zoom);
      this.floatBuf.x=this.floatDrag.origFx+dx;this.floatBuf.y=this.floatDrag.origFy+dy;
      this._render();this._renderOverlay(x,y);return;
    }
    const ci=(e.buttons&2)?this.bgIdx:this.fgIdx;
    this._continueDraw(x,y,ci);
  },

  _onMouseUp(e) {
    if(this.panning){this.panning=false;this.viewport.style.cursor=this.spaceDown?'grab':'crosshair';return;}
    if(this.rotDrag){this.rotDrag=null;this.drawing=false;this._render();return;}
    if(this.floatDrag){this.floatDrag=null;this.drawing=false;this._render();return;}
    if(this.drawing){
      const{mx,my}=this._vpPos(e);const{x,y}=this._screenToPixel(mx,my);
      const ci=e.button===2?this.bgIdx:this.fgIdx;
      this._endDraw(x,y,ci);this.drawing=false;this.startPx=null;this.lastPx=null;
    }
  },

  _onWheel(e){e.preventDefault();const{mx,my}=this._vpPos(e);this._zoomAt(e.deltaY<0?1:-1,mx,my);},

  _onKeyDown(e) {
    if(e.target.tagName==='INPUT'||e.target.tagName==='TEXTAREA')return;
    const ctrl=e.ctrlKey||e.metaKey;
    if(ctrl){
      if(e.key==='z'){e.preventDefault();this._undo();return;}
      if(e.key==='y'){e.preventDefault();this._redo();return;}
      if(e.key==='s'){e.preventDefault();this._saveBPE();return;}
      if(e.key==='a'){e.preventDefault();this._selectAll();return;}
      if(e.key==='c'){e.preventDefault();this._copySelection();return;}
      if(e.key==='v'){e.preventDefault();this._pasteFromClipboard();return;}
    }
    switch(e.key){
      case 'Enter':e.preventDefault();this._toggleAnim();break;
      case ' ':e.preventDefault();this.spaceDown=true;this.viewport.style.cursor='grab';break;
      case 'Escape':this._deselect();break;
      case 'Delete':case 'Backspace':this._deleteSelection();break;
      case 's':case 'S':this._selectTool('select');break;
      case 'p':case 'P':this._selectTool('pencil');break;
      case 'e':case 'E':this._selectTool('eraser');break;
      case 'f':case 'F':this._selectTool('fill');break;
      case 'i':case 'I':this._selectTool('eyedropper');break;
      case 'l':case 'L':this._selectTool('line');break;
      case 'r':case 'R':this._selectTool('rect');break;
      case 'o':case 'O':this._selectTool('ellipse');break;
      case 'g':case 'G':
        this.showGrid=!this.showGrid;
        document.getElementById('btn-grid-toggle').classList.toggle('active',this.showGrid);
        this._render();break;
      case '+':case '=':this._zoom(1);break;
      case '-':case '_':this._zoom(-1);break;
      case '0':this._fitZoom();this._render();break;
      case 'ArrowUp':
        e.preventDefault();
        if(this.layerIdx<this.layers.length-1){this.layerIdx++;this._render();this._renderLFTable();this._updateStatus(null,null);}
        break;
      case 'ArrowDown':
        e.preventDefault();
        if(this.layerIdx>0){this.layerIdx--;this._render();this._renderLFTable();this._updateStatus(null,null);}
        break;
      case 'ArrowLeft':
        e.preventDefault();
        if(this.frameIdx>0){this.frameIdx--;this.selection=null;this.floatBuf=null;this._render();this._renderLFTable();this._updateStatus(null,null);}
        break;
      case 'ArrowRight':
        e.preventDefault();
        if(this.frameIdx<this.frameCount-1){this.frameIdx++;this.selection=null;this.floatBuf=null;this._render();this._renderLFTable();this._updateStatus(null,null);}
        break;
    }
  },
  _onKeyUp(e){if(e.key===' '){this.spaceDown=false;this.viewport.style.cursor='crosshair';}},

  _vpPos(e){const r=this.viewport.getBoundingClientRect();return{mx:e.clientX-r.left,my:e.clientY-r.top};},
  _screenToPixel(mx,my){return{x:Math.floor((mx-this.offsetX)/this.zoom),y:Math.floor((my-this.offsetY)/this.zoom)};},
};
