#!/usr/bin/env python3

import os
from PIL import Image, ImageDraw, ImageFont


class DisplaySimulator:

    def __init__(self, output_dir="display_output"):
        self.width = 96
        self.height = 64
        self.output_dir = output_dir

        os.makedirs(self.output_dir, exist_ok=True)

        self.image = Image.new("RGB", (self.width, self.height), "BLACK")
        self.draw = ImageDraw.Draw(self.image)

        try:
            font_path = '../raspberry-pi-python/lib/oled/Font.ttf'
            if os.path.exists(font_path):
                self.font = ImageFont.truetype(font_path, 11)
                self.font_small = ImageFont.truetype(font_path, 9)
            else:
                self.font = ImageFont.load_default()
                self.font_small = ImageFont.load_default()
        except:
            self.font = ImageFont.load_default()
            self.font_small = ImageFont.load_default()

        print(f"Symulator OLED zainicjalizowany (output: {self.output_dir}/)")

    def clear(self):
        self.draw.rectangle([(0, 0), (self.width, self.height)], fill="BLACK")

    def save_image(self, filename):
        scaled = self.image.resize((self.width * 4, self.height * 4), Image.NEAREST)
        filepath = os.path.join(self.output_dir, filename)
        scaled.save(filepath)
        print(f"  Zapisano: {filepath}")

    def show_waiting_for_card(self):
        self.clear()

        self.draw.text((5, 5), "BIBLIOTEKA", font=self.font, fill="GREEN")

        self.draw.line([(0, 18), (self.width, 18)], fill="GREEN", width=1)

        self.draw.text((5, 25), "Przyloz", font=self.font, fill="WHITE")
        self.draw.text((5, 38), "karte RFID", font=self.font, fill="WHITE")

        self._draw_card_icon(75, 30, "WHITE")

        self.save_image("01_waiting_for_card.png")

    def show_card_detected(self, uid_hex):
        self.clear()

        self.draw.text((5, 5), "KARTA", font=self.font, fill="YELLOW")

        self.draw.line([(0, 18), (self.width, 18)], fill="YELLOW", width=1)

        self.draw.text((5, 25), "UID:", font=self.font_small, fill="WHITE")

        if len(uid_hex) > 8:
            self.draw.text((5, 36), uid_hex[:8], font=self.font_small, fill="CYAN")
            self.draw.text((5, 47), uid_hex[8:], font=self.font_small, fill="CYAN")
        else:
            self.draw.text((5, 36), uid_hex, font=self.font, fill="CYAN")

        self.save_image("02_card_detected.png")

    def show_client_found(self, client_name):
        self.clear()

        self.draw.text((5, 5), "KLIENT", font=self.font, fill="ORANGE")

        self.draw.line([(0, 18), (self.width, 18)], fill="ORANGE", width=1)

        if len(client_name) > 12:
            self.draw.text((5, 25), client_name[:12], font=self.font, fill="PINK")
            self.draw.text((5, 40), client_name[12:24], font=self.font_small, fill="PINK")
        else:
            self.draw.text((5, 30), client_name, font=self.font, fill="PINK")

        self.save_image("03_client_found.png")

    def show_book_found(self, book_title):
        self.clear()

        self.draw.text((5, 5), "KSIAZKA", font=self.font_small, fill="CYAN")

        self.draw.line([(0, 18), (self.width, 18)], fill="CYAN", width=1)

        if len(book_title) > 12:
            self.draw.text((5, 25), book_title[:12], font=self.font, fill="YELLOW")
            self.draw.text((5, 40), book_title[12:24], font=self.font_small, fill="YELLOW")
        else:
            self.draw.text((5, 30), book_title, font=self.font, fill="YELLOW")

        self.save_image("04_book_found.png")

    def show_new_card(self):
        self.clear()

        self.draw.text((5, 5), "NOWY SKAN", font=self.font_small, fill="BLUE")

        self.draw.line([(0, 18), (self.width, 18)], fill="BLUE", width=1)

        self.draw.ellipse([(25, 40), (30, 45)], fill="BLUE")
        self.draw.ellipse([(43, 40), (48, 45)], fill="BLUE")
        self.draw.ellipse([(61, 40), (66, 45)], fill="BLUE")

        self.save_image("05_new_card.png")

    def show_error(self):
        self.clear()

        self.draw.text((5, 5), "BLAD", font=self.font, fill="RED")

        self.draw.line([(0, 18), (self.width, 18)], fill="RED", width=1)

        # X icon
        self.draw.line([(35, 28), (60, 53)], fill="RED", width=2)
        self.draw.line([(60, 28), (35, 53)], fill="RED", width=2)

        self.save_image("06_error.png")

    def show_success(self):
        self.clear()

        self.draw.text((5, 5), "SUKCES!", font=self.font, fill="LIME")

        self.draw.line([(0, 18), (self.width, 18)], fill="LIME", width=1)

        self.draw.line([(30, 40), (40, 50)], fill="LIME", width=2)
        self.draw.line([(40, 50), (65, 25)], fill="LIME", width=2)

        self.save_image("07_success.png")

    def _draw_card_icon(self, x, y, color):
        self.draw.rectangle([(x, y), (x + 16, y + 12)], outline=color, width=1)
        self.draw.rectangle([(x + 3, y + 3), (x + 8, y + 9)], fill=color)

    def cleanup(self):
        self.clear()


def main():
    sim = DisplaySimulator()

    print("\nGeneruje obrazy...")
    print()

    print("1. Czekam na karte")
    sim.show_waiting_for_card()

    print("2. Karta wykryta")
    sim.show_card_detected("FSGGFBFU36642VAFQK")

    print("3. Klient znaleziony")
    sim.show_client_found("Angelika Katarzyna Wysocka")

    print("4. Ksiazka znaleziona")
    sim.show_book_found("Zdazyc przed Panem Bogiem")

    print("5. Nowa karta")
    sim.show_new_card()

    print("6. Blad")
    sim.show_error()

    print("7. Sukces")
    sim.show_success()



if __name__ == "__main__":
    main()
