// Bacon Pixel Editor — Layers/Frames Mixin
import { DEFAULT_PALETTE } from '../color-utils.js';

export default {
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
  },

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
  },

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
  },

  _deleteLayer() {
    if(this.layers.length<=1)return;
    this._saveStructureUndo();
    this.layers.splice(this.layerIdx,1);
    this.pixels.splice(this.layerIdx,1);
    this.layerIdx=Math.min(this.layerIdx,this.layers.length-1);
    this._thumbCanvas.clear();
    this._render(); this._renderLFTable();
  },

  _moveLayerUp() {
    const li=this.layerIdx;
    if(li>=this.layers.length-1)return;
    [this.layers[li],this.layers[li+1]]=[this.layers[li+1],this.layers[li]];
    [this.pixels[li],this.pixels[li+1]]=[this.pixels[li+1],this.pixels[li]];
    this.layerIdx=li+1;
    this._thumbCanvas.clear();
    this._render(); this._renderLFTable();
  },

  _moveLayerDown() {
    const li=this.layerIdx;
    if(li<=0)return;
    [this.layers[li-1],this.layers[li]]=[this.layers[li],this.layers[li-1]];
    [this.pixels[li-1],this.pixels[li]]=[this.pixels[li],this.pixels[li-1]];
    this.layerIdx=li-1;
    this._thumbCanvas.clear();
    this._render(); this._renderLFTable();
  },

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
  },

  _addFrame(copyIdx=-1) {
    this._saveStructureUndo();
    for(let li=0;li<this.layers.length;li++)
      this.pixels[li].push(copyIdx>=0?this.pixels[li][copyIdx].slice():this._newPixels());
    this.frameCount++;
    this.frameIdx=this.frameCount-1;
    this._thumbCanvas.clear();
    this._render(); this._renderLFTable();
  },

  _deleteFrame() {
    if(this.frameCount<=1)return;
    this._saveStructureUndo();
    for(let li=0;li<this.layers.length;li++)this.pixels[li].splice(this.frameIdx,1);
    this.frameCount--;
    this.frameIdx=Math.min(this.frameIdx,this.frameCount-1);
    this._thumbCanvas.clear();
    this._render(); this._renderLFTable();
  },

  _selectCell(li,fi) {
    this.layerIdx=li; this.frameIdx=fi;
    this.selection=null; this.floatBuf=null;
    this._render(); this._updateLayerActiveVisuals(); this._updateStatus(null,null);
  },
};
