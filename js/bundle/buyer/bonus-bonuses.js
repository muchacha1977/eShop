/**
 * Created by GOODPROFY on 26.06.2015.
 */
define([
    'app',
    'text!bundle/buyer/view/bonus/bonuses.html',
    'moment',
    'lib/bootstrap-datetimepicker'
], function(
    App,
    viewBonuses,
    moment
){
    return App.module("Buyer.Bonus.Bonuses", function (Bonuses, App, Backbone, Marionette, $, _) {
        this.onStart = function () {
            console.log("Buyer.Bonus.Bonuses >>> started");
        };

        this.onStop = function () {
            console.log("Buyer.Bonus.Bonuses <<< stopped");
        };
        this.ContainerView = Marionette.LayoutView.extend({
            template: _.template(viewBonuses),
            regions: {
                list: '#list',
                pagination: '#pagination'
            },
            events: {
                'click #vent-period': '_period'
            },
            _period: function(){
                var s = this.$('#period_start input').val();
                var e = this.$('#period_end input').val();
                console.log(s);
                console.log(e);
            },
            _Columns: [
                {
                    name: 'period',
                    label: 'Период',
                    cell: 'string',
                    editable: false,
                    direction: "descending",
                },
                {
                    name: 'program',
                    label: 'Программа',
                    cell: 'string',
                    editable: false
                },
                {
                    name: 'sum',
                    label: 'Сумма',
                    cell: Backgrid.NumberCell.extend({
                        orderSeparator: ' ',
                        decimalSeparator: ','
                    }),
                    editable: false
                },
                {
                    name: 'amount',
                    label: 'Кол-во',
                    cell: 'string',
                    editable: false
                },
                {
                    name: 'place',
                    label: 'Место',
                    cell: 'string',
                    editable: false
                }
            ],
            _Grid: null,
            initialize: function(){
                var self = this;
                var collection = App.PageableCollection.extend({
                    url: 'js/bundle/buyer/mock/bonuses.json'
                });

                this.collection = new collection();
                this.collection.fetch({reset: true}).done(function(collection){
                    console.log(collection);
                    self._Grid = new Backgrid.Grid({
                        className: "table table-hover",
                        columns : self._Columns,
                        collection : self.collection,
                        emptyText: "Нет данных для отображения."
                    });
                    self.list.show( self._Grid );
                    self.pagination.show( new App.Pagination({collection: self.collection}) );
                });

            },
            onShow: function(){
                this.$('#period_start').datetimepicker({
                    format: 'DD.MM.YYYY',
                    defaultDate: moment().format()
                });
                this.$('#period_end').datetimepicker({
                    format: 'DD.MM.YYYY',
                    defaultDate: moment().format()
                });
                this.$("#period_start").on("dp.change", function (e) {
                    $('#period_end').data("DateTimePicker").minDate(e.date);
                });
                this.$("#period_end").on("dp.change", function (e) {
                    $('#period_start').data("DateTimePicker").maxDate(e.date);
                });
            }
        });
    });
});