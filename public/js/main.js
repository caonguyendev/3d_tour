import * as CONSTANTS from "./constants/index.js";
import * as COMMON from "./common.js";
import * as Footer from "./footer.js";
import * as Home from "./home.js";
import * as Floorplan2D from "./floorplan2D.js";
import * as HotspotIndex from "./hotspot/index.js";
import * as HotspotImage from "./hotspot/image.js";
import * as HotspotLabel from "./hotspot/label.js";
import * as HotspotVideo from "./hotspot/video.js";
import * as HotspotTag from "./hotspot/tag.js";
import * as HotspotNote from "./hotspot/note.js";
import * as SelectFloor from "./select-floor.js";
import * as Autotour from "./autotour.js";
import { getSidebarHTML, renderSidebar } from "./sidebar.js";

window.$ = document.querySelector.bind(document);

/* Common */
// embedpano({
//   xml: "tour.xml",
//   target: "pano",
//   passQueryParameters: "startscene,startlookat",
//   consolelog: true,
// });
window.krpano = $("#krpanoSWFObject").get("global");
COMMON.addModuleToWindowGlobal(COMMON);

/* Constants */
COMMON.addModuleToWindowGlobal(CONSTANTS);

/* Sidebar */
const panoElement = $("#krpano");
panoElement.insertAdjacentHTML("afterbegin", getSidebarHTML());
renderSidebar();

/* Footer */
Footer.preloadData();
addModuleToWindowGlobal(Footer);

// /* Home */
const krpanoElement = $("#krpanoSWFObject");
krpanoElement.insertAdjacentHTML(
  "beforeend",
  Home.getfooterHTML(CONSTANTS.ImageConst)
);
addModuleToWindowGlobal(Home);

// /* Floorplan2D */
// $(".btn-toggle-measure").insertAdjacentHTML(
//   "afterend",
//   Floorplan2D.getFloorPlanButtonContainerHTML(CONSTANTS.ImageConst),
// );
// addModuleToWindowGlobal(Floorplan2D);

/* HotspotIndex */
addModuleToWindowGlobal(HotspotIndex);
HotspotIndex.insertHTMLTemplates();

/* HotspotImage */
addModuleToWindowGlobal(HotspotImage);

/* HotspotLabel */
addModuleToWindowGlobal(HotspotLabel);

/* HotspotVideo */
addModuleToWindowGlobal(HotspotVideo);

/* HotspotTag */
addModuleToWindowGlobal(HotspotTag);

/* HotspotNote */
addModuleToWindowGlobal(HotspotNote);

// /* SelectFloor */
// $(".footer-left").insertAdjacentHTML("beforebegin", SelectFloor.floorContainerHTML);
// $(".btn-floorplan").insertAdjacentHTML("afterend", SelectFloor.getSelectFloorHTML(CONSTANTS.ImageConst));
// addModuleToWindowGlobal(SelectFloor);

// /* Autotour */
// $(".footer-left").insertAdjacentHTML("afterbegin", Autotour.getAutotourHTML(CONSTANTS.ImageConst));
// $(".footer-bottom").insertAdjacentHTML(
//   "beforebegin",
//   Autotour.getWrapperCarouselAndTourCompleteHTML(CONSTANTS.ImageConst),
// );
// addModuleToWindowGlobal(Autotour);
// Autotour.fetchHighlight();
// Autotour.assignEventClickToCarouselItems();
// Autotour.draggableImageSlide();

/* Add Event Listener */
// Disable right-click
document.addEventListener("contextmenu", (e) => e.preventDefault());

// Remove drag ghost image
document.addEventListener(
  "dragstart",
  function (event) {
    event.dataTransfer.setDragImage(
      event.target,
      window.outerWidth,
      window.outerHeight
    );
  },
  false
);

