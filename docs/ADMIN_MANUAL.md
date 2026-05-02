# SokoYetu — Admin Control Manual
**Version 1.0 | SokoYetu Ltd | Nairobi, Kenya**

---

## Table of Contents
1. [Accessing the Admin Panel](#1-accessing-the-admin-panel)
2. [Dashboard Overview](#2-dashboard-overview)
3. [User Management](#3-user-management)
4. [Vendor Management](#4-vendor-management)
5. [Product Moderation](#5-product-moderation)
6. [Order Management](#6-order-management)
7. [Fraud & Reports](#7-fraud--reports)
8. [Bulk Order Requests](#8-bulk-order-requests)
9. [Payouts & Finance](#9-payouts--finance)
10. [Platform Settings](#10-platform-settings)
11. [Admin Roles & Permissions](#11-admin-roles--permissions)
12. [Security Procedures](#12-security-procedures)

---

## 1. Accessing the Admin Panel

### URL
```
https://sokoyetu.co.ke/admin/dashboard
```

### Login
1. Go to `https://sokoyetu.co.ke/login`
2. Enter your **admin email** and **password**
3. You are automatically redirected to `/admin/dashboard` based on your `ADMIN` or `SUPER_ADMIN` role
4. Sessions expire after **30 days** of inactivity

> ⚠️ **Never share admin credentials.** Each admin must have their own unique account.
> If you suspect a compromise, go to **Settings → Security → Force Sign Out All Sessions** immediately.

---

## 2. Dashboard Overview

The admin dashboard (`/admin/dashboard`) shows a live summary of the platform:

| Metric | Description |
|---|---|
| **Total Users** | All registered accounts (buyers + vendors) |
| **Active Vendors** | Approved vendor shops currently live |
| **Pending Vendors** | Vendor applications awaiting review |
| **Total Products** | All approved, live product listings |
| **Pending Products** | Listings submitted but not yet moderated |
| **Today's Orders** | Orders placed since midnight EAT |
| **Today's Revenue** | Sum of paid orders today (KES) |
| **Total Revenue** | All-time gross platform revenue |
| **Open Fraud Reports** | Unresolved fraud/abuse submissions |
| **Pending Payouts** | Vendor withdrawals awaiting processing |

### Revenue Chart
The chart on the dashboard shows **daily revenue for the last 30 days**. Use the dropdown to switch between:
- Daily view
- Weekly view
- Monthly view

### Quick Actions
From the dashboard you can directly:
- ✅ Approve the most recent pending vendor
- 🔍 Jump to the product moderation queue
- 🚨 View open fraud reports
- 💸 Process pending payouts

---

## 3. User Management

**Path:** `/admin/users`

### Viewing Users
The user table shows: Name, Email, Phone, Role, Verified status, Registration date, Last login, and Account status (Active/Banned).

**Filters available:**
- Search by name, email, or phone
- Filter by Role (Buyer / Vendor / Admin)
- Filter by Status (Active / Banned)
- Date range filter

### Actions on a User

#### Verify Identity
1. Open the user's detail page by clicking their name
2. Under **KYC**, review uploaded ID document and KRA PIN
3. Click **Mark as ID Verified** or **Reject & Request Re-submission**
4. Verified users receive a ✅ badge on their profile

#### Ban a User
1. Click the **⋮ Actions** menu on the user row
2. Select **Suspend Account**
3. Enter the reason (shown to the user and stored for audit)
4. Click **Confirm Ban**
5. The user is immediately logged out of all sessions

#### Unban a User
1. Find the banned user (use Status → Banned filter)
2. Click **Lift Suspension**
3. Enter a note explaining why the ban was lifted
4. User can log in immediately

#### Promote to Admin
Only **SUPER_ADMIN** can do this:
1. Open the user's profile
2. Click **Change Role → Admin**
3. Confirm with your admin password

---

## 4. Vendor Management

**Path:** `/admin/vendors`

### Reviewing a Vendor Application
When a seller registers, they appear in the **Pending Vendors** tab. Each application includes:
- Business name and description
- KRA PIN certificate (uploaded document)
- National ID number and copy
- Business Registration certificate (optional)
- County and town of operation

**Review steps:**
1. Click **Review Application** on the vendor row
2. Verify the uploaded documents match the stated information
3. Check the KRA PIN against the [KRA iTax portal](https://itax.kra.go.ke) (optional)
4. Take one of these actions:

| Action | What happens |
|---|---|
| **Approve** | Shop goes live; vendor receives a notification and email |
| **Reject with Reason** | Application declined; vendor sees the reason and can reapply |
| **Request More Info** | Vendor is notified to upload missing documents |

### Managing Approved Vendors

**Feature a Vendor:**
Toggle **Featured** on the vendor's profile. Featured vendors appear at the top of search results and the homepage vendor carousel.

**Suspend a Vendor:**
1. Open the vendor page
2. Click **Suspend Shop**
3. All their products are automatically hidden from buyers
4. Existing orders remain active and must be fulfilled

**Adjust Commission Rate:**
Default commission is **5%** per sale. You can change this per vendor:
1. Open vendor profile → **Finance** tab
2. Enter a new commission rate (0–30%)
3. Save — applies to all future orders

---

## 5. Product Moderation

**Path:** `/admin/products`

Every product submitted by a vendor lands in the **Pending** queue before it goes live.

### Moderation Checklist
Before approving a product, verify:
- [ ] Product images are real (not watermarked stock photos)
- [ ] Price is realistic for the Kenyan market
- [ ] Description is accurate and not misleading
- [ ] Category is correct
- [ ] No prohibited items (weapons, counterfeit goods, adult content)

### Actions

| Action | Result |
|---|---|
| **Approve** | Product goes live immediately |
| **Reject** | Product hidden; vendor notified with reason |
| **Edit & Approve** | Admin can fix minor issues (typos, category) and approve |
| **Flag for Review** | Marks the product for second-level review by a senior admin |

### Bulk Moderation
Use the checkbox column to select multiple products and:
- Approve all selected
- Reject all selected (enter one shared reason)

### Flash Deal Management
To set a product as a Flash Deal:
1. Open the product
2. Toggle **Flash Deal**
3. Set **Discount %** (10–70%)
4. Set **End Date/Time**
5. Save

Flash deals appear in the homepage countdown section automatically.

---

## 6. Order Management

**Path:** `/admin/orders`

### Order Statuses

```
PENDING → CONFIRMED → PROCESSING → SHIPPED → OUT_FOR_DELIVERY → DELIVERED
                                                                ↓
                                                         CANCELLED / REFUNDED / DISPUTED
```

### Manually Updating an Order
Admins can override any order status:
1. Open the order
2. Click **Update Status**
3. Select the new status and add a note
4. The buyer and vendor both receive a notification

### Handling Disputes
When an order is marked **DISPUTED**:
1. The order appears in the **Disputes** tab
2. Review the buyer's complaint and vendor's response
3. Options:
   - **Rule in Buyer's Favour** → initiate refund
   - **Rule in Vendor's Favour** → close dispute, no refund
   - **Partial Refund** → enter the refund amount in KES

### Processing Refunds
1. Open the disputed/cancelled order
2. Click **Issue Refund**
3. Select refund method (M-Pesa back to buyer / Credit to wallet)
4. Enter the M-Pesa reference or confirm the credit
5. Save — buyer is notified automatically

---

## 7. Fraud & Reports

**Path:** `/admin/fraud`

### Report Categories

| Category | Description |
|---|---|
| COUNTERFEIT | Fake/replica goods |
| PAYMENT_SCAM | Advance-fee fraud, fake payment requests |
| MISLEADING_LISTING | Wrong description, photos don't match goods |
| NO_DELIVERY | Paid but item never arrived |
| HARASSMENT | Threatening messages from a vendor/buyer |
| OTHER | Anything else |

### Processing a Report
1. Open the report
2. Review the description and the referenced vendor/listing
3. Investigate: check order history, message logs, listing
4. Take action:

| Action | Effect |
|---|---|
| **Resolve** | Mark resolved; optionally add a note; reporter notified |
| **Dismiss** | Mark as unfounded; add reason; reporter notified |
| **Escalate** | Flag for SUPER_ADMIN review |
| **Ban Vendor** | Immediately suspend the reported vendor |
| **Remove Listing** | Take down the reported product |

### SLA
- All `OPEN` reports must be actioned within **24 hours**
- Reports involving payments/scams: within **2 hours**
- The dashboard shows a ⏱️ timer on overdue reports

---

## 8. Bulk Order Requests

**Path:** `/admin/bulk`

Institutions (schools, NGOs, churches) submit bulk order requests through the platform.

### Processing a Bulk Request
1. Open the request — it shows institution name, product needed, quantity tier, and discount
2. Contact the institution using the phone/email shown
3. Identify the relevant vendor(s) who can fulfil the order
4. Enter the quoted price and delivery timeline
5. Mark as **Quoted** — the institution receives an email with the quote
6. When they confirm, mark as **Processing**
7. When fulfilled, mark as **Completed**

### Discount Tiers (Reference)

| Qty | Discount |
|---|---|
| 10–49 | 0% (standard price) |
| 50–99 | 10% off |
| 100–499 | 20% off |
| 500+ | 30% off |

---

## 9. Payouts & Finance

**Path:** `/admin/payouts`

### How Vendor Earnings Work
1. Buyer pays for an order (M-Pesa/Card)
2. Full amount received by SokoYetu
3. Platform commission deducted (default 5%)
4. Net amount credited to vendor's balance
5. Vendor requests a withdrawal when their balance ≥ KES 500
6. Admin processes the payout via M-Pesa B2C

### Processing a Payout
1. Open the payout request
2. Verify the vendor's M-Pesa number matches their registered phone
3. Initiate the transfer (M-Pesa Daraja B2C or manual)
4. Enter the M-Pesa transaction code as the **Reference**
5. Mark as **PAID**
6. Vendor is notified automatically

### Financial Reports
Export a CSV of all transactions:
- Go to `/admin/reports`
- Select **Date Range**
- Select report type: Revenue / Payouts / Commission / Orders
- Click **Download CSV**

---

## 10. Platform Settings

**Path:** `/admin/settings`

| Setting | Description |
|---|---|
| `platform_commission` | Default commission % for all vendors (default: 5) |
| `min_payout_amount` | Minimum withdrawal amount in KES (default: 500) |
| `flash_deal_max_discount` | Maximum allowed flash deal discount % (default: 70) |
| `bulk_tier_1_qty` | Tier 1 minimum quantity (default: 50) |
| `bulk_tier_1_discount` | Tier 1 discount % (default: 10) |
| `maintenance_mode` | Set `true` to put the site in maintenance mode |
| `new_vendor_auto_approve` | Set `true` to skip manual vendor review (not recommended) |
| `sms_enabled` | Enable Africa's Talking SMS notifications |
| `email_enabled` | Enable email notifications |
| `language_sw_enabled` | Enable Swahili UI |

Changes take effect immediately. All setting changes are logged with the admin's name and timestamp.

---

## 11. Admin Roles & Permissions

| Permission | ADMIN | SUPER_ADMIN |
|---|---|---|
| View dashboard stats | ✅ | ✅ |
| Approve/reject vendors | ✅ | ✅ |
| Moderate products | ✅ | ✅ |
| Update order status | ✅ | ✅ |
| Process fraud reports | ✅ | ✅ |
| Process payouts | ✅ | ✅ |
| Ban/unban users | ✅ | ✅ |
| Change platform settings | ❌ | ✅ |
| Promote users to admin | ❌ | ✅ |
| View financial reports | ❌ | ✅ |
| Delete data permanently | ❌ | ✅ |

---

## 12. Security Procedures

### Daily Checks
- Review open fraud reports
- Check pending vendor applications (SLA: 48 hrs)
- Review flagged reviews

### Weekly Checks
- Export and archive the weekly revenue report
- Check for accounts with unusual activity (many orders from one IP)
- Review new admin activity logs

### If You Suspect a Breach
1. Immediately go to **Settings → Security → Revoke All Sessions**
2. Change your admin password
3. Check the audit log (`/admin/settings/audit`) for recent actions
4. Contact the Super Admin and Anthropic support if necessary

### Audit Log
Every admin action is logged with:
- Admin email
- Action taken
- Target (user ID / product ID / etc.)
- Timestamp
- IP address

The audit log is **read-only** and cannot be deleted by any admin, including Super Admin.

---

*For technical support: dev@sokoyetu.co.ke*
*For urgent issues: WhatsApp +254 700 000 000*
