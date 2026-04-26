import React, { useState } from 'react';
import '../styles/faq.css';

const FAQPage = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const faqs = [
    {
      category: "Services & Offres",
      questions: [
        {
          q: "Quels types de projets pouvez-vous automatiser ?",
          a: "Nous automatisons tout type de processus métier : gestion documentaire, workflows internes, synchronisation de données, CRM, ERP, et plus. Chaque solution est personnalisée selon vos besoins spécifiques."
        },
        {
          q: "Proposez-vous une solution clé en main ou sur-mesure ?",
          a: "Les deux. Nous pouvons adapter une solution existante rapide et abordable, ou créer une application entièrement sur-mesure pour des besoins complexes. Nous évaluons votre cas lors de la qualification."
        },
        {
          q: "Quel est le délai de mise en place d'une automatisation ?",
          a: "Cela dépend de la complexité. Pour une automatisation standard : 2-4 semaines. Pour une application sur-mesure : 4-12 semaines. Nous optimisons chaque projet pour le time-to-value."
        },
        {
          q: "Livrez-vous une documentation ou une formation ?",
          a: "Oui. Chaque projet inclut une documentation technique et une session de formation pour vos équipes. Cela garantit une adoption réussie et une autonomie maximale."
        }
      ]
    },
    {
      category: "Capacités & Technologies",
      questions: [
        {
          q: "Utilisez-vous l'IA dans vos solutions ?",
          a: "Oui. L'IA est intégrée pour améliorer la classification, l'extraction de données, les recommandations et l'optimisation des processus. Nous l'utilisons de manière responsable et transparente."
        },
        {
          q: "Avec quels outils/systèmes pouvez-vous intégrer ?",
          a: "Nous intégrons avec la majorité des outils du marché : CRM (Salesforce, HubSpot), ERP (SAP, Odoo), bases de données (SQL, NoSQL), et services cloud (AWS, Google Cloud). Contactez-nous pour vérifier la compatibilité."
        },
        {
          q: "Quelle est l'infrastructure utilisée ?",
          a: "Nous hébergeons en France sur infrastructure sécurisée et conforme RGPD. Vos données restent en France, ce qui garantit la conformité légale et la souveraineté des données."
        },
        {
          q: "Pouvez-vous intégrer une solution existante ou commencer de zéro ?",
          a: "Les deux. Nous pouvons enrichir un système existant ou créer un nouvel écosystème. Nous analysons votre architecture actuelle et proposons la meilleure approche."
        }
      ]
    },
    {
      category: "Coûts & Tarification",
      questions: [
        {
          q: "Comment est facturée une automatisation ?",
          a: "Les tarifs dépendent de la complexité et du scope. Nous proposons généralement un devis forfaitaire pour définir le budget. Après la phase de qualification, un business case mesurable est fourni."
        },
        {
          q: "Existe-t-il des frais d'hébergement ou de maintenance ?",
          a: "Oui, un coût de maintenance/hébergement mensuel est généralement prévu après la livraison. Cela couvre les mises à jour, le support et la disponibilité du service. Nous alignons les coûts sur la valeur générée."
        },
        {
          q: "Quel est le ROI moyen d'une automatisation ?",
          a: "Selon nos cas clients, le ROI varie de 100% à 500% en 12 mois. Les gains portent sur le temps économisé (48h/mois en moyenne), la réduction d'erreurs et l'amélioration de la satisfaction client."
        },
        {
          q: "Proposez-vous des forfaits spécifiques pour les petites entreprises ?",
          a: "Oui. Nous avons des packages d'automatisation légers et des partenariats pour les TPE/PME. Contactez-nous pour discuter d'une offre adaptée à votre taille."
        }
      ]
    },
    {
      category: "Sécurité & Conformité",
      questions: [
        {
          q: "Êtes-vous conforme RGPD ?",
          a: "Oui, totalement. Toutes nos solutions respectent le RGPD : consentement explicite, droit d'accès, portabilité, suppression. Nos hébergements sont en France. Nous signons des contrats de traitement de données (DPA)."
        },
        {
          q: "Qui accède aux données traitées par vos solutions ?",
          a: "Uniquement vos utilisateurs autorisés et votre équipe. SynapFlows n'accède jamais à vos données métier sans autorisation explicite. Les données sont chiffrées en transit et au repos."
        },
        {
          q: "Pouvez-vous anonymiser ou supprimer les données ?",
          a: "Oui. Nous implémentons les droits RGPD : droit à l'oubli, portabilité, rectification. Vous contrôlez complètement la rétention et l'accès aux données."
        },
        {
          q: "Quel est le niveau de sécurité de vos applications ?",
          a: "Nous utilisons les standards de sécurité industrie : authentification forte, chiffrement TLS, pare-feu, monitoring. Des audits de sécurité réguliers sont effectués. Nous respectons les normes ISO 27001."
        }
      ]
    },
    {
      category: "Support & Relationnel",
      questions: [
        {
          q: "Quel support est inclus dans les projets ?",
          a: "Pendant le projet : disponibilité complète de l'équipe. Après la livraison : support technique inclus (tickets par mail ou via portail), plus des heures mensuelles de support proactif selon le contrat."
        },
        {
          q: "Comment puis-je être en contact avec vous ?",
          a: "Par le formulaire de qualification, par email (olivier@synapflows.fr), ou par téléphone (06 29 20 06 63). Nous répondons généralement sous 48h."
        },
        {
          q: "Pouvez-vous former mon équipe ?",
          a: "Oui, des sessions de formation sont proposées lors de la livraison et peuvent être renouvelées. Nous adaptons le contenu au niveau technique de votre équipe."
        },
        {
          q: "Que se passe-t-il après la livraison ?",
          a: "Un contrat de maintenance/support est mis en place. Vous bénéficiez des mises à jour, des correctifs, et d'un support technique réactif. Des revues périodiques assurent l'optimisation continue."
        }
      ]
    },
    {
      category: "Processus & Engagement",
      questions: [
        {
          q: "Comment débute un engagement avec SynapFlows ?",
          a: "1. Qualification : appel découverte et remplissage du formulaire. 2. Audit : analyse de votre situation actuelle. 3. Business case : présentation du ROI estimé. 4. Contrat & démarrage du projet."
        },
        {
          q: "Quels documents me seront fournis ?",
          a: "Cahier des charges validé, prototypes/wireframes, documentations techniques et utilisateur, vidéos de formation, rapports de tests, et plan de maintenance."
        },
        {
          q: "Puis-je tester la solution avant de valider le déploiement ?",
          a: "Absolument. Une phase de recette (tests) avec votre équipe est incluse. Vous validez le fonctionnement avant la mise en production."
        },
        {
          q: "Pouvez-vous travailler avec une équipe interne IT ?",
          a: "Oui. Nous collaborons avec vos équipes IT, intégrateurs et autres prestataires. La transparence et la documentation permettent une intégration fluide."
        }
      ]
    },
    {
      category: "Expérience & Références",
      questions: [
        {
          q: "Quelle est votre expérience ?",
          a: "SynapFlows est une jeune entreprise créée par Olivier Guimonneau, qui cumule plus de 30 ans d'expérience dans l'informatique, l'intégration et l'automatisation. Cette expertise consolidée nous permet de délivrer des solutions robustes et optimisées dès le départ."
        },
        {
          q: "Travaillez-vous avec des grandes entreprises ou des startups ?",
          a: "Les deux. Nous avons une expérience avec tous les types de structures : ETI, PME, startups, collectivités. Nos solutions s'adaptent à tout contexte."
        },
        {
          q: "Comment vous différenciez-vous des autres ESN ?",
          a: "SynapFlows se différencie par quatre éléments clés : notre vitesse de délivrance (délais 2-3x plus courts grâce à l'IA), notre transparence totale (prix clair, sans frais cachés), notre localisation en France (hébergement et équipe en France pour la conformité RGPD), et enfin notre écoute des enjeux métier réels plutôt qu'une approche générique."
        }
      ]
    }
  ];

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  let questionIndex = 0;

  return (
    <div className="faq-page">
      {/* Hero Section */}
      <section className="faq-hero">
        <div className="container">
          <h1>Foire Aux Questions</h1>
          <p>Trouvez les réponses à vos questions sur SynapFlows et nos services</p>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="faq-content">
        <div className="container">
          {faqs.map((category, categoryIndex) => (
            <div key={categoryIndex} className="faq-category">
              <h2 className="faq-category-title">{category.category}</h2>

              <div className="faq-questions">
                {category.questions.map((item, itemIndex) => {
                  const globalIndex = questionIndex++;
                  return (
                    <div key={itemIndex} className="faq-item">
                      <button
                        className={`faq-question ${
                          activeIndex === globalIndex ? 'active' : ''
                        }`}
                        onClick={() => toggleFAQ(globalIndex)}
                      >
                        <span className="faq-question-text">{item.q}</span>
                        <span className="faq-icon">
                          {activeIndex === globalIndex ? '−' : '+'}
                        </span>
                      </button>
                      {activeIndex === globalIndex && (
                        <div className="faq-answer">
                          <p>{item.a}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="faq-cta">
        <div className="container">
          <h2>Vous n'avez pas trouvé votre réponse ?</h2>
          <p>
            Contactez-nous directement pour une discussion personnalisée. Nous sommes là pour vous aider.
          </p>
          <a href="/formulaire-qualification" className="cta-button">
            Qualifier mon projet
          </a>
        </div>
      </section>
    </div>
  );
};

export default FAQPage;
