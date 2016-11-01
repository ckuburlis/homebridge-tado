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
    this.service = 'Heating';

    this.name = config['name'];
    this.homeID = config['homeID'];
    this.username = config['username'];
    this.password = config['password'];
    this.temp = 21;

}

TadoAccessory.prototype.getServices = function() {
    var informationService = new Service.AccessoryInformation();
    var thermostatService = new Service.Thermostat(this.name);

    informationService
        .setCharacteristic(Characteristic.Manufacturer, 'Tado GmbH')
        .setCharacteristic(Characteristic.Model, 'Tado Heating Control')
        .setCharacteristic(Characteristic.SerialNumber, 'Tado Serial Number');

    thermostatService.getCharacteristic(Characteristic.TargetTemperature)
        .setProps({
            maxValue: 30,
            minValue: 18,
            minStep: 1
        })

    .on('set', this.setTargetTemperature.bind(this));

    thermostatService.addCharacteristic(Characteristic.On);

    thermostatService.getCharacteristic(Characteristic.On)
    .on('set', this.setTargetHeatingCoolingState.bind(this));

    thermostatService.getCharacteristic(Characteristic.TargetHeatingCoolingState)
        .on('set', this.setTargetHeatingCoolingState.bind(this));

    thermostatService.addCharacteristic(Characteristic.On);

    thermostatService.getCharacteristic(Characteristic.On)
       .on('set', this.setTargetHeatingCoolingState.bind(this));

    // if (this.stateCommand) {
    thermostatService.getCharacteristic(Characteristic.CurrentTemperature)
        .setProps({
            maxValue: 100,
            minValue: 0,
            minStep: 0.01
        })
        .on('get', this.getCurrentTemperature.bind(this));

    thermostatService.getCharacteristic(Characteristic.TargetTemperature)
        .setProps({
            maxValue: 30,
            minValue: 18,
            minStep: 1
        })
        .on('get', this.getTargetTemperature.bind(this));

    thermostatService.getCharacteristic(Characteristic.TemperatureDisplayUnits)
        .on('get', this.getTemperatureDisplayUnits.bind(this));

    thermostatService.getCharacteristic(Characteristic.TargetHeatingCoolingState)
        .on('get', this.getTargetHeatingCoolingState.bind(this));

    thermostatService.getCharacteristic(Characteristic.CurrentRelativeHumidity)
        .setProps({
            maxValue: 100,
            minValue: 0,
            minStep: 0.01
        })
        .on('get', this.getCurrentRelativeHumidity.bind(this));

    thermostatService.getCharacteristic(Characteristic.CoolingThresholdTemperature)
        .setProps({
            maxValue: 30,
            minValue: 18,
            minStep: 1
        });

    thermostatService.getCharacteristic(Characteristic.CurrentHeatingCoolingState)
        .on('get', this.getCurrentHeatingCoolingState.bind(this));
    // };

    return [thermostatService];
}

TadoAccessory.prototype.getCurrentHeatingCoolingState = function(callback) {
    var accessory = this;

    accessory.log("Getting current state");

    var options = {
        host: 'my.tado.com',
        path: '/api/v2/homes/' + accessory.homeID + '/zones/1/state?username=' + accessory.username + '&password=' + accessory.password
    };

    responseFunction = function(response) {
        var str = '';

        //another chunk of data has been recieved, so append it to `str`
        response.on('data', function(chunk) {
            str += chunk;
        });

        //the whole response has been recieved, so we just print it out here
        response.on('end', function() {
            var obj = JSON.parse(str);
            accessory.log("Current state is " + obj.setting.power);
            if (JSON.stringify(obj.setting.power).match("OFF")) {
                callback(null, Characteristic.CurrentHeatingCoolingState.OFF);
            } else {
                callback(null, Characteristic.CurrentHeatingCoolingState.HEAT);
            }
        });
    };

    https.request(options, responseFunction).end();
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
        response.on('data', function(chunk) {
            str += chunk;
        });

        //the whole response has been recieved, so we just print it out here
        response.on('end', function() {
            var obj = JSON.parse(str);
            accessory.log("Room temperature is " + obj.sensorDataPoints.insideTemperature.celsius + "ºc");
            callback(null, obj.sensorDataPoints.insideTemperature.celsius);
        });
    };

    https.request(options, responseFunction).end();
}

