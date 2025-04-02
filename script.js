// Estado de la aplicación
const AppState = {
    favorites: [],
    categories: [],
    currentTheme: 'light',
    customColors: {
        text: null,
        background: null
    }
};

// Configuración de la aplicación
const AppConfig = {
    themes: {
        light: {
            icon: 'fa-moon',
            label: 'Cambiar a modo oscuro',
            textColor: '#2d3436',
            backgroundColor: '#f8f9fa',
            cardBackground: 'rgba(255, 255, 255, 0.8)'
        },
        dark: {
            icon: 'fa-sun',
            label: 'Cambiar a modo claro',
            textColor: '#ffffff',
            backgroundColor: '#1a1a1a',
            cardBackground: 'rgba(30, 30, 30, 0.8)'
        }
    },
    defaultCategoryIcons: {
        'Videos': 'fa-video',
        'Desarrollo': 'fa-code',
        'Noticias': 'fa-newspaper',
        'Compras': 'fa-shopping-cart',
        'Redes Sociales': 'fa-share-alt',
        'Educación': 'fa-graduation-cap',
        'Juegos': 'fa-gamepad',
        'Música': 'fa-music',
        'Imágenes': 'fa-image',
        'Productividad': 'fa-tasks',
        'Finanzas': 'fa-wallet',
        'Salud': 'fa-heartbeat',
        'Deportes': 'fa-futbol',
        'Cocina': 'fa-utensils',
        'Viajes': 'fa-plane'
    }
};

// Gestión del DOM
const DOM = {
    elements: {},
    
    init() {
        this.elements = {
            categoriesList: document.getElementById('categories-list'),
            favoritesGrid: document.getElementById('favorites-grid'),
            addFavoriteModal: document.getElementById('addFavoriteModal'),
            addCategoryModal: document.getElementById('addCategoryModal'),
            editCategoryModal: document.getElementById('editCategoryModal'),
            addFavoriteForm: document.getElementById('addFavoriteForm'),
            addCategoryForm: document.getElementById('addCategoryForm'),
            editCategoryForm: document.getElementById('editCategoryForm'),
            importBtn: document.getElementById('importBtn'),
            addNewBtn: document.getElementById('addNewBtn'),
            addCategoryBtn: document.getElementById('addCategoryBtn'),
            cancelAddBtn: document.getElementById('cancelAddBtn'),
            cancelCategoryBtn: document.getElementById('cancelCategoryBtn'),
            cancelEditCategoryBtn: document.getElementById('cancelEditCategoryBtn'),
            themeToggle: document.getElementById('themeToggle'),
            textColorPicker: document.getElementById('textColorPicker'),
            backgroundColorPicker: document.getElementById('backgroundColorPicker'),
            resetTextColor: document.getElementById('resetTextColor'),
            resetBackgroundColor: document.getElementById('resetBackgroundColor'),
            settingsPanel: document.querySelector('.settings-panel'),
            openSettingsBtn: document.getElementById('openSettings'),
            closeSettingsBtn: document.getElementById('closeSettings')
        };
    },

    showModal(modal) {
        if (modal) {
            modal.style.display = 'block';
            modal.classList.add('active');
        }
    },

    hideModal(modal) {
        if (modal) {
            modal.style.display = 'none';
            modal.classList.remove('active');
        }
    },

    resetForm(form) {
        if (form) {
            form.reset();
            delete form.dataset.editId;
            const submitBtn = form.querySelector('button[type="submit"]');
            if (submitBtn) submitBtn.textContent = 'Guardar';
        }
    }
};

// Gestión de datos
const DataManager = {
    loadData() {
        try {
            const savedFavorites = localStorage.getItem('favorites');
            const savedCategories = localStorage.getItem('categories');
            const savedTheme = localStorage.getItem('theme');
            const savedCustomColors = localStorage.getItem('customColors');
            
            if (savedFavorites) AppState.favorites = JSON.parse(savedFavorites);
            if (savedCategories) AppState.categories = JSON.parse(savedCategories);
            if (savedTheme) AppState.currentTheme = savedTheme;
            if (savedCustomColors) AppState.customColors = JSON.parse(savedCustomColors);
            
            return true;
        } catch (error) {
            console.error('Error al cargar datos:', error);
            return false;
        }
    },

    saveData() {
        try {
            localStorage.setItem('favorites', JSON.stringify(AppState.favorites));
            localStorage.setItem('categories', JSON.stringify(AppState.categories));
            localStorage.setItem('theme', AppState.currentTheme);
            localStorage.setItem('customColors', JSON.stringify(AppState.customColors));
            return true;
        } catch (error) {
            console.error('Error al guardar datos:', error);
            return false;
        }
    }
};

