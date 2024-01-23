// 1. call api get list image {image_id: 1, url: 'panos/pano1.tiles/pano_r.jpg', scene: "scene_5"}
// 2. xóa mịa numberListNotInHighlights đi
// 3. thêm 1 image vào list image
//  3.1 gửi ảnh lên api
//  3.2 gửi scene dạng object (convert từ xml to js object)
// <scene name="scene_pano25" title="pano25" onstart="" thumburl="panos/pano25.tiles/thumb.jpg" lat="" lng="" alt="" heading="">

// <control bouncinglimits="calc:image.cube ? true : false" />

// <view hlookat="0.0" vlookat="0.0" fovtype="MFOV" fov="90" maxpixelzoom="1.0" limitview="auto" />

// <preview url="panos/pano25.tiles/preview.jpg" />

// <image style="style_pano25">
//   <cube url="panos/pano25.tiles/pano_%s.jpg" />
//   <depthmap url="model/model.depth" enabled="true" rendermode="3dmodel" background="none" scale="100" offset="0.0" subdiv="" encoding="gray" axis="+x+y+z" cull="front" hittest="true" origin="0.44, 2.81, 1.9" align="-0.24|140.2|0.47"/>
// </image>

// </scene>

//  get về thì add scene đó

const numberListNotInHighlights = [7, 9, 11, 15, 19, 21, 27, 30, 34, 36, 39, 41];
const carouselItemsHTML = [];

for (let i = 1; i <= 43; i++) {
  if (!numberListNotInHighlights.includes(i)) {
    carouselItemsHTML.push(
      `<li class="carousel-item" data-scene-name="scene_pano${i}">
      <img src="./panos/pano${i}.tiles/pano_r.jpg" draggable="false">
    </li>`,
    );
  }
}

// Fetch Highlight using LocalStorage

export function fetchHighlight() {
  const listHightLightLocalStorage = getCheckArray(getLocalStorage("listHightlight-VezcYCYdWP7"));
  listHightLightLocalStorage.forEach((item) => {
    carouselItemsHTML.push(
      `<li class="carousel-item" data-scene-name="${item.scene}">
       <img src="${item.url}" draggable="false">
    </li>`,
    );
  });
}

export function getAutotourHTML(obj) {
  return ` 
<div class="highlight-container">
    <div class="btn-arrow" onclick="handleOnClickArrow(event);">
        <span class="pseudo-tooltip-wrapper" data-title="Close">
            <span class="arrow down"></span>
        </span>
    </div>
    <div class="btn-toggle-auto-tour" onclick="toggleAutoTour();">
        <span class="pseudo-tooltip-wrapper btn-play-tour" data-title="Play">
            <img src="${obj.tourControls}" alt="Play Image">
        </span>
        <span class="pseudo-tooltip-wrapper btn-pause-tour hide" data-title="Pause">
            <img src="${obj.pauseAutotourSvgURL}" alt="Pause Image">
        </span>
    </div>
</div>`;
}

export function getWrapperCarouselAndTourCompleteHTML(obj) {
  return `
<div class="wrapper-carousel hide">
  <div class="container">
    <ul class="items">
        ${carouselItemsHTML.join("")}
    </ul>
  </div>
</div>
<div class="tour-complete-container hide">
  <span class="btn-close-tour-complete-popup" onclick="handleCloseTourCompletePopup();"><i class="fa-solid fa-xmark"></i></span>
  <div class="tour-complete-header">
    <h1>Tour complete 
      <div class="subhead">Explore this space on your own</div>
    </h1>
  </div>
  <div class="tour-complete-body">
    <div class="tour-complete-body-item">
      <img src="${obj.helpMouseDragSvg}" >
      <h2>Rotate</h2>
    </div>
    <div class="tour-complete-body-item">
      <img src="${obj.helpMouseMoveSvg}" >
      <h2>Move</h2>
    </div>
    <div class="tour-complete-body-item">
      <img src="${obj.helpMouseZoomSvg}" >
      <h2>Zoom</h2>
    </div>
  </div>
  <div class="tour-complete-footer">
    <div class="btn-restart-tour" onclick="handleRestartAutoTour();">
      Restart Tour
      <i class="fa-solid fa-rotate-right"></i>
    </div>
    <div class="btn-share-tour" onclick="handleClickShareButton();">
      <i class="fa-solid fa-arrow-up-from-bracket"></i>
      Share
    </div>
  </div>
</div>
`;
}

