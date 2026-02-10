'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/Button'
import PrivacyPolicyModal from '@/components/shared/PrivacyPolicyModal'
import { StrapiEntity, PrivacyPolicy } from '@/types/strapi'

type ContactFormBlockProps = {
  title?: string
  description?: string
  submitButtonText?: string
  namePlaceholder?: string
  emailPlaceholder?: string
  messagePlaceholder?: string
  nameLabel?: string
  emailLabel?: string
  messageLabel?: string
  consentText?: string
  policyLinkText?: string
  successMessage?: string
  errorMessage?: string
  submittingText?: string
  rgpdInfoText?: string
  consentRequiredText?: string
  blockAlignment?: 'left' | 'center' | 'right' | 'full'
  maxWidth?: 'small' | 'medium' | 'large' | 'full'
  // Relation vers Privacy Policy
  privacyPolicy?: PrivacyPolicy & StrapiEntity
}

const ContactFormBlock = ({
  title,
  description,
  submitButtonText,
  namePlaceholder,
  emailPlaceholder,
  messagePlaceholder,
  nameLabel,
  emailLabel,
  messageLabel,
  consentText,
  policyLinkText,
  successMessage,
  errorMessage,
  submittingText,
  rgpdInfoText,
  consentRequiredText,
  blockAlignment = 'center',
  maxWidth = 'medium',
  privacyPolicy,
}: ContactFormBlockProps) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    consent: false,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<
    'idle' | 'success' | 'error'
  >('idle')
  const [isPolicyModalOpen, setIsPolicyModalOpen] = useState(false)

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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Erreur lors de l'envoi")
      }

      console.log('Form submitted successfully:', data)
      setSubmitStatus('success')
      setFormData({ name: '', email: '', message: '', consent: false })
    } catch (error) {
      console.error('Error submitting form:', error)
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div
      className={`w-full ${blockAlignmentClasses[blockAlignment]} ${maxWidthClasses[maxWidth]} py-2 px-4`}
    >
      <div className="bg-transparent rounded-lg p-8">
        {title && (
          <h2 className="text-3xl font-semibold text-gray-900 mb-4 text-center">
            {title}
          </h2>
        )}

        {description && (
          <p className="text-gray-600 mb-8 text-center">{description}</p>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-12"
          aria-label={title || 'Contact form'}
        >
          {/* Champs Nom et Email côte à côte */}
          <div className="grid grid-cols-1 md:grid-cols-2 md:gap-32 gap-8">
            {/* Champ Nom */}
            <div>
              <label
                htmlFor="name"
                className="block text-lg font-medium text-gray-700 mb-2"
              >
                {nameLabel} *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                aria-required="true"
                aria-label={nameLabel || 'Name'}
                className="w-full px-4 py-2 bg-[#FFFACD]/80 rounded-md focus:ring-2 focus:ring-[#F88379] focus:border-transparent transition-colors"
                placeholder={namePlaceholder}
              />
            </div>

            {/* Champ Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-lg font-medium text-gray-700 mb-2"
              >
                {emailLabel} *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                aria-required="true"
                aria-label={emailLabel || 'Email'}
                className="w-full px-4 py-2 bg-[#FFFACD]/80 rounded-md focus:ring-2 focus:ring-[#F88379] focus:border-transparent transition-colors"
                placeholder={emailPlaceholder}
              />
            </div>
          </div>

          {/* Champ Message */}
          <div>
            <label
              htmlFor="message"
              className="block text-lg font-medium md:text-center text-gray-700 mb-2"
            >
              {messageLabel} *
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              aria-required="true"
              aria-label={messageLabel || 'Message'}
              rows={5}
              className="w-full px-4 py-2 bg-[#FFFACD]/80 rounded-md focus:ring-2 focus:ring-[#F88379] focus:border-transparent transition-colors resize-vertical"
              placeholder={messagePlaceholder}
            />
          </div>

          {/* Consentement RGPD */}
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="consent"
                name="consent"
                checked={formData.consent}
                onChange={handleChange}
                required
                aria-required="true"
                aria-describedby="consent-description"
                className="mt-1 w-4 h-4 text-[#F88379] bg-[#FFFACD]/80 border-gray-300 rounded focus:ring-[#F88379] focus:ring-2"
              />
              <label
                htmlFor="consent"
                id="consent-description"
                className="text-sm text-gray-700"
              >
                {consentText}{' '}
                <button
                  type="button"
                  onClick={() => setIsPolicyModalOpen(true)}
                  className="text-[#F88379] underline hover:text-[#e67369] focus:outline-none focus:ring-2 focus:ring-[#F88379] focus:ring-offset-1 rounded"
                >
                  {policyLinkText}
                </button>
                . *
              </label>
            </div>

            {rgpdInfoText && (
              <div className="bg-[#FFD8D8]/31 rounded-md p-4 text-xs text-gray-600 whitespace-pre-line">
                {rgpdInfoText}
              </div>
            )}
          </div>

          {/* Bouton d'envoi */}
          <div className="text-center">
            <Button
              type="submit"
              variant="primary"
              disabled={isSubmitting || !formData.consent}
              aria-disabled={isSubmitting || !formData.consent}
              aria-label={isSubmitting ? submittingText : submitButtonText}
              className="px-6 py-3 rounded-full disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[#F88379] focus:ring-offset-2"
            >
              {isSubmitting ? submittingText : submitButtonText}
            </Button>
            {!formData.consent && consentRequiredText && (
              <p className="text-xs text-gray-500 mt-4">
                {consentRequiredText}
              </p>
            )}
          </div>

          {/* Messages de statut */}
          {submitStatus === 'success' && (
            <div
              className="p-4 bg-green-50 border border-green-200 rounded-md"
              role="status"
              aria-live="polite"
            >
              <p className="text-green-800 text-sm">{successMessage}</p>
            </div>
          )}

          {submitStatus === 'error' && (
            <div
              className="p-4 bg-red-50 border border-red-200 rounded-md"
              role="alert"
              aria-live="assertive"
            >
              <p className="text-red-800 text-sm">{errorMessage}</p>
            </div>
          )}
        </form>
      </div>

      {/* Modal Politique de confidentialité */}
      <PrivacyPolicyModal
        isOpen={isPolicyModalOpen}
        onClose={() => setIsPolicyModalOpen(false)}
        title={privacyPolicy?.title}
        content={privacyPolicy?.content}
        closeButtonText={privacyPolicy?.closeButtonText}
      />
    </div>
  )
}

export default ContactFormBlock
