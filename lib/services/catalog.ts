// Placeholder catalog — real prices to be provided by client
export const catalog = {
  canal: {
    drc: [
      { id: "canal_drc_access", name: "Canal+ Access", price: 10 },
      { id: "canal_drc_evasion", name: "Canal+ Évasion", price: 18 },
      { id: "canal_drc_tout", name: "Canal+ Tout", price: 30 },
    ],
    rwanda: [
      { id: "canal_rw_access", name: "Canal+ Access", price: 10 },
      { id: "canal_rw_evasion", name: "Canal+ Évasion", price: 18 },
    ],
    burundi: [
      { id: "canal_bi_access", name: "Canal+ Access", price: 10 },
      { id: "canal_bi_evasion", name: "Canal+ Évasion", price: 18 },
    ],
  },
  dstv: {
    drc: [
      { id: "dstv_drc_padi", name: "DStv Padi", price: 8 },
      { id: "dstv_drc_confam", name: "DStv Confam", price: 14 },
      { id: "dstv_drc_compact", name: "DStv Compact", price: 25 },
      { id: "dstv_drc_premium", name: "DStv Premium", price: 55 },
    ],
    rwanda: [
      { id: "dstv_rw_padi", name: "DStv Padi", price: 8 },
      { id: "dstv_rw_compact", name: "DStv Compact", price: 25 },
    ],
    burundi: [
      { id: "dstv_bi_padi", name: "DStv Padi", price: 8 },
      { id: "dstv_bi_compact", name: "DStv Compact", price: 25 },
    ],
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
