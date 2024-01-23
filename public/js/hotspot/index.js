const popupEditLabel = `
<div class="overlay-edit-label-container hide">
    <div class="panel-edit-label">
        <div class="panel-edit-label-header">
            <div class="title">Edit Label</div>
        </div>
        <div class="panel-edit-label-content">
            <input value="Label" placeholder="Add a Label" onchange="handleInputChange(this);">
            <div class="cta-edit-panel-container">
                <span onclick="cancelPanelEditLabel();">Cancel</span>
                <span onclick="savePanelEditLabel();">Done</span>
            </div>
        </div>
    </div>
</div>
`;

const tagEditorPanelHTML = `
<div class="panel panel-edit-tag hide">
    <div class="tag-widget annotating creating">
        <div class="tag">
            <div class="tag-editor">
                <div class="h6">Add Tag</div>
                <div class="text-field">
                    <label>Title</label>
                    <input class="text-input-box text-input-title" type="text" placeholder="Add Title" value="" onchange="handleInputChange(this);">
                </div>
                <div class="text-field">
                    <label>Description</label>
                    <textarea class="text-input-box text-area-desc" name="w3review" rows="4" cols="50" placeholder="Add Description" value="" onchange="handleInputChange(this);"></textarea>
                </div>
                <div class="text-field">
                    <label>Link Infomation</label>
                    <input class="text-input-box text-input-link-text" type="text" placeholder="Enter link text" value="" onchange="handleInputChange(this);">
                    <input class="text-input-box text-input-link-url" type="text" placeholder="Enter the link address" value="" onchange="handleInputChange(this);">
                </div>
                <div class="button-sticky-footer">
                    <div class="mp-nova-btn-group">
                        <div class="btn-cancel-tag" id="btn-cancel-tag" onclick="handleCancelEditTag();">Cancel</div>
                        <div class="btn-save-tag" id="btn-save-tag" onclick="handleSaveTag(false);">Save</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
`;
{
  /* <div class="list-nav">
<a class="btn-prev-tag" onclick="nextTag(false);"><i class="fa-solid fa-angle-left"></i></a>
<span class="list-nav-label">26 of 26</span>
<a class="btn-next-tag" onclick="nextTag();"><i class="fa-solid fa-angle-right"></i></a>
</div> */
}
const panelShowInfoTag = (panelClassName) => `
<div class="panel-show-tag-container">
    <input type="button" id="labelInput" style="display: none;">
    <input type="button" id="videoInput" accept="video/*" style="display: none;">
    <input type="button" id="imageHighlightInput" accept="image/*" style="display: none;">
    <input type="button" id="imageInput" accept="image/*" style="display: none;">
    <input type="button" id="setLocation" style="display: none;">
    <div class="panel ${panelClassName} hide">
        <div class="panel-header">
            <a class="btn-close-panel" onclick="closePanelShowInfo('${panelClassName}');">
                <i class="fa-solid fa-xmark"></i>
                Close
            </a>
        </div>
        <div class="panel-content">
            <div class="tag-view-panel">
                <div class="tag-view-panel-header no-media">
                    <span class="tag-image">
                        <img src="./images/tag.svg">
                    </span>
                    <div class="tag-view-panel-header-contents">
                        <div class="tag-view-panel-top">
                            <div class="tag-view-panel-title">Title</div>
                        </div>
                        <div class="annotation-box">
                            <div class="annotation-text-box">
                                <div class="tag-content text-box-text"></div>
                                <a class="link-tag text-box-text" target="_blank"></a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="panel-show-tag-footer">
            <button class="delete-tag" id="button-delete-tag" onclick="removeTag()">Delete</button>
            <button class="edit-tag" onclick="editTag()">Edit</button>
        </div>
    </div>
</div>
`;

