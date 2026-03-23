export type Language = "en" | "fr";

export type Step =
  | "choose_language"
  | "choose_service"
  | "choose_region"
  | "choose_action"
  | "choose_product"
  | "enter_decoder"
  | "choose_payment"
  | "awaiting_payment"
  | "done";

export type Service = "canal" | "dstv" | "vodacom" | "airtel" | "orange" | "internet" | "assistance";

export type Region = "drc" | "rwanda" | "burundi";

export type Action = "subscribe" | "reactivate" | "modify";

export type PaymentMethod = "airtel_money" | "mpesa" | "orange_money";

export interface UserSession {
  phone: string;
  language: Language;
  step: Step;
  selected_service?: Service;
  selected_region?: Region;
  selected_action?: Action;
  selected_product_id?: string;
  decoder_number?: string;
  payment_method?: PaymentMethod;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  service_id: string;
  region_id: string;
}

export interface Order {
  id: string;
  user_id: string;
  product_id: string;
  status: "pending" | "paid" | "failed";
  decoder_number: string;
  payment_method: PaymentMethod;
  created_at: string;
}
