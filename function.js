var commentList=[];
var track=new Array(14);
for(var i=0;i<14;i++)
	track[i]=0;

function $(e)
{
	return document.getElementById(e);
}

function getAJAX()
{
	if(window.XMLHttpRequest)
		return new XMLHttpRequest();
	else if(window.ActiveXObject)
		return new ActiveXObject("Microsoft.XMLHTTP");
	return null;
}

function tick2str(tic)
{
	var str="";
	if(tic<60)str="00";
	else if(tic<600)str="0"+parseInt(tic/60);
	else str=parseInt(tic/600)+""+parseInt(tic/60%10);
	str+=":";
	tic%=60;
	str+=parseInt(tic/10)+""+parseInt(tic%10);
	return str;
}

function pollMsg(from)
{
	var ajax=getAJAX();
	if(ajax==null)return;
	ajax.onreadystatechange=function()
	{
		if(ajax.readyState==4&&ajax.status==200)
		{
			var rec="(["+ajax.responseText+"])";
			var objs=eval(rec);
			for(x in objs)
			{
				var node=document.createElement('tr');
				node.innerHTML='<td>'+tick2str(objs[x].tick)+'</td><td>'+objs[x].text+'</td><td>'+objs[x].date+'</td>';
				$('list').appendChild(node);
			}
			commentList=commentList.concat(objs);
		}
	}
	ajax.open('GET','msg.php?from='+from,true);
	ajax.send(null);
}

function checkList()
{
	var ct=parseInt($('video').currentTime);
	for(x in commentList)
	{
		if(commentList[x].tick==ct)
			showComment(commentList[x]);
	}
}

function moveAll()
{
	var sps=document.getElementsByTagName('span');
	for(var x=0;x<sps.length;x++)
	{
		var l=parseInt(sps[x].style.left);
		if(l>-sps[x].clientWidth)
		{
			var tr=parseInt(sps[x].style.top)/25;
			if(track[tr]==l+sps[x].clientWidth-480)
				track[tr]-=5;
			sps[x].style.left=l-5+'px';
		}
		else
			sps[x].parentNode.removeChild(sps[x]);
	}
}

function getTop()
{
	var min=1000,id=0;
	for(x in track)
	{
		if(track[x]<=0)return x*25;
		if(track[x]<min)
		{
			min=track[x];
			id=x;
		}
	}
	return id*25;
}

function showComment(c)
{
	var node=document.createElement('span');
	node.innerHTML=c.text;
	if(c.color)node.style.color=c.color;
	if(c.size)node.style.fontSize=c.size;
	node.style.left="480px";
	var t=getTop();
	node.style.top=t+"px";
	node.className="comment";
	$('pool').appendChild(node);
	track[t/25]=node.clientWidth;
}

function sendMsg()
{
	if($('msg').value=='')return;
	var tmp="{color:'"+$('color').value+"',";
	var ct=parseInt($('video').currentTime);
	tmp+="tick:"+ct+",";
	tmp+="size:'"+$('fontsize').value+"px',";
	tmp+="text:'"+$('msg').value+"'";
	var ajax=getAJAX();
	ajax.open("post","send.php",true);
	ajax.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
	ajax.onreadystatechange=function ()
	{
		if(ajax.readyState==4&&ajax.status==200)
		{
			var b=eval("("+tmp+"})");
			showComment(b);
			commentList[commentList.length]=b;
		}
	}
	ajax.send("m="+tmp+",");
	$('msg').value="";	
}

var st=false;
var tmove,tcheck;

function handle()
{
	if(st)
	{
		st=false;
		window.clearInterval(tmove);
		window.clearInterval(tcheck);
	}
	else
	{
		st=true;
		tmove=window.setInterval("moveAll()",50);
		tcheck=window.setInterval("checkList()",1000);
	}
}
$('video').addEventListener('ended','handle()');