const panelShowInfoNote = (panelClassName) => `
<div class="panel ${panelClassName} hide">
  <div class="note-post">
    <div class="note-header">
      <div class="note-header-navigate">
        <div class="note-header-button-close" onclick="closePanelShowInfo('${panelClassName}');">
          <i class="fa-solid fa-xmark"></i>
          <span class="close-text"> Close </span>
        </div>
      </div>
    </div>
    <div class="note-content">
      <div class="note-content-user-infor">
        <img src="./images/logo.png" />
        <div class="note-details">
          <span class="note-user">Cao Nguyên Lê</span>
          <div class="note-subheader">1/17/2024, 10:06:58 AM</div>
        </div>
        <div class="note-icons">
          <div class="icon-container">
            <i class="fa-solid fa-check"></i>
          </div>
          <div class="icon-container">
            <i class="fa-solid fa-share"></i>
          </div>
          <div class="icon-container icon-more" onclick="handleClickIconMore();">
            <i class="fa-solid fa-ellipsis-vertical"></i>
            <div class="icon-actions hide">
              <div class="icon-action-edit">Edit</div>
              <div class="icon-action-delete">Delete</div>
            </div>
          </div>
        </div>
      </div>
      <div class="note-message">Message</div>
      <!-- <div class="note-btn-container">
        <button class="btn-cancel-note" onclick="handleCancelAddNote();">Cancel</button>
        <button class="btn-add-note" disabled onclick="handleSaveNote(false);">Add</button>
      </div> -->
    </div>
  </div>
</div>
`;

const panelEditNoteHTML = `
<div class="panel panel-edit-note hide">
  <div class="note-post">
    <div class="note-header">
      <div class="note-header-user-infor">
        <img src="./images/logo.png" />
        <div class="note-details">
          <span class="note-user">Cao Nguyên Lê</span>
          <div class="note-subheader">1/17/2024, 10:06:58 AM</div>
        </div>
      </div>
      <div class="note-header-button-close" onclick="handleCancelAddNote();">
        <i class="fa-solid fa-xmark"></i>
      </div>
    </div>
    <div class="note-content">
      <textarea
        id="resizableTextarea"
        class="textarea-message"
        oninput="resizeTextarea(); handleValidateTextarea();"
        placeholder="Add your message"
      ></textarea>
      <div class="note-icon-container">
        <i class="fa-solid fa-paperclip"></i>
        <i class="fa-solid fa-photo-film"></i>
        <i class="fa-solid fa-link"></i>
      </div>
      <div class="note-btn-container">
        <button class="btn-cancel-note" onclick="handleCancelAddNote();">Cancel</button>
        <button class="btn-add-note" disabled onclick="handleSaveNote(false);">Add</button>
      </div>
    </div>
    <div class="textarea-text-count hide"><span class="current-textarea-length">100</span>/500</div>
  </div>
</div>
`;

const panelAddLocationHTML = (modalConfirmCommon) => `
<div>
  <div class="preview-start-location hide" onclick="handleClickReviewLocation();">
    <span>CLICK TO PREVIEW</span>
  </div>
  <div class="btn-set-start-location hide" onclick="handleClickSetStartLocation();">
    Set start location
  </div>
  <div class="location-menu-top-right hide">
    <a class="item pseudo-tooltip-wrapper" data-title="Help" onclick="handleClickHelpButton();">
    <img src="./images/question.svg" alt="Question SVG"/>
    </a>
    <a class="item item-close-svg pseudo-tooltip-wrapper" data-title="Close" onclick="setLocationByClick()">
      <img src="./images/close.svg" alt="Close SVG"/>
    </a>
  </div>
  <div class="modal-add-start-location hide">
    ${modalConfirmCommon()}
  </div>
</div>
`;

const panelAddLabelHTML = `
<div class="panel-add-label-container hide">
  <div class="btn-edit-label hide" onclick="" disabled>
    <i class="fa-solid fa-pen"></i>
  </div>
  <div class="btn-add-label hide" onclick="handleClickStartAddLabel();">
    <i class="fa-solid fa-plus icon-add-label"></i>
  </div>
  <div class="btn-delete-label hide" onclick="" disabled>
    <i class="fa-solid fa-trash"></i>
  </div>
</div>
`;

const btnStartAddNote = `
<div class="btn-start-add-note hide" onclick="handleClickStartAddNote();">
  <i class="fa-solid fa-plus icon-start-add-note"></i>
</div>
`;

const btnStartAddTag = `
<div class="btn-start-add-tag hide" onclick="handleClickStartAddTag();">
  <i class="fa-solid fa-plus icon-start-add-tag"></i>
</div>
`;

