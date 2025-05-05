"use client"
import React from "react"
import { Product } from "./types"

export default function ProductCard({ product }: { product: Product }) {
  return (
    <div className="overflow-hidden border-2 rounded-md bg-white">
      <div className="p-4 flex justify-center">
        <img
          src="/placeholder.svg?height=150&width=150"
          alt="Headphones"
          className="object-contain h-[150px] w-[150px]"
        />
      </div>
      <div className="border-t-2 p-4">
        <div className="space-y-1">
          <p><span className="font-medium">productName:</span> {product.productName}</p>
          <p><span className="font-medium">productDescription:</span> {product.productDescription}</p>
          <p><span className="font-medium">price:</span> {product.price}</p>
          <p><span className="font-medium">quantity:</span> {product.quantity}</p>
          <p><span className="font-medium">category:</span> {product.category}</p>
        </div>
      </div>
      <div className="border-t-2 p-4">
        <p><span className="font-medium">userAdmin:</span> {product.userAdmin}</p>
        <p><span className="font-medium">email:</span> {product.email}</p>
      </div>
    </div>
  )
}