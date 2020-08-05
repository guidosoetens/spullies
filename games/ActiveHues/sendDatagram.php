<?php

$message = $_REQUEST["msg"];
// $address = $_REQUEST["ip"];

$address = '127.0.0.1';
// $address = '212.114.116.228';
$port = 5002;

try {

    //broadcast message:
    $sock = socket_create(AF_INET, SOCK_DGRAM, SOL_UDP); 
    socket_set_option($sock, SOL_SOCKET, SO_BROADCAST, 1);
    // socket_sendto($sock, $message, strlen($message), 0, $address, $port);
    socket_sendto($sock, $message, strlen($message), 0, '255.255.255.255', $port);

    //sample spullies:
    $filename = "testje.json";
    file_put_contents($filename, $message);
}
catch (Exception $e) {
    echo "Caught exception " + $e;
}

?>