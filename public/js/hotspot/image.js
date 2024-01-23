export function addImageHotspot(hotspot, url) {
  const newImageHotspotName = `image_${new Date().valueOf()}`;
  const currentImageHotspot = krpano.addhotspot(newImageHotspotName);
  currentImageHotspot.loadstyle(HotspotConst.HOTSPOT_STYLE.STYLE_IMAGE_HOTSPOT);
  const dataImage = {
    url,
    name: newImageHotspotName,
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
  currentImageHotspot.setvars(dataImage);

  const listImageLocalStorage = getCheckArray(getLocalStorage(LocalStorageConst.IMAGE_HOTSPOT));

  const listImageLocalStorageUpdate = listImageLocalStorage.map((item) => {
    if (item.name == currentImageHotspot.name) {
      return {
        ...item,
        ...dataImage,
      };
    }
    return item;
  });

  listImageLocalStorageUpdate.push(dataImage);

  setLocalStorage(LocalStorageConst.IMAGE_HOTSPOT, listImageLocalStorageUpdate);
}
