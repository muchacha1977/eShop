define(["app",
        "backform",
        "bundle/trader/model/site",
        "text!bundle/trader/view/site/site.html",
		
        "lib/fileuploader/vendor/jquery.ui.widget",
        "lib/fileuploader/jquery.iframe-transport",
        "lib/fileuploader/jquery.fileupload"
    ],
    function (App,
              Backform,
              Data,
              containerTpl) {
        'use strict';
        App.module("Site", function (Site, App, Backbone, Marionette, $, _) {


            var LabelControl = Backform.Control.extend({
                defaults: {
                    label: "",
                    help: ""
                },
                template: _.template([
                    '<label class="<%=Backform.controlLabelClassName%>"><%= label %></label>',
                    '<div class="<%=Backform.controlsClassName%>" style="padding-top: 5px;"><%= help %></div>'
                ].join("\n"))
            });

			var ButtonResetControl = Backform.Control.extend({ 
				defaults: {
				type: "submit",
				label: "Submit",
                status: undefined, // error or success
                message: undefined,
                extraClasses: ["btn btn-primary"]
              },
              template: _.template([
                '<label class="<%=Backform.controlLabelClassName%>">&nbsp;</label>',
                '<div class="<%=Backform.controlsClassName%>">',
                '  <button type="<%=type%>" name="<%=name%>" class="btn <%=extraClasses.join(\' \')%>" <%=disabled ? "disabled" : ""%> ><%=label%></button>',
                '  <% var cls = ""; if (status == "error") cls = Backform.buttonStatusErrorClassName; if (status == "success") cls = Backform.buttonStatusSuccessClassname; %>',
                '  <span class="status <%=cls%>"><%=message%></span>' ,
                '  <button type="reset" name="Отменить" class="btn <%=extraClasses.join(\' \')%>" <%=disabled ? "disabled" : ""%> >Отменить</button>',
                '  <span class="status <%=cls%>"><%=message%></span>',    
                '</div>'
                ].join("\n"))
            });
 

            this.View = Marionette.ItemView.extend({
                template: _.template(containerTpl),

                ui: {
                    uploadInput: '#fileUploadInput',
                    logoImg: '.js-logo'
                },

                initialize: function(){
                    var self = this;
                    this.model = new Data.Model();
                    this.model.fetch().done(function(){
                        console.log(self.model.toJSON());
                        var form = new Backform.Form({
                            el: self.$("#trader-site-form"),

                            model: self.model,

                            fields: [
                                { name:"genDescription", control: "textarea", label:"Краткое описание" },
                                { label:"Условия доставки", control: LabelControl },
                                { label:"Экспресс доставка", control: LabelControl, help:"<span class=\"fa fa-male\"> </span>" },
                                { name:"shipmentType1.active", control: "checkbox", label:"Активно" },
                                { name:"shipmentType1.description", control: "input", label:"Описание" },
                                { name:"shipmentType1.price", control: "input", label:"Цена" },
                                { name:"shipmentType1.days", control: "input", label:"Время доставки (дни)" },
                                {                            control: Backform.SpacerControl },
                                { label:"Доставка в течении 3-х дней", control: LabelControl, help:"<span class=\"fa fa-truck\"> </span>" },
                                { name:"shipmentType2.active", control: "checkbox", label:"Активно" },

                                { name:"shipmentType2.description", control: "input", label:"Описание" },
                                { name:"shipmentType2.price", control: "input", label:"Цена" },
                                { name:"shipmentType2.days", control: "input", label:"Время доставки (дни)" },
                                {                            control: Backform.SpacerControl },
                                { label:"Доставка почтой", control: LabelControl, help:"<span class=\"fa fa-envelope-o\"> </span>" },
                                { name:"shipmentType3.active", control: "checkbox", label:"Активно" },
                                { name:"shipmentType3.description", control: "input", label:"Описание" },
                                { name:"shipmentType3.price", control: "input", label:"Цена" },
                                { name:"shipmentType3.days", control: "input", label:"Время доставки (дни)" },
                                {                            control: Backform.SpacerControl },
                                { label:"Доставка в точку самозабора (?)", control: LabelControl, help:"<span class=\"fa fa-upload\"> </span>" },
                                { name:"shipmentType4.active", control: "checkbox", label:"Активно" },
                                { name:"shipmentType4.description", control: "input", label:"Описание" },
                                { name:"shipmentType4.price", control: "input", label:"Цена" },
                                { name:"shipmentType4.days", control: "input", label:"Время доставки (дни)" },
                                {                            control: Backform.SpacerControl },
                                { label:"Самовывоз", control: LabelControl, help:"<span class=\"fa fa-suitcase\"> </span>" },
                                { name:"shipmentType5.active", control: "checkbox", label:"Активно" },
                                { name:"shipmentType5.description", control: "input", label:"Описание" },
                                { name:"shipmentType5.price", control: "input", label:"Цена" },
                                { name:"shipmentType5.days", control: "input", label:"Время доставки (дни)" },
                                {                            control: Backform.SpacerControl },
                                { name:"auxDescription", control: "textarea",  label:"Условия возврата и оплаты" },
                                { name:"saveBtn", control: ButtonResetControl,  label:"Сохранить" ,id:"submit"}
                            ],

                            events: {
                                "submit": function(e) {
                                    this.model.unset('id');
                                    console.log("model "+  JSON.stringify(self.model, null, 4) );
                                    this.model.save().done(function(result) {
                                        console.log("Successful!" + JSON.stringify(result, null, 4));
                                    }).fail(function(error) {
                                        console.log("Error" + JSON.stringify(error, null, 4));
                                    });
                                    return false;
                                },
                                "reset" : function(e){
                                    this.model.customCleanNestedModell();
                                    console.log("reset this.model" + JSON.stringify(this.model, null, 4));

                                }
                            }
                        });
                        form.render();
                    });
                },

                onShow: function() {
                    this._refreshImg();

                    this._fileUpload();
                },

                _refreshImg: function() {
                    this.ui.logoImg.attr('src', 'rest/v0/shop/logo?t=' + Data.user.get("token") + '&time=' + new Date().getTime());
                },

                _fileUpload: function() {
					console.log(this.ui.uploadInput);
                    this.ui.uploadInput.fileupload({
                        url: 'rest/v0/shop/logo',
                        add: function (e, data) {
                            data.submit();
                        },
                        done: this._onFileUploadSuccess,
                        fail: this._onFileUploadFail
                    });
                },

                _onFileUploadSuccess: function(e, data) {
                    require(["bundle/modal/modal"], function (Modal) {
                        if (data._response.jqXHR.status == 200) {
                            this._refreshImg();
                            new Modal.View({
                                text: '<h5>Файл был успешно загружен на сервер</h5>',
                                _template: "message",
                                _static: false
                            });

                        } else {
                            new Modal.View({
                                text: '<h5>Файл не был загружен на сервер</h5>',
                                _template: "message",
                                _static: false
                            });
                        }
                    }.bind(this));
                },

                _onFileUploadFail: function(e, data) {
                    require(["bundle/modal/modal"], function (Modal) {
                            var responseJSON = data.response().jqXHR.responseJSON || {};
                            var errMessage = responseJSON.message || data.errorThrown;
                            new Modal.View({
                                text: '<h5>Файл не был загружен (' + errMessage + ')</h5>',
                                _template: "message",
                                _static: false
                            });
                        }
                    );
                }

            });

        });

        return App.Site;
    }
);
