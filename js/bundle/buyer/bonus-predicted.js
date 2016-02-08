/**
 * Created by GOODPROFY on 26.06.2015.
 */
define([
    'app',
    'text!bundle/buyer/view/bonus/predicted.html',
    'text!view/progress.html',
    'text!view/position.html',
    'bundle/buyer/model/bonus'
], function(
    App,
    viewPredicted,
    viewProgress,
    viewPosition,
    Data
){
    return App.module("Buyer.Bonus.Predicted", function (Predicted, App, Backbone, Marionette, $, _) {
        'use strict;'
        this.onStart = function () {
            console.log("Buyer.Bonus.Predicted >>> started");
        };

        this.onStop = function () {
            console.log("Buyer.Bonus.Predicted <<< stopped");
        };

        this.ContainerView = Marionette.LayoutView.extend({
            template: _.template(viewPredicted),
            regions: {
                DAY_OF_COUNT: '#day-of-count',
                DAY_OF_COUNT_Pagination: '#day-of-count-pagination',
                DAY_OF_SUM: '#day-of-sum',
                DAY_OF_SUM_Pagination: '#day-of-sum-pagination',
                MONTH_OF_COUNT: '#month-of-count',
                MONTH_OF_COUNT_Pagination: '#month-of-count-pagination',
                MONTH_OF_SUM: '#month-of-sum',
                MONTH_OF_SUM_Pagination: '#month-of-sum-pagination'
            },
            model: new Data.Predicted.Model(),
            onRender: function(){
                console.clear();

                var self = this;
                var programArgs = new Backbone.Collection(this.model.get('programArgs'));


                _.each(programArgs.toJSON(), function(program, key, list){

                    var programCollection =  new Data.Predicted[program.programType]();
                    programCollection.fetch({reset:true}).done(function(){

                        var columns = [];

                        var label = new Backbone.Model({
                            level: 'Место',
                            nick: 'Ник',
                            orderCount: 'Кол-во заказов',
                            orderSum: 'Сумма заказов',
                            bonus: 'Предполагаемый бонус',
                            delivered: 'Доставлено',
                            position: 'Изменение позиции'
                        });

                        var cols = _.keys(programCollection.at(0).toJSON());

                        _.each(cols, function(col){
                            switch(col){
                                case 'bonus':
                                    columns.push({
                                        name: col,
                                        label: label.get(col),
                                        cell: Backgrid.NumberCell.extend({
                                            orderSeparator: ' ',
                                            decimalSeparator: ','
                                        }),
                                        editable: false
                                    });
                                    break;
                                case 'delivered':
                                    columns.push({
                                        name: col,
                                        label: label.get(col),
                                        cell: 'html',
                                        formatter: _.extend({}, Backgrid.CellFormatter.prototype, {
                                            fromRaw: function (rawValue, model) {
                                                var template = _.template(viewProgress);
                                                return template({percent: rawValue});
                                            }
                                        }),
                                        editable: false
                                    });
                                    break;
                                case 'position':
                                    columns.push({
                                        name: col,
                                        label: label.get(col),
                                        cell: 'html',
                                        formatter: _.extend({}, Backgrid.CellFormatter.prototype, {
                                            fromRaw: function (rawValue, model) {
                                                var template = _.template(viewPosition);
                                                return template({position: rawValue});
                                            }
                                        }),
                                        editable: false
                                    });
                                    break;
                                case 'orderSum':
                                    columns.push({
                                        name: col,
                                        label: label.get(col),
                                        cell: Backgrid.NumberCell.extend({
                                            orderSeparator: ' ',
                                            decimalSeparator: ','
                                        }),
                                        editable: false
                                    });
                                    break;
                                default:
                                    columns.push({
                                        name: col,
                                        label: label.get(col),
                                        cell: 'string',
                                        editable: false
                                    });
                                    break;
                            }
                        });

                        var grid = new Backgrid.Grid({
                            className: "table table-hover",
                            columns : columns,
                            collection : programCollection,
                            emptyText: "Нет данных для отображения."
                        });

                        self.getRegion([program.programType]).show( grid );
                        var pagination = [program.programType]+'_Pagination';
                        console.log(pagination);
                        self.getRegion(pagination).show( new App.Pagination({collection: programCollection}) );

                    });
                });
            }
        });
    });
});