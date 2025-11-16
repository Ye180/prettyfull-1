// src/pages/homepage/hero.js
import React, { useState, useEffect } from 'react';
import Layout from '@/Components/Layout/Layout'; // Importez votre layout principal
import Link from 'next/link'; // Importez le composant Link

// --- Styles (vous pouvez les déplacer dans un fichier CSS/module CSS si vous préférez) ---
const containerStyle = { padding: '20px', fontFamily: 'Arial, sans-serif' };
const formStyle = { maxWidth: '800px', margin: '20px auto', padding: '30px', border: '1px solid #ccc', borderRadius: '8px', backgroundColor: '#f9f9f9', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' };
const fieldsetStyle = { border: '1px solid #ddd', padding: '20px', marginBottom: '20px', borderRadius: '5px', backgroundColor: '#fff' };
const legendStyle = { fontWeight: 'bold', fontSize: '1.2em', marginBottom: '15px', color: '#333', padding: '0 10px', width: 'auto', borderBottom: '2px solid #57a481', display: 'inline-block' };
const labelStyle = { display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#555', fontSize: '1em' };
const inputStyle = { width: '100%', padding: '12px', marginBottom: '5px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box', fontSize: '1em' };
const textareaStyle = { ...inputStyle, minHeight: '100px', resize: 'vertical' };
const smallTextStyle = { fontSize: '0.9em', color: '#777', display: 'block', marginBottom: '20px', marginTop: '5px' };
const buttonStyle = { padding: '12px 25px', backgroundColor: '#57a481', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '1.1em', fontWeight: 'bold', transition: 'background-color 0.2s' };
const disabledButtonStyle = { ...buttonStyle, backgroundColor: '#ccc', cursor: 'not-allowed' };
const loadingStyle = { textAlign: 'center', padding: '30px', fontSize: '1.2em', color: '#555' };
// Style pour le bouton retour
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


export default function HeroAdmin() {
  // State pour les données du formulaire
  const [formData, setFormData] = useState({
    videoUrl: '',
    promoText: '',
    promoCode: '',
    title: '',
    subtitle: '',
    ctaText: '',
    ctaLink: '',
  });
  // State pour gérer l'état de chargement pendant la sauvegarde
  const [loading, setLoading] = useState(false);
  // State pour gérer le chargement initial des données
  const [initialLoading, setInitialLoading] = useState(true);

  // Effet pour charger les données initiales au montage du composant
  useEffect(() => {
    console.log("Chargement initial des données Héro...");
    // --- Simulation Chargement API (remplacez par votre appel API réel) ---
    setTimeout(() => {
       setFormData({
         videoUrl: '/video/video.mp4', // Valeur exemple
         promoText: 'GET $20 OFF ON $99+ ORDERS', // Valeur exemple
         promoCode: 'USE CODE: FREE20', // Valeur exemple
         title: 'Clothing designed to enhance every moment.', // Valeur exemple
         subtitle: 'Discover the elegance of timeless clothing, designed to elevate your style, boost your confidence, and reveal your uniqueness. Comfortable, versatile, and crafted to make every moment unforgettable.', // Valeur exemple
         ctaText: 'Shop Now', // Valeur exemple
         ctaLink: '/collections/new-arrivals', // Valeur exemple
       });
       setInitialLoading(false);
       console.log("Données Héro chargées (simulation).");
    }, 1000); // Simule 1 seconde de chargement
    // --- Fin Simulation ---

    /* --- VRAI CODE API (à décommenter) ---
    // ... (votre code API getHomepageHeroData) ...
    */
  }, []);

  // Gestionnaire pour mettre à jour le state lors de la modification des champs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  // Gestionnaire pour la soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault(); // Empêche le rechargement de la page
    setLoading(true); // Active l'indicateur de chargement
    console.log("Sauvegarde des données Héro (simulation) :", formData);

    // --- Simulation Sauvegarde API (remplacez par votre appel API réel) ---
    setTimeout(() => {
        setLoading(false); // Désactive l'indicateur de chargement
        alert('Données Héro sauvegardées (simulation) !'); // Message de succès (temporaire)
    }, 1500); // Simule 1.5 secondes de sauvegarde
    // --- Fin Simulation ---

    /* --- VRAI CODE API (à décommenter) ---
    // ... (votre code API updateHomepageHeroData) ...
    */
  };

  // Contenu JSX de la page
  const pageContent = (
    <div style={containerStyle}>
      <h1>Modifier la Section Héro</h1>

      {/* --- BOUTON RETOUR AJOUTÉ ICI --- */}
      <Link href="/homepage" style={backButtonStyle}>
        &larr; Retour à la Gestion de l'Accueil {/* &larr; est une flèche gauche */}
      </Link>
      {/* --- FIN BOUTON RETOUR --- */}

      {initialLoading ? (
        <p style={loadingStyle}>Chargement des données actuelles...</p>
      ) : (
        <form onSubmit={handleSubmit} style={formStyle}>

          {/* Section Vidéo */}
          <fieldset style={fieldsetStyle}>
            <legend style={legendStyle}>Vidéo Principale</legend>
            <div>
              <label htmlFor="videoUrl" style={labelStyle}>URL de la Vidéo :</label>
              <input
                type="url"
                id="videoUrl"
                name="videoUrl"
                value={formData.videoUrl}
                onChange={handleChange}
                style={inputStyle}
                placeholder="https://cdn.example.com/hero-video.mp4"
                required // Champ requis
              />
              <small style={smallTextStyle}>
                Entrez l'URL complète de la vidéo (MP4 recommandé). Elle doit être accessible publiquement (ex: hébergée sur un CDN, S3, etc.).
              </small>
            </div>
          </fieldset>

          {/* Section Bandeau Promo */}
          <fieldset style={fieldsetStyle}>
            <legend style={legendStyle}>Bandeau Promotionnel (en haut)</legend>
            <div>
              <label htmlFor="promoText" style={labelStyle}>Texte Principal (avant code) :</label>
              <input
                type="text"
                id="promoText"
                name="promoText"
                value={formData.promoText}
                onChange={handleChange}
                style={inputStyle}
                maxLength={100} // Limite de caractères
                placeholder="Ex: GET $20 OFF ON $99+ ORDERS"
              />
            </div>
            <div>
              <label htmlFor="promoCode" style={labelStyle}>Code Promo / Texte Secondaire :</label>
              <input
                type="text"
                id="promoCode"
                name="promoCode"
                value={formData.promoCode}
                onChange={handleChange}
                style={inputStyle}
                maxLength={50}
                placeholder="Ex: USE CODE: FREE20"
              />
            </div>
          </fieldset>

          {/* Section Contenu Textuel */}
          <fieldset style={fieldsetStyle}>
            <legend style={legendStyle}>Contenu Textuel Principal (superposé)</legend>
            <div>
              <label htmlFor="title" style={labelStyle}>Titre :</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                style={inputStyle}
                maxLength={150}
                required // Champ requis
              />
            </div>
            <div>
              <label htmlFor="subtitle" style={labelStyle}>Sous-titre :</label>
              <textarea
                id="subtitle"
                name="subtitle"
                value={formData.subtitle}
                onChange={handleChange}
                style={textareaStyle}
                maxLength={500} // Limite de caractères plus grande
                rows={4} // Hauteur indicative
              />
            </div>
          </fieldset>

          {/* Section Bouton CTA */}
          <fieldset style={fieldsetStyle}>
            <legend style={legendStyle}>Bouton d'Appel à l'Action (CTA)</legend>
            <div>
              <label htmlFor="ctaText" style={labelStyle}>Texte du Bouton :</label>
              <input
                type="text"
                id="ctaText"
                name="ctaText"
                value={formData.ctaText}
                onChange={handleChange}
                style={inputStyle}
                maxLength={30}
                required // Champ requis
              />
            </div>
            <div>
              <label htmlFor="ctaLink" style={labelStyle}>Lien du Bouton :</label>
              <input
                type="text" // Utiliser 'text' pour les chemins relatifs
                id="ctaLink"
                name="ctaLink"
                value={formData.ctaLink}
                onChange={handleChange}
                style={inputStyle}
                placeholder="/collections/nouvelle-collection OU https://example.com"
                required // Champ requis
              />
              <small style={smallTextStyle}>
                Utilisez un chemin relatif commençant par `/` (ex: `/promotions`) ou une URL complète commençant par `https://` ou `http://`.
              </small>
            </div>
          </fieldset>

          {/* Bouton de soumission */}
          <button
            type="submit"
            disabled={loading || initialLoading} // Désactivé pendant le chargement initial ou la sauvegarde
            style={loading || initialLoading ? disabledButtonStyle : buttonStyle} // Style différent si désactivé
          >
            {loading ? 'Sauvegarde en cours...' : 'Sauvegarder les Modifications'}
          </button>
        </form>
      )}
    </div>
  );

  // Enveloppe le contenu de la page avec le Layout principal de l'admin
  return (
     <Layout
       title="Gestion Section Héro" // Titre de la page dans l'onglet/header
       description="Modifier les éléments de la section Héro de la page d'accueil." // Meta description
       dashboard={true} // Indique que c'est une page du dashboard
     >
       {pageContent} {/* Affiche le contenu JSX défini ci-dessus */}
     </Layout>
  );
}