import React, { Fragment, useEffect, useState, useMemo, useRef } from "react"; // Ajout useMemo, useRef
import $ from "jquery";
import DataTable from "datatables.net-react";
import DT from "datatables.net-dt";
import "datatables.net-dt/css/dataTables.dataTables.min.css";
import useHostname from "../Provider/HostnameProvider";
// Pas besoin de ModalDetailProduct ici a priori

DataTable.use(DT);

// Accepter les nouvelles props: Status -> statusFilter, Category -> categoryFilter, Stock -> stockFilter, apiBaseUrl
const DataProductListTable = ({
    statusFilter, // Renommé
    categoryFilter, // Renommé
    stockFilter, // Renommé
    data = [],
    info = false,
    paging = false,
    searching = false, // Utiliser la recherche intégrée de DataTables ? Ou celle externe ?
    lengthChange = false,
    searchTerm = "",
    apiBaseUrl // Nouvelle prop
}) => {
    const originalUrl = useHostname(); // Pour les icônes locales
    const tableRef = useRef(null); // Référence pour DataTables
    const dataTableInstance = useRef(null); // Référence pour l'instance DataTables

    const [selectedRows, setSelectedRows] = useState([]);
    const [allSelected, setAllSelected] = useState(false);

    // Fonction pour obtenir l'URL complète de l'image
    const getFullImageUrl = (imagePath) => {
        if (!imagePath) return ''; // Pas d'image
        if (imagePath.startsWith('http')) return imagePath; // Déjà une URL complète
        // Construire l'URL : apiBaseUrl vient de .env (ex: http://localhost:7777/api/v1)
        // L'imagePath vient de l'API (ex: /uploads/products/image.jpg)
        // On doit enlever le /api/v1 pour accéder aux fichiers statiques servis à la racine du backend
        const baseUrlWithoutApiPrefix = apiBaseUrl?.replace('/api/v1', '') || ''; // Ex: http://localhost:7777
        return `${baseUrlWithoutApiPrefix}${imagePath.startsWith('/') ? '' : '/'}${imagePath}`;
    };

    // Définition des colonnes adaptée aux données de l'API
    const columns = useMemo(() => [
        {
            title: '<input type="checkbox" id="select-all-checkbox" class="w-5 h-5 border border-Mgray400 rounded-sm" />',
            data: null, // Ne se base pas sur une propriété spécifique
            orderable: false,
            className: 'select-checkbox dt-body-center', // Classe pour DataTables Select si utilisé, sinon juste centrer
             width: '5%', // Ajuster la largeur
             render: function (data, type, row) {
                 // Utiliser l'ID réel de la BDD (_id ou id)
                 const rowId = row._id || row.id;
                 return `<input type="checkbox" class="row-checkbox w-5 h-5 border border-Mgray400 rounded-sm" data-id="${rowId}" />`;
             },
        },
        {
            title: "PRODUCT",
            data: "name", // Utiliser l'objet name
            width: '30%', // Donner plus d'espace
            render: function (data, type, row) {
                // Utiliser la langue 'fr' par défaut ou une logique de langue
                const productName = row.name?.fr || 'Nom Inconnu';
                // Utiliser la description 'fr' ou une chaîne vide
                const productDesc = row.description?.fr || '';
                 // Construire l'URL de l'image principale
                 const imageUrl = getFullImageUrl(row.mainImageUrl); // Utiliser le bon champ

                return `
                  <div class="flex items-center gap-2">
                     ${imageUrl ? `<img src="${imageUrl}" class="w-10 h-10 rounded-md object-cover shrink-0" alt="${productName}" />` : '<div class="w-10 h-10 rounded-md bg-gray-200 flex items-center justify-center text-gray-400 text-xs shrink-0">No Img</div>'}
                     <div class="overflow-hidden">
                       <h5 class="font-medium text__16 truncate" title="${productName}">${productName}</h5>
                       <p class="text__14 text-Mtexttextsecondary truncate" title="${productDesc}">${productDesc}</p>
                     </div>
                  </div>
                `;
            },
        },
        {
            title: "CATEGORY",
            data: "categories", // Utiliser le tableau categories
             width: '15%',
             render: function (data, type, row) {
                 // Afficher la première catégorie (ou gérer plusieurs si nécessaire)
                 const categoryName = data?.[0]?.name?.fr || 'N/A';
                 // Icône basée sur le nom (simplifié, idéalement utiliser un ID/slug)
                 let iconUrl = '';
                 if (categoryName.toLowerCase().includes('shoes') || categoryName.toLowerCase().includes('chaussures')) {
                     iconUrl = originalUrl + "/images/Sneaker.svg";
                 } else if (categoryName.toLowerCase().includes('fashion') || categoryName.toLowerCase().includes('mode')) {
                     iconUrl = originalUrl + "/images/TShirt.svg";
                 } else if (categoryName.toLowerCase().includes('electronic') || categoryName.toLowerCase().includes('electronique')) {
                      iconUrl = originalUrl + "/images/Devices.svg";
                 }

                 return `
                    <div class="inline-flex items-center gap-2 px-2 py-1 rounded-sm bg-Msurfacesurfacesecondary border border-Mborderborderprimary">
                       ${iconUrl ? `<img src="${iconUrl}" class='w-4 h-4' alt="" />` : ''}
                       <p class='text__14 truncate' title="${categoryName}">${categoryName}</p>
                    </div>
                 `;
             },
        },
        {
            title: "STOCK",
            data: "stock", // Quantité numérique
            width: '10%',
            className: "text-center", // Centrer
            render: function (data, type, row) {
                // Afficher la quantité et un indicateur visuel
                const stockQty = typeof data === 'number' ? data : 0;
                const stockStatusClass = stockQty > 10 ? 'bg-green-100 text-green-700' : stockQty > 0 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700';
                 const stockText = stockQty > 0 ? `${stockQty} en stock` : 'Épuisé';

                 return `<div class="text-center">
                            <span class="text__14 px-2 py-1 rounded-full text-xs font-medium ${stockStatusClass}">${stockText}</span>
                         </div>`;
                 // Alternative avec switch (si besoin de logique plus complexe):
                 /*
                 return `
                    <label class="switch mx-auto block w-[44px]">
                      <input type="checkbox" ${stockQty > 0 ? "checked" : ""} disabled>
                      <span class="slider round"></span>
                    </label>
                    <span class="text__12 block mt-1 ${stockQty > 0 ? 'text-green-600' : 'text-red-600'}">${stockQty > 0 ? `(${stockQty})` : 'Épuisé'}</span>
                 `;
                 */
            },
        },
        {
            title: "PRICE",
            data: "price", // Objet prix
             width: '10%',
             className: "text-right", // Aligner à droite
             render: function (data, type, row) {
                 // Formater le prix
                 const amount = data?.amount ?? 0;
                 const currency = data?.currency ?? 'EUR'; // Devise par défaut
                 // Utiliser Intl.NumberFormat pour un formatage correct
                 const formattedPrice = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: currency }).format(amount);
                 return `<p class="text__14 font-medium text-right">${formattedPrice}</p>`;
             },
        },
        // QTY (Quantité) est maintenant dans STOCK, on peut supprimer cette colonne si redondant
        // { title: "QTY", data: "qty", ... },
        {
            title: "STATUS",
            data: "status", // Statut du produit (ex: Published, Draft)
            width: '10%',
             className: "text-center",
             render: function (data, type, row) {
                 // Adapter l'affichage selon les statuts réels
                 const statusText = data || 'Inconnu';
                 let statusClass = 'bg-gray-100 text-gray-700'; // Défaut
                 if (statusText.toLowerCase() === 'published' || statusText.toLowerCase() === 'publié') {
                     statusClass = 'bg-green-100 text-green-700';
                 } else if (statusText.toLowerCase() === 'draft' || statusText.toLowerCase() === 'brouillon') {
                     statusClass = 'bg-yellow-100 text-yellow-700';
                 } else if (statusText.toLowerCase() === 'archived' || statusText.toLowerCase() === 'archivé') {
                      statusClass = 'bg-red-100 text-red-700';
                 }
                  return `<span class="text__14 px-2 py-1 rounded-full text-xs font-medium ${statusClass}">${statusText}</span>`;
             },
        },
        {
            title: "ACTIONS",
            data: "_id", // Utiliser l'ID pour les actions
             orderable: false,
             width: '10%',
             className: "text-center",
             render: function (data, type, row) {
                 const productId = row._id || row.id; // Obtenir l'ID
                 // TODO: Remplacer #! par les vrais liens/fonctions d'édition/suppression
                 return `
                    <div class="flex items-center justify-center gap-2">
                        <a href="/edit-product/${productId}" title="Modifier" class="p-1 hover:bg-gray-100 rounded">
                           <img src="${originalUrl}/images/PencilSimpleLine.svg" class="w-5 h-5" alt="Edit" />
                        </a>
                        <button data-id="${productId}" title="Supprimer" class="p-1 hover:bg-gray-100 rounded delete-product-btn">
                            <img src="${originalUrl}/images/Trash.svg" class="w-5 h-5" alt="Delete" />
                        </button>
                        {/* Ajouter d'autres actions si nécessaire */}
                        {/* <button data-id="${productId}" title="Autres actions" class="p-1 hover:bg-gray-100 rounded other-action-btn">
                           <img src="${originalUrl}/images/DotsThreeVertical.svg" class="w-5 h-5" alt="More" />
                        </button> */}
                    </div>`;
             },
        },
    ], [originalUrl, apiBaseUrl]); // Dépendances pour useMemo

    // Préparer les données pour DataTables (dataSet)
     const dataSet = useMemo(() => {
         if (!Array.isArray(data)) {
              console.warn("DataProductListTable: 'data' n'est pas un tableau!", data);
              return [];
          }
         // Transformer les données si nécessaire pour correspondre aux attentes des colonnes
         // Ici, les render functions gèrent déjà la plupart des transformations
         return data;
     }, [data]);


    // Initialisation et mise à jour de DataTables
    useEffect(() => {
         // Détruire l'instance précédente si elle existe
         if (dataTableInstance.current) {
             dataTableInstance.current.destroy();
             $(tableRef.current).empty(); // Vider le contenu de la table (thead/tbody)
         }

        // Initialiser DataTables
        const dt = $(tableRef.current).DataTable({
            data: dataSet,
            columns: columns,
            responsive: true,
            paging: paging,
            info: info,
            searching: searching, // Activer/désactiver la barre de recherche intégrée
            lengthChange: lengthChange,
             order: [[1, 'asc']], // Tri par défaut sur la colonne Produit (index 1)
            language: {
                 search: "Rechercher :",
                 lengthMenu: "Afficher _MENU_ éléments",
                 info: "Affichage de _START_ à _END_ sur _TOTAL_ produits",
                 infoEmpty: "Aucun produit",
                 infoFiltered: "(filtré de _MAX_)",
                 zeroRecords: "Aucun produit trouvé",
                 paginate: { next: "Suivant", previous: "Précédent" }
            },
            // Gérer le clic sur la checkbox d'une ligne
            drawCallback: function (settings) {
                // S'assurer que les handlers de checkbox sont ré-attachés après chaque dessin
                 $('.row-checkbox').off('change').on('change', function () {
                     const rowId = $(this).data('id').toString();
                     // Met à jour l'état React (pas directement le DOM)
                      setSelectedRows(prev =>
                          this.checked ? [...prev, rowId] : prev.filter(id => id !== rowId)
                      );
                 });
                 // Synchroniser l'état des checkboxes après le dessin
                 syncCheckboxes();
             },
             createdRow: function(row, data, dataIndex) {
                 // Ajouter un ID ou une classe à la ligne si nécessaire
                 // $(row).attr('data-product-id', data._id || data.id);
             }
        });

        dataTableInstance.current = dt; // Stocker l'instance

        // Gestion du clic sur "Select All"
        $('#select-all-checkbox').off('change').on('change', function () {
            const isChecked = this.checked;
             setAllSelected(isChecked); // Met à jour l'état React

             // Mettre à jour l'état selectedRows basé sur les données *actuellement filtrées*
             const filteredIds = dt.rows({ search: 'applied' }).data().toArray().map(row => row._id || row.id);
             setSelectedRows(isChecked ? filteredIds : []);

             // Mettre à jour visuellement les checkboxes des lignes visibles/filtrées
             $('.row-checkbox', dt.rows({ search: 'applied' }).nodes()).prop('checked', isChecked);
        });

         // Gestion du clic sur le bouton Supprimer (délégation d'événements)
        $(tableRef.current).find('tbody').off('click', '.delete-product-btn').on('click', '.delete-product-btn', function () {
            const productId = $(this).data('id');
            if (window.confirm(`Êtes-vous sûr de vouloir supprimer le produit ${productId} ?`)) {
                console.log("Supprimer produit ID:", productId);
                // TODO: Appeler la fonction de suppression de l'API ici
                // exemple: handleDeleteProduct(productId);
            }
        });


         // Fonction pour synchroniser l'état visuel des checkboxes avec l'état React
         const syncCheckboxes = () => {
             $('.row-checkbox', dt.rows().nodes()).each(function() {
                  const rowId = $(this).data('id').toString();
                  $(this).prop('checked', selectedRows.includes(rowId));
             });

             // Vérifier si toutes les lignes (filtrées) sont sélectionnées pour cocher/décocher "Select All"
             const filteredIds = dt.rows({ search: 'applied' }).data().toArray().map(row => row._id || row.id);
              const allFilteredSelected = filteredIds.length > 0 && filteredIds.every(id => selectedRows.includes(id));
              $('#select-all-checkbox').prop('checked', allFilteredSelected);
              setAllSelected(allFilteredSelected); // Mettre à jour l'état React de selectAll
         };

         // Appeler syncCheckboxes une fois après l'initialisation
          syncCheckboxes();


        // Nettoyage au démontage
        return () => {
             if (dataTableInstance.current) {
                 dataTableInstance.current.destroy();
                 dataTableInstance.current = null;
             }
             $(tableRef.current).find('tbody').off('click', '.delete-product-btn');
             $('#select-all-checkbox').off('change');
        };
    }, [dataSet, columns, paging, info, searching, lengthChange]); // Recréer si dataSet ou colonnes changent


     // Appliquer le filtre externe searchTerm et les filtres de SelectOption
     useEffect(() => {
         if (dataTableInstance.current) {
             // Appliquer le filtre de recherche global
             dataTableInstance.current.search(searchTerm);

             // Appliquer les filtres de colonnes spécifiques (si nécessaire)
              // Note: DataTables filtre sur les données brutes ou rendues.
              // Pour filtrer efficacement côté client sur des structures complexes (comme la catégorie),
              // il est parfois mieux de le faire avant de passer dataSet à DataTables,
              // ou d'utiliser des fonctions de recherche personnalisées DataTables.

             // Exemple simple de filtre sur la colonne status (index 6, ajustez si colonnes changent)
             dataTableInstance.current.column(6).search(statusFilter ? `^${statusFilter}$` : '', true, false).draw();

             // Exemple pour catégorie (index 2) - suppose que le nom est dans les données rendues
             dataTableInstance.current.column(2).search(categoryFilter ? categoryFilter : '', false, false).draw(); // Recherche simple

            // Exemple pour stock (index 3) - nécessite une logique plus complexe si basé sur quantité
            // Ici, on suppose que le rendu contient "Épuisé" ou "en stock"
             let stockSearchTerm = '';
             if (stockFilter === 'Available') stockSearchTerm = 'en stock'; // Cherche le texte rendu
             else if (stockFilter === 'Empty') stockSearchTerm = 'Épuisé';
             dataTableInstance.current.column(3).search(stockSearchTerm, false, false).draw();


             // Redessiner la table après tous les filtres
             // dataTableInstance.current.draw(); // Les .draw() précédents suffisent
         }
     }, [searchTerm, statusFilter, categoryFilter, stockFilter, dataTableInstance.current]);


    // Synchroniser l'état des checkboxes lors du changement de selectedRows
     useEffect(() => {
         if (dataTableInstance.current) {
             // Synchroniser les checkboxes des lignes visibles
             $('.row-checkbox', dataTableInstance.current.rows({ page: 'current' }).nodes()).each(function() {
                 const rowId = $(this).data('id').toString();
                 $(this).prop('checked', selectedRows.includes(rowId));
             });

             // Mettre à jour "Select All" en fonction des lignes *filtrées*
             const filteredIds = dataTableInstance.current.rows({ search: 'applied' }).data().toArray().map(row => row._id || row.id);
             const allFilteredSelected = filteredIds.length > 0 && filteredIds.every(id => selectedRows.includes(id));
             $('#select-all-checkbox').prop('checked', allFilteredSelected);
             setAllSelected(allFilteredSelected);
         }
     }, [selectedRows, dataTableInstance.current]);


    return (
        <Fragment>
            {/* Afficher le nombre d'éléments sélectionnés si besoin */}
            {/* {selectedRows.length > 0 && <div className="mb-2">{selectedRows.length} produit(s) sélectionné(s)</div>} */}

            <div className="w-full overflow-auto">
                 {/* Donner une largeur minimale si nécessaire pour éviter la compression */}
                 {/* <div className="min-w-[1000px] xl:min-w-full"> */}
                    <div className="tableWrapCustom productList">
                        <table ref={tableRef} className="display compact hover row-border stripe" style={{ width: '100%' }}>
                           {/* DataTables génère thead et tbody */}
                        </table>
                    </div>
                {/* </div> */}
            </div>
        </Fragment>
    );
};

export default DataProductListTable;