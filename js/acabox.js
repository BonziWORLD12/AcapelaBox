var xhr=null;
var login_status=0;
var g_dummy=false;
var g_login="";
var g_formsign=null;

var firstname="";
var logincount=0;
var starttime=0;


function showtext(after, id, msg, show)
{
  var node=document.getElementById(id);
  if(!show)
  {
    if(node)
    {
     	after.parentNode.removeChild(node);
    }
    return;
  }
  if(!node)
  {
  	var font=document.createElement("font");
  	font.setAttribute("id",id);
       	font.style.backgroundColor="red";
        font.style.color="white";
  	var txtNode=document.createTextNode(msg);
  	font.appendChild(txtNode);
  	after.parentNode.insertBefore(font,after.nextSibling);
  }
  else
  {
      var txtNode=node.firstChild.data=msg;
  }
}
function setLanguage(language)
{
/*
  var reg1=new RegExp("user-notify|user-verify|user-recover","g");
  if(document.URL.match(reg1))
  {
   window.location.href="index.php";
  }
  */
  setLang(language);
}
function setLang(language)
{
  setSessionLanguage(language);
}
function setSessionLanguage(language)
{
  if(xhr==null) xhr=CreateXMLHttpRequest();
  var url=acaboxserver+"/setlanguage.php?lang="+language;

  xhr.open("GET",url,false);
  xhr.send(null);
//  alert(xhr.responseText);
}
function CreateXMLHttpRequest()
{
  if(window.XMLHttpRequest)
  {
     xhr=new XMLHttpRequest();
  }
  else
  if(window.ActiveXObject)
  {
     xhr=new ActiveXObject("Microsoft.XMLHTTP");
  }
  return xhr;
}

function XMLLoginReply()
{
   var dyn=document.getElementById('logindyn');
   if(dyn)
   	dyn.value="State:"+xhr.readyState;
   var loginform=document.getElementById('loginform');
   var loginusername=document.getElementById('username');
   var loginpassword=document.getElementById('password');
   if(xhr.readyState==4)
   {
     if(xhr.status==200)
     {
        if(dyn) dyn.value="Received:"+xhr.responseText;
        var xml=xhr.responseXML.documentElement;
	var status=xml.getElementsByTagName("status");
	if(status.length>0) {status=status[0];}
        var loginerror=document.getElementById("loginerror");
	var loginstate=login_status;
	var flash=thisMovie("AcapelaBox");
	if(status) 
	{
		login_status=parseInt(status.firstChild.nodeValue);
	}
    if(login_status)
	{
        var l=xml.getElementsByTagName("login");
        if(l.length>0)
    {
    l=l[0];
    g_login=l.firstChild.nodeValue;
    document.getElementById('username').value=g_login;
    var firstlogin=xml.getElementsByTagName("firstlogin");
    if(firstlogin.length>0)
    {
        window.location.href="index.php";
//        alert("firstlogin");
//        window.location.reload();
    }
    var fname=xml.getElementsByTagName("firstname");
    if(fname.length>0)
    {
        firstname=fname[0].firstChild.nodeValue;
    }
      var flogincount=xml.getElementsByTagName("logincount");
      if(flogincount.length>0)
      {
         logincount=parseInt(flogincount[0].firstChild.nodeValue);
      }
    }
		if(g_dummy==false && flash) flash.ASLogin();		
		if(loginerror)
			loginform.removeChild(loginerror);
	}
	else
	{
		var err=xml.getElementsByTagName("error");
                if(err&&g_dummy==false&&loginstate==0)
		{
		   var msg=err[0].firstChild.nodeValue;
		   var locmsg=loc_wronguserpassword;
		   if(msg=="UnverifiedAccount") 
		   {
		     locmsg=loc_unverifiedaccount;
		      showError2Popup("<p align='center'>Your email has not been verified yet.<br/>A new verification email has been sent.<br/><br/>If you do not receive the email within few minutes, please use the <a href='/AcaBox/acabox-contact.php'>contact us</a> field to get in touch with us.</p>");
		   }
		  if(!loginerror)
		  {
		  	var font=document.createElement("font");
		  	font.setAttribute("id","loginerror");
                  	font.style.backgroundColor="red";
		  	var txtNode=document.createTextNode(locmsg);
		  	font.appendChild(txtNode);
		  
//		  	document.login.appendChild(font);
			loginform.appendChild(font);
		  }
		}
	
//                if(loginstate==1) { document.login.username.value="";document.login.password.value=""}
                if(loginstate==1) { loginusername.value="";loginpassword.value=""; window.location.href="index.php"; alert("loginstate");}
		if(g_dummy==false && flash) flash.ASLogout();
	}

     }
     else
        if(dyn) dyn.value="Error:"+xhr.status;

   }
  updateButtons();
}
function showError2Popup(text)
{
	var div=document.createElement("div");
	div.id="error2_div_div";
	div.innerHTML="	<div id='error2_div' onclick='hideError2Popup()' style='border-radius: 10px;  	-moz-border-radius: 10px; 	-webkit-border-radius: 10px; 	border: 15px solid #FF6464; visibility:visible; width:360px; height:260px; top:166px; left:32px; position:fixed; opacity:1; background-color: rgba(255, 224, 224, 0.95);'> 		<div id='error2Dialog'  style='margin:4px;overflow:auto; height:220px;background-color: rgba(255, 224, 224, 0.95)' > 			<div id='error2Msg'>ERROR</div> 		</div> 		<p style='font-size:small;text-align:right'>Click to close</p> 	</div> ";
	var parent=document.getElementById("header");
	if(parent) parent.appendChild(div);
	
	$("#error2Msg").html(text);
//	$("#error_div").css({ visibility:'visible' });
//	showElementWithId("error2_div");
}
function hideError2Popup()
{
	var div=document.getElementById("error2_div_div");
	if(div)
	{
	  div.parentNode.removeChild(div);
	}
}
function thisMovie(movieName)
{
  if(!document.getElementById(movieName)) return null;
  if(swfobject!=null)
  {
    var swf=swfobject.getObjectById(movieName);
    if(swf) return swf;
  }
  if(navigator.appName.indexOf("Microsoft")!=-1)
  { return window[movieName]; }
  else { return document[movieName]; }
}

