# Champs du formulaire de contact et politique de confidentialité

## 📋 Contact Form Block - Champs à remplir dans Strapi

### **Titres et textes principaux**

1. **title** : `Contactez-nous`
2. **description** : _(optionnel)_ Description sous le titre

### **Labels des champs**

3. **nameLabel** : `Votre nom`
4. **emailLabel** : `Votre email`
5. **messageLabel** : `Votre message`

### **Placeholders des champs**

6. **namePlaceholder** : `Votre nom`
7. **emailPlaceholder** : `votre@email.com`
8. **messagePlaceholder** : `Votre message...`

### **Textes de consentement RGPD**

9. **consentText** : 
```
J'accepte que mes données personnelles soient traitées conformément à la
```

10. **policyLinkText** : `politique de confidentialité`

### **Information RGPD (encadré)**

11. **rgpdInfoText** :
```
Information RGPD : Les données collectées via ce formulaire sont utilisées uniquement pour répondre à votre demande. Elles sont conservées pendant 3 ans maximum et ne sont pas partagées avec des tiers.

Vous disposez d'un droit d'accès, de rectification, de suppression et d'opposition concernant vos données personnelles. Pour exercer ces droits, contactez-nous à l'adresse indiquée dans notre politique de confidentialité.
```

### **Messages de validation**

12. **consentRequiredText** : 
```
Veuillez accepter la politique de confidentialité pour envoyer le formulaire
```

13. **successMessage** : `✓ Votre message a été envoyé avec succès !`

14. **errorMessage** : `✗ Une erreur est survenue. Veuillez réessayer.`

15. **submittingText** : `Envoi en cours...`

### **Boutons**

16. **submitButtonText** : `Envoyer`

### **Relation (sélection)**

17. **privacyPolicy** : _(Sélectionner la politique de confidentialité)_

### **Paramètres techniques (non traduits)**

18. **blockAlignment** : `center` (options: left, center, right, full)
19. **maxWidth** : `medium` (options: small, medium, large, full)

---

## 📋 Privacy Policy - Politique de confidentialité

### **Champs traduits**

1. **title** : `Politique de confidentialité`

2. **content** (Rich Text - formatez avec ###) :
## Responsable du traitement
Les données personnelles collectées via ce formulaire de contact sont traitées par [NOM DE VOTRE ENTREPRISE], située à [ADRESSE], immatriculée sous le numéro [SIRET].

## Sous-traitants
Pour assurer le fonctionnement technique du formulaire de contact, nous faisons appel aux sous-traitants suivants :
- **Resend Inc.** - Service d'envoi d'emails transactionnels (basé aux États-Unis)
- Politique de confidentialité : https://resend.com/legal/privacy-policy

## Finalité du traitement
Les données collectées sont utilisées uniquement dans le but de répondre à votre demande de contact. Nous ne les utilisons pas à d'autres fins sans votre consentement explicite.

## Données collectées
Nous collectons les informations suivantes :
- Votre nom
- Votre adresse email
- Le contenu de votre message

## Base légale
Le traitement de vos données personnelles est basé sur votre consentement (article 6.1.a du RGPD), que vous nous accordez en cochant la case de consentement et en soumettant ce formulaire.

## Destinataires des données
Vos données personnelles sont destinées à notre équipe interne. Pour le traitement technique de votre demande, nous utilisons le service Resend (fournisseur d'envoi d'emails) comme sous-traitant au sens du RGPD.

Resend traite vos données uniquement sur instruction de notre part et conformément aux exigences de sécurité du RGPD. Un accord de traitement des données (DPA - Data Processing Agreement) est en place avec ce prestataire.

Vos données ne sont jamais vendues ou louées à des tiers, sauf obligation légale.

## Durée de conservation
Vos données sont conservées pendant une durée maximale de 3 ans à compter de notre dernier contact, puis elles sont supprimées de nos systèmes.

## Sécurité des données
Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour protéger vos données contre tout accès non autorisé, modification, divulgation ou destruction.

**Transferts internationaux :** Resend est basé aux États-Unis. Les données peuvent donc être transférées hors de l'Union Européenne. Ces transferts sont encadrés par des garanties appropriées conformément au RGPD, notamment via le Data Privacy Framework (DPF) EU-US et des clauses contractuelles types de la Commission Européenne.

## Vos droits
Conformément au RGPD, vous disposez des droits suivants :
- **Droit d'accès** : Vous pouvez demander une copie de vos données personnelles
- **Droit de rectification** : Vous pouvez demander la correction de données inexactes
- **Droit à l'effacement** : Vous pouvez demander la suppression de vos données
- **Droit d'opposition** : Vous pouvez vous opposer au traitement de vos données
- **Droit à la portabilité** : Vous pouvez récupérer vos données dans un format structuré
- **Droit de limitation** : Vous pouvez demander la limitation du traitement

## Exercer vos droits
Pour exercer l'un de ces droits, vous pouvez nous contacter à l'adresse suivante : [VOTRE EMAIL DE CONTACT] ou par courrier à [VOTRE ADRESSE].

Nous nous engageons à vous répondre dans un délai d'un mois suivant votre demande.

## Réclamation
Si vous estimez que vos droits ne sont pas respectés, vous avez le droit d'introduire une réclamation auprès de la Commission Nationale de l'Informatique et des Libertés (CNIL) : www.cnil.fr

## Modification de la politique
Nous nous réservons le droit de modifier cette politique de confidentialité à tout moment. Toute modification sera publiée sur cette page avec une date de mise à jour.
```

3. **closeButtonText** : `Fermer`

### **Champ technique (non traduit)**

4. **lastUpdated** : _(Date de mise à jour)_ - Choisir la date

---

## 📝 Résumé

### Contact Form Block
- **17 champs à traduire** par langue (français, anglais, espagnol, etc.)
- **2 paramètres techniques** (alignment, maxWidth)
- **1 relation** vers Privacy Policy

### Privacy Policy
- **3 champs à traduire** par langue (title, content, closeButtonText)
- **1 champ technique** (lastUpdated)

---

## ⚠️ À personnaliser

N'oubliez pas de remplacer :
- `[NOM DE VOTRE ENTREPRISE]`
- `[ADRESSE]`
- `[SIRET]`
- `[VOTRE EMAIL DE CONTACT]`
