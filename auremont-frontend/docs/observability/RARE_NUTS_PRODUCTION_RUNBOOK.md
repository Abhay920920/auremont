# RARE NUTS — Production SRE Runbook

**Brand:** RARE NUTS  
**Official Domain:** https://rarenuts.in  

---

## 🛠️ Routine SRE Operational Maintenance Commands

### 1. Check Backend Operational Health
```bash
curl -X GET https://rarenuts.in/health
```
- **Expected Response**: HTTP 200 `{ "status": "ok", "uptime": 12345, "memory": { ... } }`

### 2. Verify Google Sitemap & Robots Directives
```bash
curl -I https://rarenuts.in/sitemap.xml
curl -I https://rarenuts.in/robots.txt
```
- **Expected Response**: HTTP 200 `content-type: application/xml` / `text/plain`

### 3. Outbox Event Queue Health Check
Query `outbox_events` table for stuck events:
```sql
SELECT status, count(*) FROM outbox_events GROUP BY status;
```
- **Action**: Alert if `status = 'failed'` count exceeds 10.
