/**
 * Bacon Pixel Editor — v4
 * Layers × Frames | Mirror | i18n | Drag-reorder | Instant thumbnails
 * Copy/Paste | Right-panel resize | Layer rename on dblclick | Save dialog
 */
'use strict';

// ============================================================
//  i18n
// ============================================================
const I18N = {
  en: {
    'm.file':'File','m.edit':'Edit','m.view':'View',
    'm.new':'New...','m.open':'Open (.bpe)...','m.save':'Save (.bpe)',
    'm.epng':'Export as PNG','m.egif':'Export as GIF (animated)','m.ess':'Export as Sprite Sheet','m.ebpe':'Export as BPE',
    'm.undo':'Undo (Ctrl+Z)','m.redo':'Redo (Ctrl+Y)',
    'm.selAll':'Select All (Ctrl+A)','m.desel':'Deselect (Esc)',
    'm.delSel':'Delete Selection (Del)','m.clear':'Clear Layer',
    'm.copy':'Copy (Ctrl+C)','m.paste':'Paste (Ctrl+V)',
    'm.grid':'Toggle Grid (G)','m.zin':'Zoom In (+)',
    'm.zout':'Zoom Out (-)','m.zfit':'Fit to Screen (0)',
    'ui.opacity':'Opacity','ui.filled':'Filled',
    'ui.mirH':'H','ui.mirV':'V',
    'ui.fg':'FG','ui.bg':'BG',
    'ui.palette':'Palette','ui.lf':'Layers / Frames',
    'ui.anim':'Animation','ui.fps':'FPS',
    'ui.grid':'Grid','ui.fit':'Fit',
    'btn.lAdd':'+L','btn.lDup':'Dup','btn.lDel':'−L',
    'btn.lUp':'▲','btn.lDn':'▼',
    'btn.fAdd':'+F','btn.fDup':'Dup','btn.fDel':'−F',
    'modal.title':'New Project','modal.w':'Width (px)','modal.h':'Height (px)',
    'modal.ok':'OK','modal.cancel':'Cancel',
    'save.title':'Save As','save.fname':'File name','save.ok':'Save',
    'exp.title':'Export','exp.scale':'Scale','exp.ok':'Export',
    'tool.select':'Select','tool.pencil':'Pencil','tool.eraser':'Eraser',
    'tool.fill':'Fill','tool.eyedropper':'Eyedropper',
    'tool.line':'Line','tool.rect':'Rectangle','tool.ellipse':'Ellipse',
    'st.layer':'Layer','st.frame':'Frame',
    'lyr.rename':'Double-click to rename',
    'm.rotateCW':'Rotate 90° CW','m.rotateCCW':'Rotate 90° CCW','m.rotate180':'Rotate 180°',
    'm.flipH':'Flip Horizontal','m.flipV':'Flip Vertical',
    'm.addOutline':'Add Outline','m.antialias':'Add Anti-alias',
    'm.resizeCanvas':'Resize Canvas...',
    'modal.resize':'Resize Canvas','modal.resizeOk':'Resize',
    'ui.fillMode':'Fill:','ui.fillContiguous':'Contiguous','ui.fillAll':'All',
    'ui.outlineDiag':'Fill corners (diagonal)',
    'tip.newTab':'New Tab',
    'tip.fgColor':'FG color (click to pick)','tip.bgColor':'BG color (right-click)',
    'tip.swap':'Swap FG/BG','tip.reset':'Reset colors',
    'tip.palFromImg':'Import palette from image',
    'tip.previewZoomIn':'Zoom In','tip.previewZoomOut':'Zoom Out',
    'tip.play':'Play animation','tip.stop':'Stop animation',
    'tip.fillMode':'Contiguous: flood fill / All: replace all same-color',
    'tip.mirH':'Mirror Horizontal','tip.mirV':'Mirror Vertical',
    'tip.themeToggle':'Switch theme','tip.langToggle':'Switch language',
    'tip.dragReorder':'Drag to reorder','tip.hide':'Hide','tip.show':'Show',
    'ui.darkMode':'Dark','ui.lightMode':'Light',
    'ui.transparent':'transparent',
    'lyr.default':'Layer','lyr.sprite':'Sprite Sheet',
  },
  ja: {
    'm.file':'ファイル','m.edit':'編集','m.view':'表示',
    'm.new':'新規作成...','m.open':'開く (.bpe)...','m.save':'保存 (.bpe)',
    'm.epng':'PNG として書き出し','m.egif':'GIF として書き出し (アニメーション)','m.ess':'スプライトシートとして書き出し','m.ebpe':'BPE として書き出し',
    'm.undo':'元に戻す (Ctrl+Z)','m.redo':'やり直す (Ctrl+Y)',
    'm.selAll':'全選択 (Ctrl+A)','m.desel':'選択解除 (Esc)',
    'm.delSel':'選択範囲を削除 (Del)','m.clear':'レイヤーをクリア',
    'm.copy':'コピー (Ctrl+C)','m.paste':'ペースト (Ctrl+V)',
    'm.grid':'グリッド表示 (G)','m.zin':'ズームイン (+)',
    'm.zout':'ズームアウト (-)','m.zfit':'画面に合わせる (0)',
    'ui.opacity':'不透明度','ui.filled':'塗りつぶし',
    'ui.mirH':'H','ui.mirV':'V',
    'ui.fg':'前景','ui.bg':'背景',
    'ui.palette':'パレット','ui.lf':'レイヤー / フレーム',
    'ui.anim':'アニメーション','ui.fps':'FPS',
    'ui.grid':'グリッド','ui.fit':'Fit',
    'btn.lAdd':'+L','btn.lDup':'複製','btn.lDel':'−L',
    'btn.lUp':'▲','btn.lDn':'▼',
    'btn.fAdd':'+F','btn.fDup':'複製','btn.fDel':'−F',
    'modal.title':'新規作成','modal.w':'幅 (px)','modal.h':'高さ (px)',
    'modal.ok':'OK','modal.cancel':'キャンセル',
    'save.title':'名前を付けて保存','save.fname':'ファイル名','save.ok':'保存',
    'exp.title':'書き出し','exp.scale':'倍率','exp.ok':'書き出し',
    'tool.select':'選択','tool.pencil':'ペン','tool.eraser':'消しゴム',
    'tool.fill':'塗りつぶし','tool.eyedropper':'スポイト',
    'tool.line':'直線','tool.rect':'四角形','tool.ellipse':'楕円',
    'st.layer':'レイヤー','st.frame':'フレーム',
    'lyr.rename':'ダブルクリックで名前を変更',
    'm.rotateCW':'90° 時計回り','m.rotateCCW':'90° 反時計回り','m.rotate180':'180° 回転',
    'm.flipH':'水平反転','m.flipV':'垂直反転',
    'm.addOutline':'アウトラインを追加','m.antialias':'アンチエイリアスを追加',
    'm.resizeCanvas':'キャンバスをリサイズ...',
    'modal.resize':'キャンバスをリサイズ','modal.resizeOk':'リサイズ',
    'ui.fillMode':'塗り:','ui.fillContiguous':'連続','ui.fillAll':'全体',
    'ui.outlineDiag':'角を埋める（斜め）',
    'tip.newTab':'新しいタブ',
    'tip.fgColor':'前景色 (クリックして選択)','tip.bgColor':'背景色 (右クリック)',
    'tip.swap':'前景/背景を入れ替え','tip.reset':'色をリセット',
    'tip.palFromImg':'画像からパレットを読み込む',
    'tip.previewZoomIn':'ズームイン','tip.previewZoomOut':'ズームアウト',
    'tip.play':'アニメーション再生','tip.stop':'アニメーション停止',
    'tip.fillMode':'連続: 隣接する同色を塗りつぶし / 全体: 同色ピクセルをすべて置換',
    'tip.mirH':'水平ミラー','tip.mirV':'垂直ミラー',
    'tip.themeToggle':'テーマ切替','tip.langToggle':'言語切替',
    'tip.dragReorder':'ドラッグで並び替え','tip.hide':'非表示','tip.show':'表示',
    'ui.darkMode':'ダーク','ui.lightMode':'ライト',
    'ui.transparent':'透明',
    'lyr.default':'レイヤー','lyr.sprite':'スプライトシート',
  },
  zh: {
    'm.file':'文件','m.edit':'编辑','m.view':'视图',
    'm.new':'新建...','m.open':'打开 (.bpe)...','m.save':'保存 (.bpe)',
    'm.epng':'导出为 PNG','m.egif':'导出为 GIF（动画）','m.ess':'导出为精灵图','m.ebpe':'导出为 BPE',
    'm.undo':'撤销 (Ctrl+Z)','m.redo':'重做 (Ctrl+Y)',
    'm.selAll':'全选 (Ctrl+A)','m.desel':'取消选择 (Esc)',
    'm.delSel':'删除选区 (Del)','m.clear':'清除图层',
    'm.copy':'复制 (Ctrl+C)','m.paste':'粘贴 (Ctrl+V)',
    'm.grid':'切换网格 (G)','m.zin':'放大 (+)',
    'm.zout':'缩小 (-)','m.zfit':'适应屏幕 (0)',
    'ui.opacity':'不透明度','ui.filled':'填充',
    'ui.mirH':'H','ui.mirV':'V',
    'ui.fg':'前景','ui.bg':'背景',
    'ui.palette':'调色板','ui.lf':'图层 / 帧',
    'ui.anim':'动画','ui.fps':'FPS',
    'ui.grid':'网格','ui.fit':'适应',
    'btn.lAdd':'+L','btn.lDup':'复制','btn.lDel':'−L',
    'btn.lUp':'▲','btn.lDn':'▼',
    'btn.fAdd':'+F','btn.fDup':'复制','btn.fDel':'−F',
    'modal.title':'新建项目','modal.w':'宽度 (px)','modal.h':'高度 (px)',
    'modal.ok':'确定','modal.cancel':'取消',
    'save.title':'另存为','save.fname':'文件名','save.ok':'保存',
    'exp.title':'导出','exp.scale':'缩放','exp.ok':'导出',
    'tool.select':'选择','tool.pencil':'铅笔','tool.eraser':'橡皮擦',
    'tool.fill':'填充','tool.eyedropper':'吸管',
    'tool.line':'直线','tool.rect':'矩形','tool.ellipse':'椭圆',
    'st.layer':'图层','st.frame':'帧',
    'lyr.rename':'双击重命名',
    'm.rotateCW':'顺时针旋转 90°','m.rotateCCW':'逆时针旋转 90°','m.rotate180':'旋转 180°',
    'm.flipH':'水平翻转','m.flipV':'垂直翻转',
    'm.addOutline':'添加轮廓','m.antialias':'添加抗锯齿',
    'm.resizeCanvas':'调整画布大小...',
    'modal.resize':'调整画布大小','modal.resizeOk':'调整',
    'ui.fillMode':'填充：','ui.fillContiguous':'连续','ui.fillAll':'全部',
    'ui.outlineDiag':'填充角点（斜向）',
    'tip.newTab':'新建标签',
    'tip.fgColor':'前景色（点击选取）','tip.bgColor':'背景色（右键点击）',
    'tip.swap':'互换前景/背景','tip.reset':'重置颜色',
    'tip.palFromImg':'从图片导入调色板',
    'tip.previewZoomIn':'放大','tip.previewZoomOut':'缩小',
    'tip.play':'播放动画','tip.stop':'停止动画',
    'tip.fillMode':'连续：洪水填充 / 全部：替换所有同色',
    'tip.mirH':'水平镜像','tip.mirV':'垂直镜像',
    'tip.themeToggle':'切换主题','tip.langToggle':'切换语言',
    'tip.dragReorder':'拖动重新排序','tip.hide':'隐藏','tip.show':'显示',
    'ui.darkMode':'深色','ui.lightMode':'浅色',
    'ui.transparent':'透明',
    'lyr.default':'图层','lyr.sprite':'精灵图',
  }
};

