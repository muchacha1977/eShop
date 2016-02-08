define([
        "app",
        "model/user",
        "moment",
        "text!bundle/buyer/view/profile/profile.html",
        "text!bundle/buyer/view/profile/profile-data.html",
        "text!bundle/buyer/view/profile/profile-data-elem.html",
        "text!bundle/buyer/view/profile/profile-data-elem-span.html",
        "text!view/btn-change.html",
        "text!view/btnGroup-sex.html"
    ],
    function (
        App,
        Data,
        Moment,
        buyerProfileTpl,
        buyerProfileDataTpl,
        buyerProfileItemDataTpl,
        buyerProfileItemDataSpanTpl,
        btnChangeTpl,
        btnGrSexTpl
    ) {
        App.module("BuyerProfile", function (BuyerProfile, App, Backbone, Marionette, $, _) {


            //Модель общих данных покупателя
            var BuyerProperty = Backbone.Model.extend(
                {
                    defaults: {
                        firstName: "",
                        lastName: "",
                        nickname: "",
                        phone: "",
                        email: "",
                        referer: ""
                    },
                    initialize: function () {
                        this.on("change", this.onChangeModel);
                    },
                    url: "rest/v0/buyer/profile",

                    onChangeModel: function () {
                        BuyerProfile.fillInput(this, "#buyer-profile-data");

                    },
                    validate: function (attrs, options) {

                    },
                    saveModel: function (attr, options) {
                        advOptions = {success: this.successSave, error: this.errorSave};
                        _.extend(options, advOptions);
                        this.model.save(attr, options);
                    },
                    successSave: function (model, response, options) {
                        console.log("success");
                        console.log(response);
                    },
                    errorSave: function (model, xhr, options) {
                        console.log("error");
                        console.log(xhr);
                    }
                }
            );

            //Модель реквизитов платежа
            var BuyerPaymentDetails = Backbone.Model.extend(
                {
                    defaults: {
                        cardHolder: "",
                        cardNumber: "",
                        bic: "",
                        account: ""
                    },
                    initialize: function () {
                        this.on("change", this.onChangeModel);
                    },
                    url: "rest/v0/buyer/account",

                    onChangeModel: function () {
                        BuyerProfile.fillInput(this, "#buyer-paymentDetails");

                    }

                }
            );

            // Модель персональных данных(паспортных) покупателя
            var BuyerPersonalData = Backbone.Model.extend(
                {
                    defaults: {
                        firstName: "",
                        middleName: "",
                        lastName: "",
                        bornDate: "",
                        issueDate: "",
                        issuer: "",
                        number: "",
                        series: "",
                        sex: "M" //F - female, M-male
                    },
                    initialize: function () {
                        this.on("change", this.onChangeModel);
                    },
                    url: "rest/v0/buyer/identification",

                    onChangeModel: function () {
                        BuyerProfile.fillInput(this, "#buyer-personalData");

                    }

                }
            );

            // Эксземпляры данных выше перечисленных моделей
            var buyerProperty = new BuyerProperty();

            var buyerPaymentDetails = new BuyerPaymentDetails();

            var buyerPersonalData = new BuyerPersonalData();

            // Главный контейнер модуля
            BuyerProfile.ContainerView = Marionette.LayoutView.extend({

                initialize: function (subTab) {
                    this.subTab = subTab;
                },

                serializeData: function(){
                    return {
                        "registrationDate": "25.12.2014"
                    }
                },

                template: _.template(buyerProfileTpl),

                regions: {
                    profileDataRegion: "#buyer-profile-data",
                    profileBtnRegion: "#buyer-profile-btn",
                    personalDataRegion: "#buyer-personalData",
                    personalDataBtnRegion: "#buyer-personalData-btn",
                    paymentDetailsRegion: "#buyer-paymentDetails",
                    paymentDetailsBtnRegion: "#buyer-paymentDetails-btn"
                },
                events: {
                    "show.bs.collapse #collapseBuyerProfileDataRow": "onCollapseShow",
                    "show.bs.collapse #collapseBuyerPaymentDetails": "onCollapseShow",
                    "show.bs.collapse #collapseBuyerPersonalData": "onCollapseShow",
                    "hide.bs.collapse #collapseBuyerProfileDataRow": "onCollapseHide",
                    "hide.bs.collapse #collapseBuyerPaymentDetails": "onCollapseHide",
                    "hide.bs.collapse #collapseBuyerPersonalData": "onCollapseHide"
                },
                onCollapseShow: function (e) {
                    refreshDataModel(e.target.id);
                    this.$("#" + e.target.id + "Handle").removeClass("fa-chevron-circle-right").addClass("fa-chevron-circle-down");
                    var modelHash = getModelHash(e.target.id);
                    BuyerProfile.fillInput(modelHash.model, modelHash.hash);
                },
                onCollapseHide: function (e) {
                    this.$("#" + e.target.id + "Handle").removeClass("fa-chevron-circle-down").addClass("fa-chevron-circle-right");
                },


                onShow: function () {
                    this.render();
                    this.profileDataRegion.show(new DataView({collection: profileData}));
                    this.profileBtnRegion.show(new BtnCollectionView({collection: profileDataBtnCollection}));
                    this.personalDataRegion.show(new DataView({collection: personalData}));
                    this.personalDataBtnRegion.show(new BtnCollectionView({
                        collection: personalDataBtnCollection,
                        col: 8,
                        colOffset: 4
                    }));
                    this.paymentDetailsRegion.show(new DataView({collection: bankAccountData}));
                    this.paymentDetailsBtnRegion.show(new BtnCollectionView({collection: paymentDetailBtnCollection}));
                    this.$("#collapseBuyerProfileDataRowHandle").trigger("click");
                }

            });

            var DataItem = Backbone.Model.extend({
                defaults: {
                    col_width_btn: 0,
                    col_width_label: 3,
                    readonly: false,
                    mask: "",
                    autoclear: false,
                    col_width_label: 3,
                    template: undefined

                }
            });

            var DataCollection = Backbone.Collection.extend({
                model: DataItem
            });

            var profileData = new DataCollection([
                {
                    nameid: "nickname",
                    titleid: "Ник",
                    placeholder: "Введите имя для сайта, которое будет демонстрироваться в бонусных и реферальных программах",
                    col_width: 6,
                    holder: "profile"
                },
                {nameid: "firstName", titleid: "Имя", placeholder: "Иван", col_width: 6, holder: "profile"},
                {
                    nameid: "lastName",
                    titleid: "Фамилия",
                    placeholder: "Иванов",
                    col_width: 6,
                    holder: "profile"
                },

                {
                    nameid: "email",
                    titleid: "e-mail",
                    placeholder: "Адрес электронной почты",
                    col_width: 6,
                    holder: "profile"
                },
                {
                    nameid: "phone",
                    titleid: "Телефон",
                    placeholder: "+79111234567",
                    col_width: 6,
                    holder: "profile",
                    mask: "+ 999999999999"
                },
                {
                    nameid: "referer",
                    titleid: "Меня привел",
                    placeholder: "Ник моего друга",
                    col_width: 6,
                    readonly: true,
                    holder: "profile"
                }
            ]);

            var bankAccountData = new DataCollection([
                {
                    nameid: "cardNumber",
                    titleid: "№ карты",
                    placeholder: "0000 0000 0000 0000 000",
                    col_width: 6,
                    holder: "paymentdetails",
                    mask: "9999 9999 9999 9999 999",
                    autoclear: false
                },
                {
                    nameid: "cardHolder",
                    titleid: "Владелец карты",
                    placeholder: "CARD HOLDER",
                    col_width: 6,
                    holder: "paymentdetails",
                    mask: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
                },
                {
                    nameid: "bic",
                    titleid: "БИК",
                    placeholder: "44021345",
                    col_width: 6,
                    holder: "paymentdetails",
                    mask: "999999999"
                },
                {
                    nameid: "account",
                    titleid: "Рассчетный счет",
                    placeholder: "321000000000000021",
                    col_width: 6,
                    holder: "paymentdetails",
                    mask: "99999999999999999999"
                }
            ]);

            var personalData = new DataCollection([
                {
                    nameid: "firstName",
                    titleid: "Имя",
                    placeholder: "Иван",
                    col_width: 8,
                    col_width_label: 4,
                    holder: "personaldata"
                },
                {
                    nameid: "middleName",
                    titleid: "Отчество",
                    placeholder: "Иванович",
                    col_width: 8,
                    col_width_label: 4,
                    holder: "personaldata"
                },
                {
                    nameid: "lastName",
                    titleid: "Фамилия",
                    placeholder: "Иванов",
                    col_width: 8,
                    col_width_label: 4,
                    holder: "personaldata"
                },
                {
                    nameid: "bornDate",
                    titleid: "Дата рождения",
                    placeholder: "01.01.1970",
                    col_width: 8,
                    col_width_label: 4,
                    holder: "personaldata",
                    mask: "99.99.9999"
                },
                {
                    nameid: "sex",
                    titleid: "Пол",
                    placeholder: "М или Ж",
                    col_width: 8,
                    col_width_label: 4,
                    template: btnGrSexTpl,
                    holder: "personaldata"
                },
                {
                    nameid: "series",
                    titleid: "Серия паспорта",
                    placeholder: "4504",
                    col_width: 8,
                    col_width_label: 4,
                    holder: "personaldata"
                },
                {
                    nameid: "number",
                    titleid: "Номер паспорта",
                    placeholder: "123456",
                    col_width: 8,
                    col_width_label: 4,
                    holder: "personaldata"
                },
                {
                    nameid: "issuer",
                    titleid: "Кем выдан",
                    placeholder: "Паспортным столом №2 ОВД \"Пятницкий\" г.Москвы",
                    col_width: 8,
                    col_width_label: 4,
                    holder: "personaldata"
                },
                {
                    nameid: "issueDate",
                    titleid: "Когда выдан",
                    placeholder: "10.01.2002",
                    col_width: 8,
                    col_width_label: 4,
                    holder: "personaldata",
                    mask: "99.99.9999"
                }
            ]);

            var DataItemView = Marionette.ItemView.extend({
                tagName: "div",
                events: {
                    "change :input": "onChangeInput",
                    "click :button": "onPressButton"
                },
                render: function () {
                    if (this.model.get("readonly")) {
                        this.template = _.template(buyerProfileItemDataSpanTpl);
                    } else if (this.model.get("template") !== undefined) {
                        this.template = _.template(this.model.get("template"));
                    } else {
                        this.template = _.template(buyerProfileItemDataTpl);
                    }
                    ;
                    var templ = this.template(this.model.attributes);
                    this.$el.html(templ);
                    return this;
                },
                onShow: function () {
                    fillMask(this.model, this.el);
                }
                ,
                onChangeInput: function () {
                    var attr = this.$el.find(":input")[0];
                    var nameAttr = attr.id;
                    var value = attr.value;
                    this.changeValue(nameAttr, value);
                },
                onPressButton: function (e) {
                    if (e.currentTarget.id == "sex-male") {
                        nameAttr = 'sex';
                        value='M';
                        this.changeValue(nameAttr,value);
                    };
                    if (e.currentTarget.id == "sex-female") {
                        nameAttr = 'sex';
                        value='F';
                        this.changeValue(nameAttr,value);
                    };
                },
                changeValue: function (nameAttr, value) {
                    var modelHash = getModelHash(this.model.get("holder"));
                    var oldvalue = modelHash.model.get(nameAttr);
                    //Приведем значение в поле ввода к тому которое необходимо для записи
                    var formatValue = formatInputValue(nameAttr, value);
                    if (oldvalue !== formatValue) modelHash.model.set(nameAttr, formatValue);
                }
            });

            var DataView = Marionette.CompositeView.extend({
                template: _.template(buyerProfileDataTpl),
                childView: DataItemView,
                childViewContainer: "div"
            });

            var BtnItem = Backbone.Model.extend({
                defaults: {
                    col_width_btn: 4
                }
            });

            var BtnCollection = Backbone.Collection.extend({
                model: BtnItem
            });

            var profileDataBtnCollection = new BtnCollection([
                {btn_name: "btn_save", btn_title: "Сохранить"},
                {btn_name: "btn_refresh", btn_title: "Обновить"},
                {btn_name: "btn_change_password", btn_title: "Изменить пароль"}
            ]);

            var paymentDetailBtnCollection = new BtnCollection([
                {btn_name: "btn_save_paymentDetails", btn_title: "Сохранить"},
                {btn_name: "btn_refresh_paymentDetails", btn_title: "Обновить"}
            ]);

            var personalDataBtnCollection = new BtnCollection([
                {btn_name: "btn_save_personalData", btn_title: "Сохранить"},
                {btn_name: "btn_refresh_personalData", btn_title: "Обновить"},
                {btn_name: "btn_scan_personalData", btn_title: "Загрузить скан"}
            ]);

            var BtnView = Marionette.ItemView.extend({
                tagName: "div",
                template: _.template(btnChangeTpl),
                initialize: function () {
                    this.el.className = " col-xs-" + this.model.get("col_width_btn") + " col-sm-" + this.model.get("col_width_btn") + " text-center";
                },
                events: {
                    "click #btn_change_password": "changePassword",
                    "click #btn_save": "saveBuyerProperty",
                    "click #btn_refresh": "refreshBuyerProperty",
                    "click #btn_save_paymentDetails": "saveBuyerPaymentDetails",
                    "click #btn_refresh_paymentDetails": "refreshBuyerPaymentDetails",
                    "click #btn_save_personalData": "saveBuyerPersonalData",
                    "click #btn_refresh_personalData": "refreshBuyerPersonalData"
                },
                changePassword: function () {
                    require(["bundle/buyer/password"],
                        function (ChangePassword) {
                            var dlg = new ChangePassword.View();
                            App.getRegion("dialogRegion").show(dlg);
                        }
                    )
                },
                saveBuyerProperty: function () {
                    if (buyerProperty.changed) {
                        buyerProperty.save();
                    } else {
                        refreshDataView("profile");
                    }
                    ;
                },
                refreshBuyerProperty: function () {
                    buyerProperty.fetch();
                    if (!buyerProperty.changed) {
                        refreshDataView("profile");
                    }
                },
                saveBuyerPaymentDetails: function () {
                    if (buyerPaymentDetails.changed) {
                        buyerPaymentDetails.save();
                    } else {
                        refreshDataView("buyerPaymentDetails");
                    }
                    ;
                },
                refreshBuyerPaymentDetails: function () {
                    buyerPaymentDetails.fetch();
                    if (!buyerPaymentDetails.changed) {
                        refreshDataView("paymentdetails");
                    }
                },
                saveBuyerPersonalData: function () {
                    if (buyerPersonalData.changed) {
                        buyerPersonalData.save();
                    } else {
                        refreshDataView("buyerPersonalData");
                    }
                    ;
                },
                refreshBuyerPersonalData: function () {
                    buyerPersonalData.fetch();
                    if (!buyerPersonalData.changed) {
                        refreshDataView("buyerPersonalData");
                    }

                }


            });

            var BtnCollectionView = Marionette.CompositeView.extend({
                initialize: function (obj) {

                    (obj.colOffset == undefined) ? this.colOffset = 3 : this.colOffset = obj.colOffset;
                    (obj.col == undefined) ? this.col = 6 : this.col = obj.col;
                    this.el.className = "form-group";
                    this.template = _.template("<div  class=\"col-sm-offset-" + this.colOffset + " col-sm-" + this.col + "\"></div>");
                },
                childView: BtnView,
                childViewContainer: "div"

            });

            // Функция для обновления модели данных одного из разделов
            //  textElement - строка в которой присутсвует селектор для выбора модели
            var refreshDataModel = function (textElement) {
                var selector = textElement.toLowerCase();
                if (selector.indexOf("profile") != -1) buyerProperty.fetch();
                if (selector.indexOf("personaldata") != -1) buyerPersonalData.fetch();
                if (selector.indexOf("paymentdetails") != -1) buyerPaymentDetails.fetch();
            };

            var refreshDataView = function (text) {
                var modelHash = getModelHash(text);
                BuyerProfile.fillInput(modelHash.model, modelHash.hash);
            }

            var getModelHash = function (text) {
                var selector = text.toLowerCase();
                if (selector.indexOf("profile") != -1) return {model: buyerProperty, hash: "#buyer-profile-data"};
                if (selector.indexOf("personaldata") != -1) return {
                    model: buyerPersonalData,
                    hash: "#buyer-personalData"
                };
                if (selector.indexOf("paymentdetails") != -1) return {
                    model: buyerPaymentDetails,
                    hash: "#buyer-paymentDetails"
                };

            };
            //присвоение масок на поля ввода, будем использовать свойства моделей вью
            // mask -
            var fillMask = function (model, hash) {
                var arrayInputs = $(hash).find("input");
                arrayInputs.mask(model.get("mask"), {autoclear: model.get("autoclear"), placeholder: " "});
                arrayInputs.placeholder = "";
            };

            var formatInputValue = function (name, value) {
                var result = "";
                if (name=="cardNumber") {
                    var re = / |_+/g;
                    result = value.replace(re, "").trim();
                }
                    else if (name.toLowerCase().indexOf('date')>-1) {
                    result = Moment(value, "DD-MM-YYYYTHH:mm:ss").toISOString();//value.substring(7,10)+'-'+value.substring(4,5)+'-'+value.substring(1,2)+'T00:00:00.0000';
                }else {
                    result = value;
                }
                return result;
            };

            BuyerProfile.fillInput = function (model, hash) {
                var inputsElems = $(hash).find("input");
                inputsElems.each(function () {
                    if (this.id.toLowerCase().indexOf('date')>-1) {
                        tsData = Moment(model.get(this.id),"DD.MM.YYYY");
                        if (tsData.isValid()){
                            this.value = tsData;
                        }

                    } else {
                        this.value = model.get(this.id);
                    }
                });
                var spansElems = $(hash).find("span");
                spansElems.each(function () {
                    this.textContent = model.get(this.id);
                });
                if (model.get("sex")) {
                    var buttonsElems = $(hash).find("button");

                    buttonsElems.each(function () {
                            if (this.id == "sex-male") {
                                if (model.get("sex") == "M") {
                                    $(this).addClass("btn-primary")
                                }
                                else {
                                    $(this).removeClass("btn-primary")
                                }
                                ;
                            }
                            ;
                            if (this.id == "sex-female") {
                                if (model.get("sex") == "F") {
                                    $(this).addClass("btn-primary")
                                }
                                else {
                                    $(this).removeClass("btn-primary")
                                }
                                ;
                            }
                            ;

                        }
                    );
                }
            };

            BuyerProfile.onStart = function () {

                console.log("buyer BuyerProfile view started");
            };

            BuyerProfile.onStop = function () {
                console.log("buyer BuyerProfile view stopped");
            };
        });


        return App.BuyerProfile;
    });