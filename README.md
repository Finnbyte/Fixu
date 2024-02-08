# Fixu
Fixu is an (extremely) simple Moodle clone with my own twists. It mostly focuses around a **calendar** which shows courses' deadlines, exams or even the user's own personal events.

## Quickstart
```console
git clone https://github.com/Finnbyte/Fixu
cd Fixu
cd backend; npm i
cd ../frontend; npm i
```
Look into `backend/src/index.ts` to see how to configure database credentials using dotenv.

Now just run backend and frontend separately:
```console
cd backend; npm run dev
cd frontend; npm run dev
```
