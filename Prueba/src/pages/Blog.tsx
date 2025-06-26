import React from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

interface Post {
  title: string
  excerpt: string
  date: string
  category: string
  image: string
}

const Blog = () => {
  const featuredPosts: Post[] = [
    {
      title: 'Cómo cuidar a tu perro en invierno',
      excerpt: 'Consejos prácticos para mantener a tu perro saludable y feliz cuando baja la temperatura.',
      date: '01 Jun 2025',
      category: 'Cuidado',
      image: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=800&q=80',
    },
    {
      title: 'Los mejores juguetes para gatos',
      excerpt: 'Descubre los juguetes más entretenidos y seguros para tu amigo felino.',
      date: '10 Jun 2025',
      category: 'Juguetes',
      image: 'https://es.mypet.com/wp-content/uploads/sites/23/2021/03/Ventajas-juguetes-gatos-e1607511670469.jpg?w=700',
    },
  ]


  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-100 via-white to-pink-100">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-12">
        {/* Título general */}
        <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 text-center mb-6">Nuestro Blog</h2>
        <p className="text-center text-gray-600 mb-12">
          Artículos, tips y novedades para el cuidado de tu mascota.
        </p>

        {/* Featured */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {featuredPosts.map((post, i) => (
            <div
              key={i}
              className="relative rounded-xl overflow-hidden shadow-lg transform transition-transform duration-300 hover:scale-[1.02]"
            >
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-80 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent rounded-xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="inline-block bg-primary-600 text-white text-xs uppercase font-semibold rounded-full px-3 py-1">
                  {post.category}
                </div>
                <div className="text-gray-200 text-xs mt-1">{post.date}</div>
                <h3 className="text-2xl text-white font-bold mt-3">{post.title}</h3>
                <p className="text-gray-100 mt-2 line-clamp-3">{post.excerpt}</p>
              </div>
            </div>
          ))}
        </section>

        
      </main>

      <Footer />
    </div>
  )
}

export default Blog
