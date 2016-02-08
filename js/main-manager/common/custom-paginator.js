define(["app",
        "backgrid",
        "backgrid.paginator",
        "bundle/common/collection/pageable-collection"
    ],
    function(App, Backgrid, BackgridPaginator, PageableCollection) {
        App.module("Custom", function (Custom, App, Backbone, Marionette, $, _) {

            // TODO: Убрать это отсюда. Эта коллекция уже вынесена в отдельный модуль, подключать нужно его
            Custom.PageableCollection = PageableCollection.Collection;

            Custom.Paginator = Backgrid.Extension.Paginator.extend({

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
                    for (var i = 0; i < handles.length; i++) {
                        ul.appendChild(handles[i].render().el);
                    }

                    this.el.appendChild(ul);

                    return this;
                }

            });
        });

        return App.Custom;
    });
