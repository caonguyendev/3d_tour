let timer1, timer2;
const newMapSelectedFloor = () =>
  new Map()
    .set(HotspotConst.FLOORS.FLOOR_1, "transition_to_floorplan1();")
    .set(HotspotConst.FLOORS.FLOOR_2, "transition_to_floorplan2();")
    .set(HotspotConst.FLOORS.ALL_FLOOR, "transition_to_floorplan();");

const newMapSelectedDollHouseFloor = () =>
  new Map()
    .set(HotspotConst.FLOORS.FLOOR_1, "transition_to_dh1();")
    .set(HotspotConst.FLOORS.FLOOR_2, "transition_to_dh2();")
    .set(HotspotConst.FLOORS.ALL_FLOOR, "transition_to_dh();");

const newMapPathsToObj = new Map()
  .set(0, "dollhouse/floor1.obj")
  .set(1, "dollhouse/floor2.obj");

export const listHotspotNotOnFloor = [
  "hotspot22",
  "hotspot23",
  "hotspot24",
  "hotspot25",
  "hotspot26",
];
export const hotspotList = [];
export const hotspotListOnFloor = [];

export function preloadData() {
  // Fetch json data
  fetch("./data/hotspotData.json")
    .then((response) => response.json())
    .then((data) => {
      hotspotList.push(...data);
    });

  // Preload obj file
  // newMapPathsToObj.forEach((path) => {
  //   loadObjFile(path);
  // });
}

export function loadObjFile(path) {
  const objLoader = OBJLoader();
  // Load the OBJ model
  objLoader.load(
    `${path}`,
    () => null,
    () => null,
    (error) => {
      // Called if an error occurs during loading
      console.error("An error happened", error);
    }
  );
}

export function progressBar(progressVal, totalPercentageVal = 100) {
  var strokeVal = (4.64 * 100) / totalPercentageVal;
  var x = $(".progress-circle-prog");
  x.style.strokeDasharray = `${progressVal * strokeVal} 999`;
}

export function getNearbyPanoImages(
  hotspotName,
  hotspots,
  panoImages,
  isPreload
) {
  // Get the destination hotspot using the provided hotspotName
  const desHotspot = krpano.hotspot.getItem(hotspotName);

  // Map and add the field "distance" to all hotspots
  // The distance is calculated using the Euclidean distance formula
  hotspots = hotspots.map((hotspot) => {
    const { tx, ty, tz } = hotspot;
    const distance = Math.sqrt(
      Math.pow(desHotspot.tx - parseFloat(tx), 2) +
        Math.pow(desHotspot.ty - parseFloat(ty), 2) +
        Math.pow(desHotspot.tz - parseFloat(tz), 2)
    );

    return {
      ...hotspot,
      distance,
    };
  });

  // Array of hotspots sorted by distance
  hotspots = hotspots.sort((a, b) => a.distance - b.distance);

  // Create a map to store the indices of objArray elements
  const objArrayIndexMap = new Map(
    hotspots.map((obj, index) => [obj.id, index])
  );

  // Sort the panoImages based on the order of hotspots
  panoImages.sort((a, b) => {
    const idA = a.match(/\d+/)[0]; // Extract numeric part from the string
    const idB = b.match(/\d+/)[0];

    const indexA = objArrayIndexMap.get(idA);
    const indexB = objArrayIndexMap.get(idB);

    return indexA - indexB;
  });

  // Calculate the initial splitIndex based on a percentage of panoImages length,
  // rounded up to the nearest integer. Ensure a minimum value of 10.
  const IMAGES_PER_SCENE = 7;
  const MINIMUM_IMAGE_NUMBER = 14;
  const percentage = isPreload ? 0.3 : 0.005;
  const initialSplitIndex = Math.ceil(panoImages.length * percentage);
  let splitIndex = Math.max(initialSplitIndex, MINIMUM_IMAGE_NUMBER);

  // Ensure splitIndex is divisible by IMAGES_PER_SCENE
  const remainder = splitIndex % IMAGES_PER_SCENE;
  if (remainder !== 0) {
    // Adjust splitIndex to make it divisible by IMAGES_PER_SCENE
    splitIndex += IMAGES_PER_SCENE - remainder;
  }

  // Get the first seven elements
  const firstSeven = panoImages.slice(0, IMAGES_PER_SCENE);

  // Get the next x% of the array
  const nextXPercent = panoImages.slice(
    IMAGES_PER_SCENE,
    IMAGES_PER_SCENE + splitIndex
  );

  // Concatenate and return the first seven elements and the next x% of the array
  return firstSeven.concat(nextXPercent);
}

