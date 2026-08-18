import { useLanguage } from "../contexts/LanguageContext";

const tc = "/medimages/termsCondition.svg";

export default function TermsAndConditions() {
  const { t } = useLanguage();

  const eligibilityItems = [
    t(
      "legal",
      "termsEligibility1",
      "You must provide accurate and up-to-date account information.",
    ),
    t(
      "legal",
      "termsEligibility2",
      "You are responsible for maintaining the confidentiality of your login credentials.",
    ),
    t(
      "legal",
      "termsEligibility3",
      "You must promptly notify us if you suspect unauthorized account access.",
    ),
    t(
      "legal",
      "termsEligibility4",
      "If you use Medirator on behalf of another person (e.g., dependent), you confirm you are authorized to do so.",
    ),
  ];

  const serviceItems = [
    t(
      "legal",
      "termsService1",
      "Query synthetic hospital knowledge via Medibot (keyword RAG + Grok).",
    ),
    t(
      "legal",
      "termsService2",
      "Explore demo patients, medicines, inventory, and instruments.",
    ),
    t(
      "legal",
      "termsService3",
      "Receive structured informational outputs (SOAP, medicine cards, stock panels).",
    ),
    t(
      "legal",
      "termsService4",
      "Risk indicators and recommendations are informational and are not a diagnosis or treatment plan.",
    ),
    t(
      "legal",
      "termsService5",
      "In emergencies, contact local emergency services or a licensed healthcare professional immediately.",
    ),
  ];

  const responsibilityItems = [
    t("legal", "termsResp1", "Use the platform lawfully and ethically."),
    t(
      "legal",
      "termsResp2",
      "Do not upload false, misleading, or harmful medical information.",
    ),
    t(
      "legal",
      "termsResp3",
      "Do not attempt to disrupt, reverse engineer, or misuse the platform.",
    ),
    t(
      "legal",
      "termsResp4",
      "Consult licensed medical professionals for clinical decisions.",
    ),
  ];

  return (
    <div className="bg-white leading-relaxed font-ibm-plex-mono dark:bg-black dark:text-white">
      <div className="mb-6 flex items-center justify-between gap-4 bg-[#0B3C5D] p-6 text-white shadow-md dark:bg-black">
        <div>
          <h2 className="text-5xl font-bold">
            {t("legal", "termsTitle", "Terms & Conditions")}
          </h2>
          <p className="mt-2">
            {t(
              "legal",
              "termsHeroText",
              "All the terms and conditions of Medirator are listed below. Please feel free to contact us in case of any confusion.",
            )}
          </p>
        </div>
        <img
          src={tc}
          alt={t("legal", "termsTitle", "Terms & Conditions")}
          className="h-40 w-40 md:h-70 md:w-70"
          loading="lazy"
        />
      </div>

      <div className="p-6">
        <h1 className="mb-6 text-3xl font-bold">
          {t("legal", "termsPageTitle", "Medirator Terms & Conditions")}
        </h1>

        <p className="mb-4">
          {t(
            "legal",
            "termsIntro",
            "Welcome to Medirator. By accessing or using our healthcare application, website, or related services, you agree to these Terms & Conditions. If you do not agree, please stop using the platform. For support, contact us at",
          )}{" "}
          <a href="mailto:mediratorinfo@gmail.com" className="underline">
            mediratorinfo@gmail.com
          </a>
          .
        </p>

        <h2 className="mt-6 mb-2 text-xl font-semibold">
          {t("legal", "termsSection1Title", "1. About Medirator")}
        </h2>
        <p className="mb-4">
          {t(
            "legal",
            "termsAboutBody",
            "Medirator is a digital healthcare knowledge assistant. Medibot uses keyword RAG and Grok (xAI). It does not replace professional medical judgment or emergency medical services.",
          )}
        </p>

        <h2 className="mt-6 mb-2 text-xl font-semibold">
          {t("legal", "termsSection2Title", "2. Eligibility and Accounts")}
        </h2>
        <ul className="mb-4 list-inside list-disc">
          {eligibilityItems.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>

        <h2 className="mt-6 mb-2 text-xl font-semibold">
          {t(
            "legal",
            "termsSection3Title",
            "3. Scope of Healthcare App Services",
          )}
        </h2>
        <ul className="mb-4 list-inside list-disc">
          {serviceItems.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>

        <h2 className="mt-6 mb-2 text-xl font-semibold">
          {t("legal", "termsSection4Title", "4. User Responsibilities")}
        </h2>
        <ul className="mb-4 list-inside list-disc">
          {responsibilityItems.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>

        <h2 className="mt-6 mb-2 text-xl font-semibold">
          {t("legal", "termsSection9Title", "5. Disclaimer of Medical Advice")}
        </h2>
        <p className="mb-4">
          {t(
            "legal",
            "termsMedical1",
            "Medirator does not provide direct medical diagnosis, prescriptions, or treatment. Information is for organizational and informational use and should be verified with healthcare professionals.",
          )}
        </p>

        <h2 className="mt-6 mb-2 text-xl font-semibold">
          {t("legal", "termsSection12Title", "6. Changes to Terms")}
        </h2>
        <p className="mb-4">
          {t(
            "legal",
            "termsChangesBody",
            "Medirator reserves the right to revise these terms at any time. Users are encouraged to review the terms regularly.",
          )}
        </p>

        <p className="mt-6">
          {t(
            "legal",
            "termsClosing",
            "By continuing to use Medirator, you acknowledge that you have read, understood, and agreed to these Terms & Conditions.",
          )}
        </p>
      </div>
    </div>
  );
}
