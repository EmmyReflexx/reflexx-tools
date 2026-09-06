import Link from "next/link";
import { HiArrowLeft, HiScale, HiShieldExclamation, HiOutlineDocumentText } from "react-icons/hi";

export default function TermsOfServicePage() {
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
          <HiScale className="w-4 h-4 text-neon" />
          <span>Reflexx Tools Legal</span>
        </div>
        <h1 className="font-lexend-eb text-3xl sm:text-5xl text-brand-dark tracking-tight">
          Terms of Service
        </h1>
        <p className="text-xs sm:text-sm text-brand-muted font-lexend-r">
          <strong>Last Updated:</strong> September 2, 2026
        </p>
      </div>

      {/* Intro Box */}
      <div className="p-4 sm:p-6 rounded-2xl border-2 border-brand-border bg-white shadow-xs space-y-2">
        <div className="flex items-center gap-2 text-brand-dark font-lexend-b text-sm sm:text-base">
          <HiShieldExclamation className="w-5 h-5 shrink-0" />
          <span>Universal Terms Agreement</span>
        </div>
        <p className="text-xs sm:text-sm text-brand-muted leading-relaxed">
          Welcome to <strong>Reflexx Tools</strong> (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;). These Terms of Service govern your access to and use of all utilities, web applications, software, and digital solutions provided under the Reflexx Tools ecosystem. By accessing or using any of our Tools, you agree to be bound by these terms.
        </p>
      </div>

      {/* Terms Content Sections */}
      <div className="space-y-8 text-xs sm:text-sm leading-relaxed text-zinc-700">
        
        {/* Section 1 */}
        <section className="space-y-3">
          <strong className="block text-sm sm:text-base font-lexend-b text-brand-dark">
            1. Acceptance of Terms
          </strong>
          <p>
            By accessing any product or tool within Reflexx Tools, you confirm that you are at least the age of majority in your jurisdiction or have parental/guardian consent to use the platform. If you do not agree to these Terms, you must immediately discontinue using our platform and utilities.
          </p>
        </section>

        <hr className="border-brand-border" />

        {/* Section 2 */}
        <section className="space-y-3">
          <strong className="block text-sm sm:text-base font-lexend-b text-brand-dark">
            2. Permitted Use & Responsible Conduct
          </strong>
          <p>
            Reflexx Tools provides online utilities for individual, lawful usage. You agree to use our platform responsibly and refrain from the following prohibited activities:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong className="font-lexend-b text-brand-dark">Illegal Activities:</strong> Using any Reflexx tool to process, download, convert, or distribute material that violates localized copyright laws, privacy laws, or intellectual property rights.
            </li>
            <li>
              <strong className="font-lexend-b text-brand-dark">Automated Abuse:</strong> Launching automated bots, scrapers, spider networks, or brute-force scripts against our APIs or tools without explicit permission.
            </li>
            <li>
              <strong className="font-lexend-b text-brand-dark">Platform Disruption:</strong> Attempting to bypass security controls, rate limits, server architecture, or introducing malicious code into our systems.
            </li>
          </ul>
        </section>

        <hr className="border-brand-border" />

        {/* Section 3 */}
        <section className="space-y-3">
          <strong className="block text-sm sm:text-base font-lexend-b text-brand-dark">
            3. Intellectual Property Rights & Fair Use
          </strong>
          <p>
            All branding, design work, source code, logos, and features across the Reflexx Tools platform are owned by or licensed to us. 
          </p>
          <p>
            Users maintain full responsibility for any files, text, media, or data submitted through our tools. Reflexx Tools does not claim ownership over user-submitted content processed through our utilities. It remains the sole duty of the user to ensure they hold proper permissions or authorization to process third-party media or data.
          </p>
        </section>

        <hr className="border-brand-border" />

        {/* Section 4 */}
        <section className="space-y-3">
          <strong className="block text-sm sm:text-base font-lexend-b text-brand-dark">
            4. Service Availability & Modifications
          </strong>
          <p>
            Reflexx Tools strives to keep its utilities online and performant, but we do not guarantee uninterrupted access. We reserve the right to:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Modify, update, or discontinue features or tools at any time without prior notice.</li>
            <li>Enforce usage rate limits, cloud bandwidth throttles, or IP blocks to protect system stability.</li>
            <li>Perform scheduled maintenance or temporary emergency outages as operational requirements arise.</li>
          </ul>
        </section>

        <hr className="border-brand-border" />

        {/* Section 5 */}
        <section className="space-y-3">
          <strong className="block text-sm sm:text-base font-lexend-b text-brand-dark">
            5. Disclaimer of Warranties
          </strong>
          <p>
            All Reflexx Tools services are provided on an <strong>&quot;AS IS&quot;</strong> and <strong>&quot;AS AVAILABLE&quot;</strong> basis without warranties of any kind, either express or implied. We do not warrant that output data, conversions, extractions, or downloadable media generated by our tools will be completely error-free, uninterrupted, or fully accurate.
          </p>
        </section>

        <hr className="border-brand-border" />

        {/* Section 6 */}
        <section className="space-y-3">
          <strong className="block text-sm sm:text-base font-lexend-b text-brand-dark">
            6. Limitation of Liability
          </strong>
          <p>
            To the maximum extent permitted by applicable law, Reflexx Tools and its developers, affiliates, or operational partners shall not be held liable for any direct, indirect, incidental, or consequential damages resulting from your use or inability to use our platform or tools.
          </p>
        </section>

        <hr className="border-brand-border" />

        {/* Section 7 */}
        <section className="space-y-3">
          <strong className="block text-sm sm:text-base font-lexend-b text-brand-dark">
            7. Amendments to Terms
          </strong>
          <p>
            We reserve the right to update these Terms of Service periodically across all Reflexx Tools applications. Continued use of our tools after changes are posted constitutes acceptance of the modified terms.
          </p>
        </section>

        <hr className="border-brand-border" />

        {/* Section 8 / Contact */}
        <section className="p-6 rounded-2xl bg-zinc-50 border-2 border-brand-border space-y-2">
          <strong className="block text-sm sm:text-base font-lexend-b text-brand-dark flex items-center gap-2">
            <HiOutlineDocumentText className="w-5 h-5" />
            <span>8. Legal Inquiries</span>
          </strong>
          <p className="text-zinc-600">
            For questions, legal notices, or feedback regarding these Terms of Service across any Reflexx project, please reach out to:
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