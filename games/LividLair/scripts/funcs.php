
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

$levelsDir = '../levels/custom';

function getFileLocation($index) {
    global $levelsDir;
    return $levelsDir . '/level' . $index . '.json';
}

function isJson($elem) { return preg_match('/level[0-9]+.json/', $elem); }

function getLevelIndices() {
    global $levelsDir;
    
    $files = array_diff(scandir($levelsDir), array('..', '.'));

    $files = array_filter($files, isJson);

    foreach ($files as &$value) {
        $value = substr($value, 5, strlen($value) - 10);
    }

    return array_values($files);
}

?>