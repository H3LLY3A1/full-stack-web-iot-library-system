#!/usr/bin/env python3
"""
Fake Raspberry Pi - symulacja RFID dla testow bez fizycznego RPI
"""

import paho.mqtt.client as mqtt
import json
import time
import sys

BROKER = "localhost"
PORT = 1883

class FakeRaspberryPi:
    def __init__(self):
        self.client = mqtt.Client()
        self.client.on_connect = self._on_connect
        self.client.on_message = self._on_message
        self.connected = False

    def _on_connect(self, client, userdata, flags, rc):
        if rc == 0:
            self.connected = True
            print(f"[OK] Polaczono z MQTT brokerem: {BROKER}:{PORT}")

            self.client.subscribe("raspberry/led")
            self.client.subscribe("raspberry/rfid/response")
            print("[OK] Subskrybowano: raspberry/led, raspberry/rfid/response")
        else:
            print(f"[ERROR] Blad polaczenia. Kod: {rc}")
            self.connected = False

    def _on_message(self, client, userdata, msg):
        topic = msg.topic

        try:
            payload = json.loads(msg.payload.decode())
        except:
            payload = msg.payload.decode()

        print(f"\n[MQTT] Otrzymano:")
        print(f"  Topic:   {topic}")
        print(f"  Payload: {json.dumps(payload, indent=2) if isinstance(payload, dict) else payload}")

        if topic == "raspberry/led":
            color = payload.get('color', 'unknown') if isinstance(payload, dict) else 'unknown'
            print(f"[LED] Zmiana koloru na: {color.upper()}")

        elif topic == "raspberry/rfid/response":
            self._handle_response(payload)

    def _handle_response(self, data):
        print("- ODPOWIEDZ Z BACKENDU: -")

        uid = data.get('uid')
        client = data.get('client')
        book = data.get('book')
        borrows = data.get('borrows', [])

        print(f"UID karty: {uid}")

        if client:
            print(f"\nKLIENT ZNALEZIONY:")
            print(f"  CardID: {client.get('cardId')}")
            print(f"  Imie:   {client.get('name')}")
            print(f"  Email:  {client.get('email')}")

            print(f"\nWYPOZYCZENIA: {len(borrows)}")
            for i, borrow in enumerate(borrows, 1):
                book_data = borrow.get('book', {})
                print(f"  {i}. {book_data.get('title')} - {book_data.get('author')}")
                print(f"     Wypozyczono: {borrow.get('borrowedAt')}")
                print(f"     Termin zwrotu: {borrow.get('dueDate')}")
        elif book:
            print(f"\nKSIAZKA ZNALEZIONA:")
            print(f"  CardID: {book.get('cardId')}")
            print(f"  Tytul:  {book.get('title')}")
            print(f"  Autor:  {book.get('author')}")
        else:
            print("\nNOWA KARTA - nie przypisana")


    def connect(self):
        try:
            print(f"[*] Laczenie z MQTT brokerem {BROKER}:{PORT}...")
            self.client.connect(BROKER, PORT, 60)
            self.client.loop_start()

            timeout = 5
            start_time = time.time()
            while not self.connected and (time.time() - start_time) < timeout:
                time.sleep(0.1)

            if not self.connected:
                print("[ERROR] Timeout podczas laczenia")
                return False

            return True

        except Exception as e:
            print(f"[ERROR] Nie udalo sie polaczyc: {e}")
            return False

    def scan_card(self, uid):
        if not self.connected:
            print("[ERROR] Nie polaczono z brokerem")
            return

        uid_int = 0
        try:
            uid_clean = uid.replace(' ', '')
            if all(c in '0123456789ABCDEFabcdef' for c in uid_clean):
                uid_int = int.from_bytes(bytes.fromhex(uid_clean), 'little')
        except:
            uid_int = 0

        message = {
            "uid": uid,
            "uid_int": uid_int,
            "timestamp": time.strftime("%Y-%m-%d %H:%M:%S")
        }

        payload = json.dumps(message)
        self.client.publish("raspberry/rfid/scan", payload)

        print(f"\n[SCAN] Wysylam karte: {uid}")
        print(f"  Topic: raspberry/rfid/scan")
        print(f"  Data:  {payload}")

    def cancel_scan(self):
        if not self.connected:
            print("[ERROR] Nie polaczono z brokerem")
            return

        self.client.publish("raspberry/rfid/cancel", "{}")
        print(f"\n[CANCEL] Wyslano sygnal anulowania")

    def disconnect(self):
        if self.connected:
            self.client.loop_stop()
            self.client.disconnect()
            self.connected = False
            print("[OK] Rozlaczono")


def print_help():
    print("""
=== SYMULATOR ODCZYTU RFID ===

Komendy:
  scan <UID>      - skanuj karte (np. 'scan CARDUID-USER-1')
  cancel          - anuluj skanowanie
  help            - pomoc
  quit / exit     - wyjdz

===============================
""")


def main():
    rpi = FakeRaspberryPi()

    if not rpi.connect():
        print("Nie mozna uruchomic symulatora")
        sys.exit(1)

    print_help()

    try:
        while True:
            try:
                cmd = input("\n>>> ").strip()
            except EOFError:
                break

            if not cmd:
                continue

            parts = cmd.split(None, 1)
            command = parts[0].lower()

            if command in ["quit", "exit", "q"]:
                break

            elif command == "help":
                print_help()

            elif command == "scan":
                if len(parts) < 2:
                    print("[ERROR] Uzycie: scan <UID>")
                else:
                    uid = parts[1]
                    rpi.scan_card(uid)

            elif command == "cancel":
                rpi.cancel_scan()

            else:
                print(f"[ERROR] Nieznana komenda: {command}")
                print("Wpisz 'help' aby zobaczyc dostepne komendy")

    except KeyboardInterrupt:
        print("\nPrzerwano przez uzytkownika")

    finally:
        rpi.disconnect()
        print("Zakonczono")


if __name__ == "__main__":
    main()
