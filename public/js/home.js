export function getfooterHTML(obj) {
  return `
<div id="loader" class="loader hide"></div>
<div class="footer-left hide">
    <div class="actions-container">
      <div class="btn-explore-3d-space" onclick="handleOnClickExplore3D();">
          <span class="pseudo-tooltip-wrapper" data-title="Explore 3D Space">
              <img src="${obj.explore3DSpaceSvgURL}" alt="Explore 3D Image">
          </span>
      </div>
      <div class="btn-dollhouse hide" onclick="handleOnClickDollhouse();">
          <span class="pseudo-tooltip-wrapper" data-title="View Dollhouse">
              <img src="${obj.dollhouseSvgURL}" alt="Dollhouse Image">
          </span>
      </div>
      <div class="btn-floorplan" onclick="handleOnClickFloorplan();">
          <span class="pseudo-tooltip-wrapper" data-title="View Floorplan">
              <img src="${obj.floorplanSvgURL}" alt="Floorplan Image">
          </span>
      </div>
      <div class="btn-ruler" onclick="handleOnClickRuler();">
          <span class="pseudo-tooltip-wrapper" data-title="Measurement">
              <img src="${obj.rulerSvgURL}" alt="Measurement Image">
          </span>
      </div>
      <div class="btn-mute-background-music active" onclick="toggleBackgroundMusic();">
          <span class="pseudo-tooltip-wrapper" data-title="Mute Background Music (M)">
              <img src="${obj.soundSvgURL}" alt="Play Background Music Image">
          </span>
      </div>
      <div class="btn-open-background-music hide" onclick="toggleBackgroundMusic();">
          <span class="pseudo-tooltip-wrapper" data-title="Play Background Music">
              <img src="${obj.soundMuteSvgURL}" alt="Mute Background Music Image">
          </span>
      </div>
    </div>
</div>
<div class="btn-toggle-measure hide" onclick="handleClickStartAndStopMeasure();">
  <i class="fa-solid fa-plus fa-2xl"></i>
</div>
<div class="measure-menu-top-right hide">
    <a class="item item-settings-svg pseudo-tooltip-wrapper" data-title="Settings" onclick="handleClickSettingsButtonInMeasurement();">
      <img src="${obj.settingsSvgURL}" alt="Setting SVG"/>
    </a>
    <a class="item pseudo-tooltip-wrapper" data-title="Help" onclick="handleClickHelpButton();">
      <img src="${obj.questionSvgURL}" alt="Question SVG"/>
    </a>
    <a class="item item-close-svg pseudo-tooltip-wrapper" data-title="Close" onclick="handleClickCloseButtonInMeasurement();">
      <img src="${obj.closeSvgURL}" alt="Close SVG"/>
    </a>
    <div class="settings-tooltip hide">
      <div class="settings-toggle units-setting">
        <div class="settings-label">Units</div>
        <div class="radio-group radio-buttons">
          <div class="radio-element radio-button">
            <input type="radio" id="unit-metric" name="unit" value="metric" checked onchange="onChangeRadioInput(event);">
            <label class="radio-button-label" for="unit-metric">Metric</label>
          </div>
          <div class="radio-element radio-button">
            <input type="radio" id="unit-feet" name="unit" value="feet" onchange="onChangeRadioInput(event);">
            <label class="radio-button-label" for="unit-feet">Feet</label>
          </div>
        </div>                          
      </div>
    </div>
  </div>
<div class="footer-right hide">
    <div class="btn-share" onclick="handleClickShareButton();">
        <span class="pseudo-tooltip-wrapper" data-title="Share this Space">
            <img src="${obj.shareSvgURL}" alt="Share Image">
        </span>
    </div>
    <div class="btn-view-vr" onclick="handleClickViewVR();">
        <span class="pseudo-tooltip-wrapper" data-title="View in VR">
            <img src="${obj.viewVRSvgURL}" alt="View VR Image">
        </span>
    </div>
    <div class="btn-fullscreen" onclick="handleToggleFullScreen(event);">
        <span class="pseudo-tooltip-wrapper" data-title="View Fullscreen">
            <img src="${obj.fullscreenSvgURL}" alt="Fullscreen Image">
        </span>
    </div>
    <div class="btn-exit-fullscreen hide" onclick="handleToggleFullScreen(event);">
        <span class="pseudo-tooltip-wrapper" data-title="Exit Fullscreen">
            <img src="${obj.exitFullscreenSvgURL}" alt="Exit Full Screen Image">
        </span>
    </div>
</div>
<div class="toast">
  <div class="toast-content">
    <i class="fas fa-solid fa-check check"></i>
    <div class="message">
      <span class="text text-1">Error</span>
      <span class="text text-2">You can't view VR at this scene!</span>
    </div>
  </div>
  <span onclick="hanldeClickCloseToast();"><i class="fa-solid fa-xmark close"></i></span>
  <div class="progress"></div>
</div>
<div class="depthmap-navigation hide">
  <div class="btn-up" onmouseup="handleMouseUp('up');" onmousedown="handleMouseDown('up');" ontouchstart="handleMouseDown('up');" ontouchend="handleMouseUp('up');">▲</div>
  <div class="btn-down" onmouseup="handleMouseUp('down');" onmousedown="handleMouseDown('down');" ontouchstart="handleMouseDown('down');" ontouchend="handleMouseUp('down');">▼</div>
</div>
<div class="toggle-footer-right hide" onClick="handleToggleFooterRight()";>
  <i class="fa-solid fa-ellipsis fa-xl"></i>  
</div>
<div class="footer-bottom hide">
    <div id="helpButton" class="help-button hide" onclick="handleClickHelp()">Help</div>
    <div>|</div>
    <div>Your brand</div>
</div>
<div class="showcase-modal modal-help-container">
  <div class="modal-background" onclick="handleClickOutsiteHelpModal(event)">
    <div class="modal-help">
        <div class="modal-header">
          <div class="modal-title">
          <h3>Measurement Mode</h3>
          <p>Maximize your space's potential</p>
          </div>
          <div class="button-close">
            <span onclick="handleClickCloseOnHelpModal()"><i class="fa-solid fa-xmark"></i></span>
          </div>
        </div>
      <div class="modal-body">
        <p>The precision of the measurements is not guaranteed and varies according to the camera used and the captured state.</p>
        <p>Ensure accuracy of your measurements by examining them from multiple angles.</p>
      </div>
      </div>
    </div>
</div>
<div class="showcase-modal modal-share-container">
    <div class="modal-background" onclick="handleClickOutsiteShareModal(event);">
      <div class="modal-share">
        <div class="modal-header">
          <div class="modal-title">
          <h3>Share this space</h3>
          <p>Copy and paste the URL to share this space with your friends!</p>
          </div>
          <div class="button-close" onclick="handleClickCloseOnShareModal();">
            <span><i class="fa-solid fa-xmark"></i></span>
          </div>
        </div>
        <div class="modal-body">
          <div class="share-controls">
            <div class="social-icons">
              <div class="social-icons-faded">
                <a class="icon-button-social facebook" target="_blank">
                  <span class="fa-brands fa-facebook-f"></span>
                </a>                  
                <div class="social-icons-text">
                  <p>Facebook</p>
                </div>
              </div>
              <div class="social-icons-faded">
                <a class="icon-button-social twitter" target="_blank">
                  <span class="fa-brands fa-twitter"></span>
                </a>
                <div class="social-icons-text">
                  <p>Twitter</p>
                </div>
              </div>
              <div class="social-icons-faded">
                <a class="icon-button-social linkedin" target="_blank">
                  <span class="fa-brands fa-linkedin-in"></span>
                </a>
                <div class="social-icons-text">
                  <p>Linkedln</p>
                </div>
              </div>
              <div class="social-icons-faded">
                <a class="icon-button-social pinterest" target="_blank">
                  <span class="fa-brands fa-pinterest-p"></span>
                </a>
                <div class="social-icons-text">
                  <p>Pinterest</p>
                </div>
              </div>
              <div class="social-icons-faded">
                <a class="icon-button-social gmail" target="_blank">
                  <span class="fa-solid fa-envelope"></span>
                </a>
                <div class="social-icons-text">
                  <p>Email</p>
                </div>
              </div>
            </div>
            <div class="input-group">
              <div class="input-group-pos">
                <input class="input-coppy" type="text" readonly >
              </div>
              <div class="data-balloon">
                <span class="data-balloon-disabled btn-copy" data-title="Copy URL">
                  <i class="fa-regular fa-clone" ></i>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
</div>
    <div class="help-modal hide">
    <div class="desktop-help-modal">
    <div class="tabs-help-modal">
        <div class="tabs-help">
            <div class="btn-tab navigation-tab active" onclick="openTab(event, 'navigation')">
                <span class="tabhelp" >Navigation</span>
            </div>
            <div class="btn-tab more-help-tab" onclick="openTab(event, 'MoreHelp')">
                <span class="tabhelp" >More Help</span>
            </div>
            <div class="tabs-help-close">
            <span onclick="handleClickCloseHelp()"><i class="fa-solid fa-xmark"></i></span>
            </div>
            </div>         
        </div>  
        <div id="navigation" class="tabcontent">
            <div class="navigation-inside">
                <div class="navigation-inside-top-info">
                    <div class="navigation-content-help">
                        <div class="navigation-image-help">
                          <img src="${obj.helpMouseDragSvg}">
                        </div>
                        <div class="navigation-text">
                            <span>Click and drag to view around.</span>
                        </div>
                    </div>
                    <div class="navigation-content-help">
                      <div class="navigation-image-help">
                        <img src="${obj.helpMouseMoveSvg}">
                      </div>
                        <div class="navigation-text">
                            <span>Click on the rings throughout the space to move around.</span>
                        </div>
                    </div>
                    <div class="navigation-content-help">
                      <div class="navigation-image-help">
                        <img src="${obj.helpMouseZoomSvg}">
                      </div>
                        <div class="navigation-text">
                            <span>Use the scroll wheel to zoom in and out.</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div id="MoreHelp" class="tabcontent">
            <div class="more-help-inside">
                <div class="more-help-inside-top-info">
                  <div class="more-help-inside-more-help">
                    <div class="more-help-inside-content-help">
                    <div class="more-image-help">
                      <img src="${obj.dollhouseSvgURL}" >
                      </div>
                      <div class="more-help-inside-text">
                        <span>Dollhouse view</span>                        
                    </div>
                    <div class="more-help-inside-content">
                    <p>  Click to view and rotate a top-down view of the entire Space in 3D. </p>  
                    </div>
                  </div>
                  <div class="more-help-inside-content-help">
                  <div class="more-image-help">
                    <img src="${obj.floorplanSvgURL}">
                    </div>
                    <div class="more-help-inside-text">
                      <span>Floor plan view</span>                     
                  </div>
                  <div class="more-help-inside-content">
                  <p>  Click to view the Floor Plan of the Space.</p>
                </div>
                </div>
                <div class="more-help-inside-content-help">
                <div class="more-image-help">
                  <img src="${obj.panorama}">
                  </div>
                  <div class="more-help-inside-text">
                    <span>Inside View</span>                     
                </div>
                <div class="more-help-inside-content">
                <p>  Click to explore inside the Space.</p>
              </div>
              </div>
                <div class="more-help-inside-content-help">
                <div class="more-image-help">
                    <img src="${obj.rulerSvgURL}">
                    </div>
                    <div class="more-help-inside-text">
                      <span>Measurement mode </span>             
                  </div>
                  <div class="more-help-inside-content">
                  <p> Click to select the desired measurement point. Double click to take a measurement with the opposite end point.</p>
                </div>
                </div>
                <div class="more-help-inside-content-help">
                <div class="more-image-help">
                    <img src="${obj.shareSvgURL}">
                    </div>
                    <div class="more-help-inside-text">
                      <span>Share </span>
                    </div>
                    <div class="more-help-inside-content">
                    <p>  Click to share this space with your friends!</p>
                  </div>
                </div>
                <div class="more-help-inside-content-help">
                <div class="more-image-help">
                  <img src="${obj.viewVRSvgURL}">
                  </div>
                  <div class="more-help-inside-text">
                    <span>VR mode</span>
              </div>
               <div class="more-help-inside-content">
                  <p> Click to launch the Space in virtual reality.</p>
                  </div>
            </div>
            <div class="more-help-inside-content-help">
            <div class="more-image-help">
              <img src="${obj.tilesFloorSvgURL}">
              </div>
              <div class="more-help-inside-text">
                <span>Floor selector</span>
            </div>
            <div class="more-help-inside-content">
                  <p>Switch between floors in the Space.</p>
                  </div>
          </div>
          <div class="more-help-inside-content-help">
          <div class="more-image-help">
          <img src="${obj.viewTag}">
          </div>
          <div class="more-help-inside-text">
            <span>Explanation tag</span>
        </div>
        <div class="more-help-inside-content">
        <p>  Click or hover over for information about features in the Space.</p>
        </div>
      </div>
      <div class="more-help-inside-content-help">
      <div class="more-image-help">
              <img src="${obj.fullscreenSvgURL}">
              </div>
              <div class="more-help-inside-text">
                <span>Full screen</span>
            </div>
            <div class="more-help-inside-content">
            <p> Expand 3D Showcase to full screen.</p>
            </div>
          </div>
          <div class="more-help-inside-content-help center-bottom">
          <div class="more-image-help">
              <img src="${obj.tourControls}">
              </div>
              <div class="more-help-inside-text">
                <span>Tour controls</span>
              </div>
              <div class="more-help-inside-content">
              <p> Play, pause, and navigate forward and backward through a Guided Tour.</p>
              </div>
          </div>
              </div>  
            </div>
        </div>
      </div>
    </div>
</div>
`;
}

