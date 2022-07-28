var userid = null;

AFRAME.registerComponent("addmarker", {
  init: async function () {
    if (userid === null) {
      this.askUserId();
    }
    var toys = await this.getToys();
    this.el.addEventListener("markerFound", () => {
      if (userid !== null) {
        var markerId = this.el.id;
        this.handleMarkerFound(toys, markerId);
      }
    });
    this.el.addEventListener("markerLost", () => {
      this.handleMarkerLost();
    });
  },
  askUserId: function () {
    var iconUrl =
      "https://media.istockphoto.com/vectors/toy-shop-with-shelves-of-toys-big-set-of-colorful-toys-for-children-vector-id1278463840?k=20&m=1278463840&s=612x612&w=0&h=GVgemRr_r55TMxprsnRy6JuXr6qhkrALQDdobpbDvc4=";
    swal({
      title: "Welcome to ToysStore!!",
      icon: iconUrl,
      content: {
        element: "input",
        attributes: {
          placeholder: "Type your order number",
          type: "number",
          min: 1,
        },
      },
      closeOnClickOutside: false,
    }).then((inputValue) => {
      tableNumber = inputValue;
    });
  },
  handleMarkerFound: function (toys, markerId) {
    var toy = toys.filter((toy) => toy.id === markerId)[0];

    if (toy.is_out_of_stock === false) {
      swal({
        icon: "warning",
        title: toy.toy_name.toUpperCase(),
        text: "This Toy is not available today",
        timer: 2500,
        buttons: false,
      });
    } else {
      // changing the model scale
      var model = document.querySelector(`#model-${toy.id}`);
      model.setAttribute("position", toy.model.position);
      model.setAttribute("rotation", toy.model.rotation);
      model.setAttribute("scale", toy.model.scale);
      model.setAttribute("visible", true);

      var toysDescription = document.querySelector(`#main_plane-${toy.id}`);
      toysDescription.setAttribute("visible", true);

      var priceplane = document.querySelector(`#priceplane-${toy.id}`);
      priceplane.setAttribute("visible", true);

      // changing the button visibility
      var buttondiv = document.getElementById("button-div");
      buttondiv.style.display = "flex";
      var orderbutton = document.getElementById("order-button");
      var orderSummarybutton = document.getElementById("order-summary-button");
      orderbutton.addEventListener("click", () => {
        this.handleOrder(userid,toy)
        swal({
          icon: "success",
          title: "thnks for ordering",
          text: " ",
          timer: 1000,
          buttons: false,
        });
      });
      orderSummarybutton.addEventListener("click", () => {
        swal({
          icon: "warning",
          title: "Order Summary",
          text: "Work In Progress",
          timer: 1000,
          buttons: false,
        });
      });
    }
  },
  handleMarkerLost: function () {
    var buttondiv = document.getElementById("button-div");
    buttondiv.style.display = "none";
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
  handleOrder: function (userid, toy) {
    firebase
      .firestore()
      .collection("users")
      .doc(userid)
      .get()
      .then((doc) => {
        var details = doc.data();

        if (details["current_orders"][toy.id]) {
          details["current_orders"][toy.id]["quantity"] += 1;

          var current_Quantity = details["current_orders"][toy.id]["quantity"];

          details["current_orders"][toy.id]["subtotal"] =
            current_Quantity + toy.price;
        } else {
          details["current_orders"][toy.id] = {
            item: toy.toy_name,
            price: toy.price,
            quantity: 1,
            subtotal: toyprice * 1,
          };
        }
        details.Total_bill += toy.price

        firebase
        .firestore()
        .collection("user")
        .doc(doc.id)
        .update(details)
      });
  },
});
