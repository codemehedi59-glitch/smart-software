const {contextBridge,ipcRenderer}=require('electron');contextBridge.exposeInMainWorld('desktopStore',{get:()=>ipcRenderer.invoke('store:get'),set:(v)=>ipcRenderer.invoke('store:set',v)});
