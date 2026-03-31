# Dashboard

A widget dashboard with a React frontend and Flask API backend. Displays data cards pulling from various APIs, with an architecture that supports both data-fetching widgets and standalone interactive widgets.

## Prerequisites

- Python 3.11+ (3.13 recommended)
- Node.js 18+
- npm 9+

## Setup

### Backend

```bash
cd backend
python3.13 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

Initialize the database:

```bash
flask --app run.py db upgrade
python seed.py
```

Start the dev server:

```bash
python run.py
```

The API runs at `http://127.0.0.1:5000`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The app runs at `http://localhost:5173` and proxies API requests to the Flask backend.

## API Keys (Optional)

Copy `.env.example` to `.env` in the project root and add your keys:

```bash
cp .env.example .env
```

- **NASA_API_KEY** — Free at [api.nasa.gov](https://api.nasa.gov/) (works without a key using DEMO_KEY, but with stricter rate limits)

Weather data uses Open-Meteo (no key required). All cards render with graceful fallbacks when APIs are unreachable.

## MCP Servers

### Coin Flip

A minimal [FastMCP](https://github.com/modelcontextprotocol/python-sdk) server that exposes a `flip_coin` tool. To set it up:

```bash
cd mcp-servers/coin-flip
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

The server is configured in `.cursor/mcp.json` and Cursor will launch it automatically via stdio.

## Project Structure

```
backend/
  app/
    models/card.py       # Card model (SQLAlchemy)
    routes/cards.py      # CRUD API (/api/cards)
    routes/data.py       # Data proxy (/api/data/<source>)
    services/            # Weather, quotes, space data fetchers
  migrations/            # Alembic migrations
  config.py              # App configuration
  seed.py                # Database seed script
  run.py                 # Flask entry point

frontend/
  src/
    components/
      Dashboard.jsx      # Card grid layout
      Card.jsx           # Generic card wrapper
      cards/             # Widget-specific components
    api.js               # Backend API client
    App.jsx              # Root component
```

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/cards` | List active cards |
| GET | `/api/cards/:id` | Get single card |
| POST | `/api/cards` | Create card |
| PUT | `/api/cards/:id` | Update card |
| DELETE | `/api/cards/:id` | Delete card |
| GET | `/api/data/:source` | Fetch live data for a source |
