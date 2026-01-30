export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
}

export interface Product {
  _id: string; // Changed from id (number) to _id (string) for MongoDB
  name: string;
  description?: string;
  images: string[];
  brand: string;
  colors: string[]; // Changed from string to string[]
  sizes: string[]; // Changed from string to string[]
  weight: number;
  price: number;
  stock: number;
  homePage?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface SidebarProps {
  isOpen: boolean;
  currentPage: string;
  onPageChange: (page: string) => void;
  onToggle: () => void;
}

export interface HeaderProps {
  title: string;
}

export interface DashboardProps {
  users: User[];
  products: Product[];
}

export interface UsersPageProps {
  users: User[];
  onDeleteUser: (id: number) => void;
}

export interface ProductRowProps {
  product: Product;
  isEditing: boolean;
  editingProduct: Product | null;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onDelete: () => void;
  onFieldChange: (field: string, value: any) => void;
}

export interface AddProductRowProps {
  newProduct: Product;
  onChange: (field: string, value: any) => void;
  onSave: () => void;
  onCancel: () => void;
}

export interface ProductsPageProps {
  products: Product[];
  editingProduct: Product | null;
  isAddingProduct: boolean;
  newProduct: Product;
  onStartEdit: (product: Product) => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
  onDeleteProduct: (id: number) => void;
  onEditFieldChange: (field: string, value: any) => void;
  onStartAdding: () => void;
  onAddProduct: () => void;
  onCancelAdding: () => void;
  onNewProductChange: (field: string, value: any) => void;
}
