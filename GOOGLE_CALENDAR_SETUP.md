# Google Calendar Integration Setup Guide

## Step 1: Google Cloud Console Setup

1. **Go to Google Cloud Console**
   - Visit https://console.cloud.google.com/
   - Select your project or create a new one

2. **Enable Google Calendar API**
   - Go to "APIs & Services" > "Library"
   - Search for "Google Calendar API"
   - Click on it and press "Enable"

3. **Create Service Account**
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "Service Account"
   - Name: `412studios-calendar-service`
   - Description: `Service account for 412 Studios calendar integration`
   - Click "Create and Continue"

4. **Grant Permissions (Optional)**
   - You can skip the role assignment for now
   - Click "Continue" then "Done"

5. **Generate Private Key**
   - Click on the newly created service account
   - Go to the "Keys" tab
   - Click "Add Key" > "Create New Key"
   - Select "JSON" format
   - Download the JSON file

## Step 2: Google Calendar Setup

1. **Create or Use Existing Calendar**
   - Go to https://calendar.google.com/
   - Create a new calendar or use an existing one
   - Copy the Calendar ID (found in calendar settings)

2. **Share Calendar with Service Account**
   - In Calendar settings, go to "Share with specific people"
   - Add the service account email (from the JSON file)
   - Give it "Make changes to events" permission

## Step 3: Environment Variables

Add these to your `.env` file:

```bash
# From the downloaded JSON file:
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@project-id.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour private key content here\n-----END PRIVATE KEY-----"

# Your Google Calendar ID
GOOGLE_CALENDAR_ID=your-calendar-id@gmail.com

# For frontend (optional)
NEXT_PUBLIC_GOOGLE_CALENDAR_ID=your-calendar-id@gmail.com
```

## Step 4: Environment Variable Setup Tips

1. **Private Key Formatting**
   - Copy the entire private_key value from the JSON file
   - Keep the quotes and newline characters as `\n`
   - Example: `"-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BA...\n-----END PRIVATE KEY-----"`

2. **Service Account Email**
   - Copy the `client_email` value from the JSON file
   - Should look like: `service-name@project-id.iam.gserviceaccount.com`

3. **Calendar ID**
   - Go to Google Calendar settings
   - Find your calendar in the list
   - Copy the "Calendar ID" (usually ends in @gmail.com or @group.calendar.google.com)

## Step 5: Test the Integration

1. Restart your development server after adding environment variables
2. Go to Admin Dashboard > Calendar tab
3. Click "Sync All Bookings" to test the connection
4. Check your Google Calendar for the synced events

## Troubleshooting

**"Request is missing required authentication credential" error:**
- Check that all environment variables are set correctly
- Ensure the private key is properly formatted with `\n` for newlines
- Verify the service account has access to the calendar

**"Calendar not found" error:**
- Double-check the calendar ID
- Ensure the calendar is shared with the service account email

**"Forbidden" error:**
- The service account needs "Make changes to events" permission on the calendar
- Re-share the calendar with proper permissions

## JSON File Structure Reference

Your downloaded JSON file should look like this:
```json
{
  "type": "service_account",
  "project_id": "your-project-id",
  "private_key_id": "key-id",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
  "client_email": "service-name@project-id.iam.gserviceaccount.com",
  "client_id": "client-id",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/..."
}
```

Use the `client_email` and `private_key` values in your environment variables.