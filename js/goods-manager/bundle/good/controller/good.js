define([
    "app"
], function(App) {
    'use strict';
    return App.module("Good.Controller", function(Controller, App, Backbone, Marionette, $, _) {

        Controller = Marionette.Controller.extend({
            initialize: function (options) {
                _.bindAll(this, '_onGoodFetch', '_onCategoryFetch');
                console.info('Controller >>> Good');
            },

            good: function (id) {
                if (!id) {
                    return App.Router.navigate('categories', {trigger: true});
                }

                require([
                    "bundle/good/model/good"
                ], function(Data){
                    Data.Good.set('id', id);
                    Data.Good.fetch().done(this._onGoodFetch);                   
                }.bind(this));
            },

            _onGoodFetch: function (result) {
                require([
                    "bundle/good/model/good"
                ], function (Data) {
                    Data.GoodCurrentCategory.set('id', Data.Good.get('id'));
                    this._onCategoryFetch();
                    //Data.GoodCurrentCategory.fetch({reset: true}).done(this._onCategoryFetch)
                }.bind(this));                
            },

            _onCategoryFetch: function () {
                require([
                    "bundle/good/good",
                    "bundle/good/model/good"
                ], function (Good, Data) {
                    Data.Good.set('characteristics', [
                        {
                          id: '123454321',
                          name: 'Вес',
                          dimension: 'тонны',
                          value: ''   
                        },
                        {
                          id: '99999999',
                          name: 'Мощность двигателя',
                          dimension: 'л/с',
                          value: ''
                        }
                      ]);
                    Data.GoodCharacteristics.reset(Data.Good.get('characteristics'));                    
                    App.getMainRegion().show(new Good.View());
                }.bind(this));  
            }
        });

        App.Router.processAppRoutes(new Controller(), {
            "good/:id": "good"
        });

    });

});
