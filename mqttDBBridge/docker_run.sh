docker run --rm -it -d \
  -v /home/filip/MqttIotPlatform/mqttDBBridge/program:/app \
  --network mqttiotplatform_mqttIotNetwork \
  -w /app \
  mcr.microsoft.com/dotnet/sdk:8.0 \
  dotnet run