export const addContentForModal = (title, desc) => {
  $(".modal-add-start-location .modal-confirm-title").innerHTML = title;
  $(".modal-add-start-location .modal-confirm-desc").innerHTML = desc;
  $(".modal-add-start-location .modal-confirm-icon-close").setAttribute("onclick", `handleCancelModal()`);
  $(".modal-add-start-location .modal-confirm-btn-cancel").setAttribute("onclick", `handleCancelModal()`);
  $(".modal-add-start-location .modal-confirm-btn-confirm").setAttribute("onclick", `handleConfirmModal()`);
};

// Function to insert HTML templates into the DOM
export function insertHTMLTemplates() {
  const sidebar = $(".sidebar");
  if (sidebar) {
    sidebar.insertAdjacentHTML("afterend", popupEditLabel);
    sidebar.insertAdjacentHTML("afterend", tagEditorPanelHTML);
    sidebar.insertAdjacentHTML("afterend", panelAddLabelHTML);
    sidebar.insertAdjacentHTML("afterend", panelEditNoteHTML);
    sidebar.insertAdjacentHTML("afterend", btnStartAddNote);
    sidebar.insertAdjacentHTML("afterend", btnStartAddTag);
    sidebar.insertAdjacentHTML("afterend", panelShowInfoTag(PanelConst.PANEL_SHOW_TAG_CLASS_NAME));
    sidebar.insertAdjacentHTML("afterend", panelShowInfoNote(PanelConst.PANEL_SHOW_NOTE_CLASS_NAME));
    sidebar.insertAdjacentHTML("afterend", panelAddLocationHTML(modalConfirmCommon));
    addContentForModal("Start Location & Tag Order", "If you change the Start Location, your tag order may change.");
  }
}

export function handleClickSetStartLocation() {
  $(".modal-add-start-location").classList.toggle("hide");
}

export function setLocationByClick() {
  $(".preview-start-location").classList.toggle("hide");
  $(".btn-set-start-location").classList.toggle("hide");
  showFloorplan($(".btn-set-start-location").classList.contains("hide"));

  $(".location-menu-top-right").classList.toggle("hide");
}

export function labelInputByClick() {
  handleClickChangeCursor();
  $(".panel-add-label-container").classList.toggle("hide");

  // hide container of other features
  $(".btn-start-add-note").classList.add("hide");
  $(".btn-start-add-tag").classList.add("hide");

  $(".icon-add-label").classList.remove("fa-rotate-45");
  showFloorplan($(".panel-add-label-container").classList.contains("hide"));
  // if slide tour showing then click close slider
  if (!$(".wrapper-carousel").classList.contains("hide")) {
    handleOnClickArrow();
  }
  closureIsAddingLabelMode().set(!closureIsAddingLabelMode().get());
}

