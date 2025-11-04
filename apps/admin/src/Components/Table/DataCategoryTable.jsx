// src/Components/Table/DataCategoryTable.jsx
import React, { useEffect, useMemo, useRef } from 'react'; // Ajout useRef
// Import direct de datatables.net et jquery si nécessaire
import $ from 'jquery'; // DataTables dépend souvent de jQuery
import DataTable from 'datatables.net-dt';
import 'datatables.net-dt/css/dataTables.dataTables.min.css'; // Chemin CSS corrigé

// Props: categories (données réelles), onEdit (fonction), onDelete (fonction), apiBaseUrl (string)
const DataCategoryTable = ({ categories = [], onEdit, onDelete, apiBaseUrl }) => {
    const tableRef = useRef(null); // Référence pour l'élément table

    // Préparer les données pour DataTables
    const dataSet = useMemo(() => {
        if (!Array.isArray(categories)) {
             console.warn("DataCategoryTable: categories n'est pas un tableau!", categories);
             return [];
         }
        return categories.map(category => ({
            // Assure-toi que l'ID est bien '_id' ou 'id' selon ton API
            id: category._id || category.id,
            imageUrl: category.imageUrl,
            name: category.name || 'N/A',
            // Description simplifiée pour la table
            description: category.description ? String(category.description).replace(/<[^>]*>?/gm, '') : '-',
        }));
    }, [categories]);

    // Définir les colonnes
    const columns = useMemo(() => [
        {
            title: 'Image', data: 'imageUrl', orderable: false, width: "70px", className: "text-center", // Centrer l'image
            render: (data, type, row) => {
                if (type === 'display' && data) {
                    const fullImageUrl = data.startsWith('http') ? data : (data.startsWith('/') ? `${apiBaseUrl}${data}` : `${apiBaseUrl}/${data}`);
                    return `<img src="${fullImageUrl}" alt="${row.name}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 4px; margin: auto;" />`;
                }
                return '<span style="color: #999;">Aucune</span>';
            }
        },
        { title: 'Nom', data: 'name' },
        {
            title: 'Description', data: 'description',
            render: (data, type) => (type === 'display' && data && data.length > 60) ? data.substring(0, 60) + '...' : data
        },
        {
            title: 'Actions', data: 'id', orderable: false, width: "180px", className: "text-center", // Centrer les boutons
            render: (data) => `
                <button class="btn btn-sm btn-info me-2 edit-btn" data-id="${data}" title="Modifier" style="background-color: #0dcaf0; border-color: #0dcaf0; color: white; margin-right: 5px;">
                    Modifier
                </button>
                <button class="btn btn-sm btn-danger delete-btn" data-id="${data}" title="Supprimer" style="background-color: #dc3545; border-color: #dc3545; color: white;">
                    Supprimer
                </button>
            ` // Ajout de styles inline simples pour les boutons
        }
    ], [apiBaseUrl]); // apiBaseUrl est nécessaire pour les images

    useEffect(() => {
        // Initialiser DataTables sur l'élément référencé
        const dt = $(tableRef.current).DataTable({
            data: dataSet,
            columns: columns,
            responsive: true,
            destroy: true, // Très important pour réinitialiser avec de nouvelles données
            language: { /* ... vos traductions ... */
                 search: "Rechercher :",
                 lengthMenu: "Afficher _MENU_ éléments",
                 info: "Affichage de _START_ à _END_ sur _TOTAL_ catégories",
                 infoEmpty: "Aucune catégorie",
                 infoFiltered: "(filtré de _MAX_)",
                 zeroRecords: "Aucune catégorie trouvée",
                 paginate: { next: "Suivant", previous: "Précédent" }
            },
            // Options que tu passais en props (paging, info) sont ici:
            paging: true, // Active la pagination (tu peux mettre false si tu veux)
            info: true,   // Active l'info "Showing..." (tu peux mettre false)
            searching: true, // Active la recherche intégrée (tu peux mettre false si tu utilises ton propre input)
            lengthChange: true, // Active le choix du nombre d'éléments par page
        });

        // Gestion des clics sur les boutons d'action via délégation d'événements jQuery
        const tableBody = $(tableRef.current).find('tbody');

        // Nettoyer les anciens handlers avant d'ajouter les nouveaux
        tableBody.off('click', '.edit-btn');
        tableBody.off('click', '.delete-btn');

        // Ajouter les nouveaux handlers
        tableBody.on('click', '.edit-btn', function () {
            const categoryId = $(this).data('id');
             // Retrouver la catégorie originale à partir de la prop 'categories'
            const categoryToEdit = categories.find(cat => (cat._id || cat.id) === categoryId);
            if (categoryToEdit && onEdit) {
                onEdit(categoryToEdit);
            } else {
                 console.warn("Impossible de retrouver la catégorie à éditer :", categoryId);
            }
        });

        tableBody.on('click', '.delete-btn', function () {
            const categoryId = $(this).data('id');
            if (onDelete) {
                onDelete(categoryId);
            }
        });

        // Nettoyage au démontage du composant
        return () => {
            tableBody.off('click', '.edit-btn');
            tableBody.off('click', '.delete-btn');
            dt.destroy();
        };
    // Dépendances : Recréer la table si les données, colonnes, ou callbacks changent.
    }, [dataSet, columns, categories, onEdit, onDelete]);

    // Rendu du tableau HTML de base avec la référence
    return (
        <div className="table-responsive">
            <table ref={tableRef} className="display compact hover row-border" style={{ width: '100%' }}>
                {/* DataTable va générer thead et tbody ici */}
            </table>
        </div>
    );
};

export default DataCategoryTable;