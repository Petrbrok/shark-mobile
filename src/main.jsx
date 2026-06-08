import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Boxes,
  Check,
  ChevronRight,
  ClipboardList,
  LogOut,
  Menu,
  Minus,
  PackageCheck,
  Plus,
  Search,
  ShieldCheck,
  ShoppingBag,
  UserRound,
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
  { name: "Dyson", logo: "https://cdn.worldvectorlogo.com/logos/dyson.svg" },
  { name: "Xiaomi", logo: "https://cdn.simpleicons.org/xiaomi/050608" },
  { name: "Sony", logo: "https://cdn.simpleicons.org/sony/050608" },
  { name: "Google", logo: "https://cdn.simpleicons.org/google/050608" },
  { name: "Garmin", logo: "https://cdn.simpleicons.org/garmin/050608" },
  { name: "Marshall", logo: "https://cdn.worldvectorlogo.com/logos/marshall.svg" },
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

function App() {
  const [path, setPath] = useState(window.location.pathname);
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem("shark-cart") || "[]"));
  const [flyItem, setFlyItem] = useState(null);

  useEffect(() => {
    const onPop = () => setPath(window.location.pathname);
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  useEffect(() => {
    localStorage.setItem("shark-cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    fetch("/api/products")
      .then((response) => response.json())
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

  const navigate = (href) => {
    window.history.pushState({}, "", href);
    setPath(href);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);
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

  return (
    <div className="app-shell">
      <Header navigate={navigate} path={path} cartCount={cartCount} onCart={() => navigate("/cart")} />
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
            />
          ) : path === "/repair" ? (
            <RepairPage navigate={navigate} />
          ) : path === "/admin" ? (
            <AdminPage products={products} setProducts={setProducts} />
          ) : (
            <HomePage products={products} loading={loadingProducts} addToCart={addToCart} navigate={navigate} />
          )}
        </div>
      </main>
      {flyItem && <FlyToCart item={flyItem} />}
      <Footer navigate={navigate} />
    </div>
  );
}

function Header({ navigate, path, cartCount, onCart }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const links = [
    ["/", "Каталог"],
    ["/price", "Прайс"],
    ["/repair", "Ремонт"]
  ];

  const go = (href) => {
    setMenuOpen(false);
    navigate(href);
  };

  return (
    <header className="topbar">
      <button className="brand-link" onClick={() => go("/")} aria-label="На главную">
        <span className="brand-dot" />
        <span>Shark Mobile</span>
      </button>
      <nav className="topnav" aria-label="Разделы сайта">
        {links.map(([href, label]) => (
          <button key={href} className={path === href ? "is-active" : ""} onClick={() => go(href)}>
            {label}
          </button>
        ))}
      </nav>
      <div className="top-actions">
        <a className="call-button top-call-button" href={phoneHref}>
          Позвонить
        </a>
        <button className="admin-button" onClick={() => go("/admin")} aria-label="Личный кабинет">
          <UserRound size={18} />
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
        <a className="mobile-call" href={phoneHref}>
          Позвонить
          <span>+7 981 872-69-56</span>
        </a>
        {[...links, ["/admin", "Кабинет"]].map(([href, label]) => (
          <button key={href} onClick={() => go(href)}>
            {label}
            <ChevronRight size={18} />
          </button>
        ))}
      </div>
    </header>
  );
}

function HomePage({ products, loading, addToCart, navigate }) {
  const [category, setCategory] = useState("Все");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [search, setSearch] = useState("");
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
          <h1>Shark Mobile</h1>
          <p className="lead">
            Ремонт телефонов, стекла, чехлы и зарядки на Юноне, павильон 506. Работаем каждый день с 10:00 до 19:00.
          </p>
          <div className="hero-actions">
            <a className="call-button hero-call" href={phoneHref}>
              Позвонить
            </a>
            <button className="catalog-jump" onClick={() => document.querySelector("#catalog")?.scrollIntoView({ behavior: "smooth" })}>
              Перейти в каталог
            </button>
          </div>
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
          <aside className="category-rail" aria-label="Категории товаров">
            {categories.map((item) => (
              <button key={item} className={category === item && !selectedBrand ? "is-selected" : ""} onClick={() => selectCategory(item)}>
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
                  <ProductCard key={product.id} product={product} index={index} onAdd={addToCart} />
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
  const [page, setPage] = useState(0);
  const visible = brands.slice(page * 6, page * 6 + 6);
  const canPrev = page > 0;
  const canNext = page < Math.ceil(brands.length / 6) - 1;

  return (
    <div className="brand-stage reveal-up" aria-label="Бренды в наличии">
      <div className="brand-grid" key={page}>
        {visible.map((brand) => (
          <button className={`brand-card ${selectedBrand === brand.name ? "is-selected" : ""}`} key={brand.name} onClick={() => onSelect(brand.name)}>
            <img src={brand.logo} alt={`${brand.name} logo`} loading="lazy" />
            <b>{brand.name}</b>
          </button>
        ))}
      </div>
      <div className="brand-controls">
        <button onClick={() => setPage(page - 1)} disabled={!canPrev} aria-label="Предыдущие бренды">
          <ArrowLeft size={20} />
        </button>
        <button onClick={() => setPage(page + 1)} disabled={!canNext} aria-label="Следующие бренды">
          <ArrowRight size={20} />
        </button>
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

function ProductCard({ product, index, onAdd }) {
  const available = product.stockQty > 0;
  return (
    <article className="product-card reveal-card" style={{ "--delay": `${Math.min(index, 8) * 42}ms` }}>
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
        <div className="wholesale-panel">
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

function CartPage({ cart, products, updateQty, clearCart, navigate }) {
  const [priceMode, setPriceMode] = useState("retail");
  const [form, setForm] = useState({ customerName: "", customerPhone: "", customerTelegram: "" });
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
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

  const submitOrder = async (event) => {
    event.preventDefault();
    setError("");
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
              Номер {result.orderNumber}. Самовывоз: {formatDate(result.pickupDate)}. Назовите номер на точке.
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
  const [login, setLogin] = useState("owner");
  const [password, setPassword] = useState("");
  const [telegramId, setTelegramId] = useState("");
  const [isAuthed, setIsAuthed] = useState(false);
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");

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

  const changeStock = async (productId, stockQty) => {
    const response = await fetch(`/api/admin/products/${productId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stockQty: Number(stockQty) })
    });
    if (response.ok) {
      setProducts(products.map((product) => (product.id === productId ? { ...product, stockQty: Number(stockQty) } : product)));
    }
  };

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    setIsAuthed(false);
    setOrders([]);
  };

  if (!isAuthed) {
    return (
      <section className="page-section admin-login">
        <p className="eyebrow">Личный кабинет</p>
        <h1>Вход</h1>
        <form className="order-form login-card" onSubmit={submitLogin}>
          <label>
            Логин
            <input value={login} onChange={(event) => setLogin(event.target.value)} required />
          </label>
          <label>
            Пароль
            <input value={password} onChange={(event) => setPassword(event.target.value)} required type="password" />
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
          <p className="eyebrow">Личный кабинет</p>
          <h1>Заказы и наличие</h1>
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
            <h2>Новые заказы</h2>
          </div>
          <div className="order-list">
            {orders.length === 0 ? (
              <p className="empty-note">Заказов пока нет.</p>
            ) : (
              orders.map((order) => (
                <div className="owner-order" key={order.id}>
                  <div>
                    <b>{order.orderNumber}</b>
                    <span>
                      {order.customerName} · {order.customerPhone} · {formatRub(order.totalAmount)}
                    </span>
                  </div>
                  <select value={order.status} onChange={(event) => changeStatus(order.id, event.target.value)}>
                    {Object.entries(orderStatuses).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
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
            <h2>Наличие</h2>
          </div>
          <div className="stock-list">
            {products.map((product) => (
              <label key={product.id}>
                <span>{product.name}</span>
                <input
                  type="number"
                  min="0"
                  value={product.stockQty}
                  onChange={(event) => changeStock(product.id, event.target.value)}
                />
              </label>
            ))}
          </div>
        </article>
      </div>
    </section>
  );
}

function Footer({ navigate }) {
  return (
    <footer className="footer">
      <div>
        <span className="brand-dot" />
        <b>Shark Mobile</b>
      </div>
      <button onClick={() => navigate("/repair")}>Ремонт</button>
      <span>Юнона · павильон 506 · 10:00-19:00</span>
    </footer>
  );
}

function formatRub(value) {
  return new Intl.NumberFormat("ru-RU").format(Number(value || 0)) + " ₽";
}

function formatDate(value) {
  return new Intl.DateTimeFormat("ru-RU", { day: "2-digit", month: "long" }).format(new Date(value));
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