// Gestión de temas y colores
const ThemeManager = {
    setTheme(theme) {
        try {
            if (!AppConfig.themes[theme]) {
                throw new Error('Tema no válido');
            }

            document.documentElement.setAttribute('data-theme', theme);
            AppState.currentTheme = theme;
            DataManager.saveData();
            
            this.updateThemeUI(theme);
            this.applyThemeColors(theme);
            
            return true;
        } catch (error) {
            console.error('Error al cambiar tema:', error);
            return false;
        }
    },

    updateThemeUI(theme) {
        const themeData = AppConfig.themes[theme];
        const icon = DOM.elements.themeToggle?.querySelector('i');
        const label = DOM.elements.themeToggle?.querySelector('span');
        
        if (icon) icon.className = `fas ${themeData.icon}`;
        if (label) label.textContent = themeData.label;
    },

    applyThemeColors(theme) {
        try {
            const themeColors = AppConfig.themes[theme];
            if (!themeColors) return false;

            // Aplicar colores base del tema
            document.documentElement.style.setProperty('--text-color', themeColors.textColor);
            document.documentElement.style.setProperty('--background-color', themeColors.backgroundColor);
            document.documentElement.style.setProperty('--card-background', themeColors.cardBackground);

            // Aplicar colores personalizados si existen
            if (AppState.customColors.text) {
                document.documentElement.style.setProperty('--text-color', AppState.customColors.text);
            }
            if (AppState.customColors.background) {
                document.documentElement.style.setProperty('--background-color', AppState.customColors.background);
            }

            // Actualizar selectores de color
            if (DOM.elements.textColorPicker) {
                DOM.elements.textColorPicker.value = AppState.customColors.text || themeColors.textColor;
            }
            if (DOM.elements.backgroundColorPicker) {
                DOM.elements.backgroundColorPicker.value = AppState.customColors.background || themeColors.backgroundColor;
            }

            return true;
        } catch (error) {
            console.error('Error al aplicar colores del tema:', error);
            return false;
        }
    },

    saveCustomTextColor(color) {
        try {
            AppState.customColors.text = color;
            document.documentElement.style.setProperty('--text-color', color);
            DataManager.saveData();
            return true;
        } catch (error) {
            console.error('Error al guardar color de texto:', error);
            return false;
        }
    },

    saveCustomBackgroundColor(color) {
        try {
            AppState.customColors.background = color;
            document.documentElement.style.setProperty('--background-color', color);
            DataManager.saveData();
            return true;
        } catch (error) {
            console.error('Error al guardar color de fondo:', error);
            return false;
        }
    },

    resetColorsToDefault() {
        try {
            const themeColors = AppConfig.themes[AppState.currentTheme];
            if (!themeColors) return false;

            AppState.customColors = {
                text: null,
                background: null
            };

            this.applyThemeColors(AppState.currentTheme);
            DataManager.saveData();
            return true;
        } catch (error) {
            console.error('Error al restaurar colores por defecto:', error);
            return false;
        }
    }
};

