/**
 * chatbotEngine.js
 * Pure JS keyword-based query engine.
 * No AI API, no DB queries — reads from chatbotData.js only.
 * Responses are clean and professional — no emojis.
 */

const data = require("./chatbotData");

/* ── helpers ─────────────────────────────────────────────── */
const LOW_STOCK_THRESHOLD = 20;
const EXPIRY_SOON_DAYS    = 30;
const today               = () => new Date();

function daysUntilExpiry(dateStr) {
  return Math.ceil((new Date(dateStr) - today()) / (1000 * 60 * 60 * 24));
}

function fmt(val) { return val ?? "—"; }

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric", month: "short", year: "numeric",
  });
}

/* ── intent detection ───────────────────────────────────── */
function detectIntent(q) {
  const t = q.toLowerCase();

  if (/low.?stock|running.?low|shortage|out.?of.?stock|less.?stock/i.test(t))     return "LOW_STOCK";
  if (/expir|expiry|expire|expired|nearly expir|soon expir/i.test(t))              return "EXPIRING";
  if (/upcoming.?camp|next.?camp|future.?camp|scheduled.?camp/i.test(t))           return "UPCOMING_CAMPS";
  if (/completed.?camp|past.?camp|done.?camp|finished.?camp/i.test(t))             return "COMPLETED_CAMPS";
  if (/all.?camp|list.?camp|how many camp|total.?camp|camp.?list/i.test(t))        return "ALL_CAMPS";
  if (/doctor|physician|registered|staff|who are/i.test(t))                        return "DOCTORS";
  if (/report|success.?rate|outcome|result/i.test(t))                              return "REPORTS";
  if (/medicine|drug|tablet|capsule|syrup|injection|ointment|all.?med|list.?med/i.test(t)) return "MEDICINES";
  if (/stock|inventory|quantity|available|how many/i.test(t))                      return "STOCK";
  if (/disease|illness|common|frequent|diagnos/i.test(t))                          return "DISEASES";
  if (/recommend|suggest|advice|tip/i.test(t))                                     return "RECOMMENDATIONS";
  if (/ngo|organisation|organization|foundation|who runs/i.test(t))                return "NGO";
  if (/summary|overview|dashboard|status|quick|brief/i.test(t))                   return "SUMMARY";
  if (/hello|hi |hey|greet|howdy/i.test(t))                                        return "GREET";
  if (/help|what can|what do|commands|options/i.test(t))                           return "HELP";

  /* named medicine lookup */
  const medMatch = data.medicines.find(m =>
    t.includes(m.name.toLowerCase().split(" ")[0].toLowerCase()) ||
    t.includes(m.name.toLowerCase())
  );
  if (medMatch) return { intent: "MED_DETAIL", med: medMatch };

  /* named doctor lookup */
  const docMatch = data.doctors.find(d =>
    t.includes(d.name.toLowerCase().replace("dr. ", ""))
  );
  if (docMatch) return { intent: "DOC_DETAIL", doc: docMatch };

  /* named camp lookup */
  const campMatch = data.camps.find(c =>
    c.name.toLowerCase().split("–")[0].trim().split(" ")
      .some(word => word.length > 3 && t.includes(word.toLowerCase()))
  );
  if (campMatch) return { intent: "CAMP_DETAIL", camp: campMatch };

  return "UNKNOWN";
}

