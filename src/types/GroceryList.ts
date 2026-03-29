export interface GroceryList {
  _id: string;
  title: string;
  owner_id: string;
  items: [];
  shared_with: string[];
  created_at: string;
  updated_at: string;
}
