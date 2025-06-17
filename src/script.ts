import type { Template } from "@pdfme/common";
import { text, svg } from "@pdfme/schemas";
import { generate } from "@pdfme/generator";
import PDFtemplate from "./PDFtemplate.json";
import { easepick } from "@easepick/core";
import { KbdPlugin } from "@easepick/kbd-plugin";
import { RangePlugin } from "@easepick/range-plugin";
import { LockPlugin } from "@easepick/lock-plugin";

const Form = document?.getElementsByTagName("FORM")[0] as HTMLFormElement;
const checkmark: string =
  "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 50 50'><path d='M49.3 5.9a111 111 0 0 0-27.5 39.7 3.5 3.5 0 0 1-6.2.4C11.3 39 7 34.2 1 29c-1.3-1-1.3-3-.1-4.2.9-.8 2.2-1 3.3-.4 3 1.6 9.2 5.2 14.1 10.9 0 0 6.8-16.6 28.4-32.6a2 2 0 0 1 2.5 3.2Z' style='fill:#191919'/></svg>";

const Targets = new Map<string, HTMLElement | null>([
  ["displayCont", document?.querySelector("#displayCont")],
  ["displayWM", document?.querySelector("#displayWM")],
  ["googleAdsWM", document?.querySelector("#googleAdsWM")],
  ["socialWM", document?.querySelector("#socialWM")],
  ["newsletterCont", document?.querySelector("#newsletterCont")],
  ["newsletterPost", document?.querySelector("#newsletterPost")],
  ["newsletterBanner", document?.querySelector("#newsletterBanner")],
]);

const EasepickObj = new easepick.create({
  element: Form?.laufzeit,
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

///////////
// EVENTS:

window.addEventListener("load", () => {
  // fix the easepickIcon position
  const easepickIcon: HTMLSpanElement | null = document?.querySelector('.inputGroup:has(input[name="laufzeit"]) > span');
  easepickIcon?.removeAttribute("style");
});

Form.addEventListener("change", () => {
  const displaySNCheck: boolean | undefined = Form?.displaySN.checked;
  const displayS24Check: boolean | undefined = Form?.displayS24.checked;
  const googleAdsCheck: boolean | undefined = Form?.googleAds.checked;
  const socialCheck: boolean | undefined = Form?.social.checked;
  const nlPostCheck: boolean | undefined = Form?.nlPost.checked;
  const nlBannerCheck: boolean | undefined = Form?.nlBanner.checked;

  toggleDisplay(Targets?.get("displayCont"), displaySNCheck || displayS24Check || googleAdsCheck);
  toggleDisplay(Targets?.get("displayWM"), displaySNCheck || displayS24Check);
  toggleDisplay(Targets?.get("googleAdsWM"), googleAdsCheck);
  toggleDisplay(Targets?.get("socialWM"), socialCheck);
  toggleDisplay(Targets?.get("newsletterCont"), nlPostCheck || nlBannerCheck);
  toggleDisplay(Targets?.get("newsletterPost"), nlPostCheck);
  toggleDisplay(Targets?.get("newsletterBanner"), nlBannerCheck);
});

document.querySelector("#generatePDF")?.addEventListener("click", () => {
  if (Form.checkValidity()) {
    generatePDF();
  } else {
    Form.reportValidity();
  }
});

//////////////
// FUNCTIONS:

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
      freizeitNlPost: Form.freizeitNlPost.checked ? checkmark : "",
      aktionenangeboteNlPost: Form.aktionenangeboteNlPost.checked ? checkmark : "",
      freizeitNlBanner: Form.freizeitNlBanner.checked ? checkmark : "",
      alleNlBanner: Form.alleNlBanner.checked ? checkmark : "",
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

function toggleDisplay(el: HTMLElement | null | undefined, block: boolean | undefined) {
  if (el && block) {
    el.style.display = "block";
    return;
  }
  if (el && !block) {
    el.style.display = "none";
    return;
  }
  console.error(`${el} is not available`);
}
