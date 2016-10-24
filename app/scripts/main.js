/*global travellapp, $*/

window.travellapp = {
  Models: {},
  Collections: {},
  Views: {},
  Routers: {},

  init: function () {
    'use strict';
    window.controller = $App(idb);
    this.renderMainView();
  },

  renderMainView: function(){
    var model = new this.Models.Jroute();
    var view = new this.Views.Journey({model:model});
    $('#app').append(view.render().el);
  }

};

$(document).ready(function () {
  'use strict';
  travellapp.init();
});
