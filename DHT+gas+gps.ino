#include <WiFi.h>
#include <FirebaseESP32.h>
#include <DHT.h>

#define DHTPIN 18
#define DHTTYPE DHT11
#define LED_PIN 23

DHT dht(DHTPIN, DHTTYPE);

#define MOTOR_PIN 19
int motorSpeed = 0;

char* ssid = "Redmi Note 9 Pro";
char* password = "Aditya@321";
char* firebaseHost = "smart-cold-storage-controller-default-rtdb.asia-southeast1.firebasedatabase.app";
char* firebaseAuth = "Z0KgNkwAluFlRPGtPQwsvUhcy4oeU7CLaJwBLaJE";

FirebaseData firebaseData;
FirebaseJson json;

void setup() {
  Serial.begin(115200);
  Serial.print("Setting up environment");
  dht.begin();
  pinMode(MOTOR_PIN, OUTPUT);

  WiFi.begin(ssid, password);
  Serial.print("Connecting to WiFi...");
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.print(".");
  }
  Serial.println();
  Serial.print("Connected to WiFi: ");
  Serial.println(ssid);

  Firebase.begin(firebaseHost, firebaseAuth);
  Serial.println("Firebase initialized.");
}

void loop() {
  
  float temperature = dht.readTemperature();
  float humidity = dht.readHumidity();
  Serial.print(temperature);
Serial.print("       ");


  
  if (isnan(temperature) || isnan(humidity)) {
    Serial.println("Failed to read temperature and humidity from DHT11 sensor.");
    return;
  }

  
  Firebase.setFloat(firebaseData, "/temperature", temperature);
  Firebase.setFloat(firebaseData, "/humidity", humidity);

  
  Firebase.getFloat(firebaseData, "/motorSpeed");
  if (firebaseData.dataType() == "float") {
    motorSpeed = firebaseData.floatData();
    Serial.print("Motor speed set to ");
    Serial.println(motorSpeed);
  }

  

  
  analogWrite(MOTOR_PIN, motorSpeed);
  
  int sensorValue = analogRead(34); // replace 34 with your gas sensor's pin number
  Serial.println(sensorValue);

  json.clear();
  json.add("gas_sensor_data", sensorValue);

  Firebase.setFloat(firebaseData, "/gas_sensor", sensorValue);

  // if (firebaseData.error()) {
  //   Serial.println(firebaseData.errorReason());
  // }
  
  delay(3000); 
}