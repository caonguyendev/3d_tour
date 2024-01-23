export function addVideoHotspot(hotspot, videourl) {
  const newVideoHotspotName = `video_${new Date().valueOf()}`;
  const currentVideoHotspot = krpano.addhotspot(newVideoHotspotName);
  currentVideoHotspot.loadstyle(HotspotConst.HOTSPOT_STYLE.STYLE_VIDEO_HOTSPOT);
  const dataVideo = {
    videourl,
    name: newVideoHotspotName,
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

  currentVideoHotspot.setvars(dataVideo);

  const listVideoLocalStorage = getCheckArray(getLocalStorage(LocalStorageConst.VIDEO_HOTSPOT));

  const listVideoLocalStorageUpdate = listVideoLocalStorage.map((item) => {
    if (item.name == currentVideoHotspot.name) {
      return {
        ...item,
        ...dataVideo,
      };
    }
    return item;
  });

  listVideoLocalStorageUpdate.push(dataVideo);

  setLocalStorage(LocalStorageConst.VIDEO_HOTSPOT, listVideoLocalStorageUpdate);
}
