// src/pages/homepage/miscTexts.js
import React, { useState, useEffect } from 'react';
import Layout from '@/Components/Layout/Layout'; // Importez le Layout
import Link from 'next/link'; // Importez Link

// --- Styles ---
const containerStyle = { padding: '20px', fontFamily: 'Arial, sans-serif' };
const formStyle = { maxWidth: '800px', margin: '20px auto', padding: '30px', border: '1px solid #ccc', borderRadius: '8px', backgroundColor: '#f9f9f9', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' };
const labelStyle = { display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#555', fontSize: '1em' };
const textareaStyle = { width: '100%', padding: '12px', marginBottom: '20px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box', minHeight: '120px', resize: 'vertical', fontSize: '1em' };
const buttonStyle = { padding: '12px 25px', backgroundColor: '#57a481', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '1.1em', fontWeight: 'bold', transition: 'background-color 0.2s' };
const disabledButtonStyle = { ...buttonStyle, backgroundColor: '#ccc', cursor: 'not-allowed' };
const loadingStyle = { textAlign: 'center', padding: '30px', fontSize: '1.2em', color: '#555' };
const backButtonStyle = {
  display: 'inline-block',
  marginBottom: '20px',
  padding: '8px 15px',
  backgroundColor: '#f0f0f0',
  color: '#333',
  border: '1px solid #ccc',
  borderRadius: '5px',
  textDecoration: 'none',
  fontSize: '0.95em',
  cursor: 'pointer',
};
// --- Fin Styles ---

export default function MiscTextsAdmin() {
  // State
  const [texts, setTexts] = useState({
    paragraph1: '', // Texte central "We are committed..."
    // Ajoutez d'autres clés pour d'autres textes isolés
  });
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

   // Chargement initial
   useEffect(() => {
    console.log("Chargement initial des textes divers...");
    // --- Simulation Chargement API ---
    setTimeout(() => {
        setTexts({
            paragraph1: 'We are committed to providing you with a seamless and enjoyable shopping experience.', // Valeur exemple
        });
        setInitialLoading(false);
         console.log("Textes divers chargés (simulation).");
    }, 600);
    // --- Fin Simulation ---
    /*
    setInitialLoading(true);
    getHomepageMiscTexts() // Votre fonction API
      .then(data => {
        setTexts({
          paragraph1: data?.paragraph1 || '',
          // ... autres textes ...
        });
      })
      .catch(err => alert("Erreur chargement: " + err.message))
      .finally(() => setInitialLoading(false));
      */
  }, []);

  // Gestion des changements
  const handleChange = (e) => {
    const { name, value } = e.target;
    setTexts(prev => ({ ...prev, [name]: value }));
  };

  // Gestion de la soumission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    console.log("Sauvegarde des textes divers (simulation) :", texts);
     // --- Simulation Sauvegarde API ---
    setTimeout(() => {
        setLoading(false);
        alert('Textes divers sauvegardés (simulation) !');
    }, 1100);
    // --- Fin Simulation ---
    /*
    try {
      await updateHomepageMiscTexts(texts); // Votre fonction API
      alert('Textes mis à jour !');
    } catch (err) {
      alert('Erreur sauvegarde: ' + err.message);
    } finally {
      setLoading(false);
    }
    */
  };

   const pageContent = (
     <div style={containerStyle}>
       <h1>Modifier les Textes Divers de l'Accueil</h1>

       <Link href="/homepage" style={backButtonStyle}>
         &larr; Retour à la Gestion de l'Accueil
       </Link>

        {initialLoading ? (
        <p style={loadingStyle}>Chargement des données actuelles...</p>
      ) : (
        <form onSubmit={handleSubmit} style={formStyle}>
          <div>
            <label htmlFor="paragraph1" style={labelStyle}>Paragraphe Central (Après "Collection Femme") :</label>
            <textarea
              id="paragraph1"
              name="paragraph1"
              value={texts.paragraph1}
              onChange={handleChange}
              style={textareaStyle}
              maxLength={300}
              rows={5}
              required
            />
          </div>

          {/* Ajoutez d'autres champs <textarea> ou <input> ici si nécessaire */}

          <button
            type="submit"
            disabled={loading || initialLoading}
            style={loading || initialLoading ? disabledButtonStyle : buttonStyle}
          >
            {loading ? 'Sauvegarde en cours...' : 'Sauvegarder les Modifications'}
          </button>
        </form>
       )}
     </div>
   );

  // Envelopper avec le Layout
  return (
    <Layout title="Gestion Textes Divers" description="Modifier divers textes de l'accueil" dashboard={true}>
      {pageContent}
    </Layout>
  );
}