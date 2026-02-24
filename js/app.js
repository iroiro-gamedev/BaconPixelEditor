// Bacon Pixel Editor — Entry Point
import { DEFAULT_PALETTE } from './color-utils.js';
import UndoMethods      from './editor/undo.js';
import DrawMethods      from './editor/draw.js';
import SelectionMethods from './editor/selection.js';
import LayerMethods     from './editor/layers.js';
import TransformMethods from './editor/transform.js';
import RenderMethods    from './editor/render.js';
import UIMethods        from './editor/ui.js';
import EventMethods     from './editor/events.js';
import IOMethods        from './editor/io.js';
import StorageMethods   from './editor/storage.js';
import TabMethods       from './editor/tabs.js';

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

    // Brush size
    this.brushSize=1;

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
}

Object.assign(BaconPixelEditor.prototype,
  UndoMethods,
  DrawMethods,
  SelectionMethods,
  LayerMethods,
  TransformMethods,
  RenderMethods,
  UIMethods,
  EventMethods,
  IOMethods,
  StorageMethods,
  TabMethods
);

window.addEventListener('DOMContentLoaded', () => {
  window.editor = new BaconPixelEditor();
});
