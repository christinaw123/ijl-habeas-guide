// Central registry of all translatable UI strings.
// Keys are namespaced by page/component. Values are English defaults.
export const STRINGS: Record<string, string> = {
  // LanguageToggle
  "toggle.label": "Language",

  // Homepage
  "home.title":
    "Have you or someone you know been detained by immigration officials?",
  "home.description":
    "Use this free tool to help locate a detained person, understand their legal options, and find community and legal support organizations near you.",
  "home.card.title": "Detainee Justice Tool",
  "home.card.cta": "Get Started",
  "home.card.disclaimer":
    "This tool does not collect or share any information about you. We are not affiliated with ICE or any government agency.",
  "home.about.title": "About This Tool",
  "home.about.p1":
    "This tool was created by the Immigrant Justice Lab at the University of Michigan, in partnership with the Michigan Immigrant Rights Center (MIRC).",
  "home.about.p2":
    "The Immigrant Justice Lab and MIRC work together to help immigrant communities get the information and support they need. MIRC offers free legal help to immigrants across Michigan, including people who have been detained.",
  "home.about.cta": "Learn More",

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

  // Loading screen
  "loading.title": "Retrieving data...",
  "loading.subtitle": "Please wait while we fetch the information.",

  // Step 2
  "step2.back": "Back",
  "step2.title": "Do you know where the person is being held?",
  "step2.subtitle": "Select the option that best describes the situation",
  "step2.yes": "Yes",
  "step2.no": "No",
  "step2.error": "Please select Yes or No to continue.",
  "step2.continue": "Continue",

  // Step 3
  "step3.back": "Back",
  "step3.title": "Where is the person detained?",
  "step3.subtitle": "Select the location and name of the detention facility.",
  "step3.state.label": "State",
  "step3.state.placeholder": "Select a state",
  "step3.facility.label": "Detention Facility",
  "step3.facility.placeholder": "Select a facility",
  "step3.facility.manual.label": "Other Detention Facility",
  "step3.facility.manual.placeholder": "Enter facility name",
  "step3.error": "Please select the required fields to continue.",
  "step3.continue": "Continue",
  "step3.help.noFacility": "I don't see the facility",
  "step3.help.unknownFacility": "I don't know the name of the facility",
  "step3.guidance.title": "How to Find the Facility Name",
  "step3.guidance.intro":
    "If you don't know the name of the detention facility, try these options:",
  "step3.guidance.tip1": "Ask another detainee — they may know the facility name",
  "step3.guidance.tip2": "Ask a guard or staff member at the facility",
  "step3.guidance.tip3": "Check any documents you received when the person was detained",
  "step3.guidance.tip4": "Look for signs or posted information inside the facility",
  "step3.guidance.tip5":
    "Contact a family member or friend who may have the facility information",
  "step3.guidance.outro":
    "Once you have the facility name, you can come back and enter it above.",

  // Results — known location — page / badges
  "resultsKnown.title": "Help for Detainees",
  "resultsKnown.arrestedIn": "Arrested in:",
  "resultsKnown.detainedIn": "Detained in:",
  "resultsKnown.unknownCounty": "Unknown County",
  "resultsKnown.unknownState": "Unknown State",
  "resultsKnown.unknownFacility": "Unknown Facility",

  // Tabs
  "resultsKnown.tab.contact": "Contact the Person",
  "resultsKnown.tab.help": "Get Help",
  "resultsKnown.tab.legal": "Legal Options",

  // Intro (two variants)
  "resultsKnown.intro.orgsFound":
    "We're sorry that you or someone you know has been detained. We know this is a frightening time. This page has information to help you contact the person, as well as information about the detention facility, general and legal aid support organizations, and your legal options.",
  "resultsKnown.intro.noOrgs":
    "We're sorry that you or someone you know has been detained. We know this is a frightening time. This page has information to help you contact the person, information about the detention facility, and legal information.",

  // Contact tab
  "resultsKnown.contact.heading": "Contact the person",
  "resultsKnown.contact.noDetails":
    "Facility details not available in our database.",
  "resultsKnown.contact.commissaryIntro":
    "The facility website might have information about how to contact the detainee or send money to their commissary account for food, hygiene items, and other necessities.",
  "resultsKnown.contact.commissaryLink": "What is a commissary account?",
  "resultsKnown.contact.callHeading": "How to call a detention facility",
  "resultsKnown.contact.callIntro":
    "It's important to make contact with the detainee to ensure their wellbeing and gather details about their arrest.",
  "resultsKnown.contact.whatToSay.label": "What to say:",
  "resultsKnown.contact.whatToSay.script":
    "“Hello, I would like to contact [full name] who is detained at your facility. Can you provide information on how to reach them or add money to their commissary account?”",
  "resultsKnown.contact.tips.label": "Tips for the call:",
  "resultsKnown.contact.tips.1":
    "Have the person’s full name and date of birth ready.",
  "resultsKnown.contact.tips.2":
    "Ask about visiting hours, phone call procedures, and commissary account deposits.",
  "resultsKnown.contact.tips.3":
    "Be polite and patient—staff may be busy or have limited information.",
  "resultsKnown.contact.toDetainee.label":
    "What to say when you talk to the detainee:",
  "resultsKnown.contact.toDetainee.1":
    "Ask them for a detailed account of the arrest while memory is fresh.",
  "resultsKnown.contact.toDetainee.2": "Tell them not to sign anything.",
  "resultsKnown.contact.toDetainee.3":
    "Ask if they have an attorney and if they have a case pending.",

  // Commissary modal
  "resultsKnown.modal.commissary.title": "What is a commissary account?",
  "resultsKnown.modal.commissary.p1":
    "A commissary account is a prepaid account that allows detainees to purchase items from the facility store, which typically includes food, hygiene products, and other necessities.",
  "resultsKnown.modal.commissary.p2":
    "To add money to a commissary account, you can usually do so through a secure online portal, by phone, or by mailing a check or money order to the facility. Contact the facility directly to find out how their commissary system works.",

  // Org card type labels
  "resultsKnown.org.generalSupport": "General Support",
  "resultsKnown.org.legalSupport": "Legal Support",

  // Get Help tab — orgs found
  "resultsKnown.help.heading": "Get help from organizations",
  "resultsKnown.help.found.intro":
    "These organizations provide free support for detainees and their families. They may be able to help with community support, legal assistance, contacting the detainee, and other related services.",
  "resultsKnown.help.found.badge":
    "Verified organizations · Free or low-cost services",
  "resultsKnown.help.found.callLink": "What to expect when you call",

  // Get Help tab — no orgs
  "resultsKnown.help.notFound.intro":
    "We don’t have verified organizations listed for this area yet. Here are some free resources that may be able to help.",
  "resultsKnown.help.notFound.legal.heading": "Find legal help near you",
  "resultsKnown.help.notFound.legal.desc":
    "Immi is a free tool created by nonprofit legal experts. Answer a few questions to find out what immigration options may be available, and get connected to free legal help in your area.",
  "resultsKnown.help.notFound.legal.cta": "Visit Immi",
  "resultsKnown.help.notFound.community.heading":
    "Find community support near you",
  "resultsKnown.help.notFound.community.desc":
    "Mutual Aid Hub is a map of community support networks across the United States. These are volunteer-run groups that help neighbors with practical needs like food, supplies, and other support.",
  "resultsKnown.help.notFound.community.cta": "Visit Mutual Aid Hub",
  "resultsKnown.help.notFound.list.heading":
    "Is your organization not listed here?",
  "resultsKnown.help.notFound.list.desc":
    "If you provide free legal or community support services to immigrants in this area, we’d like to hear from you.",
  "resultsKnown.help.notFound.list.cta": "Request to be listed",

  // What to expect modal
  "resultsKnown.modal.call.title": "What to expect when you call",
  "resultsKnown.modal.call.p1.bold": "You may need to wait.",
  "resultsKnown.modal.call.p1.body":
    "Many organizations have limited hours and high demand. If you reach voicemail, leave a message and try another organization while you wait.",
  "resultsKnown.modal.call.p2.bold": "Confirm who you’re speaking with.",
  "resultsKnown.modal.call.p2.body":
    "Before sharing details about yourself or your family, make sure you’re speaking with a real organization. If something feels wrong, hang up.",
  "resultsKnown.modal.call.p3.bold": "Services may be free or low cost.",
  "resultsKnown.modal.call.p3.body":
    "Organizations listed here do not charge upfront fees. Some may charge on a sliding scale based on your income. No one should ever ask you for full payment before you meet with them.",

  // Legal options tab
  "resultsKnown.legalTab.heading": "Learn about your legal options",
  "resultsKnown.legalTab.learnMore": "Learn more",
  "resultsKnown.legalTab.additional.heading": "Additional facility information",
  "resultsKnown.legalTab.additional.intro":
    "Important contact information for offices related to this detention facility.",
  "resultsKnown.legalTab.district.sub": "U.S. District Court",

  // (legacy keys kept for any remaining references)
  "resultsKnown.intro":
    "We're sorry that you or someone you know has been detained. This page has information to help you contact the detainee, information about the detention facility, community and legal aid support organizations.",
  "resultsKnown.community.heading": "Get help from community organizations",
  "resultsKnown.community.description":
    "These organizations provide support for detainees and their families in this arrest area or for this detention facility. They may be able to help you contact the detainee, add money to commissary account, and provide support for the detainee's family.",
  "resultsKnown.community.toAskForHelp": "TO ASK FOR HELP:",
  "resultsKnown.facility.heading": "Contact the detention facility",
  "resultsKnown.facility.description":
    "The facility website might have information about how to contact the detainee or add money to their commissary account.",
  "resultsKnown.legal.heading": "Get legal help",
  "resultsKnown.legal.description":
    "These organizations provide legal support for detainees and their families in this arrest area or for this detention facility. They may be able to help the detainee get released on bond, help in Immigration Court, and, in some cases, get released via habeas petition in Federal District Court.",
  "resultsKnown.legal.toAskForHelp": "TO ASK FOR HELP:",
  "resultsKnown.options.heading": "Learn about legal options for detainees",
  "resultsKnown.options.court.title": "Immigration Court",
  "resultsKnown.options.court.description":
    "Immigration Court is where deportation cases are reviewed and decided. In Immigration Court, you can defend yourself against deportation, request release from detention, and request \"voluntary departure\" if you agree to leave the United States.",
  "resultsKnown.options.court.cta": "Learn more",
  "resultsKnown.options.bonds.title": "Immigration Bonds",
  "resultsKnown.options.bonds.description":
    "When someone is detained by immigration officials, often the first legal step will be to determine if the person can request to be released from detention on an \"immigration bond.\"",
  "resultsKnown.options.bonds.cta": "Learn more",
  "resultsKnown.options.habeas.title": "Habeas Corpus",
  "resultsKnown.options.habeas.description":
    "Sometimes a detainee can't ask for a bond hearing or their bond request is denied. In certain cases, they can instead ask to be released through a hearing in a different type of court. This requires making a specific kind of legal request — known as a \"habeas petition\" — in a U.S. Federal District Court.",
  "resultsKnown.options.habeas.cta": "Learn more",
  "resultsKnown.other.heading": "Other Important Information",
  "resultsKnown.other.iceOffice.title": "ICE Field Office",
  "resultsKnown.other.court.title": "District Court",
  "resultsKnown.other.court.clerk": "Clerk of Court:",

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