export function handleClickOverlayHome() {
  const btnImageFloorplan = krpano.layer.getItem("open_flpl_b");
  if (btnImageFloorplan) {
    btnImageFloorplan.visible = true;
    btnImageFloorplan.alpha = 0.5;
    updateHeightFloorButtonContainer();
  }

  $(".overlay-home").classList.add("hide");
  $(".location").classList.remove("hide");
  $(".footer-left").classList.remove("hide");
  $(".footer-right").classList.remove("hide");
  $(".footer-bottom").classList.remove("hide");
  $(".help-button").classList.remove("hide");
  $(".toggle-footer-right").classList.remove("hide");
  setTimeout(() => {
    $(".wrapper-carousel")?.classList.remove("hide");
  }, 300);

  krpano.prevscene = "scene_pano4";
  if (getLocalStorage(LocalStorageConst.START_LOCATION)) {
    krpano.prevscene = getLocalStorage(LocalStorageConst.START_LOCATION).prevscene;
    krpano.actions.tween(
      "view.hlookat|view.vlookat",
      `${Math.ceil(getLocalStorage(LocalStorageConst.START_LOCATION).hlookat)}|${Math.ceil(
        getLocalStorage(LocalStorageConst.START_LOCATION).vlookat,
      )}`,
      5,
      AnimationConst.TWEEN_TYPE.EASE_INOUT_QUAD,
    );
  }

  handleOnClickExplore3D(true);
  loadCursorHotspotStyle();
  renderHotspot();
}

