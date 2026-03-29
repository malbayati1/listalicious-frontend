export interface Item {
  _id: string;
  name: string;
  quantity: number;
  unit?: string;
  note?: string;
  is_checked: boolean;
  list_id: string;
  created_at: string;
  updated_at: string;
}
