Feature: BookCart Application - User Login, Book Search, and API-Based Cart Management

  Scenario: User logs in via UI, searches books via API, adds multiple books to cart via API and checkout

    Given The user logs in using UI with username "johnsmith" and password "Johnsmith1234"
    Then The UI should reflect that the user is logged in successfully

    When The user searches a book using API
    Then The UI should display the book retrieved from API

    When The user adds the following books to the cart using API:
      | bookId | 
      | 2      | 
      | 6      |
    #Bookname for bookid 2 is "Harry Potter and the Chamber of Secrets"
    #Bookname for bookid 6 is "Harry Potter and the Half-Blood Prince"

    Then The UI cart should show the updated item count
    And verify the cart total is correctly calculated 

    When The user proceeds to checkout via UI
    Then The API should confirm that the order has been placed
