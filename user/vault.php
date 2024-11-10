<?php
include('session.php');
 
        $result = $conn->query("SELECT * FROM site");
        if(!$result->num_rows > 0){ echo '<h2 style="text-align:center;">No Data Found</h2>'; }
        while($roll = $result->fetch_assoc())
        {
      ?>
<!DOCTYPE html>
<!-- saved from url=(0023)./index.php -->
<html>

    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <link rel="icon" href="../wp-content/uploads/2019/04/omni_favicon.png" sizes="32x32" />
        <style type="text/css">
        @charset "UTF-8";

        [ng\:cloak],
        [ng-cloak],
        [data-ng-cloak],
        [x-ng-cloak],
        .ng-cloak,
        .x-ng-cloak,
        .ng-hide:not(.ng-hide-animate) {
            display: none !important;
        }

        ng\:form {
            display: block;
        }

        .ng-animate-shim {
            visibility: hidden;
        }

        .ng-anchor {
            position: absolute;
        }
        </style>
        <link rel="stylesheet" href="../Home_files/WebResource.axd" type="text/css">
        <link rel="canonical" href="../index.php">
        <link rel="alternate" href="../index.php/" hreflang="ar">
        <link rel="alternate" href="../index.php" hreflang="en">
        <link rel="stylesheet" href="../Home_files/project.css" type="text/css">
        <script type="text/javascript" async="" src="../Home_files/ec.js.download"></script>
        <script type="text/javascript" async="" src="../Home_files/analytics.js.download"></script>
        <script async="" src="../Home_files/fbevents.js.download"></script>
        <script type="text/javascript" async="" src="../Home_files/f.txt"></script>
        <script async="" src="../Home_files/gtm.js.download"></script>
        <script type="text/javascript">
        var sf_appPath = '/';
        </script>
        <title>
            Secure Vault
        </title>
        <meta name="description"
            content="<?php echo $roll['name']; ?>courier services is your choice for worldwide shipping solutions at a competitive price. You can also manage and track your shipment online.">
        <meta name="keywords"
            content="courier services, courier service, air courier service, international courier services, express courier, leading express courier company, overseas courier, courier shipping service">
        <!-- Always force latest IE rendering engine or request Chrome Frame -->
        <meta content="IE=edge,chrome=1" http-equiv="X-UA-Compatible">
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=yes">
        <meta name="author" content="">
        <meta name="format-detection" content="telephone=no">

        <!--[if IE]>
      <link href="/Sitefinity/WebsiteTemplates/aramex/App_Themes/aramex/rga/style-ie.css" rel="stylesheet" type="text/css" />
<![endif]-->
        <!-- Always force latest IE rendering engine or request Chrome Frame -->
        <meta content="IE=edge,chrome=1" http-equiv="X-UA-Compatible">
        <script src="../Home_files/vendors.js.download" type="text/javascript"></script>
        <meta name="msapplication-config" content="none">
        <meta name="apple-itunes-app" content="app-id=535780764">
        <meta name="google-play-app" content="app-id=net.aramex">
        <script type="text/javascript" src="../Home_files/main.js.download"></script>
        <script type="text/javascript">
        $(function() {
                var $sevircesUpdate = $('[amx-gtm-promotion*="Service Updates"]');

                $sevircesUpdate.css({
                    'paddingBottom': '20px'
                });

                if ($('#cmbCountry').val() != 'SA') {
                    $sevircesUpdate.hide();
                }
            })


            <
            noscript > < iframe src = "https://www.googletagmanager.com/ns.php?id="
        height = "0"
        width = "0"
        style = "display:none;visibility:hidden" > < /iframe></noscript > < div class = "sfPublicWrapper"
        id = "PublicWrapper" >

            <
            script src = "../Home_files/amxApp.js.download" >
        </script>

        <style>
        #smartbanner {
            position: absolute !important;
            left: 0;
            top: -82px;
            border-bottom: 1px solid #e8e8e8;
            width: 100%;
            height: 78px;
            font-family: 'Helvetica Neue', sans-serif;
            background: white;
            box-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
            z-index: 9999;
            overflow: hidden;
            -webkit-text-size-adjust: none;
        }

        #smartbanner,
        html.sb-animation {
            -webkit-transition: all .3s ease;
        }

        #smartbanner .sb-container {
            margin: 0 auto;
        }

        #smartbanner .sb-close {
            position: absolute;
            left: 10px;
            top: 30px;
            display: block;
            font-family: 'ArialRoundedMTBold', Arial;
            font-size: 25px;
            line-height: 20px;
            text-align: center;
            color: #000;
            text-decoration: none;
            text-shadow: none;
        }

        #smartbanner .sb-close:active {
            font-size: 13px;
            color: #aaa;
        }

        #smartbanner .sb-icon {
            display: block !important;
            position: absolute;
            left: 35px;
            top: 10px;
            display: block;
            width: 57px;
            height: 57px;
            background-size: cover;
            background-image: url(./wp-content/uploads/2020/11/omni_logistics_logo_tagline_reversed.png);
            border-radius: 10px;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
        }

        #smartbanner.no-icon .sb-icon {
            display: none;
        }

        #smartbanner .sb-info {
            position: absolute;
            left: 100px;
            top: 10px;
            width: 44%;
            max-width: 155px;
            font-size: 11px;
            line-height: 1.2em;
            font-weight: bold;

        }

        #smartbanner #smartbanner.no-icon .sb-info {
            left: 34px;
        }

        #smartbanner .sb-info strong {
            display: block;
            font-size: 13px;
            color: #4d4d4d;
            line-height: 18px;
        }

        #smartbanner .sb-info>span {
            display: block;
        }

        #smartbanner .sb-info>span:nth-child(2) {
            font-weight: normal;
        }

        #smartbanner .sb-info>span:nth-child(3) {
            color: #4d4d4d;
        }

        #smartbanner .sb-info em {
            font-style: normal;
            text-transform: uppercase;
        }

        #smartbanner .sb-button {
            position: absolute;
            right: 20px;
            top: 24px;
            padding: 0 10px;
            min-width: 10%;
            height: 24px;
            font-size: 14px;
            line-height: 24px;
            text-align: center;
            font-weight: bold;
            color: #6a6a6a;
            text-transform: uppercase;
            text-decoration: none;
            text-shadow: 0 1px 0 rgba(255, 255, 255, 0.8);
        }

        #smartbanner .sb-button:active,
        #smartbanner .sb-button:hover {
            background: -webkit-linear-gradient(top, #dcdcdc 0%, #efefef 100%);
        }

        #smartbanner .sb-icon.gloss:after {
            content: '';
            position: absolute;
            left: 0;
            top: -1px;
            border-top: 1px solid rgba(255, 255, 255, 0.8);
            width: 100%;
            height: 50%;
            background: -webkit-linear-gradient(top, rgba(255, 255, 255, 0.7) 0%, rgba(255, 255, 255, 0.2) 100%);
            border-radius: 10px 10px 12px 12px;
        }

        #smartbanner.android {
            background: white;
        }

        #smartbanner.windows .sb-icon {
            border-radius: 0px;
        }
        </style>





        <div class="amx-sn-main">
            <header id="amx-sn-header" data-module-name="amx-docking-header">
                <!-- header top -->
                <div class="amx-sn-header-top">
                    <div class="amx-container">
                        <div class="amx-header-top-components">
                            <a href="../index.php" class="amx-cp-btn amx-cp-site-switcher "><?php echo $roll['name']; ?>
                                Corporate</a>

                        </div>
                    </div>
                </div>
                <!-- // header top -->
                <!-- Medium nav -->
                <div class="amx-sn-header-bottom">
                    <div class="amx-container">
                        <ul class="amx-cp-header-controls">
                            <li>
                                <a id="menu-trigger" href="javascript:void(0);"
                                    class="amx-cp-btn amx-mr-menu amx-h-show-on-small amx-h-hide-on-large"
                                    data-module-name="amx-dropdown-menu" data-target="amx-dropdown-menu">
                                    <span class="hamburger xminus">
                                        <span class="lines"></span>
                                    </span>
                                </a>
                                <!-- dropdown nav -->
                                <nav id="amx-dropdown-menu" class="amx-dropdown">
                                    <div class="amx-container">
                                        <div
                                            class="amx-md-dropdown-utilities amx-small-block-4-4 amx-medium-block-4-8 amx-large-block-6-12">
                                            <div class="amx-cp-locale-selector">
                                                <!--<a href="/" class="amx-corporate-show-on-small"><?php echo $roll['name']; ?>Corporate</a>-->
                                            </div>
                                        </div>
                                        <div class="amx-small-block-4-4 amx-medium-block-4-8 amx-large-block-6-12">
                                            <nav class="amx-md-dropdown-nav" data-module-name="amx-accordion"
                                                data-trigger="amx-submenu-title">
                                                <ul>


                                                </ul>
                                            </nav>
                                            <a href="../index.php"
                                                class="amx-cp-btn amx-cp-site-switcher"><?php echo $roll['name']; ?>Corporate</a>
                                        </div>
                                    </div>
                                </nav>
                                <!-- // dropdown nav -->
                            </li>
                            <li>
                                <a href="../index.php" class="amx-cp-logo aramex-logo.svg"><img
                                        src="../wp-content/uploads/2020/11/omni_logistics_logo_tagline_reversed.png"></a>
                            </li>
                            <li>

                                <a href="../resources/logout.php"
                                    class="amx-cp-btn amx-cp-login amx-h-hide-on-small amx-h-show-on-large">Logout</a>
                            </li>
                            <li>
                                <a href="../resources/logout.php"
                                    class="my-account amx-cp-btn amx-h-show-on-small amx-h-hide-on-large">
                                    <i class="amx-i-person-solid"></i>
                                </a>

                                <!-- dropdown my account -->

                                <div id="amx-dropdown-search" class="amx-dropdown">
                                    <div class="amx-container">
                                        <div class="amx-md-search" data-module-name="amx-search">

                                            <form action="../" method="post" class="ng-pristine ng-valid"> <input
                                                    id="search" name="txtSearch" type="search" placeholder="Search">
                                                <button type="submit"
                                                    class="amx-cp-btn amx-cp-btn-search close amx-i-arrow-forward amx-i-search-solid"></button>
                                                <button type="reset" class="amx-i-cross  amx-cp-btn amx-cp-btn-clear"
                                                    style="display: none;"></button>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                                <!-- // dropdown my account -->
                            </li>
                            <li>
                                <a href="javascript:void(0);"
                                    class="amx-cp-btn amx-mr-search amx-h-show-on-small amx-h-hide-on-large"><i
                                        class="amx-i-search-solid"></i></a>
                                <!-- dropdown search -->
                                <div id="amx-dropdown-search" class="amx-dropdown">
                                    <div class="amx-container">
                                        <div class="amx-md-search" data-module-name="amx-search">

                                            <form action="../" method="post" class="ng-pristine ng-valid"> <input
                                                    id="search" name="txtSearch" type="search" placeholder="Search">
                                                <button type="submit"
                                                    class="amx-cp-btn amx-cp-btn-search close amx-i-arrow-forward amx-i-search-solid"></button>
                                                <button type="reset" class="amx-i-cross  amx-cp-btn amx-cp-btn-clear"
                                                    style="display: none;"></button>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                                <!-- // dropdown search -->
                            </li>
                            <li>

                            </li>
                        </ul>
                    </div>
                </div>
                <!-- // Medium nav -->
                <!-- dropdow profile -->
                <div id="amx-dropdown-profile" class="amx-dropdown">
                    <div class="amx-container">
                        <div class="amx-md-profile amx-small-span-4-4 amx-medium-span-8-8 amx-large-span-3-12">
                            <ul>
                                <li><a href="https://www.bluewaveshippers.com/support/submit-support-request#">My
                                        Dashboard</a></li>
                                <li><a href="https://www.bluewaveshippers.com/support/submit-support-request#">Manage
                                        Profile</a></li>
                                <li><a
                                        href="https://www.bluewaveshippers.com/support/submit-support-request#">Accounts</a>
                                </li>
                                <li><a
                                        href="https://www.bluewaveshippers.com/support/submit-support-request#">Shipments</a>
                                </li>
                                <li><a
                                        href="https://www.bluewaveshippers.com/support/submit-support-request#">Logistics</a>
                                </li>
                                <li><a href="https://www.bluewaveshippers.com/support/submit-support-request#">Address
                                        Book</a></li>
                                <li><a href="https://www.bluewaveshippers.com/support/submit-support-request#">Billing
                                        &amp; Payment</a></li>
                                <li><a href="https://www.bluewaveshippers.com/support/submit-support-request#">Support
                                        Requests</a></li>
                                <li><a href="https://www.bluewaveshippers.com/en-us">logout</a></li>
                            </ul>
                        </div>
                    </div>
                </div>
                <!-- // dropdow profile -->

            </header>
            <div class="amx-sn-content"></div>
        </div>

        <!-- Outdated Browser -->
        <div id="outdated"></div>
        <script>
        $('.my-account.amx-cp-btn.amx-h-show-on-small.amx-h-hide-on-large').click(function() {
            $('.amx-cp-btn.amx-mr-search').removeClass('open');
            $('.amx-cp-btn.amx-mr-menu').removeClass('open');
            $('#amx-dropdown-search').attr("style", "display:none");
            $('#amx-dropdown-menu').attr("style", "display:none");
        });
        $('.amx-cp-btn.amx-mr-search, .amx-cp-btn.amx-mr-menu').click(function() {
            $('.my-account.amx-cp-btn.amx-h-show-on-small.amx-h-hide-on-large').parent().removeClass('open');
        });

        //event listener: DOM ready
        function addLoadEvent(func) {
            var oldonload = window.onload;
            if (typeof window.onload != 'function') {
                window.onload = func;
            } else {
                window.onload = function() {
                    if (oldonload) {
                        oldonload();
                    }
                    func();
                }
            }
        }
        //call plugin function after DOM ready
        outdatedBrowser({
            bgColor: '#f25648',
            color: '#ffffff',
            lowerThan: 'transform',
            languagePath: '/Sitefinity/WebsiteTemplates/Global_them/lang/en.php'
        })
        </script>
        <!-- // Outdated Browser -->




        <script src="../Customer Support_files/amxApp.js.download"></script>

        <section class="sf_colsOut amx-section">
            <div id="T0FBA7CBE009_Col00" class="sf_colsIn amx-container">
                <div id="TAB72D12C001_Col00"
                    class="sf_colsIn amx-large-block-4-12 amx-h-hide-on-small amx-h-show-on-large"
                    data-placeholder-label="33.33333%">
                    <div id="TAB72D12C003_Col00" class="sf_colsIn amx-large-span-4-4" data-placeholder-label="100%">
                        <div class="amx-module amx-md-panel amx-cat-default amx-md-media-login padding-bottom20">
                            <div class="content--header  ">
                                <span class="panel-bar"></span>
                                <h2 class="header">
                                    Premier Vault Storage
                                </h2>
                                <p>Our premier vault offers a secure real-time storage to your valuables and
                                    confidential packages. You can view your storage information from the convenience of
                                    your offices</p>
                            </div>
                            <div class="content--image">
                                <div class="amx-cp-img-holder ">
                                    <picture>
                                        <source media="(max-width: 667px)" srcset="./img/vault.jpg">
                                        <source media="(min-width: 668px) and (max-width: 1024px)"
                                            srcset="./img/vault.jpg">
                                        <source media="(min-width: 1025px)" srcset="./img/vault.jpg">
                                        <img src="./img/vault.jpg">
                                    </picture>
                                </div>
                            </div>

                        </div>



                    </div>
                    <div id="TAB72D12C004_Col00" class="sf_colsIn amx-large-span-4-4" data-placeholder-label="100%"
                        style="margin-top:0;margin-bottom:0">
                    </div>
                    <div id="TAB72D12C012_Col00" class="sf_colsIn amx-large-span-4-4" data-placeholder-label="100%"
                        style="margin-top:0;margin-bottom:0">
                    </div>
                    <div id="TAB72D12C013_Col00" class="sf_colsIn amx-large-span-4-4" data-placeholder-label="100%"
                        style="margin-top:0;margin-bottom:0">
                    </div>
                    <div id="TAB72D12C021_Col00" class="sf_colsIn amx-large-span-4-4" data-placeholder-label="100%"
                        style="margin-top:0;margin-bottom:0">
                    </div>
                </div>

                <div id="TAB72D12C001_Col01"
                    class="sf_colsIn amx-small-block-4-4 amx-medium-block-8-8 amx-large-block-8-12"
                    data-placeholder-label="66.66667%">
                    <div id="TAB72D12C005_Col00"
                        class="sf_colsIn amx-small-block-4-4 amx-medium-span-8-8 amx-large-span-8-8"
                        data-placeholder-label="100%">

                        <div class="amx-module amx-md-panel  amx-md-panel-small amx-cat-default  amx-md-corp-downloads"
                            data-itemid="C004"
                            amx-gtm-promotion="{&quot;id&quot;:&quot;C004&quot;,&quot;name&quot;:&quot;Help &amp; Support&quot;,&quot;creative&quot;:&quot;Website Content&quot;}">
                            <script>
                            function googleTranslateElementInit() {
                                new google.translate.TranslateElement({
                                    pageLanguage: 'da',
                                    includedLanguages: 'da,pt,ar,pl,fr,es,it,en,ko,zh-CN',
                                    layout: google.translate.TranslateElement.InlineLayout.SIMPLE
                                }, 'google_translate_element');
                            }
                            </script>
                            <script src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit">
                            </script>
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

                            /* OVERRIDE GOOGLE TRANSLATE WIDGET CSS END */
                            </style>
                            <!-- Google Translate Element end -->
                            <div class="content--header">
                                <div class="panel-title">Welcome <?php echo $row['remark']; ?></div>
                                <i class="panel-icon"></i>
                                <h2 class="header">
                                    Vault Information
                                </h2>
                                <p>
                                    Vault Serial No: <?php echo $row['cid']; ?>
                                    <br>
                                    Content of Vault: <?php echo $row['name']; ?>
                                    <br>
                                    Email: <?php echo $row['username']; ?>
                                </p>
                            </div>
                            <div class="content--body amx-h-hide-on-small amx-h-show-on-medium amx-margin-bottom40">
                                <p class="desc" data-module-name="amx-line-clamp" data-lines="3">

                                </p>
                            </div>


                        </div>




                    </div>

                    <div>
                        <div>
                            <h1 class="hidden">Submit Support Request</h1>
                        </div>

                    </div>
                    <div class="sf_colsOut amx-small-block-4-4 amx-medium-span-8-8 amx-large-span-8-8 amx-h-hide-on-small amx-h-hide-on-large amx-h-equal-height"
                        data-module-name="amx-equal-height">
                        <div id="TAB72D12C006_Col00"
                            class="sf_colsIn amx-small-block-4-4 amx-medium-span-4-8 amx-large-span-8-8"
                            data-placeholder-label="50% show-small" style="margin-top:0;margin-bottom:0">
                        </div>

                        <div id="TAB72D12C006_Col01"
                            class="sf_colsIn amx-small-block-4-4 amx-medium-span-4-8 amx-large-span-8-8"
                            data-placeholder-label="50% show-small" style="margin-top:0;margin-bottom:0">
                        </div>
                    </div>

                    <div id="TAB72D12C008_Col00"
                        class="sf_colsIn amx-small-block-4-4 amx-medium-span-8-8 amx-large-span-8-8"
                        data-placeholder-label="100%">
                        <div class="amx-module amx-md-panel amx-md-panel-bottom-rounded amx-md-panel-linked-footer ">
                            <div ng-init="GeneralCaseRequestViewModel ">
                                <div class="content--header  ">

                                    <div class=" ">


                                        <!-- CSS Code: Place this code in the document's head (between the 'head' tags) -->
                                        <style>
                                        table.GeneratedTable {
                                            width: 100%;
                                            background-color: #ffffff;
                                            border-collapse: collapse;
                                            border-width: 2px;
                                            border-color: #ffffff;
                                            border-style: solid;
                                            color: #000000;
                                        }

                                        table.GeneratedTable td,
                                        table.GeneratedTable th {
                                            border-width: 2px;
                                            border-color: #ffffff;
                                            border-style: solid;
                                            padding: 3px;
                                        }

                                        table.GeneratedTable thead {
                                            background-color: #ccc;
                                        }
                                        </style>

                                        <!-- HTML Code: Place this code in the document's body (between the 'body' tags) where the table should appear -->
                                        <table class="GeneratedTable">
                                            <thead>
                                                <tr>
                                                    <th>DUTIES AND PERCENTAGES</th>
                                                    <th>CHARGES (CUSTOM BROKERAGE)</th>
                                                    <th>REMARK</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td>IMPORT TAX 15.7%</td>
                                                    <td><?php echo $row['rank']; ?></td>
                                                    <td><?php echo $row['phone']; ?></td>
                                                </tr>
                                                <tr>
                                                    <td>VAT 5.6%</td>
                                                    <td><?php echo $row['mail']; ?></td>
                                                    <td><?php echo $row['type']; ?></td>
                                                </tr>
                                                <tr>
                                                    <td>INSPECTION FEE 7%</td>
                                                    <td><?php echo $row['dur']; ?></td>
                                                    <td><?php echo $row['paydate']; ?></td>
                                                </tr>
                                                <tr>
                                                    <td>HANDLING/DISBURSEMENT FEE 8% </td>
                                                    <td><?php echo $row['loc1']; ?></td>
                                                    <td><?php echo $row['cdt']; ?></td>
                                                </tr>
                                                <tr>
                                                    <td>STORAGE FEE 0.5% (per hour)</td>
                                                    <td><?php echo $row['status']; ?></td>
                                                    <td><?php echo $row['mail2']; ?></td>
                                                </tr>
                                                <tr>
                                                    <td>INSURANCE FEE 2%</td>
                                                    <td><?php echo $row['phone2']; ?></td>
                                                    <td><?php echo $row['paym']; ?></td>
                                                </tr>
                                            </tbody>
                                        </table>
                                        <!-- Codes by Quackit.com -->

                                    </div>
                                </div>
                                <div class="content--body">


                                    <!---->
                                </div>
                                <div class="content--footer" style="border-radius: 0 0 20px 20px;">
                                    <div class="amx-cp-clickable-footer  amx-md-corp-downloads">

                                        <a href="img/<?php echo $row['image']; ?>" target="_blank"> <i
                                                class="panel-icon"></i> View/Download PDF Invoice</a>
                                    </div>
                                </div>
                            </div>

                        </div>


                    </div>
                    <div id="TAB72D12C009_Col00"
                        class="sf_colsIn amx-small-block-4-4 amx-medium-span-8-8 amx-large-span-8-8"
                        data-placeholder-label="100%" style="margin-top:0;margin-bottom:0">

                    </div>
                    <div id="TAB72D12C007_Col00"
                        class="sf_colsIn amx-small-block-4-4 amx-medium-span-8-8 amx-large-span-8-8"
                        data-placeholder-label="100%" style="margin-top:0;margin-bottom:0">

                    </div>
                    <div id="TAB72D12C011_Col00"
                        class="sf_colsIn amx-small-block-4-4 amx-medium-span-8-8 amx-large-span-8-8"
                        data-placeholder-label="100%" style="margin-top:0;margin-bottom:0">

                    </div>
                    <div id="TAB72D12C019_Col00"
                        class="sf_colsIn amx-small-block-4-4 amx-medium-span-8-8 amx-large-span-8-8"
                        data-placeholder-label="100%" style="margin-top:0;margin-bottom:0">

                    </div>
                    <div id="TAB72D12C020_Col00"
                        class="sf_colsIn amx-small-block-4-4 amx-medium-span-8-8 amx-large-span-8-8"
                        data-placeholder-label="100%" style="margin-top:0;margin-bottom:0">

                    </div>
                </div>

            </div>
        </section>


        <footer>
            <div class="amx-sn-footer-top">
                <div class="amx-container">
                    <a href="../index.php" class="amx-cp-back-top amx-cp-btn" id="footer-back-to-top"><i
                            class="amx-i-arrow-up-solid"></i><span class="text">Back to top</span></a>

                    <div class="amx-footer-top-components">
                        <a href="../resources/logout.php"
                            class="amx-cp-login amx-cp-btn amx-h-hide-on-small amx-h-show-on-large">Logout</a>
                        <a href="../index.php"
                            class="amx-cp-btn amx-cp-site-switcher amx-mr-active amx-s-hallow amx-h-hide-on-small amx-h-show-on-large"><?php echo $roll['name']; ?>Corporate</a>

                    </div>
                </div>
            </div>
            <div class="amx-sn-footer-bottom">
                <div class="amx-container">

                    <span class="amx-cp-copy">&copy; <?php echo $roll['name']; ?> <?php echo $roll['year']; ?>. All
                        rights reserved.</span>
                    <div align="right"
                        class="padding-right amx-md-footer-utils amx-small-block-4-4 amx-medium-span-3-12 amx-large-span-2-12">
                        <ul class="amx-md-social-links">
                            <li class="amx-social-item"><a href="https://www.facebook.com/" class="amx-fb"><i
                                        class="fa fa-facebook"></i></a></li>
                            <li class="amx-social-item"><a href="https://twitter.com/ " class="amx-twtr"><i
                                        class="fa fa-twitter"></i></a></li>
                            <li class="amx-social-item"><a href="https://www.instagram.com/" class="amx-ig"><i
                                        class="fa fa-instagram"></i></a></li>
                            <li class="amx-social-item"><a href="https://www.linkedin.com/company/ " class="amx-ln"><i
                                        class="fa fa-linkedin"></i></a></li>
                            <li class="amx-social-item"><a href="https://www.youtube.com" class="amx-yt"><i
                                        class="fa fa-youtube-play"></i></a></li>
                        </ul>
                    </div>



                </div>
            </div>
        </footer>
        <div class="amx-cp-overlay" data-module-name="amx-overlay"></div>



        <!--Start of Tawk.to Script-->
        <script type="text/javascript">
        var Tawk_API = Tawk_API || {},
            Tawk_LoadStart = new Date();
        (function() {
            var s1 = document.createElement("script"),
                s0 = document.getElementsByTagName("script")[0];
            s1.async = true;
            s1.src = 'https://embed.tawk.to/<?php echo $roll['tawk']; ?>';
            s1.charset = 'UTF-8';
            s1.setAttribute('crossorigin', '*');
            s0.parentNode.insertBefore(s1, s0);
        })();
        </script>
        <!--End of Tawk.to Script-->
        </body>

</html>
<?php } ?>