export function findNearestHotspotOnSelectedFloor(
  currentHotspot,
  allHotspotOnSelectedFloor
) {
  const { tx: currentTx, ty: currentTy, tz: currentTz } = currentHotspot;
  let nearestHotspot = null;
  let nearestDistance = Infinity;

  for (const hotspot of allHotspotOnSelectedFloor) {
    const { tx, ty, tz } = hotspot;
    const distance = Math.sqrt(
      Math.pow(currentTx - parseFloat(tx), 2) +
        Math.pow(currentTy - parseFloat(ty), 2) +
        Math.pow(currentTz - parseFloat(tz), 2)
    );

    if (distance < nearestDistance) {
      nearestDistance = distance;
      nearestHotspot = hotspot;
    }
  }

  return nearestHotspot;
}

export function loadFloorSceneBySelectedFloor(isDollHouse = false) {
  const activeFloor = $(".floor-select-item.active");
  if (!activeFloor) {
    krpano.call(
      isDollHouse
        ? newMapSelectedDollHouseFloor().get(HotspotConst.FLOORS.ALL_FLOOR)
        : newMapSelectedFloor().get(HotspotConst.FLOORS.ALL_FLOOR)
    );
    return;
  }
  const activeFloorName = activeFloor.getAttribute("name");

  $(".floor-container")?.classList.toggle(
    "hide",
    activeFloorName == HotspotConst.FLOORS.ALL_FLOOR
  );
  $(".floor-container .floor-name").innerHTML = activeFloor.textContent;

  krpano.call(
    isDollHouse
      ? newMapSelectedDollHouseFloor().get(activeFloorName)
      : newMapSelectedFloor().get(activeFloorName)
  );
}

export function checkPopupStatusAndToggleTooltip() {
  const floorSelectBoxElementClassList = $(".floorselect-box-ui")?.classList;
  if (floorSelectBoxElementClassList) {
    if (!floorSelectBoxElementClassList.contains("hide")) {
      $(".btn-select-floor .pseudo-tooltip-wrapper").classList.add("hide");
    } else {
      $(".btn-select-floor .pseudo-tooltip-wrapper").classList.remove("hide");
    }
  }

  if (!$(".settings-tooltip").classList.contains("hide")) {
    $(".item-settings-svg.pseudo-tooltip-wrapper").classList.add("hide");
  } else {
    $(".item-settings-svg.pseudo-tooltip-wrapper").classList.remove("hide");
  }

  if ($(".modal-share-container").classList.contains("oepn")) {
    $(".btn-share > .pseudo-tooltip-wrapper").classList.add("hide");
  } else {
    $(".btn-share > .pseudo-tooltip-wrapper").classList.remove("hide");
  }
}

export function changeFloorSelectStyle() {
  const btnSelectFloorClassList = $(".floorselect-box-ui")?.classList;
  if (!btnSelectFloorClassList) return;
  const currentActiveFloorName = hotspotList.find(
    (hotspot) => hotspot.scene == krpano.prevscene
  )?.floor;

  if (!btnSelectFloorClassList.contains("hide")) {
    btnSelectFloorClassList.add("hide");
  }
  Array.from(document.querySelectorAll(".floor-select-item")).forEach((el) =>
    el.classList.remove("active")
  );
  $(`.floor-select-item[name=${currentActiveFloorName}]`).classList.add(
    "active"
  );
  $(".floor-select-item:nth-child(2)").classList.add("border-radius");
  $(".floor-select-item[name='all_floor']").classList.add("hide");
}

export function handleOnClickExplore3D(fromOverlayHome = false) {
  loadPanoScene(krpano.prevscene, fromOverlayHome);

  // hide explore 3d icon & show dollhouse icon & show floor plan
  $(".btn-explore-3d-space").classList.add("hide");
  $(".btn-dollhouse").classList.remove("hide");
  $(".btn-floorplan").classList.remove("hide");
  showLabelHotspot(false);
}