export function assignEventClickToCarouselItems() {
  // Click active image slider
  const carouselItems = document.querySelectorAll(".carousel-item");
  carouselItems.forEach((carouselItem, index) => {
    const delta = 6;
    let startX;
    let startY;

    carouselItem.addEventListener("mousedown", function (event) {
      startX = event.pageX;
      startY = event.pageY;
    });

    carouselItem.addEventListener("mouseup", function (event) {
      const diffX = Math.abs(event.pageX - startX);
      const diffY = Math.abs(event.pageY - startY);

      // Click!
      if (event.button === 0 && diffX < delta && diffY < delta) {
        const btnPauseTour = $(".btn-pause-tour");
        const sceneName = carouselItem.dataset.sceneName;
        handleCloseTourCompletePopup();
        loadAutoTour(sceneName);
        krpano.set("prev_auto_tour_scene", krpano.xml.scene);
        krpano.set("end_auto_tour", false);
        // Pause autotour
        if (btnPauseTour.classList.contains("active")) {
          btnPauseTour.parentNode.click();
        }
        addActiveClassAndCenterCarouselItem(carouselItem);
      }
    });
  });
}

export function draggableImageSlide() {
  let isDown = false;
  let startX;
  let scrollLeft;
  const slider = $(".container");

  const end = () => {
    isDown = false;
    slider.classList.remove("active");
  };

  const start = (e) => {
    isDown = true;
    slider.classList.add("active");
    startX = e.pageX || e.touches[0].pageX - slider.offsetLeft;
    scrollLeft = slider.scrollLeft;
  };

  const move = (e) => {
    if (!isDown) return;

    e.preventDefault();

    const x = e.pageX || e.touches[0].pageX - slider.offsetLeft;
    const walk = (x - startX) * 3; // Adjust the multiplier to control scroll speed
    slider.scrollLeft = scrollLeft - walk;
  };

  (() => {
    slider.addEventListener("mousedown", start);
    slider.addEventListener("touchstart", start);

    slider.addEventListener("mousemove", move);
    slider.addEventListener("touchmove", move);

    slider.addEventListener("mouseleave", end);
    slider.addEventListener("mouseup", end);
    slider.addEventListener("touchend", end);
  })();
}

export function addActiveClassAndCenterCarouselItem(carouselItem) {
  const carouselItems = document.querySelectorAll(".carousel-item");
  const container = $(".container");

  carouselItems.forEach((f) => f.classList.remove("active"));
  carouselItem.classList.add("active");

  // Calculate the scroll position to center the clicked item
  const itemWidth = carouselItem.offsetWidth;
  const containerWidth = container.offsetWidth;
  const itemPosition = carouselItem.offsetLeft;

  const scrollPosition = itemPosition - (containerWidth - itemWidth) / 2;

  // Scroll to the calculated position
  container.scrollLeft = scrollPosition;
}

export function loadAndCenterCarouselItem(sceneName) {
  const carouselItem = $(`.carousel-item[data-scene-name='${sceneName}']`);

  addActiveClassAndCenterCarouselItem(carouselItem);
}

export function handleOnClickArrow() {
  $(".arrow").classList.toggle("up");
  $(".arrow").classList.toggle("down");
  $(".wrapper-carousel").classList.toggle("hide");
  $(".footer-left").classList.toggle("bottom");
  $(".footer-right").classList.toggle("bottom");
  $(".toggle-footer-right").classList.toggle("bottom");
  if ($(".arrow.up")) {
    $(".highlight-container .pseudo-tooltip-wrapper").setAttribute("data-title", "Open Highlights");
  } else {
    $(".highlight-container .pseudo-tooltip-wrapper").setAttribute("data-title", "Close");
  }
}

