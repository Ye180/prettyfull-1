// src/Components/Modal/ModalAddCategory.jsx
import { Fragment, useCallback, useEffect, useState } from "react";

import dynamic from "next/dynamic";
import { Form, Modal } from "react-bootstrap";
import { useDropzone } from "react-dropzone";
import "react-quill/dist/quill.snow.css";
import useHostname from "../Provider/HostnameProvider"; // Garde ton hook pour l'URL

// Charger ReactQuill dynamiquement côté client seulement
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

// --- Styles (Ajoutés pour clarté, adaptez/déplacez si besoin) ---
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
	marginBottom: "15px",
	border: "1px solid #ccc",
	borderRadius: "4px",
	boxSizing: "border-box",
	fontSize: "1em",
	backgroundColor: "#fff",
}; // Fond blanc pour visibilité
const previewContainerStyle = { marginTop: "10px", textAlign: "center" };
const previewImageStyle = {
	maxWidth: "150px",
	maxHeight: "100px",
	border: "1px solid #eee",
	borderRadius: "4px",
	objectFit: "contain",
};
const currentImageStyle = { ...previewImageStyle, opacity: 0.7 };
const buttonStyle = {
	padding: "10px 20px",
	backgroundColor: "#57a481",
	color: "white",
	border: "none",
	borderRadius: "8px",
	cursor: "pointer",
	fontSize: "0.9em",
	fontWeight: "bold",
}; // Utilise .rounded-lg de Tailwind implicitement
const disabledButtonStyle = {
	...buttonStyle,
	backgroundColor: "#a3a3a3",
	cursor: "not-allowed",
};
const discardButtonStyle = {
	...buttonStyle,
	backgroundColor: "#f3f4f6",
	color: "#dc2626",
	border: "1px solid #e5e7eb",
}; // Style pour Discard
const dropzoneStyle = {
	width: "100%",
	minHeight: "150px",
	borderRadius: "0.75rem",
	border: "2px dashed #d1d5db",
	backgroundColor: "#f9fafb",
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
	textAlign: "center",
	cursor: "pointer",
	padding: "1rem",
};
const dropzoneActiveStyle = { borderColor: "#2563eb" };
// --- Fin Styles ---

// Configuration ReactQuill (simplifiée comme dans ton exemple)
const modules = {
	toolbar: [
		[
			"bold",
			"italic",
			"underline",
			{ list: "ordered" },
			{ list: "bullet" },
			"link",
			"image",
		],
	],
};