export function handleOnClickDollhouse() {
  const btnSelectFloorClassList = $(".floorselect-box-ui")?.classList;

  if (btnSelectFloorClassList && !btnSelectFloorClassList.contains("hide")) {
    btnSelectFloorClassList.add("hide");
  }
  loadFloorSceneBySelectedFloor(true);

  btnSelectFloorClassList &&
    $(".floor-select-item:nth-child(2)").classList.remove("border-radius");
  btnSelectFloorClassList &&
    $(".floor-select-item[name='all_floor']").classList.remove("hide");
  // hide dollhouse icon, show explore and floor plan
  $(".btn-dollhouse").classList.toggle("hide");
  $(".btn-explore-3d-space").classList.remove("hide");
  $(".btn-floorplan").classList.remove("hide");

  // show hotspot when view dollhouse
  showLabelHotspot();
}

export function handleOnClickFloorplan() {
  const btnSelectFloorClassList = $(".floorselect-box-ui")?.classList;

  if (btnSelectFloorClassList && !btnSelectFloorClassList.contains("hide")) {
    btnSelectFloorClassList.add("hide");
  }
  loadFloorSceneBySelectedFloor();

  btnSelectFloorClassList &&
    $(".floor-select-item:nth-child(2)").classList.remove("border-radius");
  btnSelectFloorClassList &&
    $(".floor-select-item[name='all_floor']").classList.remove("hide");
  // hide floor plan icon, show explore 3d icon & show dollhouse icon at position of floor plan
  $(".btn-dollhouse").classList.remove("hide");
  $(".btn-explore-3d-space").classList.remove("hide");
  $(".btn-floorplan").classList.add("hide");

  // show hotspot when view floorplan
  showLabelHotspot();
}

export function checkAndHideDropdownSelectFloorAndSettings() {
  const floorSelectBoxElement = $(".floorselect-box-ui");
  const settingsTooltipElement = $(".settings-tooltip");

  if (
    floorSelectBoxElement &&
    !floorSelectBoxElement.classList.contains("hide")
  ) {
    floorSelectBoxElement.classList.add("hide");
  }
  if (!settingsTooltipElement.classList.contains("hide")) {
    settingsTooltipElement.classList.add("hide");
  }
  checkPopupStatusAndToggleTooltip();
}

export function toggleMeasurement() {
  const locationElementClassList = $(".location").classList;
  const sidebarElementClasslist = $(".sidebar").classList;
  const iconElement = $(".btn-toggle-measure > i.fa-plus");
  const wrapperCarouselElementClassList = $(".wrapper-carousel")?.classList;
  const highlightContainerElementClassList = $(
    ".highlight-container"
  )?.classList;
  const footerLeftElementClassList = $(".footer-left").classList;
  const footerRightElementClassList = $(".footer-right").classList;
  const toggleFooterRightElementClassList = $(".toggle-footer-right").classList;
  const floorPlanButtonContainer = $(".floorplan-button-container");
  const btnRulerElement = $(".btn-ruler");

  // In Measurement Mode
  if (iconElement.classList.contains("fa-rotate-45")) {
    krpano.depthmap_measure3d_loop = false;
    krpano.events.onclick = null;
    loadCursorHotspotStyle();
    iconElement.classList.remove("fa-rotate-45");
  }
  checkAndHideDropdownSelectFloorAndSettings();
  krpano.hotspot
    .getArray()
    .filter((i) => i.style?.includes("depthmap_measure3d_"))
    .forEach((i) => (i.visible = !i.visible));

  locationElementClassList.toggle("hide");
  btnRulerElement.classList.toggle("active");
  footerRightElementClassList.toggle("hide");
  $(".overlay").classList.toggle("hide");
  $(".measure-menu-top-right").classList.toggle("hide");
  $(".footer-bottom").classList.toggle("hide");
  $(".btn-toggle-measure").classList.toggle("hide");

  // Click open measurement
  if (btnRulerElement.classList.contains("active")) {
    showHotspotsInCurrentScene(false);
    floorPlanButtonContainer && showFloorplan(false);
    highlightContainerElementClassList.add("hide");
    toggleFooterRightElementClassList.add("hide");
    footerRightElementClassList.remove("show-small-mobile");
    // if sidebar currently showing
    if (!sidebarElementClasslist.contains("hide")) {
      sidebarElementClasslist.add("hide");
      $(".sidebar-container").classList.add("hide");
      locationElementClassList.add("hide");
    }
    // if carousel slider currently showing
    if (
      wrapperCarouselElementClassList &&
      !wrapperCarouselElementClassList.contains("hide")
    ) {
      toggleFooterRightElementClassList.add("bottom");
      footerLeftElementClassList.add("bottom");
      footerRightElementClassList.add("bottom");
      wrapperCarouselElementClassList.add("hide", "temporary_closed");
    }
  } else {
    showHotspotsInCurrentScene();
    floorPlanButtonContainer && showFloorplan();
    highlightContainerElementClassList.remove("hide");
    toggleFooterRightElementClassList.remove("hide");
    if (
      wrapperCarouselElementClassList &&
      wrapperCarouselElementClassList.contains("temporary_closed")
    ) {
      footerLeftElementClassList.remove("bottom");
      footerRightElementClassList.remove("bottom");
      toggleFooterRightElementClassList.remove("bottom");
      wrapperCarouselElementClassList.remove("hide", "temporary_closed");
    }
  }
}

