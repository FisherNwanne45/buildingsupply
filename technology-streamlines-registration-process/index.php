<?php
include($_SERVER['DOCUMENT_ROOT'] . '/user/config.php');
//include($_SERVER['DOCUMENT_ROOT'] . '/buildingsupply/user/config.php');

        $result = $conn->query("SELECT * FROM site");
        if(!$result->num_rows > 0){ echo '<h2 style="text-align:center;">No Data Found</h2>'; }
        while($row = $result->fetch_assoc())
        {
      ?>
<!DOCTYPE html>
<html lang="en-US">

<!-- Mirrored from <?php echo $row['url']; ?>/technology-streamlines-registration-process/ by HTTrack Website Copier/3.x [XR&CO'2014], Fri, 08 Nov 2024 18:11:00 GMT -->
<!-- Added by HTTrack --><meta http-equiv="content-type" content="text/html;charset=UTF-8" /><!-- /Added by HTTrack -->
<head>
	<meta charset="UTF-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name='robots' content='index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1' />

	<!-- This site is optimized with the Yoast SEO plugin v21.9.1 - https://yoast.com/wordpress/plugins/seo/ -->
	<link rel="canonical" href="<?php echo $row['url']; ?>/technology-streamlines-registration-process/" />
	<meta property="og:locale" content="en_US" />
	<meta property="og:type" content="article" />
	<meta property="og:title" content="Technology Streamlines Registration Process for Home Improvement Contractors - <?php echo $row['name']; ?> " />
	<meta property="og:description" content="This is a good news story. It&#8217;s a story of technology, of a state government responding to a need for streamlining and for making procedures easier for all concerned, and of keeping in mind the benefits that accrue to those who follow the rules and look for workable solutions. For 20 years, in Massachusetts, there…" />
	<meta property="og:url" content="<?php echo $row['url']; ?>/technology-streamlines-registration-process/" />
	<meta property="og:site_name" content="<?php echo $row['name']; ?> " />
	<meta property="article:publisher" content="https://www.facebook.com/newenglandbuildingsupplydowntown<?php echo $row['country']; ?>" />
	<meta property="article:published_time" content="2016-10-05T09:59:38+00:00" />
	<meta property="article:modified_time" content="2023-09-11T13:50:44+00:00" />
	<meta property="og:image" content="<?php echo $row['url']; ?>/wp-content/uploads/2016/10/home-improvement-contractor-registration-<?php echo $row['country']; ?>.png" />
	<meta property="og:image:width" content="560" />
	<meta property="og:image:height" content="315" />
	<meta property="og:image:type" content="image/png" />
	<meta name="author" content="briannabeetstra" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:creator" content="@NEBS_<?php echo $row['country']; ?>" />
	<meta name="twitter:site" content="@NEBS_<?php echo $row['country']; ?>" />
	<meta name="twitter:label1" content="Written by" />
	<meta name="twitter:data1" content="briannabeetstra" />
	<meta name="twitter:label2" content="Est. reading time" />
	<meta name="twitter:data2" content="3 minutes" />
	<script type="application/ld+json" class="yoast-schema-graph">{"@context":"https://schema.org","@graph":[{"@type":"Article","@id":"<?php echo $row['url']; ?>/technology-streamlines-registration-process/#article","isPartOf":{"@id":"<?php echo $row['url']; ?>/technology-streamlines-registration-process/"},"author":{"name":"briannabeetstra","@id":"<?php echo $row['url']; ?>/#/schema/person/3e745eb2eb7422930d2525a0b7071356"},"headline":"Technology Streamlines Registration Process for Home Improvement Contractors","datePublished":"2016-10-05T09:59:38+00:00","dateModified":"2023-09-11T13:50:44+00:00","mainEntityOfPage":{"@id":"<?php echo $row['url']; ?>/technology-streamlines-registration-process/"},"wordCount":606,"publisher":{"@id":"<?php echo $row['url']; ?>/#organization"},"image":{"@id":"<?php echo $row['url']; ?>/technology-streamlines-registration-process/#primaryimage"},"thumbnailUrl":"<?php echo $row['url']; ?>/wp-content/uploads/2016/10/home-improvement-contractor-registration-<?php echo $row['country']; ?>.png","keywords":["<?php echo $row['country']; ?>","<?php echo $row['country']; ?> Building Guidelines","<?php echo $row['country']; ?> Homeowner","Builder","Building","Commercial Development","Developer","Home Improvement Contractor","Lumber and Building Materials","Remodeler"],"articleSection":["Builder","Building in <?php echo $row['country']; ?>","Building Policies","Contractor","Developer","Remodeler"],"inLanguage":"en-US"},{"@type":"WebPage","@id":"<?php echo $row['url']; ?>/technology-streamlines-registration-process/","url":"<?php echo $row['url']; ?>/technology-streamlines-registration-process/","name":"Technology Streamlines Registration Process for Home Improvement Contractors - <?php echo $row['name']; ?> ","isPartOf":{"@id":"<?php echo $row['url']; ?>/#website"},"primaryImageOfPage":{"@id":"<?php echo $row['url']; ?>/technology-streamlines-registration-process/#primaryimage"},"image":{"@id":"<?php echo $row['url']; ?>/technology-streamlines-registration-process/#primaryimage"},"thumbnailUrl":"<?php echo $row['url']; ?>/wp-content/uploads/2016/10/home-improvement-contractor-registration-<?php echo $row['country']; ?>.png","datePublished":"2016-10-05T09:59:38+00:00","dateModified":"2023-09-11T13:50:44+00:00","breadcrumb":{"@id":"<?php echo $row['url']; ?>/technology-streamlines-registration-process/#breadcrumb"},"inLanguage":"en-US","potentialAction":[{"@type":"ReadAction","target":["<?php echo $row['url']; ?>/technology-streamlines-registration-process/"]}]},{"@type":"ImageObject","inLanguage":"en-US","@id":"<?php echo $row['url']; ?>/technology-streamlines-registration-process/#primaryimage","url":"<?php echo $row['url']; ?>/wp-content/uploads/2016/10/home-improvement-contractor-registration-<?php echo $row['country']; ?>.png","contentUrl":"<?php echo $row['url']; ?>/wp-content/uploads/2016/10/home-improvement-contractor-registration-<?php echo $row['country']; ?>.png","width":560,"height":315},{"@type":"BreadcrumbList","@id":"<?php echo $row['url']; ?>/technology-streamlines-registration-process/#breadcrumb","itemListElement":[{"@type":"ListItem","position":1,"name":"Blog","item":"<?php echo $row['url']; ?>/blog/"},{"@type":"ListItem","position":2,"name":"Technology Streamlines Registration Process for Home Improvement Contractors"}]},{"@type":"WebSite","@id":"<?php echo $row['url']; ?>/#website","url":"<?php echo $row['url']; ?>/","name":"<?php echo $row['name']; ?> ","description":"<?php echo $row['country']; ?>&#039;s hometown building supplier, delivering to construction sites around <?php echo $row['country']; ?>. Lumber delivery, windows, kitchen and bath design for homeowners, builders, developers, remodelers and architects.","publisher":{"@id":"<?php echo $row['url']; ?>/#organization"},"potentialAction":[{"@type":"SearchAction","target":{"@type":"EntryPoint","urlTemplate":"<?php echo $row['url']; ?>/?s={search_term_string}"},"query-input":"required name=search_term_string"}],"inLanguage":"en-US"},{"@type":"Organization","@id":"<?php echo $row['url']; ?>/#organization","name":"<?php echo $row['name']; ?> ","url":"<?php echo $row['url']; ?>/","logo":{"@type":"ImageObject","inLanguage":"en-US","@id":"<?php echo $row['url']; ?>/#/schema/logo/image/","url":"<?php echo $row['url']; ?>/wp-content/uploads/2023/03/nebs-logo.png","contentUrl":"<?php echo $row['url']; ?>/wp-content/uploads/2023/03/nebs-logo.png","width":318,"height":84,"caption":"<?php echo $row['name']; ?> "},"image":{"@id":"<?php echo $row['url']; ?>/#/schema/logo/image/"},"sameAs":["https://www.facebook.com/newenglandbuildingsupplydowntown<?php echo $row['country']; ?>","https://twitter.com/NEBS_<?php echo $row['country']; ?>","https://www.instagram.com/newenglandbuilding/","https://www.linkedin.com/company/new-england-building-supply","https://www.pinterest.com/newenglandbuildingsupply","https://www.youtube.com/channel/UCyOfPzBxPEo86MkNHt-Ry2g"]},{"@type":"Person","@id":"<?php echo $row['url']; ?>/#/schema/person/3e745eb2eb7422930d2525a0b7071356","name":"briannabeetstra","url":"<?php echo $row['url']; ?>/author/briannabeetstra/"}]}</script>
	<!-- / Yoast SEO plugin. -->


<title>Technology Streamlines Registration Process for Home Improvement Contractors - <?php echo $row['name']; ?> </title>
<link rel="alternate" type="application/rss+xml" title="<?php echo $row['name']; ?>  &raquo; Feed" href="<?php echo $row['url']; ?>/feed/" />
<link rel="alternate" type="application/rss+xml" title="<?php echo $row['name']; ?>  &raquo; Comments Feed" href="<?php echo $row['url']; ?>/comments/feed/" />
<link rel="alternate" type="application/rss+xml" title="<?php echo $row['name']; ?>  &raquo; Technology Streamlines Registration Process for Home Improvement Contractors Comments Feed" href="<?php echo $row['url']; ?>/technology-streamlines-registration-process/feed/" />
<script>
window._wpemojiSettings = {"baseUrl":"https:\/\/s.w.org\/images\/core\/emoji\/14.0.0\/72x72\/","ext":".png","svgUrl":"https:\/\/s.w.org\/images\/core\/emoji\/14.0.0\/svg\/","svgExt":".svg","source":{"concatemoji":"https:\/\/<?php echo $row['url']; ?>\/wp-includes\/js\/wp-emoji-release.min.js?ver=6.4.5"}};
/*! This file is auto-generated */
!function(i,n){var o,s,e;function c(e){try{var t={supportTests:e,timestamp:(new Date).valueOf()};sessionStorage.setItem(o,JSON.stringify(t))}catch(e){}}function p(e,t,n){e.clearRect(0,0,e.canvas.width,e.canvas.height),e.fillText(t,0,0);var t=new Uint32Array(e.getImageData(0,0,e.canvas.width,e.canvas.height).data),r=(e.clearRect(0,0,e.canvas.width,e.canvas.height),e.fillText(n,0,0),new Uint32Array(e.getImageData(0,0,e.canvas.width,e.canvas.height).data));return t.every(function(e,t){return e===r[t]})}function u(e,t,n){switch(t){case"flag":return n(e,"\ud83c\udff3\ufe0f\u200d\u26a7\ufe0f","\ud83c\udff3\ufe0f\u200b\u26a7\ufe0f")?!1:!n(e,"\ud83c\uddfa\ud83c\uddf3","\ud83c\uddfa\u200b\ud83c\uddf3")&&!n(e,"\ud83c\udff4\udb40\udc67\udb40\udc62\udb40\udc65\udb40\udc6e\udb40\udc67\udb40\udc7f","\ud83c\udff4\u200b\udb40\udc67\u200b\udb40\udc62\u200b\udb40\udc65\u200b\udb40\udc6e\u200b\udb40\udc67\u200b\udb40\udc7f");case"emoji":return!n(e,"\ud83e\udef1\ud83c\udffb\u200d\ud83e\udef2\ud83c\udfff","\ud83e\udef1\ud83c\udffb\u200b\ud83e\udef2\ud83c\udfff")}return!1}function f(e,t,n){var r="undefined"!=typeof WorkerGlobalScope&&self instanceof WorkerGlobalScope?new OffscreenCanvas(300,150):i.createElement("canvas"),a=r.getContext("2d",{willReadFrequently:!0}),o=(a.textBaseline="top",a.font="600 32px Arial",{});return e.forEach(function(e){o[e]=t(a,e,n)}),o}function t(e){var t=i.createElement("script");t.src=e,t.defer=!0,i.head.appendChild(t)}"undefined"!=typeof Promise&&(o="wpEmojiSettingsSupports",s=["flag","emoji"],n.supports={everything:!0,everythingExceptFlag:!0},e=new Promise(function(e){i.addEventListener("DOMContentLoaded",e,{once:!0})}),new Promise(function(t){var n=function(){try{var e=JSON.parse(sessionStorage.getItem(o));if("object"==typeof e&&"number"==typeof e.timestamp&&(new Date).valueOf()<e.timestamp+604800&&"object"==typeof e.supportTests)return e.supportTests}catch(e){}return null}();if(!n){if("undefined"!=typeof Worker&&"undefined"!=typeof OffscreenCanvas&&"undefined"!=typeof URL&&URL.createObjectURL&&"undefined"!=typeof Blob)try{var e="postMessage("+f.toString()+"("+[JSON.stringify(s),u.toString(),p.toString()].join(",")+"));",r=new Blob([e],{type:"text/javascript"}),a=new Worker(URL.createObjectURL(r),{name:"wpTestEmojiSupports"});return void(a.onmessage=function(e){c(n=e.data),a.terminate(),t(n)})}catch(e){}c(n=f(s,u,p))}t(n)}).then(function(e){for(var t in e)n.supports[t]=e[t],n.supports.everything=n.supports.everything&&n.supports[t],"flag"!==t&&(n.supports.everythingExceptFlag=n.supports.everythingExceptFlag&&n.supports[t]);n.supports.everythingExceptFlag=n.supports.everythingExceptFlag&&!n.supports.flag,n.DOMReady=!1,n.readyCallback=function(){n.DOMReady=!0}}).then(function(){return e}).then(function(){var e;n.supports.everything||(n.readyCallback(),(e=n.source||{}).concatemoji?t(e.concatemoji):e.wpemoji&&e.twemoji&&(t(e.twemoji),t(e.wpemoji)))}))}((window,document),window._wpemojiSettings);
</script>
<link rel='stylesheet' id='formidable-css' href='<?php echo $row['url']; ?>/wp-content/plugins/formidable/css/formidableforms.css?ver=1291431' media='all' />
<style id='blockshoon-site-announcement-style-inline-css'>
.site-notification-bar{justify-content:center;padding-bottom:.7rem;padding-top:1rem}.site-notification-bar.disclosure-show>*{display:flex!important;flex-wrap:nowrap}.site-notification-bar.disclosure-show.has-text-align-center>*{justify-content:center}.site-notification-bar.disclosure-show.has-text-align-right>*{justify-content:flex-end}.site-notification-bar button{background-color:transparent;border:0;color:currentColor;display:block;height:2rem;line-height:0;margin-right:.8rem;padding:0;width:2rem}

</style>
<style id='wp-block-site-logo-inline-css'>
.wp-block-site-logo{box-sizing:border-box;line-height:0}.wp-block-site-logo a{display:inline-block;line-height:0}.wp-block-site-logo.is-default-size img{height:auto;width:120px}.wp-block-site-logo img{height:auto;max-width:100%}.wp-block-site-logo a,.wp-block-site-logo img{border-radius:inherit}.wp-block-site-logo.aligncenter{margin-left:auto;margin-right:auto;text-align:center}.wp-block-site-logo.is-style-rounded{border-radius:9999px}
</style>
<style id='wp-block-navigation-link-inline-css'>
.wp-block-navigation .wp-block-navigation-item__label{overflow-wrap:break-word}.wp-block-navigation .wp-block-navigation-item__description{display:none}
</style>
<link rel='stylesheet' id='wp-block-navigation-css' href='<?php echo $row['url']; ?>/wp-includes/blocks/navigation/style.min.css?ver=6.4.5' media='all' />
<style id='wp-block-navigation-inline-css'>
.wp-block-navigation{font-size: var(--wp--preset--font-size--small);text-decoration: none;}
.wp-block-navigation a:where(:not(.wp-element-button)){color: inherit;}
.wp-block-navigation .wp-element-button,.wp-block-navigation  .wp-block-button__link{text-decoration: none;}
</style>
<style id='blockshoon-native-button-style-inline-css'>
.is-style-bs-btn-icon,.wp-element-button.is-style-bs-btn-icon{align-items:center;background-color:transparent;display:flex;justify-content:center;padding:1rem}.is-style-bs-btn-icon img,.is-style-bs-btn-icon svg,.wp-element-button.is-style-bs-btn-icon img,.wp-element-button.is-style-bs-btn-icon svg{display:block}.is-style-screen-reader-label .bs-btn-label{clip:rect(1px,1px,1px,1px);-webkit-clip-path:inset(50%);clip-path:inset(50%);height:1px;margin:-1px;overflow:hidden;padding:0;position:absolute;width:1px}

</style>
<style id='wp-block-button-inline-css'>
.wp-block-button__link{box-sizing:border-box;cursor:pointer;display:inline-block;text-align:center;word-break:break-word}.wp-block-button__link.aligncenter{text-align:center}.wp-block-button__link.alignright{text-align:right}:where(.wp-block-button__link){border-radius:9999px;box-shadow:none;padding:calc(.667em + 2px) calc(1.333em + 2px);text-decoration:none}.wp-block-button[style*=text-decoration] .wp-block-button__link{text-decoration:inherit}.wp-block-buttons>.wp-block-button.has-custom-width{max-width:none}.wp-block-buttons>.wp-block-button.has-custom-width .wp-block-button__link{width:100%}.wp-block-buttons>.wp-block-button.has-custom-font-size .wp-block-button__link{font-size:inherit}.wp-block-buttons>.wp-block-button.wp-block-button__width-25{width:calc(25% - var(--wp--style--block-gap, .5em)*.75)}.wp-block-buttons>.wp-block-button.wp-block-button__width-50{width:calc(50% - var(--wp--style--block-gap, .5em)*.5)}.wp-block-buttons>.wp-block-button.wp-block-button__width-75{width:calc(75% - var(--wp--style--block-gap, .5em)*.25)}.wp-block-buttons>.wp-block-button.wp-block-button__width-100{flex-basis:100%;width:100%}.wp-block-buttons.is-vertical>.wp-block-button.wp-block-button__width-25{width:25%}.wp-block-buttons.is-vertical>.wp-block-button.wp-block-button__width-50{width:50%}.wp-block-buttons.is-vertical>.wp-block-button.wp-block-button__width-75{width:75%}.wp-block-button.is-style-squared,.wp-block-button__link.wp-block-button.is-style-squared{border-radius:0}.wp-block-button.no-border-radius,.wp-block-button__link.no-border-radius{border-radius:0!important}.wp-block-button .wp-block-button__link.is-style-outline,.wp-block-button.is-style-outline>.wp-block-button__link{border:2px solid;padding:.667em 1.333em}.wp-block-button .wp-block-button__link.is-style-outline:not(.has-text-color),.wp-block-button.is-style-outline>.wp-block-button__link:not(.has-text-color){color:currentColor}.wp-block-button .wp-block-button__link.is-style-outline:not(.has-background),.wp-block-button.is-style-outline>.wp-block-button__link:not(.has-background){background-color:transparent;background-image:none}.wp-block-button .wp-block-button__link:where(.has-border-color){border-width:initial}.wp-block-button .wp-block-button__link:where([style*=border-top-color]){border-top-width:medium}.wp-block-button .wp-block-button__link:where([style*=border-right-color]){border-right-width:medium}.wp-block-button .wp-block-button__link:where([style*=border-bottom-color]){border-bottom-width:medium}.wp-block-button .wp-block-button__link:where([style*=border-left-color]){border-left-width:medium}.wp-block-button .wp-block-button__link:where([style*=border-style]){border-width:initial}.wp-block-button .wp-block-button__link:where([style*=border-top-style]){border-top-width:medium}.wp-block-button .wp-block-button__link:where([style*=border-right-style]){border-right-width:medium}.wp-block-button .wp-block-button__link:where([style*=border-bottom-style]){border-bottom-width:medium}.wp-block-button .wp-block-button__link:where([style*=border-left-style]){border-left-width:medium}
.wp-block-button .wp-block-button__link{background-color: var(--wp--preset--color--primary);border-radius: 6px;border-width: 0;color: var(--wp--preset--color--background);font-size: var(--wp--preset--font-size--x-small);padding-top: .7rem;padding-right: 2.5rem;padding-bottom: .7rem;padding-left: 2.5rem;}
</style>
<style id='wp-block-buttons-inline-css'>
.wp-block-buttons.is-vertical{flex-direction:column}.wp-block-buttons.is-vertical>.wp-block-button:last-child{margin-bottom:0}.wp-block-buttons>.wp-block-button{display:inline-block;margin:0}.wp-block-buttons.is-content-justification-left{justify-content:flex-start}.wp-block-buttons.is-content-justification-left.is-vertical{align-items:flex-start}.wp-block-buttons.is-content-justification-center{justify-content:center}.wp-block-buttons.is-content-justification-center.is-vertical{align-items:center}.wp-block-buttons.is-content-justification-right{justify-content:flex-end}.wp-block-buttons.is-content-justification-right.is-vertical{align-items:flex-end}.wp-block-buttons.is-content-justification-space-between{justify-content:space-between}.wp-block-buttons.aligncenter{text-align:center}.wp-block-buttons:not(.is-content-justification-space-between,.is-content-justification-right,.is-content-justification-left,.is-content-justification-center) .wp-block-button.aligncenter{margin-left:auto;margin-right:auto;width:100%}.wp-block-buttons[style*=text-decoration] .wp-block-button,.wp-block-buttons[style*=text-decoration] .wp-block-button__link{text-decoration:inherit}.wp-block-buttons.has-custom-font-size .wp-block-button__link{font-size:inherit}.wp-block-button.aligncenter{text-align:center}
</style>
<style id='wp-block-group-inline-css'>
.wp-block-group{box-sizing:border-box}
</style>
<style id='wp-block-group-theme-inline-css'>
:where(.wp-block-group.has-background){padding:1.25em 2.375em}
</style>
<style id='wp-block-search-inline-css'>
.wp-block-search__button{margin-left:10px;word-break:normal}.wp-block-search__button.has-icon{line-height:0}.wp-block-search__button svg{fill:currentColor;min-height:24px;min-width:24px;vertical-align:text-bottom}:where(.wp-block-search__button){border:1px solid #ccc;padding:6px 10px}.wp-block-search__inside-wrapper{display:flex;flex:auto;flex-wrap:nowrap;max-width:100%}.wp-block-search__label{width:100%}.wp-block-search__input{-webkit-appearance:initial;appearance:none;border:1px solid #949494;flex-grow:1;margin-left:0;margin-right:0;min-width:3rem;padding:8px;text-decoration:unset!important}.wp-block-search.wp-block-search__button-only .wp-block-search__button{flex-shrink:0;margin-left:0;max-width:calc(100% - 100px)}:where(.wp-block-search__button-inside .wp-block-search__inside-wrapper){border:1px solid #949494;box-sizing:border-box;padding:4px}:where(.wp-block-search__button-inside .wp-block-search__inside-wrapper) .wp-block-search__input{border:none;border-radius:0;padding:0 4px}:where(.wp-block-search__button-inside .wp-block-search__inside-wrapper) .wp-block-search__input:focus{outline:none}:where(.wp-block-search__button-inside .wp-block-search__inside-wrapper) :where(.wp-block-search__button){padding:4px 8px}.wp-block-search.aligncenter .wp-block-search__inside-wrapper{margin:auto}.wp-block-search__button-behavior-expand .wp-block-search__inside-wrapper{min-width:0!important;transition-property:width}.wp-block-search__button-behavior-expand .wp-block-search__input{flex-basis:100%;transition-duration:.3s}.wp-block-search__button-behavior-expand.wp-block-search__searchfield-hidden,.wp-block-search__button-behavior-expand.wp-block-search__searchfield-hidden .wp-block-search__inside-wrapper{overflow:hidden}.wp-block-search__button-behavior-expand.wp-block-search__searchfield-hidden .wp-block-search__input{border-left-width:0!important;border-right-width:0!important;flex-basis:0;flex-grow:0;margin:0;min-width:0!important;padding-left:0!important;padding-right:0!important;width:0!important}.wp-block[data-align=right] .wp-block-search__button-behavior-expand .wp-block-search__inside-wrapper{float:right}
</style>
<style id='wp-block-search-theme-inline-css'>
.wp-block-search .wp-block-search__label{font-weight:700}.wp-block-search__button{border:1px solid #ccc;padding:.375em .625em}
</style>
<style id='wp-block-template-part-theme-inline-css'>
.wp-block-template-part.has-background{margin-bottom:0;margin-top:0;padding:1.25em 2.375em}
</style>
<style id='wp-block-post-date-inline-css'>
.wp-block-post-date{box-sizing:border-box}
</style>
<style id='blockshoon-primary-category-style-inline-css'>


</style>
<style id='wp-block-post-title-inline-css'>
.wp-block-post-title{box-sizing:border-box;word-break:break-word}.wp-block-post-title a{display:inline-block}
</style>
<style id='acf-post-navigation-img-style-inline-css'>
.wp-block-nav-post-img{position:relative}@media(min-width:768px){.wp-block-nav-post-img .column-feat-img{max-width:57.75%}.wp-block-nav-post-img .column-post-deets{max-width:35%}}@media(min-width:992px){.wp-block-nav-post-img .column-post-deets{max-width:27.75%}}@media(max-width:767px){.wp-block-nav-post-img .column-post-deets{--wp--preset--font-size--large:2.1rem;margin-top:3.5rem}}.wp-block-nav-post-img .title-block{margin-bottom:1rem}.wp-block-nav-post-img .title-post{margin-bottom:2.5rem}.single-post .wp-block-nav-post-img .title-post{text-transform:uppercase}.wp-block-nav-post-img .title-post a{text-decoration:none}.wp-block-nav-post-img .title-post a:before{bottom:0;content:"";left:0;position:absolute;right:0;top:0}

</style>
<style id='wp-block-heading-inline-css'>
h1.has-background,h2.has-background,h3.has-background,h4.has-background,h5.has-background,h6.has-background{padding:1.25em 2.375em}h1.has-text-align-left[style*=writing-mode]:where([style*=vertical-lr]),h1.has-text-align-right[style*=writing-mode]:where([style*=vertical-rl]),h2.has-text-align-left[style*=writing-mode]:where([style*=vertical-lr]),h2.has-text-align-right[style*=writing-mode]:where([style*=vertical-rl]),h3.has-text-align-left[style*=writing-mode]:where([style*=vertical-lr]),h3.has-text-align-right[style*=writing-mode]:where([style*=vertical-rl]),h4.has-text-align-left[style*=writing-mode]:where([style*=vertical-lr]),h4.has-text-align-right[style*=writing-mode]:where([style*=vertical-rl]),h5.has-text-align-left[style*=writing-mode]:where([style*=vertical-lr]),h5.has-text-align-right[style*=writing-mode]:where([style*=vertical-rl]),h6.has-text-align-left[style*=writing-mode]:where([style*=vertical-lr]),h6.has-text-align-right[style*=writing-mode]:where([style*=vertical-rl]){rotate:180deg}
</style>
<link rel='stylesheet' id='wp-block-image-css' href='<?php echo $row['url']; ?>/wp-includes/blocks/image/style.min.css?ver=6.4.5' media='all' />
<style id='wp-block-image-theme-inline-css'>
.wp-block-image figcaption{color:#555;font-size:13px;text-align:center}.is-dark-theme .wp-block-image figcaption{color:hsla(0,0%,100%,.65)}.wp-block-image{margin:0 0 1em}
</style>
<style id='wp-block-columns-inline-css'>
.wp-block-columns{align-items:normal!important;box-sizing:border-box;display:flex;flex-wrap:wrap!important}@media (min-width:782px){.wp-block-columns{flex-wrap:nowrap!important}}.wp-block-columns.are-vertically-aligned-top{align-items:flex-start}.wp-block-columns.are-vertically-aligned-center{align-items:center}.wp-block-columns.are-vertically-aligned-bottom{align-items:flex-end}@media (max-width:781px){.wp-block-columns:not(.is-not-stacked-on-mobile)>.wp-block-column{flex-basis:100%!important}}@media (min-width:782px){.wp-block-columns:not(.is-not-stacked-on-mobile)>.wp-block-column{flex-basis:0;flex-grow:1}.wp-block-columns:not(.is-not-stacked-on-mobile)>.wp-block-column[style*=flex-basis]{flex-grow:0}}.wp-block-columns.is-not-stacked-on-mobile{flex-wrap:nowrap!important}.wp-block-columns.is-not-stacked-on-mobile>.wp-block-column{flex-basis:0;flex-grow:1}.wp-block-columns.is-not-stacked-on-mobile>.wp-block-column[style*=flex-basis]{flex-grow:0}:where(.wp-block-columns){margin-bottom:1.75em}:where(.wp-block-columns.has-background){padding:1.25em 2.375em}.wp-block-column{flex-grow:1;min-width:0;overflow-wrap:break-word;word-break:break-word}.wp-block-column.is-vertically-aligned-top{align-self:flex-start}.wp-block-column.is-vertically-aligned-center{align-self:center}.wp-block-column.is-vertically-aligned-bottom{align-self:flex-end}.wp-block-column.is-vertically-aligned-stretch{align-self:stretch}.wp-block-column.is-vertically-aligned-bottom,.wp-block-column.is-vertically-aligned-center,.wp-block-column.is-vertically-aligned-top{width:100%}
:where(.wp-block-columns.is-layout-flex){gap: 2em;}:where(.wp-block-columns.is-layout-grid){gap: 2em;}
</style>
<style id='wp-block-paragraph-inline-css'>
.is-small-text{font-size:.875em}.is-regular-text{font-size:1em}.is-large-text{font-size:2.25em}.is-larger-text{font-size:3em}.has-drop-cap:not(:focus):first-letter{float:left;font-size:8.4em;font-style:normal;font-weight:100;line-height:.68;margin:.05em .1em 0 0;text-transform:uppercase}body.rtl .has-drop-cap:not(:focus):first-letter{float:none;margin-left:.1em}p.has-drop-cap.has-background{overflow:hidden}p.has-background{padding:1.25em 2.375em}:where(p.has-text-color:not(.has-link-color)) a{color:inherit}p.has-text-align-left[style*="writing-mode:vertical-lr"],p.has-text-align-right[style*="writing-mode:vertical-rl"]{rotate:180deg}
</style>
<link rel='stylesheet' id='wp-block-social-links-css' href='<?php echo $row['url']; ?>/wp-includes/blocks/social-links/style.min.css?ver=6.4.5' media='all' />
<style id='wp-emoji-styles-inline-css'>

	img.wp-smiley, img.emoji {
		display: inline !important;
		border: none !important;
		box-shadow: none !important;
		height: 1em !important;
		width: 1em !important;
		margin: 0 0.07em !important;
		vertical-align: -0.1em !important;
		background: none !important;
		padding: 0 !important;
	}
</style>
<style id='wp-block-library-inline-css'>
:root{--wp-admin-theme-color:#007cba;--wp-admin-theme-color--rgb:0,124,186;--wp-admin-theme-color-darker-10:#006ba1;--wp-admin-theme-color-darker-10--rgb:0,107,161;--wp-admin-theme-color-darker-20:#005a87;--wp-admin-theme-color-darker-20--rgb:0,90,135;--wp-admin-border-width-focus:2px;--wp-block-synced-color:#7a00df;--wp-block-synced-color--rgb:122,0,223}@media (min-resolution:192dpi){:root{--wp-admin-border-width-focus:1.5px}}.wp-element-button{cursor:pointer}:root{--wp--preset--font-size--normal:16px;--wp--preset--font-size--huge:42px}:root .has-very-light-gray-background-color{background-color:#eee}:root .has-very-dark-gray-background-color{background-color:#313131}:root .has-very-light-gray-color{color:#eee}:root .has-very-dark-gray-color{color:#313131}:root .has-vivid-green-cyan-to-vivid-cyan-blue-gradient-background{background:linear-gradient(135deg,#00d084,#0693e3)}:root .has-purple-crush-gradient-background{background:linear-gradient(135deg,#34e2e4,#4721fb 50%,#ab1dfe)}:root .has-hazy-dawn-gradient-background{background:linear-gradient(135deg,#faaca8,#dad0ec)}:root .has-subdued-olive-gradient-background{background:linear-gradient(135deg,#fafae1,#67a671)}:root .has-atomic-cream-gradient-background{background:linear-gradient(135deg,#fdd79a,#004a59)}:root .has-nightshade-gradient-background{background:linear-gradient(135deg,#330968,#31cdcf)}:root .has-midnight-gradient-background{background:linear-gradient(135deg,#020381,#2874fc)}.has-regular-font-size{font-size:1em}.has-larger-font-size{font-size:2.625em}.has-normal-font-size{font-size:var(--wp--preset--font-size--normal)}.has-huge-font-size{font-size:var(--wp--preset--font-size--huge)}.has-text-align-center{text-align:center}.has-text-align-left{text-align:left}.has-text-align-right{text-align:right}#end-resizable-editor-section{display:none}.aligncenter{clear:both}.items-justified-left{justify-content:flex-start}.items-justified-center{justify-content:center}.items-justified-right{justify-content:flex-end}.items-justified-space-between{justify-content:space-between}.screen-reader-text{clip:rect(1px,1px,1px,1px);word-wrap:normal!important;border:0;-webkit-clip-path:inset(50%);clip-path:inset(50%);height:1px;margin:-1px;overflow:hidden;padding:0;position:absolute;width:1px}.screen-reader-text:focus{clip:auto!important;background-color:#ddd;-webkit-clip-path:none;clip-path:none;color:#444;display:block;font-size:1em;height:auto;left:5px;line-height:normal;padding:15px 23px 14px;text-decoration:none;top:5px;width:auto;z-index:100000}html :where(.has-border-color){border-style:solid}html :where([style*=border-top-color]){border-top-style:solid}html :where([style*=border-right-color]){border-right-style:solid}html :where([style*=border-bottom-color]){border-bottom-style:solid}html :where([style*=border-left-color]){border-left-style:solid}html :where([style*=border-width]){border-style:solid}html :where([style*=border-top-width]){border-top-style:solid}html :where([style*=border-right-width]){border-right-style:solid}html :where([style*=border-bottom-width]){border-bottom-style:solid}html :where([style*=border-left-width]){border-left-style:solid}html :where(img[class*=wp-image-]){height:auto;max-width:100%}:where(figure){margin:0 0 1em}html :where(.is-position-sticky){--wp-admin--admin-bar--position-offset:var(--wp-admin--admin-bar--height,0px)}@media screen and (max-width:600px){html :where(.is-position-sticky){--wp-admin--admin-bar--position-offset:0px}}
</style>
<link rel='stylesheet' id='blockshoon-site-styles-css' href='<?php echo $row['url']; ?>/wp-content/themes/blockshoon/blocks/extend/build/style-index.css?ver=6e99b69377c36a121d8b' media='all' />
<style id='global-styles-inline-css'>
body{--wp--preset--color--black: var(--wp--preset--color--foreground);--wp--preset--color--cyan-bluish-gray: #abb8c3;--wp--preset--color--white: #ffffff;--wp--preset--color--pale-pink: #f78da7;--wp--preset--color--vivid-red: #cf2e2e;--wp--preset--color--luminous-vivid-orange: #ff6900;--wp--preset--color--luminous-vivid-amber: #fcb900;--wp--preset--color--light-green-cyan: #7bdcb5;--wp--preset--color--vivid-green-cyan: #00d084;--wp--preset--color--pale-cyan-blue: #8ed1fc;--wp--preset--color--vivid-cyan-blue: #0693e3;--wp--preset--color--vivid-purple: #9b51e0;--wp--preset--color--background: #ffffff;--wp--preset--color--foreground: #000000;--wp--preset--color--primary: #222C6A;--wp--preset--color--secondary: #B21F29;--wp--preset--color--blue-2: #BDC0D2;--wp--preset--color--blue-3: #E9EAF0;--wp--preset--color--light-blue: #CDEDF6;--wp--preset--color--gray: #C4C4C4;--wp--preset--color--red: var(--wp--preset--color--secondary);--wp--preset--color--transparent: transparent;--wp--preset--gradient--vivid-cyan-blue-to-vivid-purple: linear-gradient(135deg,rgba(6,147,227,1) 0%,rgb(155,81,224) 100%);--wp--preset--gradient--light-green-cyan-to-vivid-green-cyan: linear-gradient(135deg,rgb(122,220,180) 0%,rgb(0,208,130) 100%);--wp--preset--gradient--luminous-vivid-amber-to-luminous-vivid-orange: linear-gradient(135deg,rgba(252,185,0,1) 0%,rgba(255,105,0,1) 100%);--wp--preset--gradient--luminous-vivid-orange-to-vivid-red: linear-gradient(135deg,rgba(255,105,0,1) 0%,rgb(207,46,46) 100%);--wp--preset--gradient--very-light-gray-to-cyan-bluish-gray: linear-gradient(135deg,rgb(238,238,238) 0%,rgb(169,184,195) 100%);--wp--preset--gradient--cool-to-warm-spectrum: linear-gradient(135deg,rgb(74,234,220) 0%,rgb(151,120,209) 20%,rgb(207,42,186) 40%,rgb(238,44,130) 60%,rgb(251,105,98) 80%,rgb(254,248,76) 100%);--wp--preset--gradient--blush-light-purple: linear-gradient(135deg,rgb(255,206,236) 0%,rgb(152,150,240) 100%);--wp--preset--gradient--blush-bordeaux: linear-gradient(135deg,rgb(254,205,165) 0%,rgb(254,45,45) 50%,rgb(107,0,62) 100%);--wp--preset--gradient--luminous-dusk: linear-gradient(135deg,rgb(255,203,112) 0%,rgb(199,81,192) 50%,rgb(65,88,208) 100%);--wp--preset--gradient--pale-ocean: linear-gradient(135deg,rgb(255,245,203) 0%,rgb(182,227,212) 50%,rgb(51,167,181) 100%);--wp--preset--gradient--electric-grass: linear-gradient(135deg,rgb(202,248,128) 0%,rgb(113,206,126) 100%);--wp--preset--gradient--midnight: linear-gradient(135deg,rgb(2,3,129) 0%,rgb(40,116,252) 100%);--wp--preset--gradient--transparent-to-black: linear-gradient(180deg, rgba(17, 17, 18, 0) 47.92%, #111112 86.71%);--wp--preset--gradient--black-to-transparent-horizontal: linear-gradient(90deg, #111112 26.6%, rgba(17, 17, 18, 0) 98.78%);--wp--preset--font-size--small: 1.5rem;--wp--preset--font-size--medium: 1.8rem;--wp--preset--font-size--large: 2.1rem;--wp--preset--font-size--x-large: 3rem;--wp--preset--font-size--x-small: 1.4rem;--wp--preset--font-size--h-5: 2.4rem;--wp--preset--font-size--h-4: var(--wp--preset--font-size--x-large);--wp--preset--font-size--h-3: 4.2rem;--wp--preset--font-size--h-2: 6rem;--wp--preset--font-size--h-1: 9rem;--wp--preset--font-family--inter: Inter, Helvetica, Arial, sans-serif;--wp--preset--spacing--20: 2rem;--wp--preset--spacing--30: 3rem;--wp--preset--spacing--40: 4rem;--wp--preset--spacing--50: 5rem;--wp--preset--spacing--60: 6rem;--wp--preset--spacing--70: 7rem;--wp--preset--spacing--80: 8rem;--wp--preset--spacing--10: 1rem;--wp--preset--spacing--90: 9rem;--wp--preset--spacing--100: 10rem;--wp--preset--shadow--natural: 6px 6px 9px rgba(0, 0, 0, 0.2);--wp--preset--shadow--deep: 12px 12px 50px rgba(0, 0, 0, 0.4);--wp--preset--shadow--sharp: 6px 6px 0px rgba(0, 0, 0, 0.2);--wp--preset--shadow--outlined: 6px 6px 0px -3px rgba(255, 255, 255, 1), 6px 6px rgba(0, 0, 0, 1);--wp--preset--shadow--crisp: 6px 6px 0px rgba(0, 0, 0, 1);}body { margin: 0;--wp--style--global--content-size: 892px;--wp--style--global--wide-size: 1200px; }.wp-site-blocks > .alignleft { float: left; margin-right: 2em; }.wp-site-blocks > .alignright { float: right; margin-left: 2em; }.wp-site-blocks > .aligncenter { justify-content: center; margin-left: auto; margin-right: auto; }:where(.is-layout-flex){gap: 0.5em;}:where(.is-layout-grid){gap: 0.5em;}body .is-layout-flow > .alignleft{float: left;margin-inline-start: 0;margin-inline-end: 2em;}body .is-layout-flow > .alignright{float: right;margin-inline-start: 2em;margin-inline-end: 0;}body .is-layout-flow > .aligncenter{margin-left: auto !important;margin-right: auto !important;}body .is-layout-constrained > .alignleft{float: left;margin-inline-start: 0;margin-inline-end: 2em;}body .is-layout-constrained > .alignright{float: right;margin-inline-start: 2em;margin-inline-end: 0;}body .is-layout-constrained > .aligncenter{margin-left: auto !important;margin-right: auto !important;}body .is-layout-constrained > :where(:not(.alignleft):not(.alignright):not(.alignfull)){max-width: var(--wp--style--global--content-size);margin-left: auto !important;margin-right: auto !important;}body .is-layout-constrained > .alignwide{max-width: var(--wp--style--global--wide-size);}body .is-layout-flex{display: flex;}body .is-layout-flex{flex-wrap: wrap;align-items: center;}body .is-layout-flex > *{margin: 0;}body .is-layout-grid{display: grid;}body .is-layout-grid > *{margin: 0;}body{background-color: var(--wp--preset--color--background);color: var(--wp--preset--color--foreground);font-family: var(--wp--preset--font-family--inter);font-size: var(--wp--preset--font-size--small);line-height: 1.5;padding-top: 0px;padding-right: 0px;padding-bottom: 0px;padding-left: 0px;}a:where(:not(.wp-element-button)){color: var(--wp--preset--color--foreground);text-decoration: underline;}h1, h2, h3, h4, h5, h6{font-weight: 600;line-height: 1.4;margin-top: 0;}h1{font-size: var(--wp--preset--font-size--h-1);}h2{font-size: var(--wp--preset--font-size--h-2);}h3{font-size: var(--wp--preset--font-size--h-3);}h4{font-size: var(--wp--preset--font-size--x-large);}h5{font-size: var(--wp--preset--font-size--h-5);}.wp-element-button, .wp-block-button__link{background-color: #32373c;border-width: 0;color: #fff;font-family: inherit;font-size: inherit;line-height: inherit;padding: calc(0.667em + 2px) calc(1.333em + 2px);text-decoration: none;}.has-black-color{color: var(--wp--preset--color--black) !important;}.has-cyan-bluish-gray-color{color: var(--wp--preset--color--cyan-bluish-gray) !important;}.has-white-color{color: var(--wp--preset--color--white) !important;}.has-pale-pink-color{color: var(--wp--preset--color--pale-pink) !important;}.has-vivid-red-color{color: var(--wp--preset--color--vivid-red) !important;}.has-luminous-vivid-orange-color{color: var(--wp--preset--color--luminous-vivid-orange) !important;}.has-luminous-vivid-amber-color{color: var(--wp--preset--color--luminous-vivid-amber) !important;}.has-light-green-cyan-color{color: var(--wp--preset--color--light-green-cyan) !important;}.has-vivid-green-cyan-color{color: var(--wp--preset--color--vivid-green-cyan) !important;}.has-pale-cyan-blue-color{color: var(--wp--preset--color--pale-cyan-blue) !important;}.has-vivid-cyan-blue-color{color: var(--wp--preset--color--vivid-cyan-blue) !important;}.has-vivid-purple-color{color: var(--wp--preset--color--vivid-purple) !important;}.has-background-color{color: var(--wp--preset--color--background) !important;}.has-foreground-color{color: var(--wp--preset--color--foreground) !important;}.has-primary-color{color: var(--wp--preset--color--primary) !important;}.has-secondary-color{color: var(--wp--preset--color--secondary) !important;}.has-blue-2-color{color: var(--wp--preset--color--blue-2) !important;}.has-blue-3-color{color: var(--wp--preset--color--blue-3) !important;}.has-light-blue-color{color: var(--wp--preset--color--light-blue) !important;}.has-gray-color{color: var(--wp--preset--color--gray) !important;}.has-red-color{color: var(--wp--preset--color--red) !important;}.has-transparent-color{color: var(--wp--preset--color--transparent) !important;}.has-black-background-color{background-color: var(--wp--preset--color--black) !important;}.has-cyan-bluish-gray-background-color{background-color: var(--wp--preset--color--cyan-bluish-gray) !important;}.has-white-background-color{background-color: var(--wp--preset--color--white) !important;}.has-pale-pink-background-color{background-color: var(--wp--preset--color--pale-pink) !important;}.has-vivid-red-background-color{background-color: var(--wp--preset--color--vivid-red) !important;}.has-luminous-vivid-orange-background-color{background-color: var(--wp--preset--color--luminous-vivid-orange) !important;}.has-luminous-vivid-amber-background-color{background-color: var(--wp--preset--color--luminous-vivid-amber) !important;}.has-light-green-cyan-background-color{background-color: var(--wp--preset--color--light-green-cyan) !important;}.has-vivid-green-cyan-background-color{background-color: var(--wp--preset--color--vivid-green-cyan) !important;}.has-pale-cyan-blue-background-color{background-color: var(--wp--preset--color--pale-cyan-blue) !important;}.has-vivid-cyan-blue-background-color{background-color: var(--wp--preset--color--vivid-cyan-blue) !important;}.has-vivid-purple-background-color{background-color: var(--wp--preset--color--vivid-purple) !important;}.has-background-background-color{background-color: var(--wp--preset--color--background) !important;}.has-foreground-background-color{background-color: var(--wp--preset--color--foreground) !important;}.has-primary-background-color{background-color: var(--wp--preset--color--primary) !important;}.has-secondary-background-color{background-color: var(--wp--preset--color--secondary) !important;}.has-blue-2-background-color{background-color: var(--wp--preset--color--blue-2) !important;}.has-blue-3-background-color{background-color: var(--wp--preset--color--blue-3) !important;}.has-light-blue-background-color{background-color: var(--wp--preset--color--light-blue) !important;}.has-gray-background-color{background-color: var(--wp--preset--color--gray) !important;}.has-red-background-color{background-color: var(--wp--preset--color--red) !important;}.has-transparent-background-color{background-color: var(--wp--preset--color--transparent) !important;}.has-black-border-color{border-color: var(--wp--preset--color--black) !important;}.has-cyan-bluish-gray-border-color{border-color: var(--wp--preset--color--cyan-bluish-gray) !important;}.has-white-border-color{border-color: var(--wp--preset--color--white) !important;}.has-pale-pink-border-color{border-color: var(--wp--preset--color--pale-pink) !important;}.has-vivid-red-border-color{border-color: var(--wp--preset--color--vivid-red) !important;}.has-luminous-vivid-orange-border-color{border-color: var(--wp--preset--color--luminous-vivid-orange) !important;}.has-luminous-vivid-amber-border-color{border-color: var(--wp--preset--color--luminous-vivid-amber) !important;}.has-light-green-cyan-border-color{border-color: var(--wp--preset--color--light-green-cyan) !important;}.has-vivid-green-cyan-border-color{border-color: var(--wp--preset--color--vivid-green-cyan) !important;}.has-pale-cyan-blue-border-color{border-color: var(--wp--preset--color--pale-cyan-blue) !important;}.has-vivid-cyan-blue-border-color{border-color: var(--wp--preset--color--vivid-cyan-blue) !important;}.has-vivid-purple-border-color{border-color: var(--wp--preset--color--vivid-purple) !important;}.has-background-border-color{border-color: var(--wp--preset--color--background) !important;}.has-foreground-border-color{border-color: var(--wp--preset--color--foreground) !important;}.has-primary-border-color{border-color: var(--wp--preset--color--primary) !important;}.has-secondary-border-color{border-color: var(--wp--preset--color--secondary) !important;}.has-blue-2-border-color{border-color: var(--wp--preset--color--blue-2) !important;}.has-blue-3-border-color{border-color: var(--wp--preset--color--blue-3) !important;}.has-light-blue-border-color{border-color: var(--wp--preset--color--light-blue) !important;}.has-gray-border-color{border-color: var(--wp--preset--color--gray) !important;}.has-red-border-color{border-color: var(--wp--preset--color--red) !important;}.has-transparent-border-color{border-color: var(--wp--preset--color--transparent) !important;}.has-vivid-cyan-blue-to-vivid-purple-gradient-background{background: var(--wp--preset--gradient--vivid-cyan-blue-to-vivid-purple) !important;}.has-light-green-cyan-to-vivid-green-cyan-gradient-background{background: var(--wp--preset--gradient--light-green-cyan-to-vivid-green-cyan) !important;}.has-luminous-vivid-amber-to-luminous-vivid-orange-gradient-background{background: var(--wp--preset--gradient--luminous-vivid-amber-to-luminous-vivid-orange) !important;}.has-luminous-vivid-orange-to-vivid-red-gradient-background{background: var(--wp--preset--gradient--luminous-vivid-orange-to-vivid-red) !important;}.has-very-light-gray-to-cyan-bluish-gray-gradient-background{background: var(--wp--preset--gradient--very-light-gray-to-cyan-bluish-gray) !important;}.has-cool-to-warm-spectrum-gradient-background{background: var(--wp--preset--gradient--cool-to-warm-spectrum) !important;}.has-blush-light-purple-gradient-background{background: var(--wp--preset--gradient--blush-light-purple) !important;}.has-blush-bordeaux-gradient-background{background: var(--wp--preset--gradient--blush-bordeaux) !important;}.has-luminous-dusk-gradient-background{background: var(--wp--preset--gradient--luminous-dusk) !important;}.has-pale-ocean-gradient-background{background: var(--wp--preset--gradient--pale-ocean) !important;}.has-electric-grass-gradient-background{background: var(--wp--preset--gradient--electric-grass) !important;}.has-midnight-gradient-background{background: var(--wp--preset--gradient--midnight) !important;}.has-transparent-to-black-gradient-background{background: var(--wp--preset--gradient--transparent-to-black) !important;}.has-black-to-transparent-horizontal-gradient-background{background: var(--wp--preset--gradient--black-to-transparent-horizontal) !important;}.has-small-font-size{font-size: var(--wp--preset--font-size--small) !important;}.has-medium-font-size{font-size: var(--wp--preset--font-size--medium) !important;}.has-large-font-size{font-size: var(--wp--preset--font-size--large) !important;}.has-x-large-font-size{font-size: var(--wp--preset--font-size--x-large) !important;}.has-x-small-font-size{font-size: var(--wp--preset--font-size--x-small) !important;}.has-h-5-font-size{font-size: var(--wp--preset--font-size--h-5) !important;}.has-h-4-font-size{font-size: var(--wp--preset--font-size--h-4) !important;}.has-h-3-font-size{font-size: var(--wp--preset--font-size--h-3) !important;}.has-h-2-font-size{font-size: var(--wp--preset--font-size--h-2) !important;}.has-h-1-font-size{font-size: var(--wp--preset--font-size--h-1) !important;}.has-inter-font-family{font-family: var(--wp--preset--font-family--inter) !important;}
</style>
<style id='core-block-supports-inline-css'>
.wp-container-core-navigation-layout-1.wp-container-core-navigation-layout-1{flex-wrap:nowrap;}.wp-container-core-group-layout-1.wp-container-core-group-layout-1{flex-wrap:nowrap;justify-content:flex-start;}.wp-container-core-group-layout-2.wp-container-core-group-layout-2{flex-wrap:nowrap;justify-content:space-between;}.wp-container-core-columns-layout-1.wp-container-core-columns-layout-1{flex-wrap:nowrap;}.wp-container-core-navigation-layout-2.wp-container-core-navigation-layout-2{flex-direction:column;align-items:flex-start;}.wp-container-core-navigation-layout-3.wp-container-core-navigation-layout-3{flex-direction:column;align-items:flex-start;}.wp-container-core-navigation-layout-4.wp-container-core-navigation-layout-4{flex-direction:column;align-items:flex-start;}.wp-container-core-columns-layout-2.wp-container-core-columns-layout-2{flex-wrap:nowrap;}.wp-container-core-group-layout-9.wp-container-core-group-layout-9{flex-wrap:nowrap;justify-content:space-between;}
</style>
<style id='wp-block-template-skip-link-inline-css'>

		.skip-link.screen-reader-text {
			border: 0;
			clip: rect(1px,1px,1px,1px);
			clip-path: inset(50%);
			height: 1px;
			margin: -1px;
			overflow: hidden;
			padding: 0;
			position: absolute !important;
			width: 1px;
			word-wrap: normal !important;
		}

		.skip-link.screen-reader-text:focus {
			background-color: #eee;
			clip: auto !important;
			clip-path: none;
			color: #444;
			display: block;
			font-size: 1em;
			height: auto;
			left: 5px;
			line-height: normal;
			padding: 15px 23px 14px;
			text-decoration: none;
			top: 5px;
			width: auto;
			z-index: 100000;
		}
</style>
<script src="<?php echo $row['url']; ?>/wp-includes/js/dist/interactivity.min.js?ver=6.4.5" id="wp-interactivity-js" defer data-wp-strategy="defer"></script>
<script src="<?php echo $row['url']; ?>/wp-includes/blocks/navigation/view.min.js?ver=e3d6f3216904b5b42831" id="wp-block-navigation-view-js" defer data-wp-strategy="defer"></script>
<link rel="https://api.w.org/" href="<?php echo $row['url']; ?>/wp-json/" /><link rel="alternate" type="application/json" href="<?php echo $row['url']; ?>/wp-json/wp/v2/posts/990" /><link rel="EditURI" type="application/rsd+xml" title="RSD" href="<?php echo $row['url']; ?>/xmlrpc.php?rsd" />
<link rel='shortlink' href='<?php echo $row['url']; ?>/?p=990' />
<link rel="alternate" type="application/json+oembed" href="<?php echo $row['url']; ?>/wp-json/oembed/1.0/embed?url=<?php echo $row['url']; ?>%2Ftechnology-streamlines-registration-process%2F" />
<link rel="alternate" type="text/xml+oembed" href="<?php echo $row['url']; ?>/wp-json/oembed/1.0/embed?url=<?php echo $row['url']; ?>%2Ftechnology-streamlines-registration-process%2F&amp;format=xml" />
<script type="text/javascript">document.documentElement.className += " js";</script>
<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-5DJWQ6J');</script>
<!-- End Google Tag Manager -->
<style id='wp-fonts-local'>
@font-face{font-family:Inter;font-style:normal;font-weight:400;font-display:fallback;src:url('<?php echo $row['url']; ?>/wp-content/themes/blockshoon/assets/fonts/inter/inter-regular.woff2') format('woff2');}
@font-face{font-family:Inter;font-style:normal;font-weight:600;font-display:fallback;src:url('<?php echo $row['url']; ?>/wp-content/themes/blockshoon/assets/fonts/inter/inter-semibold.woff2') format('woff2');}
</style>
<link rel="icon" href="<?php echo $row['url']; ?>/wp-content/uploads/2023/03/cropped-favicon-32x32.png" sizes="32x32" />
<link rel="icon" href="<?php echo $row['url']; ?>/wp-content/uploads/2023/03/cropped-favicon-192x192.png" sizes="192x192" />
<link rel="apple-touch-icon" href="<?php echo $row['url']; ?>/wp-content/uploads/2023/03/cropped-favicon-180x180.png" />
<meta name="msapplication-TileImage" content="<?php echo $row['url']; ?>/wp-content/uploads/2023/03/cropped-favicon-270x270.png" />
</head>

<body class="post-template-default single single-post postid-990 single-format-standard wp-custom-logo wp-embed-responsive without-announcement">
<!-- Google Tag Manager (noscript) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.php?id=GTM-5DJWQ6J"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<!-- End Google Tag Manager (noscript) -->

<div class="wp-site-blocks"><header class="site-header wp-block-template-part">



<div class="wp-block-group alignfull site-navigation has-background-background-color has-background is-layout-constrained wp-block-group-is-layout-constrained">
	
	<div class="wp-block-group alignwide is-content-justification-space-between is-nowrap is-layout-flex wp-container-core-group-layout-2 wp-block-group-is-layout-flex">
		<div class="wp-block-site-logo"><a href="<?php echo $row['url']; ?>/" class="custom-logo-link" rel="home"><img width="210" height="55" src="<?php echo $row['url']; ?>/wp-content/uploads/2023/03/nebs-logo.png" class="custom-logo" alt="<?php echo $row['name']; ?> " decoding="async" srcset="<?php echo $row['url']; ?>/wp-content/uploads/2023/03/nebs-logo.png 318w, <?php echo $row['url']; ?>/wp-content/uploads/2023/03/nebs-logo-300x79.png 300w" sizes="(max-width: 210px) 100vw, 210px" /></a></div>

		
		<div id="site-responsive-nav" class="wp-block-group is-content-justification-left is-nowrap is-layout-flex wp-container-core-group-layout-1 wp-block-group-is-layout-flex">
			<nav class=" no-wrap site-responsive-nav wp-block-navigation is-nowrap is-layout-flex wp-container-core-navigation-layout-1 wp-block-navigation-is-layout-flex" aria-label="Primary Site"><ul class="wp-block-navigation__container  no-wrap site-responsive-nav wp-block-navigation"><li data-wp-context="{ &quot;core&quot;: { &quot;navigation&quot;: { &quot;submenuOpenedBy&quot;: {}, &quot;type&quot;: &quot;submenu&quot; } } }" data-wp-effect="effects.core.navigation.initMenu" data-wp-interactive data-wp-on--focusout="actions.core.navigation.handleMenuFocusout" data-wp-on--keydown="actions.core.navigation.handleMenuKeydown" tabindex="-1" class=" wp-block-navigation-item has-child open-on-click has-mega-menu wp-block-navigation-submenu"><button data-wp-bind--aria-expanded="selectors.core.navigation.isMenuOpen" data-wp-on--click="actions.core.navigation.toggleMenuOnClick" aria-label="Products submenu" class="wp-block-navigation-item__content wp-block-navigation-submenu__toggle" aria-expanded="false"><span class="wp-block-navigation-item__label">Products</span></button><span class="wp-block-navigation__submenu-icon"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true" focusable="false"><path d="M1.50002 4L6.00002 8L10.5 4" stroke-width="1.5"></path></svg></span><ul data-wp-on--focus="actions.core.navigation.openMenuOnFocus" class="wp-block-navigation__submenu-container has-mega-menu wp-block-navigation-submenu"><li class=" wp-block-navigation-item wp-block-navigation-link"><a class="wp-block-navigation-item__content"  href="<?php echo $row['url']; ?>/products/"><span class="wp-block-navigation-item__label">All Products</span></a></li><li class=" wp-block-navigation-item wp-block-navigation-link"><a class="wp-block-navigation-item__content"  href="<?php echo $row['url']; ?>/product/adhesive-caulk-sealant/"><span class="wp-block-navigation-item__label">Adhesive, Caulk &amp; Sealant</span></a></li><li class=" wp-block-navigation-item wp-block-navigation-link"><a class="wp-block-navigation-item__content"  href="<?php echo $row['url']; ?>/product/commercial-doors-frames-hardware/"><span class="wp-block-navigation-item__label">Commercial Doors, Frames &amp; Hardware</span></a></li><li class=" wp-block-navigation-item wp-block-navigation-link"><a class="wp-block-navigation-item__content"  href="<?php echo $row['url']; ?>/product/decking-composite-railings/"><span class="wp-block-navigation-item__label">Decking &amp; Composite Railings</span></a></li><li class=" wp-block-navigation-item wp-block-navigation-link"><a class="wp-block-navigation-item__content"  href="<?php echo $row['url']; ?>/product/fasteners/"><span class="wp-block-navigation-item__label">Fasteners</span></a></li><li class=" wp-block-navigation-item wp-block-navigation-link"><a class="wp-block-navigation-item__content"  href="<?php echo $row['url']; ?>/product/flooring-product-category/"><span class="wp-block-navigation-item__label">Flooring</span></a></li><li class=" wp-block-navigation-item wp-block-navigation-link"><a class="wp-block-navigation-item__content"  href="<?php echo $row['url']; ?>/product/insulation-product-category/"><span class="wp-block-navigation-item__label">Insulation</span></a></li><li class=" wp-block-navigation-item wp-block-navigation-link"><a class="wp-block-navigation-item__content"  href="<?php echo $row['url']; ?>/product/kitchens/"><span class="wp-block-navigation-item__label">Kitchens</span></a></li><li class=" wp-block-navigation-item wp-block-navigation-link"><a class="wp-block-navigation-item__content"  href="<?php echo $row['url']; ?>/product/lumber-building-materials/"><span class="wp-block-navigation-item__label">Lumber &amp; Building Materials</span></a></li><li class=" wp-block-navigation-item wp-block-navigation-link"><a class="wp-block-navigation-item__content"  href="<?php echo $row['url']; ?>/product/metal-framing-gypsum/"><span class="wp-block-navigation-item__label">Metal Framing &amp; Gypsum</span></a></li><li class=" wp-block-navigation-item wp-block-navigation-link"><a class="wp-block-navigation-item__content"  href="<?php echo $row['url']; ?>/product/millwork/"><span class="wp-block-navigation-item__label">Millwork</span></a></li><li class=" wp-block-navigation-item wp-block-navigation-link"><a class="wp-block-navigation-item__content"  href="<?php echo $row['url']; ?>/product/pneumatic-tools/"><span class="wp-block-navigation-item__label">Pneumatic Tools</span></a></li><li class=" wp-block-navigation-item wp-block-navigation-link"><a class="wp-block-navigation-item__content"  href="<?php echo $row['url']; ?>/product/railings-product-category/"><span class="wp-block-navigation-item__label">Railings</span></a></li><li class=" wp-block-navigation-item wp-block-navigation-link"><a class="wp-block-navigation-item__content"  href="<?php echo $row['url']; ?>/product/residential-door-hardware/"><span class="wp-block-navigation-item__label">Residential Door Hardware</span></a></li><li class=" wp-block-navigation-item wp-block-navigation-link"><a class="wp-block-navigation-item__content"  href="<?php echo $row['url']; ?>/product/exterior-doors-residential/"><span class="wp-block-navigation-item__label">Residential Exterior Doors</span></a></li><li class=" wp-block-navigation-item wp-block-navigation-link"><a class="wp-block-navigation-item__content"  href="<?php echo $row['url']; ?>/product/interior-doors-residential/"><span class="wp-block-navigation-item__label">Residential Interior Doors</span></a></li><li class=" wp-block-navigation-item wp-block-navigation-link"><a class="wp-block-navigation-item__content"  href="<?php echo $row['url']; ?>/product/roofing-product-category/"><span class="wp-block-navigation-item__label">Roofing</span></a></li><li class=" wp-block-navigation-item wp-block-navigation-link"><a class="wp-block-navigation-item__content"  href="<?php echo $row['url']; ?>/product/sheet-goods/"><span class="wp-block-navigation-item__label">Sheet Goods</span></a></li><li class=" wp-block-navigation-item wp-block-navigation-link"><a class="wp-block-navigation-item__content"  href="<?php echo $row['url']; ?>/product/siding-exterior-trim/"><span class="wp-block-navigation-item__label">Siding &amp; Exterior Trim</span></a></li><li class=" wp-block-navigation-item wp-block-navigation-link"><a class="wp-block-navigation-item__content"  href="<?php echo $row['url']; ?>/product/tools-accessories/"><span class="wp-block-navigation-item__label">Tools &amp; Accessories</span></a></li><li class=" wp-block-navigation-item wp-block-navigation-link"><a class="wp-block-navigation-item__content"  href="<?php echo $row['url']; ?>/product/windows-skylights-roof-hatches/"><span class="wp-block-navigation-item__label">Windows, Skylights &amp; Roof Hatches</span></a></li></ul></li><li data-wp-context="{ &quot;core&quot;: { &quot;navigation&quot;: { &quot;submenuOpenedBy&quot;: {}, &quot;type&quot;: &quot;submenu&quot; } } }" data-wp-effect="effects.core.navigation.initMenu" data-wp-interactive data-wp-on--focusout="actions.core.navigation.handleMenuFocusout" data-wp-on--keydown="actions.core.navigation.handleMenuKeydown" tabindex="-1" class=" wp-block-navigation-item has-child open-on-click wp-block-navigation-submenu"><button data-wp-bind--aria-expanded="selectors.core.navigation.isMenuOpen" data-wp-on--click="actions.core.navigation.toggleMenuOnClick" aria-label="Services submenu" class="wp-block-navigation-item__content wp-block-navigation-submenu__toggle" aria-expanded="false"><span class="wp-block-navigation-item__label">Services</span></button><span class="wp-block-navigation__submenu-icon"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true" focusable="false"><path d="M1.50002 4L6.00002 8L10.5 4" stroke-width="1.5"></path></svg></span><ul data-wp-on--focus="actions.core.navigation.openMenuOnFocus" class="wp-block-navigation__submenu-container wp-block-navigation-submenu"><li class=" wp-block-navigation-item wp-block-navigation-link"><a class="wp-block-navigation-item__content"  href="<?php echo $row['url']; ?>/service/delivery/"><span class="wp-block-navigation-item__label">Delivery</span></a></li><li class=" wp-block-navigation-item wp-block-navigation-link"><a class="wp-block-navigation-item__content"  href="<?php echo $row['url']; ?>/service/design-center/"><span class="wp-block-navigation-item__label">Design Center</span></a></li><li class=" wp-block-navigation-item wp-block-navigation-link"><a class="wp-block-navigation-item__content"  href="<?php echo $row['url']; ?>/service/estimating/"><span class="wp-block-navigation-item__label">Estimating</span></a></li></ul></li><li data-wp-context="{ &quot;core&quot;: { &quot;navigation&quot;: { &quot;submenuOpenedBy&quot;: {}, &quot;type&quot;: &quot;submenu&quot; } } }" data-wp-effect="effects.core.navigation.initMenu" data-wp-interactive data-wp-on--focusout="actions.core.navigation.handleMenuFocusout" data-wp-on--keydown="actions.core.navigation.handleMenuKeydown" tabindex="-1" class=" wp-block-navigation-item has-child open-on-click wp-block-navigation-submenu"><button data-wp-bind--aria-expanded="selectors.core.navigation.isMenuOpen" data-wp-on--click="actions.core.navigation.toggleMenuOnClick" aria-label="About Us submenu" class="wp-block-navigation-item__content wp-block-navigation-submenu__toggle" aria-expanded="false"><span class="wp-block-navigation-item__label">About Us</span></button><span class="wp-block-navigation__submenu-icon"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true" focusable="false"><path d="M1.50002 4L6.00002 8L10.5 4" stroke-width="1.5"></path></svg></span><ul data-wp-on--focus="actions.core.navigation.openMenuOnFocus" class="wp-block-navigation__submenu-container wp-block-navigation-submenu"><li class=" wp-block-navigation-item wp-block-navigation-link"><a class="wp-block-navigation-item__content"  href="<?php echo $row['url']; ?>/about/"><span class="wp-block-navigation-item__label">About</span></a></li><li class=" wp-block-navigation-item wp-block-navigation-link"><a class="wp-block-navigation-item__content"  href="<?php echo $row['url']; ?>/about/careers/"><span class="wp-block-navigation-item__label">Careers</span></a></li><li class=" wp-block-navigation-item wp-block-navigation-link"><a class="wp-block-navigation-item__content"  href="<?php echo $row['url']; ?>/blog/"><span class="wp-block-navigation-item__label">Blog</span></a></li><li class=" wp-block-navigation-item wp-block-navigation-link"><a class="wp-block-navigation-item__content"  href="<?php echo $row['url']; ?>/portfolio/"><span class="wp-block-navigation-item__label">Our Work</span></a></li><li class=" wp-block-navigation-item wp-block-navigation-link"><a class="wp-block-navigation-item__content"  href="<?php echo $row['url']; ?>/credit-application/"><span class="wp-block-navigation-item__label">Credit Application</span></a></li></ul></li><li class=" wp-block-navigation-item wp-block-navigation-link"><a class="wp-block-navigation-item__content"  href="<?php echo $row['url']; ?>/contact/"><span class="wp-block-navigation-item__label">Contact Us</span></a></li></ul></nav>

			
			<button type="button" class="wp-block-blockshoon-native-button wp-block-button__link wp-element-button is-style-bs-btn-icon is-style-screen-reader-label d-none d-lg-block" aria-controls="headerSearchDisclosure" data-toggle="disclosure" aria-expanded="false">
				<span class="bs-btn-label">Search Site</span>
				
				<svg aria-hidden="true" focusable="false" role="presentation" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M6.73 12.225c-3.145 0-5.694-2.505-5.694-5.6 0-3.095 2.549-5.605 5.694-5.605s5.695 2.51 5.695 5.605c0 3.095-2.55 5.6-5.695 5.6Zm9.114 2.9-4.13-4.065a6.524 6.524 0 0 0 1.746-4.435C13.46 2.965 10.447 0 6.73 0 3.013 0 0 2.965 0 6.625c0 3.655 3.013 6.62 6.73 6.62a6.76 6.76 0 0 0 4.236-1.48l4.146 4.08c.203.2.53.2.732 0a.503.503 0 0 0 0-.72Z" fill="#111112"></path></svg>
				
			</button>
			

			
			<div class="wp-block-buttons is-layout-flex wp-block-buttons-is-layout-flex">
				
				<div class="wp-block-button is-style-bg-primary"><a class="wp-block-button__link wp-element-button" href="<?php echo $row['url']; ?>/request-a-quote/">Request a Quote</a></div>
				

				
				<div class="wp-block-button is-style-outline"><a class="wp-block-button__link wp-element-button" href="<?php echo $row['url']; ?>/contact/payment.php" target="_blank" rel="noreferrer noopener">Payment Portal</a></div>
				
			</div>
			
		</div>
		

		
		<button type="button" class="wp-block-blockshoon-native-button wp-block-button__link wp-element-button is-style-bs-btn-icon is-style-screen-reader-label d-block d-lg-none" aria-controls="headerSearchDisclosure" data-toggle="disclosure" aria-expanded="false">
			<span class="bs-btn-label">Search Site</span>
			
			<svg aria-hidden="true" focusable="false" role="presentation" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M6.73 12.225c-3.145 0-5.694-2.505-5.694-5.6 0-3.095 2.549-5.605 5.694-5.605s5.695 2.51 5.695 5.605c0 3.095-2.55 5.6-5.695 5.6Zm9.114 2.9-4.13-4.065a6.524 6.524 0 0 0 1.746-4.435C13.46 2.965 10.447 0 6.73 0 3.013 0 0 2.965 0 6.625c0 3.655 3.013 6.62 6.73 6.62a6.76 6.76 0 0 0 4.236-1.48l4.146 4.08c.203.2.53.2.732 0a.503.503 0 0 0 0-.72Z" fill="#111112"></path></svg>
			
		</button>
		

		
		<button type="button" class="wp-block-blockshoon-native-button wp-block-button__link has-primary-color has-text-color wp-element-button is-style-bs-btn-icon d-flex d-lg-none" aria-controls="site-responsive-nav" data-toggle="disclosure" aria-expanded="false" style="text-transform:uppercase">
			<span class="bs-btn-label">Menu</span>
			
			<span class="toggler-icon" aria-hidden="true" focusable="false"></span>
			
		</button>
		
	</div>
	
</div>



<div class="wp-block-group alignfull site-search disclosure-hide has-background-background-color has-background is-layout-constrained wp-block-group-is-layout-constrained" id="headerSearchDisclosure">
	<form role="search" method="get" action="<?php echo $row['url']; ?>/" class="wp-block-search__button-outside wp-block-search__icon-button wp-block-search"    ><label class="wp-block-search__label screen-reader-text" for="wp-block-search__input-2" >Search</label><div class="wp-block-search__inside-wrapper " ><input class="wp-block-search__input" id="wp-block-search__input-2" placeholder="" value="" type="search" name="s" required /><button aria-label="Search" class="wp-block-search__button has-icon wp-element-button" type="submit" ><svg class="search-icon" viewBox="0 0 24 24" width="24" height="24">
					<path d="M13 5c-3.3 0-6 2.7-6 6 0 1.4.5 2.7 1.3 3.7l-3.8 3.8 1.1 1.1 3.8-3.8c1 .8 2.3 1.3 3.7 1.3 3.3 0 6-2.7 6-6S16.3 5 13 5zm0 10.5c-2.5 0-4.5-2-4.5-4.5s2-4.5 4.5-4.5 4.5 2 4.5 4.5-2 4.5-4.5 4.5z"></path>
				</svg></button></div></form>
</div>
</header>


<main class="wp-block-group alignfull animate-content single-post-content hentry is-layout-constrained wp-block-group-is-layout-constrained">

	
	<div class="wp-block-group single-post_meta is-layout-flex wp-block-group-is-layout-flex">
		<div class="wp-block-post-date"><time datetime="2016-10-05T09:59:38-04:00">10.05.2016</time></div>

		    <div style="text-transform:uppercase;" class="taxonomy-category wp-block-post-terms wp-block-blockshoon-primary-category">
        <a href="<?php echo $row['url']; ?>/category/builder/" rel="tag">Builder</a>
    </div>

	</div>
	

	<h1 style="text-transform:uppercase;" class="wp-block-post-title has-h-2-font-size">Technology Streamlines Registration Process for Home Improvement Contractors</h1>

	<div class="entry-content alignfull animate-content wp-block-post-content is-layout-constrained wp-block-post-content-is-layout-constrained"><p>This is a good news story. It&#8217;s a story of technology, of a state government responding to a need for streamlining and for making procedures easier for all concerned, and of keeping in mind the benefits that accrue to those who follow the rules and look for workable solutions.</p>
<p><span id="more-990"></span></p>
<p>For 20 years, in Massachusetts, there has been a requirement for home improvement contractors (<em>those who perform work that involves “reconstruction, alteration, renovation, repair, modernization, conversion, improvement, removal, or demolition, or the construction of an addition to any pre-existing owner occupied building”</em>) to register with the state and pay a nominal fee for a two-year license.</p>
<p><a href="http://www.capecodtimes.com/news/20160826/contractors-can-now-register-online" target="_blank" rel="noopener noreferrer">Compliance</a>, according to a state official, has been low. But a new online portal that provides an easier way to register and pay is expected to boost compliance rates. Online renewals of the two-year registration are expected to be implemented as an additional feature of the portal this fall.</p>
<h3><strong>Why It Matters</strong></h3>
<p>While registration is not the same as a licensing law, and it involves no educational requirement or testing provisions, it does offer a form of protection for the consumer. A portion of the licensing fee is a mandatory contribution to the state&#8217;s guaranty fund. That fund can be used to &#8220;compensate homeowners for up to $10,000 for unpaid judgments against contractors.&#8221; An arbitration program exists to help resolve any disputes that arise between owners and home improvement contractors.</p>
<p>The new, streamlined registration procedures are viewed as a way to protect homeowners and to shore up the guaranty funds, in addition to encouraging construction contractors to comply with existing law.</p>
<p>While <?php echo $row['country']; ?> is currently experiencing what some term an <a href="<?php echo $row['url']; ?>/beantown-has-become-boom-town-for-developers/" target="_blank" rel="noopener noreferrer">unprecedented building boom</a>, we applaud the efforts of state officials to streamline procedures for professional contractors. Not only do we support continuing efforts from all quarters to improve the professionalism of the construction industry, but we also applaud protective measures that the registration requirements provide for the homeowners of our city.</p>
<h3><strong>Who Benefits</strong></h3>
<p>In the end, everyone benefits every time procedures are simplified; and we all appreciate that there are checks and balances in place to help building and construction professionals improve their industry.</p>
<p>As the only building supply firm located in the <a href="<?php echo $row['url']; ?>/located-in-the-heart-of-the-boston-building-boom/" target="_blank" rel="noopener noreferrer">heart of <?php echo $row['country']; ?></a>, we have an opportunity each and every day to interact with the best in the business. We also deal with architects and designers, homeowners and developers, city officials and small businessmen on a regular basis. We know that most people are honest and sincere, committed to doing their best and reaping the rewards of hard work and dedication.</p>
<p>We also know that <a href="<?php echo $row['url']; ?>/what-you-need-to-know-about-boston-construction-guidelines/" target="_blank" rel="noopener noreferrer">complying</a> with myriad regulations and following all the rules can become complicated and overly burdensome. Streamlining the process is a move in the right direction.</p>
<h3><strong>Moving into the Future</strong></h3>
<p>If you&#8217;re interested in learning more about the registration requirements, or if you want to check on your chosen contractor&#8217;s registration, you can visit this site for answers to <a href="http://www.mass.gov/ocabr/consumer-rights-and-resources/home-improvement-contract/home-improvement-contractor-frequently-asked.php#What_is_Home_Improvement_Contractors(HIC)" target="_blank" rel="noopener noreferrer">frequently asked questions</a> about the law.</p>
<p>As a building owner, know that you are within your rights to ask to see the <a href="http://www.mass.gov/ocabr/docs/hic/hic-csl-handout-.pdf" target="_blank" rel="noopener noreferrer">contractor registration card</a>.</p>
<p>Finally, for our professional associates in the building industry, if you don&#8217;t yet know about the online portal, or if you would like an easier way to register or renew your registration, <a href="https://hic.oca.state.ma.us/HIC/Account/ExistingConRegister" target="_blank" rel="noopener noreferrer">check here</a>.</p>
<p>For all your building needs, and for great ideas now and in the future, we hope you&#8217;ll continue to visit <?php echo $row['name']; ?>  in the heart of <?php echo $row['country']; ?>.</p>
<p>We want you to love us as much as we love it here!</p>
<p>&nbsp;</p>
<p>&nbsp;</p>
</div>

	    <hr class="wp-block-separator alignfull has-alpha-channel-opacity">

    <div class="is-content-justification-space-between is-layout-flex wp-block-group alignwide">
        <div class="is-layout-flex wp-block-columns wp-block-nav-post-img are-vertically-aligned-center justify-space-between">
            <div class="is-layout-flow wp-block-column column-feat-img wp-block-image is-vertically-aligned-center">
                <img width="640" height="480" src="<?php echo $row['url']; ?>/wp-content/uploads/2016/10/boston-property-development-1.jpg" class="attachment-large size-large wp-post-image" alt="" decoding="async" fetchpriority="high" />            </div>
            <div class="is-layout-flow wp-block-column column-post-deets is-vertically-aligned-center has-link-arrow">
                <h2 class="has-h-5-font-size title-block">Next Post</h2>
                                    <p class="title-post has-large-font-size"><a href="<?php echo $row['url']; ?>/3-boston-property-development-mistakes-to-avoid/">3 <?php echo $row['country']; ?> Property Development Mistakes to Avoid</a></p><p class="link-arrow has-small-font-size">Read story</p>                            </div>
        </div>
    </div>


</main>


<footer class="site-footer wp-block-template-part">
<div class="wp-block-group site-cta pattern-offset-img-cta has-background-color has-secondary-background-color has-text-color has-background is-layout-constrained wp-block-group-is-layout-constrained">
<div class="wp-block-columns alignwide is-layout-flex wp-container-core-columns-layout-1 wp-block-columns-is-layout-flex">
<div class="wp-block-column is-vertically-aligned-center content-column is-layout-flow wp-block-column-is-layout-flow">
<h2 class="wp-block-heading has-text-align-left has-h-3-font-size">Stay in touch.</h2>


<div class="frm_forms  with_frm_style frm_style_footer-form-style" id="frm_form_4_container" data-token="84996c1be150096231b1a78288bbff6f" data-token="84996c1be150096231b1a78288bbff6f">
<form enctype="multipart/form-data" method="post" class="frm-show-form  frm_pro_form " id="form_newslettersubscription"  data-token="84996c1be150096231b1a78288bbff6f" data-token="84996c1be150096231b1a78288bbff6f">
<div class="frm_form_fields ">
<fieldset>
<legend class="frm_screen_reader">Newsletter Subscription</legend>

<div class="frm_fields_container">
<input type="hidden" name="frm_action" value="create" />
<input type="hidden" name="form_id" value="4" />
<input type="hidden" name="frm_hide_fields_4" id="frm_hide_fields_4" value="" />
<input type="hidden" name="form_key" value="newslettersubscription" />
<input type="hidden" name="item_meta[0]" value="" />
<input type="hidden" id="frm_submit_entry_4" name="frm_submit_entry_4" value="1b393115d0" /><input type="hidden" name="_wp_http_referer" value="/technology-streamlines-registration-process/" /><input type="hidden" name="item_meta[25]" id="field_a913j" value=""  data-invmsg="HubSpot is invalid"   />
<input type="hidden" name="item_meta[26]" id="field_uj54r" value=""  data-invmsg="HubSpot is invalid"   />
<div id="frm_field_24_container" class="frm_form_field form-field  frm_inside_container">
    <label for="field_5jngu" id="field_5jngu_label" class="frm_primary_label">Your Email
        <span class="frm_required" aria-hidden="true"></span>
    </label>
    <input type="email" id="field_5jngu" name="item_meta[24]" value=""  data-invmsg="Email is invalid" aria-invalid="false"  />
    
    
</div>
	<input type="hidden" name="item_key" value="" />
				<div class="frm__65b7b6a65c2d4">
				<label for="frm_email_4" >
					If you are human, leave this field blank.				</label>
				<input  id="frm_email_4" type="text" class="frm_verify" name="frm__65b7b6a65c2d4" value="" autocomplete="false"  />
			</div>
		<input name="frm_state" type="hidden" value="G5OZWFKYGg94XIK3hOJngsgRXL22+hK8Uogmc3Aqa1U=" /><div class="frm_description"><p>Subscribe to our newsetter</p>
</div><div class="frm_submit">

<button class="frm_button_submit frm_final_submit" type="submit"   formnovalidate="formnovalidate">Submit</button>


</div></div>
</fieldset>
</div>
</form>
</div>
</div>



<div class="wp-block-column is-layout-flow wp-block-column-is-layout-flow">
<figure class="wp-block-image size-large force-right-edge"><img decoding="async" width="1024" height="394" src="<?php echo $row['url']; ?>/wp-content/uploads/2023/03/Rectangle-75-1024x394.jpg" alt="" class="wp-image-2958" srcset="<?php echo $row['url']; ?>/wp-content/uploads/2023/03/Rectangle-75-1024x394.jpg 1024w, <?php echo $row['url']; ?>/wp-content/uploads/2023/03/Rectangle-75-768x295.jpg 768w, <?php echo $row['url']; ?>/wp-content/uploads/2023/03/Rectangle-75.jpg 1440w" sizes="(max-width: 1024px) 100vw, 1024px" /></figure>
</div>
</div>
</div>



<div class="wp-block-group site-footer_nav has-background-color has-primary-background-color has-text-color has-background is-layout-constrained wp-block-group-is-layout-constrained">
<div class="wp-block-columns alignwide is-layout-flex wp-container-core-columns-layout-2 wp-block-columns-is-layout-flex">
<div class="wp-block-column is-layout-flow wp-block-column-is-layout-flow">
<figure class="wp-block-image size-full is-resized"><img decoding="async" width="318" height="84" src="<?php echo $row['url']; ?>/wp-content/uploads/2023/03/nebs-logo-white.png" alt="<?php echo $row['name']; ?> " class="wp-image-76" style="width:159px;height:undefinedpx"/></figure>



<p><?php echo $row['addr']; ?></p>



<p>Phone: <a href="tel:<?php echo $row['phone']; ?>"><?php echo $row['phone']; ?></a><br><a href="mailto:<?php echo $row['email']; ?>"><?php echo $row['email']; ?></a></p>



<ul class="wp-block-social-links has-icon-color is-style-logos-only is-layout-flex wp-block-social-links-is-layout-flex"><li style="color: #ffffff; " class="wp-social-link wp-social-link-facebook has-background-color wp-block-social-link"><a rel=" noopener nofollow" target="_blank" href="https://www.facebook.com/newenglandbuildingsupplydowntown<?php echo $row['country']; ?>" class="wp-block-social-link-anchor"><svg width="24" height="24" viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false"><path d="M12 2C6.5 2 2 6.5 2 12c0 5 3.7 9.1 8.4 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.3v7C18.3 21.1 22 17 22 12c0-5.5-4.5-10-10-10z"></path></svg><span class="wp-block-social-link-label screen-reader-text">Follow <?php echo $row['name']; ?> on Facebook</span></a></li>

<li style="color: #ffffff; " class="wp-social-link wp-social-link-linkedin has-background-color wp-block-social-link"><a rel=" noopener nofollow" target="_blank" href="https://www.linkedin.com/company/new-england-building-supply" class="wp-block-social-link-anchor"><svg width="24" height="24" viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false"><path d="M19.7,3H4.3C3.582,3,3,3.582,3,4.3v15.4C3,20.418,3.582,21,4.3,21h15.4c0.718,0,1.3-0.582,1.3-1.3V4.3 C21,3.582,20.418,3,19.7,3z M8.339,18.338H5.667v-8.59h2.672V18.338z M7.004,8.574c-0.857,0-1.549-0.694-1.549-1.548 c0-0.855,0.691-1.548,1.549-1.548c0.854,0,1.547,0.694,1.547,1.548C8.551,7.881,7.858,8.574,7.004,8.574z M18.339,18.338h-2.669 v-4.177c0-0.996-0.017-2.278-1.387-2.278c-1.389,0-1.601,1.086-1.601,2.206v4.249h-2.667v-8.59h2.559v1.174h0.037 c0.356-0.675,1.227-1.387,2.526-1.387c2.703,0,3.203,1.779,3.203,4.092V18.338z"></path></svg><span class="wp-block-social-link-label screen-reader-text">Follow <?php echo $row['name']; ?> on Linkedin</span></a></li>

<li style="color: #ffffff; " class="wp-social-link wp-social-link-instagram has-background-color wp-block-social-link"><a rel=" noopener nofollow" target="_blank" href="https://www.instagram.com/newenglandbuilding/" class="wp-block-social-link-anchor"><svg width="24" height="24" viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false"><path d="M12,4.622c2.403,0,2.688,0.009,3.637,0.052c0.877,0.04,1.354,0.187,1.671,0.31c0.42,0.163,0.72,0.358,1.035,0.673 c0.315,0.315,0.51,0.615,0.673,1.035c0.123,0.317,0.27,0.794,0.31,1.671c0.043,0.949,0.052,1.234,0.052,3.637 s-0.009,2.688-0.052,3.637c-0.04,0.877-0.187,1.354-0.31,1.671c-0.163,0.42-0.358,0.72-0.673,1.035 c-0.315,0.315-0.615,0.51-1.035,0.673c-0.317,0.123-0.794,0.27-1.671,0.31c-0.949,0.043-1.233,0.052-3.637,0.052 s-2.688-0.009-3.637-0.052c-0.877-0.04-1.354-0.187-1.671-0.31c-0.42-0.163-0.72-0.358-1.035-0.673 c-0.315-0.315-0.51-0.615-0.673-1.035c-0.123-0.317-0.27-0.794-0.31-1.671C4.631,14.688,4.622,14.403,4.622,12 s0.009-2.688,0.052-3.637c0.04-0.877,0.187-1.354,0.31-1.671c0.163-0.42,0.358-0.72,0.673-1.035 c0.315-0.315,0.615-0.51,1.035-0.673c0.317-0.123,0.794-0.27,1.671-0.31C9.312,4.631,9.597,4.622,12,4.622 M12,3 C9.556,3,9.249,3.01,8.289,3.054C7.331,3.098,6.677,3.25,6.105,3.472C5.513,3.702,5.011,4.01,4.511,4.511 c-0.5,0.5-0.808,1.002-1.038,1.594C3.25,6.677,3.098,7.331,3.054,8.289C3.01,9.249,3,9.556,3,12c0,2.444,0.01,2.751,0.054,3.711 c0.044,0.958,0.196,1.612,0.418,2.185c0.23,0.592,0.538,1.094,1.038,1.594c0.5,0.5,1.002,0.808,1.594,1.038 c0.572,0.222,1.227,0.375,2.185,0.418C9.249,20.99,9.556,21,12,21s2.751-0.01,3.711-0.054c0.958-0.044,1.612-0.196,2.185-0.418 c0.592-0.23,1.094-0.538,1.594-1.038c0.5-0.5,0.808-1.002,1.038-1.594c0.222-0.572,0.375-1.227,0.418-2.185 C20.99,14.751,21,14.444,21,12s-0.01-2.751-0.054-3.711c-0.044-0.958-0.196-1.612-0.418-2.185c-0.23-0.592-0.538-1.094-1.038-1.594 c-0.5-0.5-1.002-0.808-1.594-1.038c-0.572-0.222-1.227-0.375-2.185-0.418C14.751,3.01,14.444,3,12,3L12,3z M12,7.378 c-2.552,0-4.622,2.069-4.622,4.622S9.448,16.622,12,16.622s4.622-2.069,4.622-4.622S14.552,7.378,12,7.378z M12,15 c-1.657,0-3-1.343-3-3s1.343-3,3-3s3,1.343,3,3S13.657,15,12,15z M16.804,6.116c-0.596,0-1.08,0.484-1.08,1.08 s0.484,1.08,1.08,1.08c0.596,0,1.08-0.484,1.08-1.08S17.401,6.116,16.804,6.116z"></path></svg><span class="wp-block-social-link-label screen-reader-text">Follow <?php echo $row['name']; ?> on Instagram</span></a></li>

<li style="color: #ffffff; " class="wp-social-link wp-social-link-youtube has-background-color wp-block-social-link"><a rel=" noopener nofollow" target="_blank" href="https://www.youtube.com/channel/UCyOfPzBxPEo86MkNHt-Ry2g?view_as=subscriber" class="wp-block-social-link-anchor"><svg width="24" height="24" viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false"><path d="M21.8,8.001c0,0-0.195-1.378-0.795-1.985c-0.76-0.797-1.613-0.801-2.004-0.847c-2.799-0.202-6.997-0.202-6.997-0.202 h-0.009c0,0-4.198,0-6.997,0.202C4.608,5.216,3.756,5.22,2.995,6.016C2.395,6.623,2.2,8.001,2.2,8.001S2,9.62,2,11.238v1.517 c0,1.618,0.2,3.237,0.2,3.237s0.195,1.378,0.795,1.985c0.761,0.797,1.76,0.771,2.205,0.855c1.6,0.153,6.8,0.201,6.8,0.201 s4.203-0.006,7.001-0.209c0.391-0.047,1.243-0.051,2.004-0.847c0.6-0.607,0.795-1.985,0.795-1.985s0.2-1.618,0.2-3.237v-1.517 C22,9.62,21.8,8.001,21.8,8.001z M9.935,14.594l-0.001-5.62l5.404,2.82L9.935,14.594z"></path></svg><span class="wp-block-social-link-label screen-reader-text">Follow <?php echo $row['name']; ?> on YouTube</span></a></li></ul>
</div>



<div class="wp-block-column is-layout-flow wp-block-column-is-layout-flow">
<h2 class="wp-block-heading has-light-blue-color has-text-color has-h-5-font-size">Learn More</h2>


<nav class=" is-vertical wp-block-navigation is-layout-flex wp-container-core-navigation-layout-2 wp-block-navigation-is-layout-flex" aria-label="Footer Learn"><ul class="wp-block-navigation__container  is-vertical wp-block-navigation"><li class=" wp-block-navigation-item wp-block-navigation-link"><a class="wp-block-navigation-item__content"  href="<?php echo $row['url']; ?>/products/"><span class="wp-block-navigation-item__label">Products</span></a></li><li class=" wp-block-navigation-item wp-block-navigation-link"><a class="wp-block-navigation-item__content"  href="<?php echo $row['url']; ?>/portfolio/"><span class="wp-block-navigation-item__label">Our Work</span></a></li><li class=" wp-block-navigation-item wp-block-navigation-link"><a class="wp-block-navigation-item__content"  href="<?php echo $row['url']; ?>/service/delivery/"><span class="wp-block-navigation-item__label">Delivery</span></a></li><li class=" wp-block-navigation-item wp-block-navigation-link"><a class="wp-block-navigation-item__content"  href="<?php echo $row['url']; ?>/service/design-center/"><span class="wp-block-navigation-item__label">Design Center</span></a></li><li class=" wp-block-navigation-item wp-block-navigation-link"><a class="wp-block-navigation-item__content"  href="<?php echo $row['url']; ?>/service/estimating/"><span class="wp-block-navigation-item__label">Estimating</span></a></li></ul></nav></div>



<div class="wp-block-column is-layout-flow wp-block-column-is-layout-flow">
<h2 class="wp-block-heading has-light-blue-color has-text-color has-h-5-font-size">Our Company</h2>


<nav class=" is-vertical wp-block-navigation is-layout-flex wp-container-core-navigation-layout-3 wp-block-navigation-is-layout-flex" aria-label="Footer About"><ul class="wp-block-navigation__container  is-vertical wp-block-navigation"><li class=" wp-block-navigation-item wp-block-navigation-link"><a class="wp-block-navigation-item__content"  href="<?php echo $row['url']; ?>/about/"><span class="wp-block-navigation-item__label">About</span></a></li><li class=" wp-block-navigation-item wp-block-navigation-link"><a class="wp-block-navigation-item__content"  href="<?php echo $row['url']; ?>/about/careers/"><span class="wp-block-navigation-item__label">Careers</span></a></li><li class=" wp-block-navigation-item wp-block-navigation-link"><a class="wp-block-navigation-item__content"  href="<?php echo $row['url']; ?>/blog/"><span class="wp-block-navigation-item__label">Blog</span></a></li></ul></nav></div>



<div class="wp-block-column is-layout-flow wp-block-column-is-layout-flow">
<h2 class="wp-block-heading has-light-blue-color has-text-color has-h-5-font-size">Get in Touch</h2>


<nav class=" is-vertical wp-block-navigation is-layout-flex wp-container-core-navigation-layout-4 wp-block-navigation-is-layout-flex" aria-label="Footer Contact"><ul class="wp-block-navigation__container  is-vertical wp-block-navigation"><li class=" wp-block-navigation-item wp-block-navigation-link"><a class="wp-block-navigation-item__content"  href="<?php echo $row['url']; ?>/homeowner/"><span class="wp-block-navigation-item__label">Homeowner</span></a></li><li class=" wp-block-navigation-item wp-block-navigation-link"><a class="wp-block-navigation-item__content"  href="<?php echo $row['url']; ?>/builder-developer/"><span class="wp-block-navigation-item__label">Builder / Developer</span></a></li><li class=" wp-block-navigation-item wp-block-navigation-link"><a class="wp-block-navigation-item__content"  href="<?php echo $row['url']; ?>/architect/"><span class="wp-block-navigation-item__label">Architect</span></a></li><li class=" wp-block-navigation-item wp-block-navigation-link"><a class="wp-block-navigation-item__content"  href="<?php echo $row['url']; ?>/contact/"><span class="wp-block-navigation-item__label">Contact</span></a></li><li class=" wp-block-navigation-item wp-block-navigation-link"><a class="wp-block-navigation-item__content"  href="<?php echo $row['url']; ?>/request-a-quote/"><span class="wp-block-navigation-item__label">Request A Quote</span></a></li><li class=" wp-block-navigation-item wp-block-navigation-link"><a class="wp-block-navigation-item__content"  href="<?php echo $row['url']; ?>/credit-application/"><span class="wp-block-navigation-item__label">Credit Application</span></a></li></ul></nav></div>



<div class="wp-block-column is-layout-flow wp-block-column-is-layout-flow">
<figure class="wp-block-image size-full is-resized"><a href="https://kodiakbp.com/" target="_blank" rel="noreferrer noopener"><img loading="lazy" decoding="async" width="463" height="476" src="<?php echo $row['url']; ?>/wp-content/uploads/2024/06/white-kodiak-logo-w-tagline-crop.png" alt="Kodiak Building Partners" class="wp-image-4152" style="width:125px"/></a></figure>



<p>Proud Member of the Kodiak Building Partners Family</p>
</div>
</div>
</div>



<div class="wp-block-group site-copyright has-background-color has-foreground-background-color has-text-color has-background is-layout-constrained wp-block-group-is-layout-constrained">
<div class="wp-block-group alignwide is-content-justification-space-between is-nowrap is-layout-flex wp-container-core-group-layout-9 wp-block-group-is-layout-flex">
<p>© 2024 <?php echo $row['name']; ?> </p>


<nav class="wp-block-navigation is-layout-flex wp-block-navigation-is-layout-flex" aria-label="Footer Utility"><ul class="wp-block-navigation__container  wp-block-navigation"><li class=" wp-block-navigation-item wp-block-navigation-link"><a class="wp-block-navigation-item__content"  href="<?php echo $row['url']; ?>/privacy-policy/"><span class="wp-block-navigation-item__label">Privacy Policy</span></a></li></ul></nav></div>
</div>
</footer>
</div>
<script id="wp-block-template-skip-link-js-after">
	( function() {
		var skipLinkTarget = document.querySelector( 'main' ),
			sibling,
			skipLinkTargetID,
			skipLink;

		// Early exit if a skip-link target can't be located.
		if ( ! skipLinkTarget ) {
			return;
		}

		/*
		 * Get the site wrapper.
		 * The skip-link will be injected in the beginning of it.
		 */
		sibling = document.querySelector( '.wp-site-blocks' );

		// Early exit if the root element was not found.
		if ( ! sibling ) {
			return;
		}

		// Get the skip-link target's ID, and generate one if it doesn't exist.
		skipLinkTargetID = skipLinkTarget.id;
		if ( ! skipLinkTargetID ) {
			skipLinkTargetID = 'wp--skip-link--target';
			skipLinkTarget.id = skipLinkTargetID;
		}

		// Create the skip link.
		skipLink = document.createElement( 'a' );
		skipLink.classList.add( 'skip-link', 'screen-reader-text' );
		skipLink.href = '#' + skipLinkTargetID;
		skipLink.innerHTML = 'Skip to content';

		// Inject the skip link.
		sibling.parentElement.insertBefore( skipLink, sibling );
	}() );
	
</script>
<script src="<?php echo $row['url']; ?>/wp-content/themes/blockshoon/blocks/extend/build/view.js?ver=51e30a78678463e8c945" id="blockshoon-view-scripts-js"></script>
<script src="<?php echo $row['url']; ?>/wp-includes/js/jquery/jquery.min.js?ver=3.7.1" id="jquery-core-js"></script>
<script src="<?php echo $row['url']; ?>/wp-includes/js/jquery/jquery-migrate.min.js?ver=3.4.1" id="jquery-migrate-js"></script>
<script id="formidable-js-extra">
var frm_js = {"ajax_url":"https:\/\/<?php echo $row['url']; ?>\/wp-admin\/admin-ajax.php","images_url":"https:\/\/<?php echo $row['url']; ?>\/wp-content\/plugins\/formidable\/images","loading":"Loading\u2026","remove":"Remove","offset":"4","nonce":"b91990b87b","id":"ID","no_results":"No results match","file_spam":"That file looks like Spam.","calc_error":"There is an error in the calculation in the field with key","empty_fields":"Please complete the preceding required fields before uploading a file.","focus_first_error":"1","include_alert_role":"1"};
var frm_password_checks = {"eight-char":{"label":"Eight characters minimum","regex":"\/^.{8,}$\/","message":"Passwords require at least 8 characters"},"lowercase":{"label":"One lowercase letter","regex":"#[a-z]+#","message":"Passwords must include at least one lowercase letter"},"uppercase":{"label":"One uppercase letter","regex":"#[A-Z]+#","message":"Passwords must include at least one uppercase letter"},"number":{"label":"One number","regex":"#[0-9]+#","message":"Passwords must include at least one number"},"special-char":{"label":"One special character","regex":"\/(?=.*[^a-zA-Z0-9])\/","message":"password is invalid"}};
</script>
<script src="<?php echo $row['url']; ?>/wp-content/plugins/formidable-pro/js/frm.min.js?ver=6.8" id="formidable-js"></script>
<script id="formidable-js-after">
window.frm_js.repeaterRowDeleteConfirmation = "Are you sure you want to delete this row?";
</script>
<script>
/*<![CDATA[*/
/*]]>*/
</script>
</body>

<!-- Mirrored from <?php echo $row['url']; ?>/technology-streamlines-registration-process/ by HTTrack Website Copier/3.x [XR&CO'2014], Fri, 08 Nov 2024 18:11:00 GMT -->
</html>
<script type="text/javascript">
var Tawk_API = Tawk_API || {},
    Tawk_LoadStart = new Date();
(function() {
    var s1 = document.createElement("script"),
        s0 = document.getElementsByTagName("script")[0];
    s1.async = true;
    s1.src = 'https://embed.tawk.to/<?php echo $row['tawk']; ?>';
    s1.charset = 'UTF-8';
    s1.setAttribute('crossorigin', '*');
    s0.parentNode.insertBefore(s1, s0);
})();
</script>
<?php } ?>