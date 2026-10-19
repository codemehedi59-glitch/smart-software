const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path'); const fs = require('fs');
const dataFile=()=>path.join(app.getPath('userData'),'reception-data.json');
const defaults={appointments:[],patients:[],testBookings:[],activity:[],settings:{centerName:'Smart Diagnostic Center',apiUrl:'',adminToken:''}};
function read(){try{return {...defaults,...JSON.parse(fs.readFileSync(dataFile(),'utf8'))}}catch{return structuredClone(defaults)}}
function write(v){fs.mkdirSync(path.dirname(dataFile()),{recursive:true});fs.writeFileSync(dataFile(),JSON.stringify(v,null,2));return v}
ipcMain.handle('store:get',()=>read()); ipcMain.handle('store:set',(_,v)=>write(v));
function create(){const w=new BrowserWindow({width:1500,height:930,minWidth:1080,minHeight:700,backgroundColor:'#eef5fb',webPreferences:{preload:path.join(__dirname,'preload.cjs'),contextIsolation:true,nodeIntegration:false}}); const dev=process.env.VITE_DEV_SERVER_URL; dev?w.loadURL(dev):w.loadFile(path.join(__dirname,'../dist/index.html'));}
app.whenReady().then(create); app.on('window-all-closed',()=>{if(process.platform!=='darwin')app.quit()});
