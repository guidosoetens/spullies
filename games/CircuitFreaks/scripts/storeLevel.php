
<?php

$index = $_POST['index'];
$data = $_POST['data'];
$fileLoc = '../levels/level' . $index . '.json';
    
// //write current file as backup
// $backupLoc = '../levels/backup/level.json.' . time();
// $backupFile = fopen($backupLoc, "w");
// if($backupFile) {
//     fwrite($backupFile, file_get_contents($fileLoc));
//     fclose($backupFile);
// }
// else {
//     printf("could not create backup...");
// }

$myfile = fopen($fileLoc, "w");
if($myfile) {
    //write to current file:
    chmod($myfile, 0777); 
    fwrite($myfile, $data);
    fclose($myfile);
}
else
    printf("kan niet bij de file...");

?>