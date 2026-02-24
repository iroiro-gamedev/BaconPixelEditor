// Bacon Pixel Editor — Undo/Redo Mixin
export default {
  _saveUndo() {
    this.undoStack.push({type:'pixels',li:this.layerIdx,fi:this.frameIdx,data:this.pixels[this.layerIdx][this.frameIdx].slice()});
    if(this.undoStack.length>this.maxUndo)this.undoStack.shift();
    this.redoStack=[];
  },
  _saveStructureUndo() {
    this.undoStack.push({type:'structure',
      layers:this.layers.map(l=>({...l})),
      pixels:this.pixels.map(lp=>lp.map(fp=>fp.slice())),
      frameCount:this.frameCount,layerIdx:this.layerIdx,frameIdx:this.frameIdx});
    if(this.undoStack.length>this.maxUndo)this.undoStack.shift();
    this.redoStack=[];
  },
  _snapshotStructure() {
    return{type:'structure',
      layers:this.layers.map(l=>({...l})),
      pixels:this.pixels.map(lp=>lp.map(fp=>fp.slice())),
      frameCount:this.frameCount,layerIdx:this.layerIdx,frameIdx:this.frameIdx};
  },
  _restoreStructureSnapshot(e) {
    this.layers=e.layers.map(l=>({...l}));
    this.pixels=e.pixels.map(lp=>lp.map(fp=>new Int16Array(fp)));
    this.frameCount=e.frameCount;this.layerIdx=e.layerIdx;this.frameIdx=e.frameIdx;
    this._thumbCanvas.clear();this._render();this._renderLFTable();
  },
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
  },
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
  },
};