// ============================================================
//  Color utilities
// ============================================================
function parseHex(hex) {
  const s = (hex || '#00000000').replace('#', '');
  return {
    r: parseInt(s.slice(0,2),16)||0, g: parseInt(s.slice(2,4),16)||0,
    b: parseInt(s.slice(4,6),16)||0, a: s.length>=8?(parseInt(s.slice(6,8),16)||0):255,
  };
}
function toHex8(r,g,b,a=255) {
  return '#'+[r,g,b,a].map(v=>Math.round(Math.max(0,Math.min(255,v))).toString(16).padStart(2,'0')).join('');
}
function hex8to6(h) { return (h||'#000000').slice(0,7); }
function hslToRgb(h,s,l) {
  let r,g,b;
  if(s===0){r=g=b=l;}
  else{
    const q=l<0.5?l*(1+s):l+s-l*s,p=2*l-q;
    const hue2=(pp,qq,t)=>{if(t<0)t+=1;if(t>1)t-=1;if(t<1/6)return pp+(qq-pp)*6*t;if(t<1/2)return qq;if(t<2/3)return pp+(qq-pp)*(2/3-t)*6;return pp;};
    r=hue2(p,q,h+1/3);g=hue2(p,q,h);b=hue2(p,q,h-1/3);
  }
  return[Math.round(r*255),Math.round(g*255),Math.round(b*255)];
}

// ============================================================
//  Default palette (transparent + grays + hue gradients)
// ============================================================
function buildDefaultPalette() {
  const p=['#00000000'];
  for(let i=0;i<=8;i++){const v=Math.round(255-i*255/8);p.push(toHex8(v,v,v,255));}
  const hues=[0,22,45,75,110,150,175,200,225,255,280,315];
  const sats=[0.90,0.85,0.82,0.78,0.75,0.72,0.68,0.65];
  const lights=[0.92,0.80,0.66,0.52,0.39,0.27,0.17,0.09];
  for(const hd of hues){
    for(let si=0;si<lights.length;si++){
      const[r,g,b]=hslToRgb(hd/360,sats[si],lights[si]);
      p.push(toHex8(r,g,b,255));
    }
  }
  return p;
}
const DEFAULT_PALETTE = buildDefaultPalette();

// ============================================================
//  BaconPixelEditor
// ============================================================
class BaconPixelEditor {
  constructor() {
    // Project
    this.canvasW=16; this.canvasH=16;
    this.palette=DEFAULT_PALETTE.slice();
    this.layers=[]; this.pixels=[]; this.frameCount=1;
    this.layerIdx=0; this.frameIdx=0; this.fps=12;

    // Tool
    this.tool='pencil'; this.fgIdx=1; this.bgIdx=0; this.optFilled=false;
    this.fillMode='contiguous'; this.outlineCorners=false;

    // Mirror
    this.mirrorH=false; this.mirrorV=false;

    // View
    this.zoom=8; this.offsetX=0; this.offsetY=0; this.showGrid=true;

    // Interaction
    this.drawing=false; this.panning=false; this.spaceDown=false;
    this.startPx=null; this.lastPx=null; this.panStart=null; this.overlayPxMap=null;

    // Selection / float / rotation
    this.selection=null; this.selDragging=false;
    this.floatBuf=null; this.floatDrag=null;
    this._marchOffset=0; this._marchAnimId=null;
    this.rotDrag=null; this._overRotHandle=false;
    this._prevSelection=null; this.selMode='new';

    // Clipboard
    this._copyBuf=null;

    // Undo
    this.undoStack=[]; this.redoStack=[]; this.maxUndo=50;

    // Animation
    this.animPlaying=false; this.animFrameIdx=0; this.animTimer=null;

    // i18n
    this.lang='en';

    // Thumb cache: `${li}_${fi}` → canvas element
    this._thumbCanvas = new Map();

    // Layer drag state
    this._layerDragSrc=null; this._layerDragDst=null;

    // Pending save / export
    this._pendingSaveBlob=null;
    this._pendingExport=null;
    this._pendingSaveBPE=false;

    // Tabs
    this.tabs=[];
    this.activeTabId=0;
    this._nextTabId=1;
    this._tabDragSrcId=null;
    this._saveTimer=null;

    // Canvas resize anchor
    this._resizeAnchor={x:0.5,y:0.5};

    // Palette RGBA cache
    this._paletteRGBA=[];

    // Preview zoom
    this.previewZoom=2;

    // DOM
    this.mainCanvas   =document.getElementById('main-canvas');
    this.overlayCanvas=document.getElementById('overlay-canvas');
    this.previewCanvas=document.getElementById('preview-canvas');
    this.mainCtx      =this.mainCanvas.getContext('2d');
    this.overlayCtx   =this.overlayCanvas.getContext('2d');
    this.previewCtx   =this.previewCanvas.getContext('2d');
    this.viewport     =document.getElementById('canvas-viewport');

    this._init();
  }

  // ==========================================================
  //  Init
  // ==========================================================
  _init() {
    this._newProject(16,16,false);
    this._bindEvents();
    this._resizeCanvases();
    this._fitZoom();
    this._render();
    this._renderLFTable();
    this._renderPalette();
    this._syncColorUI();
    this._updateStatus(null,null);
    this._applyI18n();
    // Apply saved theme (bpe_theme stored separately from main save data)
    try{const t=localStorage.getItem('bpe_theme');if(t)this._applyTheme(t);}catch(e){}
    // Try to restore from localStorage, otherwise start fresh
    if(!this._loadFromLocalStorage()){
      this.tabs=[{id:0,label:'Untitled',state:this._serializeTab()}];
      this.activeTabId=0;this._nextTabId=1;
      this._renderTabBar();
    }
  }

