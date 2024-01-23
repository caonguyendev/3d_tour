// add label hotspot
export function addLabel(hotspot) {
  const newLabelHotspotName = `label_${new Date().valueOf()}`;
  const labelData = {
    text: `Label`,
    keep: true,
    tx: hotspot.tx,
    ty: hotspot.ty,
    tz: hotspot.tz,
    rx: hotspot.rx,
    ry: hotspot.ry,
    rz: hotspot.rz,
    onclick: "jscall(onClickUpLabel(caller, event));",
    onup: "jscall(endDragHotspot(caller));",
    onover: "jscall(onHoverLabel(caller));",
    onout: "jscall(onOutLabel(caller));",
    atfloor: getFloorForHotspot(hotspot.ty),
  };
  const currentLabelHotspot = krpano.addhotspot(newLabelHotspotName);
  currentLabelHotspot.loadstyle(HotspotConst.HOTSPOT_STYLE.STYLE_LABEL_HOTSPOT);
  currentLabelHotspot.setvars(labelData);
  showPopupEditLabel();
  $(".panel-edit-label-content input").value = "Label";
  window.currentAddedLabelHotspot = currentLabelHotspot;
}

// handle event when click cancel btn
export function cancelPanelEditLabel() {
  window?.currentAddedLabelHotspot?.remove();
  hideEditLabelPanel();
}

// handle event when click done btn
export function addContentToLabel() {
  const textLabelValue = $(".panel-edit-label-content input").value;
  const currentAddedLabelHotspot = window.currentAddedLabelHotspot;

  const data = {
    name: currentAddedLabelHotspot.name,
    keep: true,
    tx: currentAddedLabelHotspot.tx,
    ty: currentAddedLabelHotspot.ty,
    tz: currentAddedLabelHotspot.tz,
    rx: currentAddedLabelHotspot.rx,
    ry: currentAddedLabelHotspot.ry,
    rz: currentAddedLabelHotspot.rz,
    onclick: "jscall(onClickUpLabel(caller, event));",
    onup: "jscall(endDragHotspot(caller));",
    onover: "jscall(onHoverLabel(caller));",
    onout: "jscall(onOutLabel(caller));",
    atfloor: getFloorForHotspot(currentAddedLabelHotspot.ty),
  };

  const labelHotspotVar = {
    text: textLabelValue,
  };

  const listLabel = getLocalStorage(LocalStorageConst.LABEL_HOTSPOT);
  const listLabelLocalStorage = getCheckArray(listLabel);

  setLocalStorage(LocalStorageConst.LABEL_HOTSPOT, [...listLabelLocalStorage, { ...labelHotspotVar, ...data }]);

  currentAddedLabelHotspot.setvars(labelHotspotVar);
}

// handle event when click done btn
export function savePanelEditLabel() {
  addContentToLabel();
  hideEditLabelPanel();
  $(".icon-add-label").classList.toggle("fa-rotate-45");
}

// show popup add or edit label
export function showPopupEditLabel() {
  $(".overlay-edit-label-container").classList.remove("hide");
}

// handle event when click button add label (icon +)
export const handleClickStartAddLabel = () => {
  $(".icon-add-label").classList.toggle("fa-rotate-45");
  if ($(".icon-add-label").classList.contains("fa-rotate-45")) {
    handleOnClickFloorplan();
    loadCursorTagStyles(true, HotspotConst.HOTSPOT_TYPE.LABEL);
  } else {
    handleClickChangeCursor();
  }
};

export const closureIsAddingLabelMode = (function () {
  let isAddingLabelMode = false;
  return () => ({
    set: (type = true) => {
      isAddingLabelMode = type;
    },
    get: () => isAddingLabelMode,
  });
})();

// change cursor to default
export const handleClickChangeCursor = () => {
  loadCursorTagStyles(false);
  loadCursorHotspotStyle();
};

// handle event when click onto label
export function onClickUpLabel(caller, event) {
  startDragHotspot(caller, event);
}

// show or hidden all label when click view dollhouse or view floorplan
export function showLabelHotspot(isVisible = true) {
  const currentFloor = closureCurrentFloor().get();

  krpano.hotspot
    .getArray()
    .filter((i) => i?.name?.includes(HotspotConst.HOTSPOT_TYPE.LABEL))
    .forEach((i) => {
      i.visible = isVisible && (currentFloor?.includes(i?.atfloor) || currentFloor === HotspotConst.FLOORS.ALL_FLOOR);
    });
}