function updateButtons()
{
  return;
  var e=document.getElementById('myaccountlink');
  if(e)
  {
  	if(login_status) e.innerHTML="<a href=\"acabox-myaccount.php\">"+loc_menu_myaccount+"</a>"; 
  	else e.innerHTML=loc_menu_myaccount;
  }

  e=document.getElementById('signuplink');
  if(e)
  {
        var txt=loc_menu_signup;
        var reg1=new RegExp("signup","g");
        if(document.URL.match(reg1))
        {
           txt="["+loc_menu_signup+"]";
        }
        else txt=loc_menu_signup;
  	if(!login_status) e.innerHTML="<a href=\"acabox-user-signup.php\">"+txt+"</a>"; 
  	else e.innerHTML=txt;
  }
  e=document.getElementById('miniLigne');
  if(e)
  {
      if(!login_status) g_formsign.style.display='block';
      else g_formsign.style.display='none';
//  	if(!login_status) e.appendChild(g_formsign);
//  	else e.innerHTML="";
  }

  e=document.getElementById("loginbutton");
  if(login_status) 
  {
     e.value=loc_logout;//"logout";
     hideLoginSpan(true);

     if(logincount>0)
     {
       setWelcome(loc_welcomeback+" "+firstname+"  ",true);
     }
     else
     {
       setWelcome(loc_welcomefirst+" "+firstname+"  ",true);
     }
  }
  else 
  {
     e.value=loc_login;//"login !";
     hideLoginSpan(false);
     setWelcome("",false);
     var reg1=new RegExp("myaccount","g");
     if(document.URL.match(reg1))
     {
        window.location="index.php";
        //alert("updatebuttons");
     }

  }

  if(login_status)
  {
     
  }
}
function hideRecoverForm()
{
  var forgotf=document.getElementById("forgotspan");
  if(forgotf)
  {
       	forgotf.style.display="none";
  }
}

function hideLoginSpan(hide)
{
  var loginspan=document.getElementById("loginspan");
  if(loginspan)
  {
       	if(hide) loginspan.style.display="none";   
        else loginspan.style.display="inline";   
  }
}
function setWelcome(msg,show)
{
  var loginspan=document.getElementById("loginspan");
  var welcomeLogin=document.getElementById("welcomeLogin");
  if(welcomeLogin)
  {
      loginspan.parentNode.removeChild(welcomeLogin);
      welcomeLogin=0; 
  }
  if(!welcomeLogin && show)
  {
    var font=document.createElement("font");
    font.setAttribute("id","welcomeLogin");
//  font.style.backgroundColor="red";
    font.style.color="white";
    var txtNode=document.createTextNode(msg);
    font.appendChild(txtNode);
    loginspan.parentNode.insertBefore(font,loginspan.nextSibling);
  }
  else
  {
  }
  
}
function doLogout(dummy)
{
  if(xhr==null) xhr=CreateXMLHttpRequest();
  var data="";
	data="mode=logout";

  xhr.open("POST",acaboxserver+"/login.php",false);
//  xhr.setRequestHeader("Connection","close");
  xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
//  xhr.setRequestHeader("Content-length",data.length);
  xhr.send(data);
  XMLLogoutReply();
}

