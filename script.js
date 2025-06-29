function calculateKcal() {
    // Récupération des valeurs des champs de saisie
    const age = parseFloat(document.getElementById('age').value);
    const weight = parseFloat(document.getElementById('weight').value);
    const height = parseFloat(document.getElementById('height').value);
    const gender = document.getElementById('gender').value;
    const activityFactor = parseFloat(document.getElementById('activity').value);

    // Vérification basique des saisies
    if (isNaN(age) || isNaN(weight) || isNaN(height) || age <= 0 || weight <= 0 || height <= 0) {
        alert("Veuillez entrer des valeurs numériques valides et positives pour l'âge, le poids et la taille.");
        // Réinitialiser tous les résultats si les entrées sont invalides
        document.getElementById('bmrResult').textContent = '--';
        document.getElementById('tdeeResult').textContent = '--';
        document.getElementById('proteinResult').textContent = '--';
        document.getElementById('carbResult').textContent = '--';
        document.getElementById('fatResult').textContent = '--';
        return; // Arrêter la fonction si les entrées sont invalides
    }

    let bmr; // Variable pour stocker le Métabolisme de Base

    // Calcul du Métabolisme de Base (MB) selon la formule de Mifflin-St Jeor
    if (gender === 'male') {
        bmr = (10 * weight) + (6.25 * height) - (5 * age) + 5;
    } else { // female
        bmr = (10 * weight) + (6.25 * height) - (5 * age) - 161;
    }

    // Calcul de la Dépense Énergétique Journalière Totale (DEJT)
    const tdee = bmr * activityFactor;

    // --- CALCUL DES MACRONUTRIMENTS ---
    // Définition des pourcentages par défaut
    const proteinPercentage = 0.25; // 25% des calories totales
    const carbPercentage = 0.45;    // 45% des calories totales
    const fatPercentage = 0.30;     // 30% des calories totales

    // Calcul des calories pour chaque macronutriment
    const proteinKcal = tdee * proteinPercentage;
    const carbKcal = tdee * carbPercentage;
    const fatKcal = tdee * fatPercentage;

    // Conversion des calories en grammes (1g Prot/Gluc = 4kcal, 1g Lip = 9kcal)
    const proteinGrams = proteinKcal / 4;
    const carbGrams = carbKcal / 4;
    const fatGrams = fatKcal / 9;
    // --- FIN DU CALCUL DES MACRONUTRIMENTS ---


    // Affichage des résultats avec un arrondi à l'entier
    document.getElementById('bmrResult').textContent = bmr.toFixed(0);
    document.getElementById('tdeeResult').textContent = tdee.toFixed(0);

    // Affichage des macronutriments (arrondi à l'entier pour la lisibilité)
    document.getElementById('proteinResult').textContent = proteinGrams.toFixed(0);
    document.getElementById('carbResult').textContent = carbGrams.toFixed(0);
    document.getElementById('fatResult').textContent = fatGrams.toFixed(0);
}