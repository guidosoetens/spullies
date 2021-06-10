
<?php

$data = json_decode($_POST['data']);
$fileLoc = '../assets/lair.json';
    
//write current file as backup
$backupLoc = '../assets/backup/lair.json.' . time();
$backupFile = fopen($backupLoc, "w");
if($backupFile) {
    fwrite($backupFile, file_get_contents($fileLoc));
    fclose($backupFile);
}
else {
    printf("could not create backup...");
}

$myfile = fopen($fileLoc, "w");
if($myfile) {

    //write to current file:
    fwrite($myfile, json_encode($data));
    fclose($myfile);
}
else
    printf("kan niet bij de file...");

?>