import { useState } from "react";
import { useLanguage } from "../contexts/LanguageContext";

const helpImg = "/medimages/help.png";

export default function FAQs() {
  const { t } = useLanguage();
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const faqData = [
    {
      id: 1,
      question: t("faq", "question1", "What is Medirator?"),
      answer: t(
        "faq",
        "answer1",
        "Medirator is a digital healthcare assistant that helps you manage your family history, salts information, health risks, appointments, test reports, and records in one secure place.",
      ),
    },
    {
      id: 2,
      question: t("faq", "question2", "How do I use Medirator services?"),
      answer: t(
        "faq",
        "answer2",
        "Open the app, choose a feature such as Family History or Appointments, and follow the guided steps. You can also use Medibot to ask natural-language questions over the local knowledge base.",
      ),
    },
    {
      id: 3,
      question: t("faq", "question3", "Is my health data secure on Medirator?"),
      answer: t(
        "faq",
        "answer3",
        "Yes. Medirator applies privacy and security controls including protected access and secure handling of sensitive information. Demo clinical data is synthetic.",
      ),
    },
    {
      id: 4,
      question: t(
        "faq",
        "question4",
        "Can Medirator help me track medications and salts?",
      ),
      answer: t(
        "faq",
        "answer4",
        "Yes. The Salts and related record features help you track your medication information and avoid duplication issues.",
      ),
    },
    {
      id: 5,
      question: t(
        "faq",
        "question5",
        "Can I manage appointments in Medirator?",
      ),
      answer: t(
        "faq",
        "answer5",
        "Yes. You can view, organize, and update appointment-related information from the Appointments section.",
      ),
    },
    {
      id: 6,
      question: t(
        "faq",
        "question6",
        "How does Medirator support proactive care?",
      ),
      answer: t(
        "faq",
        "answer6",
        "Medirator includes Health Risks support to help identify concerns early so you can plan timely follow-up with healthcare professionals.",
      ),
    },
    {
      id: 7,
      question: t(
        "faq",
        "question7",
        "Can I access all my records in one place?",
      ),
      answer: t(
        "faq",
        "answer7",
        "Yes. Medirator brings your key health information together to make it easier to review and share when needed.",
      ),
    },
    {
      id: 8,
      question: t(
        "faq",
        "question8",
        "Is Medirator easy to use for non-technical users?",
      ),
      answer: t(
        "faq",
        "answer8",
        "Yes. Medirator is designed with simple navigation and Visualizer support so both patients and families can use it comfortably.",
      ),
    },
    {
      id: 9,
      question: t("faq", "question9", "Which services are available?"),
      answer: t(
        "faq",
        "answer9",
        "Medirator offers: Family History, Salts, Health Risks, Appointments, Test Reports, Visualizer, and Medibot.",
      ),
    },
  ];

  return (
    <div className="bg-white font-ibm-plex-mono leading-relaxed dark:bg-black dark:text-white">
      <div className="mb-6 flex flex-col items-center justify-between gap-4 bg-[#0B3C5D] p-4 text-white shadow-md md:flex-row md:p-6 dark:bg-black">
        <div>
          <h2 className="text-center text-3xl font-bold md:ml-5 md:pl-5 md:text-left md:text-5xl">
            {t("faq", "title", "FAQs")}
          </h2>
        </div>
        <img
          src={helpImg}
          alt={t("faq", "bannerAlt", "Banner")}
          className="h-40 w-40 object-contain md:h-70 md:w-70"
          loading="lazy"
        />
      </div>

      <div className="mx-auto max-w-4xl px-3 py-6 md:px-4 md:py-8">
        <div className="space-y-3 md:space-y-4">
          {faqData.map((faq) => (
            <div
              key={faq.id}
              className="group overflow-hidden rounded-lg border-2 border-gray-300 transition-all duration-300 hover:shadow-xl dark:border-white dark:hover:border-gray-500 dark:hover:shadow-2xl"
            >
              <button
                type="button"
                onClick={() =>
                  setExpandedId(expandedId === faq.id ? null : faq.id)
                }
                className="flex w-full cursor-pointer items-center justify-between bg-white p-3 transition-all duration-300 group-hover:bg-gray-800 md:p-4 dark:bg-[#0B3C5D] dark:group-hover:bg-gray-800"
              >
                <span className="text-left text-sm font-semibold text-[#0B3C5D] transition-all duration-300 group-hover:text-white md:text-lg dark:text-white">
                  {faq.question}
                </span>
                <span
                  className={`ml-2 flex-shrink-0 text-sm text-[#0B3C5D] transition-all duration-500 group-hover:text-white md:ml-4 md:text-base dark:text-white ${
                    expandedId === faq.id
                      ? "scale-125 rotate-180"
                      : "scale-100 group-hover:scale-110"
                  }`}
                >
                  ▼
                </span>
              </button>

              <div
                className={`overflow-hidden transition-all duration-500 ease-in-out ${
                  expandedId === faq.id
                    ? "max-h-96 opacity-100"
                    : "max-h-0 opacity-0"
                }`}
              >
                <div className="border-2 border-gray-300 p-3 md:p-4">
                  <p className="text-sm text-black md:text-base dark:text-white">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
