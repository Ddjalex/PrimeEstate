# Secure Suite (Defensive Edition)

A legal, defensive full-stack starter for:

- consent-based phishing simulation campaigns,
- security awareness analytics,
- account-hardening workflows for Telegram users.

## Structure

- `frontend/` React dashboard starter.
- `backend/` Go API for campaigns and events.
- `infra/` deployment baseline for MongoDB + service containers.

## Safety Principles

1. No credential interception.
2. No unauthorized access or account takeover automation.
3. Consent and audit proof are mandatory before campaign launch.

## Run locally

### Backend

```bash
cd backend
go mod tidy
go run .
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## API Overview

- `GET /health` - service status.
- `POST /api/campaigns` - create campaign (requires `consentProof`).
- `GET /api/campaigns` - list campaigns.
- `POST /api/events` - create campaign event.
- `GET /api/events/{campaignId}` - list campaign events.
