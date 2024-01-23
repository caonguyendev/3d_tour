export function addModuleToWindowGlobal(module) {
  const keys = Object.keys(module);

  keys.forEach((key) => {
    const value = module[key];
    window[key] = value;
  });
}

export function loadCursorHotspotStyle(isLoad = true) {
  let hs;
  if (isLoad) {
    hs = krpano.addhotspot("auto", "webgl");
    hs.loadstyle("scene_pano_cursor");
    let gap = 0.0;
    let hit = null;
    krpano.in_scene_pano = true;

    krpano.actions.asyncloop(
      "in_scene_pano",
      function () {
        if (krpano.hoveringelement == null || krpano.hoveringelement == hs) {
          hit = krpano.actions.screentodepth(krpano.mouse.x, krpano.mouse.y);
        }

        hs.visible = false;
        if (hit) {
          // optionally add a small gap/offset to the hit surface to avoid depthbuffer rendering problems
          hs.tx = hit.x + hit.nx * gap;
          hs.ty = hit.y + hit.ny * gap;
          hs.tz = hit.z + hit.nz * gap;

          // hotspot rotation
          hs.rx = hit.rx;
          hs.ry = hit.ry;
          hs.rz = hit.rz;

          !hs.name.includes(HotspotConst.HOTSPOT_TYPE.LABEL) ? (hs.visible = true) : showLabelHotspot(false);
        }
      },
      function () {
        hs.remove();
      },
    );

    krpano.events.onclick = function () {
      krpano.mouse.button === 0 && hit && navigateToNearestHotspot(hit, hotspotList);
    };

    return;
  }

  krpano.in_scene_pano = false;
  krpano.events.onclick = null;
}

export function ctrlShiftKey(e, keyCode) {
  return e.ctrlKey && e.shiftKey && e.keyCode === keyCode.charCodeAt(0);
}

export function openPopupSocialMedia(url) {
  const width = 500;
  const height = 360;
  let leftPosition, topPosition;

  //Allow for borders.
  leftPosition = window.screen.width / 2 - (width / 2 + 10);
  //Allow for title and status bars.
  topPosition = window.screen.height / 2 - (height / 2 + 50);
  //Open the window.
  window.open(
    url,
    "Window2",
    `status=no, height=${height}, width=${width}, resizable=yes, 
    left=${leftPosition}, top=${topPosition}, screenX=${leftPosition}, screenY=${topPosition}, 
    toolbar=no, menubar=no, scrollbars=no, location=no, directories=no`,
  );
}

export function addMetaTag(property, content) {
  const metaTag = document.createElement("meta");
  metaTag.setAttribute("property", property);
  metaTag.content = content;

  // Append the meta element to the head of the document
  document.head.appendChild(metaTag);
}

export function getLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key));
}

export function setLocalStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function getCheckArray(data) {
  return Array.isArray(data) ? data : [];
}

// Common onChange function
export function handleInputChange(element) {
  element.setAttribute("value", element.value);
}

