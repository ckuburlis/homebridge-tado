homebridge-tado
==============

Supports triggering Tado Smart AC from the HomeBridge platform.

Complies with ```Service.Thermostat```

## Installation

1. Install homebridge using: `npm install -g homebridge`
2. Install this plugin using: `npm install -g homebridge-tado`
3. Update your configuration file. See `sample-config.json` in this repository for a sample.

## Configuration

Configuration sample:

```
"accessories": [
{
  "accessory": "TADO",
  "name": "Tado",
  "homeID": "homeID",
  "username": "usr",
  "password": "passwd"
}
}
]
```

```Will update instructions with how to find username/password/houseID```