export function handleOnClickRuler() {
  toggleMeasurement();
}

export function handleClickStartAndStopMeasure() {
  const isClickStopMeasurement = $(
    ".btn-toggle-measure > i.fa-plus.fa-rotate-45"
  );
  if (isClickStopMeasurement) {
    krpano.depthmap_measure3d_loop = false;
    krpano.events.onclick = null;
    loadCursorHotspotStyle();
  } else {
    loadCursorHotspotStyle(false);
    krpano.call("depthmap_measure3d_start();");
    krpano.call(
      "depthmap_measure3d_showinfo('Click anywhere to add points and draw lines.');"
    );
  }
  $(".btn-toggle-measure > i.fa-plus").classList.toggle("fa-rotate-45");
}

export function handleClickCloseButtonInMeasurement() {
  toggleMeasurement();
}

export function handleClickSettingsButtonInMeasurement() {
  if (!$(".settings-tooltip").classList.contains("hide")) {
    $(".item.pseudo-tooltip-wrapper").classList.remove("hide");
  } else {
    $(".item.pseudo-tooltip-wrapper").classList.add("hide");
  }
  $(".settings-tooltip").classList.toggle("hide");
}

export function handleToggleFullScreen(e) {
  const btnFullscreenElement = $(".btn-fullscreen");
  const btnExitFullscreenElement = $(".btn-exit-fullscreen");

  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
  } else if (document.exitFullscreen) {
    document.exitFullscreen();
  }
  if (e.currentTarget.classList.contains("btn-fullscreen")) {
    btnFullscreenElement.classList.add("hide");
    btnExitFullscreenElement.classList.remove("hide");
  } else {
    btnFullscreenElement.classList.remove("hide");
    btnExitFullscreenElement.classList.add("hide");
  }
}

export function handleMouseUp(btnName) {
  if (btnName == "up") {
    krpano.set("walkaround.up", 0);
    return;
  }
  krpano.set("walkaround.down", 0);
}

export function handleMouseDown(btnName) {
  if (btnName == "up") {
    krpano.set("walkaround.up", 1);
    return;
  }
  krpano.set("walkaround.down", 1);
}

export function handleToggleFooterRight() {
  $(".footer-right").classList.toggle("show-small-mobile");
}

export function toggleBackgroundMusic() {
  $(".btn-open-background-music").classList.toggle("hide");
  $(".btn-mute-background-music").classList.toggle("active");
  $(".btn-mute-background-music").classList.toggle("hide");
  krpano.togglesound("bgmusic");
}

export function handleClickShareButton() {
  const tourCompletePopupElement = $(".tour-complete-container");
  const floorPlanButtonContainer = $(".floorplan-button-container");

  $(".modal-share-container").classList.add("open");
  floorPlanButtonContainer && showFloorplan(false);
  tourCompletePopupElement && handleCloseTourCompletePopup();
  checkAndHideDropdownSelectFloorAndSettings();
}

export function handleClickViewVR() {
  if (krpano?.xml?.scene.includes(SceneConst.SCENE_PANO_TEMPLATE)) {
    loadCursorHotspotStyle(false);
    krpano.webvr.entervr();
  } else {
    const toast = $(".toast");
    const progress = $(".toast .progress");

    toast.classList.add("active");
    progress.classList.add("active");

    timer1 = setTimeout(() => {
      toast.classList.remove("active");
    }, 5000);

    timer2 = setTimeout(() => {
      progress.classList.remove("active");
    }, 5300);
  }
}

