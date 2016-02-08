/**
 * Trader v.0.0.7
 */

define([
    "app",
    "text!bundle/authentication/view/producer-login/container.html",
], function(
    App,
    containerTpl
){
    'use strict';
    return App.module("Authentication.ProducerLogin", function(Authentication, App, Backbone, Marionette, $, _) {
		this.View = Marionette.LayoutView.extend({
			template: containerTpl,
			events: {
				'click #producerLoginBtn': "loginSubmit"
			},
			_bulk: function() {
				require(["bundle/modal/modal"],
                    function (Modal) {
                        new Modal.View({text: "Функционал в разработке", _template: "message", _static: false});
                    }
                );
                return false;
			},
			loginSubmit: function(e) {
                    var self = this;
                    var form = this.$("form");

                    var url = "rest/v0/user/login";
                    var data = this.formToJson(form);
                    data = JSON.parse(data);
                    if ( data.name.charAt(0) == "+" ){
                        data.name = data.name.substr(1);
                    }
                    data = JSON.stringify(data);
                    console.log(data);

                    $.ajax({
                        url : url,
                        type : "POST",
                        headers: {"Content-Type" : "application/json"},
                        dataType : "json",
                        data : data,
                        success : function (data) {
                            self.onSuccess(data);
                        },
                        error : function(xhr, status, thrown) {
                            self.onError(xhr.status, xhr.responseText)
                        }
                    });

                    return false;
                },
				
			onSuccess: function(data) {
                    console.log("user data: " + JSON.stringify(data));
                    App.User.set(data);
					if(App.User.isProducer()) { // TODO: Это нужно делать только при первом входе
						App.navigate('producer', true);
						require(["bundle/buyer/password"],
							function (ChangePassword) {
								var dlg = new ChangePassword.View();
								App.getRegion("dialogRegion").show(dlg);
							}
						);
					}
                    this.trigger("dialog:hide");
                },

			onError: function(status, data) {
				var that = this;
				switch(status) {
					case 400:
						try {
							var r = JSON.parse(data);
							var msg = [];
							r.forEach(function(er) {
								msg.push(er.message);
								try {
									var i = er.path.lastIndexOf(".");
									var name = er.path.substring(i + 1);
									var inp = that.$("input[name='" + name + "']")[0];
								} catch (ex) {
									console.log(ex);
								}
						   });
							alert(msg.join());
						} catch (ex) {
							console.log(ex);
						}
						break;
					case 403:
						this.ui.status.show();
						break;
					default:
						alert("ошибка сервера:  " + status);
				}
			},
			formToJson: function (form){
				var data = {};
				$(form).find("input")
					//.filter(":visible")
					.filter(":enabled")
					.each(function(i, inp) {
						switch (inp.type) {
							case "radio":
								if (inp.checked) {
									data[inp.name] = inp.value;
								}
								break;
							case "checkbox":
								data[inp.name] = inp.checked;
								break;
							case "button":
								break;
							default:
								data[inp.name] = inp.value;
						}
					});
				return JSON.stringify(data);
			},
		});
	});
});