// Gestión de favoritos
const FavoriteManager = {
    addFavorite(title, url, category) {
        try {
            if (!title || !url || !category) {
                throw new Error('Faltan datos requeridos');
            }

            const favorite = {
                id: Date.now().toString(),
                title: title.trim(),
                url: url.trim(),
                category,
                icon: this.getFaviconUrl(url)
            };
            
            AppState.favorites.push(favorite);
            
            if (!AppState.categories.includes(category)) {
                AppState.categories.push(category);
            }
            
            DataManager.saveData();
            this.renderFavorites();
            return true;
        } catch (error) {
            console.error('Error al agregar favorito:', error);
            return false;
        }
    },

    editFavorite(id, title, url, category) {
        try {
            const index = AppState.favorites.findIndex(f => f.id === id);
            if (index === -1) {
                throw new Error('Favorito no encontrado');
            }

            const oldCategory = AppState.favorites[index].category;
            const newCategory = category.trim();

            // Actualizar el favorito
            AppState.favorites[index] = {
                ...AppState.favorites[index],
                title: title.trim(),
                url: url.trim(),
                category: newCategory
            };

            // Si la categoría es nueva, agregarla a la lista de categorías
            if (!AppState.categories.includes(newCategory)) {
                AppState.categories.push(newCategory);
            }

            // Verificar si la categoría anterior quedó sin favoritos
            if (oldCategory !== newCategory) {
                const hasFavoritesInOldCategory = AppState.favorites.some(f => f.category === oldCategory);
                if (!hasFavoritesInOldCategory) {
                    const categoryIndex = AppState.categories.indexOf(oldCategory);
                    if (categoryIndex !== -1) {
                        AppState.categories.splice(categoryIndex, 1);
                    }
                }
            }

            DataManager.saveData();
            this.renderFavorites();
            CategoryManager.renderCategories();
            return true;
        } catch (error) {
            console.error('Error al editar favorito:', error);
            return false;
        }
    },

    deleteFavorite(id) {
        try {
            const index = AppState.favorites.findIndex(f => f.id === id);
            if (index === -1) {
                throw new Error('Favorito no encontrado');
            }

            AppState.favorites.splice(index, 1);
            DataManager.saveData();
            this.renderFavorites();
            return true;
        } catch (error) {
            console.error('Error al eliminar favorito:', error);
            return false;
        }
    },

    renderFavorites(category = 'General') {
        try {
            const favoritesGrid = document.getElementById('favorites-grid');
            if (!favoritesGrid) return;

            // Filtrar favoritos según la categoría
            let favorites;
            if (category === 'General') {
                favorites = AppState.favorites;
            } else {
                favorites = AppState.favorites.filter(fav => fav.category === category);
            }

            // Limpiar el grid
            favoritesGrid.innerHTML = '';

            // Mostrar mensaje si no hay favoritos
            if (favorites.length === 0) {
                favoritesGrid.innerHTML = `
                    <div class="no-favorites">
                        <i class="fas fa-star"></i>
                        <p>No hay favoritos en esta categoría</p>
                    </div>
                `;
                return;
            }

            // Renderizar favoritos
            favorites.forEach(favorite => {
                const card = this.createFavoriteCard(favorite, category === 'General');
                favoritesGrid.appendChild(card);
            });
        } catch (error) {
            console.error('Error al renderizar favoritos:', error);
        }
    },

    createFavoriteCard(favorite, showCategorySelector = false) {
        const card = document.createElement('div');
        card.className = 'favorite-card';
        
        const faviconUrl = this.getFaviconUrl(favorite.url);
        const shortUrl = this.shortenUrl(favorite.url);
        const categoryIcon = AppConfig.defaultCategoryIcons[favorite.category] || 'fa-folder';
        
        // Crear el selector de categorías si estamos en la vista General
        let categorySelector = '';
        if (showCategorySelector) {
            categorySelector = `
                <div class="category-selector">
                    <select class="category-select" data-favorite-id="${favorite.id}">
                        ${AppState.categories.map(cat => 
                            `<option value="${cat}" ${cat === favorite.category ? 'selected' : ''}>${cat}</option>`
                        ).join('')}
                    </select>
                </div>
            `;
        }
        
        card.innerHTML = `
            <div class="favorite-header">
                <img src="${faviconUrl}" alt="Favicon" class="favorite-favicon" onerror="this.src='https://www.google.com/favicon.ico'">
                <h3>${favorite.title}</h3>
            </div>
            <a href="${favorite.url}" target="_blank" title="${favorite.url}">${shortUrl}</a>
            ${showCategorySelector ? categorySelector : `
                <span class="category-tag">
                    <i class="fas ${categoryIcon}"></i>
                    ${favorite.category}
                </span>
            `}
            <div class="card-actions">
                <button class="btn-secondary edit-favorite" data-id="${favorite.id}">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn-secondary delete-favorite" data-id="${favorite.id}">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        
        this.attachFavoriteCardEvents(card, favorite, showCategorySelector);
        return card;
    },

    attachFavoriteCardEvents(card, favorite, showCategorySelector = false) {
        const editBtn = card.querySelector('.edit-favorite');
        const deleteBtn = card.querySelector('.delete-favorite');
        const categorySelect = card.querySelector('.category-select');
        
        if (editBtn) {
            editBtn.addEventListener('click', () => this.handleEditFavorite(favorite));
        }
        
        if (deleteBtn) {
            deleteBtn.addEventListener('click', () => this.handleDeleteFavorite(favorite.id));
        }

        if (showCategorySelector && categorySelect) {
            categorySelect.addEventListener('change', (e) => {
                const newCategory = e.target.value;
                this.editFavorite(favorite.id, favorite.title, favorite.url, newCategory);
            });
        }
    },

    handleEditFavorite(favorite) {
        const form = DOM.elements.addFavoriteForm;
        if (!form) return;

        // Actualizar el selector de categorías
        const categorySelect = form.querySelector('#category');
        if (categorySelect) {
            // Limpiar opciones existentes
            categorySelect.innerHTML = '';
            
            // Agregar la categoría actual si no existe en la lista
            if (!AppState.categories.includes(favorite.category)) {
                const option = document.createElement('option');
                option.value = favorite.category;
                option.textContent = favorite.category;
                categorySelect.appendChild(option);
            }
            
            // Agregar todas las categorías
            AppState.categories.forEach(category => {
                const option = document.createElement('option');
                option.value = category;
                option.textContent = category;
                categorySelect.appendChild(option);
            });
            
            // Seleccionar la categoría actual
            categorySelect.value = favorite.category;
        }

        form.dataset.editId = favorite.id;
        form.querySelector('#title').value = favorite.title;
        form.querySelector('#url').value = favorite.url;
        form.querySelector('button[type="submit"]').textContent = 'Actualizar';
        
        DOM.showModal(DOM.elements.addFavoriteModal);
    },

    handleDeleteFavorite(id) {
        if (confirm('¿Está seguro de que desea eliminar este favorito?')) {
            this.deleteFavorite(id);
        }
    },

    getFaviconUrl(url) {
        try {
            const urlObj = new URL(url);
            return `${urlObj.protocol}//${urlObj.hostname}/favicon.ico`;
        } catch (e) {
            return 'https://www.google.com/favicon.ico';
        }
    },

    shortenUrl(url) {
        try {
            const urlObj = new URL(url);
            return urlObj.hostname;
        } catch (e) {
            return url;
        }
    }
};

