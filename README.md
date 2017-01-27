homebridge-tado
==============

Supports triggering Tado Smart AC from the HomeBridge platform.

Complies with ```Service.Thermostat```

## Installation

1. Install homebridge using: `npm install -g homebridge`
2. Install this plugin using: `npm install -g homebridge-tado`
3. Update your configuration file. See `sample-config.json` in this repository for a sample.

**install from git (latest version): `sudo npm install -g https://github.com/ckuburlis/homebridge-tado.git`

## Config file

```
"accessories": [
{
  "accessory": "TADO",
  "name": "Tado",
  "homeID": 12345,
  "maxValue": 31,
  "minValue": 16,
  "zone": 1,
  "username": "xxxxx@xxxx.com",
  "password": "XXXXX",
  "useFanSpeed": "AUTO",
  "useSwing": false,
  "tadoMode": "MANUAL",
  "useFahrenheit": false
}
]
```
## Configuration

|             Parameter            |                       Description                       | Required |  Default  |
| -------------------------------- | ------------------------------------------------------- |:--------:|:---------:|
| `accessory`                      | always "TADO"                                           |     ✓    |      -    |
| `name`                           | name of the accessory                                   |     ✓    |      -    |
| `homeID`                         | see below ```Finding HomeID```                          |     ✓    |      -    |
| `maxValue`                       | Max temprature of your AC (in Tado app)                 |          |      31   |
| `minValue`                       | Min temprature of your AC (in Tado app)                 |          |      16   |
| `zone`                           | zone number of your Tado                                |          |      1    |
| `username`                       | your tado account username (something@something.com)    |     ✓    |      -    |
| `password`                       | your tado account password                              |     ✓    |      -    |
| `useFanSpeed`                    | your AC settings on Tado app. can be "AUTO"/"LOW"/"MEDIUIM"/HIGH" or false for no fanspeed option         |         |      false    |
| `useSwing`                       | your AC settings on Tado app. can be "ON"/"OFF" or false for no swing option  |          |     false    |
| `tadoMode`                       | default mode for the commands to be sent with. can be "MANUAL" for manual control until ended by the user, or "TADO_MODE" for manual control until next schedule change in tado app .          |             |  "MANUAL" |
| `useFahrenheit`                  | true for using Fahrenheit or false for Celsius          |     ✓    |      -    |

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

