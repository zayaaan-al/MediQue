import React from 'react'

const ConfirmModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = 'Confirm Action', 
  message = 'Are you sure you want to proceed?', 
  confirmText = 'Confirm', 
  cancelText = 'Cancel',
  type = 'info' // 'info', 'warning', 'danger', 'success'
}) => {
  if (!isOpen) return null

  const getTypeStyles = () => {
    switch (type) {
      case 'danger':
        return {
          icon: 'warning',
          iconColor: 'text-red-500',
          confirmButton: 'bg-red-500 hover:bg-red-600 text-white'
        }
      case 'warning':
        return {
          icon: 'warning',
          iconColor: 'text-yellow-500',
          confirmButton: 'bg-yellow-500 hover:bg-yellow-600 text-white'
        }
      case 'success':
        return {
          icon: 'check_circle',
          iconColor: 'text-green-500',
          confirmButton: 'bg-green-500 hover:bg-green-600 text-white'
        }
      case 'info':
      default:
        return {
          icon: 'info',
          iconColor: 'text-blue-500',
          confirmButton: 'bg-primary hover:bg-primary/90 text-white'
        }
    }
  }

  const styles = getTypeStyles()

  const handleConfirm = () => {
    onConfirm()
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-md transform transition-all duration-200 scale-100">
        <div className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className={`p-2 rounded-full bg-gray-100 dark:bg-gray-700 ${styles.iconColor}`}>
              <span className="material-symbols-outlined text-2xl">{styles.icon}</span>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
            </div>
          </div>
          
          <div className="mb-6">
            <p className="text-gray-600 dark:text-gray-400">{message}</p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
            >
              {cancelText}
            </button>
            <button
              onClick={handleConfirm}
              className={`flex-1 px-4 py-2 rounded-lg transition-colors font-medium ${styles.confirmButton}`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ConfirmModal
