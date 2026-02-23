// Central registry of all translatable UI strings.
// Keys are namespaced by page/component. Values are English defaults.
export const STRINGS: Record<string, string> = {
  // LanguageToggle
  "toggle.label": "Language",

  // Homepage
  "home.title":
    "Have you or someone you know been detained by immigration officials?",
  "home.description":
    "Use this tool to find information on how to locate and contact a detainee, legal information, and information about detention facilities and community and legal aid support organizations.",
  "home.card.title": "Detainee Justice Tool",
  "home.card.description": "Answer some questions to find relevant information.",
  "home.card.cta": "Get Started",
  "home.privacy.title": "Your Privacy",
  "home.privacy.description":
    "This site is private and secure. We do not ask for or save any information about you.",
  "home.scams.title": "Stay Safe From Scams",
  "home.scams.description":
    "These organizations are verified to help immigrants. They should never ask for money upfront or before you meet with them.",
  "home.scams.protect.title": "Protect yourself",
  "home.scams.protect.safe.label": "Stay safe:",
  "home.scams.protect.safe.text":
    "Be careful about sharing personal information. Confirm you are speaking with a real organization before giving details about yourself or your family.",
  "home.scams.protect.scams.label": "Avoid scams:",
  "home.scams.protect.scams.text":
    "Do not send money to anyone you have not met in person. Scammers pretend to be lawyers or government workers.",
  "home.scams.protect.money.label": "Protect your money:",
  "home.scams.protect.money.text":
    "Always meet with a lawyer in person before paying them. Never send money to someone claiming to be a lawyer if you haven't met them.",
  "home.scams.protect.sign.label": "Read before signing:",
  "home.scams.protect.sign.text":
    "Do not sign anything you don't understand. Ask questions and get documents translated into your language if needed.",

  // Step 1
  "step1.back": "Back",
  "step1.title": "Where was the person arrested?",
  "step1.subtitle": "Select the state and county where the arrest occurred",
  "step1.state.label": "State",
  "step1.state.placeholder": "Select a state",
  "step1.state.error": "Please select a state to continue.",
  "step1.county.label": "County",
  "step1.county.optional": "(Optional)",
  "step1.county.placeholder": "Select a county",
  "step1.county.unknown": "I don't know the county",
  "step1.continue": "Continue",

  // Step 2
  "step2.back": "Back",
  "step2.title": "Do you know where the person is being held?",
  "step2.yes": "Yes",
  "step2.no": "No",
  "step2.error": "Please select Yes or No to continue.",
  "step2.continue": "Continue",

  // Step 3
  "step3.back": "Back",
  "step3.title": "Where is the person detained?",
  "step3.subtitle": "Select the detained state and detention facility.",
  "step3.state.label": "State",
  "step3.state.required": "(Required)",
  "step3.state.placeholder": "Select a state",
  "step3.facility.label": "Detention Facility",
  "step3.facility.required": "(Required)",
  "step3.facility.placeholder": "Select a facility",
  "step3.error": "Please select the required fields to continue.",
  "step3.continue": "Continue",

  // Results — known location
  "resultsKnown.back": "Back",
  "resultsKnown.titlePrefix": "Resources for",
  "resultsKnown.defaultState": "your state",
  "resultsKnown.placeholder":
    "Placeholder results page for users who provided detained location.",

  // Results — unknown location
  "resultsUnknown.back": "Back",
  "resultsUnknown.title": "We don't have the detention location",
  "resultsUnknown.placeholder":
    "Placeholder page for users who don't know where the person is being held. We'll create tailored resources here.",

  // Footer
  "footer.legal":
    "This tool provides general legal information, not legal advice.",
  "footer.translation":
    "We've made this tool available in multiple languages using automated translation. Translations may not be perfect. If something doesn't make sense, try switching to English or get help in your language.",
  "footer.org": "Legal or community organization?",
  "footer.org.link": "Get listed here",
  "footer.copyright":
    "© 2026 Immigrant Justice Lab at University of Michigan + Michigan Immigrant Rights Center (MIRC)",
};
