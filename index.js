var Service;
var Characteristic;

var https = require('https'),
    assign = require('object-assign');

 module.exports = function(homebridge) {
  Service = homebridge.hap.Service;
  Characteristic = homebridge.hap.Characteristic;
  homebridge.registerAccessory('homebridge-tado', 'TADO', TadoAccessory);
}


function TadoAccessory(log, config) {
  var accessory = this;
  this.log = log;
  this.service = 'AirCon';

  this.name = config['name'];
  this.homeID = config['homeID'];
  this.username = config['username'];
  this.password = config['password'];

  accessory.log("Tado setup;");
  accessory.log("username:" + this.username);
  accessory.log("password:" + this.password);
  accessory.log("homeID:" + this.homeID);

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

  accessory.log("Getting room temperature");

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
        accessory.log("Room temperature is " + obj.sensorDataPoints.insideTemperature.celsius + "ºc");
        callback(null, JSON.stringify(obj.sensorDataPoints.insideTemperature.celsius));
      });
  };

  https.request(options, responseFunction).end();
}

TadoAccessory.prototype.getTargetTemperature = function(callback) {
  var accessory = this;

  accessory.log("Getting target temperature");

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
                accessory.log("Target temperature is " + obj.setting.temperature.celsius + "ºc");
                callback(null, JSON.stringify(obj.setting.temperature.celsius));
      });
  };

  https.request(options, responseFunction).end();
}

TadoAccessory.prototype.getTemperatureDisplayUnits = function(callback) {
  var accessory = this;
  accessory.log("getting temperature display units = 0");
  callback(null, "0"); //0 for celsius
}


TadoAccessory.prototype.getCurrentRelativeHumidity = function(callback) {
  var accessory = this;
  accessory.log("Getting humidity");

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
        accessory.log("Humidity is " + obj.sensorDataPoints.humidity.percentage + "%");
        callback(null, JSON.stringify(obj.sensorDataPoints.humidity.percentage));
      });
  };

  https.request(options, responseFunction).end();
}

TadoAccessory.prototype.getCoolingThresholdTemperature = function(callback) {
  var accessory = this;
  accessory.log("Cooling threshold temperature is 18");
  callback(null, "18");
}

TadoAccessory.prototype.getHeatingThresholdTemperature = function(callback) {
  var accessory = this;
  accessory.log("Heating threshold temperature is 30");
  callback(null, "30");
}


TadoAccessory.prototype.setCurrentHeatingCoolingState  = function(state, callback) {
  var accessory = this;
  if (state == 0) {//off
    accessory.log("Turn off");

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
    path: '/api/v2/homes/' + accessory.homeID + '/zones/1/overlay?username=' + accessory.username + '&password=' + accessory.password,
    method: 'PUT'
  };

  https.request(options, null).end(body);
  } else {
    accessory.log("Turn on");
  }

  callback(null); //not implemented for anything other than 'off'
}

TadoAccessory.prototype.setTargetTemperature = function(temp, callback) {
 var accessory = this;
 accessory.log("Setting temperature to " + temp + "º");

  body = {
    "termination": {
      "type": "MANUAL"
    },
    "setting": {
      "swing": "ON",
      "fanSpeed": "AUTO",
      "mode": "COOL",
      "temperature": {
        "celsius": 0
      },
      "power": "ON",
      "type": "AIR_CONDITIONING"
    }
  };

  body.setting.temperature.celsius=temp;

  body = JSON.stringify(body);

  var options = {
    host: 'my.tado.com',
    path: '/api/v2/homes/' + accessory.homeID + '/zones/1/overlay?username=' + accessory.username + '&password=' + accessory.password,
    method: 'PUT'
  };

  https.request(options, null).end(body);

  callback(null);
}
