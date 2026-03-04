# 🌬️ Air Sensor AI

Projeto de monitoramento de qualidade do ar com sensor DHT, firmware embarcado e API REST integrada ao Firebase Realtime Database, hospedada no Replit.

---

## 📁 Estrutura do Projeto
```
air-sensor-ai/
│
├── api/                          # API REST em .NET 8
│   └── AirSensorAi/
│       ├── Controllers/
│       │   └── DHTController.cs  # Endpoints GET e POST de leituras
│       ├── DTOs/
│       │   └── DeviceDTO.cs      # Estrutura de dados da API
│       ├── Program.cs            # Configuração da aplicação e Firebase
│       └── AirSensorAi.csproj    # Dependências do projeto
│
├── firmware/                     # Código do microcontrolador
│   └── air_sensor/
│       └── air_sensor.ino        # Sketch ESP32 para leitura do sensor DHT
│
├── docs/                         # Documentação do projeto
│   ├── Arquitetura de Projeto.png
│   ├── prototipo.jpeg
│   └── README.md                 # Detalhes técnicos da arquitetura
│
├── .gitignore
├── .replit                       # Configuração de execução no Replit
├── replit.nix                    # Definição do SDK .NET 8 via Nix
└── README.md                     # Este arquivo
```

---

## 🧩 Componentes

### 🔌 Firmware (`/firmware`)
Código embarcado em C++ (ESP32) responsável por coletar leituras de temperatura e umidade via sensor DHT e enviá-las à API.

### 🖥️ API (`/api`)
API REST desenvolvida em **ASP.NET Core (.NET 8)**, responsável por receber e persistir as leituras no **Firebase Realtime Database**, além de disponibilizá-las para consulta.

**Endpoints:**

| Método | Rota       | Descrição                        |
|--------|------------|----------------------------------|
| GET    | `/api/dht` | Retorna todas as leituras salvas |
| POST   | `/api/dht` | Registra uma nova leitura        |
| GET    | `/teste`   | Health check da API              |

**Exemplo de payload (POST):**
```json
{
  "DeviceId": "sensor-01",
  "Timestamp": "2026-03-04T20:00:00Z",
  "SoilMoistureRaw": 27.5,
  "SoilMoisturePercent": 65.0
}
```

### 📄 Documentação (`/docs`)
Diagramas de arquitetura e protótipo visual do projeto.

---

## 🚀 Como executar localmente

### Pré-requisitos
- [.NET 8 SDK](https://dotnet.microsoft.com/download)
- Conta no [Firebase](https://console.firebase.google.com) com Realtime Database ativo

### Variáveis de ambiente

| Variável             | Descrição                              | Exemplo                                            |
|----------------------|----------------------------------------|----------------------------------------------------|
| `FIREBASE_BASE_PATH` | URL base do Firebase Realtime Database | `https://seu-projeto-default-rtdb.firebaseio.com/` |

### Passos
```bash
# Clone o repositório
git clone https://github.com/leticia-pontes/air-sensor-ai.git
cd air-sensor-ai/api/AirSensorAi

# Defina a variável de ambiente
export FIREBASE_BASE_PATH="https://seu-projeto-default-rtdb.firebaseio.com/"

# Restaure dependências e execute
dotnet restore
dotnet run
```

A API estará disponível em `http://localhost:5259`.
O Swagger em `http://localhost:5259/swagger` (apenas em desenvolvimento).

---

## ☁️ Deploy (Replit)

1. Importe o repositório no [Replit](https://replit.com)
2. Vá em **Secrets** (ícone de cadeado) e adicione `FIREBASE_BASE_PATH` com a URL do seu banco
3. Clique em **Run**

---

## 🛠️ Tecnologias

| Camada     | Tecnologia                     |
|------------|--------------------------------|
| Firmware   | C++ / ESP32 / Wokwi            |
| API        | ASP.NET Core 8 / C#            |
| Banco      | Firebase Realtime Database     |
| Biblioteca | FirebaseDatabase.net           |
| Hospedagem | Replit                         |

---

## 📐 Arquitetura

Veja o diagrama completo em [`docs/Arquitetura de Projeto.png`](docs/Arquitetura%20de%20Projeto.png).