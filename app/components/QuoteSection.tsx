"use client"

import { useState, useEffect } from "react"

const quotes = [
  "The only way to do great work is to love what you do. - Steve Jobs",
  "Success is not final, failure is not fatal: it is the courage to continue that counts. - James Taylor",
  "Believe you can and you're halfway there. - Theodore Roosevelt",
  "The future belongs to those who believe in the beauty of their dreams. - Eleanor Roosevelt",
  "Don't watch the clock; do what it does. Keep going. - Sam Levenson",
  "The harder you work for something, the greater you'll feel when you achieve it. - Unknown",
  "Success is walking from failure to failure with no loss of enthusiasm. - Winston Churchill",
  "The only limit to our realization of tomorrow is our doubts of today. - Franklin D. Roosevelt",
]

export default function QuoteSection() {
  const [currentQuote, setCurrentQuote] = useState(quotes[0])

  useEffect(() => {
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * quotes.length)
      setCurrentQuote(quotes[randomIndex])
    }, 60000) // Change quote every minute

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="text-center">
      <p className="text-xl font-medium text-gray-700 italic">
        "{currentQuote}"
      </p>
    </div>
  )
} 