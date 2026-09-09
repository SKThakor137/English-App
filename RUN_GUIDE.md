# System Run & Execution Guide
## English Speaking & Communication Platform

This guide provides both a **single unified command** to start all services simultaneously, as well as **individual commands** for each component (Backend, Web, Admin, and Direct Mobile).

---

## ⚡ 1. Single Command: Run Everything Together

You can start the **Backend API**, **Learner Web Portal**, and **Admin Console** concurrently using a single command:

```bash
npm run dev:all
```
*(Or alternatively: `bash scripts/run-all.sh`)*

This script automatically:
1. Checks for Docker and spins up PostgreSQL, Redis, and MinIO.
2. Checks if an Android phone is plugged in via USB and reverses port `4000`.
3. Concurrently boots:
   - **Backend API**: `http://localhost:4000` (Swagger docs: `http://localhost:4000/api/docs`)
   - **Learner Web**: `http://localhost:3000`
   - **Admin Console**: `http://localhost:3001`
4. Gracefully stops all background processes when you press `Ctrl+C`.

---

## 🛠️ 2. Separate Commands (Run in Independent Terminals)

If you prefer to run each service in its own terminal window:

### Step A: Infrastructure (PostgreSQL, Redis, MinIO)
```bash
# Start Docker database and cache containers in background
docker-compose up -d

# Check status of containers
docker ps
```

### Step B: Database Schema & Seed Data
```bash
# Generate Prisma Client
npm run prisma:generate

# Populate default courses, CEFR lessons, and practice sentences
npm run prisma:seed
```

### Step C: Backend Modular Monolith API (Port 4000)
```bash
# Starts NestJS with hot reload on Port 4000
npm run dev:backend
```
- API Base URL: `http://localhost:4000/api/v1`
- Swagger Interactive Docs: `http://localhost:4000/api/docs`
- Health Probe: `http://localhost:4000/api/v1/health`

### Step D: Learner Web Portal (Port 3000)
```bash
# Starts Next.js 15 Learner Portal on Port 3000
npm run dev:web
```
- Open browser at: `http://localhost:3000`
- Includes: Practice Gym, Sentence Evaluator, AI Voice Roleplay, PDF Drills, SRS Flashcards.

### Step E: Admin Operations Console (Port 3001)
```bash
# Starts Next.js 15 Admin Console on Port 3001
npm run dev:admin
```
- Open browser at: `http://localhost:3001`
- Includes: Curriculum & IPA authoring studio, BullMQ queue telemetry, user quotas, challenge scheduler.

---

## 📱 3. How to Run Directly on Your Physical Android Mobile

Follow these steps to run the Flutter mobile app directly on your physical Android phone using `adb`:

### Step 1: Enable Developer Options on Your Phone
1. On your Android phone, go to **Settings** > **About Phone**.
2. Find **Build Number** and tap it **7 times** continuously.
3. You will see a notification saying *"You are now a developer!"*.

### Step 2: Enable USB Debugging
1. Go to **Settings** > **System** (or **Additional Settings**) > **Developer Options**.
2. Scroll down and toggle **USB Debugging** to **ON**.
3. (Optional on Xiaomi/MIUI/Oppo/Realme): Also enable **Install via USB** and **USB debugging (Security settings)** if prompted.

### Step 3: Connect Mobile to PC via USB Cable
1. Connect your phone to your computer using a USB data cable.
2. If prompted on your phone, set the USB mode to **File Transfer / MTP** (not "Charge Only").
3. A popup will appear on your phone screen asking:
   > *"Allow USB debugging from this computer?"*
4. Check **"Always allow from this computer"** and tap **Allow / OK**.

### Step 4: Verify Phone Connection in Terminal
In your terminal, run:
```bash
adb devices
```
You should see your device listed as `device`:
```text
List of devices attached
96395b28    device
```
*(If it shows `unauthorized`, unlock your phone screen and tap "Allow" on the permission prompt).*

### Step 5: Reverse the API Port to Mobile (Crucial Step)
Run this command to bridge your computer's backend API directly to your physical phone over USB:
```bash
adb reverse tcp:4000 tcp:4000
```
> **Why this is important**: This forwards your phone's internal port `4000` to your computer's port `4000`. The mobile app can now connect to `http://127.0.0.1:4000/api/v1` without worrying about firewalls, Wi-Fi networks, or IP address changes!

You can also run the npm shortcut:
```bash
npm run mobile:adb
```

### Step 6: Launch the App on Your Mobile
```bash
cd mobile
flutter run
```
Flutter will compile the debug APK, install it directly onto your connected phone, and launch the app with live hot-reload (`r` to reload, `R` to restart).

---

## 🌐 4. Alternative: Running on Mobile Over Local Wi-Fi (No Cable)

If your mobile and computer are connected to the same Wi-Fi router:

1. Find your computer's local IP address:
   ```bash
   hostname -I | awk '{print $1}'
   # Example: 192.168.1.45
   ```
2. Run Flutter while passing your computer's IP address:
   ```bash
   cd mobile
   flutter run --dart-define=API_URL=http://<YOUR_COMPUTER_IP>:4000/api/v1
   ```

---

## 📋 5. Services & Ports Quick Reference

| Service | Technology | Port | Access URL |
|---|---|---|---|
| **Backend API** | NestJS 10 / Node.js | `4000` | [http://localhost:4000/api/v1](http://localhost:4000/api/v1) |
| **API Documentation** | Swagger OpenAPI | `4000` | [http://localhost:4000/api/docs](http://localhost:4000/api/docs) |
| **Learner Web Portal** | Next.js 15 / React 19 | `3000` | [http://localhost:3000](http://localhost:3000) |
| **Admin Operations** | Next.js 15 / Tailwind | `3001` | [http://localhost:3001](http://localhost:3001) |
| **PostgreSQL Database** | Postgres 16 | `5432` | `postgresql://postgres:postgres@localhost:5432/english_platform` |
| **Redis Cache** | Redis 7 | `6379` | `redis://localhost:6379` |
| **MinIO S3 Storage** | MinIO | `9000` / `9001` | S3 API: `http://localhost:9000` • UI: [http://localhost:9001](http://localhost:9001) |
| **Mobile App** | Flutter 3.x (Dart) | USB/ADB | `adb reverse tcp:4000 tcp:4000 && flutter run` |
