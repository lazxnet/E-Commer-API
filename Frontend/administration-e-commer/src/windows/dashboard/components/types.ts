export type Product = {
    id: number
    productName: string
    productDescription: string
    price: number
    quantity: number
    category: string
    userAdmin: string
    email: string
  }
  
  export type AdminProfile = {
    fullName: string
    email: string
  }
  
  export type Category = {
    categoryId: string
    name: string
    description: string
    userAdmin: {
      email: string
      fullName: string
    }
  }