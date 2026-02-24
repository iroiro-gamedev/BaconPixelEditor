// Bacon Pixel Editor — UI Mixin
import { I18N } from '../i18n.js';

export default {
  _closeAllMenus(){
    document.querySelectorAll('.menu-item').forEach(m=>m.classList.remove('open'));
  },

  _t(key) { return I18N[this.lang]?.[key] ?? I18N.en[key] ?? key; },

  _applyI18n() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      el.textContent = this._t(el.dataset.i18n);
    });
    const langLabel={en:'EN',ja:'JA',zh:'中文'};
    document.getElementById('lang-toggle').textContent = langLabel[this.lang]||this.lang.toUpperCase();
    document.getElementById('lang-toggle').title = this._t('tip.langToggle');
    // Update theme toggle text
    const theme=document.documentElement.getAttribute('data-theme')||'dark';
    const tBtn=document.getElementById('theme-toggle');
    if(tBtn){tBtn.textContent=this._t(theme==='dark'?'ui.darkMode':'ui.lightMode');tBtn.title=this._t('tip.themeToggle');}
    // Update tool button titles
    document.querySelectorAll('.tool-btn[data-tool]').forEach(b => {
      const key = `tool.${b.dataset.tool}`;
      const name = this._t(key);
      const shortcuts = {select:'S',pencil:'P',eraser:'E',fill:'F',eyedropper:'I',line:'L',rect:'R',ellipse:'O'};
      b.title = `${name} (${shortcuts[b.dataset.tool]||''})`;
    });
    // Tooltip localizations
    const tip=(id,key)=>{const el=document.getElementById(id);if(el)el.title=this._t(key);};
    tip('btn-new-tab','tip.newTab');
    tip('mini-fg','tip.fgColor'); tip('mini-bg','tip.bgColor');
    tip('swap-colors','tip.swap'); tip('reset-colors','tip.reset');
    tip('btn-palette-from-img','tip.palFromImg');
    tip('btn-preview-zoom-in','tip.previewZoomIn'); tip('btn-preview-zoom-out','tip.previewZoomOut');
    tip('btn-play','tip.play'); tip('btn-stop','tip.stop');
    tip('fill-mode-toggle','tip.fillMode');
    tip('btn-mirror-h','tip.mirH'); tip('btn-mirror-v','tip.mirV');
    this._updateStatus(null,null);
  },

  _toggleLang() {
    const order=['en','ja','zh'];
    const i=order.indexOf(this.lang);
    this.lang=order[(i+1)%order.length];
    this._applyI18n();
    this._renderLFTable();
  },

  _applyTheme(theme){
    document.documentElement.setAttribute('data-theme',theme);
    const btn=document.getElementById('theme-toggle');
    if(btn){
      btn.textContent=this._t(theme==='dark'?'ui.darkMode':'ui.lightMode');
      btn.title=this._t('tip.themeToggle');
    }
  },
  _toggleTheme(){
    const cur=document.documentElement.getAttribute('data-theme')||'dark';
    const next=cur==='dark'?'light':'dark';
    this._applyTheme(next);
    try{localStorage.setItem('bpe_theme',next);}catch(e){}
    this._render();
    this._renderPreview(this.animPlaying?this.animFrameIdx:this.frameIdx);
  },

  _handleAction(a) {
    switch(a){
      case 'new':this._showModal();break;
      case 'open':document.getElementById('file-input').click();break;
      case 'save-bpe':this._saveBPE();break;
      case 'export-png':this._openExportDialog('png');break;
      case 'export-gif':this._openExportDialog('gif');break;
      case 'export-spritesheet':this._exportSpriteSheet();break;
      case 'export-bpe':this._saveBPE();break;
      case 'undo':this._undo();break;
      case 'redo':this._redo();break;
      case 'select-all':this._selectAll();break;
      case 'deselect':this._deselect();break;
      case 'delete-selection':this._deleteSelection();break;
      case 'copy-selection':this._copySelection();break;
      case 'paste':this._pasteFromClipboard();break;
      case 'clear-frame':this._saveUndo();this.pixels[this.layerIdx][this.frameIdx].fill(-1);this._render();break;
      case 'rotate-cw90':this._rotateCurrentCW90();break;
      case 'rotate-ccw90':this._rotateCurrentCCW90();break;
      case 'rotate-180':this._rotateCurrentBase180();break;
      case 'flip-h-canvas':this._flipCurrentH();break;
      case 'flip-v-canvas':this._flipCurrentV();break;
      case 'add-outline':this._showOutlineModal();break;
      case 'add-antialias':this._addAntiAlias();break;
      case 'resize-canvas':this._showResizeModal();break;
      case 'toggle-grid':this.showGrid=!this.showGrid;document.getElementById('btn-grid-toggle').classList.toggle('active',this.showGrid);this._render();break;
      case 'zoom-in':this._zoom(1);break;
      case 'zoom-out':this._zoom(-1);break;
      case 'zoom-fit':this._fitZoom();this._render();break;
    }
  },

  _selectTool(name) {
    if(this.tool!==name)this._deselect();
    this.tool=name;
    document.querySelectorAll('.tool-btn').forEach(b=>b.classList.toggle('active',b.dataset.tool===name));
    document.getElementById('opt-filled-label').style.display=['rect','ellipse'].includes(name)?'flex':'none';
    document.getElementById('fill-mode-wrap').style.display=name==='fill'?'':'none';
    document.getElementById('brush-size-wrap').style.display=['pencil','eraser'].includes(name)?'':'none';
    this._updateStatus(null,null);
  },

  _toggleAnim(){this.animPlaying?this._stopAnim():this._startAnim();},
  _startAnim(){
    if(this.frameCount<=1)return;
    this.animPlaying=true;this.animFrameIdx=this.frameIdx;
    document.getElementById('btn-play').classList.add('playing');
    document.getElementById('btn-play').textContent='⏸';
    const step=()=>{if(!this.animPlaying)return;this.animFrameIdx=(this.animFrameIdx+1)%this.frameCount;this._renderPreview(this.animFrameIdx);this.animTimer=setTimeout(step,1000/this.fps);};
    this._renderPreview(this.animFrameIdx);this.animTimer=setTimeout(step,1000/this.fps);
  },
  _stopAnim(){
    this.animPlaying=false;clearTimeout(this.animTimer);
    document.getElementById('btn-play').classList.remove('playing');document.getElementById('btn-play').textContent='▶';
    this._renderPreview(this.frameIdx);
  },

  _showModal(){document.getElementById('modal-overlay').classList.remove('hidden');},
  _hideModal(){document.getElementById('modal-overlay').classList.add('hidden');},

  async _saveWithDialog(blob, defaultName) {
    if(window.showSaveFilePicker){
      const ext='.'+defaultName.split('.').pop();
      const mimeMap={'.png':'image/png','.gif':'image/gif','.bpe':'application/octet-stream'};
      try{
        const fh=await window.showSaveFilePicker({
          suggestedName:defaultName,
          types:[{description:'File',accept:{[mimeMap[ext]||'application/octet-stream']:[ext]}}]
        });
        const w=await fh.createWritable();
        await w.write(blob);
        await w.close();
        if(this._pendingSaveBPE){
          const fname=fh.name.replace(/\.[^.]+$/,'');
          const cur=this.tabs.find(t=>t.id===this.activeTabId);
          if(cur){cur.label=fname;this._renderTabBar();}
        }
        this._pendingSaveBPE=false;
        return;
      }catch(e){
        if(e.name==='AbortError'){this._pendingSaveBPE=false;return;}
        // Fall through to custom modal on other errors
      }
    }
    // Fallback: custom filename modal
    this._showSaveModal(blob,defaultName);
  },

  _showSaveModal(blob, defaultName) {
    this._pendingSaveBlob=blob;
    const parts=defaultName.split('.');
    const ext=parts.length>1?'.'+parts.pop():'';
    const name=parts.join('.');
    document.getElementById('save-fname-input').value=name;
    document.getElementById('save-ext-display').textContent=ext;
    document.getElementById('save-modal-overlay').classList.remove('hidden');
    setTimeout(()=>document.getElementById('save-fname-input').select(),50);
  },

  _hideSaveModal() {
    document.getElementById('save-modal-overlay').classList.add('hidden');
    this._pendingSaveBlob=null;
  },

  _openExportDialog(type){
    this._pendingExport=type;
    document.getElementById('export-modal-overlay').classList.remove('hidden');
  },
  _hideExportModal(){
    document.getElementById('export-modal-overlay').classList.add('hidden');
    this._pendingExport=null;
  },
  _confirmExport(){
    const scale=parseInt(document.getElementById('export-scale-select').value)||1;
    const type=this._pendingExport;
    this._hideExportModal();
    if(type==='png')this._exportPNG(scale);
    else if(type==='gif')this._exportGIF(scale);
    else if(type==='spritesheet')this._exportSpriteSheet(scale);
  },

  _showOutlineModal(){
    document.getElementById('outline-diag-check').checked=this.outlineCorners;
    document.getElementById('outline-modal-overlay').classList.remove('hidden');
  },
  _hideOutlineModal(){
    document.getElementById('outline-modal-overlay').classList.add('hidden');
  },

  _showResizeModal(){
    document.getElementById('resize-w').value=this.canvasW;
    document.getElementById('resize-h').value=this.canvasH;
    document.getElementById('resize-modal-overlay').classList.remove('hidden');
  },
  _hideResizeModal(){
    document.getElementById('resize-modal-overlay').classList.add('hidden');
  },

  _download(blob,filename){
    const url=URL.createObjectURL(blob);const a=document.createElement('a');
    a.href=url;a.download=filename;document.body.appendChild(a);a.click();
    document.body.removeChild(a);setTimeout(()=>URL.revokeObjectURL(url),5000);
  },
};