// Gestión de categorías
const CategoryManager = {
    addCategory(name) {
        try {
            if (!name || name.trim() === '') {
                throw new Error('El nombre de la categoría no puede estar vacío');
            }

            const trimmedName = name.trim();
            
            if (AppState.categories.includes(trimmedName)) {
                throw new Error('La categoría ya existe');
            }

            AppState.categories.push(trimmedName);
            DataManager.saveData();
            this.renderCategories();
            this.updateCategorySelect();
            return true;
        } catch (error) {
            console.error('Error al agregar categoría:', error);
            alert(error.message);
            return false;
        }
    },

    editCategory(oldName, newName, newIcon) {
        try {
            if (!newName || newName.trim() === '') {
                throw new Error('El nombre de la categoría no puede estar vacío');
            }

            const trimmedNewName = newName.trim();
            if (oldName !== trimmedNewName && AppState.categories.includes(trimmedNewName)) {
                throw new Error('Ya existe una categoría con ese nombre');
            }

            const index = AppState.categories.indexOf(oldName);
            if (index !== -1) {
                AppState.categories[index] = trimmedNewName;
            }

            // Actualizar favoritos con la nueva categoría
            AppState.favorites.forEach(fav => {
                if (fav.category === oldName) {
                    fav.category = trimmedNewName;
                }
            });

            // Actualizar icono por defecto
            if (newIcon) {
                AppConfig.defaultCategoryIcons[trimmedNewName] = newIcon;
            }

            DataManager.saveData();
            this.renderCategories();
            FavoriteManager.renderFavorites();
            return true;
        } catch (error) {
            console.error('Error al editar categoría:', error);
            return false;
        }
    },

    deleteCategory(name) {
        try {
            const index = AppState.categories.indexOf(name);
            if (index === -1) {
                throw new Error('Categoría no encontrada');
            }

            // Eliminar favoritos de esta categoría
            AppState.favorites = AppState.favorites.filter(fav => fav.category !== name);
            
            // Eliminar la categoría
            AppState.categories.splice(index, 1);
            
            // Eliminar el icono por defecto
            delete AppConfig.defaultCategoryIcons[name];

            DataManager.saveData();
            this.renderCategories();
            FavoriteManager.renderFavorites();
            return true;
        } catch (error) {
            console.error('Error al eliminar categoría:', error);
            return false;
        }
    },

    renderCategories() {
        try {
            const categoriesList = document.getElementById('categories-list');
            if (!categoriesList) return;

            // Limpiar la lista actual
            categoriesList.innerHTML = '';

            // Agregar la categoría General
            const generalLi = document.createElement('li');
            generalLi.className = 'active';
            generalLi.dataset.category = 'General';
            generalLi.innerHTML = `
                <div class="category-content">
                    <div class="category-icon">
                        <i class="fas fa-th-large"></i>
                    </div>
                    <span class="category-name">General</span>
                </div>
            `;
            categoriesList.appendChild(generalLi);

            // Agregar las demás categorías
            AppState.categories.forEach(category => {
                const li = document.createElement('li');
                li.dataset.category = category;
                li.innerHTML = `
                    <div class="category-content">
                        <div class="category-icon">
                            <i class="fas ${AppConfig.defaultCategoryIcons[category] || 'fa-folder'}"></i>
                        </div>
                        <span class="category-name">${category}</span>
                        <div class="category-actions">
                            <button class="btn-icon edit-category" title="Editar">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn-icon delete-category" title="Eliminar">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                `;
                categoriesList.appendChild(li);
            });

            // Adjuntar eventos
            this.attachCategoryEvents();
        } catch (error) {
            console.error('Error al renderizar categorías:', error);
        }
    },

    attachCategoryEvents() {
        const categoryItems = document.querySelectorAll('.categories-list li');
        categoryItems.forEach(item => {
            const category = item.dataset.category;
            
            // Evento para seleccionar categoría
            item.addEventListener('click', () => {
                this.filterFavorites(category);
                // Actualizar categoría activa
                categoryItems.forEach(li => li.classList.remove('active'));
                item.classList.add('active');
            });

            // Eventos para botones de editar y eliminar
            const editBtn = item.querySelector('.edit-category');
            const deleteBtn = item.querySelector('.delete-category');

            if (editBtn) {
                editBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.handleEditCategory(category);
                });
            }

            if (deleteBtn) {
                deleteBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.handleDeleteCategory(category);
                });
            }
        });
    },

    handleEditCategory(category) {
        const form = DOM.elements.editCategoryForm;
        if (!form) return;

        form.dataset.originalName = category;
        form.querySelector('#editCategoryName').value = category;
        form.querySelector('#editCategoryIcon').value = AppConfig.defaultCategoryIcons[category] || 'fa-folder';
        
        DOM.showModal(DOM.elements.editCategoryModal);
    },

    handleDeleteCategory(category) {
        if (confirm('¿Está seguro de que desea eliminar esta categoría? Se eliminarán todos los favoritos asociados.')) {
            this.deleteCategory(category);
        }
    },

    updateCategorySelect() {
        const select = document.querySelector('#category');
        if (!select) return;

        // Guardar la categoría seleccionada actual
        const currentCategory = select.value;

        // Limpiar y actualizar opciones
        select.innerHTML = AppState.categories.map(cat => 
            `<option value="${cat}">${cat}</option>`
        ).join('');

        // Restaurar la categoría seleccionada si existe
        if (currentCategory && AppState.categories.includes(currentCategory)) {
            select.value = currentCategory;
        }
    },

    filterFavorites(category) {
        try {
            // Actualizar categoría activa
            const categoryItems = document.querySelectorAll('.categories-list li');
            categoryItems.forEach(li => {
                li.classList.toggle('active', li.dataset.category === category);
            });

            // Renderizar favoritos
            FavoriteManager.renderFavorites(category);
            return true;
        } catch (error) {
            console.error('Error al filtrar favoritos:', error);
            return false;
        }
    }
};

