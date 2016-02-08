/**
 * APP!!!
 * @version 0.0.1
 * getMainRegion - вернет главный регион приложения
 * getDialogRegion - вернет область диалогового окна
 * getRegion(name) - вернет запрошенный регион
 * regions: headerRegion,  movingRegion, searchRegion, shopsRegion, mainRegion, footerRegion, dialogRegion
 * loadCss(cssUrl) - поключаем css к приложению
 * cssArgs - Array ccs ссылок подключаемых на старте App.
 * App.channelName = global
 * App.channel = Backbone.Wreqr.radio.channel(this.channelName);
 * App.vent = App.channel.vent;
 * App.commands = App.channel.commands;
 * App.reqres = App.channel.reqres;
 * App.barCode(product.barCode, number(default = 3)) - Форматирование штрих кода в 462 001 408 122 0 @example App.barCode(product.barCode)
 * App.tooltip(target, placement, title) - target = id,class, attr. placement = left,right, top, bottom. title = заголовок
 * App.PageableCollection - test 1
 * App.Pagination - test 1
 * App.token
 * App.User - Backbone.Model.extend
 * App.User.isTrader() - Продавец?
 * App.User.isBuyer() - Покупатель?
 * App.User.isInRole -
 * App.currency
 * App.decimal
 * App.percent
 */

