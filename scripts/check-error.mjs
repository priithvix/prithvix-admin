import puppeteer from 'puppeteer';

async function checkConsole() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('BROWSER CONSOLE:', msg.text()));
  page.on('pageerror', error => console.log('BROWSER PAGE ERROR:', error.message));

  await page.goto('http://localhost:5173');
  
  // Wait for login form
  await page.waitForSelector('input[type="email"]');
  await page.type('input[type="email"]', 'priithvix@gmail.com');
  await page.type('input[type="password"]', 'AdminPassword123!');
  await page.click('button[type="submit"]');
  
  // Wait a bit for the next screen or error
  await new Promise(r => setTimeout(r, 3000));
  
  await page.screenshot({ path: '/Users/raahildesai/.gemini/antigravity-ide/brain/2566cf3b-df49-4dbd-ab66-8aefea2d11ad/screenshot.png' });
  
  await browser.close();
}

checkConsole().catch(console.error);
