import React from "react";

const Transaction = () => {
  return (
    <div className="bg-gradient-to-br from-pink-100 via-purple-200 to-pink-300 min-h-screen flex flex-col">
      {/* Main Content */}
      <main className="flex-grow container mx-auto px-6 py-12 max-w-6xl">
        <h2 className="text-4xl font-extrabold mb-6 text-center bg-gradient-to-r from-orange-400 to-pink-500 bg-clip-text text-transparent select-none">
          Revenue from Subscription Packages
        </h2>

        <p className="text-center max-w-3xl mx-auto text-gray-700 text-lg mb-12">
          In addition to its core business activities, Ocean Nation builds a sustainable revenue stream through a paid subscription model.
          Three service packages — <span className="font-semibold text-pink-600">Plus</span>,{" "}
          <span className="font-semibold text-purple-700">Pro</span>, and{" "}
          <span className="font-semibold text-pink-700">Business</span> —
          are designed to meet the needs of different customer segments, ranging from individual users to large organizations and enterprises.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {/* Plus Package */}
          <section
            className="bg-white rounded-2xl p-8 shadow-lg flex flex-col items-center text-center transform transition duration-300 hover:-translate-y-2 hover:shadow-[0_10px_25px_rgba(238,9,121,0.4)] cursor-pointer"
            >
            <h3 className="text-2xl font-bold mb-2 text-orange-500 select-none">Plus</h3>
            <p className="text-gray-600 mb-4 max-w-xs">
              Ideal for individual users seeking essential services with flexibility and affordability.
            </p>
            <div className="text-3xl font-extrabold text-orange-500 select-none">$5</div>
            <div className="text-sm text-gray-500 mb-8 select-none">per month</div>
            <button className="mt-auto bg-gradient-to-r from-orange-400 to-pink-500 text-white font-semibold py-2 px-6 rounded-full hover:from-pink-500 hover:to-orange-400 transition">
              Choose Plus
            </button>
          </section>

          {/* Pro Package */}
          <section
          className="bg-white rounded-2xl p-8 shadow-lg flex flex-col items-center text-center transform transition duration-300 hover:-translate-y-2 hover:shadow-[0_10px_25px_rgba(238,9,121,0.4)] cursor-pointer"
            >
            <h3 className="text-2xl font-bold mb-2 text-purple-600 select-none">Pro</h3>
            <p className="text-gray-600 mb-4 max-w-xs">
              Best suited for professionals looking for advanced tools and enhanced capabilities.
            </p>
            <div className="text-3xl font-extrabold text-purple-600 select-none">$19</div>
            <div className="text-sm text-gray-500 mb-8 select-none">per month</div>
            <button className="mt-auto bg-gradient-to-r from-purple-500 to-pink-600 text-white font-semibold py-2 px-6 rounded-full hover:from-pink-600 hover:to-purple-500 transition">
              Choose Pro
            </button>
          </section>

          {/* Business Package */}
          <section
          className="bg-white rounded-2xl p-8 shadow-lg flex flex-col items-center text-center transform transition duration-300 hover:-translate-y-2 hover:shadow-[0_10px_25px_rgba(238,9,121,0.4)] cursor-pointer"
            >
            <h3 className="text-2xl font-bold mb-2 text-pink-700 select-none">Business</h3>
            <p className="text-gray-600 mb-4 max-w-xs">
              Tailored for large organizations and enterprises seeking comprehensive solutions and premium support.
            </p>
            <div className="text-3xl font-extrabold text-pink-700 select-none">$39.5</div>
            <div className="text-sm text-gray-500 mb-8 select-none">per month</div>
            <button className="mt-auto bg-gradient-to-r from-pink-700 to-purple-700 text-white font-semibold py-2 px-6 rounded-full hover:from-purple-700 hover:to-pink-700 transition">
              Choose Business
            </button>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-pink-500 via-purple-600 to-pink-700 text-white text-center py-4 select-none mt-auto">
        © 2025 Ocean AI. All rights reserved.
      </footer>
    </div>
  );
};

export default Transaction;
