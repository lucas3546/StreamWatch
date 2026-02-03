import { contactEmail, legalServiceName } from "./config";

export const privacyPolicyMarkdown = `# Privacy Policy

**Last updated: 24/1/2026**

This Privacy Policy explains how **${legalServiceName}** (“Service”, “we”, “us”, “our”) collects, uses, and protects your information when you use our website and services.

By using the Service, you agree to the collection and use of information in accordance with this Privacy Policy.

---

## 1. Eligibility

The Service is intended **only for users who are 18 years of age or older**.

We do not knowingly collect personal data from minors. If we become aware that a minor has used the Service, we may delete the associated data and terminate the account.

---

## 2. Information We Collect

We collect only the information necessary to operate and secure the Service.

### 2.1 Account Information

When you create an account, we may collect:
- A username or identifier
- Authentication-related data required to operate the Service

Passwords are never stored in plain text.

---

### 2.2 Authentication Data

- We use **JSON Web Tokens (JWT)** for authentication
- **Refresh tokens are stored in cookies**
- Access tokens are not stored in cookies

Cookies are used **only for authentication purposes**.

---

### 2.3 IP Addresses

We store users’ IP addresses for:
- Security purposes
- Abuse prevention
- Moderation and enforcement of our Terms
- Rate limiting

IP addresses are not used for advertising or tracking across websites.

---

### 2.4 User-Uploaded Content

If you upload media files:
- Files are stored temporarily using third-party cloud storage services (e.g. Cloudflare R2)
- Uploaded files are **automatically deleted after 24 hours**
- We do not retain uploaded media beyond this period unless legally required

Users are solely responsible for the content they upload.

---

### 2.5 Reports and Moderation

If you submit a report (e.g. abuse or violations):
- We may store report-related data
- This data is used only for moderation and enforcement purposes

---

## 3. How We Use Your Information

We use collected information to:
- Operate and maintain the Service
- Authenticate users and manage sessions
- Prevent abuse, fraud, and unauthorized access
- Moderate content and enforce our Terms
- Improve stability and performance

We do **not** sell or rent your personal data.

---

## 4. Cookies

We use cookies strictly for:
- Storing refresh tokens
- Maintaining authenticated sessions

We do **not** use cookies for:
- Advertising
- Behavioral tracking
- Cross-site profiling

You may disable cookies in your browser, but doing so may prevent the Service from functioning properly.

---

## 5. Third-Party Services

The Service may interact with third-party platforms, including:
- Media providers (e.g. YouTube)
- Cloud storage providers (e.g. Cloudflare R2)

We do not control and are not responsible for the privacy practices of third-party services. Their use is governed by their respective privacy policies.

---

## 6. Data Retention

We retain personal data only for as long as necessary to:
- Provide the Service
- Fulfill legal or security obligations

Temporary media uploads are deleted automatically after 24 hours.

---

## 7. Data Security

We take reasonable technical and organizational measures to protect your data, including:
- Secure authentication mechanisms
- Limited data collection
- Restricted access to sensitive information

However, no system is 100% secure, and we cannot guarantee absolute security.

---

## 8. User Rights

Depending on applicable laws, you may have the right to:
- Request access to your personal data
- Request correction or deletion of your data
- Request restriction of processing

Requests may be subject to verification and legal limitations.

---

## 9. Changes to This Privacy Policy

We may update this Privacy Policy from time to time.  
Continued use of the Service after changes constitutes acceptance of the updated policy.

---

## 10. Contact

If you have questions or requests regarding this Privacy Policy, contact us at:

**Email:** [[${contactEmail}](mailto:${contactEmail})]`;