TadoAccessory.prototype.getTargetTemperature = function(callback) {
    var accessory = this;
    accessory.log("Target temperature is " + this.temp + "ºC");

    callback(null, this.temp);
}

TadoAccessory.prototype.getTargetHeatingCoolingState = function(callback) {
    var accessory = this;

    accessory.log("Getting target state");

    var options = {
        host: 'my.tado.com',
        path: '/api/v2/homes/' + accessory.homeID + '/zones/1/state?username=' + accessory.username + '&password=' + accessory.password
    };

    responseFunction = function(response) {
        var str = '';

        //another chunk of data has been recieved, so append it to `str`
        response.on('data', function(chunk) {
            str += chunk;
        });

        //the whole response has been recieved, so we just print it out here
        response.on('end', function() {
            var obj = JSON.parse(str);
            accessory.log("Target state is " + obj.setting.power);
            if (JSON.stringify(obj.setting.power).match("OFF")) {
                callback(null, Characteristic.TargetHeatingCoolingState.OFF);
            } else {
                callback(null, Characteristic.TargetHeatingCoolingState.HEAT);
            }
        });
    };

    https.request(options, responseFunction).end();
};

TadoAccessory.prototype.getTemperatureDisplayUnits = function(callback) {
    var accessory = this;
    accessory.log("getting temperature display units = 0");
    callback(null, Characteristic.TemperatureDisplayUnits.CELSIUS); //0 for celsius
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
        response.on('data', function(chunk) {
            str += chunk;
        });

        //the whole response has been recieved, so we just print it out here
        response.on('end', function() {
            var obj = JSON.parse(str);
            accessory.log("Humidity is " + obj.sensorDataPoints.humidity.percentage + "%");
            callback(null, obj.sensorDataPoints.humidity.percentage);
        });
    };

    https.request(options, responseFunction).end();
}

TadoAccessory.prototype.setTargetHeatingCoolingState = function(state, callback) {
    var accessory = this;
    if (state == 0) { //off
        accessory.log("Turn off");

        //This sets to manual mode OFF until next mode change
        //probably different types could turn off permantently if required
        body = { 
                 "setting": {
                   "type": "HEATING",
                   "power": "OFF"
                 },
                 "termination": {
                   "type": "TADO_MODE"
                 }
               };

        body = JSON.stringify(body);

        var options = {
            host: 'my.tado.com',
            path: '/api/v2/homes/' + accessory.homeID + '/zones/1/overlay?username=' + accessory.username + '&password=' + accessory.password,
            method: 'PUT'
        };

        callback(null);

        https.request(options, null).end(body);
    } else {
        //This will reset back to automatic Tado mode and remove
        //all overlays (aka manual overrides)
        accessory.log("Turn on");
        // this.setTargetTemperature(this.temp, callback);
        body = {};
        body = JSON.stringify(body);
        var options = {
            host: 'my.tado.com',
            path: '/api/v2/homes/' + accessory.homeID + '/zones/1/overlay?username=' + accessory.username + '&password=' + accessory.password,
            method: 'DELETE'
        };

        callback(null);

        https.request(options, null).end(body);
    }

}

TadoAccessory.prototype.setTargetTemperature = function(temp, callback) {
    var accessory = this;
    accessory.log("Setting temperature to " + temp + "º");

    this.temp = temp;

    body = {
              "setting": {
              "type": "HEATING",
              "power": "ON",
              "temperature": {
                "celsius": 21
              }
             },
             "termination": {
             "type": "TADO_MODE"
            }
           };
     
    body.setting.temperature.celsius = this.temp;

    body = JSON.stringify(body);

    var options = {
        host: 'my.tado.com',
        path: '/api/v2/homes/' + accessory.homeID + '/zones/1/overlay?username=' + accessory.username + '&password=' + accessory.password,
        method: 'PUT'
    };

    https.request(options, null).end(body);

    callback(null);
}
