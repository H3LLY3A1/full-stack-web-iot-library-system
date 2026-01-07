#!/usr/bin/env python3

import RPi.GPIO as GPIO
import time
from config import buzzerPin


class Buzzer:

    def __init__(self):
        # setup done in config.py
        print("Buzzer zainicjalizowany")

    def beep(self, duration=0.1):
        """
        krotki sygnal dzwiekowy

        Args:
            duration: Czas trwania dzwieku w sekundach
        """
        GPIO.output(buzzerPin, 0)  # active low
        time.sleep(duration)
        GPIO.output(buzzerPin, 1)  

    def beep_success(self):
        """sukces (krotki beep)"""
        self.beep(0.1)

    def beep_error(self):
        """blad (dwa krotkie beepy)"""
        self.beep(0.1)
        time.sleep(0.1)
        self.beep(0.1)

    def beep_cancel(self):
        """ anulowanie (dlugi beep)"""
        self.beep(0.3)


if __name__ == "__main__":
    print("\nTEST BUZZER\n")

    try:
        buzzer = Buzzer()

        print("Test 1: Beep zwykly")
        buzzer.beep()
        time.sleep(1)

        print("Test 2: Beep sukcesu")
        buzzer.beep_success()
        time.sleep(1)

        print("Test 3: Beep bledu")
        buzzer.beep_error()
        time.sleep(1)

        print("Test 4: Beep anulowania")
        buzzer.beep_cancel()

        print("\nTest zakonczony")

    except KeyboardInterrupt:
        print("\nPrzerwano przez uzytkownika")

    finally:
        GPIO.cleanup()
        print("Cleanup wykonany\n")
