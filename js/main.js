var ENV_DEV = {

    waitSeconds: 30,

    useStrict: true,

    env: 'dev',

    rest: 'rest/v0/',

    baseUrl: "js",

    urlArgs: "nocache=" + (new Date()).getTime(),

    paths: {
        jquery: "lib/jquery",
        "jquery.maskedinput": "lib/jquery.maskedinput",
        underscore: "lib/underscore",
        bootstrap: "lib/bootstrap",
        backbone: "lib/backbone",
        backform: "lib/backform",
        localstorage: "lib/backbone.localStorage",
        "backbone.paginator": "lib/backbone.paginator",
        backgrid: "lib/backgrid",
        "backgrid.paginator": "lib/backgrid-paginator",
        'backgrid.filter': 'lib/backgrid/backgrid-filter',
        'backgrid.select': 'lib/backgrid/backgrid-select-all',
        marionette: "lib/backbone.marionette",
        moment: "lib/moment-with-locales",
        "jquery.tablesorter": "lib/tablesorter/jquery.tablesorter",
        "jquery.tablesorter.widgets": "lib/tablesorter/jquery.tablesorter.widgets",
        serializejson: "lib/jquery.serializejson",
        GoogleChart: 'lib/GoogleChart',
        text: 'lib/text',
        bootbox: 'lib/bootbox',
        datetimepicker: 'lib/bootstrap-datetimepicker',
        notify: 'lib/bootstrap-notify',
        syphon:'lib/backbone.syphon'
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

        datetimepicker: {
            deps: ["jquery", "bootstrap"]
        },

        bootbox: {
            deps: ["jquery", "bootstrap"]
        },

        notify: {
            deps: ["jquery", "bootstrap"]
        },

        backbone: {
            deps: ["jquery", "underscore"],
            exports: "Backbone"
        },

        backform: {
            deps: ["backbone"],
            exports: "Backform"
        },

        GoogleChart: {
            deps: ["backbone"]
        },

        "backbone.paginator": {
            deps: ["underscore", "backbone"],
            exports: "Backbone.PageableCollection"
        },

        marionette: {
            deps: ["backbone"],
            exports: "Marionette"
        },

        localstorage: {
            deps: ["backbone"],
            exports: "localstorage"
        },

        backgrid: {
            deps: ["backbone"],
            exports: "Backgrid"
        },

        "backgrid.paginator": {
            deps: ["backgrid"]
        },

        "backgrid.filter": {
            deps: ["backgrid"]
        },

        "backgrid.select": {
            deps: ["backgrid"]
        },

        syphon: {
            deps: ["jquery", "backbone"]
        },
        "jquery.maskedinput": ["jquery"],

        "jquery.tablesorter": ["jquery"],

        "jquery.tablesorter.widgets": ["jquery", "jquery.tablesorter"],

        "jquery.tablesorter.widgets.grouping": ["jquery.tablesorter", "jquery.tablesorter.widgets"],

        "jquery.metadata": ["jquery"],

        "serializejson": ["jquery"] 

    }

};

var ENV_PROD = {

    waitSeconds: 0,

    useStrict: true,

    env: 'prod',

    rest: 'rest/v0/',

    baseUrl: "js",

    paths: {
        jquery: "min/jquery",
        "jquery.maskedinput": "min/jquery.maskedinput",
        underscore: "min/underscore",
        bootstrap: "min/bootstrap",
        backbone: "min/backbone",
        backform: "min/backform",
        localstorage: "min/backbone.localStorage",
        "backbone.paginator": "min/backbone.paginator",
        backgrid: "min/backgrid",
        "backgrid.paginator": "min/backgrid-paginator",
        'backgrid.filter': 'lib/backgrid/backgrid-filter',
        'backgrid.select': 'lib/backgrid/backgrid-select-all',
        marionette: "min/backbone.marionette",
        moment: "min/moment-with-locales",
        "jquery.tablesorter": "lib/tablesorter/jquery.tablesorter",
        "jquery.tablesorter.widgets": "lib/tablesorter/jquery.tablesorter.widgets",
        serializejson: "min/jquery.serializejson",
        GoogleChart: 'min/GoogleChart',
        text: 'min/text',
        bootbox: 'min/bootbox',
        datetimepicker: 'min/bootstrap-datetimepicker',
        notify: 'min/bootstrap-notify',
        syphon:'lib/backbone.syphon'
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

        datetimepicker: {
            deps: ["jquery", "bootstrap"]
        },

        bootbox: {
            deps: ["jquery", "bootstrap"]
        },

        notify: {
            deps: ["jquery", "bootstrap"]
        },

        backbone: {
            deps: ["jquery", "underscore"],
            exports: "Backbone"
        },

        backform: {
            deps: ["backbone"],
            exports: "Backform"
        },

        GoogleChart: {
            deps: ["backbone"]
        },

        "backbone.paginator": {
            deps: ["underscore", "backbone"],
            exports: "Backbone.PageableCollection"
        },

        marionette: {
            deps: ["backbone"],
            exports: "Marionette"
        },

        localstorage: {
            deps: ["backbone"],
            exports: "localstorage"
        },

        backgrid: {
            deps: ["backbone"],
            exports: "Backgrid"
        },

        "backgrid.paginator": {
            deps: ["backgrid"]
        },

        "backgrid.filter": {
            deps: ["backgrid"]
        },

        "backgrid.select": {
            deps: ["backgrid"]
        },

        syphon: {
            deps: ["jquery", "backbone"]
        },

        "jquery.maskedinput": ["jquery"],

        "jquery.tablesorter": ["jquery"],

        "jquery.tablesorter.widgets": ["jquery", "jquery.tablesorter"],

        "jquery.tablesorter.widgets.grouping": ["jquery.tablesorter", "jquery.tablesorter.widgets"],

        "jquery.metadata": ["jquery"],

        "serializejson": ["jquery"]

    }

};

if ( window.location.port == '8080' || window.location.port == '18080' ){
    requirejs.config(ENV_DEV);
}else{
    requirejs.config(ENV_PROD);
}

require(["app", "jquery", "jquery.maskedinput", "bootstrap"], function (App) {
    console.clear();
    console.log("App version:", App.version);
    console.log("require version:", requirejs.version);
    console.log("jQuery version: ", $.fn.jquery);
    console.log("underscore version: ", _.VERSION);
    console.log("backbone version: ", Backbone.VERSION);
    console.log("marionette version: ", Marionette.VERSION);
    App.start();
});