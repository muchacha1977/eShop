/**
 * Костыльная телега групповых действий
 * @version 0.0.2
 * Created by GOODPROFY on 13.08.2015.
 */
define([
    'app',
    'text!view/bulk-actions.html'
], function(
    App,
    viewBulkActions
){
    return App.module("BulkActions", function (BulkActions, App, Backbone, Marionette, $, _) {
        "use strict";
        this.ChildView = Marionette.ItemView.extend({
            template: _.template('<a class="selected" role="menuitem" tabindex="-1" href="javascript:;"><span class="<%- stateimg %>"></span> <%-statepop%></a>'),
            tagName: 'li role="presentation"',
            className: function(){
               return this.model.get('className');
            },
            triggers: {
                'click .selected': 'do:select'
            },
            initialize: function(options){
                options || (options = {});
                this.options = options;
                console.log(options);
            }
        });

        this.View = Marionette.CompositeView.extend({
            template: _.template(viewBulkActions),
            childView: BulkActions.ChildView,
            childViewContainer: "ul",
            className: 'dropdown',
            initialize: function(options){
                options || (options = {});
                this.options = options;
            },
            onChildviewDoSelect: function(child, model){
                console.log( model.model.toJSON() );
                return false;
            },
            bulkActions: function( options ){
                options || (options = {});
                var collectionSelected = new Backbone.Collection(options.selectedModels);
                var ids = _.pluck(collectionSelected.toJSON(), 'id');
                var model = Backbone.Model.extend({
                    urlRoot: App.config.rest+options.urlRoot
                });
                console.log(options);
                console.log(ids);
                model = new model();

                App.Dialog.confirm({
                    size: 'small',
                    message: options.model.get('confirm'),
                    callback: function(result){

                        if ( result ){
                            model.save(_.extend(options.params, {items: ids}), {
                                success: function(response){
                                    console.log(response);
                                    App.Wreqr.execute(options.execute);
                                },
                                error: function(response){
                                    console.log(response);
                                }
                            });
                        }

                    }
                });


            }
        });


    });
});