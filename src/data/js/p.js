let progN=0;
let jestProg=[0];
let sLbl=["?"];


const con=function()
    {
        console.log("connected");
        let o=document.getElementById("pol");
        document.getElementById("plug").style.color="lime";
        document.getElementById("plugm").style.color="lime";
        W.getSekLbl();
        W.getProgs();
        W.getKonf();
        W.getStats();
    };
    const dc=function()
    {
        console.log("DC");
        document.getElementById("plug").style.color="darkred";
        document.getElementById("plugm").style.color="darkred";
        
    delete W; 
    };
    const msg=function(j)
    {
        console.log(j);
        for (let k in j) {
           // if (j.hasOwnProperty(k)) {
                console.log(k + " -> " + j[k]);
                if(["GEO","TEMP","CISN","DESZCZ"].indexOf(k)>=0)
                {
                   // document.getElementById(k.toLowerCase()).innerHTML=j[k];
                }
                if(["INIT_PROGS"].indexOf(k)>=0)
                {
                    initProgs();
                }
                if(["Wifi","Mqtt","NTP","Time"].indexOf(k)>=0)
                {
                    let m=j[k];
                    let fe=document.getElementById(k).elements;
                    for(let k1 in m)
                    {
                        console.log('key ='+k1+', val ='+m[k1]); 
                        if(m[k1])
                             fe[k1].value=m[k1];
                    }
                    
                }
            //} has own prop
            
        }
        if(j.hasOwnProperty("LBL"))
        {
            let tmp=G.getLbl(j.LBL.id);
            if(tmp.length<=0)
                {
                    addSekcja(j.LBL.id,j.LBL.lbl);    
                }else
                {
                    changeSekcja(j.LBL.id,j.LBL.lbl);
                }
        }
        if(j.hasOwnProperty("SYSTIME"))
        {
            document.getElementById("SYSTIME").innerHTML="Czas od restartu: "+j.SYSTIME;
        }
        if(j.hasOwnProperty("CZAS"))
        {
            G.setCzas(j["CZAS"]);
            document.getElementById('czas').value=G.getGodz();
            document.getElementById('data').value=G.getDtStr();
        }
        if(j.hasOwnProperty("PROG"))
        {
            let js=j.PROG;
            if(!jestProg[js.id]||jestProg[js.id]==0)
            {
                addProg(js.id,js.dzienTyg,js.ms,js.okresS,js.coIle,js.sekcja,js.aktywny);
                progN++;
            }else
            {
                ///zmien prog
                changeProg(js.id,js.dzienTyg,js.ms,js.okresS,js.coIle,js.sekcja,js.aktywny);
            }
        }      
    };


document.addEventListener("DOMContentLoaded", function(event) {
    debug=document.getElementById('deb');
    console.log("document On load");
    let fileName = location.pathname.split("/").slice(-1);
    //alert (fileName);
    delSekcje(); 
    W=new wsConn(con,dc,msg);
    G=new global();    
    W.begin(3);
   // for(let i=0;i<7;i++){jestProg[i]=0;}
    /*for(let i=0;i<7;i++)
    {
        progN=addProg(i,i*10000,i*100,i,i+1,i%2)
    }*/
    /*for(let i=1;i<7;i++)
    {
        
        G.setLbl(i,"Sek"+i);
        console.log("Dodaje: "+i);
        addSekcja(i,G.getLbl(i));
        changeSekcja(i,G.getLbl(i)+"opt");
    }*/
  //  changeSekcja(1,"nowa");
    document.getElementById('godz').addEventListener('change', function() {
        const className = 'error-field';
        const reg = new RegExp('^[a-zA-Z]{3}$', 'g');
    
        if (!reg.test(this.value)) {
            this.classList.add(className); //dodaję klase do pola
        } else {
            this.classList.remove(className); //usuwam klasę
        }
    });
   
});

