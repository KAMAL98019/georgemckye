import InfoPage from "@/components/ui/InfoPage";
import { getSiteSettings } from "@/lib/settings";
import type { Metadata } from "next";

// Renders Footer (categories) at request time instead of freezing whatever
// state the DB was in during the build's static-generation step.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How George McKye collects, uses, and protects your information.",
};

export default async function PrivacyPage() {
  const settings = await getSiteSettings();

  return (
    <InfoPage
      title="Privacy Policy"
      intro="Your privacy matters to us. Here's how we handle your information."
    >
      <h2>Information We Collect</h2>
      <p>
        When you request a product on WhatsApp, place an order, or contact us, we collect the details you provide
        — such as your name, phone number, email address, and delivery address — solely to fulfil your request.
      </p>

      <h2>How We Use Your Information</h2>
      <p>
        We use your information to process orders, respond to enquiries, and improve our products and service. We
        do not sell your personal information to third parties.
      </p>

      <h2>WhatsApp Requests</h2>
      <p>
        When you use &quot;Request on WhatsApp&quot;, the message containing your details is only sent to us once
        you personally press Send inside WhatsApp. We do not automatically transmit your information anywhere.
      </p>

      <h2>Data Storage</h2>
      <p>
        Order and enquiry details you submit are stored securely in our database so our team can track and fulfil
        your request, and so you don&apos;t need to repeat information on future orders.
      </p>

      <h2>Contact Us</h2>
      <p>
        For any privacy-related questions, email us at{" "}
        <a href={`mailto:${settings.contactEmail}`}>{settings.contactEmail}</a>.
      </p>
    </InfoPage>
  );
}