/* ── response builders ───────────────────────────────────── */
const builders = {

  GREET() {
    return `Hello. I'm **MedBot**, your MedVerify assistant.\n\nI can answer questions about medicines, stock levels, upcoming and completed camps, registered doctors, and camp reports.\n\nHow can I help you?`;
  },

  HELP() {
    return `**Available queries:**\n\nSTOCK AND MEDICINES:\n• Which medicines are low on stock?\n• Which medicines are expiring soon?\n• Tell me about Paracetamol\n• List all medicines\n\nCAMPS:\n• List upcoming camps\n• Show completed camps\n• Tell me about the Dharavi camp\n\nDOCTORS:\n• Who are the registered doctors?\n• Tell me about Dr. Priya Sharma\n\nREPORTS:\n• Show all camp reports\n• What are the most common diseases?\n• Any recommendations?\n\nGENERAL:\n• Give me a dashboard summary`;
  },

  LOW_STOCK() {
    const low = data.medicines.filter(m => m.quantity < LOW_STOCK_THRESHOLD);
    if (!low.length) return "All medicines are currently adequately stocked.";

    const lines = low.map(m =>
      `• **${m.name}** — ${m.quantity} ${m.unitType}s remaining (${m.manufacturer})`
    ).join("\n");

    return `**${low.length} medicine(s) below the minimum threshold of ${LOW_STOCK_THRESHOLD} units:**\n\n${lines}\n\nThese should be reordered before the next camp.`;
  },

  EXPIRING() {
    const expiring = data.medicines
      .map(m => ({ ...m, daysLeft: daysUntilExpiry(m.expiryDate) }))
      .filter(m => m.daysLeft <= EXPIRY_SOON_DAYS)
      .sort((a, b) => a.daysLeft - b.daysLeft);

    if (!expiring.length) return `No medicines are expiring within the next ${EXPIRY_SOON_DAYS} days.`;

    const lines = expiring.map(m => {
      const status = m.daysLeft < 0 ? "EXPIRED" : `${m.daysLeft} day(s) remaining`;
      return `• **${m.name}** — Expiry: ${formatDate(m.expiryDate)} (${status})`;
    }).join("\n");

    return `**${expiring.length} medicine(s) expiring within ${EXPIRY_SOON_DAYS} days:**\n\n${lines}\n\nExpired stock should be removed immediately and restocked.`;
  },

  UPCOMING_CAMPS() {
    const camps = data.camps.filter(c => c.status === "upcoming")
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    if (!camps.length) return "No upcoming camps are currently scheduled.";

    const lines = camps.map(c =>
      `• **${c.name}**\n  Location: ${c.location}\n  Date: ${formatDate(c.date)}\n  Doctor: ${c.doctor}`
    ).join("\n\n");

    return `**${camps.length} Upcoming Camps:**\n\n${lines}`;
  },

  COMPLETED_CAMPS() {
    const camps = data.camps.filter(c => c.status === "completed")
      .sort((a, b) => new Date(b.date) - new Date(a.date));

    if (!camps.length) return "No completed camps on record.";

    const lines = camps.map(c =>
      `• **${c.name}**\n  Location: ${c.location}  |  Date: ${formatDate(c.date)}  |  Patients: ${fmt(c.totalPeople)}  |  Success Rate: ${fmt(c.successRate)}%`
    ).join("\n\n");

    return `**${camps.length} Completed Camps:**\n\n${lines}`;
  },

  ALL_CAMPS() {
    const upcoming  = data.camps.filter(c => c.status === "upcoming").length;
    const completed = data.camps.filter(c => c.status === "completed").length;
    return `**Camp Overview**\n\n• Total camps: ${data.camps.length}\n• Upcoming: ${upcoming}\n• Completed: ${completed}\n\nAsk me to "list upcoming camps" or "show completed camps" for detailed information.`;
  },

  DOCTORS() {
    const lines = data.doctors.map(d =>
      `• **${d.name}** — ${d.specialisation} | ${d.experience} years experience | ${d.phone}`
    ).join("\n");

    return `**${data.doctors.length} Registered Doctors:**\n\n${lines}`;
  },

  MEDICINES() {
    const byType = {};
    data.medicines.forEach(m => {
      byType[m.type] = byType[m.type] || [];
      byType[m.type].push(m.name);
    });

    const lines = Object.entries(byType).map(([type, names]) =>
      `**${type}:** ${names.join(", ")}`
    ).join("\n");

    return `**${data.medicines.length} Medicines in Inventory:**\n\n${lines}\n\nAsk about any specific medicine for full details.`;
  },

  STOCK() {
    const sorted = [...data.medicines].sort((a, b) => a.quantity - b.quantity);
    const lines = sorted.map(m => {
      const flag = m.quantity < LOW_STOCK_THRESHOLD ? "  [LOW]" : "";
      return `• **${m.name}**: ${m.quantity} ${m.unitType}s${flag}`;
    }).join("\n");

    const totalUnits = data.medicines.reduce((s, m) => s + m.quantity, 0);
    return `**Current Stock Levels** — ${totalUnits} total units across ${data.medicines.length} medicines:\n\n${lines}`;
  },

  REPORTS() {
    if (!data.reports.length) return "No reports have been submitted yet.";

    const avgSuccess    = Math.round(data.reports.reduce((s, r) => s + r.successRate, 0) / data.reports.length);
    const totalPatients = data.reports.reduce((s, r) => s + r.totalPeople, 0);

    const lines = data.reports.map(r =>
      `• **${r.campName}**\n  Patients: ${r.totalPeople}  |  Major: ${r.majorCases}  |  Minor: ${r.minorCases}  |  Success Rate: ${r.successRate}%`
    ).join("\n\n");

    return `**Camp Reports — ${data.reports.length} reports on file:**\n\n${lines}\n\n─\nTotal patients treated: ${totalPatients}\nAverage success rate: ${avgSuccess}%`;
  },

  DISEASES() {
    const freq = {};
    data.reports.forEach(r =>
      r.commonDiseases.forEach(d => { freq[d] = (freq[d] || 0) + 1; })
    );
    const sorted = Object.entries(freq).sort((a, b) => b[1] - a[1]);
    const lines = sorted.map(([d, n]) =>
      `• **${d.charAt(0).toUpperCase() + d.slice(1)}** — reported in ${n} camp${n > 1 ? "s" : ""}`
    ).join("\n");

    return `**Most Frequently Reported Conditions Across All Camps:**\n\n${lines}`;
  },

  RECOMMENDATIONS() {
    const unique = [...new Set(data.reports.map(r => r.recommendations))];
    const lines  = unique.map(r => `• ${r}`).join("\n");
    return `**Recommendations from Camp Reports:**\n\n${lines}`;
  },

  NGO() {
    const n = data.ngo;
    return `**Organisation Details:**\n\n• Name: ${n.name}\n• NGO: ${n.ngoName}\n• State: ${n.state}\n• Phone: ${n.phone}\n• Email: ${n.email}`;
  },

  SUMMARY() {
    const lowStock      = data.medicines.filter(m => m.quantity < LOW_STOCK_THRESHOLD).length;
    const expiring      = data.medicines.filter(m => daysUntilExpiry(m.expiryDate) <= EXPIRY_SOON_DAYS).length;
    const upcoming      = data.camps.filter(c => c.status === "upcoming").length;
    const completed     = data.camps.filter(c => c.status === "completed").length;
    const patients      = data.reports.reduce((s, r) => s + r.totalPeople, 0);
    const avgSuccess    = data.reports.length
      ? Math.round(data.reports.reduce((s, r) => s + r.successRate, 0) / data.reports.length)
      : 0;

    return `**MedVerify — Dashboard Summary**\n\nMEDICINES:\n• Total medicines: ${data.medicines.length}\n• Low stock alerts: ${lowStock}\n• Expiring within 30 days: ${expiring}\n\nCAMPS:\n• Upcoming: ${upcoming}\n• Completed: ${completed}\n\nOUTCOMES:\n• Total patients treated: ${patients}\n• Registered doctors: ${data.doctors.length}\n• Average success rate: ${avgSuccess}%`;
  },

  MED_DETAIL({ med }) {
    const daysLeft    = daysUntilExpiry(med.expiryDate);
    const stockStatus = med.quantity < LOW_STOCK_THRESHOLD ? "Low — reorder required" : "Adequate";
    const expiryNote  = daysLeft < 0
      ? "Expired — remove from stock immediately"
      : daysLeft <= 30
        ? `Expiring in ${daysLeft} day(s) — ${formatDate(med.expiryDate)}`
        : `Valid until ${formatDate(med.expiryDate)}`;

    return `**${med.name}**\n\n• Type: ${med.type}\n• Manufacturer: ${med.manufacturer}\n• Category: ${med.category}\n• Uses: ${med.uses.join(", ")}\n• Description: ${med.description}\n\nSTOCK STATUS:\n• Quantity: ${med.quantity} ${med.unitType}s — ${stockStatus}\n• Expiry: ${expiryNote}`;
  },

  DOC_DETAIL({ doc }) {
    const assignedCamps = data.camps.filter(c => c.doctor === doc.name);
    const campLines = assignedCamps.length
      ? assignedCamps.map(c => `• ${c.name} (${c.status})`).join("\n")
      : "• No camps assigned";

    return `**${doc.name}**\n\n• Specialisation: ${doc.specialisation}\n• Experience: ${doc.experience} years\n• Phone: ${doc.phone}\n• Email: ${doc.email}\n\nASSIGNED CAMPS (${assignedCamps.length}):\n${campLines}`;
  },

  CAMP_DETAIL({ camp }) {
    const meds  = camp.medicines.join(", ");
    const stats = camp.status === "completed"
      ? `\n\nCAMP RESULTS:\n• Total patients: ${fmt(camp.totalPeople)}\n• Minor cases: ${fmt(camp.minorCases)}\n• Major cases: ${fmt(camp.majorCases)}\n• Success rate: ${fmt(camp.successRate)}%`
      : "";

    return `**${camp.name}**\n\n• Location: ${camp.location}\n• Date: ${formatDate(camp.date)}\n• Status: ${camp.status === "upcoming" ? "Upcoming" : "Completed"}\n• Doctor: ${camp.doctor}\n• Medicines: ${meds}\n• Description: ${camp.description}${stats}`;
  },

  UNKNOWN() {
    return `I wasn't able to understand that query. Here are some things I can help with:\n\n• "Which medicines are low on stock?"\n• "List upcoming camps"\n• "Show camp reports"\n• "Who are the registered doctors?"\n• "Give me a dashboard summary"\n• "Which medicines are expiring soon?"\n\nType **help** for a complete list of available queries.`;
  },
};

/* ── main exported function ──────────────────────────────── */
function getReply(message) {
  const intent = detectIntent(message);

  if (typeof intent === "object") {
    const builder = builders[intent.intent];
    return builder ? builder(intent) : builders.UNKNOWN();
  }

  const builder = builders[intent];
  return builder ? builder() : builders.UNKNOWN();
}

module.exports = { getReply };