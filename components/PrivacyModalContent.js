// components/PrivacyModalContent.js
"use client";

export default function PrivacyModalContent() {
  return (
    <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-4 sm:p-8">
      <h1 className="text-2xl sm:text-4xl font-bold mb-4 text-center lilita-one-regular">
        Privacy Policy
      </h1>

      <section className="mb-4">
        <h2 className="text-xl sm:text-2xl font-semibold mb-2 lilita-one-regular">
          Introduction
        </h2>
        <p className="text-base sm:text-lg text-gray-700">
          At DessertAI, protecting your privacy is our priority. This Privacy Policy explains how we collect, use, and safeguard your information when you use our website and services.
        </p>
      </section>

      <section className="mb-4">
        <h2 className="text-xl sm:text-2xl font-semibold mb-2 lilita-one-regular">
          Information We Collect
        </h2>
        <p className="text-base sm:text-lg text-gray-700 mb-2">
          We collect personal information that you voluntarily provide when registering, placing orders, or communicating with us. This may include your name, email address, and other contact details.
        </p>
        <p className="text-base sm:text-lg text-gray-700">
          Additionally, we use cookies and tracking technologies to gather data on how you interact with our site, such as your IP address, browser type, and browsing habits.
        </p>
      </section>

      <section className="mb-4">
        <h2 className="text-xl sm:text-2xl font-semibold mb-2 lilita-one-regular">
          How We Use Your Information
        </h2>
        <ul className="list-disc ml-4 sm:ml-6 text-base sm:text-lg text-gray-700">
          <li>To process and fulfill your orders</li>
          <li>To personalize your experience on our site</li>
          <li>To communicate updates, promotions, and support information</li>
          <li>To improve our services and website functionality</li>
        </ul>
      </section>

      <section className="mb-4">
        <h2 className="text-xl sm:text-2xl font-semibold mb-2 lilita-one-regular">
          Sharing and Disclosure
        </h2>
        <p className="text-base sm:text-lg text-gray-700">
          We do not sell or rent your personal information. We may share your data with trusted third-party service providers who help us operate our business, under strict confidentiality agreements.
        </p>
      </section>

      <section className="mb-4">
        <h2 className="text-xl sm:text-2xl font-semibold mb-2 lilita-one-regular">
          Cookies and Tracking Technologies
        </h2>
        <p className="text-base sm:text-lg text-gray-700">
          We use cookies and similar technologies to enhance your user experience, analyze site traffic, and personalize content. You may disable cookies in your browser, but this may affect site functionality.
        </p>
      </section>

      <section className="mb-4">
        <h2 className="text-xl sm:text-2xl font-semibold mb-2 lilita-one-regular">
          Data Security
        </h2>
        <p className="text-base sm:text-lg text-gray-700">
          We implement industry-standard security measures to protect your information from unauthorized access and disclosure. Although no system is 100% secure, we strive to protect your data.
        </p>
      </section>

      <section className="mb-4">
        <h2 className="text-xl sm:text-2xl font-semibold mb-2 lilita-one-regular">
          Your Rights
        </h2>
        <p className="text-base sm:text-lg text-gray-700">
          You have the right to access, update, or delete your personal information. If you have questions or wish to exercise these rights, please contact us at{" "}
          <a
            href="mailto:privacy@dessertai.com"
            className="text-blue-500 hover:underline"
          >
            privacy@dessertai.com
          </a>.
        </p>
      </section>

      <section className="mb-4">
        <h2 className="text-xl sm:text-2xl font-semibold mb-2 lilita-one-regular">
          Changes to This Policy
        </h2>
        <p className="text-base sm:text-lg text-gray-700">
          We may update this Privacy Policy from time to time. Changes will be posted on this page along with an updated effective date.
        </p>
      </section>

      <section className="mb-4">
        <h2 className="text-xl sm:text-2xl font-semibold mb-2 lilita-one-regular">
          Contact Information
        </h2>
        <p className="text-base sm:text-lg text-gray-700">
          If you have any questions about this Privacy Policy, please contact us at{" "}
          <a
            href="mailto:privacy@dessertai.com"
            className="text-blue-500 hover:underline"
          >
            privacy@dessertai.com
          </a>.
        </p>
      </section>

      <p className="text-xs sm:text-sm text-gray-500 mt-4 text-center">
        Last updated: January 1, 2025
      </p>
    </div>
  );
}
