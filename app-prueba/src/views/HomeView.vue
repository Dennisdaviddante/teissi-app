<!--
Componente HomeView

Este componente implementa la página de inicio principal de la aplicación.
Características:
- Hero section con mensaje de bienvenida
- Sección de características principales
- Call to Action (CTA) para acceder al dashboard
- Diseño responsivo y animaciones
-->

<template>
  <div class="home">
    <header class="hero">
      <h1>Bienvenido a PsicoGest</h1>
      <p class="subtitle">Sistema de Gestión para Profesionales de la Salud Mental</p>
    </header>

    <section class="features">
      <div class="feature-card">
        <i class="fas fa-users"></i>
        <h3>Gestión de Usuarios</h3>
        <p>Administra fácilmente los perfiles de psicólogos y pacientes.</p>
      </div>

      <div class="feature-card">
        <i class="fas fa-calendar-alt"></i>
        <h3>Agenda</h3>
        <p>Organiza las citas y horarios de manera eficiente.</p>
      </div>

      <div class="feature-card">
        <i class="fas fa-chart-line"></i>
        <h3>Reportes</h3>
        <p>Genera informes detallados y estadísticas.</p>
      </div>
    </section>

    <section class="cta">
      <h2>¿Listo para comenzar?</h2>
      <router-link to="/dashboard" class="cta-button">Ir al Dashboard</router-link>
    </section>
  </div>
</template>

<script>
/**
 * Componente de la página de inicio
 * @component
 */
export default {
  name: 'HomeView'
}
</script>

<style scoped>
/* Estilos específicos para la página de inicio */
/* Contenedor principal con padding */
.home {
  padding: 20px;
}

/* Sección hero con gradiente y estilo llamativo */
.hero {
  text-align: center;
  padding: 6rem 2rem;
  background: linear-gradient(135deg, #42b983 0%, #3aa876 100%);
  color: white;
  border-radius: 8px;
  margin-bottom: 40px;
}

@media (max-width: 768px) {
  .hero {
    padding: 4rem 1rem;
  }
}

@media (max-width: 480px) {
  .hero {
    padding: 3rem 1rem;
  }
}

.hero h1 {
  font-size: 2.5em;
  margin-bottom: 20px;
}

.home-view {
  min-height: 100vh;
  min-height: -webkit-fill-available;
  font-family: var(--font-family);
  overflow-x: hidden;
}

/* Grid responsivo para las características */
.features-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
}

/* Tarjetas de características con efectos hover */
.feature-card {
  background: white;
  padding: 6rem 2rem;
  border-radius: 8px;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

@media (max-width: 768px) {
  .feature-card {
    padding: 4rem 1rem;
  }
}

@media (max-width: 480px) {
  .feature-card {
    padding: 3rem 1rem;
  }
}

.feature-card:hover {
  transform: translateY(-5px);
}

.feature-card i {
  font-size: 2em;
  color: #42b983;
  margin-bottom: 15px;
}

.feature-card h3 {
  color: #2c3e50;
  margin-bottom: 10px;
}

.feature-card p {
  color: #666;
  line-height: 1.6;
}

/* Sección Call to Action */
.cta {
  text-align: center;
  padding: 60px 20px;
  background: #f8f9fa;
  border-radius: 8px;
  margin-top: 40px;
}

.cta h2 {
  color: #2c3e50;
  margin-bottom: 20px;
}

/* Botón de llamada a la acción */
.cta-button {
  display: inline-block;
  padding: 12px 24px;
  background-color: #42b983;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  font-weight: bold;
  transition: background-color 0.3s;
}

.cta-button:hover {
  background-color: #3aa876;
}
</style>
