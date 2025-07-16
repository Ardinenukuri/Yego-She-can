'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import './product.css'

const products = [
  {
    id: 1,
    name: 'Lavender Herbal Soap',
    image: '/lavender-soap.jpg',
    description: 'Relaxing herbal soap made with organic lavender and oils.',
    price: 'RWF 4,000',
    category: 'soap',
  },
  {
    id: 2,
    name: 'African Black Soap',
    image: '/black-soap.jpg',
    description: 'Traditional African soap for natural skin care.',
    price: 'RWF 3,500',
    category: 'soap',
  },
  {
    id: 3,
    name: 'Ground Arabica Coffee',
    image: '/arabica-coffee.jpg',
    description: 'Locally grown Arabica beans, roasted and ground for rich flavor.',
    price: 'RWF 7,500',
    category: 'coffee',
  },
  {
    id: 4,
    name: 'Vanilla Soap Bar',
    image: '/vanilla-soap.jpg',
    description: 'Creamy soap bar with a gentle vanilla scent.',
    price: 'RWF 3,800',
    category: 'soap',
  },
  {
    id: 5,
    name: 'Premium Coffee Beans',
    image: '/coffee-beans.jpg',
    description: 'Whole roasted beans perfect for grinding fresh.',
    price: 'RWF 8,000',
    category: 'coffee',
  },
]


const ProductsPage = () => {
  return (
    <main className="products-page">
      <section className="products-hero">
        <h1>Support Women. Buy Handmade Soaps & Coffee</h1>
        <p>
          All products are crafted by women entrepreneurs who have completed our training and mentorship program.
        </p>
      </section>

      <section className="products-grid">
        {products.map((product) => (
          <div key={product.id} className="product-card">
            <Image
              src={product.image}
              alt={product.name}
              width={300}
              height={200}
              className="product-image"
            />
            <h3>{product.name}</h3>
            <p className="desc">{product.description}</p>
            <p className="price">{product.price}</p>
            <Link href={`/products/${product.id}`}>
              <button className="btn-primary">View Details</button>
            </Link>
          </div>
        ))}
      </section>
    </main>
  )
}

export default ProductsPage
