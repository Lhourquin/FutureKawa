#include <PubSubClient.h>
#include <WiFi.h>
#include <DHT.h>
#include <time.h>
#include <Wire.h>


// Définition des pins
#define DHT_PIN 25  // Capteur DHT pour température et humidité


// Déclaration du capteur DHT
#define DHTTYPE DHT11
DHT dht(DHT_PIN, DHTTYPE);


// Variables pour la gestion des intervalles de capture
unsigned long lastDHTRead_temp = 0;
unsigned long lastDHTRead_humidity = 0;


// Délais entre les captures en millisecondes, 300000 ms (5 min) pour fréquence de variable minime
const unsigned long dhtInterval = 4000;  // 1 minute pour les tests
const unsigned long dhtInterval_hum = 6000;  // 1 minute 5s pour les tests


const char* country   = "brasil";
const char* warehouse = "entrepotA";

// Connexion WiFi et MQTT
const char* ssid = "*************";
const char* password = "*************";
const char* mqtt_server_addr = "***********";
WiFiClient espClient;
PubSubClient client(espClient);


// Fonctions pour la validation des données avant envoie par mqtt
bool validateData(String sensorType, float value) {
  if (sensorType == "Temperature") {
      // Température entre 0°C et 50°C
      if (isnan(value) || value < 0 || value > 50) {
        Serial.println("Invalid Temperature value: " + String(value));
        return false;
      }
  } else if (sensorType == "Humidity") {
      // Humidité entre 20% et 90%
      if (isnan(value) || value < 20 || value > 90) {
        Serial.println("Invalid Humidity value: " + String(value));
        return false;
      }
  } 
  // Si toutes les vérifications passent, la valeur est valide
  return true;
}


// Connexion au WiFi
void setup_wifi() {
  delay(10);
  Serial.println();
  Serial.print(" Connexion au wifi... ");
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.print("Connexion en cours...");
  }
  Serial.println("");
  Serial.println("WiFi connected");
}

String buildPayload(const char* country,
                    const char* warehouse,
                    const char* sensor,
                    float value,
                    const char* unit) {
  unsigned long ts = millis(); // pour la démo, sinon UNIX time si tu configures NTP


// Format json pour l'envoie des données 
 String payload = "{";
  payload += "\"country\":\"" + String(country) + "\",";
  payload += "\"warehouse\":\"" + String(warehouse) + "\",";
  payload += "\"sensor\":\"" + String(sensor) + "\",";
  payload += "\"value\":" + String(value, 2) + ",";
  payload += "\"unit\":\"" + String(unit) + "\",";
  payload += "\"timeserie\":" + String(ts);
  payload += "}";
  return payload;
}


// Envoi des données via MQTT avec horodatage
void send_mqtt(const char* topic, const String& message) {
  if (!client.connected()) return;  // Vérifier la connexion MQTT
  client.publish(topic, message.c_str());
}


// Configuration de MQTT
void setup_mqtt() {
  client.setServer(mqtt_server_addr, 1883);
  while (!client.connected()) {
    Serial.print("Tentative de connexion à MQTT...");
    if (client.connect("ESP32Client")) {
      Serial.println("connecté au serveur MQTT");
    } else {
        Serial.print("failed, code erreur=");
        Serial.print(client.state());
        delay(5000);
    }
  }
}


// Capture des données des capteurs

void capture_temperature() {
  float temp_value = dht.readTemperature();
  if (!validateData("Temperature", temp_value)) return;  // Si la valeur est invalide, ne rien envoyé
  //Serial.print("%  Temperature: ");
  //Serial.print(temp_value); 
  String payload = buildPayload(country, warehouse, "temperature", temp_value, "C");
  send_mqtt("futurekawa/brasil/entrepotA/sensors/temperature", payload);
 
}


void capture_humidity() {
  float humidity_value = dht.readHumidity();
  if (!validateData("Humidity", humidity_value)) return;
  //Serial.print("Humidite: ");
  //Serial.print(humidity_value);
  String payload = buildPayload(country, warehouse, "humidite", humidity_value, "%");
  send_mqtt("futurekawa/brasil/entrepotA/sensors/humidite", payload);
}


// Boucle principale
void loop() {
  if (!client.connected()) {
    setup_mqtt();
  }
  client.loop();

   unsigned long now = millis();

   // Lecture du capteur DHT11 (température et humidité)
  if (now - lastDHTRead_temp > dhtInterval) {
    lastDHTRead_temp = now;
    capture_temperature();
  }

  if (now - lastDHTRead_humidity > dhtInterval_hum) {
    lastDHTRead_humidity = now;
    capture_humidity();
  }
  
}


// Setup initial
void setup() {
  Serial.begin(115200);
  dht.begin();
  setup_wifi();
  setup_mqtt();
}
