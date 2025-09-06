# 📧 EmailJS Setup Guide - 5 Minute Configuration

## ✅ **Code Already Implemented!**
Your website is ready - just need to add your EmailJS credentials.

---

## 🚀 **Step 1: Create EmailJS Account (2 minutes)**

1. **Go to:** [emailjs.com](https://emailjs.com)
2. **Sign up** for free account
3. **Verify your email**

---

## 🔧 **Step 2: Add Email Service (1 minute)**

1. **Dashboard → Email Services → Add Service**
2. **Choose:** Gmail (or your email provider)
3. **Connect your email:** `benjamin@badgertechnologies.us`
4. **Save Service ID** (looks like: `service_abc123`)

---

## 📝 **Step 3: Create Email Templates (2 minutes)**

### **Template 1: Admin Notification (to you)**
**Template ID:** `admin_notification`
```
Subject: New Contact Form Submission - {{service}}

Hi Benjamin,

You have a new contact form submission:

Name: {{name}}
Email: {{email}}
Service Interest: {{service}}
Message: {{message}}

Reply to: {{reply_to}}

--
Badger Technologies Contact Form
```

### **Template 2: User Confirmation (to customer)**
**Template ID:** `user_confirmation`
```
Subject: Thank you for contacting Badger Technologies

Hi {{to_name}},

Thank you for your interest in our {{service}} services! 

We received your message and will respond within 24 hours during business hours.

Your message: {{message}}

Best regards,
Benjamin
Badger Technologies
📧 benjamin@badgertechnologies.us
📞 (779) 356-5377

--
This is an automated confirmation. Please do not reply to this email.
```

---

## 🔑 **Step 4: Get Your Keys**

1. **Dashboard → Account → API Keys**
2. **Copy these 3 values:**
   - **Public Key:** (looks like: `user_abc123def456`)
   - **Service ID:** (looks like: `service_xyz789`)

---

## ⚡ **Step 5: Update Your Website**

Open `script.js` and replace the placeholder values:

```javascript
const EMAILJS_CONFIG = {
    publicKey: 'user_YOUR_ACTUAL_KEY',           // Replace this
    serviceId: 'service_YOUR_ACTUAL_ID',         // Replace this  
    adminTemplateId: 'admin_notification',       // Keep this
    userTemplateId: 'user_confirmation'          // Keep this
};
```

---

## 🚀 **Step 6: Deploy & Test**

1. **Save the file**
2. **Git push to deploy:**
   ```bash
   git add .
   git commit -m "Added EmailJS configuration"
   git push
   ```
3. **Test the contact form** on your live site!

---

## ✨ **What You'll Get:**

✅ **You receive:** Email notification for every form submission  
✅ **Customer receives:** Professional confirmation email  
✅ **Backup:** Still works with Netlify if EmailJS fails  
✅ **Free tier:** 200 emails/month included  

---

## 🔧 **Template Variables Available:**

**For both templates:**
- `{{name}}` - Customer's name
- `{{email}}` - Customer's email  
- `{{service}}` - Service they selected
- `{{message}}` - Their message
- `{{to_name}}` - Recipient name
- `{{to_email}}` - Recipient email
- `{{reply_to}}` - Customer's email for replies

---

## 🎯 **Pro Tips:**

1. **Test first** with a personal email before going live
2. **Check spam folders** for the first few emails
3. **Templates can be edited** anytime in EmailJS dashboard
4. **Free tier limits:** 200 emails/month, then $15/month for more

---

**Need help?** The code is already implemented and ready to work as soon as you add your EmailJS credentials!
