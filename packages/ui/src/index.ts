// packages/ui/src/index.ts

export * from "./button";
export * from "./card";

export * from "./components/product";
export * from "./grid-card-product";
export * from "./input";
export * from "./input-select";
export * from "./logo";

// --- Imports des composants UI ---
export * from "../src/components/ui/accordion";
export * from "../src/components/ui/checkbox";
export * from "../src/components/ui/dialog"; // <-- AJOUTEZ CETTE LIGNE
export * from "../src/components/ui/drawer";
export * from "../src/components/ui/dropdown-menu";
export * from "../src/components/ui/form";
export * from "../src/components/ui/label";
export * from "../src/components/ui/navlink";
export * from "../src/components/ui/scroll-area"; // <-- AJOUTEZ CETTE LIGNE
export * from "../src/components/ui/select";
export * from "../src/components/ui/skeleton"; // <-- AJOUTEZ CETTE LIGNE
export * from "../src/components/ui/tabs";

export * from "../src/custom-modal";

export * from "./components/toast/toaster";



// --- Import des icônes ---
export * from "./icons/spinner.icon"; // <-- AJOUTEZ CETTE LIGNE

// --- Lucide icons re-export ---
export {
    Check,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    ChevronUp,
    Globe,
    Heart,
    ImageOff,
    Menu,
    Minus,
    Plus,
    Search,
    ShoppingBag,
    ShoppingCart,
    Trash2,
    User,
    Wallet,
    X
} from "lucide-react";