// Gestión de importación
const ImportManager = {
    importChromeFavorites() {
        try {
            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.accept = '.html';
            fileInput.onchange = (e) => {
                const file = e.target.files[0];
                if (file) {
                    ImportManager.processImportFile(file);
                }
            };
            fileInput.click();
        } catch (error) {
            console.error('Error al importar favoritos:', error);
            alert('Error al importar favoritos. Por favor, intenta de nuevo.');
        }
    },

    async processImportFile(file) {
        try {
            const text = await file.text();
            console.log('Contenido del archivo:', text.substring(0, 500)); // Debug

            // Buscar el contenido dentro de las etiquetas DL
            const dlMatch = text.match(/<DL>(.*?)<\/DL>/s);
            if (!dlMatch) {
                alert('No se encontró la estructura de favoritos en el archivo.');
                return;
            }

            const dlContent = dlMatch[1];
            const parser = new DOMParser();
            const doc = parser.parseFromString(dlContent, 'text/html');
            const links = doc.querySelectorAll('a');
            
            console.log('Enlaces encontrados:', links.length); // Debug

            if (links.length === 0) {
                alert('No se encontraron favoritos en el archivo.');
                return;
            }

            let importedCount = 0;
            let errorCount = 0;
            let categoriesAdded = new Set();

            for (const link of links) {
                try {
                    const title = link.textContent.trim();
                    const url = link.href;
                    const addDate = link.getAttribute('add_date');
                    const lastVisit = link.getAttribute('last_visit');
                    const lastModified = link.getAttribute('last_modified');
                    const icon = link.getAttribute('icon');

                    console.log('Procesando enlace:', { title, url }); // Debug

                    if (!title || !url) {
                        console.warn('Enlace inválido:', { title, url });
                        errorCount++;
                        continue;
                    }

                    // Detectar categoría basada en el título y URL
                    const category = ImportManager.detectCategory(title, url);
                    console.log('Categoría detectada:', category); // Debug

                    // Agregar la categoría si no existe
                    if (!AppState.categories.includes(category) && !categoriesAdded.has(category)) {
                        CategoryManager.addCategory(category);
                        categoriesAdded.add(category);
                    }
                    
                    // Crear el favorito
                    const favorite = {
                        id: Date.now() + Math.random(),
                        title,
                        url,
                        category,
                        addDate: addDate ? new Date(parseInt(addDate) * 1000).toISOString() : new Date().toISOString(),
                        lastVisit: lastVisit ? new Date(parseInt(lastVisit) * 1000).toISOString() : null,
                        lastModified: lastModified ? new Date(parseInt(lastModified) * 1000).toISOString() : null,
                        icon: icon || FavoriteManager.getFaviconUrl(url)
                    };

                    // Agregar el favorito
                    if (FavoriteManager.addFavorite(favorite.title, favorite.url, favorite.category)) {
                        importedCount++;
                        console.log('Favorito agregado:', favorite); // Debug
                    } else {
                        errorCount++;
                        console.error('Error al agregar favorito:', favorite); // Debug
                    }
                } catch (error) {
                    console.error('Error al procesar un favorito:', error);
                    errorCount++;
                }
            }

            // Mostrar resumen
            const message = `Importación completada:\n- Favoritos importados: ${importedCount}\n- Categorías agregadas: ${categoriesAdded.size}\n- Errores: ${errorCount}`;
            alert(message);

            // Actualizar la vista
            FavoriteManager.renderFavorites();
            CategoryManager.renderCategories();
        } catch (error) {
            console.error('Error al procesar el archivo:', error);
            alert('Error al procesar el archivo de favoritos. Por favor, verifica que el archivo sea válido.');
        }
    },

    detectCategory(title, url) {
        try {
            const urlLower = url.toLowerCase();
            const titleLower = title.toLowerCase();
            const urlObj = new URL(url);
            const domain = urlObj.hostname.toLowerCase();
            const path = urlObj.pathname.toLowerCase();

            // Reglas de detección de categorías
            const rules = [
                { category: 'Videos', patterns: ['youtube.com', 'vimeo.com', 'dailymotion.com', 'twitch.tv', 'netflix.com', 'primevideo.com', 'disneyplus.com', 'hbo.com', 'video', 'película', 'pelicula', 'serie'] },
                { category: 'Desarrollo', patterns: ['github.com', 'gitlab.com', 'stackoverflow.com', 'dev.to', 'medium.com', 'npmjs.com', 'docker.com', 'kubernetes.io', 'code', 'programación', 'programacion', 'desarrollo'] },
                { category: 'Noticias', patterns: ['news', 'noticias', 'reuters.com', 'apnews.com', 'bloomberg.com', 'cnn.com', 'bbc.com', 'elperiodico.com', 'elpais.com', 'periódico', 'periodico', 'diario'] },
                { category: 'Compras', patterns: ['amazon.com', 'ebay.com', 'walmart.com', 'mercadolibre.com', 'shop', 'store', 'tienda', 'marketplace', 'compra', 'venta', 'producto'] },
                { category: 'Redes Sociales', patterns: ['facebook.com', 'twitter.com', 'instagram.com', 'linkedin.com', 'tiktok.com', 'pinterest.com', 'reddit.com', 'snapchat.com', 'social', 'red social'] },
                { category: 'Educación', patterns: ['coursera.org', 'udemy.com', 'edx.org', 'khanacademy.org', 'duolingo.com', 'codecademy.com', 'w3schools.com', 'educación', 'educacion', 'aprender', 'curso', 'tutorial'] },
                { category: 'Juegos', patterns: ['steam.com', 'epicgames.com', 'roblox.com', 'minecraft.net', 'playstation.com', 'xbox.com', 'nintendo.com', 'game', 'juego', 'gaming', 'gamer'] },
                { category: 'Música', patterns: ['spotify.com', 'soundcloud.com', 'bandcamp.com', 'last.fm', 'pandora.com', 'deezer.com', 'tidal.com', 'música', 'musica', 'music', 'cancion', 'canción'] },
                { category: 'Imágenes', patterns: ['pinterest.com', 'flickr.com', 'unsplash.com', 'pexels.com', 'deviantart.com', 'behance.net', 'dribbble.com', 'imagen', 'foto', 'fotografía', 'fotografia'] },
                { category: 'Productividad', patterns: ['trello.com', 'asana.com', 'notion.so', 'evernote.com', 'slack.com', 'microsoft.com', 'google.com', 'productividad', 'tarea', 'nota', 'organización', 'organizacion'] },
                { category: 'Finanzas', patterns: ['paypal.com', 'stripe.com', 'coinbase.com', 'binance.com', 'yahoo.com/finance', 'bloomberg.com', 'investing.com', 'banco', 'finanza', 'inversión', 'inversion'] },
                { category: 'Salud', patterns: ['webmd.com', 'mayoclinic.org', 'healthline.com', 'medlineplus.gov', 'who.int', 'cdc.gov', 'nih.gov', 'salud', 'médico', 'medico', 'hospital', 'enfermedad'] },
                { category: 'Deportes', patterns: ['espn.com', 'sports.yahoo.com', 'goal.com', 'sport.es', 'marca.com', 'as.com', 'fifa.com', 'deporte', 'fútbol', 'futbol', 'sport'] },
                { category: 'Cocina', patterns: ['allrecipes.com', 'foodnetwork.com', 'cooking.nytimes.com', 'jamieoliver.com', 'food.com', 'cookpad.com', 'receta', 'cocina', 'comida', 'gastronomía', 'gastronomia'] },
                { category: 'Viajes', patterns: ['booking.com', 'airbnb.com', 'tripadvisor.com', 'expedia.com', 'kayak.com', 'skyscanner.com', 'lonelyplanet.com', 'viaje', 'turismo', 'hotel', 'vuelo'] }
            ];

            // Buscar coincidencias en el dominio, ruta, título y URL completa
            for (const rule of rules) {
                if (rule.patterns.some(pattern => 
                    domain.includes(pattern) || 
                    path.includes(pattern) || 
                    urlLower.includes(pattern) || 
                    titleLower.includes(pattern))) {
                    return rule.category;
                }
            }

            // Si no se encuentra una categoría específica, intentar categorizar por dominio
            const genericDomains = {
                'Educación': ['.edu', 'academy', 'school', 'university', 'college', 'institute'],
                'Gobierno': ['.gov', 'gob.', 'ministerio', 'ministerio', 'gobierno'],
                'Organizaciones': ['.org', 'association', 'foundation', 'institute', 'organización', 'organizacion'],
                'Empresas': ['.com', 'business', 'company', 'corporation', 'empresa']
            };

            for (const [category, keywords] of Object.entries(genericDomains)) {
                if (keywords.some(keyword => domain.includes(keyword))) {
                    return category;
                }
            }

            // Si no se encuentra ninguna categoría, crear una nueva basada en el dominio principal
            const mainDomain = domain.split('.')[0];
            const newCategory = mainDomain.charAt(0).toUpperCase() + mainDomain.slice(1);
            return newCategory;
        } catch (error) {
            console.error('Error al detectar categoría:', error);
            return 'General';
        }
    }
};

