<template>
  <div class="min-h-screen"> 
      <div class="text-center mb-8">
        <div class="flex items-center justify-center gap-3 mb-4">
          <FileTextIcon class="h-8 w-8 !text-primary-600" />
          <h1 class="text-3xl font-bold text-gray-900">
            Escala Columbia de Evaluación del Riesgo de Suicidio
          </h1>
        </div>
        <p class="text-gray-600 max-w-2xl mx-auto">
          Herramienta de evaluación sistemática para detectar y evaluar el riesgo suicida en pacientes
        </p>
      </div>


          <!-- Progress Bar -->
    <div class="bg-white border-b border-gray-200 print-hidden">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="py-4">
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm font-medium text-gray-700">
              Paso {{ currentStep }} de 5: {{ currentStepTitle }}
            </span>
            <span class="text-sm text-gray-500">{{ progress }}% completado</span>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-2">
            <div 
              class="bg-primary-600 h-2 rounded-full transition-all duration-500 ease-out" 
              :style="{ width: progress + '%' }"
            ></div>
          </div>
        </div>
      </div>
    </div>
    <!-- Patient Information Form -->
    <FormCardd 
      title="Información del Paciente" 
      description="Datos básicos requeridos para la evaluación"
      :icon="UserIcon"
    >
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="space-y-2">
          <label for="patient-name" class="block text-sm font-medium text-gray-700">
            Nombre del Paciente *
          </label>
          <input
          v-if="student"
            id="patient-name"
            type="text"
            placeholder="Nombre completo del paciente"
            class="form-input"
            required
            :value="fullName"  disabled
          />
        </div>

        <div class="space-y-2">
          <label for="patient-age" class="block text-sm font-medium text-gray-700">
            Edad *
          </label>
          <input
          v-if="student"
            id="patient-age"
                  @input="updateData"
            type="number"
            min="1"
            max="120"
            placeholder="Edad en años"
            class="form-input"
            :value="student.age"  disabled
            required
          />
        </div>

        <div class="space-y-2">
          <label for="patient-id" class="block text-sm font-medium text-gray-700">
            ID del Paciente
          </label>
          <input
          v-if="student"
            id="patient-id"
                 @input="updateData"
            type="text"
            placeholder="Número de identificación o expediente"
            class="form-input"
            :value="student._id"  disabled
          />
        </div>

        <div class="space-y-2">
          <label for="evaluation-date" class="block text-sm font-medium text-gray-700">
            Fecha de Evaluación *
          </label>
          <input
          v-if="student"
            id="evaluation-date"
                   @input="updateData"
            type="text"
            class="form-input"
            :value=" formatDateToReadable(student.createdAt)"  disabled
            required
          />
        </div>

        <div class="space-y-2 md:col-span-2">
          <label for="clinician-name" class="block text-sm font-medium text-gray-700">
            Profesional Evaluador *
          </label>
          <input
          v-if="student"
            id="clinician-name"
           
            @input="updateData"
            type="text"
            placeholder="Nombre del profesional que realiza la evaluación"
            class="form-input"
                        :value="assignedPsychologistFullName"  disabled

            required
          />
        </div>
      </div>
    </FormCardd>
    
  </div>
</template>

  <script>
  import FormCardd from '@/components/FormCardd.vue';
import axios from 'axios';
import { 
  FileText as FileTextIcon,
  User as UserIcon,
  Brain as BrainIcon,
  Activity as ActivityIcon,
  AlertTriangle as AlertTriangleIcon,
  BarChart3 as BarChart3Icon,
  CheckCircle as CheckCircleIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon
} from 'lucide-vue-next'
  export default {
      components: {
        FileTextIcon,
    FormCardd, 
  },
    data() {
      return {
        student: null
      }
    },
    async created() {
      await this.fetchStudentDetails()
    },
    methods: {

formatDateToReadable(isoDateString) {
  console.log('--- formatDateToReadable llamada ---');
  console.log('isoDateString recibido:', isoDateString); 

  if (!isoDateString || typeof isoDateString !== 'string') {
    console.warn('formatDateToReadable: Valor de entrada no válido. Retornando "Fecha no disponible".');
    return 'Fecha no disponible';
  }

  const date = new Date(isoDateString);
  console.log('Objeto Date creado:', date); 

  if (isNaN(date.getTime())) {
    console.error('formatDateToReadable: La fecha parseada es inválida. Asegúrese de que isoDateString es un formato válido.');
    return 'Fecha inválida'; 
  }

  const dateOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };

 
  const formattedDate = date.toLocaleDateString('es-EC', dateOptions);
  console.log('Fecha formateada retornada:', formattedDate); // **Importante:** ¿Qué cadena final es?

  return formattedDate;
},
      async fetchStudentDetails() {
        try {
          const token = localStorage.getItem('x-token');
          const studentId = this.$route.params.id;
          const response = await axios.get(`https://tesis-dn07.onrender.com/api/students/${studentId}`, {
            headers: {
              'x-token': token
            }
          });
          this.student = response.data;

          console.log("este es el studente cargado ", this.student)
          this.loading = false;
        } catch (error) {
          console.error('Error al obtener detalles del estudiante:', error);
          this.loading = false;
        }
      },
    },
computed: {
  fullName() {
    
    const tempStudent = this.student; 
    console.log('--- Calculando fullName ---');
    console.log('tempStudent:', tempStudent); 

    if (tempStudent) { 
      const firstName = tempStudent.firstName || '';
      const lastName = tempStudent.lastName || '';


      const full = `${firstName} ${lastName}`.trim();
      console.log('fullName calculado:', full);
      return full;
    }
    console.log('student es null, retornando vacío.');
    return '';
  },
   assignedPsychologistFullName() {
      if (this.student && this.student.assignedPsychologist) {
        const psychologist = this.student.assignedPsychologist;
        const firstName = psychologist.firstName || '';
        const lastName = psychologist.lastName || '';
        const full = `${firstName} ${lastName}`.trim();
        console.log('assignedPsychologistFullName calculado:', full); 
        return full;
      }
      console.log('assignedPsychologist es null o no existe, retornando vacío para assignedPsychologistFullName.');
      return '';
    }
},
  
      setup() {
    return {
      UserIcon,
      FileTextIcon
    }}

  }

</script>

<style>

/* Custom form styles */
.form-input {
  @apply w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors;
}

.form-textarea {
  @apply w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors min-h-[100px] resize-y;
}

.form-radio {
  @apply w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500;
}

.btn-primary {
  @apply px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors font-medium;
}

.btn-secondary {
  @apply px-6 py-3 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors font-medium;
}

.card {
  @apply bg-white rounded-xl shadow-sm border border-gray-200;
}

.alert-success {
  @apply bg-green-50 border border-green-200 text-green-800 rounded-lg p-4;
}

.alert-warning {
  @apply bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-lg p-4;
}

.alert-danger {
  @apply bg-red-50 border border-red-200 text-red-800 rounded-lg p-4;
}

.alert-info {
  @apply bg-blue-50 border border-blue-200 text-blue-800 rounded-lg p-4;
}

</style>