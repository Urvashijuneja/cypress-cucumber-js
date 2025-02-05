class BookPage {
  constructor() {
    // 📌 Locators for UI elements
    this.searchField = "input[placeholder='Search books or authors']"; // Search input field
    this.searchDropdown = "span[class='mdc-list-item__primary-text']"; // Search result dropdown items
    this.bookTitle = "div.card-title.my-2 strong"; // Book title displayed on the UI
  }

  /**
   * ✅ Searches for a book using the UI search bar.
   * @param {string} bookName - The name of the book to search for.
   */
  async searchBook(bookName) {
    cy.get(this.searchField).type(bookName); // Type book name in the search field
    cy.get(this.searchDropdown).click(); // Click on the first matching result from dropdown
  }

  /**
   * ✅ Finds a book by title in API response.
   * @param {Array} books - API response containing a list of books.
   * @param {string} bookName - The book name to search for.
   * @returns {Object|null} - Returns the matching book object or `null` if not found.
   */
  findBookInAPIResponse(books, bookName) {
    const matchingBook = books.find(
      (book) => book.title.trim().toLowerCase() === bookName.trim().toLowerCase()
    );

    // 📌 Log matching book details for debugging
    cy.log("matchingBook:", JSON.stringify(matchingBook));

    if (!matchingBook) {
      cy.log(`❌ Book '${bookName}' not found in API Response`);
    } else {
      cy.log(`✅ Book '${bookName}' found in API Response`);
    }
    return matchingBook;
  }

  /**
   * ✅ Validates that the correct book title appears in the UI after searching.
   * @param {Object} book - The book object retrieved from the API.
   */
  verifyBookTitleOnUI(book) {
    cy.get(this.bookTitle, { timeout: 10000 }) // Wait for book title to be visible
      .should("be.visible")
      .invoke("text") // Extracts the text content of the book title
      .then((text) => {
        const expectedTitle = book.title.trim();
        const actualTitle = text.replace(/\s+/g, " ").trim(); // Normalize spaces
        cy.log("Expected Title:", expectedTitle);
        cy.log("Actual Title from UI:", actualTitle);
        expect(actualTitle).to.eq(expectedTitle); // Assertion to check if UI title matches API title
      });

    cy.log(`✅ UI contains book title: '${book.title}'`);
  }

  /**
   * ✅ Adds a book to the cart via API.
   * @param {number} bookId - The ID of the book to add to the cart.
   * @param {string} url - The base URL of the application.
   */
  async addBookViaAPI(bookId, url) {
    let addCartEndpoint = "api/shoppingcart/addToCart/4944/"; // API endpoint for adding books to cart

    // 📌 Send a POST request to add the book to the shopping cart
    cy.request("POST", url + addCartEndpoint + bookId).then((response) => {
      expect(response.status).to.eq(200); // Ensure the response status is 200 (Success)
    });
  }
}

// ✅ Export the BookPage class instance for use in tests
export default new BookPage();
