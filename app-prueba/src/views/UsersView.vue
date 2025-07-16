<!--
Componente UsersView

Este componente implementa la gestión completa de psicólogos en el sistema.
Características:
- CRUD completo de psicólogos (Crear, Leer, Actualizar, Eliminar)
- Búsqueda y filtrado dinámico
- Interfaz de tarjetas con estadísticas
- Modales para operaciones
- Validación de formularios
- Confirmación de acciones críticas
-->
<template>
  <div class="users-view">
    <!-- Encabezado de la página con título y botón para agregar -->
    <div class="page-header">
      <h1>Gestión de Psicólogos</h1>
      <button class="add-button" @click="showAddModal = true">
        <i class="fas fa-plus"></i>
        Agregar Psicólogo
      </button>
    </div>

    <!-- Barra de búsqueda para filtrar psicólogos -->
    <div class="search-bar">
      <div class="search-input">
        <i class="fas fa-search"></i>
        <input 
          type="text" 
          v-model="searchQuery" 
          placeholder="Buscar psicólogo..."
          @input="filterPsychologists"
        >
      </div>
    </div>

    <!-- Grid de tarjetas de psicólogos -->
    <div class="users-grid">
      <div v-for="user in filteredUsers" :key="user._id" class="user-card">
        <div class="user-header">
          <div class="user-avatar">
            <span class="avatar-initials">{{ getInitials(user) }}</span>
          </div>
        </div>
        
        <div class="user-info">
          <h3>{{ user.firstName }} {{ user.lastName }}</h3>
          <p class="email">{{ user.email }}</p>
          
          <div class="stats">
            <div class="stat-item">
              <i class="fas fa-users"></i>
              <span>{{ user.studentCount || 0 }} Estudiantes</span>
            </div>
            <div class="stat-item">
              <i class="fas fa-calendar-check"></i>
              <span>{{ user.sessionCount || 0 }} Sesiones</span>
            </div>
          </div>
        </div>

        <div class="user-actions">
          <button class="action-btn edit" @click="editUser(user)">
            <i class="fas fa-edit"></i>
            Editar
          </button>
          <button class="action-btn delete" @click="confirmDelete(user)">
            <i class="fas fa-trash-alt"></i>
            Eliminar
          </button>
        </div>
      </div>
    </div>

    <!-- Modal para agregar/editar psicólogo -->
    <div class="modal" v-if="showAddModal || showEditModal">
      <div class="modal-content">
        <div class="modal-header">
          <h2>{{ showEditModal ? 'Editar' : 'Agregar' }} Psicólogo</h2>
          <button class="close-btn" @click="closeModal">
            <i class="fas fa-times"></i>
          </button>
        </div>
        
        <div class="modal-body">
          <!-- Formulario con validación básica -->
          <form @submit.prevent="saveUser" class="user-form">
            <div class="form-group">
              <label>Nombre *</label>
              <input 
                type="text" 
                v-model="formData.firstName" 
                @input="validateField('firstName')"
                required
                placeholder="Ingrese el nombre"
                :class="{ 'error': formErrors.firstName }"
              >
              <span class="error-text" v-if="formErrors.firstName">{{ formErrors.firstName }}</span>
            </div>

            <div class="form-group">
              <label>Apellido *</label>
              <input 
                type="text" 
                v-model="formData.lastName"
                @input="validateField('lastName')" 
                required
                placeholder="Ingrese el apellido"
                :class="{ 'error': formErrors.lastName }"
              >
              <span class="error-text" v-if="formErrors.lastName">{{ formErrors.lastName }}</span>
            </div>

            <div class="form-group" v-if="!showEditModal">
              <label>Email *</label>
              <input 
                type="email" 
                v-model="formData.email"
                @input="validateField('email')" 
                required
                placeholder="ejemplo@dominio.com"
                :class="{ 'error': formErrors.email }"
              >
              <span class="error-text" v-if="formErrors.email">{{ formErrors.email }}</span>
            </div>

            <div class="form-group" v-if="!showEditModal">
              <label>Contraseña *</label>
              <input 
                type="password" 
                v-model="formData.password"
                @input="validateField('password')" 
                required
                placeholder="Mínimo 6 caracteres"
                :class="{ 'error': formErrors.password }"
              >
              <span class="error-text" v-if="formErrors.password">{{ formErrors.password }}</span>
            </div>

            <!-- Campo oculto para el rol -->
            <input type="hidden" v-model="formData.role">
          </form>
        </div>

        <div class="modal-footer">
          <button class="cancel-btn" @click="closeModal">Cancelar</button>
          <button class="save-btn" @click="saveUser" :disabled="!isFormValid">
            {{ showEditModal ? 'Guardar Cambios' : 'Agregar Psicólogo' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Modal de confirmación de eliminación -->
    <div class="modal" v-if="showDeleteModal">
      <div class="modal-content">
        <div class="modal-header">
          <h2>Confirmar Eliminación</h2>
          <button class="close-btn" @click="showDeleteModal = false">
            <i class="fas fa-times"></i>
          </button>
        </div>
        
        <div class="modal-body">
          <p>¿Está seguro que desea eliminar al psicólogo {{ selectedUser?.firstName }} {{ selectedUser?.lastName }}?</p>
          <p class="warning">Esta acción no se puede deshacer.</p>
        </div>

        <div class="modal-footer">
          <button class="cancel-btn" @click="showDeleteModal = false">Cancelar</button>
          <button class="delete-btn" @click="deleteUser">Eliminar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/**
 * Importación de dependencias
 * @requires sweetalert2 - Biblioteca para mostrar alertas personalizadas
 */
import Swal from 'sweetalert2'

/**
 * Componente de gestión de psicólogos
 * @component
 */
export default {
  /**
   * Nombre del componente para su identificación
   */
  name: 'UsersView',
  /**
   * Estado local del componente
   * @returns {Object} Estado inicial de la gestión de usuarios
   */
  data() {
    return {
      /**
       * Lista de usuarios y estado de filtros
       */
      users: [],
      filteredUsers: [],
      searchQuery: '',

      /**
       * Estados de visibilidad de los modales
       */
      showAddModal: false,
      showEditModal: false,
      showDeleteModal: false,
      selectedUser: null,

      /**
       * Datos del formulario de usuario
       */
      formData: {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        role: 'PSYCHOLOGIST'
      },

      /**
       * Errores de validación por campo del formulario
       */
      formErrors: {
        firstName: '',
        lastName: '',
        email: '',
        password: ''
      },

      /**
       * Expresiones regulares para validación de campos
       */
      validationRules: {
        nameRegex: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{2,30}$/,
        emailRegex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      }
    }
  },

  /**
   * Propiedades computadas del componente
   */
  computed: {
    /**
     * Verifica si todos los campos del formulario son válidos
     * @returns {boolean} Estado de validez del formulario
     */
    isFormValid() {
      return this.formData.firstName && 
             this.formData.lastName && 
             this.formData.email &&
             (!this.showEditModal ? this.formData.password : true) &&
             !Object.values(this.formErrors).some(error => error)
    }
  },

  /**
   * Ciclo de vida: Se ejecuta al crear el componente
   * Carga inicial de usuarios
   */
  created() {
    this.fetchUsers()
  },

  /**
   * Métodos del componente
   */
  methods: {
    /**
     * Valida un campo específico del formulario
     * @param {string} field - Nombre del campo a validar
     */
    validateField(field) {
      // Limpiar el error del campo
      this.formErrors[field] = ''

      // Variables para validación
      const value = this.formData[field]?.trim() || ''
      const email = this.formData.email?.trim() || ''
      const password = this.formData.password || ''

      switch (field) {
        case 'firstName':
        case 'lastName':
          if (!value) {
            this.formErrors[field] = `El ${field === 'firstName' ? 'nombre' : 'apellido'} es requerido`
          } else if (!this.validationRules.nameRegex.test(value)) {
            this.formErrors[field] = `El ${field === 'firstName' ? 'nombre' : 'apellido'} solo debe contener letras y espacios (2-30 caracteres)`
          }
          break

        case 'email':
          if (!this.showEditModal) {
            if (!email) {
              this.formErrors.email = 'El email es requerido'
            } else if (!this.validationRules.emailRegex.test(email)) {
              this.formErrors.email = 'Email inválido'
            }
          }
          break

        case 'password':
          if (!this.showEditModal) {
            if (!password) {
              this.formErrors.password = 'La contraseña es requerida'
            } else if (password.length < 6) {
              this.formErrors.password = 'La contraseña debe tener al menos 6 caracteres'
            }
          }
          break
      }
    },

    /**
     * Valida todos los campos del formulario
     * @returns {boolean} Resultado de la validación
     */
    validateForm() {
      // Validar todos los campos
      this.validateField('firstName')
      this.validateField('lastName')
      if (!this.showEditModal) {
        this.validateField('email')
        this.validateField('password')
      }

      // Verificar si hay errores
      const hasErrors = Object.values(this.formErrors).some(error => error !== '')
      
      if (hasErrors) {
        Swal.fire({
          icon: 'error',
          title: 'Error de validación',
          text: 'Por favor, corrija los errores en el formulario'
        })
      }

      return !hasErrors
    },

    /**
     * Obtiene la lista de psicólogos desde el servidor
     * @async
     */
    async fetchUsers() {
      try {
        const token = localStorage.getItem('x-token')
        const response = await fetch('https://tesis-dn07.onrender.com/api/users', {
          headers: {
            'x-token': token
          }
        })
        const data = await response.json()
        this.users = data.psychologists
        this.filterPsychologists()
      } catch (err) {
        console.error('Error:', err)
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Error al cargar la lista de psicólogos'
        })
      }
    },

    /**
     * Genera las iniciales del nombre para el avatar
     * @param {Object} user - Usuario del que se generan las iniciales
     * @returns {string} Iniciales en mayúsculas
     */
    getInitials(user) {
      return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase()
    },

    /**
     * Filtra la lista de psicólogos según el término de búsqueda
     */
    filterPsychologists() {
      this.filteredUsers = this.users.filter(user => {
        return user.firstName.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
               user.lastName.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
               user.email.toLowerCase().includes(this.searchQuery.toLowerCase())
      })
    },

    /**
     * Prepara el formulario con los datos del usuario a editar
     * @param {Object} user - Usuario a editar
     */
    editUser(user) {
      this.selectedUser = user
      this.formData = { 
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        password: '', // No incluimos la contraseña en la edición
        role: 'PSYCHOLOGIST' // Mantenemos el rol fijo
      }
      this.showEditModal = true
    },

    /**
     * Crea o actualiza un usuario en el servidor
     * @async
     */
    async saveUser() {
      if (!this.validateForm()) return

      try {
        const token = localStorage.getItem('x-token')
        
        // Preparar los datos para enviar
        const userData = {
          firstName: this.formData.firstName.trim(),
          lastName: this.formData.lastName.trim(),
          role: 'PSYCHOLOGIST'
        }

        // Si es un nuevo usuario, incluir email y contraseña
        if (!this.showEditModal) {
          userData.email = this.formData.email.trim()
          userData.password = this.formData.password
        }

        // Configurar la petición según sea crear o actualizar
        const config = {
          method: this.showEditModal ? 'PUT' : 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-token': token
          },
          body: JSON.stringify(userData)
        }

        // Determinar la URL según sea crear o actualizar
        const baseUrl = 'https://tesis-dn07.onrender.com/api/users'
        const url = this.showEditModal 
          ? `${baseUrl}/${this.selectedUser._id}`
          : baseUrl

        const response = await fetch(url, config)
        const data = await response.json()

        if (response.ok) {
          // Actualizar la lista de usuarios
          await this.fetchUsers()
          
          // Mostrar mensaje de éxito
          Swal.fire({
            icon: 'success',
            title: 'Éxito',
            text: this.showEditModal 
              ? 'Psicólogo actualizado correctamente'
              : 'Psicólogo creado correctamente'
          })
          
          // Cerrar el modal y limpiar el formulario
          this.closeModal()
        } else {
          // Manejar errores del servidor
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: data.errors?.[0]?.msg || 'Error al procesar la solicitud'
          })
        }
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Error al procesar la solicitud'
        })
      }
    },

    /**
     * Muestra diálogo de confirmación antes de eliminar
     * @param {Object} user - Usuario a eliminar
     */
    confirmDelete(user) {
      this.selectedUser = user
      Swal.fire({
        title: '¿Está seguro?',
        text: `¿Desea desactivar al psicólogo ${user.firstName} ${user.lastName}?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#dc3545',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Sí, desactivar',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          this.deleteUser()
        }
      })
    },

    /**
     * Realiza la eliminación lógica del usuario
     * @async
     */
    async deleteUser() {
      try {
        const token = localStorage.getItem('x-token')
        
        // Configurar la petición DELETE
        const config = {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'x-token': token
          }
        }

        // Realizar la petición de soft delete
        const response = await fetch(`https://tesis-dn07.onrender.com/api/users/${this.selectedUser._id}`, config)
        const data = await response.json()

        if (response.ok) {
          // Actualizar la lista de usuarios
          await this.fetchUsers()
          
          // Mostrar mensaje de éxito
          Swal.fire({
            icon: 'success',
            title: 'Éxito',
            text: 'Psicólogo desactivado correctamente'
          })
          
          // Limpiar el estado
          this.selectedUser = null
        } else {
          // Manejar errores del servidor
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: data.errors?.[0]?.msg || 'Error al desactivar el psicólogo'
          })
        }
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Error al procesar la solicitud'
        })
      }
    },

    /**
     * Cierra los modales y reinicia el estado del formulario
     */
    closeModal() {
      this.showAddModal = false
      this.showEditModal = false
      this.selectedUser = null
      this.formData = {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        role: 'PSYCHOLOGIST'
      }
      this.formErrors = {
        firstName: '',
        lastName: '',
        email: '',
        password: ''
      }
    }
  }
}
</script>

