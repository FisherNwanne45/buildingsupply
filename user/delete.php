<?php
session_start();
require_once 'config.php';
include_once ('session.php');

if(isset($_GET['id'])) {
    $id = $_GET['id'];

     
    $sql = 'DELETE FROM user WHERE id = ?';
    $delete = $conn->prepare($sql);
    $delete->bind_param('i', $id);
    $delete->execute();

    if($delete->affected_rows > 0) {
        header('Location: index.php');
    }
}

?>
