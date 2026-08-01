document.addEventListener('DOMContentLoaded', () => {
    // État du panier
    let cart = [];

    // Éléments du DOM
    const cartBtn = document.getElementById('cartBtn');
    const cartModal = document.getElementById('cartModal');
    const closeModal = document.getElementById('closeModal');
    const cartItemsContainer = document.getElementById('cartItems');
    const cartCount = document.getElementById('cartCount');
    const cartTotal = document.getElementById('cartTotal');
    const checkoutBtn = document.getElementById('checkoutBtn');

    // Menu Mobile
    const mobileMenuBtn = document.getElementById('mobile-menu');
    const navLinks = document.getElementById('nav-links');

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => navLinks.classList.toggle('active'));
    }

    // Ouvrir / Fermer le panier
    cartBtn.addEventListener('click', () => cartModal.classList.add('active'));
    closeModal.addEventListener('click', () => cartModal.classList.remove('active'));

    // Fermer le modal en cliquant à l'extérieur
    window.addEventListener('click', (e) => {
        if (e.target === cartModal) cartModal.classList.remove('active');
    });

    // Ajouter un produit au panier
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', () => {
            const id = button.getAttribute('data-id');
            const name = button.getAttribute('data-name');
            const price = parseFloat(button.getAttribute('data-price'));

            // Vérifier si le produit est déjà dans le panier
            const existingItem = cart.find(item => item.id === id);

            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({ id, name, price, quantity: 1 });
            }

            updateCartUI();
        });
    });

    // Mettre à jour l'affichage du panier
    function updateCartUI() {
        // Compteur total d'articles
        const totalArticles = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalArticles;

        // Vider le conteneur du panier
        cartItemsContainer.innerHTML = '';

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p style="text-align:center; color:#64748b;">Votre panier est vide.</p>';
            cartTotal.textContent = '0.00';
            return;
        }

        let totalPrice = 0;

        // Remplir les articles
        cart.forEach(item => {
            totalPrice += item.price * item.quantity;

            const itemElement = document.createElement('div');
            itemElement.classList.add('cart-item');
            itemElement.innerHTML = `
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p>${item.price.toFixed(2)} € x ${item.quantity}</p>
                </div>
                <button class="remove-btn" data-id="${item.id}">
                    <i class="fa-solid fa-trash"></i>
                </button>
            `;
            cartItemsContainer.appendChild(itemElement);
        });

        cartTotal.textContent = totalPrice.toFixed(2);

        // Attacher les événements de suppression
        document.querySelectorAll('.remove-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idToRemove = e.currentTarget.getAttribute('data-id');
                cart = cart.filter(item => item.id !== idToRemove);
                updateCartUI();
            });
        });
    }

    // Validation de commande (Simulation)
    checkoutBtn.addEventListener('click', () => {
        if (cart.length === 0) {
            alert('Votre panier est vide !');
            return;
        }
        alert('Merci pour votre commande ! Vos articles seront bientôt expédiés.');
        cart = [];
        updateCartUI();
        cartModal.classList.remove('active');
    });
});
document.addEventListener('DOMContentLoaded', () => {
    // Récupérer le panier depuis le stockage local (LocalStorage)
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

    // Sauvegarder dans LocalStorage
    function saveCart() {
        localStorage.setItem('eshop_cart', JSON.stringify(cart));
        updateCartUI();
    }

    // Ajouter un produit
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

    // Mettre à jour l'affichage
    function updateCartUI() {
        if (!cartCount || !cartItemsContainer || !cartTotal) return;

        const totalArticles = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalArticles;

        cartItemsContainer.innerHTML = '';

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p style="text-align:center; color:#64748b;">Votre panier est vide.</p>';
            cartTotal.textContent = '0.00';
            return;
        }

        let totalPrice = 0;

        cart.forEach(item => {
            totalPrice += item.price * item.quantity;

            const itemElement = document.createElement('div');
            itemElement.classList.add('cart-item');
            itemElement.innerHTML = `
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p>${item.price.toFixed(2)} € x ${item.quantity}</p>
                </div>
                <button class="remove-btn" data-id="${item.id}">
                    <i class="fa-solid fa-trash"></i>
                </button>
            `;
            cartItemsContainer.appendChild(itemElement);
        });

        cartTotal.textContent = totalPrice.toFixed(2);

        document.querySelectorAll('.remove-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idToRemove = e.currentTarget.getAttribute('data-id');
                cart = cart.filter(item => item.id !== idToRemove);
                saveCart();
            });
        });
    }

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

    // Formulaire de contact
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

    // Initialiser au chargement
    updateCartUI();
});