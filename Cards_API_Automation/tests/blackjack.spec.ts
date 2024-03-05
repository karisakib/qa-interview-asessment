import { test, expect } from '@playwright/test';

test.describe('API Testing Deck of Cards with Playwright', () => {
 test('Shuffle deck of cards', async ({ request }) => {
  const numOfDecks = 6;
  const cardsInDeck = 52;
  const response = await request.get(`https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=${numOfDecks}`);
  expect(response.status()).toBe(200);
  const data = await response.json();
  expect(data.success).toBeTruthy();
  expect(data.deck_id).toBeTruthy();
  expect(data.remaining).toBeTruthy();
  expect(data.shuffled).toBeTruthy();
  if (numOfDecks) {
   expect(data.remaining).toEqual(numOfDecks * cardsInDeck);
  }
 });

 test('Round of BlackJack Simulation', async ({ request }) => {

  const calculateHandValue = (cards) => {
   let handValue = 0;
   let acesCount = 0;

   cards.forEach(card => {
    if (['KING', 'QUEEN', 'JACK'].includes(card.value)) {
     handValue += 10;
    } else if (card.value === 'ACE') {
     acesCount += 1;
     handValue += 11; // Initially treat Ace as 11
    } else {
     handValue += parseInt(card.value);
    }
   });

   // Adjust for Aces if total value exceeds 21
   while (handValue > 21 && acesCount > 0) {
    handValue -= 10; // Convert an Ace from 11 to 1
    acesCount -= 1;
   }

   return handValue;
  };

  // Initialize a newly shuffled deck
  const newDeck = await request.get(`https://deckofcardsapi.com/api/deck/new/shuffle/`);
  expect(newDeck.status()).toBe(200);
  const deckDetails = await newDeck.json();
  const deckId = deckDetails.deck_id;

  // Draw cards for Player 1
  const playerOneDrawResponse = await request.get(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=3`);
  expect(playerOneDrawResponse.status()).toBe(200);
  const playerOneDrawData = await playerOneDrawResponse.json(); // Make sure to await the JSON response
  const playerOneCards = playerOneDrawData.cards; // Correctly access the cards array
  const playerOneHandValue = calculateHandValue(playerOneCards);

  // Draw cards for Player 2
  const playerTwoDrawResponse = await request.get(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=3`);
  expect(playerTwoDrawResponse.status()).toBe(200);
  const playerTwoDrawData = await playerTwoDrawResponse.json();
  const playerTwoCards = playerTwoDrawData.cards;
  const playerTwoHandValue = calculateHandValue(playerTwoCards);

  // Compare hands and determine outcome
  if (playerOneHandValue > 21 && playerTwoHandValue > 21) {
   console.log('Both players bust.');
  } else if (playerOneHandValue > 21) {
   console.log('Player 2 wins.');
  } else if (playerTwoHandValue > 21) {
   console.log('Player 1 wins.');
  } else if (playerOneHandValue > playerTwoHandValue) {
   console.log('Player 1 wins.');
  } else if (playerTwoHandValue > playerOneHandValue) {
   console.log('Player 2 wins.');
  } else {
   console.log('It is a tie.');
  }

  // Conditional assertions based on hand comparison
  if (playerOneHandValue <= 21 && playerTwoHandValue <= 21) {
   if (playerOneHandValue > playerTwoHandValue) {
    expect(playerOneHandValue).toBeGreaterThan(playerTwoHandValue)
   } else if (playerTwoHandValue > playerOneHandValue) {
    expect(playerTwoHandValue).toBeGreaterThan(playerOneHandValue)
   } else {
    expect(playerOneHandValue).toBe(playerTwoHandValue)
   }
  }
 });
});
