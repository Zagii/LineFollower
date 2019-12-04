var W;
var G;
var wsSerwTest="192.168.43.28";

class global
{
    constructor()
    {
        
    }
    
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
        this.timeout=250;
        
    }
    begin(d)
    {
        //setInterval(this.checkWS.bind(this), d*1000);
		 setTimeout(this.checkWS.bind(this),d*1000);
    }
    checkWS()
    {
        this.startWS();//.bind(this);
        return this.ws.readyState;
    }
    startWS()
    {
        if(this.ws){ if(this.ws.readyState==WebSocket.OPEN) return; }
        console.log("startWS");
		if(this.ws) {delete this.ws;}
		let mywsSerw=wsSerwTest;
		if (typeof wsSerw !== 'undefined') {mywsSerw=wsSerw;}
        this.ws = new WebSocket('ws://'+mywsSerw+':81/'); 
      //  this.ws =new WebSocket("wss://echo.websocket.org/");
        let me=this;
        this.ws.onopen = function () 
        { 
            let j={ "topic":"status", "msg":"Connected" };
            this.send(JSON.stringify(j));
            me.fCon();
        };
        this.ws.onclose = function(e) {
            console.log('Socket is closed. Reconnect will be attempted in 1 second.', e.reason);
            setTimeout(function() {
                me.startWS();//.bind(this);
            }, Math.min(10000,this.timeout+=this.timeout)); //zwieksza po czasie timeout
          };
        this.ws.onerror = function (error) 
        { 
            console.log('WebSocket Error ', error); 
           if(this.ws) this.ws.close();
           // delete this.ws; 
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

    getProgs()
    {
        this.send("{\"GET\":\"PROG\"}");
    }
    getKonf()
    {
        this.send("{\"GET\":\"KONF\"}");
    }
 
}


