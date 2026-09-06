import Link from "next/link";
import { HiArrowLeft, HiShieldCheck, HiLockClosed, HiOutlineDocumentText } from "react-icons/hi";

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8 font-lexend-r text-brand-dark">
      {/* Top Navigation / Back Link */}
      <div>
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-lexend-b text-brand-muted hover:text-brand-dark transition-colors"
        >
          <HiArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>
      </div>

      {/* Header Section */}
      <div className="space-y-3 border-b border-brand-border pb-6 sm:pb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 border border-brand-border text-xs font-lexend-b text-brand-muted">
          <HiShieldCheck className="w-4 h-4 text-neon" />
          <span>Reflexx Tools Legal</span>
        </div>
        <h1 className="font-lexend-eb text-3xl sm:text-5xl text-brand-dark tracking-tight">
          Privacy Policy
        </h1>
        <p className="text-xs sm:text-sm text-brand-muted font-lexend-r">
          <strong>Last Updated:</strong> September 2, 2026
        </p>
      </div>

      {/* Intro Box */}
      <div className="p-4 sm:p-6 rounded-2xl border-2 border-brand-border bg-white shadow-xs space-y-2">
        <div className="flex items-center gap-2 text-brand-dark font-lexend-b text-sm sm:text-base">
          <HiLockClosed className="w-5 h-5 shrink-0" />
          <span>Universal Privacy Commitment</span>
        </div>
        <p className="text-xs sm:text-sm text-brand-muted leading-relaxed">
          Welcome to <strong>Reflexx Tools</strong> (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;). We respect your privacy and are committed to protecting the personal information you share with us. This Privacy Policy applies universally to all applications, web utilities, software, and online services (collectively, the &quot;Services&quot; or &quot;Tools&quot;) provided under the Reflexx Tools platform.
        </p>
      </div>

      {/* Policy Content Sections */}
      <div className="space-y-8 text-xs sm:text-sm leading-relaxed text-zinc-700">
        
        {/* Section 1 */}
        <section className="space-y-3">
          <strong className="block text-sm sm:text-base font-lexend-b text-brand-dark">
            1. Information We Collect
          </strong>
          <p>
            Depending on which Reflexx Tool you interact with, we may collect different categories of information:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong className="font-lexend-b text-brand-dark">Information You Provide Directly:</strong> We may collect account data (such as your name, email address, or user credentials) if a tool requires authentication, as well as input data, links, media, or files uploaded to process your requests.
            </li>
            <li>
              <strong className="font-lexend-b text-brand-dark">Automatically Collected Data:</strong> We may collect device-level technical information, including your IP address, browser type, operating system, network identifiers, error logs, and basic usage diagnostics to keep our services online and performing optimally.
            </li>
            <li>
              <strong className="font-lexend-b text-brand-dark">Cookies and Local Storage:</strong> We may use essential cookies, local web storage, session storage, and lightweight analytics to process authentication, maintain user state, remember preferences, and ensure essential platform security.
            </li>
          </ul>
        </section>

        <hr className="border-brand-border" />

        {/* Section 2 */}
        <section className="space-y-3">
          <strong className="block text-sm sm:text-base font-lexend-b text-brand-dark">
            2. How We Use Your Information
          </strong>
          <p>We may process your data for the following essential business purposes:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong className="font-lexend-b text-brand-dark">Service Delivery & Authentication:</strong> We may use your information to authenticate your session, parse inputs, generate output files, execute API requests, and deliver requested media or data conversions.
            </li>
            <li>
              <strong className="font-lexend-b text-brand-dark">System Optimization:</strong> We may use performance metrics to monitor platform health, fix crashes, enhance performance speeds, and upgrade feature capabilities across our suite of tools.
            </li>
            <li>
              <strong className="font-lexend-b text-brand-dark">Security & Protection:</strong> We may process network log data to prevent automated abuse, spam, unauthorized scraping, rate-limit violations, and malicious exploits.
            </li>
          </ul>
        </section>

        <hr className="border-brand-border" />

        {/* Section 3 */}
        <section className="space-y-3">
          <strong className="block text-sm sm:text-base font-lexend-b text-brand-dark">
            3. Data Retention and Lifecycle
          </strong>
          <p>
            We adhere to strict data minimization principles across all our applications:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong className="font-lexend-b text-brand-dark">Transient Data:</strong> Content, URLs, and media files processed through web conversion or extraction utilities are stored temporarily in volatile memory or short-lived server caches only for the duration needed to complete your operation.
            </li>
            <li>
              <strong className="font-lexend-b text-brand-dark">Persistent Data:</strong> Account credentials, session tokens, or direct user configurations remain saved securely until an account is closed or a deletion request is completed.
            </li>
          </ul>
        </section>

        <hr className="border-brand-border" />

        {/* Section 4 */}
        <section className="space-y-3">
          <strong className="block text-sm sm:text-base font-lexend-b text-brand-dark">
            4. Third-Party Services and Integrations
          </strong>
          <p>
            Our tools frequently integrate with or interface with third-party web platforms, cloud networks, and social media infrastructure:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              We do <strong>not</strong> sell, rent, or monetize your personal information to third parties or advertising brokers.
            </li>
            <li>
              We may share necessary request metrics with infrastructure providers (e.g., hosting servers, authentication providers, content delivery networks) purely to maintain operational uptime and user verification.
            </li>
            <li>
              Reflexx Tools is not responsible for the independent privacy policies or data collection mechanisms of third-party platforms accessed via links or external APIs.
            </li>
          </ul>
        </section>

        <hr className="border-brand-border" />

        {/* Section 5 */}
        <section className="space-y-3">
          <strong className="block text-sm sm:text-base font-lexend-b text-brand-dark">
            5. Security & International Compliance
          </strong>
          <p>
            We implement administrative, technical, and physical safeguards designed to protect personal information against unauthorized access, destruction, loss, alteration, or misuse. Although no digital system guarantees absolute protection, we continually review and modernize our security protocols across all Reflexx platforms.
          </p>
        </section>

        <hr className="border-brand-border" />

        {/* Section 6 */}
        <section className="space-y-3">
          <strong className="block text-sm sm:text-base font-lexend-b text-brand-dark">
            6. Your Privacy Rights & Choice
          </strong>
          <p>
            Depending on your jurisdiction, you may hold rights regarding your personal data, including the right to request access to, correction of, or deletion of stored account records. You may also disable cookies or local storage through your personal browser settings, though doing so may affect authentication and utility functionality.
          </p>
        </section>

        <hr className="border-brand-border" />

        {/* Section 7 */}
        <section className="space-y-3">
          <strong className="block text-sm sm:text-base font-lexend-b text-brand-dark">
            7. Updates to This Privacy Policy
          </strong>
          <p>
            We reserve the right to revise or modify this policy at any time to reflect software updates, legal requirements, or operational changes across Reflexx Tools. Updated versions will be published directly on this page with a revised &quot;Last Updated&quot; date.
          </p>
        </section>

        <hr className="border-brand-border" />

        {/* Section 8 / Contact */}
        <section className="p-6 rounded-2xl bg-zinc-50 border-2 border-brand-border space-y-2">
          <strong className="block text-sm sm:text-base font-lexend-b text-brand-dark flex items-center gap-2">
            <HiOutlineDocumentText className="w-5 h-5" />
            <span>8. Contact Us</span>
          </strong>
          <p className="text-zinc-600">
            If you have questions, feedback, or privacy inquiries regarding any project within the Reflexx Tools ecosystem, please contact our administrative team at:
          </p>
          <a
            href="mailto:support@reflexxtools.com"
            className="inline-block font-lexend-b text-brand-dark hover:underline pt-1"
          >
            support@reflexxtools.com
          </a>
        </section>

      </div>
    </div>
  );
}