AFRAME.registerComponent("markerhandler", {
  init: async function () {
    var toys = await this.getToys();
    console.log(toys);
    var scene = document.querySelector("#main-scene");

    toys.map((toy) => {
      // console.log(dish)
      var marker = document.createElement("a-marker");
      marker.setAttribute("id", toy.id);
      marker.setAttribute("type", "pattern");
      marker.setAttribute("url", toy.marker_pattern);
      marker.setAttribute("cursor", {
        rayOrigin: "mouse",
      });
      marker.setAttribute("addmarker", {});
      scene.appendChild(marker);
      console.log(marker);

      var model = document.createElement("a-entity");
      model.setAttribute("id", `model-${toy.id}`);
      model.setAttribute("position", toy.model.position);
      model.setAttribute("rotation", toy.model.rotation);
      model.setAttribute("scale", toy.model.scale);

      model.setAttribute("gltf-model", `url(${toy.model_url})`);
      model.setAttribute("gesture-handler", {});
      model.setAttribute("visible", false);
      marker.appendChild(model);
      //   console.log(model)

      var mainplane = document.createElement("a-plane");
      mainplane.setAttribute("position", { x: 0, y: 0, z: 0 });
      mainplane.setAttribute("width", 2.3);
      mainplane.setAttribute("height", 2.5);
      mainplane.setAttribute("rotation", { x: -90, y: 0, z: 0 });
      mainplane.setAttribute("id", `main_plane-${toy.id}`);
      // console.log(mainplane)
      mainplane.setAttribute("visible", false);

      marker.appendChild(mainplane);

      var titleplane = document.createElement("a-plane");
      titleplane.setAttribute("position", { x: 0, y: 1.1, z: 0.1 });
      titleplane.setAttribute("width", 2.31);
      titleplane.setAttribute("height", 0.4);
      titleplane.setAttribute("rotation", { x: 0, y: 0, z: 0 });
      titleplane.setAttribute("material", { color: "orange" });
      titleplane.setAttribute("id", `main_plane-${toy.id}`);
      // console.log(titleplane)
      mainplane.appendChild(titleplane);

      var toyTitle = document.createElement("a-entity");
      toyTitle.setAttribute("position", { x: 1.3, y: 0, z: 0.1 });
      toyTitle.setAttribute("rotation", { x: 0, y: 0, z: 0 });
      toyTitle.setAttribute("text", {
        value: toy.toy_name.toUpperCase(),
        width: 4.5,
        height: 3,
        align: "left",
        font: "monoid",
        color: "black",
      });
      toyTitle.setAttribute("id", `toy_title-${toy.id}`);

      // console.log(dishTitle)
      titleplane.appendChild(toyTitle);

      var toysDescription = document.createElement("a-entity");
      toysDescription.setAttribute("position", { x: 0.1, y: 0, z: 0.1 });
      toysDescription.setAttribute("rotation", { x: 0, y: 0, z: 0 });
      toysDescription.setAttribute("text", {
        value: `${toy.toysDescription.join("\n\n")}`,
        width: 2,
        height: 5,
        align: "left",
        font: "monoid",
        color: "black",
      });
      toysDescription.setAttribute("id", `toysDescription-${toy.id}`);
      mainplane.appendChild(toysDescription);

      var priceplane = document.createElement("a-entity");
      priceplane.setAttribute("id", `priceplane-${toy.id}`);
      priceplane.setAttribute(
        "src",
        "https://raw.githubusercontent.com/whitehatjr/menu-card-app/main/black-circle.png"
      );
      priceplane.setAttribute("width", 0.6);
      priceplane.setAttribute("height", 0.6);
      priceplane.setAttribute("rotation", { x: -90, y: 0, z: 0 });
      priceplane.setAttribute("position", { x: 2, y: 0, z: 0 });
      priceplane.setAttribute("visible", false);

      // price of dish
      var price = document.createElement("a-entity");
      price.setAttribute("id", `price-${toy.id}`);
      price.setAttribute("rotation", { x: 0, y: 0, z: 0 });
      price.setAttribute("position", { x: 0.03, y: 0.05, z: 0.01 });

      price.setAttribute("text", {
        value: `only\n $${toy.price}`,
        width: 3,
        align: "center",
        font: "monoid",
        color: "black",
      });

      priceplane.appendChild(price);
      marker.appendChild(priceplane);
    });
  },

  getToys: async function () {
    return await firebase
      .firestore()
      .collection("toys")
      .get()
      .then((snapshot) => {
        return snapshot.docs.map((doc) => doc.data());
      });
  },
});
