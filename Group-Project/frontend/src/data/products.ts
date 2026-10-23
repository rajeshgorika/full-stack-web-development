// --------------------------------------------------
// Central product catalog
//
// `name` MUST match the product names used in the backend's
// transactions.csv / association rules exactly, since the
// recommendation engine matches on these names.
// `id` is the URL-friendly slug used in routes and API calls.
// --------------------------------------------------

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  imageUrl?: string;
}

// Turns "Wireless Headphones" -> "Wireless-Headphones"
// Turns "USB-C Fast Charger" -> "USB-C-Fast-Charger"
export function nameToId(name: string): string {
  return name.trim().replace(/\s+/g, "-");
}

// Turns a slug back into the dataset's product name.
// Mirrors the fix-up logic in backend/app.py.
export function idToName(id: string): string {
  return decodeURIComponent(id).replace(/-/g, " ").replace("USB C", "USB-C");
}

const raw: Omit<Product, "id">[] = [
  {
    name: "Laptop",
    category: "Computing",
    price: 54999,
    description: "A powerful everyday laptop for work, study, and play.",
    imageUrl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSHh0TO3I7zSpAn5ykUnz6i8ijhl_EhRd7Murapg9zBIw&s",
  },
  {
    name: "Wireless Mouse",
    category: "Computing",
    price: 799,
    description: "Ergonomic wireless mouse with a precision optical sensor.",
    imageUrl:
      "https://shop.zebronics.com/cdn/shop/files/Zeb-Blanc-100-Black-pic1.jpg?v=1772884342&width=2000",
  },
  {
    name: "Keyboard",
    category: "Computing",
    price: 1499,
    description: "Responsive keyboard built for comfortable long typing sessions.",
    imageUrl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSWYip259VN79nUO4ijhpV80GzhxDs30ZQvOmX6S4Blfg&s",
  },
  {
    name: "Laptop Bag",
    category: "Computing",
    price: 1299,
    description: "Padded, water-resistant bag to carry your laptop safely.",
    imageUrl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRQYqkRuDmQ4T5iOnSBHU-TjKDP_O4GLIHLq8rijb5sqQ&s",
  },
  {
    name: "USB Hub",
    category: "Computing",
    price: 999,
    description: "Multi-port USB hub to expand your laptop's connectivity.",
    imageUrl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRODZUAlIj3qSgve77zTUY6b5zJpfMOBf5sqcyU0emvfQ&s",
  },
  {
    name: "Mouse Pad",
    category: "Computing",
    price: 249,
    description: "Smooth-glide mouse pad with a stitched, non-fray edge.",
    imageUrl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRsYpS4ytU8DQ-Pp_rExxWPxOjOj2_c7NMLpim4Djuhow&s",
  },
  {
    name: "Smartphone",
    category: "Mobile",
    price: 24999,
    description: "A feature-packed smartphone with a stunning display.",
    imageUrl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTIgr25T0wY7JBnz77Ntkq2FsX2Eo_lFXYk-S47eIehWw&s",
  },
  {
    name: "Phone Case",
    category: "Mobile",
    price: 399,
    description: "Shock-absorbing phone case with a slim, grippy profile.",
    imageUrl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS6Vv3tl4yxIo4CEoxe16ubwMEZG5TMJtes48GR6L8f9A&s",
  },
  {
    name: "USB-C Fast Charger",
    category: "Mobile",
    price: 899,
    description: "Fast-charging USB-C adapter that tops up your phone quickly.",
    imageUrl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcREm1RHrK6FwFUhthuDABIJHX8eIMpcBtBrnlUQsTPDJg&s",
  },
  {
    name: "Screen Protector",
    category: "Mobile",
    price: 299,
    description: "Tempered-glass screen protector with anti-scratch coating.",
    imageUrl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQg0wdkKl10RFRGlKt6pTu_FA3w6CxA2sTB5tLaqgeYOA&s",
  },
  {
    name: "Power Bank",
    category: "Mobile",
    price: 1599,
    description: "High-capacity power bank to keep your devices charged on the go.",
    imageUrl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQAUvMsK1e0VlQeI1YmzpPZpvK2BgRNwH9GQmPiu0_ewA&s",
  },
  {
    name: "Wireless Headphones",
    category: "Audio",
    price: 3999,
    description: "Over-ear wireless headphones with rich, immersive sound.",
    imageUrl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRhTTZe9v_McYWcK8SdzREUMt2svXZa2qrR4rR4CHkN4Q&s",
  },
  {
    name: "Wireless Earbuds",
    category: "Audio",
    price: 2499,
    description: "Compact true-wireless earbuds with a compact charging case.",
    imageUrl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT4lOvGEMIFahrMOlTXz5IFwuC5hPtDXRqMAlgnBoJu3Q&s",
  },
  {
    name: "Bluetooth Speaker",
    category: "Audio",
    price: 2199,
    description: "Portable Bluetooth speaker with punchy bass and long battery life.",
    imageUrl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSvD9jlvU3rGhus-hZAOyjflbV3Q-_wafAZ4332BCYyug&s",
  },
  {
    name: "Smart Watch",
    category: "Wearables",
    price: 4999,
    description: "Fitness-tracking smart watch with heart-rate and sleep monitoring.",
    imageUrl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTRz-eREgkeK8kjbhoLIL6E6lj3G3etsYjmsL_RtwGG6A&s",
  },
];

export const PRODUCTS: Product[] = raw.map((p) => ({
  ...p,
  id: nameToId(p.name),
}));

export function getProductById(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id);
}

// Best-effort lookup by dataset/display name (used for matching
// recommendation results, which come back as plain names).
export function getProductByName(name: string): Product | undefined {
  const normalized = name.trim().toLowerCase();
  return PRODUCTS.find((p) => p.name.toLowerCase() === normalized);
}

// Fallback emoji shown if a product image fails to load.
export const FALLBACK_EMOJI = "🛍️";
