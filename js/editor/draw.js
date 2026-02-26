// Bacon Pixel Editor — Draw Mixin
export default {
  _newPixels() { const a=new Int16Array(this.canvasW*this.canvasH);a.fill(-1);return a; },
  _getPixel(x,y,li=this.layerIdx,fi=this.frameIdx){return this.pixels[li][fi][y*this.canvasW+x];},
  // Returns true when a palette index is visually transparent (index=-1 OR palette alpha=0)
  _isTransparentPx(idx){
    if(idx<0)return true;
    const h=this.palette[idx];
    return !h||(h.length===9&&h.slice(7,9)==='00');
  },
  _setPixel(x,y,ci,li=this.layerIdx,fi=this.frameIdx){this.pixels[li][fi][y*this.canvasW+x]=ci;},
  _inBounds(x,y){return x>=0&&y>=0&&x<this.canvasW&&y<this.canvasH;},

  /** Set pixel with mirror support. */
  _setPixelM(x,y,ci) {
    const pts=[[x,y]];
    if(this.mirrorH)pts.push([this.canvasW-1-x,y]);
    if(this.mirrorV)pts.push([x,this.canvasH-1-y]);
    if(this.mirrorH&&this.mirrorV)pts.push([this.canvasW-1-x,this.canvasH-1-y]);
    for(const[px,py]of pts)if(this._inBounds(px,py))this._setPixel(px,py,ci);
  },
  /** Paint a circular brush centered at (x,y) with mirror support. */
  _paintBrush(x,y,ci) {
    const s=this.brushSize||1;
    if(s===1){this._setPixelM(x,y,ci);return;}
    const r=s/2,lo=-Math.ceil(r),hi=Math.ceil(r);
    for(let dy=lo;dy<=hi;dy++)for(let dx=lo;dx<=hi;dx++)
      if(Math.sqrt(dx*dx+dy*dy)<=r)this._setPixelM(x+dx,y+dy,ci);
  },

  _compositedColor(px,py,fi=this.frameIdx) {
    for(let li=this.layers.length-1;li>=0;li--){
      if(!this.layers[li].visible)continue;
      const idx=this.pixels[li][fi][py*this.canvasW+px];
      if(idx>=0)return idx;
    }
    return -1;
  },
  _compositFrame(fi) {
    const res=new Int16Array(this.canvasW*this.canvasH);res.fill(-1);
    for(let li=0;li<this.layers.length;li++){
      if(!this.layers[li].visible)continue;
      const lp=this.pixels[li][fi];
      for(let i=0;i<res.length;i++)if(lp[i]>=0)res[i]=lp[i];
    }
    return res;
  },

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
      if(this._inBounds(x,y)){this._paintBrush(x,y,c);this.lastPx={x,y};this._render();}
      return;
    }
    this.overlayPxMap=null;
  },

  _continueDraw(x,y,ci) {
    if(this.tool==='eyedropper'||this.tool==='fill')return;
    if(this.tool==='pencil'||this.tool==='eraser'){
      const c=this.tool==='eraser'?-1:ci;
      if(this.lastPx&&this._inBounds(x,y))this._bresenham(this.lastPx.x,this.lastPx.y,x,y,c,true);
      else if(this._inBounds(x,y))this._paintBrush(x,y,c);
      this.lastPx={x,y};this._render();return;
    }
    if(['line','rect','ellipse'].includes(this.tool)&&this.startPx){
      this.overlayPxMap=this._computeShapePx(this.startPx.x,this.startPx.y,x,y,ci);
      this._renderOverlay(x,y);
    }
    if(this.tool==='select'&&this.selDragging&&this.startPx){
      const nr=this._normRect(this.startPx.x,this.startPx.y,x,y);
      if(this.selMode==='add'&&this._prevSelection)
        this.selection=this._unionRects(this._prevSelection,nr);
      else if(this.selMode==='sub'&&this._prevSelection)
        this.selection=this._subtractRect(this._prevSelection,nr);
      else this.selection=nr;
      this._renderOverlay(x,y);
    }
  },

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
          sel=this._unionRects(this._prevSelection,nr);
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
  },

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
  },

  _shapeRect(x0,y0,x1,y1,set){
    const lx=Math.min(x0,x1),rx=Math.max(x0,x1),ty=Math.min(y0,y1),by=Math.max(y0,y1);
    if(this.optFilled){for(let y=ty;y<=by;y++)for(let x=lx;x<=rx;x++)set(x,y);}
    else{for(let x=lx;x<=rx;x++){set(x,ty);set(x,by);}for(let y=ty;y<=by;y++){set(lx,y);set(rx,y);}}
  },
  _shapeEllipse(x0,y0,x1,y1,set){
    const lx=Math.min(x0,x1),rx=Math.max(x0,x1);
    const ty=Math.min(y0,y1),by=Math.max(y0,y1);
    if(lx===rx&&ty===by){set(lx,ty);return;}
    // Pixel (px,py) has its center at (px+0.5, py+0.5).
    // Inscribe the ellipse in the bounding box using pixel-center math.
    const cx=(lx+rx+1)/2, cy=(ty+by+1)/2;
    const a=(rx-lx+1)/2,  b=(by-ty+1)/2;
    if(this.optFilled){
      for(let y=ty;y<=by;y++){
        const dy=(y+0.5-cy)/b; if(dy*dy>1)continue;
        const xOff=a*Math.sqrt(1-dy*dy);
        for(let x=Math.ceil(cx-xOff-0.5);x<=Math.floor(cx+xOff-0.5);x++)set(x,y);
      }
      return;
    }
    // Outline: row-scan gives left/right boundary pixels;
    // column-scan gives top/bottom boundary pixels. Combine to avoid gaps.
    const seen=new Set();
    const plot=(x,y)=>{const k=y*65536+x;if(!seen.has(k)){seen.add(k);set(x,y);}};
    for(let y=ty;y<=by;y++){
      const dy=(y+0.5-cy)/b; if(dy*dy>1)continue;
      const xOff=a*Math.sqrt(1-dy*dy);
      plot(Math.ceil(cx-xOff-0.5),y);
      plot(Math.floor(cx+xOff-0.5),y);
    }
    for(let x=lx;x<=rx;x++){
      const dx=(x+0.5-cx)/a; if(dx*dx>1)continue;
      const yOff=b*Math.sqrt(1-dx*dx);
      plot(x,Math.ceil(cy-yOff-0.5));
      plot(x,Math.floor(cy+yOff-0.5));
    }
  },

  _bresenham(x0,y0,x1,y1,ci,skipFirst=false){
    let dx=Math.abs(x1-x0),dy=Math.abs(y1-y0),sx=x0<x1?1:-1,sy=y0<y1?1:-1,err=dx-dy;
    let x=x0,y=y0,first=true;
    while(true){
      if(!first||!skipFirst)this._paintBrush(x,y,ci);
      first=false;if(x===x1&&y===y1)break;
      const e2=2*err;if(e2>-dy){err-=dy;x+=sx;}if(e2<dx){err+=dx;y+=sy;}
    }
  },
  _bresenhamSet(x0,y0,x1,y1,set){
    let dx=Math.abs(x1-x0),dy=Math.abs(y1-y0),sx=x0<x1?1:-1,sy=y0<y1?1:-1,err=dx-dy;
    let x=x0,y=y0;
    while(true){set(x,y);if(x===x1&&y===y1)break;const e2=2*err;if(e2>-dy){err-=dy;x+=sx;}if(e2<dx){err+=dx;y+=sy;}}
  },

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
  },

  _fillAll(x,y,ci){
    const rawTarget=this._getPixel(x,y);
    const targetTransp=this._isTransparentPx(rawTarget);
    if(!targetTransp&&rawTarget===ci)return;
    if(targetTransp&&this._isTransparentPx(ci))return;
    const data=this.pixels[this.layerIdx][this.frameIdx];
    for(let i=0;i<data.length;i++){
      if(targetTransp?this._isTransparentPx(data[i]):data[i]===rawTarget)data[i]=ci;
    }
  },
};
