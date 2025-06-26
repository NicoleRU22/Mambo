// ProductDetail.tsx
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";


const products = [
  {
    id: 1,
    name: "Suéter Cozy Winter",
    category: "sweaters",
    price: 24.99,
    originalPrice: 34.99,
    image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=400&q=80",
    rating: 4.8,
    reviews: 156,
    sizes: ["XS", "S", "M", "L"],
    petType: "dog",
    description: "Un suéter cálido ideal para paseos en invierno."
  },
  {
      id: 2,
      name: "Vestido Princesa Rosa",
      category: "dresses",
      price: 32.99,
      originalPrice: null,
      image: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=400&q=80",
      rating: 4.9,
      reviews: 89,
      sizes: ["XS", "S", "M"],
      petType: "dog"
    },
    {
      id: 3,
      name: "Camisa Casual Denim",
      category: "shirts",
      price: 19.99,
      originalPrice: 29.99,
      image: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=400&q=80",
      rating: 4.6,
      reviews: 203,
      sizes: ["S", "M", "L", "XL"],
      petType: "dog"
    },
    {
      id: 4,
      name: "Chaleco Elegante Gato",
      category: "sweaters",
      price: 22.99,
      originalPrice: null,
      image: "https://images.unsplash.com/photo-1574144611937-0df059b5ef3e?auto=format&fit=crop&w=400&q=80",
      rating: 4.7,
      reviews: 67,
      sizes: ["XS", "S", "M"],
      petType: "cat"
    },
    {
      id: 5,
      name: "Abrigo Impermeable",
      category: "jackets",
      price: 45.99,
      originalPrice: 59.99,
      image: "https://images.unsplash.com/photo-1551717743-49959800b1f6?auto=format&fit=crop&w=400&q=80",
      rating: 4.8,
      reviews: 124,
      sizes: ["S", "M", "L", "XL"],
      petType: "dog"
    },
    {
      id: 6,
      name: "Pijama Cómodo",
      category: "pajamas",
      price: 18.99,
      originalPrice: 25.99,
      image: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=400&q=80",
      rating: 4.5,
      reviews: 78,
      sizes: ["XS", "S", "M", "L"],
      petType: "cat"
    },
    {
  id: 7,
  name: "Alimento Premium para Perros",
  brand: "Royal Canin",
  price: 45.99,
  originalPrice: 59.99,
  image: "https://vitalcan.com/wp-content/uploads/2023/04/pack-premium-cordero.png",
  rating: 4.8,
  reviews: 124,
  stock: 10,
  description: "Alimento nutritivo para perros adultos de todas las razas.",
  sizes: [],
  petType: "dog"
},
{
  id: 8,
  name: "Casa para Gatos Moderna",
  brand: "PetHome",
  price: 89.99,
  originalPrice: 119.99,
  image: "https://petshopdelivery.pe/4375-large_default/550066-rascador-dos-pisos-y-casa-premium-para-gatos-54-x-41-x-70-cm.jpg",
  rating: 4.6,
  reviews: 89,
  stock: 5,
  description: "Diseño moderno y cómodo para gatos exigentes.",
  sizes: [],
  petType: "cat"
},
{
  id: 9,
  name: "Juguete Interactivo para Perros",
  brand: "Kong",
  price: 18.50,
  originalPrice: null,
  image: "https://lleva.pe/media/catalog/product/cache/9ff26ce5d29a3e5c9c029188d8445924/j/u/juguetes-para-perros-5.jpg",
  rating: 4.9,
  reviews: 256,
  stock: 20,
  description: "Entretenido y resistente, ideal para perros activos.",
  sizes: [],
  petType: "dog"
},
{
  id: 10,
  name: "Acuario Completo 40L",
  brand: "AquaLife",
  price: 129.99,
  originalPrice: 159.99,
  image: "https://acuatica.com.ec/blog/wp-content/uploads/2020/10/peces-acuarios-pequenos.png",
  rating: 4.7,
  reviews: 78,
  stock: 8,
  description: "Incluye filtro, iluminación y accesorios para peces.",
  sizes: [],
  petType: "fish"
}
  
];



const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const found = products.find((p) => p.id === parseInt(id));
    setProduct(found);
  }, [id]);

  if (!product) return <p className="text-center mt-10">Producto no encontrado</p>;

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
       <img
        src={product.image}
        alt={product.name}
        className="rounded-lg w-80 h-auto object-contain mx-auto"
        />
          <div>
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            <p className="text-gray-500 mb-4">{product.description}</p>

            <div className="flex items-center space-x-2 mb-4">
              <span className="text-xl font-semibold text-primary-600">S/. {product.price}</span>
              {product.originalPrice && (
                <span className="line-through text-gray-400">S/. {product.originalPrice}</span>
              )}
            </div>

            <p className="mb-2 text-sm text-gray-600">
              Valoración: ⭐ {product.rating} ({product.reviews} opiniones)
            </p>
 
 {/**T */}
            {product.sizes && product.sizes.length > 0 && (
             <p className="mb-2 text-sm text-gray-600">
              Tallas disponibles: {product.sizes.join(", ")}
             </p>
            )}

            <p className="mb-4 text-sm text-gray-600">Tipo de mascota: {product.petType}</p>
            {/**T */}
            <p className="mb-2 text-sm text-gray-600">Stock disponible: {product.stock ?? 'No especificado'}</p>

            <Button className="bg-primary-600 hover:bg-primary-700">
              <ShoppingCart className="h-4 w-4 mr-2" />
              Agregar al carrito
            </Button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ProductDetail;