export function loadCursorTagStyles(isLoad, type, _fileName, url) {
  if (isLoad) {
    let hs = krpano.addhotspot("auto", "webgl");
    switch (type) {
      case HotspotConst.HOTSPOT_TYPE.NOTE:
        hs.loadstyle(HotspotConst.HOTSPOT_STYLE.STYLE_NOTE_HOTSPOT);
        break;
      case HotspotConst.HOTSPOT_TYPE.LABEL:
        hs.loadstyle(HotspotConst.HOTSPOT_STYLE.STYLE_LABEL_HOTSPOT);
        hs.setvars({
          text: "Label",
          enabled: "false",
        });
        break;
      case HotspotConst.HOTSPOT_TYPE.IMAGE:
        hs.loadstyle(HotspotConst.HOTSPOT_STYLE.STYLE_IMAGE_HOTSPOT);
        hs.setvars({
          url,
        });
        break;
      case HotspotConst.HOTSPOT_TYPE.VIDEO:
        hs.loadstyle(HotspotConst.HOTSPOT_STYLE.STYLE_VIDEO_HOTSPOT);
        hs.setvars({
          url,
        });
        break;
      default:
        hs.loadstyle(HotspotConst.HOTSPOT_STYLE.STYLE_TAG_HOTSPOT);
        break;
    }
    let gap = 0.0;
    let hit = null;
    loadCursorHotspotStyle(false);
    krpano.hotspot_tag_in_scene_pano = true;

    krpano.events.onclick = function () {
      if (krpano.mouse.button == 0 && hit) {
        switch (type) {
          case HotspotConst.HOTSPOT_TYPE.NOTE:
            addNote(hs);
            break;
          case HotspotConst.HOTSPOT_TYPE.LABEL:
            addLabel(hs);
            break;
          case HotspotConst.HOTSPOT_TYPE.VIDEO:
            addVideoHotspot(hs, url);
            break;
          case HotspotConst.HOTSPOT_TYPE.IMAGE:
            addImageHotspot(hs, url);
            break;
          default:
            addTag(hs);
            break;
        }
        krpano.hotspot_tag_in_scene_pano = false;
        krpano.events.onclick = null;
        loadCursorHotspotStyle();
      }
    };

    krpano.actions.asyncloop(
      "hotspot_tag_in_scene_pano",
      function () {
        if (krpano.hoveringelement == null || krpano.hoveringelement == hs) {
          hit = krpano.actions.screentodepth(krpano.mouse.x, krpano.mouse.y);
        }

        if (hit) {
          // optionally add a small gap/offset to the hit surface to avoid depthbuffer rendering problems
          hs.tx = hit.x + hit.nx * gap;
          hs.ty = hit.y + hit.ny * gap;
          hs.tz = hit.z + hit.nz * gap;

          // hotspot rotation
          hs.rx = hit.rx;
          hs.ry = hit.ry;
          hs.rz = hit.rz;

          hs.visible = true;
        } else {
          hs.visible = false;
        }
      },
      function () {
        hs.remove();
      },
    );
    return;
  }
  krpano.hotspot_tag_in_scene_pano = false;
  krpano.events.onclick = null;
}

// Start and end dragging a hotspot
export function startDragHotspot(caller, event) {
  if (event.shiftKey) {
    closureDragHotspot().setIsDragHotspot();
    dragHotspot(true, caller);
  }
}

export function endDragHotspot(caller) {
  if (closureDragHotspot().getIsDragHotspot()) {
    dragHotspot(false, caller);
  }
}

export function dragHotspot(isDragging = true, caller) {
  let gap = 5.0;
  let hit = null;
  let hs = caller;

  if (isDragging) {
    krpano.is_dragging = true;
    loadCursorHotspotStyle(false);

    krpano.actions.asyncloop("is_dragging", function () {
      if (krpano.hoveringelement == null || krpano.hoveringelement == hs) {
        hit = krpano.actions.screentodepth(krpano.mouse.x, krpano.mouse.y);
      }

      if (hit) {
        // optionally add a small gap/offset to the hit surface to avoid depthbuffer rendering problems
        hs.tx = hit.x + hit.nx * gap;
        hs.ty = hit.y + hit.ny * gap;
        hs.tz = hit.z + hit.nz * gap;

        // hotspot rotation
        hs.rx = hit.rx;
        hs.ry = hit.ry;
        hs.rz = hit.rz;
        hs.atfloor = getFloorForHotspot(hs.ty);

        // if it is a label hotspot, don't make it visible
        if (!hs.name.includes("label")) {
          hs.visible = true;
        }
      } else {
        hs.visible = false;
      }
    });
    return;
  }
  if (hs) {
    // update video
    updatePosition(
      getCheckArray(getLocalStorage(LocalStorageConst.VIDEO_HOTSPOT)),
      hs,
      LocalStorageConst.VIDEO_HOTSPOT,
    );

    // update image
    updatePosition(
      getCheckArray(getLocalStorage(LocalStorageConst.IMAGE_HOTSPOT)),
      hs,
      LocalStorageConst.IMAGE_HOTSPOT,
    );

    // update tag position
    updatePosition(getCheckArray(getLocalStorage(LocalStorageConst.TAG_HOTSPOT)), hs, LocalStorageConst.TAG_HOTSPOT);

    // update label position
    updatePosition(
      getCheckArray(getLocalStorage(LocalStorageConst.LABEL_HOTSPOT)),
      hs,
      LocalStorageConst.LABEL_HOTSPOT,
    );
  }

  if (closureDragHotspot().getIsDragHotspot()) {
    loadCursorTagStyles(false);
    loadCursorHotspotStyle();
  }
  closureDragHotspot().setIsDragHotspot(false);
  krpano.is_dragging = false;
}

