<?php session_start(); 
error_reporting(0); 
require_once 'config.php';
include_once ('front.php');


        $result = $conn->query("SELECT * FROM site");
        if(!$result->num_rows > 0){ echo '<h2 style="text-align:center;">No Data Found</h2>'; }
        while($row = $result->fetch_assoc())
        {
      ?>
<!DOCTYPE html>
<html lang="en" style="height: 100%;">

    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">

        <link rel="stylesheet" href="./result_files/css">
        <title> Track Result</title>
        <link href="../images/favicon.png" rel="shortcut icon">

        <meta name="viewport" content="width=device-width, initial-scale=1">

        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
        <meta http-equiv="x-ua-compatible" content="ie=edge">
        <link href='https://fonts.googleapis.com/css?family=Libre Barcode 128 Text' rel='stylesheet'>
        <link href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" rel="stylesheet"
            type="text/css">
        <link href="https://use.fontawesome.com/releases/v5.7.2/css/all.css" rel="stylesheet" type="text/css">
        <link src="http://maxcdn.bootstrapcdn.com/font-awesome/4.1.0/css/font-awesome.min.css" rel="stylesheet">

        <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.bundle.min.js"
            type="text/javascript"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js" type="text/javascript"></script>
        <link rel="stylesheet" href="./result_files/style.css" type="text/css" media="all">
        <link rel="stylesheet" href="./result_files/style2.css" type="text/css">
        <!--// css -->
        <link rel="stylesheet" href="./result_files/owl.carousel.css" type="text/css" media="all">
        <link href="./result_files/owl.theme.css" rel="stylesheet">
        <link type="text/css" rel="stylesheet" href="./result_files/cm-overlay.css">

        <link href="./result_files/css(1)" rel="stylesheet">
        <link href="./result_files/css(2)" rel="stylesheet" type="text/css">
        <!-- //font -->
        <script src="./result_files/jquery-1.11.1.min.js.download"></script>
        <script src="./result_files/bootstrap.js.download"></script>
        <!-- menu -->

        <style>
        @import url('https://fonts.googleapis.com/css?family=Open+Sans&display=swap');

        body {
            background-color: #eeeeee;
            font-family: 'Open Sans', serif
        }

        body2 {
            font-family: 'Libre Barcode 128 Text';
            font-size: 22px;
        }

        .container {
            margin-top: 50px;
            margin-bottom: 50px
        }

        .col {

            margin-bottom: 20px
        }

        .card {
            position: relative;
            display: -webkit-box;
            display: -ms-flexbox;
            display: flex;
            -webkit-box-orient: vertical;
            -webkit-box-direction: normal;
            -ms-flex-direction: column;
            flex-direction: column;
            min-width: 0;
            word-wrap: break-word;
            background-color: #fff;
            background-clip: border-box;
            border: 1px solid rgba(0, 0, 0, 0.1);
            border-radius: 0.10rem
        }

        .card-header:first-child {
            border-radius: calc(0.37rem - 1px) calc(0.37rem - 1px) 0 0
        }

        .card-header {
            padding: 0.75rem 1.25rem;
            margin-bottom: 0;
            background-color: #fff;
            border-bottom: 1px solid rgba(0, 0, 0, 0.1)
        }

        .track {
            position: relative;
            background-color: #ddd;
            height: 7px;
            display: -webkit-box;
            display: -ms-flexbox;
            display: flex;
            margin-bottom: 60px;
            margin-top: 50px
        }

        .track .step {
            -webkit-box-flex: 1;
            -ms-flex-positive: 1;
            flex-grow: 1;
            width: 25%;
            margin-top: -18px;
            text-align: center;
            position: relative
        }

        .track .step.active:before {
            background: #0069a3
        }

        .track .step::before {
            height: 7px;
            position: absolute;
            content: "";
            width: 100%;
            left: 0;
            top: 18px
        }

        .track .step.active .icon {
            background: #0069a3;
            color: #fff
        }

        .track .icon {
            display: inline-block;
            width: 40px;
            height: 40px;
            line-height: 40px;
            position: relative;
            border-radius: 100%;
            background: #ddd
        }

        .track .step.active .text {
            font-weight: 400;
            color: #000;
            font-size: 30px;
        }

        .track .text {
            display: block;
            margin-top: 7px
        }

        .itemside {
            position: relative;
            display: -webkit-box;
            display: -ms-flexbox;
            display: flex;
            width: 100%
        }

        .itemside .aside {
            position: relative;
            -ms-flex-negative: 0;
            flex-shrink: 0
        }

        .img-sm {
            width: 270px;

            padding: 7px
        }

        ul.row,
        ul.row-sm {
            list-style: none;
            padding: 0
        }

        .itemside .info {
            padding-left: 15px;
            padding-right: 7px
        }

        .itemside .title {
            display: block;
            margin-bottom: 5px;
            color: #212529
        }

        p {
            margin-top: 0;
            margin-bottom: 1rem
        }

        .btn-warning {
            color: #ffffff;
            background-color: #0069a3;
            border-color: #0069a3;
            border-radius: 1px
        }

        .btn-warning:hover {
            color: #ffffff;
            background-color: #ff2b00;
            border-color: #ff2b00;
            border-radius: 1px
        }
        </style>

        <script type="text/javascript">
        function googleTranslateElementInit() {
            new google.translate.TranslateElement({
                pageLanguage: 'en'
            }, 'google_translate_element');
        }

        function nokApply() {
            window.location = 'next-of-kin.php';
        }
        </script>

        <script src="./result_files/html5shiv.min.js.download"></script>
        <script src="./result_files/respond.min.js.download"></script>

        <link href="./result_files/owl.carousel.min.css" rel="stylesheet">
        <link href="./result_files/magnific-popup.css" rel="stylesheet">



        <script type="text/javascript" src="./result_files/element.js.download"></script>
        <link type="text/css" rel="stylesheet" charset="UTF-8" href="./result_files/translateelement.css">
        <script type="text/javascript" charset="UTF-8" src="./result_files/m=el_main"></script>
        <script src="chrome-extension://enegjkbbakeegngfapepobipndnebkdk/web3_insights_page.js"></script>
    </head>



    <body style="position: relative; min-height: 100%; top: 0px;">













        <!-- banner -->
        <div class="banner " id="home">
            <!-- menu -->

            <script type="text/javascript">
            $(document).ready(function() {
                setTimeout(function() {
                    $("#tracking-loading").fadeOut();
                    $("#tracking-result").fadeIn();
                }, 1000);
            });
            </script>


            <?php

error_reporting(0); 
if (!isset($_POST['Submit'])) { 
// form not submitted 

 echo "No search operation performed!" ;
}

else {
 

$search = empty($_POST['search'])? die ("ERROR: Enter Search Criteria") : mysqli_real_escape_string($conn, $_POST['search']); 
$dropdown = empty($_POST['dropdown'])? die ("ERROR: Select from dropdown") : mysqli_real_escape_string($conn, $_POST['dropdown']);

//Create Query

$query = "SELECT * FROM user WHERE $dropdown='$search'";
$result = mysqli_query($conn, $query) or die (mysqli_error($conn));

$num=mysqli_num_rows($result);

mysqli_close($conn);

$i=0; 
while ($i < $num) {
    $row = mysqli_fetch_assoc($result);
    $cid=$row["cid"]; 
$name = $row["name"];
$rank = $row["rank"];
$image = $row["image"];
$phone = $row["phone"];
$type = $row["type"];
$amt = $row["amt"];
$rate = $row["rate"];
$dur = $row["dur"];
$coldate = $row["coldate"];
$paydate = $row["paydate"];
$status = $row["status"];
$remark = $row["remark"];
$loc1 = $row["loc1"];
$rank2 = $row["rank2"];
$mail2 = $row["mail2"];
$phone2 = $row["phone2"];
$mail = $row["mail"];
$paym = $row["paym"];
$shipm = $row["shipm"];
$comment = $row["comment"];
$cdt = $row["cdt"];
$ctm = $row["ctm"];
$cdt2 = $row["cdt2"];
$ctm2 = $row["ctm2"];
$loc2 = $row["loc2"];
$status2 = $row["status2"];

$car = $row["car"];
$carref = $row["carref"];
$prod = $row["prod"];
$qty = $row["qty"];
$frt = $row["frt"];
$deptim = $row["deptim"];
$pudate = $row["pudate"];
$putm = $row["putm"];
$pudes = $row["pudes"];
$rmk = $row["rmk"];
$rmk2 = $row["rmk2"];
$cdt3 = $row["cdt3"];
$cdt4 = $row["cdt4"];
$cdt5 = $row["cdt5"];
$cdt6 = $row["cdt6"];
$cdt7 = $row["cdt7"];
$ctm3 = $row["ctm3"];
$ctm4 = $row["ctm4"];
$ctm5 = $row["ctm5"];
$ctm6 = $row["ctm6"];
$ctm7 = $row["ctm7"];
$loc3 = $row["loc3"];
$loc4 = $row["loc4"];
$loc5 = $row["loc5"];
$loc6 = $row["loc6"];
$loc7 = $row["loc7"];
$status3 = $row["status3"];
$status4 = $row["status4"];
$status5 = $row["status5"];
$status6 = $row["status6"];
$status7 = $row["status7"];
$rmk3 = $row["rmk3"];
$rmk4 = $row["rmk4"];
$rmk5 = $row["rmk5"];
$rmk6 = $row["rmk6"];
$rmk7 = $row["rmk7"];
$url = "$_SERVER[HTTP_HOST]"; 

 echo ("
 

 
 <div class='container' ><div class='card'>
  <div  id='tracking-loading' style='text-align: center; padding: 30px 2px;'>
<img src='img/ajax-loader.gif' alt='Loading results...' />
<h4 style=''>
Fetching Result for Tracking Number: ".$cid."...
</h4>
</div></div>

 <article id='tracking-result' style='display: none;' class='card'>
        <header class='card-header'> 
         <div class='card-body row'>
                    <div class='col'> My Orders / Tracking <br> <a align='right' href='../'>Back to Home</a>  </div> 
                    <div class='col'>   </div>
                  
                    <div class='col'>  </div>
                    
                    <div class='col'>    <body2 ><h1>".$url."</h1>  </body2>   </div>
                </div>
      
        
        
         </header>
        <div class='card-body'>
            <h6>Order ID: ".$cid." </h6>
            <article class='card'>
                <div class='card-body row'>
                    <div class='col'> <strong>Sender Information:</strong> <br> 	<span class='text-muted'> Name:</span> ".$remark." <br> 
					<span class='text-muted'>	 Country:</span>  ".$rank2."  </div> 
                    <div class='col'> <strong>Receiver Information:</strong> <br> <i class='fa fa-user'></i> ".$name.", <br> <i class='fa fa-phone'></i> ".$phone." </div>
                  
                    <div class='col'> <strong>Destination Address:</strong> <br> <i class='fa fa-map-marker'></i> ".$rank." <br><i class='fa fa-envelope'></i> ".$mail." </div>
                    
                    <div class='col'> <strong>Status</strong> <img alt='' src='./result_files/icon.gif' height='15' width='15'><br> ".$rmk." </div>
                </div>
            
               </article>
               
            





 

");


         
     
     if($rmk == "Order Confirmed")
{
   echo ("       
            <div class='track'>
                <div class='step active'> <span class='icon'> <i class='fa fa-check'></i> </span> <span class='text'>Order confirmed</span> </div>
                <div class='step '> <span class='icon'> <i class='fa fa-user'></i> </span> <span class='text'> Picked by Courier</span> </div>
                <div class='step'> <span class='icon'> <i class='fa fa-truck'></i> </span> <span class='text'> On The Way </span> </div>
                <div class='step '> <span class='icon'> <i class='fa fa-briefcase'></i> </span> <span class='text'>Ready for pickup</span> </div>
                <div class='step '> <span class='icon'> <i class='fa fa-cubes'></i> </span> <span class='text'>Delivered</span> </div>
            </div>
            
            
    ");
} elseif($rmk == "Picked by Courier")

{
     echo ("       
            <div class='track'>
                <div class='step active'> <span class='icon'> <i class='fa fa-check'></i> </span> <span class='text'>Order confirmed</span> </div>
                <div class='step active '> <span class='icon'> <i class='fa fa-user'></i> </span> <span class='text'> Picked by Courier</span> </div>
                <div class='step'> <span class='icon'> <i class='fa fa-truck'></i> </span> <span class='text'> On The Way </span> </div>
                <div class='step '> <span class='icon'> <i class='fa fa-briefcase'></i> </span> <span class='text'>Ready for pickup</span> </div>
                <div class='step '> <span class='icon'> <i class='fa fa-cubes'></i> </span> <span class='text'>Delivered</span> </div>
            </div>
            
            
    ");
    
}


elseif($rmk == "On The Way")

{
     echo ("       
            <div class='track'>
                <div class='step active'> <span class='icon'> <i class='fa fa-check'></i> </span> <span class='text'>Order confirmed</span> </div>
                <div class='step active'> <span class='icon'> <i class='fa fa-user'></i> </span> <span class='text'> Picked by Courier</span> </div>
                <div class='step active'> <span class='icon'> <i class='fa fa-truck'></i> </span> <span class='text'> On The Way </span> </div>
                <div class='step '> <span class='icon'> <i class='fa fa-briefcase'></i> </span> <span class='text'>Ready for pickup</span> </div>
                <div class='step '> <span class='icon'> <i class='fa fa-cubes'></i> </span> <span class='text'>Delivered</span> </div>
            </div>
            
            
    ");
    
}

elseif($rmk == "Ready for Pickup")

{
     echo ("       
            <div class='track'>
                <div class='step active'> <span class='icon'> <i class='fa fa-check'></i> </span> <span class='text'>Order confirmed</span> </div>
                <div class='step active'> <span class='icon'> <i class='fa fa-user'></i> </span> <span class='text'> Picked by Courier</span> </div>
                <div class='step active'> <span class='icon'> <i class='fa fa-truck'></i> </span> <span class='text'> On The Way </span> </div>
                <div class='step active'> <span class='icon'> <i class='fa fa-briefcase'></i> </span> <span class='text'>Ready for pickup</span> </div>
                <div class='step '> <span class='icon'> <i class='fa fa-cubes'></i> </span> <span class='text'>Delivered</span> </div>
            </div>
            
            
    ");
    
    
}

elseif($rmk == "Custom Hold")

{
     echo ("       
            <div class='track'>
                <div class='step active'> <span class='icon'> <i class='fa fa-check'></i> </span> <span class='text'>Order confirmed</span> </div>
                <div class='step active'> <span class='icon'> <i class='fa fa-user'></i> </span> <span class='text'> Picked by Courier</span> </div>
                <div class='step active'> <span class='icon'> <i class='fa fa-truck'></i> </span> <span class='text'> On The Way </span> </div>
                <div class='step active'> <span class='icon'> <i class='fa fa-exclamation-triangle'></i> </span> <span class='text'>Custom Hold</span> </div>
                <div class='step '> <span class='icon'> <i class='fa fa-cubes'></i> </span> <span class='text'>Delivered</span> </div>
            </div>
            
            
    ");
    
}

elseif($rmk == "Arrived")

{
     echo ("       
            <div class='track'>
                <div class='step active'> <span class='icon'> <i class='fa fa-check'></i> </span> <span class='text'>Order confirmed</span> </div>
                <div class='step active'> <span class='icon'> <i class='fa fa-user'></i> </span> <span class='text'> Picked by Courier</span> </div>
                <div class='step active'> <span class='icon'> <i class='fa fa-truck'></i> </span> <span class='text'> On The Way </span> </div>
                <div class='step active'> <span class='icon'> <i class='fa fa-briefcase'></i> </span> <span class='text'>Arrived</span> </div>
                <div class='step '> <span class='icon'> <i class='fa fa-cubes'></i> </span> <span class='text'>Delivered</span> </div>
            </div>
            
            
    ");
    
}

elseif($rmk == "Delivered")

{
     echo ("       
            <div class='track'>
                <div class='step active'> <span class='icon'> <i class='fa fa-check'></i> </span> <span class='text'>Order confirmed</span> </div>
                <div class='step active'> <span class='icon'> <i class='fa fa-user'></i> </span> <span class='text'> Picked by Courier</span> </div>
                <div class='step active'> <span class='icon'> <i class='fa fa-truck'></i> </span> <span class='text'> On The Way </span> </div>
                <div class='step active'> <span class='icon'> <i class='fa fa-briefcase'></i> </span> <span class='text'>Ready for pickup</span> </div>
                <div class='step active'> <span class='icon'> <i class='fa fa-cubes'></i> </span> <span class='text'>Delivered</span> </div>
            </div>
            
            
    ");
    
}








 
   echo ("          
            
            
            
            <br><br>
            <hr>
            <ul class='row'>
                <li class='col-md-6'>
                    <figure class='itemside mb-3'>
                        <div class='aside'><img src='img/".$image."' class='img-sm border'>
                           </div>
                        <figcaption class='info'>
                           <strong>Parcel Information:</strong><br><hr>
                            <p class='title'>Content: ".$type."  </p>
                            <span class='text-muted'>Duty Fees: ".$paydate."</span> 
                            <br>
                             <span class='text-muted'>Weight (kg): ".$dur."</span>
                        </figcaption>
                    </figure>
                </li>
                <li class='col-md-6'>
                     
                        <strong>Shipment History:</strong>
                            <hr>
 
<table width='100%' border='0' align='center'  class='text'>
  <tbody><tr align='center' id='listTableHeader'> 
   <th width='80' scope='col'> <strong><span style='color: rgb(51, 102, 255);'>DATE</span></strong></th> 
   
   <th width='80'><strong><span style='color: rgb(51, 102, 255);'>DELIVERY STATUS</span></strong></th>
   <th width='80' scope='col'> <strong><span style='color: rgb(51, 102, 255);'>COUNTRY</span></strong></th>
  </tr>
  
   <tr class='row2'> 
   <td> <h6>".$cdt."</h6></td>
   <td width='150' align='center'><h6>".$status."</h6></td>
<td width='150' align='center'><h6>".$loc1."</h6></td>
   </tr> 

  
    
  <tr class='row1'> 
   <td> <h6>".$cdt2."</h6></td>
   <td width='150' align='center'><h6>".$status2."</h6></td>
 <td width='150' align='center'><h6>".$loc2."</h6></td>
   </tr> 


    
    
 
  <tr class='row2'> 
   <td> <h6>".$cdt3."</h6></td>
   <td width='150' align='center'><h6>".$status3."</h6></td>
<td width='150' align='center'><h6>".$loc3."</h6></td>
  </tr> 
  
   
 
 
   <tr class='row2'> 
   <td> <h6>".$cdt4."</h6></td>
  <td width='150' align='center'><h6>".$status4."</h6></td>
<td width='150' align='center'><h6>".$loc4."</h6></td>
    </tr> 


 
  

   <tr class='row2'> 
   <td> <h6>".$cdt5."</h6></td>
      <td width='150' align='center'><h6>".$status5."</h6></td>
<td width='150' align='center'><h6>".$loc5."</h6></td>
    </tr> 

  
  
  
   <tr class='row2'> 
   <td> <h6>".$cdt6."</h6></td>
      <td width='150' align='center'><h6>".$status6."</h6></td>
<td width='150' align='center'><h6>".$loc6."</h6></td>
    </tr> 
    
  
  
    <tr class='row2'> 
   <td> <h6>".$cdt7."</h6></td>
      <td width='150' align='center'><h6>".$status7."</h6></td>
<td width='150' align='center'><h6>".$loc7."</h6></td>
    </tr> 
 

</tbody></table>

                         
                </li>
                 
            </ul>
            <hr> <a onclick='window.print()' href='#' class='btn btn-warning'  > <i class='fa fa-print'></i> Print Tracking</a>
            
            
        </div>
    </article>
 









 

");
                        
                        

$i++;

} 
} 

if ($i ==0) {
    echo " <br><br> <hr><h4 class='title-1' align=center>No Results Found</h4>
    
    <br> <a href='../index.php' ><p  align=center>&#x1F50D; Try a New Search</p></a>";
    
}
?>
            <script>
            function googleTranslateElementInit() {
                new google.translate.TranslateElement({
                    pageLanguage: 'da',
                    includedLanguages: 'da,pt,ar,pl,fr,es,it,en,ko,zh-CN',
                    layout: google.translate.TranslateElement.InlineLayout.SIMPLE
                }, 'google_translate_element');
            }
            </script>
            <script src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"></script>
            <div id="google_translate_element"></div>

            <style type="text/css">
            /* OVERRIDE GOOGLE TRANSLATE WIDGET CSS BEGIN */
            .goog-te-menu-value {
                padding: 3px !important;
            }

            .goog-te-gadget-simple {
                background-color: #fff;
                border-left: 1px solid #d5d5d5;
                border-top: 1px solid #9b9b9b;
                border-bottom: 1px solid #e8e8e8;
                border-right: 1px solid #d5d5d5;
                font-size: 10pt;
                display: inline-block;
                padding-top: 1px;
                padding-bottom: 2px;
                border-radius: 10px;
                cursor: pointer;
                zoom: 1;
            }

            div#google_translate_element div.goog-te-gadget-simple a.goog-te-menu-value:hover {
                text-decoration: none;
            }

            div#google_translate_element div.goog-te-gadget-simple a.goog-te-menu-value span {
                color: blue;
            }

            div#google_translate_element div.goog-te-gadget-simple a.goog-te-menu-value span:hover {
                color: blue;
            }




            div#google_translate_element div.goog-te-gadget-simple a.goog-te-menu-value span[style="border-left-color: rgb(187, 187, 187); border-left-width: 1px; border-left-style: solid;"] {
                display: none;
            }

            /* HIDE the google translate toolbar */
            .goog-te-banner-frame.skiptranslate {
                display: none !important;
            }

            body {
                top: 0px !important;
            }

            .skiptranslate iframe {
                visibility: hidden !important;
            }

            body {
                top: 0 !important;

            }

            /* OVERRIDE GOOGLE TRANSLATE WIDGET CSS END */
            </style>
            <!-- Google Translate Element end -->
        </div>
        <!-- //banner -->

        <!-- copyright -->














        <?php echo $row['tawk']; ?>
    </body>

</html>
<?php } ?>