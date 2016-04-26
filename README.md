homebridge-tado FOR HEATING
===========================

Supports triggering Tado Smart HEATING from the HomeBridge platform.

This is a fork from original ckuburlis/homebridge-tado which is for AirCon - this fork is adapted for Tado Heating

Complies with ```Service.Thermostat```

## Installation

1. Install homebridge using: `npm install -g homebridge`
2. Install this plugin using: `npm install -g homebridge-tado`
3. Update your configuration file. See `sample-config.json` in this repository for a sample.
MAKE SURE config.json is placed in ~/.homebridge (took me ages to work this out :( )

## Configuration

Configuration sample:

```
"accessories": [
{
  "accessory": "TADO",
  "name": "Tado",
  "homeID": "homeID",
  "username": "TadoUsername",
  "password": "TadoPassword"
}
]
```

## Finding HomeID

Your username and password will be the same ones that you login to the Tado App/Website with. Luckily, finding your homeID isn't too hard.

To do this we will use the [old Tado API](http://c-mobberley.com/wordpress/2014/09/28/interacting-with-the-hidden-tado-thermostat-api/), the */getCurrentState* call returns our homeID along with some other data.

Simply amend the URL below so it has your Tado username/password in it then copy paste it into a browser.

`https://my.tado.com/mobile/1.4/getCurrentState?username=ACTUAL_USERNAME&password=ACTUAL_PASSWORD`

This should return something like this (albeit not formatted nicely on one line):

```
{
  "success": true,
  "operation": "HOME",
  "autoOperation": "HOME",
  "operationTrigger": "SYSTEM",
  "insideTemp": 27.08,
  "setPointTemp": 5,
  "controlPhase": "UNDEFINED",
  "boxConnected": null,
  "gwConnected": null,
  "tsConnected": null,
  "currentUserPrivacyEnabled": null,
  "currentUserGeoStale": null,
  "deviceUpdating": false,
  "homeId": 12345,
  "pendingDeviceInstallation": false
}
```

Sift through the json to find the homeId near the end and you're good to go.

