export default function StatsSection() {
  return (
    <section className="py-20 bg-gray-50 text-slate-900">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">

        <div className="bg-gray-100 rounded-2xl p-8">
          <h2 className="text-4xl font-bold text-cyan-400">500+</h2>
          <p className="mt-2 text-gray-600">Products</p>
        </div>

        <div className="bg-gray-100 rounded-2xl p-8">
          <h2 className="text-4xl font-bold text-purple-400">1000+</h2>
          <p className="mt-2 text-gray-600">Happy Customers</p>
        </div>

        <div className="bg-gray-100 rounded-2xl p-8">
          <h2 className="text-4xl font-bold text-pink-400">98%</h2>
          <p className="mt-2 text-gray-600">Recommendation Accuracy</p>
        </div>

      </div>
    </section>
  );
}
