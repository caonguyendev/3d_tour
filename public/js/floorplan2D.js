export function getFloorPlanButtonContainerHTML(obj) {
  return `
<div class="floorplan-button-container hide">
  <span class="btn-close-plan" data-title="Close plan" onclick="closeFloorplan();"><img src="${obj.close1SvgURL}" alt="Close Plan Image"></span>
  <span class="btn-fullscreen-plan hide-on-mobile" data-title="Full screen" onclick="openPopupPlan();"><img src="${obj.fullscreen1SvgURL}" alt="Fullscreen Plan Image"></span>
  <span class="btn-rotate-plan-to-right" data-title="Rotate" onclick="rotatePlansToRight();"><img src="${obj.rotateRightSvgURL}" alt="Rotate Plan To Right Image"></span>
  <span class="btn-rotate-plan-to-left" data-title="Rotate" onclick="rotatePlansToRight(false);"><img src="${obj.rotateLeftSvgURL}" alt="Rotate Plan To Left Image"></span>
</div>
`;
}

export function openPopupPlan() {
  krpano.call("openPopupFP();");
  $(".plan-container").classList.add("popup-mode");
  $("#krpanoSWFObject div:first-child").classList.toggle("increase-z-index");
}

export function showFloorplan(isShow = true) {
  const btnImageFloorplan = krpano.layer.getItem("open_flpl_b");
  const floorPlanContainer = krpano.layer.getItem("cont_fp_all");

  if (isShow) {
    btnImageFloorplan.visible = true;
    floorPlanContainer.visible = true;
    if (+$(".plan-container").style?.opacity !== 0) {
      $(".floorplan-button-container").classList.remove("hide");
    }
    return;
  }
  btnImageFloorplan.visible = false;
  floorPlanContainer.visible = false;
  $(".floorplan-button-container").classList.add("hide");
}

export function closeFloorplan() {
  krpano.call("close_flpl()");
}

export function rotatePlansToRight(toRight = true) {
  const rotationAmount = 90;
  const rotateImagePlan1 = krpano.layer.getItem("plan_1");
  const rotateImagePlan2 = krpano.layer.getItem("plan_2");
  const currentRotateValueImagePlan = rotateImagePlan1.rotate;

  // Calculate the new rotation value while keeping it within a 360-degree range
  const newRotateValueImagePlan = toRight
    ? (currentRotateValueImagePlan + rotationAmount) % 360
    : (currentRotateValueImagePlan - rotationAmount) % 360;

  // Apply the new rotation values
  rotateImagePlan1.rotate = newRotateValueImagePlan;
  rotateImagePlan2.rotate = newRotateValueImagePlan;
}

export function updateHeightFloorButtonContainer(start_h) {
  let planHeight;
  if (start_h) {
    planHeight = krpano.layer.getArray().filter((plan) => plan.style == "style_plan")[0].start_h;
    $(".floorplan-button-container").style.height = `${planHeight}px`;
    return;
  }
  planHeight = $(".plan-layer").style.height;
  $(".floorplan-button-container").style.height = planHeight;
}
