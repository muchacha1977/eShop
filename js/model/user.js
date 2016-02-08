define(["app", "backbone", 'localstorage'],
    function (App) {
        App.module("Data", function (Data, App, Backbone, Marionette, $, _) {

            Data.user = App.User;

            App.User.on('change', function(){
               /* if ( App.User.get('loggedIn') )
                    ga('set', '&uid', localStorage.getItem('_qas'));*/
            });

            if ( !App.User.get('loggedIn') && localStorage.getItem('_qas') == null ){
                localStorage.setItem('_qas', App.UUID());
            }

            //ga('set', '&uid', localStorage.getItem('_qas'));

        });

        return App.Data;
    }
);

