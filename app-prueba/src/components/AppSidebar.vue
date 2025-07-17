<template>
  <aside class="sidebar">
    <div class="sidebar-header">
      <div class="user-profile">
        <div class="avatar" :style="{ backgroundColor: avatarColor }">
          <span>{{ userInitials }}</span>
        </div>
        <div class="user-info">
          <h3>{{ userName }}</h3>
          <p>{{ userRole }}</p>
        </div>
      </div>
    </div>

    <nav class="sidebar-nav">
      <template v-if="isAdmin">
        <SidebarLink
          to="/dashboard/home"
          icon="fas fa-home"
          text="Inicio"
        />
        <SidebarLink
          to="/dashboard/profile"
          icon="fas fa-user"
          text="Mi Perfil"
        />
        <SidebarLink
          to="/dashboard/users"
          icon="fas fa-users"
          text="Lista de Psicólogos"
        />
      </template>
      <template v-else>
        <SidebarLink
          to="/psychologist/dashboard"
          icon="fas fa-home"
          text="Inicio"
        />
        <SidebarLink
          to="/psychologist/dashboard/profile"
          icon="fas fa-user"
          text="Mi Perfil"
        />
        <SidebarLink
          to="/psychologist/dashboard/patients"
          icon="fas fa-users"
          text="Mis Pacientes"
        />
        <SidebarLink
          to="/psychologist/dashboard/statistics"
          icon="fas fa-chart-bar"
          text="Estadísticas"
        />
        <SidebarLink
          to="/psychologist/dashboard/report"
          icon="fas fa-chart-bar"
          text="Evaluaciones"
        />
        <SidebarLink
          to="/psychologist/dashboard/history"
          icon="fas fa-chart-bar"
          text="Historial"
        />
      </template>
    </nav>

    <div class="sidebar-footer">
      <button class="logout-btn" @click="handleLogout">
        <i class="fas fa-sign-out-alt"></i>
        Cerrar Sesión
      </button>
    </div>
  </aside>
</template>

<script>
import { mapState } from 'vuex'
import SidebarLink from './SidebarLink.vue'

export default {
  name: 'AppSidebar',
  components: {
    SidebarLink
  },
  data() {
    return {
      userData: null
    }
  },
  computed: {
    ...mapState(['user']),
    isAdmin() {
      return this.userData?.user?.role === 'ADMIN'
    },
    userName() {
      if (this.userData?.user?.firstName && this.userData?.user?.lastName) {
        return `${this.userData.user.firstName} ${this.userData.user.lastName}`
      }
      return this.userData?.user?.name || ''
    },
    userRole() {
      return this.userData?.user?.role === 'ADMIN' ? 'Administrador' : 'Psicólogo'
    },
    userInitials() {
      if (!this.userData?.user?.name && !this.userName) return ''
      const name = this.userName
      return name
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    },
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
  created() {
    this.loadUserData()
  },
  methods: {
    loadUserData() {
      const userDataStr = localStorage.getItem('user-data')
      if (userDataStr) {
        try {
          this.userData = JSON.parse(userDataStr)
        } catch (error) {
          console.error('Error parsing user data:', error)
          this.userData = null
        }
      }
    },
    handleLogout() {
      localStorage.removeItem('x-token')
      localStorage.removeItem('user-data')
      this.$store.commit('logout')
      this.$router.push('/login')
    }
  }
}
</script>

<style scoped>
.sidebar {
  width: 280px;
  background: linear-gradient(180deg, #7f53ac 0%, #647dee 100%);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  box-shadow: var(--shadow-lg);
  z-index: 100;
  transition: transform 0.3s ease;
  transform: translateX(0);
}

.sidebar-header {
  padding: 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  color: white;
  font-size: 1.2rem;
}

.user-info {
  color: white;
}

.user-info h3 {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 500;
}

.user-info p {
  margin: 0.2rem 0 0;
  font-size: 0.9rem;
  opacity: 0.8;
}

.sidebar-nav {
  padding: 1rem 0;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.sidebar-footer {
  padding: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.logout-btn {
  width: 100%;
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.2);
  color: white;
  padding: 0.8rem;
  border-radius: 8px;
  font-family: 'Poppins', sans-serif;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.logout-btn:hover {
  background: rgba(255, 255, 255, 0.9);
  color: #7f53ac;
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  .sidebar {
    width: 280px;
    transform: translateX(-100%);
  }

  .sidebar.mobile-open {
    transform: translateX(0);
  }

  .user-info h3 {
    font-size: 1rem;
  }

  .user-info p {
    font-size: 0.8rem;
  }

  .sidebar-nav {
    padding: 1rem;
  }

  .sidebar-footer {
    padding: 1rem;
  }
}
</style>