// Props attendues: show, handleClose, categoryData (pour édition), onSaveSuccess, apiBaseUrl
const ModalAddCategory = ({
	show,
	handleClose,
	categoryData,
	onSaveSuccess,
	apiBaseUrl,
	...props
}) => {
	const originalUrl = useHostname(); // Ton hook pour les assets locaux

	// États du formulaire
	const [name, setName] = useState("");
	const [description, setDescription] = useState(""); // Pour ReactQuill
	const [parentId, setParentId] = useState("");
	const [imageFile, setImageFile] = useState(null); // Fichier sélectionné
	const [preview, setPreview] = useState(null); // Prévisualisation Blob URL
	const [currentImageUrl, setCurrentImageUrl] = useState(""); // Image existante (édition)
	const [categories, setCategories] = useState([]); // Pour le select parent
	const [loading, setLoading] = useState(false);
	const [isEditing, setIsEditing] = useState(false);

	// Charger les catégories pour le dropdown parent
	useEffect(() => {
		const fetchCategories = async () => {
			if (!apiBaseUrl) return; // Ne pas fetch si l'URL n'est pas prête
			try {
				const response = await fetch(`${apiBaseUrl}/categories`);
				if (!response.ok) throw new Error("Erreur réseau");
				const data = await response.json();
				// Exclure la catégorie actuelle et ses enfants potentiels (logique simplifiée ici)
				setCategories(
					categoryData
						? data.filter(
								(cat) =>
									(cat._id || cat.id) !== (categoryData._id || categoryData.id)
							)
						: data
				);
			} catch (error) {
				console.error("Erreur lors du chargement des catégories:", error);
			}
		};
		if (show) {
			fetchCategories();
		}
	}, [show, categoryData, apiBaseUrl]); // Recharger si apiBaseUrl change

	// Pré-remplir / Réinitialiser le formulaire
	useEffect(() => {
		if (show) {
			if (categoryData) {
				// Mode Édition
				setIsEditing(true);
				setName(categoryData.name || "");
				setDescription(categoryData.description || "");
				setParentId(categoryData.parentId || "");
				setCurrentImageUrl(categoryData.imageUrl || "");
				setImageFile(null); // Toujours réinitialiser le fichier sélectionné
				setPreview(null);
			} else {
				// Mode Ajout
				setIsEditing(false);
				setName("");
				setDescription("");
				setParentId("");
				setCurrentImageUrl("");
				setImageFile(null);
				setPreview(null);
			}
		}
	}, [categoryData, show]);

	// Gérer la prévisualisation via Dropzone
	const onDrop = useCallback(
		(acceptedFiles) => {
			if (acceptedFiles && acceptedFiles.length > 0) {
				const file = acceptedFiles[0];
				setImageFile(file); // Met à jour l'état du fichier

				// Créer la prévisualisation
				const objectUrl = URL.createObjectURL(file);
				if (preview) URL.revokeObjectURL(preview); // Nettoyer l'ancienne preview
				setPreview(objectUrl);
			} else {
				// Si aucun fichier n'est accepté (ex: mauvais type)
				setImageFile(null);
				if (preview) URL.revokeObjectURL(preview);
				setPreview(null);
			}
		},
		[preview]
	); // Inclure preview pour le nettoyage

	// Nettoyer l'URL Blob au démontage
	useEffect(() => {
		return () => {
			if (preview) URL.revokeObjectURL(preview);
		};
	}, [preview]);

	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		onDrop,
		accept: { "image/*": [] }, // Accepter tous les types d'images
		multiple: false, // Accepter un seul fichier
	});

	// Fermeture du modal
	const onHideClick = () => {
		handleClose();
	};

	// Soumission du formulaire
	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!apiBaseUrl) {
			alert("Erreur: URL de l'API non configurée.");
			return;
		}
		setLoading(true);

		const formDataApi = new FormData();
		formDataApi.append("name", name);
		if (description && description !== "<p><br></p>") {
			formDataApi.append("description", description);
		}
		if (parentId) {
			formDataApi.append("parentId", parentId);
		}
		if (imageFile) {
			formDataApi.append("imageFile", imageFile);
		}

		const apiUrl = isEditing
			? `${apiBaseUrl}/categories/${categoryData._id || categoryData.id}`
			: `${apiBaseUrl}/categories`;
		const apiMethod = isEditing ? "PATCH" : "POST";

		try {
			const response = await fetch(apiUrl, {
				method: apiMethod,
				body: formDataApi,
			});
			if (!response.ok) {
				const errorData = await response.text();
				throw new Error(
					`Erreur ${response.status}: ${errorData || response.statusText}`
				);
			}
			const result = await response.json();
			alert(`Catégorie ${isEditing ? "mise à jour" : "ajoutée"} !`);
			if (onSaveSuccess) onSaveSuccess(result);
			onHideClick();
		} catch (error) {
			console.error("Erreur sauvegarde catégorie:", error);
			alert(`Erreur: ${error.message}`);
		} finally {
			setLoading(false);
		}
	};
	// --- Fin de la logique de soumission ---
	return (
		<Fragment>
			<Modal show={show} onHide={onHideClick} centered size="lg" {...props}>
				{" "}
				{/* Utilise show et onHideClick */}
				<Modal.Header closeButton>
					{" "}
					{/* Utilise le header standard de react-bootstrap */}
					<Modal.Title>
						{isEditing
							? "Modifier la Catégorie"
							: "Ajouter une Nouvelle Catégorie"}
					</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					{/* Le div p-4 englobe le formulaire */}
					<div className="p-4">
						<Form onSubmit={handleSubmit}>
							{/* Dropzone existant adapté */}
							<Form.Group controlId="categoryImage" className="mb-4">
								<Form.Label style={labelStyle}>
									Image {isEditing ? "(Optionnel : Remplacer)" : "(Optionnel)"}
								</Form.Label>
								<div
									{...getRootProps({
										style: {
											...dropzoneStyle,
											...(isDragActive ? dropzoneActiveStyle : {}),
										},
									})}
								>
									<input {...getInputProps()} />
									<div className="flex flex-col items-center justify-center">
										{/* Affichage preview ou image actuelle DANS le dropzone */}
										{preview ? (
											<img
												src={preview}
												alt="Prévisualisation"
												style={previewImageStyle}
												className="mb-2"
											/>
										) : currentImageUrl ? (
											<img
												src={`${apiBaseUrl}${currentImageUrl}`}
												alt="Actuelle"
												style={currentImageStyle}
												className="mb-2"
											/>
										) : (
											<img
												src={originalUrl + "/images/FileImage.svg"}
												alt="Upload Icon"
												className="w-10 h-10 mb-3"
											/>
										)}

										{isDragActive ? (
											<p className="text-blue-600 text__12">
												Déposez l'image ici...
											</p>
										) : (
											<>
												<p className="mb-1 text-gray-500 text__12">
													{imageFile
														? imageFile.name
														: isEditing && currentImageUrl
															? "Glissez-déposez ou cliquez pour remplacer"
															: "Glissez-déposez une image ou cliquez pour sélectionner"}
												</p>
												{!imageFile && !(isEditing && currentImageUrl) && (
													<p className="font-medium text-blue-600 text__14">
														Cliquez pour Uploader
													</p>
												)}
											</>
										)}
									</div>
								</div>
							</Form.Group>

							{/* Champ Nom */}
							<Form.Group controlId="categoryName" className="mb-3">
								<Form.Label style={labelStyle} className="text-[#A3A3A3]">
									{" "}
									{/* Ajout style label */}
									Nom Catégorie *
								</Form.Label>
								<Form.Control
									type="text" // Changé de email à text
									placeholder="Entrer le nom"
									value={name}
									onChange={(e) => setName(e.target.value)}
									required
									// Garde tes classes pour le style
									className="font-medium text__14 bg-transparent h-[54px] rounded-lg px-3 outline-hidden shadow-none focus:outline-hidden focus:shadow-none border-Mborderborderprimary focus:border-Mborderborderprimary focus:bg-transparent"
								/>
							</Form.Group>

							{/* Champ Description */}
							<Form.Group controlId="categoryDescription" className="mb-3">
								<Form.Label style={labelStyle} className="text-[#A3A3A3]">
									Description (Optionnel)
								</Form.Label>
								{/* Appliquer le style au conteneur si besoin */}
								<div className="flex flex-col-reverse border rounded-lg textareaStyle hCategory border-Mborderborderprimary focus-within:border-Mborderborderprimary">
									<ReactQuill
										theme="snow"
										value={description}
										onChange={setDescription}
										placeholder="Entrer la description"
										modules={modules}
										style={{ backgroundColor: "transparent" }} // Ajuste le style
									/>
								</div>
							</Form.Group>

							{/* Champ Catégorie Parente */}
							<Form.Group controlId="categoryParent" className="mb-3">
								<Form.Label style={labelStyle} className="text-[#A3A3A3]">
									Catégorie Parente (Optionnel)
								</Form.Label>
								<Form.Select
									value={parentId}
									onChange={(e) => setParentId(e.target.value)}
									// Garde tes classes
									className="font-medium text__14 bg-transparent h-[54px] rounded-lg px-3 outline-hidden shadow-none focus:outline-hidden focus:shadow-none border-Mborderborderprimary focus:border-Mborderborderprimary focus:bg-transparent"
								>
									<option value="">-- Aucune (Catégorie Principale) --</option>
									{categories &&
										categories.map((cat) => (
											<option key={cat._id || cat.id} value={cat._id || cat.id}>
												{cat.name}
											</option>
										))}
								</Form.Select>
							</Form.Group>

							{/* Boutons (Utilisation de <button type="..."> pour la sémantique) */}
							<div className="flex items-center justify-end gap-2 mt-4">
								<button
									type="button" // Important pour ne pas soumettre le formulaire
									onClick={onHideClick}
									style={discardButtonStyle}
									className="px-3 py-2 rounded-lg" // Utilise tes classes si tu préfères
								>
									Annuler {/* Texte changé */}
								</button>
								<button
									type="submit"
									disabled={loading}
									style={loading ? disabledButtonStyle : buttonStyle}
									className="px-3 py-2 rounded-lg" // Utilise tes classes si tu préfères
								>
									{loading
										? "Sauvegarde..."
										: isEditing
											? "Mettre à jour"
											: "Ajouter Catégorie"}
								</button>
							</div>
						</Form>
					</div>
				</Modal.Body>
			</Modal>
		</Fragment>
	);
};

export default ModalAddCategory;
