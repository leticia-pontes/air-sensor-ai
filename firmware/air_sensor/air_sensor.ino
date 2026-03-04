#include <WiFi.h>
#include <WiFiClientSecure.h>
#include <HTTPClient.h>
#include <DHT.h>

// Configurações do Sensor DHT22
#define DHTPIN 4
#define DHTTYPE DHT22
DHT dht(DHTPIN, DHTTYPE);

// Configurações da Rede Wokwi
const char* ssid = "Wokwi-GUEST";
const char* password = "";

// URL da API no Replit
const char* serverUrl = "https://air-sensor-ai--leticia-hub.replit.app/api/DHT";

// Controle de Tempo
unsigned long sendInterval = 10000; // Envia a cada 10 segundos
unsigned long lastSend = 0;

void setup() {
  Serial.begin(115200);
  delay(1000);

  dht.begin();
  connectWiFi();

  Serial.println("\n--- Sistema Monitor de Ar Iniciado ---");
}

void loop() {
  // Verifica se o intervalo de tempo passou
  if (millis() - lastSend > sendInterval) {
    lastSend = millis();

    float temperature;
    float humidity;

    // Tenta ler o sensor
    if (readSensor(temperature, humidity)) {
      String jsonPayload = buildJson(temperature, humidity);

      // 1. Envia o dado atual (POST)
      sendPOST(jsonPayload);

      // 2. Busca a lista completa do servidor (GET)
      sendGET();
    }
  }
}

// --- Funções Auxiliares ---

void connectWiFi() {
  Serial.println("Conectando ao WiFi...");
  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("\nWiFi conectado!");
  Serial.print("IP do ESP32: ");
  Serial.println(WiFi.localIP());
}

bool readSensor(float &temperature, float &humidity) {
  humidity = dht.readHumidity();
  temperature = dht.readTemperature();

  if (isnan(humidity) || isnan(temperature)) {
    Serial.println("Erro crítico: Falha na leitura do sensor DHT22!");
    return false;
  }

  Serial.printf("\n[Sensor] Temp: %.2f°C | Umid: %.2f%%\n", temperature, humidity);
  return true;
}

String buildJson(float temperature, float humidity) {
  String json = "{";
  json += "\"DeviceId\":\"esp32-01\",";
  json += "\"Timestamp\":" + String(millis()) + ",";
  json += "\"Temperature\":" + String(temperature, 2) + ",";
  json += "\"Humidity\":" + String(humidity, 2);
  json += "}";
  return json;
}

void sendPOST(String payload) {
  if (WiFi.status() == WL_CONNECTED) {
    WiFiClientSecure client;
    client.setInsecure(); // Essencial para rodar HTTPS no Wokwi

    HTTPClient http;

    Serial.println(">> Iniciando POST para o Replit...");
    if (http.begin(client, serverUrl)) {
      http.addHeader("Content-Type", "application/json");

      int httpResponseCode = http.POST(payload);

      if (httpResponseCode > 0) {
        Serial.printf(">> POST Sucesso! Código: %d\n", httpResponseCode);
        Serial.println(">> Resposta: " + http.getString());
      } else {
        Serial.printf(">> Erro no POST: %s (%d)\n", http.errorToString(httpResponseCode).c_str(), httpResponseCode);
      }
      http.end();
    }
  }
}

void sendGET() {
  if (WiFi.status() == WL_CONNECTED) {
    WiFiClientSecure client;
    client.setInsecure();

    HTTPClient http;

    Serial.println(">> Iniciando GET para verificar lista...");
    if (http.begin(client, serverUrl)) {
      int httpResponseCode = http.GET();

      if (httpResponseCode > 0) {
        Serial.printf(">> GET Sucesso! Código: %d\n", httpResponseCode);
        Serial.println(">> Dados Atuais na API: " + http.getString());
      } else {
        Serial.printf(">> Erro no GET: %s (%d)\n", http.errorToString(httpResponseCode).c_str(), httpResponseCode);
      }
      http.end();
    }
  }
}