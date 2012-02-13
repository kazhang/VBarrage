<?php
$file=fopen("msg.txt","r") or exit("Unable to read!");
while(!feof($file))
	echo fgets($file);
fclose($file);
?>
