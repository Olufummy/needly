document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Toggle
    const menuBtn = document.querySelector('.menu-btn');
    const mobileMenu = document.querySelector('.mobile-menu');
    const closeBtn = document.querySelector('.close-btn');
    
    menuBtn.addEventListener('click', () => {
        mobileMenu.classList.add('active');
    });
    
    closeBtn.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
    });
    
    // Hero Slider
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.slider-dots .dot');
    const prevBtn = document.querySelector('.prev-slide');
    const nextBtn = document.querySelector('.next-slide');
    let currentSlide = 0;
    
    function showSlide(index) {
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        slides[index].classList.add('active');
        dots[index].classList.add('active');
        currentSlide = index;
    }
    
    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }
    
    function prevSlide() {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(currentSlide);
    }
    
    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);
    
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => showSlide(index));
    });
    
    // Auto slide change every 5 seconds
    setInterval(nextSlide, 5000);

       // Testimonial Slider
    const testimonials = document.querySelectorAll('.testimonial');
    const testimonialDots = document.querySelectorAll('.testimonial-dots .dot');
    let currentTestimonial = 0;
    
    function showTestimonial(index) {
        testimonials.forEach(testimonial => testimonial.classList.remove('active'));
        testimonialDots.forEach(dot => dot.classList.remove('active'));
        
        testimonials[index].classList.add('active');
        testimonialDots[index].classList.add('active');
        currentTestimonial = index;
    }
    
    testimonialDots.forEach((dot, index) => {
        dot.addEventListener('click', () => showTestimonial(index));
    });
    
    // Auto testimonial change every 7 seconds
    setInterval(() => {
        currentTestimonial = (currentTestimonial + 1) % testimonials.length;
        showTestimonial(currentTestimonial);
    }, 7000);
    
    
    // Product Filter
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            filterBtns.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            btn.classList.add('active');
            
            const filter = btn.getAttribute('data-filter');
            const products = document.querySelectorAll('#all-products .product-card');
            
            products.forEach(product => {
                if (filter === 'all' || product.getAttribute('data-category') === filter) {
                    product.style.display = 'block';
                } else {
                    product.style.display = 'none';
                }
            });
        });
    });
    
    // Cart Functionality
    const cartBtn = document.querySelector('.cart-btn');
    const cartSidebar = document.querySelector('.cart-sidebar');
    const closeCartBtn = document.querySelector('.close-cart');
    let cart = [];
    
    // Toggle Cart Sidebar
    cartBtn.addEventListener('click', () => {
        cartSidebar.classList.add('active');
    });
    
    closeCartBtn.addEventListener('click', () => {
        cartSidebar.classList.remove('active');
    });
    
    // Update Cart Count
    function updateCartCount() {
        const count = cart.reduce((total, item) => total + item.quantity, 0);
        document.querySelector('.cart-count').textContent = count;
    }
    
    // Update Cart Total
    function updateCartTotal() {
        const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        document.querySelector('.subtotal').textContent = `₦${subtotal.toFixed(2)}`;
    }
    
    // Render Cart Items
    function renderCartItems() {
        const cartItemsContainer = document.querySelector('.cart-items');
        cartItemsContainer.innerHTML = '';
        
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p>Your cart is empty</p>';
            return;
        }
        
        cart.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="cart-item-details">
                    <h4 class="cart-item-title">${item.name}</h4>
                    <p class="cart-item-price">₦${item.price.toFixed(2)}</p>
                    <div class="cart-item-quantity">
                        <button class="decrease-quantity">-</button>
                        <input type="text" value="${item.quantity}" readonly>
                        <button class="increase-quantity">+</button>
                    </div>
                </div>
                <div class="remove-item">&times;</div>
            `;
            
            cartItemsContainer.appendChild(cartItem);
            
            // Add event listeners for quantity changes
            const decreaseBtn = cartItem.querySelector('.decrease-quantity');
            const increaseBtn = cartItem.querySelector('.increase-quantity');
            const removeBtn = cartItem.querySelector('.remove-item');
            
            decreaseBtn.addEventListener('click', () => {
                if (item.quantity > 1) {
                    item.quantity--;
                    renderCartItems();
                    updateCartCount();
                    updateCartTotal();
                }
            });
            
            increaseBtn.addEventListener('click', () => {
                item.quantity++;
                renderCartItems();
                updateCartCount();
                updateCartTotal();
            });
            
            removeBtn.addEventListener('click', () => {
                cart = cart.filter(cartItem => cartItem.id !== item.id);
                renderCartItems();
                updateCartCount();
                updateCartTotal();
            });
        });
    }
    
    // Product Modal
    const modal = document.querySelector('.modal');
    const closeModal = document.querySelector('.close-modal');
    const modalContent = document.querySelector('.modal-product-details');
    
    function openProductModal(product) {
        modalContent.innerHTML = `
            <div class="modal-product-image">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="modal-product-info">
                <h2>${product.name}</h2>
                <p class="modal-product-price">₦${product.price.toFixed(2)}</p>
                <div class="modal-product-rating">
                    ${'<i class="fas fa-star"></i>'.repeat(Math.floor(product.rating))}
                    ${product.rating % 1 ? '<i class="fas fa-star-half-alt"></i>' : ''}
                    ${'<i class="far fa-star"></i>'.repeat(5 - Math.ceil(product.rating))}
                    <span>(${product.reviews} reviews)</span>
                </div>
                <p class="modal-product-description">${product.description}</p>
                <div class="quantity-selector">
                    <button class="decrease-qty">-</button>
                    <input type="text" value="1" min="1" class="qty-input">
                    <button class="increase-qty">+</button>
                </div>
                <div class="modal-product-actions">
                    <button class="btn add-to-cart-modal">Add to Cart</button>
                    <button class="btn buy-now">Buy Now</button>
                </div>
            </div>
        `;
        
        modal.classList.add('active');
        
        // Quantity selector in modal
        const decreaseQty = modalContent.querySelector('.decrease-qty');
        const increaseQty = modalContent.querySelector('.increase-qty');
        const qtyInput = modalContent.querySelector('.qty-input');
        
        decreaseQty.addEventListener('click', () => {
            if (parseInt(qtyInput.value) > 1) {
                qtyInput.value = parseInt(qtyInput.value) - 1;
            }
        });
        
        increaseQty.addEventListener('click', () => {
            qtyInput.value = parseInt(qtyInput.value) + 1;
        });
        
        // Add to cart from modal
        const addToCartModal = modalContent.querySelector('.add-to-cart-modal');
        addToCartModal.addEventListener('click', () => {
            addToCart(product, parseInt(qtyInput.value));
            modal.classList.remove('active');
        });
    }
    
    closeModal.addEventListener('click', () => {
        modal.classList.remove('active');
    });
    
    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });
    
    // Add to Cart Function
    function addToCart(product, quantity = 1) {
        const existingItem = cart.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.push({
                ...product,
                quantity: quantity
            });
        }
        
        renderCartItems();
        updateCartCount();
        updateCartTotal();
        cartSidebar.classList.add('active');
    }
    
    // Render Products
    function renderProducts(products, containerId) {
        const container = document.getElementById(containerId);
        container.innerHTML = '';
        
        products.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            productCard.setAttribute('data-category', product.category);
            
            productCard.innerHTML = `
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}">
                    ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
                </div>
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <div class="product-price">₦${product.price.toFixed(2)}</div>
                    <div class="product-rating">
                        ${'<i class="fas fa-star"></i>'.repeat(Math.floor(product.rating))}
                        ${product.rating % 1 ? '<i class="fas fa-star-half-alt"></i>' : ''}
                        ${'<i class="far fa-star"></i>'.repeat(5 - Math.ceil(product.rating))}
                    </div>
                    <div class="product-actions">
                        <button class="quick-view-btn">Quick View</button>
                        <button class="add-to-cart-btn">Add to Cart</button>
                    </div>
                </div>
            `;
            
            container.appendChild(productCard);
            
            // Add event listeners
            const quickViewBtn = productCard.querySelector('.quick-view-btn');
            const addToCartBtn = productCard.querySelector('.add-to-cart-btn');
            
            quickViewBtn.addEventListener('click', () => {
                openProductModal(product);
            });
            
            addToCartBtn.addEventListener('click', () => {
                addToCart(product);
            });
        });
    }
    
    // Load products and render
    renderProducts(featuredProducts, 'featured-products');
    renderProducts(allProducts, 'all-products');
    
    // Header scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            document.querySelector('.header').classList.add('scrolled');
        } else {
            document.querySelector('.header').classList.remove('scrolled');
        }
    });
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                mobileMenu.classList.remove('active');
            }
        });
    });
});