function XMLLogoutReply()
{
   if(xhr.readyState==4)
   {
     if(xhr.status==200)
     {
        var dyn=document.getElementById('logindyn');
        if(dyn) dyn.value="Received:"+xhr.responseText;
        var xml=xhr.responseXML.documentElement;
        var status=xml.getElementsByTagName("status");
        if(status.length>0) {status=status[0];}
        var loginstate=login_status;
        if(status) 
        {
          login_status=parseInt(status.firstChild.nodeValue);
        }
        if(!login_status)
        {
          window.location.href='index.php';
        }
      }
    }
}
var to_will=0;
var to_session=0;
var ti_remaining=0;
var count_remaining=0;
var session_left=phpsession_timeout;

var lastsynctime=new Date();
function syncRemaining()
{
  
  var now=new Date();
  if(now.getTime()-lastsynctime.getTime()<5000) return;
  lastsynctime=now;
  if(xhr==null) xhr=CreateXMLHttpRequest();

  xhr.open("POST",acaboxserver+"/session-check.php",false);
//  xhr.setRequestHeader("Connection","close");
  xhr.send(null);
  var xml=xhr.responseXML.documentElement;
  if(xml)
  {
    var session=xml.getElementsByTagName("session");
    if(session.length>0)
    {
      var rem=parseInt(session[0].firstChild.nodeValue);
      session_left=rem;
      var now=new Date();
      starttime.setTime(now.getTime()-(phpsession_timeout-rem)*1000);
    }
  }
}
function session_remaining()
{
  count_remaining++;
  var sessionremaining=document.getElementById("sessionremaining");
  if(sessionremaining)
  {
    var now=new Date();
    syncRemaining();
    var remainingtime=phpsession_timeout-Math.round((500+now.getTime()-starttime.getTime())/1000);
    if(remainingtime<0) 
    {
    
      session_timeout();
      remainingtime=0;
    }
    var remmin=Math.floor(remainingtime/60);
    var remsec=remainingtime-remmin*60;
    remsec="0"+remsec;
    var ilen=remsec.length;
    remsec=remsec.substr(ilen-2,2);
    sessionremaining.firstChild.nodeValue=""+remmin+":"+remsec;
  }
}
function session_willtimeout()
{
  if(userlogged==1)
  {
//    $("#msg").show();
    $("#id_texttimeout").fancybox({"frameHeight":150, "frameWidth":300,"showCloseButton":true,"hideOnContentClick":true}).trigger("click");
  }
}

