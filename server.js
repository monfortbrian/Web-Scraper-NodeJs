const request = require("request-promise");
const cheerio = require("cheerio");
const fs = require("fs");
const json2csv = require("json2csv").Parser;

const movies = [
  "https://imdb.com/title/tt6723592/?ref_=hm_fanfav_tt_2_pd_fp1",
  "https://www.imdb.com/title/tt7737786/?ref_=hm_tpks_tt_1_pd_tp1",
  "https://www.imdb.com/title/tt1838556/?ref_=hm_tpks_tt_3_pd_tp1",
  "https://www.imdb.com/title/tt9340860/?ref_=hm_tpks_tt_1_pd_tp1",
  "https://www.imdb.com/title/tt7711170/?ref_=hm_tpks_tt_5_pd_tp1",
];
(async () => {
  let imdbData = [];
  for (let movie of movies) {
    const response = await request({
      uri: movie,
      header: {
        accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
        "accept-Encoding": "gzip, deflate, br",
        "accept-Language": "en-US,en;q=0.9,fr;q=0.8",
      },
      gzip: true,
    });

    let $ = cheerio.load(response);

    let title = $('div[class="title_wrapper"] > h1 ').text().trim();

    let rating = $('div[class="ratingValue"] > strong > span ').text();

    let summary = $('div[class="summary_text"]').text().trim();

    let releaseDate = $('a[title="See more release dates"]').text().trim();

    imdbData.push({
      title,
      rating,
      summary,
      releaseDate,
    });
  }
  const j2cp = new json2csv();
  const csv = j2cp.parse(imdbData);
  fs.writeFileSync("./imdb.csv", csv, "utf-8");
})();
