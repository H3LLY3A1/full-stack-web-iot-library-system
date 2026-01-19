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

        self.draw.text((5, 5), "KLIENT", font=self.font, fill="ORANGE")

        self.draw.line([(0, 18), (self.disp.width, 18)], fill="ORANGE", width=1)

        if len(client_name) > 12:
            self.draw.text((5, 25), client_name[:12], font=self.font, fill="PINK")
            self.draw.text((5, 40), client_name[12:24], font=self.font_small, fill="PINK")
        else:
            self.draw.text((5, 30), client_name, font=self.font, fill="PINK")

        self.disp.ShowImage(self.image, 0, 0)

    def show_book_found(self, book_title):
        self.clear()

        self.draw.text((5, 5), "KSIAZKA", font=self.font_small, fill="CYAN")

        self.draw.line([(0, 18), (self.disp.width, 18)], fill="CYAN", width=1)

        if len(book_title) > 12:
            self.draw.text((5, 25), book_title[:12], font=self.font, fill="YELLOW")
            self.draw.text((5, 40), book_title[12:24], font=self.font_small, fill="YELLOW")
        else:
            self.draw.text((5, 30), book_title, font=self.font, fill="YELLOW")


        self.disp.ShowImage(self.image, 0, 0)

    def show_new_card(self):
        self.clear()

        self.draw.text((5, 5), "NOWY SKAN", font=self.font_small, fill="BLUE")

        self.draw.line([(0, 18), (self.disp.width, 18)], fill="BLUE", width=1)

        # three dots
        self.draw.ellipse([(25, 40), (30, 45)], fill="BLUE")
        self.draw.ellipse([(43, 40), (48, 45)], fill="BLUE")
        self.draw.ellipse([(61, 40), (66, 45)], fill="BLUE")

        self.disp.ShowImage(self.image, 0, 0)

    def show_error(self):
        self.clear()

        self.draw.text((5, 5), "BLAD", font=self.font, fill="RED")

        self.draw.line([(0, 18), (self.disp.width, 18)], fill="RED", width=1)

        # X icon
        self.draw.line([(35, 28), (60, 53)], fill="RED", width=2)
        self.draw.line([(60, 28), (35, 53)], fill="RED", width=2)

        self.disp.ShowImage(self.image, 0, 0)

    def show_success(self):
        self.clear()

        self.draw.text((5, 5), "SUKCES!", font=self.font, fill="LIME")

        self.draw.line([(0, 18), (self.disp.width, 18)], fill="LIME", width=1)

        # checkmark icon
        self.draw.line([(30, 40), (40, 50)], fill="LIME", width=2)
        self.draw.line([(40, 50), (65, 25)], fill="LIME", width=2)

        self.disp.ShowImage(self.image, 0, 0)


    def _draw_card_icon(self, x, y, color):
        # prostokat karty
        self.draw.rectangle([(x, y), (x + 16, y + 12)], outline=color, width=1)
        # chip
        self.draw.rectangle([(x + 3, y + 3), (x + 8, y + 9)], fill=color)


    def cleanup(self):
        self.clear()
        self.disp.reset()


if __name__ == "__main__":
    print("\nTEST DISPLAY \n")

    try:
        display = Display()

        print("1. Czekam na karte")
        display.show_waiting_for_card()
        time.sleep(3)

        print("2. Karta wykryta")
        display.show_card_detected("FGRG4535425ADSGHJ")
        time.sleep(3)

        print("3. Klient znaleziony")
        display.show_client_found("Angelika Katarzyna Wysocka")
        time.sleep(3)

        print("4. Ksiazka znaleziona")
        display.show_book_found("Zdazyc przed Panem Bogiem")
        time.sleep(3)

        print("5. Nowa karta")
        display.show_new_card()
        time.sleep(3)

        print("6. Blad")
        display.show_error()
        time.sleep(3)

        print("7. Sukces")
        display.show_success()
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
