import FooterLink from "./FooterLink";
import { FaFacebook, FaInstagram, FaTiktok, FaXTwitter } from "react-icons/fa6";
import { HiOutlineMail } from "react-icons/hi";

// Footer navigation structure for easy expansion
const FOOTER_SECTIONS = [
  {
    title: "Tools",
    links: [
      { name: "Social Media Downloader", href: "/social-media-downloader" },
      { name: "Qr & Barcode Reader & Generator", href: "/qr-and-barcode-tool" },
      { name: "Password Generator", href: "/password-generator" },
      { name: "More...", href: "/" },
      // Add more tools here
    ],
  },
  {
    title: "Support & Contact",
    links: [
      { name: "Contact Us", href: "mailto:reflexxtools@example.com" },
      { name: "Privacy Policy", href: "/legal/privacypolicy" },
      { name: "Terms of Service", href: "/legal/termsofservice" },
    ],
  },
];

const SOCIAL_LINKS = [
  { name: "Facebook", href: "https://facebook.com", icon: FaFacebook },
  { name: "Instagram", href: "https://instagram.com", icon: FaInstagram },
  { name: "TikTok", href: "https://tiktok.com", icon: FaTiktok },
  { name: "X", href: "https://x.com", icon: FaXTwitter },
];

export default function Footer() {
  return (
    <footer className="w-full bg-neon border-t-2 border-brand-border mt-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

          {/* Brand & Email Contact Column */}
          <div className="space-y-4 md:col-span-2">
            <h3 className="font-lexend-eb text-lg sm:text-xl text-brand-dark">
              Reflexx Tools
            </h3>
            <p className="font-lexend-r text-xs sm:text-sm text-brand-dark/80 max-w-sm">
              Free web utility tools for social media, barcode generation, and quick data generation.
            </p>
            <div className="pt-2">
              <a
                href="mailto:support@example.com"
                className="inline-flex items-center gap-2 font-lexend-b text-xs sm:text-sm text-brand-dark hover:underline transition-all"
              >
                <HiOutlineMail className="w-4 h-4 text-brand-dark" />
                <span>support@reflexxtools.com</span>
              </a>
            </div>
          </div>

          {/* Dynamic Sections (Tools, Support, etc.) */}
          {FOOTER_SECTIONS.map((section) => (
            <div key={section.title} className="space-y-3">
              <h4 className="font-lexend-b text-xs uppercase tracking-wider text-brand-dark/70">
                {section.title}
              </h4>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.name}>
                    {/* Use the client component wrapper here */}
                    <FooterLink href={link.href} name={link.name} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar: Social Icons & Copyright */}
        <div className="mt-8 pt-6 border-t border-brand-dark/20 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-lexend-r text-xs text-brand-dark/80 text-center sm:text-left">
            © {new Date().getFullYear()} Reflexx Tools. All rights reserved.
          </p>

          {/* <div className="flex items-center gap-4">
            {SOCIAL_LINKS.map((social) => (
              <a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noreferrer"
                aria-label={social.name}
                className="text-brand-dark hover:opacity-75 transition-opacity"
              >
                <social.icon className="w-4 h-4 sm:w-5 sm:h-5" />
              </a>
            ))}
          </div> */}
        </div>
      </div>
    </footer>
  );
}