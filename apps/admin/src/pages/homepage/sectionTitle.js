// src/pages/homepage/sectionTitles.js
import React, { useState, useEffect } from 'react';
import Layout from '@/Components/Layout/Layout'; // Importez le Layout
import Link from 'next/link'; // Importez Link

// --- Styles ---
const containerStyle = { padding: '20px', fontFamily: 'Arial, sans-serif' };
const formStyle = { maxWidth: '800px', margin: '20px auto', padding: '30px', border: '1px solid #ccc', borderRadius: '8px', backgroundColor: '#f9f9f9', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' };
const labelStyle = { display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#555', fontSize: '1em' };
const inputStyle = { width: '100%', padding: '12px', marginBottom: '20px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box', fontSize: '1em' };
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

export default function SectionTitlesAdmin() {
  // State pour les titres
  const [titles, setTitles] = useState({
    newsArrivals: '',
    collection: '', // Titre de la section ModeCollection
    trendReport: '',
    recommendation: '',
  });
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  // Chargement initial
   useEffect(() => {
    console.log("Chargement initial des titres...");
    // --- Simulation Chargement API ---
    setTimeout(() => {
        setTitles({
            newsArrivals: 'News Arrivals',                     // Valeur exemple
            collection: "Women's Collection: elegance reinvented", // Valeur exemple
            trendReport: 'The Trend Report',                 // Valeur exemple
            recommendation: 'RECOMMENDED FOR YOU',             // Valeur exemple
        });
        setInitialLoading(false);
        console.log("Titres chargés (simulation).");
    }, 700);
    // --- Fin Simulation ---
    /*
    setInitialLoading(true);
     getHomepageTitles() // Votre fonction API
       .then(data => {
         setTitles({
           newsArrivals: data?.newsArrivals || '',
           collection: data?.collection || '',
           trendReport: data?.trendReport || '',
           recommendation: data?.recommendation || '',
         });
       })
       .catch(err => alert("Erreur chargement: " + err.message))
       .finally(() => setInitialLoading(false));
    */
  }, []);

  // Gestion des changements
  const handleChange = (e) => {
    const { name, value } = e.target;
    setTitles(prev => ({ ...prev, [name]: value }));
  };

  // Gestion de la soumission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    console.log("Sauvegarde des titres (simulation) :", titles);
     // --- Simulation Sauvegarde API ---
    setTimeout(() => {
        setLoading(false);
        alert('Titres sauvegardés (simulation) !');
    }, 1000);
    // --- Fin Simulation ---
    /*
    try {
      await updateHomepageTitles(titles); // Votre fonction API
      alert('Titres mis à jour !');
    } catch (err) {
      alert('Erreur sauvegarde: ' + err.message);
    } finally {
      setLoading(false);
    }
    */
  };

   const pageContent = (
     <div style={containerStyle}>
      <h1>Modifier les Titres des Sections de l'Accueil</h1>

      <Link href="/homepage" style={backButtonStyle}>
        &larr; Retour à la Gestion de l'Accueil
      </Link>

       {initialLoading ? (
        <p style={loadingStyle}>Chargement des données actuelles...</p>
      ) : (
        <form onSubmit={handleSubmit} style={formStyle}>
          <div>
            <label htmlFor="newsArrivals" style={labelStyle}>Titre "Nouveautés" (News Arrivals) :</label>
            <input
              type="text"
              id="newsArrivals"
              name="newsArrivals"
              value={titles.newsArrivals}
              onChange={handleChange}
              style={inputStyle}
              maxLength={100}
              required
            />
          </div>
           <div>
            <label htmlFor="collection" style={labelStyle}>Titre "Collection Femme" (Mode Collection) :</label>
            <input
              type="text"
              id="collection"
              name="collection"
              value={titles.collection}
              onChange={handleChange}
              style={inputStyle}
              maxLength={150}
              required
            />
          </div>
           <div>
            <label htmlFor="trendReport" style={labelStyle}>Titre "Trend Report" :</label>
            <input
              type="text"
              id="trendReport"
              name="trendReport"
              value={titles.trendReport}
              onChange={handleChange}
              style={inputStyle}
              maxLength={100}
              required
            />
          </div>
           <div>
            <label htmlFor="recommendation" style={labelStyle}>Titre "Recommandations" :</label>
            <input
              type="text"
              id="recommendation"
              name="recommendation"
              value={titles.recommendation}
              onChange={handleChange}
              style={inputStyle}
              maxLength={100}
              required
            />
          </div>

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
    <Layout title="Gestion Titres Sections" description="Modifier les titres des sections de l'accueil" dashboard={true}>
      {pageContent}
    </Layout>
  );
}