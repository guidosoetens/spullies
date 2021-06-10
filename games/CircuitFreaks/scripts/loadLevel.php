
<?php

$index = $_POST['index'];
$fileLoc = '../levels/level' . $index . '.json';
if(file_exists($fileLoc)) {
    printf(file_get_contents($fileLoc));
}
else
    printf('content could not be found at location: ' . $fileLoc);
?>