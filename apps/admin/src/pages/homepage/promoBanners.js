// src/pages/homepage/promoBanners.js
import Layout from "@/Components/Layout/Layout";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

// --- Styles (Ajout de styles pour l'upload et la prévisualisation) ---
const containerStyle = { padding: "20px", fontFamily: "Arial, sans-serif" };
const formStyle = {
	maxWidth: "800px",
	margin: "20px auto",
	padding: "30px",
	border: "1px solid #ccc",
	borderRadius: "8px",
	backgroundColor: "#f9f9f9",
	boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
};
const fieldsetStyle = {
	border: "1px solid #ddd",
	padding: "20px",
	marginBottom: "20px",
	borderRadius: "5px",
	backgroundColor: "#fff",
};
const legendStyle = {
	fontWeight: "bold",
	fontSize: "1.2em",
	marginBottom: "15px",
	color: "#333",
	padding: "0 10px",
	width: "auto",
	borderBottom: "2px solid #57a481",
	display: "inline-block",
};
const labelStyle = {
	display: "block",
	marginBottom: "8px",
	fontWeight: "bold",
	color: "#555",
	fontSize: "1em",
};
const inputStyle = {
	width: "100%",
	padding: "12px",
	marginBottom: "5px",
	border: "1px solid #ccc",
	borderRadius: "4px",
	boxSizing: "border-box",
	fontSize: "1em",
};
const fileInputStyle = { ...inputStyle, padding: "10px" }; // Style ajusté pour l'input file
const smallTextStyle = {
	fontSize: "0.9em",
	color: "#777",
	display: "block",
	marginBottom: "20px",
	marginTop: "5px",
};
const buttonStyle = {
	padding: "12px 25px",
	backgroundColor: "#57a481",
	color: "white",
	border: "none",
	borderRadius: "4px",
	cursor: "pointer",
	fontSize: "1.1em",
	fontWeight: "bold",
	transition: "background-color 0.2s",
};
const disabledButtonStyle = {
	...buttonStyle,
	backgroundColor: "#ccc",
	cursor: "not-allowed",
};
const loadingStyle = {
	textAlign: "center",
	padding: "30px",
	fontSize: "1.2em",
	color: "#555",
};
const backButtonStyle = {
	display: "inline-block",
	marginBottom: "20px",
	padding: "8px 15px",
	backgroundColor: "#f0f0f0",
	color: "#333",
	border: "1px solid #ccc",
	borderRadius: "5px",
	textDecoration: "none",
	fontSize: "0.95em",
	cursor: "pointer",
};
const previewContainerStyle = { marginTop: "15px", marginBottom: "15px" };
const previewImageStyle = {
	maxWidth: "200px",
	maxHeight: "150px",
	border: "1px solid #eee",
	borderRadius: "4px",
	objectFit: "contain",
};
const currentImageStyle = { ...previewImageStyle, opacity: 0.7 }; // Pour distinguer l'image actuelle
// --- Fin Styles ---

