// Placeholder catalog — real prices to be provided by client
export const catalog = {
  canal: {
    drc: [
      { id: "canal_drc_access",    name: "Canal+ Accès",              price: 10 },
      { id: "canal_drc_evasion",   name: "Canal+ Évasion",            price: 20 },
      { id: "canal_drc_access_plus", name: "Canal+ Accès+",           price: 27 },
      { id: "canal_drc_tout",      name: "Canal+ Tout Canal",         price: 50 },
      { id: "canal_drc_dstv",      name: "Options DStv",              price: 10 },
      { id: "canal_drc_evasion_dstv", name: "Évasion + DStv",        price: 30 },
      { id: "canal_drc_access_dstv",  name: "Accès+ + DStv",         price: 31 },
    ],
    rwanda: [
      { id: "canal_rw_access",     name: "Canal+ Accès",              price: 4.8 },
      { id: "canal_rw_evasion",    name: "Canal+ Évasion",            price: 7.8 },
      { id: "canal_rw_access_plus", name: "Canal+ Accès+",            price: 15 },
      { id: "canal_rw_tout",       name: "Canal+ Tout Canal",         price: 26 },
      { id: "canal_rw_dstv",       name: "Options DStv",              price: 9 },
      { id: "canal_rw_evasion_dstv", name: "Évasion + DStv",         price: 17 },
      { id: "canal_rw_access_dstv",  name: "Accès+ + DStv",          price: 23 },
    ],
    burundi: [
      { id: "canal_bi_access",     name: "Canal+ Accès",              price: 7 },
      { id: "canal_bi_evasion",    name: "Canal+ Évasion",            price: 13 },
      { id: "canal_bi_access_plus", name: "Canal+ Accès+",            price: 18 },
      { id: "canal_bi_tout",       name: "Canal+ Tout Canal",         price: 32 },
      { id: "canal_bi_dstv",       name: "Options DStv",              price: 6 },
      { id: "canal_bi_evasion_dstv", name: "Évasion + DStv",         price: 19 },
      { id: "canal_bi_access_dstv",  name: "Accès+ + DStv",          price: 24 },
    ],
  },
  dstv: {
    drc:     [],
    rwanda:  [],
    burundi: [],
  },
  vodacom: {
    drc: [
      { id: "voda_drc_1gb", name: "1 GB / 24h", price: 1 },
      { id: "voda_drc_5gb", name: "5 GB / 7 jours", price: 4 },
      { id: "voda_drc_20gb", name: "20 GB / 30 jours", price: 12 },
    ],
    rwanda: [],
    burundi: [],
  },
  airtel: {
    drc: [
      { id: "airtel_drc_1gb", name: "1 GB / 24h", price: 1 },
      { id: "airtel_drc_5gb", name: "5 GB / 7 jours", price: 4 },
    ],
    rwanda: [
      { id: "airtel_rw_1gb", name: "1 GB / 24h", price: 1 },
      { id: "airtel_rw_5gb", name: "5 GB / 7 jours", price: 4 },
    ],
    burundi: [
      { id: "airtel_bi_1gb", name: "1 GB / 24h", price: 1 },
    ],
  },
  orange: {
    drc: [
      { id: "orange_drc_1gb", name: "1 GB / 24h", price: 1 },
      { id: "orange_drc_10gb", name: "10 GB / 30 jours", price: 8 },
    ],
    rwanda: [],
    burundi: [
      { id: "orange_bi_1gb", name: "1 GB / 24h", price: 1 },
    ],
  },
  internet: {
    drc: [
      { id: "inet_drc_home10", name: "Home 10 Mbps / mois", price: 40 },
      { id: "inet_drc_home30", name: "Home 30 Mbps / mois", price: 80 },
    ],
    rwanda: [
      { id: "inet_rw_home10", name: "Home 10 Mbps / mois", price: 35 },
    ],
    burundi: [
      { id: "inet_bi_home10", name: "Home 10 Mbps / mois", price: 35 },
    ],
  },
};

export type CatalogService = keyof typeof catalog;
export type CatalogRegion = "drc" | "rwanda" | "burundi";

export function getProducts(service: CatalogService, region: CatalogRegion) {
  return catalog[service]?.[region] ?? [];
}
