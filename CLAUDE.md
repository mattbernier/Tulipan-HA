# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

This is a **Home Assistant** configuration directory (version 2026.5.0) for a home named **Tulipan**, located in Puerto Rico (timezone: `America/Puerto_Rico`, US customary units). The configuration manages a large smart home with ~28 rooms/areas across multiple floors, a pool/terrace, and a pool bar.

## Applying Changes

Changes to YAML files take effect after reloading or restarting Home Assistant:

```bash
# Validate configuration before applying
ha core check

# Reload automations/scripts/scenes without full restart (from HA UI or CLI)
# Developer Tools → YAML → Reload Automations / Scripts / Scenes

# Full restart (required for configuration.yaml changes)
ha core restart
```

Changes to custom component Python files require a full HA restart.

## Configuration Structure

- `configuration.yaml` — Main config; includes automations, scripts, and scenes via `!include`
- `automations.yaml` — All automations (managed by the HA UI automation editor)
- `scripts.yaml` — Reusable scripts (terrace light presets, Sonos TTS)
- `scenes.yaml` — Saved entity states (master bedroom blind positions, etc.)
- `secrets.yaml` — Secret values referenced via `!secret`; currently only a placeholder
- `custom_components/` — HACS and manually installed integrations
- `zigbee2mqtt/` — Zigbee2MQTT add-on configuration (channel 11, TCP coordinator at `192.168.4.118:6638`)
- `esphome/` — ESPHome device configs (one archived device)
- `blueprints/` — Automation blueprints
- `themes/` — Lovelace UI themes
- `www/` — Files served at `/local/` in the HA frontend

## Physical Layout

The home has two floors plus outdoor/pool areas. HA area IDs are shown in parentheses where they differ from the name.

**Ground Floor (1st Floor)**
- Front Porch (`front_porch`) — doorbell, overhead light
- Garage (`garage`) — main lights, exterior lights; auto-opens for Matt via geofence
- Back Entry (`back_entry`) — main lights
- Hallway (`hallway`) — garage hallway light
- Kitchen (`kitchen`) — Govee under-cabinet and above-cabinet LED strips, Lutron Pico
- Dining Room (`dining_room`) — chandelier
- Living Room (`living_room`) — main lights, LED strip, AC
- Family Room (`family_room`) — main lights, Govee lamp, AC, Sonos, LG TV + FireTV, Lutron Pico
- 1st Floor Bathroom (`1st_floor_bathroom`) — vanity lights
- Pantry (`pantry`) — main lights, occupancy sensor
- Closet (`closet`) — 1st floor closet light
- Stairs (`stairs`) — main lights, Lutron Pico

**Second Floor (Upstairs)**
- Upstairs Hallway (`upstairs_hallway`) — main lights, Lutron Pico
- Office (`office`) — main lights, Govee lamp
- Master Bedroom (`bedroom`) — ceiling fan, sconces, 4 SmartWings motorized blinds (back window, left door, right door, right window), AC, LG TV + FireTV, Kami's and Matt's Lutron lamp Picos, Zooz ZEN32 scene controller, Lutron lighting Picos
- Master Bathroom (`master_bathroom`) — AC, Sonos speaker, Lutron audio Pico
- Master Closet (`master_closet`) — main lights, LED strip, occupancy sensor
- Bedroom Terrace (`terrace`) — terrace off master bedroom
- Upper Terrace (`upper_terrace`) — lights
- Katie's Bedroom (`katies_bedroom`) — main lights, nightstand lamp, LG TV + FireTV, Lutron Pico
- Matty's Room/Bedroom (`mattys_room` / `mattys_bedroom`) — AC, LG TV + FireTV, main lights, nightstand lamp, Lutron Pico

**Outdoor / Pool**
- Terrace (`terrace_2`) — covered terrace with 2 ceiling fans, 4 wall-mount lights (left/right outer + side), Zooz ZEN32 scene controller; referred to as "terrace" in automations
- Pool (`pool`) — pool, Sonos speaker, Pool Bar FireTV
- Pool Bar (`pool_bar`) — outdoor bar structure with recessed lights, ceiling fan, TV, Sonos, Lutron Pico, bathhouse/hallway lighting
- Exterior (`exterior`) — garage exterior lights, wall lights

