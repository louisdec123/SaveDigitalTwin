require([
  "esri/views/SceneView",
  "esri/WebScene",
  "esri/widgets/BasemapGallery",
  "esri/widgets/Expand",
  "esri/widgets/Search"
  
], (SceneView, WebScene, BasemapGallery, Expand, Search) => {
  /************************************************************
   * Creates a new WebScene instance. A WebScene can reference
   * a PortalItem ID that represents a WebScene saved to
   * arcgis.com or an on-premise portal.
   *
   * To load a WebScene from an on-premise portal, set the portal
   * url with esriConfig.portalUrl (see above).
   ************************************************************/
  const scene = new WebScene({
    portalItem: {
      // autocasts as new PortalItem()
      id: "b9d002eb7e474ba5a97ea039dcfb3005"
    }
  });

  /************************************************************
   * Set the WebScene instance to the map property in a
   * SceneView.
   ************************************************************/
  const view = new SceneView({
    map: scene,
    container: "viewDiv"
  });

  // add basemapGallery widgets
  view.ui.add(
    [
      new Expand({
        content: new BasemapGallery({
          view: view
        }),
        view: view
      })
    ],
    "top-left"
  );
  const search = new Search({  //Add Search widget
view: view
});

view.ui.add(search, "top-right");

  
  view.when(() => {
    // When the webscene and view resolve, display the webscene's
    // new title in the Div
    const title = document.getElementById("webSceneTitle");
    const save = document.getElementById("saveWebScene");
    save.disabled = false;
    save.addEventListener("click", () => {
      document.getElementById("saveWebScene").disabled = true;
      document
        .getElementById("saveWebScene")
        .classList.add("esri-button--secondary");

      // item automatically casts to a PortalItem instance by saveAs
      const item = {
        title: title.value
      };

      // Update properties of the WebScene related to the view.
      // This should be called just before saving a webscene.
      scene.updateFrom(view).then(() => {
        scene
          .saveAs(item)
          // Saved successfully
          .then((item) => {
            // link to the newly-created web scene item
            const itemPageUrl =
              item.portal.url + "/home/item.html?id=" + item.id;
            const link =
              '<a target="_blank" href="' +
              itemPageUrl +
              '">' +
              title.value +
              "</a>";

            statusMessage(
              "Save WebScene",
              "<br> Successfully saved as <i>" + link + "</i>"
            );
          })
          // Save didn't work correctly
          .catch((error) => {
            statusMessage("Save WebScene", "<br> Error " + error);
          });
      });
    });

    const overlay = document.getElementById("overlayDiv");
    const ok = overlay.getElementsByTagName("input")[0];

    function statusMessage(head, info) {
      document
        .getElementById("saveWebScene")
        .classList.remove("esri-button--secondary");
      document.getElementById("saveWebScene").disabled = false;
      document.getElementById("head").innerHTML = head;
      document.getElementById("info").innerHTML = info;
      overlay.style.visibility = "visible";
    }

    ok.addEventListener("click", () => {
      overlay.style.visibility = "hidden";
    });

    view.ui.add("sidebarDiv", "top-right");
  });
});