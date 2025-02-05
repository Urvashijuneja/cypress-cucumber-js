class LoginPage {
  constructor() {
    // 📌 Locators for UI elements
    this.usernameField = "input[placeholder='Username']"; // Locator for username input field
    this.passwordField = "input[placeholder='Password']"; // Locator for password input field
    this.loginLink = "button:contains('Login')"; // Locator for the Login button (to open login form)
    this.loginButton = "mat-card form button"; // Locator for the Login button inside login form
  }

  /**
   * ✅ Launches the application by navigating to the specified URL.
   * @param {string} url - The base URL of the application.
   */
  async launchURL(url) {
    cy.visit(url);
  }

  /**
   * ✅ Performs a valid login by entering credentials and submitting the form.
   * @param {string} username - The username to enter in the login form.
   * @param {string} password - The password to enter in the login form.
   */
  async validLogin(username, password) {
    cy.get(this.loginLink).click(); // Click on the Login button to open login form
    cy.get(this.usernameField).type(username); // Type the username
    cy.get(this.passwordField).type(password); // Type the password
    cy.get(this.loginButton).click(); // Click the login button
  }

  /**
   * ✅ Verifies if the user is successfully logged in by checking the displayed username.
   */
  async verifyLoginSuccess() {
    let username = 'johnsmith'; // Expected logged-in username
    cy.get("a.mat-mdc-menu-trigger span.mdc-button__label")
      .should("contain.text", username); // Assert that the username is displayed in UI
  }
}

// ✅ Export the LoginPage class instance for use in tests
export default new LoginPage();
