const badgeElements = document.querySelectorAll(".nav-items .badge");

const addToCartButtonElement = document.querySelector(
  "#product-details button"
);

async function addToCart() {
  const productId = addToCartButtonElement.dataset.identity;

  const csrfToken = addToCartButtonElement.dataset.csrf;
  console.log({ productId, csrfToken });

  let response;
  try {
    response = await fetch("/cart/items", {
      method: "POST",
      body: JSON.stringify({
        productId: productId,
        _csrf: csrfToken,
      }),

      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    alert("Something went wrong!");
    return;
  }

  if (!response.ok) {
    alert("Something went wrong!");
    return;
  }

  const responseData = await response.json();

  const newTotalQuantity = responseData.newTotalItems;
  for (const badgeElement of badgeElements) {
    badgeElement.textContent = newTotalQuantity;
  }
}

addToCartButtonElement.addEventListener("click", addToCart);
