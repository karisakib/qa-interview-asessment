import { test, expect } from '@playwright/test';

test.describe('UI Testing Checkers with Playwright', () => {
 test.beforeEach(async ({ page }) => {
  await page.goto('https://www.gamesforthebrain.com/game/checkers/');
 });
 
 test('Site is up and running', async ({ page }) => {
  await expect(page).toHaveTitle(/Checkers/);
  await page.locator("xpath=//div[@class='gameWrapper']").isVisible();
 });
 
 
 test('Site owner is making money off ads', async ({ page }) => {
  await page.locator("xpath=//div[@id='adSideBanner']").isVisible();
 });
 
 
 test('Make a move and restart game', async ({ page }) => {
  await page.locator("xpath=//p[@id='message']").filter({ hasText: 'Select an orange piece to move.' });
 
  await page.click('img[name="space02"]');
  await page.click('img[name="space13"]');
 
  await page.waitForTimeout(2000);
 
  await page.locator("xpath=//p[@id='message']").filter({ hasText: 'Make a move.' });
 
  await page.getByRole('link', { name: 'Restart...' }).click();
 
  await page.locator("xpath=//p[@id='message']").filter({ hasText: 'Select an orange piece to move.' });
 });
 
 
 test('Make 5 legal moves and capture the enemy', async ({ page }) => {
  await page.locator("xpath=//p[@id='message']").isVisible();
 
  await expect(page.locator("xpath=//img[contains(@src,'you1')]")).toHaveCount(12)
  await expect(page.locator("xpath=//img[contains(@src,'me1')]")).toHaveCount(12)
 
  // Move 1
  await page.click('img[name="space62"]');
  await page.click('img[name="space73"]');
  await page.waitForTimeout(2000);
 
  // move 2
  if (await page.locator("xpath=//p[@id='message']").filter({
   hasText: 'Make a move.' ||
    'Complete the double jump or click on your piece to stay still.'
  }).isVisible()) {
   await page.click('img[name="space42"]');
   await page.click('img[name="space53"]');
   await page.waitForTimeout(2000);
  }
 
  // Move 3 - Get Captured
  if (await page.locator("xpath=//p[@id='message']").filter({
   hasText: 'Make a move.' ||
    'Complete the double jump or click on your piece to stay still.'
  }).isVisible()) {
   await page.click('img[name="space22"]');
   await page.click('img[name="space33"]');
   await page.waitForTimeout(2000);
  }
 
  // Verify I got captured
  await expect(page.locator("xpath=//img[contains(@src,'you1')]")).toHaveCount(11) // 'You' is human player
  await expect(page.locator("xpath=//img[contains(@src,'me1')]")).toHaveCount(12) // 'Me' is computer
 
  // Move 4 - Capture a piece - Double -> Capture another piece
  if (await page.locator("xpath=//p[@id='message']").filter({
   hasText: 'Make a move.' ||
    'Complete the double jump or click on your piece to stay still.'
  }).isVisible()) {
 
   await page.click('img[name="space11"]');
   await page.click('img[name="space33"]');
  }
 
  await expect(page.locator("xpath=//img[contains(@src,'me1')]")).toHaveCount(11) // Verify I captured
 
  if (await page.locator("xpath=//p[@id='message']").filter({
   hasText: 'Make a move.' ||
    'Complete the double jump or click on your piece to stay still.'
  }).isVisible()) {
   await page.click('img[name="space15"]'); // Double -> Capture second piece 
   await page.waitForTimeout(2000);
  }
 
  // Move 5
  if (await page.locator("xpath=//p[@id='message']").filter({
   hasText: 'Make a move.' ||
    'Complete the double jump or click on your piece to stay still.'
  }).isVisible()) {
   await page.click('img[name="space51"]');
   await page.click('img[name="space42"]');
   await page.waitForTimeout(2000);
  }
 
  // Restart game
  await page.getByRole('link', { name: 'Restart...' }).click();
  await page.waitForTimeout(2000);
 
  // Verify game was reset.
  await page.locator("xpath=//p[@id='message']").filter({ hasText: 'Select an orange piece to move.' });
 });
 
});