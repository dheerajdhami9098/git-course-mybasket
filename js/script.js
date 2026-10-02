/* =====================================================
   MYBASKET APP
===================================================== */


/* =====================================================
   INITIALIZE ICONS
===================================================== */

document.addEventListener("DOMContentLoaded", () => {
  lucide.createIcons();

  initializeCart();
  initializeSearch();
  initializeFilters();
  initializeCategories();
  initializeWishlist();
  initializeNewsletter();
});


/* =====================================================
   CART STATE
===================================================== */

let cart = JSON.parse(
  localStorage.getItem("mybasket-cart")
) || [];


/* =====================================================
   CART INITIALIZATION
===================================================== */

function initializeCart() {

  updateCartUI();

  const cartButton =
    document.getElementById("cartButton");

  const closeCart =
    document.getElementById("closeCart");

  const cartOverlay =
    document.getElementById("cartOverlay");

  const checkoutButton =
    document.getElementById("checkoutButton");


  cartButton.addEventListener(
    "click",
    openCart
  );

  closeCart.addEventListener(
    "click",
    closeCartDrawer
  );

  cartOverlay.addEventListener(
    "click",
    closeCartDrawer
  );

  checkoutButton.addEventListener(
    "click",
    checkout
  );


  /*
   * Add to cart buttons
   */
  document
    .querySelectorAll(".add-cart")
    .forEach(button => {

      button.addEventListener(
        "click",
        () => {

          const name =
            button.dataset.name;

          const price =
            Number(button.dataset.price);

          addToCart(name, price);

        }
      );

    });
}


/* =====================================================
   ADD TO CART
===================================================== */

function addToCart(name, price) {

  const existingProduct =
    cart.find(
      product => product.name === name
    );


  if (existingProduct) {

    existingProduct.quantity++;

  } else {

    cart.push({
      id: Date.now(),
      name,
      price,
      quantity: 1
    });

  }


  saveCart();

  updateCartUI();

  showToast(
    `${name} added to cart`
  );
}


/* =====================================================
   REMOVE FROM CART
===================================================== */

function removeFromCart(id) {

  cart =
    cart.filter(
      product => product.id !== id
    );

  saveCart();

  updateCartUI();
}


/* =====================================================
   UPDATE QUANTITY
===================================================== */

function updateQuantity(id, change) {

  const product =
    cart.find(
      product => product.id === id
    );


  if (!product) {
    return;
  }


  product.quantity += change;


  if (product.quantity <= 0) {

    removeFromCart(id);

    return;

  }


  saveCart();

  updateCartUI();
}


/* =====================================================
   SAVE CART
===================================================== */

function saveCart() {

  localStorage.setItem(
    "mybasket-cart",
    JSON.stringify(cart)
  );

}


/* =====================================================
   UPDATE CART UI
===================================================== */

function updateCartUI() {

  const cartCount =
    document.getElementById("cartCount");

  const cartItems =
    document.getElementById("cartItems");

  const cartTotal =
    document.getElementById("cartTotal");

  const cartItemsText =
    document.getElementById("cartItemsText");


  const totalQuantity =
    cart.reduce(
      (total, product) =>
        total + product.quantity,
      0
    );


  const totalPrice =
    cart.reduce(
      (total, product) =>
        total +
        product.price *
        product.quantity,
      0
    );


  cartCount.textContent =
    totalQuantity;


  cartItemsText.textContent =
    `${totalQuantity} ${
      totalQuantity === 1
        ? "item"
        : "items"
    }`;


  cartTotal.textContent =
    `₹${totalPrice}`;


  if (cart.length === 0) {

    cartItems.innerHTML = `
      <div class="empty-cart">
        <div class="text-5xl">🛒</div>

        <h3 class="font-bold mt-4">
          Your cart is empty
        </h3>

        <p class="text-gray-500 text-sm mt-1">
          Add some fresh products to get started.
        </p>
      </div>
    `;

    return;

  }


  cartItems.innerHTML =
    cart.map(product => {

      return `
        <div class="cart-product">

          <div class="cart-product-image">
            🛍️
          </div>

          <div class="flex-1 min-w-0">

            <h4 class="font-bold text-sm truncate">
              ${product.name}
            </h4>

            <p class="text-green-600 font-bold mt-1">
              ₹${product.price}
            </p>

            <div class="quantity-controls mt-2">

              <button
                class="quantity-btn"
                onclick="updateQuantity(
                  ${product.id},
                  -1
                )"
              >
                −
              </button>

              <span class="text-sm font-bold">
                ${product.quantity}
              </span>

              <button
                class="quantity-btn"
                onclick="updateQuantity(
                  ${product.id},
                  1
                )"
              >
                +
              </button>

            </div>

          </div>

          <button
            class="text-gray-400 hover:text-red-500"
            onclick="removeFromCart(
              ${product.id}
            )"
          >
            <i data-lucide="trash-2"></i>
          </button>

        </div>
      `;

    }).join("");


  lucide.createIcons();
}


/* =====================================================
   OPEN CART
===================================================== */

