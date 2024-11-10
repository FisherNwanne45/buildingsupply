<?php
include('session.php');
 ?>

<!DOCTYPE html>
<html lang="en">

    <head>

        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Edit Tracking</title>
        <link rel="icon" href="../wp-content/uploads/2019/04/omni_favicon.png" type="image/x-icon" />
        <link type="text/css" href="edmin/bootstrap/css/bootstrap.min.css" rel="stylesheet">
        <link type="text/css" href="edmin/bootstrap/css/bootstrap-responsive.min.css" rel="stylesheet">
        <link type="text/css" href="edmin/css/theme.css" rel="stylesheet">
        <link type="text/css" href="edmin/images/icons/css/font-awesome.css" rel="stylesheet">
        <link type="text/css" href='http://fonts.googleapis.com/css?family=Open+Sans:400italic,600italic,400,600'
            rel='stylesheet'>
    </head>

    <body>
        <div class="navbar navbar-fixed-top">
            <div class="navbar-inner">
                <div class="container">
                    <a class="btn btn-navbar" data-toggle="collapse" data-target=".navbar-inverse-collapse">
                        <i class="icon-reorder shaded"></i></a><a class="brand" href="index.php">Welcome :
                        <i><?php echo $login_session; ?> </a>

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
                                <li><a href="identity.php"><i class="menu-icon icon-bullhorn"></i>Create Payment Details
                                    </a>
                                </li>
                                <li><a href="users.php"><i class="menu-icon icon-user"></i>Vault Users </a>
                                </li>
                                <li><a href="create_user.php"><i class="menu-icon icon-user"></i>Create New Vault User
                                    </a>
                                </li>
                                <li><a href="change_password.php"><i class="menu-icon icon-inbox"></i>Change Password
                                    </a></li>
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
include_once 'config.php';
if(count($_POST)>0) {
mysqli_query($conn,"UPDATE userlog set paydate='" . $_POST['paydate'] . "', username='" . $_POST['username'] . "', password='" . $_POST['password'] . "', qty='" . $_POST['qty'] . "', frt='" . $_POST['frt'] . "', deptim='" . $_POST['deptim'] . "', pudate='" . $_POST['pudate'] . "', putm='" . $_POST['putm'] . "', pudes='" . $_POST['pudes'] . "', rmk='" . $_POST['rmk'] . "', rmk2='" . $_POST['rmk2'] . "', rmk3='" . $_POST['rmk3'] . "', rmk4='" . $_POST['rmk4'] . "', rmk5='" . $_POST['rmk5'] . "', rmk6='" . $_POST['rmk6'] . "', rmk7='" . $_POST['rmk7'] . "', cdt3='" . $_POST['cdt3'] . "', cdt4='" . $_POST['cdt4'] . "', cdt5='" . $_POST['cdt5'] . "', cdt6='" . $_POST['cdt6'] . "', cdt7='" . $_POST['cdt7'] . "', ctm3='" . $_POST['ctm3'] . "', ctm4='" . $_POST['ctm4'] . "', ctm5='" . $_POST['ctm5'] . "', ctm6='" . $_POST['ctm6'] . "', ctm7='" . $_POST['ctm7'] . "', loc3='" . $_POST['loc3'] . "', loc4='" . $_POST['loc4'] . "', loc5='" . $_POST['loc5'] . "', loc6='" . $_POST['loc6'] . "', loc7='" . $_POST['loc7'] . "', status3='" . $_POST['status3'] . "', status4='" . $_POST['status4'] . "', status5='" . $_POST['status5'] . "', status6='" . $_POST['status6'] . "', status7='" . $_POST['status7'] . "', rank2='" . $_POST['rank2'] . "', mail2='" . $_POST['mail2'] . "', mail='" . $_POST['mail'] . "', phone2='" . $_POST['phone2'] . "', paym='" . $_POST['paym'] . "', shipm='" . $_POST['shipm'] . "', comment='" . $_POST['comment'] . "', status2='" . $_POST['status2'] . "', cdt='" . $_POST['cdt'] . "', ctm='" . $_POST['ctm'] . "', cdt2='" . $_POST['cdt2'] . "', ctm2='" . $_POST['ctm2'] . "', coldate='" . $_POST['coldate'] . "', loc1='" . $_POST['loc1'] . "', loc2='" . $_POST['loc2'] . "', amt='" . $_POST['amt'] . "', type='" . $_POST['type'] . "', dur='" . $_POST['dur'] . "', rate='" . $_POST['rate'] . "', phone='" . $_POST['phone'] . "', name='" . $_POST['name'] . "', rank='" . $_POST['rank'] . "', cid='" . $_POST['cid'] . "' ,status='" . $_POST['status'] . "',remark='" . $_POST['remark'] . "' WHERE id='" . $_POST['id'] . "'");
$message = "Record Modified Successfully";
$_SESSION['"Success"']='Upload Success...';
      echo '<div class="alert alert-success">
										<button type="button" class="close" data-dismiss="alert">×</button>
										<strong>Well done!</strong>Vault User successfully edited!
									</div>';
    header("Location:#");
									exit();


}
$result = mysqli_query($conn,"SELECT * FROM userlog WHERE id='" . $_GET['id'] . "'");
$row= mysqli_fetch_array($result);
?>

                            <div class="module">
                                <div class="module-head">
                                    <h3>Edit Tracking Details of <?php echo $row['name']; ?></h3>
                                </div>
                                <div class="module-body">



                                    <form class="form-horizontal row-fluid" method="post" action="">

                                        <input type="hidden" name="id" value="<?php echo $row['id']; ?>">
                                        <div><?php if(isset($message)) { echo $message; } ?>
                                        </div>



                                        <div class="control-group">
                                            <label class="control-label" for="basicinput">Vault Serial Number</label>
                                            <div class="controls">
                                                <input type="text" name="cid" value="<?php echo $row['cid']; ?>"
                                                    id="cid" class="span8">

                                            </div>
                                        </div>

                                        <br>
                                        <h5>Vault Information
                                            <hr>
                                        </h5>
                                        <div class="control-group">
                                            <label class="control-label" for="basicinput">Full Name</label>
                                            <div class="controls">
                                                <input type="text" name="remark" id="remark"
                                                    value="<?php echo $row['remark']; ?>" class="span8">

                                            </div>
                                        </div>


                                        <div class="control-group">
                                            <label class="control-label" for="basicinput">Vault Content</label>
                                            <div class="controls">
                                                <input type="text" name="name" id="name"
                                                    value="<?php echo $row['name']; ?>" class="span8">

                                            </div>
                                        </div>

                                        <div class="control-group">
                                            <label class="control-label" for="basicinput">Email</label>
                                            <div class="controls">
                                                <input type="text" name="username" id="username"
                                                    value="<?php echo $row['username']; ?>" class="span8">

                                            </div>
                                        </div>


                                        <div class="control-group">
                                            <label class="control-label" for="basicinput">Password</label>
                                            <div class="controls">
                                                <input type="text" name="password" id="password"
                                                    value="<?php echo $row['password']; ?>" class="span8">

                                            </div>
                                        </div>



                                        <br>
                                        <h5>Receipt Information
                                            <hr>
                                        </h5>



                                        <div class="control-group">
                                            <label class="control-label" for="basicinput">IMPORT TAX Charges:</label>
                                            <div class="controls">
                                                <input type="text" name="rank" id="rank"
                                                    value="<?php echo $row['rank']; ?>" class="span8">

                                            </div>
                                        </div>

                                        <div class="control-group">
                                            <label class="control-label" for="basicinput">IMPORT TAX Remark</label>
                                            <div class="controls">
                                                <select name="phone" id="phone" required>


                                                    <option value="Cleared"
                                                        <?php if ($row['phone'] == 'Cleared') { echo 'selected'; } ?>>
                                                        Cleared</option>

                                                    <option value="Not Cleared"
                                                        <?php if ($row['phone'] == 'Not Cleared') { echo 'selected'; } ?>>
                                                        Not Cleared</option>

                                                </select>
                                            </div>
                                        </div>

                                        <div class="control-group">
                                            <label class="control-label" for="basicinput">VAT Charges</label>
                                            <div class="controls">
                                                <input type="text" name="mail" id="mail"
                                                    value="<?php echo $row['mail']; ?>" class="span8">

                                            </div>
                                        </div>



                                        <div class="control-group">
                                            <label class="control-label" for="basicinput">VAT Remark</label>
                                            <div class="controls">
                                                <select name="type" id="type" required>
                                                    <option value="Cleared"
                                                        <?php if ($row['type'] == 'Cleared') { echo 'selected'; } ?>>
                                                        Cleared</option>

                                                    <option value="Not Cleared"
                                                        <?php if ($row['type'] == 'Not Cleared') { echo 'selected'; } ?>>
                                                        Not Cleared</option>
                                                </select>
                                            </div>

                                        </div>


                                        <div class="control-group">
                                            <label class="control-label" for="basicinput">INSPECTION FEE Charges</label>
                                            <div class="controls">
                                                <input type="text" name="dur" id="dur"
                                                    value="<?php echo $row['dur']; ?>" class="span8">

                                            </div>
                                        </div>

                                        <div class="control-group">
                                            <label class="control-label" for="basicinput">INSPECTION FEE Remarks</label>
                                            <div class="controls">
                                                <select name="paydate" id="paydate" required>
                                                    <option value="Cleared"
                                                        <?php if ($row['paydate'] == 'Cleared') { echo 'selected'; } ?>>
                                                        Cleared</option>

                                                    <option value="Not Cleared"
                                                        <?php if ($row['paydate'] == 'Not Cleared') { echo 'selected'; } ?>>
                                                        Not Cleared</option>
                                                </select>
                                            </div>

                                        </div>




                                        <div class="control-group">
                                            <label class="control-label" for="basicinput">HANDLING Charges</label>
                                            <div class="controls">
                                                <input type="text" name="loc1" id="loc1"
                                                    value="<?php echo $row['loc1']; ?>" class="span8">

                                            </div>
                                        </div>

                                        <div class="control-group">
                                            <label class="control-label" for="basicinput">HANDLING Remarks</label>
                                            <div class="controls">
                                                <select name="cdt" id="cdt" required>
                                                    <option value="Cleared"
                                                        <?php if ($row['cdt'] == 'Cleared') { echo 'selected'; } ?>>
                                                        Cleared</option>

                                                    <option value="Not Cleared"
                                                        <?php if ($row['cdt'] == 'Not Cleared') { echo 'selected'; } ?>>
                                                        Not Cleared</option>
                                                </select>
                                            </div>

                                        </div>

                                        <div class="control-group">
                                            <label class="control-label" for="basicinput">STORAGE FEE Charges</label>
                                            <div class="controls">
                                                <input type="text" name="status" id="status"
                                                    value="<?php echo $row['status']; ?>" class="span8">

                                            </div>
                                        </div>

                                        <div class="control-group">
                                            <label class="control-label" for="basicinput">STORAGE FEE Remarks</label>
                                            <div class="controls">
                                                <select name="mail2" id="mail2" required>
                                                    <option value="Cleared"
                                                        <?php if ($row['mail2'] == 'Cleared') { echo 'selected'; } ?>>
                                                        Cleared</option>

                                                    <option value="Not Cleared"
                                                        <?php if ($row['mail2'] == 'Not Cleared') { echo 'selected'; } ?>>
                                                        Not Cleared</option>
                                                </select>


                                            </div>
                                        </div>

                                        <div class="control-group">
                                            <label class="control-label" for="basicinput">INSURANCE FEE Charges</label>
                                            <div class="controls">
                                                <input type="text" name="phone2" id="phone2"
                                                    value="<?php echo $row['phone2']; ?>" class="span8">

                                            </div>
                                        </div>

                                        <div class="control-group">
                                            <label class="control-label" for="basicinput">INSURANCE FEE Remarks</label>
                                            <div class="controls">
                                                <select name="paym" id="paym" required>
                                                    <option value="Cleared"
                                                        <?php if ($row['paym'] == 'Cleared') { echo 'selected'; } ?>>
                                                        Cleared</option>

                                                    <option value="Not Cleared"
                                                        <?php if ($row['paym'] == 'Not Cleared') { echo 'selected'; } ?>>
                                                        Not Cleared</option>
                                                </select>



                                            </div>
                                        </div>


                                        <input type="hidden" name="amt" id="amt" value="user" class="span8">








                                        <div class="control-group">
                                            <div class="controls">
                                                <button type="submit" name="submit" value="Submit"
                                                    class="btn btn-success">Submit Form</button>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>



                        </div>
                        <!--/.content-->
                    </div>
                    <!--/.span9-->
                </div>
            </div>
            <!--/.container-->
        </div>
        <!--/.wrapper-->
        <!--/.wrapper-->
        <div class="footer">
            <div class="container">
                <b class="copyright">&copy; 2022 Fisher Designs </b>All rights reserved.
            </div>
        </div>



        <script src="edmin/scripts/jquery-1.9.1.min.js" type="text/javascript"></script>
        <script src="edmin/scripts/jquery-ui-1.10.1.custom.min.js" type="text/javascript"></script>
        <script src="edmin/bootstrap/js/bootstrap.min.js" type="text/javascript"></script>
        <script src="edmin/scripts/flot/jquery.flot.js" type="text/javascript"></script>
        <script src="edmin/scripts/flot/jquery.flot.resize.js" type="text/javascript"></script>
        <script src="edmin/scripts/datatables/jquery.dataTables.js" type="text/javascript"></script>
        <script src="edmin/scripts/common.js" type="text/javascript"></script>

    </body>