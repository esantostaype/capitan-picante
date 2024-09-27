export enum Color {
  ACCENT = 'ACCENT',
  SUCCESS = 'SUCCESS',
  INFO = 'INFO',
  WARNING = 'WARNING',
  ERROR = 'ERROR'
}

export enum Variant {
  CONTAINED = 'CONTAINED',
  GHOST = 'GHOST'
}

export enum Size {
  XS = 'XS',
  SM = 'SM',
  MD = 'MD',
  LG = 'LG',
  XL = 'XL',
  _2XL = '2XL',
  _3XL = '3XL',
  _4XL = '4XL',
  _5XL = '5XL',
  _6XL = '6XL',
  _7XL = '7XL'
}

export enum IconButtonShape {
  CIRCLE = 'CIRCLE',
  SQUARE = 'SQUARE'
}

export enum  OrderType {
  DINE_IN = 'DINE_IN',
  TAKE_AWAY = 'TAKE_AWAY',
  DELIVERY = 'DELIVERY'
}

export enum OrderStatus {
  RECEIVED = 'RECEIVED',
  IN_PREPARATION = 'IN_PREPARATION',
  READY = 'READY',
  DONE = 'DONE',
  CANCELED = 'CANCELED'
}

export const orderTypeTranslations: { [ key in OrderType ]: string } = {
  [ OrderType.DINE_IN ]: 'Comer en Salón',
  [ OrderType.TAKE_AWAY ]: 'Para Llevar',
  [ OrderType.DELIVERY ]: 'Delivery'
}

export const orderStatusTranslations: { [ key in OrderStatus ]: string } = {
  [ OrderStatus.RECEIVED ]: 'Recibida',
  [ OrderStatus.IN_PREPARATION ]: 'En Preparación',
  [ OrderStatus.READY ]: 'Lista para Servir',
  [ OrderStatus.DONE ]: 'Entregada',
  [ OrderStatus.CANCELED ]: 'Cancelada'
}

export interface Client {
  id: string
  dni: string
  fullName?: string
  email: string
  phone: string
  userId: string
}

export interface Category {
  orderNumber: number
  id: string
  name: string
  products: {
    count: number
  }
}

export interface Product {
  id: string
  uniqueId?: string
  name: string
  description: string
  price: number
  image: string
  categoryId: string
  variations: ProductVariation[]
  variationOptionId?: string
  quantity?: number
  selectedVariations?: { [ key: string ]: string }
  notes?: string
  subtotal?: number
  category: {
    name: string
    orderNumber: number
  }
}

export type ProductFull = Omit<Product, ''> & {
  id: number
  uniqueId: string
  name: string
  price: number
  image: string
  quantity: number
  subtotal: number
  variationPrice?: number
  selectedVariation?: string
  selectedOption? : string
  client?: Client
  selectedVariations?: { [ key: string ]: string }
  selectedAdditionals?: { [ key: string ]: number }
  notes?: string
  category: Category
}

export interface ProductVariation {
  id: string
  name: string
  hasPrice?: boolean
  options: Array<{
    id: string;
    name: string
    price?: number
  }>
}

export interface ProductAdditional {
  id: string
  name: string
  price: number
}

export interface ProductIngredient {
  id: string
  name: string
  quantity: number
  unit: string
}

export interface Option {
  id: string
  name: string
  price: number
}

export interface Table {
  id: string
  number: string
}

export interface Floor {
  id: string
  name: string
  tables: Table[]
}

export interface SelectedVariants {
  [ key: string ]: string
}

export interface SelectedAdditionals {
  [ key: string ]: number
}

export interface Order {
  id: string
  total: number
  floor: string
  table: string
  tableId: string
  orderType: OrderType
  notes?: string
  status: OrderStatus
  date: Date
  orderReadyAt?: Date
  orderProducts: Product[]
  clientId?: string
  client?: Client
  orderNumber: string
}