import React, { useState, useEffect } from 'react';
import { useAuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const UserTransactions = () => {
  const { state } = useAuthContext();
  const user = state?.user;
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [purchaseLoading, setPurchaseLoading] = useState(false);

  // Debug log
  useEffect(() => {
    console.log('UserTransactions - User state:', user);
    console.log('UserTransactions - User role:', user?.role);
  }, [user]);

  // Redirect admin to admin panel
  useEffect(() => {
    if (user && user.role === 'admin') {
      navigate('/admin');
    }
  }, [user, navigate]);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/plans/my-plans', {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setTransactions(data);
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPlans = async () => {
    try {
      const response = await fetch('/api/plans');
      if (response.ok) {
        const data = await response.json();
        setPlans(data);
      }
    } catch (error) {
      console.error('Error fetching plans:', error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchTransactions();
      fetchPlans();
    }
  }, [user]);

  const handlePurchase = async (planName, price) => {
    try {
      setPurchaseLoading(true);
      const response = await fetch('/api/plans/purchase', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ planName, price }),
      });

      if (response.ok) {
        alert('Plan purchased successfully!');
        fetchTransactions(); // Refresh transactions
      } else {
        const error = await response.json();
        alert(`Error: ${error.message}`);
      }
    } catch (error) {
      console.error('Error purchasing plan:', error);
      alert('Failed to purchase plan. Please try again.');
    } finally {
      setPurchaseLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900 to-black py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-2">My Plans & Transactions</h1>
          <p className="text-gray-400">Manage your subscriptions and view purchase history</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Available Plans */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">Available Plans</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <div key={plan.name} className="bg-gray-900 border border-gray-800 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                  <span className="text-2xl font-bold text-violet-400">
                    {formatCurrency(plan.price)}
                  </span>
                </div>
                
                <ul className="space-y-2 mb-6">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-gray-300">
                      <svg className="w-4 h-4 text-violet-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                
                <button
                  onClick={() => handlePurchase(plan.name, plan.price)}
                  disabled={purchaseLoading || user?.role === 'admin'}
                  className={`w-full py-2 px-4 rounded-lg font-semibold transition-all duration-200 ${
                    user?.role === 'admin'
                      ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                      : 'bg-violet-600 hover:bg-violet-700 text-white'
                  }`}
                >
                  {user?.role === 'admin' 
                    ? 'Admin Account' 
                    : purchaseLoading 
                      ? 'Processing...' 
                      : 'Purchase Plan'
                  }
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Transaction History */}
        <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-800">
            <h2 className="text-lg font-semibold text-white">Purchase History</h2>
            <p className="text-sm text-gray-400">Your plan purchases and transactions</p>
          </div>
          
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Plan
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Purchase Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {transactions.map((transaction) => (
                    <tr key={transaction._id} className="hover:bg-gray-800/50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-3 py-1 text-sm font-semibold rounded-full bg-violet-600/20 text-violet-300">
                          {transaction.planName}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                        {formatCurrency(transaction.price)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                        {formatDate(transaction.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-600/20 text-green-300">
                          Completed
                        </span>
                      </td>
                    </tr>
                  ))}
                  {transactions.length === 0 && (
                    <tr>
                      <td colSpan="4" className="px-6 py-8 text-center">
                        <div className="text-center">
                          <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-2xl">📊</span>
                          </div>
                          <h3 className="text-lg font-medium text-white mb-2">No transactions yet</h3>
                          <p className="text-gray-400">Purchase your first plan to get started!</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Summary */}
        {transactions.length > 0 && (
          <div className="mt-8 bg-gray-900 border border-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-violet-400">
                  {transactions.length}
                </p>
                <p className="text-sm text-gray-400">Total Purchases</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-400">
                  {formatCurrency(transactions.reduce((total, t) => total + t.price, 0))}
                </p>
                <p className="text-sm text-gray-400">Total Spent</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-400">
                  {transactions[0]?.planName || 'None'}
                </p>
                <p className="text-sm text-gray-400">Latest Plan</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserTransactions;
