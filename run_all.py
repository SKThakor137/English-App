#!/usr/bin/env python3
"""
English Speaking & Communication Platform - Master Unified Runner
Starts all services (Infra, Backend API, Learner Web, Admin Portal, and Mobile ADB).

Usage:
  python3 run_all.py             # Starts Infra, Backend, Web, and Admin
  python3 run_all.py --mobile    # Starts Infra, Backend, Web, Admin, and Flutter Mobile
"""

import sys
import os
import signal
import subprocess
import threading
import time
import shutil

# ANSI Color codes for clean formatted logs
RESET = "\033[0m"
BOLD = "\033[1m"
GREEN = "\033[32m"
CYAN = "\033[36m"
MAGENTA = "\033[35m"
YELLOW = "\033[33m"
BLUE = "\033[34m"
RED = "\033[31m"

PROJECT_ROOT = os.path.dirname(os.path.abspath(__file__))
PROCESSES = []
STOPPING = False


def log(tag: str, color: str, message: str):
    prefix = f"{color}{BOLD}[{tag}]{RESET} "
    print(f"{prefix}{message}", flush=True)


def stream_output(proc: subprocess.Popen, tag: str, color: str):
    """Streams stdout from a child process with a colored prefix."""
    try:
        for line in iter(proc.stdout.readline, b""):
            if STOPPING:
                break
            line_str = line.decode("utf-8", errors="replace").rstrip()
            if line_str:
                print(f"{color}[{tag}]{RESET} {line_str}", flush=True)
    except Exception:
        pass


