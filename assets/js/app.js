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

});
