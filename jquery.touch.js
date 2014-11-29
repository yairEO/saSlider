(function($){
    "use strict";

    /**
    * jQuery Plugin to add basic "swipe" support on touch-enabled devices
    *
    * @author Yair Even Or
    * @version 1.0.0 (March 20, 2013)
    */
    $.event.special.swipe = {
        setup: function(){
            $(this).bind('touchstart', $.event.special.swipe.touchHandler)
                   .bind('mousedown', $.event.special.swipe.dragHandler);

        },

        teardown: function(){
            $(this).unbind('touchstart', $.event.special.swipe.handler)
                   .unbind('touchstart', $.event.special.swipe.handler);
        },

        touchHandler: function(event){
            var args = [].slice.call( arguments, 1 ), // clone arguments array, remove original event from cloned array
                touches = event.originalEvent.touches,
                startX, startY,
                deltaX = 0, deltaY = 0,
                that = this;

            event = $.event.fix(event);

            if( touches.length == 1 ){
                startX = touches[0].pageX;
                startY = touches[0].pageY;
                this.addEventListener('touchmove', onMove, false);
                this.addEventListener('touchend', kill, false);
            }

            function kill(){
                that.removeEventListener('touchmove', onMove);
                this.removeEventListener('touchend', kill);
                startX = startY = null;
            }

            function onMove(e){
                //e.preventDefault();

                var Dx = startX - e.touches[0].pageX,
                    Dy = startY - e.touches[0].pageY;

                event.type = 'swipe';
                args.unshift(event, Dx, Dy); // add back the new event to the front of the arguments with the delatas
                return ($.event.dispatch || $.event.handle).apply(that, args);
            }
        },

        dragHandler: function(event){
            var args = [].slice.call( arguments, 1 ), // clone arguments array, remove original event from cloned array
                startX, startY,
                deltaX = 0, deltaY = 0,
                that = this;

            event = $.event.fix(event);

            startX = event.originalEvent.pageX;
            startY = event.originalEvent.pageY;

            this.addEventListener('mousemove', onMove, false);
            this.addEventListener('mouseup', kill, false);

            function kill(){
                this.removeEventListener('mousemove', onMove);
                this.removeEventListener('mouseup', kill);
                startX = startY = null;
            }

            function onMove(e){
                //e.preventDefault();

                var Dx = startX - e.pageX,
                    Dy = startY - e.pageY;

                event.type = 'swipe';
                args.unshift(event, Dx, Dy); // add back the new event to the front of the arguments with the delatas
                return ($.event.dispatch || $.event.handle).apply(that, args);
            }
        }
    };
})(jQuery);