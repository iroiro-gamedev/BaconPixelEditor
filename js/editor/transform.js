// Bacon Pixel Editor — Transform Mixin
import { parseHex, toHex8 } from '../color-utils.js';

export default {
  _finalizeTransform(){this._thumbCanvas.clear();this._render();this._renderLFTable();},

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
  },

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
    this._finalizeTransform();
  },
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
    this._finalizeTransform();
  },
  _rotateCurrentBase180(){
    this._saveUndo();
    const data=this.pixels[this.layerIdx][this.frameIdx];
    const len=data.length;
    for(let i=0;i<Math.floor(len/2);i++){const tmp=data[i];data[i]=data[len-1-i];data[len-1-i]=tmp;}
    this._finalizeTransform();
  },
  _flipCurrentH(){
    this._saveUndo();
    const{canvasW:w,canvasH:h,layerIdx:li,frameIdx:fi}=this;
    const data=this.pixels[li][fi];
    for(let y=0;y<h;y++)for(let x=0;x<Math.floor(w/2);x++){
      const a=y*w+x,b=y*w+(w-1-x);const tmp=data[a];data[a]=data[b];data[b]=tmp;
    }
    this._finalizeTransform();
  },
  _flipCurrentV(){
    this._saveUndo();
    const{canvasW:w,canvasH:h,layerIdx:li,frameIdx:fi}=this;
    const data=this.pixels[li][fi];
    for(let y=0;y<Math.floor(h/2);y++)for(let x=0;x<w;x++){
      const a=y*w+x,b=(h-1-y)*w+x;const tmp=data[a];data[a]=data[b];data[b]=tmp;
    }
    this._finalizeTransform();
  },

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
  },

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
  },

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
  },
};
