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
        this.coordBox = $('<div/>', {
            'class': 'coord-box', 
            'style': 'display:none'
        }).insertAfter(this.$e);

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

            t.coordBox.css({
                top: t.startCoords.y, 
                right: 'auto',
                bottom: 'auto',
                left: t.startCoords.x,
                width: 0,
                height: 0
            }).show();

        $(document).one('mouseup',function(e){
            // only if click started on the image
            if(t.clickActive) {
                log('mouseup');
                t.clickActive = false;

                t.endCoords = getObjClickCoords($e, e);
                console.log(t.endCoords);
                
            }
        });

        $(document).mousemove(function(e){
            if(t.clickActive) {
                var offset = $e.offset();
                var pos = {x: e.pageX - offset.left, y: e.pageY - offset.top};
                var corners = getFourCorners(t.startCoords, pos);
                console.log(corners);
                t.coordBox.css({
                    top: corners.top, 
                    left: corners.left,
                    width: corners.right-corners.left,
                    height: corners.bottom-corners.top
                });


            }
            return false;
        });




            e.preventDefault();
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

        this.coordBox.hide();
    };

    Plugin.prototype.insertOrUpdateMap = function() {
        var $e = this.$e, t = this;
        var mapId = 'imageMap';

        if($e.attr('usemap') !== undefined) {
            // map exists
            var $map = $('#'+mapId);
        } else {
            // map doesn't exist, create
            $e.attr('usemap', '#'+mapId);
            var $map = $('<map/>', {
                'name': mapId,
                'id': mapId
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

    function getFourCorners(a, b) {
        var corners = {};
        if(a.x <= b.x) { // a leftmost
            corners.left = a.x;
            corners.right = b.x;
            if(a.y > b.y) { // b topmost
                corners.top = b.y;
                corners.bottom = a.y;
                corners.topLeft = {x:a.x, y:b.y};
                corners.topRight = {x:b.x, y:b.y};
                corners.bottomLeft = {x:a.x, y:a.y};
                corners.bottomRight = {x:b.x, y:a.y};
            } else { // a topmost
                corners.top = a.y;
                corners.bottom = b.y;
                corners.topLeft = {x:a.x, y:a.y};
                corners.topRight = {x:b.x, y:a.y};
                corners.bottomLeft = {x:a.x, y:b.y};
                corners.bottomRight = {x:b.x, y:b.y};
            }
        } else { // b leftmost
            corners.left = b.x;
            corners.right = a.x;
            if(a.y > b.y) { // b topmost
                corners.top = b.y;
                corners.bottom = a.y;
                corners.topLeft = {x:b.x, y:b.y};
                corners.topRight = {x:a.x, y:b.y};
                corners.bottomLeft = {x:b.x, y:a.y};
                corners.bottomRight = {x:a.x, y:a.y};
            } else { // a topmost
                corners.top = a.y;
                corners.bottom = b.y;
                corners.topLeft = {x:b.x, y:a.y};
                corners.topRight = {x:a.x, y:a.y};
                corners.bottomLeft = {x:b.x, y:b.y};
                corners.bottomRight = {x:a.x, y:b.y};
            }
        }
        return corners;
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