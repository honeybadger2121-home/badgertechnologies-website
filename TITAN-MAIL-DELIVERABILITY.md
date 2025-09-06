# 📧 Titan Mail - Spam Prevention & Email Deliverability Guide

## 🎯 **Current Situation:**
- **Your Email:** benjamin@badgertechnologies.us (Titan Mail)
- **Domain:** badgertechnologies.us 
- **Issue:** Emails going to spam folders

---

## 🚀 **Step 1: DNS Records Setup (Most Important)**

### **SPF Record** (Sender Policy Framework)
Add this TXT record to your DNS:

```
Name: @ (or badgertechnologies.us)
Type: TXT
Value: v=spf1 include:titan.email ~all
```

### **DKIM Record** (DomainKeys Identified Mail)
1. **Login to Titan Admin Console**
2. **Go to:** Domain Settings → Authentication
3. **Enable DKIM** and copy the record
4. **Add to DNS:** The TXT record Titan provides

### **DMARC Record** (Domain-based Message Authentication)
Add this TXT record:

```
Name: _dmarc
Type: TXT  
Value: v=DMARC1; p=quarantine; rua=mailto:benjamin@badgertechnologies.us
```

---

## 🔧 **Step 2: Titan Mail Configuration**

### **Authentication Setup:**
1. **Titan Admin → Domain Settings**
2. **Enable:** DKIM signing
3. **Enable:** SPF validation  
4. **Set:** Return-Path to your domain

### **Email Signature Setup:**
Always include professional signature:
```
Benjamin
Badger Technologies
📧 benjamin@badgertechnologies.us
📞 (779) 356-5377
🌐 badgertechnologies.us
```

---

## 📨 **Step 3: Email Content Best Practices**

### **Subject Lines - AVOID:**
- ALL CAPS TEXT
- Excessive punctuation!!!
- Words like "FREE", "URGENT", "GUARANTEED"
- Multiple exclamation marks

### **Subject Lines - USE:**
- "Re: Your IT consultation request"
- "Badger Technologies - Follow up"
- "Your IT assessment results"

### **Email Content:**
- **Professional tone** - no sales language
- **Proper formatting** - avoid excessive bold/colors  
- **Real contact info** - phone, address, website
- **Unsubscribe option** (if sending marketing emails)

---

## 🎯 **Step 4: Warm Up Your Email**

### **Start Small:**
1. **Week 1:** Send 5-10 emails/day
2. **Week 2:** Send 15-20 emails/day
3. **Week 3:** Send 25-30 emails/day
4. **Week 4+:** Normal volume

### **Engage Recipients:**
- **Ask them to reply** to your emails
- **Request:** "Please add me to your contacts"
- **Send from:** benjamin@badgertechnologies.us consistently

---

## 🔍 **Step 5: Monitor & Test**

### **Test Your Setup:**
1. **Go to:** [mail-tester.com](https://mail-tester.com)
2. **Send test email** to the provided address
3. **Check score** - aim for 8+/10

### **Check Blacklists:**
1. **Go to:** [mxtoolbox.com/blacklists.aspx](https://mxtoolbox.com/blacklists.aspx)
2. **Enter:** badgertechnologies.us
3. **Remove from blacklists** if listed

---

## ⚡ **Step 6: Immediate Actions**

### **Contact Your Recipients:**
1. **Call/text important contacts**
2. **Ask them to:** 
   - Check spam folders for your emails
   - Mark as "Not Spam" 
   - Add benjamin@badgertechnologies.us to contacts
   - Reply to your emails (engagement helps)

### **Gmail/Outlook Specific:**
- **Gmail:** Ask contacts to move your emails to "Primary" tab
- **Outlook:** Ask them to add you to "Safe Senders"

---

## 🛠️ **Technical Implementation for Your Domain**

### **Where to Add DNS Records:**
Since you're using **badgertechnologies.us**, add these records where you manage your domain DNS (likely where you bought the domain).

### **DNS Records to Add:**

```dns
# SPF Record
@ TXT "v=spf1 include:titan.email ~all"

# DMARC Record  
_dmarc TXT "v=DMARC1; p=quarantine; rua=mailto:benjamin@badgertechnologies.us"

# DKIM Record (get from Titan dashboard)
default._domainkey TXT "[DKIM key from Titan]"
```

---

## 🎯 **Step 7: Long-term Reputation Building**

### **Engagement Metrics:**
- **High open rates** (>20%)
- **Replies and responses** 
- **Low bounce rate** (<5%)
- **No spam complaints**

### **Email List Hygiene:**
- **Remove bounced emails** immediately
- **Segment your contacts** 
- **Send relevant content** only
- **Avoid purchased email lists**

---

## 🚨 **Red Flags to Avoid:**

❌ **Sending too many emails too fast**  
❌ **Using spam trigger words**  
❌ **No authentication records**  
❌ **Purchased email lists**  
❌ **Generic/suspicious content**  
❌ **Inconsistent sending patterns**  

---

## ✅ **Quick Wins (Do Today):**

1. **Set up SPF record** (5 minutes)
2. **Enable DKIM in Titan** (5 minutes)  
3. **Test email with mail-tester.com**
4. **Contact 5 recent clients** - ask them to check spam folders
5. **Professional email signature** on all emails

---

## 📞 **Need Help?**

**Titan Support:** They can help with DKIM setup  
**Domain Provider:** Help with DNS record changes  
**Email Marketing:** Consider professional tools for newsletters  

The key is **authentication + reputation + engagement**. Fix the DNS records first - that's 80% of the solution!
