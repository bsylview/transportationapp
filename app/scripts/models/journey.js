/*global Travellapp, Backbone*/

travellapp.Models = travellapp.Models || {};

(function () {
  'use strict';

  travellapp.Models.Journey = Backbone.Model.extend({

    url: '',

    initialize: function() {
    },

    defaults: {
      to:'',
      from:''
    },

    validate: function(attrs, options) {
       var errors = [];

       if (!attrs.to) {
           errors.push({name: 'to', message: 'Please fill to field.'});
       }
       if (!attrs.from) {
           errors.push({name: 'from', message: 'Please fill from field.'});
       }

       return errors.length > 0 ? errors : false;
    },

    parse: function(response, options)  {
      return response;
    }
  });

})();
