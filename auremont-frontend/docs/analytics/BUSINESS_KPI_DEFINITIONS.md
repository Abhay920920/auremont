# RARE NUTS — Business KPI Definitions & Mathematical Formula Matrix

**Brand:** RARE NUTS  
**Domain:** https://rarenuts.in  
**Legal Entity:** RARE NUTS Private Limited  

---

## 📈 Canonical Business Metrics Formulas

| Business Metric | Mathematical Formula | Canonical Definition | Target Threshold |
| :--- | :--- | :--- | :--- |
| **Gross Revenue** | `SUM(Order.total)` | Total monetary value of all confirmed orders before discounts/refunds. | Dynamic |
| **Net Revenue** | `Gross Revenue - Discounts - Refunds` | Realized revenue after applying valid coupon discounts and refunds. | Dynamic |
| **Average Order Value (AOV)** | `Net Revenue / Total Orders` | Average monetary amount spent by a customer per completed transaction. | **≥ ₹1,450** |
| **Conversion Rate (CR)** | `(Purchases / Total Store Visitors) * 100` | Percentage of storefront visitors who complete a paid transaction. | **3.5% – 5.0%** |
| **Cart Abandonment Rate** | `((Cart Starts - Purchases) / Cart Starts) * 100` | Percentage of active cart sessions that leave without ordering. | **< 65%** |
| **Abandoned Cart Recovery Rate** | `(Recovered Orders / Total Abandoned Carts) * 100` | Percentage of abandoned carts recovered via 1-click email links. | **18% – 25%** |
| **Recovered Revenue** | `SUM(Recovered Order.total)` | Total monetary value generated from `?recover=` checkout orders. | **≥ ₹1,25,000 / mo** |
| **Repeat Purchase Rate (RPR)** | `(Repeat Customers / Total Unique Customers) * 100` | Percentage of customers who place more than 1 confirmed order within 90 days. | **≥ 32%** |
| **Customer Lifetime Value (LTV)**| `AOV * Purchase Frequency * Customer Lifespan` | Projected gross margin contribution over a customer's total relationship duration. | **≥ ₹8,500** |
