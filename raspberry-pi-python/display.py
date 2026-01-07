#!/usr/bin/env python3

import time
import os
from PIL import Image, ImageDraw, ImageFont
import lib.oled.SSD1331 as SSD1331


class Display:
    def __init__(self):
        # stop service ip-oled if working
        os.system('sudo systemctl stop ip-oled.service')

        self.disp = SSD1331.SSD1331()
        self.disp.Init()
        self.disp.clear()

        self.image = Image.new("RGB", (self.disp.width, self.disp.height), "BLACK")
        self.draw = ImageDraw.Draw(self.image)

        try:
            self.font = ImageFont.truetype('./lib/oled/Font.ttf', 11)
            self.font_small = ImageFont.truetype('./lib/oled/Font.ttf', 9)
        except:
            self.font = ImageFont.load_default()
            self.font_small = ImageFont.load_default()

        print("Wyswietlacz OLED zainicjalizowany")

    def clear(self):
        """display cleared"""
        self.draw.rectangle([(0, 0), (self.disp.width, self.disp.height)], fill="BLACK")
        self.disp.ShowImage(self.image, 0, 0)

    def show_waiting_for_card(self):
        self.clear()

        self.draw.text((5, 5), "BIBLIOTEKA", font=self.font, fill="GREEN")

        self.draw.line([(0, 18), (self.disp.width, 18)], fill="GREEN", width=1)

        self.draw.text((5, 25), "Przyloz", font=self.font, fill="WHITE")
        self.draw.text((5, 38), "karte RFID", font=self.font, fill="WHITE")

        self._draw_card_icon(75, 30, "WHITE")

        self.disp.ShowImage(self.image, 0, 0)

    def show_card_detected(self, uid_hex):
        self.clear()

        self.draw.text((5, 5), "KARTA", font=self.font, fill="YELLOW")

        self.draw.line([(0, 18), (self.disp.width, 18)], fill="YELLOW", width=1)

        self.draw.text((5, 25), "UID:", font=self.font_small, fill="WHITE")

        # split UID in 2 lines if too long
        if len(uid_hex) > 8:
            self.draw.text((5, 36), uid_hex[:8], font=self.font_small, fill="CYAN")
            self.draw.text((5, 47), uid_hex[8:], font=self.font_small, fill="CYAN")
        else:
            self.draw.text((5, 36), uid_hex, font=self.font, fill="CYAN")

        self.disp.ShowImage(self.image, 0, 0)

    def show_processing(self):
        self.clear()

        self.draw.text((5, 5), "BIBLIOTEKA", font=self.font, fill="RED")

        self.draw.line([(0, 18), (self.disp.width, 18)], fill="RED", width=1)

        self.draw.text((5, 28), "Przetwarzam", font=self.font, fill="WHITE")
        self.draw.text((5, 42), "dane...", font=self.font, fill="WHITE")

        self.disp.ShowImage(self.image, 0, 0)

    def show_client_found(self, client_name):
        self.clear()

        self.draw.text((5, 5), "UZYTKOWNIK", font=self.font_small, fill="GREEN")

        self.draw.line([(0, 18), (self.disp.width, 18)], fill="GREEN", width=1)

        self.draw.text((5, 25), "Witaj:", font=self.font_small, fill="WHITE")

        if len(client_name) > 10:
            self.draw.text((5, 38), client_name[:10], font=self.font, fill="YELLOW")
            self.draw.text((5, 50), client_name[10:], font=self.font_small, fill="YELLOW")
        else:
            self.draw.text((5, 38), client_name, font=self.font, fill="YELLOW")

        self.disp.ShowImage(self.image, 0, 0)

    def show_book_found(self, book_title):
        self.clear()

        self.draw.text((5, 5), "KSIAZKA", font=self.font_small, fill="CYAN")

        self.draw.line([(0, 18), (self.disp.width, 18)], fill="CYAN", width=1)

        self.draw.text((5, 25), "Tytul:", font=self.font_small, fill="WHITE")

        if len(book_title) > 10:
            self.draw.text((5, 38), book_title[:10], font=self.font, fill="YELLOW")
            self.draw.text((5, 50), book_title[10:20], font=self.font_small, fill="YELLOW")
        else:
            self.draw.text((5, 38), book_title, font=self.font, fill="YELLOW")

        # book icon
        self._draw_book_icon(70, 35, "WHITE")

        self.disp.ShowImage(self.image, 0, 0)

    def show_new_card(self):
        self.clear()

        self.draw.text((5, 5), "NOWA KARTA", font=self.font_small, fill="BLUE")

        self.draw.line([(0, 18), (self.disp.width, 18)], fill="BLUE", width=1)

        self.draw.text((5, 28), "Karta nie jest", font=self.font_small, fill="WHITE")
        self.draw.text((5, 42), "przypisana", font=self.font, fill="WHITE")

        self.disp.ShowImage(self.image, 0, 0)

    def show_error(self):
        self.clear()

        self.draw.text((5, 5), "BLAD", font=self.font, fill="RED")

        self.draw.line([(0, 18), (self.disp.width, 18)], fill="RED", width=1)

        self.disp.ShowImage(self.image, 0, 0)

    def show_success(self):
        self.clear()

        self.draw.text((5, 5), "SUKCES!", font=self.font, fill="GREEN")

        self.draw.line([(0, 18), (self.disp.width, 18)], fill="GREEN", width=1)

        # checkmark icon
        self.draw.line([(30, 40), (40, 50)], fill="GREEN", width=2)
        self.draw.line([(40, 50), (65, 25)], fill="GREEN", width=2)

        self.disp.ShowImage(self.image, 0, 0)

    def show_borrowing_count(self, count):
        self.clear()

        self.draw.text((5, 5), "WYPOZYCZENIA", font=self.font_small, fill="CYAN")

        self.draw.line([(0, 18), (self.disp.width, 18)], fill="CYAN", width=1)

        self.draw.text((5, 28), "Aktualne:", font=self.font_small, fill="WHITE")
        self.draw.text((30, 42), str(count), font=self.font, fill="YELLOW")

        self._draw_book_icon(65, 35, "WHITE")

        self.disp.ShowImage(self.image, 0, 0)

    def _draw_card_icon(self, x, y, color):
        # prostokat karty
        self.draw.rectangle([(x, y), (x + 16, y + 12)], outline=color, width=1)
        # chip
        self.draw.rectangle([(x + 3, y + 3), (x + 8, y + 9)], fill=color)

    def _draw_book_icon(self, x, y, color):
        # ksiazka
        self.draw.rectangle([(x, y), (x + 12, y + 16)], outline=color, width=1)
        # grzbiet
        self.draw.line([(x + 3, y), (x + 3, y + 16)], fill=color, width=1)
        # strony
        self.draw.line([(x + 6, y + 4), (x + 10, y + 4)], fill=color, width=1)
        self.draw.line([(x + 6, y + 8), (x + 10, y + 8)], fill=color, width=1)
        self.draw.line([(x + 6, y + 12), (x + 10, y + 12)], fill=color, width=1)

    def cleanup(self):
        self.clear()
        self.disp.reset()


if __name__ == "__main__":
    print("\nTEST DISPLAY \n")

    try:
        display = Display()

        print("Test 1: Czekam na karte")
        display.show_waiting_for_card()
        time.sleep(3)

        print("Test 2: Karta wykryta")
        display.show_card_detected("AABBCCDD")
        time.sleep(3)

        print("Test 3: Przetwarzanie")
        display.show_processing()
        time.sleep(2)

        print("Test 4: Klient znaleziony")
        display.show_client_found("Jan Kowalski")
        time.sleep(3)

        print("Test 5: Nowa karta")
        display.show_new_card()
        time.sleep(3)

        print("Test 6: Ilosc wypozyczen")
        display.show_borrowing_count(3)
        time.sleep(3)

        print("Test 7: Sukces")
        display.show_success()
        time.sleep(2)

        print("Test 8: Blad")
        display.show_error()
        time.sleep(3)

        print("\nTest zakonczony")

    except KeyboardInterrupt:
        print("\n\nPrzerwano przez uzytkownika")

    except Exception as e:
        print(f"Blad: {e}")
        import traceback
        traceback.print_exc()

    finally:
        display.cleanup()
        print("Cleanup wykonany\n")
