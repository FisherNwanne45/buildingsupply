<?php
include('log.php'); // Includes Login Script

if(isset($_SESSION['login_user'])){
header("location: index.php");
}

require_once 'config.php';
include_once ('session.php');

        $result = $conn->query("SELECT * FROM site");
        if(!$result->num_rows > 0){ echo '<h2 style="text-align:center;">No Data Found</h2>'; }
        while($row = $result->fetch_assoc())
        {
?>
<!DOCTYPE html>
<html lang="en">


<!-- Mirrored from thegenius.co/html/finlon_new1/ by HTTrack Website Copier/3.x [XR&CO'2014], Wed, 28 Dec 2022 22:23:38 GMT -->
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Status  || <?php echo $row['name']; ?> || Loan & Credit</title>
    <!-- favicons Icons -->
    <link rel="apple-touch-icon" sizes="180x180" href="../assets/images/favicons/apple-touch-icon.png" />
    <link rel="icon" type="image/png" sizes="32x32" href="../assets/images/favicons/favicon-32x32.png" />
    <link rel="icon" type="image/png" sizes="16x16" href="../assets/images/favicons/favicon-16x16.png" />
    <link rel="manifest" href="../assets/images/favicons/site.webmanifest" />
    <meta name="description" content="<?php echo $row['name']; ?> || Loan & Credit" />

    <!-- fonts -->

    <link rel="preconnect" href="../https://fonts.googleapis.com/">
    <link rel="preconnect" href="../https://fonts.gstatic.com/" crossorigin>
    <link href="../https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&amp;display=swap" rel="stylesheet">
    <link rel="stylesheet" href="../assets/vendors/reey-font/stylesheet.css">
    <link rel="stylesheet" href="../assets/vendors/bootstrap/css/bootstrap.min.css" />
    <link rel="stylesheet" href="../assets/vendors/animate/animate.min.css" />
    <link rel="stylesheet" href="../assets/vendors/fontawesome/css/all.min.css" />
    <link rel="stylesheet" href="../assets/vendors/finlon-icons/style.css" />
    <link rel="stylesheet" href="../assets/vendors/jarallax/jarallax.css" />
    <link rel="stylesheet" href="../assets/vendors/jquery-magnific-popup/jquery.magnific-popup.css" />
    <link rel="stylesheet" href="../assets/vendors/nouislider/nouislider.min.css" />
    <link rel="stylesheet" href="../assets/vendors/nouislider/nouislider.pips.css" />
    <link rel="stylesheet" href="../assets/vendors/odometer/odometer.min.css" />
    <link rel="stylesheet" href="../assets/vendors/swiper/swiper.min.css" />
    <link rel="stylesheet" href="../assets/vendors/owl-carousel/assets/owl.carousel.min.css" />
    <link rel="stylesheet" href="../assets/vendors/owl-carousel/assets/owl.theme.default.min.css" />

    <!-- template styles -->
    <link rel="stylesheet" href="../assets/css/finlon.css" />
</head>

<body class="custom-cursor">

    <div class="custom-cursor__cursor"></div>
    <div class="custom-cursor__cursor-two"></div>

    <div class="preloader">
        <div class="preloader__image"></div>
    </div>
    <!-- /.preloader -->
    <div class="page-wrapper">
        <div class="topbar">
            <div class="container-fluid">
                <div class="topbar__info">
                    <a href="#"><i class="icon-pin"></i> <?php echo $row['addr']; ?></a>
                    <a href="mailto:<?php echo $row['email']; ?>"><i class="icon-email"></i> <?php echo $row['email']; ?></a>
                </div><!-- /.topbar__info -->
                <div class="topbar__links">
                    <a href="../resources">Login</a>
                    <a href="../apply.php">Apply Now</a>
                    <a href="../faqs.php">FAQs</a>
                </div><!-- /.topbar__links -->
                <div class="topbar__social">
                    <a href="#"><i class="fab fa-twitter"></i></a>
                    <a href="#"><i class="fab fa-facebook"></i></a>
                    <a href="#"><i class="fab fa-pinterest"></i></a>
                    <a href="#"><i class="fab fa-instagram"></i></a>
                </div><!-- /.topbar__social -->
            </div><!-- /.container-fluid -->
        </div><!-- /.topbar -->
        <nav class="main-menu">
            <div class="container-fluid">
                <div class="main-menu__logo">

                    <svg xmlns="http://www.w3.org/2000/svg" class="main-menu__logo__shape-1" viewBox="0 0 317 120">
                        <path d="M259.856,120H0V0H274l43,37.481Z" />
                    </svg>
                    <svg xmlns="http://www.w3.org/2000/svg" class="main-menu__logo__shape-2" viewBox="0 0 317 120">
                        <path d="M259.856,120H0V0H274l43,37.481Z" />
                    </svg>


                    <a href="../index.php">
                        <img src="../assets/images/logo-dark.png" width="140" height="51" alt="<?php echo $row['name']; ?>">
                    </a>
                </div><!-- /.main-menu__logo -->
                <div class="main-menu__nav">
                    <ul class="main-menu__list">
                        <li >
                            <a href="../index.php">Home</a>
                              
                        </li>
                        <li>
                            <a href="../about.php">About</a>
                        </li>

                        <li class="dropdown"><a href="../services.php">Services</a>
                            <ul>
                                <li><a href="../personal.php">Personal Loan</a></li>
                                <li><a href="../biz-loan.php">Business Loan</a></li>
                                <li><a href="../auto.php">Venture Capital</a></li>
                                <li><a href="../wedding.php">Wedding Loan</a></li>
                                <li><a href="../property.php">Property Loan</a></li>
                                <li><a href="../education.php">Education Loan</a></li>
                            </ul>
                        </li>
                        <li class="dropdown"><a href="#">Credit</a>
                            <ul>
                                 
                                <li><a href="../credit-repair.php">Credit Repair</a></li>
                                <li><a href="../credit-audit.php">Credit Audit</a></li>
                                
                                
                                
                            </ul>
                        </li>
                        <li class="dropdown"><a href="#">Features</a>
                            <ul>
                                <li><a href="../personal-loan-calculator.php">Personal Loan Calcualtor</a></li>
                                <li><a href="../loan-eligibility.php">Loan Eligibility</a></li>
                                <li><a href="../home-loan-calculator.php">Home Loan Calcualtor</a></li>
                                <li><a href="../home-loan-eligibility-calculator.php">Home Loan Eligibility</a></li>
                                <li><a href="../compare.php">Compare Loan EMI</a></li>
                                <li><a href="../monthly-loan-calculator.php">Monthly Calculator</a></li>
                            </ul>
                        </li>
                        <li><a href="../faqs.php">Faqs</a></li>
                        
                        <li><a href="../contact.php">Contact</a></li>
                    </ul>
                </div><!-- /.main-menu__nav -->
                <div class="main-menu__right">
                    <a href="#" class="main-menu__toggler mobile-nav__toggler">
                        <i class="fa fa-bars"></i>
                    </a>
                    
                    <a href="../track.php" class="thm-btn main-menu__btn">Track Loan Status</a><!-- /.thm-btn -->
                    <a href="tel:<?php echo $row['phone']; ?>" class="main-menu__contact">
                        <span class="main-menu__contact__icon">
                            <i class="icon-phone"></i>
                        </span><!-- /.main-menu__contact__icon -->
                        <span class="main-menu__contact__text">
                            <strong><?php echo $row['phone']; ?></strong>
                            Mon to Fri: 9 am to 6 pm
                        </span>
                    </a><!-- /.main-menu__contact -->
                </div><!-- /.main-menu__right -->
            </div><!-- /.container-fluid -->
        </nav>
        <!-- /.main-menu -->


        <div class="stricky-header stricked-menu main-menu">
            <div class="sticky-header__content"></div><!-- /.sticky-header__content -->
        </div><!-- /.stricky-header -->
      
<hr>
      <section class="service-one pt-120 pb-50">
            
            <img src="assets/images/shapes/service-h-1.png" class="service-one__icon-1" alt="">
             
            <img src="assets/images/shapes/service-h-3.png" class="service-one__icon-3" alt="">
            <div class="container">
                <div class="row">
                    <div class="col-lg-4">
                        <div class="contact-one__content">
                            <div class="block-title">
                                <p class="block-title__tagline">ACCOUNT LOGIN</p><!-- /.block-title__tagline -->
                                <h2 class="block-title__title">Protect your Login Details</h2><!-- /.block-title__title -->
                            </div><!-- /.block-title -->
                            
                            <br><p>
                               
                            </p><!-- /.contact-one__social -->
                        </div><!-- /.contact-one__content -->
                    </div><!-- /.col-lg-4 -->
                    
                    <div class="col-lg-8">
                        <form action=" "  method="POST" class="form-one ">
                           <span><?php echo $error; ?></span>
                            
                            <div class="row row-gutter-y-20 row-gutter-x-20">
                                <div class="col-md-7">
                                    <input type="text" placeholder="Email / User ID" name="username" required>
                                </div><!-- /.col-md-6 -->
                                <div class="col-md-7">
                                    <input type="text" placeholder="Enter Password" name="password" required>
                                </div><!-- /.col-md-6 -->
                               
                                <div class="col-md-12">
                                    <button type="submit" value="Submit" name="submit" class="thm-btn">Login</button><!-- /.thm-btn -->
                                </div><!-- /.col-md-6 -->
                                
                                <br><br><br>
                               <div class="col-md-12">
                                    <p class="accrodion-title"><img src="../assets/images/shield.png"> Your information is secured with SSL and 128-bit encryption.</p>
                                </div>
                                
                            </div><!-- /.row -->
                        </form>
                    </div><!-- /.col-lg-8 -->
                </div><!-- /.row -->
            </div><!-- /.container -->
        </section><!-- /.contact-one -->
         
        <!-- /.google-map -->

        <footer class="main-footer">
            <div class="container">
                <div class="row row-gutter-y-30">
                    <div class="col-lg-4 col-md-6">
                        <div class="footer-widget footer-widget--about">
                            <a href="../index.php" class="footer-widget__logo">
                                <img src="../assets/images/logo-light.png" alt="<?php echo $row['name']; ?>" width="140" height="51">
                            </a>
                            <p class="footer-widget__text"><?php echo $row['name']; ?> is an authorised financial services provider and registered credit provider.</p>
                            <ul class="list-unstyled footer-widget__info">
                                <li>
                                    <i class="icon-email"></i>
                                    <a href="mailto:<?php echo $row['email']; ?>"><?php echo $row['email']; ?></a>
                                </li>
                                <li>
                                    <i class="icon-telephone"></i>
                                    <a href="tel:<?php echo $row['phone']; ?>"><?php echo $row['phone']; ?> </a>
                                </li>
                            </ul><!-- /.list-unstyled -->
                        </div><!-- /.footer-widget -->
                    </div><!-- /.col-lg-4 -->
                    <div class="col-lg-2 col-md-6">
                        <div class="footer-widget footer-widget--links">
                            <h3 class="footer-widget__title">
                                Explore
                            </h3><!-- /.footer-widget__title -->
                            <ul class="list-unstyled footer-widget__menu">
                                <li><a href="../about.php">About</a></li>
                                <li><a href="../services.php">Our Services</a></li>
                                <li><a href="../track.php">Track Loan</a></li>
                                <li><a href="../apply.php">Apply for Loan</a></li>
                                <li><a href="../contact.php">Contact</a></li>
                            </ul><!-- /.list-unstyled footer-widget__menu -->
                        </div><!-- /.footer-widget -->
                    </div><!-- /.col-lg-2 -->
                    <div class="col-lg-3 col-md-6">
                        <div class="footer-widget footer-widget--time">
                            <h3 class="footer-widget__title">
                                Timing
                            </h3><!-- /.footer-widget__title -->
                            <p class="footer-widget__text">
                                Mon Fri: 7:00am - 6:00pm <br> Saturday: 9:00am - 5:00pm <br> Sunday: Closed
                            </p>
                            <div class="footer-widget__social">
                                <a href="#"><i class="fab fa-twitter"></i></a>
                                <a href="#"><i class="fab fa-facebook"></i></a>
                                <a href="#"><i class="fab fa-pinterest"></i></a>
                                <a href="#"><i class="fab fa-instagram"></i></a>
                            </div><!-- /.footer-widget__social -->
                        </div><!-- /.footer-widget -->
                    </div><!-- /.col-lg-3 -->
                    <div class="col-lg-3 col-md-6">
                        <div class="footer-widget footer-widget--newsletter">
                            <h3 class="footer-widget__title">
                                Newsletter
                            </h3><!-- /.footer-widget__title -->
                            <form class="footer-widget__mailchimp">
                                <input type="email" placeholder="Email address">
                                <p class="footer-widget__mailchimp__text">
                                    <i class="fa fa-check"></i>
                                    I agree to all your terms and policies
                                </p><!-- /.footer-widget__mailchimp -->
                            </form><!-- /.footer-widget__mailchimp -->
                        </div><!-- /.footer-widget -->
                    </div><!-- /.col-lg-3 -->
                </div><!-- /.row -->
            </div><!-- /.container -->
        </footer><!-- /.main-footer -->
        <div class="bottom-footer">
            <div class="container">
                <p class="bottom-footer__text text-center"> All Rights Reserved. Copyright &copy; <?php echo date("Y"); ?> <?php echo $row['name']; ?>.</p>
                <!-- /.bottom-footer__text -->
            </div><!-- /.container -->
        </div><!-- /.bottom-footer -->

    </div><!-- /.page-wrapper -->


    <div class="mobile-nav__wrapper">
        <div class="mobile-nav__overlay mobile-nav__toggler"></div>
        <!-- /.mobile-nav__overlay -->
        <div class="mobile-nav__content">
            <span class="mobile-nav__close mobile-nav__toggler"><i class="fa fa-times"></i></span>

            <div class="logo-box">
                <a href="../index.php" aria-label="logo image"><img src="../assets/images/logo-light.png" width="155" alt="" /></a>
            </div>
            <!-- /.logo-box -->
            <div class="mobile-nav__container"></div>
            <!-- /.mobile-nav__container -->

            <ul class="mobile-nav__contact list-unstyled">
                <li>
                    <i class="icon-email"></i>
                    <a href="mailto:<?php echo $row['email']; ?>"><?php echo $row['email']; ?></a>
                </li>
                <li>
                    <i class="icon-telephone"></i>
                    <a href="tel:<?php echo $row['phone']; ?>"><?php echo $row['phone']; ?></a>
                </li>
            </ul><!-- /.mobile-nav__contact -->

            <div class="mobile-nav__social">
                <a href="#"><i class="fab fa-twitter"></i></a>
                <a href="#"><i class="fab fa-facebook"></i></a>
                <a href="#"><i class="fab fa-pinterest"></i></a>
                <a href="#"><i class="fab fa-instagram"></i></a>
            </div><!-- /.mobile-nav__social -->

        </div>
        <!-- /.mobile-nav__content -->
    </div>
    <!-- /.mobile-nav__wrapper -->


    <div class="search-popup">
        <div class="search-popup__overlay search-toggler"></div>
        <!-- /.search-popup__overlay -->
        <div class="search-popup__content">
            <form action="#">
                <label for="search" class="sr-only">search here</label><!-- /.sr-only -->
                <input type="text" id="search" placeholder="Search Here..." />
                <button type="submit" aria-label="search submit" class="thm-btn">
                    <i class="icon-magnifying-glass"></i>
                </button>
            </form>
        </div>
        <!-- /.search-popup__content -->
    </div>
    <!-- /.search-popup -->

    <a href="#" data-target="html" class="scroll-to-target scroll-to-top"><i class="fa fa-angle-up"></i></a>


    <script src="../assets/vendors/jquery/jquery-3.6.0.min.js"></script>
    <script src="../assets/vendors/bootstrap/js/bootstrap.bundle.min.js"></script>
    <script src="../assets/vendors/jarallax/jarallax.min.js"></script>
    <script src="../assets/vendors/jquery-ajaxchimp/jquery.ajaxchimp.min.js"></script>
    <script src="../assets/vendors/jquery-appear/jquery.appear.min.js"></script>
    <script src="../assets/vendors/jquery-circle-progress/jquery.circle-progress.min.js"></script>
    <script src="../assets/vendors/jquery-magnific-popup/jquery.magnific-popup.min.js"></script>
    <script src="../assets/vendors/jquery-validate/jquery.validate.min.js"></script>
    <script src="../assets/vendors/nouislider/nouislider.min.js"></script>
    <script src="../assets/vendors/odometer/odometer.min.js"></script>
    <script src="../assets/vendors/swiper/swiper.min.js"></script>
    <script src="../assets/vendors/owl-carousel/owl.carousel.min.js"></script>
    <script src="../assets/vendors/wnumb/wNumb.min.js"></script>
    <script src="../assets/vendors/wow/wow.js"></script>
    <script src="../assets/vendors/isotope/isotope.js"></script>
    <script src="../assets/vendors/countdown/countdown.min.js"></script>
    <!-- template js -->
    <script src="../assets/js/finlon.js"></script>
</body>


 <!--Start of Tawk.to Script-->
<script type="text/javascript">
var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
(function(){
var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
s1.async=true;
s1.src='https://embed.tawk.to/<?php echo $row['tawk']; ?>';
s1.charset='UTF-8';
s1.setAttribute('crossorigin','*');
s0.parentNode.insertBefore(s1,s0);
})();
</script>
<!--End of Tawk.to Script--></body>

<!-- Mirrored from <?php echo $row['url']; ?>/ by HTTrack Website Copier/3.x [XR&CO'2014], Fri, 17 Sep 2021 16:26:18 GMT -->
</html>
<?php } ?>