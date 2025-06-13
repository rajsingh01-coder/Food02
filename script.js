 // Order management
        let orders = [];
        let orderIdCounter = 1;

        // Navigation functionality
        function navigateToSection(sectionName) {
            // Hide all sections
            document.querySelectorAll('.section').forEach(section => {
                section.classList.remove('active');
            });
            
            // Show target section
            document.getElementById(sectionName).classList.add('active');
            
            // Update nav links
            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.remove('active');
            });
            document.querySelectorAll('.mobile-nav-item').forEach(item => {
                item.classList.remove('active');
            });
            
            // Add active class to current nav items
            document.querySelector(`[data-section="${sectionName}"]`).classList.add('active');
            document.querySelector(`.mobile-nav-item[data-section="${sectionName}"]`).classList.add('active');
            
            // Hide all menu items when navigating away from service
            if (sectionName !== 'service') {
                document.querySelectorAll('.menu-items').forEach(menu => {
                    menu.classList.remove('active');
                });
            }
        }

               let activeMenuCategory = null;

        function showMenuItems(category) {
            // Hide all menu items first
            const allMenus = document.querySelectorAll('.menu-items');
            allMenus.forEach(menu => {
                menu.classList.remove('active');
            });

            // Show selected category menu
            const selectedMenu = document.getElementById(`${category}-menu`);
            if (selectedMenu) {
                selectedMenu.classList.add('active');
                activeMenuCategory = category;
                
                // Smooth scroll to menu section
                selectedMenu.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'start' 
                });
            }
        }

        function addToOrder(itemName, price, emoji) {
            // You can implement your cart functionality here
            console.log(`Added to order: ${itemName} - ${price}`);
            
            // Simple feedback for now
            const button = event.target;
            const originalText = button.innerHTML;
            button.innerHTML = '✅ Added!';
            button.style.background = '#28a745';
            
            setTimeout(() => {
                button.innerHTML = originalText;
                button.style.background = '';
            }, 1500);
        }

        // Lazy loading for better performance
        function lazyLoadImages() {
            const images = document.querySelectorAll('.category-image');
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.classList.remove('lazy');
                            imageObserver.unobserve(img);
                        }
                    }
                });
            });

            images.forEach(img => {
                if (img.dataset.src) {
                    imageObserver.observe(img);
                }
            });
        }

        // Initialize lazy loading when DOM is ready
        document.addEventListener('DOMContentLoaded', lazyLoadImages);

        // Event listeners for navigation
        document.querySelectorAll('.nav-link, .mobile-nav-item').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = link.getAttribute('data-section');
                navigateToSection(section);
            });
        });

        // Show menu items based on category
        function showMenuItems(category) {
            // Hide all menu categories
            document.querySelectorAll('.menu-items').forEach(menu => {
                menu.classList.remove('active');
            });
            
            // Show selected category
            const targetMenu = document.getElementById(category + '-menu');
            if (targetMenu) {
                targetMenu.classList.add('active');
                targetMenu.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }

        // Add item to order
        function addToOrder(name, price, emoji) {
            const order = {
                id: orderIdCounter++,
                name: name,
                price: price,
                emoji: emoji,
                quantity: 1
            };
            
            // Check if item already exists in order
            const existingOrderIndex = orders.findIndex(item => item.name === name);
            if (existingOrderIndex !== -1) {
                orders[existingOrderIndex].quantity += 1;
            } else {
                orders.push(order);
            }
            
            updateOrderDisplay();
            
            // Show success animation
            showOrderSuccess(name);
        }

        // Remove item from order
        function removeFromOrder(orderId) {
            orders = orders.filter(order => order.id !== orderId);
            updateOrderDisplay();
        }

        // Update order display
        function updateOrderDisplay() {
            const orderList = document.getElementById('orderList');
            
            if (orders.length === 0) {
                orderList.innerHTML = `
                    <div class="empty-order">
                        <h3>No orders yet!</h3>
                        <p>Start by browsing our delicious menu items.</p>
                    </div>
                `;
                return;
            }
            
            let totalPrice = 0;
            orderList.innerHTML = orders.map(order => {
                const itemTotal = order.price * order.quantity;
                totalPrice += itemTotal;
                
                return `
                    <div class="order-item">
                        <div class="order-item-image">${order.emoji}</div>
                        <div class="order-item-details">
                            <h3>${order.name}</h3>
                            <p>Quantity: ${order.quantity}</p>
                            <div class="order-item-price">${itemTotal.toFixed(2)}</div>
                            <button class="remove-btn" onclick="removeFromOrder(${order.id})">Remove</button>
                        </div>
                    </div>
                `;
            }).join('') + `
                <div class="order-item" style="background: linear-gradient(135deg, #667eea, #764ba2); color: white; text-align: center;">
                    <h2>Total: ${totalPrice.toFixed(2)}</h2>
                    <button class="cta-button" style="margin-top: 1rem;" onclick="processOrder()">Proceed to Checkout</button>
                </div>
            `;
        }

        // Show order success animation
        function showOrderSuccess(itemName) {
            // Create success notification
            const notification = document.createElement('div');
            notification.style.cssText = `
                position: fixed;
                top: 100px;
                right: 20px;
                background: linear-gradient(135deg, #4CAF50, #45a049);
                color: white;
                padding: 1rem 2rem;
                border-radius: 10px;
                box-shadow: 0 5px 20px rgba(0,0,0,0.3);
                z-index: 10000;
                transform: translateX(400px);
                transition: all 0.3s ease;
                font-weight: bold;
            `;
            notification.innerHTML = `✅ ${itemName} added to cart!`;
            document.body.appendChild(notification);
            
            // Animate in
            setTimeout(() => {
                notification.style.transform = 'translateX(0)';
            }, 100);
            
            // Animate out and remove
            setTimeout(() => {
                notification.style.transform = 'translateX(400px)';
                setTimeout(() => {
                    document.body.removeChild(notification);
                }, 300);
            }, 3000);
        }

        // Process order (placeholder function)
        function processOrder() {
            alert('Order processed! Thank you for choosing FoodExpress. Your order will be delivered in 30 minutes.');
            orders = [];
            updateOrderDisplay();
        }

        // Smooth scrolling for internal links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Add scroll effect to header
        window.addEventListener('scroll', () => {
            const header = document.querySelector('.header');
            if (window.scrollY > 100) {
                header.style.background = 'linear-gradient(135deg, rgba(255,107,107,0.95), rgba(238,90,36,0.95))';
                header.style.backdropFilter = 'blur(10px)';
            } else {
                header.style.background = 'linear-gradient(135deg, #ff6b6b, #ee5a24)';
                header.style.backdropFilter = 'none';
            }
        });

        // Initialize the website
        document.addEventListener('DOMContentLoaded', () => {
            // Add loading animation
            document.body.style.opacity = '0';
            setTimeout(() => {
                document.body.style.transition = 'opacity 1s ease';
                document.body.style.opacity = '1';
            }, 100);
            
            // Initialize order display
            updateOrderDisplay();
        });

        // Add keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                // Hide all menu items
                document.querySelectorAll('.menu-items').forEach(menu => {
                    menu.classList.remove('active');
                });
            }
        });

        // Add touch gestures for mobile
        let touchStartX = 0;
        let touchEndX = 0;

        document.addEventListener('touchstart', e => {
            touchStartX = e.changedTouches[0].screenX;
        });

        document.addEventListener('touchend', e => {
            touchEndX = e.changedTouches[0].screenX;
            handleGesture();
        });

        function handleGesture() {
            const threshold = 100;
            const sections = ['home', 'order', 'service', 'about'];
            const currentSection = document.querySelector('.section.active').id;
            const currentIndex = sections.indexOf(currentSection);
            
            if (touchEndX < touchStartX - threshold && currentIndex < sections.length - 1) {
                // Swipe left - next section
                navigateToSection(sections[currentIndex + 1]);
            }
            
            if (touchEndX > touchStartX + threshold && currentIndex > 0) {
                // Swipe right - previous section
                navigateToSection(sections[currentIndex - 1]);
            }
        }

        // Add intersection observer for animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animation = 'slideInUp 0.6s ease forwards';
                }
            });
        }, observerOptions);

        // Observe all menu items and order items
        document.querySelectorAll('.menu-item, .order-item, .category-card, .feature').forEach(el => {
            observer.observe(el);
        });

          // Enhanced navigation functionality with ripple effect
        document.querySelectorAll('.mobile-nav-item').forEach(item => {
            item.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Create ripple effect
                const ripple = document.createElement('span');
                const rect = this.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;
                
                ripple.style.width = ripple.style.height = size + 'px';
                ripple.style.left = x + 'px';
                ripple.style.top = y + 'px';
                ripple.classList.add('ripple');
                
                this.appendChild(ripple);
                
                // Remove ripple after animation
                setTimeout(() => {
                    ripple.remove();
                }, 600);
                
                // Update active state
                document.querySelectorAll('.mobile-nav-item').forEach(navItem => {
                    navItem.classList.remove('active');
                });
                
                this.classList.add('active');
                
                const section = this.getAttribute('data-section');
                console.log('Navigated to:', section);
                
                // Add subtle haptic feedback simulation
                if (navigator.vibrate) {
                    navigator.vibrate(50);
                }
            });
        });

        // Add smooth scroll behavior
        document.documentElement.style.scrollBehavior = 'smooth';

        