// go to nearest hotspot
export function navigateToNearestHotspot(currentHotspotMousePosition, allHotspot) {
  const { x: currentTx, y: currentTy, z: currentTz } = currentHotspotMousePosition;
  let nearestHotspot = null;
  let nearestDistance = Infinity;

  for (const hotspot of allHotspot) {
    const { tx, ty, tz } = hotspot;
    const distance = Math.sqrt(
      Math.pow(currentTx - parseFloat(tx), 2) +
        Math.pow(currentTy - parseFloat(ty), 2) +
        Math.pow(currentTz - parseFloat(tz), 2),
    );

    if (distance < nearestDistance) {
      nearestDistance = distance;
      nearestHotspot = hotspot;
    }
  }

  if (krpano?.xml?.scene == `${SceneConst.SCENE_PANO_TEMPLATE}${nearestHotspot.id}`) {
    return;
  }

  const sceneName = `${SceneConst.SCENE_PANO_TEMPLATE}${nearestHotspot.id}`;
  loadPanoScene(sceneName);
  $(".icon-add-label").classList.remove("fa-rotate-45");
  showLabelHotspot(false);
}

export function handleOnPressEsc() {
  const modalHelpMeasureClasslist = $(".modal-help-container").classList;
  const modalShareOpen = $(".modal-share-container").classList.contains("open");
  const helpModalHidden = $(".help-modal").classList.contains("hide");
  const isBtnRulerActive = $(".btn-ruler.active");
  const plusIconElementClasslist = $(".btn-toggle-measure .fa-plus").classList;
  const floorPlanButtonContainer = $(".floorplan-button-container");
  const isPlanInPopupMode = $(".plan-container")?.classList?.contains("popup-mode");
  const tourCompletePopupElement = $(".tour-complete-container");
  const panelEditTagClassList = $(".panel-edit-tag").classList;
  const panelEditNoteClassList = $(".panel-edit-note").classList;
  const panelShowInfoTagClassList = $(`.${PanelConst.PANEL_SHOW_TAG_CLASS_NAME}`).classList;
  const panelShowInfoNoteClassList = $(`.${PanelConst.PANEL_SHOW_NOTE_CLASS_NAME}`).classList;
  const editLabelContainerClassList = $(".overlay-edit-label-container").classList;
  const iconStartAddNote = $(".icon-start-add-note");
  const iconStartAddTag = $(".icon-start-add-tag");

  iconStartAddNote.classList.contains("fa-rotate-45") && iconStartAddNote.click();
  iconStartAddTag.classList.contains("fa-rotate-45") && iconStartAddTag.click();

  !panelEditTagClassList.contains("hide") && handleCancelEditTag();
  !panelEditNoteClassList.contains("hide") && handleCancelAddNote();
  !panelShowInfoTagClassList.contains("hide") && closePanelShowInfo(PanelConst.PANEL_SHOW_TAG_CLASS_NAME);
  !panelShowInfoNoteClassList.contains("hide") && closePanelShowInfo(PanelConst.PANEL_SHOW_NOTE_CLASS_NAME);
  !editLabelContainerClassList.contains("hide") && cancelPanelEditLabel();

  loadCursorTagStyles(false);
  if (
    isBtnRulerActive &&
    !modalHelpMeasureClasslist.contains("open") &&
    !plusIconElementClasslist.contains("fa-rotate-45")
  ) {
    toggleMeasurement();
  }
  tourCompletePopupElement && handleCloseTourCompletePopup();
  floorPlanButtonContainer && isPlanInPopupMode && closeFloorplan();
  modalHelpMeasureClasslist.remove("open");
  modalShareOpen && $(".modal-share .button-close").click();
  !helpModalHidden && $(".tabs-help-close span").click();

  const iconElement = $(".btn-toggle-measure > i.fa-plus");
  if (iconElement.classList.contains("fa-rotate-45")) {
    krpano.depthmap_measure3d_loop = false;
    krpano.events.onclick = null;
    iconElement.classList.remove("fa-rotate-45");
  }
  loadCursorHotspotStyle();
}

