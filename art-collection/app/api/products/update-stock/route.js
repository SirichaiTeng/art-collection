import { NextResponse } from 'next/server'

let products = [
  {
    id: 1,
    name: 'Pop Mart Molly Classic',
    price: 450,
    image:
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=300&fit=crop',
    stock: 15,
  },
  {
    id: 2,
    name: 'Kaws Companion',
    price: 1200,
    image:
      'https://images.unsplash.com/photo-1572635196184-84e35138cf62?w=300&h=300&fit=crop',
    stock: 8,
  },
  {
    id: 3,
    name: 'Bearbrick 400%',
    price: 2500,
    image:
      'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=300&h=300&fit=crop',
    stock: 5,
  },
  {
    id: 4,
    name: 'Funko Pop Batman',
    price: 350,
    image:
      'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=300&h=300&fit=crop',
    stock: 20,
  },
  {
    id: 5,
    name: 'Sonny Angel Mini',
    price: 280,
    image:
      'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=300&h=300&fit=crop',
    stock: 12,
  },
  {
    id: 6,
    name: 'Labubu Monster',
    price: 650,
    image:
      'https://images.unsplash.com/photo-1572635196184-84e35138cf62?w=300&h=300&fit=crop',
    stock: 10,
  },
  {
    id: 7,
    name: 'Dimoo Space Travel',
    price: 480,
    image:
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=300&fit=crop',
    stock: 18,
  },
  {
    id: 8,
    name: 'Hirono Little Nurse',
    price: 520,
    image:
      'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=300&h=300&fit=crop',
    stock: 7,
  },
  {
    id: 9,
    name: 'Skullpanda Dark Maid',
    price: 580,
    image:
      'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=300&h=300&fit=crop',
    stock: 14,
  },
  {
    id: 10,
    name: 'Mega Space Molly',
    price: 890,
    image:
      'https://images.unsplash.com/photo-1572635196184-84e35138cf62?w=300&h=300&fit=crop',
    stock: 6,
  },
  {
    id: 11,
    name: 'Crybaby Sad Club',
    price: 420,
    image:
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=300&fit=crop',
    stock: 16,
  },
  {
    id: 12,
    name: 'Zimomo Surprise Box',
    price: 750,
    image:
      'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=300&h=300&fit=crop',
    stock: 9,
  },
  {
    id: 13,
    name: 'Pucky Pool Babies',
    price: 380,
    image:
      'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=300&h=300&fit=crop',
    stock: 13,
  },
  {
    id: 14,
    name: 'Satyr Rory Magic',
    price: 620,
    image:
      'https://images.unsplash.com/photo-1572635196184-84e35138cf62?w=300&h=300&fit=crop',
    stock: 11,
  },
  {
    id: 15,
    name: 'The Monsters Tasty',
    price: 460,
    image:
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=300&fit=crop',
    stock: 17,
  },
  {
    id: 16,
    name: 'Bobo & Coco Sweet',
    price: 340,
    image:
      'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=300&h=300&fit=crop',
    stock: 22,
  },
]

export async function POST(request) {
  const { productId, quantity } = await request.json()

  const productIndex = products.findIndex(p => p.id === productId)
  if (productIndex !== -1) {
    products[productIndex].stock -= quantity
    if (products[productIndex].stock < 0) {
      products[productIndex].stock = 0
    }

    return NextResponse.json({
      productId,
      newStock: products[productIndex].stock,
      success: true,
    })
  }

  return NextResponse.json({ success: false, error: 'Product not found' })
}
