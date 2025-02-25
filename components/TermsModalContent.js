"use client";

export default function TermsModalContent() {
  return (
    <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-4 sm:p-8">
      <h1 className="text-2xl sm:text-4xl font-bold mb-4 text-center lilita-one-regular">
        Terms of Service
      </h1>

      <section className="mb-4">
        <h2 className="text-xl sm:text-2xl font-semibold mb-2 lilita-one-regular">
          Acceptance of Terms
        </h2>
        <p className="text-base sm:text-lg text-gray-700">
          By using DessertAI, you agree to these Terms of Service. If you do not agree to these terms, please do not use our services.
        </p>
      </section>

      <section className="mb-4">
        <h2 className="text-xl sm:text-2xl font-semibold mb-2 lilita-one-regular">
          User Responsibilities
        </h2>
        <p className="text-base sm:text-lg text-gray-700">
          You are responsible for your account, including maintaining the confidentiality of your login credentials. You agree to use our services only for lawful purposes and to respect the rights of others.
        </p>
      </section>

      <section className="mb-4">
        <h2 className="text-xl sm:text-2xl font-semibold mb-2 lilita-one-regular">
          Intellectual Property
        </h2>
        <p className="text-base sm:text-lg text-gray-700">
          All content on DessertAI, including text, images, and logos, is the property of DessertAI or its licensors. You may not reproduce or distribute this content without our written consent.
        </p>
      </section>

      <section className="mb-4">
        <h2 className="text-xl sm:text-2xl font-semibold mb-2 lilita-one-regular">
          Disclaimer of Warranties
        </h2>
        <p className="text-base sm:text-lg text-gray-700">
          Our services are provided "as is" without any warranties, express or implied. We do not guarantee that our services will be uninterrupted, error-free, or secure.
        </p>
      </section>

      <section className="mb-4">
        <h2 className="text-xl sm:text-2xl font-semibold mb-2 lilita-one-regular">
          Limitation of Liability
        </h2>
        <p className="text-base sm:text-lg text-gray-700">
          DessertAI shall not be liable for any indirect, incidental, or consequential damages arising from your use of our services.
        </p>
      </section>

      <section className="mb-4">
        <h2 className="text-xl sm:text-2xl font-semibold mb-2 lilita-one-regular">
          Modifications
        </h2>
        <p className="text-base sm:text-lg text-gray-700">
          We reserve the right to modify these Terms of Service at any time. Updates will be posted on this page, and your continued use of our services signifies your acceptance of any changes.
        </p>
      </section>

      <section className="mb-4">
        <h2 className="text-xl sm:text-2xl font-semibold mb-2 lilita-one-regular">
          Governing Law
        </h2>
        <p className="text-base sm:text-lg text-gray-700">
          These terms are governed by the laws of the jurisdiction in which DessertAI operates, without regard to its conflict of law principles.
        </p>
      </section>

      <section className="mb-4">
        <h2 className="text-xl sm:text-2xl font-semibold mb-2 lilita-one-regular">
          Termination
        </h2>
        <p className="text-base sm:text-lg text-gray-700">
          We reserve the right to suspend or terminate your access to our services at any time, with or without notice, for any reason.
        </p>
      </section>

      <section className="mb-4">
        <h2 className="text-xl sm:text-2xl font-semibold mb-2 lilita-one-regular">
          Contact Information
        </h2>
        <p className="text-base sm:text-lg text-gray-700">
          If you have any questions about these Terms of Service, please contact us at{" "}
          <a href="mailto:support@dessertai.com" className="text-blue-500 hover:underline">
            support@dessertai.com
          </a>.
        </p>
      </section>

      <p className="text-xs sm:text-sm text-gray-500 mt-4 text-center">
        Last updated: January 1, 2025
      </p>
    </div>
  );
}
