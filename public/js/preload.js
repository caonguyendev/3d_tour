function krpanoplugin() {
  var local = this;
  var krpano, plugin;
  const previewArray = [];
  let images = new Array();
  let preloadImages = [];
  

  local.registerplugin = async function (krpanointerface, pluginpath, pluginobject) {
    krpano = krpanointerface;
    path = pluginpath;
    plugin = pluginobject;

    plugin.registerattribute("maxlevel", null);
    plugin.percentage = 0;

    preloadStart();
  };

  async function preloadStart() {
    const sceneArray = krpano.scene.getArray();
    const sideArray = [];
    const textureImages = [
      'dollhouse/d74ba3d5dc4e45f0a9acfdd433142368_50k_000.jpg',
      'dollhouse/d74ba3d5dc4e45f0a9acfdd433142368_50k_001.jpg',
      'dollhouse/d74ba3d5dc4e45f0a9acfdd433142368_50k_002.jpg',
      'dollhouse/d74ba3d5dc4e45f0a9acfdd433142368_50k_003.jpg',
    ];

    sceneArray.forEach((scene) => {
      // get preview url
      if (scene.content.match(/preview\s+url=\".*.\"/)) {
        const preview = scene.content
          .match(/preview\s+url=\".*.\"/)[0]
          .match(/\".*.\"/)[0]
          .replace(/\"/g, "");
        previewArray.push(preview);
      }

      // get cube url
      let panoURL = null;
      let cube = scene.content.match(/cube\s+url=\".*.\"/);
      cube && (panoURL = cube[0]);
      if (panoURL) {
        panoURL = panoURL.match(/\".*.jpg\"/)[0].replace(/\"/g, "");
        
        if (cube) {
          const imageSides = ["l", "f", "r", "b", "u", "d"];
          imageSides.forEach((imageSide) => {
            const convertedFolderImageURL = panoURL.replace(/%s/g, imageSide);
            sideArray.push(convertedFolderImageURL);
          });
        } 
      }
    });

    const panoImages = previewArray.concat(sideArray);
    window.panoImages = panoImages;
    // set default scene
    const defaultScene = "scene_pano4";
    krpano.prevscene = getLocalStorage("startLocation") ? getLocalStorage("startLocation") : defaultScene;
    // get nearby pano images
    const startHotspot = `hotspot_${krpano.prevscene.split(SceneConst.SCENE_PANO_TEMPLATE)[1]}`;
    const nearbyPanoImages = getNearbyPanoImages(startHotspot, hotspotList, panoImages, true);
    preloadImages = preloadImages.concat(textureImages, nearbyPanoImages);

    await preload_images(preloadImages);
  }

  function updateProgress(loadedCount) {
    const percentage = Number(((loadedCount / preloadImages.length) * 100).toFixed(2));
    preload_progress(percentage);
  };

  async function preload_images(arr) {
    let i = 0;
    for await(const imageURL of arr) {
      let imgExp = new Image();
      imgExp.src = imageURL;
      images.push(imgExp);

      imgExp.onload = () => {
        i++;
        updateProgress(i);  
      };

      imgExp.onerror = () => {
        i++;
        updateProgress(i);
      };
    }
  }

  function preload_progress(percentage) {
    plugin.percentage = percentage;
    plugin.triggerevent("onloading");
  }
}
