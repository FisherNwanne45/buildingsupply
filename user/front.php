<?php
include('config.php');

if (session_status() == PHP_SESSION_NONE) {
    session_start();
}

// Establishing Connection with Server by passing server_name, user_id and password as a parameter
$connection = mysqli_connect($servername, $username, $password, $dbname);

// Checking Connection
if (!$connection) {
    die("Connection failed: " . mysqli_connect_error());
}

// Selecting Database
$db = mysqli_select_db($connection, "$dbname");

// Check if session variable 'login_user' is set
if (isset($_SESSION['login_user'])) {
    // Storing Session
    $user_check = $_SESSION['login_user'];
    // SQL Query To Fetch Complete Information Of User
    $ses_sql = mysqli_query($connection, "SELECT * FROM userlog WHERE username='$user_check'");
    $row = mysqli_fetch_assoc($ses_sql);
    $login_session = $row['username'];
    $id = $row['id'];
} else {
    // Handle the case where the session variable is not set
    $login_session = null;
    $id = null;
}
?>