
<?php

$fileLoc = '../assets/lair.json';
if(file_exists($fileLoc)) {
    printf(file_get_contents($fileLoc));
}
else
    printf('content could not be found at location: ' . $fileLoc);
?>