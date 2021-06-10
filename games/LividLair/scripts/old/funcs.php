
<?php

function getRealIpAddr()
{
    if (!empty($_SERVER['HTTP_CLIENT_IP']))   //check ip from share internet
    {
      $ip=$_SERVER['HTTP_CLIENT_IP'];
    }
    elseif (!empty($_SERVER['HTTP_X_FORWARDED_FOR']))   //to check ip is pass from proxy
    {
      $ip=$_SERVER['HTTP_X_FORWARDED_FOR'];
    }
    else
    {
      $ip=$_SERVER['REMOTE_ADDR'];
    }
    return $ip;
}

$roomsDir = '../rooms';

function getFileLocation($index) {
    global $roomsDir;
    return $roomsDir . '/room' . $index . '.json';
}

function isJson($elem) { return preg_match('/room[0-9]+.json/', $elem); }

function getRoomIndices() {
    global $roomsDir;
    
    $files = array_diff(scandir($roomsDir), array('..', '.'));

    $files = array_filter($files, isJson);

    foreach ($files as &$value) {
        $value = substr($value, 4, strlen($value) - 9);
    }

    return array_values($files);
}

?>