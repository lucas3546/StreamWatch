import { contactEmail, lastUpdatedTerms, legalServiceName } from "./config";


export const termsMarkdown = `**Last updated: ${lastUpdatedTerms}**

Welcome to **${legalServiceName}** (“Service”, “we”, “us”, “our”).
By accessing or using our website and services, you agree to be bound by these Terms and Conditions (“Terms”). If you do not agree, you must not use the Service.

---

### 1. Eligibility

The Service is intended **exclusively for users who are 18 years of age or older**.

By using the Service, you represent and warrant that:

* You are at least 18 years old
* You have the legal capacity to enter into these Terms

We do not knowingly allow minors to use the Service. Accounts found to belong to minors may be suspended or terminated.

---

### 2. Description of the Service

${legalServiceName} is a free online platform that allows users to create virtual rooms and synchronize media playback with other users in real time.

The Service supports:

* Synchronization of third-party media (e.g. YouTube videos) by sharing playback state and timestamps
* Temporary user-uploaded media files for synchronized viewing

We do **not** operate as a media streaming or hosting platform in the traditional sense.

---

### 3. User-Uploaded Content

Users may upload media files to the Service subject to the following conditions:

* Uploaded files are stored temporarily using third-party cloud storage services (e.g. Cloudflare R2)
* Uploaded media is **automatically deleted after 24 hours**
* Users are solely responsible for the content they upload

You represent and warrant that:

* You own the rights to the uploaded content, or
* You have the necessary permissions or licenses to upload and share it

We reserve the right to remove any content at our discretion.

---

### 4. Third-Party Content (YouTube and Others)

When using third-party content (such as YouTube):

* The Service only synchronizes playback state (e.g. timestamps)
* Media content is delivered directly from the third-party provider
* We do not store, modify, or redistribute third-party content

All third-party content remains subject to the terms and policies of the respective providers.

---

### 5. Accounts and Authentication

Some features require an account.

* Authentication is handled using **JSON Web Tokens (JWT)**
* **Cookies are used exclusively to store refresh tokens**
* Access tokens are not stored in cookies

You are responsible for safeguarding your credentials and all activity under your account.

---

### 6. Cookies

We use cookies strictly for:

* Authentication purposes
* Session continuity via refresh tokens

We do **not** use cookies for:

* Advertising
* Cross-site tracking
* Behavioral profiling

Disabling cookies may prevent proper operation of the Service.

---

### 7. IP Address Logging

We store users’ IP addresses for legitimate purposes, including:

* Security
* Abuse prevention
* Moderation and enforcement of Terms
* Rate limiting

IP addresses are not sold or shared with third parties, except when legally required.

---

### 8. Reporting and Moderation

The Service includes a reporting system that allows users to report:

* Illegal content
* Abuse or harassment
* Violations of these Terms

We may investigate reports and take actions including:

* Content removal
* Room suspension
* Account suspension or termination

Moderation decisions are made at our discretion.

---

### 9. Acceptable Use

You agree not to:

* Use the Service for illegal purposes
* Upload or share content you do not have rights to
* Harass, abuse, or threaten other users
* Attempt to bypass security mechanisms
* Interfere with the operation of the Service

Violation of these rules may result in immediate termination.

---

### 10. Service Availability

The Service is provided **free of charge**, on an **“as is”** and **“as available”** basis.

We do not guarantee:

* Continuous availability
* Error-free operation
* Data retention beyond stated limits

We may modify or discontinue the Service at any time.

---

### 11. Disclaimer of Warranties

To the maximum extent permitted by law, we disclaim all warranties, express or implied, including:

* Merchantability
* Fitness for a particular purpose
* Non-infringement

---

### 12. Limitation of Liability

To the maximum extent permitted by law, ${legalServiceName} shall not be liable for:

* User-generated content
* Loss of data or access
* Third-party services or media
* Indirect or consequential damages

Use of the Service is at your own risk.

---

### 13. Termination

We reserve the right to suspend or terminate access to the Service at any time, with or without notice, for violations of these Terms or for security or operational reasons.

---

### 14. Governing Law

These Terms shall be governed by and construed in accordance with the laws of **the applicable jurisdiction**, to be determined based on the Service’s operational location, without regard to conflict of law principles.

---

### 15. Changes to the Terms

We may update these Terms from time to time. Continued use of the Service after changes constitutes acceptance of the updated Terms.

---

### 16. Contact

For questions or reports related to these Terms, contact:

**Email:** [[${contactEmail}](mailto:${contactEmail})]

`;
