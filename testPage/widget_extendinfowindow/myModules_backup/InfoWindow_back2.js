define([
    "dojo/Evented",
    "dojo/parser",
    "dojo/on",
    "dojo/_base/declare",
    "dojo/dom-construct",
    "dojo/_base/array",
    "dojo/dom-style",
    "dojo/_base/lang",
    "dojo/dom-class",
    "dojo/fx/Toggler",
    "dojo/fx",
    "dojo/Deferred",
    "esri/domUtils",
    "esri/InfoWindowBase"

],
function(
    Evented,
    parser,
    on,
    declare,  
    domConstruct,
    array,
    domStyle,
    lang,
    domClass,
    Toggler,
    coreFx,
    Deferred,
    domUtils,
    InfoWindowBase
) {
    return declare([InfoWindowBase, Evented], {
         isContentShowing :false,
        coords: null,
        align: "Middle_Top",
        constructor: function(parameters) {
          lang.mixin(this, parameters);
           domClass.add(this.domNode, "myInfoWindow");
          this._title = domConstruct.create("div",{"class": "title"}, this.domNode);
          this._content = domConstruct.create("div",{"class": "content"}, this.domNode);
          on(this._content, "mouseover",lang.hitch(this,function(){
             console.log("mouse over");
          }));
            on(this._content,"click",lang.hitch(this,function(){
                console.log("mouse click on content");
            }));
            this._eventConnections = [];

          //hide initial display 
          domUtils.hide(this.domNode);
          this.isShowing = false;

        },
        setMap: function(map){
          this.inherited(arguments);
            this._eventConnections.push(map.on("pan", lang.hitch(this, this.__onMapPan)));
            this._eventConnections.push(map.on("extent-change", lang.hitch(this, this.__onMapExtChg)));
            this._eventConnections.push(map.on("zoom-start", lang.hitch(this, this.__onMapZmStart)));
            this._eventConnections.push(map.on("zoom", lang.hitch(this, this.onMapZm)));

        },
        move: function (point, isDelta) {
            if (isDelta) {
                point = this.coords.offset(point.x, point.y);
            }
            else {
                this.coords = point;
                if (this.mapCoords) {
                    this.mapCoords = this.map.toMap(point);
                }
            }
            this._adjustPosition(point);
        },

        __onMapPan: function (evt) {
            this.move(evt.delta, true);
        },

        onMapZm: function (evt) {
            var extent = evt.extent, zoomFactor = evt.zoomFactor, anchor = evt.anchor;
            var x = (this.coords.x - anchor.x) * zoomFactor + anchor.x;
            var y = (this.coords.y - anchor.y) * zoomFactor + anchor.y;
            var newPostion = new Point(x - this.coords.x, y - this.coords.y);
            this.move(newPostion, true);
        },

        __onMapZmStart: function () {
        },

        __onMapExtChg: function (evt) {
            var extent = evt.extent, delta = evt.delta, levelChange = evt.levelChange;

            var map = this.map, mapPoint = this.mapCoords;
            if (mapPoint) {
                if (this.isShowing == true) {
                    this.show(mapPoint);
                }
            }
            else {
                var screenPoint;
                if (levelChange) {
                    screenPoint = map.toScreen(this.__mcoords);
                }
                else {
                    screenPoint = this.coords.offset(
                        (delta && delta.x) || 0,
                        (delta && delta.y) || 0
                    );
                }
                if (this.isShowing == true) {
                    this.show(screenPoint);
                }
            }
        },

        setTitle: function(title){
          this.place(title, this._title);

        },
        setContent: function(content){
          this.place(content, this._content);
        },
        show: function(location){
          if(location.spatialReference){
            location = this.map.toScreen(location);
          }

          //Position 10x10 pixels away from the specified location
          domStyle.set(this.domNode,{
            "left": (location.x + 10) + "px",
            "top": (location.y + 10) + "px"
          });

          //display the info window
          domUtils.show(this.domNode); 
          this.isShowing = true;
          this.onShow();
        },
        hide: function(){
          domUtils.hide(this.domNode);
          this.isShowing = false;
          this.onHide();

        },
        resize: function(width, height){
          domStyle.set(this._content,{
            "width": width + "px",
            "height": height + "px"
          });
          domStyle.set(this._title,{
            "width": width + "px"
          });

        },
        _adjustPosition: function (location) {
            var width = domStyle.get(this._content, "width");
            var height = domStyle.get(this._content, "height");
            var left = "", top = "";
            if (this.align == "Center") {
                left = (location.x - width / 2) + "px";
                top = (location.y - height / 2) + "px";
            }
            else {
                left = (location.x - width / 2) + "px";
                top = (location.y - height) + "px";
            }

            domStyle.set(this.domNode, {
                left: left,
                top: top
            });
        },

        destroy: function(){
          domConstruct.destroy(this.domNode);
          this._closeButton = this._title = this._content = null;

        }


      });

});
