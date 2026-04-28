# MqttIotPlatform

## 🔄 Request Flow

1. User opens web UI
2. React frontend loads in browser
3. API requests are sent to `/api/*`
4. Nginx forwards requests to backend container
5. Backend returns JSON data
6. React renders charts

---
