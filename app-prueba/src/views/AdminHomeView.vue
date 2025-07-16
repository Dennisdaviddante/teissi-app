<!--
Componente AdminHomeView

Este componente representa el panel de control principal para los administradores del sistema.
Muestra un resumen de las estadísticas importantes y proporciona acceso rápido a las
funcionalidades principales del sistema.
-->

<template>
  <div class="admin-home">
    <!-- Tarjeta de bienvenida -->
    <div class="welcome-card card">
      <div class="header">
        <div class="avatar" :style="{ backgroundColor: avatarColor }">
          <span>{{ userInitials }}</span>
        </div>
        <div class="welcome-text">
          <h1>Bienvenido, {{ userName }}</h1>
          <p class="subtitle">Panel de Administración del Sistema de Evaluación de Riesgo Suicida</p>
        </div>
      </div>
    </div>

    <!-- Estadísticas generales -->
    <div class="stats-grid">
      <div class="stat-card card">
        <i class="fas fa-users"></i>
        <div class="stat-content">
          <h3>Total Usuarios</h3>
          <p class="stat-number">{{ stats.totalUsers || 0 }}</p>
          <span class="stat-label">Usuarios registrados</span>
        </div>
      </div>

      <div class="stat-card card">
        <i class="fas fa-user-md"></i>
        <div class="stat-content">
          <h3>Psicólogos</h3>
          <p class="stat-number">{{ stats.totalPsychologists || 0 }}</p>
          <span class="stat-label">Psicólogos activos</span>
        </div>
      </div>

      <div class="stat-card card">
        <i class="fas fa-user-graduate"></i>
        <div class="stat-content">
          <h3>Estudiantes</h3>
          <p class="stat-number">{{ stats.totalStudents || 0 }}</p>
          <span class="stat-label">Estudiantes registrados</span>
        </div>
      </div>

      <div class="stat-card card">
        <i class="fas fa-clipboard-list"></i>
        <div class="stat-content">
          <h3>Evaluaciones</h3>
          <p class="stat-number">{{ stats.totalAssessments || 0 }}</p>
          <span class="stat-label">Evaluaciones realizadas</span>
        </div>
      </div>
    </div>

    <!-- Acciones rápidas -->
    <div class="quick-actions card">
      <h2>Acciones Rápidas</h2>
      <div class="actions-grid">
        <button class="action-btn" @click="$router.push('/dashboard/users')">
          <i class="fas fa-user-plus"></i>
          <span>Gestionar Usuarios</span>
        </button>
        <button class="action-btn" @click="$router.push('/dashboard/statistics')">
          <i class="fas fa-chart-bar"></i>
          <span>Ver Estadísticas</span>
        </button>
        <button class="action-btn" @click="$router.push('/dashboard/settings')">
          <i class="fas fa-cog"></i>
          <span>Configuración</span>
        </button>
        <button class="action-btn" @click="$router.push('/dashboard/reports')">
          <i class="fas fa-file-alt"></i>
          <span>Reportes</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  /**
   * Nombre del componente para su identificación en Vue DevTools
   */
  name: 'AdminHomeView',
  /**
   * Estado local del componente
   * @returns {Object} Estado inicial del componente
   */
  data() {
    return {
      userData: null,
      stats: {
        totalUsers: 0,
        totalPsychologists: 0,
        totalStudents: 0,
        totalAssessments: 0
      }
    }
  },
  /**
   * Propiedades computadas del componente
   * Estas propiedades se recalculan automáticamente cuando sus dependencias cambian
   */
  computed: {
    /**
     * Calcula el nombre completo del usuario a partir de firstName y lastName
     * @returns {string} Nombre completo del usuario o cadena vacía si no hay datos
     */
    userName() {
      if (this.userData?.firstName && this.userData?.lastName) {
        return `${this.userData.firstName} ${this.userData.lastName}`
      }
      return this.userData?.name || ''
    },
    /**
     * Determina si el usuario es administrador
     * @returns {string} 'Administrador' si el usuario es admin, cadena vacía en caso contrario
     */
    userRole() {
      return this.userData?.user?.role === 'ADMIN' ? 'Administrador' : ''
    },
    /**
     * Genera las iniciales del usuario para mostrar en el avatar
     * @returns {string} Iniciales del usuario en mayúsculas o cadena vacía si no hay datos
     */
    userInitials() {
      if (this.userData?.firstName && this.userData?.lastName) {
        return (this.userData.firstName[0] + this.userData.lastName[0]).toUpperCase()
      }
      return ''
    },
    /**
     * Genera un color consistente para el avatar basado en el nombre del usuario
     * @returns {string} Color en formato hexadecimal
     */
    avatarColor() {
      const colors = [
        '#1976D2', // primary-color
        '#26A69A', // secondary-color
        '#FF8A65'  // accent-color
      ]
      const hash = this.userName.split('').reduce((acc, char) => {
        return char.charCodeAt(0) + ((acc << 5) - acc)
      }, 0)
      return colors[Math.abs(hash) % colors.length]
    }
  },
  /**
   * Ciclo de vida: Se ejecuta cuando el componente es creado
   * Carga los datos iniciales necesarios para el dashboard
   */
  created() {
    this.loadUserData()
    this.loadStats()
  },
  methods: {
    /**
     * Carga los datos del usuario autenticado desde el servidor
     * Utiliza el token JWT almacenado en localStorage para la autenticación
     */
    async loadUserData() {
      try {
        const token = localStorage.getItem('x-token')
        const response = await fetch('https://tesis-dn07.onrender.com/api/auth/', {
          headers: {
            'x-token': token
          }
        })
        const data = await response.json()
        if (data.ok) {
          this.userData = data.user
        }
      } catch (error) {
        console.error('Error loading user data:', error)
      }
    },
    /**
     * Carga las estadísticas generales del sistema desde el servidor
     * Incluye total de usuarios, psicólogos, estudiantes y evaluaciones
     */
    async loadStats() {
      try {
        const token = localStorage.getItem('x-token')
        const response = await fetch('https://tesis-dn07.onrender.com/api/statistics/admin', {
          headers: {
            'x-token': token
          }
        })
        const data = await response.json()
        if (data.ok) {
          this.stats = data.stats
          console.log('Estadísticas cargadas:', this.stats)
        } else {
          console.error('Error en la respuesta:', data.msg)
        }
      } catch (error) {
        console.error('Error loading stats:', error)
      }
    }
  }
}
</script>

