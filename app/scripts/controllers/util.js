(function (global, $) {
  'use strict';

  var Util = function(){
      return new Util.init();
  };

  Util.prototype = {
    _preprocessData: function(data){
      var journey = {
        connections: []
      };
      _.each(data.connections, function(connection, key){
          try{
              var jCo ={departureTime:'', departureStation:'', duration:'', destinationTime:'', destinationStation:'', train:'', stations:[]};
              jCo.departureTime  =
                ((moment(connection.from.departure).hours() > 9 ? moment(connection.from.departure).hours() : '0' + moment(connection.from.departure).hours().toString()) ) + ':'
              + ((moment(connection.from.departure).minutes() > 9 ? moment(connection.from.departure).minutes() : '0' + moment(connection.from.departure).minutes().toString()));

              jCo.departureStation = connection.from.station.name   +  (connection.from.platform ? "(Pl. " + connection.from.platform + ")":"");

              jCo.duration = '';
              if (parseInt(connection.duration.split('d')[0]) > 0){
                jCo.duration +=  parseInt(connection.duration.split('d')[0]) + 'd:';
              }
              if (parseInt(connection.duration.split('d')[1].split(':')[0]) > 0) {
                 jCo.duration += parseInt(connection.duration.split('d')[1].split(':')[0]) +'h:' +
                 connection.duration.split('d')[1].split(':')[1] + "'";
               }else{
                 jCo.duration += connection.duration.split('d')[1].split(':')[1] +"'";
               };

               jCo.destinationTime  =
                 ((moment(connection.to.arrival).hours() > 9 ? moment(connection.to.arrival).hours() : '0' + moment(connection.to.arrival).hours().toString()) ) + ':'
               + ((moment(connection.to.arrival).minutes() > 9 ? moment(connection.to.arrival).minutes() : '0' + moment(connection.to.arrival).minutes().toString()));

               jCo.destinationStation  = connection.to.station.name  +  (connection.to.platform ? "(Pl. " + connection.to.platform + ")":"");

               if (connection.sections.length === 1){
                 if (connection.sections[0].journey !== null){
                     jCo.train = connection.sections[0].journey.name;
                 }
               };

              _.each(connection.sections, function(section, key){
                    try{
                        var jCoSection = {departureTime:'', departureStation:'',destinationTime:'', destinationStation:'', train:''};
                        jCoSection.departureTime =
                                  (moment(section.departure.departure).hours() > 9 ? moment(section.departure.departure).hours() : '0' + moment(section.departure.departure).hours().toString()) + ':' +
                                  (moment(section.departure.departure).minutes() > 9 ? moment(section.departure.departure).minutes() : '0' + moment(section.departure.departure).minutes().toString());

                        jCoSection.departureStation =  (section.departure.station != null ? section.departure.station.name  : '') + (section.departure.platform ? "(Pl. " + section.departure.platform + ")":"");
                        jCoSection.destinationStation = (section.arrival.station != null ? section.arrival.station.name : '') +  (section.arrival.platform ? "(Pl. " + section.arrival.platform + ")":"");
                        jCoSection.train = (section.journey != null) ? section.journey.name : '';

                        jCo.stations.push(jCoSection);
                    }catch(e){

                    }
              });
              journey.connections.push(jCo);
          }catch(e){

          }
      });
      return journey;
    }
  };

  Util.init = function(){
      var self = this;
  };

  Util.init.prototype = Util.prototype;

  global.Util = global.$Util = Util;
})(window, window.jquery);
