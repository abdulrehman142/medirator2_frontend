import { useLanguage } from "../contexts/LanguageContext";

const tc = "/medimages/termsCondition.svg";

export default function PrivacyPolicy() {
  const { t } = useLanguage();

  const collectionItems = [
    t("legal", "privacyCollectionName", "Name"),
    t("legal", "privacyCollectionPhone", "Phone Number"),
    t("legal", "privacyCollectionEmail", "Email Address"),
    t(
      "legal",
      "privacyCollectionProfile",
      "Date of birth, gender, and profile details (if provided)",
    ),
    t(
      "legal",
      "privacyCollectionMedical",
      "Medical history, allergies, medications, lab reports, and appointment notes (if provided)",
    ),
    t(
      "legal",
      "privacyCollectionDevice",
      "Device information, app usage data, and diagnostic logs",
    ),
  ];

  const usageItems = [
    t("legal", "privacyUseAccount", "Create and manage user accounts"),
    t(
      "legal",
      "privacyUseRecords",
      "Enable health record organization and patient-facing features",
    ),
    t(
      "legal",
      "privacyUseAlerts",
      "Provide reminders, alerts, and care-related notifications",
    ),
    t(
      "legal",
      "privacyUseQuality",
      "Improve platform safety, reliability, and performance",
    ),
    t(
      "legal",
      "privacyUseCompliance",
      "Comply with legal, regulatory, and security obligations",
    ),
  ];

  const deletionItems = [
    t("legal", "privacyDeleteApp", "The in-app Delete Account option"),
    t("legal", "privacyDeleteEmail", "Email: mediratorinfo@gmail.com"),
    t(
      "legal",
      "privacyDeleteForm",
      "Contact Form: https://medirator.com/contact-us",
    ),
  ];

  const locationItems = [
    t(
      "legal",
      "privacyLocation1",
      "Improve address convenience for healthcare scheduling features",
    ),
    t(
      "legal",
      "privacyLocation2",
      "Enable region-specific health support experiences",
    ),
    t(
      "legal",
      "privacyLocation3",
      "Enhance fraud detection and account protection",
    ),
  ];

  return (
    <div className="bg-white leading-relaxed font-ibm-plex-mono dark:bg-black dark:text-white">
      <div className="mb-6 flex items-center justify-between gap-4 bg-[#0B3C5D] p-6 text-white shadow-md dark:bg-black">
        <div>
          <h2 className="text-5xl font-bold">
            {t("legal", "privacyTitle", "Privacy Policy")}
          </h2>
          <p className="mt-2">
            {t(
              "legal",
              "privacyHeroText",
              "By accessing or using the Platform, you agree to this Policy. If you do not agree to this policy, please do not access or use the platform.",
            )}
          </p>
        </div>
        <img
          src={tc}
          alt={t("legal", "privacyTitle", "Privacy Policy")}
          className="h-40 w-40 md:h-70 md:w-70"
          loading="lazy"
        />
      </div>

      <div className="p-6">
        <h1 className="mb-4 text-3xl font-bold">
          {t("legal", "privacyTitle", "Privacy Policy")}
        </h1>

        <p className="mb-4">
          {t(
            "legal",
            "privacyIntro1",
            "This Privacy Policy explains how Medirator collects, uses, stores, and protects personal and health-related information when you use our healthcare application and website.",
          )}
        </p>
        <p className="mb-4">
          {t(
            "legal",
            "privacyIntro2",
            "This Privacy Policy explains how Medirator collects, uses, discloses, and protects your personal information when you use the Medirator mobile application or website (Platform). By accessing or using the Platform, you agree to the terms of this Privacy Policy and the Medirator User Agreement. If you are using Medirator on behalf of a minor or dependent, you confirm you are legally authorized to do so.",
          )}
        </p>

        <h2 className="mt-6 mb-2 text-2xl font-semibold">
          {t(
            "legal",
            "privacySection1Title",
            "1. Collection and Use of Personal Information",
          )}
        </h2>

        <h3 className="mt-4 mb-2 text-xl font-semibold">
          {t("legal", "privacyCollectSubtitle", "a) Information We Collect")}
        </h3>
        <p className="mb-4">
          {t(
            "legal",
            "privacyCollectBody",
            "Medirator may collect the following information from users who create an account or use the Platform:",
          )}
        </p>
        <ul className="mb-4 ml-6 list-disc">
          {collectionItems.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>

        <h3 className="mt-4 mb-2 text-xl font-semibold">
          {t("legal", "privacyUseSubtitle", "b) How We Use Your Information")}
        </h3>
        <p className="mb-4">
          {t("legal", "privacyUseBody", "Medirator uses this information to:")}
        </p>
        <ul className="mb-4 ml-6 list-disc">
          {usageItems.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>

        <h3 className="mt-4 mb-2 text-xl font-semibold">
          {t("legal", "privacyDeleteSubtitle", "c) Data Deletion Requests")}
        </h3>
        <p className="mb-4">
          {t(
            "legal",
            "privacyDeleteBody",
            "Users may request deletion of their personal data via:",
          )}
        </p>
        <ul className="mb-4 ml-6 list-disc">
          {deletionItems.map((item) => {
            if (item.includes("@")) {
              return (
                <li key={item}>
                  <a href="mailto:mediratorinfo@gmail.com" className="underline">
                    mediratorinfo@gmail.com
                  </a>
                </li>
              );
            }
            if (item.includes("contact-us")) {
              return (
                <li key={item}>
                  <a
                    href="https://medirator.com/contact-us"
                    className="underline"
                  >
                    https://medirator.com/contact-us
                  </a>
                </li>
              );
            }
            return <li key={item}>{item}</li>;
          })}
        </ul>
        <p className="mb-4">
          {t(
            "legal",
            "privacyDeleteAfterBody",
            "When deletion is requested, we remove or anonymize data except where retention is required by law, security, fraud prevention, or legitimate operational purposes.",
          )}
        </p>

        <h3 className="mt-4 mb-2 text-xl font-semibold">
          {t("legal", "privacySocialLoginsTitle", "d) Unlinking Social Logins")}
        </h3>
        <p className="mb-4">
          {t(
            "legal",
            "privacySocialLoginsBody",
            "Users who signed in using Google can unlink their accounts via account settings. Linked session data will be cleared on logout/deletion.",
          )}
        </p>

        <h3 className="mt-4 mb-2 text-xl font-semibold">
          {t("legal", "privacyLocationTitle", "e) Optional Location Data")}
        </h3>
        <p className="mb-4">
          {t(
            "legal",
            "privacyLocationBody",
            "If you grant permission, Medirator may use location data to:",
          )}
        </p>
        <ul className="mb-4 ml-6 list-disc">
          {locationItems.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>

        <h2 className="mt-6 mb-2 text-2xl font-semibold">
          {t(
            "legal",
            "privacyCookiesTitle",
            "2. Cookies and Anonymous Identifiers",
          )}
        </h2>
        <p className="mb-4">
          {t(
            "legal",
            "privacyCookiesBody",
            "The Platform may use cookies and similar technologies to remember preferences, secure sessions, analyze traffic, and improve user experience.",
          )}
        </p>

        <h2 className="mt-6 mb-2 text-2xl font-semibold">
          {t(
            "legal",
            "privacyProtectTitle",
            "3. Protecting Your Personal Information",
          )}
        </h2>
        <p className="mb-4">
          {t(
            "legal",
            "privacyProtectBody",
            "We use technical and organizational safeguards such as encryption, secure storage, access controls, and monitoring to reduce unauthorized access, use, or disclosure risks. Generation uses the Grok API (xAI) with retrieved synthetic context only.",
          )}
        </p>

        <h2 className="mt-6 mb-2 text-2xl font-semibold">
          {t("legal", "privacySharingTitle", "4. Third-Party Sharing")}
        </h2>
        <p className="mb-4">
          {t(
            "legal",
            "privacySharingBody",
            "We do not sell personal or health data. Google sign-in verifies identity tokens server-side. Synthetic demo clinical records are not real PHI.",
          )}
        </p>

        <h2 className="mt-6 mb-2 text-2xl font-semibold">
          {t("legal", "privacyChangesTitle", "5. Changes to This Policy")}
        </h2>
        <p className="mb-4">
          {t(
            "legal",
            "privacyChangesBody",
            "We may update this Privacy Policy from time to time. Updated versions will be posted on this page with effect from the date of publication.",
          )}
        </p>
      </div>
    </div>
  );
}
