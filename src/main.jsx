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

const brands = [
  "Apple",
  "Samsung",
  "Dyson",
  "Xiaomi",
  "Sony",
  "Google",
  "Garmin",
  "Marshall",
  "OnePlus",
  "Huawei",
  "Honor",
  "DJI"
];

const categories = ["Чехлы", "Стекла", "Кабели", "Зарядки", "Держатели", "Наушники", "Аксессуары"];
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
  const [cartOpen, setCartOpen] = useState(false);

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
  const addToCart = (product) => {
    setCart((current) => {
      const existing = current.find((item) => item.productId === product.id);
      if (existing) {
        return current.map((item) =>
          item.productId === product.id ? { ...item, qty: Math.min(item.qty + 1, product.stockQty) } : item
        );
      }
      return [...current, { productId: product.id, qty: 1 }];
    });
    setCartOpen(true);
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
      <Header navigate={navigate} path={path} cartCount={cartCount} onCart={() => setCartOpen(true)} />
      <main>
        {path === "/price" ? (
          <PricePage products={products} loading={loadingProducts} navigate={navigate} />
        ) : path === "/repair" ? (
          <RepairPage navigate={navigate} />
        ) : path === "/admin" ? (
          <AdminPage products={products} setProducts={setProducts} />
        ) : (
          <HomePage products={products} loading={loadingProducts} addToCart={addToCart} navigate={navigate} />
        )}
      </main>
      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        cart={cart}
        products={products}
        updateQty={updateQty}
        clearCart={() => setCart([])}
      />
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
        <button className="admin-button" onClick={() => go("/admin")} aria-label="Личный кабинет владельца">
          <UserRound size={18} />
        </button>
        <button className="cart-button" onClick={onCart} aria-label="Открыть корзину">
          <ShoppingBag size={18} />
          <span>{cartCount}</span>
        </button>
        <button className="burger-button" onClick={() => setMenuOpen(!menuOpen)} aria-label="Открыть меню" aria-expanded={menuOpen}>
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
      <div className={`mobile-menu ${menuOpen ? "is-open" : ""}`}>
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
  const [category, setCategory] = useState("Чехлы");
  const [search, setSearch] = useState("");
  const filtered = useMemo(() => {
    return products.filter((product) => {
      const byCategory = product.category === category;
      const bySearch = `${product.name} ${product.brand} ${product.sku}`.toLowerCase().includes(search.toLowerCase());
      return byCategory && bySearch;
    });
  }, [products, category, search]);

  return (
    <>
      <section className="hero-shop">
        <div className="hero-copy reveal-up">
          <p className="eyebrow">Юнона / павильон 506 / опт и розница</p>
          <h1>Shark Mobile</h1>
          <p className="lead">
            Интернет-витрина павильона 506 на ярмарке Юнона. Чехлы, стекла, кабели, зарядки и ходовые аксессуары:
            розница, опт, самовывоз на следующий день.
          </p>
          <div className="hero-stats" aria-label="Информация о магазине">
            <span>10:00-19:00</span>
            <span>Розница + опт</span>
            <span>Самовывоз завтра</span>
          </div>
        </div>
        <div className="hero-logo reveal-up" aria-label="Логотип Shark Mobile">
          <img src="/assets/logo-background.png" alt="Shark Mobile" />
        </div>
      </section>

      <section className="brand-section" aria-label="Бренды">
        <BrandCarousel />
      </section>

      <section className="catalog-section" id="catalog">
        <div className="section-title-row">
          <div>
            <p className="eyebrow">Каталог</p>
            <h2>Полный ассортимент точки</h2>
          </div>
          <button className="price-link" onClick={() => navigate("/price")}>
            Прайс-лист
            <ChevronRight size={18} />
          </button>
        </div>

        <div className="shop-layout">
          <aside className="category-rail" aria-label="Категории товаров">
            {categories.map((item) => (
              <button key={item} className={category === item ? "is-selected" : ""} onClick={() => setCategory(item)}>
                <span>{item}</span>
                <ChevronRight size={18} />
              </button>
            ))}
          </aside>

          <div className="product-zone">
            <label className="search-box">
              <Search size={18} />
              <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Поиск по бренду, SKU, названию" />
            </label>

            {loading ? (
              <div className="skeleton-grid">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div className="product-card skeleton" key={index} />
                ))}
              </div>
            ) : (
              <div className="product-grid">
                {filtered.map((product, index) => (
                  <ProductCard key={product.id} product={product} index={index} onAdd={() => addToCart(product)} />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

function BrandCarousel() {
  const [page, setPage] = useState(0);
  const visible = brands.slice(page * 6, page * 6 + 6);
  const canPrev = page > 0;
  const canNext = page < Math.ceil(brands.length / 6) - 1;

  return (
    <div className="brand-stage reveal-up" aria-label="Бренды в наличии">
      <div className="brand-grid">
        {visible.map((brand) => (
          <article className="brand-card" key={brand}>
            <span className="brand-mark">{brandMark(brand)}</span>
            <b>{brand}</b>
          </article>
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
      <div className="price-row">
        <div>
          <span>Розница</span>
          <b>{formatRub(product.retailPrice)}</b>
        </div>
        <div>
          <span>Опт</span>
          <b>{formatRub(product.wholesalePrice)}</b>
        </div>
      </div>
      <button className="add-button" onClick={onAdd} disabled={!available}>
        {available ? "В корзину" : "Нет в наличии"}
        {available && <Plus size={18} />}
      </button>
    </article>
  );
}

function CartDrawer({ open, onClose, cart, products, updateQty, clearCart }) {
  const [priceMode, setPriceMode] = useState("retail");
  const [form, setForm] = useState({ customerName: "", customerPhone: "", customerTelegram: "" });
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const items = cart
    .map((item) => ({ ...item, product: products.find((product) => product.id === item.productId) }))
    .filter((item) => item.product);
  const total = items.reduce(
    (sum, item) => sum + item.qty * (priceMode === "wholesale" ? item.product.wholesalePrice : item.product.retailPrice),
    0
  );

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
      const data = await response.json();
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
    <div className={`cart-layer ${open ? "is-open" : ""}`} aria-hidden={!open}>
      <button className="cart-scrim" onClick={onClose} aria-label="Закрыть корзину" />
      <aside className="cart-drawer" aria-label="Корзина">
        <div className="drawer-head">
          <div>
            <p className="eyebrow">Заказ</p>
            <h2>Корзина</h2>
          </div>
          <button onClick={onClose} aria-label="Закрыть корзину">
            <ArrowRight size={22} />
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
              <button className={priceMode === "wholesale" ? "is-selected" : ""} onClick={() => setPriceMode("wholesale")}>
                Опт
              </button>
            </div>

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
      </aside>
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
                  <td>{product.sku}</td>
                  <td>{product.name}</td>
                  <td>{product.category}</td>
                  <td>{product.brand}</td>
                  <td>{formatRub(product.retailPrice)}</td>
                  <td>{formatRub(product.wholesalePrice)}</td>
                  <td>{product.stockQty} шт.</td>
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
      <h1>Ремонт остался, но магазин теперь главный</h1>
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
        <p className="eyebrow">Кабинет владельца</p>
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
              Telegram ID владельца
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
          <p className="eyebrow">Кабинет владельца</p>
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

function brandMark(brand) {
  const marks = {
    Apple: "A",
    Samsung: "SAMSUNG",
    Dyson: "dyson",
    Xiaomi: "MI",
    Sony: "SONY",
    Google: "Google",
    Garmin: "GARMIN",
    Marshall: "Marshall",
    OnePlus: "1+",
    Huawei: "HUAWEI",
    Honor: "HONOR",
    DJI: "dji"
  };
  return marks[brand] || brand;
}

function formatRub(value) {
  return new Intl.NumberFormat("ru-RU").format(Number(value || 0)) + " ₽";
}

function formatDate(value) {
  return new Intl.DateTimeFormat("ru-RU", { day: "2-digit", month: "long" }).format(new Date(value));
}

createRoot(document.getElementById("root")).render(<App />);
