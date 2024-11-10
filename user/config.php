<?php
$servername = "localhost"; 
$username = "u450407773_jj"; //= "root";
$password = "~5v8tQ4M"; //= "";
$dbname = "u450407773_jj"; //"loan";
 

	// Create connection
	$conn = new mysqli($servername, $username, $password, $dbname);

	// Check connection
	if ($conn->connect_error) 
	{
	    die("Connection failed: " . $conn->connect_error);
	}