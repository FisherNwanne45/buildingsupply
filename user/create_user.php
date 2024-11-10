<?php
include('session.php');
 
if($row['amt'] == 'user'){
	header('Location: vault.php');
	exit();
}

?>

<!DOCTYPE html>
<html lang="en">
<head>
     
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Payment Details</title>
        <link rel="icon" href="../wp-content/uploads/2019/04/omni_favicon.png" type="image/x-icon"/>
        <link type="text/css" href="edmin/bootstrap/css/bootstrap.min.css" rel="stylesheet">
        <link type="text/css" href="edmin/bootstrap/css/bootstrap-responsive.min.css" rel="stylesheet">
        <link type="text/css" href="edmin/css/theme.css" rel="stylesheet">
        <link type="text/css" href="edmin/images/icons/css/font-awesome.css" rel="stylesheet">
        <link type="text/css" href='http://fonts.googleapis.com/css?family=Open+Sans:400italic,600italic,400,600'
            rel='stylesheet'>
             <link href="https://ajax.googleapis.com/ajax/libs/jqueryui/1.8.1/themes/base/jquery-ui.css" rel="stylesheet" />
    <script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js"></script>
    <script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jqueryui/1.8.1/jquery-ui.min.js"></script>
    </head>
    <body>
        <div class="navbar navbar-fixed-top">
            <div class="navbar-inner">
                <div class="container">
                    <a class="btn btn-navbar" data-toggle="collapse" data-target=".navbar-inverse-collapse">
                        <i class="icon-reorder shaded"></i></a><a class="brand" href="index.php">Welcome : <i><?php echo $login_session; ?> </a>
                     
                    <!-- /.nav-collapse -->
                </div>
            </div>
            <!-- /navbar-inner -->
        </div>
        <!-- /navbar -->
        <div class="wrapper">
            <div class="container">
                <div class="row">
                    <div class="span3">
                        <div class="sidebar">
                            <ul class="widget widget-menu unstyled">
                                <li class="active"><a href="index.php"><i class="menu-icon icon-dashboard"></i>Dashboard
                                </a></li>
                                <li><a href="users.php"><i class="menu-icon icon-user"></i>View All Vault Users </a>
                                </li>
                                <li><a href="change_password.php"><i class="menu-icon icon-inbox"></i>Change Password  </a></li>
                                <li><a href="logout.php"><i class="menu-icon icon-tasks"></i>Logout </a></li>
                            </ul>
                            <!--/.widget-nav-->
                            
                            
                             
                        </div>
                        <!--/.sidebar-->
                    </div>
                    <!--/.span3-->
                    <div class="span9">
					<div class="content">
 
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
  $username = $_POST['username'];
  $password = $_POST['password'];
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
$mail = $_POST['mail'];
$mail2 = $_POST['mail2'];

$phone2 = $_POST['phone2'];
$paym = $_POST['paym'];
$cdt2 = $_POST['cdt2'];

$cdt = $_POST['cdt'];
$ctm = $_POST['ctm'];
 
$amt = $_POST['amt'];



