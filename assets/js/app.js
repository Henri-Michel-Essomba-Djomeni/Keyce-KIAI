// ============================================================
//  KEYCE KIAI — LOGIQUE DU FORMULAIRE D'ENREGISTREMENT
//  Validation côté client + envoi via Fetch API
// ============================================================

document.addEventListener('DOMContentLoaded', () => {

    // --- Références DOM ---
    const form        = document.getElementById('registration-form');
    const btnSubmit   = document.getElementById('btn-submit');
    const feedback    = document.getElementById('feedback-message');
    const feedbackMsg = document.getElementById('feedback-text');
    const feedbackIcon = document.getElementById('feedback-icon-svg');
    const memberSearch = document.getElementById('member-search');
    const groupSearch  = document.getElementById('group-search');

    // États de l'application
    let allMembers = [];
    let allGroups = [];

    // Champs du formulaire
    const fields = {
        nom:       document.getElementById('nom'),
        prenom:    document.getElementById('prenom'),
        telephone: document.getElementById('telephone')
    };

    // --- Constantes de validation ---
    const PHONE_MIN_LENGTH = 8;
    const PHONE_MAX_LENGTH = 15;
    const PHONE_REGEX = /^\+?[0-9]{8,15}$/;
    const API_URL = '/Keyce-KIAI/insert_membre.php';
    const GET_MEMBRES_URL = '/Keyce-KIAI/get_membres.php';
    const CREATE_GROUP_URL = '/Keyce-KIAI/create_group.php';
    const GET_GROUPS_URL = '/Keyce-KIAI/get_groups.php';
    const CHAT_URL_BASE = '/Keyce-KIAI/chat.php'; // À adapter selon le travail de votre camarade

    // =========================================================
    //  VALIDATION
    // =========================================================

    /**
     * Valide un champ individuel et affiche/masque l'erreur
     * @param {string} fieldName - Nom du champ (nom, prenom, telephone)
     * @returns {boolean} true si le champ est valide
     */
    function validateField(fieldName) {
        const input = fields[fieldName];
        const value = input.value.trim();
        const group = input.closest('.form-group');
        const hint  = group.querySelector('.error-hint');

        // Réinitialiser l'état d'erreur
        group.classList.remove('has-error');

        // Vérifier que le champ n'est pas vide
        if (!value) {
            group.classList.add('has-error');
            hint.textContent = getEmptyFieldMessage(fieldName);
            return false;
        }

        // Validation spécifique au téléphone
        if (fieldName === 'telephone') {
            // Retirer les espaces pour la validation
            const cleanPhone = value.replace(/\s/g, '');

            if (!PHONE_REGEX.test(cleanPhone)) {
                group.classList.add('has-error');
                if (/[^0-9+\s]/.test(value)) {
                    hint.textContent = 'Le numéro ne doit contenir que des chiffres.';
                } else if (cleanPhone.replace('+', '').length < PHONE_MIN_LENGTH) {
                    hint.textContent = `Minimum ${PHONE_MIN_LENGTH} chiffres requis.`;
                } else if (cleanPhone.replace('+', '').length > PHONE_MAX_LENGTH) {
                    hint.textContent = `Maximum ${PHONE_MAX_LENGTH} chiffres autorisés.`;
                } else {
                    hint.textContent = 'Format de numéro invalide.';
                }
                return false;
            }
        }

        return true;
    }

    /**
     * Retourne le message d'erreur pour un champ vide
     */
    function getEmptyFieldMessage(fieldName) {
        const messages = {
            nom:       'Veuillez saisir votre nom.',
            prenom:    'Veuillez saisir votre prénom.',
            telephone: 'Veuillez saisir votre numéro de téléphone.'
        };
        return messages[fieldName] || 'Ce champ est obligatoire.';
    }

    /**
     * Valide tous les champs du formulaire
     * @returns {boolean} true si tous les champs sont valides
     */
    function validateAll() {
        let isValid = true;
        for (const fieldName of Object.keys(fields)) {
            if (!validateField(fieldName)) {
                isValid = false;
            }
        }
        return isValid;
    }

    // --- Validation en temps réel (au blur) ---
    for (const [fieldName, input] of Object.entries(fields)) {
        input.addEventListener('blur', () => validateField(fieldName));

        // Effacer l'erreur quand l'utilisateur tape
        input.addEventListener('input', () => {
            const group = input.closest('.form-group');
            if (group.classList.contains('has-error')) {
                group.classList.remove('has-error');
            }
        });
    }

    // =========================================================
    //  FEEDBACK (messages de succès / erreur)
    // =========================================================

    /**
     * Affiche le message de feedback
     * @param {string} type - 'success' ou 'error'
     * @param {string} message - Le message à afficher
     */
    function showFeedback(type, message) {
        feedback.classList.remove('success', 'error', 'is-visible');

        // Icône SVG selon le type
        if (type === 'success') {
            feedbackIcon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>';
        } else {
            feedbackIcon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>';
        }

        feedbackMsg.textContent = message;
        feedback.classList.add(type, 'is-visible');

        // Masquer automatiquement après 6 secondes pour les succès
        if (type === 'success') {
            setTimeout(() => hideFeedback(), 6000);
        }
    }

    /**
     * Masque le message de feedback
     */
    function hideFeedback() {
        feedback.classList.remove('is-visible');
    }

    // =========================================================
    //  ÉTAT DU BOUTON (loading)
    // =========================================================

    /**
     * Active/désactive l'état de chargement du bouton
     * @param {boolean} loading - true pour activer le loader
     */
    function setLoading(loading) {
        if (loading) {
            btnSubmit.classList.add('is-loading');
            btnSubmit.disabled = true;
        } else {
            btnSubmit.classList.remove('is-loading');
            btnSubmit.disabled = false;
        }
    }

    // =========================================================
    //  SOUMISSION DU FORMULAIRE
    // =========================================================

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Masquer le feedback précédent
        hideFeedback();

        // Valider tous les champs
        if (!validateAll()) {
            // Focus sur le premier champ en erreur
            const firstError = form.querySelector('.form-group.has-error input');
            if (firstError) firstError.focus();
            return;
        }

        // Préparer les données
        const data = {
            nom:       fields.nom.value.trim(),
            prenom:    fields.prenom.value.trim(),
            telephone: fields.telephone.value.trim().replace(/\s/g, '')
        };

        // Activer le loader
        setLoading(true);

        try {
            // Envoi via Fetch API
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (result.success) {
                // Succès : afficher le message et réinitialiser le formulaire
                showFeedback('success', result.message);
                form.reset();

                // Retirer les classes d'erreur éventuelles
                form.querySelectorAll('.form-group').forEach(group => {
                    group.classList.remove('has-error');
                });

                // Recharger la liste des membres
                loadMembers();

            } else {
                // Erreur côté serveur
                showFeedback('error', result.message || 'Une erreur est survenue.');
            }

        } catch (error) {
            // Erreur réseau
            showFeedback('error', 'Impossible de contacter le serveur. Vérifiez votre connexion.');
            console.error('Erreur d\'envoi :', error);
        } finally {
            // Désactiver le loader dans tous les cas
            setLoading(false);
        }
    });

    // =========================================================
    //  CHARGEMENT DES MEMBRES
    // =========================================================

    const DELETE_MEMBRES_URL = '/Keyce-KIAI/delete_membres.php';
    let selectionMode = false;
    let selectedIds = new Set();

    /**
     * Charge et affiche la liste des membres
     */
    async function loadMembers() {
        const membersList = document.getElementById('members-list');
        const refreshBtn = document.getElementById('refresh-btn');

        // Afficher le chargement
        membersList.innerHTML = '<p class="no-members">Chargement...</p>';
        refreshBtn.disabled = true;
        refreshBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg> Chargement...';

        try {
            const response = await fetch(GET_MEMBRES_URL);
            const result = await response.json();

            if (result.success) {
                allMembers = result.membres;
                renderMembers(allMembers);
            } else {
                membersList.innerHTML = '<p class="no-members">Erreur lors du chargement des membres.</p>';
            }
        } catch (error) {
            console.error('Erreur de chargement des membres:', error);
            membersList.innerHTML = '<p class="no-members">Erreur de connexion. Vérifiez votre réseau.</p>';
        } finally {
            // Réactiver le bouton
            refreshBtn.disabled = false;
            refreshBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg> Actualiser';
        }
    }

    /**
     * Affiche une liste de membres
     * @param {Array} membersToRender 
     */
    function renderMembers(membersToRender) {
        const membersList = document.getElementById('members-list');
        
        if (membersToRender.length === 0) {
            const isSearching = memberSearch.value.trim() !== '';
            membersList.innerHTML = isSearching 
                ? '<div class="no-results"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg><p>Aucun membre ne correspond à votre recherche.</p></div>'
                : '<p class="no-members">Aucun membre enregistré pour le moment.</p>';
            return;
        }

        membersList.innerHTML = membersToRender.map(membre => `
            <div class="member-item ${selectedIds.has(parseInt(membre.id)) ? 'selected' : ''}" data-id="${membre.id}">
                <input type="checkbox" class="member-checkbox" data-id="${membre.id}" ${selectedIds.has(parseInt(membre.id)) ? 'checked' : ''}>
                <div class="member-info">
                    <h3>${membre.nom} ${membre.prenom}</h3>
                    <p>${membre.telephone}</p>
                </div>
                <button class="btn-chat" title="Envoyer un message" data-id="${membre.id}" data-type="member">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                </button>
                <div class="member-date">
                    ${new Date(membre.date_creation).toLocaleDateString('fr-FR')}
                </div>
            </div>
        `).join('');

        attachSelectionEvents();
    }

    /**
     * Filtre les membres en fonction de la recherche
     */
    function filterMembers() {
        const query = memberSearch.value.toLowerCase().trim();
        const filtered = allMembers.filter(m => 
            m.nom.toLowerCase().includes(query) || 
            m.prenom.toLowerCase().includes(query) || 
            m.telephone.includes(query)
        );
        renderMembers(filtered);
    }

    // =========================================================
    //  MODE SÉLECTION
    // =========================================================

    /**
     * Active/désactive le mode sélection
     */
    function toggleSelectionMode() {
        selectionMode = !selectionMode;
        const membersList = document.getElementById('members-list');
        const selectionActions = document.getElementById('selection-actions');
        const selectBtn = document.getElementById('select-btn');
        const selectBtnText = document.getElementById('select-btn-text');

        if (selectionMode) {
            membersList.classList.add('selection-mode');
            selectBtn.classList.add('active');
            selectBtnText.textContent = 'Annuler';
            selectionActions.style.display = 'flex';
        } else {
            membersList.classList.remove('selection-mode');
            selectBtn.classList.remove('active');
            selectBtnText.textContent = 'Sélectionner';
            selectionActions.style.display = 'none';
            // Désélectionner tout
            selectedIds.clear();
            document.querySelectorAll('.member-item.selected').forEach(item => {
                item.classList.remove('selected');
            });
            document.querySelectorAll('.member-checkbox').forEach(cb => {
                cb.checked = false;
            });
        }
    }

    /**
     * Attache les événements de clic sur chaque membre pour la sélection
     */
    function attachSelectionEvents() {
        const memberItems = document.querySelectorAll('.member-item');

        memberItems.forEach(item => {
            item.addEventListener('click', (e) => {
                if (!selectionMode) return;

                const checkbox = item.querySelector('.member-checkbox');
                const id = parseInt(item.dataset.id);

                // Toggle la sélection
                if (selectedIds.has(id)) {
                    selectedIds.delete(id);
                    item.classList.remove('selected');
                    checkbox.checked = false;
                } else {
                    selectedIds.add(id);
                    item.classList.add('selected');
                    checkbox.checked = true;
                }
            });

            // Empêcher le double-toggle quand on clique directement sur la checkbox
            const checkbox = item.querySelector('.member-checkbox');
            checkbox.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = parseInt(item.dataset.id);

                if (checkbox.checked) {
                    selectedIds.add(id);
                    item.classList.add('selected');
                } else {
                    selectedIds.delete(id);
                    item.classList.remove('selected');
                }
            });
        });
    }

    // =========================================================
    //  SUPPRESSION DES MEMBRES
    // =========================================================

    /**
     * Supprime les membres sélectionnés
     */
    async function deleteSelectedMembers() {
        if (selectedIds.size === 0) {
            showFeedback('error', 'Veuillez sélectionner au moins un membre à supprimer.');
            return;
        }

        const count = selectedIds.size;
        const confirmation = confirm(
            `Êtes-vous sûr de vouloir supprimer ${count} membre(s) ?\n\nCette action est irréversible.`
        );

        if (!confirmation) return;

        const deleteBtn = document.getElementById('delete-btn');
        deleteBtn.disabled = true;
        deleteBtn.innerHTML = '<span class="spinner" style="display:block;width:20px;height:20px;border:2.5px solid rgba(255,255,255,0.3);border-top-color:white;border-radius:50%;animation:spin 0.7s linear infinite;"></span> Suppression...';

        try {
            const response = await fetch(DELETE_MEMBRES_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ ids: Array.from(selectedIds) })
            });

            const result = await response.json();

            if (result.success) {
                showFeedback('success', result.message);
                // Quitter le mode sélection et recharger
                selectionMode = true; // force toggleSelectionMode to turn it off
                toggleSelectionMode();
                loadMembers();
            } else {
                showFeedback('error', result.message || 'Erreur lors de la suppression.');
            }
        } catch (error) {
            console.error('Erreur de suppression:', error);
            showFeedback('error', 'Impossible de contacter le serveur.');
        } finally {
            deleteBtn.disabled = false;
            deleteBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg> Supprimer les membres sélectionnés';
        }
    }

    // =========================================================
    //  INITIALISATION
    // =========================================================

    // Charger les membres au chargement de la page
    loadMembers();

    // Bouton d'actualisation
    document.getElementById('refresh-btn').addEventListener('click', loadMembers);

    // Bouton de sélection
    document.getElementById('select-btn').addEventListener('click', toggleSelectionMode);

    // Bouton de suppression
    document.getElementById('delete-btn').addEventListener('click', deleteSelectedMembers);

    // =========================================================
    //  LOGIQUE DES GROUPES
    // =========================================================

    const groupModal = document.getElementById('create-group-modal');
    const groupForm = document.getElementById('create-group-form');
    const createGroupBtn = document.getElementById('create-group-btn');
    const closeModalBtn = document.getElementById('close-modal');
    const DELETE_GROUPS_URL = '/Keyce-KIAI/delete_groups.php';

    let groupSelectionMode = false;
    let selectedGroupIds = new Set();

    /**
     * Active/désactive le mode sélection pour les groupes
     */
    function toggleGroupSelectionMode() {
        groupSelectionMode = !groupSelectionMode;
        const groupsList = document.getElementById('groups-list');
        const selectionActionsGroups = document.getElementById('selection-actions-groups');
        const selectGroupsBtn = document.getElementById('select-groups-btn');
        const selectGroupsBtnText = document.getElementById('select-groups-btn-text');

        if (groupSelectionMode) {
            groupsList.classList.add('selection-mode');
            selectGroupsBtn.classList.add('active');
            if (selectGroupsBtnText) selectGroupsBtnText.textContent = 'Annuler';
            selectionActionsGroups.style.display = 'flex';
        } else {
            groupsList.classList.remove('selection-mode');
            selectGroupsBtn.classList.remove('active');
            if (selectGroupsBtnText) selectGroupsBtnText.textContent = 'Sélectionner';
            selectionActionsGroups.style.display = 'none';
            // Désélectionner tout
            selectedGroupIds.clear();
            document.querySelectorAll('.group-item.selected').forEach(item => {
                item.classList.remove('selected');
            });
            document.querySelectorAll('.group-checkbox').forEach(cb => {
                cb.checked = false;
            });
        }
    }

    /**
     * Charge et affiche les groupes
     */
    async function loadGroups() {
        const groupsList = document.getElementById('groups-list');
        const refreshGroupsBtn = document.getElementById('refresh-groups-btn');

        // Afficher le chargement
        groupsList.innerHTML = '<p class="no-members">Chargement des groupes...</p>';
        if (refreshGroupsBtn) {
            refreshGroupsBtn.disabled = true;
            refreshGroupsBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg> Chargement...';
        }

        try {
            const response = await fetch(GET_GROUPS_URL);
            const result = await response.json();

            if (result.success) {
                allGroups = result.groupes;
                renderGroups(allGroups);
            }
        } catch (error) {
            console.error('Erreur de chargement des groupes:', error);
            groupsList.innerHTML = '<p class="no-members">Erreur lors du chargement des groupes.</p>';
        } finally {
            if (refreshGroupsBtn) {
                refreshGroupsBtn.disabled = false;
                refreshGroupsBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg> Actualiser';
            }
        }
    }

    /**
     * Affiche une liste de groupes
     * @param {Array} groupsToRender 
     */
    function renderGroups(groupsToRender) {
        const groupsList = document.getElementById('groups-list');

        if (groupsToRender.length === 0) {
            const isSearching = groupSearch.value.trim() !== '';
            groupsList.innerHTML = isSearching
                ? '<div class="no-results"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg><p>Aucun groupe ne correspond à votre recherche.</p></div>'
                : '<p class="no-members">Aucun groupe créé pour le moment.</p>';
            return;
        }

        groupsList.innerHTML = groupsToRender.map(group => `
            <div class="group-item ${selectedGroupIds.has(parseInt(group.id)) ? 'selected' : ''}" data-id="${group.id}">
                <input type="checkbox" class="group-checkbox" data-id="${group.id}" ${selectedGroupIds.has(parseInt(group.id)) ? 'checked' : ''}>
                <div class="group-info">
                    <h3>${group.nom}</h3>
                    <p>${group.description || 'Pas de description'}</p>
                </div>
                <button class="btn-chat" title="Ouvrir la discussion" data-id="${group.id}" data-type="group">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                    </svg>
                </button>
                <div class="group-meta">
                    <span class="member-count">
                        <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m5-1.13a4 4 0 100-8 4 4 0 000 8zm6 0a4 4 0 100-8"/>
                        </svg>
                        ${group.nombre_membres} membre(s)
                    </span>
                    <span>Créé le ${new Date(group.date_creation).toLocaleDateString('fr-FR')}</span>
                </div>
            </div>
        `).join('');

        attachGroupSelectionEvents();
    }

    /**
     * Attache les événements de clic sur chaque groupe pour la sélection
     */
    function attachGroupSelectionEvents() {
        const groupItems = document.querySelectorAll('.group-item');

        groupItems.forEach(item => {
            item.addEventListener('click', (e) => {
                if (!groupSelectionMode) return;
                
                // Si on a cliqué sur la checkbox, e.stopPropagation() dans son propre handler gérera ça
                const checkbox = item.querySelector('.group-checkbox');
                if (e.target.type === 'checkbox') return;

                const id = parseInt(item.dataset.id);
                if (selectedGroupIds.has(id)) {
                    selectedGroupIds.delete(id);
                    item.classList.remove('selected');
                    checkbox.checked = false;
                } else {
                    selectedGroupIds.add(id);
                    item.classList.add('selected');
                    checkbox.checked = true;
                }
            });

            const checkbox = item.querySelector('.group-checkbox');
            if (checkbox) {
                checkbox.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const id = parseInt(item.dataset.id);
                    if (checkbox.checked) {
                        selectedGroupIds.add(id);
                        item.classList.add('selected');
                    } else {
                        selectedGroupIds.delete(id);
                        item.classList.remove('selected');
                    }
                });
            }
        });
    }

    /**
     * Supprime les groupes sélectionnés
     */
    async function deleteSelectedGroups() {
        if (selectedGroupIds.size === 0) {
            showFeedback('error', 'Veuillez sélectionner au moins un groupe à supprimer.');
            return;
        }

        const count = selectedGroupIds.size;
        const confirmation = confirm(
            `Êtes-vous sûr de vouloir supprimer ${count} groupe(s) ?\n\nLes membres resteront enregistrés mais ne feront plus partie de ces groupes.`
        );

        if (!confirmation) return;

        const deleteBtn = document.getElementById('delete-groups-btn');
        deleteBtn.disabled = true;
        deleteBtn.innerHTML = '<span class="spinner" style="display:block;width:20px;height:20px;border:2.5px solid rgba(255,255,255,0.3);border-top-color:white;border-radius:50%;animation:spin 0.7s linear infinite;"></span> Suppression...';

        try {
            const response = await fetch(DELETE_GROUPS_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ids: Array.from(selectedGroupIds) })
            });

            const result = await response.json();

            if (result.success) {
                showFeedback('success', result.message);
                groupSelectionMode = true; // force toggle off
                toggleGroupSelectionMode();
                loadGroups();
            } else {
                showFeedback('error', result.message || 'Erreur lors de la suppression.');
            }
        } catch (error) {
            console.error('Erreur:', error);
            showFeedback('error', 'Impossible de contacter le serveur.');
        } finally {
            deleteBtn.disabled = false;
            deleteBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg> Supprimer les groupes';
        }
    }

    /**
     * Filtre les groupes en fonction de la recherche
     */
    function filterGroups() {
        const query = groupSearch.value.toLowerCase().trim();
        const filtered = allGroups.filter(g => 
            g.nom.toLowerCase().includes(query) || 
            (g.description && g.description.toLowerCase().includes(query))
        );
        renderGroups(filtered);
    }

    /**
     * Ouvre la modale de création de groupe
     */
    function openCreateGroupModal() {
        if (selectedIds.size === 0) {
            showFeedback('error', 'Veuillez sélectionner au moins un membre pour créer un groupe.');
            return;
        }

        const selectedCount = document.getElementById('selected-count');
        const previewList = document.getElementById('selected-members-preview');

        selectedCount.textContent = selectedIds.size;

        // Récupérer les noms des membres sélectionnés depuis le DOM
        const selectedMembers = Array.from(selectedIds).map(id => {
            const item = document.querySelector(`.member-item[data-id="${id}"]`);
            return item ? item.querySelector('h3').textContent : 'Membre inconnu';
        });

        previewList.innerHTML = selectedMembers.map(name => `
            <span class="member-tag">${name}</span>
        `).join('');

        groupModal.classList.add('is-active');
    }

    /**
     * Ferme la modale
     */
    function closeCreateGroupModal() {
        groupModal.classList.remove('is-active');
        groupForm.reset();
    }

    /**
     * Soumission du formulaire de création de groupe
     */
    groupForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const submitBtn = groupForm.querySelector('button[type="submit"]');
        const nom = document.getElementById('group-nom').value.trim();
        const description = document.getElementById('group-description').value.trim();

        if (!nom) return;

        submitBtn.classList.add('is-loading');
        submitBtn.disabled = true;

        try {
            const response = await fetch(CREATE_GROUP_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    nom,
                    description,
                    membre_ids: Array.from(selectedIds)
                })
            });

            const result = await response.json();

            if (result.success) {
                showFeedback('success', result.message);
                closeCreateGroupModal();
                // Désactiver le mode sélection
                selectionMode = true; 
                toggleSelectionMode();
                // Recharger les groupes
                loadGroups();
            } else {
                showFeedback('error', result.message || 'Erreur lors de la création du groupe.');
            }
        } catch (error) {
            console.error('Erreur:', error);
            showFeedback('error', 'Impossible de contacter le serveur.');
        } finally {
            submitBtn.classList.remove('is-loading');
            submitBtn.disabled = false;
        }
    });

    // Événements
    createGroupBtn.addEventListener('click', openCreateGroupModal);
    closeModalBtn.addEventListener('click', closeCreateGroupModal);
    document.getElementById('refresh-groups-btn').addEventListener('click', loadGroups);
    document.getElementById('select-groups-btn').addEventListener('click', toggleGroupSelectionMode);
    document.getElementById('delete-groups-btn').addEventListener('click', deleteSelectedGroups);

    // Événements de recherche
    memberSearch.addEventListener('input', filterMembers);
    groupSearch.addEventListener('input', filterGroups);

    // Initialisation
    loadGroups();

    // Gestion de la redirection vers le chat (Délégation d'événements)
    document.addEventListener('click', (e) => {
        const btnChat = e.target.closest('.btn-chat');
        if (!btnChat) return;

        e.preventDefault();
        e.stopPropagation();

        const id = btnChat.dataset.id;
        const type = btnChat.dataset.type;

        // Redirection vers l'interface de messagerie
        window.location.href = `${CHAT_URL_BASE}?id=${id}&type=${type}`;
    });

});

