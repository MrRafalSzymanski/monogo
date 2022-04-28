const companyName = "Monogo";

const monogoBuildingNumber = 14;

const monogoUrl = "https://www.monogo.pl/competition/input.txt";

const _ = require("lodash");
const https = require("https");

https
  .get(monogoUrl, (res) => {
    let data = [];

    res.on("data", (piece) => {
      data.push(piece);
    });

    res.on("end", () => {
      const json = JSON.parse(Buffer.concat(data).toString());

      const filters = { ...json.selectedFilters };

      const filterNames = _.keys(filters);

      const products = [...json.products];

      const colors = json.colors.map((item) => ({
        id: Number(item.id),
        colors: item.value,
      }));

      const sizes = json.sizes.map((item) => ({
        id: Number(item.id),
        sizes: item.value,
      }));

      const productsWithPropertiesMerge = _.merge(
        _.keyBy(products, "id"),
        _.keyBy(colors, "id"),
        _.keyBy(sizes, "id")
      );

      const completeProducts = _.values(productsWithPropertiesMerge);

      const filteredProducts = completeProducts.filter((item) => {
        let matchedFilters = 0;

        filterNames.forEach((filterName) => {
          if (filters[filterName].includes(item[filterName])) {
            matchedFilters++;
          }
        });

        if (matchedFilters === filterNames.length) {
          return item;
        }
      });

      const priceMatchedProducts = filteredProducts.filter(
        (item) => item.price > 200
      );

      const priceSortedProducts = _.sortBy(priceMatchedProducts, "price");

      const priceMultiplicationResult = Math.round(
        priceSortedProducts[0].price *
          priceSortedProducts[priceSortedProducts.length - 1].price
      );

      const numbersArray = Array.from(priceMultiplicationResult.toString()).map(
        Number
      );

      const oddPositions = numbersArray.filter(
        (item, index) => index % 2 === 0
      );
      const evenPositions = numbersArray.filter(
        (item, index) => index % 2 !== 0
      );

      const summedNumbersArray = [];

      oddPositions.forEach((item, index) => {
        summedNumbersArray.push(item + evenPositions[index]);
      });

      const numberPosition = summedNumbersArray.indexOf(monogoBuildingNumber);

      console.log(
        numberPosition * priceMultiplicationResult * companyName.length
      );
    });
  })
  .on("error", (err) => {
    console.log("Error: ", err.message);
  });
