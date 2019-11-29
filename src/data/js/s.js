let globalLastSendMsgMS=0;
    const con=function()
    {
        console.log("connected");
        document.getElementById("plugm").style.color="lime";
    };
    const dc=function()
    {
        console.log("DC");
        document.getElementById("plugm").style.color="darkred";
       // delete W; 
    };
    const msg=function(j)
    {
        console.log(j);
        document.getElementById("footerTxt").innerHTML=JSON.stringify(j);
        //render Kp
        let v="";
        if (j.hasOwnProperty("Kp")) 
        {
            v=j.Kp;
            document.getElementById("divLFtytKp").innerHTML=v;
            document.getElementById("inpKp").value=v;
            document.getElementById("divLFKp").innerHTML=v;
        }
        //render Kd
        if (j.hasOwnProperty("Kd")) 
        {
            v=j.Kd;
            document.getElementById("divLFtytKd").innerHTML=v;
            document.getElementById("inpKd").value=v;
            document.getElementById("divLFKd").innerHTML=v;
        }
        //render Vmax
        if (j.hasOwnProperty("Vm")) 
        {
            v=j.Vm;
            document.getElementById("divLFtytVm").innerHTML=v;
            document.getElementById("inpVm").value=v;
            document.getElementById("divLFVm2").innerHTML=v;
        }
        //render position
        if (j.hasOwnProperty("Pos")) 
        {
            v=j.Pos;
            document.getElementById("divLTPosRange").value=v;
            document.getElementById("divLFpoz").innerHTML=v;
            document.getElementById("divLFpoz2").innerHTML=v;
        }
        //render LastError
        if (j.hasOwnProperty("LE")) 
        {
            v=j.LE;
            document.getElementById("divLFLE").innerHTML=v;
        }
        //render error
        if (j.hasOwnProperty("E")) 
        {
            v=j.E;
            document.getElementById("divLFEr").innerHTML=v;
        }
        //render deltaP
        if (j.hasOwnProperty("dp")) 
        {
            v=j.dp;
            document.getElementById("divLFdp").innerHTML=v;
        }
        //render deltaD
        if (j.hasOwnProperty("dd")) 
        {
            v=j.dd;
            document.getElementById("divLFdd").innerHTML=v;
        }
        //render speedDiff
        if (j.hasOwnProperty("sd")) 
        {
            v=j.sd;
            document.getElementById("divLFsd").innerHTML=v;
            
            //plus obrót strzałki
            let rad=v/1024;
            v=rad*(180/Math.PI);
            document.getElementById("divLFsd2").innerHTML=v.toFixed(1);
            rotateElement("arrowSD",v); //<<< do poprawki zapewne
        }
        ////render Lewy
        if (j.hasOwnProperty("L")) 
        {
            v=j.L;
            document.getElementById("divLFL").innerHTML=v;
            document.getElementById("divLFL2").innerHTML=v;
            document.getElementById("divLFLslider").value=v;
        }
        //render Prawy
        if (j.hasOwnProperty("P")) 
        {
            v=j.P;
            document.getElementById("divLFP").innerHTML=v;
            document.getElementById("divLFP2").innerHTML=v;
            document.getElementById("divLFPslider").value=v;
        }
        //render LoopTime
        if (j.hasOwnProperty("LT")) 
        {
            v=j.LT;
            document.getElementById("divLFLT").innerHTML=v;
        }
        //tryb
        if (j.hasOwnProperty("T")) 
        {
            v=j.T;
            switch(v)
            {
                case 0:
                   document.getElementById("faStartStop").style.color="green";
                   document.getElementById("faStartStop").className="fa fa-play fa-4x"; 
                   break;
                case 1:
                   document.getElementById("faStartStop").style.color="darkred";
                   document.getElementById("faStartStop").className="fa fa-stop fa-4x";  
                   break;
            }

        }
        

        
    };

   
    //let w=new wsConn(con.bind(this),dc.bind(this),msg.bind(this));
    

    //setInterval(w.sendtest.bind(w), 5000);
    function getRndInt(min, max) {
        return Math.floor(Math.random() * (max - min) ) + min;
      }
    function generatorTestowychKomunikatow()
    {
        let j={};
        j.Kp=(getRndInt(0,300).toFixed(2))/10;
        j.Kd=(getRndInt(0,300).toFixed(2))/10;
        j.Vm=getRndInt(0,1024);
        j.Pos=getRndInt(0,1024);
        j.LE=getRndInt(0,1024);
        j.E=getRndInt(0,1024);
        j.dp=getRndInt(0,1024);
        j.dd=getRndInt(0,1024);
        j.sd=getRndInt(-1024,1024);
        j.L=getRndInt(-1024,1024);
        j.P=getRndInt(-1024,1024);
        j.LT=getRndInt(0,1024);
        j.T=getRndInt(0,2);

        msg(j);
    }
    document.addEventListener("DOMContentLoaded", function(event) {
	 
        
        debug=document.getElementById('deb');
        console.log("document On load");
      //  W=new wsConn(con,dc,msg); <<< tu połączenie zakomentoweamlem
        G=new global();
      //  W.begin(3); << i to też 
      generatorTestowychKomunikatow();
      setInterval(generatorTestowychKomunikatow,1000) ;    
      
      var joystickView = new JoystickView(200, function(callbackView){
        $("#joystickContent").append(callbackView.render().el);
        setTimeout(function(){
            callbackView.renderSprite();
        }, 0);
    });
    joystickView.bind("verticalMove", function(y){
        $("#yVal").html(y);
      // joyChg(x,y);
    });
    joystickView.bind("horizontalMove", function(x){
        $("#xVal").html(x);
        // joyChg(x,y);
    });
    joystickView.bind("xyMove", function(x,y){
        joyChg(x,y);
    });
});
    
    function joyChg(x,y)
    {
        let o={};
        o.id="joystick";
        // y predkosc jazdy
        // x predkosc skretu
        let mv=1024;
        let v=y*mv;
        let r=x*mv;
        o.L=v+r;
        o.P=v-r;
        sendStan(o);
    }



    function sendStan( nr)
    {
        let co="";
        let co2="";
        let wart=0;
        let wart2=0;
        let msg={};
        ///wejscia
        switch(nr.id)
        {
            case "buttKpPlus":
                co="Kp";
                wart=parseFloat(document.getElementById("divLFKp").innerHTML)+0.5;
                break;
            case "buttKpMinus":
                co="Kp";
                wart=parseFloat(document.getElementById("divLFKp").innerHTML)-0.5;
                break;
            case "buttKpSend":
                co="Kp";
                wart=parseFloat(document.getElementById("inpKp").value);
                break;
            case "buttKdPlus":
                co="Kd";
                wart=parseFloat(document.getElementById("divLFKd").innerHTML)+0.5;
                break;
            case "buttKdMinus":
                co="Kd";
                wart=parseFloat(document.getElementById("divLFKd").innerHTML)-0.5;
                break;
            case "buttKdSend":
                co="Kd";    
                wart=parseFloat(document.getElementById("inpKd").value);
                break;
            case "buttVmPlus":
                co="Vm";
                wart=parseInt(document.getElementById("divLFVm2").innerHTML)+50;
                break;
            case "buttVmMinus":
                co="Vm";
                wart=parseInt(document.getElementById("divLFVm2").innerHTML)-50;
                break;
            case "buttVmSend":
                co="Vm";
                wart=parseInt(document.getElementById("inpVm").value);
                break;
            case "buttStartStop":
                co="T";
                if(document.getElementById("faStartStop").style.color=="green")
                   { wart=1;}
                    else 
                    {wart=0;}
                break;
            case "joystick":
                co="R";
                wart=null;                
                msg.L=parseInt(nr.L);
                msg.P=parseInt(nr.P);
                break;   
        }

       let teraz = Date.now();
        if(teraz-globalLastSendMsgMS>300) 
        {
            globalLastSendMsgMS=teraz;
            msg.c=co;
            if(co!='R') msg.v=wart;

            console.log("sendStan msg="+JSON.stringify(msg) );
            document.getElementById("footerTxt").innerHTML=JSON.stringify(msg);
    //    W.send(msg);   
        }
    }
    function trybSwitch()
    {
        let t=document.getElementById("tryb");
        console.log(t.textContent);
        let jsonOb;
        if(t.textContent=="auto")
        {
            jsonOb={"TRYB": "m" };
        }else
        {
            jsonOb={ "TRYB":"a" };
        }
        let msg=JSON.stringify(jsonOb);
        console.log("sendStan msg="+msg );
        W.send(msg);   
    }
   
    function rotateElement(elem,stopnie) {
        var img = document.getElementById(elem);
        img.style.transform = 'rotate('+stopnie+'deg)';
    }