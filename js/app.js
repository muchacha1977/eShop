/**
 * APP!!!
 * @version 0.0.8
 * getMainRegion - вернет главный регион приложения
 * getDialogRegion - вернет область диалогового окна
 * getRegion(name) - вернет запрошенный регион
 * regions: headerRegion,  movingRegion, searchRegion, shopsRegion, mainRegion, footerRegion, dialogRegion
 * App.loadCss(cssUrl) - поключаем css к приложению
 * App.cssArgs - Array ccs ссылок подключаемых на старте App.
 * App.channelName = global
 * App.channel = Backbone.Wreqr.radio.channel(this.channelName);
 * App.vent = App.channel.vent;
 * App.commands = App.channel.commands;
 * App.reqres = App.channel.reqres;
 * App.barCode(product.barCode, number(default = 3)) - Форматирование штрих кода в 462 001 408 122 0 @example App.barCode(product.barCode)
 * App.tooltip(target, placement, title) - target = id,class, attr. placement = left,right, top, bottom. title = заголовок
 * App.PageableCollection - Backbone.PageableCollection заточенная под наш проект.
 * App.Pagination - Пагинация
 * App.token - текущий токен авторизации
 * App.User - Backbone.Model.extend
 * App.User.isTrader() - Продавец?
 * App.User.isBuyer() - Покупатель?
 * App.User.isInRole(ROLE) - Проверка роли пользователя App.User.isInRole('buyer') = false or true;
 * App.currency(Number) - Форматирование числа в локаль. Пример App.currency(1000) = 1 000,00 руб.
 * App.decimal(Number) - Форматирование числа в локаль. Пример App.decimal(1000) = 1 000,00
 * App.percent(Number) - Форматирование процентов в локаль. Пример App.percent(1) = 1%
 * App.QUERY_STRING(queryString) - Вернет объект параметров с помощью которых была получена страница
 * App.REST() - Все ресты приложения.
 * App.UUID() - Генератор UUID
 * App.alert({message: 'Text/HTML'})
 * App.Dialog  - http://bootboxjs.com/documentation.html
 * App.viewport = { width, height } Размер окна, меняется автоматически.
 * App.config = {}  Конфигурация RequireJS
 * App.getNumEnding(number, [stringArgs]) - меняем окончание числа. Передаем массив слов на 1, 4, 5
 * App.getRest( catalog/node ) - вернет полную строку rest/v0/catalog/node
 * App.urlRusLat( str ) - вернет транслит без пробелов.
 */
