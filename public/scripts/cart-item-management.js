const cartItemUpdateFormElements = document.querySelectorAll(
  ".cart-item-management"
);

async function updateCartItem(event) {
  event.preventDefault();

  const form = event.target;

  const productId = form.dataset.productid;
  const csrfToken = form.dataset.csrf;
  const quantity = form.firstElementChild.value;

  let response;
  try {
    response = await fetch("/cart/items", {
      method: "PATCH",
      body: JSON.stringify({
        productId: productId,
        quantity: quantity,
        _csrf: csrfToken,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    alert("Something Went Wrong!");
    return;
  }

  if (!response.ok) {
    alert("Something Went Wrong!");
    return;
  }

  const responseData = await response.json();

  if (responseData.updatedCartData.updatedItemData == 0) {
    form.parentElement.parentElement.remove();
  } else {
    const totalItemPriceElement =
      form.parentElement.querySelector(".total-item-price");
    totalItemPriceElement.textContent =
      responseData.updatedCartData.updatedItemData.toFixed(2);
  }

  const cartTotalPriceElement = document.getElementById("Cart-total-price");

  cartTotalPriceElement.textContent =
    responseData.updatedCartData.newTotalPrice.toFixed(2);

  const cartBadgeElements = document.querySelectorAll(".nav-items .badge");
  for (const cartBadgeElement of cartBadgeElements) {
    cartBadgeElement.textContent =
      responseData.updatedCartData.newTotalQuantity;
  }
}

for (const formElement of cartItemUpdateFormElements) {
  formElement.addEventListener("submit", updateCartItem);
}