<style scoped>
/* Estilos específicos para la vista de usuarios */
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');

.users-view {
  font-family: 'Poppins', sans-serif;
  padding: 2rem;
  background-color: #f8f9fa;
  min-height: 100vh;

  @media (max-width: 768px) {
    padding: 1rem;
  }
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.page-header h1 {
  color: #2c3e50;
  margin: 0;
}

.add-button {
  background-color: #1976d2;
  color: white;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

.add-button:hover {
  background-color: #1565c0;
}

.search-bar {
  margin-bottom: 2rem;
}

.search-input {
  position: relative;
  max-width: 500px;
}

.search-input i {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #6c757d;
}

.search-input input {
  width: 100%;
  padding: 0.8rem 1rem 0.8rem 2.5rem;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  font-size: 1rem;
}

.users-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 1rem;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
}

.user-card {
  background: white;
  border-radius: 15px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  transition: transform 0.3s ease;
}

.user-card:hover {
  transform: translateY(-5px);
}

.user-header {
  padding: 1.5rem;
  display: flex;
  justify-content: center;
  border-bottom: 1px solid #eee;
}

.user-avatar {
  width: 80px;
  height: 80px;
  background: #e3f2fd;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-initials {
  font-size: 2rem;
  font-weight: 600;
  color: #1976d2;
}

.user-info {
  padding: 1.5rem;
  text-align: center;
}

.user-info h3 {
  margin: 0 0 0.5rem 0;
  color: #2c3e50;
  font-size: 1.2rem;
}

.email {
  color: #6c757d;
  margin: 0 0 1rem 0;
  font-size: 0.9rem;
}

.stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-top: 1rem;
}

