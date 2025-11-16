import { Calendar, Eye, Globe, Image as ImageIcon, Tag, X } from "lucide-react";
import { useEffect } from "react";

/**
 * 🎨 Modal de vue d'ensemble du contenu du site
 * Design élégant avec toutes les sections détaillées
 */
const SiteContentDetailModal = ({ content, isOpen, onClose }) => {
	// Fermer avec Escape
	useEffect(() => {
		const handleEscape = (e) => {
			if (e.key === "Escape" && isOpen) {
				onClose();
			}
		};
		document.addEventListener("keydown", handleEscape);
		return () => document.removeEventListener("keydown", handleEscape);
	}, [isOpen, onClose]);

	// Bloquer le scroll du body quand le modal est ouvert
	useEffect(() => {
		if (isOpen) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "unset";
		}
		return () => {
			document.body.style.overflow = "unset";
		};
	}, [isOpen]);

	if (!isOpen || !content) return null;

	// Helper pour afficher une section
	const renderSection = (section, sectionName) => {
		if (!section) return null;

		return (
			<div className="p-6 transition-all duration-200 bg-white border rounded-xl border-slate-200 hover:shadow-lg">
				<div className="flex items-center gap-2 mb-4">
					<div className="flex items-center justify-center w-8 h-8 rounded-lg bg-linear-to-br from-blue-500 to-blue-600">
						<span className="text-sm font-bold text-white">{sectionName}</span>
					</div>
					<h3 className="text-lg font-semibold text-slate-900">
						Section {sectionName}
					</h3>
				</div>

				<div className="space-y-4">
					{/* Titre */}
					{section.title && (
						<div>
							<p className="mb-1 text-xs font-medium text-slate-500">Titre</p>
							<p className="text-sm font-semibold text-slate-900">
								{section.title.fr || section.title}
							</p>
							{section.title.en && (
								<p className="text-xs text-slate-500">EN: {section.title.en}</p>
							)}
						</div>
					)}

					{/* Description */}
					{section.description && (
						<div>
							<p className="mb-1 text-xs font-medium text-slate-500">
								Description
							</p>
							<p className="text-sm leading-relaxed text-slate-700">
								{section.description.fr || section.description}
							</p>
							{section.description.en && (
								<p className="text-xs text-slate-500">
									EN: {section.description.en}
								</p>
							)}
						</div>
					)}

					{/* Sous-titre */}
					{section.subtitle && (
						<div>
							<p className="mb-1 text-xs font-medium text-slate-500">
								Sous-titre
							</p>
							<p className="text-sm text-slate-700">
								{section.subtitle.fr || section.subtitle}
							</p>
						</div>
					)}

					{/* Catégorie */}
					{section.category && (
						<div>
							<p className="mb-1 text-xs font-medium text-slate-500">
								Catégorie
							</p>
							<div className="inline-flex items-center gap-2 px-3 py-1 text-sm text-purple-700 rounded-lg bg-purple-50">
								<Tag className="w-4 h-4" />
								{section.category.name?.fr || section.category.name || "N/A"}
							</div>
						</div>
					)}

					{/* Catégorie parente */}
					{section.parentCategory && (
						<div>
							<p className="mb-1 text-xs font-medium text-slate-500">
								Catégorie parente
							</p>
							<div className="inline-flex items-center gap-2 px-3 py-1 text-sm text-indigo-700 rounded-lg bg-indigo-50">
								<Tag className="w-4 h-4" />
								{section.parentCategory.name?.fr ||
									section.parentCategory.name ||
									"N/A"}
							</div>
						</div>
					)}

					{/* Images */}
					{section.images && section.images.length > 0 && (
						<div>
							<p className="mb-2 text-xs font-medium text-slate-500">
								Images ({section.images.length})
							</p>
							<div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
								{section.images.map((img, idx) => (
									<div
										key={idx}
										className="relative overflow-hidden border rounded-lg group border-slate-200 aspect-square"
									>
										<img
											src={img}
											alt={`Image ${idx + 1}`}
											className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
										/>
										<div className="absolute inset-0 flex items-center justify-center transition-opacity duration-300 opacity-0 bg-black/50 group-hover:opacity-100">
											<ImageIcon className="w-6 h-6 text-white" />
										</div>
									</div>
								))}
							</div>
						</div>
					)}

					{/* Image unique */}
					{section.image && !section.images && (
						<div>
							<p className="mb-2 text-xs font-medium text-slate-500">Image</p>
							<div className="relative overflow-hidden border rounded-lg group border-slate-200 aspect-video">
								<img
									src={section.image}
									alt="Section image"
									className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
								/>
							</div>
						</div>
					)}

					{/* CTA */}
					{section.cta && (
						<div>
							<p className="mb-1 text-xs font-medium text-slate-500">
								Call-to-Action
							</p>
							<div className="flex items-center gap-2 p-3 rounded-lg bg-slate-50">
								<span className="text-sm font-medium text-slate-900">
									{section.cta.fr || section.cta}
								</span>
							</div>
						</div>
					)}
				</div>
			</div>
		);
	};

	const sections = [
		{ data: content.first, name: "1" },
		{ data: content.secondSection, name: "2" },
		{ data: content.thirdSection, name: "3" },
		{ data: content.fourthSection, name: "4" },
		{ data: content.fiveSection, name: "5" },
		{ data: content.sixSection, name: "6" },
		{ data: content.sevenSection, name: "7" },
		{ data: content.eightSection, name: "8" },
		{ data: content.nineSection, name: "9" },
		{ data: content.tenSection, name: "10" },
	];

	const activeSections = sections.filter((s) => s.data);

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
			{/* Modal Container */}
			<div className="relative w-full max-w-6xl max-h-[90vh] bg-white rounded-2xl shadow-2xl animate-slideUp overflow-hidden flex flex-col">
				{/* Header fixe */}
				<div className="sticky top-0 z-10 p-6 bg-linear-to-r from-slate-900 via-slate-800 to-slate-900">
					<div className="flex items-start justify-between">
						<div className="flex-1">
							<div className="flex items-center gap-3 mb-2">
								<span
									className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-full ${
										content.isActive
											? "bg-green-500/20 text-green-200 border border-green-400/30"
											: "bg-red-500/20 text-red-200 border border-red-400/30"
									}`}
								>
									{content.isActive ? "Actif" : "Inactif"}
								</span>
								<span className="px-3 py-1 text-xs font-medium text-blue-200 border rounded-full bg-blue-500/20 border-blue-400/30">
									{content.type}
								</span>
							</div>
							<h2 className="mb-1 text-2xl font-bold text-white">
								{content.first?.title?.fr || content.key}
							</h2>
							<p className="font-mono text-sm text-slate-300">{content.key}</p>
						</div>
						<button
							onClick={onClose}
							className="p-2 text-white transition-colors rounded-lg hover:bg-white/10"
						>
							<X className="w-6 h-6" />
						</button>
					</div>

					{/* Meta info */}
					<div className="flex flex-wrap gap-4 mt-4 text-sm text-slate-300">
						<div className="flex items-center gap-2">
							<Calendar className="w-4 h-4" />
							<span>
								Créé le{" "}
								{new Date(content.createdAt).toLocaleDateString("fr-FR", {
									day: "2-digit",
									month: "long",
									year: "numeric",
								})}
							</span>
						</div>
						<div className="flex items-center gap-2">
							<Eye className="w-4 h-4" />
							<span>{activeSections.length} sections actives</span>
						</div>
						<div className="flex items-center gap-2">
							<Globe className="w-4 h-4" />
							<span>Ordre: #{content.sortOrder}</span>
						</div>
					</div>
				</div>

				{/* Contenu scrollable */}
				<div className="flex-1 p-6 space-y-6 overflow-y-auto">
					{/* Quote section si présente */}
					{content.quote && (
						<div className="p-6 border-l-4 border-blue-500 rounded-r-xl bg-blue-50">
							<p className="mb-2 text-xs font-semibold tracking-wide text-blue-600 uppercase">
								Citation
							</p>
							<blockquote className="text-lg italic font-medium text-slate-900">
								"{content.quote.quote?.fr || content.quote.quote}"
							</blockquote>
							{content.quote.author && (
								<p className="mt-2 text-sm text-slate-600">
									— {content.quote.author.fr || content.quote.author}
								</p>
							)}
						</div>
					)}

					{/* Toutes les sections */}
					{activeSections.length > 0 ? (
						<div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
							{activeSections.map((section) =>
								renderSection(section.data, section.name)
							)}
						</div>
					) : (
						<div className="flex flex-col items-center justify-center py-12 text-center">
							<div className="flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-slate-100">
								<ImageIcon className="w-8 h-8 text-slate-400" />
							</div>
							<p className="text-slate-600">Aucune section configurée</p>
						</div>
					)}
				</div>

				{/* Footer */}
				<div className="sticky bottom-0 p-4 border-t bg-slate-50 border-slate-200">
					<div className="flex items-center justify-between">
						<p className="text-sm text-slate-600">
							Dernière mise à jour:{" "}
							<span className="font-medium text-slate-900">
								{new Date(content.updatedAt).toLocaleDateString("fr-FR", {
									day: "2-digit",
									month: "long",
									year: "numeric",
									hour: "2-digit",
									minute: "2-digit",
								})}
							</span>
						</p>
						<button
							onClick={onClose}
							className="px-6 py-2 text-sm font-medium text-white transition-colors bg-black rounded-lg hover:bg-slate-800"
						>
							Fermer
						</button>
					</div>
				</div>
			</div>

			{/* Animations CSS */}
			<style jsx>{`
				@keyframes fadeIn {
					from {
						opacity: 0;
					}
					to {
						opacity: 1;
					}
				}
				@keyframes slideUp {
					from {
						transform: translateY(20px);
						opacity: 0;
					}
					to {
						transform: translateY(0);
						opacity: 1;
					}
				}
				.animate-fadeIn {
					animation: fadeIn 0.2s ease-out;
				}
				.animate-slideUp {
					animation: slideUp 0.3s ease-out;
				}
			`}</style>
		</div>
	);
};

export default SiteContentDetailModal;