  // ==========================================================
  //  i18n
  // ==========================================================
  _t(key) { return I18N[this.lang]?.[key] ?? I18N.en[key] ?? key; }

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
  }

  _toggleLang() {
    const order=['en','ja','zh'];
    const i=order.indexOf(this.lang);
    this.lang=order[(i+1)%order.length];
    this._applyI18n();
    this._renderLFTable();
  }

  _applyTheme(theme){
    document.documentElement.setAttribute('data-theme',theme);
    const btn=document.getElementById('theme-toggle');
    if(btn){
      btn.textContent=this._t(theme==='dark'?'ui.darkMode':'ui.lightMode');
      btn.title=this._t('tip.themeToggle');
    }
  }
  _toggleTheme(){
    const cur=document.documentElement.getAttribute('data-theme')||'dark';
    const next=cur==='dark'?'light':'dark';
    this._applyTheme(next);
    try{localStorage.setItem('bpe_theme',next);}catch(e){}
    this._render();
    this._renderPreview(this.animPlaying?this.animFrameIdx:this.frameIdx);
  }

  // ==========================================================
  //  Project
  // ==========================================================
  _newPixels() { const a=new Int16Array(this.canvasW*this.canvasH);a.fill(-1);return a; }

  _newProject(w,h,resetPalette=true) {
    this.canvasW=w; this.canvasH=h; this.frameCount=1;
    this.layerIdx=0; this.frameIdx=0;
    this.layers=[{name:this._t('lyr.default')+' 1',visible:true}];
    this.pixels=[[this._newPixels()]];
    this.undoStack=[]; this.redoStack=[];
    this.selection=null; this.floatBuf=null; this.rotDrag=null;
    this._thumbCanvas.clear();
    if(resetPalette){this.palette=DEFAULT_PALETTE.slice();this.fgIdx=1;this.bgIdx=0;}
    this.fps=12;
    this._stopAnim();
    this._afterStructureChange();
  }

  _afterStructureChange() {
    document.getElementById('canvas-size-display').textContent=`${this.canvasW} × ${this.canvasH}`;
    document.getElementById('fps-input').value=this.fps;
    this._resizeCanvases();
    this._fitZoom();
    this._render();
    this._renderLFTable();
    this._renderPalette();
    this._syncColorUI();
    this._updateStatus(null,null);
  }

  // ==========================================================
  //  Layer management
  // ==========================================================
  _addLayer(copyIdx=-1) {
    this._saveStructureUndo();
    const n = this.layers.length+1;
    const name = `${this._t('lyr.default')} ${n}`;
    this.layers.push({name,visible:true});
    const li=this.layers.length-1;
    this.pixels.push([]);
    for(let fi=0;fi<this.frameCount;fi++)
      this.pixels[li].push(copyIdx>=0?this.pixels[copyIdx][fi].slice():this._newPixels());
    this.layerIdx=li;
    this._thumbCanvas.clear();
    this._render(); this._renderLFTable();
  }

  _deleteLayer() {
    if(this.layers.length<=1)return;
    this._saveStructureUndo();
    this.layers.splice(this.layerIdx,1);
    this.pixels.splice(this.layerIdx,1);
    this.layerIdx=Math.min(this.layerIdx,this.layers.length-1);
    this._thumbCanvas.clear();
    this._render(); this._renderLFTable();
  }

  _moveLayerUp() {
    const li=this.layerIdx;
    if(li>=this.layers.length-1)return;
    [this.layers[li],this.layers[li+1]]=[this.layers[li+1],this.layers[li]];
    [this.pixels[li],this.pixels[li+1]]=[this.pixels[li+1],this.pixels[li]];
    this.layerIdx=li+1;
    this._thumbCanvas.clear();
    this._render(); this._renderLFTable();
  }

  _moveLayerDown() {
    const li=this.layerIdx;
    if(li<=0)return;
    [this.layers[li-1],this.layers[li]]=[this.layers[li],this.layers[li-1]];
    [this.pixels[li-1],this.pixels[li]]=[this.pixels[li],this.pixels[li-1]];
    this.layerIdx=li-1;
    this._thumbCanvas.clear();
    this._render(); this._renderLFTable();
  }

  /** Reorder using display indices (0 = topmost in UI = highest layer index). */
  _reorderLayerByDispIdx(srcDi, dstDi) {
    if(srcDi===dstDi)return;
    const curLayer=this.layers[this.layerIdx];
    const dL=[...this.layers].reverse();
    const dP=[...this.pixels].reverse();
    const[l]=dL.splice(srcDi,1);
    const[p]=dP.splice(srcDi,1);
    dL.splice(dstDi,0,l);
    dP.splice(dstDi,0,p);
    this.layers=dL.reverse();
    this.pixels=dP.reverse();
    this.layerIdx=this.layers.indexOf(curLayer);
    if(this.layerIdx<0)this.layerIdx=0;
    this._thumbCanvas.clear();
    this._render(); this._renderLFTable();
  }

  // ==========================================================
  //  Frame management
  // ==========================================================
  _addFrame(copyIdx=-1) {
    this._saveStructureUndo();
    for(let li=0;li<this.layers.length;li++)
      this.pixels[li].push(copyIdx>=0?this.pixels[li][copyIdx].slice():this._newPixels());
    this.frameCount++;
    this.frameIdx=this.frameCount-1;
    this._thumbCanvas.clear();
    this._render(); this._renderLFTable();
  }

  _deleteFrame() {
    if(this.frameCount<=1)return;
    this._saveStructureUndo();
    for(let li=0;li<this.layers.length;li++)this.pixels[li].splice(this.frameIdx,1);
    this.frameCount--;
    this.frameIdx=Math.min(this.frameIdx,this.frameCount-1);
    this._thumbCanvas.clear();
    this._render(); this._renderLFTable();
  }

  _selectCell(li,fi) {
    this.layerIdx=li; this.frameIdx=fi;
    this.selection=null; this.floatBuf=null;
    this._render(); this._updateLayerActiveVisuals(); this._updateStatus(null,null);
  }

  // ==========================================================
  //  Undo / Redo
  // ==========================================================
  _saveUndo() {
    this.undoStack.push({type:'pixels',li:this.layerIdx,fi:this.frameIdx,data:this.pixels[this.layerIdx][this.frameIdx].slice()});
    if(this.undoStack.length>this.maxUndo)this.undoStack.shift();
    this.redoStack=[];
  }
  _saveStructureUndo() {
    this.undoStack.push({type:'structure',
      layers:this.layers.map(l=>({...l})),
      pixels:this.pixels.map(lp=>lp.map(fp=>fp.slice())),
      frameCount:this.frameCount,layerIdx:this.layerIdx,frameIdx:this.frameIdx});
    if(this.undoStack.length>this.maxUndo)this.undoStack.shift();
    this.redoStack=[];
  }
  _snapshotStructure() {
    return{type:'structure',
      layers:this.layers.map(l=>({...l})),
      pixels:this.pixels.map(lp=>lp.map(fp=>fp.slice())),
      frameCount:this.frameCount,layerIdx:this.layerIdx,frameIdx:this.frameIdx};
  }
  _restoreStructureSnapshot(e) {
    this.layers=e.layers.map(l=>({...l}));
    this.pixels=e.pixels.map(lp=>lp.map(fp=>new Int16Array(fp)));
    this.frameCount=e.frameCount;this.layerIdx=e.layerIdx;this.frameIdx=e.frameIdx;
    this._thumbCanvas.clear();this._render();this._renderLFTable();
  }
  _undo() {
    if(!this.undoStack.length)return;
    const e=this.undoStack.pop();
    if(e.type==='structure'){
      this.redoStack.push(this._snapshotStructure());
      this._restoreStructureSnapshot(e);
    }else{
      this.redoStack.push({type:'pixels',li:e.li,fi:e.fi,data:this.pixels[e.li][e.fi].slice()});
      this.pixels[e.li][e.fi]=e.data;
      this.layerIdx=e.li; this.frameIdx=e.fi;
      this._thumbCanvas.clear();
      this._render(); this._renderLFTable();
    }
  }
  _redo() {
    if(!this.redoStack.length)return;
    const e=this.redoStack.pop();
    if(e.type==='structure'){
      this.undoStack.push(this._snapshotStructure());
      this._restoreStructureSnapshot(e);
    }else{
      this.undoStack.push({type:'pixels',li:e.li,fi:e.fi,data:this.pixels[e.li][e.fi].slice()});
      this.pixels[e.li][e.fi]=e.data;
      this.layerIdx=e.li; this.frameIdx=e.fi;
      this._thumbCanvas.clear();
      this._render(); this._renderLFTable();
    }
  }

  // ==========================================================
  //  Pixel access
  // ==========================================================
  _getPixel(x,y,li=this.layerIdx,fi=this.frameIdx){return this.pixels[li][fi][y*this.canvasW+x];}
  // Returns true when a palette index is visually transparent (index=-1 OR palette alpha=0)
  _isTransparentPx(idx){
    if(idx<0)return true;
    const h=this.palette[idx];
    return !h||(h.length===9&&h.slice(7,9)==='00');
  }
  _setPixel(x,y,ci,li=this.layerIdx,fi=this.frameIdx){this.pixels[li][fi][y*this.canvasW+x]=ci;}
  _inBounds(x,y){return x>=0&&y>=0&&x<this.canvasW&&y<this.canvasH;}

  /** Set pixel with mirror support. */
  _setPixelM(x,y,ci) {
    const pts=[[x,y]];
    if(this.mirrorH)pts.push([this.canvasW-1-x,y]);
    if(this.mirrorV)pts.push([x,this.canvasH-1-y]);
    if(this.mirrorH&&this.mirrorV)pts.push([this.canvasW-1-x,this.canvasH-1-y]);
    for(const[px,py]of pts)if(this._inBounds(px,py))this._setPixel(px,py,ci);
  }

  // ==========================================================
  //  Compositing
  // ==========================================================
  _compositedColor(px,py,fi=this.frameIdx) {
    for(let li=this.layers.length-1;li>=0;li--){
      if(!this.layers[li].visible)continue;
      const idx=this.pixels[li][fi][py*this.canvasW+px];
      if(idx>=0)return idx;
    }
    return -1;
  }
  _compositFrame(fi) {
    const res=new Int16Array(this.canvasW*this.canvasH);res.fill(-1);
    for(let li=0;li<this.layers.length;li++){
      if(!this.layers[li].visible)continue;
      const lp=this.pixels[li][fi];
      for(let i=0;i<res.length;i++)if(lp[i]>=0)res[i]=lp[i];
    }
    return res;
  }

  // ==========================================================
  //  Drawing
  // ==========================================================
  _beginDraw(x,y,ci) {
    if(this.tool==='eyedropper'){
      if(this._inBounds(x,y)){this.fgIdx=this._compositedColor(x,y);this._syncColorUI();this._renderPalette();}
      return;
    }
    if(this.tool==='fill'){
      if(this._inBounds(x,y)){
        this._saveUndo();
        if(this.fillMode==='all')this._fillAll(x,y,ci);
        else this._floodFill(x,y,ci);
        this._render();
      }
      return;
    }
    if(this.tool==='pencil'||this.tool==='eraser'){
      this._saveUndo();
      const c=this.tool==='eraser'?-1:ci;
      if(this._inBounds(x,y)){this._setPixelM(x,y,c);this.lastPx={x,y};this._render();}
      return;
    }
    this.overlayPxMap=null;
  }

  _continueDraw(x,y,ci) {
    if(this.tool==='eyedropper'||this.tool==='fill')return;
    if(this.tool==='pencil'||this.tool==='eraser'){
      const c=this.tool==='eraser'?-1:ci;
      if(this.lastPx&&this._inBounds(x,y))this._bresenham(this.lastPx.x,this.lastPx.y,x,y,c,true);
      else if(this._inBounds(x,y))this._setPixelM(x,y,c);
      this.lastPx={x,y};this._render();return;
    }
    if(['line','rect','ellipse'].includes(this.tool)&&this.startPx){
      this.overlayPxMap=this._computeShapePx(this.startPx.x,this.startPx.y,x,y,ci);
      this._renderOverlay(x,y);
    }
    if(this.tool==='select'&&this.selDragging&&this.startPx){
      const nr=this._normRect(this.startPx.x,this.startPx.y,x,y);
      if(this.selMode==='add'&&this._prevSelection)
        this.selection={x1:Math.min(this._prevSelection.x1,nr.x1),y1:Math.min(this._prevSelection.y1,nr.y1),x2:Math.max(this._prevSelection.x2,nr.x2),y2:Math.max(this._prevSelection.y2,nr.y2)};
      else if(this.selMode==='sub'&&this._prevSelection)
        this.selection=this._subtractRect(this._prevSelection,nr);
      else this.selection=nr;
      this._renderOverlay(x,y);
    }
  }

  _endDraw(x,y,ci) {
    if(this.tool==='eyedropper'||this.tool==='fill')return;
    if(this.tool==='pencil'||this.tool==='eraser'){this.overlayPxMap=null;return;}
    if(['line','rect','ellipse'].includes(this.tool)&&this.startPx){
      const m=this._computeShapePx(this.startPx.x,this.startPx.y,x,y,ci);
      if(m&&m.size>0){
        this._saveUndo();
        for(const[key,c]of m){const[px,py]=key.split(',').map(Number);if(this._inBounds(px,py))this._setPixelM(px,py,c);}
        this._render();
      }
    }
    if(this.tool==='select'){
      this.selDragging=false;
      if(this.startPx){
        const nr=this._normRect(this.startPx.x,this.startPx.y,x,y);
        let sel;
        if(this.selMode==='add'&&this._prevSelection)
          sel={x1:Math.min(this._prevSelection.x1,nr.x1),y1:Math.min(this._prevSelection.y1,nr.y1),x2:Math.max(this._prevSelection.x2,nr.x2),y2:Math.max(this._prevSelection.y2,nr.y2)};
        else if(this.selMode==='sub'&&this._prevSelection)
          sel=this._subtractRect(this._prevSelection,nr);
        else sel=nr;
        if(sel){
          sel.x1=Math.max(0,sel.x1);sel.y1=Math.max(0,sel.y1);
          sel.x2=Math.min(this.canvasW-1,sel.x2);sel.y2=Math.min(this.canvasH-1,sel.y2);
          if(sel.x1>sel.x2||sel.y1>sel.y2)sel=null;
        }
        this.selection=sel;
        if(this.selection)this._startMarchingAnts(); else this._stopMarchingAnts();
      }
    }
    this.overlayPxMap=null;
    this._renderOverlay(-1,-1);
  }

  _normRect(x0,y0,x1,y1){return{x1:Math.min(x0,x1),y1:Math.min(y0,y1),x2:Math.max(x0,x1),y2:Math.max(y0,y1)};}
  _isInSel(x,y){return this.selection&&x>=this.selection.x1&&x<=this.selection.x2&&y>=this.selection.y1&&y<=this.selection.y2;}

  // --- Selection operations ---
  _deleteSelection(){
    this._saveUndo();
    if(this.floatBuf){this.floatBuf=null;}
    else if(this.selection){
      const{x1,y1,x2,y2}=this.selection;
      for(let py=y1;py<=y2;py++)for(let px=x1;px<=x2;px++)if(this._inBounds(px,py))this._setPixel(px,py,-1);
    }else{
      this.pixels[this.layerIdx][this.frameIdx].fill(-1);
      this._thumbCanvas.clear();
      this._render();this._renderLFTable();return;
    }
    this._render();
  }
  _deselect(){
    if(this.floatBuf)this._commitFloat();
    this.selection=null;this.rotDrag=null;this._overRotHandle=false;
    this.viewport.classList.remove('cursor-rotate');
    this._stopMarchingAnts();this._renderOverlay(-1,-1);
  }
  _selectAll(){
    this.selection={x1:0,y1:0,x2:this.canvasW-1,y2:this.canvasH-1};
    this._startMarchingAnts();
  }
  _liftFloat(){
    if(!this.selection)return;
    const{x1,y1,x2,y2}=this.selection;
    const w=x2-x1+1,h=y2-y1+1;
    const data=new Int16Array(w*h);
    for(let py=0;py<h;py++)for(let px=0;px<w;px++)
      data[py*w+px]=this._inBounds(x1+px,y1+py)?this._getPixel(x1+px,y1+py):-1;
    this._saveUndo();
    for(let py=y1;py<=y2;py++)for(let px=x1;px<=x2;px++)if(this._inBounds(px,py))this._setPixel(px,py,-1);
    this.floatBuf={x:x1,y:y1,w,h,data,rotAngle:0};this.selection=null;
  }
  _commitFloat(){
    if(!this.floatBuf)return;
    const{x,y,w,h,data}=this.floatBuf;
    this._saveUndo();
    for(let py=0;py<h;py++)for(let px=0;px<w;px++){
      const ci=data[py*w+px];
      if(ci>=0&&this._inBounds(x+px,y+py))this._setPixel(x+px,y+py,ci);
    }
    this.floatBuf=null;this._render();
  }

  // --- Copy / Paste ---
  _copySelection() {
    if(!this.selection&&!this.floatBuf){
      // Full frame copy
      this._copyBuf={w:this.canvasW,h:this.canvasH,data:this.pixels[this.layerIdx][this.frameIdx].slice(),srcPalette:this.palette.slice()};
      return;
    }
    if(this.floatBuf){
      this._copyBuf={w:this.floatBuf.w,h:this.floatBuf.h,data:this.floatBuf.data.slice(),srcPalette:this.palette.slice()};
      return;
    }
    const{x1,y1,x2,y2}=this.selection;
    const w=x2-x1+1,h=y2-y1+1;
    const data=new Int16Array(w*h);
    for(let py=0;py<h;py++)for(let px=0;px<w;px++)
      data[py*w+px]=this._inBounds(x1+px,y1+py)?this._getPixel(x1+px,y1+py):-1;
    this._copyBuf={w,h,data,srcPalette:this.palette.slice()};
  }

  _pasteFromClipboard(){
    if(!this._copyBuf)return;
    if(this.floatBuf)this._commitFloat();
    let data=this._copyBuf.data.slice();
    if(this._copyBuf.srcPalette){
      const sp=this._copyBuf.srcPalette;
      const cache=new Map();
      for(let i=0;i<data.length;i++){
        const si=data[i];if(si<0)continue;
        if(!cache.has(si)){
          const hex=sp[si];
          let di=this.palette.indexOf(hex);
          if(di<0){this.palette.push(hex);di=this.palette.length-1;}
          cache.set(si,di);
        }
        data[i]=cache.get(si);
      }
      if(cache.size>0){this._renderPalette();this._syncColorUI();}
    }
    const cx=Math.max(0,Math.floor((this.canvasW-this._copyBuf.w)/2));
    const cy=Math.max(0,Math.floor((this.canvasH-this._copyBuf.h)/2));
    this.floatBuf={x:cx,y:cy,w:this._copyBuf.w,h:this._copyBuf.h,data,rotAngle:0};
    this.selection=null;
    this._selectTool('select');
    this._startMarchingAnts();
    this._render();
  }

  // ==========================================================
  //  Shape computation
  // ==========================================================
  _computeShapePx(x0,y0,x1,y1,ci) {
    const map=new Map();
    const set=(x,y)=>{
      const pts=[[x,y]];
      if(this.mirrorH)pts.push([this.canvasW-1-x,y]);
      if(this.mirrorV)pts.push([x,this.canvasH-1-y]);
      if(this.mirrorH&&this.mirrorV)pts.push([this.canvasW-1-x,this.canvasH-1-y]);
      for(const[px,py]of pts)if(this._inBounds(px,py))map.set(`${px},${py}`,ci);
    };
    if(this.tool==='line')   this._bresenhamSet(x0,y0,x1,y1,set);
    if(this.tool==='rect')   this._shapeRect(x0,y0,x1,y1,set);
    if(this.tool==='ellipse')this._shapeEllipse(x0,y0,x1,y1,set);
    return map;
  }

  _shapeRect(x0,y0,x1,y1,set){
    const lx=Math.min(x0,x1),rx=Math.max(x0,x1),ty=Math.min(y0,y1),by=Math.max(y0,y1);
    if(this.optFilled){for(let y=ty;y<=by;y++)for(let x=lx;x<=rx;x++)set(x,y);}
    else{for(let x=lx;x<=rx;x++){set(x,ty);set(x,by);}for(let y=ty;y<=by;y++){set(lx,y);set(rx,y);}}
  }
  _shapeEllipse(x0,y0,x1,y1,set){
    const cx=(x0+x1)/2,cy=(y0+y1)/2,rx=Math.abs(x1-x0)/2,ry=Math.abs(y1-y0)/2;
    if(rx===0&&ry===0){set(Math.round(cx),Math.round(cy));return;}
    const draw=(ex,ey)=>{
      if(this.optFilled){for(let xi=Math.round(cx-ex);xi<=Math.round(cx+ex);xi++){set(xi,Math.round(cy+ey));set(xi,Math.round(cy-ey));}}
      else{set(Math.round(cx+ex),Math.round(cy+ey));set(Math.round(cx-ex),Math.round(cy+ey));set(Math.round(cx+ex),Math.round(cy-ey));set(Math.round(cx-ex),Math.round(cy-ey));}
    };
    let px=0,py=ry,d1=ry*ry-rx*rx*ry+0.25*rx*rx;draw(px,py);
    while(2*ry*ry*px<2*rx*rx*py){px++;if(d1<0)d1+=2*ry*ry*px+ry*ry;else{py--;d1+=2*ry*ry*px-2*rx*rx*py+ry*ry;}draw(px,py);}
    let d2=ry*ry*(px+0.5)*(px+0.5)+rx*rx*(py-1)*(py-1)-rx*rx*ry*ry;
    while(py>=0){py--;if(d2>0)d2+=rx*rx-2*rx*rx*py;else{px++;d2+=2*ry*ry*px-2*rx*rx*py+rx*rx;}draw(px,py);}
  }

  _bresenham(x0,y0,x1,y1,ci,skipFirst=false){
    let dx=Math.abs(x1-x0),dy=Math.abs(y1-y0),sx=x0<x1?1:-1,sy=y0<y1?1:-1,err=dx-dy;
    let x=x0,y=y0,first=true;
    while(true){
      if(!first||!skipFirst)this._setPixelM(x,y,ci);
      first=false;if(x===x1&&y===y1)break;
      const e2=2*err;if(e2>-dy){err-=dy;x+=sx;}if(e2<dx){err+=dx;y+=sy;}
    }
  }
  _bresenhamSet(x0,y0,x1,y1,set){
    let dx=Math.abs(x1-x0),dy=Math.abs(y1-y0),sx=x0<x1?1:-1,sy=y0<y1?1:-1,err=dx-dy;
    let x=x0,y=y0;
    while(true){set(x,y);if(x===x1&&y===y1)break;const e2=2*err;if(e2>-dy){err-=dy;x+=sx;}if(e2<dx){err+=dx;y+=sy;}}
  }

  // ==========================================================
  //  Flood fill (with mirror)
  // ==========================================================
  _floodFill(sx,sy,ci) {
    const starts=[[sx,sy]];
    if(this.mirrorH)starts.push([this.canvasW-1-sx,sy]);
    if(this.mirrorV)starts.push([sx,this.canvasH-1-sy]);
    if(this.mirrorH&&this.mirrorV)starts.push([this.canvasW-1-sx,this.canvasH-1-sy]);
    const done=new Set();
    for(const[fx,fy]of starts){
      const key=`${fx},${fy}`;if(done.has(key))continue;done.add(key);
      const rawTarget=this._getPixel(fx,fy);
      const targetTransp=this._isTransparentPx(rawTarget);
      if(!targetTransp&&rawTarget===ci)continue;
      if(targetTransp&&this._isTransparentPx(ci))continue;
      const pix=this.pixels[this.layerIdx][this.frameIdx];
      const w=this.canvasW,h=this.canvasH;
      const stack=[[fx,fy]];
      const seen=new Uint8Array(w*h);
      while(stack.length){
        const[x,y]=stack.pop();
        if(x<0||x>=w||y<0||y>=h)continue;
        const i=y*w+x;
        if(seen[i])continue;
        if(targetTransp?!this._isTransparentPx(pix[i]):pix[i]!==rawTarget)continue;
        seen[i]=1;pix[i]=ci;
        stack.push([x+1,y],[x-1,y],[x,y+1],[x,y-1]);
      }
    }
  }

  _fillAll(x,y,ci){
    const rawTarget=this._getPixel(x,y);
    const targetTransp=this._isTransparentPx(rawTarget);
    if(!targetTransp&&rawTarget===ci)return;
    if(targetTransp&&this._isTransparentPx(ci))return;
    const data=this.pixels[this.layerIdx][this.frameIdx];
    for(let i=0;i<data.length;i++){
      if(targetTransp?this._isTransparentPx(data[i]):data[i]===rawTarget)data[i]=ci;
    }
  }

  // ==========================================================
  //  Mouse events
  // ==========================================================
  _vpPos(e){const r=this.viewport.getBoundingClientRect();return{mx:e.clientX-r.left,my:e.clientY-r.top};}
  _screenToPixel(mx,my){return{x:Math.floor((mx-this.offsetX)/this.zoom),y:Math.floor((my-this.offsetY)/this.zoom)};}

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
  }

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
  }

  _onMouseUp(e) {
    if(this.panning){this.panning=false;this.viewport.style.cursor=this.spaceDown?'grab':'crosshair';return;}
    if(this.rotDrag){this.rotDrag=null;this.drawing=false;this._render();return;}
    if(this.floatDrag){this.floatDrag=null;this.drawing=false;this._render();return;}
    if(this.drawing){
      const{mx,my}=this._vpPos(e);const{x,y}=this._screenToPixel(mx,my);
      const ci=e.button===2?this.bgIdx:this.fgIdx;
      this._endDraw(x,y,ci);this.drawing=false;this.startPx=null;this.lastPx=null;
    }
  }

  _onWheel(e){e.preventDefault();const{mx,my}=this._vpPos(e);this._zoomAt(e.deltaY<0?1:-1,mx,my);}

  // ==========================================================
  //  Keyboard
  // ==========================================================
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
  }
  _onKeyUp(e){if(e.key===' '){this.spaceDown=false;this.viewport.style.cursor='crosshair';}}

  // ==========================================================
  //  Event binding
  // ==========================================================
  _bindEvents() {
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

    document.querySelectorAll('[data-action]').forEach(b=>b.addEventListener('click',e=>{e.stopPropagation();document.querySelectorAll('.menu-item').forEach(m=>m.classList.remove('open'));this._handleAction(b.dataset.action);}));
    // Menu open/close
    document.querySelectorAll('.menu-item').forEach(mi=>{
      const btn=mi.querySelector('.menu-btn');
      btn.addEventListener('click',e=>{e.stopPropagation();const wasOpen=mi.classList.contains('open');document.querySelectorAll('.menu-item').forEach(m=>m.classList.remove('open'));if(!wasOpen)mi.classList.add('open');});
      btn.addEventListener('mouseenter',()=>{if(document.querySelector('.menu-item.open')){document.querySelectorAll('.menu-item').forEach(m=>m.classList.remove('open'));mi.classList.add('open');}});
    });
    document.addEventListener('click',()=>document.querySelectorAll('.menu-item').forEach(m=>m.classList.remove('open')));
    document.querySelectorAll('.tool-btn').forEach(b=>b.addEventListener('click',()=>this._selectTool(b.dataset.tool)));

    document.getElementById('btn-zoom-in') .addEventListener('click',()=>this._zoom(1));
    document.getElementById('btn-zoom-out').addEventListener('click',()=>this._zoom(-1));
    document.getElementById('btn-zoom-fit').addEventListener('click',()=>{this._fitZoom();this._render();});
    document.getElementById('btn-grid-toggle').addEventListener('click',()=>{
      this.showGrid=!this.showGrid;
      document.getElementById('btn-grid-toggle').classList.toggle('active',this.showGrid);
      this._render();
    });

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

    document.getElementById('btn-layer-add').addEventListener('click',()=>this._addLayer());
    document.getElementById('btn-layer-dup').addEventListener('click',()=>this._addLayer(this.layerIdx));
    document.getElementById('btn-layer-del').addEventListener('click',()=>this._deleteLayer());
    document.getElementById('btn-layer-up') .addEventListener('click',()=>this._moveLayerUp());
    document.getElementById('btn-layer-dn') .addEventListener('click',()=>this._moveLayerDown());

    document.getElementById('btn-frame-add').addEventListener('click',()=>this._addFrame());
    document.getElementById('btn-frame-dup').addEventListener('click',()=>this._addFrame(this.frameIdx));
    document.getElementById('btn-frame-del').addEventListener('click',()=>this._deleteFrame());

    document.getElementById('fps-input').addEventListener('change',e=>{this.fps=Math.max(1,Math.min(60,parseInt(e.target.value)||12));e.target.value=this.fps;});
    document.getElementById('btn-play').addEventListener('click',()=>this._toggleAnim());
    document.getElementById('btn-stop').addEventListener('click',()=>this._stopAnim());

    document.getElementById('opt-filled').addEventListener('change',e=>this.optFilled=e.target.checked);
    document.getElementById('fill-mode-toggle').addEventListener('click',()=>{
      this.fillMode=this.fillMode==='contiguous'?'all':'contiguous';
      const btn=document.getElementById('fill-mode-toggle');
      btn.dataset.i18n=this.fillMode==='contiguous'?'ui.fillContiguous':'ui.fillAll';
      btn.textContent=this._t(btn.dataset.i18n);
    });

    // Add Outline modal
    document.getElementById('outline-ok').addEventListener('click',()=>{
      this.outlineCorners=document.getElementById('outline-diag-check').checked;
      this._hideOutlineModal();
      this._addOutline();
    });
    document.getElementById('outline-cancel').addEventListener('click',()=>this._hideOutlineModal());
    document.getElementById('outline-modal-overlay').addEventListener('click',e=>{if(e.target===document.getElementById('outline-modal-overlay'))this._hideOutlineModal();});

    // Memo auto-save on input
    document.getElementById('memo-textarea').addEventListener('input',()=>this._scheduleSave());

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

    // Language and theme toggles
    document.getElementById('lang-toggle').addEventListener('click',()=>this._toggleLang());
    document.getElementById('theme-toggle').addEventListener('click',()=>this._toggleTheme());

    document.getElementById('file-input').addEventListener('change',e=>{const f=e.target.files[0];if(f)this._loadBPE(f);e.target.value='';});

    document.querySelectorAll('.modal-presets button').forEach(b=>b.addEventListener('click',()=>{document.getElementById('new-width').value=b.dataset.w;document.getElementById('new-height').value=b.dataset.h;}));
    document.getElementById('modal-ok').addEventListener('click',()=>{
      const w=Math.max(1,Math.min(512,parseInt(document.getElementById('new-width').value)||16));
      const h=Math.max(1,Math.min(512,parseInt(document.getElementById('new-height').value)||16));
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

    // Resize canvas modal
    document.querySelectorAll('.resize-anchor-btn').forEach(b=>{
      b.addEventListener('click',()=>{
        document.querySelectorAll('.resize-anchor-btn').forEach(x=>x.classList.remove('active'));
        b.classList.add('active');
        this._resizeAnchor={x:parseFloat(b.dataset.ax),y:parseFloat(b.dataset.ay)};
      });
    });
    document.getElementById('resize-ok').addEventListener('click',()=>{
      const nw=Math.max(1,Math.min(512,parseInt(document.getElementById('resize-w').value)||this.canvasW));
      const nh=Math.max(1,Math.min(512,parseInt(document.getElementById('resize-h').value)||this.canvasH));
      this._hideResizeModal();
      this._resizeCanvas(nw,nh,this._resizeAnchor.x,this._resizeAnchor.y);
    });
    document.getElementById('resize-cancel').addEventListener('click',()=>this._hideResizeModal());
    document.getElementById('resize-modal-overlay').addEventListener('click',e=>{if(e.target===document.getElementById('resize-modal-overlay'))this._hideResizeModal();});

    // New tab button
    document.getElementById('btn-new-tab').addEventListener('click',()=>this._newTab());

    // Preview zoom buttons
    document.getElementById('btn-preview-zoom-in').addEventListener('click',()=>{
      this.previewZoom=Math.min(8,parseFloat((this.previewZoom*1.5).toFixed(1)));
      this._renderPreview(this.animPlaying?this.animFrameIdx:this.frameIdx);
    });
    document.getElementById('btn-preview-zoom-out').addEventListener('click',()=>{
      this.previewZoom=Math.max(0.5,parseFloat((this.previewZoom/1.5).toFixed(1)));
      this._renderPreview(this.animPlaying?this.animFrameIdx:this.frameIdx);
    });
    document.getElementById('preview-canvas').addEventListener('wheel',e=>{
      e.preventDefault();
      const factor=e.deltaY<0?1.25:0.8;
      this.previewZoom=Math.max(0.5,Math.min(8,parseFloat((this.previewZoom*factor).toFixed(2))));
      this._renderPreview(this.animPlaying?this.animFrameIdx:this.frameIdx);
    },{passive:false});

    // Horizontal resizer (between canvas and layer panel)
    const lfHR=document.getElementById('lf-h-resizer');
    let lfHRState=null;
    lfHR.addEventListener('mousedown',e=>{
      e.preventDefault();
      const startY=e.clientY;
      const startH=document.getElementById('lf-section').offsetHeight;
      lfHRState={startY,startH};
      lfHR.classList.add('resizing');
      document.body.style.cursor='row-resize';
      const onMove=e=>{
        if(!lfHRState)return;
        const dy=lfHRState.startY-e.clientY;
        const newH=Math.max(60,Math.min(500,lfHRState.startH+dy));
        document.getElementById('lf-section').style.height=newH+'px';
      };
      const onUp=()=>{
        lfHRState=null;
        lfHR.classList.remove('resizing');
        document.body.style.cursor='';
        document.removeEventListener('mousemove',onMove);
        document.removeEventListener('mouseup',onUp);
        this._resizeCanvases();this._render();
      };
      document.addEventListener('mousemove',onMove);
      document.addEventListener('mouseup',onUp);
    });

    // Vertical resizer (between palette and animation in right panel)
    const rvR=document.getElementById('right-v-resizer');
    let rvRState=null;
    rvR.addEventListener('mousedown',e=>{
      e.preventDefault();
      const startY=e.clientY;
      const startH=document.getElementById('palette-section').offsetHeight;
      rvRState={startY,startH};
      rvR.classList.add('resizing');
      document.body.style.cursor='row-resize';
      const onMove=e=>{
        if(!rvRState)return;
        const dy=e.clientY-rvRState.startY;
        const newH=Math.max(80,Math.min(600,rvRState.startH+dy));
        document.getElementById('palette-section').style.height=newH+'px';
      };
      const onUp=()=>{
        rvRState=null;
        rvR.classList.remove('resizing');
        document.body.style.cursor='';
        document.removeEventListener('mousemove',onMove);
        document.removeEventListener('mouseup',onUp);
      };
      document.addEventListener('mousemove',onMove);
      document.addEventListener('mouseup',onUp);
    });

    // Memo resizer (between animation and memo sections in right panel)
    const memoR=document.getElementById('memo-resizer');
    let memoRState=null;
    memoR.addEventListener('mousedown',e=>{
      e.preventDefault();
      const startY=e.clientY;
      const ta=document.getElementById('memo-textarea');
      const startH=ta.offsetHeight;
      memoRState={startY,startH};
      memoR.classList.add('resizing');
      document.body.style.cursor='row-resize';
      const onMove=e=>{
        if(!memoRState)return;
        const dy=memoRState.startY-e.clientY;
        const newH=Math.max(40,Math.min(400,memoRState.startH+dy));
        ta.style.height=newH+'px';
      };
      const onUp=()=>{
        memoRState=null;
        memoR.classList.remove('resizing');
        document.body.style.cursor='';
        document.removeEventListener('mousemove',onMove);
        document.removeEventListener('mouseup',onUp);
      };
      document.addEventListener('mousemove',onMove);
      document.addEventListener('mouseup',onUp);
    });

    // Right panel resize
    const rr=document.getElementById('right-resizer');
    let rrState=null;
    rr.addEventListener('mousedown',e=>{
      e.preventDefault();
      const startX=e.clientX;
      const startW=document.getElementById('right-panel').offsetWidth;
      rrState={startX,startW};
      rr.classList.add('resizing');
      document.body.style.cursor='col-resize';
      const onMove=e=>{
        if(!rrState)return;
        const dx=rrState.startX-e.clientX;
        const newW=Math.max(180,Math.min(520,rrState.startW+dx));
        document.documentElement.style.setProperty('--right-w',newW+'px');
      };
      const onUp=()=>{
        rrState=null;
        rr.classList.remove('resizing');
        document.body.style.cursor='';
        document.removeEventListener('mousemove',onMove);
        document.removeEventListener('mouseup',onUp);
        this._resizeCanvases();
        this._render();
      };
      document.addEventListener('mousemove',onMove);
      document.addEventListener('mouseup',onUp);
    });
  }

  // ==========================================================
  //  Actions
  // ==========================================================
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
  }

  _selectTool(name) {
    if(this.tool!==name)this._deselect();
    this.tool=name;
    document.querySelectorAll('.tool-btn').forEach(b=>b.classList.toggle('active',b.dataset.tool===name));
    document.getElementById('opt-filled-label').style.display=['rect','ellipse'].includes(name)?'flex':'none';
    document.getElementById('fill-mode-wrap').style.display=name==='fill'?'':'none';
    this._updateStatus(null,null);
  }

  // ==========================================================
  //  Marching ants
  // ==========================================================
  _startMarchingAnts(){
    cancelAnimationFrame(this._marchAnimId);
    const step=()=>{
      if(!this.selection&&!this.floatBuf){this._marchAnimId=null;return;}
      this._marchOffset=(this._marchOffset+0.4)%8;
      this._renderOverlay(-1,-1);
      this._marchAnimId=requestAnimationFrame(step);
    };
    this._marchAnimId=requestAnimationFrame(step);
  }
  _stopMarchingAnts(){cancelAnimationFrame(this._marchAnimId);this._marchAnimId=null;}

  // ==========================================================
  //  Zoom
  // ==========================================================
  _resizeCanvases(){
    const w=this.viewport.clientWidth||600,h=this.viewport.clientHeight||400;
    this.mainCanvas.width=w;this.mainCanvas.height=h;
    this.overlayCanvas.width=w;this.overlayCanvas.height=h;
  }
  _fitZoom(){
    const vw=this.viewport.clientWidth||600,vh=this.viewport.clientHeight||400,m=40;
    const z=Math.max(1,Math.min(64,Math.min(Math.floor((vw-m)/this.canvasW),Math.floor((vh-m)/this.canvasH))));
    this.zoom=z;this.offsetX=Math.round((vw-this.canvasW*z)/2);this.offsetY=Math.round((vh-this.canvasH*z)/2);
    document.getElementById('zoom-display').textContent=`${z}x`;
    document.getElementById('st-zoom').textContent=`${z}x`;
  }
  _zoom(dir){this._zoomAt(dir,this.viewport.clientWidth/2,this.viewport.clientHeight/2);}
  _zoomAt(dir,mx,my){
    const L=[1,2,3,4,6,8,10,12,16,20,24,32,48,64];
    let cur=L.indexOf(this.zoom);if(cur<0)cur=L.findIndex(z=>z>=this.zoom);
    const next=Math.max(0,Math.min(L.length-1,cur+dir)),nz=L[next];
    if(nz===this.zoom)return;
    const ratio=nz/this.zoom;
    this.offsetX=Math.round(mx-(mx-this.offsetX)*ratio);this.offsetY=Math.round(my-(my-this.offsetY)*ratio);
    this.zoom=nz;document.getElementById('zoom-display').textContent=`${nz}x`;document.getElementById('st-zoom').textContent=`${nz}x`;
    this._render();
  }

  // ==========================================================
  //  Render — Main canvas
  // ==========================================================
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
  }

  // ==========================================================
  //  Render — Overlay
  // ==========================================================
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
      const sx=ox+hx*z,sy=oy+hy*z;
      ctx.strokeStyle='rgba(255,255,255,0.65)';ctx.lineWidth=1.5;ctx.setLineDash([]);
      ctx.strokeRect(sx+0.5,sy+0.5,z-1,z-1);
    }
  }

  // ==========================================================
  //  Thumbnail cache
  // ==========================================================
  _updateThumb(li,fi) {
    const tc=this._thumbCanvas.get(`${li}_${fi}`);
    if(tc)this._renderLayerToThumb(tc.getContext('2d'),this.pixels[li][fi],tc.width,tc.height);
  }

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
  }

  _renderPreview(fi) {
    const pc=this.previewCanvas;
    const baseS=Math.max(20,Math.round(60*this.previewZoom));
    const scale=Math.min(baseS/this.canvasW,baseS/this.canvasH);
    pc.width=Math.round(this.canvasW*scale);pc.height=Math.round(this.canvasH*scale);
    this._renderLayerToThumb(this.previewCtx,this._compositFrame(fi),pc.width,pc.height);
    const zd=document.getElementById('preview-zoom-display');
    if(zd)zd.textContent=`${this.previewZoom.toFixed(1)}x`;
  }

  // ==========================================================
  //  Render — Layer/Frame table
  // ==========================================================
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
  }

  // ==========================================================
  //  Layer name editing
  // ==========================================================
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
  }

  // ==========================================================
  //  Update layer active visuals without full table rebuild
  // ==========================================================
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
  }

  // ==========================================================
  //  Palette
  // ==========================================================
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
  }

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
  }

  _applyFgHex6(hex6) {
    if(this.fgIdx<0||this.fgIdx>=this.palette.length){this.palette.push(hex6+'ff');this.fgIdx=this.palette.length-1;}
    else{const a=this.palette[this.fgIdx].slice(7,9)||'ff';this.palette[this.fgIdx]=hex6+a;}
    this._syncColorUI();this._renderPalette();
  }
  _applyBgHex6(hex6) {
    if(this.bgIdx<0||this.bgIdx>=this.palette.length){this.palette.push(hex6+'ff');this.bgIdx=this.palette.length-1;}
    else{const a=this.palette[this.bgIdx].slice(7,9)||'ff';this.palette[this.bgIdx]=hex6+a;}
    this._syncColorUI();this._renderPalette();
  }

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
  }

  // ==========================================================
  //  Animation
  // ==========================================================
  _toggleAnim(){this.animPlaying?this._stopAnim():this._startAnim();}
  _startAnim(){
    if(this.frameCount<=1)return;
    this.animPlaying=true;this.animFrameIdx=this.frameIdx;
    document.getElementById('btn-play').classList.add('playing');
    document.getElementById('btn-play').textContent='⏸';
    const step=()=>{if(!this.animPlaying)return;this.animFrameIdx=(this.animFrameIdx+1)%this.frameCount;this._renderPreview(this.animFrameIdx);this.animTimer=setTimeout(step,1000/this.fps);};
    this._renderPreview(this.animFrameIdx);this.animTimer=setTimeout(step,1000/this.fps);
  }
  _stopAnim(){
    this.animPlaying=false;clearTimeout(this.animTimer);
    document.getElementById('btn-play').classList.remove('playing');document.getElementById('btn-play').textContent='▶';
    this._renderPreview(this.frameIdx);
  }

  // ==========================================================
  //  Modal (New Project)
  // ==========================================================
  _showModal(){document.getElementById('modal-overlay').classList.remove('hidden');}
  _hideModal(){document.getElementById('modal-overlay').classList.add('hidden');}

  // ==========================================================
  //  Save As dialog
  // ==========================================================
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
  }

  _showSaveModal(blob, defaultName) {
    this._pendingSaveBlob=blob;
    const parts=defaultName.split('.');
    const ext=parts.length>1?'.'+parts.pop():'';
    const name=parts.join('.');
    document.getElementById('save-fname-input').value=name;
    document.getElementById('save-ext-display').textContent=ext;
    document.getElementById('save-modal-overlay').classList.remove('hidden');
    setTimeout(()=>document.getElementById('save-fname-input').select(),50);
  }

  _hideSaveModal() {
    document.getElementById('save-modal-overlay').classList.add('hidden');
    this._pendingSaveBlob=null;
  }

  // ==========================================================
  //  Export — PNG
  // ==========================================================
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
  }

  // ==========================================================
  //  Export — GIF
  // ==========================================================
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
  }

  // ==========================================================
  //  Save / Load BPE
  // ==========================================================
  _saveBPE() {
    const data={bpe:'2.0',name:'untitled',width:this.canvasW,height:this.canvasH,fps:this.fps,palette:this.palette,frameCount:this.frameCount,
      memo:document.getElementById('memo-textarea').value,
      layers:this.layers.map((layer,li)=>({name:layer.name,visible:layer.visible,frames:this.pixels[li].map(f=>Array.from(f))}))};
    const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'});
    this._pendingSaveBPE=true;
    this._saveWithDialog(blob,'pixel-art.bpe');
  }
  _loadBPE(file){const r=new FileReader();r.onload=e=>{try{this._importBPE(JSON.parse(e.target.result),file.name.replace(/\.bpe$/i,''));}catch(err){alert('Load error: '+err.message);}};r.readAsText(file);}
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
  }
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
  }

  // ==========================================================
  //  Export dialog
  // ==========================================================
  _openExportDialog(type){
    this._pendingExport=type;
    document.getElementById('export-modal-overlay').classList.remove('hidden');
  }
  _hideExportModal(){
    document.getElementById('export-modal-overlay').classList.add('hidden');
    this._pendingExport=null;
  }
  _confirmExport(){
    const scale=parseInt(document.getElementById('export-scale-select').value)||1;
    const type=this._pendingExport;
    this._hideExportModal();
    if(type==='png')this._exportPNG(scale);
    else if(type==='gif')this._exportGIF(scale);
    else if(type==='spritesheet')this._exportSpriteSheet(scale);
  }

  // ==========================================================
  //  Export — Sprite Sheet
  // ==========================================================
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
  }

  // ==========================================================
  //  Tab management
  // ==========================================================
  _serializeTab(){
    return{
      canvasW:this.canvasW,canvasH:this.canvasH,frameCount:this.frameCount,
      layerIdx:this.layerIdx,frameIdx:this.frameIdx,
      layers:this.layers.map(l=>({...l})),
      pixels:this.pixels.map(lp=>lp.map(fp=>Array.from(fp))),
      palette:this.palette.slice(),fgIdx:this.fgIdx,bgIdx:this.bgIdx,
      zoom:this.zoom,offsetX:this.offsetX,offsetY:this.offsetY,
      fps:this.fps,showGrid:this.showGrid,
      undoStack:this.undoStack.map(e=>e.type==='structure'?{type:'structure',layers:e.layers.map(l=>({...l})),pixels:e.pixels.map(lp=>lp.map(fp=>Array.from(fp))),frameCount:e.frameCount,layerIdx:e.layerIdx,frameIdx:e.frameIdx}:{type:'pixels',li:e.li,fi:e.fi,data:Array.from(e.data)}),
      redoStack:this.redoStack.map(e=>e.type==='structure'?{type:'structure',layers:e.layers.map(l=>({...l})),pixels:e.pixels.map(lp=>lp.map(fp=>Array.from(fp))),frameCount:e.frameCount,layerIdx:e.layerIdx,frameIdx:e.frameIdx}:{type:'pixels',li:e.li,fi:e.fi,data:Array.from(e.data)}),
      memo:document.getElementById('memo-textarea').value,
    };
  }
  _restoreTab(state){
    this.canvasW=state.canvasW||16;this.canvasH=state.canvasH||16;
    this.frameCount=state.frameCount||1;
    this.layerIdx=state.layerIdx||0;this.frameIdx=state.frameIdx||0;
    this.layers=state.layers.map(l=>({...l}));
    this.pixels=state.pixels.map(lp=>lp.map(fp=>{const a=new Int16Array(fp.length);for(let i=0;i<fp.length;i++)a[i]=fp[i];return a;}));
    this.palette=state.palette.slice();
    this.fgIdx=state.fgIdx||1;this.bgIdx=state.bgIdx||0;
    this.zoom=state.zoom||8;this.offsetX=state.offsetX||0;this.offsetY=state.offsetY||0;
    this.fps=state.fps||12;this.showGrid=state.showGrid!==false;
    this.undoStack=(state.undoStack||[]).map(e=>e.type==='structure'?{type:'structure',layers:e.layers.map(l=>({...l})),pixels:e.pixels.map(lp=>lp.map(fp=>new Int16Array(fp))),frameCount:e.frameCount,layerIdx:e.layerIdx,frameIdx:e.frameIdx}:{type:'pixels',li:e.li,fi:e.fi,data:new Int16Array(e.data)});
    this.redoStack=(state.redoStack||[]).map(e=>e.type==='structure'?{type:'structure',layers:e.layers.map(l=>({...l})),pixels:e.pixels.map(lp=>lp.map(fp=>new Int16Array(fp))),frameCount:e.frameCount,layerIdx:e.layerIdx,frameIdx:e.frameIdx}:{type:'pixels',li:e.li,fi:e.fi,data:new Int16Array(e.data)});
    this.drawing=false;this.panning=false;
    this.selection=null;this.floatBuf=null;this.floatDrag=null;this.rotDrag=null;
    this._thumbCanvas.clear();this._stopAnim();
    document.getElementById('memo-textarea').value=state.memo||'';
    document.getElementById('canvas-size-display').textContent=`${this.canvasW} × ${this.canvasH}`;
    document.getElementById('fps-input').value=this.fps;
    document.getElementById('btn-grid-toggle').classList.toggle('active',this.showGrid);
    this._resizeCanvases();this._render();this._renderLFTable();this._renderPalette();
    this._syncColorUI();this._updateStatus(null,null);this._applyI18n();
  }
  _serializeBlank(){
    return{
      canvasW:16,canvasH:16,frameCount:1,layerIdx:0,frameIdx:0,
      layers:[{name:this._t('lyr.default')+' 1',visible:true}],
      pixels:[[Array.from(new Int16Array(256).fill(-1))]],
      palette:DEFAULT_PALETTE.slice(),fgIdx:1,bgIdx:0,
      zoom:8,offsetX:0,offsetY:0,fps:12,showGrid:true,undoStack:[],redoStack:[],memo:'',
    };
  }
  _newTab(state=null,label='Untitled'){
    const cur=this.tabs.find(t=>t.id===this.activeTabId);
    if(cur)cur.state=this._serializeTab();
    const id=this._nextTabId++;
    const isBlank=!state;
    const s=state||this._serializeBlank();
    this.tabs.push({id,label,state:s});
    this.activeTabId=id;
    this._restoreTab(s);
    if(isBlank){this._fitZoom();this._render();}
    this._renderTabBar();
  }
  _switchTab(id){
    if(id===this.activeTabId)return;
    const cur=this.tabs.find(t=>t.id===this.activeTabId);
    if(cur)cur.state=this._serializeTab();
    this.activeTabId=id;
    const tab=this.tabs.find(t=>t.id===id);
    if(tab)this._restoreTab(tab.state);
    this._renderTabBar();
  }
  _closeTab(id){
    if(this.tabs.length<=1){
      // Last tab: reset to blank
      this._newProject(16,16,true);this._afterStructureChange();
      this.tabs[0].label='Untitled';this.tabs[0].state=this._serializeTab();
      this._renderTabBar();return;
    }
    const idx=this.tabs.findIndex(t=>t.id===id);
    this.tabs.splice(idx,1);
    if(this.activeTabId===id){
      const newTab=this.tabs[Math.min(idx,this.tabs.length-1)];
      this.activeTabId=newTab.id;
      this._restoreTab(newTab.state);
    }
    this._renderTabBar();
  }
  _renderTabBar(){
    const bar=document.getElementById('tab-bar');
    bar.querySelectorAll('.editor-tab').forEach(e=>e.remove());
    const newBtn=document.getElementById('btn-new-tab');
    for(const tab of this.tabs){
      const el=document.createElement('div');
      el.className='editor-tab'+(tab.id===this.activeTabId?' active':'');
      const label=document.createElement('span');label.className='tab-label';label.textContent=tab.label;
      const close=document.createElement('button');close.className='tab-close';close.textContent='×';
      close.title='Close';
      close.addEventListener('click',e=>{e.stopPropagation();this._closeTab(tab.id);});
      el.appendChild(label);el.appendChild(close);
      el.addEventListener('click',()=>this._switchTab(tab.id));
      // Drag reorder
      el.draggable=true;
      el.addEventListener('dragstart',e=>{this._tabDragSrcId=tab.id;el.classList.add('tab-dragging');e.dataTransfer.effectAllowed='move';e.stopPropagation();});
      el.addEventListener('dragend',()=>{el.classList.remove('tab-dragging');this._renderTabBar();});
      el.addEventListener('dragover',e=>{e.preventDefault();el.classList.add('tab-drag-over');});
      el.addEventListener('dragleave',()=>el.classList.remove('tab-drag-over'));
      el.addEventListener('drop',e=>{e.preventDefault();el.classList.remove('tab-drag-over');this._reorderTab(this._tabDragSrcId,tab.id);});
      bar.insertBefore(el,newBtn);
    }
    // Scroll active tab into view
    const active=bar.querySelector('.editor-tab.active');
    if(active)active.scrollIntoView({block:'nearest',inline:'nearest'});
  }

  // ==========================================================
  //  Rotation
  // ==========================================================
  _rotatePixels(src,w,h,angle){
    const cx=w/2,cy=h/2;
    const cos=Math.cos(-angle),sin=Math.sin(-angle);
    const dst=new Int16Array(w*h).fill(-1);
    for(let y=0;y<h;y++)for(let x=0;x<w;x++){
      const dx=x-cx,dy=y-cy;
      const sx=Math.round(cos*dx-sin*dy+cx);
      const sy=Math.round(sin*dx+cos*dy+cy);
      if(sx>=0&&sx<w&&sy>=0&&sy<h)dst[y*w+x]=src[sy*w+sx];
    }
    return dst;
  }

  // ==========================================================
  //  Tab reorder
  // ==========================================================
  _reorderTab(srcId,dstId){
    if(srcId===dstId)return;
    const si=this.tabs.findIndex(t=>t.id===srcId);
    const di=this.tabs.findIndex(t=>t.id===dstId);
    if(si<0||di<0)return;
    const[tab]=this.tabs.splice(si,1);
    this.tabs.splice(di,0,tab);
    this._renderTabBar();
  }

  // ==========================================================
  //  Canvas rotate / flip (current layer + frame)
  // ==========================================================
  _rotateCurrentCW90(){
    this._saveUndo();
    const{canvasW:w,canvasH:h}=this;
    const src=this.pixels[this.layerIdx][this.frameIdx];
    const dst=new Int16Array(w*h).fill(-1);
    const offX=Math.floor((w-h)/2),offY=Math.floor((h-w)/2);
    for(let y=0;y<h;y++)for(let x=0;x<w;x++){
      const rx=h-1-y,ry=x;
      const ox2=rx+offX,oy2=ry+offY;
      if(ox2>=0&&ox2<w&&oy2>=0&&oy2<h)dst[oy2*w+ox2]=src[y*w+x];
    }
    this.pixels[this.layerIdx][this.frameIdx]=dst;
    this._thumbCanvas.clear();this._render();this._renderLFTable();
  }
  _rotateCurrentCCW90(){
    this._saveUndo();
    const{canvasW:w,canvasH:h}=this;
    const src=this.pixels[this.layerIdx][this.frameIdx];
    const dst=new Int16Array(w*h).fill(-1);
    const offX=Math.floor((w-h)/2),offY=Math.floor((h-w)/2);
    for(let y=0;y<h;y++)for(let x=0;x<w;x++){
      const rx=y,ry=w-1-x;
      const ox2=rx+offX,oy2=ry+offY;
      if(ox2>=0&&ox2<w&&oy2>=0&&oy2<h)dst[oy2*w+ox2]=src[y*w+x];
    }
    this.pixels[this.layerIdx][this.frameIdx]=dst;
    this._thumbCanvas.clear();this._render();this._renderLFTable();
  }
  _rotateCurrentBase180(){
    this._saveUndo();
    const data=this.pixels[this.layerIdx][this.frameIdx];
    const len=data.length;
    for(let i=0;i<Math.floor(len/2);i++){const tmp=data[i];data[i]=data[len-1-i];data[len-1-i]=tmp;}
    this._thumbCanvas.clear();this._render();this._renderLFTable();
  }
  _flipCurrentH(){
    this._saveUndo();
    const{canvasW:w,canvasH:h,layerIdx:li,frameIdx:fi}=this;
    const data=this.pixels[li][fi];
    for(let y=0;y<h;y++)for(let x=0;x<Math.floor(w/2);x++){
      const a=y*w+x,b=y*w+(w-1-x);const tmp=data[a];data[a]=data[b];data[b]=tmp;
    }
    this._thumbCanvas.clear();this._render();this._renderLFTable();
  }
  _flipCurrentV(){
    this._saveUndo();
    const{canvasW:w,canvasH:h,layerIdx:li,frameIdx:fi}=this;
    const data=this.pixels[li][fi];
    for(let y=0;y<Math.floor(h/2);y++)for(let x=0;x<w;x++){
      const a=y*w+x,b=(h-1-y)*w+x;const tmp=data[a];data[a]=data[b];data[b]=tmp;
    }
    this._thumbCanvas.clear();this._render();this._renderLFTable();
  }

  // ==========================================================
  //  Add Outline
  // ==========================================================
  _addOutline(){
    this._saveUndo();
    const w=this.canvasW,h=this.canvasH;
    const data=this.pixels[this.layerIdx][this.frameIdx];
    const orig=new Int16Array(data);
    const x1=this.selection?this.selection.x1:0,y1=this.selection?this.selection.y1:0;
    const x2=this.selection?this.selection.x2:w-1,y2=this.selection?this.selection.y2:h-1;
    for(let y=y1;y<=y2;y++)for(let x=x1;x<=x2;x++){
      if(!this._isTransparentPx(orig[y*w+x]))continue;
      const dirs=this.outlineCorners?[[-1,0],[1,0],[0,-1],[0,1],[-1,-1],[1,-1],[-1,1],[1,1]]:[[-1,0],[1,0],[0,-1],[0,1]];
      for(const[dx,dy]of dirs){
        const nx=x+dx,ny=y+dy;
        if(nx>=0&&nx<w&&ny>=0&&ny<h&&!this._isTransparentPx(orig[ny*w+nx])){data[y*w+x]=this.fgIdx;break;}
      }
    }
    this._thumbCanvas.clear();this._render();this._renderLFTable();
  }

  // ==========================================================
  //  Anti-alias
  // ==========================================================
  _addAntiAlias(){
    this._saveUndo();
    const w=this.canvasW,h=this.canvasH;
    const data=this.pixels[this.layerIdx][this.frameIdx];
    const orig=new Int16Array(data);
    const x1=this.selection?this.selection.x1:0,y1=this.selection?this.selection.y1:0;
    const x2=this.selection?this.selection.x2:w-1,y2=this.selection?this.selection.y2:h-1;
    const dirs=[[-1,0],[1,0],[0,-1],[0,1]];
    for(let y=y1;y<=y2;y++)for(let x=x1;x<=x2;x++){
      if(!this._isTransparentPx(orig[y*w+x]))continue;
      const nbrs=[];
      for(const[dx,dy]of dirs){
        const nx=x+dx,ny=y+dy;
        if(nx>=0&&nx<w&&ny>=0&&ny<h&&!this._isTransparentPx(orig[ny*w+nx]))nbrs.push({dx,dy,ci:orig[ny*w+nx]});
      }
      let placed=false;
      for(let i=0;i<nbrs.length&&!placed;i++)for(let j=i+1;j<nbrs.length&&!placed;j++){
        const a=nbrs[i],b=nbrs[j];
        if(a.dx+b.dx===0&&a.dy+b.dy===0)continue;
        if(a.ci!==b.ci)continue;
        const c=parseHex(this.palette[a.ci]);
        const hex=toHex8(c.r,c.g,c.b,Math.round(c.a*0.5));
        let idx=this.palette.indexOf(hex);
        if(idx<0){this.palette.push(hex);idx=this.palette.length-1;}
        data[y*w+x]=idx;placed=true;
      }
    }
    this._thumbCanvas.clear();this._renderPalette();this._render();this._renderLFTable();
  }

  // ==========================================================
  //  Subtract rect (rectangular selection difference)
  // ==========================================================
  _subtractRect(sel,sub){
    const ix1=Math.max(sel.x1,sub.x1),iy1=Math.max(sel.y1,sub.y1);
    const ix2=Math.min(sel.x2,sub.x2),iy2=Math.min(sel.y2,sub.y2);
    if(ix1>ix2||iy1>iy2)return sel; // no overlap
    if(sub.x1<=sel.x1&&sub.x2>=sel.x2&&sub.y1<=sel.y1&&sub.y2>=sel.y2)return null; // full removal
    if(sub.x1<=sel.x1&&sub.x2>=sel.x2){
      if(sub.y1<=sel.y1)return{...sel,y1:iy2+1};
      if(sub.y2>=sel.y2)return{...sel,y2:iy1-1};
    }
    if(sub.y1<=sel.y1&&sub.y2>=sel.y2){
      if(sub.x1<=sel.x1)return{...sel,x1:ix2+1};
      if(sub.x2>=sel.x2)return{...sel,x2:ix1-1};
    }
    return null; // complex shape: clear selection
  }

  // ==========================================================
  //  Canvas resize
  // ==========================================================
  _showOutlineModal(){
    document.getElementById('outline-diag-check').checked=this.outlineCorners;
    document.getElementById('outline-modal-overlay').classList.remove('hidden');
  }
  _hideOutlineModal(){
    document.getElementById('outline-modal-overlay').classList.add('hidden');
  }

  _showResizeModal(){
    document.getElementById('resize-w').value=this.canvasW;
    document.getElementById('resize-h').value=this.canvasH;
    document.getElementById('resize-modal-overlay').classList.remove('hidden');
  }
  _hideResizeModal(){
    document.getElementById('resize-modal-overlay').classList.add('hidden');
  }
  _resizeCanvas(newW,newH,anchorX,anchorY){
    this.undoStack=[];this.redoStack=[];
    const offX=Math.round(anchorX*(newW-this.canvasW));
    const offY=Math.round(anchorY*(newH-this.canvasH));
    for(let li=0;li<this.layers.length;li++)for(let fi=0;fi<this.frameCount;fi++){
      const src=this.pixels[li][fi];
      const dst=new Int16Array(newW*newH).fill(-1);
      for(let y=0;y<this.canvasH;y++)for(let x=0;x<this.canvasW;x++){
        const nx=x+offX,ny=y+offY;
        if(nx>=0&&nx<newW&&ny>=0&&ny<newH)dst[ny*newW+nx]=src[y*this.canvasW+x];
      }
      this.pixels[li][fi]=dst;
    }
    this.canvasW=newW;this.canvasH=newH;
    this.selection=null;this.floatBuf=null;
    this._thumbCanvas.clear();
    this._afterStructureChange();
  }

  // ==========================================================
  //  Palette RGBA cache
  // ==========================================================
  _buildPaletteCache(){
    this._paletteRGBA=this.palette.map(c=>parseHex(c));
  }

  // ==========================================================
  //  localStorage auto-save / restore
  // ==========================================================
  _scheduleSave(){
    clearTimeout(this._saveTimer);
    this._saveTimer=setTimeout(()=>this._saveToLocalStorage(),2000);
  }
  _saveToLocalStorage(){
    const cur=this.tabs.find(t=>t.id===this.activeTabId);
    if(cur)cur.state=this._serializeTab();
    const data={tabs:this.tabs,activeTabId:this.activeTabId,nextTabId:this._nextTabId,version:'2.0'};
    try{localStorage.setItem('bpe_save',JSON.stringify(data));}catch(e){}
  }
  _loadFromLocalStorage(){
    try{
      const raw=localStorage.getItem('bpe_save');
      if(!raw)return false;
      const data=JSON.parse(raw);
      if(!data.tabs||!data.tabs.length)return false;
      this.tabs=data.tabs;
      this.activeTabId=data.activeTabId;
      this._nextTabId=data.nextTabId||data.tabs.length+1;
      const active=this.tabs.find(t=>t.id===this.activeTabId)||this.tabs[0];
      this.activeTabId=active.id;
      this._restoreTab(active.state);
      this._fitZoom();this._render();
      this._renderTabBar();
      return true;
    }catch(e){return false;}
  }

  _download(blob,filename){
    const url=URL.createObjectURL(blob);const a=document.createElement('a');
    a.href=url;a.download=filename;document.body.appendChild(a);a.click();
    document.body.removeChild(a);setTimeout(()=>URL.revokeObjectURL(url),5000);
  }
}

// ============================================================
//  Bootstrap
// ============================================================
window.addEventListener('DOMContentLoaded',()=>{ window.editor=new BaconPixelEditor(); });
