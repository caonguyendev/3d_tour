export function getSelectFloorHTML(obj) { return`
<div class="btn-select-floor" onclick="toggleDropdownSelectFloor(event);">
    <div class="floorselect-box-ui hide">
        <div name="all_floor" class="floor-select-item active" onclick="onClickSelectFloorItem();">All</div>
        <div name="floor2" class="floor-select-item" onclick="onClickSelectFloorItem();">Floor 2</div>
        <div name="floor1" class="floor-select-item" onclick="onClickSelectFloorItem();">Floor 1</div>
    </div>
    <span class="pseudo-tooltip-wrapper" data-title="Floor Selector">
        <img id="floorImage" src="${obj.tilesFloorSvgURL}" alt="Floor Selector Image">
    </span>
</div>
`};

export const floorContainerHTML = `
<div class="floor-container hide" onclick="handleClickFloorContainer();">
  <div class="floor-name">Floor </div>
  <span class="icon-container">
    <i class="fa-solid fa-xmark"></i>
  </span>
</div>
`;

export function toggleDropdownSelectFloor(e) {
  const targetNodeName = "IMG";
  if (e.target.nodeName == targetNodeName) {
    $(".floorselect-box-ui").classList.toggle("hide");
    checkPopupStatusAndToggleTooltip();
  }
}

export function changeFloorImage(floorName) {
  const floorImage = document.getElementById("floorImage");
  if (floorName) {
    const newFloorImageURL = `./images/${floorName}.svg`;
    floorImage.src = newFloorImageURL;
  }
}

export function onClickSelectFloorItem() {
  $(".floorselect-box-ui").classList.add("hide");
  // toggle class active
  Array.from(document.querySelectorAll(".floor-select-item")).forEach((el) =>
    el.classList.remove("active")
  );
  event.target.classList.toggle("active");

  const scenePanoTemplate = SceneConst.SCENE_PANO_TEMPLATE;
  const activeFloor = $(".floor-select-item.active");
  const activeFloorName = activeFloor.getAttribute("name");
  const currentScene = krpano?.xml?.scene;
  changeFloorImage(activeFloorName);

  // set current floor
  closureCurrentFloor().set(activeFloorName);

  // show label follow floor and scene
  showLabelHotspot(currentScene.includes(SceneConst.SCENE_DOLLHOUSE_TEMPLATE) || currentScene.includes(SceneConst.SCENE_FLOORPLAN_TEMPLATE));

  // if click select floor in pano scene
  if (currentScene.includes(scenePanoTemplate)) {
    const currentHotspot = hotspotList.find(
      (hotspot) => hotspot.scene == currentScene
    );

    // if the current hotspot on the selected floor -> do not find and load nearest scene
    if (currentHotspot.floor == activeFloorName) return;

    const allHotspotOnSelectedFloor = hotspotListOnFloor.filter(
      (hotspot) => hotspot.floor == activeFloorName
    );

    const nearestHotspotOnSelectedFloor = findNearestHotspotOnSelectedFloor(
      currentHotspot,
      allHotspotOnSelectedFloor
    );

    const sceneName = `${scenePanoTemplate}${nearestHotspotOnSelectedFloor.id}`;
    loadPanoScene(sceneName);
    return;
  }

  const isDollhouseHidden = $(".btn-dollhouse").classList.contains("hide")
    ? true
    : false;
  const isFloorplanHidden = $(".btn-floorplan").classList.contains("hide")
    ? true
    : false;

  if (isFloorplanHidden) {
    loadFloorSceneBySelectedFloor();
  }

  if (isDollhouseHidden) {
    loadFloorSceneBySelectedFloor(true);
  }
}

export function handleClickFloorContainer() {
  $(".floor-select-item[name='all_floor']").click();
  $(".floor-container").classList.add("hide");
}
