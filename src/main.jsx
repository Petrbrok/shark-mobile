import React, { useEffect, useMemo, useState } from "react";
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
  UserPlus,
  UserRound,
  UsersRound,
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

const categories = ["Все", "Чехлы", "Стекла", "Кабели", "Зарядки", "Держатели", "Наушники", "Аксессуары"];
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
      .then((data) => setProducts(data.products || []))
      .catch(() =>
        setProducts(
          seedProducts.map((product) => ({
            ...product,
            id: product.sku
          }))
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
  const addToCart = (product, sourceRect) => {
    setCart((current) => {
      const existing = current.find((item) => item.productId === product.id);
      if (existing) {
        return current.map((item) =>
          item.productId === product.id ? { ...item, qty: Math.min(item.qty + 1, product.stockQty) } : item
        );
      }
      return [...current, { productId: product.id, qty: 1 }];
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
        onCatalog={() => scrollHomeSection("#catalog")}
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
        <button className={path === "/" ? "is-active" : ""} onClick={onCatalog}>
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
      <section className="hero-shop">
        <div className="mobile-mark" aria-hidden="true">
          <img src="/assets/logo-background.png" alt="" />
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
            <button className="catalog-jump" onClick={() => document.querySelector("#catalog")?.scrollIntoView({ behavior: "smooth" })}>
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
          <img src="/assets/hero-iphone-user.png" alt="" />
        </div>
        <div className="hero-logo reveal-up" aria-label="Логотип Shark Mobile">
          <img src="/assets/logo-background.png" alt="Shark Mobile" />
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
            <h2>{selectedBrand ? `${selectedBrand}: товары в наличии` : "Полный ассортимент точки"}</h2>
          </div>
          <button className="price-link" onClick={() => navigate("/price")}>
            Прайс-лист
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
                {filtered.map((product, index) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    index={index}
                    onAdd={addToCart}
                    isFavorite={favorites.includes(product.id)}
                    onToggleFavorite={toggleFavorite}
                  />
                ))}
              </div>
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
              <img src={brand.logo} alt={`${brand.name} logo`} loading="lazy" />
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

function ProductCard({ product, index, onAdd, isFavorite = false, onToggleFavorite }) {
  const available = product.stockQty > 0;
  return (
    <article className="product-card reveal-card" style={{ "--delay": `${Math.min(index, 8) * 42}ms` }}>
      <button
        className={`favorite-toggle ${isFavorite ? "is-active" : ""}`}
        onClick={() => onToggleFavorite?.(product.id)}
        aria-label={isFavorite ? "Убрать из избранного" : "Добавить в избранное"}
      >
        <Heart size={18} fill={isFavorite ? "currentColor" : "none"} />
      </button>
      <div className="product-photo" aria-label="Фото будет добавлено позже">
        <span>{product.brand}</span>
      </div>
      <div className="product-meta">
        <div>
          <span className="product-sku">{product.sku}</span>
          <h3>{product.name}</h3>
        </div>
        <p>{product.description}</p>
      </div>
      <div className="price-row" tabIndex={0} aria-label={`Розница ${formatRub(product.retailPrice)}, опт ${formatRub(product.wholesalePrice)}`}>
        <div className="retail-panel">
          <span>Розница</span>
          <b>{formatRub(product.retailPrice)}</b>
        </div>
        <div className="wholesale-panel" tabIndex={0}>
          <span>Опт</span>
          <b>{formatRub(product.wholesalePrice)}</b>
        </div>
      </div>
      <button className="add-button" onClick={(event) => onAdd(product, event.currentTarget.closest(".product-card")?.querySelector(".product-photo")?.getBoundingClientRect())} disabled={!available}>
        {available ? "В корзину" : "Нет в наличии"}
        {available && <Plus size={18} />}
      </button>
    </article>
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
              index={index}
              onAdd={addToCart}
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
    if (file.size > 1024 * 1024) {
      setProductError("Фото должно быть до 1 МБ.");
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
                    {form.imageUrl ? <img src={form.imageUrl} alt={form.name || product.name} /> : <span>Нет фото</span>}
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
