# Local Setup Guide — Food Rescue Connect

This guide targets Windows and PowerShell, but the same general steps apply to macOS/Linux with command changes. Confirm actual project folders and versions before running commands.

## 1. Prerequisites

Install or verify:
- Git
- Node.js LTS and npm
- A JDK supported by the project's Spring Boot version
- Maven (or use the project's Maven Wrapper if present)
- MySQL Server and a MySQL client

Verify:

```powershell
git --version
node --version
npm --version
java -version
javac -version
mvn -version
mysql --version
```

A command not being found means it may be missing or absent from PATH. Do not install a second version before checking the existing installation.

## 2. Inspect the repository

From the repository root:

```powershell
git status
git branch --show-current
Get-ChildItem
```

Expected team branch: `main`.

Do not run destructive commands such as `git reset --hard` or `git clean -fd` to fix setup issues.

## 3. Frontend setup

```powershell
cd frontend
npm install
```

If a committed `package-lock.json` exists, prefer `npm ci` for a reproducible clean install when the environment is ready.

Create `.env` only if needed:

```text
VITE_API_BASE_URL=http://localhost:8080/api
```

Start the frontend:

```powershell
npm run dev
```

Vite commonly uses `http://localhost:5173`. Use the actual URL printed in the terminal.

Production build:

```powershell
npm run build
```

## 4. MySQL setup

Create the database in a MySQL client:

```sql
CREATE DATABASE food_rescue_connect;
```

Use a local database user and password configured for your own machine. Do not paste credentials into chat or commit them to Git.

The backend must use the actual local connection settings. See `DATABASE_SCHEMA.md`.

## 5. Backend setup

Open a second terminal:

```powershell
cd backend
```

If Maven Wrapper files are present, use the wrapper:

```powershell
.\mvnw.cmd test
.\mvnw.cmd spring-boot:run
```

Otherwise:

```powershell
mvn test
mvn spring-boot:run
```

If configuration is environment-variable based, set the required variables in the current PowerShell session according to the project's actual `application.properties.example`. Do not assume variable names that the application does not read.

The backend commonly listens on port `8080`, but verify the logs and configuration.

## 6. Start order

1. Start MySQL.
2. Start Spring Boot.
3. Start the React/Vite frontend.
4. Open the frontend URL printed by Vite.
5. Create a test listing.
6. Refresh the page and confirm it persists.
7. Claim the listing and verify the status change.
8. Attempt a duplicate claim and confirm it is rejected.

## 7. Common problems

### `npm` is not recognized
Check Node installation and PATH. Restart the terminal after installation.

### PowerShell blocks `npm.ps1`
Try `npm.cmd` in PowerShell, or use Command Prompt. Do not weaken machine-wide execution policy without understanding the security impact.

### `next: not found`
This project is intended to use Vite unless the repository already uses another framework. Inspect `package.json`; do not install Next.js to fix a Vite project.

### `mvn` is not recognized
Use the Maven Wrapper if present or install Maven and verify PATH.

### Java version mismatch
Compare `java -version`, `mvn -version`, and the Spring Boot version. Maven may be using a different JDK from the terminal.

### MySQL connection refused
Check whether the MySQL service is running, the port is correct, and the JDBC URL matches the local configuration.

### Access denied for MySQL
Verify local username, password, and database permissions. Never put credentials in a committed file.

### CORS error
Confirm the frontend origin and backend CORS configuration. A typical Vite origin is `http://localhost:5173`, but use the actual origin.

### Frontend shows an error when backend is down
This is expected. The UI should show an API error, not silently claim that mock data was saved.

## 8. Before submission

- Frontend build succeeds.
- Backend tests succeed.
- Database persistence is verified.
- No secrets are tracked by Git.
- README startup steps have been tested.
- All untested behavior is reported as unverified.