function session_timeout()
{
  if(userlogged==1)
  {
    $.fancybox.close();
  	var flash=thisMovie("AcapelaBox");
  	if(flash) flash.ASLogout();
    window.location.href="session-expired.php";
  }
}
function session_refresh()
{
 if(xhr==null) xhr=CreateXMLHttpRequest();

  xhr.open("POST",acaboxserver+"/session-refresh.php",false);
//  xhr.setRequestHeader("Connection","close");
  xhr.send(null);
}
function setBoxTimeOut()
{
  var reg1=new RegExp("index2","g");
  if(!document.URL.match(reg1)) // The main acabox page is handled differently (by flash)
  {
    if(userlogged==1)
    {
      clearTimeout(to_will);
      clearTimeout(to_session);
      to_will=setTimeout("session_willtimeout()",(phpsession_timeout-phpsession_timeoutwarning)*1000);
      to_session=setTimeout("session_timeout()",(phpsession_timeout+phpsession_timeoutgrace)*1000);
      clearInterval(ti_remaining);
      ti_remaining=setInterval("session_remaining()",1000);
      starttime=new Date();
    }
  }
  else   // Handle index
  {
    if(userlogged==1)
    {
      clearInterval(ti_remaining);
      ti_remaining=setInterval("session_remaining()",1000);
      starttime=new Date();
    }
  }
 
}
function continueSession()
{
  $.fancybox.close();
  if(xhr==null) xhr=CreateXMLHttpRequest();
  xhr.open("GET",acaboxserver+"/session-refresh.php",false);
  xhr.send();
  setBoxTimeOut();
}
function AScontinueSession() // Flash notifies us that session should continue
{
  starttime=new Date();
  if(userlogged==1)
  {
    if(xhr==null) xhr=CreateXMLHttpRequest();
    xhr.open("GET",acaboxserver+"/session-refresh.php",false);
    xhr.send();
    setInterval("session_remaining()",1000);
  } 
}
function ASLogout()
{
  window.location.href="index.php";  
}
function doLogin(dummy)
{
  if(userlogged==1)
  {
    document.onmousemove=position;
  }
  setBoxTimeOut();
  hideRecoverForm();
  if(!document.getElementById('username'))
    return;
  if(xhr==null) xhr=CreateXMLHttpRequest();
  var dyn=document.getElementById('logindyn');
  if(dyn) dyn.value="wait";
  g_dummy=dummy;
  var data="";
  if(dummy==true) 
  {
     hideRecoverForm();
     if(g_formsign==null) 
     {
	      g_formsign=document.getElementById('formsignup');
     }
  }
  else
  {
		data="login="+document.getElementById('username').value+"&password="+document.getElementById('password').value+"&mode=log";
		if(login_status==0) data=data+"in";
  		else data=data+"out";
  }
  xhr.open("POST",acaboxserver+"/login.php",false);
//  xhr.setRequestHeader("Connection","close");
  xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
//  xhr.setRequestHeader("Content-length",data.length);
  xhr.send(data);
  XMLLoginReply();
}

function forgotpassword()
{
  var id=document.getElementById('forgotdummy');
  showtext(id,"forgotresult","",false);
  var forgotf=document.getElementById("forgotspan");
  if(forgotf)
  {
     if(forgotf.style.display=="none")
        forgotf.style.display="block";
     else
        forgotf.style.display="none";
  }
}
function closeForgotForm()
{
  var forgotf=document.getElementById("forgotspan");
  if(forgotf)
  {
        forgotf.style.display="none";
  }
}
function doForgotPassword()
{
  if(xhr==null) xhr=CreateXMLHttpRequest();
  var id=document.getElementById('forgotdummy');
  var forgotemail=document.getElementById('forgotemail');
 
  var url=acaboxserver+"/acabox-user-forgot.php?email="+forgotemail.value+"&rnd="+Math.floor(Math.random()*10000);
  try
   {
  xhr.open("GET",url,false);
  xhr.send(null);
  }
  catch(err)
  {
     alert(err.description);
  }
  var xml=xhr.responseXML.documentElement;
  var ok=0;
  var message="";
  if(xml)
  {

     var status=xml.getElementsByTagName("status");
     if(status.length>0)
     {
        status=status[0];
        ok=parseInt(status.firstChild.nodeValue);     
     }
     var el_message=xml.getElementsByTagName("message");
     if(el_message.length>0)
     {
        el_message=el_message[0];
        message=el_message.firstChild.nodeValue;
     }
     showtext(id,"forgotresult",message,true);
     if(ok==1)
     {
        setTimeout("closeForgotForm()",3000);
     }
  }

}
function getIdFromCountry(name,selobj)
{
  for(i=0;i<selobj.options.length;i++)
  {
     if(selobj.options[i].text==name)
     {
        return selobj.options[i].value;
     }
  }
  return -1;
}

function ToFlashSession(urlencoded)
{
  if(xhr==null) xhr=CreateXMLHttpRequest();
  var url=acaboxserver+"/acabox-flashsession.php?toflash=1";
  try
   {
     xhr.open("POST",url,false);
//     xhr.setRequestHeader("Connection","close");
     xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
//     xhr.setRequestHeader("Content-length",urlencoded.length);
     xhr.send(urlencoded);
  }
  catch(err)
  {
    alert(err.description);
  }
}

var lastmovetime=new Date();
var lastmovex=0;
var lastmovey=0;
function position(event)
{
  var now=new Date();
  var diff=now.getTime()-lastmovetime.getTime();
  
  x=event.x+document.body.scrollLeft;
  y=event.y+document.body.scrollTop;
  if(lastmovex==x && lastmovey==y)
  {
    return;
  }
  lastmovex=x;
  lastmovey=y;  
  texte=""+x+" "+y+" "+diff;
  document.getElementById("LBL_pos").innerHTML=texte;
  
  if(diff<5000) return;
  lastmovetime=now;
  session_refresh();
}
