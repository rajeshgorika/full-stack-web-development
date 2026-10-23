import { useState } from "react";
import type { IconType } from "react-icons";
import { getProductByName } from "../data/products";
import {
  FaLaptop,
  FaMouse,
  FaKeyboard,
  FaBriefcase,
  FaUsb,
  FaThLarge,
  FaMobileAlt,
  FaShieldAlt,
  FaBolt,
  FaBatteryFull,
  FaHeadphones,
  FaHeadphonesAlt,
  FaVolumeUp,
} from "react-icons/fa";
import { MdWatch } from "react-icons/md";

// Each product now has a curated photo (see `imageUrl` in products.ts).
// The icon set below is kept as a fallback in case a photo fails to load.
const ICONS: Record<string, IconType> = {
  Laptop: FaLaptop,
  "Wireless Mouse": FaMouse,
  Keyboard: FaKeyboard,
  "Laptop Bag": FaBriefcase,
  "USB Hub": FaUsb,
  "Mouse Pad": FaThLarge,
  Smartphone: FaMobileAlt,
  "Phone Case": FaShieldAlt,
  "USB-C Fast Charger": FaBolt,
  "Screen Protector": FaShieldAlt,
  "Power Bank": FaBatteryFull,
  "Wireless Headphones": FaHeadphones,
  "Wireless Earbuds": FaHeadphonesAlt,
  "Bluetooth Speaker": FaVolumeUp,
  "Smart Watch": MdWatch,
};

const GRADIENTS: Record<string, string> = {
  Computing: "from-blue-500/20 to-indigo-500/20 text-blue-300",
  Mobile: "from-purple-500/20 to-pink-500/20 text-purple-300",
  Audio: "from-cyan-500/20 to-teal-500/20 text-cyan-300",
  Wearables: "from-amber-500/20 to-orange-500/20 text-amber-300",
};

export default function ProductImage({
  name,
  category,
  className = "",
  iconClassName = "h-1/2 w-1/2",
}: {
  name: string;
  category?: string;
  className?: string;
  iconClassName?: string;
}) {
  const Icon = ICONS[name] ?? FaLaptop;
  const gradient = GRADIENTS[category ?? ""] ?? GRADIENTS.Computing;
  const imageUrl = getProductByName(name)?.imageUrl;
  const [imageFailed, setImageFailed] = useState(false);

  if (imageUrl && !imageFailed) {
    return (
      <div className={`overflow-hidden bg-gray-100 ${className}`}>
        <img
          src={imageUrl}
          alt={name}
          className="h-full w-full object-cover"
          onError={() => setImageFailed(true)}
        />
      </div>
    );
  }

  return (
    <div
      className={`flex items-center justify-center bg-gradient-to-br ${gradient} ${className}`}
    >
      <Icon className={iconClassName} />
    </div>
  );
}
