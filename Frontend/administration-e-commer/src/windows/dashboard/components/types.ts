export type Product = {
  productId: string
  imageBase64: string
  name: string
  description: string
  price: number
  quantity: number
  category: {
    name: string
  }
  userAdmin: {
    fullName: string
    email: string
  }
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