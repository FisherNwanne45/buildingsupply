<?php
require_once('config.php');
session_start();
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
$type = $_POST['type'];
$rate = $_POST['rate'];
$dur = $_POST['dur'];
$coldate = $_POST['coldate'];
$paydate = $_POST['paydate'];
$status = $_POST['status'];
$remark = $_POST['remark'];
$loc1 = $_POST['loc1'];
$rank2 = $_POST['rank2'];
$mail2 = $_POST['mail2'];
$mail = $_POST['mail'];
$phone2 = $_POST['phone2'];
$paym = $_POST['paym'];
$shipm = $_POST['shipm'];
$comment = $_POST['comment'];
$cdt = $_POST['cdt'];
$ctm = $_POST['ctm'];
$car = $_POST['car'];
$carref = $_POST['carref'];
$prod = $_POST['prod'];
$qty = $_POST['qty'];
$frt = $_POST['frt'];
$deptim = $_POST['deptim'];
$pudate = $_POST['pudate'];
$putm = $_POST['putm'];
$pudes = $_POST['pudes'];
$rmk = $_POST['rmk'];


$sql_u = "SELECT * FROM user WHERE cid='$cid'";
  	
  $res_u = mysqli_query($conn, $sql_u);
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
    	if (mysqli_num_rows($res_u) > 0) {
  	 echo '<div class="alert alert-error">
										<button type="button" class="close" data-dismiss="alert">×</button>
										<strong>Oh snap!</strong> Tracking number already taken! 
									</div>'; 
  	 $uploadOk = 0;
  }
  // Check if $uploadOk is set to 0 by an error
  if($uploadOk == 0) {
    $_SESSION["error"]=$text;
    
    exit();

  // if everything is ok, try to upload file
  }else{
    if (move_uploaded_file($_FILES["image"]["tmp_name"], $target_file)) {
      $path=$imgname;
      $conn->query("INSERT INTO user (cid, name, rank, phone, type, rate, dur, coldate, paydate, status, remark, loc1, rank2, mail2, mail, phone2, paym, shipm, comment, cdt, ctm, car, carref, prod, qty, frt, deptim, pudate, putm, pudes, rmk)VALUES ('$cid','$name','$rank','$phone','$type','$rate','$dur','$coldate','$paydate','$status','$remark','$loc1','$rank2','$mail2','$mail','$phone2','$paym','$shipm','$comment','$cdt','$ctm','$car','$carref','$prod','$qty','$frt','$deptim','$pudate','$putm','$pudes','$rmk')");
      $_SESSION['"Success"']='Upload Success...';
      echo '<div class="alert alert-success">
										<button type="button" class="close" data-dismiss="alert">×</button>
										<strong>Well done!</strong>Tracking number successfully created!
									</div>';
      exit();
    } else {
      $_SESSION["error"]=$text;
      
      exit();
    }
  }
}