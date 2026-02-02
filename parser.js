// @todo: напишите здесь код парсера

function parsePage() {
  return {
    meta: getMeta(),
    product: getProduct(),
    suggested: getSuggested(),
    reviews: getReviews(),
  };
}

window.parsePage = parsePage;

function getMeta() {
  const htmlDoc = document.querySelector("html");
  const langDoc = htmlDoc.getAttribute("lang");
  const titleDoc = htmlDoc
    .querySelector("head title")
    .textContent.split("—")[0]
    .trim();

  const metaKey = htmlDoc
    .querySelector('[name="keywords"]')
    .getAttribute("content")
    .split(",")
    .map((item) => item.trim());

  const metaDescript = htmlDoc
    .querySelector('[name="description"]')
    .getAttribute("content");

  const metaProperty = htmlDoc.querySelectorAll('[property*="og:"]');
  let ogObject = {};

  metaProperty.forEach((element) => {
    const key = element
      .getAttribute("property")
      .split("og:")[1]; /*проходим по списку елементов */
    if (key === "title") {
      ogObject[key] = element.getAttribute("content").split("—")[0].trim();
    } else {
      ogObject[key] =
        element.getAttribute("content"); /* находим значение ключей */
    }
  });
  return {
    language: langDoc,
    title: titleDoc,
    keywords: metaKey,
    description: metaDescript /* возвращаем объекты */,
    opengraph: ogObject,
  };
}

function getProduct() {
  const sectionProduct = document.querySelector(".product");
  const productId = sectionProduct.dataset.id;
  const imgs = sectionProduct.querySelectorAll("nav img"); /* нашли картинки */
  let imgSection = [];
  imgs.forEach((img) => {
    const full = img.dataset.src;
    const preview = img.getAttribute("src"); /* сылки на изображения*/
    const alt = img.getAttribute("alt");
    const imgObject = {
      preview: preview,
      full: full,
      alt: alt,
    };
    imgSection.push(imgObject);
  });
  const buttonLike = sectionProduct.querySelector(".like"); /* нашли like*/
  const isLiked = buttonLike.classList.contains("active"); /* проверили*/
  const nameProduct = sectionProduct.querySelector(".title").textContent;
  const category =
    sectionProduct.querySelectorAll(".tags span"); /* получили все теги */
  const discount = [];
  const categoryArray = []; /* создали пустые массивы  */
  const label = [];
  category.forEach((element) => {
    if (element.className === "green") {
      categoryArray.push(element.textContent);
    }
    if (element.className === "blue") {
      label.push(element.textContent); /* распределили по массивам  и цветам */
    }
    if (element.className === "red") {
      discount.push(element.textContent);
    }
  });

  const priceDiscountText = sectionProduct
    .querySelector(".price")
    .innerText.split(" ")[0];
  const priceDiscount = Number(priceDiscountText.slice(1));
  const priceText = sectionProduct.querySelector(".price span").textContent;
  const price = Number(priceText.slice(1));
  let discountSize = 0;
  let discountPercent = 0;
  if (price > priceDiscount) {
    discountSize = price - priceDiscount;
    discountPercent = (30 / 80) * 100; /* вычет процента */
  } else {
    console.log("Скидка 0%");
  }

  const currencySymbol = priceText.substring(0, 1); /* извлекатель валюты */
  let currency = "";
  if (currencySymbol === "₽") {
    currency = "RUB";
  }
  if (currencySymbol === "$") {
    currency = "USD";
  }
  if (currencySymbol === "€") {
    currency = "EUR";
  }

  const properties = sectionProduct.querySelectorAll(".properties li");
  let propertiesObj = {};
  properties.forEach((el) => {
    const props = el.querySelectorAll("span");
    const key = props[0].textContent;
    propertiesObj[key] = props[1].textContent;
  });

  let descriptionEl = sectionProduct.querySelector(".description");
  descriptionEl.querySelector("h3").removeAttribute("class");
  const description = descriptionEl.innerHTML.trim(); /*вставка из HTML */

  return {
    id: productId,
    name: nameProduct,
    isLiked: isLiked,
    tags: {
      category: categoryArray,
      discount: discount,
      label: label,
    },
    price: priceDiscount,
    oldPrice: price,
    discount: discountSize,
    discountPercent: discountPercent.toString() + "0%",
    currency: currency,
    properties: propertiesObj,
    description: description,
    images: imgSection,
  };
}

function getSuggested() {
  const suggested = document.querySelectorAll(".suggested article");
  let suggesteArray = [];
  suggested.forEach((el) => {
    const img = el.querySelector("img").getAttribute("src");
    const nameProduct = el.querySelector("h3").textContent;
    const priceText = el.querySelector("b").textContent;
    const price = priceText.slice(1); /* переобраование из текста в цифры */
    const currencySymbol = priceText.substring(0, 1); /* извлекатель валюты */
    let currency = "";
    if (currencySymbol === "₽") {
      currency = "RUB";
    }
    if (currencySymbol === "$") {
      currency = "USD";
    }
    if (currencySymbol === "€") {
      currency = "EUR";
    }
    const aboutProduct = el.querySelector("p").textContent;
    const suggestedOj = {
      name: nameProduct,
      description: aboutProduct,
      image: img,
      price: price,
      currency: currency,
    };
    suggesteArray.push(suggestedOj);
  });
  return suggesteArray;
}
function getReviews() {
  const reviews = document.querySelectorAll(".reviews article");
  let reviewArray = []; /* создали пустой масив */
  reviews.forEach((el) => {
    const rating = el.querySelectorAll(".rating .filled").length;
    const title = el.querySelector(".title").textContent;
    const description = el.querySelector("p").textContent;
    const authorAvatar = el.querySelector(".author img").getAttribute("src");
    const authorName = el.querySelector(".author span").textContent;
    const author = {
      avatar: authorAvatar,
      name: authorName,
    };
    const dataEl = el.querySelector(".author i").textContent;
    const dateFormat = dataEl.split("/").join("."); /* отформатировали дату */
    const review = {
      rating: rating,
      author: author,
      title: title /* создаем объект */,
      description: description,
      date: dateFormat,
    };

    reviewArray.push(review);
  });

  return reviewArray;
}