// Gestión de formularios
const FormManager = {
    handleFavoriteSubmit(e) {
        e.preventDefault();
        
        try {
            const form = e.target;
            const title = form.querySelector('#title').value.trim();
            const url = form.querySelector('#url').value.trim();
            const category = form.querySelector('#category').value;
            const editId = form.dataset.editId;
            
            if (!title || !url || !category) {
                alert('Por favor, complete todos los campos requeridos.');
                return false;
            }
            
            let success = false;
            if (editId) {
                success = FavoriteManager.editFavorite(editId, title, url, category);
            } else {
                success = FavoriteManager.addFavorite(title, url, category);
            }
            
            if (success) {
                DOM.hideModal(DOM.elements.addFavoriteModal);
                DOM.resetForm(form);
                return true;
            }
            
            return false;
        } catch (error) {
            console.error('Error al guardar favorito:', error);
            alert('Error al guardar el favorito. Por favor, intente nuevamente.');
            return false;
        }
    },

    handleCategorySubmit(e) {
        e.preventDefault();
        
        try {
            const form = e.target;
            const categoryName = form.querySelector('#categoryName').value.trim();
            
            if (!categoryName) {
                alert('Por favor, ingrese un nombre para la categoría.');
                return false;
            }
            
            if (CategoryManager.addCategory(categoryName)) {
                DOM.hideModal(DOM.elements.addCategoryModal);
                DOM.resetForm(form);
                return true;
            }
            
            return false;
        } catch (error) {
            console.error('Error al guardar categoría:', error);
            alert('Error al guardar la categoría. Por favor, intente nuevamente.');
            return false;
        }
    },

    handleCategoryEdit(e) {
        e.preventDefault();
        
        try {
            const form = e.target;
            const originalName = form.dataset.originalName;
            const newName = form.querySelector('#editCategoryName').value.trim();
            const newIcon = form.querySelector('#editCategoryIcon').value;
            
            if (!newName) {
                alert('El nombre de la categoría no puede estar vacío.');
                return false;
            }
            
            if (CategoryManager.editCategory(originalName, newName, newIcon)) {
                DOM.hideModal(DOM.elements.editCategoryModal);
                DOM.resetForm(form);
                delete form.dataset.originalName;
                return true;
            }
            
            return false;
        } catch (error) {
            console.error('Error al editar categoría:', error);
            alert('Error al editar la categoría. Por favor, intente nuevamente.');
            return false;
        }
    }
};

