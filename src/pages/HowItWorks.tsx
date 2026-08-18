import { useLanguage } from "../contexts/LanguageContext";

const hiw = "/medimages/howitworks.png";

export default function HowItWorks() {
  const { t } = useLanguage();

  const steps = [
    {
      title: t("auth", "chooseAService", "Choose a Service"),
      body: t(
        "auth",
        "howItWorksStep1",
        "Browse healthcare services on Medirator such as Family History, Salts, Health Risks, Appointments, Test Reports, and Visualizer.",
      ),
    },
    {
      title: t("auth", "addAndOrganizeData", "Add and Organize Your Data"),
      body: t(
        "auth",
        "howItWorksStep2",
        "Store your health information in one place — including family history, salts, prescriptions, and test reports — so nothing is scattered or lost.",
      ),
    },
    {
      title: t("auth", "getSmartInsights", "Get Smart Insights"),
      body: t(
        "auth",
        "howItWorksStep3",
        "Medirator uses explainable AI to highlight potential health risks early and support better discussions with doctors.",
      ),
    },
    {
      title: t(
        "auth",
        "manageAppointmentsAndCare",
        "Manage Appointments and Care",
      ),
      body: t(
        "auth",
        "howItWorksStep4",
        "Track appointments, follow-up plans, and test updates in one place to keep your care journey smooth and consistent.",
      ),
    },
    {
      title: t(
        "auth",
        "stayProtectedAndInformed",
        "Stay Protected and Informed",
      ),
      body: t(
        "auth",
        "howItWorksStep5",
        "With secure access and clear guidance, Medirator helps you stay informed and in control of your health.",
      ),
    },
  ];

  return (
    <div className="bg-white font-ibm-plex-mono leading-relaxed dark:bg-black dark:text-white">
      <div className="mb-6 flex items-center justify-between gap-4 bg-[#0B3C5D] p-6 text-white shadow-md dark:bg-black">
        <div>
          <h2 className="text-5xl font-bold">
            {t("navbar", "howItWorks", "How it works")}
          </h2>
          <p className="mt-2">
            {t(
              "auth",
              "howItWorksIntro1",
              "Medirator is designed to make healthcare",
            )}{" "}
            <br />
            {t(
              "auth",
              "howItWorksIntro2",
              "management simple, proactive, and",
            )}{" "}
            <br />
            {t("auth", "howItWorksIntro3", "secure for patients and")} <br />
            {t("auth", "howItWorksIntro4", "families.")}
          </p>
        </div>
        <img
          src={hiw}
          alt={t("auth", "howItWorksBanner", "Banner")}
          className="h-40 w-40 object-contain md:h-70 md:w-70"
          loading="lazy"
        />
      </div>

      <div className="flex flex-col items-center px-4 pb-10">
        {steps.map((step, index) => (
          <div
            key={step.title}
            className="m-2 flex w-full max-w-md flex-col items-center p-2"
          >
            <div className="m-2 flex h-12 w-12 items-center justify-center rounded-full border-2 p-2 text-center text-[#5a6872] dark:text-white">
              {index + 1}
            </div>
            <div className="m-1 p-1 text-center text-xl font-bold">
              {step.title}
            </div>
            <div className="m-1 p-1 text-center text-[#5a6872] dark:text-white">
              {step.body}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
