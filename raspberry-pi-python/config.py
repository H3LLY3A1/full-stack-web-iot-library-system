#!/usr/bin/env python3
# pylint: disable=no-member

import RPi.GPIO as GPIO

GPIO.setmode(GPIO.BCM)
GPIO.setwarnings(False)

# buzzer
buzzerPin = 23
GPIO.setup(buzzerPin, GPIO.OUT)
GPIO.output(buzzerPin, 1)

# ws2812 led pin
ws2812pin = 18

# button red (cancel)
buttonRed = 5
GPIO.setup(buttonRed, GPIO.IN, pull_up_down=GPIO.PUD_UP)

# mqtt configuration
MQTT_BROKER = "localhost"  # TODO change to backend IP if not local
MQTT_PORT = 1883
MQTT_CLIENT_ID = "raspberry_pi_rfid_reader"

# mqtt topics
MQTT_TOPIC_SCAN = "raspberry/rfid/scan"
MQTT_TOPIC_CANCEL = "raspberry/rfid/cancel"
MQTT_TOPIC_RESPONSE = "raspberry/rfid/response"
MQTT_TOPIC_LED = "raspberry/led"

# rfid configuration
# time in seconds to consider card removed
CARD_RELEASE_DELAY = 1.0  

# ws2812 led configuration
LED_COUNT = 8
LED_PIN = ws2812pin
LED_BRIGHTNESS = 1.0 / 32

# led colors (RGB)
COLOR_GREEN = (0, 255, 0)
COLOR_RED = (255, 0, 0)
COLOR_OFF = (0, 0, 0)


def configInfo():
    print('only configuration file\n')


if __name__ == "__main__":
    configInfo()
