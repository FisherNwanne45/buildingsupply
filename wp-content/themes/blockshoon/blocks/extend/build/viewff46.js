(()=>{"use strict";let e=window.innerWidth;function t(){!function(){var e=Array.prototype.slice.call(document.querySelectorAll('[data-toggle="disclosure"]'));const t=new Event("close"),s=new Event("open");var n;function o(e){var s=e.getAttribute("id"),n=document.querySelector('[aria-controls="'+s+'"]');n.setAttribute("aria-expanded","false"),e.classList.add("disclosure-hide"),e.classList.remove("disclosure-show"),n.dispatchEvent(t),n.focus()}"undefined"!==(n=e)&&null!==n&&(n.length>=0||n.innerHTML.length>=0)&&e.forEach((function(e){e.addEventListener("click",(function(){var t,n=e.getAttribute("aria-controls");n&&(t=document.getElementById(n)).setAttribute("tabindex",-1),e.matches('[aria-expanded="false"]')?(e.setAttribute("aria-expanded","true"),t.classList.add("disclosure-show"),t.classList.remove("disclosure-hide"),t.focus(),e.dispatchEvent(s)):o(t)}))})),document.addEventListener("keyup",(function(e){if(e.defaultPrevented)return;e.target.closest("disclosure-show");let t=e.key||e.code;"Escape"!==t&&"Esc"!==t&&27!==t||(e.target.classList.contains("disclosure-show")||e.target.closest(".disclosure-show"))&&o(e.target.classList.contains("disclosure-show")?e.target:e.target.closest(".disclosure-show"))}))}();var e=document.getElementById("site-responsive-nav"),t=document.querySelector('button[aria-controls="site-responsive-nav"]'),s=e.querySelectorAll(".wp-block-navigation__submenu-container .wp-block-navigation-item__content");if(s.length&&s.forEach((function(s){s.addEventListener("click",(function(){window.innerWidth>=992?this.closest(".wp-block-navigation-submenu").querySelector(".wp-block-navigation-submenu__toggle").setAttribute("aria-expanded",!1):(e.classList.add("disclosure-hide"),e.classList.remove("disclosure-show"),t.setAttribute("aria-expanded",!1))}))})),t.addEventListener("open",(function(){document.body.classList.add("nav-is-expanded")})),t.addEventListener("close",(function(){document.body.classList.remove("nav-is-expanded")})),!CSS.supports("scroll-margin-top","1rem")){var n=document.documentElement.style.getPropertyValue("--bs-header-height"),o=window.location.hash;if(o.length){var i=document.getElementById(o).offsetTop-Number(n);window.scrollTo(0,i)}}}window.onscroll=function(){window.pageYOffset>50?document.body.classList.add("scrolled-down"):document.body.classList.remove("scrolled-down")};var s=document.querySelectorAll('.animate-content > [class*="wp-block"], .animate-content > p, .site-footer > [class*="wp-block"], .frm_forms'),n=new IntersectionObserver((function(e){e.forEach((function(e){e.isIntersecting&&e.target.classList.add("is-visible")}))}),{threshold:0,rootMargin:"0px 0px -150px 0px"}),o=new IntersectionObserver((function(e){e.forEach((function(e){e.isIntersecting&&e.intersectionRatio>=.3&&e.target.classList.add("is-visible")}))}),{threshold:[0,.3]});s&&e>767&&s.forEach((function(e){e.offsetHeight>=300?n.observe(e):o.observe(e)})),"loading"===document.readyState?document.addEventListener("DOMContentLoaded",t):t()})();