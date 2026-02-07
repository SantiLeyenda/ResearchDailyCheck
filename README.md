Research Daily Check: REST API for tracking daily research logs and experiments

Demo Link: https://researchdailycheck.onrender.com

Tech-stack: Node.js, Express, PostgreSQL, Railway, Render, node-pg-migrate

API ENDPOINTS: 

Experiments:

POST /experiments — create
GET /experiments?limit=10&cursor= — list with cursor-based pagination
GET /experiments?status=running — filter by status
PATCH /experiments/:id — update
DELETE /experiments/:id — delete

Daily Logs:

POST /daily-logs — create
GET /daily-logs/:date — get by date
GET /daily-logs?from=&to= — date range query
PATCH /daily-logs/:date — update
DELETE /daily-logs/:date — delete

Local set up instructions: 

1. Clone
2. npm install
3. set DATABASE_URL
4. run npm run migrate:up
5. npm run dev


Some CURL commands to try: 

  Create an experiment: 

  curl -X POST https://researchdailycheck.onrender.com/experiments \
  -H "Content-Type: application/json" \
  -d '{
    "title": "ML Model Training",
    "hypothesis": "New architecture will improve accuracy",
    "status": "running"
  }'

  Get experiment with pagination: 

  curl https://researchdailycheck.onrender.com/experiments?limit=5

  Update an experiment: 

  curl -X PATCH https://researchdailycheck.onrender.com/experiments/1 \
  -H "Content-Type: application/json" \
  -d '{"status": "completed"}'


  Create a log: 

  curl -X POST https://researchdailycheck.onrender.com/daily-logs \
  -H "Content-Type: application/json" \
  -d '{
    "date": "2026-02-07",
    "did": "Trained model for 50 epochs",
    "blockers": "GPU memory issues",
    "todo": "Try smaller batch size",
    "minuteSpent": 120,
    "mood": "productive"
  }'

  Get log by date: 

  curl https://researchdailycheck.onrender.com/daily-logs/2026-02-07
