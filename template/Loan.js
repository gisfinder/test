define("loan/LoanInput", [ "dojo", "dijit", "dijit/_Widget",
    "dijit/_TemplatedMixin", "dijit/_WidgetsInTemplateMixin", "dijit/form/CurrencyTextBox", "dijit/form/NumberSpinner", "dijit/form/ComboBox",
    "dojo/text!loan/templates/LoanInput.html" ], function(dojo, dijit,
                                                          _Widget, _TemplatedMixin, _WidgetsInTemplateMixin, CurrencyTextBox, NumberSpinner, ComboBox) {
    dojo.declare("loan.LoanInput", [ dijit._Widget, dijit._TemplatedMixin,
        dijit._WidgetsInTemplateMixin ], {
        // Path to the template
        templateString : dojo.cache("loan", "templates/LoanInput.html"),
        principal: 0,
        interestPaid: 0,
        monthlyPayment: 0,

        // Override this method to perform custom behavior during dijit construction.
        // Common operations for constructor:
        // 1) Initialize non-primitive types (i.e. objects and arrays)
        // 2) Add additional properties needed by succeeding lifecycle methods
        constructor : function() {

        },

        // When this method is called, all variables inherited from superclasses are 'mixed in'.
        // Common operations for postMixInProperties
        // 1) Modify or assign values for widget property variables defined in the template HTML file
        postMixInProperties : function() {
        },

        // postCreate() is called after buildRendering().  This is useful to override when
        // you need to access and/or manipulate DOM nodes included with your widget.
        // DOM nodes and widgets with the dojoAttachPoint attribute specified can now be directly
        // accessed as fields on "this".
        // Common operations for postCreate
        // 1) Access and manipulate DOM nodes created in buildRendering()
        // 2) Add new DOM nodes or widgets
        postCreate : function() {
        },
        //this function will perform the calculations for our loan payment
        calculate: function() {
            this.principal = this.amount.attr('value');
            if(this.principal == NaN) {
                this.monthlyPayment = 0;
                this.principal = 0;
                this.interestPaid = 0;
            } else {
                var interestRate = this.rate.attr('value') / 1200;
                var termInMonths = this.term.attr('value') * 12;

                this.monthlyPayment = Math.pow(1 + interestRate, termInMonths) - 1;
                this.monthlyPayment = interestRate + (interestRate / this.monthlyPayment);
                this.monthlyPayment = this.monthlyPayment * this.principal;

                this.interestPaid = (this.monthlyPayment * termInMonths) - this.principal;
            }
        }
    });
});