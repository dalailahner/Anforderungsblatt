import type { Template } from "@pdfme/common";
import { text, svg } from "@pdfme/schemas";
import { generate } from "@pdfme/generator";
import PDFtemplate from "../public/PDFtemplate.json";
import { easepick } from "@easepick/core";
import { KbdPlugin } from "@easepick/kbd-plugin";
import { RangePlugin } from "@easepick/range-plugin";
import { LockPlugin } from "@easepick/lock-plugin";

const Form: any = document.getElementsByTagName("FORM")[0];
const checkmark: string =
  "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 50 50'><path d='M49.3 5.9a111 111 0 0 0-27.5 39.7 3.5 3.5 0 0 1-6.2.4C11.3 39 7 34.2 1 29c-1.3-1-1.3-3-.1-4.2.9-.8 2.2-1 3.3-.4 3 1.6 9.2 5.2 14.1 10.9 0 0 6.8-16.6 28.4-32.6a2 2 0 0 1 2.5 3.2Z' style='fill:#191919'/></svg>";

const Targets = new Map<string, any>([
  ["displayCont", document.querySelector("#displayCont")],
  ["displayWM", document.querySelector("#displayWM")],
  ["googleAdsWM", document.querySelector("#googleAdsWM")],
  ["socialWM", document.querySelector("#socialWM")],
]);

const EasepickObj = new easepick.create({
  element: Form.laufzeit,
  css: ["https://cdn.jsdelivr.net/npm/@easepick/bundle@1.2.1/dist/index.css"],
  zIndex: 0,
  readonly: false,
  RangePlugin: {
    locale: {
      one: "Tag",
      other: "Tage",
    },
  },
  LockPlugin: {
    minDate: Date.now(),
  },
  plugins: [RangePlugin, LockPlugin, KbdPlugin],
});

Form.addEventListener("change", () => {
  if (Form.displaySN.checked || Form.displayS24.checked || Form.googleAds.checked) {
    Targets.get("displayCont").style.display = "block";
  } else {
    Targets.get("displayCont").style.display = "none";
  }
  if (Form.displaySN.checked || Form.displayS24.checked) {
    Targets.get("displayWM").style.display = "block";
  } else {
    Targets.get("displayWM").style.display = "none";
  }
  if (Form.googleAds.checked) {
    Targets.get("googleAdsWM").style.display = "block";
  } else {
    Targets.get("googleAdsWM").style.display = "none";
  }
  if (Form.social.checked) {
    Targets.get("socialWM").style.display = "block";
  } else {
    Targets.get("socialWM").style.display = "none";
  }
});

document.querySelector("#generatePDF")?.addEventListener("click", () => {
  if (Form.checkValidity()) {
    generatePDF();
  } else {
    Form.reportValidity();
  }
});

async function generatePDF() {
  const template: Template = PDFtemplate;
  const plugins = { text, svg };
  const inputs = [
    {
      kampagnenname: Form.kampagnenname.value,
      laufzeit: Form.laufzeit.value,
      budget: Form.budget.value,
      zielurl: Form.zielurl.value,
      utmcampaign: Form.utmcampaign.value,
      kanal: Form.kanal.value,
      sonstiges: Form.sonstiges.value,
      displaySN: Form.displaySN.checked ? checkmark : "",
      displayS24: Form.displayS24.checked ? checkmark : "",
      googleAds: Form.googleAds.checked ? checkmark : "",
      meta: Form.meta.checked ? checkmark : "",
      tiktok: Form.tiktok.checked ? checkmark : "",
      linkedin: Form.linkedin.checked ? checkmark : "",
      nlFreizeit: Form.nlFreizeit.checked ? checkmark : "",
      nlAktionen: Form.nlAktionen.checked ? checkmark : "",
      albus: Form.albus.checked ? checkmark : "",
      MR: Form.MR.checked ? checkmark : "",
      BB: Form.BB.checked ? checkmark : "",
      HPA: Form.HPA.checked ? checkmark : "",
      SL: Form.SL.checked ? checkmark : "",
      gMR: Form.gMR.checked ? checkmark : "",
      gLB: Form.gLB.checked ? checkmark : "",
      gSS: Form.gSS.checked ? checkmark : "",
      gPM: Form.gPM.checked ? checkmark : "",
      adText: Form.adText.value,
    },
  ];

  const pdf = await generate({ template, plugins, inputs });

  const blob = new Blob([pdf.buffer], { type: "application/pdf" });

  window.open(URL.createObjectURL(blob));
}
