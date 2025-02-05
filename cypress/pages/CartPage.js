class CartPage {
  constructor() {
    // 📌 Locators for UI elements
    this.cartTotal = ".cart-total"; // Locator for total cart price displayed
    this.cartCount = "mat-icon.mat-badge.mat-badge-warn span.mat-badge-content"; // Locator for cart item count
    this.cartButton = "button:has(mat-icon.mat-badge.mat-badge-warn)"; // Locator for cart button
    this.checkoutButton = "button:contains('CheckOut')"; // Checkout button
    this.bookPrice = "tbody tr td:nth-child(5)"; // Locator for individual book price in cart
    this.totalPrice = "mat-card-content[class='mat-mdc-card-content ng-star-inserted'] td:nth-child(5)"; // Locator for total price in summary

    // 📌 Locators for Checkout Form Fields
    this.name = "[Placeholder='Name']";
    this.addressLine1 = "[Placeholder='Address Line 1']";
    this.addressLine2 = "[Placeholder='Address Line 2']";
    this.pinCode = "[Placeholder='Pincode']";
    this.state = "[Placeholder='State']";
    this.placeOrderButton = "button:contains('Place Order')"; // Place Order button
  }

  /**
   * ✅ Fills in checkout form details and places an order.
   */
  async placeOrder() {
    cy.get(this.name).type("John Smith");
    cy.get(this.addressLine1).type("21, South City Road");
    cy.get(this.addressLine2).type("Gurgaon");
    cy.get(this.pinCode).type("122401");
    cy.get(this.state).type("Haryana");
    cy.get(this.placeOrderButton).click();
  }

  /**
   * ✅ Verifies if the cart item count matches the expected count.
   * @param {number} expectedCount - Expected number of items in the cart.
   */
  async verifyCartItemCount(expectedCount) {
    cy.get(this.cartCount, { timeout: 10000 }) // Waits for cart count to be updated
      .eq(1)
      .should("be.visible")
      .should("have.text", expectedCount); // Asserts that the count matches expected

    // Logs and verifies the cart count
    cy.get(this.cartCount)
      .invoke("text")
      .then((cartCount) => {
        cy.log("Cart Count Text:", cartCount.trim());
        expect(parseInt(cartCount.trim(), 10)).to.be.greaterThan(0);
      });
  }

  /**
   * ✅ Calculates the total cart price dynamically and compares with UI total.
   */
  async calculateTotal() {
    cy.get(this.cartButton).eq(1).click(); // Click on the cart button

    let total = 0;

    // 📌 Selects all book price elements and adds them dynamically
    cy.get(this.bookPrice)
      .each(($el) => {
        const price = parseFloat($el.text().replace("₹", "").trim()); // Extract and convert price
        total += price; // Add to total
      })
      .then(() => {
        // 📌 Get the total cart price displayed in the UI and compare
        cy.get(this.totalPrice)
          .invoke("text")
          .then((cartTotal) => {
            const cartTotalValue = parseFloat(cartTotal.replace("₹", "").trim());

            // Log values for debugging
            cy.log("Calculated Total:", total);
            cy.log("Displayed Cart Total:", cartTotalValue);

            // Assertion to check if calculated total matches UI total
            expect(cartTotalValue).to.equal(total);
          });
      });
  }

  /**
   * ✅ Clicks on the Checkout button to proceed.
   */
  async proceedToCheckout() {
    cy.get(this.checkoutButton)
      .should("be.visible")
      .click({ force: true })
      .then(() => {
        cy.log("✅ Checkout button clicked!");
      });
  }

  /**
   * ✅ Verifies order placement by making an API request with authentication.
   * @param {string} url - The base URL of the application.
   */
  async verifyOrderPlacement(url) {
    let loginEndpoint = "api/login"; // API endpoint for user login

    // 📌 First, send a POST request to login and retrieve the auth token
    cy.request({
      method: "POST",
      url: url + loginEndpoint,
      body: {
        username: "johnsmith",
        password: "Johnsmith1234"
      }
    }).then((loginResponse) => {
      const token = loginResponse.body.token; // Extract token from response

      let orderEndpoint = "api/Order/4944/"; // API endpoint for order verification

      // 📌 Send GET request to verify the order using the retrieved token
      cy.request({
        method: "GET",
        url: url + orderEndpoint,
        headers: {
          Authorization: `Bearer ${token}`
        }
      }).then((orderResponse) => {
        expect(orderResponse.status).to.eq(200); // ✅ Ensure the order request is successful
      });
    });
  }
}

// ✅ Export the CartPage class instance for use in tests
export default new CartPage();
