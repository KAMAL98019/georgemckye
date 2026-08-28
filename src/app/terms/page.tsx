import InfoPage from "@/components/ui/InfoPage";
import type { Metadata } from "next";

// Renders Footer (categories) at request time instead of freezing whatever
// state the DB was in during the build's static-generation step.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms and conditions for using the George McKye website.",
};

export default function TermsPage() {
  return (
    <InfoPage
      title="Terms of Service"
      intro="Please read these terms carefully before using our website or placing an order."
    >
      <h2>Orders</h2>
      <p>
        Placing an order or sending a WhatsApp request does not guarantee availability. All orders are subject to
        confirmation by our team regarding stock, pricing, and delivery.
      </p>

      <h2>Pricing</h2>
      <p>
        Prices are listed in Indian Rupees (₹) and may change without prior notice. Final pricing, including any
        shipping charges, is confirmed with you before your order is processed.
      </p>

      <h2>Product Information</h2>
      <p>
        We make every effort to display product details and images accurately. Minor variations in color or
        texture may occur due to the natural materials used and differences in display settings.
      </p>

      <h2>Use of Website</h2>
      <p>
        You agree to use this website only for lawful purposes and to provide accurate information when placing an
        order or contacting us.
      </p>

      <h2>Changes to These Terms</h2>
      <p>
        We may update these terms from time to time. Continued use of the website after changes are posted
        constitutes acceptance of the revised terms.
      </p>

      <h2>Contact</h2>
      <p>
        Questions about these terms can be sent to us via the <a href="/contact">Contact page</a>.
      </p>
    </InfoPage>
  );
}