function addProgBtn()
{
  let d1=new Date(0);
  let f=document.getElementById("addProgForm").elements;
  
  if(!(f["godz"].validity.valid && f["dlug"].validity.valid))  return;
 

  console.log(f["dzien"].value);
 
  //d1.setUTCDate(parseInt(f["dzien"].value)+4);
  console.log(d1.toDateString());
  let h=f["godz"].value.split(":");
  console.log(h);
  d1.setUTCHours(h[0],h[1],h[2])

  let dl=f["dlug"].value;
  let co=f["co_ile"].value;
  let s=f["sekcja"].value;
 // console.log("przed add: "+progN);
  let js={"PROG":{/*"id":"",*/"dzienTyg":f["dzien"].value,"tStr":f["godz"].value,"ms":d1.getTime()/1000,"okresS":dl,"coIle":co,"sekcja":s,"aktywny":0}};  
  W.send(JSON.stringify(js));
 // progN=addProg(progN+1,d1,dl,co,s,false);
 // console.log(" po add: "+progN);
    
}
function changeProg(i,dzienT,ms,ile_s,coIle_d,sek,akt) {
    console.log("changeProg: "+i);
  //  let w = document.getElementById("ProgW"+i);
  let dt=new Date(ms);
  document.getElementById("ProgDay"+i).innerHTML= G.getDzien(dzienT);//G.getDzien(dt.getUTCDay());
  document.getElementById("ProgGodz"+i).innerHTML= dt.getUTCHours().toString().padStart(2,"0")+":"+dt.getUTCMinutes().toString().padStart(2,"0")+":"+dt.getUTCSeconds().toString().padStart(2,"0")
  document.getElementById("ProgIles"+i).innerHTML= ile_s;
  document.getElementById("ProgCoIle"+i).innerHTML=coIle_d;
  document.getElementById("prListSekLbl"+i).innerHTML=G.getLbl(sek);
  changeProgAkt(i, akt);
}
function changeProgSend(i, a)
{
    let el=document.getElementById("Prog"+i);
    let js={"PROG":{"id":i,"aktywny":el.getAttribute('data-stan')==0?1:0}};
    console.log(JSON.stringify(js));
    W.send(JSON.stringify(js));
}
function changeProgAkt(i, a)
{
    let el=document.getElementById("Prog"+i);
    if(a==0)
    {
      el.className="fas fa-toggle-off w3-xlarge";
      document.getElementById("ProgTXT"+i).innerHTML="Nieaktywny";
      el.setAttribute('data-stan',0);
      document.getElementById("ProgW"+i).classList.remove('w3-light-grey');
      document.getElementById("ProgW"+i).classList.add('w3-dark-grey');
    }else
    {
      el.className="fas fa-toggle-on w3-xlarge";
      document.getElementById("ProgTXT"+i).innerHTML="Aktywny";
      el.setAttribute('data-stan',1);
      document.getElementById("ProgW"+i).classList.add('w3-light-grey');
      document.getElementById("ProgW"+i).classList.remove('w3-dark-grey');
    }
    
}
function addProg(i,dzienT,ms,ile_s,coIle_d,sek,akt) {
    console.log("add: "+i);
    jestProg[i]=1;
    let dt=new Date();
    dt.setTime(ms*1000);
    let w = document.createElement("div"); 
    w.className="w3-row w3-center w3-padding-16 w3-section";
    if(akt)w.classList.add("w3-light-grey");
    else w.classList.add("w3-dark-grey");
    w.id="ProgW"+i;
	let k= document.createElement("div");
    k.className="w3-third w3-section";
    c1a=document.createElement("div");
    c1a.className="w3-half w3-section";
    c1a.innerHTML="<i>Dzień tygodnia</i><br><h4 id=\"ProgDay"+i+"\">"+G.getDzien(dzienT)/*dt.getUTCDay())*/+"</h4>";
    k.appendChild(c1a);
    c1b=document.createElement("div");
    c1b.className="w3-half w3-section";
    c1b.innerHTML="<i>Start</i><br><h4 id=\"ProgGodz"+i+"\">"+ dt.getUTCHours().toString().padStart(2,"0")+":"+dt.getUTCMinutes().toString().padStart(2,"0")+":"+dt.getUTCSeconds().toString().padStart(2,"0")+"</h4>";

    k.appendChild(c1b);
    w.appendChild(k);
	
    k= document.createElement("div");
    k.className="w3-third w3-section";
    c2a=document.createElement("div");
    c2a.className="w3-half w3-section";
    c2a.innerHTML="<i>Długość[s]</i><br><h4 id=\"ProgIles"+i+"\">"+ ile_s+"</h4>";
    k.appendChild(c2a);
    c2b=document.createElement("div");
    c2b.className="w3-half w3-section";
    c2b.innerHTML="<i>Cykliczność [x dni]</i><br><h4 id=\"ProgCoIle"+i+"\">"+ coIle_d+"</h4>";
    k.appendChild(c2b);
	w.appendChild(k);
	
    k= document.createElement("div");
    k.className="w3-third w3-section";
   	c3a=document.createElement("div");
    c3a.className="w3-half w3-section";
    c3a.innerHTML="<i>Sekcja</i><br>";
    let c3a1=document.createElement("h4");
    c3a1.dataset["nr"]=sek;
    c3a1.id="prListSekLbl"+i;
    c3a1.innerHTML=G.getLbl(sek);
    c3a.appendChild(c3a1);
    k.appendChild(c3a);
    c3b=document.createElement("div");
    c3b.className="w3-half w3-section w3-center";
    c3b.innerHTML="<div class=\"w3-full\"><i>Opcje</i></div>";
    c3b1=document.createElement("div");
    c3b1.className="w3-half w3-section";
    c3b1.id="ProgAkt"+i;
    if(akt)
    {
     c3b1.innerHTML="<i class=\"fas fa-toggle-on w3-xlarge\" id=\"Prog"+i+"\" data-stan='1'></i><br><i id=\"ProgTXT"+i+"\">Aktywny</i>";//<br>aktywny"; 
    }else
    {
     c3b1.innerHTML="<i class=\"fas fa-toggle-off w3-xlarge\" id=\"Prog"+i+"\" data-stan='0'></i><br><i id=\"ProgTXT"+i+"\">Nieaktywny</i>";//<br>nieaktywny";  
    }
   c3b1.addEventListener('click',function(){changeProgSend(i, akt) });

    c3b.appendChild(c3b1);
    c3b2=document.createElement("div");
    c3b2.className="w3-half w3-section";
    c3b2.innerHTML="<button type='button' style=\"color:red\" onclick=\"delProg("+i+")\"><i class=\"fa fa-trash-alt w3-xlarge\"></i></button><br><i>Usuń</i>";
    c3b.appendChild(c3b2);    
    k.appendChild(c3b);
    w.appendChild(k);
    let foo = document.getElementById("prog");
    foo.appendChild(w);
   return i;
  }
  function initProgs()
  {
    let myNode=document.getElementById("prog");
    while (myNode.firstChild) {
        myNode.removeChild(myNode.firstChild);
    }
    delete jestProg;
    jestProg=[0];   
    progN=0;
    
  }
  function delProg(i){
      let str="Potwierdź usunięcie programu "+i+"\n";
          str+="Dzień: "+ document.getElementById("ProgDay"+i).innerHTML+"\n";
          str+="Godzina: " +document.getElementById("ProgGodz"+i).innerHTML+"\n";
          str+="Czas trwania [s]: "+document.getElementById("ProgIles"+i).innerHTML+"\n";
          str+="Częstotliwość [dni]: "+document.getElementById("ProgCoIle"+i).innerHTML+"\n";
          str+="Sekcja: "+document.getElementById("prListSekLbl"+i).innerHTML+"\n";
            
    if(confirm(str))
    {
        let js="{\"DEL_PROG\":"+i+"}";
        console.log(js);
        W.send(js);       

    }
}
function delSekcje()
{
    let f=document.getElementById("addProgForm").elements["sekcja"];
    while(f.length>0)
    {
       f.remove(f.length-1);
    }
}
function changeSekcja(s,str)
{
  G.setLbl(s,str);
  let o= document.getElementById("addProgForm").elements["sekcja"];
  o.childNodes[s].innerHTML=str;
  document.getElementById("SekLbl"+s).elements["sekLi"+s].value=str;
  for(let i=0;i<progN;i++)
  {
    let xx="prListSekLbl"+i;
    let x=document.getElementById(xx);
    if(x)
    {
        if(x.dataset.nr==s)
        {
            x.innerHTML=str;
        }
    } 
  }
}
function addSekcja(ind,str)
{
    G.setLbl(ind,str);
    let o = document.createElement("option");
    o.text = str;
    o.value=ind;
    document.getElementById("addProgForm").elements["sekcja"].add(o);
    addSekList(ind,str);
}
function addSekList(v,n)
{
    let f=document.getElementById("sekList");
    let w = document.createElement("div"); 
    w.className="w3-row w3-center w3-grey w3-padding-8 w3-section";
    
    let fs=document.createElement("form");
    fs.id="SekLbl"+v;
	
    c1a=document.createElement("div");
    c1a.className="w3-col m2 w3-section";
    c1a.innerHTML="<h4>"+v+"</h4>";

    c1b=document.createElement("div");
    c1b.className="w3-col m5 w3-section";
    c1b.innerHTML="<input class=\"w3-input\" style=\"width:90%\" type=\"text\" "+
            " id=\"sekLi"+v+"\" name=\"Lbl"+v+"\" value=\""+n+"\" placeholder=\"Sekcja "+v+"\" required/>";

    c1c=document.createElement("div");
    c1c.className="w3-col m1 w3-section ";
    c1c.innerHTML=" <button type='button' class='btn button5' style='width:80%;' onclick=\"setNewLBL('SekLbl"+v+"',"+v+")\"> "+
            "<i style='color:green' class='fa fa-edit w3-xlarge' aria-hidden='true' ></i></button>";
    w.appendChild(fs);
    fs.appendChild(c1a);
    fs.appendChild(c1b);
    fs.appendChild(c1c);

    f.appendChild(w);
}
function setNewLBL(fid,sid)
{
    let x = document.getElementById(fid).elements;
    let v =true;
    for(let i=0;i<x.length;i++)
    {
    
        if(!x[i].validity.valid)  v=false;
    }
    if(!v)
    {
        console.log("blad walidacji "+fid);
        return;
    }
    let str={"LBL":{"id":sid,"lbl":x["sekLi"+sid].value}};
    x["sekLi"+sid].value="";
    console.log(JSON.stringify(str));
    W.send(JSON.stringify(str));
}
function setCzas(id)
{
    let x = document.getElementById(id).elements;
    if(!global.isFormValid(x))
    {
        console.log("blad walidacji "+id);
        return;
    }
    let dt = new Date();
    let t=x["data"].value.match(x["data"].pattern);
    dt.setFullYear(t[3],t[2]-1,t[1]);
    t=x["czas"].value.match(x["czas"].pattern);
    dt.setHours(t[1],t[2],t[3]);
    let str="{\"CZAS\":"+dt.getTime()+"}"
    global.formClear(x);
    W.send(str);
}
function KonfForm(id)
{

    let x = document.getElementById(id).elements;
    let v =true;
    for(let i=0;i<x.length;i++)
    {
    
        if(!x[i].validity.valid)  v=false;
    }
    if(!v)
    {
        console.log("blad walidacji "+id);
        return;
    }
    
    const data = global.formToJSON(x);

    let str="{\""+id+"\":"+JSON.stringify(data)+"}";
    console.log(str);
    for(let i=0;i<x.length;i++)
    {
        x[i].value="";
    }
    W.send(str);
    
}



