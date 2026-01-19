#!/usr/bin/env python3
"""
rfid rc522 reader module
reads single card and returns uid
"""

from config import *
import time
from datetime import datetime
from mfrc522 import MFRC522


class RFIDReader:
    """rfid reader handler"""

    def __init__(self):
        """initialize rfid reader"""
        self.reader = MFRC522()
        print("Czytnik RFID zainicjalizowany")

    def wait_for_card(self):
        """
        wait for card and return uid

        returns:
            dict: uid_bytes, uid_hex, uid_int, timestamp
            none: if card read failed
        """
        print("\nOczekiwanie na przylozenie karty RFID...")

        card_logged = False
        last_seen_time = 0
        card_data = None

        while True:
            now = time.time()
            (status, tag_type) = self.reader.MFRC522_Request(self.reader.PICC_REQIDL)

            if status == self.reader.MI_OK:
                (status_uid, uid) = self.reader.MFRC522_Anticoll()

                if status_uid == self.reader.MI_OK:
                    # update last seen time
                    last_seen_time = now

                    # card detected after absence
                    if not card_logged:
                        card_logged = True

                        # convert uid to different formats
                        uid_int = 0
                        for i in range(len(uid)):
                            uid_int += uid[i] << (i * 8)

                        uid_hex = "".join([f"{x:02X}" for x in uid])
                        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

                        card_data = {
                            'uid_bytes': list(uid),
                            'uid_hex': uid_hex,
                            'uid_int': uid_int,
                            'timestamp': timestamp
                        }
                        
                        print("\nKarta wykryta!")
                        print(f"   Czas:      {timestamp}")
                        print(f"   UID (hex): {uid_hex}")
                        print(f"   UID (int): {uid_int}")

                        return card_data


    def read_single_card(self):
        """
        read single card and finish

        returns:
            dict: card data with uid_hex, uid_int, timestamp
        """
        return self.wait_for_card()


if __name__ == "__main__":
    print("\nTEST RFID READER \n")

    try:
        reader = RFIDReader()
        card_data = reader.read_single_card()

        if card_data:
            print("\nODCZYTANE DANE")
            print(f"UID Hex: {card_data['uid_hex']}")
            print(f"UID Int: {card_data['uid_int']}")
            print(f"Czas:    {card_data['timestamp']}")
        else:
            print("\nNie udalo sie odczytac karty")

    except KeyboardInterrupt:
        print("\n\nPrzerwano przez uzytkownika")

    finally:
        GPIO.cleanup()
        print("GPIO wyczyszczone\n")
