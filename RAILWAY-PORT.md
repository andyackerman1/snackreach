# Railway Port Configuration

## What Port to Use

Your server is configured to use:
- **Port 3000** (default)
- Railway automatically sets `PORT` environment variable
- Your server uses: `process.env.PORT || 3000`

## In Railway Settings

When Railway asks for the port:
- **Enter: `3000`**
- Or leave it blank if Railway auto-detects it

Railway will automatically:
1. Set the `PORT` environment variable
2. Your server will listen on that port
3. Railway routes traffic to it

## After Generating Domain

Once you generate the domain, Railway will give you a URL like:
- `snackreach-production.up.railway.app`

Then I'll update your frontend to use this URL!

