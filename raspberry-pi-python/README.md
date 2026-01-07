# Raspberry Pi - Library RFID System

## Instalacja na RPI

### 1. Biblioteki Python:
```bash
cd raspberry-pi_python
pip3 install -r requirements.txt
```

### 2. Konfiguracja adresu backendu:

Edytuj plik `config.py`:
```python
MQTT_BROKER = "ip_address"  # TODO
```

### Podstawowe uruchomienie:
```bash
cd raspberry-pi_python
python3 main.py
```

### Co się dzieje:
1. LED świeci na **ZIELONO** - gotowy do skanowania
2. Przyłóż kartę RFID
3. Beep + LED zmienia się na **CZERWONY**
4. Dane karty wysyłane do backendu przez MQTT
5. Czeka na odpowiedź z backendu (max 10 sekund)
6. Wyświetla odpowiedź i kończy działanie

### Testowanie poszczególnych modułów:

#### Test czytnika RFID:
```bash
python3 rfid_reader.py
```

#### Test MQTT:
```bash
python3 mqtt_client.py
```

#### Test LED:
```bash
python3 led_controller.py
```

#### Test buzzera:
```bash
python3 buzzer.py
```

## Format danych wysyłanych przez MQTT

### RPI → Backend (topic: `raspberry/rfid/scan`):
```json
{
  "uid": "AABBCCDD",
  "uid_int": 2864434397,
  "timestamp": "2025-12-23 10:30:00"
}
```

### Backend → RPI (topic: `raspberry/led`):
```json
{
  "color": "green"
}
```
Możliwe wartości: `"green"`, `"red"`, `"off"`

### Backend → RPI (topic: `raspberry/rfid/response`):
```json
{
  "uid": "AABBCCDD",
  "card": {
    "id": 1,
    "uid": "AABBCCDD"
  },
  "client": {
    "cardId": "AABBCCDD",
    "name": "Jan Kowalski",
    "email": "jan@example.com"
  },
  "book": null,
  "borrows": [
    {
      "id": 1,
      "borrowedAt": "2025-12-27T10:30:00.000Z",
      "dueDate": "2025-01-10T10:30:00.000Z",
      "returnedAt": null,
      "book": {
        "cardId": "BOOK-001",
        "title": "Example Book",
        "author": "John Doe"
      }
    }
  ]
}
```

Pola w odpowiedzi:
- `uid` - UID zeskanowanej karty
- `card` - obiekt karty z bazy lub `null` jeśli karta nie istnieje
- `client` - obiekt klienta jeśli karta jest przypisana do klienta, lub `null`
- `book` - obiekt książki jeśli karta jest przypisana do książki, lub `null`
- `borrows` - lista aktywnych wypożyczeń klienta (pusta jeśli to książka lub nowa karta)

### RPI → Backend (topic: `raspberry/rfid/cancel`):
```json
{}
```
Wysyłane gdy użytkownik anuluje skanowanie.