export function convertSingleQuoteToHTMLCode(originalString) {
  return originalString.replace(/'/g, "&#39;");
}

export function convertHTMLCodeToSingleQuote(originalString) {
  return originalString.replace(/&#39;/g, "'");
}

export function encodeAmpersand(originalString) {
  return originalString.replace(/&/g, "&amp;");
}

export function getFileNameWithoutExtension(filename) {
  const parts = filename.split(".");

  if (parts.length === 1) return filename;

  parts.pop();

  return parts.join(".");
}

export function onHoverLabel(caller) {
  showCursorHotspot(false);
  caller.css = "font-size: 18px; color: var(--primary-color); font-weight: 600;";
}

export function onOutLabel(caller) {
  showCursorHotspot();
  caller.css = "font-size: 18px; color: white; font-weight: 600;";
}

export function clearInputEditLabel() {
  $(".panel-edit-label-content input").value = "";
}

export function hideEditLabelPanel() {
  clearInputEditLabel();
  $(".overlay-edit-label-container").classList.add("hide");
}

export function b64toBlob(b64Data, contentType = "", sliceSize = 512, isVideo = false) {
  let byteCharacters = atob(
    isVideo
      ? b64Data.replace(/^data:video\/(mp4);base64,/, "")
      : b64Data.replace(/^data:image\/(png|jpeg|jpg);base64,/, ""),
  );

  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize);

    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  const blob = new Blob(byteArrays, { type: contentType });
  return blob;
}

export function getUploadWidgetObjByType(type) {
  const cloudName = "deswydniy";
  const uploadPreset = "s8fu5u5e";
  return {
    cloudName,
    uploadPreset,
    sources: ["local"],
    resourceType: type,
    multiple: false,
  };
}

export const closureDragHotspot = (function () {
  let isDragHotspot = false;
  return () => ({
    setIsDragHotspot: (type = true) => {
      isDragHotspot = type;
    },
    getIsDragHotspot: () => isDragHotspot,
  });
})();

export const closureIsLoadingBeforeShowPage = (function () {
  let isLoadingBeforeShowPage = true;
  return () => ({
    setIsLoadingBeforeShowPage: (isLoading = true) => {
      isLoadingBeforeShowPage = isLoading;
    },
    getIsLoadingBeforeShowPage: () => isLoadingBeforeShowPage,
  });
})();

export const updateTextHtml = (element) => {
  const id = $(`#${element.id}`);
  if (id) {
    element.id === "sidebarImage" ? (id.src = element.text) : (id.innerHTML = element.text);
  }
};

export const loadPanoScene = (sceneName, fromOverlayHome) => {
  const hotspotName = `hotspot_${sceneName.split(SceneConst.SCENE_PANO_TEMPLATE)[1]}`;
  const nearbyPanoImages = getNearbyPanoImages(hotspotName, hotspotList, panoImages);
  document.getElementById("loader").classList.remove("hide");
  fromOverlayHome = fromOverlayHome ? Boolean(JSON.parse(fromOverlayHome)) : false;
  let i = 0;

  // preload nearby pano image and load scene
  async function asyncCall() {
    for await (const imageURL of nearbyPanoImages) {
      let imgExp = new Image();
      imgExp.src = imageURL;

      imgExp.onload = () => {
        ++i;
        if (i == nearbyPanoImages.length) {
          document.getElementById("loader").classList.add("hide");
          tour3DLoadScene(sceneName, fromOverlayHome);
        }
      };

      imgExp.onerror = () => {
        ++i;
        console.log("error!");
      };
    }
  }
  asyncCall();
};

export const showCursorHotspot = (isShow = true) => {
  const alphaValue = JSON.parse(isShow) === true ? 1 : 0;
  if (krpano.device.desktop) {
    krpano.hotspot
      .getArray()
      .filter((i) => i.cssclass == "scene-pano-cursor")
      .forEach((i) => (i.alpha = alphaValue));
  }
};

export const showHotspotsInCurrentScene = (isShow = true) => {
  isShow = JSON.parse(isShow);
  const sceneName = krpano.xml.scene;
  const btnRulerElementActive = $(".btn-ruler").classList.contains("active");

  if (btnRulerElementActive) {
    isShow = false;
  }

  if (
    sceneName == SceneConst.SCENE_DOLLHOUSE_TEMPLATE ||
    sceneName == SceneConst.SCENE_FLOORPLAN_TEMPLATE ||
    sceneName.includes(SceneConst.SCENE_PANO_TEMPLATE)
  ) {
    krpano.hotspot
      .getArray()
      .filter((i) => i.name?.includes("hotspot_"))
      .forEach((i) => (i.visible = isShow));

    krpano.hotspot
      .getArray()
      .filter((item) =>
        [
          HotspotConst.HOTSPOT_STYLE.STYLE_TAG_HOTSPOT,
          HotspotConst.HOTSPOT_STYLE.STYLE_VIDEO_HOTSPOT,
          HotspotConst.HOTSPOT_STYLE.STYLE_IMAGE_HOTSPOT,
        ].includes(item.style),
      )
      .forEach((i) => (i.visible = true));
    return;
  }

  const currentFloorNumber = sceneName.match(/(floorplan|dollhouse)(\d+)/)[2];

  krpano.hotspot
    .getArray()
    .filter((item) =>
      [
        HotspotConst.HOTSPOT_STYLE.STYLE_TAG_HOTSPOT,
        HotspotConst.HOTSPOT_STYLE.STYLE_VIDEO_HOTSPOT,
        HotspotConst.HOTSPOT_STYLE.STYLE_IMAGE_HOTSPOT,
      ].includes(item.style),
    )
    .forEach((i) => (i.visible = i.atfloor === currentFloorNumber));

  krpano.hotspot
    .getArray()
    .filter((i) => i.name?.includes("hotspot_"))
    .forEach((i) => (i.visible = false));

  krpano.hotspot
    .getArray()
    .filter((i) => i.name?.includes("hotspot_"))
    .forEach((i) => (i.visible = false));
};

export const getFloorForHotspot = (ty) => {
  ty = +ty;
  if (ty < HotspotConst.HOTSPOT_HEIGHT.FLOOR_1) {
    return HotspotConst.HOTSPOT_FLOOR.FLOOR_2;
  }
  return HotspotConst.HOTSPOT_FLOOR.FLOOR_1;
};

export const setTransitionTime = (currentSceneBeforeClickLoadScene, prevImageScene, nextImageScene) => {
  let transitionTime = TimeConst.DEFAULT_TRANSITION_TIME;

  const distance = Math.sqrt(
    Math.pow(parseFloat(nextImageScene?.ox) - prevImageScene?.ox, 2) +
      Math.pow(parseFloat(nextImageScene?.oy) - prevImageScene?.oy, 2) +
      Math.pow(parseFloat(nextImageScene?.oz) - prevImageScene?.oz, 2),
  );

  if (
    currentSceneBeforeClickLoadScene.includes(SceneConst.SCENE_PANO_TEMPLATE) &&
    distance > TimeConst.MINIMUM_DISTANCE_THRESHOLD
  ) {
    transitionTime = (distance / TimeConst.DISTANCE_DIVISOR).toFixed(2);
  }

  krpano.set("transitiontime", transitionTime);
};

export const loadAutoTour = (targetSceneName) => {
  let prevImage = null;
  const currentSceneBeforeClickLoadScene = krpano.xml.scene;

  if (currentSceneBeforeClickLoadScene.includes(SceneConst.SCENE_DOLLHOUSE_TEMPLATE)) {
    krpano.call("dh_off();");
    krpano.actions.tween("view.oz|view.vlookat", "0|0", 2.0);
  }

  if (currentSceneBeforeClickLoadScene.includes(SceneConst.SCENE_FLOORPLAN_TEMPLATE)) {
    krpano.call("floorplan_off();");
  }

  krpano.prevscene = targetSceneName;
  prevImage = krpano.image;

  krpano.actions.loadscene(targetSceneName, null, "MERGE|KEEPVIEW|KEEPMOVING", `BLEND(1)`);

  // if floor number < 2 not calling these two func
  setChangeFloorImage(targetSceneName);
  changeFloorSelectStyle();

  krpano.actions.tween("view.fovmin|view.fovmax", "25|135", 1.5, AnimationConst.TWEEN_TYPE.EASE_INOUT_QUAD);

  krpano.device.normal && krpano.actions.tween("view.fov", 90, 1.5, AnimationConst.TWEEN_TYPE.EASE_INOUT_QUAD);
  krpano.device.mobile && krpano.actions.tween("view.fov", 120, 1.5, AnimationConst.TWEEN_TYPE.EASE_INOUT_QUAD);

  krpano.actions.tween(
    "view.tx|view.ty|view.tz",
    `${krpano.image.ox}|${krpano.image.oy}|${krpano.image.oz}`,
    2,
    AnimationConst.TWEEN_TYPE.EASE_INOUT_QUAD,
  );

  $(".floor-container")?.classList?.add("hide");
};

export const modalConfirmCommon = () => {
  return `
  <div class="modal-confirm-overlay">
    <div class="modal-confirm-container">
      <div class="modal-confirm-header">
        <h6 class="modal-confirm-title"></h6>
        <div class="modal-confirm-icon-close"><i class="fa-solid fa-xmark close"></i></div>
      </div>
      <div class="modal-confirm-body">
        <p class="modal-confirm-desc"></p>
      </div>
      <div class="modal-confirm-btn-group">
        <div class="modal-confirm-btn-cancel" >Cancel</div>
        <div class="modal-confirm-btn-confirm" >Ok</div>
      </div>
    </div>
  </div>
  `;
};

export const handleCancelModal = () => {
  $(".modal-add-start-location").classList.add("hide");
};

export const handleConfirmModal = () => {
  krpano.actions.adjusthlookat(110);

  const dataSetLocalStorage = {
    prevscene: krpano.prevscene,
    vlookat: +krpano.view.vlookat.toFixed(3),
    hlookat: +krpano.view.hlookat.toFixed(3),
  };

  setLocalStorage(LocalStorageConst.START_LOCATION, dataSetLocalStorage);
  $(".modal-add-start-location").classList.add("hide");
};

export const handleClickReviewLocation = () => {
  handleOnClickDollhouse();
  setTimeout(() => {
    handleOnClickExplore3D();
  }, 2000);
};

// get and set current floor
export const closureCurrentFloor = (function () {
  let currentFloor;
  return () => ({
    set: (floor) => {
      currentFloor = floor;
    },
    get: () => currentFloor,
  });
})();

export const resizeTextarea = () => {
  const textarea = document.getElementById("resizableTextarea");
  textarea.style.height = "auto"; // Reset height to auto to shrink back
  textarea.style.height = `${textarea.scrollHeight}px`; // Set new height based on content
};

export const handleValidateTextarea = () => {
  const textArea = $("#resizableTextarea");
  const textAreaCount = $(".textarea-text-count");
  const currentTextAreaLengthElement = $(".current-textarea-length");
  const addNoteButton = $(".btn-add-note");
  const textAreaLength = textArea.value.length;

  currentTextAreaLengthElement.innerText = textAreaLength;

  if (textArea.value.trim() !== "" && textAreaLength <= NoteConst.TEXTAREA_MAX_LENGTH) {
    textAreaCount.classList.add("hide");
    addNoteButton.disabled = false;
    textArea.classList.remove("border-red");
    return;
  }

  addNoteButton.disabled = true;

  if (textAreaLength > NoteConst.TEXTAREA_MAX_LENGTH) {
    textArea.classList.add("border-red");
    textAreaCount.classList.remove("hide");
    return;
  }

  textArea.classList.remove("border-red");
  textAreaCount.classList.add("hide");
};

// close panel show info
export const closePanelShowInfo = (panelClassName) => {
  const panelElement = $(`.${panelClassName}`);

  if (panelElement.classList.contains("hide")) return;

  const locationElementClassList = $(".location").classList;
  const wrapperCarouselElementClassList = $(".wrapper-carousel")?.classList;
  const footerLeftElementClassList = $(".footer-left").classList;
  const footerRightElementClassList = $(".footer-right").classList;
  const toggleFooterRightElementClassList = $(".toggle-footer-right").classList;
  panelElement.classList.add("hide");
  locationElementClassList.remove("hide");
  footerLeftElementClassList.remove("hide");
  footerRightElementClassList.remove("hide");
  toggleFooterRightElementClassList.remove("hide");
  // if carousel temporary closed
  if (wrapperCarouselElementClassList?.contains("temporary_closed")) {
    footerLeftElementClassList.remove("bottom");
    footerRightElementClassList.remove("bottom");
    toggleFooterRightElementClassList.remove("bottom");
    wrapperCarouselElementClassList.remove("hide", "temporary_closed");
  }
};

// handle click feature on right sidebar
export const handleClickFeatureOnRightSidebar = (targetFeature) => {
  const panelAddLabel = $(".panel-add-label-container");
  const btnStartAddNote = $(".btn-start-add-note");
  const btnStartAddTag = $(".btn-start-add-tag");

  // hide container of all features
  panelAddLabel.classList.add("hide");
  btnStartAddNote.classList.add("hide");

  // check if click on current active feature
  // if click current active feature -> toggle it

  // check if click on other feature
  // target is label
  if (targetFeature === FeatureConst.FEATURE_NAME.LABEL) {
    panelAddLabel.classList.remove("hide");
  }

  // target is note
  if (targetFeature === FeatureConst.FEATURE_NAME.NOTE) {
    btnStartAddNote.classList.remove("hide");
  }

  // target is tag
  if (targetFeature === FeatureConst.FEATURE_NAME.TAG) {
    btnStartAddTag.classList.remove("hide");
  }

  if (!$(".wrapper-carousel").classList.contains("hide")) {
    // if slide tour showing then click close slider
    handleOnClickArrow();
  }

  // change cursor to default
  handleClickChangeCursor();
};

// update hotspot list
export const updateHotspotListPositionAndHotspotListOnFloor = () => {
  const hotspots = krpano.hotspot.getArray().filter((i) => i.name.includes("hotspot_"));

  hotspotList.map((hotspot, index) => {
    hotspotList[index] = {
      ...hotspot,
      tx: hotspots[index].tx,
      ty: hotspots[index].ty,
      tz: hotspots[index].tz,
    };
  });

  hotspotListOnFloor.push(...hotspotList.filter((hotspot) => !listHotspotNotOnFloor.includes(hotspot.name)));
};

// count total pano scene
export const scenePanoCount = () => {
  const totalPanoScene = krpano.scene
    .getArray()
    .filter((item) => item.name.includes(SceneConst.SCENE_PANO_TEMPLATE)).length;

  krpano.set("total_pano_scene", totalPanoScene);
};

// handler event onclick krpano
export const localEventOnClick = () => {
  checkAndHideDropdownSelectFloorAndSettings();
};

// update image select of current floor
export const setChangeFloorImage = (currentScene) => {
  let matchingHotspot = hotspotList.find((hotspot) => hotspot.scene === currentScene);

  if (matchingHotspot) {
    let floorToChange = matchingHotspot.floor;

    // set current floor
    closureCurrentFloor().set(floorToChange);

    // show label follow floor and scene
    showLabelHotspot(
      currentScene.includes(SceneConst.SCENE_DOLLHOUSE_TEMPLATE) ||
        currentScene.includes(SceneConst.SCENE_FLOORPLAN_TEMPLATE),
    );

    let activeFloorItem = $(".floor-select-item.active");

    if (!activeFloorItem) return;

    let activeFloor = activeFloorItem.getAttribute("name");

    if (floorToChange !== activeFloor) {
      changeFloorImage(floorToChange);
    }
  }
};

// check if navigate from overlay home UI or not
export const checkFromOverlayHome = (fromOverlayHome) => {
  fromOverlayHome = fromOverlayHome ? Boolean(JSON.parse(fromOverlayHome)) : false;

  if (fromOverlayHome && getLocalStorage(LocalStorageConst.START_LOCATION)) return;

  krpano.actions.tween("view.vlookat", 0, 2, AnimationConst.TWEEN_TYPE.EASE_INOUT_QUAD);
};

export const toggleVideo = (caller) => {
  caller.togglepause();
};

export const handleClickTagLoadScene = (targetSceneName, hlookat, vlookat, caller) => {
  let blendTime = null;
  let prevImage = null;
  let styleName = null;
  const currentSceneBeforeClickLoadScene = krpano.xml.scene;

  if (currentSceneBeforeClickLoadScene.includes(SceneConst.SCENE_DOLLHOUSE_TEMPLATE)) {
    krpano.call("dh_off();");
    krpano.actions.tween("view.oz|view.vlookat", "0|0", 2.0);
  }

  if (currentSceneBeforeClickLoadScene.includes(SceneConst.SCENE_FLOORPLAN_TEMPLATE)) {
    krpano.call("floorplan_off();");
  }

  blendTime = currentSceneBeforeClickLoadScene.includes(SceneConst.SCENE_PANO_TEMPLATE)
    ? TimeConst.BLEND_TIME.SCENE_PANO
    : TimeConst.BLEND_TIME.OTHER;

  krpano.prevscene = targetSceneName;
  prevImage = krpano.image;

  styleName = `style_${krpano.scene.getItem(targetSceneName).title}`;
  setTransitionTime(currentSceneBeforeClickLoadScene, prevImage, krpano.style.getItem(styleName));

  if (krpano.transitiontime >= 1) {
    blendTime = krpano.transitiontime / 2;
  }

  if (caller.click_pre_or_next) {
    krpano.actions.loadscene(
      targetSceneName,
      null,
      "MERGE|KEEPVIEW",
      "COLORBLEND(2.5, 0x000000, AnimationConst.TWEEN_TYPE.EASE_OUT_SINE)",
    );
  } else {
    krpano.actions.loadscene(targetSceneName, null, "MERGE|KEEPVIEW|KEEPMOVING", `BLEND(${blendTime})`);
  }

  krpano.set("caller.click_pre_or_next", false);

  setChangeFloorImage(targetSceneName);
  changeFloorSelectStyle();

  krpano.actions.adjusthlookat(110);

  if (caller.click_pre_or_next) {
    krpano.set("view.hlookat", hlookat);
    krpano.set("view.vlookat", vlookat);
  } else {
    krpano.actions.tween(
      "view.hlookat|view.vlookat",
      `${hlookat}|${vlookat}`,
      1.5,
      AnimationConst.TWEEN_TYPE.EASE_INOUT_QUAD,
    );
  }

  krpano.actions.tween("view.fovmin|view.fovmax", "25|135", 1.5, AnimationConst.TWEEN_TYPE.EASE_INOUT_QUAD);

  krpano.normal && krpano.actions.tween("view.fov", 75, 1.5, AnimationConst.TWEEN_TYPE.EASE_INOUT_QUAD);
  krpano.mobile && krpano.actions.tween("view.fov", 120, 1.5, AnimationConst.TWEEN_TYPE.EASE_INOUT_QUAD);

  if (caller.click_pre_or_next) {
    krpano.set("view.tx", krpano.image.ox);
    krpano.set("view.ty", krpano.image.oy);
    krpano.set("view.tz", krpano.image.oz);
  } else {
    krpano.actions.tween(
      "view.tx|view.ty|view.tz",
      `${krpano.image.ox}|${krpano.image.oy}|${krpano.image.oz}`,
      krpano.transitiontime,
      AnimationConst.TWEEN_TYPE.EASE_INOUT_QUAD,
    );
  }

  krpano.actions.wait("LOAD");

  showHotspotsInCurrentScene();

  $(".floor-container")?.classList.add("hide");

  const explore3DButtonClassList = $(".btn-explore-3d-space").classList;
  const dollhouseButtonClassList = $(".btn-dollhouse").classList;

  if (!explore3DButtonClassList.contains("hide")) {
    explore3DButtonClassList.add("hide");
  }

  if (dollhouseButtonClassList.contains("hide")) {
    dollhouseButtonClassList.remove("hide");
  }
};

// Load scene
export const tour3DLoadScene = (targetSceneName, fromOverlayHome) => {
  let blendTime = null;
  let prevImage = null;
  let styleName = null;
  const currentSceneBeforeClickLoadScene = krpano.xml.scene;

  // Handle call specific actions based on the current scene
  if (currentSceneBeforeClickLoadScene.includes(SceneConst.SCENE_DOLLHOUSE_TEMPLATE)) {
    krpano.call("dh_off();");
    checkFromOverlayHome(fromOverlayHome);
  }

  if (currentSceneBeforeClickLoadScene.includes(SceneConst.SCENE_FLOORPLAN_TEMPLATE)) {
    krpano.call("floorplan_off();");
  }

  krpano.prevscene = targetSceneName;
  prevImage = krpano.image;

  // Determine blendTime based on the current scene type
  blendTime = currentSceneBeforeClickLoadScene.includes(SceneConst.SCENE_PANO_TEMPLATE)
    ? TimeConst.BLEND_TIME.SCENE_PANO
    : TimeConst.BLEND_TIME.OTHER;

  styleName = `style_${krpano.scene.getItem(targetSceneName).title}`;
  setTransitionTime(currentSceneBeforeClickLoadScene, prevImage, krpano.style.getItem(styleName));

  // Adjust blendTime if transitiontime is greater than or equal to 1
  if (krpano.transitiontime >= 1) {
    blendTime = krpano.transitiontime / 2;
  }

  // Loading scene with specified blendTime
  krpano.actions.loadscene(targetSceneName, null, "MERGE|KEEPVIEW|KEEPMOVING", `BLEND(${blendTime})`);

  // After the scene is loaded
  // if floor number < 2 then not calling these two func
  setChangeFloorImage(targetSceneName);
  changeFloorSelectStyle();

  krpano.actions.tween("view.fovmin|view.fovmax", "25|135", 1.5, AnimationConst.TWEEN_TYPE.EASE_INOUT_QUAD);

  // Handle device-specific FOV adjustments
  krpano.device.normal && krpano.actions.tween("view.fov", 90, 1.5, AnimationConst.TWEEN_TYPE.EASE_INOUT_QUAD);
  krpano.device.mobile && krpano.actions.tween("view.fov", 120, 1.5, AnimationConst.TWEEN_TYPE.EASE_INOUT_QUAD);

  krpano.actions.tween(
    "view.tx|view.ty|view.tz",
    `${krpano.image.ox}|${krpano.image.oy}|${krpano.image.oz}`,
    krpano.transitiontime,
    AnimationConst.TWEEN_TYPE.EASE_INOUT_QUAD,
  );

  krpano.actions.wait("LOAD");

  // Show hotspots in the current scene
  showHotspotsInCurrentScene();

  // Hide floor container
  $(".floor-container")?.classList.add("hide");

  // Toggle visibility of buttons based on the scene type
  if (currentSceneBeforeClickLoadScene !== "dollhouse") {
    $(".btn-floorplan").classList.remove("hide");
  }

  // Toggle visibility of explore3DButton and dollhouseButton
  const explore3DButtonClassList = $(".btn-explore-3d-space").classList;
  const dollhouseButtonClassList = $(".btn-dollhouse").classList;

  if (!explore3DButtonClassList.contains("hide")) {
    explore3DButtonClassList.add("hide");
  }

  if (dollhouseButtonClassList.contains("hide")) {
    dollhouseButtonClassList.remove("hide");
  }
};
