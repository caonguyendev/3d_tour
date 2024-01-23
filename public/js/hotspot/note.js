export function togglePanelShowInfoNote(panelID, event) {
  if (event.shiftKey || closureDragHotspot().getIsDragHotspot()) return;

  const panelShowInfoNoteElement = $(`.${PanelConst.PANEL_SHOW_NOTE_CLASS_NAME}`);
  const dataPanelID = panelShowInfoNoteElement.getAttribute("data-panel-id");
  const locationElementClassList = $(".location").classList;
  const wrapperCarouselElementClassList = $(".wrapper-carousel")?.classList;
  const footerLeftElementClassList = $(".footer-left").classList;
  const footerRightElementClassList = $(".footer-right").classList;
  const toggleFooterRightElementClassList = $(".toggle-footer-right").classList;

  const notes = krpano.hotspot
    .getArray()
    .filter((item) => item.style === HotspotConst.HOTSPOT_STYLE.STYLE_NOTE_HOTSPOT && item.enabled === true);
  const currentNote = notes.find((item) => item.name === `note_${panelID}`);

  closePanelShowInfo(PanelConst.PANEL_SHOW_TAG_CLASS_NAME);

  $(".note-message").innerHTML = currentNote?.message || "";
  panelShowInfoNoteElement.setAttribute("data-panel-id", panelID);

  // click open panel show info note
  if (panelShowInfoNoteElement.classList.contains("hide")) {
    hideSideBar();
    panelShowInfoNoteElement.classList.remove("hide");
    locationElementClassList.add("hide");
    footerLeftElementClassList.add("hide");
    footerRightElementClassList.add("hide");
    toggleFooterRightElementClassList.add("hide");

    // if carousel slider currently showing
    if (!wrapperCarouselElementClassList?.contains("hide")) {
      toggleFooterRightElementClassList.add("bottom");
      footerLeftElementClassList.add("bottom");
      footerRightElementClassList.add("bottom");
      wrapperCarouselElementClassList.add("hide", "temporary_closed");
    }

    // const buttonDeleteTag = $("#button-delete-tag");
    // buttonDeleteTag.setAttribute("data-tag", currentNote?.name);

    // const buttonSaveTagEdit = $("#btn-save-tag");
    // buttonSaveTagEdit.setAttribute("data-tag", currentNote?.name);

    return;
  }

  if (+dataPanelID !== +panelID) return;

  // Click toggle same note
  panelShowInfoNoteElement.removeAttribute("data-panel-id");
  panelShowInfoNoteElement.classList.add("hide");
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
}

export function addNote(hotspot) {
  const newNoteName = `note_${new Date().valueOf()}`;
  const hotspotVar = {
    width: hotspot.width,
    height: hotspot.height,
    keep: true,
    tx: hotspot.tx,
    ty: hotspot.ty,
    tz: hotspot.tz,
    rx: hotspot.rx,
    ry: hotspot.ry,
    rz: hotspot.rz,
    enabled: true,
    onclick: "jscall(startDragHotspot(caller, event));",
    onup: "jscall(endDragHotspot(caller));",
    atfloor: getFloorForHotspot(hotspot.ty),
  };
  const currentNoteHotspot = krpano.addhotspot(newNoteName);
  currentNoteHotspot.loadstyle(HotspotConst.HOTSPOT_STYLE.STYLE_NOTE_HOTSPOT);
  currentNoteHotspot.setvars(hotspotVar);

  closePanelShowInfo(PanelConst.PANEL_SHOW_TAG_CLASS_NAME);
  showNoteEditorPanel();
  window.currentAddedNoteHotspot = currentNoteHotspot;
}

export function showNoteEditorPanel() {
  $(`.${PanelConst.PANEL_SHOW_NOTE_CLASS_NAME}`).classList.add("hide");
  $(".panel-edit-note").classList.remove("hide");
}

