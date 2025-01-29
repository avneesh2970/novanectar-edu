/* eslint-disable @typescript-eslint/no-explicit-any */
import type React from "react"
import { motion } from "framer-motion"

interface AnimatedInputProps {
  register: any
  type: string
  placeholder: string
  error: any
}

export const AnimatedInput: React.FC<AnimatedInputProps> = ({ register, type, placeholder, error }) => {
  const inputClasses = `w-full p-3 rounded-lg bg-white bg-opacity-50 border border-gray-300 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 text-gray-700`

  return (
    <motion.div
      initial={{ y: 10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -10, opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
        {type === "textarea" ? (
          <textarea {...register} placeholder={placeholder} rows={4} className={inputClasses} />
        ) : (
          <input {...register} type={type} placeholder={placeholder} className={inputClasses} />
        )}
      </motion.div>
      {error && (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-500 text-xs mt-1">
          {error.message}
        </motion.p>
      )}
    </motion.div>
  )
}

