export interface Product {
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


export interface AdminProfile {
    fullName: string
    email: string
}

export interface Category {
    categoryId: string
    name: string
    description: string
}

export interface User {
    email: string
    fullName: string
}