export function updatePosition(data, newPosition, name) {
  if (data.length > 0) {
    const newData = data.map((item) => {
      if (item.name == newPosition.name) {
        return {
          ...item,
          tx: newPosition.tx,
          ty: newPosition.ty,
          tz: newPosition.tz,
          rx: newPosition.rx,
          ry: newPosition.ry,
          rz: newPosition.rz,
          atfloor: newPosition.atfloor,
          visible: true,
        };
      }
      return item;
    });
    setLocalStorage(name, newData);
  }
}

export function renderHotspot() {
  // render video
  const listVideoLocalStorage = getCheckArray(getLocalStorage(LocalStorageConst.VIDEO_HOTSPOT));

  listVideoLocalStorage.length > 0 &&
    listVideoLocalStorage.forEach((item) => {
      const currentVideoHotspot = krpano.addhotspot(item.name);
      currentVideoHotspot.loadstyle(HotspotConst.HOTSPOT_STYLE.STYLE_VIDEO_HOTSPOT);
      currentVideoHotspot.setvars({
        ...item,
        videourl: item.videourl,
        name: item.name,
        width: String(Number(item.width)),
        height: String(Number(item.height)),
        keep: true,
        tx: item.tx,
        ty: item.ty,
        tz: item.tz,
        rx: item.rx,
        ry: item.ry,
        rz: item.rz,
        enabled: true,
        onclick: "jscall(startDragHotspot(caller, event));",
        onup: "jscall(endDragHotspot(caller));",
      });
    });

  // render image
  const listImageLocalStorage = getCheckArray(getLocalStorage(LocalStorageConst.IMAGE_HOTSPOT));

  listImageLocalStorage.length > 0 &&
    listImageLocalStorage.forEach((imageItem) => {
      const currentImageHotspot = krpano.addhotspot(imageItem.name);
      currentImageHotspot.loadstyle(HotspotConst.HOTSPOT_STYLE.STYLE_IMAGE_HOTSPOT);
      currentImageHotspot.setvars({
        ...imageItem,
        url: imageItem.url,
        name: imageItem.name,
        width: String(Number(imageItem.width)),
        height: String(Number(imageItem.height)),
        keep: true,
        tx: imageItem.tx,
        ty: imageItem.ty,
        tz: imageItem.tz,
        rx: imageItem.rx,
        ry: imageItem.ry,
        rz: imageItem.rz,
        enabled: true,
        onclick: "jscall(startDragHotspot(caller, event));",
        onup: "jscall(endDragHotspot(caller));",
      });
    });

  // render tag
  const listTagLocalStorage = getCheckArray(getLocalStorage(LocalStorageConst.TAG_HOTSPOT));

  listTagLocalStorage.length > 0 &&
    listTagLocalStorage.forEach(async (tag) => {
      const currentTagHotspot = krpano.addhotspot(tag.name);
      currentTagHotspot.loadstyle(HotspotConst.HOTSPOT_STYLE.STYLE_TAG_HOTSPOT);
      currentTagHotspot.setvars(tag);
    });

  // render note
  const listNoteLocalStorage = getCheckArray(getLocalStorage(LocalStorageConst.NOTE_HOTSPOT));

  listNoteLocalStorage.length > 0 &&
    listNoteLocalStorage.forEach(async (note) => {
      const currentNoteHotspot = krpano.addhotspot(note.name);
      currentNoteHotspot.loadstyle(HotspotConst.HOTSPOT_STYLE.STYLE_NOTE_HOTSPOT);
      currentNoteHotspot.setvars(note);
    });

  // render label
  const listLabelLocalStorage = getCheckArray(getLocalStorage(LocalStorageConst.LABEL_HOTSPOT));

  listLabelLocalStorage.length > 0 &&
    listLabelLocalStorage.forEach(async (label) => {
      const currentLabelHotspot = krpano.addhotspot(label.name);
      currentLabelHotspot.loadstyle(HotspotConst.HOTSPOT_STYLE.STYLE_LABEL_HOTSPOT);
      currentLabelHotspot.setvars(label);
    });
}
