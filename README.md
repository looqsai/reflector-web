# Reflector Web

**Web Interface for Looqs.ai Mobile Assistant Testing**

Reflector Web is a web app that tests and demonstrates Looqs.ai's mobile assistant features via a real-time chat interface. 
The app connects with the provided backend over WebSockets for live interaction directly in the browser.

## 🚀 Features

- **Real-Time Chat**: Interactive chat with Looqs.ai’s assistant.
- **Indicators**: Typing and recording status for seamless interaction.
- **Message Metadata**: Hover for metadata and model response details.
- **WebSocket Integration**: Smooth backend connection.

## 📦 Setup

### Requirements

- **Node.js** v14+ and **npm** v6+ or **yarn**

### Clone & Install

```bash
git clone https://github.com/looqsai/reflector-web.git
cd reflector-web

cd chat-app
npm install # or yarn install

cd chat-server
npm install # or yarn install
```

### Configure WebSocket URL

1. Create a `.env` file:

   ```bash
   touch .env
   ```

2. Add the WebSocket URL:

   ```env
   REACT_APP_WEBSOCKET_URL=ws://your-websocket-server-url
   ```

## 🖥 Running the App

### Start the Node.js Server

```bash
# In the 'chat-server' folder:
node index.js
```

### Start the React App

```bash
# In the 'chat-app' folder:
npm start
```

Access the app at [http://localhost:3000](http://localhost:3000).

## 🤝 Contributing

Contributions welcome! See the [LICENSE](LICENSE) for details.

---
