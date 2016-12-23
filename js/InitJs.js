/**
 * Created by chu.baohua on 2016/5/30.
 */
  define(["dojo/aspect","dojo/on","dojo/dom", "dojo/store/Memory","dijit/registry",  "dojo/parser"],function(aspect,on,dom,Memory,registry,parser){
        parser.parse();
        var clicked=false;
        console.log("here");
        var myButton=dom.byId("mybutton");
        var myTitlePane=registry.byId("test1");

        on(myButton, "click", function(e) {

            var t=registry.byId("fruit");
            var myTitlePane=registry.byId("test1");
            var subStationList = new Memory();



            aspect.after(myTitlePane, "toggle", function() {
                if( clicked!=true){
                    subStationList.setData(initialize());
                    t.set("store",subStationList);
                    t.set("searchAtt","LABEL");
                    t.set("value","");
                    //  initialize();
                    clicked=true;
                }
                else
                //   initialize();
                    clicked=true;

            });

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
            //  var dArray=new Array();
            //   dArray.push({name:"1", id:"1"});
            //    dArray.push({name:"2", id:"2"});
            //  stateStore.setData(dArray);
            //  t.set("store",stateStore);
            //   t.set("searchAtt","name");
            //   t.set("value","");
        });



    });
