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

  // Common
  "common.state.search": "Search states…",

  // Step 1
  "step1.back": "Back",
  "step1.title": "Where was the person arrested?",
  "step1.subtitle": "Select the state and city where the arrest occurred",
  "step1.state.label": "State",
  "step1.state.placeholder": "Select a state",
  "step1.state.error": "Please select a state to continue.",
  "step1.city.label": "City",
  "step1.city.optional": "(Optional)",
  "step1.city.placeholder": "Type a city name...",
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
  "resultsKnown.back": "Back",
  "resultsKnown.title": "Help for Detainees",
  "resultsKnown.arrestedIn": "Arrested in:",
  "resultsKnown.detainedIn": "Detained in:",
  "resultsKnown.unknownCity": "Unknown City",
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
  "resultsKnown.legalTab.district.habeasLink": "File a Habeas Corpus Petition",

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

  // Results — unknown location — page
  "resultsUnknown.back": "Back",
  "resultsUnknown.title": "Locate a Detainee",
  "resultsUnknown.arrestedIn": "Arrested in:",
  "resultsUnknown.editLocation": "Edit arrest location",
  "resultsUnknown.intro":
    "We know this is a frightening time. This page will guide you step by step to search for your loved one.",

  // Alert
  "resultsUnknown.alert.title": "Important Timing",
  "resultsUnknown.alert.body":
    "It can take up to 48 hours for a newly detained person to appear in search tools. If you can't find them right away, try again later.",
  "resultsUnknown.alert.link": "What happens after an arrest?",

  // Tab labels
  "resultsUnknown.tabs.searchIce": "1. Search ICE",
  "resultsUnknown.tabs.otherSearches": "2. Try Other Searches",
  "resultsUnknown.tabs.callFacilities": "3. Call Facilities",
  "resultsUnknown.tabs.ifFound": "If You Find Them",
  "resultsUnknown.tabs.getHelp": "Get Help",

  // Search ICE tab
  "resultsUnknown.searchIce.heading": "Search the ICE Locator",
  "resultsUnknown.searchIce.intro":
    "The ICE Detainee Locator lets you search for people currently in ICE custody or who have been in CBP custody for more than 48 hours.",
  "resultsUnknown.searchIce.gather.heading": "Gather information you'll need.",
  "resultsUnknown.searchIce.gather.anumber": "A-number",
  "resultsUnknown.searchIce.gather.anumberLink": "What's an A-number?",
  "resultsUnknown.searchIce.gather.or": "OR",
  "resultsUnknown.searchIce.gather.name": "Full exact name",
  "resultsUnknown.searchIce.gather.dob": "Date of birth",
  "resultsUnknown.searchIce.gather.country": "Country of birth",
  "resultsUnknown.searchIce.locator.heading": "Search the ICE Detainee Locator",
  "resultsUnknown.searchIce.tips.label": "Important search tips",
  "resultsUnknown.searchIce.tips.1":
    "Spell the name exactly as it appears on government documents.",
  "resultsUnknown.searchIce.tips.2":
    "Try different spellings or name orders if the first search doesn't work.",
  "resultsUnknown.searchIce.tips.3":
    "Try each last name separately if they have more than one.",
  "resultsUnknown.searchIce.cta": "Open ICE Detainee Locator",
  "resultsUnknown.searchIce.next": "Try Other Search Tools",

  // Other Searches tab
  "resultsUnknown.otherSearches.heading": "Other search tools to try",
  "resultsUnknown.otherSearches.intro":
    "If the ICE locator didn't return results, try these additional tools.",
  "resultsUnknown.otherSearches.vine.heading": "Search custody and case records",
  "resultsUnknown.otherSearches.vine.sub": "(VINE)",
  "resultsUnknown.otherSearches.vine.intro":
    "VINE provides updated custody status and criminal case information about people in U.S. jails and prisons. VINE is owned by Equifax, a credit reporting agency. It is free to use. There are two versions of VINE:",
  "resultsUnknown.otherSearches.vinelink.desc":
    "enables you to search for people's custody status or criminal case information for non-immigration offenses in any state. You'll need:",
  "resultsUnknown.otherSearches.vinelink.need1":
    "the state the person was arrested in and their full name",
  "resultsUnknown.otherSearches.vinelink.need2": "their ID number",
  "resultsUnknown.otherSearches.vinelink.cta": "Open VINELink",
  "resultsUnknown.otherSearches.dhsVinelink.desc":
    "enables you to search for people's custody status or criminal case information from Department of Homeland Security records. You'll need the person's:",
  "resultsUnknown.otherSearches.dhsVinelink.need1":
    "A-number (starts with \"A\" + 9 digits) and country of birth",
  "resultsUnknown.otherSearches.dhsVinelink.need2a": "full name",
  "resultsUnknown.otherSearches.dhsVinelink.need2b": "date of birth",
  "resultsUnknown.otherSearches.dhsVinelink.need2c": "country of birth",
  "resultsUnknown.otherSearches.dhsVinelink.cta": "Open DHS VINELink",
  "resultsUnknown.otherSearches.eoir.heading": "Check immigration court records",
  "resultsUnknown.otherSearches.eoir.sub": "(EOIR ACIS)",
  "resultsUnknown.otherSearches.eoir.intro":
    "EOIR Automated Case Information System (ACIS) is a search tool provided by the Executive Office for Immigration Review in the Department of Justice. It provides basic information about the status of certain cases before an immigration court or the Board of Immigration Appeals. You'll need the person's:",
  "resultsUnknown.otherSearches.eoir.need1":
    "A-number (starts with \"A\" + 9 digits) and country of birth",
  "resultsUnknown.otherSearches.eoir.cta": "Open EOIR ACIS",

  // Call Facilities tab
  "resultsUnknown.callFacilities.heading": "Call detention facilities directly",
  "resultsUnknown.callFacilities.intro":
    "If online searches don't work, you can call the ICE detention facilities directly to ask if the person is being held there.",
  "resultsUnknown.callFacilities.accordion.title":
    "How to call a detention facility",
  "resultsUnknown.callFacilities.accordion.intro":
    "Don't be intimidated by calling a detention facility—you have every right to ask about someone who is being detained.",
  "resultsUnknown.callFacilities.accordion.whatToSay": "What to say:",
  "resultsUnknown.callFacilities.accordion.script":
    "“Hello, I am looking for information about [full name]. Is this person currently being detained at your facility?”",
  "resultsUnknown.callFacilities.accordion.tips.label": "Tips for the call:",
  "resultsUnknown.callFacilities.accordion.tips.1":
    "Have the person's full name, date of birth, and A-number (if you know it) ready.",
  "resultsUnknown.callFacilities.accordion.tips.2":
    "The facility may only confirm if someone is there—they may not give you other details.",
  "resultsUnknown.callFacilities.accordion.tips.3":
    "If they're not at that facility, ask if they know where the person might have been transferred.",
  "resultsUnknown.callFacilities.accordion.tips.4":
    "Be polite and patient—staff may be busy or have limited information.",
  "resultsUnknown.callFacilities.accordion.rights.title": "Know your rights",
  "resultsUnknown.callFacilities.accordion.rights.1":
    "You do not need to give your own name or any personal information to ask if someone is detained.",
  "resultsUnknown.callFacilities.accordion.rights.2":
    "Facility staff cannot ask for your immigration status.",
  "resultsUnknown.callFacilities.facilitiesIntro":
    "These facilities often hold people arrested in",
  "resultsUnknown.callFacilities.next": "If You Find Them",

  // If Found tab
  "resultsUnknown.ifFound.heading": "If you find them",
  "resultsUnknown.ifFound.intro":
    "Take these important steps once you locate the person.",
  "resultsUnknown.ifFound.step1": "Take a screenshot of the search result and save it.",
  "resultsUnknown.ifFound.step2":
    "Call the facility directly to confirm they are actually there.",
  "resultsUnknown.ifFound.step3.link": "Return to add their location",
  "resultsUnknown.ifFound.step3.suffix":
    "to get specific resources and free legal aid for that facility.",
  "resultsUnknown.ifFound.next": "Get Help",

  // Get Help tab
  "resultsUnknown.getHelp.heading": "Need help with your search?",
  "resultsUnknown.getHelp.intro":
    "If you weren't able to find your person using the tools above, these local organizations may be able to assist you.",
  "resultsUnknown.getHelp.badge": "Verified organizations · Free or low-cost services",
  "resultsUnknown.getHelp.callLink": "What to expect when you call",
  "resultsUnknown.getHelp.org.generalSupport": "GENERAL SUPPORT",
  "resultsUnknown.getHelp.org.legalSupport": "LEGAL SUPPORT",

  // Modals
  "resultsUnknown.modal.arrestInfo.title": "What happens after an arrest",
  "resultsUnknown.modal.arrestInfo.p1":
    "When someone is detained by immigration authorities, they are usually taken to a local processing center first.",
  "resultsUnknown.modal.arrestInfo.p2":
    "It can take 24 to 48 hours for their information to appear in online search systems. If you can't find them immediately, keep trying.",
  "resultsUnknown.modal.aNumber.title": "What is an A-number?",
  "resultsUnknown.modal.aNumber.p1":
    "The A-number (Alien Registration Number) is a 9-digit number starting with “A” assigned by immigration.",
  "resultsUnknown.modal.aNumber.p2":
    "It may appear on any paperwork from ICE, USCIS, immigration court, or border patrol (like a Notice to Appear or I-862 form).",
  "resultsUnknown.modal.aNumber.fileNo": "FILE NO.",
  "resultsUnknown.modal.aNumber.noNumber": "Don't have an A-number?",
  "resultsUnknown.modal.aNumber.noNumberDesc":
    "You can still search using their full name, country of birth, and date of birth.",
  "resultsUnknown.modal.whatToExpect.title": "What to expect when you call",
  "resultsUnknown.modal.whatToExpect.p1.bold": "You may need to wait.",
  "resultsUnknown.modal.whatToExpect.p1.body":
    "Many organizations have limited hours and high demand. If you reach voicemail, leave a message and try another organization while you wait.",
  "resultsUnknown.modal.whatToExpect.p2.bold": "Confirm who you're speaking with.",
  "resultsUnknown.modal.whatToExpect.p2.body":
    "Before sharing details about yourself or your family, make sure you're speaking with a real organization. If something feels wrong, hang up.",
  "resultsUnknown.modal.whatToExpect.p3.bold": "Services are always free.",
  "resultsUnknown.modal.whatToExpect.p3.body":
    "You should never be asked for payment. Scammers sometimes pretend to be lawyers or immigration workers — if anyone asks for money, do not pay them.",

  // Shared nav labels
  "resultsUnknown.nav.back": "Back",

  // Learn pages — bonds and habeas corpus
  "learn.back": "Back",

  "learn.bonds.title": "Immigration Bonds",
  "learn.bonds.p1":
    "When someone is detained by immigration officials, often the first legal step will be to determine if the person can request to be released from detention on an \"immigration bond.\"",
  "learn.bonds.p2":
    "Getting released on a bond can enable the person to return to their family or loved ones and can make it easier to access support and materials for a case in Immigration Court.",
  "learn.bonds.findHelp.prefix":
    "If you or someone you know has been detained, first try to",
  "learn.bonds.findHelp.link": "find an attorney or free legal aid organization",
  "learn.bonds.selfRep.intro":
    "If the person is forced to defend themself in Immigration Court without an attorney, this resource might be helpful.",
  "learn.bonds.guide.title": "Immigration Bond Guide",
  "learn.bonds.guide.desc":
    "– information about how to ask to be released on bond in Immigration Court",
  "learn.bonds.faq.title": "Immigration Court FAQ",
  "learn.bonds.faq.desc":
    "– information about what happens in Immigration Court and links to additional resources that might address other questions you have about your options",
  "learn.bonds.bailFund.intro":
    "If the person is granted bond but you need help paying it, national and local bail funds may be able to assist. These community organizations help people who cannot afford to pay the bond on their own.",
  "learn.bonds.bailFund.title": "The National Bail Fund Network",
  "learn.bonds.bailFund.desc":
    "has a full directory of community-led bail and bond funds that regularly post pretrial and immigration bail.",

  "learn.habeas.title": "Habeas Corpus",
  "learn.habeas.p1":
    "When someone is detained by immigration officials, it's possible that the person will not get a chance to ask for bond in Immigration Court, or that an Immigration Judge will not grant the person's request to be released on bond. This can happen for many reasons.",
  "learn.habeas.p2":
    "In certain cases, a person may request release from detention at a hearing before a different type of judge in a different type of court. This requires making a specific kind of legal request – known as a \"habeas petition\" – in a U.S. Federal District Court.",
  "learn.habeas.p3":
    "Habeas corpus is a legal process that allows detained individuals to challenge the legality of their detention in court. It ensures that no one can be held without legal justification.",
  "learn.habeas.findHelp.prefix":
    "It is important to get an attorney before submitting a habeas petition in Federal District Court, as the process can be complex. Use our legal aid help finder to",
  "learn.habeas.findHelp.link": "find an attorney or free legal aid organization",
  "learn.habeas.selfRep.intro":
    "If forced to submit a habeas petition without an attorney, the person will need information about the Detention Facility, the Federal District Court responsible for that location, and the ICE Field Office responsible for that location. Refer to this guide for more information:",
  "learn.habeas.guide.title": "Immigration Habeas Petition Guide",
  "learn.habeas.guide.desc":
    "– This guide provides information about some of the reasons immigrants in detention facilities submit habeas petitions to Federal District Courts",
  "learn.habeas.p5":
    "The Federal District Court responsible for the location where the person is detained provides forms for individuals who submit habeas petitions without an attorney and cannot afford the usual filing fees.",

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
