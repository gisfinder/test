define(["dojo/_base/declare",
		"dojo/on", "dojo/dom",
		"dijit/registry",
		"dijit/form/Select",
		"dojo/data/ObjectStore",
		"dojo/store/Memory",
		"dojox/charting/Chart",
		"dojox/charting/axis2d/Default",
		"dojox/charting/plot2d/Lines","dijit/TooltipDialog",
		"dijit/Tooltip","dijit/form/RadioButton",
		"dijit/popup","esri/InfoWindowBase","esri/tasks/query",
		"esri/tasks/QueryTask",
		"esri/domUtils", "esri/geometry/Point", "dojo/_base/lang",
		"dojo/dom-class", "dojo/dom-construct", "dojo/dom-style", "dojo/_base/array"],
    function (declare,on,dom,registry,Select,ObjectStore, Memory,Chart, Default, Lines,TooltipDialog,Tooltip,RadioButton, popup, InfoWindowBase,Query,QueryTask, domUtils, Point, lang, domClass, domConstruct, domStyle, array) {
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
				ifDraw=false;
		        isContentShowing = false;
				this.isPrimary=true;//一次还是二次
				this.subName="";
				this.panelDlg=null;
				this.subID=""; //换热站编号
				this.selHuCode="";//当前机组编号
				this.selVarialbe="";//鼠标获取的变量
				this.primaryResult="";
				this.secondaryResult="";
				this.maxZindex=101;
				this.scadaValue=null;
                this.priContent="";
				this.secContent="";
				this.scadaList=[];
				this.curveData=[];//曲线数据
				this.xAxisData=[];//曲线的x轴数据
				//一次变量
				this.priVariables=["priPs","priPr","priTs","priTr","opening","flow"];//一次供回压力，温度，电调阀开度，流量
				//二次变量
				this.secVariables=["secPs","secPr","secTs","secTr","frequency"];
				this.dig.myDig=new TooltipDialog({
					style: "width: 300px;",
					content: "<div id='chart1' style='width: 250px; height: 150px; margin: 5px auto 0px auto;'></div>",
					onMouseLeave: function(){
						popup.close(this.dig);
					}
				});
				//一次、二次和机组列表对话框

             //给domNode添加 class，用于设定样式
		        domClass.add(this.domNode, "myInfoWindow" );
				this._title = domConstruct.create("div",{"class": "title", style: "overflow:hidden,width:60px, heiht:50px"},this.domNode);
		        this._content = domConstruct.create("div", { "class": "content" }, this.domNode);
				this._switchButton1 = domConstruct.create("div",{"class": "primary", "title": "一次"}, this.domNode);
				this._switchButton = domConstruct.create("div",{"class": "secondary", "title": "二次"}, this.domNode);
                this.queryTask=new QueryTask("http://10.50.51.67:6080/arcgis/rest/services/test/hrbsCADAHistory/MapServer");

				function setS(){

					    if(!ifDraw){
							chart1 = new Chart("chart1");
							chart1.addPlot("default", {type: Lines});
							chart1.addAxis("x");
							chart1.addAxis("y", {vertical: true});
							chart1.addSeries("Series 1", [1, 2, 2, 3, 4, 5, 5, 7]);
							chart1.render();
							ifDraw=true;
						}
						else{
							chart1.updateSeries("Series 1", [0,0, 3, 3,1, 5, 5,1]);
							chart1.render();
 						}
 				};

		        this._eventConnections = [];
				on(this._switchButton, "click", lang.hitch(this, function(){

					popup.open({
						popup: this.panelDlg,
						orient: ["above","below"],
						around: this._switchButton
					});

				}));

		        domUtils.hide(this.domNode);
		        this.isShowing = false;
		    },

		    setMap: function (map) {
		        this.inherited(arguments);
		        this._eventConnections.push(map.on("pan", lang.hitch(this, this.__onMapPan)));
	            this._eventConnections.push(map.on("extent-change", lang.hitch(this, this.__onMapExtChg)));
	             this._eventConnections.push(map.on("zoom-start", lang.hitch(this, this.__onMapZmStart)));
		         this._eventConnections.push(map.on("zoom", lang.hitch(this, this.onMapZm)));
				/*
				on(this._content,"click",lang.hitch(this,function(){
					window.open("http://www.google.com");
				}));
				*/
		    },
			setTitle: function(title){
				this.place(title, this._title);

			},
		    setContent: function (content) {
		        this.place(content, this._content);
		    },
			fullTitleName:function(){

			},
            passResult:function(subId,subName,primary,secondary){
				this.subID=subId;
				this.subName=subName;
				this.primaryResult=primary;
				this.secondaryResult=secondary;
			},
			//初始化ToolTipDialog,huList为同一换热站的机组列表
			initTpDialog:function(huCode,huList){
				this.isPrimary=true;
				var optionStr="";
				var ifFirst=true;//第一个机组
				var tD= '<div id="tpDialog'+huCode+'" class="pDlg"></div><div id="btnGroup" class="left">'+
					'<label for="name">一次:</label> <input data-dojo-type="dijit/form/RadioButton" id="rbPri'+huCode+'" checked value="pri">' +
					'<br><label for="hobby"> 二次:</label> <input data-dojo-type="dijit/form/RadioButton" id="rbSec'+huCode+'" value="sec"></div>'
					+'<div id="selectMenu" class="right"><select name="select1" id="sel'+huCode+'"  data-dojo-type="dijit/form/Select"> ';
               //创建机组列表的下拉框
				array.forEach(huList,function(hu){
					if(ifFirst)
					{
					optionStr=optionStr+'<option class="left" value="'+hu["code"]+'" selected="selected">'+hu["desc"]+'</option>';
						ifFirst=false;
					}
					else
						optionStr=optionStr+'<option class="left" value="'+hu["code"]+'"  >'+hu["desc"]+'</option>';

				});
				var cct=tD+optionStr+"</select></div>";
				 this.panelDlg=new TooltipDialog({
					style: "width: 120px; height:40px",

					content:cct,
					onMouseLeave: function(e){

						if(registry.getEnclosingWidget(e.target).name=="select1")
							return;
						else{
							popup.close(this.dig);

						}
					},
					onOpen:lang.hitch(this, function(e){

					})
				});

				var sHu=registry.byId("sel"+huCode);
				sHu.on("change",lang.hitch(this,function(e){
					this.selHuCode=sHu.value;
					this.setContent( this.getInfoWindowContent(this.selHuCode,this.isPrimary));
					this.regContentMouseOverEvent(this.isPrimary,this.selHuCode);
					console.log("机组为:"+sHu.value);
				}));

				var rbPri=registry.byId("rbPri"+huCode);

				var handle =on(rbPri,"change",lang.hitch(this,function(isChecked) {
     					if (isChecked) {
						console.log("一次"+huCode+this.subName);
						if(!this.isPrimary)
						    this.showPrimary();
						this.isPrimary=true;
						this.regContentMouseOverEvent(true,huCode);
					}
					else
					{

						console.log("二次"+huCode+this.subName);
						if(this.isPrimary)
						     this.showSecondary();
						this.isPrimary=false;
						this.regContentMouseOverEvent(false,huCode);
					}

				}));
			},
			//从主程序传过来的SCADA、换热站、机组数据
            passScadaValue:function(subCode,subName,huCode,scadaValue,huList,scadaList){
				this.scadaValue=scadaValue;
				this.scadaList=scadaList;
				this.isPrimary=true;
                this.subName=subName;
                this.priContent=this.getInfoWindowContent(huCode,true) ;
                this.setContent(this.priContent);

				this.secContent=this.getInfoWindowContent(huCode,false) ;
				this.initTpDialog(huCode,huList);
			 	//this.addRadioButton(huCode);
		 	this.regContentMouseOverEvent(true,huCode);


			},

			//注册 MouseOver事件
			regContentMouseOverEvent:function(ifPri,huCode) {
				if (ifPri) {
					on(dom.byId("priPs" + huCode), "mouseover", lang.hitch(this, function (e) {
						this.selVarialbe = "priPs";
						popup.open({
							popup: this.dig.myDig,
							orient: ["before-centered", "above", "below"],
							around: dom.byId("priPs" + huCode)
						});
						//setS();
					}));


				on(dom.byId("priPr" + huCode), "mouseover", lang.hitch(this, function (e) {
					this.selVarialbe = "priPr";
					popup.open({
						popup: this.dig.myDig,
						orient: ["after-centered","above", "below"],
						around: dom.byId("priPr" + huCode)
					});
					//setS();
				}));

				on(dom.byId("priTs" + huCode), "mouseover", lang.hitch(this, function (e) {
					this.selVarialbe = "priTs";
					popup.open({
						popup: this.dig.myDig,
						orient: ["before-centered"],
						around: dom.byId("priTs" + huCode)
					});
					//setS();
				}));


				on(dom.byId("priTr" + huCode), "mouseover", lang.hitch(this, function (e) {
					this.selVarialbe = "priTr";
					popup.open({
						popup: this.dig.myDig,
						orient: ["after-centered"],
						//around: dom.byId("priTr" + huCode)
						around:dom.byId("priTr" + huCode)
					});
			//		this.setCurve(this.selVarialbe,huCode);
				}));
					on(dom.byId("opening" + huCode), "mouseover", lang.hitch(this, function (e) {
						this.selVarialbe = "opening";
						popup.open({
							popup: this.dig.myDig,
							orient: [ "before-centered"],
							around: dom.byId("opening" + huCode)
						});
						//setS();
					}));
					on(dom.byId("flow" + huCode), "mouseover", lang.hitch(this, function (e) {
						this.selVarialbe = "flow";
						popup.open({
							popup: this.dig.myDig,
							orient: ["after-centered"],
							around: dom.byId("flow" + huCode)
						});
						//setS();
					}));
			}
			else {
					on(dom.byId("secPs" + huCode), "mouseover", lang.hitch(this, function (e) {
						this.selVarialbe = "secPs";
						popup.open({
							popup: this.dig.myDig,
							orient: ["before-centered", "above", "below"],
							around: dom.byId("secPs" + huCode)
						});
						//setS();
					}));

					on(dom.byId("secPr" + huCode), "mouseover", lang.hitch(this, function (e) {
						this.selVarialbe = "secPr";
						popup.open({
							popup: this.dig.myDig,
							orient: ["after-centered", "above", "below"],
							around: dom.byId("secPr" + huCode)
						});
						//setS();
					}));

					on(dom.byId("secTs" + huCode), "mouseover", lang.hitch(this, function (e) {
						this.selVarialbe = "secTs";
						popup.open({
							popup: this.dig.myDig,
							orient: ["before-centered", "above", "below"],
							around: dom.byId("secTs" + huCode)
						});
						//setS();
					}));
					on(dom.byId("secTr" + huCode), "mouseover", lang.hitch(this, function (e) {
						this.selVarialbe = "secTr";
						popup.open({
							popup: this.dig.myDig,
							orient: ["after-centered", "above", "below"],
							around: dom.byId("secTr" + huCode)
						});
						//setS();
					}));
					on(dom.byId("frequency" + huCode), "mouseover", lang.hitch(this, function (e) {
						this.selVarialbe = "frequency";
						popup.open({
							popup: this.dig.myDig,
							orient: [ "before-centered"],
							around: dom.byId("frequency" + huCode)
						});
						//setS();
					}));
				}
			},
			//根据机组编码和一次还是二次，获取content
			getInfoWindowContent:function(huCode,isPrimary){

				var content;
				var scadaValue={};
				array.forEach(this.scadaList,function(sValue){
						if(huCode==sValue.attributes["huCode"]) {
							scadaValue = sValue;
					//		break;
						}
					}
				);
				if(isPrimary) {
					var priPs = scadaValue.attributes.PriPs.toFixed(1);
					var priPr = scadaValue.attributes.PriPr.toFixed(1);
					var priTs = scadaValue.attributes.PriTs.toFixed(0);
					var priTr = scadaValue.attributes.PriTr.toFixed(0);
					content = " <table width='100%' class='tb' border='0'><tr style='background:#F5DEB3'><td  style='text-align:left'><div id='priPs" + huCode + "' >" + priPs + "</div></td>";
					content = content + " <td style='text-align:right;'><div id='priPr" + huCode + "' >" + priPr + "</div></td></tr>";
					content = content + "<tr  style='background:#EED2EE'><td style='text-align:left'><div id='priTs" + huCode + "' >" + priTs + "</div></td>";
					content = content + "<td style='text-align:right'><div id='priTr" + huCode + "' >" + priTr + "</div></td></tr>";
					content = content +"<tr  style='background:#EED2EE'><td style='text-align:left'><div id='opening" + huCode + "' >" + "000" + "</div></td>";
					content = content + "<td style='text-align:right'><div id='flow" + huCode + "' >" +"888" + "</div></td></tr></table> ";
			//	   console.log("primary content is"+content);
						return content;
				}
				else {
					var secPs = scadaValue.attributes.SecPs.toFixed(1);
					var secPr = scadaValue.attributes.SecPr.toFixed(1);
					var secTs = scadaValue.attributes.SecTs.toFixed(0);
					var secTr = scadaValue.attributes.SecTr.toFixed(0);
					content = " <table width='100%' class='tb' border='0'><tr style=' background:#F5FFFA'><td  style='text-align:left; '><div id='secPs" + huCode + "' >" + secPs + "</div></td>";
					content = content + "<td style='text-align:right;'><div id='secPr" + huCode + "' >" + secPr + "</div></td></tr>";
					content = content + "<tr  style='background:#EEE9E9'><td style='text-align:left'><div id='secTs" + huCode + "' >" + secTs + "</div></td>";
					content = content + "<td style='text-align:right'><div id='secTr" + huCode + "' >" + secTr + "</div></td></tr>";
					content = content + "<tr><td style='text-align:right'><div id='frequency" + huCode + "' >" + "9999" + "</div></td></tr></table>";
				     return content;
				}
			},
			getPressure:function(){
				console.log("exec");
			},
			//显示一次数据
			showPrimary:function(){
				this.setContent(this.priContent);

			} ,
			//显示二次数据
			showSecondary:function(){
				this.setContent(this.secContent);

			},
			switchContent:function(){
				if(this.isPrimary)
					this.place(this.secondaryResult,this._content);

				else
					this.place(this.primaryResult, this._content);
			},
			//设置曲线
            setCurve:function(variable,huCode){
				var chart1 = new Chart("chart1");
				chart1.addPlot("default", {type: Lines, labels: true,labelStyle: "outside", labelOffset: 25,Stroke:{color: "blue", width: 1},markers: true});
				this.queryCurveData(variable,huCode);
		},
			/*********************************************************************
			 * 查询历史曲线
			输入：机组编号；变量名称
			输出:historyData;
			* ******************************************************************/
			queryCurveData:function(variable,huCode) {
				var query = new Query();
				var curDate = new Date();
				var resultList=[];
				var axisList=[];
				var startTime = "";
				var endTime = new Date(curDate - 3600 * 1000 * 24);
				query.orderByFields = ["DTime"];
				startTime = curDate.getFullYear() + "-" + (Number(curDate.getMonth()) + 1) + "-" + curDate.getDay() + " " + curDate.getHours() + ":" + curDate.getMinutes() + ":00";
				endTime = endTime.getFullYear() + "-" + (Number(endTime.getMonth()) + 1) + "-" + endTime.getDay() + " " + endTime.getHours() + ":" + endTime.getMinutes() + ":00"
			 query.where="huCode='053' and (DTime<date '"+startTime+"' and DTime>date'"+endTime+"')";
				console.log("start:" + startTime);
				console.log("end:" + endTime);
				query.where = "DTime<date '" + startTime + "'";
				query.outFields = ["*"];
				query.returnGeometry = false;
				var queryTask = new QueryTask("http://10.50.51.67:6080/arcgis/rest/services/test/hrbTestScada/MapServer/2");
				queryTask.execute(query, queryResult);
				var tagTime;
				var labelValue = 0;

				function queryResult(rs) {
					array.forEach(rs.features, function (feature) {
						tagTime = new Date(feature.attributes["DTime"] - 8 * 3600 * 1000);
						labelValue++;
						if (tagTime.getHours() == 0)
							axisList.push({value: labelValue, text: tagTime.getDay() + "日"});
						axisList.push({value: labelValue, text: tagTime.getHours()});
						resultList.push({x: labelValue, y: feature.attributes["PriPs"]});
					})
					chart1.addAxis("x", {
						majorLabels: true, majorTicks: true,
						minorLabels: true, minorTicks: true, minorTick: {length: 1},
						microTicks: true,
						majorTickStep: 12,
						minorTickStep: 1,
						labels: axisList
					});
					chart1.addAxis("y", {vertical: true, microTickStep: 1});
					chart1.addSeries("Series 1", resultList, {plot: "default", stroke: {color: "blue"}});
					chart1.render();
				}
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

		    hide: function () {
		        domUtils.hide(this.domNode);
		        this.isShowing = false;
		        this.onHide();
		    },

		    resize: function (width, height) {
		        domStyle.set(this._content, {
		            width: width + "px",
		            height: height + "px"
		        });

		        if (this.coords) {
		            this._adjustPosition(this.coords);
		        }
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
		            left = (location.x+40 - width / 2) + "px";
		            top = (location.y - height+55) + "px";
		        }

		        domStyle.set(this.domNode, {
		            left: left,
		            top: top
		        });
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

		return InfoWindow;
});