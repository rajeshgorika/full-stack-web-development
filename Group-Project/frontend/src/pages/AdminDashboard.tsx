import Navbar from "../components/Navbar";

export default function AdminDashboard() {
  const customers = [
    {
      id: "C001",
      name: "Rahul",
      city: "Chennai",
      orders: 12,
      status: "Active",
    },
    {
      id: "C002",
      name: "Priya",
      city: "Hyderabad",
      orders: 8,
      status: "Active",
    },
    {
      id: "C003",
      name: "Arjun",
      city: "Bengaluru",
      orders: 15,
      status: "Active",
    },
    {
      id: "C004",
      name: "Sneha",
      city: "Mumbai",
      orders: 5,
      status: "Inactive",
    },
    {
      id: "C005",
      name: "Kiran",
      city: "Vizag",
      orders: 10,
      status: "Active",
    },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900">

      <Navbar />

      <main className="mx-auto max-w-7xl px-6 pt-32 pb-10">

        <h1 className="text-4xl font-bold">
          Admin Dashboard
        </h1>

        <p className="mt-2 text-slate-500">
          Customer Management
        </p>

        {/* Cards */}
        <div className="mt-8 grid gap-5 md:grid-cols-3">

          <div className="rounded-xl bg-gray-50 p-6">
            <p className="text-slate-500">
              Total Customers
            </p>

            <h2 className="mt-2 text-3xl font-bold">
              {customers.length}
            </h2>
          </div>

          <div className="rounded-xl bg-gray-50 p-6">
            <p className="text-slate-500">
              Active Customers
            </p>

            <h2 className="mt-2 text-3xl font-bold text-green-400">
              {
                customers.filter(
                  (c) => c.status === "Active"
                ).length
              }
            </h2>
          </div>

          <div className="rounded-xl bg-gray-50 p-6">
            <p className="text-slate-500">
              Total Orders
            </p>

            <h2 className="mt-2 text-3xl font-bold text-blue-400">
              {customers.reduce(
                (sum, c) => sum + c.orders,
                0
              )}
            </h2>
          </div>

        </div>

        {/* Customer Table */}
        <div className="mt-10 rounded-xl bg-gray-50 p-6">

          <h2 className="mb-5 text-2xl font-semibold">
            Customer Details
          </h2>

          <table className="w-full">

            <thead>
              <tr className="border-b border-slate-300 text-left">

                <th className="py-3">ID</th>
                <th>Name</th>
                <th>City</th>
                <th>Orders</th>
                <th>Status</th>

              </tr>
            </thead>

            <tbody>

              {customers.map((customer) => (

                <tr
                  key={customer.id}
                  className="border-b border-slate-200"
                >

                  <td className="py-4">
                    {customer.id}
                  </td>

                  <td>
                    {customer.name}
                  </td>

                  <td>
                    {customer.city}
                  </td>

                  <td>
                    {customer.orders}
                  </td>

                  <td
                    className={
                      customer.status === "Active"
                        ? "text-green-400"
                        : "text-red-400"
                    }
                  >
                    {customer.status}
                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </main>

    </div>
  );
}