define(["app"], function(App) {
    return App.module("Data", function(Data, App, Backbone, Marionette, $, _) {

        var Shop = Backbone.Model.extend({

            defaults: {
                shortName: "",
                longName: "",
                form: "",
                itn: "",
                trc: "",
                psrn: "",
                chckAccount: "",
                corrAccount: "",
                bic: "",
                bank: "",
                legalAddress: "",
                postalAddress: "",
                phone: "",
                generalManager: "",
                chiefAccountant: "",
                contactPerson: "",
                contactPhone: "",
                id: null       
            },

            url: function () {
            	return 'rest/v0/shop/profile' + this.get('id');
            }
        });
        
        Data.Shop = new Shop();
    });
});