.stat-item {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  color: #6c757d;
  font-size: 0.9rem;
}

.stat-item i {
  color: #1976d2;
}

.user-actions {
  padding: 1.5rem;
  display: flex;
  gap: 1rem;
  border-top: 1px solid #eee;
}

.action-btn {
  flex: 1;
  padding: 0.8rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

.action-btn.edit {
  background-color: #e3f2fd;
  color: #1976d2;
}

.action-btn.edit:hover {
  background-color: #bbdefb;
}

.action-btn.delete {
  background-color: #ffebee;
  color: #c62828;
}

.action-btn.delete:hover {
  background-color: #ffcdd2;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 2rem;
  border-radius: var(--border-radius-lg);
  max-width: 500px;
  width: 90%;
  position: relative;

  @media (max-width: 768px) {
    padding: 1.5rem;
    width: 95%;
  }

  @media (max-width: 480px) {
    padding: 1.25rem;
    width: 100%;
    margin: 0 1rem;
    border-radius: var(--border-radius-md);
  }
}

.modal-header {
  padding: 1.5rem;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h2 {
  margin: 0;
  color: #2c3e50;
  font-size: 1.5rem;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #6c757d;
  cursor: pointer;
}

.modal-body {
  padding: 1.5rem;
}

.form-group {
  margin-bottom: 1.5rem;

  @media (max-width: 768px) {
    margin-bottom: 1.25rem;
  }

  @media (max-width: 480px) {
    margin-bottom: 1rem;
  }

  label {
    display: block;
    margin-bottom: 0.5rem;
    color: var(--text-primary);

    @media (max-width: 480px) {
      font-size: 0.9rem;
    }
  }

  input {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid var(--border-color);
    border-radius: var(--border-radius-sm);
    font-size: 1rem;

    @media (max-width: 480px) {
      padding: 0.5rem;
      font-size: 0.95rem;
    }
  }
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #2c3e50;
  font-weight: 500;
}

.form-group input {
  width: 100%;
  padding: 0.8rem;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  font-size: 1rem;
}

.modal-footer {
  padding: 1.5rem;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

.modal-footer button {
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s;
}

.cancel-btn {
  background-color: #e9ecef;
  color: #2c3e50;
}

.cancel-btn:hover {
  background-color: #dee2e6;
}

.save-btn {
  background-color: #1976d2;
  color: white;
}

.save-btn:hover {
  background-color: #1565c0;
}

.save-btn:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.delete-btn {
  background-color: #dc3545;
  color: white;
}

.delete-btn:hover {
  background-color: #c82333;
}

.warning {
  color: #dc3545;
  font-weight: 500;
}

/* Estilos para la validación del formulario */
.user-form {
  width: 100%;
}

.form-group input.error {
  border-color: #dc3545;
}

.error-text {
  color: #dc3545;
  font-size: 0.8rem;
  margin-top: 0.25rem;
  display: block;
}

@media (max-width: 768px) {
  .users-view {
    padding: 1rem;
  }

  .users-grid {
    grid-template-columns: 1fr;
  }
}
</style>