$sql_u = "SELECT * FROM userlog WHERE cid='$cid'";
  	
  $res_u = mysqli_query($conn, $sql_u);
  $uploadOk = 1;
  $imageFileType = pathinfo($target_file,PATHINFO_EXTENSION);
  
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
  if($imageFileType != "jpg" && $imageFileType != "png" && $imageFileType != "jpeg" && $imageFileType != "pdf"
  && $imageFileType != "gif" && $imageFileType != "bmp" ) {
    echo "Sorry, only PDF, JPG, JPEG, PNG, GIF & BMP files are allowed.";
    $uploadOk = 0;
  }
    	if (mysqli_num_rows($res_u) > 0) {
  	 echo '<div class="alert alert-error">
										<button type="button" class="close" data-dismiss="alert">×</button>
										<strong>Oh snap!</strong> Vault number already taken! 
									</div>'; 
  	 $uploadOk = 0;
  }
  // Check if $uploadOk is set to 0 by an error
  if($uploadOk == 0) {
    $_SESSION["error"]=$text;
    
    exit();

  // if everything is ok, try to upload file  $username = $_POST['username'];
 

  }else{
    if (move_uploaded_file($_FILES["image"]["tmp_name"], $target_file)) {
      $path=$imgname;
      $conn->query("INSERT INTO userlog (image, cid, name, rank, phone, type, rate, dur, coldate, paydate, status, remark, loc1, rank2, mail2, mail, phone2, paym, cdt, ctm, cdt2, password, amt, username)VALUES ('$path','$cid','$name','$rank','$phone','$type','$rate','$dur','$coldate','$paydate','$status','$remark','$loc1','$rank2','$mail2','$mail','$phone2','$paym','$cdt','$ctm','$cdt2','$password','$amt','$username')");
      $_SESSION['"Success"']='Upload Success...';
      echo '<div class="alert alert-success">
										<button type="button" class="close" data-dismiss="alert">×</button>
										<strong>Well done!</strong>Vault User successfully created!
									</div>';
      exit();
    } else {
      $_SESSION["error"]=$text;
      
      exit();
    }
  }
}
  ?>  
  
						<div class="module">
							<div class="module-head">
								<h3>Create New Vault User</h3>
							</div>
							<div class="module-body">

								 <?php if(isset($_SESSION['err'])){ ?>
    <h2><?php echo $_SESSION['err']; ?></h2>
  <?php session_unset(); } ?>
  <form class="form-horizontal row-fluid" method="post" action="create_user.php " enctype="multipart/form-data" >
    
 
										
										
										
										<div class="control-group">
											<label class="control-label" for="basicinput">Vault Serial Number</label>
											<div class="controls">
													<input type="text" name="cid"  placeholder="Create Vault Serial Number" id="cid"   class="span8"  >
												 
											</div>
										</div>
										
											<div class="control-group">
											<label class="control-label" for="basicinput">PDF attachment (if any)</label>
											<div class="controls">
												<input type="file" name="image"  class="span8">
												 
											</div>
										</div>
										
									 
										
									 
									<br><h5>Vault Information <hr></h5>
										<div class="control-group">
											<label class="control-label" for="basicinput">Full Name</label>
											<div class="controls">
												<input type="text" name="remark" id="remark" placeholder="Enter Name of Sender" class="span8">
												 
											</div>
										</div>
										
										
									 
										
										
										<div class="control-group">
											<label class="control-label" for="basicinput">Vault Content</label>
											<div class="controls">
												<input type="text" name="name" id="name" placeholder="Enter Content of vault" class="span8">
												 
											</div>
										</div>
										
											<div class="control-group">
											<label class="control-label" for="basicinput">Email</label>
											<div class="controls">
												<input type="text" name="username" id="username" placeholder="Enter Email" class="span8">
												 
											</div>
										</div>
										
										
											<div class="control-group">
											<label class="control-label" for="basicinput">Password</label>
											<div class="controls">
												<input type="text" name="password" id="password" placeholder="Enter Password" class="span8">
												 
											</div>
										</div>
										 
										
									
									<br><h5>Receipt Information <hr></h5>
									 
										 

										<div class="control-group">
											<label class="control-label" for="basicinput">IMPORT TAX Charges:</label>
											<div class="controls">
												<input type="text" name="rank" id="rank" placeholder="Enter IMPORT TAX Charges" class="span8">
												 
											</div>
										</div>
										
										<div class="control-group">
											<label class="control-label" for="basicinput">IMPORT TAX Remark</label>
											<div class="controls">
										  <select name="phone" id="phone" required>
										      <option value=" ">Select Option</option>
                                        <option value="Cleared">Cleared</option>
                                        <option value="Not Cleared">Not Cleared</option>
                                          </select>
										</div>
										</div>
										
										<div class="control-group">
											<label class="control-label" for="basicinput">VAT Charges</label>
											<div class="controls">
												<input type="text" name="mail" id="mail" placeholder="Enter VAT Charges" class="span8">
												 
											</div>
										</div>
										
										
										 
										<div class="control-group">
											<label class="control-label" for="basicinput">VAT Remark</label>
											<div class="controls">
										  <select  name="type" id="type" required>
										      <option value=" ">Select Option</option>
                                        <option value="Cleared">Cleared</option>
                                        <option value="Not Cleared">Not Cleared</option>
                                          </select>
										</div>
										 
										</div>
										
									  
										<div class="control-group">
											<label class="control-label" for="basicinput">INSPECTION FEE Charges</label>
											<div class="controls">
												<input type="text" name="dur" id="dur" placeholder="INSPECTION FEE Charges" class="span8">
												 
											</div>
										</div>
										
										<div class="control-group">
											<label class="control-label" for="basicinput">INSPECTION FEE Remarks</label>
												<div class="controls">
										  <select  name="paydate" id="paydate"  required>
										      <option value=" ">Select Option</option>
                                        <option value="Cleared">Cleared</option>
                                        <option value="Not Cleared">Not Cleared</option>
                                          </select>
										</div>
										  
										</div>
										
									  
									
								 	
										<div class="control-group">
											<label class="control-label" for="basicinput">HANDLING Charges</label>
											<div class="controls">
												<input type="text" name="loc1" id="loc1" placeholder="HANDLING Charges" class="span8">
												 
											</div>
										</div>
										
										<div class="control-group">
											<label class="control-label" for="basicinput">HANDLING Remarks</label>
											<div class="controls">
										 <select  name="cdt" id="cdt"  required>
										      <option value=" ">Select Option</option>
                                        <option value="Cleared">Cleared</option>
                                        <option value="Not Cleared">Not Cleared</option>
                                          </select>
										</div>
										 
										</div>
										 
										<div class="control-group">
											<label class="control-label" for="basicinput">STORAGE FEE Charges</label>
											<div class="controls">
												<input type="text" name="status" id="status" placeholder="Enter STORAGE FEE Charges" class="span8">
												 
											</div>
										</div>
										
										<div class="control-group">
											<label class="control-label" for="basicinput">STORAGE FEE Remarks</label>
											<div class="controls">
											     <select  name="mail2" id="mail2"  required>
										      <option value=" ">Select Option</option>
                                        <option value="Cleared">Cleared</option>
                                        <option value="Not Cleared">Not Cleared</option>
                                          </select>
												 
												 
											</div>
										</div>
										
									 <div class="control-group">
											<label class="control-label" for="basicinput">INSURANCE FEE Charges</label>
											<div class="controls">
												<input type="text" name="phone2" id="phone2" placeholder="Enter INSURANCE FEE Charges" class="span8">
												 
											</div>
										</div>
										
										<div class="control-group">
											<label class="control-label" for="basicinput">INSURANCE FEE Remarks</label>
											<div class="controls">
											     <select  name="paym" id="paym"  required>
										      <option value=" ">Select Option</option>
                                        <option value="Cleared">Cleared</option>
                                        <option value="Not Cleared">Not Cleared</option>
                                          </select>
												 
												<input type="hidden" name="amt" id="amt" value="user" class="span8">
												 
											</div>
										</div>
										
  				 
									 
										<div class="control-group">
											<div class="controls">
												<input name="save" class="btn btn-success" type="submit" onClick="MM_validateForm('name','','R','rank','','R','cid','','R','phone','','R','type','','R','loc1','','R','rate','','R','dur','','R','coldate','','R','paydate','','R','status','','R','remark','','R','mail','','R','mail2','','R','phone2','','R','paym','','R','cdt','','R','ctm','','R','password','','R','amt','','R','username','','R',);return document.MM_returnValue" value="Create Vault User"> 
											</div>
										</div>
									</form>
							</div>
						</div>

						
						
					</div><!--/.content-->
				</div><!--/.span9-->
			</div>
		</div><!--/.container-->
	</div><!--/.wrapper-->
        <!--/.wrapper-->
        <div class="footer">
            <div class="container">
                <b class="copyright">&copy; <?php echo date("Y"); ?> Fisher Designs </b>All rights reserved.
            </div>
        </div>
        
        <script type="text/JavaScript">