export function toggleAutoTour() {
  const btnPlayTourClasslist = $(".btn-play-tour").classList;
  const btnPauseTourClasslist = $(".btn-pause-tour").classList;
  const locationClassList = $(".location").classList;
  const actionsContainerClassList = $(".actions-container").classList;

  btnPlayTourClasslist.toggle("hide");
  btnPauseTourClasslist.toggle("hide");
  btnPauseTourClasslist.toggle("active");

  if (btnPlayTourClasslist.contains("hide")) {
    nextScene();
    krpano.set("control.usercontrol", "off");
    showHotspotsInCurrentScene(false);
    loadCursorHotspotStyle(false);
    actionsContainerClassList.add("hide");
    locationClassList.add("hide");

    // hide explore 3d icon & show dollhouse icon & show floor plan
    $(".btn-explore-3d-space").classList.add("hide");
    $(".btn-dollhouse").classList.remove("hide");
    $(".btn-floorplan").classList.remove("hide");
    return;
  }

  pauseScene();
  krpano.set("control.usercontrol", "all");
  showHotspotsInCurrentScene();
  loadCursorHotspotStyle();
  actionsContainerClassList.remove("hide");
  locationClassList.remove("hide");
}

export function handleEndAutotour() {
  $(".btn-toggle-auto-tour").click();
  $(".location").classList.add("hide");
  $(".footer-left").classList.add("hide");
  $(".footer-right").classList.add("hide");
  $(".tour-complete-container").classList.remove("hide");
  krpano.autorotate.enabled = false;
  krpano.set("auto_tour_temporary_paused", false);
  krpano.set("end_auto_tour", true);
}

export function handleCloseTourCompletePopup() {
  const tourCompletePopupHidden = $(".tour-complete-container").classList.contains("hide");

  if (!tourCompletePopupHidden) {
    $(".location").classList.remove("hide");
    $(".footer-left").classList.remove("hide");
    $(".footer-right").classList.remove("hide");
    $(".tour-complete-container").classList.add("hide");
  }
}

export function handleRestartAutoTour() {
  handleCloseTourCompletePopup();
  toggleAutoTour();
}

export function findHotspotByScene(scene) {
  const hotspot = hotspotList.find((hotspot) => hotspot.scene == scene);

  return hotspot;
}

export function nextScene() {
  const prevScene = krpano.prev_auto_tour_scene || krpano.prevscene;
  const isPanoScene = krpano.xml.scene.includes(SceneConst.SCENE_PANO_TEMPLATE);

  // Resume autotour
  if (krpano.auto_tour_temporary_paused) {
    krpano.autorotate.oneroundrange = findHotspotByScene(prevScene)?.rotateAutotour
      ? TimeConst.ONE_ROUND_RANGE_180
      : TimeConst.ONE_ROUND_RANGE_30;
    loadAutoTour(prevScene);
    loadAndCenterCarouselItem(krpano.xml.scene);
    krpano.autorotate.resume();
    krpano.autorotate.enabled = true;
    krpano.set("auto_tour_temporary_paused", false);
    krpano.set("end_auto_tour", false);
  }

  // Loading next scene in autotour
  else {
    const sceneIndex = krpano.end_auto_tour ? -1 : krpano.scene.getItem(krpano.xml.scene).index;
    krpano.autorotate.start();
    krpano.actions.add("next_scene_index", sceneIndex, 1);
    const nextScene = krpano.scene.getItem(krpano.next_scene_index).name;
    const nextSceneIndex = krpano.next_scene_index;
    krpano.set("end_auto_tour", false);

    krpano.autorotate.oneroundrange = findHotspotByScene(nextScene)?.rotateAutotour ? 180 : 30;

    // Click load autotour in scene pano
    if (nextSceneIndex < krpano.total_pano_scene) {
      krpano.set("prev_auto_tour_scene", nextScene);
      krpano.set("auto_tour_temporary_paused", false);
      loadAutoTour(nextScene);
      loadAndCenterCarouselItem(krpano.xml.scene);
    } else if (!isPanoScene && nextSceneIndex > krpano.total_pano_scene) {
      // Click load autotour in dollhouse or floor scene
      loadAutoTour(prevScene);
      loadAndCenterCarouselItem(krpano.xml.scene);
    } else {
      // End autotour
      handleEndAutotour();
    }
  }
}

export function pauseScene() {
  krpano.autorotate.pause();
  krpano.autorotate.enabled = false;
  krpano.set("auto_tour_temporary_paused", true);
}
