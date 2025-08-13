# 📧 Email Setup Guide for PCR Project Tracker

## ✅ **Current Email Status**

Your PCR Project Tracker now has **working email functionality** with multiple options:

### **🟢 What Works Now:**
- ✅ **Browser Email Client** - Opens your default email app
- ✅ **Email Content Generation** - Creates detailed project reports
- ✅ **Team Member Selection** - Choose who to send emails to
- ✅ **Content Download** - Save email content as text file
- ✅ **Scrolling Fixed** - Modal now scrolls properly
- ✅ **Notifications** - Team members get notified when emails are sent

---

## 🚀 **Email Options Available**

### **Option 1: Browser Email Client (Recommended for Now)**

**How it works:**
1. Select team members to email
2. Choose email content options
3. Click "Open Email Client"
4. Your default email app opens with pre-filled content
5. Send manually

**Pros:**
- ✅ Works immediately
- ✅ No setup required
- ✅ Uses your existing email account
- ✅ No API keys needed

**Cons:**
- ❌ Requires manual sending
- ❌ Not fully automated

---

### **Option 2: Supabase Edge Function (For Full Automation)**

**How it works:**
1. Deploy the Edge Function to Supabase
2. Configure email service (Gmail, SendGrid, etc.)
3. Send emails directly from the app

**Pros:**
- ✅ Fully automated
- ✅ No manual intervention
- ✅ Professional solution

**Cons:**
- ❌ Requires setup
- ❌ Needs email service configuration

---

## 🔧 **Setting Up Automated Email (Option 2)**

### **Step 1: Deploy Supabase Edge Function**

1. **Install Supabase CLI:**
   ```bash
   npm install -g supabase
   ```

2. **Login to Supabase:**
   ```bash
   supabase login
   ```

3. **Link your project:**
   ```bash
   supabase link --project-ref YOUR_PROJECT_ID
   ```

4. **Deploy the function:**
   ```bash
   supabase functions deploy send-email
   ```

### **Step 2: Configure Email Service**

#### **Option A: Gmail SMTP**

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate App Password:**
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate password for "Mail"

3. **Set Environment Variables in Supabase:**
   ```bash
   supabase secrets set SMTP_HOST=smtp.gmail.com
   supabase secrets set SMTP_PORT=587
   supabase secrets set SMTP_USERNAME=your-email@gmail.com
   supabase secrets set SMTP_PASSWORD=your-app-password
   supabase secrets set SMTP_FROM=your-email@gmail.com
   ```

#### **Option B: SendGrid**