define([
    "require",
    "bundle/app/dialog",
    "text!view/pagination.html",
    'moment',
    'backgrid', //Объявленно временно! TODO решить что делать с расширениями
    'backbone.paginator'
],function(
    require,
    DialogRegion,
    viewPagination,
    moment
){
    'use strict;'

    var App = new Marionette.Application({

        version: '0.0.1',

        collectionItems: {}, // TODO Будет удалено в 0.0.2
        modelItems: {}, // TODO Будет удалено в 0.0.2
        stateItems: {}, // TODO Будет удалено в 0.0.2

        el: "body",
        regions: {
            headerRegion: "#header-region",
            mainRegion: "#main-region",
            footerRegion: "#footer-region",
            dialogRegion: {
                el: "#dialog-region",
                regionClass: DialogRegion
            }

        },

        initialize: function (options) {
            console.info("App new!");

            var self = this;
            moment.locale(this.language);
            this.User = new this.User();

            this.token();

            this.User.on('change', function(){
                self.token(self.User.get('token'));
            });



            require([
                    "bundle/app/header",                    
                    "bundle/app/home",
					"bundle/app/footer"
                ],
                function(Header, Home, Footer) {
                    self.headerRegion.show(new Header.View());
                    self.footerRegion.show(new Footer.View());
                    console.info("App container ready");
                    self.User.fetch({
                        success: function(model){
                            localStorage.setItem('Token', model.get('token'));
                        },
                        error: function(){
                            //TODO Сделать нормальную авторизацию
                        }
                    });
                });
        },

        Wreqr: new Backbone.Wreqr.Commands(),

        loadCss: function(url) {
            var link = document.createElement("link");
            link.type = "text/css";
            link.rel = "stylesheet";
            link.href = url;
            document.getElementsByTagName("head")[0].appendChild(link);
        },

        getMainRegion: function() {
            return this.mainRegion;
        },

        getDialogRegion: function(){
            return this.dialogRegion;
        },

         getMovingRegion: function() {
            return this.movingRegion;
        },


        Router: new Marionette.AppRouter(),

        cssArgs: [
            '../../css/bootstrap-theme-red-main-manager.css',
            '../../css/font-awesome.css',
			'../../css/goods-manager.css'
        ],

        onStart: function(){
            _.each(this.cssArgs, function(css){
                var cssUrl = require.toUrl(css);
                App.loadCss(cssUrl);
            });

            require(['controller'], function(){
                if(Backbone.history){
                    Backbone.history.start();
                }
            });
        },

        getCurrentRoute: function(){
            return Backbone.history.fragment;
        },

        navigate: function(route, options) {
            options || (options = {});
            App.Router.navigate(route, options);
        },

        /**
         *
         * @param target DOM element
         * @param placement top, tight, bottom, left and auto
         * @param title text/html
         * @param opt {}
         */
        tooltip: function(target, placement, title, opt){
            var options = {html: true};
            options = _.extend(options, opt);
            target  = target || '[data-toggle="tooltip"]';
            placement  = placement || 'left';
            title  = title || $(target).attr('title');
            $(target).attr('data-placement', placement);
            $(target).attr('data-original-title', title);
            $(target).attr('data-toggle', 'tooltip');

            $(target).tooltip(options);
        },

        language: window.navigator.userLanguage || window.navigator.language,

        /**
         *
         * @param number
         * @returns {Intl.NumberFormat}
         */
        currency: function(number){

            return new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(number);
        },

        decimal: function(number){

            return new Intl.NumberFormat('ru-RU', { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(number);
        },

        percent: function(number){

            return new Intl.NumberFormat('ru-RU', { style: 'percent', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(number);
        },


        /**
         * product barCode Formatter 462 001 408 122 0
         * @param barCode
         * @param numb
         * @returns {string}
         */
        barCode: function(barCode, numb){
            numb = numb || 3;
            var arr = '';
            for(var i=0; i<barCode.length/numb; i++ ){
                arr += barCode.slice(numb*i, numb*i+numb);
                arr += ' ';
            }
            return arr;
        },

        /**
         * @return Token
         */
        token: function(token){
            token = token || false;

            if ( token ){
                localStorage.setItem('Token', token);
            }
            $.ajaxPrefilter(function( options, originalOptions, jqXHR ) {
                options.headers = options.headers || {};
                options.headers.Authorization = "TOKEN039 "+ localStorage.getItem('Token');
            });

            return localStorage.getItem('Token');
        },


        /**
         * User model
         */
        User: Backbone.Model.extend({

            defaults: {
                loggedIn: false,
                firstName: "",
                lastName: "",
                token: "",
                roles: []
            },

            isTrader: function() {
                return this.isInRole("trader");
            },

            isBuyer: function() {
                return this.isInRole("buyer");
            },

            isInRole: function(role) {
                var roles = this.get("roles") || [];
                return roles.indexOf(role) > -1;
            },

            url: 'rest/v0/user/login'

        }),

        /**
         * Backbone.PageableCollection extended.
         */
        PageableCollection: Backbone.PageableCollection.extend({
            mode: "server",

            queryParams: {
                currentPage: "p",
                pageSize: "l",
                totalPages: null,
                totalRecords: null,
                sortKey: "o",
                order: "d", //TODO Вырезать
                directions: {
                    "-1": "-",
                    "1": ""
                }
            },

            state: {
                pageSize: 10,
                sortKey: "creationTime",
                order: -1
            },

            parseRecords: function(result) {
                return result.data;
            },

            parseState: function (resp) {
                return { totalRecords: resp.total };
            },

            fetch: function (options) {

                options = options || {};

                var state = this._checkState(this.state);

                var mode = this.mode;

                if (mode == "infinite" && !options.url) {
                    options.url = this.links[state.currentPage];
                }

                var data = options.data || {};

                var url = options.url || this.url || "";
                if (_.isFunction(url)) url = url.call(this);
                var qsi = url.indexOf('?');
                if (qsi != -1) {
                    _.extend(data, queryStringToParams(url.slice(qsi + 1)));
                    url = url.slice(0, qsi);
                }

                options.url = url;
                options.data = data;

                var queryParams = this.mode == "client" ?
                    _.pick(this.queryParams, "sortKey", "order") :
                    _.omit(_.pick(this.queryParams, _.keys(Backbone.PageableCollection.prototype.queryParams)),
                        "directions");

                var i, kvp, k, v, kvps = _.pairs(queryParams), thisCopy = _.clone(this);
                for (i = 0; i < kvps.length; i++) {
                    kvp = kvps[i], k = kvp[0], v = kvp[1];
                    v = _.isFunction(v) ? v.call(thisCopy) : v;
                    if (state[k] != null && v != null) {
                        data[v] = state[k];
                    }
                }

                if (state.sortKey && state.order) {
                    var o = _.isFunction(queryParams.order) ?
                        queryParams.order.call(thisCopy) :
                        queryParams.order;
                    data[o] = this.queryParams.directions[state.order + ""];
                }
                else if (!state.sortKey) delete data[queryParams.order];

                var extraKvps = _.pairs(_.omit(this.queryParams,
                    _.keys(Backbone.PageableCollection.prototype.queryParams)));
                for (i = 0; i < extraKvps.length; i++) {
                    kvp = extraKvps[i];
                    v = kvp[1];
                    v = _.isFunction(v) ? v.call(thisCopy) : v;
                    if (v != null) data[kvp[0]] = v;
                }


                if (data['d'] == '-'){
                    data['o'] = '-'+data['o'];
                }

                if (mode != "server") {
                    var self = this, fullCol = this.fullCollection;
                    var success = options.success;
                    options.success = function (col, resp, opts) {

                        opts = opts || {};
                        if (_.isUndefined(options.silent)) delete opts.silent;
                        else opts.silent = options.silent;

                        var models = col.models;
                        if (mode == "client") fullCol.reset(models, opts);
                        else {
                            fullCol.add(models, _.extend({at: fullCol.length},
                                _.extend(opts, {parse: false})));
                            self.trigger("reset", self, opts);
                        }

                        if (success) success(col, resp, opts);
                    };
                    return Backbone.Collection.prototype.fetch.call(this, _.extend({}, options, {silent: true}));
                }

                return Backbone.Collection.prototype.fetch.call(this, options);
            }
        }),

		/**
         * Backbone.View extended.
         */
        Pagination: Backbone.View.extend({
            tagName: 'nav',
            options: {
                windowSize: 5, // Сколько страниц видно в пагинации
                windowPerPage: true, // Показывать выбор кол-ва вывода на страницу
                windowPager: true, // Показывать страницы в пагинации
                windowTotalPages: true, // Показывать сколько страниц всего
                windowStart: null, // Текущая страница
                windowEnd: null, // Последняя страница
                windowFirst: true, // Показывать ссылку на первую страницу
                windowLast: true, // Показывать ссылку на последнюю страницу
                windowNext: true, // Показывать ссылку на следующую страницу
                windowPrev: true, // Показывать ссылку на предыдущую страницу
                windowTotalPage: null, // Сколько страниц в коллекции пришло
                windowTotalSize: null, //  Сколько страниц видно в пагинации
                link: Backbone.history.fragment // TODO Заменить адекватным получением фрагмента
                //template: TODO передать другой шаблон
            },
            template: _.template(viewPagination),
            initialize: function (options) {
                _.extend(this.options, options);
                this.collection.on('reset', this.render, this);
                this.collection.on('change', this.render, this);
            },
            render: function () {
                delete(this.options.collection);
                var range = Math.floor(this.options.windowSize / 2);
                if (this.options.windowSize % 2 == 0){
                    this.options.windowSize++;
                }
                this.options.windowStart = this.collection.state.currentPage - range;
                this.options.windowEnd = this.collection.state.currentPage + range;
                this.options.windowTotalPage = this.collection.state.totalPages;
                this.options.windowTotalSize = this.options.windowSize;

                if ( this.options.windowTotalSize > this.collection.state.totalPages ) {
                    this.options.windowTotalSize = this.collection.state.totalPages;
                    if (this.options.windowTotalSize % 2 == 0){
                        this.options.windowTotalSize++;
                    }
                }
                if ( this.options.windowStart < 1 ){
                    this.options.windowStart = 1;
                    this.options.windowEnd = this.options.windowStart + this.options.windowTotalSize-1;
                }

                if ( this.options.windowEnd >= this.collection.state.totalPages ){
                    this.options.windowEnd = this.collection.state.totalPages;
                    this.options.windowStart = this.options.windowEnd - this.options.windowTotalSize+1;
                    if ( this.options.windowStart < 1 ){
                        this.options.windowStart = 1;
                    }
                }


                if ( this.options.windowPerPageSize == null )
                    this.options.windowPerPageSize = this.collection.state.pageSize;
                _.extend(this.collection.state, this.options);
                var html = this.template(this.collection);
                this.$el.html(html);
            },
            events: {
                'click a[data-page="next"]': 'nextPage',
                'click a[data-page="prev"]': 'prevPage',
                'click a[data-page="last"]': 'lastPage',
                'click a[data-page="page"]': 'getPage',
                'click a[data-page="first"]': 'firstPage',
                'click a[data-page="size"]': 'pageSize',
                'click a[data-page="disabled"]': 'noChange'
            },
            noChange: function(e){
                e.preventDefault();
            },
            nextPage: function (e) {
                e.preventDefault();
                this.collection.getNextPage();
                this.render();
            },
            prevPage: function (e) {
                e.preventDefault();
                this.collection.getPreviousPage();
                this.render();
            },
            firstPage: function (e) {
                e.preventDefault();
                this.collection.getFirstPage();
                this.render();
            },
            lastPage: function (e) {
                e.preventDefault();
                this.collection.getLastPage();
                this.render();
            },
            getPage: function (e) {
                e.preventDefault();
                var page = $(e.target).text();
                this.collection.getPage(parseInt(page));
                this.render();
            },
            pageSize: function (e) {
                e.preventDefault();
                var per = $(e.target).text();
                this.collection.setPageSize(parseInt(per));
                this.collection.getFirstPage();
                this.render();
            }
        })
    });

    /**
     * HtmlCell renders any html code
     * @class Backgrid.HtmlCell
     * @extends Backgrid.Cell
     */
    var HtmlCell = Backgrid.HtmlCell = Backgrid.Cell.extend({

        /** @property */
        className: "html-cell",

        initialize: function () {
            Backgrid.Cell.prototype.initialize.apply(this, arguments);
        },

        render: function () {
            this.$el.empty();
            var rawValue = this.model.get(this.column.get("name"));
            var formattedValue = this.formatter.fromRaw(rawValue, this.model);
            this.$el.append(formattedValue);
            this.delegateEvents();
            return this;
        }
    });

    $(window).ajaxStart(function () {
        $("#main-container").addClass("blur");
        $(".preloader").show();
    });

    $(window).ajaxComplete(function () {
        $(".preloader").hide();
        $('#main-container').removeClass('blur');
    });

    $('.modal').on("show.bs.modal", function() {
        $("#main-container").addClass("blur");
    });

    $('.modal').on("hidden.bs.modal", function() {
        $('#main-container').removeClass('blur');
    });

    return App;

});
