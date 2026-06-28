import React, { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { createRoot } from "react-dom/client";
import {
  ArrowLeft,
  BadgeCheck,
  Boxes,
  Check,
  ChevronRight,
  ClipboardList,
  Clock,
  Eye,
  EyeOff,
  Heart,
  History,
  Headphones,
  Laptop,
  LogOut,
  Mail,
  MapPin,
  Menu,
  Minus,
  PhoneCall,
  Plus,
  Search,
  SlidersHorizontal,
  ShoppingBag,
  Smartphone,
  Tablet,
  UserPlus,
  UserRound,
  UsersRound,
  Watch,
  Wrench,
  X
} from "lucide-react";
import { seedProducts } from "../server/products.seed.js";
import "./styles.css";

const phoneHref = "tel:+79818726956";
const mapHref =
  "https://yandex.com/maps/2/saint-petersburg/?ll=30.209776%2C59.862434&mode=poi&poi%5Bpoint%5D=30.209705%2C59.862438&poi%5Buri%5D=ymapsbm1%3A%2F%2Forg%3Foid%3D1766072614&z=21";

const brands = [
  { name: "Apple", logo: "https://cdn.simpleicons.org/apple/050608" },
  { name: "Samsung", logo: "https://cdn.simpleicons.org/samsung/050608" },
  { name: "Dyson", markClass: "brand-wordmark dyson-wordmark" },
  { name: "Xiaomi", logo: "https://cdn.simpleicons.org/xiaomi/050608" },
  { name: "Sony", logo: "https://cdn.simpleicons.org/sony/050608" },
  { name: "Google", logo: "https://cdn.simpleicons.org/google/050608" },
  { name: "Garmin", logo: "https://cdn.simpleicons.org/garmin/050608" },
  { name: "Marshall", markClass: "brand-wordmark marshall-wordmark" },
  { name: "OnePlus", logo: "https://cdn.simpleicons.org/oneplus/050608" },
  { name: "Huawei", logo: "https://cdn.simpleicons.org/huawei/050608" },
  { name: "Honor", logo: "https://cdn.simpleicons.org/honor/050608" },
  { name: "DJI", logo: "https://cdn.simpleicons.org/dji/050608" }
];

const categories = ["Все", "iPhone", "iPad", "Mac", "Apple Watch", "Смартфоны", "Планшеты", "AirPods"];
const topCategories = [
  { label: "iPhone", value: "iPhone", Icon: Smartphone, slug: "iphone" },
  { label: "iPad", value: "iPad", Icon: Tablet, slug: "ipad" },
  { label: "Mac", value: "Mac", Icon: Laptop, slug: "mac" },
  { label: "Apple Watch", value: "Apple Watch", Icon: Watch, slug: "apple-watch" },
  { label: "Смартфоны", value: "Смартфоны", Icon: Smartphone, slug: "smartphones" },
  { label: "Планшеты", value: "Планшеты", Icon: Tablet, slug: "tablets" }
];
const quickCatalogMenus = {
  iPhone: [
    { label: "17 Pro Max", model: "iPhone 17 Pro Max", to: "/catalog/iphone/iphone-17-pro-max" },
    { label: "17 Pro", model: "iPhone 17 Pro", to: "/catalog/iphone/iphone-17-pro" },
    { label: "Air", model: "iPhone Air", to: "/catalog/iphone/iphone-air" },
    { label: "17", model: "iPhone 17", to: "/catalog/iphone/iphone-17" },
    { label: "17e", model: "iPhone 17e", to: "/catalog/iphone/iphone-17e" },
    { label: "16 Pro Max", model: "iPhone 16 Pro Max", to: "/catalog/iphone/iphone-16-pro-max" },
    { label: "16 Pro", model: "iPhone 16 Pro", to: "/catalog/iphone/iphone-16-pro" },
    { label: "16 Plus", model: "iPhone 16 Plus", to: "/catalog/iphone/iphone-16-plus" },
    { label: "16", model: "iPhone 16", to: "/catalog/iphone/iphone-16" },
    { label: "16e", model: "iPhone 16e", to: "/catalog/iphone/iphone-16e" },
    { label: "15 Pro Max", model: "iPhone 15 Pro Max", to: "/catalog/iphone/iphone-15-pro-max" },
    { label: "15 Pro", model: "iPhone 15 Pro", to: "/catalog/iphone/iphone-15-pro" },
    { label: "15 Plus", model: "iPhone 15 Plus", to: "/catalog/iphone/iphone-15-plus" },
    { label: "15", model: "iPhone 15", to: "/catalog/iphone/iphone-15" },
    { label: "14 Pro Max", model: "iPhone 14 Pro Max", to: "/catalog/iphone/iphone-14-pro-max" },
    { label: "14 Pro", model: "iPhone 14 Pro", to: "/catalog/iphone/iphone-14-pro" },
    { label: "14 Plus", model: "iPhone 14 Plus", to: "/catalog/iphone/iphone-14-plus" },
    { label: "14", model: "iPhone 14", to: "/catalog/iphone/iphone-14" },
    { label: "13 Pro Max", model: "iPhone 13 Pro Max", to: "/catalog/iphone/iphone-13-pro-max" },
    { label: "13 Pro", model: "iPhone 13 Pro", to: "/catalog/iphone/iphone-13-pro" },
    { label: "13 mini", model: "iPhone 13 mini", to: "/catalog/iphone/iphone-13-mini" },
    { label: "13", model: "iPhone 13", to: "/catalog/iphone/iphone-13" },
    { label: "12 Pro Max", model: "iPhone 12 Pro Max", to: "/catalog/iphone/iphone-12-pro-max" },
    { label: "12 Pro", model: "iPhone 12 Pro", to: "/catalog/iphone/iphone-12-pro" },
    { label: "12", model: "iPhone 12", to: "/catalog/iphone/iphone-12" },
    { label: "11 Pro Max", model: "iPhone 11 Pro Max", to: "/catalog/iphone/iphone-11-pro-max" },
    { label: "11 Pro", model: "iPhone 11 Pro", to: "/catalog/iphone/iphone-11-pro" },
    { label: "11", model: "iPhone 11", to: "/catalog/iphone/iphone-11" },
    { label: "SE 2022", model: "iPhone SE 2022", to: "/catalog/iphone/iphone-se-2022" }
  ],
  iPad: [
    { label: "iPad Pro", to: "/catalog/ipad/ipad-pro" },
    { label: "iPad Air", to: "/catalog/ipad/ipad-air" },
    { label: "iPad mini", to: "/catalog/ipad/ipad-mini" },
    { label: "Базовый iPad", to: "/catalog/ipad/ipad" }
  ],
  Mac: [
    { label: "MacBook Air", to: "/catalog/mac/macbook-air" },
    { label: "MacBook Pro", to: "/catalog/mac/macbook-pro" },
    { label: "iMac", to: "/catalog/mac/imac" }
  ],
  "Apple Watch": [
    { label: "Apple Watch SE", to: "/catalog/apple-watch/apple-watch-se" },
    { label: "Apple Watch Series", to: "/catalog/apple-watch/apple-watch-series" },
    { label: "Apple Watch Ultra", to: "/catalog/apple-watch/apple-watch-ultra" },
    { label: "40/41 мм", to: "/catalog/apple-watch/41-mm" },
    { label: "44/45/49 мм", to: "/catalog/apple-watch/45-mm" }
  ],
  Смартфоны: [
    { label: "Apple (iPhone)", brand: "Apple", to: "/catalog/smartphones/apple" },
    { label: "Samsung", brand: "Samsung", to: "/catalog/smartphones/samsung" },
    { label: "Xiaomi", brand: "Xiaomi", to: "/catalog/smartphones/xiaomi" },
    { label: "Redmi", brand: "Redmi", to: "/catalog/smartphones/redmi" },
    { label: "Google", brand: "Google", to: "/catalog/smartphones/google" },
    { label: "Honor", brand: "Honor", to: "/catalog/smartphones/honor" },
    { label: "Huawei", brand: "Huawei", to: "/catalog/smartphones/huawei" },
    { label: "OnePlus", brand: "OnePlus", to: "/catalog/smartphones/oneplus" },
    { label: "Realme", brand: "Realme", to: "/catalog/smartphones/realme" }
  ],
  Планшеты: [
    { label: "iPad", brand: "Apple", to: "/catalog/tablets/ipad" },
    { label: "Samsung", brand: "Samsung", to: "/catalog/tablets/samsung" },
    { label: "Xiaomi", brand: "Xiaomi", to: "/catalog/tablets/xiaomi" },
    { label: "Huawei", brand: "Huawei", to: "/catalog/tablets/huawei" },
    { label: "Honor", brand: "Honor", to: "/catalog/tablets/honor" }
  ]
};
const iphoneFilterGroups = [
  { key: "model", label: "Модель", values: [] },
  { key: "memory", label: "Встроенная память", values: ["64 ГБ", "128 ГБ", "256 ГБ", "512 ГБ", "1 ТБ", "2 ТБ"] },
  { key: "color", label: "Цвет", values: [] },
  { key: "simType", label: "Тип SIM-карты", values: ["nano-SIM", "2x nano-SIM", "nano-SIM + eSIM", "eSIM"] },
  { key: "ram", label: "Оперативная память", values: ["4 ГБ", "6 ГБ", "8 ГБ", "12 ГБ"] },
  { key: "physicalSim", label: "Количество физических SIM", values: ["0", "1", "2"] },
  { key: "resolution", label: "Разрешение экрана", values: ["1334 × 750", "1792 × 828", "2340 × 1080", "2532 × 1170", "2556 × 1179", "2622 × 1206", "2736 × 1260", "2778 × 1284", "2796 × 1290", "2868 × 1320"] },
  { key: "refreshRate", label: "Частота обновления экрана", values: ["60 Гц", "120 Гц"] },
  { key: "screenSize", label: "Диагональ экрана", values: ["4.7", "5.4", "6.1", "6.3", "6.5", "6.7", "6.9"] }
];
const categoryFilterTemplates = {
  iPad: [
    { key: "model", label: "Линейка", values: [] },
    { key: "memory", label: "Встроенная память", values: [] },
    { key: "color", label: "Цвет", values: [] },
    { key: "connectivity", label: "Связь", values: [] },
    { key: "screenSize", label: "Диагональ экрана", values: [] }
  ],
  Mac: [
    { key: "model", label: "Модель", values: [] },
    { key: "chip", label: "Процессор", values: [] },
    { key: "ram", label: "Оперативная память", values: [] },
    { key: "memory", label: "Накопитель", values: [] },
    { key: "color", label: "Цвет", values: [] }
  ],
  "Apple Watch": [
    { key: "model", label: "Линейка", values: [] },
    { key: "size", label: "Размер корпуса", values: [] },
    { key: "caseMaterial", label: "Корпус", values: [] },
    { key: "color", label: "Цвет", values: [] },
    { key: "strap", label: "Ремешок", values: [] }
  ],
  AirPods: [
    { key: "model", label: "Модель", values: [] },
    { key: "color", label: "Цвет", values: [] },
    { key: "noiseControl", label: "Шумоподавление", values: [] },
    { key: "chargingCase", label: "Футляр", values: [] }
  ],
  Смартфоны: [
    { key: "brand", label: "Бренд", values: [] },
    { key: "model", label: "Модель", values: [] },
    { key: "memory", label: "Встроенная память", values: [] },
    { key: "color", label: "Цвет", values: [] },
    { key: "simType", label: "Тип SIM-карты", values: [] },
    { key: "ram", label: "Оперативная память", values: [] },
    { key: "physicalSim", label: "Количество физических SIM", values: [] },
    { key: "resolution", label: "Разрешение экрана", values: [] },
    { key: "refreshRate", label: "Частота обновления экрана", values: [] },
    { key: "screenSize", label: "Диагональ экрана", values: [] }
  ],
  Планшеты: [
    { key: "brand", label: "Бренд", values: [] },
    { key: "model", label: "Линейка", values: [] },
    { key: "memory", label: "Встроенная память", values: [] },
    { key: "color", label: "Цвет", values: [] },
    { key: "connectivity", label: "Связь", values: [] }
  ],
  Все: [
    { key: "brand", label: "Бренд", values: [] },
    { key: "productType", label: "Тип товара", values: [] },
    { key: "memory", label: "Память", values: [] },
    { key: "color", label: "Цвет", values: [] }
  ]
};
const filterSearchIndex = {
  brand: "бренд производитель",
  model: "модель линейка версия",
  memory: "память встроенная gb гб storage",
  color: "цвет корпус",
  simType: "sim сим eSIM nano физическая",
  ram: "оперативная память ram озу",
  physicalSim: "количество физических sim сим",
  resolution: "разрешение экрана пиксели",
  refreshRate: "частота обновления экран герц гц",
  screenSize: "диагональ экран дюйм",
  connectivity: "wi-fi cellular lte 5g связь",
  chip: "процессор cpu m1 m2 m3 m4",
  size: "размер корпус мм",
  caseMaterial: "материал корпус алюминий титан сталь",
  strap: "ремешок браслет loop band",
  noiseControl: "шумоподавление anc",
  chargingCase: "футляр зарядка magsafe lightning usb-c",
  productType: "тип товара категория"
};
const emptyAdvancedFilters = {
  priceMin: "",
  priceMax: ""
};

const officialApple = "https://www.apple.com";
const officialAppleStore = "https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is";

function appleOverviewImage(path) {
  return `${officialApple}${path}`;
}

function appleStoreImage(base, variant = "", size = "1000", format = "jpeg") {
  return `${officialAppleStore}/${base}${variant}?wid=${size}&hei=${size}&fmt=${format}&qlt=95`;
}

const supplementalIphones = [
  {
    model: "iPhone 17 Pro Max",
    slug: "smartfon-apple-iphone-17-pro-max-256gb-cosmic-orange",
    color: "Cosmic Orange",
    memory: "256GB",
    sim: "nano-SIM + eSIM",
    price: 179990,
    gallery: [
      appleOverviewImage("/v/iphone-17-pro/g/images/overview/welcome/hero__bsveixlwbms2_xlarge.jpg"),
      appleOverviewImage("/v/iphone-17-pro/g/images/overview/product-viewer/colors_orange__cr2oq3n1dwk2_large.jpg"),
      appleOverviewImage("/v/iphone-17-pro/g/images/overview/product-viewer/initial__d2ghrz27b54y_large.jpg")
    ]
  },
  {
    model: "iPhone 17 Pro",
    slug: "smartfon-apple-iphone-17-pro-256gb-deep-blue",
    color: "Deep Blue",
    memory: "256GB",
    sim: "nano-SIM + eSIM",
    price: 164990,
    gallery: [
      appleOverviewImage("/v/iphone-17-pro/g/images/overview/product-viewer/colors_blue__li170wg4gkae_large.jpg"),
      appleOverviewImage("/v/iphone-17-pro/g/images/overview/contrast/iphone_17_pro__c4qscr35qsq6_large.jpg"),
      appleOverviewImage("/v/iphone-17-pro/g/images/overview/design/design_startframe__fcp8vrjh5eeu_large.jpg")
    ]
  },
  {
    model: "iPhone 17",
    slug: "smartfon-apple-iphone-17-256gb-mist-blue",
    color: "Mist Blue",
    memory: "256GB",
    sim: "nano-SIM + eSIM",
    price: 129990,
    gallery: [
      appleOverviewImage("/v/iphone-17/g/images/overview/product-viewer/colors_mist_blue__700uff6zu2qa_large.jpg"),
      appleOverviewImage("/v/iphone-17/g/images/overview/product-viewer/initial__fgfrnz7ag26i_large.jpg"),
      appleOverviewImage("/v/iphone-17/g/images/overview/contrast/iphone_17__di090vk53j6u_large.jpg")
    ]
  },
  {
    model: "iPhone 17e",
    slug: "smartfon-apple-iphone-17e-128gb-black",
    color: "Black",
    memory: "128GB",
    sim: "nano-SIM + eSIM",
    price: 94990,
    gallery: [
      appleOverviewImage("/v/iphone/home/cj/images/overview/select/iphone_17e__cq5ygzct314y_large.jpg"),
      appleOverviewImage("/v/iphone-17/g/images/site/localnav/nav_iphone_17e__e25na5rotz0i_large.png"),
      appleOverviewImage("/v/iphone/home/cj/images/overview/chapternav/nav_iphone_17e__dea363vi6ggi_large.png")
    ]
  },
  {
    model: "iPhone Air",
    slug: "smartfon-apple-iphone-air-256gb-space-black",
    color: "Space Black",
    memory: "256GB",
    sim: "eSIM",
    price: 139990,
    gallery: [
      appleOverviewImage("/v/iphone-air/g/images/overview/product-viewer/color_static_black__bavqefsedg82_large.jpg"),
      appleOverviewImage("/v/iphone-air/g/images/overview/product-viewer/initial__fawwxxx0sday_large.jpg"),
      appleOverviewImage("/v/iphone-air/g/images/overview/contrast/iphone_air__bpnodv7do9ua_large.jpg")
    ]
  },
  {
    model: "iPhone 16 Pro Max",
    slug: "smartfon-apple-iphone-16-pro-max-256gb-desert-titanium",
    color: "Desert Titanium",
    memory: "256GB",
    sim: "nano-SIM + eSIM",
    price: 149990,
    gallery: [
      appleStoreImage("refurb-iphone-16-pro-max-deserttitanium-202509"),
      appleStoreImage("refurb-iphone-16-pro-max-deserttitanium-202509", "_AV1_GEO_US"),
      appleStoreImage("refurb-iphone-16-pro-max-deserttitanium-202509", "_AV2")
    ]
  },
  {
    model: "iPhone 16 Pro",
    slug: "smartfon-apple-iphone-16-pro-256gb-black-titanium",
    color: "Black Titanium",
    memory: "256GB",
    sim: "nano-SIM + eSIM",
    price: 134990,
    gallery: [
      appleStoreImage("refurb-iphone-16-pro-blacktitanium-202509"),
      appleStoreImage("refurb-iphone-16-pro-blacktitanium-202509", "_AV1_GEO_US"),
      appleStoreImage("refurb-iphone-16-pro-blacktitanium-202509", "_AV2")
    ]
  },
  {
    model: "iPhone 16 Plus",
    slug: "smartfon-apple-iphone-16-plus-128gb-ultramarine",
    color: "Ultramarine",
    memory: "128GB",
    sim: "nano-SIM + eSIM",
    price: 104990,
    gallery: [
      "https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/iphone-16-plus-ultramarine-select-202409?wid=940&hei=1112&fmt=png-alpha",
      "https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/iphone-16-plus-ultramarine-select-202409_AV2?wid=750&hei=506&fmt=jpeg&qlt=90",
      "https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/iphone-16-plus-ultramarine-select-202409_AV3?wid=1246&hei=518&fmt=jpeg&qlt=90"
    ]
  },
  {
    model: "iPhone 16",
    slug: "smartfon-apple-iphone-16-128gb-teal",
    color: "Teal",
    memory: "128GB",
    sim: "nano-SIM + eSIM",
    price: 92990,
    gallery: [
      "https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/iphone-16-teal-select-202409?wid=940&hei=1112&fmt=png-alpha",
      "https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/iphone-16-teal-select-202409_AV2?wid=750&hei=506&fmt=jpeg&qlt=90",
      "https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/iphone-16-teal-select-202409_AV3?wid=1246&hei=518&fmt=jpeg&qlt=90"
    ]
  },
  {
    model: "iPhone 16e",
    slug: "smartfon-apple-iphone-16e-128gb-white",
    color: "White",
    memory: "128GB",
    sim: "nano-SIM + eSIM",
    price: 74990,
    gallery: [
      appleOverviewImage("/v/iphone/home/cj/images/overview/select/iphone_16__b6tkv86m2gc2_large.jpg"),
      appleOverviewImage("/v/iphone/home/cj/images/overview/chapternav/nav_iphone_16__qsxcpuia0oam_large.png"),
      appleOverviewImage("/v/iphone/home/cj/images/overview/select/iphone_16__b6tkv86m2gc2_medium.jpg")
    ]
  },
  {
    model: "iPhone 13 Pro Max",
    slug: "smartfon-apple-iphone-13-pro-max-256gb-graphite",
    color: "Graphite",
    memory: "256GB",
    sim: "nano-SIM + eSIM",
    price: 79990,
    gallery: [
      "https://www.apple.com/newsroom/images/product/iphone/standard/Apple_iPhone-13-Pro_iPhone-13-Pro-Max_09142021_inline.jpg.large.jpg",
      "https://www.apple.com/newsroom/images/product/iphone/standard/Apple_iPhone-13-Pro_Colors_09142021_big.jpg.large.jpg",
      "https://www.apple.com/newsroom/images/product/iphone/standard/Apple_iPhone-13-Pro_New-Camera-System_09142021_Full-Bleed-Image.jpg.large.jpg"
    ]
  },
  {
    model: "iPhone 13 Pro",
    slug: "smartfon-apple-iphone-13-pro-256gb-alpine-green",
    color: "Alpine Green",
    memory: "256GB",
    sim: "nano-SIM + eSIM",
    price: 71990,
    gallery: [
      "https://www.apple.com/newsroom/images/product/iphone/standard/Apple_iPhone-13-Pro_Colors_09142021_big.jpg.large.jpg",
      "https://www.apple.com/newsroom/images/product/iphone/standard/Apple_iPhone-13-Pro_iPhone-13-Pro-Max_09142021_inline.jpg.large.jpg",
      "https://www.apple.com/newsroom/images/product/iphone/standard/Apple_iPhone-13-Pro_New-Camera-System_09142021_Full-Bleed-Image.jpg.large.jpg"
    ]
  },
  {
    model: "iPhone 12 Pro Max",
    slug: "smartfon-apple-iphone-12-pro-max-256gb-pacific-blue",
    color: "Pacific Blue",
    memory: "256GB",
    sim: "nano-SIM + eSIM",
    price: 57990,
    gallery: [
      "https://www.apple.com/newsroom/images/product/iphone/standard/Apple_announce-iphone12pro_10132020_big.jpg.large.jpg",
      "https://www.apple.com/newsroom/images/product/iphone/standard/Apple_iphone12pro-pacific-blue_10132020_Full-Bleed-Image.jpg.large.jpg",
      "https://www.apple.com/newsroom/images/product/iphone/standard/Apple_iphone12pro-back-camera_10132020_big.jpg.large.jpg"
    ]
  },
  {
    model: "iPhone 12 Pro",
    slug: "smartfon-apple-iphone-12-pro-256gb-gold",
    color: "Gold",
    memory: "256GB",
    sim: "nano-SIM + eSIM",
    price: 52990,
    gallery: [
      "https://www.apple.com/newsroom/images/product/iphone/standard/Apple_iphone12pro-stainless-steel-gold_10132020_inline.jpg.large.jpg",
      "https://www.apple.com/newsroom/images/product/iphone/standard/Apple_announce-iphone12pro_10132020_big.jpg.large.jpg",
      "https://www.apple.com/newsroom/images/product/iphone/standard/Apple_iphone12pro-back-camera_10132020_big.jpg.large.jpg"
    ]
  },
  {
    model: "iPhone 11 Pro Max",
    slug: "smartfon-apple-iphone-11-pro-max-256gb-space-gray",
    color: "Space Gray",
    memory: "256GB",
    sim: "nano-SIM + eSIM",
    price: 52990,
    gallery: [
      appleStoreImage("refurb-iphone-11-pro-max-space-gray-2019"),
      appleStoreImage("refurb-iphone-11-pro-max-space-gray-2019", "_AV1"),
      appleStoreImage("refurb-iphone-11-pro-max-space-gray-2019", "_AV2")
    ]
  },
  {
    model: "iPhone 11 Pro",
    slug: "smartfon-apple-iphone-11-pro-256gb-midnight-green",
    color: "Midnight Green",
    memory: "256GB",
    sim: "nano-SIM + eSIM",
    price: 46990,
    gallery: [
      appleStoreImage("refurb-iphone-11-pro-midnight-green-2019"),
      appleStoreImage("refurb-iphone-11-pro-midnight-green-2019", "_AV1"),
      appleStoreImage("refurb-iphone-11-pro-midnight-green-2019", "_AV2")
    ]
  }
].map((item, index) => ({
  id: `supplemental-${item.slug}`,
  sku: `SM-SUP-IPHONE-${index + 1}`,
  slug: item.slug,
  name: `Apple ${item.model} ${item.memory}, ${item.color}`,
  section: "iPhone",
  category: "iPhone",
  subcategory: item.model,
  brand: "Apple",
  retailPrice: item.price,
  wholesalePrice: item.price,
  stockQty: 3,
  imageUrl: item.gallery[0],
  gallery: item.gallery,
  description: `${item.model} ${item.color} ${item.memory} ${item.sim}`,
  attributes: {
    model: item.model,
    memory: item.memory,
    color: item.color,
    sim: item.sim,
    availability: "In stock",
    productType: "phone"
  }
}));

function hydrateCatalogProducts(products) {
  const ids = new Set(products.map((product) => product.id || product.sku || product.slug));
  const slugs = new Set(products.map((product) => product.slug).filter(Boolean));
  return [
    ...products,
    ...supplementalIphones.filter((product) => !ids.has(product.id) && !ids.has(product.sku) && !slugs.has(product.slug))
  ];
}
const orderStatuses = {
  new: "Новый",
  confirmed: "Подтвержден",
  ready: "Готов",
  picked_up: "Выдан",
  cancelled: "Отменен"
};

const legalDocuments = {
  "/privacy": {
    title: "Политика конфиденциальности",
    lead: "Как Shark Mobile собирает, использует и защищает персональные данные покупателей.",
    sections: [
      ["Оператор данных", ["Оператор: [ФИО/ИП/ООО], ИНН [ИНН], ОГРН/ОГРНИП [ОГРН/ОГРНИП], адрес: [юридический адрес], email: [email]. Точка выдачи: Shark Mobile, ярмарка Юнона, павильон 506."]],
      ["Какие данные обрабатываются", ["Имя, телефон, Telegram, логин кабинета, история заказов, избранные товары, дата и время самовывоза, технические данные браузера и устройства, необходимые для работы сайта."]],
      ["Цели обработки", ["Оформление и выдача заказов, связь с покупателем, ведение кабинета покупателя, обработка избранного, поддержка и улучшение работы сайта, выполнение требований законодательства РФ."]],
      ["Хранение и защита", ["Данные хранятся столько, сколько нужно для обработки заказов, поддержки кабинета и выполнения законных обязанностей. Доступ ограничивается техническими и организационными мерами защиты."]],
      ["Права пользователя", ["Пользователь может запросить уточнение, блокирование или удаление персональных данных, а также отозвать согласие, обратившись по контактам Shark Mobile."]]
    ]
  },
  "/terms": {
    title: "Пользовательское соглашение",
    lead: "Условия использования сайта, каталога, корзины, избранного и кабинета покупателя.",
    sections: [
      ["Общие условия", ["Сайт Shark Mobile помогает выбрать аксессуары, телефоны и услуги ремонта, оформить заказ на самовывоз и сохранить историю покупок в кабинете."]],
      ["Кабинет покупателя", ["Пользователь отвечает за сохранность логина и пароля. Данные кабинета используются для истории заказов, избранного и быстрого оформления покупки."]],
      ["Каталог и наличие", ["Цены, наличие и характеристики показываются по данным сайта и могут уточняться сотрудником при подтверждении заказа."]],
      ["Ограничения", ["Запрещено нарушать работу сайта, использовать чужой кабинет, передавать недостоверные контактные данные или оформлять фиктивные заказы."]],
      ["Документы", ["Используя сайт и отправляя формы, пользователь принимает это соглашение, политику конфиденциальности, оферту и согласие на обработку персональных данных."]]
    ]
  },
  "/offer": {
    title: "Публичная оферта",
    lead: "Минимальные условия продажи товаров Shark Mobile через сайт с самовывозом.",
    sections: [
      ["Продавец", ["Продавец: [ФИО/ИП/ООО], ИНН [ИНН], ОГРН/ОГРНИП [ОГРН/ОГРНИП], адрес: [юридический адрес], email: [email]. Контакты точки: Shark Mobile, Юнона, павильон 506, +7 981 872-69-56, Telegram: @Shark_Mobile506."]],
      ["Предмет оферты", ["Продавец предлагает покупателю приобрести товары из каталога сайта. Заказ считается оформленным после отправки формы корзины и присвоения номера заказа."]],
      ["Цены и опт", ["Розничная и оптовая цены отображаются в карточке товара. Оптовый режим заказа доступен от 20 единиц и применяется в корзине согласно текущей логике сайта."]],
      ["Самовывоз и оплата", ["Получение заказа происходит в павильоне 506 на ярмарке Юнона в выбранные покупателем дату и время, после подтверждения наличия. Условия оплаты уточняются при выдаче или подтверждении заказа."]],
      ["Возврат и обмен", ["Покупатель вправе отказаться от товара до передачи, а после передачи пользуется правами, предусмотренными законодательством РФ о защите прав потребителей для дистанционной продажи."]]
    ]
  },
  "/personal-data-consent": {
    title: "Согласие на обработку персональных данных",
    lead: "Текст согласия, которое пользователь дает при регистрации и оформлении заказа.",
    sections: [
      ["Кому дается согласие", ["Оператору [ФИО/ИП/ООО], ИНН [ИНН], ОГРН/ОГРНИП [ОГРН/ОГРНИП], адрес: [юридический адрес], email: [email]."]],
      ["Состав данных", ["Имя, телефон, Telegram, логин, пароль в защищенном виде, сведения о заказах, избранных товарах, выбранных дате и времени получения заказа."]],
      ["Цели", ["Создание кабинета покупателя, оформление и выдача заказа, связь по заказу, сохранение истории покупок, выполнение требований законодательства РФ."]],
      ["Действия с данными", ["Сбор, запись, систематизация, хранение, уточнение, использование, передача в пределах используемой инфраструктуры сайта, блокирование, удаление и уничтожение."]],
      ["Срок и отзыв", ["Согласие действует до достижения целей обработки или до отзыва пользователем. Отозвать согласие можно через обращение по контактам Shark Mobile."]]
    ]
  }
};

function App() {
  const [path, setPath] = useState(window.location.pathname);
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem("shark-cart") || "[]"));
  const [favorites, setFavorites] = useState(() => JSON.parse(localStorage.getItem("shark-favorites") || "[]"));
  const [globalSearch, setGlobalSearch] = useState("");
  const [flyItem, setFlyItem] = useState(null);
  const [customer, setCustomer] = useState(null);

  useEffect(() => {
    const onPop = () => setPath(window.location.pathname);
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  useEffect(() => {
    localStorage.setItem("shark-cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem("shark-favorites", JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    fetch("/api/products")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Products API unavailable");
        }
        return response.json();
      })
      .then((data) => setProducts(hydrateCatalogProducts(data.products || [])))
      .catch(() =>
        setProducts(
          hydrateCatalogProducts(
          seedProducts.map((product) => ({
            ...product,
            id: product.sku
          }))
          )
        )
      )
      .finally(() => setLoadingProducts(false));
  }, []);

  useEffect(() => {
    fetch("/api/customer/me")
      .then(readJson)
      .then((data) => {
        if (data.customer) {
          setCustomer(data.customer);
          syncCustomerFavorites(favorites, setFavorites);
        }
      })
      .catch(() => {});
  }, []);

  const navigate = (href) => {
    window.history.pushState({}, "", href);
    setPath(href);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);
  const currentLegalDocument = legalDocuments[path.replace(/\/$/, "")];
  const productRouteMatch = path.match(/^\/product\/([^/]+)\/?$/);
  const catalogRouteMatch = path.match(/^\/catalog(?:\/(.+))?\/?$/);
  const selectedProduct = productRouteMatch
    ? products.find((product) => product.id === decodeURIComponent(productRouteMatch[1]) || product.sku === decodeURIComponent(productRouteMatch[1]))
    : null;
  const addToCart = (product, sourceRect, qty = 1) => {
    setCart((current) => {
      const existing = current.find((item) => item.productId === product.id);
      if (existing) {
        return current.map((item) =>
          item.productId === product.id ? { ...item, qty: Math.min(item.qty + qty, product.stockQty) } : item
        );
      }
      return [...current, { productId: product.id, qty: Math.min(qty, product.stockQty) }];
    });
    if (sourceRect) {
      const cartTarget = document.querySelector("[data-cart-target]")?.getBoundingClientRect();
      if (cartTarget) {
        const id = `${product.id}-${Date.now()}`;
        setFlyItem({
          id,
          brand: product.brand,
          from: { x: sourceRect.left + sourceRect.width / 2, y: sourceRect.top + sourceRect.height / 2 },
          to: { x: cartTarget.left + cartTarget.width / 2, y: cartTarget.top + cartTarget.height / 2 }
        });
        window.setTimeout(() => setFlyItem((item) => (item?.id === id ? null : item)), 760);
      }
    }
  };

  const updateQty = (productId, qty) => {
    setCart((current) =>
      current
        .map((item) => (item.productId === productId ? { ...item, qty } : item))
        .filter((item) => item.qty > 0)
    );
  };

  const toggleFavorite = (productId) => {
    setFavorites((current) => {
      const exists = current.includes(productId);
      const next = exists ? current.filter((id) => id !== productId) : [...current, productId];
      if (customer) {
        fetch(`/api/customer/favorites/${productId}`, { method: exists ? "DELETE" : "PUT" }).catch(() => {});
      }
      return next;
    });
  };

  const openSearch = () => {
    scrollHomeSection("#catalog");
  };

  const scrollHomeSection = (selector) => {
    navigate("/");
    window.setTimeout(() => document.querySelector(selector)?.scrollIntoView({ behavior: "smooth", block: "start" }), 120);
  };

  return (
    <div className="app-shell">
      <Header
        navigate={navigate}
        path={path}
        cartCount={cartCount}
        favoritesCount={favorites.length}
        search={globalSearch}
        setSearch={setGlobalSearch}
        onSearch={openSearch}
        onCatalog={() => navigate("/catalog")}
        onRoute={() => scrollHomeSection("#route")}
        onCart={() => navigate("/cart")}
        customer={customer}
      />
      <main>
        <div className="route-frame" key={path}>
          {path === "/price" ? (
            <PricePage products={products} loading={loadingProducts} navigate={navigate} />
          ) : path === "/cart" || path === "/korzina" ? (
            <CartPage
              cart={cart}
              products={products}
              updateQty={updateQty}
              clearCart={() => setCart([])}
              navigate={navigate}
              customer={customer}
            />
          ) : path === "/cabinet" || path === "/cabinet/" ? (
            <CustomerCabinet
              customer={customer}
              setCustomer={setCustomer}
              favorites={favorites}
              setFavorites={setFavorites}
              products={products}
              ordersReloadKey={cart.length}
              addToCart={addToCart}
              toggleFavorite={toggleFavorite}
              navigate={navigate}
            />
          ) : path === "/favorites" || path === "/favorites/" ? (
            <FavoritesPage
              products={products}
              favorites={favorites}
              toggleFavorite={toggleFavorite}
              addToCart={addToCart}
              navigate={navigate}
            />
          ) : path === "/repair" ? (
            <RepairPage navigate={navigate} />
          ) : path === "/admin" ? (
            <AdminPage products={products} setProducts={setProducts} />
          ) : catalogRouteMatch ? (
            <CatalogPage
              route={catalogRouteMatch[1] || ""}
              products={products}
              loading={loadingProducts}
              addToCart={addToCart}
              navigate={navigate}
              search={globalSearch}
              setSearch={setGlobalSearch}
              favorites={favorites}
              toggleFavorite={toggleFavorite}
            />
          ) : productRouteMatch ? (
            <ProductDetailPage
              product={selectedProduct}
              products={products}
              loading={loadingProducts}
              addToCart={addToCart}
              navigate={navigate}
              isFavorite={selectedProduct ? favorites.includes(selectedProduct.id) : false}
              toggleFavorite={toggleFavorite}
            />
          ) : currentLegalDocument ? (
            <LegalPage document={currentLegalDocument} navigate={navigate} />
          ) : (
            <HomePage
              products={products}
              loading={loadingProducts}
              addToCart={addToCart}
              navigate={navigate}
              search={globalSearch}
              setSearch={setGlobalSearch}
              favorites={favorites}
              toggleFavorite={toggleFavorite}
            />
          )}
        </div>
      </main>
      {flyItem && <FlyToCart item={flyItem} />}
      <Footer navigate={navigate} />
    </div>
  );
}

