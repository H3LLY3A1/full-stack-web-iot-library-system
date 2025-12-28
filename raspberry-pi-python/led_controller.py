#!/usr/bin/env python3

import board
import neopixel
import time
from config import *


class LEDController:

    def __init__(self):
        try:
            self.pixels = neopixel.NeoPixel(
                board.D18,
                LED_COUNT,
                brightness=LED_BRIGHTNESS,
                auto_write=False
            )
            self.current_color = COLOR_OFF
            self.off()
            print("Kontroler LED zainicjalizowany")
        except Exception as e:
            print(f"Blad inicjalizacji LED: {e}")
            self.pixels = None

    def set_color(self, color):
        """
        ustawia kolor wszystkich diod led

        args:
            color: Tuple (R, G, B) lub string ('green', 'red', 'off')
        """
        if self.pixels is None:
            return

        # convert string for tuple RGB
        if isinstance(color, str):
            color_map = {
                'green': COLOR_GREEN,
                'red': COLOR_RED,
                'off': COLOR_OFF
            }
            color = color_map.get(color.lower(), COLOR_OFF)

        try:
            self.pixels.fill(color)
            self.pixels.show()
            self.current_color = color
        except Exception as e:
            print(f"Blad ustawiania koloru LED: {e}")

    def green(self):
        """led na zielony (gotowy do skanowania)"""
        self.set_color(COLOR_GREEN)

    def red(self):
        """led na czerwony (przetwarzanie)"""
        self.set_color(COLOR_RED)

    def off(self):
        """wylacz wszystkie ledy"""
        self.set_color(COLOR_OFF)

    def pulse(self, color=COLOR_GREEN, duration=0.2):
        """
        krotki puls swietlny

        args:
            color: Kolor pulsu (domyslnie zielony)
            duration: czas trwania pulsu w sekundach
        """
        if self.pixels is None:
            return

        old_color = self.current_color
        self.set_color(color)
        time.sleep(duration)
        self.set_color(old_color)

    def cleanup(self):
        """wylaczenie wszystkich diod"""
        self.off()


if __name__ == "__main__":
    print("\nTEST LED\n")

    try:
        led = LEDController()

        print("\nTest 1: Zielony")
        led.green()
        time.sleep(2)

        print("\nTest 2: Czerwony")
        led.red()
        time.sleep(2)

        print("\nTest 3: Puls zielony")
        led.green()
        time.sleep(1)
        led.pulse()
        time.sleep(1)

        print("\nTest 4: Wylaczenie")
        led.off()

        print("\nTest zakonczony")

    except KeyboardInterrupt:
        print("\n\nPrzerwano przez uzytkownika")

    finally:
        led.cleanup()
        GPIO.cleanup()
        print("Cleanup wykonany\n")
