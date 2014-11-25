// saSlider (super awesome slider) jQuery plugin
// By Yair Even-Or
// Dec. 2014

;(function($){
    "use strict";

    var defaults, debounce,
        pluginName = 'saSlider',
        DOM = {
            window   : $(window),
            document : $(document)
        };


    // default settings
    defaults = {
        loop       : true,              // Allows to navigate between first and last images
        indicators : true,
        keys       : {
            prev  : '37, 80',     // keycodes to navigate to the previous image, default: Left arrow (37), 'p' (80)
            next  : '39, 78'      // keycodes to navigate to the next image, default: Right arrow (39), 'n' (78)
        }
    };


    // constructor
    function SaSlider(sliderElm, settings){
        this.slider   = $(sliderElm);
        this.slides   = this.slider.find('> ul > li'); // cache all the slides
        this.settings = $.extend({}, defaults, settings || {});
        this.active   = this.slider.find('.active');
        this.index    = 0; // start from first slide

        // Run whatever needs to be executed
        if( !this.settings.loop )
            this.markEdges();

        if( this.settings.indicators )
            this.indicators.generate.apply(this);

        this.checkOrientation.call(this);

        // last thing
        this.bind();
    }

    SaSlider.prototype = {
        // All plugin-related events
        bind : function(){
            var that = this;
            // next / prev arrows
            this.slider.on('click', '> .arrow', this.events.btn.bind(this));
            // cleanup styles after transition
            this.slider.find('> ul').on('transitionend', '> li', function(e){
                e.currentTarget.removeAttribute('style');
            });
            // keyboard controls
            DOM.document.on('keydown.' + pluginName, this.events.keyDown.bind(this));
            // indicators
            this.indicators.elm.on('click', 'i', function(){
                that.changeSlide( $(this).index() );
            });
            // window resize
            DOM.window.on('resize.' + pluginName, function(){
                Date.now() % 2 == 0 && that.checkOrientation.call(that);
            });
        },

        events : {
            btn : function(e){
                var idx =  e.currentTarget.classList[1] == 'next' ? this.index + 1 : this.index - 1;
                this.changeSlide(idx);
            },

            keyDown : function (e){
                var idx = this.settings.keys.next.indexOf(e.keyCode) ? this.index - 1 : this.index + 1;
                // Prevent default keyboard action (like navigating inside the page)
                return this.settings.keys.next.indexOf(e.keyCode) >= 0 && this.changeSlide(idx) ||
                       this.settings.keys.prev.indexOf(e.keyCode) >= 0 && this.changeSlide(idx) || true;
            }
        },

        // change the current slide
        changeSlide : function(idx){
            var isAnimating = this.active.width() < this.slider[0].clientWidth,
                newActive = this.slides.eq(idx),
                floatItem;

            // if there shouldn't be looping and it's the "edge", do not continue
            if( isAnimating || (!this.settings.loop && !newActive.length) )
                return;

            this.slider.toggleClass('prevSlide', idx < this.index);

            // loop logic
            if( idx > this.slides.length - 1 ){
                idx = 0;
            }
            else if( idx < 0 ){
                idx = this.slides.length - 1;
            }




            // find newActive again one "idx" has been fixed
            newActive = this.slides.eq(idx);

            this.checkOrientation.call(this, newActive);

            // update the active element and begin animation
            this.active.css('width',0).removeClass('active');
            this.active = newActive.addClass('active');

            if( !this.settings.loop )
                this.markEdges();

            // update to new index
            this.index = idx;

            if( this.settings.indicators )
                this.indicators.mark.apply(this);
        },

        // fixes slide image orientation to best fit the slider constraints
        checkOrientation : (function(){
            var timer; // throttle timer
            return function($slide){
                $slide = $slide || this.active;
                var that = this, img, portrait;

                // Chrome doesn't report the dimentions properly unless theres a delay
                clearTimeout(timer);
                timer = setTimeout(function(){
                    img = $slide.find('> img')[0];
                    // also chrome is crazy and sometimes report '0' so the check much run again until craziness stops
                    if( img.clientWidth == 0 || img.clientHeight == 0 ){
                        that.checkOrientation.call(that, $slide);
                        return;
                    }

                    // TODO - savwe the image aspect-ratio and compare it to the slider's aspect ratio to determine if it's c:portrait or not
                    portrait = img.clientHeight < that.slider[0].clientHeight || img.clientWidth > that.slider[0].clientWidth;
                    $slide.toggleClass('portrait', portrait);
                }, 20);
            }
        })(),

        // check if reached an edge (max left or max right)
        markEdges : function(){
            this.slider.toggleClass('start', !this.active.prev().length)
                       .toggleClass('end', !this.active.next().length);
        },

        // controller for the elements which represent which slide is currently viewed and how many are there
        indicators : {
            generate : function(){
                var htmlString = '<div class="indicators"><div class="wrap">' + Array(this.slides.length + 1).join('<i></i>') + '<b></b></div></div>';
                this.slider.append(htmlString);
                this.indicators.elm = this.slider.find('.indicators');
                this.indicators.marker = this.indicators.elm.find('b');
                return this;
            },
            mark : function(){
                var pos = this.indicators.marker.outerWidth(true) * this.index;
                this.indicators.marker.css('left', pos);
                return this;
            }
        }
    }

    // jQuery plugin init
    $.fn[pluginName] = function(settings){
        return this.each(function(){
            var saSlider = $(this).data('_' + pluginName);

            if( saSlider )
                return this;

            $(this).data('_' + pluginName, new SaSlider(this, settings));
        });
    };
})(jQuery);