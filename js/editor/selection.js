// Bacon Pixel Editor — Selection Mixin
export default {
  _unionRects(r1,r2){
    return{x1:Math.min(r1.x1,r2.x1),y1:Math.min(r1.y1,r2.y1),x2:Math.max(r1.x2,r2.x2),y2:Math.max(r1.y2,r2.y2)};
  },
  _normRect(x0,y0,x1,y1){return{x1:Math.min(x0,x1),y1:Math.min(y0,y1),x2:Math.max(x0,x1),y2:Math.max(y0,y1)};},
  _isInSel(x,y){return this.selection&&x>=this.selection.x1&&x<=this.selection.x2&&y>=this.selection.y1&&y<=this.selection.y2;},

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
  },
  _deselect(){
    if(this.floatBuf)this._commitFloat();
    this.selection=null;this.rotDrag=null;this._overRotHandle=false;
    this.viewport.classList.remove('cursor-rotate');
    this._stopMarchingAnts();this._renderOverlay(-1,-1);
  },
  _selectAll(){
    this.selection={x1:0,y1:0,x2:this.canvasW-1,y2:this.canvasH-1};
    this._startMarchingAnts();
  },
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
  },
  _commitFloat(){
    if(!this.floatBuf)return;
    const{x,y,w,h,data}=this.floatBuf;
    this._saveUndo();
    for(let py=0;py<h;py++)for(let px=0;px<w;px++){
      const ci=data[py*w+px];
      if(ci>=0&&this._inBounds(x+px,y+py))this._setPixel(x+px,y+py,ci);
    }
    this.floatBuf=null;this._render();
  },

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
  },

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
  },

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
  },

  _startMarchingAnts(){
    cancelAnimationFrame(this._marchAnimId);
    const step=()=>{
      if(!this.selection&&!this.floatBuf){this._marchAnimId=null;return;}
      this._marchOffset=(this._marchOffset+0.4)%8;
      this._renderOverlay(-1,-1);
      this._marchAnimId=requestAnimationFrame(step);
    };
    this._marchAnimId=requestAnimationFrame(step);
  },
  _stopMarchingAnts(){cancelAnimationFrame(this._marchAnimId);this._marchAnimId=null;},
};
