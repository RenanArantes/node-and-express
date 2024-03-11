const portfinder = require("portfinder");
const puppeteer = require("puppeteer");

const app = require("../meadowlark");

let server = null;
let port = null;

beforeAll(async () => {
  port = await portfinder.getPortPromise();
  server = app.listen(port);
});

afterEach(() => {
  server.close();
});

test("home page links to about page", async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(`http://localhost:${port}`);

  await Promise.all([page.waitForNavigation(), page.click("[data-test-id='about']")]);

  const content = await page.$eval("h1", (e) => e.textContent);

  expect(page.url()).toBe(`http://localhost:${port}/about`);
  expect(content).toBe("About Meadowlark Travel");
  await browser.close();
});
