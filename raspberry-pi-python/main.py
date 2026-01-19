#!/usr/bin/env python3

from config import *
from rfid_reader import RFIDReader
from mqtt_client import MQTTClient
from led_controller import LEDController
from buzzer import Buzzer
from display import Display
import time


class LibraryRFIDSystem:

    def __init__(self):
        print("INIT LIBRARY RFID SYSTEM")

        # komponenty
        self.display = Display()
        self.led = LEDController()
        self.buzzer = Buzzer()
        self.rfid = RFIDReader()
        self.mqtt = MQTTClient(
            on_led_change=self.handle_led_change,
            on_response=self.handle_backend_response
        )

        # statusy
        self.card_sent = False
        self.backend_response_received = False
        self.client_data = None

    def handle_led_change(self, color):
        """
        wywolywany gdy backend zarzada zmiany koloru LED

        args:
            color: kolor do ustawienia z: green, red lub off
        """
        if color == 'green':
            self.led.green()
        elif color == 'red':
            self.led.red()
        else:
            self.led.off()

    def handle_backend_response(self, data):
        """
        wywolywany gdy backend wyśle odpowiedź z danymi
        """
        print("- ODPOWIEDZ Z BACKENDU: -")
        print(f"{data}")

        self.client_data = data
        self.backend_response_received = True

        # wyswietl informacje na LCD
        client = data.get('client')
        book = data.get('book')
        borrows = data.get('borrows', [])

        if client:
            # klient znaleziony
            client_name = client.get('name', 'Unknown')
            self.display.show_client_found(client_name)
            time.sleep(2)

        elif book:
            # ksiazka znaleziona
            book_title = book.get('title', 'Unknown')
            self.display.show_book_found(book_title)
            time.sleep(2)
        else:
            # nowa karta - nie jest przypisana
            self.display.show_new_card()

    def connect(self):
        print("\nLaczenie z MQTT brokerem...")
        if not self.mqtt.connect(timeout=10):
            print("\nBLAD: Nie udalo sie polaczyc z MQTT brokerem")
            print("   Sprawdz czy broker jest uruchomiony:")
            print("   docker run -p 1883:1883 eclipse-mosquitto:2.0")
            self.display.show_error()
            return False
        return True

    def reset_state(self):
        self.card_sent = False
        self.backend_response_received = False
        self.client_data = None

    def run(self):
        if not self.connect():
            return

        print("\nSystem gotowy - nasluchuje kart...")

        while True:
            self.reset_state()

            self.led.green()
            self.display.show_waiting_for_card()
            print("\nLED ZIELONY - Mozna przylozyc karte")

            card_data = self.rfid.read_single_card()

            if not card_data:
                print("\nNie udalo sie odczytac karty")
                self.buzzer.beep_error()
                self.display.show_error()
                time.sleep(2)
                continue

            self.buzzer.beep_success()
            self.led.red()
            self.display.show_card_detected(card_data['uid_hex'])
            print("\nLED CZERWONY - Przetwarzam karte...")

            print("\nWysylam dane karty do backendu...")
            if not self.mqtt.publish_scan(card_data):
                print("\nNie udalo sie wyslac danych przez MQTT")
                self.buzzer.beep_error()
                self.display.show_error()
                time.sleep(2)
                continue

            self.card_sent = True
            print("\nDane karty wyslane do backendu")
            print("\nCzekam na odpowiedz z backendu...")

            timeout = 10
            start_time = time.time()

            while not self.backend_response_received and (time.time() - start_time) < timeout:
                time.sleep(0.1)

            if self.backend_response_received:
                print("\nOtrzymano odpowiedz z backendu!")
                self.buzzer.beep_success()
                time.sleep(2)
            else:
                print("\nTimeout: Brak odpowiedzi z backendu w ciagu 10 sekund")
                print("Sprawdz czy backend jest uruchomiony i obsluguje MQTT")
                self.display.show_error()
                time.sleep(2)

    def cleanup(self):
        self.led.off()
        self.display.cleanup()
        self.mqtt.disconnect()
        GPIO.cleanup()


def main():
    system = LibraryRFIDSystem()

    try:
        system.run()

    except KeyboardInterrupt:
        print("\nPrzerwano przez uzytkownika")

    except Exception as e:
        print(f"\nNIEOCZEKIWANY BLAD: {e}")
        import traceback
        traceback.print_exc()

    finally:
        system.cleanup()


if __name__ == "__main__":
    main()