function Header({ navigate, path, cartCount, favoritesCount, search, setSearch, onSearch, onCatalog, onRoute, onCart, customer }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const links = [
    ["/price", "Прайс"],
    ["/repair", "Ремонт"]
  ];

  const go = (href) => {
    setMenuOpen(false);
    navigate(href);
  };

  const openMobileSearch = () => {
    setMenuOpen(true);
    window.setTimeout(() => document.querySelector(".mobile-menu-search input")?.focus(), 80);
  };

  return (
    <header className="topbar">
      <button className="brand-link" onClick={() => go("/")} aria-label="На главную">
        <span className="brand-dot" />
        <span>Shark Mobile</span>
      </button>
      <nav className="topnav" aria-label="Разделы сайта">
        <button className={path === "/" || path.startsWith("/catalog") ? "is-active" : ""} onClick={onCatalog}>
          Каталог
        </button>
        {links.map(([href, label]) => (
          <button key={href} className={path === href ? "is-active" : ""} onClick={() => go(href)}>
            {label}
          </button>
        ))}
      </nav>
      <form
        className="header-search"
        onSubmit={(event) => {
          event.preventDefault();
          onSearch();
          setMenuOpen(false);
        }}
      >
        <Search size={18} />
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          onFocus={onSearch}
          placeholder="Поиск товара"
          aria-label="Поиск по каталогу"
        />
      </form>
      <div className="top-actions">
        <a className="call-button top-call-button" href={phoneHref}>
          Позвонить
        </a>
        <button className="admin-button" onClick={() => go("/cabinet")} aria-label="Кабинет покупателя">
          <UserRound size={18} />
          {customer && <span className="account-dot" aria-hidden="true" />}
        </button>
        <button className="mobile-search-button" onClick={openMobileSearch} aria-label="Поиск">
          <Search size={18} />
        </button>
        <button className="favorite-nav-button" onClick={() => go("/favorites")} aria-label="Избранное">
          <Heart size={18} />
          <span>{favoritesCount}</span>
        </button>
        <button className="cart-button" onClick={onCart} aria-label="Открыть корзину" data-cart-target>
          <ShoppingBag size={18} />
          <span>{cartCount}</span>
        </button>
        <button className="burger-button" onClick={() => setMenuOpen(!menuOpen)} aria-label="Открыть меню" aria-expanded={menuOpen}>
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
      <div className={`mobile-menu ${menuOpen ? "is-open" : ""}`}>
        <form
          className="mobile-menu-search"
          onSubmit={(event) => {
            event.preventDefault();
            onSearch();
            setMenuOpen(false);
          }}
        >
          <Search size={18} />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Поиск товара"
            aria-label="Поиск по каталогу"
          />
        </form>
        <a className="mobile-call" href={phoneHref}>
          Позвонить
          <span>+7 981 872-69-56</span>
        </a>
        <button
          onClick={() => {
            setMenuOpen(false);
            onCatalog();
          }}
        >
          Каталог
          <ChevronRight size={18} />
        </button>
        {links.map(([href, label]) => (
          <button key={href} onClick={() => go(href)}>
            {label}
            <ChevronRight size={18} />
          </button>
        ))}
        <button
          onClick={() => {
            setMenuOpen(false);
            onRoute();
          }}
        >
          Адрес
          <MapPin size={18} />
        </button>
        <button onClick={() => go("/favorites")}>
          Избранное
          <ChevronRight size={18} />
        </button>
      </div>
    </header>
  );
}

