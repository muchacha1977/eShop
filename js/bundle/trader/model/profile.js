/**
 * TODO Переделать в объект Data.Trader
 */
define(["app"],
    function (App) {
        'use strict';
        return App.module("Data.Trader.Profile", function (Profile, App, Backbone, Marionette, $, _) {


            Profile.Model = Backbone.Model.extend({
                url: "rest/v0/shop/profile",
                defaults: {
                    shopName:"",
                    shortName: "",
                    longName: "",
                    form: "ПАО", // Form of incorporation
                    itn: "",  // individual taxpayer identification number (ИНН)
                    trc: "",  // tax registration code (КПП)
                    psrn: "", // Primary State Registration Number (ОГРН)
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
                    contactPhone: ""
                },
                save: function (){
                    this.sync("create",this,{"url":this.url});
                },
                initialize: function () {
                    console.log(" Data.TraderProfileData :this " + JSON.stringify(this, null, 4));

                },

                filterInt: function (value) {
                    if (/^(\-|\+)?([0-9]+|Infinity)$/.test(value))
                        return Number(value);
                    return NaN;
                },

                validate: function (attributes, options) {
                    this.errorModel.clear();

                    var trcIsFiels = this.get("trc");
                    var shortNameFiels = this.get("shortName");
                    var longNameFiels = this.get("longName");
                    var itnFiels = this.get("itn");
                    var psrnFiels = this.get("psrn");
                    var chckAccountFields = this.get("chckAccount");
                    var corrAccountFields = this.get("corrAccount");
                    var bicFields = this.get("bic");
                    var bankFields = this.get("bank");
                    var phoneFields = this.get("phone");
                    var legalAddressFields = this.get("legalAddress");
                    //get value of dropdown menu
                    var formFields = this.get("form");
                    //var formFieldsValue = formFields.options[formFields.selectedIndex].value;
                    console.log("formFields" + formFields);

                    var isItnFielsInt = this.filterInt(itnFiels, 10);
                    var isPsrnFielsInt = this.filterInt(psrnFiels, 10);
                    var isTrcFielsInt = this.filterInt(trcIsFiels, 10);
                    var isChckAccountFielsInt = this.filterInt(chckAccountFields, 10);
                    var isCorrAccounFielsInt = this.filterInt(corrAccountFields, 10);
                    var isBicFielsInt = this.filterInt(bicFields, 10);
                    var isPhoneFielsInt = this.filterInt(phoneFields, 10);
           

                    if ((shortNameFiels == null) || (shortNameFiels == undefined) || (shortNameFiels == '')) {
                        this.errorModel.set({shortName: "Required Field. Validation errors. Please fix"});
                    }

                    if ((longNameFiels == null) || (longNameFiels == undefined) || (longNameFiels == '')) {
                        this.errorModel.set({longName: "Required Field. Validation errors. Please fix"});
                    }
                    
                    if ((itnFiels == null) || (itnFiels == undefined) || (itnFiels == '') || (isNaN(isItnFielsInt))) //(ИНН)
                    {
                        this.errorModel.set({itn: "Required Field. Validation errors. Please fix"});
                    }
                    if (formFields!="ИП" && itnFiels.length!=10){
                        
                        this.errorModel.set({itn: "Required Field. Validation errors. Value must be 10"});
                    }
                    if(formFields=="ИП" && itnFiels.length!=12){
                        
                        this.errorModel.set({itn: "Required Field. Validation errors. Value must be 12"});
                    }
                    if ((psrnFiels == null) || (psrnFiels == undefined) || (psrnFiels == '') || (isNaN(isPsrnFielsInt))) //(ОГРН)
                    {
                        this.errorModel.set({psrn: "Required Field. Validation errors. Please fix"});
                    }
                    if ((chckAccountFields == null) || (chckAccountFields == undefined) || (chckAccountFields == '') || (isNaN(isChckAccountFielsInt))) //Р/С
                    {
                        this.errorModel.set({chckAccount: "Required Field. Validation errors. Please fix"});
                    }
                    if ((corrAccountFields == null) || (corrAccountFields == undefined) || (corrAccountFields == '') || (isNaN(isCorrAccounFielsInt))) //КОРРСЧЕТ
                    {
                        this.errorModel.set({corrAccount: "Required Field. Validation errors. Please fix"});
                    }
                    if ((bicFields == null) || (bicFields == undefined) || (bicFields == '') || (isNaN(isBicFielsInt)))  //БИК
                    {
                        this.errorModel.set({bic: "Required Field. Validation errors. Please fix"});
                    }
                    if ((bankFields == null) || (bankFields == undefined) || (bankFields == '')) {
                        this.errorModel.set({bank: "Required Field. Validation errors. Please fix"});
                    }
                    if ((legalAddressFields == null) || (legalAddressFields == undefined) || (legalAddressFields == '')) {
                        this.errorModel.set({legalAddress: "Required Field. Validation errors. Please fix"});
                    }
                    if ((phoneFields == null) || (phoneFields == undefined) || (phoneFields == '') || (isNaN(isPhoneFielsInt)))  //Телефон
                    {
                        this.errorModel.set({phone: "Required Field. Validation errors. Please fix"});
                    }
                    if ((trcIsFiels == null) || (trcIsFiels == undefined) || (trcIsFiels == '') || (isNaN(isTrcFielsInt))) //КПП
                    {
                        this.errorModel.set({trc: "Required Field. Validation errors. Please fix"});
                    }
                    if (trcIsFiels.length!=9){
                        this.errorModel.set({trc: "Required Field. Validation errors. Value must be 9"});
                    }
                    if (!_.isEmpty(_.compact(this.errorModel.toJSON())))
                        return "Validation errors. Please fix.";

                }


            });


        });
    }
);
//url: 'rest/v0/shop/profile'


