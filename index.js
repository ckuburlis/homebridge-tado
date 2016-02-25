var Service;
var Characteristic;

var https = require('https')
    assign = require('object-assign');

 module.exports = function(homebridge) {
  Service = homebridge.hap.Service;
  Characteristic = homebridge.hap.Characteristic;
  homebridge.registerAccessory('homebridge-tado', 'TADO', TadoAccessory);
}


function TadoAccessory(log, config) {
  this.log = log;
  this.service = 'AirCon';

  this.name = config['name'];
  this.homeID = config['homeID'];
  this.username = config['username'];
  this.password = config['password'];
}

TadoAccessory.prototype.getServices = function() {
  var informationService = new Service.AccessoryInformation();
  var thermostatService = new Service.Thermostat(this.name);

  informationService
  .setCharacteristic(Characteristic.Manufacturer, 'Tado GmbH')
  .setCharacteristic(Characteristic.Model, 'Tado Smart AC Control')
  .setCharacteristic(Characteristic.SerialNumber, 'Tado Serial Number');

  thermostatService.getCharacteristic(Characteristic.TargetTemperature)
  .on('set', this.setTargetTemperature.bind(this));

  thermostatService.getCharacteristic(Characteristic.CurrentHeatingCoolingState)
  .on('set', this.setCurrentHeatingCoolingState.bind(this));


  if (this.stateCommand) {
    thermostatService.getCharacteristic(Characteristic.CurrentTemperature)
    .on('get', this.getCurrentTemperature.bind(this));
    thermostatService.getCharacteristic(Characteristic.TargetTemperature)
    .on('get', this.getTargetTemperature.bind(this));
    thermostatService.getCharacteristic(Characteristic.TemperatureDisplayUnits)
    .on('get', this.getTemperatureDisplayUnits.bind(this));
    thermostatService.getCharacteristic(Characteristic.CurrentRelativeHumidity)
    .on('get', this.getCurrentRelativeHumidity.bind(this));
    thermostatService.getCharacteristic(Characteristic.CoolingThresholdTemperature)
    .on('get', this.getCoolingThresholdTemperature.bind(this));
    thermostatService.getCharacteristic(Characteristic.HeatingThresholdTemperature)
    .on('get', this.getHeatingThresholdTemperature.bind(this));
  };

  return [thermostatService];
}

TadoAccessory.prototype.getCurrentTemperature = function(callback) {
  var accessory = this;

  var options = {
    host: 'my.tado.com',
    path: '/api/v2/homes/' + accessory.homeID + '/zones/1/state?username=' + accessory.username + '&password=' + accessory.password
  };

  responseFunction = function(response) {
    var str = '';

  //another chunk of data has been recieved, so append it to `str`
  response.on('data', function (chunk) {
    str += chunk;
  });

      //the whole response has been recieved, so we just print it out here
      response.on('end', function () {
        var obj = JSON.parse(str);
                callback(obj.sensorDataPoints.insideTemperature.celsius);
      });
  };

  https.request(options, responseFunction).end();
}

TadoAccessory.prototype.getTargetTemperature = function(callback) {
  var accessory = this;

  var options = {
    host: 'my.tado.com',
    path: '/api/v2/homes/' + accessory.homeID + '/zones/1/state?username=' + accessory.username + '&password=' + accessory.password
  };

  responseFunction = function(response) {
    var str = '';

  //another chunk of data has been recieved, so append it to `str`
  response.on('data', function (chunk) {
    str += chunk;
  });

      //the whole response has been recieved, so we just print it out here
      response.on('end', function () {
        var obj = JSON.parse(str);
                callback(obj.setting.temperature.celsius);
      });
  };

  https.request(options, responseFunction).end();
}

TadoAccessory.prototype.getTemperatureDisplayUnits = function(callback) {
  callback(0); //0 for celsius
}


TadoAccessory.prototype.getCurrentRelativeHumidity = function(callback) {
  var accessory = this;

  var options = {
    host: 'my.tado.com',
    path: '/api/v2/homes/' + accessory.homeID + '/zones/1/state?username=' + accessory.username + '&password=' + accessory.password
  };

  responseFunction = function(response) {
    var str = '';

  //another chunk of data has been recieved, so append it to `str`
  response.on('data', function (chunk) {
    str += chunk;
  });

      //the whole response has been recieved, so we just print it out here
      response.on('end', function () {
        var obj = JSON.parse(str);
                callback(obj.sensorDataPoints.humidity.percentage);
      });
  };

  https.request(options, responseFunction).end();
}

TadoAccessory.prototype.getCoolingThresholdTemperature = function(callback) {
  callback(18);
}

TadoAccessory.prototype.getHeatingThresholdTemperature = function(callback) {
  callback(30);
}


TadoAccessory.prototype.setCurrentHeatingCoolingState  = function(state, callback) {
  if (state == 0) {//off
    var accessory = this;

    body={
      "termination": {
        "type": "MANUAL"
      },
      "setting": {
        "power": "OFF",
        "type": "AIR_CONDITIONING"
      }
    };

    body = JSON.stringify(body);

  var options = {
    host: 'my.tado.com',
    path: '/api/v2/homes/' + accessory.homeID + '/zones/1/state?username=' + accessory.username + '&password=' + accessory.password,
    method: 'PUT'
  };

  https.request(options, null).end(body);
  }

  callback(null); //not implemented for anything other than 'off'
}

TadoAccessory.prototype.setTargetTemperature = function(temp, callback) {

  var accessory = this;

  body = {
    "termination": {
      "type": "MANUAL"
    },
    "setting": {
      "swing": "ON",
      "fanSpeed": "AUTO",
      "mode": "COOL",
      "temperature": {
        "celsius": 25
      },
      "power": "ON",
      "type": "AIR_CONDITIONING"
    }
  };

  body = JSON.stringify(body);

  var options = {
    host: 'my.tado.com',
    path: '/api/v2/homes/' + accessory.homeID + '/zones/1/state?username=' + accessory.username + '&password=' + accessory.password,
    method: 'PUT'
  };

  https.request(options, null).end(body);

  callback(null);
}
