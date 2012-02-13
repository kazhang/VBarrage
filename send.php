<?php
if($_SERVER['REQUEST_METHOD']=='POST')
{
	$sendDate="date:'".date("Y-m-d H:i")."'},\n";
	$file=fopen("msg.txt","a+");
	fputs($file,$_POST['m'].$sendDate);
	fclose($file);
}
?>

