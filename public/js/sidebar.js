import { closureIsLoadingBeforeShowPage, updateTextHtml } from "./common.js";
export function getSidebarHTML() {
  return `
<div class="overlay-home hide" onclick="handleClickOverlayHome();">
    <h2 id="title"></h2>
    <div class="overlay-content-center">
    <div class="btn-play">
        <i class="fa-solid fa-play"></i>
    </div>
    <div class="text" id="titleButtonPlay"></div>
    </div>
</div>
<div class="location hide" onclick="showSideBar();">
    <div class="presented-by" id="presenter"></div>
    <div class="location-title" >
        <img src="images/location.png" alt="location" />
        <span id="locationTitle"></span>
    </div>
</div>
<div class="sidebar hide">
    <div class="sidebar-container hide">
    <div class="sidebar-header hide">
        <span class="sidebar-header-title" id="sidebarHeaderTitle"></span>
        <a class="sidebar-header-button" onclick="hideSideBar();"><i class="fa-solid fa-xmark"></i></a>
    </div>
    <div class="sidebar-content">
        <img src="" id="sidebarImage"/>
        <div class="sidebar-content-text">
            <div class="sidebar-content-item">
                <span>Name</span>
                <h3 class="sidebar-content-name" id="sidebarContentName">
                </h3>
            </div>
            <div class="sidebar-content-item">
                <span>Address</span>
                <div class="sidebar-content-address" id="sidebarContentAddress"></div>
            </div>
            <div class="sidebar-content-item">
                <span>Presented by</span>
                <div class="sidebar-content-presented-by" id="sidebarContentPresentedBy"></div>
            </div>
            <div class="sidebar-content-item">
                <span class="sidebar-content-contact">Contact</span>
                <div class="sidebar-content-contact-name" id="sidebarContentContactName"></div>
                <div class="sidebar-content-contact-email" id="sidebarContentContactEmail">
                    <a class="link" href="mailto:jhubbard@matterscan.net" id="sidebarContentContactEmailLink"></a>
                </div>
                <div class="sidebar-content-contact-phone" id="sidebarContentContactPhone">
                </div>
            </div>
        </div>
    </div>
    </div>
</div>
`;
}

// <div class="sidebar-content-item">
//     <div class="google-map">
//     <iframe
//         src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1913.1189947697321!2d107.60567009001271!3d16.463482695304897!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3141a111843798b3%3A0xf201be35a88dc367!2sThe%20Manor%20Crown%20Hu%E1%BA%BF!5e0!3m2!1sen!2s!4v1691483439882!5m2!1sen!2s"
//         width="400"
//         height="300"
//         style="border: 0"
//         allowfullscreen=""
//         loading="lazy"
//         referrerpolicy="no-referrer-when-downgrade"
//     ></iframe>
//     </div>
// </div>

export const renderSidebar = async () => {
  let obj = {
    title: "Explore Virtual Staging - Two Bed Home",
    titleButtonPlay: "Explore 3D Space",
    presenter: "Presented by Home3ds",
    locationTitle: "Virtual Staging - Two Bed Home",
    sidebarHeaderTitle: "Space Information",
    sidebarContentName: "Virtual Staging - Two Bed Home",
    sidebarContentAddress: "Hue, Viet Nam",
    sidebarContentPresentedBy: "Home3ds",
    sidebarContentContactName: "Home3ds",
    sidebarContentContactEmailLink: "home3ds@gmail.com",
    sidebarContentContactPhone: "(84) 823-1383-139",
    sidebarImage: "./images/space_image.png",
  };
  closureIsLoadingBeforeShowPage().setIsLoadingBeforeShowPage(true);

  // fetch api để lấy info
  //   await fetch("https://jsonplaceholder.typicode.com/users/1").then(
  //     () =>
  //       (obj = {
  //         title: "Explore Virtual Staging - Two Bed Home",
  //         titleBtnPlay: "Explore 3D Space",
  //         presenter: "Presented by Home3ds",
  //         locationTitle: "Virtual Staging - Two Bed Home",
  //         sidebarHeaderTitle: "Space Information",
  //         sidebarContentName: "Virtual Staging - Two Bed Home",
  //         sidebarContentAddress: "Hue, Viet Nam",
  //         sidebarContentPresentedBy: "Home3ds",
  //         sidebarContentContactName: "Home3ds",
  //         sidebarContentContactEmail: "home3ds@gmail.com",
  //         sidebarContentContactPhone: "(84) 823-1383-139",
  //         sidebarImage: "./images/space_image.png",
  //       }),
  //   );
  closureIsLoadingBeforeShowPage().setIsLoadingBeforeShowPage(false);

  if (obj) {
    const listIdHtml = Object.keys(obj).map((item) => ({ id: item, text: obj[item] }));
    listIdHtml.forEach((item) => {
      updateTextHtml(item);
    });
  }
};
