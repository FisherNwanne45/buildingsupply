<?php
include('session.php');
?>

<?php session_start(); ?>
<!DOCTYPE html>
<html lang="en">

<head>

    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <meta name="description" content="">
    <meta name="author" content="">

    <title>Contact Info</title>

    <!-- Bootstrap core CSS -->
    <link href="vendor/bootstrap/css/bootstrap.min.css" rel="stylesheet">

    <!-- Custom styles for this template -->
    <link href="css/simple-sidebar.css" rel="stylesheet">

</head> 


<body>

    <div id="wrapper">

        <!-- Sidebar -->
        <div id="sidebar-wrapper">
            <ul class="sidebar-nav">
                <li class="sidebar-brand">
                    <a href="#">
                        Admin Area
                    </a>
                </li>
                <li>
                    <a href="identity.php">Add New Loan</a>
                </li>
                <li>
                    <a href="view.php">View all Loans</a>
                </li>
                 <li>
                    <a href="settings.php">Site Settings</a>
                </li>
                <li>
                    <a href="change_password.php">Change Password</a>
                </li>
               
                
                <li>
                    <a href="logout.php">Log Out</a>
                </li>
            </ul>
        </div>
        
        
        
        
        
        <!-- Page Content -->
        <div id="page-content-wrapper">
            <div class="container-fluid">
                <a href="identity.php" class="btn btn-secondary" id="menu-toggle"> 	&#9776; Main Menu </a>
                <b id="welcome">Welcome : <i><?php echo $login_session; ?></i></b>
                <hr>
                <h2>View Contact Information</h2>

 
</div>

          <br><br>

    
    
    
  <?php if(isset($_SESSION['Success'])){ ?>
    <h2><?php echo $_SESSION['Success']; ?></h2>
  <?php session_unset(); } ?>

  <table border="1" width="100%">
    <tr>
       
       <td>Site Name</td> 
      <td>Address</td>
      <td>Phone</td>
       
          <td>Email</td> 
             <td>Edit</td>
      
    </tr>
      <?php
        include('config.php');
        $result = $conn->query("SELECT * FROM site");
        if(!$result->num_rows > 0){ echo '<h2 style="text-align:center;">No Data Found</h2>'; }
        while($row = $result->fetch_assoc())
        {
      ?>
        <tr>
               
          <td><?php echo $row['name']; ?></a></td> 
          <td><?php echo $row['addr']; ?></a></td> 
          <td><?php echo $row['phone']; ?></a></td>  
     
          <td><?php echo $row['email']; ?></a></td>
              <td>
    <a href="edit-settings.php?id=<?php echo $row['id']; ?>" name="edit" rel="tooltip"  class="btn btn-simple btn-danger btn-icon " title="Edit Account">&#x270E; Edit Details</a>
</td> 
        </tr>
      <?php } ?>
  </table>
   
   
     <!-- Template Main Javascript File -->
  <script src="js/main.js"></script>

<script src="vendor/jquery/jquery.min.js"></script>
    <script src="vendor/bootstrap/js/bootstrap.bundle.min.js"></script>

   <!-- Menu Toggle Script -->
    <script>
    $("#menu-toggle").click(function(e) {
        e.preventDefault();
        $("#wrapper").toggleClass("toggled");
    });
    </script>
</body>
