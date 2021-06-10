<?php

include 'funcs.php';


$data = json_decode($_POST['data']);
$id = $_POST['id'];
$fileLoc = getFileLocation($id);

if(file_exists($fileLoc)) {
    $myfile = fopen($fileLoc, "w");
    fwrite($myfile, json_encode($data));
    fclose($myfile);
    printf('succes');
}
else
    printf('room' . $id . ' does not exist');

?>