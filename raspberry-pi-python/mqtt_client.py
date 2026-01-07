#!/usr/bin/env python3

import paho.mqtt.client as mqtt
import json
import time
from config import *


class MQTTClient:
    """mqtt client handler"""

    def __init__(self, on_led_change=None, on_response=None):
        """
        initialize mqtt client

        args:
            on_led_change: callback for led color changes from backend
                          signature: on_led_change(color: str)
            on_response: callback for backend responses
                        signature: on_response(data: dict)
        """
        self.client = mqtt.Client(client_id=MQTT_CLIENT_ID)
        self.client.on_connect = self._on_connect
        self.client.on_message = self._on_message
        self.connected = False

        self.on_led_change = on_led_change
        self.on_response = on_response

        print("Klient MQTT zainicjalizowany")

    def _on_connect(self, client, userdata, flags, rc):
        """callback on broker connection"""
        if rc == 0:
            self.connected = True
            print(f"Polaczono z MQTT brokerem: {MQTT_BROKER}:{MQTT_PORT}")

            # subscribe to backend response topics
            self.client.subscribe(MQTT_TOPIC_LED)
            self.client.subscribe(MQTT_TOPIC_RESPONSE)
            print(f"Subskrybowano: {MQTT_TOPIC_LED}")
            print(f"Subskrybowano: {MQTT_TOPIC_RESPONSE}")
        else:
            print(f"Blad polaczenia z MQTT brokerem. Kod: {rc}")
            self.connected = False

    def _on_message(self, client, userdata, msg):
        """callback on mqtt message received"""
        topic = msg.topic

        try:
            payload = json.loads(msg.payload.decode())
        except json.JSONDecodeError:
            print(f"Nie udalo sie zdekodowac JSON z topic: {topic}")
            return

        print(f"\nOtrzymano wiadomosc MQTT:")
        print(f"   Topic:   {topic}")
        print(f"   Payload: {json.dumps(payload, indent=2)}")

        # handle led color change
        if topic == MQTT_TOPIC_LED:
            color = payload.get('color', 'unknown')
            print(f"Backend zarzadal zmiany LED na: {color.upper()}")
            if self.on_led_change:
                self.on_led_change(color)

        # handle backend response
        elif topic == MQTT_TOPIC_RESPONSE:
            print(f"Backend wyslal odpowiedz z danymi karty/klienta")
            if self.on_response:
                self.on_response(payload)

    def connect(self, timeout=10):
        """
        connect to mqtt broker

        args:
            timeout: max connection wait time in seconds

        returns:
            bool: true if connected, false otherwise
        """
        try:
            print(f"Laczenie z MQTT brokerem {MQTT_BROKER}:{MQTT_PORT}...")
            self.client.connect(MQTT_BROKER, MQTT_PORT, 60)
            self.client.loop_start()

            # wait for connection
            start_time = time.time()
            while not self.connected and (time.time() - start_time) < timeout:
                time.sleep(0.1)

            if self.connected:
                return True
            else:
                print(f"Timeout podczas laczenia z MQTT brokerem")
                return False

        except Exception as e:
            print(f"Blad podczas laczenia z MQTT: {e}")
            return False

    def disconnect(self):
        """disconnect from mqtt broker"""
        if self.connected:
            self.client.loop_stop()
            self.client.disconnect()
            self.connected = False
            print("Rozlaczono z MQTT brokerem")

    def publish_scan(self, card_data):
        """
        publish scanned card info

        args:
            card_data: dict with card data (uid_hex, uid_int, timestamp)

        returns:
            bool: true if published, false otherwise
        """
        if not self.connected:
            print("Nie polaczono z MQTT brokerem, nie mozna wyslac danych")
            return False

        # prepare data to send (backend expects uid)
        message = {
            'uid': card_data['uid_hex'],
            'uid_int': card_data['uid_int'],
            'timestamp': card_data['timestamp']
        }

        try:
            payload = json.dumps(message)
            result = self.client.publish(MQTT_TOPIC_SCAN, payload)

            if result.rc == mqtt.MQTT_ERR_SUCCESS:
                print(f"\nWyslano dane karty do backendu:")
                print(f"   Topic: {MQTT_TOPIC_SCAN}")
                print(f"   UID:   {message['uid']}")
                return True
            else:
                print(f"Blad podczas wysylania MQTT. Kod: {result.rc}")
                return False

        except Exception as e:
            print(f"Blad podczas publikowania MQTT: {e}")
            return False

    def publish_cancel(self):
        """
        publish scan cancellation

        returns:
            bool: true if published, false otherwise
        """
        if not self.connected:
            print("Nie polaczono z MQTT brokerem")
            return False

        try:
            message = json.dumps({})
            result = self.client.publish(MQTT_TOPIC_CANCEL, message)

            if result.rc == mqtt.MQTT_ERR_SUCCESS:
                print(f"\nWyslano sygnal anulowania do backendu")
                return True
            else:
                print(f"Blad podczas wysylania MQTT. Kod: {result.rc}")
                return False

        except Exception as e:
            print(f"Blad podczas publikowania MQTT: {e}")
            return False


if __name__ == "__main__":
    print("\nTEST MQTT CLIENT\n")

    def test_led_callback(color):
        print(f"LED Callback: Zmieniam kolor na {color}")

    def test_response_callback(data):
        print(f"Response Callback: Otrzymano dane: {data}")

    try:
        mqtt_client = MQTTClient(
            on_led_change=test_led_callback,
            on_response=test_response_callback
        )

        if mqtt_client.connect():
            print("\nTest polaczenia: SUKCES")

            test_card = {
                'uid_hex': 'AABBCCDD',
                'uid_int': 2864434397,
                'timestamp': '2025-12-23 10:30:00'
            }

            mqtt_client.publish_scan(test_card)

            print("\nCzekam 5 sekund na odpowiedz z backendu...")
            time.sleep(5)

        else:
            print("\nTest polaczenia: NIEPOWODZENIE")

    except KeyboardInterrupt:
        print("\n\nPrzerwano przez uzytkownika")

    finally:
        mqtt_client.disconnect()
        print("Test zakonczony\n")
