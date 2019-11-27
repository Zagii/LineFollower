var W;
var G;
var wsSerw;//="192.168.43.144"

class global
{
    constructor()
    {
        this.dTyg=["Niedziela","Poniedziałek","Wtorek","Środa","Czwarek","Piątek","Sobota"];
        this.sLbl=["","","","","","","","","",""];
        this.dt=new Date();   
    }
    getDzien(i){return this.dTyg[i];}
    setLbl(i,s){this.sLbl[i]=s;}
    getLbl(i){return this.sLbl[i];}
    setCzasS(mSek)
    {
        this.dt.setTime(mSek*1000);
    }
	setCzas(mSek)
    {
        this.dt.setTime(mSek);//*1000);
    }
    getGodz(){
        return  this.dt.getUTCHours().toString().padStart(2,"0")+":"+
        this.dt.getUTCMinutes().toString().padStart(2,"0")+":"+
        this.dt.getUTCSeconds().toString().padStart(2,"0");       
    }
    getDtStr()
    {
        return  this.dt.getUTCDate().toString().padStart(2,"0")+"-"+
                ( this.dt.getUTCMonth()+1).toString().padStart(2,"0")+"-"+
                this.dt.getUTCFullYear();
    }
    getDTyg() {return dTyg[dt.getUTCDay()];}

    static isValidElement(e){return e.name && e.value;}
    static isValidValue(e){ return (!['checkbox', 'radio'].includes(e.type) || e.checked);}
    static isCheckbox(e){return e.type === 'checkbox';}
    static isBtn(e){return e.type === 'button';}
    static isMultiSelect(e){return e.options && e.multiple;}
    static formClear(eList)
    {
        for(let i=0;i<eList.length;i++)
        {
            eList[i].value="";
        }
    }
    static isFormValid(eList)
    {
        for(let i=0;i<eList.length;i++)
        {
            if(!eList[i].validity.valid)  return false;
            
        }
        return true;
    }

    static reducerFunc(data,element)
    {
            if (global.isValidElement(element) && global.isValidValue(element)) 
            {
            if(global.isBtn(element))return;
            if (global.isCheckbox(element)) 
            {
                    data[element.name] = (data[element.name] || []).concat(element.value);
                } else if (global.isMultiSelect(element))
                {
                    data[element.name] = global.getSelectValues(element);
                }else 
                {
                    data[element.name] = element.value;
                }
            }
            return data;
    }

    static formToJSON(elements)
    {  
       let a = [].reduce.call(elements, global.reducerFunc,{});
       return a;
    }
}

class wsConn
{
    constructor(fCon,fDc,fMsg) {
        this.ws=null;
        this.fCon=fCon.bind(this);
        this.fDc=fDc.bind(this);
        this.fMsg=fMsg.bind(this);
        
    }
    begin(d)
    {
        setInterval(this.checkWS.bind(this), d*1000);
    }
    checkWS()
    {
      //  console.log("checkWS");
    /*    if(this.ws)
        {
            if(this.ws.readyState == WebSocket.CLOSED)
            {          
                this.startWS();
            }else
            {
                if(this.ws.readyState==WebSocket.OPEN)
                {
                } else
                {
                }
            }
        
        }else
        {*/
         this.startWS();
        //}
        return this.ws.readyState;
       
    }
    startWS()
    {
        if(this.ws){ if(this.ws.readyState==WebSocket.OPEN) return; }
        console.log("startWS");
        this.ws = new WebSocket('ws://'+wsSerw+':81/'); 
      //  this.ws =new WebSocket("wss://echo.websocket.org/");
        let me=this;
        this.ws.onopen = function () 
        { 
            let j={ "topic":"status", "msg":"Connected" };
            this.send(JSON.stringify(j));
            me.fCon();
        };
        this.ws.onerror = function (error) 
        { 
            console.log('WebSocket Error ', error); 
            ws.close();
            delete this.ws; 
            me.fDc();
	    }; 
        this.ws.onmessage = function (e) 
        {
            let j=JSON.parse(e.data); 
                       
            me.fMsg(j);
        };
        return this.ws.readyState; 
    }
    send(m)
    {
        console.log("WS.send->"+m);
        if(this.ws)
        {
            if(this.ws.readyState==WebSocket.OPEN) 
            {
                    this.ws.send(m);
                    console.log("[ok]")
            }else
            {
                console.log("[statErr]");
            }
        }else console.log("[ws-null]");
    }
    sendtest()
    {
        let t="{\"t\":\""+new Date().toISOString()+"\"}";
        this.send(t);
    }
    getSekLbl()
    {
        this.send("{\"GET\":\"SLBL\"}");
    }
    getProgs()
    {
        this.send("{\"GET\":\"PROG\"}");
    }
    getKonf()
    {
        this.send("{\"GET\":\"KONF\"}");
    }
    getStats()
    {
        this.send("{\"GET\":\"STAT\"}");
    }
}


