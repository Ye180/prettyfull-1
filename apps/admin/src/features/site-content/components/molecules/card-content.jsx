import { useDeleteSiteContent } from "@/features/site-content/api/delete-site-content";
import { useToggleVisibility } from "@/features/site-content/api/toggle-visibility";
import SiteContentDetailModal from "@/features/site-content/components/molecules/site-content-detail-modal";
import { Edit, Eye, MoreVertical, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

/**
 * 🎨 CardSiteContent - Composant de carte moderne pour afficher les contenus du site
 *
 * Features:
 * - Design moderne avec gradient et glassmorphism
 * - Badge de statut (actif/inactif) avec toggle switch
 * - Menu d'actions (voir, éditer, supprimer)
 * - Hover effects élégants
 * - Responsive design
 * - Intégration avec API réelle
 * - Modal de vue détaillée
 */
const CardSiteContent = ({ siteContents = [], isLoading = false }) => {
	const [deletingId, setDeletingId] = useState(null);
	const [selectedContent, setSelectedContent] = useState(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const toggleVisibilityMutation = useToggleVisibility();
	const deleteMutation = useDeleteSiteContent();

	const handleToggleVisibility = async (content) => {
		await toggleVisibilityMutation.mutateAsync({
			id: content._id,
			isActive: !content.isActive,
		});
	};

	const handleDelete = async (id) => {
		if (window.confirm("Êtes-vous sûr de vouloir supprimer ce contenu ?")) {
			setDeletingId(id);
			await deleteMutation.mutateAsync(id);
			setDeletingId(null);
		}
	};

	const handleViewDetails = (content) => {
		setSelectedContent(content);
		setIsModalOpen(true);
	};

	const closeModal = () => {
		setIsModalOpen(false);
		setTimeout(() => setSelectedContent(null), 300); // Attendre la fin de l'animation
	};

	// Compte le nombre de sections non vides
	const countSections = (content) => {
		let count = 0;
		if (content.first) count++;
		if (content.secondSection) count++;
		if (content.thirdSection) count++;
		if (content.fourthSection) count++;
		if (content.fiveSection) count++;
		if (content.sixSection) count++;
		if (content.sevenSection) count++;
		if (content.eightSection) count++;
		if (content.nineSection) count++;
		if (content.tenSection) count++;
		return count;
	};

	const getTypeColor = (type) => {
		const colors = {
			SECTION: "bg-blue-100 text-blue-700 border-blue-200",
			CATEGORY: "bg-purple-100 text-purple-700 border-purple-200",
			BANNER: "bg-orange-100 text-orange-700 border-orange-200",
		};
		return colors[type] || "bg-gray-100 text-gray-700 border-gray-200";
	};

	const getTypeIcon = (type) => {
		const icons = {
			SECTION: "📄",
			CATEGORY: "📁",
			BANNER: "🎨",
		};
		return icons[type] || "📌";
	};

	// État de chargement
	if (isLoading) {
		return (
			<div className="grid w-full grid-cols-1 gap-6 py-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
				{[1, 2, 3, 4].map((i) => (
					<div
						key={i}
						className="overflow-hidden border animate-pulse rounded-2xl border-slate-200"
					>
						<div className="h-32 bg-slate-200"></div>
						<div className="p-5 space-y-4">
							<div className="w-3/4 h-6 rounded bg-slate-200"></div>
							<div className="w-full h-4 rounded bg-slate-100"></div>
							<div className="w-full h-4 rounded bg-slate-100"></div>
						</div>
					</div>
				))}
			</div>
		);
	}

	// État vide
	if (!siteContents || siteContents.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center w-full py-16 text-center">
				<div className="flex items-center justify-center w-20 h-20 mb-4 rounded-full bg-slate-100">
					<span className="text-4xl">📄</span>
				</div>
				<h3 className="mb-2 text-xl font-semibold text-slate-900">
					Aucun contenu pour le moment
				</h3>
				<p className="mb-6 text-sm text-slate-600">
					Commencez par créer votre premier contenu de site
				</p>
				<Link
					href="/add-content"
					className="px-6 py-3 text-sm font-medium text-white transition-colors bg-black rounded-xl hover:bg-slate-800"
				>
					Créer un contenu
				</Link>
			</div>
		);
	}

	return (
		<div className="w-full py-8">
			{/* Modal de détails */}
			<SiteContentDetailModal
				content={selectedContent}
				isOpen={isModalOpen}
				onClose={closeModal}
			/>

			<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
				{siteContents.map((content) => (
					<div
						key={content._id}
						className="relative overflow-hidden transition-all duration-300 border group rounded-2xl bg-linear-to-br from-slate-50 via-white to-slate-50 border-slate-200 hover:border-slate-300 hover:shadow-2xl hover:-translate-y-1"
					>
						{/* 🌟 Header avec gradient */}
						<div className="relative h-32 p-5 bg-linear-to-br from-slate-900 via-slate-800 to-slate-900">
							{/* Motif de fond décoratif */}
							<div className="absolute inset-0 opacity-10">
								<div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full blur-3xl" />
								<div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-500 rounded-full blur-2xl" />
							</div>

							{/* Contenu du header */}
							<div className="relative flex items-start justify-between">
								<div className="flex items-center gap-3">
									<div className="flex items-center justify-center w-12 h-12 text-2xl bg-white/10 backdrop-blur-md rounded-xl">
										{getTypeIcon(content.type)}
									</div>
									<div>
										<span
											className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium border ${getTypeColor(content.type)}`}
										>
											{content.type}
										</span>
									</div>
								</div>

								{/* Menu d'actions */}
								<div className="relative group/menu">
									<button className="p-2 text-white transition-colors rounded-lg hover:bg-white/10">
										<MoreVertical className="w-5 h-5" />
									</button>

									{/* Dropdown simple au hover */}
									<div className="absolute right-0 z-10 hidden w-48 mt-2 overflow-hidden bg-white border rounded-lg shadow-lg top-full group-hover/menu:block border-slate-200">
										<button
											onClick={(e) => {
												e.stopPropagation();
												handleViewDetails(content);
											}}
											className="flex items-center w-full gap-2 px-4 py-2 text-sm text-left transition-colors text-slate-700 hover:bg-slate-50"
										>
											<Eye className="w-4 h-4" />
											Voir les détails
										</button>
										<Link
											href={`/edit-content/${content._id}`}
											className="flex items-center w-full gap-2 px-4 py-2 text-sm text-left transition-colors text-slate-700 hover:bg-slate-50"
										>
											<Edit className="w-4 h-4" />
											Modifier
										</Link>
										<button
											onClick={(e) => {
												e.stopPropagation();
												handleDelete(content._id);
											}}
											disabled={deletingId === content._id}
											className="flex items-center w-full gap-2 px-4 py-2 text-sm text-left text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
										>
											<Trash2 className="w-4 h-4" />
											{deletingId === content._id
												? "Suppression..."
												: "Supprimer"}
										</button>
									</div>
								</div>
							</div>

							{/* Toggle Switch pour la visibilité */}
							<div className="absolute bottom-4 left-5">
								<button
									onClick={(e) => {
										e.stopPropagation();
										handleToggleVisibility(content);
									}}
									disabled={toggleVisibilityMutation.isPending}
									className={`inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-full backdrop-blur-md transition-all duration-300 ${
										content.isActive
											? "bg-green-500/20 text-green-100 border border-green-400/30 hover:bg-green-500/30"
											: "bg-red-500/20 text-red-100 border border-red-400/30 hover:bg-red-500/30"
									} ${toggleVisibilityMutation.isPending ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
								>
									<div
										className={`relative w-8 h-4 rounded-full transition-colors ${
											content.isActive ? "bg-green-400" : "bg-red-400"
										}`}
									>
										<div
											className={`absolute top-0.5 left-0.5 w-3 h-3 bg-white rounded-full transition-transform duration-300 ${
												content.isActive ? "translate-x-4" : "translate-x-0"
											}`}
										/>
									</div>
									{content.isActive ? "Actif" : "Inactif"}
								</button>
							</div>
						</div>

						{/* 📝 Corps de la carte */}
						<div className="p-3 space-y-4">
							{/* Titre et clé */}
							<div>
								<h3 className="font-semibold! transition-colors text-[1.1rem]! text-slate-900 line-clamp-1 group-hover:text-blue-600 ">
									{content.first?.title?.fr || content.key || "Sans titre"}
								</h3>
								<p className="text-xs font-mono text-slate-500 mt-0.5">
									{content.key}
								</p>
							</div>

							{/* Description */}
							<p className="text-sm leading-relaxed text-slate-600 line-clamp-2">
								{content.first?.description?.fr ||
									content.quote?.quote?.fr ||
									"Aucune description disponible"}
							</p>

							{/* Métadonnées */}
							<div className="flex items-center justify-between pt-3 border-t border-slate-100">
								<div className="flex items-center gap-4 text-xs text-slate-500">
									<div className="flex items-center gap-1">
										<span className="font-medium text-slate-700">
											{countSections(content)}
										</span>
										sections
									</div>
									<div className="flex items-center gap-1">
										<span className="font-medium text-slate-700">
											#{content.sortOrder}
										</span>
										ordre
									</div>
								</div>
							</div>

							{/* Date de mise à jour */}
							<div className="flex items-center justify-between pt-2">
								<p className="text-xs text-slate-400">
									Mis à jour le{" "}
									<span className="font-medium text-slate-600">
										{new Date(content.updatedAt).toLocaleDateString("fr-FR", {
											day: "2-digit",
											month: "short",
											year: "numeric",
										})}
									</span>
								</p>
							</div>
						</div>

						{/* 🎯 Footer avec bouton d'action */}
						<div className="px-5 pb-5">
							<button
								onClick={() => handleViewDetails(content)}
								className="flex items-center justify-center w-full gap-2 px-4 py-2.5 text-sm font-medium text-slate-700 bg-slate-100 rounded-xl hover:bg-black hover:text-white transition-all duration-300 group/btn"
							>
								<Eye className="w-4 h-4 transition-transform group-hover/btn:text-white" />
								<span className="line-clamp-1 group-hover/btn:text-white">
									Voir en détail
								</span>
							</button>
						</div>

						{/* Effet de brillance au hover */}
						<div className="absolute inset-0 transition-opacity duration-300 opacity-0 pointer-events-none group-hover:opacity-100">
							<div className="absolute inset-0 bg-linear-to-tr from-transparent via-white/5 to-transparent" />
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default CardSiteContent;