function CatalogPage({ route, products, loading, addToCart, navigate, search, setSearch, favorites, toggleFavorite }) {
  const initial = getCatalogState(route);
  const [category, setCategory] = useState(initial.category);
  const [selectedModel, setSelectedModel] = useState(initial.model);
  const [modelsExpanded, setModelsExpanded] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [advancedFilters, setAdvancedFilters] = useState(emptyAdvancedFilters);
  const filterGroups = getFilterGroups(products, category);
  const modelChips = category === "Все" ? [] : moveSelectedFirst(getModelChips(products, category), selectedModel);
  const visibleModelChips = modelsExpanded ? modelChips : modelChips.slice(0, 8);
  const filtered = products
    .filter((product) => matchesCatalogCategory(product, category))
    .filter((product) => matchesCatalogSubfilter(product, category, selectedModel))
    .filter((product) => matchesAdvancedFilters(product, category, advancedFilters, filterGroups))
    .filter((product) => `${product.name} ${product.brand} ${product.sku}`.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => productRelevanceRank(b, category) - productRelevanceRank(a, category));

  const selectCategory = (item) => {
    setCategory(item);
    setSelectedModel("");
    setModelsExpanded(false);
    setAdvancedFilters(emptyAdvancedFilters);
    navigate(`/catalog/${catalogSlug(item)}`);
  };
  const resetFilters = () => {
    setSelectedModel("");
    setSearch("");
    setAdvancedFilters(emptyAdvancedFilters);
  };

  return (
    <>
      <QuickCatalogNav category={category} navigate={navigate} products={products} />
      <MobileFilterDrawer
        open={filterDrawerOpen}
        category={category}
        groups={filterGroups}
        filters={advancedFilters}
        setFilters={setAdvancedFilters}
        onClose={() => setFilterDrawerOpen(false)}
        onReset={resetFilters}
        resultCount={filtered.length}
      />
      <section className="catalog-section is-full-catalog" id="catalog">
        <div className="section-title-row">
          <div>
            <p className="eyebrow">Каталог</p>
            <h2>{category === "Все" ? "Полный ассортимент точки" : category}</h2>
          </div>
          <button className="price-link" onClick={() => navigate("/price")}>
            Прайс-лист
            <ChevronRight size={18} />
          </button>
        </div>
        <div className="shop-layout">
          <button className="filter-toggle mobile-filter-page-button" onClick={() => setFilterDrawerOpen(true)} aria-expanded={filterDrawerOpen}>
            <SlidersHorizontal size={18} />
            Фильтры {category !== "Все" ? category : ""}
            <ChevronRight size={18} />
          </button>
          <button className="filter-toggle desktop-filter-toggle" onClick={() => setFiltersOpen(!filtersOpen)} aria-expanded={filtersOpen}>
            <SlidersHorizontal size={18} />
            Фильтры
            <ChevronRight size={18} />
          </button>
          <aside className={`category-rail ${filtersOpen ? "is-open" : ""}`} aria-label="Категории товаров">
            {categories.map((item) => (
              <button key={item} className={category === item ? "is-selected" : ""} onClick={() => selectCategory(item)}>
                <span>{item}</span>
                <ChevronRight size={18} />
              </button>
            ))}
          </aside>
          <div className="product-zone">
            {modelChips.length > 0 && (
              <div className="catalog-model-bar" aria-label="Модели">
                {visibleModelChips.map((item) => (
                  <button
                    key={item}
                    type="button"
                    className={selectedModel === item ? "is-selected" : ""}
                    onClick={() => {
                      setSelectedModel(item);
                      navigate(`/catalog/${catalogSlug(category)}/${slugify(getRouteLabel(category, item))}`);
                    }}
                  >
                    {item}
                  </button>
                ))}
                {modelChips.length > 8 && (
                  <button className="more-models" type="button" onClick={() => setModelsExpanded((current) => !current)}>
                    {modelsExpanded ? "Скрыть" : "Ещё"}
                  </button>
                )}
              </div>
            )}
            <label className="search-box">
              <Search size={18} />
              <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Поиск по бренду, SKU, названию" />
            </label>
            {(selectedModel || search || hasAdvancedFilters(advancedFilters)) && (
              <button className="clear-filter" onClick={resetFilters}>
                Сбросить фильтр
              </button>
            )}
            {loading ? (
              <div className="skeleton-grid">{Array.from({ length: 6 }).map((_, index) => <div className="product-card skeleton" key={index} />)}</div>
            ) : (
              <div className="product-grid">
                {filtered.map((product, index) => (
                  <ProductCard key={product.id} product={product} products={products} index={index} onAdd={addToCart} onOpen={() => navigate(`/product/${encodeURIComponent(product.id)}`)} isFavorite={favorites.includes(product.id)} onToggleFavorite={toggleFavorite} />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

function QuickCatalogNav({ category, navigate, products = [] }) {
  const [hoveredCategory, setHoveredCategory] = useState("");
  const menuItems = getQuickCatalogMenu(hoveredCategory, products);
  return (
    <section
      className="quick-catalog"
      aria-label="Категории каталога"
      onMouseLeave={() => setHoveredCategory("")}
      onPointerLeave={() => setHoveredCategory("")}
    >
      <div className="quick-catalog-track">
        {topCategories.map(({ label, value, Icon }) => (
          <div
            className="quick-catalog-item"
            key={label}
            onMouseEnter={() => setHoveredCategory(value)}
            onMouseOver={() => setHoveredCategory(value)}
            onPointerEnter={() => setHoveredCategory(value)}
          >
            <button className={category === value ? "is-selected" : ""} onClick={() => navigate(`/catalog/${catalogSlug(value)}`)}>
              <Icon size={24} />
              <span>{label}</span>
            </button>
          </div>
        ))}
      </div>
      {hoveredCategory && menuItems.length > 0 && (
        <div key={hoveredCategory} className="quick-catalog-menu simple-menu">
          <div className="quick-catalog-menu-column">
            {menuItems.map((item, index) => (
              <button key={item.label} type="button" style={{ "--menu-index": index }} onClick={() => navigate(item.to)}>
                <span className="quick-catalog-menu-image" aria-hidden="true">
                  <PhotoPlaceholder compact />
                </span>
                <span>
                  <b>{hoveredCategory === "iPhone" ? item.model : item.label}</b>
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

function PhotoPlaceholder({ compact = false }) {
  return (
    <span className={`photo-placeholder ${compact ? "is-compact" : ""}`} aria-hidden="true">
      Скоро здесь будет фото
    </span>
  );
}

function MobileFilterDrawer({ open, category, groups, filters, setFilters, onClose, onReset, resultCount }) {
  const [filterSearch, setFilterSearch] = useState("");
  const visibleGroups = groups.filter((group) => {
    const query = filterSearch.trim().toLowerCase();
    if (!query) return true;
    return `${group.label} ${filterSearchIndex[group.key] || ""} ${group.values.join(" ")}`.toLowerCase().includes(query);
  });
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);
  const toggleValue = (key, value) => {
    setFilters((current) => {
      const values = current[key] || [];
      return {
        ...current,
        [key]: values.includes(value) ? values.filter((item) => item !== value) : [...values, value]
      };
    });
  };
  const updatePrice = (key, value) => setFilters((current) => ({ ...current, [key]: value.replace(/[^\d]/g, "") }));

  return createPortal(
    <div className={`mobile-filter-drawer ${open ? "is-open" : ""}`} aria-hidden={!open}>
      <button className="mobile-filter-scrim" type="button" onClick={onClose} aria-label="Закрыть фильтры" />
      <aside className="mobile-filter-panel" aria-label={`Фильтры ${category}`}>
        <div className="mobile-filter-head">
          <button type="button" className="filter-reset-pill" onClick={onReset}>Сбросить</button>
          <div>
            <h2>{category === "Все" ? "Каталог" : category}</h2>
          </div>
          <button type="button" className="filter-close-button" onClick={onClose} aria-label="Закрыть фильтры">
            <X size={20} />
          </button>
        </div>

        <div className="mobile-filter-body">
          <label className="filter-search-field">
            <input value={filterSearch} onChange={(event) => setFilterSearch(event.target.value)} placeholder="Поиск фильтров" />
          </label>

          <section className="filter-group">
            <h3>Цена <ChevronRight size={16} /></h3>
            <div className="price-filter-fields">
              <label>
                От
                <input inputMode="numeric" value={filters.priceMin} onChange={(event) => updatePrice("priceMin", event.target.value)} />
              </label>
              <label>
                До
                <input inputMode="numeric" value={filters.priceMax} onChange={(event) => updatePrice("priceMax", event.target.value)} />
              </label>
            </div>
            <div className="filter-range-line" aria-hidden="true"><span /><span /></div>
          </section>

          {groups.length === 0 ? (
            <section className="filter-group">
              <h3>Основные</h3>
              <p>Для этой категории доступны цена и поиск. Подробные характеристики заполнены для iPhone.</p>
            </section>
          ) : (
            visibleGroups.map((group) => (
              <section className="filter-group" key={group.key}>
                <h3>{group.label} <ChevronRight size={16} /></h3>
                <div className="filter-chip-grid">
                  {group.values.map((value) => (
                    <button
                      key={value}
                      type="button"
                      className={(filters[group.key] || []).includes(value) ? "is-selected" : ""}
                      onClick={() => toggleValue(group.key, value)}
                    >
                      {value}
                    </button>
                  ))}
                </div>
              </section>
            ))
          )}
        </div>

        <div className="mobile-filter-actions">
          <button type="button" className="submit-button" onClick={onClose}>Показать {resultCount}</button>
        </div>
      </aside>
    </div>,
    document.body
  );
}

function getQuickCatalogMenu(category, products) {
  const base = quickCatalogMenus[category] || [];
  if (base.length === 0) return [];
  return base.map((item) => {
    const slug = item.to.split("/").filter(Boolean).pop() || item.label;
    const label = item.model || item.brand || unslugify(slug);
    const section = category === "Смартфоны" ? "Смартфоны" : category === "Планшеты" ? "Планшеты" : category;
    const scoped = products.filter((product) => matchesCatalogCategory(product, section) && matchesCatalogSubfilter(product, section, label));
    return {
      ...item,
      image: item.image || getQuickMenuImage(scoped, category, item.model || item.label, products)
    };
  });
}

function getQuickMenuImage(products, category, label, allProducts = products) {
  if (category === "iPhone") {
    return getIphoneMenuImage(label) || products[0]?.imageUrl || getClosestIphoneImage(allProducts, label) || "";
  }
  return products[0]?.imageUrl || "";
}

function getIphoneMenuImage(label) {
  const key = String(label || "").toLowerCase().replace(/^iphone\s+/, "");
  const piter = "https://pitergsm.ru";
  const images = {
    "17 pro max": `${piter}/upload/resize_cache/iblock/ac1/90_100_1/6293nng7pkgtq7y0xbwpihedss9zyy6e.png`,
    "17 pro": `${piter}/upload/resize_cache/iblock/fc0/90_100_1/e875q8j02sq49ulnbvgsngesi64wzsb5.png`,
    "air": `${piter}/upload/resize_cache/iblock/5b0/90_100_1/4wt9x7sa3ddx2lj4dj8jez2p4t7lss7k.png`,
    "17": `${piter}/upload/resize_cache/iblock/cd4/90_100_1/hjnvprchdpmycef8vs3r8yi0mjqdukj2.png`,
    "17e": `${piter}/upload/resize_cache/iblock/26b/90_100_1/58iswn9o3jb0s8n64zebtur9tv062yno.png`,
    "16 pro max": `${piter}/upload/resize_cache/iblock/357/90_100_1/3n1t841avlcycqp5m62e7sk658ewz9lr.png`,
    "16 pro": `${piter}/upload/resize_cache/iblock/46e/90_100_1/evkgi01m193mxndka5vbcbd5350v31f9.png`,
    "16 plus": `${piter}/upload/resize_cache/iblock/ffa/90_100_1/9pkui9wtxw72o8nsywsmkv29tynidyys.png`,
    "16": `${piter}/upload/resize_cache/iblock/036/90_100_1/rsy8fmvf2eqt6ulsex0m0w1yhi94i81w.png`,
    "16e": `${piter}/upload/resize_cache/iblock/417/90_100_1/c8vwv1p3q5a0ygdiqltywkdosgusdm5t.jpg`,
    "15 pro max": `${piter}/upload/resize_cache/iblock/381/90_100_1/1t99uw8lyp6bmpuej4u8c6w72i9crc8w.jpg`,
    "15 pro": `${piter}/upload/resize_cache/iblock/e49/90_100_1/pb7fcuhn5g980gxagjbz0400o14kougu.jpeg`,
    "15 plus": `${piter}/upload/resize_cache/iblock/72a/90_100_1/m22u9sbj6pmqtqsra63r7zdiukfohm41.png`,
    "15": `${piter}/upload/resize_cache/iblock/216/90_100_1/dcu25ut14lelfs1el51pjq8nd3jnqwp7.png`,
    "14 pro max": `${piter}/upload/resize_cache/iblock/612/90_100_1/7mwf4qy2y6ujy1ybo1w2frhei2hy31yo.png`,
    "14 pro": `${piter}/upload/resize_cache/iblock/9f1/90_100_1/6u3hux07iosc65sz7yv4vv083z4vs3gl.png`,
    "14 plus": `${piter}/upload/resize_cache/iblock/22a/90_100_1/e00hkbxgczyxio6gccdxz2amr260crld.jpg`,
    "14": `${piter}/upload/resize_cache/iblock/292/90_100_1/59nxz1r6xsxmwnroh7daawxrvxsh3nit.png`,
    "13 pro max": `${piter}/upload/resize_cache/iblock/bc4/90_100_1/826mvi2ui6yuqqua8uceg0pp3f7mdb8x.png`,
    "13 pro": `${piter}/upload/resize_cache/iblock/c4b/90_100_1/wjbdj4qsb93r4ap8762rmmhte58ideku.jpeg`,
    "13 mini": `${piter}/upload/resize_cache/iblock/4d5/90_100_1/qohgcu2j1317o4vwiumkhcwjystq4pu8.jpg`,
    "13": `${piter}/upload/resize_cache/iblock/e71/90_100_1/83ytgcpveu6w29ak57t6nk6edhtrphri.png`,
    "12 pro max": `${piter}/upload/resize_cache/iblock/612/90_100_1/7mwf4qy2y6ujy1ybo1w2frhei2hy31yo.png`,
    "12 pro": `${piter}/upload/resize_cache/iblock/9f1/90_100_1/6u3hux07iosc65sz7yv4vv083z4vs3gl.png`,
    "12": `${piter}/upload/resize_cache/iblock/71c/90_100_1/8z28xjma2ekmmuqhrzx9fisxkrc59prv.jpg`,
    "11 pro max": `${piter}/upload/resize_cache/iblock/bc4/90_100_1/826mvi2ui6yuqqua8uceg0pp3f7mdb8x.png`,
    "11 pro": `${piter}/upload/resize_cache/iblock/c4b/90_100_1/wjbdj4qsb93r4ap8762rmmhte58ideku.jpeg`,
    "11": `${piter}/upload/resize_cache/iblock/53c/90_100_1/eiwdhn1kaad4cwqen1xtd6x3572ztp66.png`,
    "se 2022": `${piter}/upload/resize_cache/iblock/fa7/90_100_1/g0bnq361b65su72x5mbfgxaqyslzp584.png`
  };
  return images[key] || "";
}

function getClosestIphoneImage(products, label) {
  const series = String(label || "").match(/\b(11|12|13|14|15|16|17)\b/)?.[1];
  if (!series) return "";
  return products.find((product) => product.section === "iPhone" && getProductModelLabel(product).includes(series))?.imageUrl || "";
}

function HomePage({ products, loading, addToCart, navigate, search, setSearch, favorites, toggleFavorite }) {
  const [category, setCategory] = useState("Все");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const openStatus = useOpenStatus();
  const brandOptions = useMemo(() => ["Все бренды", ...new Set(products.map((product) => product.brand).sort())], [products]);
  const filtered = useMemo(() => {
    return products.filter((product) => {
      const byCategory = category === "Все" || product.category === category;
      const byBrand = !selectedBrand || product.brand === selectedBrand;
      const bySearch = `${product.name} ${product.brand} ${product.sku}`.toLowerCase().includes(search.toLowerCase());
      return byCategory && byBrand && bySearch;
    });
  }, [products, category, selectedBrand, search]);
  const previewProducts = filtered.slice(0, 8);

  const selectBrand = (brandName) => {
    setSelectedBrand(brandName);
    setCategory("Все");
    document.querySelector("#catalog")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const selectCategory = (item) => {
    setCategory(item);
    setSelectedBrand("");
  };

  const heroServices = [
    { title: "Ремонт", Icon: Wrench, tone: "repair" },
    { title: "Аксессуары", Icon: Headphones, tone: "accessories" },
    { title: "Телефоны", Icon: Smartphone, tone: "phones" },
    { title: "Опт", Icon: Boxes, tone: "wholesale" },
    { title: "Розница", Icon: UsersRound, tone: "retail" }
  ];

  return (
    <>
      <QuickCatalogNav category="Все" navigate={navigate} products={products} />
      <section className="hero-shop">
        <div className="mobile-mark" aria-hidden="true">
          <PhotoPlaceholder compact />
        </div>
        <div className="hero-copy reveal-up">
          <div className="micro-row" aria-label="Информация о месте">
            <span>СПБ</span>
            <span>Юнона</span>
            <span>Павильон 506</span>
            <span className={`open-status ${openStatus.isOpen ? "is-open" : "is-closed"}`}>{openStatus.label}</span>
          </div>
          <h1>
            <span>Shark</span>
            <span>Mobile</span>
          </h1>
          <p className="hero-lead">Телефоны и аксессуары в наличии на Юноне.</p>
          <div className="hero-actions">
            <a className="call-button hero-call" href={phoneHref}>
              <PhoneCall size={22} strokeWidth={2.4} />
              Позвонить
            </a>
            <button className="catalog-jump" onClick={() => navigate("/catalog")}>
              <ShoppingBag size={22} strokeWidth={2.4} />
              Перейти в каталог
            </button>
          </div>
          <div className="hero-services" aria-label="Основные направления">
            {heroServices.map(({ title, Icon, tone }) => (
              <span className={`hero-service is-${tone}`} key={title}>
                <Icon size={22} strokeWidth={2.35} />
                <b>{title}</b>
              </span>
            ))}
          </div>
        </div>
        <div className="hero-phone-visual reveal-up" aria-hidden="true">
          <PhotoPlaceholder />
        </div>
        <div className="hero-logo reveal-up" aria-label="Логотип Shark Mobile">
          <PhotoPlaceholder compact />
        </div>
      </section>

      <section className="brand-section" aria-label="Бренды">
        <div className="brand-heading">
          <p className="eyebrow">Бренды</p>
          <h2>Выберите бренд</h2>
        </div>
        <BrandCarousel onSelect={selectBrand} selectedBrand={selectedBrand} />
      </section>

      <section className="catalog-section" id="catalog">
        <div className="section-title-row">
          <div>
            <p className="eyebrow">Каталог</p>
            <h2>{selectedBrand ? `${selectedBrand}: товары в наличии` : "Короткий каталог"}</h2>
          </div>
          <button className="price-link" onClick={() => navigate("/catalog")}>
            Полный каталог
            <ChevronRight size={18} />
          </button>
        </div>

        <div className="shop-layout">
          <button className="filter-toggle" onClick={() => setFiltersOpen(!filtersOpen)} aria-expanded={filtersOpen}>
            <SlidersHorizontal size={18} />
            Фильтры
            <ChevronRight size={18} />
          </button>
          <aside className={`category-rail ${filtersOpen ? "is-open" : ""}`} aria-label="Категории товаров">
            {categories.map((item) => (
              <button
                key={item}
                className={category === item && !selectedBrand ? "is-selected" : ""}
                onClick={() => {
                  selectCategory(item);
                  setFiltersOpen(false);
                }}
              >
                <span>{item}</span>
                <ChevronRight size={18} />
              </button>
            ))}
            <div className="brand-filter" aria-label="Фильтр по брендам">
              <span>Бренд</span>
              <select
                value={selectedBrand || "Все бренды"}
                onChange={(event) => {
                  const value = event.target.value;
                  setSelectedBrand(value === "Все бренды" ? "" : value);
                  setCategory("Все");
                  setFiltersOpen(false);
                }}
              >
                {brandOptions.map((brand) => (
                  <option key={brand} value={brand}>
                    {brand}
                  </option>
                ))}
              </select>
            </div>
          </aside>

          <div className="product-zone">
            <label className="search-box">
              <Search size={18} />
              <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Поиск по бренду, SKU, названию" />
            </label>
            {(selectedBrand || search) && (
              <button className="clear-filter" onClick={() => { setSelectedBrand(""); setSearch(""); setCategory("Все"); }}>
                Сбросить фильтр
              </button>
            )}

            {loading ? (
              <div className="skeleton-grid">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div className="product-card skeleton" key={index} />
                ))}
              </div>
            ) : (
              <div className="product-grid">
                {previewProducts.map((product, index) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    products={products}
                    index={index}
                    onAdd={addToCart}
                    onOpen={() => navigate(`/product/${encodeURIComponent(product.id)}`)}
                    isFavorite={favorites.includes(product.id)}
                    onToggleFavorite={toggleFavorite}
                  />
                ))}
              </div>
            )}
            {!loading && filtered.length > previewProducts.length && (
              <button className="catalog-preview-more" type="button" onClick={() => navigate("/catalog")}>
                Смотреть все товары
                <ChevronRight size={18} />
              </button>
            )}
          </div>
        </div>
      </section>

      <MapSection />
    </>
  );
}

function BrandCarousel({ onSelect, selectedBrand }) {
  return (
    <div className="brand-stage reveal-up" aria-label="Бренды в наличии">
      <div className="brand-grid">
        {brands.map((brand) => (
          <button className={`brand-card ${selectedBrand === brand.name ? "is-selected" : ""}`} key={brand.name} onClick={() => onSelect(brand.name)}>
            {brand.logo ? (
              <PhotoPlaceholder compact />
            ) : (
              <span className={brand.markClass || "brand-wordmark"}>{brand.name}</span>
            )}
            <b>{brand.name}</b>
          </button>
        ))}
      </div>
    </div>
  );
}

function getCatalogState(route) {
  const [section = "", model = ""] = String(route || "").split("/").filter(Boolean);
  const map = {
    iphone: "iPhone",
    ipad: "iPad",
    mac: "Mac",
    "apple-watch": "Apple Watch",
    smartphones: "Смартфоны",
    tablets: "Планшеты",
    airpods: "AirPods"
  };
  const category = map[section] || "Все";
  let selectedModel = model ? unslugify(model) : "";
  if (category === "iPhone") {
    selectedModel = selectedModel.replace(/^iPhone\s+/i, "");
  }
  return { category, model: selectedModel };
}

function catalogSlug(category) {
  return {
    "Все": "",
    iPhone: "iphone",
    iPad: "ipad",
    Mac: "mac",
    "Apple Watch": "apple-watch",
    Android: "smartphones",
    Смартфоны: "smartphones",
    Планшеты: "tablets",
    Аксессуары: "accessories",
    AirPods: "airpods"
  }[category] || slugify(category);
}

function matchesCatalogCategory(product, category) {
  if (category === "Все") return true;
  if (category === "Смартфоны") return product.attributes?.productType === "phone" || ["iPhone", "Android"].includes(product.section);
  if (category === "Планшеты") return product.attributes?.productType === "tablet" || product.section === "iPad";
  return product.section === category || product.category === category;
}

function matchesCatalogSubfilter(product, category, selected) {
  if (!selected) return true;
  const selectedText = normalizeSubfilter(category, selected).toLowerCase();
  if (["Смартфоны", "Планшеты"].includes(category)) {
    return [product.brand, product.section, product.category].some((value) => String(value || "").toLowerCase() === selectedText);
  }
  if (category === "iPhone") {
    return getProductModelLabel(product).toLowerCase() === selectedText;
  }
  return getProductModelLabel(product).toLowerCase().includes(selectedText);
}

function matchesAdvancedFilters(product, category, filters, groups) {
  const min = Number(filters.priceMin || 0);
  const max = Number(filters.priceMax || 0);
  if (min && Number(product.retailPrice || 0) < min) return false;
  if (max && Number(product.retailPrice || 0) > max) return false;
  return groups.every((group) => {
    const selected = filters[group.key] || [];
    if (selected.length === 0) return true;
    const value = getProductFilterValue(product, group.key);
    return selected.includes(value);
  });
}

function hasAdvancedFilters(filters) {
  return Boolean(filters.priceMin || filters.priceMax || Object.entries(filters).some(([key, value]) => key !== "priceMin" && key !== "priceMax" && Array.isArray(value) && value.length > 0));
}

function getFilterGroups(products, category) {
  const scoped = products.filter((product) => matchesCatalogCategory(product, category));
  const templates = category === "iPhone" ? iphoneFilterGroups : categoryFilterTemplates[category] || categoryFilterTemplates["Все"];
  return templates
    .map((template) => {
      const values = template.values.length > 0
        ? template.values.filter((value) => scoped.some((product) => getProductFilterValue(product, template.key) === value))
        : getUniqueFilterValues(scoped, template.key);
      return { ...template, values };
    })
    .filter((group) => group.values.length > 0);
}

function getUniqueFilterValues(products, key) {
  return [...new Set(products.map((product) => getProductFilterValue(product, key)).filter(Boolean))]
    .sort((a, b) => String(a).localeCompare(String(b), "ru", { numeric: true }));
}

function getProductFilterValue(product, key) {
  if (key === "brand") return product.brand;
  if (key === "model") {
    const model = getProductModelLabel(product);
    return product.section === "iPhone" && !/^iPhone/i.test(model) ? `iPhone ${model}` : model;
  }
  if (key === "memory") return getMemoryLabel(product);
  if (key === "color") return getColorLabel(product);
  if (key === "simType") return getSimLabel(product);
  if (key === "ram") return getRamLabel(product);
  if (key === "physicalSim") return getPhysicalSimLabel(product);
  if (key === "resolution") return getPhoneDisplaySpec(product).resolution;
  if (key === "refreshRate") return getPhoneDisplaySpec(product).refreshRate;
  if (key === "screenSize") return getScreenSizeLabel(product);
  if (key === "connectivity") return getConnectivityLabel(product);
  if (key === "chip") return getChipLabel(product);
  if (key === "size") return getWatchSizeLabel(product);
  if (key === "caseMaterial") return getWatchCaseLabel(product);
  if (key === "strap") return getWatchStrapLabel(product);
  if (key === "noiseControl") return getNoiseControlLabel(product);
  if (key === "chargingCase") return getChargingCaseLabel(product);
  if (key === "productType") return getProductTypeLabel(product.attributes?.productType || product.section || product.category);
  return "";
}

function getModelChips(products, category) {
  if (["Смартфоны", "Планшеты"].includes(category)) {
    const preferred = category === "Смартфоны"
      ? ["Apple (iPhone)", "Samsung", "Xiaomi", "Redmi", "Google", "Honor", "Huawei", "OnePlus", "Realme"]
      : ["iPad", "Samsung", "Xiaomi", "Huawei", "Honor"];
    return preferred;
  }
  const base = [...new Set(products.filter((product) => matchesCatalogCategory(product, category)).map(getProductModelLabel).filter(Boolean))];
  if (category === "iPhone") {
    [
      "17 Pro Max", "17 Pro", "17", "17e", "Air",
      "16 Pro Max", "16 Pro", "16 Plus", "16", "16e",
      "15 Pro Max", "15 Pro", "15 Plus", "15",
      "14 Pro Max", "14 Pro", "14 Plus", "14",
      "13 Pro Max", "13 Pro", "13 mini", "13",
      "12 Pro Max", "12 Pro", "12 mini", "12",
      "11 Pro Max", "11 Pro", "11", "SE 2022"
    ].forEach((item) => {
      if (!base.includes(item)) base.push(item);
    });
  }
  if (category === "iPhone") {
    return base
      .map((item) => item.replace(/^iPhone\s+/i, ""))
      .filter((item, index, items) => items.indexOf(item) === index)
      .sort((a, b) => iphoneRank(a) - iphoneRank(b));
  }
  return base.sort((a, b) => a.localeCompare(b, "ru", { numeric: true }));
}

function normalizeSubfilter(category, value) {
  const text = String(value || "").trim();
  if (category === "iPhone") return text.replace(/^iPhone\s+/i, "");
  if (category === "Смартфоны" && /^Apple/i.test(text)) return "Apple";
  if (category === "Планшеты" && /^iPad$/i.test(text)) return "iPad";
  if (category === "Смартфоны" && /^iPhone$/i.test(text)) return "iPhone";
  return text;
}

function getRouteLabel(category, value) {
  if (category === "iPhone" && !/^iPhone/i.test(value)) return `iPhone ${value}`;
  return value;
}

function getProductModelLabel(product) {
  const model = product.attributes?.model || product.name;
  if (product.section === "iPhone") {
    return model.replace(/^iPhone\s+/i, "").replace(/^Air$/i, "Air 17").replace(/\s+\d+\s*\/\s*\d+.*$/i, "").replace(/\s+RED$/i, " RED").trim();
  }
  if (product.section === "AirPods") {
    if (/AirPods Pro 2/i.test(model)) return "AirPods Pro 2";
    if (/AirPods Pro/i.test(model)) return "AirPods Pro";
    if (/AirPods 4/i.test(model) && /Pro|ANC|шум/i.test(model)) return "AirPods 4 Pro";
    if (/AirPods 4/i.test(model)) return "AirPods 4";
    if (/AirPods 3/i.test(model)) return "AirPods 3";
    if (/AirPods 2/i.test(model)) return "AirPods 2";
    if (/AirPods Max/i.test(model)) return "AirPods Max";
    return "AirPods";
  }
  if (product.section === "iPad") {
    if (/iPad Pro/i.test(product.name)) return "iPad Pro";
    if (/iPad Air/i.test(product.name)) return "iPad Air";
    if (/iPad mini/i.test(product.name)) return "iPad mini";
    return "iPad";
  }
  if (product.section === "Mac") {
    if (/MacBook Pro/i.test(product.name)) return "MacBook Pro";
    if (/MacBook Air/i.test(product.name)) return "MacBook Air";
    if (/iMac/i.test(product.name)) return "iMac";
    return "Mac";
  }
  return model;
}

function moveSelectedFirst(items, selected) {
  if (!selected) return items;
  return [...items].sort((a, b) => {
    if (a === selected) return -1;
    if (b === selected) return 1;
    return 0;
  });
}

function iphoneRank(label) {
  const order = ["17 Pro Max", "17 Pro", "17", "17e", "Air", "Air 17", "16 Pro Max", "16 Pro", "16 Plus", "16", "16e", "15 Pro Max", "15 Pro", "15 Plus", "15", "14 Pro Max", "14 Pro", "14 Plus", "14", "13 Pro Max", "13 Pro", "13 mini", "13", "12 Pro Max", "12 Pro", "12 mini", "12 RED", "12", "11 Pro Max", "11 Pro", "11", "SE 2022"];
  const index = order.findIndex((item) => item.toLowerCase() === String(label).toLowerCase());
  return index === -1 ? 999 : index;
}

function productRelevanceRank(product, category) {
  if (category === "iPhone") return 1000 - iphoneRank(getProductModelLabel(product));
  return Number(product.name.match(/\b(20\d{2})\b/)?.[1] || 0) || product.retailPrice || 0;
}

function formatProductCardTitle(product) {
  const memory = getMemoryLabel(product);
  const color = getColorLabel(product);
  const rawModel = getProductModelLabel(product);
  const model = product.section === "iPhone" && !/^iPhone/i.test(rawModel) ? `iPhone ${rawModel}` : rawModel;
  const brand = product.brand === "Apple" && /^(iPhone|iPad|Mac|AirPods|Apple Watch)/i.test(model) ? "Apple" : product.brand;
  return [brand, model, memory, color].filter(Boolean).join(", ").replace(", ,", ",");
}

function formatShortProductDescription(product) {
  const parts = getProductSpecs(product).map(([, value]) => value).filter((value) => value && value !== "audio");
  if (parts.length > 0) return parts.slice(0, 4).join(" · ");
  return product.category || product.section || product.brand;
}

function getProductSpecs(product) {
  const specs = [];
  const model = getProductModelLabel(product);
  const memory = getMemoryLabel(product);
  const color = getColorLabel(product);
  const sim = getSimLabel(product);
  if (model) specs.push(["Модель", product.section === "iPhone" && !/^iPhone/i.test(model) ? `iPhone ${model}` : model]);
  if (color) specs.push(["Цвет", color]);
  if (memory) specs.push(["Память", memory]);
  if (sim) specs.push(["SIM", sim]);
  if (product.section === "AirPods") {
    const noise = getNoiseControlLabel(product);
    const caseLabel = getChargingCaseLabel(product);
    if (caseLabel) specs.push(["Футляр", caseLabel]);
    if (noise && noise !== "без ANC") specs.push(["Звук", noise]);
  }
  if (specs.length < 3 && product.attributes?.productType && product.attributes.productType !== "audio") specs.push(["Тип", getProductTypeLabel(product.attributes.productType)]);
  return specs;
}

function getIphoneFilterSpec(product) {
  const model = getProductModelLabel(product);
  const modelText = model.toLowerCase();
  const memory = getMemoryLabel(product);
  const simType = getSimLabel(product) || (/dual/i.test(product.name) ? "2x nano-SIM" : "nano-SIM + eSIM");
  const pro = /\bpro\b/i.test(model);
  const proMax = /pro max/i.test(model);
  const plus = /plus/i.test(model);
  const mini = /mini/i.test(model);
  const se = /\bse\b/i.test(model);
  const series = Number(model.match(/\b(11|12|13|14|15|16|17)\b/)?.[1] || 15);
  const screenSize = se ? "4.7" : mini ? "5.4" : proMax && series >= 16 ? "6.9" : proMax ? "6.7" : plus ? "6.7" : series >= 16 && pro ? "6.3" : "6.1";
  const resolution = getIphoneResolution({ series, pro, proMax, plus, mini, se });
  return {
    memory,
    simType,
    ram: series >= 16 ? "8 ГБ" : series >= 15 && pro ? "8 ГБ" : series >= 14 ? "6 ГБ" : "4 ГБ",
    physicalSim: simType === "eSIM" ? "0" : simType.includes("2x") ? "2" : "1",
    resolution,
    refreshRate: pro ? "120 Гц" : "60 Гц",
    screenSize
  };
}

function getIphoneResolution({ series, pro, proMax, plus, mini, se }) {
  if (se) return "1334 × 750";
  if (mini) return "2340 × 1080";
  if (proMax && series >= 16) return "2868 × 1320";
  if (proMax && series >= 14) return "2796 × 1290";
  if (pro && series >= 16) return "2622 × 1206";
  if (pro && series >= 14) return "2556 × 1179";
  if (plus && series >= 14) return "2778 × 1284";
  if (series >= 12) return "2532 × 1170";
  return "1792 × 828";
}

function getProductGallery(product, products = []) {
  const official = getOfficialProductGallery(product);
  if (official.length > 0) return official.map((src, index) => ({ src, view: `official-${index}` }));
  const own = getRawGallery(product);
  if (own.length === 0) return [];
  return own.slice(0, 5).map((src, index) => ({ src, view: `local-${index}` }));
}

function getOfficialGalleryModel(product) {
  const model = getProductModelLabel(product);
  if (product.section === "iPhone" && !/^iPhone/i.test(model)) {
    return `iPhone ${model}`.replace(/^iPhone Air 17$/i, "iPhone Air");
  }
  return model;
}

function getOfficialProductGallery(product) {
  const model = getOfficialGalleryModel(product);
  const color = getColorLabel(product);
  const appleColor = getAppleColorSlug(color, model);

  const iphoneNewsroomGallery = getIphoneNewsroomGallery(product, model, color);
  if (iphoneNewsroomGallery.length > 0) return iphoneNewsroomGallery;

  const iphone15Base = getIphone15GalleryBase(product, model, color);
  if (iphone15Base) return appleStoreGallery(iphone15Base);

  const iphone14Base = getIphone14GalleryBase(product, model, color);
  if (iphone14Base) return appleStoreGallery(iphone14Base);

  const iphone13Base = getIphone13GalleryBase(product, model, color);
  if (iphone13Base) return appleStoreGallery(iphone13Base);

  const iphone12Base = getIphone12GalleryBase(product, model, color);
  if (iphone12Base) return appleStoreGallery(iphone12Base);

  if (/AirPods 4/i.test(model)) {
    return [
      "https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/airpods-4-hero-select-202409?wid=976&hei=916&fmt=jpeg&qlt=90",
      "https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/airpods-4-down-compare-202409?wid=420&hei=500&fmt=jpeg&qlt=90",
      "https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/airpods-4-up-compare-202409?wid=420&hei=500&fmt=jpeg&qlt=90"
    ];
  }

  if (/AirPods 3/i.test(model)) {
    return [
      "https://www.apple.com/newsroom/images/product/airpods/standard/Apple_AirPods-3rd-gen_hero_10182021_inline.jpg.large.jpg",
      "https://www.apple.com/newsroom/images/product/airpods/standard/Apple_AirPods-3rd-gen_MagSafe-charging_10182021_inline.jpg.large.jpg",
      "https://www.apple.com/newsroom/images/product/airpods/standard/Apple_AirPods-3rd-gen_spatial-audio_10182021_big.jpg.large.jpg"
    ];
  }

  if (/AirPods Pro/i.test(model)) {
    return [
      "https://www.apple.com/v/airpods-pro/s/images/overview/welcome/hero__b0eal3mn03ua_large.jpg",
      "https://www.apple.com/v/airpods-pro/s/images/overview/welcome/hero_endframe__vzawkxxoc72u_large.jpg",
      "https://www.apple.com/v/airpods-pro/s/images/overview/welcome/hero_startframe__bfinf01b59si_large.jpg"
    ];
  }

  if (/AirPods Max/i.test(model)) {
    return [
      "https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/airpods-max-hero-select-202409?wid=1000&hei=1000&fmt=jpeg&qlt=95",
      "https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/airpods-max-select-202409-blue?wid=1000&hei=1000&fmt=jpeg&qlt=95",
      "https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/airpods-max-select-202409-midnight?wid=1000&hei=1000&fmt=jpeg&qlt=95"
    ];
  }

  if (/AirPods 2/i.test(model)) {
    return [
      "https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/airpods-charge-case-201910?wid=1000&hei=1000&fmt=jpeg&qlt=95",
      "https://www.apple.com/newsroom/images/product/airpods/standard/Apple-AirPods-worlds-most-popular-wireless-headphones_03202019_big.jpg.large.jpg",
      "https://www.apple.com/newsroom/images/product/airpods/standard/Apple-AirPods-worlds-most-popular-wireless-headphones-hey-siri_03202019_big.jpg.large.jpg"
    ];
  }

  if (/Watch SE/i.test(model)) {
    return [
      "https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/watch-compare-se-202509?wid=520&hei=520&fmt=jpeg&qlt=90",
      "https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/watch-compare-se3-swatches-202509?wid=60&hei=24&fmt=jpeg&qlt=90",
      "https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/watch-se-og-image-202509?wid=400&hei=400&fmt=jpeg&qlt=90"
    ];
  }

  if (/Watch Series/i.test(model)) {
    return [
      "https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/watch-compare-s11-202509?wid=520&hei=520&fmt=jpeg&qlt=90",
      "https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/watch-compare-series11-swatches-202509?wid=240&hei=24&fmt=jpeg&qlt=90",
      "https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/watch-compare-ultra3-202509_GEO_US?wid=520&hei=520&fmt=jpeg&qlt=90"
    ];
  }

  if (/MacBook Air/i.test(model) || /^Mac(Book)?$/i.test(model)) {
    return [
      "https://www.apple.com/v/macbook-air/z/images/overview/hero/hero_static__c9sislzzicq6_large.png",
      "https://www.apple.com/v/macbook-air/z/images/overview/hero/hero_startframe__c0rhv2ultfau_large.png",
      "https://www.apple.com/v/macbook-air/z/images/overview/hero/hero_endframe__c67cz35iy9me_large.png"
    ];
  }

  if (/MacBook Pro/i.test(model)) {
    return [
      "https://www.apple.com/v/macbook-pro/ax/images/overview/welcome/hero_endframe__fwev9ebh42mq_large.jpg",
      "https://www.apple.com/v/macbook-pro/ax/images/overview/welcome/hero_startframe__ek0dqbh61vau_large.jpg",
      "https://www.apple.com/v/macbook-pro/ax/images/overview/highlights/highlights_chip_endframe__dp975gwqppw2_large.jpg"
    ];
  }

  if (/iPad Pro/i.test(model)) {
    return [
      "https://www.apple.com/v/ipad-pro/aw/images/overview/hero/hero_endframe__du5kcy4qnxkm_large.jpg",
      "https://www.apple.com/v/ipad-pro/aw/images/overview/closer-look/space-black/slide_1A__gnqepv0kr3ee_large.jpg",
      "https://www.apple.com/v/ipad-pro/aw/images/overview/closer-look/space-black/slide_1B__fxu0jie3i0ya_large.jpg"
    ];
  }

  if (/iPad Air/i.test(model)) {
    return [
      "https://www.apple.com/v/ipad-air/ah/images/overview/hero/hero_endframe__6gl84bccyaqi_large.png",
      "https://www.apple.com/v/ipad-air/ah/images/overview/closer-look/all-colors/slide_1A__u8zw91uc6iaq_large.jpg",
      "https://www.apple.com/v/ipad-air/ah/images/overview/closer-look/all-colors/slide_2A__p74br7miwoiq_large.jpg"
    ];
  }

  if (/iPad mini/i.test(model)) {
    return [
      "https://www.apple.com/v/ipad-mini/v/images/overview/design/colors__ed8x8u1yg6uu_large.jpg",
      "https://www.apple.com/v/ipad-mini/v/images/overview/hero/fan__mub6p4ua0t2y_large.jpg",
      "https://www.apple.com/v/ipad-mini/v/images/overview/design/liquid_retina_1__eh1ihtzkw8wi_large.jpg"
    ];
  }

  if (/^iPad$/i.test(model) && /space|серый космос|seryy-kosmos/i.test(`${color || ""} ${product.slug || ""}`)) {
    return [
      "https://www.apple.com/newsroom/images/product/ipad/standard/Apple_iPad-10-2-inch_Ninth-Gen_09142021_big.jpg.large.jpg",
      "https://www.apple.com/newsroom/images/product/ipad/standard/Apple_iPad-10-2-inch_Connect_09142021_big.jpg.large.jpg",
      "https://www.apple.com/newsroom/images/product/ipad/standard/Apple_iPad-10-2-inch_Family_09142021_big.jpg.large.jpg"
    ];
  }

  const androidGallery = getAndroidOfficialGallery(product, model);
  if (androidGallery.length > 0) return androidGallery;

  if (!appleColor) return [];

  if (/^iPhone 16$/i.test(model)) {
    return [
      `https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/iphone-16-${appleColor}-select-202409?wid=940&hei=1112&fmt=png-alpha`,
      `https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/iphone-16-${appleColor}-select-202409_AV2?wid=750&hei=506&fmt=jpeg&qlt=90`,
      `https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/iphone-16-${appleColor}-select-202409_AV3?wid=1246&hei=518&fmt=jpeg&qlt=90`
    ];
  }

  if (/^iPhone 16 Plus$/i.test(model)) {
    return [
      `https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/iphone-16-plus-${appleColor}-select-202409?wid=940&hei=1112&fmt=png-alpha`,
      `https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/iphone-16-plus-${appleColor}-select-202409_AV2?wid=750&hei=506&fmt=jpeg&qlt=90`,
      `https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/iphone-16-plus-${appleColor}-select-202409_AV3?wid=1246&hei=518&fmt=jpeg&qlt=90`
    ];
  }

  if (/^iPad$/i.test(model) && ["pink", "blue", "silver", "yellow"].includes(appleColor)) {
    return [
      `https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/ipad-finish-select-202503-${appleColor}?wid=1200&hei=630&fmt=jpeg&qlt=95`,
      `https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/ipad-${appleColor}-wifi-witb-202210?wid=618&hei=678&fmt=jpeg&qlt=90`,
      "https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/ipad-model-unselect-gallery-1-202503?wid=5120&hei=2880&fmt=p-jpg&qlt=80"
    ];
  }

  return [];
}

function appleStoreGallery(base) {
  return [
    `https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/${base}?wid=1000&hei=1000&fmt=jpeg&qlt=95`,
    `https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/${base}_AV1_GEO_US?wid=1000&hei=1000&fmt=jpeg&qlt=95`,
    `https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/${base}_AV2?wid=1000&hei=1000&fmt=jpeg&qlt=95`
  ];
}

function getIphoneNewsroomGallery(product, model, color) {
  const text = `${color || ""} ${product.slug || ""} ${product.name || ""}`.toLowerCase();
  const isRed = /red|krasn/.test(text);
  if (isRed && /^iPhone 14( Plus)?$/i.test(model)) {
    return [
      "https://www.apple.com/newsroom/images/product/iphone/standard/Apple-iPhone-14-iPhone-14-Plus-2up-PRODUCT-RED-220907_inline.jpg.large.jpg",
      "https://www.apple.com/newsroom/images/product/iphone/standard/Apple-iPhone-14-iPhone-14-Plus-5up-hero-220907_Full-Bleed-Image.jpg.large.jpg",
      "https://www.apple.com/newsroom/images/product/watch/standard/Apple-iPhone-14-iPhone-14-Plus-back-camera-220907_inline.jpg.large.jpg"
    ];
  }
  if (isRed && /^iPhone 13( mini)?$/i.test(model)) {
    return [
      "https://www.apple.com/newsroom/images/product/iphone/standard/Apple_iphone13_hero_09142021_inline.jpg.large.jpg",
      "https://www.apple.com/newsroom/images/product/iphone/standard/Apple_iphone13_colors_09142021_big.jpg.large.jpg",
      "https://www.apple.com/newsroom/images/product/iphone/standard/Apple_iphone13_design_09142021_big.jpg.large.jpg"
    ];
  }
  if (isRed && /^iPhone 12( RED)?$/i.test(model)) {
    return [
      "https://www.apple.com/newsroom/images/product/iphone/standard/apple_iphone-12-spring21_hero_us_04202021_big.jpg.large.jpg",
      "https://www.apple.com/newsroom/images/product/iphone/standard/apple_iphone-12-spring21_durable-design-display_us_04202021_Full-Bleed-Image.jpg.large.jpg",
      "https://www.apple.com/newsroom/images/product/iphone/standard/apple_iphone-12-spring21_camera_04202021_big.jpg.large.jpg"
    ];
  }
  if (/^iPhone 11$/i.test(model)) {
    return [
      "https://www.apple.com/newsroom/images/product/iphone/standard/Apple_iphone_11-rosette-family-lineup-091019_big.jpg.large.jpg",
      "https://www.apple.com/newsroom/images/product/iphone/standard/Apple_iphone_11-wallpaper-screen-091019_inline.jpg.large.jpg",
      "https://www.apple.com/newsroom/images/product/iphone/standard/Apple_iphone_11-family-lineup-091019_big.jpg.large.jpg"
    ];
  }
  return [];
}

function getAndroidOfficialGallery(product, model) {
  const text = `${product.brand || ""} ${model || ""} ${product.name || ""} ${product.slug || ""}`.toLowerCase();
  if (/google|pixel/.test(text)) {
    if (/9a|10a/.test(text)) {
      return [
        "https://storage.googleapis.com/gweb-uniblog-publish-prod/images/image_global_P9a_2024Q4_24H077x0.width-1200.format-webp.webp",
        "https://storage.googleapis.com/gweb-uniblog-publish-prod/images/9a_all.width-100.format-webp.webp",
        "https://storage.googleapis.com/gweb-uniblog-publish-prod/images/MacroFocus.width-100.format-webp.webp"
      ];
    }
    if (/fold/.test(text)) {
      return [
        "https://storage.googleapis.com/gweb-uniblog-publish-prod/images/P9PFold_YT_Thumbnail_Opt1.width-600.format-webp.webp",
        "https://storage.googleapis.com/gweb-uniblog-publish-prod/images/P9P9PThumbnail_16x9_Opt2_1.width-100.format-webp.webp",
        "https://storage.googleapis.com/gweb-uniblog-publish-prod/images/compare-sizes-desktop-caimanporce.width-100.format-webp_00xdY7w.webp"
      ];
    }
    return [
      "https://storage.googleapis.com/gweb-uniblog-publish-prod/images/image_P9P_2024Q2_23H121x002_Ortho.width-600.format-webp_KIn6IAr.webp",
      "https://storage.googleapis.com/gweb-uniblog-publish-prod/images/P9P9PThumbnail_16x9_Opt2_1.width-100.format-webp.webp",
      "https://storage.googleapis.com/gweb-uniblog-publish-prod/images/compare-sizes-desktop-caimanporce.width-100.format-webp_00xdY7w.webp"
    ];
  }

  if (/honor/.test(text)) {
    if (/x9d|x9c|x9/.test(text)) {
      return [
        "https://www.honor.com/content/dam/honor/common/product-list/product-series/honor-x9d/honor-x9d-red-list.png",
        "https://www-file.honor.com/content/dam/honor/common/product-list/product-series/honor-x9d/honor-x9d-red-back.png",
        "https://www-file.honor.com/content/dam/honor/common/product-list/product-series/honor-x9d/honor-x9d-red-front.png"
      ];
    }
    if (/x7d|x7c|x7/.test(text)) {
      return [
        "https://www.honor.com/content/dam/honor/common/products/smartphone/honor-x7d/assets/share-x7d.jpg",
        "https://www.honor.com/content/dam/honor/common/product-list/product-series/honor-x7d/honor-x7d-gold-list.png",
        "https://www-file.honor.com/content/dam/honor/common/product-list/product-series/honor-400/honor-400-id-gold-front.png"
      ];
    }
    if (/600/.test(text)) {
      return [
        "https://www-file.honor.com/content/dam/honor/common/product-list/product-series/honor-600/honor-600-id-orange-back.png",
        "https://www-file.honor.com/content/dam/honor/common/product-list/product-series/honor-600/honor-600-id-orange-front.png",
        "https://www-file.honor.com/content/dam/honor/common/product-list/product-series/honor-600-lite/honor-600-lite-id-green-back.png"
      ];
    }
    if (/magic v|magic8|magic7/.test(text)) {
      return [
        "https://www-file.honor.com/content/dam/honor/common/product-list/product-series/honor-magic-v6/honor-magic-v5-id-red.png",
        "https://www-file.honor.com/content/dam/honor/common/product-list/product-series/honor-magic-v5/honor-magic-v5-id-gold.png",
        "https://www-file.honor.com/content/dam/honor/common/product-list/product-series/honor-magic7-pro/honor-magic7-pro-id-gary-front.png"
      ];
    }
    return [
      "https://www-file.honor.com/content/dam/honor/common/product-list/product-series/honor-400/honor-400-id-gold-back.png",
      "https://www-file.honor.com/content/dam/honor/common/product-list/product-series/honor-400/honor-400-id-gold-front.png",
      "https://www.honor.com/content/dam/honor/common/product-list/product-series/honor-400/honor-400-gold-list.png"
    ];
  }

  if (/huawei/.test(text)) {
    const exactLocal = product.imageUrl ? [product.imageUrl] : [];
    if (/mate xt/.test(text)) {
      return [
        ...exactLocal,
        "https://consumer.huawei.com/content/dam/huawei-cbg-site/common/mkt/pdp/phones/mate-xt-ultimate-design/wx-share.jpg",
        "https://consumer.huawei.com/dam/content/dam/huawei-cbg-site/common/mkt/pdp/phones/mate-x7/list-white.png"
      ].slice(0, 3);
    }
    if (/mate x/.test(text)) {
      return [
        ...exactLocal,
        "https://consumer.huawei.com/dam/content/dam/huawei-cbg-site/common/mkt/pdp/phones/mate-x7/list-white.png",
        "https://consumer.huawei.com/dam/content/dam/huawei-cbg-site/common/mkt/pdp/admin-image/phones/mate-x6/list/red.png",
        "https://consumer.huawei.com/content/dam/huawei-cbg-site/common/mkt/pdp/phones/mate-x6/wxshare.jpg"
      ].slice(0, 3);
    }
    return [
      ...exactLocal,
      "https://consumer.huawei.com/dam/content/dam/huawei-cbg-site/common/mkt/plp-x/phones-v5/0507-2026-huawei-innovative-product-launch/kv/nova15-max-wxshare.jpg",
      "https://consumer.huawei.com/dam/content/dam/huawei-cbg-site/common/mkt/pdp/admin-image/phones/mate-x6/list/red.png",
      "https://consumer.huawei.com/content/dam/huawei-cbg-site/common/mkt/pdp/phones/mate-x6/wxshare.jpg"
    ].slice(0, 3);
  }

  return [];
}

function getIphone15GalleryBase(product, model, color) {
  if (!/^iPhone 15/i.test(model)) return "";
  const text = `${color || ""} ${product.slug || ""} ${product.name || ""}`.toLowerCase();
  const isProMax = /pro max/i.test(model);
  const isPro = /pro/i.test(model);
  const isPlus = /plus/i.test(model);
  const colorSlug = isPro
    ? getTitaniumColorSlug(text)
    : getIphoneColorSlug(text);
  if (!colorSlug) return "";
  const prefix = isProMax ? "refurb-iphone-15-pro-max" : isPro ? "refurb-iphone-15-pro" : isPlus ? "refurb-iphone-15-plus" : "refurb-iphone-15";
  return `${prefix}-${colorSlug}-202412`;
}

function getIphone14GalleryBase(product, model, color) {
  if (!/^iPhone 14/i.test(model)) return "";
  const text = `${color || ""} ${product.slug || ""} ${product.name || ""}`.toLowerCase();
  const isProMax = /pro max/i.test(model);
  const isPro = /pro/i.test(model);
  const isPlus = /plus/i.test(model);
  const colorSlug = isPro ? getIphone14ProColorSlug(text) : getIphone14ColorSlug(text);
  if (!colorSlug) return "";
  const prefix = isProMax ? "refurb-iphone-14-pro-max" : isPro ? "refurb-iphone-14-pro" : isPlus ? "refurb-iphone-14-plus" : "refurb-iphone-14";
  return `${prefix}-${colorSlug}-202404`;
}

function getIphone13GalleryBase(product, model, color) {
  const text = `${color || ""} ${product.slug || ""} ${product.name || ""}`.toLowerCase();
  if (/^iPhone 13 mini/i.test(model)) {
    const colorSlug = getIphone13MiniColorSlug(text);
    return colorSlug ? `refurb-iphone-13-mini-${colorSlug}-2022` : "";
  }
  if (/^iPhone 13$/i.test(model)) {
    const colorSlug = getIphone13MiniColorSlug(text);
    return colorSlug ? `refurb-iphone-13-${colorSlug}-2023` : "";
  }
  return "";
}

function getIphone12GalleryBase(product, model, color) {
  if (!/^iPhone 12$/i.test(model)) return "";
  const text = `${color || ""} ${product.slug || ""} ${product.name || ""}`.toLowerCase();
  const colorSlug = getIphone12ColorSlug(text);
  return colorSlug ? `refurb-iphone-12-${colorSlug}` : "";
}

function getIphone12ColorSlug(value) {
  if (/black|chern/.test(value)) return "black-2020";
  if (/white|bel|starlight/.test(value)) return "white-2020";
  if (/blue|golub|siniy/.test(value)) return "blue-2020";
  if (/green|zelen/.test(value)) return "green-2020";
  if (/purple|fiolet/.test(value)) return "purple-2021";
  return "";
}

function getIphone14ProColorSlug(value) {
  if (/black|черн|chern|space/.test(value)) return "spaceblack";
  if (/silver|сереб|white|бел|bel/.test(value)) return "silver";
  if (/gold|золот|zolot/.test(value)) return "gold";
  if (/purple|фиолет|fiolet|deep/.test(value)) return "deeppurple";
  return "";
}

function getIphone14ColorSlug(value) {
  if (/red|krasn/.test(value)) return "red";
  if (/blue|голуб|син|golub|siniy/.test(value)) return "blue";
  if (/black|черн|chern|midnight/.test(value)) return "midnight";
  if (/white|бел|bel|starlight/.test(value)) return "starlight";
  if (/purple|фиолет|fiolet/.test(value)) return "purple";
  if (/yellow|желт|жёлт|zhelt/.test(value)) return "yellow";
  return "";
}

function getIphone13MiniColorSlug(value) {
  if (/white|бел|bel|starlight/.test(value)) return "starlight";
  if (/black|черн|chern|midnight/.test(value)) return "midnight";
  if (/blue|голуб|син|golub|siniy/.test(value)) return "blue";
  if (/pink|роз|roz/.test(value)) return "pink";
  if (/green|зел|zelen/.test(value)) return "green";
  return "";
}

function getTitaniumColorSlug(value) {
  if (/black|черн|chern/.test(value)) return "blacktitanium";
  if (/blue|син|siniy|golub/.test(value)) return "bluetitanium";
  if (/natural|сер|ser/.test(value)) return "naturaltitanium";
  if (/white|бел|bel/.test(value)) return "whitetitanium";
  return "";
}

function getIphoneColorSlug(value) {
  if (/pink|роз|roz/.test(value)) return "pink";
  if (/blue|голуб|син|golub|siniy/.test(value)) return "blue";
  if (/green|зел|zelen/.test(value)) return "green";
  if (/black|черн|chern/.test(value)) return "black";
  if (/yellow|желт|жёлт|zhelt/.test(value)) return "yellow";
  return "";
}

function getAppleColorSlug(color, model = "") {
  const value = String(color || "").toLowerCase();
  const modelText = String(model || "").toLowerCase();
  if (/pink|роз|коралл/.test(value)) return "pink";
  if (/blue|син|голуб|ultramarine/.test(value)) return /iphone 16/.test(modelText) ? "ultramarine" : "blue";
  if (/teal|бирюз/.test(value)) return "teal";
  if (/зел/.test(value)) return /iphone 16/.test(modelText) ? "teal" : "green";
  if (/white|бел|starlight|сия/.test(value)) return "white";
  if (/black|чер|midnight|obsidian/.test(value)) return "black";
  if (/silver|сереб/.test(value)) return "silver";
  if (/yellow|желт|жёлт/.test(value)) return "yellow";
  return "";
}

function getRawGallery(product) {
  const gallery = Array.isArray(product.gallery) ? product.gallery : [];
  return uniqueImages([product.imageUrl, ...gallery].filter(Boolean));
}

function uniqueImages(items) {
  return [...new Set(items.filter((item) => typeof item === "string" && item.trim()))];
}

function getSimLabel(product) {
  const value = String(product.attributes?.sim || product.name || "");
  if (/eSIM/i.test(value)) return "eSIM";
  if (/dual\s*sim|2\s*sim|две\s*sim/i.test(value)) return "2x nano-SIM";
  if (/nano/i.test(value)) return "nano-SIM";
  if (/sim/i.test(value)) return "nano-SIM + eSIM";
  if (product.section === "iPhone") return "nano-SIM + eSIM";
  if (product.attributes?.productType === "phone") return "nano-SIM";
  return "";
}

function getPhysicalSimLabel(product) {
  const sim = getSimLabel(product);
  if (sim === "eSIM") return "0";
  if (sim.includes("2x")) return "2";
  return sim ? "1" : "";
}

function getRamLabel(product) {
  const source = `${product.attributes?.memory || ""} ${product.name || ""}`;
  const slash = String(source).match(/\b(4|6|8|12|16|24|32|36|48|64)\s*[\/-]\s*(64|128|256|512|1024)\s*(GB|ГБ|Gb|Гб|TB|ТБ|Tb|Тб)\b/i);
  if (slash) return `${Number(slash[1])} ГБ`;
  const ram = String(source).match(/\b(4|6|8|12|16|24|32|36|48|64)\s*(GB|ГБ|Gb|Гб)\s*(RAM|ОЗУ|Unified|памяти)?\b/i);
  if (ram && /Mac|Pixel|Honor|Huawei|Xiaomi|Samsung|ОЗУ|RAM|Unified/i.test(source)) return `${Number(ram[1])} ГБ`;
  if (product.section === "iPhone") return getIphoneFilterSpec(product).ram;
  return "";
}

function getPhoneDisplaySpec(product) {
  if (product.section === "iPhone") return getIphoneFilterSpec(product);
  if (product.attributes?.productType !== "phone" && product.section !== "Android") {
    return { resolution: "", refreshRate: "", screenSize: "" };
  }
  const slug = String(product.slug || "").toLowerCase();
  if (/pixel-(10|9)-pro-fold/.test(slug)) {
    return { resolution: "2076 × 2152", refreshRate: "120 Гц", screenSize: "8.0" };
  }
  if (/pixel-(10|9)-pro-xl/.test(slug)) {
    return { resolution: "2992 × 1344", refreshRate: "120 Гц", screenSize: "6.8" };
  }
  if (/pixel-(10|9)-pro/.test(slug)) {
    return { resolution: "2856 × 1280", refreshRate: "120 Гц", screenSize: "6.3" };
  }
  if (/pixel-(10|9)a|pixel-(10|9)/.test(slug)) {
    return { resolution: "2424 × 1080", refreshRate: "120 Гц", screenSize: "6.3" };
  }
  if (/honor-magic-v|huawei-mate-x|mate-xt/.test(slug)) {
    return { resolution: "2344 × 2156", refreshRate: "120 Гц", screenSize: "7.9" };
  }
  if (/honor-.*pro|huawei-mate-.*pro|huawei-nova-.*pro/.test(slug)) {
    return { resolution: "2800 × 1260", refreshRate: "120 Гц", screenSize: "6.8" };
  }
  if (/honor-x|honor-.*lite|huawei-nova/.test(slug)) {
    return { resolution: "2412 × 1080", refreshRate: "90 Гц", screenSize: "6.7" };
  }
  return { resolution: "", refreshRate: "", screenSize: "" };
}

function getScreenSizeLabel(product) {
  if (product.section === "iPhone" || product.section === "Android" || product.attributes?.productType === "phone") {
    return getPhoneDisplaySpec(product).screenSize;
  }
  const match = String(product.name).match(/\b(10\.9|11|12\.9|13|14|15|16|40|41|42|44|45|46|49)\b(?=.*(дюйм|inch|mm|мм|iPad|MacBook|Watch))/i);
  return match ? match[1] : "";
}

function getConnectivityLabel(product) {
  const text = `${product.attributes?.sim || ""} ${product.name || ""}`;
  if (/cellular|lte|5g/i.test(text)) return "Wi-Fi + Cellular";
  if (/wi-?fi/i.test(text)) return "Wi-Fi";
  return "";
}

function getChipLabel(product) {
  const match = String(product.name).match(/\b(Apple\s+)?(M1|M2|M3|M4|M5|A16|A17|A18|A19)\b/i);
  return match ? match[2].toUpperCase() : "";
}

function getWatchSizeLabel(product) {
  const match = String(product.name).match(/\b(40|41|42|44|45|46|49)\s*mm\b/i);
  return match ? `${match[1]} мм` : "";
}

function getWatchCaseLabel(product) {
  const text = String(product.name).toLowerCase();
  if (/titanium|титан/.test(text)) return "титан";
  if (/stainless|steel|сталь/.test(text)) return "сталь";
  if (/aluminum|aluminium|алюмин/.test(text)) return "алюминий";
  return "";
}

function getWatchStrapLabel(product) {
  const text = String(product.name);
  if (/milanese/i.test(text)) return "Milanese Loop";
  if (/sport\s+loop/i.test(text)) return "Sport Loop";
  if (/sport\s+band/i.test(text)) return "Sport Band";
  return "";
}

function getNoiseControlLabel(product) {
  const text = `${product.name} ${product.attributes?.model || ""}`;
  if (/ANC|шум|noise/i.test(text)) return "ANC";
  if (/Pro/i.test(text)) return "ANC";
  return "без ANC";
}

function getChargingCaseLabel(product) {
  const text = String(product.name);
  if (/usb-c|type-c/i.test(text)) return "USB-C";
  if (/magsafe/i.test(text)) return "MagSafe";
  if (/lightning/i.test(text)) return "Lightning";
  if (/футляр|case/i.test(text)) return "зарядный футляр";
  return "";
}

function getProductTypeLabel(type) {
  return {
    phone: "смартфон",
    tablet: "планшет",
    laptop: "ноутбук",
    watch: "часы",
    headphones: "наушники",
    audio: "наушники",
    AirPods: "наушники",
    iPhone: "смартфон",
    Android: "смартфон",
    iPad: "планшет",
    Mac: "ноутбук",
    "Apple Watch": "часы"
  }[type] || type;
}

function getMemoryLabel(product) {
  if (product.section === "Mac") {
    const storage = String(product.name).match(/\b(128|256|512|1024|1|2)\s*(GB|Gb|ГБ|Гб|TB|Tb|ТБ|Тб)\s*SSD\b/i);
    if (storage) {
      const amount = Number(storage[1]);
      const unit = storage[2].toLowerCase();
      if (unit.includes("t") || unit.includes("т") || amount === 1024) return amount === 2 ? "2 ТБ" : "1 ТБ";
      return `${amount} ГБ`;
    }
  }
  const source = product.attributes?.memory || product.name;
  const match = String(source).match(/\b(64|128|256|512|1024|1|2)\s*(GB|Gb|ГБ|Гб|TB|Tb|ТБ|Тб)\b/i);
  if (!match) return "";
  const amount = Number(match[1]);
  const unit = match[2].toLowerCase();
  if (unit.includes("t") || unit.includes("т") || amount === 1024) {
    return amount === 2 ? "2 ТБ" : "1 ТБ";
  }
  return `${amount} ГБ`;
}

function getColorLabel(product) {
  const candidates = [
    product.attributes?.color,
    product.name.match(/\(([^()]+)\)\s*$/)?.[1],
    product.name.split(",").pop()
  ];
  for (const item of candidates) {
    const color = normalizeCardColor(item);
    if (color) return color;
  }
  return "";
}

function normalizeCardColor(value) {
  const raw = String(value || "").replace(/[()]/g, "").trim();
  if (!raw || /^\d{4}$/.test(raw) || raw.length > 28 || /CPU|GPU|SSD|Wi-?Fi|USB|PRODUCT|Charger|футляр|заряд/i.test(raw)) return "";
  if (/[А-ЯA-Z0-9]{4,}/.test(raw) && !/\s/.test(raw)) return "";
  const lower = raw.toLowerCase();
  const map = {
    "белый": "белый",
    "черный": "черный",
    "чёрный": "черный",
    "синий": "синий",
    "голубой": "голубой",
    "зеленый": "зеленый",
    "зелёный": "зеленый",
    "серый": "серый",
    "серебристый": "серебристый",
    "серый космос": "серый космос",
    "розовый": "розовый",
    "фиолетовый": "фиолетовый",
    "красный": "красный",
    "золотистый": "золотистый",
    "графит": "графит"
  };
  return map[lower] || raw.toLowerCase();
}

function slugify(value) {
  return String(value).toLowerCase().replace(/\+/g, " plus ").replace(/[^a-zа-яё0-9]+/gi, "-").replace(/^-+|-+$/g, "");
}

function unslugify(value) {
  const text = String(value || "").split("-").join(" ");
  return text.replace(/^iphone/i, "iPhone").replace(/^ipad/i, "iPad").replace(/^mac/i, "Mac");
}

function MapSection() {
  return (
    <section className="map-section" id="route" aria-labelledby="route-title">
      <div className="map-copy">
        <div>
          <p className="eyebrow">Где нас найти</p>
          <h2 id="route-title">Юнона, павильон 506</h2>
        </div>
        <div className="map-actions">
          <a className="call-button" href={phoneHref}>
            Позвонить
          </a>
          <a className="catalog-jump" href={mapHref} target="_blank" rel="noreferrer">
            Открыть маршрут
          </a>
        </div>
      </div>
      <div className="map-panel" aria-label="Карта: Shark Mobile, ярмарка Юнона, павильон 506">
        <iframe
          src="https://yandex.ru/map-widget/v1/?ll=30.209705%2C59.862438&mode=poi&poi%5Bpoint%5D=30.209705%2C59.862438&poi%5Buri%5D=ymapsbm1%3A%2F%2Forg%3Foid%3D1766072614&z=18.5"
          title="Карта: Shark Mobile, ярмарка Юнона, павильон 506"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </section>
  );
}

function ProductCard({ product, products = [], index, onAdd, onOpen, isFavorite = false, onToggleFavorite }) {
  const available = product.stockQty > 0;
  const gallery = getProductGallery(product, products).slice(0, 3);
  const [activePhoto, setActivePhoto] = useState(0);
  const photoIndex = Math.min(activePhoto, gallery.length - 1);
  const movePhoto = (event) => {
    if (event.pointerType && event.pointerType !== "mouse") return;
    if (gallery.length < 2) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const next = Math.min(gallery.length - 1, Math.max(0, Math.floor(((event.clientX - rect.left) / rect.width) * gallery.length)));
    setActivePhoto(next);
  };
  const syncPhotoScroll = (event) => {
    if (gallery.length < 2) return;
    const node = event.currentTarget;
    const next = Math.round(node.scrollLeft / Math.max(node.clientWidth, 1));
    setActivePhoto(Math.min(gallery.length - 1, Math.max(0, next)));
  };
  return (
    <article
      className="product-card reveal-card"
      style={{ "--delay": `${Math.min(index, 8) * 42}ms`, "--active-photo": photoIndex, "--photo-count": gallery.length }}
      onPointerMove={movePhoto}
      onClick={onOpen}
      onKeyDown={(event) => {
        if (event.target === event.currentTarget && event.key === "Enter") {
          onOpen?.();
        }
      }}
      role="link"
      tabIndex={0}
      aria-label={`Открыть товар ${product.name}`}
    >
      <button
        className={`favorite-toggle ${isFavorite ? "is-active" : ""}`}
        onClick={(event) => {
          event.stopPropagation();
          onToggleFavorite?.(product.id);
        }}
        aria-label={isFavorite ? "Убрать из избранного" : "Добавить в избранное"}
      >
        <Heart size={18} fill={isFavorite ? "currentColor" : "none"} />
      </button>
      <div className="product-photo" onScroll={syncPhotoScroll} aria-label={`Фото товара ${product.name}`}>
        <PhotoPlaceholder />
        {gallery.length > 1 && (
          <div className="photo-progress" aria-hidden="true">
            {gallery.map((photo, itemIndex) => (
              <span className={itemIndex === photoIndex ? "is-active" : ""} key={`${photo.src}-${photo.view}-${itemIndex}`} />
            ))}
          </div>
        )}
      </div>
      <div className="product-meta">
        <div>
          <h3>{formatProductCardTitle(product)}</h3>
          <p>{formatShortProductDescription(product)}</p>
        </div>
      </div>
      <div className="price-row single-price" tabIndex={0} aria-label={`Цена ${formatRub(product.retailPrice)}`}>
        <div className="retail-panel">
          <b>{formatRub(product.retailPrice)}</b>
        </div>
      </div>
      <button
        className="add-button"
        onClick={(event) => {
          event.stopPropagation();
          onAdd(product, event.currentTarget.closest(".product-card")?.querySelector(".product-photo")?.getBoundingClientRect());
        }}
        disabled={!available}
      >
        {available ? "В корзину" : "Нет в наличии"}
        {available && <Plus size={18} />}
      </button>
    </article>
  );
}

function ProductDetailPage({ product, products, loading, addToCart, navigate, isFavorite, toggleFavorite }) {
  const [qty, setQty] = useState(1);
  const [selectedPhoto, setSelectedPhoto] = useState(0);
  const detailGalleryRef = useRef(null);

  useEffect(() => {
    setQty(1);
    setSelectedPhoto(0);
  }, [product?.id]);

  if (loading) {
    return (
      <section className="page-section product-detail-page">
        <div className="product-detail-shell">
          <div className="product-detail-photo skeleton" />
          <div className="product-detail-info">
            <p className="eyebrow">Загрузка</p>
            <h1>Товар</h1>
          </div>
        </div>
      </section>
    );
  }

  if (!product) {
    return (
      <section className="page-section product-detail-page">
        <div className="empty-favorites">
          <ShoppingBag size={34} />
          <h2>Товар не найден</h2>
          <p>Позиция могла быть удалена или ссылка устарела.</p>
          <button className="submit-button narrow" onClick={() => navigate("/")}>
            В каталог
          </button>
        </div>
      </section>
    );
  }

  const available = product.stockQty > 0;
  const safeQty = Math.min(Math.max(qty, 1), Math.max(product.stockQty, 1));
  const gallery = getProductGallery(product, products);
  const activePhoto = Math.min(selectedPhoto, Math.max(gallery.length - 1, 0));
  const specs = getProductSpecs(product);
  const relatedProducts = products
    .filter((item) => item.id !== product.id && (item.category === product.category || item.brand === product.brand))
    .slice(0, 3);

  const buyProduct = () => {
    if (!available) {
      return;
    }
    addToCart(product, null, safeQty);
    navigate("/cart");
  };

  const scrollDetailPhoto = (photoIndex) => {
    setSelectedPhoto(photoIndex);
    const galleryNode = detailGalleryRef.current;
    if (!galleryNode) return;
    galleryNode.scrollTo({ left: galleryNode.clientWidth * photoIndex, behavior: "smooth" });
  };

  const syncDetailPhoto = (event) => {
    const node = event.currentTarget;
    const next = Math.round(node.scrollLeft / Math.max(node.clientWidth, 1));
    if (next !== selectedPhoto) {
      setSelectedPhoto(Math.min(next, Math.max(gallery.length - 1, 0)));
    }
  };

  return (
    <section className="page-section product-detail-page">
      <button className="price-link detail-back" type="button" onClick={() => navigate("/")}>
        <ArrowLeft size={18} />
        В каталог
      </button>

      <div className="product-detail-shell">
        <div className="product-detail-gallery">
          <div className="product-detail-strip" ref={detailGalleryRef} onScroll={syncDetailPhoto}>
            {gallery.length > 0 ? (
              gallery.map((photo, photoIndex) => (
                <div className={`product-detail-photo view-${photo.view || "main"}`} key={`${product.id}-detail-${photo.src}-${photoIndex}`}>
                  <PhotoPlaceholder />
                </div>
              ))
            ) : (
              <div className="product-detail-photo">
                <span>{product.brand}</span>
              </div>
            )}
          </div>
          {gallery.length > 1 && (
            <div className="product-gallery-thumbs" aria-label="Галерея товара">
              {gallery.map((photo, photoIndex) => (
                <button
                  key={`${photo.src}-${photo.view}-${photoIndex}`}
                  type="button"
                  className={photoIndex === activePhoto ? "is-selected" : ""}
                  onClick={() => scrollDetailPhoto(photoIndex)}
                  aria-label={`Показать фото ${photoIndex + 1}`}
                >
                  <PhotoPlaceholder compact />
                </button>
              ))}
            </div>
          )}
        </div>

        <article className="product-detail-info">
          <div className="product-detail-topline">
            <span className="product-sku">{product.sku}</span>
            <button
              className={`favorite-toggle static ${isFavorite ? "is-active" : ""}`}
              type="button"
              onClick={() => toggleFavorite(product.id)}
              aria-label={isFavorite ? "Убрать из избранного" : "Добавить в избранное"}
            >
              <Heart size={18} fill={isFavorite ? "currentColor" : "none"} />
            </button>
          </div>
          <h1>{formatProductCardTitle(product)}</h1>
          <p className="product-detail-description">{formatShortProductDescription(product)}</p>

          <div className="product-detail-tags">
            <span>{product.brand}</span>
            <span>{getProductModelLabel(product)}</span>
            <span className={available ? "is-available" : "is-empty"}>{available ? `${product.stockQty} шт. в наличии` : "Нет в наличии"}</span>
          </div>

          <div className="product-detail-prices">
            <div>
              <span>Розница</span>
              <b>{formatRub(product.retailPrice)}</b>
            </div>
            <div>
              <span>Опт от 20 шт.</span>
              <b>{formatRub(product.wholesalePrice)}</b>
            </div>
          </div>

          <div className="product-buy-row">
            <label>
              Количество
              <input
                type="number"
                min="1"
                max={Math.max(product.stockQty, 1)}
                value={safeQty}
                disabled={!available}
                onChange={(event) => setQty(Number(event.target.value) || 1)}
              />
            </label>
            <button className="submit-button" type="button" onClick={buyProduct} disabled={!available}>
              {available ? "В корзину" : "Нет в наличии"}
              {available && <ShoppingBag size={18} />}
            </button>
          </div>

          <div className="product-detail-benefits">
            <span><Clock size={18} /> Самовывоз 10:00-19:00</span>
            <span><MapPin size={18} /> Юнона, павильон 506</span>
            <span><BadgeCheck size={18} /> Проверим товар при выдаче</span>
          </div>
        </article>
      </div>

      <div className="product-detail-blocks">
        <article>
          <h2>Характеристики</h2>
          <dl>
            <div><dt>SKU</dt><dd>{product.sku}</dd></div>
            <div><dt>Бренд</dt><dd>{product.brand}</dd></div>
            {specs.map(([label, value]) => (
              <div key={label}><dt>{label}</dt><dd>{value}</dd></div>
            ))}
            <div><dt>Наличие</dt><dd>{available ? `${product.stockQty} шт.` : "нет"}</dd></div>
          </dl>
        </article>
        <article>
          <h2>Покупка</h2>
          <p>Оформите заказ на сайте, и мы подготовим товар к самовывозу в павильоне 506. После подтверждения заберите покупку в удобное время с 10:00 до 19:00.</p>
        </article>
        <article>
          <h2>Возврат и обмен</h2>
          <p>Если товар не подойдет, скажите об этом до выдачи. Условия обмена после покупки уточняются на точке по состоянию товара и упаковки.</p>
        </article>
      </div>

      {relatedProducts.length > 0 && (
        <section className="related-products">
          <div className="section-title-row">
            <div>
              <p className="eyebrow">Похожие товары</p>
              <h2>Еще из этой группы</h2>
            </div>
          </div>
          <div className="product-grid">
            {relatedProducts.map((item, index) => (
              <ProductCard
                key={item.id}
                product={item}
                products={products}
                index={index}
                onAdd={addToCart}
                onOpen={() => navigate(`/product/${encodeURIComponent(item.id)}`)}
                isFavorite={false}
                onToggleFavorite={toggleFavorite}
              />
            ))}
          </div>
        </section>
      )}
    </section>
  );
}

function CartPage({ cart, products, updateQty, clearCart, navigate, customer }) {
  const [priceMode, setPriceMode] = useState("retail");
  const defaultPickupDate = getDefaultPickupDate();
  const [form, setForm] = useState({
    customerName: "",
    customerPhone: "",
    customerTelegram: "",
    pickupDate: defaultPickupDate,
    pickupTime: "12:00"
  });
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [orderConsent, setOrderConsent] = useState(false);
  const items = cart
    .map((item) => ({ ...item, product: products.find((product) => product.id === item.productId) }))
    .filter((item) => item.product);
  const totalQty = items.reduce((sum, item) => sum + item.qty, 0);
  const wholesaleAvailable = totalQty >= 20;
  const total = items.reduce(
    (sum, item) => sum + item.qty * (priceMode === "wholesale" ? item.product.wholesalePrice : item.product.retailPrice),
    0
  );

  useEffect(() => {
    if (wholesaleAvailable) {
      setPriceMode("wholesale");
    } else if (priceMode === "wholesale") {
      setPriceMode("retail");
    }
  }, [priceMode, wholesaleAvailable]);

  useEffect(() => {
    if (customer) {
      setForm((current) => ({
        ...current,
        customerName: customer.name || "",
        customerPhone: customer.phone || "",
        customerTelegram: customer.telegram || "",
        pickupDate: current.pickupDate || defaultPickupDate,
        pickupTime: current.pickupTime || "12:00"
      }));
    }
  }, [customer]);

  const submitOrder = async (event) => {
    event.preventDefault();
    setError("");
    if (!orderConsent) {
      setError("Подтвердите согласие на обработку персональных данных и условия оферты.");
      return;
    }
    setSubmitting(true);
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          priceMode,
          items: items.map((item) => ({ productId: item.product.id, qty: item.qty }))
        })
      });
      const data = await readJson(response);
      if (!response.ok) {
        throw new Error(data.error || "Не удалось оформить заказ.");
      }
      setResult(data);
      clearCart();
    } catch (orderError) {
      setError(orderError.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="cart-page page-section" aria-label="Корзина">
      <div className="cart-page-shell">
        <div className="drawer-head">
          <div>
            <p className="eyebrow">Заказ</p>
            <h2>Корзина</h2>
          </div>
          <button onClick={() => navigate("/")} aria-label="Вернуться в каталог">
            <ArrowLeft size={22} />
          </button>
        </div>

        {result ? (
          <div className="success-panel">
            <Check size={34} />
            <h3>Заказ создан</h3>
            <p>
              Номер {result.orderNumber}. Самовывоз: {formatPickup(result.pickupDate, result.pickupTime)}. Назовите номер на точке.
            </p>
          </div>
        ) : (
          <>
            <div className="mode-switch" role="group" aria-label="Тип цены">
              <button className={priceMode === "retail" ? "is-selected" : ""} onClick={() => setPriceMode("retail")}>
                Розница
              </button>
              <button
                className={priceMode === "wholesale" ? "is-selected" : ""}
                onClick={() => wholesaleAvailable && setPriceMode("wholesale")}
                disabled={!wholesaleAvailable}
                title={wholesaleAvailable ? "Оптовая цена включена" : "Опт доступен от 20 единиц"}
              >
                Опт <span>20+</span>
              </button>
            </div>
            <p className={`wholesale-note ${wholesaleAvailable ? "is-active" : ""}`}>
              {wholesaleAvailable ? "Оптовая цена включена автоматически." : `До оптовой цены осталось ${Math.max(20 - totalQty, 0)} ед.`}
            </p>

            <div className="cart-items">
              {items.length === 0 ? (
                <p className="empty-note">Корзина пуста.</p>
              ) : (
                items.map((item) => (
                  <div className="cart-item" key={item.productId}>
                    <div>
                      <b>{item.product.name}</b>
                      <span>{formatRub(priceMode === "wholesale" ? item.product.wholesalePrice : item.product.retailPrice)}</span>
                    </div>
                    <div className="qty-control">
                      <button onClick={() => updateQty(item.productId, item.qty - 1)} aria-label="Уменьшить">
                        <Minus size={16} />
                      </button>
                      <span>{item.qty}</span>
                      <button onClick={() => updateQty(item.productId, Math.min(item.qty + 1, item.product.stockQty))} aria-label="Увеличить">
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <form className="order-form" onSubmit={submitOrder}>
              {customer ? (
                <p className="cabinet-order-note">Заказ будет сохранен в истории кабинета {customer.login}.</p>
              ) : (
                <button type="button" className="price-link full" onClick={() => navigate("/cabinet")}>
                  Войти, чтобы сохранить заказ в истории
                  <UserRound size={18} />
                </button>
              )}
              <label>
                Имя
                <input value={form.customerName} onChange={(event) => setForm({ ...form, customerName: event.target.value })} required />
              </label>
              <label>
                Телефон
                <input
                  value={form.customerPhone}
                  onChange={(event) => setForm({ ...form, customerPhone: event.target.value })}
                  required
                  type="tel"
                />
              </label>
              <label>
                Telegram
                <input value={form.customerTelegram} onChange={(event) => setForm({ ...form, customerTelegram: event.target.value })} />
              </label>
              <div className="pickup-fields" aria-label="Удобные дата и время получения заказа">
                <label>
                  Удобная дата получения
                  <input
                    value={form.pickupDate}
                    onChange={(event) => setForm({ ...form, pickupDate: event.target.value })}
                    required
                    type="date"
                    min={defaultPickupDate}
                  />
                </label>
                <label>
                  Удобное время
                  <input
                    value={form.pickupTime}
                    onChange={(event) => setForm({ ...form, pickupTime: event.target.value })}
                    required
                    type="time"
                    min="10:00"
                    max="19:00"
                    step="1800"
                  />
                </label>
              </div>
              <label className="consent-row">
                <input
                  checked={orderConsent}
                  onChange={(event) => setOrderConsent(event.target.checked)}
                  required
                  type="checkbox"
                />
                <span>
                  Согласен на обработку персональных данных и принимаю{" "}
                  <RouteLink navigate={navigate} to="/personal-data-consent">согласие</RouteLink>,{" "}
                  <RouteLink navigate={navigate} to="/privacy">политику конфиденциальности</RouteLink> и{" "}
                  <RouteLink navigate={navigate} to="/offer">оферту</RouteLink>.
                </span>
              </label>
              {error && <p className="form-error" role="alert">{error}</p>}
              <div className="total-line">
                <span>Итого</span>
                <b>{formatRub(total)}</b>
              </div>
              <button className="submit-button" disabled={!items.length || submitting}>
                {submitting ? "Создаем..." : "Получить номер заказа"}
              </button>
            </form>
          </>
        )}
      </div>
    </section>
  );
}

function FavoritesPage({ products, favorites, toggleFavorite, addToCart, navigate }) {
  const favoriteProducts = products.filter((product) => favorites.includes(product.id));

  return (
    <section className="favorites-page page-section">
      <div className="section-title-row favorites-head">
        <div>
          <p className="eyebrow">Избранное</p>
          <h1>Отложенные товары</h1>
          <p>Сохраняйте позиции для повторной закупки или быстрого заказа на завтра.</p>
        </div>
        <button className="price-link" onClick={() => navigate("/")}>
          В каталог
          <ChevronRight size={18} />
        </button>
      </div>

      {favoriteProducts.length === 0 ? (
        <div className="empty-favorites">
          <Heart size={34} />
          <h2>Пока пусто</h2>
          <p>Нажмите на сердечко в карточке товара, и он появится здесь.</p>
          <button className="submit-button narrow" onClick={() => navigate("/")}>
            Перейти в каталог
          </button>
        </div>
      ) : (
        <div className="product-grid favorites-grid">
          {favoriteProducts.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              products={products}
              index={index}
              onAdd={addToCart}
              onOpen={() => navigate(`/product/${encodeURIComponent(product.id)}`)}
              isFavorite
              onToggleFavorite={toggleFavorite}
            />
          ))}
        </div>
      )}
    </section>
  );
}

function CustomerCabinet({ customer, setCustomer, favorites, setFavorites, products, addToCart, toggleFavorite, navigate }) {
  const [mode, setMode] = useState("login");
  const [authForm, setAuthForm] = useState({ login: "", password: "", name: "", phone: "", telegram: "" });
  const [authConsent, setAuthConsent] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [profileForm, setProfileForm] = useState({ name: "", phone: "", telegram: "" });
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const favoriteProducts = products.filter((product) => favorites.includes(product.id));

  const loadOrders = async () => {
    const response = await fetch("/api/customer/orders");
    const data = await readJson(response);
    if (response.ok) {
      setOrders(data.orders || []);
    }
  };

  useEffect(() => {
    if (customer) {
      setProfileForm({
        name: customer.name || "",
        phone: customer.phone || "",
        telegram: customer.telegram || ""
      });
      loadOrders();
    }
  }, [customer]);

  const submitAuth = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");
    if (mode === "register" && !authConsent) {
      setError("Подтвердите согласие на обработку персональных данных и условия сайта.");
      return;
    }
    const response = await fetch(`/api/customer/${mode === "register" ? "register" : "login"}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(authForm)
    });
    const data = await readJson(response);
    if (!response.ok) {
      setError(data.error || "Не удалось войти.");
      return;
    }
    setCustomer(data.customer);
    await syncCustomerFavorites(favorites, setFavorites);
  };

  const saveProfile = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");
    const response = await fetch("/api/customer/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(profileForm)
    });
    const data = await readJson(response);
    if (!response.ok) {
      setError(data.error || "Профиль не сохранен.");
      return;
    }
    setCustomer(data.customer);
    setMessage("Профиль сохранен.");
  };

  const logout = async () => {
    await fetch("/api/customer/logout", { method: "POST" });
    setCustomer(null);
    setOrders([]);
  };

  if (!customer) {
    return (
      <section className="page-section customer-auth-page">
        <div className="customer-auth-copy">
          <p className="eyebrow">Кабинет покупателя</p>
          <h1>Ваши заказы</h1>
          <p className="lead">История покупок, быстрый повтор заказа и избранные позиции в одном месте.</p>
        </div>
        <form className="order-form customer-auth-card" onSubmit={submitAuth}>
          <div className="mode-switch compact" role="group" aria-label="Режим входа">
            <button type="button" className={mode === "login" ? "is-selected" : ""} onClick={() => setMode("login")}>
              Вход
            </button>
            <button type="button" className={mode === "register" ? "is-selected" : ""} onClick={() => setMode("register")}>
              Регистрация
            </button>
          </div>
          <label>
            Логин
            <input value={authForm.login} onChange={(event) => setAuthForm({ ...authForm, login: event.target.value })} required />
          </label>
          <label>
            Пароль
            <span className="password-field">
              <input
                value={authForm.password}
                onChange={(event) => setAuthForm({ ...authForm, password: event.target.value })}
                required
                type={showPassword ? "text" : "password"}
                minLength={6}
              />
              <button
                type="button"
                className="password-toggle-button"
                onClick={() => setShowPassword((value) => !value)}
                aria-label={showPassword ? "Скрыть пароль" : "Показать пароль"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </span>
          </label>
          {mode === "register" && (
            <>
              <label>
                Имя
                <input value={authForm.name} onChange={(event) => setAuthForm({ ...authForm, name: event.target.value })} />
              </label>
              <label>
                Телефон
                <input
                  value={authForm.phone}
                  onChange={(event) => setAuthForm({ ...authForm, phone: event.target.value })}
                  type="tel"
                />
              </label>
              <label>
                Telegram
                <input value={authForm.telegram} onChange={(event) => setAuthForm({ ...authForm, telegram: event.target.value })} />
              </label>
              <label className="consent-row">
                <input
                  checked={authConsent}
                  onChange={(event) => setAuthConsent(event.target.checked)}
                  required
                  type="checkbox"
                />
                <span>
                  Согласен на обработку персональных данных и принимаю{" "}
                  <RouteLink navigate={navigate} to="/personal-data-consent">согласие</RouteLink>,{" "}
                  <RouteLink navigate={navigate} to="/privacy">политику конфиденциальности</RouteLink> и{" "}
                  <RouteLink navigate={navigate} to="/terms">пользовательское соглашение</RouteLink>.
                </span>
              </label>
            </>
          )}
          {error && <p className="form-error" role="alert">{error}</p>}
          <button className="submit-button">
            {mode === "register" ? <UserPlus size={18} /> : <UserRound size={18} />}
            {mode === "register" ? "Создать кабинет" : "Войти"}
          </button>
          <button type="button" className="price-link full" onClick={() => navigate("/cart")}>
            Оформить как гость
            <ChevronRight size={18} />
          </button>
        </form>
      </section>
    );
  }

  return (
    <section className="page-section customer-page">
      <div className="customer-head">
        <div>
          <p className="eyebrow">Кабинет покупателя</p>
          <h1>{customer.login}</h1>
        </div>
        <button className="cart-button" onClick={logout}>
          <LogOut size={18} />
          <span>Выйти</span>
        </button>
      </div>

      <div className="customer-grid">
        <article className="customer-panel profile-panel">
          <div className="panel-title">
            <UserRound size={22} />
            <h2>Профиль</h2>
          </div>
          <form className="order-form" onSubmit={saveProfile}>
            <label>
              Имя
              <input value={profileForm.name} onChange={(event) => setProfileForm({ ...profileForm, name: event.target.value })} />
            </label>
            <label>
              Телефон
              <input
                value={profileForm.phone}
                onChange={(event) => setProfileForm({ ...profileForm, phone: event.target.value })}
                type="tel"
              />
            </label>
            <label>
              Telegram
              <input value={profileForm.telegram} onChange={(event) => setProfileForm({ ...profileForm, telegram: event.target.value })} />
            </label>
            {error && <p className="form-error" role="alert">{error}</p>}
            {message && <p className="form-success">{message}</p>}
            <p className="legal-note">
              Сохраняя профиль, вы можете обновить контактные данные для заказов. Обработка идет по{" "}
              <RouteLink navigate={navigate} to="/privacy">политике конфиденциальности</RouteLink> и{" "}
              <RouteLink navigate={navigate} to="/personal-data-consent">согласию на обработку данных</RouteLink>.
            </p>
            <button className="submit-button">Сохранить</button>
          </form>
        </article>

        <article className="customer-panel">
          <div className="panel-title">
            <History size={22} />
            <h2>История</h2>
          </div>
          <div className="customer-order-list">
            {orders.length === 0 ? (
              <p className="empty-note">Заказов пока нет.</p>
            ) : (
              orders.map((order) => (
                <div className="customer-order" key={order.id}>
                  <div>
                    <b>{order.orderNumber}</b>
                    <span>{orderStatuses[order.status]} · {formatRub(order.totalAmount)} · {formatPickup(order.pickupDate, order.pickupTime)}</span>
                  </div>
                  <ul>
                    {order.items.map((item) => (
                      <li key={`${order.id}-${item.sku}`}>{item.qty} x {item.name}</li>
                    ))}
                  </ul>
                </div>
              ))
            )}
          </div>
        </article>

        <article className="customer-panel customer-favorites-panel">
          <div className="panel-title">
            <Heart size={22} />
            <h2>Избранное</h2>
          </div>
          {favoriteProducts.length === 0 ? (
            <div className="soft-empty">
              <p>Пока пусто. Сохраняйте частые позиции из каталога.</p>
              <button className="price-link" onClick={() => navigate("/")}>
                В каталог
                <ChevronRight size={18} />
              </button>
            </div>
          ) : (
            <div className="cabinet-favorite-list">
              {favoriteProducts.map((product) => (
                <div className="cabinet-favorite" key={product.id}>
                  <div>
                    <b>{product.name}</b>
                    <span>{product.brand} · {formatRub(product.retailPrice)}</span>
                  </div>
                  <button className="price-link" onClick={() => addToCart(product)}>
                    В корзину
                  </button>
                  <button className="favorite-toggle is-active static" onClick={() => toggleFavorite(product.id)} aria-label="Убрать из избранного">
                    <Heart size={18} fill="currentColor" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </article>
      </div>
    </section>
  );
}

function FlyToCart({ item }) {
  const dx = item.to.x - item.from.x;
  const dy = item.to.y - item.from.y;

  return (
    <div
      className="fly-to-cart"
      style={{
        left: `${item.from.x}px`,
        top: `${item.from.y}px`,
        "--fly-x": `${dx}px`,
        "--fly-y": `${dy}px`
      }}
      aria-hidden="true"
    >
      <span>{item.brand}</span>
    </div>
  );
}

function PricePage({ products, loading, navigate }) {
  return (
    <section className="page-section">
      <p className="eyebrow">Прайс-лист</p>
      <h1>Цены Shark Mobile</h1>
      <div className="warning-banner">ВНИМАНИЕ указанные цены РОЗНИЧНЫЕ</div>
      <div className="table-shell">
        <table>
          <thead>
            <tr>
              <th>SKU</th>
              <th>Товар</th>
              <th>Категория</th>
              <th>Бренд</th>
              <th>Розница</th>
              <th>Опт</th>
              <th>Наличие</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7">Загрузка...</td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product.id}>
                  <td data-label="SKU">{product.sku}</td>
                  <td data-label="Товар">{product.name}</td>
                  <td data-label="Категория">{product.category}</td>
                  <td data-label="Бренд">{product.brand}</td>
                  <td data-label="Розница">{formatRub(product.retailPrice)}</td>
                  <td data-label="Опт">{formatRub(product.wholesalePrice)}</td>
                  <td data-label="Наличие">{product.stockQty} шт.</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <button className="price-link" onClick={() => navigate("/")}>
        Вернуться в каталог
        <ChevronRight size={18} />
      </button>
    </section>
  );
}

function RepairPage({ navigate }) {
  const services = [
    ["Стекла и дисплеи", "Подбор и установка защитного стекла, базовая диагностика дисплея."],
    ["Зарядка и разъемы", "Проверка кабеля, адаптера, гнезда и контактов на месте."],
    ["Батарея и корпус", "Оценка состояния, аккуратная замена и контроль после работы."],
    ["Быстрые неполадки", "Звук, кнопки, камера, сеть, зависания и базовая настройка."]
  ];

  return (
    <section className="page-section repair-page">
      <p className="eyebrow">Ремонт</p>
      <h1>Ремонт телефонов на Юноне</h1>
      <p className="lead">
        Если нужен ремонт телефона или установка стекла, приходите в павильон 506. Для аксессуаров удобнее собрать
        корзину заранее.
      </p>
      <div className="repair-grid">
        {services.map(([title, text], index) => (
          <article key={title} className="repair-card" style={{ "--delay": `${index * 60}ms` }}>
            <span>0{index + 1}</span>
            <h3>{title}</h3>
            <p>{text}</p>
          </article>
        ))}
      </div>
      <button className="submit-button narrow" onClick={() => navigate("/")}>
        Перейти в каталог
      </button>
    </section>
  );
}

function AdminPage({ products, setProducts }) {
  const [login, setLogin] = useState("admin");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [telegramId, setTelegramId] = useState("");
  const [isAuthed, setIsAuthed] = useState(false);
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");
  const [productForms, setProductForms] = useState({});
  const [productSearch, setProductSearch] = useState("");
  const [productError, setProductError] = useState("");
  const [savingProductId, setSavingProductId] = useState("");

  const loadOrders = async () => {
    const response = await fetch("/api/admin/orders");
    if (response.ok) {
      const data = await response.json();
      setOrders(data.orders || []);
      setIsAuthed(true);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  useEffect(() => {
    setProductForms((current) =>
      Object.fromEntries(
        products.map((product) => {
          const nextForm =
            current[product.id] || {
              name: product.name || "",
              description: product.description || "",
              stockQty: String(product.stockQty ?? 0),
              imageUrl: product.imageUrl || ""
            };
          return [product.id, nextForm];
        })
      )
    );
  }, [products]);

  const getProductForm = (product) => ({
    name: product.name || "",
    description: product.description || "",
    stockQty: String(product.stockQty ?? 0),
    imageUrl: product.imageUrl || ""
  });

  const resetProductForm = (product) => {
    setProductForms((current) => ({
      ...current,
      [product.id]: getProductForm(product)
    }));
  };

  const submitLogin = async (event) => {
    event.preventDefault();
    setError("");
    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ login, password })
    });
    const data = await response.json();
    if (!response.ok) {
      setError(data.error || "Не удалось войти.");
      return;
    }
    setIsAuthed(true);
    loadOrders();
  };

  const linkTelegram = async () => {
    setError("");
    const response = await fetch("/api/admin/telegram-login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ login, telegramId })
    });
    const data = await response.json();
    if (!response.ok) {
      setError(data.error || "Telegram привязка не прошла.");
      return;
    }
    setIsAuthed(true);
    loadOrders();
  };

  const changeStatus = async (orderId, status) => {
    await fetch(`/api/admin/orders/${orderId}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status })
    });
    loadOrders();
  };

  const updateProductForm = (productId, patch) => {
    setProductForms((current) => ({
      ...current,
      [productId]: {
        ...(current[productId] || {}),
        ...patch
      }
    }));
  };

  const handleProductImage = (productId, event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) {
      return;
    }
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setProductError("Загрузите фото JPG, PNG или WebP.");
      return;
    }
    if (file.size > 3 * 1024 * 1024) {
      setProductError("Фото слишком большое. Максимум 3 МБ.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setProductError("");
      updateProductForm(productId, { imageUrl: String(reader.result || "") });
    };
    reader.onerror = () => setProductError("Не удалось прочитать фото.");
    reader.readAsDataURL(file);
  };

  const saveProduct = async (productId) => {
    const form = productForms[productId] || {};
    setProductError("");
    setSavingProductId(productId);
    try {
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          description: form.description,
          stockQty: Number(form.stockQty),
          imageUrl: form.imageUrl || null
        })
      });
      const data = await readJson(response);
      if (!response.ok) {
        setProductError(data.error || "Не удалось сохранить товар.");
        return;
      }
      setProducts((current) => current.map((product) => (product.id === productId ? { ...product, ...data.product } : product)));
      resetProductForm(data.product);
    } catch {
      setProductError("Не удалось сохранить товар.");
    } finally {
      setSavingProductId("");
    }
  };

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    setIsAuthed(false);
    setOrders([]);
  };

  const stats = {
    new: orders.filter((order) => order.status === "new").length,
    active: orders.filter((order) => ["new", "confirmed", "ready"].includes(order.status)).length,
    lowStock: products.filter((product) => product.stockQty <= 3).length
  };
  const productSearchValue = productSearch.trim().toLowerCase();
  const filteredProducts = products.filter((product) => {
    if (!productSearchValue) {
      return true;
    }
    return `${product.name} ${product.sku}`.toLowerCase().includes(productSearchValue);
  });

  if (!isAuthed) {
    return (
      <section className="page-section admin-login">
        <p className="eyebrow">Админ-панель</p>
        <h1>Вход админа</h1>
        <form className="order-form login-card" onSubmit={submitLogin}>
          <label>
            Логин
            <input value={login} onChange={(event) => setLogin(event.target.value)} required />
          </label>
          <label>
            Пароль
            <span className="password-field">
              <input
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                type={showPassword ? "text" : "password"}
              />
              <button
                type="button"
                className="password-toggle-button"
                onClick={() => setShowPassword((value) => !value)}
                aria-label={showPassword ? "Скрыть пароль" : "Показать пароль"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </span>
          </label>
          <button className="submit-button">Войти</button>
          <div className="telegram-link-box">
            <label>
              Telegram ID
              <input value={telegramId} onChange={(event) => setTelegramId(event.target.value)} />
            </label>
            <button type="button" className="price-link full" onClick={linkTelegram}>
              Регистрация по Telegram
              <UserRound size={18} />
            </button>
          </div>
          {error && <p className="form-error" role="alert">{error}</p>}
        </form>
      </section>
    );
  }

  return (
    <section className="page-section admin-page">
      <div className="admin-head">
        <div>
          <p className="eyebrow">Админ-панель</p>
          <h1>Операции</h1>
          <div className="admin-stats" aria-label="Сводка">
            <span>Новые: {stats.new}</span>
            <span>В работе: {stats.active}</span>
            <span>Мало остатков: {stats.lowStock}</span>
          </div>
        </div>
        <button className="cart-button" onClick={logout}>
          <LogOut size={18} />
          <span>Выйти</span>
        </button>
      </div>

      <div className="admin-grid">
        <article className="admin-panel">
          <div className="panel-title">
            <ClipboardList size={22} />
            <h2>Заказы</h2>
          </div>
          <div className="order-list">
            {orders.length === 0 ? (
              <p className="empty-note">Заказов пока нет.</p>
            ) : (
              orders.map((order) => (
                <div className="owner-order" key={order.id}>
                  <div>
                    <b>
                      {order.orderNumber}
                      <span>{formatOrderCreated(order.createdAt)}</span>
                    </b>
                    <span>
                      {order.customerName} · {order.customerPhone} · {formatRub(order.totalAmount)}
                    </span>
                    <span>Получение: {formatPickup(order.pickupDate, order.pickupTime)}</span>
                    {order.customerTelegram && <span>Telegram: {order.customerTelegram}</span>}
                    {order.customerId && <span className="customer-chip">Кабинет</span>}
                  </div>
                  <div className="admin-status-row" role="group" aria-label={`Статус ${order.orderNumber}`}>
                    {Object.entries(orderStatuses).map(([value, label]) => (
                      <button
                        key={value}
                        className={order.status === value ? "is-selected" : ""}
                        onClick={() => changeStatus(order.id, value)}
                        disabled={order.status === value}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                  <ul>
                    {order.items.map((item) => (
                      <li key={`${order.id}-${item.sku}`}>
                        {item.qty} x {item.name}
                      </li>
                    ))}
                  </ul>
                </div>
              ))
            )}
          </div>
        </article>

        <article className="admin-panel">
          <div className="panel-title">
            <Boxes size={22} />
            <h2>Товары</h2>
          </div>
          <label className="admin-search">
            <Search size={16} />
            <input
              value={productSearch}
              onChange={(event) => setProductSearch(event.target.value)}
              placeholder="Поиск по названию или SKU"
            />
          </label>
          {productError && <p className="form-error" role="alert">{productError}</p>}
          <div className="product-admin-list">
            {filteredProducts.map((product) => {
              const form = productForms[product.id] || {
                name: product.name || "",
                description: product.description || "",
                stockQty: String(product.stockQty ?? 0),
                imageUrl: product.imageUrl || ""
              };
              const stockClass = Number(form.stockQty) === 0 ? "is-out" : Number(form.stockQty) <= 3 ? "is-low" : "";
              return (
                <div className={`product-admin-card ${stockClass}`} key={product.id}>
                  <div className="product-admin-media">
                    <PhotoPlaceholder compact />
                  </div>
                  <div className="product-admin-fields">
                    <div className="product-admin-meta">
                      <span>{product.sku}</span>
                      <span>{product.brand}</span>
                      <span>{product.category}</span>
                    </div>
                    <label>
                      Название
                      <input value={form.name} onChange={(event) => updateProductForm(product.id, { name: event.target.value })} />
                    </label>
                    <label>
                      Описание
                      <textarea
                        value={form.description}
                        rows="3"
                        onChange={(event) => updateProductForm(product.id, { description: event.target.value })}
                      />
                    </label>
                    <div className="product-admin-row">
                      <label>
                        Остаток
                        <input
                          type="number"
                          min="0"
                          value={form.stockQty}
                          onChange={(event) => updateProductForm(product.id, { stockQty: event.target.value })}
                        />
                      </label>
                      <label className="photo-upload">
                        Фото
                        <input type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => handleProductImage(product.id, event)} />
                      </label>
                    </div>
                    {form.imageUrl && (
                      <button className="price-link full muted" type="button" onClick={() => updateProductForm(product.id, { imageUrl: "" })}>
                        Удалить фото
                        <X size={18} />
                      </button>
                    )}
                    <button className="price-link full" type="button" onClick={() => saveProduct(product.id)} disabled={savingProductId === product.id}>
                      {savingProductId === product.id ? "Сохранение..." : "Сохранить"}
                      <Check size={18} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </article>
      </div>
    </section>
  );
}

function LegalPage({ document, navigate }) {
  return (
    <section className="page-section legal-page">
      <div className="legal-shell">
        <button className="price-link legal-back" onClick={() => navigate("/")}>
          <ArrowLeft size={18} />
          В каталог
        </button>
        <p className="eyebrow">Документы Shark Mobile</p>
        <h1>{document.title}</h1>
        <p className="lead">{document.lead}</p>
        <p className="legal-updated">Редакция от 10.06.2026. Реквизиты продавца указаны как плейсхолдеры и требуют замены.</p>
        <div className="legal-sections">
          {document.sections.map(([title, paragraphs]) => (
            <article className="legal-section" key={title}>
              <h2>{title}</h2>
              {paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function RouteLink({ navigate, to, children }) {
  return (
    <button
      className="legal-text-link"
      type="button"
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        navigate(to);
      }}
    >
      {children}
    </button>
  );
}

function Footer({ navigate }) {
  return (
    <footer className="footer">
      <div className="footer-brand">
        <div>
          <span className="brand-dot" />
          <b>Shark Mobile</b>
        </div>
        <p>Аксессуары, стекла, зарядки и ремонт на ярмарке Юнона. Розница, опт и самовывоз на следующий день.</p>
      </div>
      <nav className="footer-col" aria-label="Покупателям">
        <b>Покупателям</b>
        <button onClick={() => navigate("/")}>Каталог</button>
        <button onClick={() => navigate("/price")}>Прайс-лист</button>
        <button onClick={() => navigate("/favorites")}>Избранное</button>
        <button onClick={() => navigate("/cart")}>Корзина</button>
      </nav>
      <nav className="footer-col" aria-label="Компания">
        <b>Компания</b>
        <button onClick={() => navigate("/repair")}>Ремонт</button>
        <button onClick={() => navigate("/cabinet")}>Кабинет покупателя</button>
        <button onClick={() => navigate("/admin")}>Админ-панель</button>
        <a href={mapHref} target="_blank" rel="noreferrer">Маршрут</a>
      </nav>
      <nav className="footer-col" aria-label="Документы">
        <b>Документы</b>
        <button onClick={() => navigate("/privacy")}>Политика конфиденциальности</button>
        <button onClick={() => navigate("/terms")}>Пользовательское соглашение</button>
        <button onClick={() => navigate("/offer")}>Публичная оферта</button>
        <button onClick={() => navigate("/personal-data-consent")}>Согласие на обработку данных</button>
      </nav>
      <div className="footer-contacts">
        <b>Контакты</b>
        <span><BadgeCheck size={18} /> Юнона, павильон 506</span>
        <span><Clock size={18} /> Ежедневно 10:00-19:00</span>
        <a href={phoneHref}><ShoppingBag size={18} /> +7 981 872-69-56</a>
        <span><Mail size={18} /> Telegram: @Shark_Mobile506</span>
      </div>
    </footer>
  );
}

function formatRub(value) {
  return new Intl.NumberFormat("ru-RU").format(Number(value || 0)) + " ₽";
}

function formatDate(value) {
  return new Intl.DateTimeFormat("ru-RU", { day: "2-digit", month: "long" }).format(new Date(value));
}

function formatPickup(date, time) {
  return `${formatDate(date)}${time ? ` в ${String(time).slice(0, 5)}` : ""}`;
}

function formatOrderCreated(value) {
  if (!value) {
    return "Оформлен: нет времени";
  }
  return `Оформлен: ${new Intl.DateTimeFormat("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(value))}`;
}

function getDefaultPickupDate() {
  return new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
}

async function readJson(response) {
  const text = await response.text();
  if (!text) {
    return {};
  }
  try {
    return JSON.parse(text);
  } catch {
    return { error: "Сервер заказов не отвечает. Проверьте backend и PostgreSQL." };
  }
}

async function syncCustomerFavorites(localFavorites, setFavorites) {
  await Promise.all(
    localFavorites.map((productId) => fetch(`/api/customer/favorites/${productId}`, { method: "PUT" }).catch(() => null))
  );
  const response = await fetch("/api/customer/favorites");
  if (response.ok) {
    const data = await readJson(response);
    setFavorites(data.favorites || []);
  }
}

function useOpenStatus() {
  const getStatus = () => {
    const now = new Date();
    const minutes = now.getHours() * 60 + now.getMinutes();
    const isOpen = minutes >= 10 * 60 && minutes < 19 * 60;
    return {
      isOpen,
      label: isOpen ? "Открыто до 19:00" : "Откроемся в 10:00"
    };
  };

  const [status, setStatus] = useState(getStatus);

  useEffect(() => {
    const id = window.setInterval(() => setStatus(getStatus()), 60_000);
    return () => window.clearInterval(id);
  }, []);

  return status;
}

createRoot(document.getElementById("root")).render(<App />);
