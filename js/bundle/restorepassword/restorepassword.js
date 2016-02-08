/**
 *
 * Created by GOODPROFY on 25.08.2015.
 */

define([
    'app'
], function(App){
    "use strict";
    return App.module("Restorepassword", function (Restorepassword, App, Backbone, Marionette, $, _) {
        this.startWithParent = false;

        this.onStart = function(options) {
            console.log('Restorepassword >>> Start');
            console.log(options);
            var rst = Backbone.Model.extend({
                url: App.getRest('restore')
            });

            rst = new rst({ u: options.psb });

            rst.save(null,{
                success: function( result ){
                    Restorepassword.stop();
                },
                error: function( result ){
                    console.log(result);
                    Restorepassword.stop();
                }
            });

        };

        this.onStop = function() {
            console.log('Restorepassword >>> Stop');
            App.Dialog.alert({size: 'small', message: 'Инструкции по восстановлению пароля высланы на почту.'});
        };

    });
});