define([
    "require",
    "bundle/app/dialog",
    "text!view/pagination.html",
    'moment',
    'bootbox',
    'notify',
    'backgrid', //Объявленно временно! TODO решить что делать с расширениями
    'backbone.paginator'
],function(
    require,
    DialogRegion,
    viewPagination,
    moment,
    bootbox
){
    'use strict';

    window.App = new Marionette.Application({

        version: '0.0.8',

        el: "body",
        regions: {
            headerRegion: "#header-region",
            movingRegion: "#movingbox-region",
            searchRegion: "#search-region",
            shopsRegion: "#shops-region",
            mainRegion: "#main-region",
            footerRegion: "#footer-region",
            bonusRegion: "#bonus-region",
            breadCrumbsRegion: "#breadcrumbs-region",
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

            this.listenTo(this.User, 'change', function(){
                self.token(self.User.get('token'));
            });


            require([
                    "bundle/app/header",
                    "bundle/movingbox/movingbox",
                    "bundle/search/search",
                    "bundle/app/footer",
                    "bundle/app/home",
                    "bundle/shops/shops",
                    "bundle/bonus/bonus",
                    "model/countries",
                    "model/misc"
                ],
                function(Header, Movingbox, Search, Footer, Home, Shops, Bonus) {
                    self.headerRegion.show(new Header.View());
                    self.movingRegion.show(new Movingbox.View());
                    self.searchRegion.show(new Search.View());
                    self.shopsRegion.show(new Shops.Button());
                    self.footerRegion.show(new Footer.View());
                    Bonus.start();
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

        loadCss: function(css) {
            var url = require.toUrl(css);
            var link = document.createElement("link");
            link.type = "text/css";
            link.rel = "stylesheet";
            link.href = url;
            document.getElementsByTagName("head")[0].appendChild(link);
        },

        getMainRegion: function() {
            return this.mainRegion;
        },

        getBreadcrumbsRegion: function() {
            return this.breadCrumbsRegion;
        },

        getDialogRegion: function(){
            return this.dialogRegion;
        },

         getMovingRegion: function() {
            return this.movingRegion;
        },

        cssArgs: [
            '../css/bootstrap-theme-red.css',
            '../css/font-awesome.css',
            '../css/categories.css',
            '../css/shop-popover.css',
            '../css/goods-explorer.css',
            '../css/movingbox/movingbox.css',
            '../css/carousel/carousel.css',
            '../css/bootstrap-notify.css',
            '../css/alert-blackgloss.css',
            '../css/alert-bangtidy.css'
        ],

        appRoutes: new Backbone.Model(),

        Router: Marionette.AppRouter.extend({
            onRoute: function(name, path, agrs){
                App.Breadcrumbs.reset();
            }
        }),

        onStart: function(){
            _.each(this.cssArgs, function(css){
                App.loadCss(css);
            });

            require(['controller'], function(Controller){
                App.Router = App.Router.extend({
                    controller: Controller,
                    appRoutes: App.appRoutes.toJSON()
                });
                App.Router = new App.Router();
                if(Backbone.history){
                    Backbone.history.start();
                }
            });
        },

        getCurrentRoute: function(){
            return Backbone.history.fragment;
        },

        getPathFromUrl: function (url) {
            url = url || this.getCurrentRoute();
            return url.split(/[?#]/)[0];
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
            target || (target = '[data-toggle="tooltip"]');
            placement || $(target).attr('data-placement') || (placement = 'left');
            title || $(target).attr('data-original-title') || (title = $(target).attr('title'));
            $(target).data('placement', placement);
            $(target).data('originalTitle', title);
            $(target).data('toggle', 'tooltip');

            $(target).tooltip(options);
        },

        language: window.navigator.userLanguage || window.navigator.language,

        /**
         *
         * @param number
         * @returns {toLocaleString}
         */
        currency: function(number){
            number = number.toFixed(2);
            if ( _.isNumber(number)){
                return (number.toLocaleString('ru-RU', { style: 'currency', currency: 'RUR' }));
            }else{
                return number;
            }
        },

        decimal: function(number){
            number = number.toFixed(2);
            if ( _.isNumber(number)){
                return number.toLocaleString('ru-RU');
            }else{
                return number;
            }

        },

        percent: function(number){

            return number+' %';
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
            return $.trim(arr);
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

            isProducer: function() {
				return this.isInRole("producer");
            },

            isInRole: function(role) {
                var roles = this.get("roles") || [];
                return roles.indexOf(role) > -1;
            },

            url: function(){
                return App.getRest('user/login')
            }

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
                },
                q: function() { return this.state.q; }
            },

            state: {
                pageSize: 10,
                sortKey: "creationTime",
                order: -1,
                firstPage: 1,
                currentPage: 1
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
                return false;

            },
            nextPage: function (e) {
                this.collection.getNextPage();
                this.render();
                return false;
            },
            prevPage: function (e) {
                this.collection.getPreviousPage();
                this.render();
                return false;
            },
            firstPage: function (e) {
                this.collection.getFirstPage();
                this.render();
                return false;
            },
            lastPage: function (e) {
                this.collection.getLastPage();
                this.render();
                return false;
            },
            getPage: function (e) {
                var page = $(e.target).text();
                this.collection.getPage(parseInt(page));
                this.render();
                return false;
            },
            pageSize: function (e) {
                var per = $(e.target).text();
                this.collection.setPageSize(parseInt(per));
                this.collection.getFirstPage();
                this.render();
                return false;
            }
        }),

        /**
         * Строка запросов, если есть, с помощью которой была получена страница.
         * @param queryString
         * @returns {{}}
         */
        QUERY_STRING: function (queryString){
            var params = {};
            if(queryString){
                _.each(
                    _.map(decodeURI(queryString).split(/&/g),function(el,i){
                        var aux = el.split('='), o = {};
                        if(aux.length >= 1){
                            var val = undefined;
                            if(aux.length == 2)
                                val = aux[1];
                            o[aux[0]] = val;
                        }
                        return o;
                    }),
                    function(o){
                        _.extend(params,o);
                    }
                );
            }
            return params;
        },

        /**
         * Вывод рестов сервера
         */
        REST: function(){
            $.ajax({
                url: 'rest/v0/application.wadl',
                success: function(data){
                   require(['lib/xml-to-json'], function(){
                       var json = $.xml2json(data, true);

                       _.each(json['resources'][0]['resource'], function(value){
                           console.log(value);
                       });
                   });

                }
            });
        },

        UUID: function() {
            var d = new Date().getTime();
            var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                var r = (d + Math.random()*16)%16 | 0;
                d = Math.floor(d/16);
                return (c=='x' ? r : (r&0x3|0x8)).toString(16);
            });
            return uuid;
        },

        alert: function(options){
            var defaults = {
                pos: 'top-right', type: 'blackgloss', message: ''
            };
            console.log(options);
            options = _.extend(defaults,options);
            options.message = {html: options.message};
            $('.'+options.pos).notify(options).show();

        },
        Dialog: bootbox,
        viewport : {
            width  : $(window).width(),
            height : $(window).height()
        },
        config: requirejs.s.contexts._.config,


        getNumEnding: function(iNumber, aEndings){
            var sEnding, i;
            iNumber = iNumber % 100;
            if (iNumber>=11 && iNumber<=19) {
                sEnding=aEndings[2];
            }
            else {
                i = iNumber % 10;
                switch (i)
                {
                    case (1): sEnding = aEndings[0]; break;
                    case (2):
                    case (3):
                    case (4): sEnding = aEndings[1]; break;
                    default: sEnding = aEndings[2];
                }
            }
            return sEnding;
        },

        /**
         * Функция создает ссылку на restFull service
         * @param url
         * @returns {string}
         */
        getRest: function( url ){
            return String(App.config.rest+url);
        },

        urlRusLat: function( str ){
            str = str.toLowerCase();
            var cyr2latChars = new Array(
                ['а', 'a'], ['б', 'b'], ['в', 'v'], ['г', 'g'],
                ['д', 'd'],  ['е', 'e'], ['ё', 'yo'], ['ж', 'zh'], ['з', 'z'],
                ['и', 'i'], ['й', 'y'], ['к', 'k'], ['л', 'l'],
                ['м', 'm'],  ['н', 'n'], ['о', 'o'], ['п', 'p'],  ['р', 'r'],
                ['с', 's'], ['т', 't'], ['у', 'u'], ['ф', 'f'],
                ['х', 'h'],  ['ц', 'c'], ['ч', 'ch'],['ш', 'sh'], ['щ', 'shch'],
                ['ъ', ''],  ['ы', 'y'], ['ь', ''],  ['э', 'e'], ['ю', 'yu'], ['я', 'ya'],

                ['А', 'A'], ['Б', 'B'],  ['В', 'V'], ['Г', 'G'],
                ['Д', 'D'], ['Е', 'E'], ['Ё', 'YO'],  ['Ж', 'ZH'], ['З', 'Z'],
                ['И', 'I'], ['Й', 'Y'],  ['К', 'K'], ['Л', 'L'],
                ['М', 'M'], ['Н', 'N'], ['О', 'O'],  ['П', 'P'],  ['Р', 'R'],
                ['С', 'S'], ['Т', 'T'],  ['У', 'U'], ['Ф', 'F'],
                ['Х', 'H'], ['Ц', 'C'], ['Ч', 'CH'], ['Ш', 'SH'], ['Щ', 'SHCH'],
                ['Ъ', ''],  ['Ы', 'Y'],
                ['Ь', ''],
                ['Э', 'E'],
                ['Ю', 'YU'],
                ['Я', 'YA'],

                ['a', 'a'], ['b', 'b'], ['c', 'c'], ['d', 'd'], ['e', 'e'],
                ['f', 'f'], ['g', 'g'], ['h', 'h'], ['i', 'i'], ['j', 'j'],
                ['k', 'k'], ['l', 'l'], ['m', 'm'], ['n', 'n'], ['o', 'o'],
                ['p', 'p'], ['q', 'q'], ['r', 'r'], ['s', 's'], ['t', 't'],
                ['u', 'u'], ['v', 'v'], ['w', 'w'], ['x', 'x'], ['y', 'y'],
                ['z', 'z'],

                ['A', 'A'], ['B', 'B'], ['C', 'C'], ['D', 'D'],['E', 'E'],
                ['F', 'F'],['G', 'G'],['H', 'H'],['I', 'I'],['J', 'J'],['K', 'K'],
                ['L', 'L'], ['M', 'M'], ['N', 'N'], ['O', 'O'],['P', 'P'],
                ['Q', 'Q'],['R', 'R'],['S', 'S'],['T', 'T'],['U', 'U'],['V', 'V'],
                ['W', 'W'], ['X', 'X'], ['Y', 'Y'], ['Z', 'Z'],

                [' ', '_'],['0', '0'],['1', '1'],['2', '2'],['3', '3'],
                ['4', '4'],['5', '5'],['6', '6'],['7', '7'],['8', '8'],['9', '9'],
                ['-', '-']

            );

            var newStr = new String();

            for (var i = 0; i < str.length; i++) {

                var ch = str.charAt(i);
                var newCh = '';

                for (var j = 0; j < cyr2latChars.length; j++) {
                    if (ch == cyr2latChars[j][0]) {
                        newCh = cyr2latChars[j][1];

                    }
                }
                // Если найдено совпадение, то добавляется соответствие, если нет - пустая строка
                newStr += newCh;

            }
            // Удаляем повторяющие знаки - Именно на них заменяются пробелы.
            // Так же удаляем символы перевода строки, но это наверное уже лишнее
            return newStr.replace(/[_]{2,}/gim, '_').replace(/\n/gim, '');
        }

    });


    App.Dialog.setDefaults({
        locale: App.language,
        className: "app-dialog"

    });

    /**
     * TODO Перенести
     */
    App.Breadcrumbs = Backbone.Collection.extend({
        model: Backbone.Model.extend({
            defaults:{
                id:1,
                url: 'home',
                title: '<span class="glyphicon glyphicon-home"></span>'
            }
        }),
        comparator: function () { return this.get('id'); }
    });

    App.Breadcrumbs = new App.Breadcrumbs();

    App.BreadcrumbsContainer = Marionette.CollectionView.extend({
        childViewContainer: 'ol',
        childView: Marionette.ItemView.extend({
            template: _.template('<a href="#<%- url %>"><%= title %></a>'),
            tagName: 'li',
            className: ''
        }),
        collection: App.Breadcrumbs,
        tagName: 'ol',
        className: 'hidden',
        onRender: function(){
            if ( App.Breadcrumbs.length > 1 ){
                this.$el.removeClass('hidden');
                this.$el.addClass('breadcrumb hidden-xs');
            }

            if ( App.Breadcrumbs.length == 0 ){
                App.Breadcrumbs.add({
                    url: 'home',
                    title: '<span class="breadcrumb__uri breadcrumb__uri--home glyphicon glyphicon-home"></span>'
                });
                App.Breadcrumbs.sort();
            }
        },
        collectionEvents: {
            "all": "render"
        },
        initialize: function(){
            App.getBreadcrumbsRegion().show(this);
        }
    });

    App.BreadcrumbsContainer = new App.BreadcrumbsContainer();

    window.ENV = App.config.env;

    $(window).on('resize', function(){
        App.viewport.width = $(window).width();
        App.viewport.height = $(window).height();
        console.log(App.viewport.width);
        console.log(App.viewport.height);
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

    var HtmlcenterCell =  Backgrid.HtmlcenterCell =  Backgrid.HtmlCell.extend({
        className: "html-cell text-center",
        initialize: function () {
            Backgrid.HtmlCell.prototype.initialize.apply(this, arguments);
        }
    });

    var HtmlrightCell =  Backgrid.HtmlrightCell =  Backgrid.HtmlCell.extend({
        className: "html-cell text-right",
        initialize: function () {
            Backgrid.HtmlCell.prototype.initialize.apply(this, arguments);
        }
    });

    var StringcenterCell =  Backgrid.StringcenterCell =  Backgrid.StringCell.extend({
        className: "string-cell text-center",
        initialize: function () {
            Backgrid.StringCell.prototype.initialize.apply(this, arguments);
        }
    });

    /**
     * Error status Handlers
     */
    $(window).ajaxError(function( event, jqxhr, settings, thrownError ) {
        switch( jqxhr.status ){
            case 403:
                require(['bundle/authentication/authentication'], function(Authentication){
                    App.dialogRegion.show(new  Authentication.View());
                });
                break;
            case 405:
                App.alert({ message: 'Действие не возможно.' });
                break;
            case 409:
                require(["bundle/modal/modal"],
                    function (Modal) {
                        new Modal.View({text: "Упс... Что-то сломалось! Ошибка №409.", _template: "message", _static: false});
                    }
                );
                break;

            case 500:
                require(["bundle/modal/modal"],
                    function (Modal) {
                        new Modal.View({text: "Упс... Что-то сломалось! Ошибка №500.", _template: "message", _static: false});
                    }
                );
                break;
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
