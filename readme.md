# SuperTokens Passwordless Authentication Demo

This project demonstrates passwordless authentication using SuperTokens with magic links. It includes a Node.js backend, SuperTokens Core running in Docker, and a simple frontend implementation.

## Prerequisites

- Node.js (14+)
- Docker and Docker Compose
- npx (comes with Node.js)

## Running the Application

You need to run three components in separate terminal windows:

### 1. Start Docker Services (Terminal 1)
```bash
# Start SuperTokens Core and PostgreSQL
docker-compose up -d

# Verify containers are running
docker ps
# Should show supertokens-core and supertokens-db containers
```

### 2. Start Node.js Backend (Terminal 2)
```bash
# Start the authentication server
npm start

# Server should start on http://localhost:3001
# You should see: "Server running on http://localhost:3001"
```

### 3. Start Frontend Server (Terminal 3)
```bash
# From your site directory, run the static file server
npx serve -s .

# Should show something like:
# "Serving! ▲
#  - Local:    http://localhost:3000
#  - Network:  http://192.168.1.x:3000"
```

## Testing the Setup

### 1. Verify Services
```bash
# Check SuperTokens Core
curl http://localhost:3567/hello
# Should return "Hello"

# Check Node.js backend
curl http://localhost:3001/api/public/health
# Should return health status

# Verify frontend
# Open http://3.131.82.143:3000 in your browser
# Should see the login page
```

### 2. Complete Authentication Flow

1. **Request Magic Link:**
   - Open http://3.131.82.143:3000
   - Enter your email address
   - Click "Send Magic Link"
   - You should see success message
   - Check Terminal 2 (Node.js backend) for the magic link

2. **Use Magic Link:**
   - Copy the entire magic link from the terminal
   - Paste it into a browser
   - Should see "Verifying your login..."
   - Then "Login successful!"

3. **Verify Session:**
   - After successful login, you'll be on the dashboard
   - Try refreshing the page - should stay logged in
   - Try the API test buttons if available

4. **Test Link Expiration:**
   - Try using the same magic link again
   - Should see "Verification failed: RESTART_FLOW_ERROR"
   - This is expected - links are single-use only

### Common Test Scenarios

1. **Fresh Login:**
   ```
   Clear browser cookies → Enter email → Use magic link → Should succeed
   ```

2. **Expired Link:**
   ```
   Wait 15+ minutes → Use magic link → Should fail with expiration error
   ```

3. **Reused Link:**
   ```
   Use link → Try same link again → Should fail with RESTART_FLOW_ERROR
   ```

4. **Invalid Link:**
   ```
   Modify link URL → Try to use it → Should fail with verification error
   ```

## Configuration Files

### docker-compose.yml
Sets up SuperTokens Core and PostgreSQL:
```yaml
services:
  supertokens-db:
    image: postgres:13
    environment:
      POSTGRES_USER: supertokens_user
      POSTGRES_PASSWORD: supertokens_password
      POSTGRES_DB: supertokens
    ports:
      - "5432:5432"
    networks:
      - supertokens-network

  supertokens-core:
    image: registry.supertokens.io/supertokens/supertokens-postgresql:9.3.0
    depends_on:
      supertokens-db:
        condition: service_healthy
    ports:
      - "3567:3567"
    networks:
      - supertokens-network
    environment:
      POSTGRESQL_CONNECTION_URI: "postgresql://supertokens_user:supertokens_password@supertokens-db:5432/supertokens"
```

### .env
Configure your environment variables:
```plaintext
SUPERTOKENS_CONNECTION_URI=http://localhost:3567
SUPERTOKENS_API_KEY=your_api_key
```

## Troubleshooting Commands

If things aren't working:

1. **Restart All Services:**
   ```bash
   # Stop everything
   docker-compose down
   pkill node
   pkill serve

   # Start again in order:
   docker-compose up -d
   npm start  # in new terminal
   npx serve -s .  # in new terminal
   ```

2. **Check Logs:**
   ```bash
   # Docker logs
   docker logs supertokens-core
   docker logs supertokens-db

   # Node.js logs are in Terminal 2
   # Frontend server logs are in Terminal 3
   ```

3. **Verify Network:**
   ```bash
   # Should all return successful responses
   curl http://localhost:3567/hello
   curl http://localhost:3001/api/public/health
   curl http://localhost:3000
   ```

## Development Tips

- Keep all three terminal windows visible to monitor logs
- Press Ctrl+D in the frontend to see debug information
- Use browser dev tools (F12) to:
  - Check Network tab for API calls
  - Look for errors in Console tab
  - Inspect cookies in Application tab
- Monitor Terminal 2 for magic links and backend errors

## File Structure

```
├── docker-compose.yml    # Docker configuration
├── server.js            # Node.js backend
├── index.html           # Frontend login/verification page
└── .env                 # Environment variables
```

## Security Notes

- Magic links are single-use only
- Links expire after 15 minutes
- Session cookies are HTTP-only
- CORS is configured for specific domains
- PostgreSQL is password protected

## Troubleshooting Common Issues

1. **Docker Issues**
   ```bash
   # Restart containers
   docker-compose down
   docker-compose up -d
   
   # Check logs
   docker logs supertokens-core
   docker logs supertokens-db
   ```

2. **Magic Link Not Working**
   - Links can only be used once
   - Links expire after 15 minutes
   - Check server console for errors
   - Press Ctrl+D on frontend for debug information

3. **Session Issues**
   - Clear browser cookies
   - Check browser console for CORS errors
   - Verify backend is running and accessible

## Additional Resources

- [SuperTokens Documentation](https://supertokens.com/docs/passwordless/introduction)
- [Docker Documentation](https://docs.docker.com/)
- [Node.js Documentation](https://nodejs.org/docs)

## Note you don't really need 
needed:
index.html - This handles both the login and verification process
dashboard.html - This is where users go after successful login

You can delete:

login.html - functionality is now in index.html
verify.html - functionality is now in index.html
