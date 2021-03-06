define([
    "dojo/_base/declare",
    "dijit/_WidgetBase",
 //  "dijit/_OnDijitClickMixin",
    "dijit/_TemplatedMixin",
    'dijit/_WidgetsInTemplateMixin',
    "dojo/text!./demo/templates/SomeWidget.html"
],function(declare, _WidgetBase, /*_OnDijitClickMixin,*/ _TemplatedMixin,_WidgetsInTemplateMixin, template){

    return declare( [_WidgetBase, /* _OnDijitClickMixin,*/ _TemplatedMixin,_WidgetsInTemplateMixin], {
        //	set our template
        templateString: template,

        //	some properties
       // baseClass: "someWidget",
        title: "",	//	we'll set this from the widget def

        //	hidden counter
        _counter: 1,
        _firstClicked: false,

        //	define an onClick handler
        _onClick: function(){
            if(this._firstClicked){
                this.titleNode.innerHTML = this.title + " was clicked " + (++this._counter) + " times.";
            } else {
                this.titleNode.innerHTML = this.title + " was clicked!";
                this._firstClicked = true;
            }
        },
        _btnOnClick:function(){
            alert("button click");
        },
        _sOnClick:function(){
            alert("in dijitButton");
            this.dijiButton.innerHTML="hello";
        },
        testFunc:function(){
            alert("exe test");
        },
        postCreate: function(){
            this.titleNode.innerHTML = this.title;
        }

    });
});