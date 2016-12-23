define([ 'dojo/_base/declare',
        "dijit/registry",
        "dojo/aspect",
        'dijit/_WidgetBase',
        "dojo/store/Memory",
        "dijit/form/FilteringSelect",
        "dijit/form/Button",
        "dijit/_TemplatedMixin",
        'dijit/_WidgetsInTemplateMixin',
        "dojo/text!./demo/templates/Substation.html"],
    function(declare,registry,aspect,BaseWidget,Memory, FilteringSelect, Button,TemplateMixedin,_WidgetsInTemplateMixin,SubstationTemplate){
        return declare([BaseWidget,TemplateMixedin,_WidgetsInTemplateMixin],{
            templateString:SubstationTemplate,
             stationNameList:[],
            stationCodeList:[],
            selStationName:"",
            selStationID:"",
            selStationCode:"",

            _nOnClick:function(){
                alert("locate by name");
            },
            _cOnClick:function(){
                alert("locate by code");
            },
            _sOnClick:function(){
                alert("根据名称定位");
            },
            //将换热站列表添加到Selection中
            fillNameList:function(){
                var stateStore = new Memory({
                    data: [
                        {name:"Alabama", id:"AL"},
                        {name:"Alaska", id:"AK"},
                        {name:"American Samoa", id:"AS"},
                        {name:"Arizona", id:"AZ"},
                        {name:"Arkansas", id:"AR"},
                        {name:"Armed Forces Europe", id:"AE"},
                        {name:"Armed Forces Pacific", id:"AP"},
                        {name:"Armed Forces the Americas", id:"AA"},
                        {name:"California", id:"CA"},
                        {name:"Colorado", id:"CO"},
                        {name:"Connecticut", id:"CT"},
                        {name:"Delaware", id:"DE"}
                    ]
                });
                this.identifyLayerDijit.set("store",stateStore);
                this.identifyLayerDijit.set("searchAtt","id");
                this.identifyLayerDijit.set("value","");
            },
            //将换热站编号添加到Selection中
            fillCodeList:function(){

            },
            testFunc:function(){
                alert("hello");
            },
            //获取换热站列表
            getStationList:function(){

            },
            _nChange:function(){
                alert(this.identifyLayerDijit.value);
            },
            postCreate: function(){

          //     this.listenParentClick();
                this.fillNameList();
                alert(this. this.identifyLayerDijit.get("value") );
            },
            listenParentClick:function(){
            /*    var myTitlePane=registry.byId("substation_parent");
                aspect.after(myTitlePane, "toggle", function() {
                     alert("hello");
                });
                */
               }

        })
    }



)