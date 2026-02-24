// Bacon Pixel Editor — Storage Mixin
import { CONFIG } from '../constants.js';

export default {
  _scheduleSave(){
    clearTimeout(this._saveTimer);
    this._saveTimer=setTimeout(()=>this._saveToLocalStorage(),CONFIG.SAVE_DEBOUNCE_MS);
  },
  _saveToLocalStorage(){
    const cur=this.tabs.find(t=>t.id===this.activeTabId);
    if(cur)cur.state=this._serializeTab();
    const data={tabs:this.tabs,activeTabId:this.activeTabId,nextTabId:this._nextTabId,version:'2.0'};
    try{localStorage.setItem(CONFIG.STORAGE_KEY,JSON.stringify(data));}catch(e){}
  },
  _loadFromLocalStorage(){
    try{
      const raw=localStorage.getItem(CONFIG.STORAGE_KEY);
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
  },
};
