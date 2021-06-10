
<?php

include 'funcs.php';

$id = $_POST['id'];
$fileLoc = getFileLocation($id);

if(file_exists($fileLoc)) {
    // $myfile = fopen($fileLoc, "w");
    printf(file_get_contents($fileLoc));
}
else
    printf('room' . $id . ' does not exist');

?>