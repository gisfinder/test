require(["dojo/_base/declare",
        "dojo/on", "dojo/dom",
        "dijit/registry",
         "esri/InfoWindowBase",
           "esri/domUtils",   "dojo/_base/lang",
        "dojo/dom-class", "dojo/dom-construct", "dojo/dom-style", "dojo/_base/array"],
    function (declare,on,dom,registry, InfoWindowBase, domUtils,  lang, domClass, domConstruct, domStyle, array) {
        var InfoWindow= declare( // 类名省略
            InfoWindowBase, // 父类
            {
                coords: null,
                align: "Middle_Top",
                dig:{myDig:null},
                chart1:null,

                //  queryTask=new QueryTask("http://10.50.51.67:6080/arcgis/rest/services/test/hrbsCADAHistory/MapServer"),
                constructor: function (parameters) {
                    lang.mixin(this, parameters);
                    domClass.add(this.domNode, "myInfoWindow" );
                    this._pointer=domConstruct.create("div", { "class": "pointerLeft" }, this.domNode);
                    this._title = domConstruct.create("div",{"class": "title", style: "overflow:hidden,width:60px, heiht:50px"},this.domNode);
                    this._content = domConstruct.create("div", { "class": "content" }, this.domNode);
                    domUtils.hide(this.domNode);
                    this.isShowing = false;
                },
                setMap: function (map) {
                    this.inherited(arguments);

                },
                setTitle: function(title){
                    this.place(title, this._title);

                },
                setContent: function (content) {
                    this.place(content, this._content);
                },
                 show: function (location) {
                    if (location.spatialReference) {
                        this.mapCoords = location;
                        location = this.map.toScreen(location);
                    }
                    else {
                        this.mapCoords = null;
                        this.coords = location;
                        if (typeof (this.__mcoords) === "undefined") {
                        }
                    }

                    this._adjustPosition(location);
                    domUtils.show(this.domNode);
                    this.isShowing = true;
                    this.onShow();
                },



                destroy: function () {
                    array.forEach(this._eventConnections, function (handle) {
                        handle.remove();
                    });
                    domConstruct.destroy(this.domNode);
                    this._closeButton = this._title = this._content = this._eventConnections = null;
                }
            }
        );


    });