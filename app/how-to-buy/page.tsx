import Link from 'next/link';
import Header from '@/app/components/Header'; // Pastikan path benar
import Footer from '@/app/components/Footer';

export default function HowToBuyPage() {
  const steps = [
    {
      emoji: "🔍",
      title: "Browse & Find",
      desc: "Explore our curated collection. Can't find it? Use the Request Form."
    },
    {
      emoji: "💬",
      title: "Chat to Deal",
      desc: "Click the 'Chat to Buy' button on the product page. Connect with us on Messenger."
    },
    {
      emoji: "💰",
      title: "Payment",
      desc: "We accept BCA/Mandiri (IDR) or GCash (PHP). Total includes shipping cost."
    },
    {
      emoji: "📦",
      title: "Shipping",
      desc: "We ship from our warehouse to your doorstep via trusted couriers (JNE/J&T/LBC)."
    }
  ];

  return (
    <main className="min-h-screen bg-white text-black">
      <Header />
      
      <section className="pt-40 pb-20 px-6 text-center">
        <h1 className="text-4xl md:text-6xl font-black mb-6">HOW TO BUY</h1>
        <p className="text-gray-500 max-w-2xl mx-auto text-lg">
          We keep it simple. No complicated carts. Just direct communication and secure transactions.
        </p>
      </section>

      <section className="container mx-auto px-6 mb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, idx) => (
            <div key={idx} className="bg-gray-50 p-8 rounded-3xl border border-gray-100 text-center hover:bg-gray-100 transition-colors">
              <div className="text-6xl mb-6">{step.emoji}</div>
              <h3 className="text-xl font-bold mb-2">{step.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-black text-white py-20 rounded-[3rem] mx-4 text-center">
         <h2 className="text-3xl font-bold mb-6">Ready to start?</h2>
         <Link href="/collection" className="inline-block bg-white text-black px-8 py-4 rounded-full font-bold hover:bg-cyan-400 hover:text-white transition-all">
            GO TO COLLECTION
         </Link>
      </section>

      <Footer />
    </main>
  );
}