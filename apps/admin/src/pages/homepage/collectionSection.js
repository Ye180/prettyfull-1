// src/pages/homepage/collectionSection.js
import React, { useState, useEffect, useCallback } from 'react';
import Layout from '@/Components/Layout/Layout';
import Link from 'next/link';

// --- Styles (similaires à promoBanners.js) ---
const containerStyle = { padding: '20px', fontFamily: 'Arial, sans-serif' };
const formStyle = { maxWidth: '800px', margin: '20px auto', padding: '30px', border: '1px solid #ccc', borderRadius: '8px', backgroundColor: '#f9f9f9', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' };
const fieldsetStyle = { border: '1px solid #ddd', padding: '20px', marginBottom: '20px', borderRadius: '5px', backgroundColor: '#fff' };
const legendStyle = { fontWeight: 'bold', fontSize: '1.2em', marginBottom: '15px', color: '#333', padding: '0 10px', width: 'auto', borderBottom: '2px solid #57a481', display: 'inline-block' };
const labelStyle = { display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#555', fontSize: '1em' };
const inputStyle = { width: '100%', padding: '12px', marginBottom: '5px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box', fontSize: '1em' };
const fileInputStyle = { ...inputStyle, padding: '10px' };
const textareaStyle = { ...inputStyle, minHeight: '80px', resize: 'vertical' };
const smallTextStyle = { fontSize: '0.9em', color: '#777', display: 'block', marginBottom: '20px', marginTop: '5px' };
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
const previewContainerStyle = { marginTop: '15px', marginBottom: '15px' };
const previewImageStyle = { maxWidth: '200px', maxHeight: '150px', border: '1px solid #eee', borderRadius: '4px', objectFit: 'contain' };
const currentImageStyle = { ...previewImageStyle, opacity: 0.7 };
// --- Fin Styles ---

export default function CollectionSectionAdmin() {
 // State pour les données textuelles et l'URL de l'image actuelle
 const [formData, setFormData] = useState({
    mainImageUrl: '', // URL actuelle
    subtitle: '',
    ctaButtonText: '',
    dealText: '',
  });
  // State pour le fichier image sélectionné
  const [selectedImage, setSelectedImage] = useState(null);
  // State pour la prévisualisation de l'image sélectionnée
  const [preview, setPreview] = useState(null);

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  // Chargement initial
  useEffect(() => {
    console.log("Chargement initial des données Section Collection...");
    // --- Simulation Chargement API ---
    setTimeout(() => {
       setFormData({
         mainImageUrl: '/home/promotion.jpg', // Valeur exemple URL actuelle
         subtitle: 'Stay on trend with our new selection of modern styles, designed just for you.', // Valeur exemple
         ctaButtonText: 'Go for it', // Valeur exemple
         dealText: 'Deal of week', // Valeur exemple
       });
       setInitialLoading(false);
       console.log("Données Section Collection chargées (simulation).");
    }, 900);
    // --- Fin Simulation ---
    /*
    setInitialLoading(true);
    getHomepageCollectionData() // Votre fonction API
      .then(data => {
        setFormData({
            mainImageUrl: data?.mainImageUrl || '',
            subtitle: data?.subtitle || '',
            ctaButtonText: data?.ctaButtonText || '',
            dealText: data?.dealText || '',
        });
      })
      .catch(err => alert("Erreur chargement: " + err.message))
      .finally(() => setInitialLoading(false));
      */
  }, []);

  // Nettoyer l'URL de prévisualisation
   useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  // Gestion des changements de texte
  const handleTextChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }, []);

  // Gestion du changement de fichier image
  const handleFileChange = useCallback((e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(file);
      // Créer et afficher la prévisualisation
      const previewUrl = URL.createObjectURL(file);
      if (preview) URL.revokeObjectURL(preview); // Nettoyer l'ancienne prévisualisation
      setPreview(previewUrl);
    } else {
      setSelectedImage(null);
      if (preview) URL.revokeObjectURL(preview);
      setPreview(null);
    }
  }, [preview]); // Inclure preview dans les dépendances pour le nettoyage

  // Gestion de la soumission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const submissionData = new FormData();

    // Ajouter les champs texte au FormData
    submissionData.append('subtitle', formData.subtitle);
    submissionData.append('ctaButtonText', formData.ctaButtonText);
    submissionData.append('dealText', formData.dealText);
    // Important: Ne pas ajouter mainImageUrl ici si on upload une nouvelle image

    // Ajouter la nouvelle image si elle a été sélectionnée
    if (selectedImage) {
      submissionData.append('mainImageFile', selectedImage); // L'API doit reconnaître cette clé
      console.log("Sauvegarde avec nouvelle image (simulation)...");
    } else {
      // Si aucune nouvelle image, on pourrait vouloir juste sauvegarder les textes
      // Ou informer l'utilisateur qu'aucune image n'a été changée.
      // Dans cet exemple, on envoie quand même les textes.
      // Si l'API attend TOUJOURS une image, il faudra gérer ce cas.
      console.log("Sauvegarde des textes uniquement (simulation)...");
    }

    // --- Simulation Upload/Sauvegarde API ---
    // Envoyer `submissionData` à l'API.
    // L'API doit gérer soit juste les textes, soit les textes + l'upload de fichier.
    // Si une image est uploadée, l'API retourne la nouvelle URL.
    setTimeout(() => {
        if (selectedImage) {
            // Simuler la réception de la nouvelle URL
            const newImageUrl = `/uploads/new_collection_image_${Date.now()}.jpg`;
            setFormData(prev => ({ ...prev, mainImageUrl: newImageUrl })); // Mettre à jour l'URL affichée
            setSelectedImage(null); // Réinitialiser le fichier sélectionné
            setPreview(null); // Réinitialiser la prévisualisation
            alert('Image et textes sauvegardés (simulation) !');
        } else {
            alert('Textes sauvegardés (simulation) !');
        }
        setLoading(false);
    }, 2000); // Simule 2s
    // --- Fin Simulation ---

    /* --- VRAI CODE API (à décommenter et adapter) ---
    try {
      const response = await fetch('/api/homepage-collection', { // URL de votre endpoint
        method: 'POST', // ou 'PUT'
        body: submissionData,
      });

      if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`);

      const result = await response.json();

      // Si l'API retourne la nouvelle URL de l'image (en cas d'upload)
      if (result.newImageUrl) {
        setFormData(prev => ({ ...prev, mainImageUrl: result.newImageUrl }));
      }
      // Réinitialiser après succès
      setSelectedImage(null);
      setPreview(null);
      alert('Section Collection mise à jour avec succès !');

    } catch (err) {
      console.error("Erreur sauvegarde Section Collection:", err);
      alert('Erreur lors de la sauvegarde des modifications.');
    } finally {
      setLoading(false);
    }
    */
  };

   const pageContent = (
    <div style={containerStyle}>
      <h1>Modifier la Section "Collection Femme" (ModeCollection)</h1>

      <Link href="/homepage" style={backButtonStyle}>
        &larr; Retour à la Gestion de l'Accueil
      </Link>

       {initialLoading ? (
        <p style={loadingStyle}>Chargement des données actuelles...</p>
      ) : (
        <form onSubmit={handleSubmit} style={formStyle}>

          {/* Bloc Image Gauche */}
          <fieldset style={fieldsetStyle}>
             <legend style={legendStyle}>Bloc Principal (Gauche)</legend>
             {/* Upload Nouvelle Image */}
             <div>
               <label htmlFor="mainImageFile" style={labelStyle}>Nouvelle Image Principale :</label>
               <input
                 type="file"
                 id="mainImageFile"
                 name="mainImageFile" // Nom utilisé pour FormData
                 accept="image/jpeg, image/png, image/webp, image/gif"
                 onChange={handleFileChange}
                 style={fileInputStyle}
               />
               <div style={previewContainerStyle}>
                 {/* Afficher la prévisualisation OU l'image actuelle */}
                 {(preview || formData.mainImageUrl) && <p> {preview ? "Prévisualisation Nouvelle Image :" : "Image Actuelle :"} </p>}

                 {preview ? (
                     <img src={preview} alt="Prévisualisation" style={previewImageStyle} />
                 ) : formData.mainImageUrl ? (
                     <img src={formData.mainImageUrl} alt="Image actuelle" style={currentImageStyle} />
                 ) : (
                    <p style={{color: '#888'}}>Aucune image</p>
                 )}
               </div>
               <small style={smallTextStyle}>Choisissez une nouvelle image pour remplacer l'actuelle.</small>
             </div>

             {/* Texte sur l'image */}
             <div>
               <label htmlFor="dealText" style={labelStyle}>Texte Superposé sur l'Image :</label>
               <input
                 type="text"
                 id="dealText"
                 name="dealText"
                 value={formData.dealText}
                 onChange={handleTextChange} // Utilise le handler de texte
                 style={inputStyle}
                 maxLength={50}
               />
               <small style={smallTextStyle}>Exemple : "Deal of week". Apparaît en bas à gauche.</small>
             </div>
           </fieldset>

           {/* Bloc Texte Droite */}
           <fieldset style={fieldsetStyle}>
             <legend style={legendStyle}>Bloc Textuel (Droite)</legend>
             {/* Le titre est géré dans sectionTitles.js */}
             <div>
               <label htmlFor="subtitle" style={labelStyle}>Sous-titre :</label>
               <textarea
                 id="subtitle"
                 name="subtitle"
                 value={formData.subtitle}
                 onChange={handleTextChange} // Utilise le handler de texte
                 style={textareaStyle}
                 maxLength={300}
                 rows={3}
                 required
               />
             </div>
             <div>
               <label htmlFor="ctaButtonText" style={labelStyle}>Texte du Bouton CTA :</label>
               <input
                 type="text"
                 id="ctaButtonText"
                 name="ctaButtonText"
                 value={formData.ctaButtonText}
                 onChange={handleTextChange} // Utilise le handler de texte
                 style={inputStyle}
                 maxLength={30}
                 required
               />
             </div>
          </fieldset>

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
    <Layout title="Gestion Section Collection" description="Modifier la section collection de l'accueil" dashboard={true}>
      {pageContent}
    </Layout>
  );
}