// Inicialización de la aplicación
function initApp() {
    try {
        // Inicializar elementos del DOM
        DOM.init();
        
        // Cargar datos guardados
        DataManager.loadData();
        
        // Configurar tema
        ThemeManager.setTheme(AppState.currentTheme);
        
        // Renderizar categorías y favoritos
        CategoryManager.renderCategories();
        FavoriteManager.renderFavorites();
        
        // Configurar eventos
        setupEventListeners();
        
        return true;
    } catch (error) {
        console.error('Error al inicializar la aplicación:', error);
        alert('Error al inicializar la aplicación. Por favor, recarga la página.');
        return false;
    }
}

// Configuración de event listeners
function setupEventListeners() {
    try {
        // Event listeners para modales
        if (DOM.elements.addNewBtn) {
            DOM.elements.addNewBtn.addEventListener('click', () => {
                DOM.showModal(DOM.elements.addFavoriteModal);
            });
        }

        if (DOM.elements.addCategoryBtn) {
            DOM.elements.addCategoryBtn.addEventListener('click', () => {
                DOM.showModal(DOM.elements.addCategoryModal);
            });
        }

        if (DOM.elements.cancelAddBtn) {
            DOM.elements.cancelAddBtn.addEventListener('click', () => {
                DOM.hideModal(DOM.elements.addFavoriteModal);
                DOM.resetForm(DOM.elements.addFavoriteForm);
            });
        }

        if (DOM.elements.cancelCategoryBtn) {
            DOM.elements.cancelCategoryBtn.addEventListener('click', () => {
                DOM.hideModal(DOM.elements.addCategoryModal);
                DOM.resetForm(DOM.elements.addCategoryForm);
            });
        }

        // Event listeners para formularios
        if (DOM.elements.addFavoriteForm) {
            DOM.elements.addFavoriteForm.addEventListener('submit', FormManager.handleFavoriteSubmit);
        }

        if (DOM.elements.addCategoryForm) {
            DOM.elements.addCategoryForm.addEventListener('submit', FormManager.handleCategorySubmit);
        }

        if (DOM.elements.editCategoryForm) {
            DOM.elements.editCategoryForm.addEventListener('submit', FormManager.handleCategoryEdit);
        }

        // Event listeners para importación
        if (DOM.elements.importBtn) {
            DOM.elements.importBtn.addEventListener('click', ImportManager.importChromeFavorites);
        }

        // Event listeners para temas
        if (DOM.elements.themeToggle) {
            DOM.elements.themeToggle.addEventListener('click', () => {
                const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
                const newTheme = currentTheme === 'light' ? 'dark' : 'light';
                ThemeManager.setTheme(newTheme);
            });
        }

        // Event listeners para colores personalizados
        if (DOM.elements.textColorPicker) {
            DOM.elements.textColorPicker.addEventListener('input', (e) => 
                ThemeManager.saveCustomTextColor(e.target.value)
            );
        }

        if (DOM.elements.backgroundColorPicker) {
            DOM.elements.backgroundColorPicker.addEventListener('input', (e) => 
                ThemeManager.saveCustomBackgroundColor(e.target.value)
            );
        }

        // Event listeners para reset de colores
        if (DOM.elements.resetTextColor) {
            DOM.elements.resetTextColor.addEventListener('click', () => 
                ThemeManager.resetColorsToDefault()
            );
        }

        if (DOM.elements.resetBackgroundColor) {
            DOM.elements.resetBackgroundColor.addEventListener('click', () => 
                ThemeManager.resetColorsToDefault()
            );
        }

        // Event listeners para panel de configuración
        if (DOM.elements.openSettingsBtn) {
            DOM.elements.openSettingsBtn.addEventListener('click', () => 
                DOM.elements.settingsPanel.classList.add('active')
            );
        }

        if (DOM.elements.closeSettingsBtn) {
            DOM.elements.closeSettingsBtn.addEventListener('click', () => 
                DOM.elements.settingsPanel.classList.remove('active')
            );
        }

        // Cerrar panel al hacer clic fuera
        document.addEventListener('click', (e) => {
            if (DOM.elements.settingsPanel && 
                !DOM.elements.settingsPanel.contains(e.target) && 
                !DOM.elements.openSettingsBtn.contains(e.target)) {
                DOM.elements.settingsPanel.classList.remove('active');
            }
        });

        return true;
    } catch (error) {
        console.error('Error al configurar event listeners:', error);
        alert('Error al configurar la aplicación. Por favor, recarga la página.');
        return false;
    }
}

// Inicializar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', initApp); 