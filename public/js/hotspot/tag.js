export function togglePanelShowInfoTag(panelID, event) {
  if (event.shiftKey || closureDragHotspot().getIsDragHotspot()) return;
  const panelElement = $(`.${PanelConst.PANEL_SHOW_TAG_CLASS_NAME}`);
  const dataPanelID = panelElement.getAttribute("data-panel-id");
  const locationElementClassList = $(".location").classList;
  const wrapperCarouselElementClassList = $(".wrapper-carousel")?.classList;
  const footerLeftElementClassList = $(".footer-left").classList;
  const footerRightElementClassList = $(".footer-right").classList;
  const toggleFooterRightElementClassList = $(".toggle-footer-right").classList;

  const tags = krpano.hotspot
    .getArray()
    .filter((item) => item.style == HotspotConst.HOTSPOT_STYLE.STYLE_TAG_HOTSPOT && item.enabled == true);

  const currentTag = tags.find((item) => item.name == `tag_${panelID}`);

  closePanelShowInfo(PanelConst.PANEL_SHOW_NOTE_CLASS_NAME);

  // $(".list-nav-label").innerHTML = `${panelID} of ${tagLength}`;
  $(".tag-view-panel-title").innerHTML = currentTag?.title || "";
  $(".tag-content").innerHTML = currentTag?.desc || "";
  $(".link-tag").innerHTML = currentTag?.linkname || "";
  $(".link-tag").href = currentTag?.link || "";
  panelElement.setAttribute("data-panel-id", panelID);

  if (panelElement.classList.contains("hide")) {
    hideSideBar();
    panelElement.classList.remove("hide");
    locationElementClassList.add("hide");
    // if carousel slider currently showing
    if (!wrapperCarouselElementClassList?.contains("hide")) {
      toggleFooterRightElementClassList.add("bottom");
      footerLeftElementClassList.add("bottom");
      footerRightElementClassList.add("bottom");
      wrapperCarouselElementClassList.add("hide", "temporary_closed");
    }
    footerLeftElementClassList.add("hide");
    footerRightElementClassList.add("hide");
    toggleFooterRightElementClassList.add("hide");

    const buttonDeleteTag = $("#button-delete-tag");
    buttonDeleteTag.setAttribute("data-tag", currentTag?.name);

    const buttonSaveTagEdit = $("#btn-save-tag");
    buttonSaveTagEdit.setAttribute("data-tag", currentTag?.name);

    return;
  }

  if (+dataPanelID !== +panelID) return;

  panelElement.removeAttribute("data-panel-id");
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
}

export function nextTag(isNext = true) {
  const dataPanelID = +$(".panel-show-info-tag").getAttribute("data-panel-id");
  const tagHotspots = krpano.hotspot
    .getArray()
    .filter((item) => item.style == HotspotConst.HOTSPOT_STYLE.STYLE_TAG_HOTSPOT && item.enabled == true);
  let tagID;
  if (isNext) {
    tagID = (dataPanelID % tagHotspots.length) + 1;
  } else {
    tagID = dataPanelID < 2 ? tagHotspots.length : dataPanelID - 1;
  }
  if (tagHotspots.length > 1) {
    const tag = getTagHotspotByID(tagID);
    tag.click_pre_or_next = true;
    tag.triggerevent("onclick");
  }
}

export function getTagHotspotByID(tagID) {
  return krpano.hotspot.getItem(`tag_${tagID}`);
}

export function showTagEditorPanel() {
  $(".panel-show-info-tag").classList.add("hide");
  $(".panel-edit-tag").classList.remove("hide");
}

export function clearInputTagEditorPanel() {
  $(".text-input-title").value = "";
  $(".text-area-desc").value = "";
  $(".text-input-link-text").value = "";
  $(".text-input-link-url").value = "";
}

export function hideTagEditorPanel() {
  clearInputTagEditorPanel();
  closePanelShowInfo(PanelConst.PANEL_SHOW_TAG_CLASS_NAME);
  closePanelShowInfo(PanelConst.PANEL_SHOW_NOTE_CLASS_NAME);
  $(".panel-edit-tag").classList.add("hide");
}

