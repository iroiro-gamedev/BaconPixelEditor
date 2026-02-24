// Bacon Pixel Editor — Tabs Mixin
import { DEFAULT_PALETTE } from '../color-utils.js';

export default {
  _serializeTab(){
    return{
      canvasW:this.canvasW,canvasH:this.canvasH,frameCount:this.frameCount,
      layerIdx:this.layerIdx,frameIdx:this.frameIdx,
      layers:this.layers.map(l=>({...l})),
      pixels:this.pixels.map(lp=>lp.map(fp=>Array.from(fp))),
      palette:this.palette.slice(),fgIdx:this.fgIdx,bgIdx:this.bgIdx,
      zoom:this.zoom,offsetX:this.offsetX,offsetY:this.offsetY,
      fps:this.fps,showGrid:this.showGrid,brushSize:this.brushSize||1,
      undoStack:this.undoStack.map(e=>e.type==='structure'?{type:'structure',layers:e.layers.map(l=>({...l})),pixels:e.pixels.map(lp=>lp.map(fp=>Array.from(fp))),frameCount:e.frameCount,layerIdx:e.layerIdx,frameIdx:e.frameIdx}:{type:'pixels',li:e.li,fi:e.fi,data:Array.from(e.data)}),
      redoStack:this.redoStack.map(e=>e.type==='structure'?{type:'structure',layers:e.layers.map(l=>({...l})),pixels:e.pixels.map(lp=>lp.map(fp=>Array.from(fp))),frameCount:e.frameCount,layerIdx:e.layerIdx,frameIdx:e.frameIdx}:{type:'pixels',li:e.li,fi:e.fi,data:Array.from(e.data)}),
      memo:document.getElementById('memo-textarea').value,
    };
  },
  _serializeBlank(){
    return{
      canvasW:16,canvasH:16,frameCount:1,layerIdx:0,frameIdx:0,
      layers:[{name:this._t('lyr.default')+' 1',visible:true}],
      pixels:[[Array.from(new Int16Array(256).fill(-1))]],
      palette:DEFAULT_PALETTE.slice(),fgIdx:1,bgIdx:0,
      zoom:8,offsetX:0,offsetY:0,fps:12,showGrid:true,brushSize:1,undoStack:[],redoStack:[],memo:'',
    };
  },
  _restoreTab(state){
    this.canvasW=state.canvasW||16;this.canvasH=state.canvasH||16;
    this.frameCount=state.frameCount||1;
    this.layerIdx=state.layerIdx||0;this.frameIdx=state.frameIdx||0;
    this.layers=state.layers.map(l=>({...l}));
    this.pixels=state.pixels.map(lp=>lp.map(fp=>{const a=new Int16Array(fp.length);for(let i=0;i<fp.length;i++)a[i]=fp[i];return a;}));
    this.palette=state.palette.slice();
    this.fgIdx=state.fgIdx||1;this.bgIdx=state.bgIdx||0;
    this.zoom=state.zoom||8;this.offsetX=state.offsetX||0;this.offsetY=state.offsetY||0;
    this.fps=state.fps||12;this.showGrid=state.showGrid!==false;this.brushSize=state.brushSize||1;
    this.undoStack=(state.undoStack||[]).map(e=>e.type==='structure'?{type:'structure',layers:e.layers.map(l=>({...l})),pixels:e.pixels.map(lp=>lp.map(fp=>new Int16Array(fp))),frameCount:e.frameCount,layerIdx:e.layerIdx,frameIdx:e.frameIdx}:{type:'pixels',li:e.li,fi:e.fi,data:new Int16Array(e.data)});
    this.redoStack=(state.redoStack||[]).map(e=>e.type==='structure'?{type:'structure',layers:e.layers.map(l=>({...l})),pixels:e.pixels.map(lp=>lp.map(fp=>new Int16Array(fp))),frameCount:e.frameCount,layerIdx:e.layerIdx,frameIdx:e.frameIdx}:{type:'pixels',li:e.li,fi:e.fi,data:new Int16Array(e.data)});
    this.drawing=false;this.panning=false;
    this.selection=null;this.floatBuf=null;this.floatDrag=null;this.rotDrag=null;
    this._thumbCanvas.clear();this._stopAnim();
    document.getElementById('memo-textarea').value=state.memo||'';
    document.getElementById('brush-size-display').textContent=this.brushSize;
    document.getElementById('canvas-size-display').textContent=`${this.canvasW} × ${this.canvasH}`;
    document.getElementById('fps-input').value=this.fps;
    document.getElementById('btn-grid-toggle').classList.toggle('active',this.showGrid);
    this._resizeCanvases();this._render();this._renderLFTable();this._renderPalette();
    this._syncColorUI();this._updateStatus(null,null);this._applyI18n();
  },
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
  },
  _switchTab(id){
    if(id===this.activeTabId)return;
    const cur=this.tabs.find(t=>t.id===this.activeTabId);
    if(cur)cur.state=this._serializeTab();
    this.activeTabId=id;
    const tab=this.tabs.find(t=>t.id===id);
    if(tab)this._restoreTab(tab.state);
    this._renderTabBar();
  },
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
  },
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
  },
  _reorderTab(srcId,dstId){
    if(srcId===dstId)return;
    const si=this.tabs.findIndex(t=>t.id===srcId);
    const di=this.tabs.findIndex(t=>t.id===dstId);
    if(si<0||di<0)return;
    const[tab]=this.tabs.splice(si,1);
    this.tabs.splice(di,0,tab);
    this._renderTabBar();
  },
};