def check_and_start_infra():
    """Starts PostgreSQL, Redis, and MinIO if Docker is installed and running."""
    docker_bin = shutil.which("docker")
    if not docker_bin:
        log("INFRA", YELLOW, "Docker not found in PATH. Assuming local native PostgreSQL/Redis.")
        return

    # Check if Docker daemon is responding
    try:
        res = subprocess.run([docker_bin, "info"], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, timeout=4)
        if res.returncode == 0:
            log("INFRA", BLUE, "Starting PostgreSQL, Redis, and MinIO via docker-compose...")
            compose_cmd = ["docker", "compose", "up", "-d"]
            res_compose = subprocess.run(compose_cmd, cwd=PROJECT_ROOT, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
            if res_compose.returncode != 0:
                # Fallback to docker-compose legacy
                subprocess.run(["docker-compose", "up", "-d"], cwd=PROJECT_ROOT, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
            log("INFRA", GREEN, "✓ Containers started successfully.")
        else:
            log("INFRA", YELLOW, "Docker daemon not running. Skipping docker-compose up.")
    except Exception as e:
        log("INFRA", YELLOW, f"Docker check skipped: {e}")


def setup_adb_reverse():
    """Checks for connected Android phone and forwards port 4000 over USB."""
    adb_bin = shutil.which("adb")
    if not adb_bin:
        # Check custom android-sdk install
        custom_adb = os.path.expanduser("~/.android-sdk/platform-tools/adb")
        if os.path.exists(custom_adb):
            adb_bin = custom_adb

    if not adb_bin:
        return

    try:
        output = subprocess.check_output([adb_bin, "devices"], timeout=3).decode("utf-8")
        lines = [l for l in output.strip().split("\n")[1:] if l.strip()]
        connected = [l.split()[0] for l in lines if "device" in l]

        if connected:
            log("ADB", GREEN, f"Found connected Android device: {connected[0]}")
            subprocess.run([adb_bin, "reverse", "tcp:4000", "tcp:4000"], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
            log("ADB", GREEN, "✓ Forwarded mobile port 4000 -> PC localhost:4000 over USB.")
        else:
            log("ADB", YELLOW, "No USB device detected yet (run 'adb devices' after plugging in phone).")
    except Exception:
        pass


def check_dependencies():
    """Ensures npm dependencies are installed across workspaces."""
    node_modules_dir = os.path.join(PROJECT_ROOT, "node_modules")
    if not os.path.exists(node_modules_dir):
        log("SETUP", BLUE, "node_modules missing. Running 'npm install' for all workspaces...")
        res = subprocess.run(["npm", "install"], cwd=PROJECT_ROOT)
        if res.returncode == 0:
            log("SETUP", GREEN, "✓ npm install completed successfully.")
        else:
            log("SETUP", YELLOW, "npm install finished with warnings, continuing...")


def check_prisma():
    """Ensures Prisma client is generated before launching backend."""
    prisma_client_dir = os.path.join(PROJECT_ROOT, "backend", "node_modules", ".prisma")
    if not os.path.exists(prisma_client_dir):
        log("PRISMA", BLUE, "Generating Prisma Client...")
        subprocess.run(["npm", "--workspace=backend", "run", "prisma:generate"], cwd=PROJECT_ROOT, stdout=subprocess.DEVNULL)
        log("PRISMA", GREEN, "✓ Prisma Client ready.")


def spawn_process(name: str, color: str, cmd: list, cwd: str = PROJECT_ROOT) -> subprocess.Popen:
    """Spawns a child process in a new process group and starts streaming its logs."""
    log(name, color, f"Starting: {' '.join(cmd)}")
    proc = subprocess.Popen(
        cmd,
        cwd=cwd,
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
        preexec_fn=os.setsid,  # Create process group for clean tree kill
        bufsize=1,
    )
    PROCESSES.append((name, proc))

    thread = threading.Thread(target=stream_output, args=(proc, name, color), daemon=True)
    thread.start()
    return proc


def print_banner(include_mobile: bool):
    print("\n" + "=" * 65, flush=True)
    print(f"{CYAN}{BOLD}  ENGLISH SPEAKING & COMMUNICATION PLATFORM - ALL SERVICES RUNNING{RESET}", flush=True)
    print("=" * 65, flush=True)
    print(f"  🚀 {BOLD}Backend API:{RESET}           {GREEN}http://localhost:4000/api/v1{RESET}")
    print(f"  📖 {BOLD}Swagger API Docs:{RESET}      {GREEN}http://localhost:4000/api/docs{RESET}")
    print(f"  🎓 {BOLD}Learner Web Portal:{RESET}    {CYAN}http://localhost:3000{RESET}")
    print(f"  ⚙️  {BOLD}Admin Operations:{RESET}      {MAGENTA}http://localhost:3001{RESET}")
    if include_mobile:
        print(f"  📱 {BOLD}Mobile App:{RESET}            {YELLOW}Running on connected device (Flutter){RESET}")
    else:
        print(f"  📱 {BOLD}Mobile App:{RESET}            {YELLOW}Connect USB & run: cd mobile && flutter run{RESET}")
    print("=" * 65)
    print(f"  {YELLOW}Press Ctrl+C at any time to gracefully terminate all services.{RESET}\n", flush=True)


def stop_all(signum=None, frame=None):
    global STOPPING
    if STOPPING:
        return
    STOPPING = True

    print(f"\n\n{YELLOW}{BOLD}==> Stopping all services cleanly...{RESET}", flush=True)

    for name, proc in reversed(PROCESSES):
        if proc.poll() is None:
            try:
                # Terminate entire process group
                os.killpg(os.getpgid(proc.pid), signal.SIGTERM)
            except Exception:
                pass

    # Give processes a brief moment to finish graceful teardown
    time.sleep(1)

    for name, proc in PROCESSES:
        if proc.poll() is None:
            try:
                os.killpg(os.getpgid(proc.pid), signal.SIGKILL)
            except Exception:
                pass

    print(f"{GREEN}==> All services have been stopped. Goodbye!{RESET}", flush=True)
    sys.exit(0)


def main():
    include_mobile = "--mobile" in sys.argv or "-m" in sys.argv

    signal.signal(signal.SIGINT, stop_all)
    signal.signal(signal.SIGTERM, stop_all)

    # 1. Start Infrastructure (Docker)
    check_and_start_infra()

    # 2. Port Reverse for Android Mobile
    setup_adb_reverse()

    # 3. Check Dependencies & Prisma
    check_dependencies()
    check_prisma()

    # 4. Launch Backend, Learner Web, and Admin Web
    spawn_process("BACKEND", GREEN, ["npm", "--workspace=backend", "run", "start:dev"])
    spawn_process("WEB", CYAN, ["npm", "--workspace=@english-platform/web", "run", "dev"])
    spawn_process("ADMIN", MAGENTA, ["npm", "--workspace=@english-platform/admin", "run", "dev"])

    # 5. Optionally launch Mobile
    if include_mobile:
        mobile_dir = os.path.join(PROJECT_ROOT, "mobile")
        flutter_bin = shutil.which("flutter")
        if flutter_bin and os.path.exists(mobile_dir):
            spawn_process("MOBILE", YELLOW, [flutter_bin, "run"], cwd=mobile_dir)
        else:
            log("MOBILE", RED, "Flutter executable not found in PATH or mobile/ dir missing.")

    # 6. Display Dashboard Banner
    time.sleep(1.5)
    print_banner(include_mobile)

    # 7. Keep main thread alive
    try:
        while not STOPPING:
            time.sleep(0.5)
    except KeyboardInterrupt:
        stop_all()


if __name__ == "__main__":
    main()

