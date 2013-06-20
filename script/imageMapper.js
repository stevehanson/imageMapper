/*
 * jQuery ImageMapper plugin
 * Original authors: @stephenhanson, Matthew Bolaños
 */
;(function ($, window, document, undefined) {
    

    // Create the defaults once
    var pluginName = 'imageMapper',
        defaults = {
            propertyName: 'value'
        };

    // The actual plugin constructor
    function Plugin( element, options ) {
        this.$e = $(element);
        this.options = $.extend( {}, defaults, options) ;
        this._name = pluginName;
        this._defaults = defaults;

        this.clickActive = false;
        this.startCoords = undefined;
        this.endCoords = undefined;

        this.cnt = 0;
        this.init();
    }

 
    Plugin.prototype.init = function () {
        var t = this;
        var $e = t.$e;
        
        $e.mousedown(function(e){

            t.clickActive = true;

            t.startCoords = getObjClickCoords(this, e);
            console.log(t.startCoords);

            e.preventDefault();
        });

        $e.mouseup(function(e){
            // only if click started on the image
            if(t.clickActive) {
                
                t.clickActive = false;
                t.endCoords = getObjClickCoords(this, e);
                console.log(t.endCoords);

                t.insertOrUpdateMap();
                var mapId = 'imageMap'+t.cnt;
                $e.attr('usemap', '#'+mapId);
                t.cnt++;

                

            }
        });
        
    };

    Plugin.prototype.insertMap = function(href) {
        log('in insertMap');
        var t = this;
        var $map = this.insertOrUpdateMap();

        $map.append($('<area/>', {
            shape: 'rect',
            coords: t.coordsList().join(','),
            href: href
        }));
    };

    Plugin.prototype.insertOrUpdateMap = function() {
        var $e = this.$e, t = this;
        if($e.attr('usemap') !== undefined) {
            var mapId = $e.attr('usemap');
            var $map = $('map[name="'+mapId.substring(1)+'"]');
        } else {
            // map doesn't exist, create
            var mapId = 'imageMap'+t.cnt;
            $e.attr('usemap', '#'+mapId);
            var $map = $('<map/>', {
                'name': mapId
            });
            $e.after($map);
        }
        return $map;
    };

    Plugin.prototype.coordsList = function() {
        return [this.startCoords.x, this.startCoords.y, this.endCoords.x, this.endCoords.y];
    }

    function getObjClickCoords(obj, e) {
        var offset = $(obj).offset();
        var imgPosX = e.pageX - offset.left;
        var imgPosY = e.pageY - offset.top;
        return { x: imgPosX, y: imgPosY };
    }


    
    $.imageMapper = function ( options, args ) {


        return $('.image-map').each(function () {
            var dat = $.data(this, "plugin_" + pluginName);
            if ( !dat) {
                $.data( this, "plugin_" + pluginName, 
                new Plugin( this, options ));
            } else {
                if(options != null && options === 'insertMap') {
                    dat.insertMap(args);
                }
            }
        });
    }
    
    function log(msg) {
        if(console && console !== undefined) {
            console.log(msg);
        }
    }

})( jQuery, window, document );