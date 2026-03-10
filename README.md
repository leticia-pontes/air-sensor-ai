# 🌫️ Air Sensor AI

Sistema de monitoramento de qualidade do ar em tempo real, utilizando sensores físicos integrados ao ESP32, com dados enviados via HTTPS para uma API .NET hospedada na nuvem e persistidos em banco de dados.

---

## 📋 Sumário

- [Visão Geral](#visão-geral)
- [Ferramentas de Hardware](#ferramentas-de-hardware)
- [Tecnologias](#tecnologias)
- [Arquitetura do Sistema](#arquitetura-do-sistema)
- [Formato dos Dados](#formato-dos-dados)
- [Banco de Dados](#banco-de-dados)
- [Plataforma de Simulação](#plataforma-de-simulação)
- [Comunicação ESP32 → API](#comunicação-esp32--api)
- [Segurança HTTPS](#segurança-https)
- [Esquema do Projeto](#esquema-do-projeto)
- [Membros](#membros)

---

## Visão Geral

O projeto coleta dados de temperatura, umidade e qualidade do ar através de sensores conectados a um ESP32. Os dados são serializados em JSON e enviados periodicamente via HTTPS para uma API RESTful desenvolvida em C# (ASP.NET Core). O frontend em React/TypeScript exibe as leituras em tempo real.

---

## Ferramentas de Hardware

| Componente | Função |
|---|---|
| **ESP32** | Microcontrolador principal — gerencia sensores, WiFi e envio dos dados |
| **DHT11** | Sensor de temperatura e umidade relativa do ar |
| **MQ135** | Sensor de qualidade do ar — detecta CO₂ e outros gases |
| **Resistor** | Divisor de tensão para adequar o sinal analógico do MQ135 ao ESP32 |
| **Protoboard** | Base para montagem do circuito sem solda |
| **Cabos** | Conexão entre os componentes |

---

## Tecnologias

| Camada | Tecnologia |
|---|---|
| **Firmware** | C++ (Arduino framework) |
| **Backend** | C# · ASP.NET Core · .NET 8 |
| **Frontend** | React · TypeScript |
| **Banco de Dados** | PostgreSQL |
| **Simulação** | Wokwi |
| **Hospedagem** | Replit (Cloud Run) |

---

## Arquitetura do Sistema

```
[DHT11 / MQ135]
      │  protocolo single-wire / analógico
      ▼
   [ESP32]
      │  HTTPS POST · JSON · WiFi
      ▼
[Wokwi Proxy]  ──────────────────────────────────┐
      │                                           │ (simulação)
      ▼                                           │
[Replit / Cloud Run]                              │
  ASP.NET Core API                                │
      │  FirebaseClient / PostgreSQL              │
      ▼                                           │
 [Banco de Dados]                                 │
      │                                           │
      ▼                                           │
[Frontend React/TS] ◀────────────────────────────┘
```

O ESP32 age como **cliente HTTP**: lê os sensores a cada 10 segundos, monta um payload JSON e envia via `POST` para o endpoint `/api/DHT`. O servidor persiste a leitura no banco e a resposta é confirmada de volta ao dispositivo.

---

## Formato dos Dados

Os dados são trafegados e armazenados em JSON com a seguinte estrutura:

```json
{
  "DeviceId":    "esp32-01",
  "Timestamp":   1717000000000,
  "Temperature": 23.45,
  "Humidity":    60.12,
  "CO2":         412.7,
  "DateTime":    "2025-05-29T14:30:00Z"
}
```

| Campo | Tipo | Descrição |
|---|---|---|
| `DeviceId` | `string` | Identificador único do dispositivo |
| `Timestamp` | `long` | Milissegundos desde o boot (uso interno) |
| `Temperature` | `float` | Temperatura em °C (DHT11) |
| `Humidity` | `float` | Umidade relativa em % (DHT11) |
| `CO2` | `float` | Concentração de CO₂ em ppm (MQ135) |
| `DateTime` | `string` | Data/hora real em UTC (via NTP) |

> Outros gases detectáveis pelo MQ135 (NH₃, álcool, benzeno, fumaça) serão adicionados conforme definição da equipe.

---

## Banco de Dados

**PostgreSQL** — banco relacional open-source utilizado para persistência das leituras.

A estrutura principal da tabela de leituras:

```sql
CREATE TABLE leituras (
    id          SERIAL PRIMARY KEY,
    device_id   VARCHAR(50)      NOT NULL,
    timestamp   BIGINT           NOT NULL,
    temperature REAL             NOT NULL,
    humidity    REAL             NOT NULL,
    co2         REAL,
    datetime    TIMESTAMPTZ      NOT NULL DEFAULT NOW()
);
```

A API .NET acessa o PostgreSQL via **Entity Framework Core** ou **Dapper**, expondo os dados através dos endpoints REST.

---

## Plataforma de Simulação

O projeto utiliza o **[Wokwi](https://wokwi.com)** para simulação do hardware durante o desenvolvimento.

O Wokwi simula o ESP32 e os sensores em software, e usa um **proxy próprio** para tunelar as requisições HTTP do dispositivo simulado para a internet real — permitindo que o ESP32 virtual se comunique com a API hospedada no Replit como se fosse hardware físico.

---

## Comunicação ESP32 → API

O firmware do ESP32 utiliza três bibliotecas principais para a comunicação:

- **`WiFi.h`** — gerencia a conexão à rede sem fio
- **`WiFiClientSecure.h`** — habilita comunicação HTTPS (TLS/SSL)
- **`HTTPClient.h`** — abstrai as requisições HTTP (GET, POST)

A cada 10 segundos, o loop principal executa:

```
1. Leitura dos sensores (DHT11 + MQ135)
2. Validação dos dados (rejeita NaN)
3. Serialização em JSON
4. POST /api/DHT  →  persiste a leitura
5. GET  /api/DHT  →  confirma os dados no servidor
```

O intervalo usa o padrão **non-blocking timing** com `millis()` — o processador nunca fica bloqueado esperando, mantendo o firmware responsivo.

---

## Segurança HTTPS

Toda comunicação entre o ESP32 e a API trafega criptografada via **TLS** (protocolo por trás do HTTPS). O `WiFiClientSecure` do ESP32 realiza o handshake TLS antes de qualquer dado ser enviado.

**No ambiente de simulação (Wokwi):** é utilizado `client.setInsecure()`, que desabilita a verificação do certificado SSL do servidor. Os dados continuam criptografados, mas a identidade do servidor não é verificada. Isso é necessário porque o proxy do Wokwi pode apresentar um certificado diferente do servidor real.

**Em produção (hardware físico):** o correto é substituir por:

```cpp
client.setCACert(rootCACertificate);
```

Fornecendo o certificado raiz da CA que assinou o certificado do servidor, garantindo proteção completa contra ataques Man-in-the-Middle (MITM).

---

## Esquema do Projeto

![Esquema do projeto](prototipo.jpeg)

---

## Membros

| Nome |
|---|
| Breno Henrique |
| Caio Ocon |
| Leandro Poletti |
| Leticia |
| Laura |