> Note: "Matty's Room" and "Matty's Bedroom" are two separate HA areas covering the same physical bedroom; the Room area holds AV/climate devices and the Bedroom area holds lighting. AC entity naming uses `midea_ac_lan` serial-number-based IDs (e.g., `climate.151732606852810_climate` for Matty's room AC).

## Entity Counts (as of 2026-05-14)

1,094 total entities across 39 domains:

| Domain | Count | Domain | Count |
|---|---|---|---|
| sensor | 364 | media_player | 36 |
| switch | 134 | automation | 36 |
| light | 98 | fan | 9 |
| update | 82 | cover | 8 |
| binary_sensor | 67 | climate | 5 |
| button | 61 | lock | 5 |
| number | 54 | device_tracker | 5 |
| select | 53 | scene | 4 |

## Protocol / Integration Stack

| Protocol | Integration | Notes |
|---|---|---|
| Zigbee | Zigbee2MQTT → MQTT (Mosquitto) | Coordinator via TCP serial adapter |
| Z-Wave | Z-Wave JS | Zooz ZEN32 scene controllers (terrace, master bedroom) |
| Lutron Caséta | `lutron_caseta` | Hub ID `06919751`; Pico remotes for family room, pool bar, master bedroom |
| Midea AC (local) | `midea_ac_lan` | 5 AC units (family room, living room, master bedroom, master bath, Matty's room) |
| Local Tuya | `localtuya` | Tuya devices on LAN without cloud |
| MQTT | Mosquitto broker | Used by Zigbee2MQTT and other add-ons |
| Matter/Thread | Built-in | Thread border router active |

## Key Devices & Entity Patterns

- **Lights**: Govee LEDs (`light.h6076`), Lutron dimmers, Zigbee bulbs via Z2M, Tuya/LocalTuya strips
- **Fans**: `fan.terrace_fans`, `fan.tulipan_pool_bar_fan`
- **Climate**: `climate.150633095XXXXXXXXX_climate` — Midea AC unit entity IDs are based on device serial numbers
- **Covers**: SmartWings motorized blinds (`cover.smartwings_*`, `cover.master_bedroom_*`)
- **Solar/Energy**: `sensor.bernier_matthew_carl_solar_power` → integration sensor → `utility_meter.solar_energy_daily`
- **EG4 battery/inverter**: `eg4_web_monitor` integration (local polling)
- **Presence/tracking**: `device_tracker.matts_iphone` for Matt; `notify.mobile_app_matts_iphone` and `notify.mobile_app_kamis_iphone` for push notifications
- **Security**: Alarm.com (`alarmdotcom`), TTLock smart locks, Tapo cameras

## Automation Patterns

Automations in `automations.yaml` follow these common patterns:

- **Zooz Z-Wave scene controllers**: Trigger on `zwave_js` → `event.value_notification.central_scene`, with `property_key` (scene button number) and `value` (1=single, 2=double, 4=triple press)
- **Lutron Pico remotes**: Trigger via `lutron_caseta` device events (`subtype: on/off/raise/lower`)
- **Time-based**: Use `trigger: time` with `at:` or `trigger: sun` with `event: sunset/sunrise`
- **Presence-based**: `device_tracker.matts_iphone` state changes against named zones (e.g., `350 Calle Tulipan Tight Zone`)
- **"Good Night" scene**: Triggered from both Zooz terrace (scene 004) and master bedroom (scene 004) controllers; turns off all lights, fans, media, and sets AC to 74°F

The `input_boolean.under_cabinet_ran_today` helper is used as a daily flag to prevent the under-cabinet blue light automation from firing more than once per evening.

## Installed Custom Components (via HACS)

| Component | Purpose |
|---|---|
| `adaptive_lighting` | Auto-adjusts color temperature and brightness on "1st Floor" switch |
| `alarmdotcom` | Alarm.com security panel, sensors, locks |
| `cable_modem_monitor` | Polls cable modem stats locally (10-min default interval) |
| `eg4_web_monitor` | EG4 battery inverter monitoring via local LAN + Modbus |
| `eero` | Eero WiFi mesh (cloud polling) |
| `ge_home` | GE connected appliances (washer, dryer, oven/cooktop) |
| `goveelife` | Govee LED lights |
| `localtuya` | Local LAN control of Tuya devices |
| `midea_ac_lan` | Local LAN control of Midea AC units |
| `smartcar` | Vehicle integration |
| `tapo` / `tapo_control` | TP-Link Tapo cameras and smart devices |
| `tesla_custom` | Tesla vehicle integration |
| `tineco` | Tineco vacuum integration |
| `ttlock` | TTLock Bluetooth/cloud smart locks |
| `wundergroundpws` | Personal weather station reporting (station ICAGUA86) |
| `flightradar24` | Flight radar sensor |
| `frosted_glass_manager` | Lovelace dashboard card helper |

## Zigbee2MQTT

The Z2M add-on connects via TCP to a remote Zigbee coordinator at `192.168.4.118:6638` (zstack adapter). The frontend runs on port 8099. Device-specific overrides go in `zigbee2mqtt/configuration.yaml` under `devices:`.

## Secrets Management

Sensitive values should use `!secret <key>` in YAML files and be defined in `secrets.yaml`. The current `secrets.yaml` is a placeholder — real credentials (AC passwords, API keys, etc.) are stored in the `.storage/` entries managed by the UI config flows, not in flat files.