export function upsertTag(isEdit = false) {
  let tagID;
  let tooltipTitle = $(".text-input-title").value;
  tooltipTitle = convertSingleQuoteToHTMLCode(tooltipTitle);
  const tooltipContent = $(".text-area-desc").value;
  const linkName = $(".text-input-link-text").value;
  const linkURL = $(".text-input-link-url").value;
  let listTagLocalStorage = getCheckArray(getLocalStorage(LocalStorageConst.TAG_HOTSPOT));
  let hotspotVar = {
    title: tooltipTitle,
    desc: tooltipContent,
    linkname: linkName || "",
    link: linkURL || "",
    onhover: `showtext('${tooltipTitle}');`,
  };

  if (isEdit) {
    const btnSave = $("#btn-save-tag");
    const dataTag = btnSave.getAttribute("data-tag");
    btnSave.setAttribute("onclick", "handleSaveTag(false)");

    // get current edited tag hotspot
    const currentEditedTagHotspot = krpano.hotspot.getArray().find((item) => item.name === dataTag);
    tagID = currentEditedTagHotspot.name.split("tag_")[1];

    // update ondown
    hotspotVar = {
      ...hotspotVar,
      ondown: `jscall(togglePanelShowInfoTag('${tagID}', event));`,
    };

    listTagLocalStorage = listTagLocalStorage.map((item) => {
      return item.name == currentEditedTagHotspot.name
        ? {
            ...item,
            ...hotspotVar,
          }
        : item;
    });

    currentEditedTagHotspot.setvars(hotspotVar);
  } else {
    const currentAddedTagHotspot = window.currentAddedTagHotspot;
    tagID = currentAddedTagHotspot.name.split("tag_")[1];

    // update ondown
    hotspotVar = {
      ...hotspotVar,
      ondown: `jscall(togglePanelShowInfoTag('${tagID}', event));`,
    };
    const data = {
      name: currentAddedTagHotspot.name,
      width: currentAddedTagHotspot.width,
      height: currentAddedTagHotspot.height,
      keep: true,
      tx: currentAddedTagHotspot.tx,
      ty: currentAddedTagHotspot.ty,
      tz: currentAddedTagHotspot.tz,
      rx: currentAddedTagHotspot.rx,
      ry: currentAddedTagHotspot.ry,
      rz: currentAddedTagHotspot.rz,
      enabled: true,
      onclick: "jscall(startDragHotspot(caller, event));",
      onup: "jscall(endDragHotspot(caller));",
      atfloor: getFloorForHotspot(currentAddedTagHotspot.ty),
    };

    listTagLocalStorage = [...listTagLocalStorage, { ...hotspotVar, ...data }];
    currentAddedTagHotspot.setvars(hotspotVar);
  }

  setLocalStorage(LocalStorageConst.TAG_HOTSPOT, listTagLocalStorage);
}

export function handleCancelEditTag() {
  $(".icon-start-add-tag").classList.remove("fa-rotate-45");
  window?.currentTagHotspot?.remove();
  hideTagEditorPanel();
}

export function handleSaveTag(isEdit = false) {
  upsertTag(isEdit);
  hideTagEditorPanel();
  $(".icon-start-add-tag").classList.toggle("fa-rotate-45");
}

export function addTag(hotspot) {
  const newTagName = `tag_${new Date().valueOf()}`;
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
  const currentTagHotspot = krpano.addhotspot(newTagName);
  currentTagHotspot.loadstyle(HotspotConst.HOTSPOT_STYLE.STYLE_TAG_HOTSPOT);
  currentTagHotspot.setvars(hotspotVar);

  closePanelShowInfo(PanelConst.PANEL_SHOW_NOTE_CLASS_NAME);
  showTagEditorPanel();
  $(".panel-edit-tag .h6").innerText = "Add Tag";
  window.currentAddedTagHotspot = currentTagHotspot;
}

export function removeTag() {
  if (confirm("Are you sure you want to delete this tag?")) {
    const listTagLocalStorage = getCheckArray(getLocalStorage(LocalStorageConst.TAG_HOTSPOT));

    const buttonDeleteTag = $("#button-delete-tag");
    const name = buttonDeleteTag.getAttribute("data-tag");
    closePanelShowInfo(PanelConst.PANEL_SHOW_TAG_CLASS_NAME);

    krpano.removehotspot(name);
    const filterData = listTagLocalStorage.length > 0 ? listTagLocalStorage.filter((item) => item.name !== name) : [];

    setLocalStorage(LocalStorageConst.TAG_HOTSPOT, filterData);
  } else {
    return;
  }
}

export function editTag() {
  closePanelShowInfo(PanelConst.PANEL_SHOW_NOTE_CLASS_NAME);
  showTagEditorPanel();
  $(".panel-edit-tag .h6").innerText = "Update Tag";
  const btnCancle = $("#btn-cancel-tag");
  btnCancle.setAttribute("onclick", "hideTagEditorPanel()");

  const btnSave = $("#btn-save-tag");
  btnSave.setAttribute("onclick", "handleSaveTag(true)");

  const dataTag = btnSave.getAttribute("data-tag");
  const currentHotspot = krpano.hotspot.getArray().find((item) => item.name === dataTag);

  $(".text-input-title").value = convertHTMLCodeToSingleQuote(currentHotspot.title);
  $(".text-area-desc").value = currentHotspot.desc;
  $(".text-input-link-text").value = currentHotspot.linkname;
  $(".text-input-link-url").value = currentHotspot.link;
}

// click tag button on the right sidebar
export function handleClickTag() {
  const btnStartAddTag = $(".btn-start-add-tag");
  $(".icon-start-add-tag").classList.remove("fa-rotate-45");
  handleClickFeatureOnRightSidebar(FeatureConst.FEATURE_NAME.TAG);

  // toggle show floor plan
  showFloorplan(btnStartAddTag.classList.contains("hide"));
}

export function handleClickStartAddTag() {
  const iconStartAddTag = $(".icon-start-add-tag");
  iconStartAddTag.classList.toggle("fa-rotate-45");

  if (iconStartAddTag.classList.contains("fa-rotate-45")) {
    loadCursorTagStyles(true, HotspotConst.HOTSPOT_TYPE.TAG);
  } else {
    handleClickChangeCursor();
  }
}
