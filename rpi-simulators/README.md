# Narzędzia testowe - Library RFID System

## 1. fake-rpi.py - Symulator Raspberry Pi RFID

Symuluje Raspberry Pi z czytnikiem RFID do testów **bez fizycznego sprzętu**.

### Instalacja

```bash
pip install paho-mqtt
```

### Uruchomienie

```bash
cd test-tools
python3 fake-rpi.py
```

### Użycie

Po uruchomieniu dostępne komendy:

```
>>> scan TEST1234          # Symuluj skanowanie karty o UID "TEST1234"
>>> scan CLIENT-001        # Symuluj kartę klienta
>>> scan BOOK-001          # Symuluj kartę książki
>>> cancel                 # Anuluj skanowanie
>>> help                   # Pokaż pomoc
>>> quit                   # Wyjdź
```

### Przykładowy flow testowy

1. **Uruchom backend:**
   ```bash
   cd backend_iot_nestjs
   npm run start:dev   # Terminal 1
   ```

2. **Uruchom fake-rpi:**
   ```bash
   cd test-tools
   python3 fake-rpi.py  # Terminal 2
   ```

3. **Skanuj kartę:**
   ```
   >>> scan TEST1234
   ```

4. **Sprawdź odpowiedź:**
   - Jeśli karta nie istnieje: `NOWA KARTA - nie przypisana`
   - Jeśli karta przypisana do klienta: Wyświetli dane klienta i wypożyczenia
   - Jeśli karta przypisana do książki: Wyświetli dane książki

---

## 2. display-simulator.py - Generator obrazów wyświetlacza OLED

Generuje obrazy PNG symulujące wyświetlacz OLED 96x64 używany na Raspberry Pi.

### Instalacja

```bash
pip3 install pillow
```

### Uruchomienie

```bash
cd test-tools
python3 display-simulator.py
```

### Wyjście

Obrazy są zapisywane w folderze `display_output/`:
- `01_waiting_for_card.png` - Czekanie na kartę
- `02_card_detected.png` - Karta wykryta
- `03_processing.png` - Przetwarzanie danych
- `04_client_found.png` - Klient znaleziony
- `05_new_card.png` - Nowa karta (nie przypisana)
- `06_error.png` - Błąd
- `07_success.png` - Sukces
- `08_borrowing_count.png` - Liczba wypożyczeń

Wszystkie obrazy są skalowane 4x (384x256) dla lepszej widoczności.