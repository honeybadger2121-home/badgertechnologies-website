# Mailchimp Custom Fields Setup Guide



## ✅ Custom Fields Already Configured!


Great news! Based on your Mailchimp audience setup, you already have the required custom fields configured for the Badger Technologies campaign.

---


## ✅ Confirmed Active Fields



### 1. **Company Name** ✅ READY

- **Field Label:** Company

- **Merge Tag:** `*|COMPANY|*` (or `*|MMMERGE6|*`)

- **Field Type:** Text

- **Status:** ✅ Already configured in your Mailchimp audience



### 2. **Industry** ✅ READY

- **Field Label:** Industry

- **Merge Tag:** `*|INDUSTRY|*` (or `*|MMMERGE17|*`)

- **Field Type:** Text

- **Status:** ✅ Already configured in your Mailchimp audience



### 3. **Additional Useful Fields Available**

From your setup, I can see you also have:

- **Job Title** → `*|MMMERGE8|*` or `*|MMMERGE8|*`

- **Phone Number** → `*|PHONE|*` or `*|MMMERGE4|*`

- **Company Employee Size** → `*|MMMERGE13|*` or `*|MMMERGE13|*`

- **Company Industries** → `*|MMMERGE15|*` or `*|MMMERGE15|*`


---


## 🚀 You're Ready to Launch!


Since your custom fields are already configured, you can proceed directly to importing contacts and launching your campaign.


### ✅ Confirmed Field Mapping for Your CSV Import:


When importing your contact CSV files, map the columns as follows:

**Your CSV Column** → **Mailchimp Field** → **Merge Tag**

- `Email Address` → `Email Address` → `*|EMAIL|*`

- `First Name` → `First Name` → `*|FNAME|*`

- `Last Name` → `Last Name` → `*|LNAME|*`

- `Company Name` → `Company` → `*|COMPANY|*` ✅

- `Industry` → `Industry` → `*|INDUSTRY|*` ✅

- `Phone Number` → `Phone Number` → `*|PHONE|*`

- `Job Title` → `Job Title` → `*|MMMERGE8|*`


---


## Alternative: Use Standard Fields Only


If you prefer not to create custom fields, here are the templates modified to use only standard Mailchimp merge tags:


### **Standard Merge Tags Available:**

- `*|FNAME|*` - First name

- `*|LNAME|*` - Last name  

- `*|EMAIL|*` - Email address

- `*|PHONE|*` - Phone number

- `*|ADDRESS|*` - Mailing address

- `*|UNSUB|*` - Unsubscribe link

- `*|UPDATE_PROFILE|*` - Update preferences link



### **Simplified Template Approach:**

Instead of: `"Hello *|FNAME|*, I noticed *|COMPANY|* is a growing organization in the *|INDUSTRY|* sector..."`

Use: `"Hello *|FNAME|*, I hope this message finds you well. I'm reaching out because your organization caught my attention..."`

---


## Import File Header Mapping


When importing your CSV files, make sure to map your columns correctly:


### **CSV Column** → **Mailchimp Field**

- `Email Address` → `Email Address` (required)

- `First Name` → `First Name` 

- `Last Name` → `Last Name`

- `Company Name` → `COMPANY` (custom field)

- `Industry` → `INDUSTRY` (custom field)

- `Priority Level` → `PRIORITY` (custom field)


---


## Testing Your Setup



### Before Launching:

1. **Create a test contact** with sample company and industry data

2. **Send a test email** to yourself using one of the templates

3. **Verify merge tags populate correctly**:

   - `*|FNAME|*` shows your first name
   - `*|COMPANY|*` shows the company name
   - `*|INDUSTRY|*` shows the industry

4. **Check mobile display** and **link functionality**



### Test Email Example:

```
Subject: Test - IT Security Assessment for *|COMPANY|*
Preview: Quick test of merge tags for *|FNAME|*
```

---


## Backup Plan: Manual Personalization


If you encounter issues with custom fields, you can:


1. **Create separate templates** for each industry (healthcare, manufacturing, etc.)

2. **Create separate campaigns** for each company tier

3. **Use conditional merge tags** to show different content based on fields

4. **Manually customize** high-priority emails for Tier 1 prospects


---


## Next Steps



1. ✅ **Create custom fields** in your Mailchimp audience

2. ✅ **Import your contact files** with proper field mapping

3. ✅ **Upload email templates** to Mailchimp

4. ✅ **Send test emails** to verify merge tags work

5. ✅ **Launch your campaign** with confidence!


---


## Need Help?


If you run into issues:

- **Mailchimp Support:** Available in your account dashboard

- **Template Issues:** Check that merge tags match your custom field names exactly

- **Import Problems:** Verify CSV headers match Mailchimp field names


Your templates are ready to go once these custom fields are set up! 🚀