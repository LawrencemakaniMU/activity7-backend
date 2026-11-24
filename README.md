# Activity 7 - IT Support Desk API (Node.js + Express + PostgreSQL)

## 1. Create the hosted database (free, does not expire)
1. Sign up at https://neon.tech and create a project (any name, e.g. `it-support-desk`).
2. Copy the **connection string** (starts with `postgresql://`). That is your `DATABASE_URL`.

## 2. Run it on your computer
```
npm install
copy .env.example .env        (Mac/Linux: cp .env.example .env)
```
Open `.env`, paste your `DATABASE_URL`, then:
```
npm run setup      # creates the table and inserts 8 starting records (safe to run twice)
npm start          # http://localhost:3000
```
PowerShell blocked npm? Use `npm.cmd` instead of `npm`.
Edit `STUDENT_NUMBER` at the top of `server.js` before deploying.

## 3. Test it
With the server running, in a second terminal:
```
npm run smoke -- http://localhost:3000
```
It runs the whole Section 7 checklist and prints PASS/FAIL. Also try a few requests by hand in Postman.
Restart persistence test: POST a record, stop and start the server, GET it again.

## 4. Deploy to Render
1. Push this folder to GitHub (`.env` and `node_modules` are ignored; **do commit package-lock.json**).
2. Render > New > Web Service > pick the repo (set Root Directory if the folder is inside another).
3. Runtime Node, Build command `npm install`, Start command `npm start`, Free instance.
4. Environment variables: `DATABASE_URL` (the Neon string) and `CLIENT_ORIGINS`
   (e.g. `http://localhost:5500,http://127.0.0.1:5500`; Activity 8 will add your Netlify address).
5. Deploy, open the HTTPS URL (you should see the API guide), then run:
```
npm run smoke -- https://your-backend.onrender.com
```
Submit the base URL, for example `https://your-backend.onrender.com`.