1. **Create SendGrid account** at [sendgrid.com](https://sendgrid.com)
2. **Get API Key** from SendGrid dashboard
3. **Set Environment Variables:**
   ```bash
   supabase secrets set SMTP_HOST=smtp.sendgrid.net
   supabase secrets set SMTP_PORT=587
   supabase secrets set SMTP_USERNAME=apikey
   supabase secrets set SMTP_PASSWORD=your-sendgrid-api-key
   supabase secrets set SMTP_FROM=your-verified-sender@yourdomain.com
   ```

#### **Option C: Your Own SMTP Server**

```bash
supabase secrets set SMTP_HOST=your-smtp-server.com
supabase secrets set SMTP_PORT=587
supabase secrets set SMTP_USERNAME=your-username
supabase secrets set SMTP_PASSWORD=your-password
supabase secrets set SMTP_FROM=noreply@yourdomain.com
```

### **Step 3: Test the Email Function**

1. **Go to your PCR Tracker app**
2. **Open a project**
3. **Click "Send Email"**
4. **Select "Direct Send" method**
5. **Choose recipients and send**

---

## 📧 **Email Content Features**

### **What Gets Included in Emails:**

1. **Project Details:**
   - Project name and description
   - Current status and priority
   - Budget information (allocated, spent, remaining)

2. **Budget Summary:**
   - Total expenses and income
   - Net budget position
   - Budget utilization percentage

3. **Recent Transactions:**
   - Last 10 budget entries
   - Transaction details and amounts
   - Categories and dates

4. **Custom Message:**
   - Your personal message
   - Team communication
   - Project updates

---

## 🎯 **How to Use Email Feature**

### **From Project View:**
1. **Open any project**
2. **Click the "Send Email" button**
3. **Select team members** to email
4. **Choose email method:**
   - **Browser Email Client** (opens your email app)
   - **Direct Send** (requires Supabase setup)
5. **Customize content options**
6. **Send the email**

### **From Top Navigation:**
1. **Click the email icon** in the top bar
2. **Select recipients** from your team
3. **Compose your message**
4. **Choose content to include**
5. **Send the email**

---

## 🔍 **Testing Email Functionality**

### **Test with Browser Method:**
1. **Start your Docker environment:**
   ```bash
   ./docker-manager.sh start-dev
   ```

2. **Access the app:** http://localhost:3000

3. **Log in** with any test account

4. **Open a project** and click "Send Email"

5. **Select team members** and click "Open Email Client"

6. **Your email app should open** with pre-filled content

### **Test with MailHog (Development):**
1. **Access MailHog UI:** http://localhost:8025
2. **Send emails** from the app
3. **View emails** in MailHog interface
4. **No real emails sent** during development

---

## 🛠️ **Troubleshooting**

### **Email Client Not Opening:**
- **Check browser settings** - some browsers block popups
- **Try different browser** - Chrome, Firefox, Safari
- **Check default email app** - ensure it's set up

### **Supabase Function Errors:**
- **Check function logs:**
  ```bash
  supabase functions logs send-email
  ```
- **Verify environment variables:**
  ```bash
  supabase secrets list
  ```
- **Test function directly:**
  ```bash
  curl -X POST https://your-project.supabase.co/functions/v1/send-email \
    -H "Authorization: Bearer YOUR_ANON_KEY" \
    -H "Content-Type: application/json" \
    -d '{"to":["test@example.com"],"subject":"Test","content":"Test email"}'
  ```

### **SMTP Connection Issues:**
- **Check credentials** - username/password correct
- **Verify port** - 587 for TLS, 465 for SSL
- **Check firewall** - ensure port is open
- **Test with telnet:**
  ```bash
  telnet smtp.gmail.com 587
  ```

---

## 📋 **Email Templates**

### **Project Update Template:**
```
Hi Team,

Here's the latest update on [Project Name]:

PROJECT STATUS:
- Status: [Active/Planning/Completed]
- Priority: [High/Medium/Low]
- Budget: RM [Amount]
- Spent: RM [Amount]
- Remaining: RM [Amount]

RECENT ACTIVITIES:
[List of recent transactions]

BUDGET SUMMARY:
- Total Expenses: RM [Amount]
- Total Income: RM [Amount]
- Net Position: RM [Amount]

Please let me know if you have any questions.

Best regards,
[Your Name]
```

### **Budget Alert Template:**
```
Hi Team,

This is a budget alert for [Project Name]:

⚠️ BUDGET ALERT:
- Current spending: RM [Amount]
- Budget limit: RM [Amount]
- Utilization: [Percentage]%

Please review the budget and take necessary action.

Best regards,
[Your Name]
```

---

## 🔄 **Next Steps**

### **For Immediate Use:**
1. **Use browser email method** - works right now
2. **Test with your team** - send project updates
3. **Customize email content** - add your own templates

### **For Full Automation:**
1. **Set up Supabase Edge Function**
2. **Configure email service**
3. **Test automated sending**
4. **Deploy to production**

### **For Advanced Features:**
1. **Add email templates**
2. **Schedule automated reports**
3. **Add email tracking**
4. **Integrate with Slack/Teams**

---

## 📞 **Need Help?**

- **Check logs:** `./docker-manager.sh logs`
- **Test email:** Use browser method first
- **Debug Supabase:** Check function logs
- **Email service:** Contact your email provider

---

**🎉 Your PCR Project Tracker now has working email functionality!**
