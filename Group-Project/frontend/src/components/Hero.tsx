import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-white px-6 py-24 text-slate-900">
      <div className="absolute inset-0 -z-0">
        <div className="absolute left-1/4 top-20 h-72 w-72 rounded-full bg-blue-600/20 blur-3xl" />
        <div className="absolute right-1/4 top-40 h-72 w-72 rounded-full bg-purple-600/20 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2">
        
        {/* Left side */}
        <div>
          <div className="mb-6 inline-flex rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-2 text-sm text-blue-300">
            ✨ Smart Recommendation Engine
          </div>

          <h1 className="text-4xl font-bold leading-tight md:text-6xl">
            Discover Products
            <span className="block text-blue-400">
              You’ll Love
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-500">
            Analyze customer purchase patterns and product relationships
            to generate personalized recommendations.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              to="/recommendations"
              className="rounded-xl bg-blue-600 px-6 py-3 font-semibold transition hover:bg-blue-500"
            >
              Get Recommendations →
            </Link>

            <Link
              to="/dashboard"
              className="rounded-xl border border-slate-300 px-6 py-3 font-semibold transition hover:bg-gray-100"
            >
              View Dashboard
            </Link>
          </div>
        </div>

        {/* Right side */}
        <div className="relative">
          <div className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-2xl backdrop-blur">
            
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">
                  Top Recommendation
                </p>

                <h3 className="mt-1 text-xl font-semibold">
                  Customer Insights
                </h3>
              </div>

              <div className="rounded-xl bg-green-500/10 px-3 py-2 text-sm text-green-400">
                ● Active
              </div>
            </div>

            <div className="space-y-4">
              
              <div className="rounded-xl bg-gray-100 p-4">
                <div className="flex items-center justify-between">
                  <span>Wireless Headphones</span>
                  <span className="text-blue-400">94%</span>
                </div>

                <div className="mt-3 h-2 rounded-full bg-gray-200">
                  <div className="h-2 w-[94%] rounded-full bg-blue-500" />
                </div>
              </div>

              <div className="rounded-xl bg-gray-100 p-4">
                <div className="flex items-center justify-between">
                  <span>Phone Case</span>
                  <span className="text-purple-400">87%</span>
                </div>

                <div className="mt-3 h-2 rounded-full bg-gray-200">
                  <div className="h-2 w-[87%] rounded-full bg-purple-500" />
                </div>
              </div>

              <div className="rounded-xl bg-gray-100 p-4">
                <div className="flex items-center justify-between">
                  <span>USB-C Charger</span>
                  <span className="text-green-400">81%</span>
                </div>

                <div className="mt-3 h-2 rounded-full bg-gray-200">
                  <div className="h-2 w-[81%] rounded-full bg-green-500" />
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>
    </section>
  );
}