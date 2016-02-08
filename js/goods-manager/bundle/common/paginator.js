define(["app", "backgrid", "backgrid.paginator" ],
    function(App) {
        return App.module("Paginator", function (Paginator, App, Backbone, Marionette, $, _) {

            Paginator.Paginator = Backgrid.Extension.Paginator.extend({

                tagName: "nav",

                render: function () {
                    this.$el.empty();

                    if (this.handles) {
                        for (var i = 0, l = this.handles.length; i < l; i++) {
                            this.handles[i].remove();
                        }
                    }

                    var handles = this.handles = this.makeHandles();

                    var ul = document.createElement("ul");
                    ul.classList.add("pagination");                    // XXX
                    ul.classList.add("pagination-sm");
                    for (var i = 0; i < handles.length; i++) {
                        ul.appendChild(handles[i].render().el);
                    }

                    this.el.appendChild(ul);

                    return this;
                }

            });
        });
    });
