import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";
import LoginPage from "../../pages/LoginPage";
import BookPage from "../../pages/BookPage";
import CartPage from "../../pages/CartPage";

// 📌 Get the application base URL from Cypress environment variables
let url = Cypress.env("url");

// 📌 Define the book name that will be used in search
const bookName = "A Princess in Theory: Reluctant Royals";

// ✅ UI Login Step
Given("The user logs in using UI with username {string} and password {string}", (username, password) => {
  //LoginPage.launchURL("https://bookcart.azurewebsites.net/");
  LoginPage.launchURL(url);
  LoginPage.validLogin(username, password);
});

//✅ Then the UI should reflect that the user is logged in successfully.
Then("The UI should reflect that the user is logged in successfully", () => {
  LoginPage.verifyLoginSuccess();
});

// ✅ API Search for Books
When("The user searches a book using API", () => {
  // ✅ Intercept API that fetches book list
  cy.intercept("GET", "/api/book/").as("searchAPI");

  // ✅ Type search query in UI
  BookPage.searchBook(bookName);
});

// ✅ Then the UI should display the book retrieved from API.
Then("The UI should display the book retrieved from API", () => {

  cy.wait("@searchAPI").then((interception) => {
    expect(interception.response.statusCode).to.eq(200);

    const books = interception.response.body;
    expect(books).to.be.an("array").that.is.not.empty;

    // ✅ Log full API response
    cy.log("📢 API Response:", JSON.stringify(books, null, 2));

    // Find the book in API response
    const matchingBook = BookPage.findBookInAPIResponse(books, bookName);

    // Assert the book exists in the API response
    expect(matchingBook, `Book '${bookName}' not found in API response....`).to.exist;

    // If the book is found, verify its title on the UI
    if (matchingBook) {
      BookPage.verifyBookTitleOnUI(matchingBook);
    }
  });
});

// ✅ API Add to Cart
When("The user adds the following books to the cart using API:", (dataTable) => {
  let deleteCartEndpoint = "api/shoppingcart/4944/";

  // Clear previous cart and session data
  cy.clearLocalStorage();
  cy.clearCookies();

  // Send DELETE request to clear the cart
  cy.request("DELETE", url + deleteCartEndpoint).then(
    (response) => {
      expect(response.status).to.eq(200);
    })

  // Iterate through each bookId in the data table and add dynamically
  dataTable.hashes().forEach((row) => {
    BookPage.addBookViaAPI(row.bookId, url);
  });
});

// ✅ Verify Cart Count & Total
Then("The UI cart should show the updated item count", () => {
  CartPage.verifyCartItemCount(2);
});

// ✅ Then verify the cart total is correctly calculated.
Then("verify the cart total is correctly calculated", () => {
  CartPage.calculateTotal();
});

// ✅ Checkout via UI
When("The user proceeds to checkout via UI", () => {
  CartPage.proceedToCheckout();
});

// ✅ API Verification for Order Placement
Then("The API should confirm that the order has been placed", () => {
  // Place order through UI
  CartPage.placeOrder();
  // Verify the order placement using API
  CartPage.verifyOrderPlacement(url);
});