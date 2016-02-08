/**
 * Профиль продавца
 *
 * TODO Не работает get & merge данных
 */
define([
    "app",
    "bundle/trader/model/profile",
    "text!bundle/trader/view/profile/trader-profile-form.html",
    "backform"
], function (
    App,
    Data,
    containerTpl
) {
    'use strict';
    return App.module("Trader.Profile", function (Profile, App, Backbone, Marionette, $, _) {
        var ButtonControl = Backform.Control.extend({
            defaults: {
                type: "submit",
                label: "Submit",
                status: undefined, // error or success
                message: undefined,
                extraClasses: ["btn btn-primary"]
            },
            template: _.template(['<label class="<%=Backform.controlLabelClassName%>">&nbsp;</label>', '<div class="<%=Backform.controlsClassName%>">', '  <button type="<%=type%>" name="<%=name%>" class="btn <%=extraClasses.join(\' \')%>" <%=disabled ? "disabled" : ""%> ><%=label%></button>', '  <% var cls = ""; if (status == "error") cls = Backform.buttonStatusErrorClassName; if (status == "success") cls = Backform.buttonStatusSuccessClassname; %>', '  <span class="status <%=cls%>"><%=message%></span>', '  <button type="reset" name="Отменить" class="btn <%=extraClasses.join(\' \')%>" <%=disabled ? "disabled" : ""%> >Отменить</button>', '  <span class="status <%=cls%>"><%=message%></span>', '</div>'].join("\n"))
        });
        this.View = Marionette.ItemView.extend({
            template: _.template(containerTpl),
            serializeData: function(){
                return {
                    "registrationDate": "25.12.2014"
                }
            },
            initialize: function () {
                this.model = new Data.Model();
                var self = this;
                this.model.fetch().done(function(){
                    console.log(self.model.toJSON());

                    var form = new Backform.Form({
                        el: self.$("#trader-profile-form"),
                        model: self.model,
                        fields: [{
                            name: "shortName",
                            control: "input",
                            label: "* Наименование юридического лица (краткое)"
                        }, {
                            name: "longName",
                            control: "input",
                            label: "* Наименование юридического лица (полное)"
                        }, {
                            name: "form",
                            label: "* OOO",
                            control: "select",
                            options: [{
                                label: "OOO",
                                value: "OOO"
                            }, {
                                label: "ПАО",
                                value: "ПАО"
                            }, {
                                label: "НПАО",
                                value: "НПАО"
                            }, {
                                label: "ИП",
                                value: "ИП"
                            }]
                        },
                         {
                            name: "itn",
                            control: "input",
                            label: "* ИНН"
                        }, {
                            name: "trc",
                            control: "input",
                            label: "* КПП"
                        }, {
                            name: "psrn",
                            control: "input",
                            label: "* ОГРН"
                        }, {
                            name: "chckAccount",
                            control: "input",
                            label: "* Р/С"
                        }, {
                            name: "corrAccount",
                            control: "input",
                            label: "* КОРРСЧЕТ"
                        }, {
                            name: "bic",
                            control: "input",
                            label: "* БИК"
                        }, {
                            name: "bank",
                            control: "input",
                            label: "* Название банка"
                        }, {
                            name: "legalAddress",
                            control: "input",
                            label: "* Юридический адрес"
                        }, {
                            name: "postalAddress",
                            control: "input",
                            label: "Почтовый адрес"
                        }, {
                            name: "phone",
                            control: "input",
                            label: "* Телефон"
                        }, {
                            name: "generalManager",
                            control: "input",
                            label: "Генеральный директор"
                        }, {
                            name: "contactPerson",
                            control: "input",
                            label: "Контактное лицо"
                        }, {
                            name: "contactPhone",
                            control: "input",
                            label: "Телефон контактно лица"
                        }, {
                            name: "saveBtn",
                            control: ButtonControl,
                            label: "Сохранить",
                            id: "submit"
                        } //,
                            /* { name:"resetBtn", control: ButtonResetControl,  label:"Отмена" , id:"reset"} */
                        ],
                        events: {
                            "submit": function (e) {
                                var submit = form.fields.get("submit");
                                if (this.model.isValid()) {
                                    submit.set({
                                        status: "success",
                                        message: "Success!"
                                    });
                                    this.model.save();
                                } else {
                                    console.log("not valide!");
                                    submit.set({
                                        status: "error",
                                        message: form.model.validationError
                                    });
                                }
                                return false;
                            },
                            "reset": function (e) {
                                console.log("reset!!");
                                this.model.clear().set(this.model.defaults);
                            }
                        }
                    });
                    console.log(form);
                    form.render();

                });
                self.model.on("change", function () {
                    console.log("change" + JSON.stringify(self.model.toJSON(), null, 2));
                }).trigger("change");
            }
        });
    });
});