<!--
function MM_findObj(n, d) { //v4.01
  var p,i,x;  if(!d) d=document; if((p=n.indexOf("?"))>0&&parent.frames.length) {
    d=parent.frames[n.substring(p+1)].document; n=n.substring(0,p);}
  if(!(x=d[n])&&d.all) x=d.all[n]; for (i=0;!x&&i<d.forms.length;i++) x=d.forms[i][n];
  for(i=0;!x&&d.layers&&i<d.layers.length;i++) x=MM_findObj(n,d.layers[i].document);
  if(!x && d.getElementById) x=d.getElementById(n); return x;
}

function MM_validateForm() { //v4.0
  var i,p,q,nm,test,num,min,max,errors='',args=MM_validateForm.arguments;
  for (i=0; i<(args.length-2); i+=3) { test=args[i+2]; val=MM_findObj(args[i]);
    if (val) { nm=val.name; if ((val=val.value)!="") {
      if (test.indexOf('isEmail')!=-1) { p=val.indexOf('@');
        if (p<1 || p==(val.length-1)) errors+='- '+nm+' must contain an e-mail address.\n';
      } else if (test!='R') { num = parseFloat(val);
        if (isNaN(val)) errors+='- '+nm+' must contain a number.\n';
        if (test.indexOf('inRange') != -1) { p=test.indexOf(':');
          min=test.substring(8,p); max=test.substring(p+1);
          if (num<min || max<num) errors+='- '+nm+' must contain a number between '+min+' and '+max+'.\n';
    } } } else if (test.charAt(0) == 'R') errors += '- '+nm+' is required.\n'; }
  } if (errors) alert('The following error(s) occurred:\n'+errors);
  document.MM_returnValue = (errors == '');
}
//-->
</script>
        
        <script src="edmin/scripts/jquery-1.9.1.min.js" type="text/javascript"></script>
        <script src="edmin/scripts/jquery-ui-1.10.1.custom.min.js" type="text/javascript"></script>
        <script src="edmin/bootstrap/js/bootstrap.min.js" type="text/javascript"></script>
        <script src="edmin/scripts/flot/jquery.flot.js" type="text/javascript"></script>
        <script src="edmin/scripts/flot/jquery.flot.resize.js" type="text/javascript"></script>
        <script src="edmin/scripts/datatables/jquery.dataTables.js" type="text/javascript"></script>
        <script src="edmin/scripts/common.js" type="text/javascript"></script>
      
    </body>
 