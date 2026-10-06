export type HeroConfig = {
  photo: string;
  photoAlt: string;
  dateMonth: string;
  dateDay: string;
  dateYear: string;
  time: string;
  weight: string;
  height: string;
  place: string;
  city: string;
  country: string;
  ctaLabel: string;
};

export const DEFAULT_HERO_CONFIG: HeroConfig = {
  photo: "/memory/radman-and-me.png",
  photoAlt: "Radman and his father — archive photograph",
  dateMonth: "DEC",
  dateDay: "01",
  dateYear: "2022",
  time: "14:15",
  weight: "3.100",
  height: "49",
  place: "NIKAN AQDASIEH",
  city: "Tehran",
  country: "Iran",
  ctaLabel: "ENTER THE STORY",
};

export const HERO_CONFIG_STORAGE_KEY = "radman:hero-config:v1";

export function readHeroConfig(): HeroConfig {
  if (typeof window === "undefined") return DEFAULT_HERO_CONFIG;
  try {
    const raw = window.localStorage.getItem(HERO_CONFIG_STORAGE_KEY);
    if (!raw) return DEFAULT_HERO_CONFIG;
    return { ...DEFAULT_HERO_CONFIG, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_HERO_CONFIG;
  }
}

export function writeHeroConfig(config: HeroConfig) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(HERO_CONFIG_STORAGE_KEY, JSON.stringify(config));
  window.dispatchEvent(new CustomEvent("radman:hero-config-updated"));
}
