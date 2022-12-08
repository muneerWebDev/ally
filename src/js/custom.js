(function ($) {
    var locoScroll;

    toggleBootstrapTogglesOnHover();
    dynamicCssVariables();
    setAspectratioBasedOnImage();

    windowLoadFunctions();
    $("#dynamic-year").html(new Date().getFullYear());
    $(window).resize(function () {
        dynamicCssVariables();

        setTimeout(function () {
            setAspectratioBasedOnImage();
        }, 200)
    });


    $('[data-bs-toggle="tab"]').on("shown.bs.tab", function (event) {
        window.dispatchEvent(new Event('resize'));
    });

    $(window).on('hashchange', function (e) {
        window.dispatchEvent(new Event('resize'));
    });


    function windowLoadFunctions() {

        $(window).on("load", function () {
            addClassWhenSiteIsLoaded();
            locomotiveScroll();
            customNumberCounter();
            bootstrapTabSlider();

            setTimeout(() => {
                addClassWhenSiteIsLoaded();
            }, 1500);
        });
    }

    windowLoadFunctions();


    /***************************/
    // add class to body when the webpage is initially loaded
    function addClassWhenSiteIsLoaded() {
        $("body").addClass('loaded');
    }




    /***************************/
    // locomotive scroll for page smooth scroll
    function locomotiveScroll() {

        if ($(".page-wrap").length) {
            (function () {
                scroll = new LocomotiveScroll();
            })();

            locoScroll = new LocomotiveScroll({
                el: document.querySelector(".page-wrap"),
                smooth: true,
                getDirection: true
            });

            var lastScrollTop = 0;
            locoScroll.on('scroll', (position) => {
                if ((position.scroll.y) > 50) {
                    document.querySelector('body').classList.add('scrolled');

                } else {
                    document.querySelector('body').classList.remove('scrolled');
                }

                var st = position.scroll.y;
                if (st > lastScrollTop) {
                    // downscroll code
                    $("body").addClass("downscroll");
                } else {
                    // upscroll
                    $("body").removeClass("downscroll");
                }
                lastScrollTop = st;

            });

            setTimeout(() => {
                scroll.update();
            }, 1500);
        }

    }





    /***************************/
    // dynamic css variables
    function dynamicCssVariables() {
        var containerOffset = $(".container").offset().left;
        var siteHeaderHeight = $(".siteHeader").outerHeight();
        var siteFooterHeight = $(".siteFooter").outerHeight();
        $("body").css({
            "--containerOffset": containerOffset + "px",
            "--siteHeaderHeight": siteHeaderHeight + "px",
            "--siteFooterHeight": siteFooterHeight + "px",
        });
    }





    /***************************/
    // general bootstrap togglers on hover
    function toggleBootstrapTogglesOnHover() {
        // dropdown
        $(".dropdown").hover(function () {
            $(".dropdown").not(this).find(".dropdown-menu").removeClass("show");
        });
    }





    /***************************/
    // Set aspect ratio of the bg image to the div 
    function setAspectratioBasedOnImage() {

        if ($(".bg-aspectratio").length) {

            var $image = $('.bg-aspectratio');
            var imageUrl = $image.css('background-image').replace('url(', '').replace(')', '').replace(/\"/gi, "");
            var img = new Image;
            img.src = imageUrl;

            var image_width;
            var image_height;

            $(img).on("load", function () {
                image_width = img.width;
                image_height = img.height;

                console.log(image_width);
                var newHeight = $image.width() * (image_height / image_width);
                $image.height(newHeight);

            });
        }
    }





    /***************************/
    // custom number counter
    function customNumberCounter() {

        var $numberCounter = $('.number-counter');

        function startCounter() {
            $numberCounter.each(function () {
                var $this = $(this);
                if (!($this.hasClass("animated"))) {
                    countTo = $this.attr('data-count');
                    $({ countNum: $this.text() }).animate({ countNum: countTo },
                        {
                            easing: 'linear',
                            duration: 1800,
                            step: function () {
                                $this.text(commaSeparateNumber(Math.ceil(this.countNum)));
                            },
                            complete: function () {
                                $this.text(commaSeparateNumber(Math.ceil(this.countNum)));
                            }
                        });
                    $this.addClass("animated")
                }
            });
        }

        function commaSeparateNumber(val) {
            while (/(\d+)(\d{3})/.test(val.toString())) {
                val = val.toString().replace(/(\d+)(\d{3})/, '$1' + ',' + '$2');
            }
            return val;
        }

        if ($(".page-wrap").length) {
            locoScroll.on('call', (obj) => {
                if (checkVisible($numberCounter)) {
                    //do something when myID1 is in view
                    startCounter();
                }
            });
        }
    }




    /***************************/
    // check if a locomotive element in viewport
    function checkVisible(elm, eval) {
        eval = eval || "object visible";
        var viewportHeight = $(window).height(), // Viewport Height
            scrolltop = $(window).scrollTop(), // Scroll Top
            y = $(elm).offset().top,
            elementHeight = $(elm).height();

        if (eval == "object visible") return ((y < (viewportHeight + scrolltop)) && (y > (scrolltop - elementHeight)));
        if (eval == "above") return ((y < (viewportHeight + scrolltop)));
    }





    /***************************/
    // check if element in viewport
    function isScrolledIntoView(elem) {
        var docViewTop = $(window).scrollTop();
        var docViewBottom = docViewTop + $(window).height();

        var elemTop = $(elem).offset().top;
        var elemBottom = elemTop + $(elem).height();

        return ((elemBottom <= docViewBottom) && (elemTop >= docViewTop));
    }





    /***************************/
    // bootstrap tab slider
    function bootstrapTabSlider() { //custom code to convert bootstrap tabs to sliders
        jQuery(".nav-tabs.tabs-slider .nav-item:first-child .nav-link").click();
        jQuery(".nav-tabs.tabs-slider").each(function () {
            var $this = jQuery(this);
            var totalSlides = jQuery($this).children(".nav-item").length;
            var autoplaySpeed = 4000;
            var interval;
            var autoplay = function () {
                interval = setInterval(function () {
                    slideChange();
                }, autoplaySpeed);
            };

            autoplay();

            function slideChange() {
                var activeLI = jQuery($this).find(".nav-link.active").parent();
                var currentActive = jQuery($this).find(".nav-link.active").parent().index();
                currentActive++;

                if (currentActive < totalSlides) {
                    jQuery(activeLI).next().find(".nav-link").click();
                    console.log((currentActive++) + "<" + parseInt(totalSlides))
                } else {
                    jQuery($this).find(".nav-item:first-child .nav-link").click();
                }
            };


            jQuery($this).children().each(function (index, element) {

                jQuery(element).find(".nav-link").click(function () {
                    console.log("clicked");
                    clearInterval(interval);
                    autoplay();
                })
            });

        });
    }

}(jQuery));
