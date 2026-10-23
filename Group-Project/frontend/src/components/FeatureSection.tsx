export default function FeatureSection() {
  const features = [
    {
      icon: "🎯",
      title: "Personalized Recommendations",
      description:
        "Get personalized product recommendations based on customer purchase patterns."
    },
    {
      icon: "🔗",
      title: "Co-Purchase Analysis",
      description:
        "Discover products that are frequently purchased together using pattern analysis."
    },
    {
      icon: "📊",
      title: "Smart Analytics",
      description:
        "Understand customer behavior and product relationships through clear analytics."
    },
    {
      icon: "⚡",
      title: "Real-Time Insights",
      description:
        "Quickly identify popular products and useful recommendation patterns."
    }
  ];

  return (
    <section className="bg-white px-6 py-20 text-slate-900">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-blue-400">
            Powerful Features
          </p>

          <h2 className="text-3xl font-bold md:text-4xl">
            Smarter Shopping, Personalized for You
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-slate-500">
            Our recommendation engine analyzes product relationships and
            customer behavior to provide tailored recommendations.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-2xl border border-slate-200 bg-gray-50 p-6 transition duration-300 hover:-translate-y-2 hover:border-blue-500"
            >
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-blue-500/10 text-3xl">
                {feature.icon}
              </div>

              <h3 className="mb-3 text-xl font-semibold">
                {feature.title}
              </h3>

              <p className="text-sm leading-6 text-slate-500">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}