function openCart() {

  const drawer =
    document.getElementById("cartDrawer");

  const overlay =
    document.getElementById("cartOverlay");

  const panel =
    document.getElementById("cartPanel");


  drawer.classList.remove(
    "pointer-events-none"
  );

  overlay.classList.remove(
    "opacity-0"
  );

  panel.classList.remove(
    "translate-x-full"
  );

}


/* =====================================================
   CLOSE CART
===================================================== */

function closeCartDrawer() {

  const drawer =
    document.getElementById("cartDrawer");

  const overlay =
    document.getElementById("cartOverlay");

  const panel =
    document.getElementById("cartPanel");


  overlay.classList.add(
    "opacity-0"
  );

  panel.classList.add(
    "translate-x-full"
  );


  setTimeout(() => {

    drawer.classList.add(
      "pointer-events-none"
    );

  }, 300);

}


/* =====================================================
   SEARCH
===================================================== */

function initializeSearch() {

  const desktopSearch =
    document.getElementById(
      "searchInput"
    );

  const mobileSearch =
    document.getElementById(
      "mobileSearchInput"
    );


  desktopSearch.addEventListener(
    "input",
    event => {

      filterProducts(
        event.target.value
      );

      mobileSearch.value =
        event.target.value;

    }
  );


  mobileSearch.addEventListener(
    "input",
    event => {

      filterProducts(
        event.target.value
      );

      desktopSearch.value =
        event.target.value;

    }
  );

}


/* =====================================================
   PRODUCT SEARCH
===================================================== */

function filterProducts(searchTerm) {

  const products =
    document.querySelectorAll(
      ".product-card"
    );


  const search =
    searchTerm
      .toLowerCase()
      .trim();


  products.forEach(product => {

    const productText =
      product.textContent
        .toLowerCase();


    if (
      productText.includes(search)
    ) {

      product.style.display =
        "";

    } else {

      product.style.display =
        "none";

    }

  });

}


/* =====================================================
   PRODUCT FILTERS
===================================================== */

function initializeFilters() {

  const buttons =
    document.querySelectorAll(
      ".filter-btn"
    );


  buttons.forEach(button => {

    button.addEventListener(
      "click",
      () => {

        buttons.forEach(btn =>
          btn.classList.remove(
            "active"
          )
        );


        button.classList.add(
          "active"
        );


        const filter =
          button.dataset.filter;


        const products =
          document.querySelectorAll(
            ".product-card"
          );


        products.forEach(product => {

          if (
            filter === "all" ||
            product.dataset.category === filter
          ) {

            product.style.display =
              "";

          } else {

            product.style.display =
              "none";

          }

        });

      }
    );

  });

}


/* =====================================================
   CATEGORY BUTTONS
===================================================== */

function initializeCategories() {

  const categories =
    document.querySelectorAll(
      ".category-card"
    );


  categories.forEach(category => {

    category.addEventListener(
      "click",
      () => {

        const categoryName =
          category.dataset.category;


        document
          .getElementById("products")
          .scrollIntoView({
            behavior: "smooth"
          });


        showToast(
          `Showing ${categoryName}`
        );

      }
    );

  });

}


/* =====================================================
   WISHLIST
===================================================== */

function initializeWishlist() {

  document
    .querySelectorAll(".wishlist-btn")
    .forEach(button => {

      button.addEventListener(
        "click",
        () => {

          const icon =
            button.querySelector(
              "svg"
            );


          button.classList.toggle(
            "text-red-500"
          );


          if (
            button.classList.contains(
              "text-red-500"
            )
          ) {

            icon.setAttribute(
              "fill",
              "currentColor"
            );

            showToast(
              "Added to wishlist"
            );

          } else {

            icon.setAttribute(
              "fill",
              "none"
            );

            showToast(
              "Removed from wishlist"
            );

          }

        }
      );

    });

}


/* =====================================================
   NEWSLETTER
===================================================== */

function initializeNewsletter() {

  const form =
    document.getElementById(
      "newsletterForm"
    );

  const input =
    document.getElementById(
      "emailInput"
    );

  const message =
    document.getElementById(
      "newsletterMessage"
    );


  form.addEventListener(
    "submit",
    event => {

      event.preventDefault();


      if (!input.value) {
        return;
      }


      message.classList.remove(
        "hidden"
      );


      input.value = "";


      showToast(
        "Successfully subscribed!"
      );

    }
  );

}


/* =====================================================
   CHECKOUT
===================================================== */

function checkout() {

  if (cart.length === 0) {

    showToast(
      "Your cart is empty"
    );

    return;

  }


  showToast(
    "Checkout coming soon!"
  );

}


/* =====================================================
   TOAST
===================================================== */

let toastTimeout;


function showToast(message) {

  const toast =
    document.getElementById(
      "toast"
    );

  const toastMessage =
    document.getElementById(
      "toastMessage"
    );


  toastMessage.textContent =
    message;


  toast.classList.add(
    "show"
  );


  clearTimeout(
    toastTimeout
  );


  toastTimeout =
    setTimeout(() => {

      toast.classList.remove(
        "show"
      );

    }, 2500);

}


/* =====================================================
   EXPOSE CART FUNCTIONS
   For inline HTML onclick handlers
===================================================== */

window.updateQuantity =
  updateQuantity;

window.removeFromCart =
  removeFromCart;
