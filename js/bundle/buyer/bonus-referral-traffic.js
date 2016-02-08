/**
 * Created by GOODPROFY on 30.06.2015.
 */
define([
    'app',
    'text!bundle/buyer/view/bonus/referral-stat-traf.html',
    'moment',
    'lib/bootstrap-datetimepicker'
], function(
    App,
    viewStatTraf,
    moment
){
    return App.module("Buyer.Bonus.Referral.Traffic", function (Traffic, App, Backbone, Marionette, $, _) {
        this.ContainerView = Marionette.LayoutView.extend({
            template: _.template(viewStatTraf),
            regions: {
                statistic: '#statistic'
            },
            events: {
                'click #vent-period': '_setPeriod'
            },
            _setPeriod: function(){
                var period_start = this.$("#period_start input").val();
                var period_end = this.$("#period_end input").val();

                require(["bundle/modal/modal"],
                    function (Modal) {
                        new Modal.View({text: "Функционал в разработке.", yes: "Закрыть", no: "", _template: "message", _static: false});
                    }
                );
            },
            _Grid: null,
            _Columns: [
                {
                    name: "creation",
                    label: "Время",
                    cell: "string",
                    editable: false,
                    sortable: true,
                },
                {
                    name: "link",
                    label: "Ссылка",
                    cell: "string",
                    editable: false,
                    sortable: true,
                },
                {
                    name: "source",
                    label: "Источник",
                    cell: "string",
                    editable: false,
                    sortable: true,
                },
                {
                    name: "campaign",
                    label: "Кампания",
                    cell: "string",
                    editable: false,
                    sortable: true,
                },
                {
                    name: "promo",
                    label: "Промо",
                    cell: "string",
                    editable: false,
                    sortable: true,
                },
                {
                    name: "subId1",
                    label: "subId1",
                    cell: "string",
                    editable: false,
                    sortable: true,
                },
                {
                    name: "subId2",
                    label: "subId2",
                    cell: "string",
                    editable: false,
                    sortable: true,
                },
                {
                    name: "subId3",
                    label: "subId3",
                    cell: "string",
                    editable: false,
                    sortable: true,
                },
                {
                    name: "reg",
                    label: "Регистрация",
                    cell: "html",
                    editable: false,
                    sortable: true,
                    formatter: _.extend({}, Backgrid.CellFormatter.prototype, {
                        fromRaw: function (rawValue, model) {
                            if ( !rawValue ) return '';
                            var template = _.template('<span class="glyphicon glyphicon-ok"></span>');
                            return template();
                        }
                    })
                },
                {
                    name: "buy",
                    label: "Покупка",
                    cell: "html",
                    editable: false,
                    sortable: true,
                    formatter: _.extend({}, Backgrid.CellFormatter.prototype, {
                        fromRaw: function (rawValue, model) {
                            if ( !rawValue ) return '';
                            var template = _.template('<span class="glyphicon glyphicon-ok"></span>');
                            return template();
                        }
                    })
                }
            ],
            onShow: function(){
                var compile = this;
                compile._Grid = new Backgrid.Grid({
                    className: "table table-hover",
                    columns : compile._Columns,
                    collection : compile.collection,
                    emptyText: "Нет данных для отображения."
                });

                compile.statistic.show( compile._Grid );
            },
            onRender: function(){
                this.$('#period_start').datetimepicker({
                    format: 'DD.MM.YYYY',
                    defaultDate: moment().subtract(7, 'days')
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
            },
        });
    });
});