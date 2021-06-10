<?php

$data = json_decode($_FILES['data']);
$id = $_FILES['id'];
$fileLoc = getFileLocation($id);

if(file_exists($fileLoc)) {
    if($data['owner'] == getRealIpAddr()) {
        $myfile = fopen($fileLoc, "w");
        fwrite($myfile, json_encode($data));
        fclose($myfile);
        printf('succes');
    }
    else
        printf('caller is not the owner of this content');
}
else
    printf('level' . $id . ' does not exist');

?>