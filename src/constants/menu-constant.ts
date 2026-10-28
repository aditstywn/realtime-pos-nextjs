export const HEADER_TABLE_MENU = [
  "No",
  "Name",
  "Category",
  "Price",
  "Available",
  "Action",
];

export const CATEGORY_LIST = [
  {
    value: "mains",
    label: "Mains",
  },
  {
    value: "sides",
    label: "Sides",
  },
  {
    value: "desserts",
    label: "Desserts",
  },
  {
    value: "beverage",
    label: "Beverages",
  },
];
export const AVAILABILITY_LIST = [
  { value: "true", label: "Available" },
  { value: "false", label: "Not Available" },
];

export const INITIAL_CREATE_MENU = {
  name: "",
  description: "",
  category: "",
  price: "",
  discount: "",
  image_url: "",
  is_available: "",
};

export const INITIAL_STATE_CREATE_MENU = {
  status: "idle",
  errors: {
    name: [],
    description: [],
    category: [],
    price: [],
    discount: [],
    image_url: [],
    is_available: [],
    _form: [],
  },
};
