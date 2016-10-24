/*global travellapp, Backbone, JST*/

travellapp.Views = travellapp.Views || {};

(function () {
  'use strict';

  travellapp.Views.Journey = Backbone.View.extend({

    template: JST['app/scripts/templates/journey.ejs'],

    el: $('#app'),

    events: {
       'click #newJourneyBtn': 'newJourney',
    },

    _showErrors: function(errors) {
        _.each(errors, function (error) {
            var controlGroup = this.$('.' + error.name);
            controlGroup.addClass('error');
            controlGroup.find('.help-inline').text(error.message);
        }, this);
    },

    _hideErrors: function () {
        this.$('.control-group').removeClass('error');
        this.$('.help-inline').text('');
    },

    getValues: function(){
      to =  $(this.el).find('#to').val();
      from = $(this.el).find('#from').val();
    },

    fetchRoute: function(journeyModel){
        var tr = $Transport();
        tr.fetchConnections(journeyModel.from,journeyModel.to, this._callback.bind(this));
    },

    _callback:function(data){
        window.controller._cacheNewJourney(data);
        this._renderRoutesView(data);
    },

    validate:function(model){
      var errors = [];

      if (!model.to) {
          errors.push({name: 'to', message: 'Please fill the destination field.'});
      };
      if (!model.from) {
          errors.push({name: 'from', message: 'Please fill the departure field.'});
      };

      if (errors.length > 0){
          this._showErrors(errors);
      }else{
        this._hideErrors();
        var controller = this;
        controller.fetchRoute(model);
        controller.timer = setInterval(function() {
            controller.fetchRoute(model);
         }, 1000 * 30);
      }

    },

    newJourney: function(e){
        e.preventDefault();
        this._hideErrors();

        var journeyModel = {};
        journeyModel.to =  $(this.el).find('#to').val();
        journeyModel.from =  $(this.el).find('#from').val();

        clearInterval(this.timer);
        this.validate(journeyModel);
    },



    _renderRoutesView: function(data){
      // console.log(data);
      var journey = $Util()._preprocessData(data);
      var model = new travellapp.Models.Jroute(journey);
      var view = new travellapp.Views.Jroute({model:model});
      $('#jroute').append(view.render().el);
    },

    initialize: function () {
      this.listenTo(this.model, 'change', this.render);
    },

    render: function () {
      this.$el.html(this.template(this.model.toJSON()));
      return this;
    }

  });

})();
