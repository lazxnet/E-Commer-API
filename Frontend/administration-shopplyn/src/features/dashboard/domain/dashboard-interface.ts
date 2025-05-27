export interface Product {
    productId: string
    imageBase64: string
    name: string
    description: string
    price: number
    quantity: number

}


export interface AdminProfile {
    fullName: string
    email: string
}

export interface Category {
    categoryId: string
    name: string
    description: string
    delete: {
    email: string
    fullName: string 
    }
}

export interface userAdmin {
    email: string
    fullName: string
}

