define([
    'dojo/_base/declare',
    'dijit/_WidgetBase',
   'dijit/_TemplatedMixin',
    'dijit/_WidgetsInTemplateMixin',
    'dojo/text!app/js/substation/test.html'
], function (declare, _WidgetBase, _TemplatedMixin,_WidgetsInTemplateMixin,testTemplate) {
    return declare([_WidgetBase,_TemplatedMixin, _WidgetsInTemplateMixin], {
        templateString: testTemplate
    })
} )
