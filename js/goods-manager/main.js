requirejs.config({

    waitSeconds: 0,

    baseUrl: "js/goods-manager",

    urlArgs: "nocache=" + (new Date()).getTime(), //TODO Убрать на Production

    paths: {
        jquery: "lib/jquery.min",
        "jquery.maskedinput": "lib/jquery.maskedinput",
        underscore: "lib/underscore",
        //"underscore.custom": "lib/underscore.custom", //Не вызывает ошибок при отсутствии перменных в шаблоне. _.templateSettings.tryCatch = false; будет выводить ошибки
        bootstrap: "lib/bootstrap",
        backbone: "lib/backbone",
        backform: "lib/backform",
        localstorage: "lib/backbone.localStorage",
        "backbone.paginator": "lib/backbone.paginator",
        backgrid: "lib/backgrid",
        "backgrid.paginator": "lib/backgrid-paginator",
        marionette: "lib/backbone.marionette",
        moment: "lib/moment-with-locales.min",
        "jquery.tablesorter": "lib/tablesorter/jquery.tablesorter",
        "jquery.tablesorter.widgets": "lib/tablesorter/jquery.tablesorter.widgets",
        "validator": "lib/validator"
    },

    shim: {
        underscore: {
            exports: "_"
        },

        moment: {
            exports: "moment"
        },

        bootstrap: {
            deps: ["jquery", "underscore"]
        },

        backbone: {
            deps: ["jquery", "underscore"],
            exports: "Backbone"
        },

        backform: {
            deps: ["backbone"],
            exports: "Backform"
        },

        "backbone.paginator": {
            deps: ["underscore", "backbone"],
            exports: "Backbone.PageableCollection"
        },

        marionette: {
            deps: ["backbone"],
            exports: "Marionette"
        },

        localstorage: ["backbone"],

        backgrid: {
            deps: ["backbone"],
            exports: "Backgrid"
        },

        "backgrid.paginator": {
            deps: ["backgrid", "backbone.paginator"],
            exports: "Backgrid.Paginator"
        },

        "jquery.maskedinput": ["jquery"],

        "jquery.tablesorter": ["jquery"],

        "jquery.tablesorter.widgets": ["jquery", "jquery.tablesorter"],

        "jquery.tablesorter.widgets.grouping": ["jquery.tablesorter", "jquery.tablesorter.widgets"],

        "jquery.metadata": ["jquery"]
    }
});

require(["app", "jquery", "jquery.maskedinput", "bootstrap"], function (App) {
    console.log("App version:", App.version);
	console.log("App version:", App.version);
    console.log("require version:", requirejs.version);
    console.log("jQuery version: ", $.fn.jquery);
    console.log("underscore version: ", _.VERSION);
    console.log("backbone version: ", Backbone.VERSION);
    console.log("marionette version: ", Marionette.VERSION);
    App.start();
});