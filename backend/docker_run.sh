docker run --rm -it \
  -v /home/filip/MqttIotPlatform/backend/program:/app \
  --network mqttiotplatform_mqttIotNetwork \
  -w /app \
  -p 5000:5000 \
  --name MqttBackend \
  mcr.microsoft.com/dotnet/sdk:8.0 \
  /bin/bash