<!--
Componente StatisticsView

Este componente muestra estadísticas detalladas de las evaluaciones de riesgo suicida.
Visualiza los datos mediante gráficos de tipo donut para:
- Niveles de riesgo (Bajo, Medio, Alto)
- Distribución por género
- Distribución por carrera
-->

<template>
  <div class="statistics-container">
    <h1 class="text-center mb-4">Estadísticas</h1>

    <div v-if="loading" class="text-center">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Cargando...</span>
      </div>
    </div>

    <div v-else class="charts-container">
      <div class="row">
        <div class="col-md-4">
          <h3>Niveles de Riesgo</h3>
          <apexchart
            v-if="statistics.riskLevels.length > 0"
            type="donut"
            height="350"
            :options="riskChartOptions"
            :series="riskChartSeries"
          />
          <p v-else class="text-center text-gray-500">No hay datos disponibles</p>
        </div>
        <div class="col-md-4">
          <h3>Evaluaciones por Género</h3>
          <apexchart
            v-if="statistics.genderStats.length > 0"
            type="donut"
            height="350"
            :options="genderChartOptions"
            :series="genderChartSeries"
          />
          <p v-else class="text-center text-gray-500">No hay datos disponibles</p>
        </div>
        <div class="col-md-4">
          <h3>Evaluaciones por Carrera</h3>
          <apexchart
            v-if="statistics.careerStats.length > 0"
            type="donut"
            height="350"
            :options="careerChartOptions"
            :series="careerChartSeries"
          />
          <p v-else class="text-center text-gray-500">No hay datos disponibles</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Importaciones necesarias de Vue y Axios
import { ref, computed, defineExpose, nextTick } from 'vue';
import axios from 'axios';

// Estado reactivo para el indicador de carga y los datos estadísticos
const loading = ref(true);
// Estructura de datos para almacenar las estadísticas
const statistics = ref({
  total: 0,
  riskLevels: [],
  genderStats: [],
  careerStats: []
});

// Configuración del gráfico de niveles de riesgo
const riskChartOptions = {
  chart: {
    type: 'donut'
  },
  labels: ['Bajo', 'Medio', 'Alto'],
  colors: ['#4CAF50', '#FFC107', '#F44336'],
  legend: {
    position: 'bottom'
  },
  plotOptions: {
    pie: {
      donut: {
        size: '70%',
        labels: {
          show: true,
          total: {
            show: true,
            label: 'Total',
            formatter: function (w) {
              return w.globals.seriesTotals.reduce((a, b) => a + b, 0);
            }
          }
        }
      }
    }
  },
  noData: {
    text: 'No hay datos disponibles',
    align: 'center',
    verticalAlign: 'middle',
    offsetY: 0,
    style: {
      fontSize: '16px'
    }
  }
};

// Calcula las series de datos para el gráfico de niveles de riesgo
const riskChartSeries = computed(() => {
  const riskLevels = statistics.value.riskLevels || [];
  const seriesData = [0, 0, 0]; // [Bajo, Medio, Alto]

  riskLevels.forEach(level => {
    if (level._id === 'BAJO') {
      seriesData[0] = level.count;
    } else if (level._id === 'MODERADO') {
      seriesData[1] = level.count;
    } else if (level._id === 'ALTO') {
      seriesData[2] = level.count;
    }
  });

  return seriesData;
});

/**
 * Carga las estadísticas desde el servidor
 * Utiliza el token JWT para la autenticación
 * Actualiza el estado local con los datos recibidos
 */
const loadStatistics = async () => {
  try {
    loading.value = true;
    const token = localStorage.getItem('x-token');
    const response = await axios.get('https://tesis-dn07.onrender.com/api/suicide-assessments/statistics', {
      headers: {
        'x-token': token
      }
    });

    if (response.data.ok) {
      statistics.value = response.data.statistics;
    }
  } catch (error) {
    console.error('Error al cargar estadísticas:', error);
  } finally {
    loading.value = false;
  }
};

loadStatistics();

// Configuración del gráfico de distribución por género
const genderChartOptions = {
  labels: ['Masculino', 'Femenino'],
  legend: {
    position: 'bottom'
  },
  colors: ['#4CAF50', '#E91E63'],
  plotOptions: {
    pie: {
      donut: {
        size: '70%',
        labels: {
          show: true,
          total: {
            show: true,
            label: 'Total'
          }
        }
      }
    }
  }
};

// Configuración del gráfico de distribución por carrera
// Se usa ref() porque las etiquetas se actualizan dinámicamente
const careerChartOptions = ref({
  legend: {
    position: 'bottom'
  },
  colors: ['#FF9800', '#2196F3', '#9C27B0', '#F44336', '#009688', '#795548'],
  plotOptions: {
    pie: {
      donut: {
        size: '70%',
        labels: {
          show: true,
          total: {
            show: true,
            label: 'Total'
          }
        }
      }
    }
  },
  labels: []
});

// Calcula las series de datos para el gráfico de género
// Transforma los datos del backend al formato requerido por ApexCharts
const genderChartSeries = computed(() => {
  const genderStats = statistics.value.genderStats || [];
  const seriesData = [0, 0]; // [Masculino, Femenino]

  genderStats.forEach(stat => {
    if (stat._id === 'MASCULINO') {
      seriesData[0] = stat.count;
    } else if (stat._id === 'FEMENINO') {
      seriesData[1] = stat.count;
    }
  });

  return seriesData;
});

// Series para el gráfico de carrera
const careerChartSeries = computed(() => {
  const careerStats = statistics.value.careerStats || [];
  
  // Preparar datos y etiquetas
  const seriesData = [];
  const labels = [];
  
  careerStats.forEach(stat => {
    if (stat._id) {
      seriesData.push(stat.count);
      labels.push(stat._id);
    }
  });

    // Actualizar las etiquetas del gráfico en el siguiente tick para evitar efectos secundarios
  nextTick(() => {
    careerChartOptions.value.labels = labels;
  });

  return seriesData;
});

// Exportar las variables necesarias para el template
defineExpose({
  loading,
  statistics,
  riskChartOptions,
  riskChartSeries,
  genderChartOptions,
  genderChartSeries,
  careerChartOptions,
  careerChartSeries
});
</script>

<style scoped>
.statistics-view {
  padding: 2rem;
  font-family: var(--font-family);

  @media (max-width: 768px) {
    padding: 1rem;
  }
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;
  margin-bottom: 2rem;

  @media (max-width: 1200px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
}

.chart-wrapper {
  flex: 1;
  min-width: 300px;
  max-width: 500px;
  background: white;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.stat-card {
  background: white;
  padding: 1.5rem;
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-md);
  text-align: center;

  @media (max-width: 768px) {
    padding: 1.25rem;
  }

  @media (max-width: 480px) {
    padding: 1rem;
    border-radius: var(--border-radius-md);
  }
}

.chart-wrapper h3 {
  text-align: center;
  margin-bottom: 1rem;
  color: #2c3e50;
  font-size: 1.25rem;
}

.stat-label {
  color: var(--text-secondary);
  font-size: 0.9rem;

  @media (max-width: 480px) {
    font-size: 0.85rem;
  }
}

.charts-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
}

.spinner-border {
  display: inline-block;
  width: 2rem;
  height: 2rem;
  vertical-align: text-bottom;
  border: 0.25em solid currentColor;
  border-right-color: transparent;
  border-radius: 50%;
  animation: spinner-border .75s linear infinite;
}

@keyframes spinner-border {
  to { transform: rotate(360deg); }
}
</style>
