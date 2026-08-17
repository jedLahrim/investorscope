# InvestorScope

InvestorScope is a full-stack web application that helps startup founders discover relevant investors for their specific market category.

## Architecture
- **Frontend**: React 18, Vite, TailwindCSS, shadcn/ui
- **Backend API & Workers**: Node.js, Fastify, BullMQ
- **Database**: PostgreSQL (via Drizzle ORM)
- **Queue/Cache**: Redis
- **Extraction Pipeline**: SEC EDGAR, Brave Search API (optional), local LLM extraction via Ollama (`llama3.1:8b` and `nomic-embed-text`).

## Setup Instructions

1. **Start Infrastructure Services**
   Ensure Docker is installed and running, then start the services:
   ```bash
   docker-compose up -d
   ```

2. **Install Dependencies**
   Run from the monorepo root:
   ```bash
   npm install
   ```

3. **Pull Ollama Models**
   Once the Ollama container is running, download the required local models:
   ```bash
   docker exec -it investorscope-ollama ollama run llama3.1:8b
   docker exec -it investorscope-ollama ollama pull nomic-embed-text
   ```

4. **Environment Variables**
   Set up the `.env` files in `apps/api` and `apps/web` (see `.env.example` if available).

5. **Run the Database Migrations and Seed**
   (Commands to be added once API package is configured)

6. **Start the Application**
   From the root:
   ```bash
   npm run dev
   ```
