import React from "react";

const Transaction = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-black via-gray-900 to-black py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-violet-600/20 border border-violet-500/30 text-violet-300 text-sm font-medium mb-8">
            💳 Flexible Pricing Plans
          </div>
          
          {/* Main Headline */}
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight tracking-tight">
            Choose the perfect plan
            <br />
            <span className="bg-gradient-to-r from-violet-400 to-purple-600 bg-clip-text text-transparent">
              for your needs
            </span>
          </h1>
          
          {/* Subtitle */}
          <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            Ocean AI builds a sustainable revenue stream through flexible subscription packages designed to meet the needs of individuals, teams, and enterprises.
          </p>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-black via-gray-900 to-black">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            {/* Plus Package */}
            <div className="relative group flex">
              <div className="flex-1 p-8 bg-black border border-gray-800 rounded-2xl hover:border-violet-500/50 hover:shadow-xl hover:shadow-violet-500/10 transition-all duration-300 flex flex-col">
                {/* Icon */}
                <div className="w-12 h-12 bg-violet-600/20 border border-violet-500/30 rounded-xl flex items-center justify-center mb-6 group-hover:bg-violet-600/30 transition-colors">
                  <span className="text-2xl">⭐</span>
                </div>
                
                {/* Plan Name */}
                <h3 className="text-2xl font-bold text-white mb-2">Plus</h3>
                
                {/* Description */}
                <p className="text-gray-400 mb-6">
                  Ideal for individual users seeking essential services with flexibility and affordability.
                </p>
                
                {/* Price */}
                <div className="mb-8">
                  <div className="flex items-baseline">
                    <span className="text-4xl font-bold text-white">$5</span>
                    <span className="text-gray-400 ml-1">/month</span>
                  </div>
                </div>
                
                {/* Features */}
                <ul className="space-y-3 mb-8 flex-grow">
                  <li className="flex items-center text-gray-300">
                    <svg className="w-5 h-5 text-violet-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Basic meeting reports
                  </li>
                  <li className="flex items-center text-gray-300">
                    <svg className="w-5 h-5 text-violet-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Up to 10 meetings/month
                  </li>
                  <li className="flex items-center text-gray-300">
                    <svg className="w-5 h-5 text-violet-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Email support
                  </li>
                </ul>
                
                {/* CTA Button */}
                <button className="w-full py-3 px-6 bg-violet-600 text-white hover:bg-violet-700 font-semibold rounded-lg transition-all duration-200 mt-auto">
                  Choose Plus
                </button>
              </div>
            </div>

            {/* Pro Package - Featured */}
            <div className="relative group flex">
              {/* Popular Badge */}
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                <span className="px-4 py-2 bg-violet-600 text-white text-sm font-medium rounded-full">
                  Most Popular
                </span>
              </div>
              
              <div className="flex-1 p-8 bg-black border-2 border-violet-500 rounded-2xl hover:border-violet-400 hover:shadow-xl hover:shadow-violet-500/20 transition-all duration-300 flex flex-col">
                {/* Icon */}
                <div className="w-12 h-12 bg-violet-600/30 border border-violet-500/50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-violet-600/40 transition-colors">
                  <span className="text-2xl">🚀</span>
                </div>
                
                {/* Plan Name */}
                <h3 className="text-2xl font-bold text-white mb-2">Pro</h3>
                
                {/* Description */}
                <p className="text-gray-400 mb-6">
                  Best suited for professionals looking for advanced tools and enhanced capabilities.
                </p>
                
                {/* Price */}
                <div className="mb-8">
                  <div className="flex items-baseline">
                    <span className="text-4xl font-bold text-white">$19</span>
                    <span className="text-gray-400 ml-1">/month</span>
                  </div>
                </div>
                
                {/* Features */}
                <ul className="space-y-3 mb-8 flex-grow">
                  <li className="flex items-center text-gray-300">
                    <svg className="w-5 h-5 text-violet-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Advanced AI reports
                  </li>
                  <li className="flex items-center text-gray-300">
                    <svg className="w-5 h-5 text-violet-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Unlimited meetings
                  </li>
                  <li className="flex items-center text-gray-300">
                    <svg className="w-5 h-5 text-violet-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Sentiment analysis
                  </li>
                  <li className="flex items-center text-gray-300">
                    <svg className="w-5 h-5 text-violet-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Priority support
                  </li>
                </ul>
                
                {/* CTA Button */}
                <button className="w-full py-3 px-6 bg-violet-600 hover:bg-violet-700 text-white font-semibold rounded-lg transition-all duration-200 mt-auto">
                  Choose Pro
                </button>
              </div>
            </div>

            {/* Business Package */}
            <div className="relative group flex">
              <div className="flex-1 p-8 bg-black border border-gray-800 rounded-2xl hover:border-violet-500/50 hover:shadow-xl transition-all duration-300 flex flex-col">
                {/* Icon */}
                <div className="w-12 h-12 bg-violet-600/20 rounded-xl flex items-center justify-center mb-6 group-hover:bg-violet-600/30 transition-colors">
                  <span className="text-2xl">🏢</span>
                </div>
                
                {/* Plan Name */}
                <h3 className="text-2xl font-bold text-white mb-2">Business</h3>
                
                {/* Description */}
                <p className="text-gray-400 mb-6">
                  Tailored for large organizations and enterprises seeking comprehensive solutions and premium support.
                </p>
                
                {/* Price */}
                <div className="mb-8">
                  <div className="flex items-baseline">
                    <span className="text-4xl font-bold text-white">$39.5</span>
                    <span className="text-gray-400 ml-1">/month</span>
                  </div>
                </div>
                
                {/* Features */}
                <ul className="space-y-3 mb-8 flex-grow">
                  <li className="flex items-center text-gray-300">
                    <svg className="w-5 h-5 text-violet-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Enterprise features
                  </li>
                  <li className="flex items-center text-gray-300">
                    <svg className="w-5 h-5 text-violet-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Team management
                  </li>
                  <li className="flex items-center text-gray-300">
                    <svg className="w-5 h-5 text-violet-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Custom integrations
                  </li>
                  <li className="flex items-center text-gray-300">
                    <svg className="w-5 h-5 text-violet-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    24/7 support
                  </li>
                </ul>
                
                {/* CTA Button */}
                <button className="w-full py-3 px-6 bg-violet-600 hover:bg-violet-700 text-white font-semibold rounded-lg transition-all duration-200 mt-auto">
                  Choose Business
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-black via-gray-900 to-black">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Frequently asked questions
          </h2>
          <p className="text-gray-400 mb-12">
            Everything you need to know about Ocean AI pricing
          </p>
          
          <div className="text-left space-y-6">
            <div className="bg-gray-900 border border-gray-800 p-6 rounded-lg">
              <h3 className="font-semibold text-white mb-2">Can I change my plan anytime?</h3>
              <p className="text-gray-400">Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.</p>
            </div>
            
            <div className="bg-gray-900 border border-gray-800 p-6 rounded-lg">
              <h3 className="font-semibold text-white mb-2">Is there a free trial?</h3>
              <p className="text-gray-400">Yes, we offer a 14-day free trial for all plans. No credit card required to get started.</p>
            </div>
            
            <div className="bg-gray-900 border border-gray-800 p-6 rounded-lg">
              <h3 className="font-semibold text-white mb-2">What payment methods do you accept?</h3>
              <p className="text-gray-400">We accept all major credit cards, PayPal, and bank transfers for enterprise customers.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Transaction;
