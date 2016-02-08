define(["app"],
    function (App) {
        'use strict';
        return App.module("Data.Trader.Site", function (Site, App, Backbone, Marionette, $, _) {
            Site.Model = Backbone.Model.extend({
                url: "rest/v0/shop/site",
                defaults: {
                        genDescription:"Go Go",
                        auxDescription:"Go Go",
                        shipmentType1:
             
                        {
                             type:"SHIPMENT_TYPE_1",
                             active:false,
                             days:1,
                             price:300.00,
                             description:"we"
                        },
                        shipmentType2:
                        {
                            type:"SHIPMENT_TYPE_2",
                            active:false,
                            days:2,
                            price:250.00,
                            description:"we"
                        },
                        shipmentType3:
                        {
                            type:"SHIPMENT_TYPE_3",
                            active:false,
                            days:3,
                            price:400.00,
                            description:"we"
                        },
                        shipmentType4:{
                            type:"SHIPMENT_TYPE_4",
                            active:false,
                            days:4,
                            price:1000.00,
                            description:"we"
                        },
                        shipmentType5:
                        {
                            type:"SHIPMENT_TYPE_5",
                            active:false,
                            days:6,
                            price:500.00,
                            description:"we"
                        }

                },
                customCleanNestedModell: function() {
                 var _genDescription=this.get('genDescription');
                 var _auxDescription=this.get('auxDescription');
                    _genDescription="";
                    _auxDescription="";
                    this.set('genDescription',_genDescription);  
                    this.set('auxDescription',_auxDescription);    
                var _shipType1=_.omit(this.get('shipmentType1'));
                    _shipType1.days ="";
                    _shipType1.active ="";
                    _shipType1.price ="";
                    _shipType1.description ="";
                    this.set('shipmentType1',_shipType1);
                var _shipType2=_.omit(this.get('shipmentType2'));
                    _shipType2.days ="";
                    _shipType2.active ="";
                    _shipType2.price ="";
                    _shipType2.description ="";
                    this.set('shipmentType2',_shipType2);
                var _shipType3=_.omit(this.get('shipmentType3'));
                    _shipType3.days ="";
                    _shipType3.active ="";
                    _shipType3.price ="";
                    _shipType3.description ="";
                    this.set('shipmentType3',_shipType3);   
                var _shipType4=_.omit(this.get('shipmentType4'));
                    _shipType4.days ="";
                    _shipType4.active ="";
                    _shipType4.price ="";
                    _shipType4.description ="";
                    this.set('shipmentType4',_shipType4);  
                var _shipType5=_.omit(this.get('shipmentType5'));
                    _shipType5.days ="";
                    _shipType5.active ="";
                    _shipType5.price ="";
                    _shipType5.description ="";
                    this.set('shipmentType5',_shipType5);  
                    return this;
                },

            });

           
        });
    }
);
