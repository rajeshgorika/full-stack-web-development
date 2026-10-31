import aprioriData from "../data/aprioriData.json";
import { idToName } from "../data/products";

const API_BASE_URL = (import.meta.env.VITE_API_URL as string) || "http://127.0.0.1:5000";

const FETCH_TIMEOUT_MS = 2500;

async function fetchWithTimeout(url: string, options: RequestInit = {}): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(timeoutId);
    return res;
  } catch (err) {
    clearTimeout(timeoutId);
    throw err;
  }
}

export interface RecommendationItem {
  name: string;
  score: number;
  support: number;
  confidence: number;
  lift: number;
}

export interface PopularProduct {
  name: string;
  category: string;
  purchases: number;
  growth: string;
}

export interface DashboardStats {
  total_transactions: number;
  total_products: number;
  total_rules: number;
  average_confidence: number;
}

export interface UserOrder {
  id: string;
  items: Array<{ name: string; price: number; quantity: number }>;
  total: number;
  created_at: string;
}

// ----------------------------------------------------
// Recommendations
// ----------------------------------------------------
export async function fetchProductRecommendations(productIdOrName: string): Promise<{ product: string; recommendations: RecommendationItem[] }> {
  const cleanName = idToName(productIdOrName);

  try {
    const res = await fetchWithTimeout(`${API_BASE_URL}/api/recommendations/${encodeURIComponent(productIdOrName)}`);
    if (res.ok) {
      const data = await res.json();
      if (data.recommendations && data.recommendations.length > 0) {
        return data;
      }
    }
  } catch {
    // Backend offline or timeout -> use local Apriori engine
  }

  // Pure client-side Apriori rule lookup from dataset
  const matches: Record<string, RecommendationItem> = {};

  for (const rule of aprioriData.rules) {
    if (rule.antecedents.includes(cleanName)) {
      for (const consequent of rule.consequents) {
        if (consequent !== cleanName) {
          if (!matches[consequent] || rule.confidence > matches[consequent].score) {
            matches[consequent] = {
              name: consequent,
              score: rule.confidence,
              support: rule.support,
              confidence: rule.confidence,
              lift: rule.lift,
            };
          }
        }
      }
    }
  }

  const sortedRecs = Object.values(matches).sort((a, b) => b.score - a.score);

  return {
    product: cleanName,
    recommendations: sortedRecs,
  };
}

// ----------------------------------------------------
// Dashboard Stats
// ----------------------------------------------------
export async function fetchStats(): Promise<DashboardStats> {
  try {
    const res = await fetchWithTimeout(`${API_BASE_URL}/api/stats`);
    if (res.ok) {
      return await res.json();
    }
  } catch {
    // Backend offline
  }

  return {
    total_transactions: aprioriData.total_transactions,
    total_products: aprioriData.total_products,
    total_rules: aprioriData.total_rules,
    average_confidence: aprioriData.average_confidence,
  };
}

// ----------------------------------------------------
// Popular Products
// ----------------------------------------------------
export async function fetchPopularProducts(): Promise<PopularProduct[]> {
  try {
    const res = await fetchWithTimeout(`${API_BASE_URL}/api/popular-products`);
    if (res.ok) {
      return await res.json();
    }
  } catch {
    // Backend offline
  }

  return aprioriData.popular_products as PopularProduct[];
}

// ----------------------------------------------------
// Auth & Orders (LocalStorage + API fallback)
// ----------------------------------------------------
const ORDERS_STORAGE_KEY = "recoai-placed-orders";

export async function loginUser(email: string, password?: string) {
  try {
    const res = await fetchWithTimeout(`${API_BASE_URL}/api/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (res.ok) {
      return await res.json();
    }
    const errData = await res.json();
    throw new Error(errData.error || "Login failed.");
  } catch (err: any) {
    if (err.message && err.message !== "Failed to fetch" && !err.name.includes("Abort")) {
      throw err;
    }
    // Fallback demo user
    const username = email.split("@")[0];
    const capitalized = username.charAt(0).toUpperCase() + username.slice(1);
    return {
      message: "Login successful (Demo Mode)",
      user: {
        id: "usr-" + Math.abs(email.split("").reduce((acc, c) => acc * 31 + c.charCodeAt(0), 7)),
        name: capitalized,
        email: email.toLowerCase(),
      },
    };
  }
}

export async function registerUser(name: string, email: string, password?: string) {
  try {
    const res = await fetchWithTimeout(`${API_BASE_URL}/api/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    if (res.ok) {
      return await res.json();
    }
    const errData = await res.json();
    throw new Error(errData.error || "Registration failed.");
  } catch (err: any) {
    if (err.message && err.message !== "Failed to fetch" && !err.name.includes("Abort")) {
      throw err;
    }
    return { message: "Registration successful." };
  }
}

export async function placeOrder(userId: string, items: Array<{ name: string; price: number; quantity: number }>, total: number) {
  try {
    const res = await fetchWithTimeout(`${API_BASE_URL}/api/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: userId, items, total }),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch {
    // Fallback
  }

  const orderId = "ORD-" + Math.floor(100000 + Math.random() * 900000);
  const newOrder: UserOrder = {
    id: orderId,
    items,
    total,
    created_at: new Date().toISOString(),
  };

  try {
    const stored = JSON.parse(localStorage.getItem(ORDERS_STORAGE_KEY) || "[]");
    stored.unshift(newOrder);
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(stored));
  } catch {}

  return { message: "Order placed successfully.", order_id: orderId };
}

export async function fetchUserOrders(userId: string): Promise<UserOrder[]> {
  try {
    const res = await fetchWithTimeout(`${API_BASE_URL}/api/orders/${userId}`);
    if (res.ok) {
      const orders = await res.json();
      if (Array.isArray(orders) && orders.length > 0) return orders;
    }
  } catch {
    // Fallback
  }

  try {
    const stored = JSON.parse(localStorage.getItem(ORDERS_STORAGE_KEY) || "[]");
    if (stored.length > 0) return stored;
  } catch {}

  // Initial sample order so the user sees order history
  return [
    {
      id: "ORD-941820",
      items: [
        { name: "Laptop", price: 54999, quantity: 1 },
        { name: "Wireless Mouse", price: 799, quantity: 1 },
      ],
      total: 55798,
      created_at: new Date(Date.now() - 86400000).toISOString(),
    },
  ];
}
