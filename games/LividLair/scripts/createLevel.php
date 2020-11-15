<?php

include 'funcs.php';

$content = array(
    "owner" => getRealIpAddr(),
    "start" => array("x" => 12, "y" => 10),
    "goal" => array("x" => 12, "y" => 5),
    "borders" => array(
        array(
            "type" => "normal",
            "src" => array( "x" => 2, "y" => 30 ),
            "anim" => null,
            "segs" => array(
                array("x" => 22, "y" => 30, "or" => 0),
            )
        )
    )
);

$indices = getLevelIndices();
$idx = count($indices) + 1;
if($idx > 1000)
    $idx = 1000;
$fileLoc = getFileLocation($idx);

if(!file_exists($fileLoc)) {
    //oh noe?
}

$myfile = fopen($fileLoc, "w");
fwrite($myfile, json_encode($content));
fclose($myfile);

printf($idx);

?>