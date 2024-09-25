'use client'
import 'react-toastify/dist/ReactToastify.min.css'
import { ToastContainer } from 'react-toastify'

export const ToastNotification = () => {
  return (
    <ToastContainer
      position="top-center"
      autoClose={2000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover={false}
      theme="colored"
    />
  )
}