document.onkeydown = (event) => {
  // Disable F12, Ctrl + Shift + I, Ctrl + Shift + J, Ctrl + U
  if (
    event.keyCode === 123 ||
    ctrlShiftKey(event, "I") ||
    ctrlShiftKey(event, "J") ||
    ctrlShiftKey(event, "C") ||
    (event.ctrlKey && event.keyCode === "U".charCodeAt(0))
  )
    return false;

  const footerLeftShowing = !$(".footer-left").classList.contains("hide");
  const actionsContainerShowing =
    !$(".actions-container").classList.contains("hide");

  const tagName = event.target.tagName;
  // Check if the event target is an input or textarea
  if (tagName === TagConst.INPUT || tagName === TagConst.TEXTAREA) {
    // Do nothing if the event is from an input or textarea
    return;
  }

  switch (event.keyCode) {
    // Press Esc
    case 27:
      $(".icon-add-label").classList.remove("fa-rotate-45");
      handleOnPressEsc();
      break;
    // Press 1
    case 49:
    case 97:
      !$(".btn-explore-3d-space").classList.contains("hide") &&
        footerLeftShowing &&
        actionsContainerShowing &&
        handleOnClickExplore3D();
      break;
    // Press 2
    case 50:
    case 98:
      !$(".btn-dollhouse").classList.contains("hide") &&
        footerLeftShowing &&
        actionsContainerShowing &&
        handleOnClickDollhouse();
      break;
    // Press 3
    case 51:
    case 99:
      !$(".btn-floorplan").classList.contains("hide") &&
        footerLeftShowing &&
        actionsContainerShowing &&
        handleOnClickFloorplan();
      break;
    // Press M
    case 77:
      footerLeftShowing && actionsContainerShowing && toggleBackgroundMusic();
      break;
    default:
      break;
  }
};

document.addEventListener("DOMContentLoaded", function () {
  const wrapperCarouselElement = $(".wrapper-carousel");
  if (!wrapperCarouselElement) {
    $(".footer-left").classList.add("bottom", "left-42px");
    $(".footer-right").classList.add("bottom");
    $(".toggle-footer-right").classList.add("bottom");
  }

  const inputElement = $(".input-coppy");
  const url = window.location.href;

  addMetaTag("og:url", url);
  addMetaTag("og:title", CONSTANTS.PAGE_TITLE);
  addMetaTag("og:description", CONSTANTS.PAGE_DESCRIPTION);
  addMetaTag("twitter:image", CONSTANTS.THUMBNAIL_URL);
  addMetaTag("twitter:card", "summary");
  addMetaTag("twitter:domain", url);
  addMetaTag("twitter:title", CONSTANTS.PAGE_TITLE);
  addMetaTag("twitter:description", CONSTANTS.PAGE_DESCRIPTION);

  const fb = $(".facebook");
  fb.addEventListener("click", () =>
    openPopupSocialMedia(`${CONSTANTS.FACEBOOK_URL}?display=popup&u=${url}`)
  );

  const twitter = $(".twitter");
  twitter.addEventListener("click", () =>
    openPopupSocialMedia(
      `${CONSTANTS.TWITTER_URL}?text=${CONSTANTS.PAGE_TITLE} at&url=${url} with&hashTags=${CONSTANTS.HASH_TAGS}`
    )
  );

  const linkedIn = $(".linkedin");
  linkedIn.addEventListener("click", () =>
    openPopupSocialMedia(`${CONSTANTS.LINKEDIN_URL}?url=${url}`)
  );

  const pinterest = $(".pinterest");
  pinterest.addEventListener("click", () =>
    openPopupSocialMedia(
      `${CONSTANTS.PINTEREST_URL}?url=${url}&media=${url}${CONSTANTS.THUMBNAIL_URL}`
    )
  );

  const gmail = $(".gmail");
  gmail.href = `mailto:?subject=${CONSTANTS.PAGE_TITLE}&body=${CONSTANTS.PAGE_TITLE} at ${url}`;

  // Automatically select the "Navigation" tab when uploading to a website
  let navigationTab = $(".btn-tab.navigation-tab");
  if (navigationTab) {
    navigationTab.click();
  }

  // Đặt giá trị địa chỉ URL vào input
  inputElement.value = url;

  const copyButtonElement = $(".btn-copy");
  copyButtonElement.addEventListener("click", function () {
    inputElement.select();
    document.execCommand("copy");
    // Bỏ chọn nội dung
    window.getSelection().removeAllRanges();

    // Thay đổi nội dung của data-title thành "Copied"
    copyButtonElement.setAttribute("data-title", "Copied!");

    // Sau 3 giây, đặt lại nội dung của data-title thành "Copy URL"
    setTimeout(() => {
      copyButtonElement.setAttribute("data-title", "Copy URL");
    }, 3000);
  });
});
