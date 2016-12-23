define([ 'dojo/_base/declare', 'dijit/_WidgetBase', "dijit/_TemplatedMixin","dojo/text!./substation/Substation.html"],
    function(declare,BaseWidget,TemplateMixedin,SubstationTemplate){
        return declare([BaseWidget,TemplateMixedin],{
            templateString:SubstationTemplate


        })
    }



)