export function upsertNote(isEdit = false) {
  let noteID;
  let noteMessage = $(".textarea-message").value;
  let hotspotVar = {
    message: noteMessage,
  };
  let listNoteLocalStorage = [...getCheckArray(getLocalStorage(LocalStorageConst.NOTE_HOTSPOT))];

  if (isEdit) {
    const btnSaveNote = $(".btn-add-note");
    const dataNote = btnSaveNote.getAttribute("data-tag");
    const currentEditedNoteHotspot = krpano.hotspot.getArray().find((item) => item.name === dataNote);
    noteID = currentEditedNoteHotspot.name.split("note_")[1];

    // update ondown
    hotspotVar = {
      ...hotspotVar,
      ondown: `jscall(togglePanelShowInfoNote('${noteID}', event));`,
    };

    listNoteLocalStorage = listNoteLocalStorage.map((item) => {
      return item.name == currentEditedNoteHotspot.name
        ? {
            ...item,
            ...hotspotVar,
          }
        : item;
    });

    currentEditedNoteHotspot.setvars(hotspotVar);

    btnSaveNote.setAttribute("onclick", "handleSaveNote(false)");
  } else {
    const currentAddedNoteHotspot = window.currentAddedNoteHotspot;
    noteID = currentAddedNoteHotspot.name.split("note_")[1];

    hotspotVar = {
      ...hotspotVar,
      ondown: `jscall(togglePanelShowInfoNote('${noteID}', event));`,
    };

    const data = {
      name: currentAddedNoteHotspot.name,
      width: currentAddedNoteHotspot.width,
      height: currentAddedNoteHotspot.height,
      keep: true,
      tx: currentAddedNoteHotspot.tx,
      ty: currentAddedNoteHotspot.ty,
      tz: currentAddedNoteHotspot.tz,
      rx: currentAddedNoteHotspot.rx,
      ry: currentAddedNoteHotspot.ry,
      rz: currentAddedNoteHotspot.rz,
      enabled: true,
      onclick: "jscall(startDragHotspot(caller, event));",
      onup: "jscall(endDragHotspot(caller));",
      atfloor: getFloorForHotspot(currentAddedNoteHotspot.ty),
    };

    listNoteLocalStorage = [...listNoteLocalStorage, { ...hotspotVar, ...data }];
    currentAddedNoteHotspot.setvars(hotspotVar);
  }

  setLocalStorage(LocalStorageConst.NOTE_HOTSPOT, listNoteLocalStorage);
}

export function clearNoteTextarea() {
  $(".textarea-message").value = "";
}

export function hideNoteEditorPanel() {
  clearNoteTextarea();
  closePanelShowInfo(PanelConst.PANEL_SHOW_NOTE_CLASS_NAME);
  $(".panel-edit-note").classList.add("hide");
}

export function handleCancelAddNote() {
  $(".icon-start-add-note").classList.remove("fa-rotate-45");
  window?.currentNoteHotspot?.remove();
  hideNoteEditorPanel();
}

export function handleSaveNote(isEdit = false) {
  $(".icon-start-add-note").classList.remove("fa-rotate-45");
  upsertNote(isEdit);
  hideNoteEditorPanel();
}

export function handleClickIconMore() {
  $(".icon-actions").classList.toggle("hide");
}

// click notes button on the right sidebar
export function handleClickNotes() {
  const btnStartAddNote = $(".btn-start-add-note");
  // btnStartAddNote.classList.toggle("hide");
  handleClickFeatureOnRightSidebar(FeatureConst.FEATURE_NAME.NOTE);

  // toggle show floor plan
  showFloorplan(btnStartAddNote.classList.contains("hide"));
}

export function handleClickStartAddNote() {
  const iconStartAddNote = $(".icon-start-add-note");
  iconStartAddNote.classList.toggle("fa-rotate-45");

  if (iconStartAddNote.classList.contains("fa-rotate-45")) {
    loadCursorTagStyles(true, HotspotConst.HOTSPOT_TYPE.NOTE);
  } else {
    handleClickChangeCursor();
  }
}
