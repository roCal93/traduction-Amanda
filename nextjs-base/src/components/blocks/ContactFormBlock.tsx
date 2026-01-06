'use client'

import React, { useState } from 'react'

type ContactFormBlockProps = {
  title?: string
  description?: string
  submitButtonText?: string
  blockAlignment?: 'left' | 'center' | 'right' | 'full'
  maxWidth?: 'small' | 'medium' | 'large' | 'full'
}

export const ContactFormBlock = ({ 
  title = 'Contactez-nous',
  description,
  submitButtonText = 'Envoyer',
  blockAlignment = 'center',
  maxWidth = 'medium'
}: ContactFormBlockProps) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const blockAlignmentClasses = {
    left: 'mr-auto',
    center: 'mx-auto',
    right: 'ml-auto',
    full: 'w-full',
  }

  const maxWidthClasses = {
    small: 'max-w-2xl',
    medium: 'max-w-4xl',
    large: 'max-w-6xl',
    full: 'max-w-none',
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      // TODO: Implémenter l'envoi du formulaire (API route, service email, etc.)
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      console.log('Form submitted:', formData)
      setSubmitStatus('success')
      setFormData({ name: '', email: '', message: '' })
    } catch (error) {
      console.error('Error submitting form:', error)
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className={`w-full ${blockAlignmentClasses[blockAlignment]} ${maxWidthClasses[maxWidth]} py-12 px-4`}>
      <div className="bg-white rounded-lg shadow-md p-8">
        {title && (
          <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">
            {title}
          </h2>
        )}
        
        {description && (
          <p className="text-gray-600 mb-8 text-center">
            {description}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Champs Nom et Email côte à côte */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Champ Nom */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Nom <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="Votre nom"
              />
            </div>

            {/* Champ Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="votre@email.com"
              />
            </div>
          </div>

          {/* Champ Message */}
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
              Message <span className="text-red-500">*</span>
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              rows={5}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-vertical"
              placeholder="Votre message..."
            />
          </div>

          {/* Bouton d'envoi */}
          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 rounded-lg font-medium transition-colors inline-flex items-center justify-center gap-2 bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Envoi en cours...' : submitButtonText}
            </button>
          </div>

          {/* Messages de statut */}
          {submitStatus === 'success' && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-md">
              <p className="text-green-800 text-sm">
                ✓ Votre message a été envoyé avec succès !
              </p>
            </div>
          )}

          {submitStatus === 'error' && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-800 text-sm">
                ✗ Une erreur est survenue. Veuillez réessayer.
              </p>
            </div>
          )}
        </form>
      </div>
    </div>
  )
}
