"use client";

import Head from "next/head";
import ContactForm from "@/components/ContactForm";

function ContactPage() {
  return (
    <div>
      <Head>
        <title>Infoverse AI | Contact</title>
      </Head>
      <ContactForm />;
    </div>
  );
}

export default ContactPage;
