/**
 * Created by GOODPROFY on 16.07.2015.
 * Бонусы - таблицы результатов
 * @version 0.0.1 Non REST with JSON
 */
define([
    'app',
    'text!bundle/bonus/view/bonus.html'
], function(
    App,
    viewBonusBtn
){
    return App.module("Bonus", function(Bonus, App, Backbone, Marionette, $, _) {
        'use strict';
        this.onStart = function(){
            console.log("Bonus >>> Start");
            var self = this;
            if (App.User.isTrader()){
                this.stop();
            }else{
                App.bonusRegion.show(new this.Button());
            }

            App.User.on('change', function(){

                if (App.User.isTrader()){
                    self.stop();
                }else{
                    $('#bonus-region').show();
                    App.bonusRegion.show(new self.Button());
                }
            });
        };

        this.onStop = function(){
            this.stopListening();
            App.bonusRegion.reset();
            $('#bonus-region').hide();
        };

        this.Button = Marionette.ItemView.extend({
            template: _.template(viewBonusBtn),
            events: {
                "click #bonus-region": "_showDialog"
            },
            _showDialog: function(e) {

                require(["bundle/bonus/dialog"], function(Dialog) {
                   Dialog.start();
                });

            }
        });

    });
});