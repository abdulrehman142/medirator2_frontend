import { useLanguage } from "../contexts/LanguageContext";

const aboutBanner = "/medimages/about-us.png";
const reliability = "/medimages/reliability.png";
const experience = "/medimages/experience.png";
const trust = "/medimages/trust.png";
const accessibility = "/medimages/accesibility.png";

export default function About() {
  const { t } = useLanguage();

  return (
    <div className="bg-white font-ibm-plex-mono leading-relaxed text-black dark:bg-black dark:text-white">
      <div className="mb-6 flex items-center justify-between gap-4 bg-[#0B3C5D] p-6 text-white shadow-md dark:bg-black">
        <div>
          <h2 className="text-5xl font-bold">
            {t("navbar", "aboutUs", "About Us")}
          </h2>
          <p className="mt-2">
            {t(
              "auth",
              "aboutIntro1",
              "We are a next-generation AI-powered healthcare platform dedicated to making healthcare smarter, safer, and more accessible.",
            )}
          </p>
        </div>
        <img
          src={aboutBanner}
          alt={t("navbar", "aboutUs", "About Us")}
          className="h-40 w-40 object-contain md:h-70 md:w-70"
          loading="lazy"
        />
      </div>

      <div className="p-6 dark:bg-black dark:text-white">
        <h1 className="mb-6 text-3xl font-bold">
          {t("auth", "aboutMedirator", "About Medirator")}
        </h1>

        <p className="mb-4 leading-relaxed">
          {t(
            "auth",
            "aboutIntro2",
            "Our platform brings together complete patient records, doctor information, medical tests, and appointments into a unified system designed for predictive and preventive care.",
          )}
        </p>

        <h2 className="mt-8 mb-4 text-2xl font-semibold">
          {t(
            "auth",
            "aiPoweredClinicalIntelligence",
            "AI-Powered Clinical Intelligence",
          )}
        </h2>
        <p className="mb-4 leading-relaxed">
          {t(
            "auth",
            "aboutClinicalParagraph",
            "Unlike traditional healthcare systems that store only basic patient data in fragmented silos, Medirator provides intelligent insights using explainable AI to help doctors identify potential health risks early and make informed decisions.",
          )}
        </p>

        <h2 className="mt-8 mb-4 text-2xl font-semibold">
          {t(
            "auth",
            "comprehensiveCareManagement",
            "Comprehensive Care Management",
          )}
        </h2>
        <p className="mb-4 leading-relaxed">
          {t(
            "auth",
            "aboutCareParagraph",
            "Medirator also supports comprehensive medication management, including detailed information about medicines, salts, and pharmaceutical companies, reducing the risk of duplication and harmful interactions.",
          )}
        </p>

        <p className="mb-4 leading-relaxed">
          {t(
            "auth",
            "aboutPatientsParagraph",
            "Patients benefit from user-friendly and adaptive interfaces that simplify medical data, making it easier to understand their own health history.",
          )}
        </p>

        <ul className="mb-4 list-disc pl-6 leading-relaxed">
          <li>Family History</li>
          <li>Salts and medication tracking</li>
          <li>Health Risks insights</li>
          <li>Appointments and Test Reports management</li>
          <li>Visualizer for clear health data insights</li>
        </ul>

        <h2 className="mt-8 mb-4 text-2xl font-semibold">
          {t("auth", "privacyAndSecurity", "Privacy and Security")}
        </h2>
        <p className="mb-4 leading-relaxed">
          {t(
            "auth",
            "aboutPrivacyParagraph",
            "We follow a privacy-first approach. Sensitive health information is protected with secure access controls and responsible data handling.",
          )}
        </p>

        <ul className="mb-4 list-disc pl-6 leading-relaxed">
          <li>Protected user accounts</li>
          <li>Controlled access to sensitive data</li>
          <li>Continuous security and reliability improvements</li>
        </ul>

        <h2 className="mt-8 mb-4 text-2xl font-semibold">
          {t("auth", "ourMission", "Our Mission")}
        </h2>
        <p className="mb-4 leading-relaxed">
          {t(
            "auth",
            "aboutMissionParagraph",
            "At the core of our mission is proactive healthcare — leveraging technology and AI to improve patient safety, reduce doctors’ workload, and provide a seamless healthcare experience for everyone.",
          )}
        </p>

        <h2 className="mt-8 mb-4 text-2xl font-semibold">
          {t("auth", "whatWeStandFor", "What We Stand For")}
        </h2>
        <p className="mb-4 leading-relaxed">
          {t(
            "auth",
            "aboutStandForParagraph",
            "We combine innovation, security, and accessibility to redefine how healthcare is delivered.",
          )}
        </p>

        <h3 className="mt-6 mb-3 text-xl font-semibold">
          {t("auth", "coreServices", "Core Services")}
        </h3>
        <ul className="mb-4 list-disc pl-6 leading-relaxed">
          <li>Family History</li>
          <li>Salts</li>
          <li>Health Risks</li>
          <li>Appointments</li>
          <li>Test Reports</li>
          <li>Security</li>
          <li>Visualizer</li>
        </ul>

        <h3 className="mt-6 mb-3 text-xl font-semibold">
          {t("auth", "userExperienceFocus", "User Experience Focus")}
        </h3>
        <p className="mb-4 leading-relaxed">
          {t("auth", "weDesignMediratorToBe", "We design Medirator to be:")}
        </p>
        <ul className="mb-4 list-disc pl-6 leading-relaxed">
          <li>Simple for everyday use</li>
          <li>Reliable for long-term record keeping</li>
          <li>Clear for both patients and family members</li>
        </ul>

        <h3 className="mt-6 mb-3 text-xl font-semibold">
          {t("auth", "ourCommitment", "Our Commitment")}
        </h3>
        <ul className="mb-4 list-disc pl-6 leading-relaxed">
          <li>Secure health data handling</li>
          <li>Patient-centered feature design</li>
          <li>Continuous product improvement based on user needs</li>
        </ul>
      </div>

      <div className="flex flex-wrap justify-center gap-4 bg-white p-6 dark:bg-black sm:justify-between">
        {[
          {
            img: reliability,
            title: t("auth", "reliableHealthData", "Reliable Health Data"),
            desc: t(
              "auth",
              "reliableHealthDataDesc",
              "We prioritize structured and dependable health information so users can trust what they see in the app.",
            ),
          },
          {
            img: experience,
            title: t("auth", "guidedExperience", "Guided Experience"),
            desc: t(
              "auth",
              "guidedExperienceDesc",
              "Visualizer is built into Medirator so users can understand health trends and progress with clarity and confidence.",
            ),
          },
          {
            img: trust,
            title: t("auth", "trustedPlatform", "Trusted Platform"),
            desc: t(
              "auth",
              "trustedPlatformDesc",
              "Medirator keeps records, reports, and appointments unified for dependable healthcare management.",
            ),
          },
          {
            img: accessibility,
            title: t("auth", "accessibleForEveryone", "Accessible for Everyone"),
            desc: t(
              "auth",
              "accessibleForEveryoneDesc",
              "We focus on a simple and inclusive interface so patients and families from all backgrounds can use Medirator with ease.",
            ),
          },
        ].map((card) => (
          <div
            key={card.title}
            className="flex min-h-[280px] w-full max-w-[280px] flex-1 flex-col items-center rounded-2xl bg-[#f4f4f5] p-4 dark:bg-[#1a1a1a]"
          >
            <div className="mt-2">
              <img
                src={card.img}
                alt={card.title}
                className="h-20 w-20 object-contain"
                loading="lazy"
              />
            </div>
            <div className="mt-3 text-center text-xl font-bold dark:text-white">
              {card.title}
            </div>
            <div className="mt-2 flex-1 p-2 text-center text-sm leading-relaxed text-[#94a2b3] dark:text-gray-300">
              {card.desc}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
