document.addEventListener('DOMContentLoaded', () => {
    let cart = JSON.parse(localStorage.getItem('eshop_cart')) || [];

    const cartBtn = document.getElementById('cartBtn');
    const cartModal = document.getElementById('cartModal');
    const closeModal = document.getElementById('closeModal');
    const cartItemsContainer = document.getElementById('cartItems');
    const cartCount = document.getElementById('cartCount');
    const cartTotal = document.getElementById('cartTotal');
    const checkoutBtn = document.getElementById('checkoutBtn');
    const mobileMenuBtn = document.getElementById('mobile-menu');
    const navLinks = document.getElementById('nav-links');

    function formatCfaAmount(amount) {
        return `${Math.round(amount).toLocaleString('fr-FR')}`;
    }

    function saveCart() {
        localStorage.setItem('eshop_cart', JSON.stringify(cart));
        updateCartUI();
    }

    function updateCartUI() {
        if (!cartCount || !cartItemsContainer || !cartTotal) return;

        const totalArticles = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalArticles;
        cartItemsContainer.innerHTML = '';

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p style="text-align:center; color:#64748b;">Votre panier est vide.</p>';
            cartTotal.textContent = '0';
            return;
        }

        let totalPrice = 0;

        cart.forEach(item => {
            totalPrice += item.price * item.quantity;
            const itemElement = document.createElement('div');
            itemElement.classList.add('cart-item');
            const lineTotalCfa = formatCfaAmount(item.price * item.quantity);
            const quantityLabel = item.quantity > 1 ? ` (${item.quantity} articles)` : '';
            itemElement.innerHTML = `
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p>${lineTotalCfa} FCFA${quantityLabel}</p>
                </div>
                <button class="remove-btn" data-id="${item.id}">
                    <i class="fa-solid fa-trash"></i>
                </button>
            `;
            cartItemsContainer.appendChild(itemElement);
        });

        cartTotal.textContent = formatCfaAmount(totalPrice);

        document.querySelectorAll('.remove-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idToRemove = e.currentTarget.getAttribute('data-id');
                cart = cart.filter(item => item.id !== idToRemove);
                saveCart();
            });
        });
    }

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => navLinks.classList.toggle('active'));
    }

    if (cartBtn && cartModal && closeModal) {
        cartBtn.addEventListener('click', () => cartModal.classList.add('active'));
        closeModal.addEventListener('click', () => cartModal.classList.remove('active'));
        window.addEventListener('click', (e) => {
            if (e.target === cartModal) cartModal.classList.remove('active');
        });
    }

    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', () => {
            const id = button.getAttribute('data-id');
            const name = button.getAttribute('data-name');
            const price = parseFloat(button.getAttribute('data-price'));
            const existingItem = cart.find(item => item.id === id);
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({ id, name, price, quantity: 1 });
            }
            saveCart();
        });
    });

    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            if (cart.length === 0) {
                alert('Votre panier est vide !');
                return;
            }
            alert('Merci pour votre commande ! Vos articles seront bientôt expédiés.');
            cart = [];
            saveCart();
            if (cartModal) cartModal.classList.remove('active');
        });
    }

    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            formStatus.className = 'form-status success';
            formStatus.style.display = 'block';
            formStatus.textContent = 'Votre message a bien été envoyé. Notre équipe vous répondra sous 24h.';
            contactForm.reset();
        });
    }

    updateCartUI();

    function commanderSurWhatsApp() {
  // 1. Ton numéro WhatsApp au format international (ex: 241 pour le Gabon + ton numéro)
  const monNumeroWhatsApp = "+241 62367356"; 

  // 2. Vérifier si le panier contient des articles
  if (!cart || cart.length === 0) {
    alert("Votre panier est vide !");
    return;
  }

  // 3. En-tête du message
  let message = "🛍️ *NOUVELLE COMMANDE E-SHOPSTORE*\n";
  message += "----------------------------------------\n\n";
  message += "*Détails de la commande :*\n";

  let totalGeneral = 0;

  // 4. Parcourir les articles du panier
  cart.forEach((item, index) => {
    const sousTotal = item.price * item.quantity;
    totalGeneral += sousTotal;
    
    message += `${index + 1}. *${item.name}*\n`;
    message += `   • Quantité : ${item.quantity}\n`;
    message += `   • Prix unitaire : ${item.price.toLocaleString()} FCFA\n`;
    message += `   • Sous-total : ${sousTotal.toLocaleString()} FCFA\n\n`;
  });

  // 5. Total général et instructions
  message += "----------------------------------------\n";
  message += `💰 *TOTAL À PAYER : ${totalGeneral.toLocaleString()} FCFA*\n`;
  message += "----------------------------------------\n\n";
  message += "Merci de me confirmer la disponibilité des articles et les modalités de livraison !";

  // 6. Encodage du texte pour l'URL WhatsApp
  const messageEncode = encodeURIComponent(message);
  
  // 7. Génération du lien d'envoi WhatsApp
  const urlWhatsApp = `https://wa.me/${monNumeroWhatsApp}?text=${messageEncode}`;

  // 8. Ouverture de WhatsApp dans un nouvel onglet
  window.open(urlWhatsApp, '_blank');
}
});
