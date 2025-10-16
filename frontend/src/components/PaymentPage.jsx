import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const PaymentPage = () => {
  const [paymentMethod, setPaymentMethod] = useState('card')
  const [formData, setFormData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
    saveCard: false
  })

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Payment submitted:', formData)
  }

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 mb-4">
            <span className="material-symbols-outlined">arrow_back</span>
            Back to Home
          </Link>
          <h1 className="text-3xl font-bold text-[#111618] dark:text-white">Complete Your Payment</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Secure payment for your medical appointment</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Payment Form */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-[#111618] dark:text-white mb-6">Payment Information</h2>
            
            {/* Payment Method Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Payment Method
              </label>
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-3 border rounded-lg text-center transition-colors ${
                    paymentMethod === 'card'
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <span className="material-symbols-outlined block mb-1">credit_card</span>
                  <span className="text-xs">Card</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('paypal')}
                  className={`p-3 border rounded-lg text-center transition-colors ${
                    paymentMethod === 'paypal'
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <span className="material-symbols-outlined block mb-1">account_balance_wallet</span>
                  <span className="text-xs">PayPal</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('insurance')}
                  className={`p-3 border rounded-lg text-center transition-colors ${
                    paymentMethod === 'insurance'
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <span className="material-symbols-outlined block mb-1">health_and_safety</span>
                  <span className="text-xs">Insurance</span>
                </button>
              </div>
            </div>

            {/* Card Payment Form */}
            {paymentMethod === 'card' && (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="cardholderName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Cardholder Name
                  </label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">person</span>
                    <input
                      type="text"
                      id="cardholderName"
                      name="cardholderName"
                      value={formData.cardholderName}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      placeholder="John Doe"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Card Number
                  </label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">credit_card</span>
                    <input
                      type="text"
                      id="cardNumber"
                      name="cardNumber"
                      value={formData.cardNumber}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      placeholder="1234 5678 9012 3456"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Expiry Date
                    </label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">calendar_today</span>
                      <input
                        type="text"
                        id="expiryDate"
                        name="expiryDate"
                        value={formData.expiryDate}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        placeholder="MM/YY"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      CVV
                    </label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">lock</span>
                      <input
                        type="password"
                        id="cvv"
                        name="cvv"
                        value={formData.cvv}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        placeholder="***"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="saveCard"
                      name="saveCard"
                      type="checkbox"
                      checked={formData.saveCard}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="saveCard" className="font-medium text-gray-700 dark:text-gray-300">
                      Save this card for future payments
                    </label>
                  </div>
                </div>
              </form>
            )}

            {/* PayPal Payment */}
            {paymentMethod === 'paypal' && (
              <div className="text-center py-8">
                <span className="material-symbols-outlined text-6xl text-blue-500 mb-4 block">account_balance_wallet</span>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">PayPal Payment</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">You will be redirected to PayPal to complete your payment</p>
                <button className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors">
                  Continue with PayPal
                </button>
              </div>
            )}

            {/* Insurance Payment */}
            {paymentMethod === 'insurance' && (
              <div className="text-center py-8">
                <span className="material-symbols-outlined text-6xl text-green-500 mb-4 block">health_and_safety</span>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Insurance Coverage</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">Your insurance will be billed directly</p>
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                  <p className="text-green-800 dark:text-green-200 text-sm">
                    <strong>Coverage:</strong> 80% covered by your insurance plan
                  </p>
                  <p className="text-green-800 dark:text-green-200 text-sm mt-1">
                    <strong>Your responsibility:</strong> $33.00
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center justify-center size-10 rounded-full bg-primary text-white">
                <span className="material-symbols-outlined">receipt_long</span>
              </div>
              <h2 className="text-2xl font-semibold text-[#343a40] dark:text-white">Summary</h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-cover bg-center" style={{backgroundImage: 'url("https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80")'}}></div>
                <div>
                  <h3 className="font-semibold text-[#343a40] dark:text-white">Dr. Emily Carter</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Cardiologist</p>
                </div>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-600 dark:text-gray-300">Date:</p>
                  <p className="font-semibold text-[#343a40] dark:text-white">June 15, 2024</p>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <p className="text-sm text-gray-600 dark:text-gray-300">Time:</p>
                  <p className="font-semibold text-[#343a40] dark:text-white">10:30 AM</p>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <p className="text-sm text-gray-600 dark:text-gray-300">Department:</p>
                  <p className="font-semibold text-[#343a40] dark:text-white">Cardiology</p>
                </div>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <div className="flex justify-between items-center text-sm">
                  <p className="text-gray-600 dark:text-gray-300">Consultation Fee:</p>
                  <p className="font-medium text-[#343a40] dark:text-white">$150</p>
                </div>
                <div className="flex justify-between items-center mt-2 text-sm">
                  <p className="text-gray-600 dark:text-gray-300">Booking Fee:</p>
                  <p className="font-medium text-[#343a40] dark:text-white">$5</p>
                </div>
                <div className="flex justify-between items-center mt-2 text-sm">
                  <p className="text-gray-600 dark:text-gray-300">Tax:</p>
                  <p className="font-medium text-[#343a40] dark:text-white">$10</p>
                </div>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <div className="flex justify-between items-center font-bold text-lg">
                  <p className="text-[#343a40] dark:text-white">Total:</p>
                  <p className="text-primary">$165</p>
                </div>
              </div>

              <button 
                onClick={handleSubmit}
                className="w-full flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-4 bg-primary text-white text-base font-medium hover:bg-primary/90 transition-colors mt-6"
              >
                <span className="material-symbols-outlined mr-2">lock</span>
                <span className="truncate">Pay Securely</span>
              </button>

              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
                Your payment is secured with SSL encryption.
              </p>
            </div>
          </div>
        </div>

        {/* Security Notice */}
        <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <span className="material-symbols-outlined text-blue-500 dark:text-blue-400 mt-0.5">security</span>
            <div>
              <h3 className="font-semibold text-blue-900 dark:text-blue-100">Secure Payment</h3>
              <p className="text-sm text-blue-800 dark:text-blue-200 mt-1">
                Your payment information is encrypted and secure. We never store your credit card details on our servers.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PaymentPage
