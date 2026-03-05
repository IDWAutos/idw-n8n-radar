import express from "express";
import puppeteer from "puppeteer";

const app = express();

app.get("/search", async (req, res) => {

  const query = req.query.q || "ford bronco outer banks";

  const browser = await puppeteer.launch({
    args: ["--no-sandbox"]
  });

  const page = await browser.newPage();

  await page.goto(
    `https://www.cars.com/shopping/results/?keyword=${query}`,
    { waitUntil: "networkidle2" }
  );

  const listings = await page.evaluate(() => {

    const cars = [];

    document.querySelectorAll("a.vehicle-card-link").forEach(el => {

      cars.push({
        title: el.innerText,
        link: el.href
      });

    });

    return cars;

  });

  await browser.close();

  res.json(listings);

});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Radar running on port ${PORT}`);
});
