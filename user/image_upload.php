<?php
require_once('config.php');

if(isset($_POST['save']))
{
  $target_dir = "img/";
  $filename = explode('.',$_FILES['image']['name']);
  $ext = $filename[1];
  $imgname = time().'.'.$ext;
  $target_file = $target_dir . $imgname ;
  $cid = $_POST['cid'];
  $name = $_POST['name'];
  $rank = $_POST['rank'];
$phone = $_POST['phone'];
$dur = $_POST['dur'];
$amt = $_POST['amt'];
$rate = $_POST['rate'];
$status = $_POST['status'];
$remark = $_POST['remark'];

  $uploadOk = 1;
  $imageFileType = pathinfo($target_file,PATHINFO_EXTENSION);
  // Check if image file is a actual image or fake image
  $check = getimagesize($_FILES["image"]["tmp_name"]);
  if($check !== false) {
    $text="File is an image - " . $check["mime"] . ".";
    $uploadOk = 1;
  } else {
    $text="File is not an image.";
    $uploadOk = 0;
  }
  // Check if file already exists
  if(file_exists($target_file)) {
    $text="Sorry, file already exists.";
    $uploadOk = 0;
  }
  // Check file size
  if($_FILES["image"]["size"] > 2000000) {
    $text="Sorry, your file is too large.";
    $uploadOk = 0;
  }
  // Allow certain file formats
  if($imageFileType != "jpg" && $imageFileType != "png" && $imageFileType != "jpeg"
  && $imageFileType != "gif" && $imageFileType != "bmp" ) {
    echo "Sorry, only JPG, JPEG, PNG, GIF & BMP files are allowed.";
    $uploadOk = 0;
  }
  // Check if $uploadOk is set to 0 by an error
  if($uploadOk == 0) {
    $_SESSION["error"]=$text;
    header("Location:identity.php"); /* Redirect browser */
    exit();

  // if everything is ok, try to upload file
  }else{
    if (move_uploaded_file($_FILES["image"]["tmp_name"], $target_file)) {
      $path=$imgname;
      $conn->query("INSERT INTO user (image, cid, name, rank, phone, type, amt, rate, dur, coldate, paydate, status, remark)VALUES ('$path','$cid','$name','$rank','$phone','$type','$amt','$rate','$dur','$coldate','$paydate','$status','$remark')");
      $_SESSION['"Success"']='Upload Success...';
      header("Location:index.php"); /* Redirect browser */
      exit();
    } else {
      $_SESSION["err"]=$text;
      header("Location:identity.php"); /* Redirect browser */
      exit();
    }
  }
}