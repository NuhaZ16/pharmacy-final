
document.addEventListener("DOMContentLoaded", () => {
    let order = [];
    let totalPrice = 0;
  
    // Handle quantity increment and decrement
    const quantityButtons = document.querySelectorAll(".quantity-btn");
  
    quantityButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const inputField = button.parentElement.querySelector("input[type='number']");
        let currentValue = parseInt(inputField.value) || 0;
  
        if (button.textContent === "+") {
          inputField.value = currentValue + 1;
        } else if (button.textContent === "-" && currentValue > 1) {
          inputField.value = currentValue - 1;
        }
      });
    });
  
    // Handle "Add to Cart" button
    const addToCartButtons = document.querySelectorAll(".add-to-cart");
    const cartTableBody = document.querySelector("table tbody");
  
    addToCartButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const productCard = button.closest(".product-card");
        const productName = productCard.querySelector("h3").textContent;
        const productPrice = parseFloat(
          productCard.querySelector(".product-price").textContent.replace("Rs", "").trim()
        ) || 0;
        const productQuantity = parseInt(productCard.querySelector("input[type='number']").value) || 1;
  
        // Check if the product is already in the cart
        const existingRow = Array.from(cartTableBody.querySelectorAll("tr")).find(
          (row) => row.querySelector("td:first-child").textContent === productName
        );
  
        if (existingRow) {
          const quantityCell = existingRow.querySelector("td:nth-child(4)");
          const totalCell = existingRow.querySelector("td:nth-child(5)");
          const newQuantity = parseInt(quantityCell.textContent) + productQuantity;
          quantityCell.textContent = newQuantity;
          totalCell.textContent = `Rs ${(newQuantity * productPrice).toFixed(2)}`;
        } else {
          // Add new row to the cart table
          const newRow = document.createElement("tr");
          newRow.innerHTML = `
            <td>${productName}</td>
            <td><img src="${productCard.querySelector("img").src}" alt="${productName}" class="table-img"></td>
            <td>Rs ${productPrice.toFixed(2)}</td>
            <td>${productQuantity}</td>
            <td>Rs ${(productPrice * productQuantity).toFixed(2)}</td>
            <td><button class="remove-btn">Remove</button></td>
          `;
          cartTableBody.appendChild(newRow);
  
          // Add remove functionality to the "Remove" button
          newRow.querySelector(".remove-btn").addEventListener("click", () => {
            newRow.remove();
            updateCartSummary();
          });
        }
  
        // Update cart summary
        updateCartSummary();
      });
    });
  
    // Update total price in the cart summary
    const updateCartSummary = () => {
      const cartSummary = document.querySelector(".cart-summary span");
      totalPrice = Array.from(cartTableBody.querySelectorAll("tr")).reduce((total, row) => {
        const totalCell = row.querySelector("td:nth-child(5)");
        return total + parseFloat(totalCell.textContent.replace("Rs", "").trim());
      }, 0);
      cartSummary.textContent = `Total Price: Rs ${totalPrice.toFixed(2)}`;
    };
  
    // Attach event listeners to the buttons
    const buyButton = document.querySelector(".buy-btn");
    const favButton = document.querySelector(".fav-btn");
    const applyFavButton = document.querySelector(".apply-fav-btn");
  
    if (buyButton) buyButton.addEventListener("click", () => {
      document.querySelector(".buy-btn").addEventListener("click", () => {
        const cartItems = Array.from(document.querySelectorAll("table tbody tr")).map((row) => ({
          name: row.querySelector("td:first-child").textContent,
          price: row.querySelector("td:nth-child(3)").textContent,
          quantity: row.querySelector("td:nth-child(4)").textContent,
          total: row.querySelector("td:nth-child(5)").textContent,
        }));
      
        const total = document.querySelector(".cart-summary span").textContent;
      
        // Save to localStorage
        localStorage.setItem("cartItems", JSON.stringify(cartItems));
        localStorage.setItem("total", total);
      
        // Redirect to OrderSummary.html
        window.location.href = "OrderSummary.html";
      });
      
    });
  
    if (favButton) favButton.addEventListener("click", () => {
      const favourites = Array.from(cartTableBody.querySelectorAll("tr")).map((row) => {
        const productName = row.querySelector("td:first-child").textContent;
        const productPrice = row.querySelector("td:nth-child(3)").textContent.replace("Rs", "").trim();
        const productQuantity = row.querySelector("td:nth-child(4)").textContent;
        return { name: productName, price: productPrice, quantity: productQuantity };
      });
  
      localStorage.setItem("favourites", JSON.stringify(favourites));
      alert("Favourites saved successfully!");
    });
  
    if (applyFavButton) applyFavButton.addEventListener("click", () => {
      const favourites = JSON.parse(localStorage.getItem("favourites") || "[]");
  
      if (favourites.length === 0) {
        alert("No favourites to apply!");
        return;
      }
  
      favourites.forEach((favourite) => {
        const existingRow = Array.from(cartTableBody.querySelectorAll("tr")).find(
          (row) => row.querySelector("td:first-child").textContent === favourite.name
        );
  
        if (existingRow) {
          const quantityCell = existingRow.querySelector("td:nth-child(4)");
          const totalCell = existingRow.querySelector("td:nth-child(5)");
          const newQuantity = parseInt(quantityCell.textContent) + parseInt(favourite.quantity);
          quantityCell.textContent = newQuantity;
          totalCell.textContent = `Rs ${(newQuantity * parseFloat(favourite.price)).toFixed(2)}`;
        } else {
          const newRow = document.createElement("tr");
          newRow.innerHTML = `
            <td>${favourite.name}</td>
            <td></td>
            <td>Rs ${parseFloat(favourite.price).toFixed(2)}</td>
            <td>${favourite.quantity}</td>
            <td>Rs ${(parseFloat(favourite.price) * parseInt(favourite.quantity)).toFixed(2)}</td>
            <td><button class="remove-btn">Remove</button></td>
          `;
          cartTableBody.appendChild(newRow);
  
          newRow.querySelector(".remove-btn").addEventListener("click", () => {
            newRow.remove();
            updateCartSummary();
          });
        }
      });
  
      updateCartSummary();
      alert("Favourites applied successfully!");
    });
  });

  
  document.getElementById("order-form").addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent form submission to validate first
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const address = document.getElementById("address").value.trim();
    const date = document.getElementById("date").value;
    const card = document.getElementById("card").value.trim();
    const expiry = document.getElementById("expiry").value;
    const cvv = document.getElementById("cvv").value.trim();
  
    // Validation logic
    if (!name.match(/^[A-Za-z\s]+$/)) {
      alert("Name must only contain letters and spaces.");
      return;
    }
    if (address.length < 10) {
      alert("Address must be at least 10 characters long.");
      return;
    }
    if (card.length !== 16 || !/^\d{16}$/.test(card)) {
      alert("Card number must be exactly 16 digits.");
      return;
    }
    if (!/^\d{3}$/.test(cvv)) {
      alert("CVV must be exactly 3 digits.");
      return;
    }
    
    // Check if delivery date is in the future
    const currentDate = new Date();
    const selectedDate = new Date(date);
    if (selectedDate <= currentDate) {
      alert("Delivery date must be in the future.");
      return;
    }
  
    // If all fields are valid
    alert(`Thank you for your purchase! Your order will be delivered on ${date}.`);
  });
  