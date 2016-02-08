/**
 * Created by GOODPROFY on 26.06.2015.
 */
define([
    'app',
    'text!bundle/buyer/view/bonus/history.html',
    'moment',
    'lib/bootstrap-datetimepicker'
], function(
    App,
    viewHistory,
    moment
){
    return App.module("Buyer.Bonus.History", function (Bonuses, App, Backbone, Marionette, $, _) {
        this.onStart = function () {
            console.log("Buyer.Bonus.History >>> started");
        };

        this.onStop = function () {
            console.log("Buyer.Bonus.History <<< stopped");
        };
        this.ContainerView = Marionette.LayoutView.extend({
            template: _.template(viewHistory),
            regions: {
                list: '#list',
                pagination: '#pagination'
            },
            templateHelpers: {
                totalBonus: function(){
                    return App.decimal(30000);
                }
            },
            events: {
                'submit form': '_submitForm',
                'click #vent-period': '_period'
            },
            _period: function(){
                var s = this.$('#period_start input').val();
                var e = this.$('#period_end input').val();
                console.log(s);
                console.log(e);
            },
            _submitForm: function(e){
                require(["bundle/modal/modal"],
                    function (Modal) {
                        new Modal.View({text: "Функционал в разработке", _template: "message", _static: false});
                    }
                );
                return false;
            },
            _Columns: [
                {
                    name: 'creation',
                    label: 'Дата',
                    cell: 'string',
                    editable: false,
                    direction: "descending",
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
                    name: 'tax',
                    label: 'Налог',
                    cell: Backgrid.NumberCell.extend({
                        orderSeparator: ' ',
                        decimalSeparator: ','
                    }),
                    editable: false
                },
                {
                    name: 'commission',
                    label: 'Комиссия',
                    cell: Backgrid.NumberCell.extend({
                        orderSeparator: ' ',
                        decimalSeparator: ','
                    }),
                    editable: false
                },
                {
                    name: 'total',
                    label: 'Итого',
                    cell: Backgrid.NumberCell.extend({
                        orderSeparator: ' ',
                        decimalSeparator: ','
                    }),
                    editable: false
                },
                {
                    name: 'destination',
                    label: 'Назначение',
                    cell: 'string',
                    editable: false
                },
                {
                    name: 'state',
                    label: 'Статус',
                    cell: 'string',
                    editable: false
                }
            ],
            _Grid: null,
            _gridFooter: Backgrid.Footer.extend({

                render: function () {
                    var sum = this.collection.pluck("sum");
                    sum = this._sumArr(sum);
                    var tax = this.collection.pluck("tax");
                    tax = this._sumArr(tax);
                    var commission = this.collection.pluck("commission");
                    commission = this._sumArr(commission);
                    var total = this.collection.pluck("total");
                    total = this._sumArr(total);
                    this.el.innerHTML = '<tr class="active"><td><b>Итого</b></td><td class="text-right">'+App.decimal(sum)+'</td><td class="text-right">'+App.decimal(tax)+'</td><td class="text-right">'+App.decimal(commission)+'</td><td class="text-right">'+App.decimal(total)+'</td><td></td><td></td></tr>';
                    return this;
                },
                _sumArr: function(arr){
                    var sum = 0;
                    _.each(arr, function(value){
                        sum += value;
                    });
                    return sum;
                }

            }),
            initialize: function(){
                var collection = App.PageableCollection.extend({
                    url: 'js/bundle/buyer/mock/history.json'
                });
                var self = this;
                this.collection = new collection();
                this.collection.fetch({reset: true}).done(function(collection){

                    self._Grid = new Backgrid.Grid({
                        className: "table table-hover",
                        columns : self._Columns,
                        collection : self.collection,
                        emptyText: "Нет данных для отображения.",
                        footer: self._gridFooter
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