export function openTab(evt, tabName) {
  let tabContent = document.getElementsByClassName("tabcontent");
  let tabHelpLength = tabContent.length;
  for (let i = 0; i < tabHelpLength; i++) {
    tabContent[i].style.display =
      tabContent[i].id === tabName ? "block" : "none";
  }
  let tabHelp = document.getElementsByClassName("btn-tab");
  let tabActiveHelp = tabHelp.length;
  for (let j = 0; j < tabActiveHelp; j++) {
    tabHelp[j].classList.remove("active");
  }
  evt.currentTarget.classList.add("active");
}

export function hanldeClickCloseToast() {
  const toast = $(".toast");
  const progress = $(".toast .progress");

  toast.classList.remove("active");

  setTimeout(() => {
    progress.classList.remove("active");
  }, 300);

  clearTimeout(timer1);
  clearTimeout(timer2);
}

export function handleCloseShareModal() {
  const floorPlanButtonContainer = $(".floorplan-button-container");
  $(".modal-share-container").classList.remove("open");
  floorPlanButtonContainer && showFloorplan();
}

export function handleClickCloseOnShareModal() {
  handleCloseShareModal();
}

export function handleClickOutsiteShareModal(event) {
  if (event.target.classList.contains("modal-background")) {
    handleCloseShareModal();
  }
}

export function handleClickHelpButton() {
  $(".modal-help-container").classList.add("open");
  checkAndHideDropdownSelectFloorAndSettings();
}

export function handleCloseHelpModal() {
  $(".modal-help-container").classList.remove("open");
}

export function handleClickCloseOnHelpModal() {
  handleCloseHelpModal();
}

export function handleClickOutsiteHelpModal(event) {
  if (event.target.classList.contains("modal-background")) {
    handleCloseHelpModal();
  }
}

export function showAllNonVrElement(isShow = true) {
  const locationElement = $(".location");
  const footerLeftElement = $(".footer-left");
  const footerRightElement = $(".footer-right");
  const footerBottomElement = $(".footer-bottom");
  const wrapperCarouselElement = $(".wrapper-carousel");
  const btnRulerElement = $(".btn-ruler");

  if (isShow) {
    if ($(".sidebar").classList.contains("hide")) {
      locationElement.classList.remove("hide");
    }
    footerLeftElement.classList.remove("hide");
    footerRightElement.classList.remove("hide");
    footerBottomElement.classList.remove("hide");
    if (!footerLeftElement.classList.contains("bottom")) {
      wrapperCarouselElement?.classList.remove("hide");
    }
    return;
  }
  locationElement.classList.add("hide");
  footerLeftElement.classList.add("hide");
  footerRightElement.classList.add("hide");
  footerBottomElement.classList.add("hide");
  wrapperCarouselElement?.classList.add("hide");
  if (btnRulerElement.classList.contains("active")) {
    btnRulerElement.click();
  }
}

export function handleClickHelp() {
  const footerLeft = $(".footer-left");
  const footerRight = $(".footer-right");
  const footerBottom = $(".footer-bottom");
  const footerLocation = $(".location");
  const helpModal = $(".help-modal");
  const tourCompletePopupElement = $(".tour-complete-container");
  const floorPlanButtonContainer = $(".floorplan-button-container");

  footerBottom.classList.add("hide");
  footerLeft.classList.add("hide");
  footerRight.classList.add("hide");
  footerLocation.classList.add("hide");

  helpModal.classList.remove("hide");

  floorPlanButtonContainer && showFloorplan(false);
  tourCompletePopupElement && handleCloseTourCompletePopup();
}

export function handleClickCloseHelp() {
  const footerLeft = $(".footer-left");
  const footerRight = $(".footer-right");
  const footerBottom = $(".footer-bottom");
  const footerLocation = $(".location");
  const helpModal = $(".help-modal");
  const floorPlanButtonContainer = $(".floorplan-button-container");

  footerLeft.classList.remove("hide");
  footerRight.classList.remove("hide");
  footerBottom.classList.remove("hide");
  footerLocation.classList.remove("hide");
  helpModal.classList.add("hide");

  floorPlanButtonContainer && showFloorplan();
}