export function onChangeRadioInput(e) {
  const currentUnitValue = e.target.value;
  krpano.hotspot
    .getArray()
    .filter((i) => i.style?.includes("depthmap_measure3d_linetext"))
    .forEach((i) => {
      switch (currentUnitValue) {
        case "feet":
          krpano.v_formated = `${(i.distance / 30.48).toFixed(2)} ft`;
          i.html = krpano.v_formated;
          break;
        default:
          krpano.v_formated = `${(i.distance / 100).toFixed(2)} m`;
          i.html = krpano.v_formated;
      }
    });
}

export function showSideBar() {
  const highlightContainerElement = $(".highlight-container");

  document.getElementById("pano").classList.add("d-flex");
  $(".location").classList.add("hide");
  $(".sidebar-container").classList.remove("hide");
  $(".sidebar").classList.remove("hide");
  $(".sidebar-header").classList.remove("hide");
  $(".footer-bottom").classList.add("hide");

  if (highlightContainerElement) {
    highlightContainerElement.classList.add("hide");

    // if highlight currently open
    if (!$(".wrapper-carousel")?.classList.contains("hide")) {
      $(".wrapper-carousel")?.classList.add("hide", "temporary_closed");
      $(".footer-left").classList.add("bottom");
      $(".footer-right").classList.add("bottom");
    }
  }
}

export function hideSideBar() {
  const highlightContainerElement = $(".highlight-container");

  $(".location").classList.remove("hide");
  $(".sidebar-container").classList.add("hide");
  $(".sidebar").classList.add("hide");
  $(".sidebar-header").classList.add("hide");
  $(".footer-bottom").classList.remove("hide");

  if (highlightContainerElement) {
    highlightContainerElement.classList.remove("hide");

    // if highlight is temporarily closed
    if ($(".wrapper-carousel")?.classList.contains("temporary_closed")) {
      $(".wrapper-carousel")?.classList.remove("hide", "temporary_closed");
      $(".footer-left").classList.remove("bottom");
      $(".footer-right").classList.remove("bottom");
    }
  }
}
