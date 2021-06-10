<?php

include 'funcs.php';

$data = json_decode($_POST['data']);

$fileLoc = getFileLocation($idx);

$myfile = fopen($fileLoc, "w");
if(!$myfile)
    printf("faalbazerij");  
fwrite($myfile, json_encode($data));
fclose($myfile);

?>