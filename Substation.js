define([ 'dojo/_base/declare',
        'dojo/_base/lang',
        "dijit/registry",
        "dojo/aspect",
        'dijit/_WidgetBase',
        "dojo/store/Memory",
        "dijit/form/FilteringSelect",
        "dijit/form/Button",
        "dijit/_TemplatedMixin",
        'dijit/_WidgetsInTemplateMixin',
        'esri/tasks/query',
        "esri/tasks/QueryTask",
        "esri/tasks/StatisticDefinition",
        "esri/layers/ArcGISDynamicMapServiceLayer",
        "esri/layers/FeatureLayer",
        "esri/dijit/Search",
        "dojo/text!./demo/templates/Substation.html"],
    function(declare,lang,registry,aspect,BaseWidget,Memory, FilteringSelect, Button,TemplateMixedin,_WidgetsInTemplateMixin,Query,QueryTask,StatisticDefinition,DynamicLayer,FeatureLayer,Search,SubstationTemplate){
        return declare([BaseWidget,TemplateMixedin,_WidgetsInTemplateMixin],{
            templateString:SubstationTemplate,
             stationNameList:[],
            stationCodeList:[],
            selStationName:"",
            selStationID:"",
            selStationCode:"",
            stationNum:"",
            _nOnClick:function(){
                alert("locate by name");
            },
            _cOnClick:function(){
                this.stationNumber.innerHTML="111";
                alert("locate by code");
                this.testFunc();
            },
            testFunc:function(){
                this.stationNumber.innerHTML="112";
            },
            _sOnClick:function(){
                alert("�������ƶ�λ");
            },
            //������վ�б���ӵ�Selection��
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
            //������վ�����ӵ�Selection��
            fillCodeList:function(){

            },
            testFunc:function(){
                alert("hello");
            },
            //��ȡ����վ�б�
            getStationList:function(){

            },
            _nChange:function(){
                alert(this.identifyLayerDijit.value);
            },
            postCreate: function(){

                this.search=new Search(this.map,this.searchNode);

                this.search.hasButtonMode=false;
                this.search.allPlaceholder="输入换热站编号或名称";
                this.search.sources=[];
                this.search.autoSelect=true;
                this.search.sources.push({
                    featureLayer: new FeatureLayer("http://services1.arcgis.com/EYwUC8SxXDiz08ND/ArcGIS/rest/services/China%20income%20per%20person/FeatureServer/0"),
                    searchFields: ["NAME"],
                    displayField:  "NAME" ,
                    exactMatch: false,
                    name: "搜索换热站",
                    outFields: ["*"],
                    placeholder: "换热站名称或编号查询",
                    maxResults: 6,
                    maxSuggestions: 6,

                    //Create an InfoTemplate

                    //       infoTemplate: new InfoTemplate("Senator information", "Name: ${Name}</br>State: ${State}</br>Party Affiliation: ${Party}</br>Phone No: ${Phone_Number}<br><a href=${Web_Page} target=_blank ;'>Website</a>"),

                    enableSuggestions: true,
                    minCharacters: 0
                });
                this.search.startup();

                this.fillNameList();
            //    alert(this. this.identifyLayerDijit.get("value") );
                this.totalStationNumber();
    //            this.stationNumber.innerHTML=stationNum;
            },
            listenParentClick:function(){
            /*    var myTitlePane=registry.byId("substation_parent");
                aspect.after(myTitlePane, "toggle", function() {
                     alert("hello");
                });
                */
               },
            //���ж��ٸ�����վ
            totalStationNumber:function(){
                var Url = "http://10.50.51.67:6080/arcgis/rest/services/hrb/hrbPipe_2015/MapServer/8";
                var qWhere = "1=1";
                 console.log("in total");
                var qTask = new QueryTask(Url);
                var q=new Query();
                q.where="1=1";
                qTask.executeForCount(q,lang.hitch(this,function(count){
                     console.log(count);
              this.stationNumber.innerHTML =count;
                    this.stationNum=count;
                  //  console.log(this.stationNumber.innerHTML);
                }),function(error){
                    console.log(error);
              //      console.log
                });


            }

        })
    }



)