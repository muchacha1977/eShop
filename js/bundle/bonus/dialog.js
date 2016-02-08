/**
 * Created by GOODPROFY on 16.07.2015.
 */
define([
    'app',
    'text!bundle/bonus/view/dialog.html',
    'bootbox',
    'bundle/bonus/model/bonus'
], function(
    App,
    viewBonusDialog,
    bootbox,
    Data
){
    return App.module("Bonus.Dialog", function(Dialog, App, Backbone, Marionette, $, _) {
        'use strict';

        var Grid = null;

        var ColumnsSum = [
            {
                name: 'num',
                label: '№',
                cell: 'string',
                editable: false,
                direction: "ascending"
            },
            {
                name: 'buyer',
                label: 'Покупатель',
                cell: 'string',
                editable: false
            },
            {
                name: 'sum',
                label: 'Сумма, руб.',
                cell: Backgrid.NumberCell.extend({
                    orderSeparator: ' ',
                    decimalSeparator: ','
                }),
                editable: false
            },
            {
                name: 'bonus',
                label: 'Бонус, руб.',
                cell: Backgrid.NumberCell.extend({
                    orderSeparator: ' ',
                    decimalSeparator: ','
                }),
                editable: false
            }
        ];

        var ColumnsCount = [
            {
                name: 'num',
                label: '№',
                cell: 'string',
                editable: false,
                direction: "ascending"
            },
            {
                name: 'buyer',
                label: 'Покупатель',
                cell: 'string',
                editable: false
            },
            {
                name: 'count',
                label: 'Покупок',
                cell: 'string',
                editable: false
            },
            {
                name: 'bonus',
                label: 'Бонус, руб.',
                cell: Backgrid.NumberCell.extend({
                    orderSeparator: ' ',
                    decimalSeparator: ','
                }),
                editable: false
            }
        ];

        var View = Marionette.LayoutView.extend({
            template: _.template(viewBonusDialog),
            regions: {
                DAY_OF_SUM: '#DAY_OF_SUM',
                DAY_OF_SUM_Pagination: '#DAY_OF_SUM_Pagination',
                DAY_OF_COUNT: '#DAY_OF_COUNT',
                DAY_OF_COUNT_Pagination: '#DAY_OF_COUNT_Pagination',
                MONTH_OF_SUM: '#MONTH_OF_SUM',
                MONTH_OF_SUM_Pagination: '#MONTH_OF_SUM_Pagination',
                MONTH_OF_COUNT: '#MONTH_OF_COUNT',
                MONTH_OF_COUNT_Pagination: '#MONTH_OF_COUNT_Pagination'
            },
            initialize: function(){
                var self = this;
                var DAY_OF_SUM = new  Data.Bonus.DAY_OF_SUM();
                var DAY_OF_COUNT = new  Data.Bonus.DAY_OF_COUNT();

                var MONTH_OF_SUM = new  Data.Bonus.MONTH_OF_SUM();
                var MONTH_OF_COUNT = new  Data.Bonus.MONTH_OF_COUNT();


                DAY_OF_SUM.fetch({reset:true}).done(function(){
                    console.log(DAY_OF_SUM.toJSON());
                    Grid = new Backgrid.Grid({
                        className: "table table-hover",
                        columns : ColumnsSum,
                        collection : DAY_OF_SUM,
                        emptyText: "Нет данных для отображения."
                    });

                    self.DAY_OF_SUM.show( Grid );
                    self.DAY_OF_SUM_Pagination.show(  new App.Pagination({collection: DAY_OF_SUM, windowPerPage: false, windowTotalPages: false})  );
                });
                DAY_OF_COUNT.fetch({reset:true}).done(function(){
                    console.log(DAY_OF_COUNT.toJSON());
                    Grid = new Backgrid.Grid({
                        className: "table table-hover",
                        columns : ColumnsCount,
                        collection : DAY_OF_COUNT,
                        emptyText: "Нет данных для отображения."
                    });

                    self.DAY_OF_COUNT.show( Grid );
                    self.DAY_OF_COUNT_Pagination.show(  new App.Pagination({collection: DAY_OF_COUNT, windowPerPage: false, windowTotalPages: false})  );
                });

                MONTH_OF_SUM.fetch({reset:true}).done(function(){
                    console.log(MONTH_OF_SUM.toJSON());
                    Grid = new Backgrid.Grid({
                        className: "table table-hover",
                        columns : ColumnsSum,
                        collection : MONTH_OF_SUM,
                        emptyText: "Нет данных для отображения."
                    });

                    self.MONTH_OF_SUM.show( Grid );
                    self.MONTH_OF_SUM_Pagination.show(  new App.Pagination({collection: MONTH_OF_SUM, windowPerPage: false, windowTotalPages: false})  );
                });
                MONTH_OF_COUNT.fetch({reset:true}).done(function(){
                    console.log(MONTH_OF_COUNT.toJSON());
                    Grid = new Backgrid.Grid({
                        className: "table table-hover",
                        columns : ColumnsCount,
                        collection : MONTH_OF_COUNT,
                        emptyText: "Нет данных для отображения."
                    });

                    self.MONTH_OF_COUNT.show( Grid );
                    self.MONTH_OF_COUNT_Pagination.show(  new App.Pagination({collection: MONTH_OF_COUNT, windowPerPage: false, windowTotalPages: false})  );

                });
            }
        });

        this.onStart = function(){
            var view = new View();
            view.render();
            bootbox.dialog({
                message: view.$el,
                title: "Бонусная программа",
                show: true,
                backdrop: true,
                closeButton: true,
                animate: true,
                size: 'large',
                onEscape: function(){
                    Dialog.stop();
                }
            });
        };

        this.onStop = function(){

        };

    });
});