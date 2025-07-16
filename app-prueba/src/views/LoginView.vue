<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 p-4 font-sans relative overflow-hidden">
    <div class="absolute w-40 h-40 bg-purple-200 rounded-full opacity-60 animate-blob top-10 left-10 md:w-60 md:h-60 md:-top-20 md:-left-20"></div>
    
    <div class="absolute w-52 h-52 bg-purple-100 rounded-full opacity-50 animate-blob animation-delay-2000 bottom-20 right-20 md:w-80 md:h-80 md:-bottom-40 md:-right-40"></div>
    
    <div class="absolute w-32 h-32 bg-blue-100 rounded-full opacity-40 animate-blob animation-delay-4000 top-20 right-10 md:w-48 md:h-48 md:top-auto md:bottom-10 md:left-1/4"></div>

    <div class="bg-white p-8 rounded-2xl shadow-xl max-w-sm w-full mx-auto relative z-10 
                 transform transition-all duration-300 ease-in-out
                " :class="{ 'scale-95 opacity-75': loading, 'shake': error }">
      <div class="text-center">
        <div class="w-24 h-24 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-full mx-auto mb-6 flex items-center justify-center text-white text-4xl">
          <i class="fas fa-brain"></i>
        </div>

        <h1 class="text-3xl font-bold text-gray-800 mb-2">Bienvenido</h1>
        <p class="text-gray-500 mb-8">Ingresa a tu cuenta</p>

        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div class="text-left">
            <label for="email" class="block text-gray-700 text-sm font-medium mb-1">
              <i class="fas fa-envelope mr-2 text-purple-500"></i>
              Correo Electrónico
            </label>
            <input 
              type="email" 
              id="email" 
              v-model="formData.email" 
              required
              placeholder="correo@ejemplo.com"
              :disabled="loading"
              class="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:outline-none focus:border-purple-500 transition duration-200 bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
            >
          </div>
          
          <div class="text-left">
            <label for="password" class="block text-gray-700 text-sm font-medium mb-1">
              <i class="fas fa-lock mr-2 text-purple-500"></i>
              Contraseña
            </label>
            <input 
              type="password" 
              id="password" 
              v-model="formData.password" 
              required
              placeholder="Tu contraseña"
              :disabled="loading"
              class="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:outline-none focus:border-purple-500 transition duration-200 bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
            >
          </div>

          <div v-if="error" class="text-red-600 text-sm mt-2 text-center">{{ error }}</div>

          <button 
            type="submit" 
            class="w-full bg-gradient-to-r from-purple-600 to-blue-500 text-white font-semibold py-3 rounded-lg hover:from-purple-700 hover:to-blue-600 transition duration-300 transform hover:scale-105 flex items-center justify-center space-x-2" 
            :disabled="loading"
          >
            <span class="btn-text">{{ loading ? 'Iniciando sesión...' : 'Iniciar Sesión' }}</span>
            <i class="fas fa-arrow-right ml-2" :class="{ 'animate-pulse': loading }"></i>
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
/**
 * Importación de dependencias
 * @requires axios - Cliente HTTP para realizar peticiones
 * @requires sweetalert2 - Biblioteca para mostrar alertas personalizadas
 */
import axios from 'axios'
import Swal from 'sweetalert2'

/**
 * Componente de vista de inicio de sesión
 * @component
 */
export default {
  /**
   * Nombre del componente para su identificación
   */
  name: 'LoginView',
  /**
   * Estado local del componente
   * @returns {Object} Estado inicial del formulario
   */
  data() {
    return {
      formData: {
        email: '',
        password: ''
      },
      loading: false,
      error: null
    }
  },
  /**
   * Métodos del componente
   */
  methods: {
    /**
     * Maneja el envío del formulario de inicio de sesión
     * @async
     * @returns {Promise<void>}
     */
    async handleSubmit() {
      if (this.loading) return
      
      this.error = null
      this.loading = true

      try {
        // La manipulación del DOM directo (classList.add/remove) para el botón 'submit-btn'
        // puede ser menos "Vue-ish". Tailwind ya maneja el estado disabled automáticamente
        // con ':disabled' y 'disabled:...' clases.
        // Si no tienes otro propósito para esta clase 'loading' en submitBtn, podrías eliminarla.
        const submitBtn = document.querySelector('.submit-btn')
        submitBtn?.classList.add('loading')

        const response = await axios.post('https://tesis-dn07.onrender.com/api/auth/login', this.formData)
        const { token, ...userData } = response.data
        localStorage.setItem('x-token', token)
        localStorage.setItem('userId', userData.user.id);
        this.$store.dispatch('login', userData)
        console.log('userId guardado:', localStorage.getItem('userId'));
        console.log('id' , userData.user.id)
        console.log('datos', userData)
        
        await Swal.fire({
          icon: 'success',
          title: '¡Bienvenido!',
          text: 'Has iniciado sesión correctamente',
          timer: 1500,
          showConfirmButton: false,
          customClass: {
            popup: 'animated-alert'
          }
        })
        
        // Redirigir según el rol
        if (userData.user.role === 'ADMIN') {
          this.$router.push('/home')
        } else {
          this.$router.push('/psychologist')
        }
      } catch (error) {
        console.error('Error de inicio de sesión:', error)
        
        const errorMessage = error.response?.data?.msg || 'Error al iniciar sesión'
        
        this.error = errorMessage
        
        await Swal.fire({
          icon: 'error',
          title: 'Error de acceso',
          text: errorMessage,
          customClass: {
            popup: 'animated-alert'
          }
        })

        // Animación de error en la tarjeta (usando la clase 'shake' de CSS)
        const loginCard = document.querySelector('.login-card')
        loginCard?.classList.add('shake') // Añadir clase de error
        setTimeout(() => {
          loginCard?.classList.remove('shake') // Remover clase después de la animación
        }, 820) // Duración de la animación en CSS (coincide con @keyframes shake)
      } finally {
        this.loading = false
        // Remover clase de animación del botón
        const submitBtn = document.querySelector('.submit-btn')
        submitBtn?.classList.remove('loading')
      }
    },
    /**
     * Valida los campos del formulario (aunque `required` en HTML ya hace algo)
     * @returns {boolean} Resultado de la validación
     */
    validateForm() {
      if (!this.formData.email || !this.formData.password) {
        this.error = 'Por favor, complete todos los campos'
        return false
      }
      return true
    }
  },
  /**
   * Ciclo de vida: Se ejecuta al crear el componente
   * Verifica si existe un token y redirecciona si es necesario
   */
  created() {
    if (localStorage.getItem('x-token')) {
      this.$router.push('/home')
    }
  }
}
</script>