<style scoped>
.admin-home {
  padding: 2rem;
  background-color: #f8f9fa;
  min-height: calc(100vh - 60px);
}

.card {
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}

.welcome-card {
  margin-bottom: 2rem;
}

.welcome-card .header {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 1rem;
}

.avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  color: white;
  font-weight: bold;
}

.welcome-text h1 {
  margin: 0;
  color: #2c3e50;
  font-size: 2rem;
}

.welcome-text .subtitle {
  color: #666;
  margin-top: 0.5rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.stat-card i {
  font-size: 2.5rem;
  color: #6c5ce7;
}

.stat-content h3 {
  margin: 0;
  color: #2c3e50;
  font-size: 1.1rem;
}

.stat-number {
  font-size: 1.8rem;
  font-weight: bold;
  color: #6c5ce7;
  margin: 0.3rem 0;
}

.stat-label {
  color: #666;
  font-size: 0.9rem;
}

.quick-actions {
  background: white;
}

.quick-actions h2 {
  margin-top: 0;
  margin-bottom: 1.5rem;
  color: #2c3e50;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding: 1rem;
  border: none;
  border-radius: 8px;
  background-color: #f8f9fa;
  color: #2c3e50;
  cursor: pointer;
  transition: all 0.3s ease;
}

.action-btn:hover {
  background-color: #6c5ce7;
  color: white;
}

.action-btn i {
  font-size: 1.2rem;
}

@media (max-width: 768px) {
  .admin-home {
    padding: 1rem;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .actions-grid {
    grid-template-columns: 1fr;
  }
}

.admin-home {
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
}

.welcome-card {
  background: white;
  border-radius: 15px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.header {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #eee;
}

.avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  color: white;
  font-size: 2rem;
}

h1 {
  margin: 0;
  color: #2c3e50;
  font-size: 2rem;
  font-weight: 500;
}

.info-section {
  display: grid;
  gap: 1.5rem;
}

.info-item {
  display: grid;
  gap: 0.5rem;
}

.info-item label {
  color: #6c757d;
  font-size: 0.9rem;
  font-weight: 500;
}

.info-item p {
  margin: 0;
  color: #2c3e50;
  font-size: 1.1rem;
}

@media (max-width: 768px) {
  .admin-home {
    padding: 1rem;
  }

  .header {
    flex-direction: column;
    text-align: center;
  }

  h1 {
    font-size: 1.5rem;
  }
}
</style>
