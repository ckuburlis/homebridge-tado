homebridge-tadoHeating
======================

Supports triggering Tado Smart Heating from the HomeBridge platform.

This is a fork from original ckuburlis/homebridge-tado which is for AirCon - this fork is adapted for Tado Heating

This fork has also been improved to add the ability to turn the heating on and off.

For reference supports the following commands with Siri:
* "Whats the room temperature", answers "The current temperature is at 21ºc" after obtaining temperature from tado
* "Set the temperature to 22º", answers "Ok X, I've set the Tado to about 22ºC" after setting a manual override temperature on tado to 22º
* "Turn off the heating", answers "Ok, the Tado is off" after setting a manual override to turn off the heating.
* "Turn on the heating", answer "Ok, the Tado is on" after removing any manual overrides so heating will turn on. This will also always revert the tado back to its normal automatic mode.

\* All manual overrides are set with the "Until next mode change" option, so the tado settings will revert back to their normal automatic settings on a mode change (get up/leaving home/going to bed).

Complies with ```Service.Thermostat``` with an additional Characteristic.On

## Installation

1. Install homebridge using: `npm install -g homebridge`
2. Install this plugin using: `npm install -g homebridge-tadoHeating`  (NPM TO BE SET UP - USE THIS GIT IN MEANTIME)
3. Create/update your configuration file. See `sample-config.json` in this repository for a sample.
4. MAKE SURE your config.json is placed in ~/.homebridge (took me ages to work this out :( )

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

