# Glory Shopping Backend - Vercel Deployment

## Deployment Steps

### 1. Set Environment Variables in Vercel Dashboard

Go to your Vercel project settings and add these environment variables:

```
DATABASE_URL=your_postgres_connection_string_with_pgbouncer
DIRECT_URL=your_postgres_direct_connection_string
NODE_ENV=production
ACCESSTOKEN_SECRET=your_access_token_secret
REFRESHTOKEN_SECRET=your_refresh_token_secret
BCRYPT_SALT=12
SUPER_ADMIN_EMAIL=admin@example.com
SUPER_ADMIN_PASSWORD=your_secure_password
FRONTEND_URL=https://your-frontend-url.com
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_email_app_password
```

### 2. Deploy to Vercel

```bash
vercel --prod
```

### 3. Run Database Migrations (One-time)

After first deployment, run migrations:

```bash
# Install Vercel CLI if not installed
npm i -g vercel

# Pull environment variables
vercel env pull

# Run migrations locally (connects to production DB)
npm run prisma:migrate
```

### 4. Seed Super Admin (One-time)

Create a seed script or manually insert the super admin user into your database.

## Important Notes

- **Serverless Architecture**: The `api/index.ts` file exports your Express app as a serverless function.
- **No `listen()`**: Vercel handles the server lifecycle, so we don't call `app.listen()`.
- **Cold Starts**: First request might be slower due to serverless cold starts.
- **Connection Pooling**: Make sure to use `DATABASE_URL` with pgbouncer for connection pooling.
- **Prisma Client**: Generated automatically during build via `vercel-build` script.

## Troubleshooting

### Function Timeout
If functions timeout, increase the timeout in `vercel.json`:

```json
{
  "functions": {
    "api/index.ts": {
      "maxDuration": 10
    }
  }
}
```

### Check Logs
```bash
vercel logs
```

### Local Testing
```bash
npm run dev
```
