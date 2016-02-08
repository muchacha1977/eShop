/**
 * Created by GOODPROFY on 30.06.2015.
 */
define([
    'app',
    'text!bundle/buyer/view/bonus/referral-url-construct.html'
], function(
    App,
    viewUrlConstruct
){
    return App.module("Buyer.Bonus.Referral.Url", function (Url, App, Backbone, Marionette, $, _) {
        this.ContainerView = Marionette.LayoutView.extend({
            template: _.template(viewUrlConstruct),
            onRender: function(){
                var compile = this
                domain = window.location.origin
                url = new Backbone.Model();

                this.$('form input').bind('paste keyup', function(){
                    if ( $(this).attr('id') == 'result' ) return;
                    url.set($(this).attr('id'), $(this).val());
                    var urlKeys = _.keys(url.toJSON())
                    urlValues = _.values(url.toJSON())
                    urlString = '';

                    for(var i = 0; i<urlKeys.length; i++){
                        if ( urlKeys[i] == 'page' )
                            continue;
                        urlString+=urlKeys[i]+'='+urlValues[i]+'&';
                    }

                    urlString = urlString.substring(0, urlString.length - 1);
                    var page = compile.$('#page').val();

                    if ( page == '' )
                        page = domain;

                    compile.$('#result').val(page+'?aid='+compile.model.get('aid')+'&'+urlString);
                });
            }
        });
    });
});