export default function PromoBannersAdmin() {
	// State pour les URLs (qui viendront de l'API après upload)
	const [bannerUrls, setBannerUrls] = useState({
		banner1Mobile: "",
		banner1Desktop: "",
		banner2Mobile: "",
		banner2Desktop: "",
	});
	// State pour les fichiers sélectionnés par l'utilisateur
	const [selectedFiles, setSelectedFiles] = useState({
		banner1Mobile: null,
		banner1Desktop: null,
		banner2Mobile: null,
		banner2Desktop: null,
	});
	// State pour les prévisualisations des fichiers sélectionnés
	const [previews, setPreviews] = useState({
		banner1Mobile: null,
		banner1Desktop: null,
		banner2Mobile: null,
		banner2Desktop: null,
	});

	const [loading, setLoading] = useState(false);
	const [initialLoading, setInitialLoading] = useState(true);

	// Charger les URLs des images actuelles
	useEffect(() => {
		console.log("Chargement initial des URLs des bannières...");
		// --- Simulation Chargement API ---
		setTimeout(() => {
			setBannerUrls({
				banner1Mobile: "/home/promo-phone.jpg",
				banner1Desktop: "/home/promo-desktop-1.jpg",
				banner2Mobile: "/home/promo-phone.jpg",
				banner2Desktop: "/home/promo-desktop-1.jpg",
			});
			setInitialLoading(false);
			console.log("URLs chargées (simulation).");
		}, 800);
		// --- Fin Simulation ---
		/*
    setInitialLoading(true);
    getHomepageBanners() // Votre fonction API
      .then(data => {
        setBannerUrls({
          banner1Mobile: data?.banner1?.mobile || '',
          banner1Desktop: data?.banner1?.desktop || '',
          banner2Mobile: data?.banner2?.mobile || '',
          banner2Desktop: data?.banner2?.desktop || '',
        });
      })
      .catch(err => alert("Erreur chargement: " + err.message))
      .finally(() => setInitialLoading(false));
    */
	}, []);

	// Nettoyer les Object URLs quand le composant est démonté ou les fichiers changent
	useEffect(() => {
		// Révoque les object URLs pour éviter les fuites mémoire
		return () => {
			Object.values(previews).forEach((url) => {
				if (url) URL.revokeObjectURL(url);
			});
		};
	}, [previews]); // S'exécute quand `previews` change

	// Gestion des changements de fichier
	const handleFileChange = useCallback((e) => {
		const { name, files } = e.target;
		if (files && files[0]) {
			const file = files[0];
			setSelectedFiles((prev) => ({ ...prev, [name]: file }));

			// Créer une prévisualisation
			const previewUrl = URL.createObjectURL(file);
			// Révoquer l'ancienne URL si elle existe avant de mettre la nouvelle
			setPreviews((prev) => {
				if (prev[name]) {
					URL.revokeObjectURL(prev[name]);
				}
				return { ...prev, [name]: previewUrl };
			});
		} else {
			// Si l'utilisateur annule la sélection
			setSelectedFiles((prev) => ({ ...prev, [name]: null }));
			setPreviews((prev) => {
				if (prev[name]) {
					URL.revokeObjectURL(prev[name]);
				}
				return { ...prev, [name]: null };
			});
		}
	}, []);

	// Gestion de la soumission (à adapter pour l'upload réel)
	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);

		const formData = new FormData();
		let requiresUpload = false;

		// Ajouter les fichiers modifiés au FormData
		Object.entries(selectedFiles).forEach(([key, file]) => {
			if (file) {
				formData.append(key, file); // L'API devra reconnaître ces clés
				requiresUpload = true;
			}
		});

		// Si aucun fichier n'a été sélectionné, on n'a peut-être rien à faire ou juste sauvegarder des liens si on les modifiait aussi
		if (!requiresUpload) {
			alert("Aucune nouvelle image sélectionnée.");
			setLoading(false);
			return; // Ou continuer si d'autres champs (liens ?) doivent être sauvegardés
		}

		console.log(
			"Préparation de l'upload (simulation)... Fichiers dans FormData:",
			selectedFiles
		);

		// --- Simulation Upload API ---
		// Ici, vous enverriez `formData` à votre endpoint API.
		// L'API traiterait les fichiers, les sauvegarderait, et renverrait les nouvelles URLs.
		setTimeout(() => {
			// Simuler la réception des nouvelles URLs de l'API
			const newUrlsFromApi = {
				banner1Mobile: selectedFiles.banner1Mobile
					? `/uploads/new_banner1_mobile_${Date.now()}.jpg`
					: bannerUrls.banner1Mobile,
				banner1Desktop: selectedFiles.banner1Desktop
					? `/uploads/new_banner1_desktop_${Date.now()}.jpg`
					: bannerUrls.banner1Desktop,
				banner2Mobile: selectedFiles.banner2Mobile
					? `/uploads/new_banner2_mobile_${Date.now()}.jpg`
					: bannerUrls.banner2Mobile,
				banner2Desktop: selectedFiles.banner2Desktop
					? `/uploads/new_banner2_desktop_${Date.now()}.jpg`
					: bannerUrls.banner2Desktop,
			};
			setBannerUrls(newUrlsFromApi); // Mettre à jour les URLs affichées
			setSelectedFiles({
				/* Réinitialiser les fichiers sélectionnés */
			});
			setPreviews({
				/* Réinitialiser les prévisualisations */
			});
			setLoading(false);
			alert("Images uploadées et URLs mises à jour (simulation) !");
		}, 2500); // Simule 2.5s d'upload
		// --- Fin Simulation ---

		/* --- VRAI CODE API (à décommenter et adapter) ---
    try {
      // Adaptez l'URL et la méthode ('POST', 'PUT', etc.) selon votre API
      const response = await fetch('/api/homepage-banners', { // URL de votre endpoint d'upload
        method: 'POST', // ou 'PUT'
        body: formData,
        // Ne pas mettre 'Content-Type': 'multipart/form-data', fetch le fait automatiquement avec FormData
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const result = await response.json(); // L'API doit retourner les nouvelles URLs

      setBannerUrls(result.newUrls); // Mettre à jour avec les URLs reçues
      setSelectedFiles({}); // Réinitialiser
      setPreviews({}); // Réinitialiser
      alert('Images mises à jour avec succès !');

    } catch (err) {
      console.error("Erreur lors de l'upload:", err);
      alert('Erreur lors de la sauvegarde des images.');
    } finally {
      setLoading(false);
    }
    */
	};

	const pageContent = (
		<div style={containerStyle}>
			<h1>Modifier les Bannières Promotionnelles</h1>

			<Link href="/homepage" style={backButtonStyle}>
				&larr; Retour à la Gestion de l'Accueil
			</Link>

			{initialLoading ? (
				<p style={loadingStyle}>Chargement des données actuelles...</p>
			) : (
				<form onSubmit={handleSubmit} style={formStyle}>
					{/* Bannière 1 */}
					<fieldset style={fieldsetStyle}>
						<legend style={legendStyle}>Bannière 1 (Après "Nouveautés")</legend>
						{/* Input pour l'image Mobile */}
						<div>
							<label htmlFor="banner1MobileFile" style={labelStyle}>
								Nouvelle Image (Mobile) :
							</label>
							<input
								type="file"
								id="banner1MobileFile"
								name="banner1Mobile" // Important: doit correspondre à la clé dans selectedFiles/previews
								accept="image/jpeg, image/png, image/webp, image/gif" // Spécifier les types acceptés
								onChange={handleFileChange}
								style={fileInputStyle}
							/>
							<div style={previewContainerStyle}>
								{previews.banner1Mobile && (
									<div>
										<p>Prévisualisation :</p>
										<img
											src={previews.banner1Mobile}
											alt="Prévisualisation mobile bannière 1"
											style={previewImageStyle}
										/>
									</div>
								)}
								{!previews.banner1Mobile && bannerUrls.banner1Mobile && (
									<div>
										<p>Image Actuelle :</p>
										<img
											src={bannerUrls.banner1Mobile}
											alt="Actuelle mobile bannière 1"
											style={currentImageStyle}
										/>
									</div>
								)}
							</div>
							<small style={smallTextStyle}>
								Choisissez une nouvelle image pour la version mobile.
							</small>
						</div>

						{/* Input pour l'image Desktop */}
						<div>
							<label htmlFor="banner1DesktopFile" style={labelStyle}>
								Nouvelle Image (Desktop) :
							</label>
							<input
								type="file"
								id="banner1DesktopFile"
								name="banner1Desktop"
								accept="image/jpeg, image/png, image/webp, image/gif"
								onChange={handleFileChange}
								style={fileInputStyle}
							/>
							<div style={previewContainerStyle}>
								{previews.banner1Desktop && (
									<div>
										<p>Prévisualisation :</p>
										<img
											src={previews.banner1Desktop}
											alt="Prévisualisation desktop bannière 1"
											style={previewImageStyle}
										/>
									</div>
								)}
								{!previews.banner1Desktop && bannerUrls.banner1Desktop && (
									<div>
										<p>Image Actuelle :</p>
										<img
											src={bannerUrls.banner1Desktop}
											alt="Actuelle desktop bannière 1"
											style={currentImageStyle}
										/>
									</div>
								)}
							</div>
							<small style={smallTextStyle}>
								Choisissez une nouvelle image pour la version desktop.
							</small>
						</div>
					</fieldset>

					{/* Bannière 2 */}
					<fieldset style={fieldsetStyle}>
						<legend style={legendStyle}>
							Bannière 2 (Après "Trend Report")
						</legend>
						{/* Input pour l'image Mobile */}
						<div>
							<label htmlFor="banner2MobileFile" style={labelStyle}>
								Nouvelle Image (Mobile) :
							</label>
							<input
								type="file"
								id="banner2MobileFile"
								name="banner2Mobile"
								accept="image/jpeg, image/png, image/webp, image/gif"
								onChange={handleFileChange}
								style={fileInputStyle}
							/>
							<div style={previewContainerStyle}>
								{previews.banner2Mobile && (
									<div>
										<p>Prévisualisation :</p>
										<img
											src={previews.banner2Mobile}
											alt="Prévisualisation mobile bannière 2"
											style={previewImageStyle}
										/>
									</div>
								)}
								{!previews.banner2Mobile && bannerUrls.banner2Mobile && (
									<div>
										<p>Image Actuelle :</p>
										<img
											src={bannerUrls.banner2Mobile}
											alt="Actuelle mobile bannière 2"
											style={currentImageStyle}
										/>
									</div>
								)}
							</div>
							<small style={smallTextStyle}>
								Choisissez une nouvelle image pour la version mobile.
							</small>
						</div>
						{/* Input pour l'image Desktop */}
						<div>
							<label htmlFor="banner2DesktopFile" style={labelStyle}>
								Nouvelle Image (Desktop) :
							</label>
							<input
								type="file"
								id="banner2DesktopFile"
								name="banner2Desktop"
								accept="image/jpeg, image/png, image/webp, image/gif"
								onChange={handleFileChange}
								style={fileInputStyle}
							/>
							<div style={previewContainerStyle}>
								{previews.banner2Desktop && (
									<div>
										<p>Prévisualisation :</p>
										<img
											src={previews.banner2Desktop}
											alt="Prévisualisation desktop bannière 2"
											style={previewImageStyle}
										/>
									</div>
								)}
								{!previews.banner2Desktop && bannerUrls.banner2Desktop && (
									<div>
										<p>Image Actuelle :</p>
										<img
											src={bannerUrls.banner2Desktop}
											alt="Actuelle desktop bannière 2"
											style={currentImageStyle}
										/>
									</div>
								)}
							</div>
							<small style={smallTextStyle}>
								Choisissez une nouvelle image pour la version desktop.
							</small>
						</div>
					</fieldset>

					<button
						type="submit"
						disabled={loading || initialLoading}
						style={
							loading || initialLoading ? disabledButtonStyle : buttonStyle
						}
					>
						{loading
							? "Sauvegarde en cours..."
							: "Sauvegarder les Modifications"}
					</button>
				</form>
			)}
		</div>
	);

	// Envelopper avec le Layout
	return (
		<Layout
			title="Gestion Bannières"
			description="Modifier les bannières promotionnelles de l'accueil"
			dashboard={true}
		>
			{pageContent}
		</Layout>
	);
}
