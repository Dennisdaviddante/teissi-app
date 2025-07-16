<template>
  <div class="container mx-auto p-6 bg-gray-100 min-h-screen">
    <h1 class="text-3xl font-bold text-gray-800 mb-8 text-center">
      Evaluación de Ideación y Comportamiento Suicida
    </h1>

    <Form @submit="handleSubmit" :validation-schema="validationSchema" v-slot="{ errors, meta }" class="space-y-8">
      <div class="bg-white p-6 rounded-lg shadow-md">
        <h2 class="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">Datos Generales</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label for="studentId" class="block text-sm font-medium text-gray-700">ID del Estudiante</label>
            <Field
              name="student"
              id="studentId"
              type="text"
              v-model="assessmentData.student"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              :class="{ 'border-red-500': errors.student }"
            />
            <ErrorMessage name="student" class="text-red-600 text-sm mt-1" />
          </div>
          </div>
      </div>

      <div class="bg-white p-6 rounded-lg shadow-md">
        <h2 class="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">Intensidad de la Ideación</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label for="mostSeriousIdeationType" class="block text-sm font-medium text-gray-700">
              Tipo de Ideación Más Seria (1-5)
            </label>
            <Field
              name="ideationIntensity.mostSeriousIdeationType"
              id="mostSeriousIdeationType"
              type="number"
              v-model="assessmentData.ideationIntensity.mostSeriousIdeationType"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              :class="{ 'border-red-500': errors['ideationIntensity.mostSeriousIdeationType'] }"
            />
            <ErrorMessage name="ideationIntensity.mostSeriousIdeationType" class="text-red-600 text-sm mt-1" />
          </div>
          <div>
            <label for="mostSeriousIdeationDescription" class="block text-sm font-medium text-gray-700">
              Descripción de la Ideación Más Seria
            </label>
            <Field
              name="ideationIntensity.mostSeriousIdeationDescription"
              id="mostSeriousIdeationDescription"
              as="textarea"
              v-model="assessmentData.ideationIntensity.mostSeriousIdeationDescription"
              rows="3"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              :class="{ 'border-red-500': errors['ideationIntensity.mostSeriousIdeationDescription'] }"
            />
            <ErrorMessage name="ideationIntensity.mostSeriousIdeationDescription" class="text-red-600 text-sm mt-1" />
          </div>
          <div>
            <label for="frequency" class="block text-sm font-medium text-gray-700">
              Frecuencia (0-4)
            </label>
            <Field
              name="ideationIntensity.frequency"
              id="frequency"
              type="number"
              v-model="assessmentData.ideationIntensity.frequency"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              :class="{ 'border-red-500': errors['ideationIntensity.frequency'] }"
            />
            <ErrorMessage name="ideationIntensity.frequency" class="text-red-600 text-sm mt-1" />
          </div>
        </div>
      </div>

      <template v-for="(section, sectionKey) in ideationSections" :key="sectionKey">
        <div class="bg-white p-6 rounded-lg shadow-md">
          <h2 class="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">
            {{ getSectionTitle(sectionKey) }}
          </h2>
          <p class="text-gray-600 text-sm mb-4 italic">{{ assessmentData[sectionKey].pregunta_principal_texto }}</p>

          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">Respuesta de la Sección Principal</label>
            <div class="flex items-center space-x-4">
              <Field
                :name="`${sectionKey}.respuesta_seccion`"
                :id="`${sectionKey}-si`"
                type="radio"
                :value="true"
                v-model="assessmentData[sectionKey].respuesta_seccion"
                class="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
              />
              <label :for="`${sectionKey}-si`" class="text-sm font-medium text-gray-700">Sí</label>

              <Field
                :name="`${sectionKey}.respuesta_seccion`"
                :id="`${sectionKey}-no`"
                type="radio"
                :value="false"
                v-model="assessmentData[sectionKey].respuesta_seccion"
                class="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
              />
              <label :for="`${sectionKey}-no`" class="text-sm font-medium text-gray-700">No</label>
            </div>
            <ErrorMessage :name="`${sectionKey}.respuesta_seccion`" class="text-red-600 text-sm mt-1" />
          </div>

          <div v-if="assessmentData[sectionKey].respuesta_seccion !== null">
            <label :for="`${sectionKey}-desc`" class="block text-sm font-medium text-gray-700">Descripción de la Sección</label>
            <Field
              :name="`${sectionKey}.descripcion_seccion`"
              :id="`${sectionKey}-desc`"
              as="textarea"
              v-model="assessmentData[sectionKey].descripcion_seccion"
              rows="3"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              :class="{ 'border-red-500': errors[`${sectionKey}.descripcion_seccion`] }"
            />
            <ErrorMessage :name="`${sectionKey}.descripcion_seccion`" class="text-red-600 text-sm mt-1" />
          </div>

          <div v-if="assessmentData[sectionKey].respuesta_seccion">
            <h3 class="text-lg font-medium text-gray-700 mt-6 mb-3">Sub-preguntas:</h3>
            <div v-for="(sub, subIndex) in assessmentData[sectionKey].sub_preguntas" :key="sub.id" class="mb-4 p-4 border border-gray-200 rounded-md bg-gray-50">
              <p class="text-sm font-semibold text-gray-800 mb-2">{{ sub.texto }}</p>
              <div class="flex items-center space-x-4 mb-2">
                <label :for="`${sectionKey}-${sub.id}-si`" class="text-sm font-medium text-gray-700">
                  <Field
                    :name="`${sectionKey}.sub_preguntas[${subIndex}].respuesta`"
                    :id="`${sectionKey}-${sub.id}-si`"
                    type="radio"
                    :value="true"
                    v-model="sub.respuesta"
                    class="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                  />
                  Sí
                </label>
                <label :for="`${sectionKey}-${sub.id}-no`" class="text-sm font-medium text-gray-700">
                  <Field
                    :name="`${sectionKey}.sub_preguntas[${subIndex}].respuesta`"
                    :id="`${sectionKey}-${sub.id}-no`"
                    type="radio"
                    :value="false"
                    v-model="sub.respuesta"
                    class="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                  />
                  No
                </label>
              </div>
              <ErrorMessage :name="`${sectionKey}.sub_preguntas[${subIndex}].respuesta`" class="text-red-600 text-sm mt-1" />

              <div v-if="sub.respuesta !== null" class="mt-2">
                <label :for="`${sectionKey}-${sub.id}-desc`" class="block text-sm font-medium text-gray-700">Descripción:</label>
                <Field
                  :name="`${sectionKey}.sub_preguntas[${subIndex}].descripcion`"
                  :id="`${sectionKey}-${sub.id}-desc`"
                  as="textarea"
                  v-model="sub.descripcion"
                  rows="2"
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  :class="{ 'border-red-500': errors[`${sectionKey}.sub_preguntas[${subIndex}].descripcion`] }"
                />
                <ErrorMessage :name="`${sectionKey}.sub_preguntas[${subIndex}].descripcion`" class="text-red-600 text-sm mt-1" />
              </div>
            </div>
          </div>
        </div>
      </template>

      <div class="bg-white p-6 rounded-lg shadow-md">
        <h2 class="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">Comportamiento Suicida</h2>

        <template v-for="(behaviorSubSection, bSectionKey) in behaviorSubSections" :key="bSectionKey">
          <div class="mb-8 p-4 border border-blue-200 rounded-md bg-blue-50">
            <h3 class="text-lg font-medium text-blue-800 mb-3">{{ getBehaviorSubSectionTitle(bSectionKey) }}</h3>
            <p class="text-gray-600 text-sm mb-4 italic">{{ assessmentData.comportamiento_suicida[bSectionKey].pregunta_principal_texto }}</p>

            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">Respuesta de la Sub-Sección Principal</label>
              <div class="flex items-center space-x-4">
                <Field
                  :name="`comportamiento_suicida.${bSectionKey}.respuesta_seccion`"
                  :id="`cs-${bSectionKey}-si`"
                  type="radio"
                  :value="true"
                  v-model="assessmentData.comportamiento_suicida[bSectionKey].respuesta_seccion"
                  class="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                />
                <label :for="`cs-${bSectionKey}-si`" class="text-sm font-medium text-gray-700">Sí</label>

                <Field
                  :name="`comportamiento_suicida.${bSectionKey}.respuesta_seccion`"
                  :id="`cs-${bSectionKey}-no`"
                  type="radio"
                  :value="false"
                  v-model="assessmentData.comportamiento_suicida[bSectionKey].respuesta_seccion"
                  class="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                />
                <label :for="`cs-${bSectionKey}-no`" class="text-sm font-medium text-gray-700">No</label>
              </div>
              <ErrorMessage :name="`comportamiento_suicida.${bSectionKey}.respuesta_seccion`" class="text-red-600 text-sm mt-1" />
            </div>

            <div v-if="assessmentData.comportamiento_suicida[bSectionKey].respuesta_seccion !== null">
              <label :for="`cs-${bSectionKey}-desc`" class="block text-sm font-medium text-gray-700">Descripción de la Sub-Sección</label>
              <Field
                :name="`comportamiento_suicida.${bSectionKey}.descripcion_seccion`"
                :id="`cs-${bSectionKey}-desc`"
                as="textarea"
                v-model="assessmentData.comportamiento_suicida[bSectionKey].descripcion_seccion"
                rows="3"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                :class="{ 'border-red-500': errors[`comportamiento_suicida.${bSectionKey}.descripcion_seccion`] }"
              />
              <ErrorMessage :name="`comportamiento_suicida.${bSectionKey}.descripcion_seccion`" class="text-red-600 text-sm mt-1" />
            </div>

            <div v-if="assessmentData.comportamiento_suicida[bSectionKey].respuesta_seccion">
              <div v-if="bSectionKey !== 'actos_preparatorios'" class="mb-4">
                <label :for="`cs-${bSectionKey}-num-intentos`" class="block text-sm font-medium text-gray-700">Número de Intentos</label>
                <Field
                  :name="`comportamiento_suicida.${bSectionKey}.numero_de_intentos`"
                  :id="`cs-${bSectionKey}-num-intentos`"
                  type="number"
                  v-model.number="assessmentData.comportamiento_suicida[bSectionKey].numero_de_intentos"
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  :class="{ 'border-red-500': errors[`comportamiento_suicida.${bSectionKey}.numero_de_intentos`] }"
                />
                <ErrorMessage :name="`comportamiento_suicida.${bSectionKey}.numero_de_intentos`" class="text-red-600 text-sm mt-1" />
              </div>

              <h4 class="text-md font-medium text-gray-700 mt-6 mb-3">Sub-preguntas de Comportamiento:</h4>
              <div v-for="(sub, subIndex) in assessmentData.comportamiento_suicida[bSectionKey].sub_preguntas" :key="sub.id" class="mb-4 p-3 border border-gray-100 rounded-md bg-white">
                <p class="text-sm font-semibold text-gray-800 mb-2">{{ sub.texto }}</p>
                <div class="flex items-center space-x-4 mb-2">
                  <label :for="`cs-${bSectionKey}-${sub.id}-si`" class="text-sm font-medium text-gray-700">
                    <Field
                      :name="`comportamiento_suicida.${bSectionKey}.sub_preguntas[${subIndex}].respuesta`"
                      :id="`cs-${bSectionKey}-${sub.id}-si`"
                      type="radio"
                      :value="true"
                      v-model="sub.respuesta"
                      class="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                    />
                    Sí
                  </label>
                  <label :for="`cs-${bSectionKey}-${sub.id}-no`" class="text-sm font-medium text-gray-700">
                    <Field
                      :name="`comportamiento_suicida.${bSectionKey}.sub_preguntas[${subIndex}].respuesta`"
                      :id="`cs-${bSectionKey}-${sub.id}-no`"
                      type="radio"
                      :value="false"
                      v-model="sub.respuesta"
                      class="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                    />
                    No
                  </label>
                </div>
                <ErrorMessage :name="`comportamiento_suicida.${bSectionKey}.sub_preguntas[${subIndex}].respuesta`" class="text-red-600 text-sm mt-1" />

                <div v-if="sub.respuesta !== null" class="mt-2">
                  <label :for="`cs-${bSectionKey}-${sub.id}-desc`" class="block text-sm font-medium text-gray-700">Descripción:</label>
                  <Field
                    :name="`comportamiento_suicida.${bSectionKey}.sub_preguntas[${subIndex}].descripcion`"
                    :id="`cs-${bSectionKey}-${sub.id}-desc`"
                    as="textarea"
                    v-model="sub.descripcion"
                    rows="2"
                    class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    :class="{ 'border-red-500': errors[`comportamiento_suicida.${bSectionKey}.sub_preguntas[${subIndex}].descripcion`] }"
                  />
                  <ErrorMessage :name="`comportamiento_suicida.${bSectionKey}.sub_preguntas[${subIndex}].descripcion`" class="text-red-600 text-sm mt-1" />
                </div>
              </div>
            </div>
          </div>
        </template>
      </div>

      <div class="bg-white p-6 rounded-lg shadow-md">
        <h2 class="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">Grado de Letalidad y Lesiones</h2>
        <div>
          <label for="gradoLetalidad" class="block text-sm font-medium text-gray-700">
            Grado de Letalidad (0-5)
          </label>
          <Field
            name="grado_letalidad_lesiones"
            id="gradoLetalidad"
            type="number"
            v-model="assessmentData.grado_letalidad_lesiones"
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            :class="{ 'border-red-500': errors.grado_letalidad_lesiones }"
          />
          <ErrorMessage name="grado_letalidad_lesiones" class="text-red-600 text-sm mt-1" />
          <p class="text-sm text-gray-500 mt-2">
            0: No hay daño físico o muy poco daño físico (p. ej., rasguños superficiales).<br>
            1: Daño físico menor (p. ej., habla aletargada, quemaduras de primer grado, sangrado ligero, esguinces).<br>
            2: Daño físico moderado: necesita atención médica (p. ej., está consciente pero somnoliento/a, responde un poco, quemaduras de segundo grado, sangrado de un vaso sanguíneo importante).<br>
            3: Daño físico moderadamente grave: necesita hospitalización médica y probable cuidado intensivo.<br>
            4: Daño físico grave: necesita hospitalización médica con cuidado intensivo.<br>
            5: Muerte.
          </p>
        </div>
      </div>

      <div class="flex justify-end mt-8">
        <button
          type="submit"
          :disabled="!meta.valid || isSubmitting"
          class="inline-flex justify-center py-3 px-6 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ isSubmitting ? 'Guardando...' : 'Guardar Evaluación' }}
        </button>
      </div>

      <div v-if="submissionSuccess" class="mt-4 p-3 bg-green-100 text-green-700 rounded-md">
        ¡Evaluación guardada con éxito!
      </div>
      <div v-if="submissionError" class="mt-4 p-3 bg-red-100 text-red-700 rounded-md">
        Error al guardar la evaluación: {{ submissionError }}
      </div>
    </Form>
  </div>
</template>

<script >
import { reactive, watch, ref, computed } from 'vue';
import { Form, Field, ErrorMessage } from 'vee-validate';
import * as yup from 'yup';
// Asegúrate de que estas rutas sean correctas para tu proyecto
import { defaultSubPreguntas, initializeSectionSubQuestions } from '@/config/questions';

export default {
  name: 'SuicideAssessmentForm',
  components: {
    Form,
    Field,
    ErrorMessage,
  },
  setup() {
    // Estados reactivos para la UI
    const isSubmitting = ref(false);
    const submissionSuccess = ref(false);
    const submissionError = ref(null);

    // Definición de las secciones de ideación para iterar
    const ideationSections = [
      'deseos_de_morir',
      'pensamientos_suicidas_no_especificos',
      'ideacion_con_metodo_sin_plan_ni_intencion',
      'ideacion_con_intencion_sin_plan_especifico',
      'ideacion_con_plan_e_intencion',
    ];

    // Definición de las subsecciones de comportamiento suicida
    const behaviorSubSections = [
      'intento_real',
      'intento_interrumpido',
      'intento_abortado',
      'actos_preparatorios',
    ];

    // Inicialización del estado del formulario con datos reactivos
    const assessmentData = reactive({
      student: '',
      ideationIntensity: {
        mostSeriousIdeationType: null,
        mostSeriousIdeationDescription: '',
        frequency: null,
      },
      // Inicializar cada sección de ideación con su estructura completa de sub-preguntas
      deseos_de_morir: initializeSectionSubQuestions('deseos_de_morir'),
      pensamientos_suicidas_no_especificos: initializeSectionSubQuestions('pensamientos_suicidas_no_especificos'),
      ideacion_con_metodo_sin_plan_ni_intencion: initializeSectionSubQuestions('ideacion_con_metodo_sin_plan_ni_intencion'),
      ideacion_con_intencion_sin_plan_especifico: initializeSectionSubQuestions('ideacion_con_intencion_sin_plan_especifico'),
      ideacion_con_plan_e_intencion: initializeSectionSubQuestions('ideacion_con_plan_e_intencion'),
      // Inicializar la sección de comportamiento suicida
      comportamiento_suicida: initializeSectionSubQuestions('comportamiento_suicida'),
      grado_letalidad_lesiones: null,
    });

    // --- Lógica de Negocio en el Frontend (Observadores para limpiar datos) ---

    // Observador para la sección 'deseos_de_morir'
    watch(() => assessmentData.deseos_de_morir.respuesta_seccion, (newValue) => {
      if (newValue === false) {
        assessmentData.deseos_de_morir.descripcion_seccion = null;
        assessmentData.deseos_de_morir.sub_preguntas.forEach(q => { q.respuesta = null; q.descripcion = null; });
      }
    });

    // Observador para la sección 'pensamientos_suicidas_no_especificos'
    watch(() => assessmentData.pensamientos_suicidas_no_especificos.respuesta_seccion, (newValue) => {
      if (newValue === false) {
        assessmentData.pensamientos_suicidas_no_especificos.descripcion_seccion = null;
        assessmentData.pensamientos_suicidas_no_especificos.sub_preguntas.forEach(q => { q.respuesta = null; q.descripcion = null; });
      }
    });

    // Computed property para determinar si ambas secciones principales de ideación son "No"
    const shouldClearIdeationDetails = computed(() => {
      return assessmentData.deseos_de_morir.respuesta_seccion === false &&
             assessmentData.pensamientos_suicidas_no_especificos.respuesta_seccion === false;
    });

    // Observador para limpiar secciones de ideación dependientes si no hay ideación principal
    watch(shouldClearIdeationDetails, (newValue) => {
      if (newValue) {
        // Limpia los campos de intensidad de ideación
        assessmentData.ideationIntensity.mostSeriousIdeationType = null;
        assessmentData.ideationIntensity.mostSeriousIdeationDescription = '';
        assessmentData.ideationIntensity.frequency = null;

        // Limpia las secciones 3, 4 y 5
        ideationSections.slice(2).forEach(sectionKey => {
          if (assessmentData[sectionKey]) { // Asegura que la sección exista antes de intentar limpiarla
            assessmentData[sectionKey].respuesta_seccion = null;
            assessmentData[sectionKey].descripcion_seccion = null;
            // Reinicializa las sub_preguntas a su estado por defecto (respuestas y descripciones nulas)
            assessmentData[sectionKey].sub_preguntas = defaultSubPreguntas[sectionKey].sub_preguntas.map(q => ({
              id: q.id,
              texto: q.texto,
              respuesta: null,
              descripcion: null,
            }));
          }
        });
      }
    }, { immediate: true }); // Se ejecuta inmediatamente al montar el componente para asegurar estado inicial

    // Observadores para sub-secciones de comportamiento suicida
    behaviorSubSections.forEach(bSectionKey => {
      watch(() => assessmentData.comportamiento_suicida[bSectionKey].respuesta_seccion, (newValue) => {
        if (newValue === false) {
          assessmentData.comportamiento_suicida[bSectionKey].descripcion_seccion = null;
          if (bSectionKey !== 'actos_preparatorios') {
            assessmentData.comportamiento_suicida[bSectionKey].numero_de_intentos = 0;
          }
          // Reinicializa las sub_preguntas a su estado por defecto
          assessmentData.comportamiento_suicida[bSectionKey].sub_preguntas = defaultSubPreguntas.comportamiento_suicida[bSectionKey].sub_preguntas.map(q => ({
            id: q.id,
            texto: q.texto,
            respuesta: null,
            descripcion: null,
          }));
        }
      });
    });

    // --- Esquema de Validación con Yup ---
    const validationSchema = yup.object().shape({
      student: yup.string().required('El ID del estudiante es requerido.'),
      ideationIntensity: yup.object().shape({
        mostSeriousIdeationType: yup.number()
          .nullable(true)
          .min(1, 'Debe ser al menos 1')
          .max(5, 'Debe ser como máximo 5')
          .when(['$parent.deseos_de_morir.respuesta_seccion', '$parent.pensamientos_suicidas_no_especificos.respuesta_seccion'], {
            is: (deseos, pensamientos) => deseos === true || pensamientos === true,
            then: (schema) => schema.required('Este campo es requerido si hay ideación activa.').typeError('Debe ser un número.'),
            otherwise: (schema) => schema.notRequired(),
          }),
        mostSeriousIdeationDescription: yup.string()
          .nullable(true)
          .when(['mostSeriousIdeationType'], {
            is: (type) => type !== null,
            then: (schema) => schema.required('La descripción es requerida si hay un tipo de ideación.'),
            otherwise: (schema) => schema.notRequired(),
          }),
        frequency: yup.number()
          .nullable(true)
          .min(0, 'Debe ser al menos 0')
          .max(4, 'Debe ser como máximo 4')
          .when(['$parent.deseos_de_morir.respuesta_seccion', '$parent.pensamientos_suicidas_no_especificos.respuesta_seccion'], {
            is: (deseos, pensamientos) => deseos === true || pensamientos === true,
            then: (schema) => schema.required('La frecuencia es requerida si hay ideación activa.').typeError('Debe ser un número.'),
            otherwise: (schema) => schema.notRequired(),
          }),
      }),
      // Validación para las secciones de ideación (1 a 5)
      ...ideationSections.reduce((acc, sectionKey) => {
        acc[sectionKey] = yup.object().shape({
          respuesta_seccion: yup.boolean().required('Debe seleccionar Sí o No.').nullable(true),
          descripcion_seccion: yup.string().nullable(true).when('respuesta_seccion', {
            is: true,
            then: (schema) => schema.required('La descripción de la sección es requerida si la respuesta es Sí.'),
            otherwise: (schema) => schema.notRequired(),
          }),
          sub_preguntas: yup.array().of(
            yup.object().shape({
              id: yup.string().required(),
              texto: yup.string().required(),
              respuesta: yup.boolean().nullable(true).when('$parent.$parent.respuesta_seccion', { // Accede a la respuesta de la sección principal
                is: true,
                then: (schema) => schema.required('Este campo es requerido si la sección principal es Sí.'),
                otherwise: (schema) => schema.notRequired(),
              }),
              descripcion: yup.string().nullable(true).when('respuesta', {
                is: true,
                then: (schema) => schema.required('La descripción es requerida si la respuesta es Sí.'),
                otherwise: (schema) => schema.notRequired(),
              }),
            })
          ).min(defaultSubPreguntas[sectionKey]?.sub_preguntas?.length || 0, `Faltan sub-preguntas en ${sectionKey}`).required(),
        });
        return acc;
      }, {}),

      // Validación para las sub-secciones de comportamiento suicida
      comportamiento_suicida: yup.object().shape({
        ...behaviorSubSections.reduce((acc, bSectionKey) => {
          acc[bSectionKey] = yup.object().shape({
            respuesta_seccion: yup.boolean().required('Debe seleccionar Sí o No.').nullable(true),
            descripcion_seccion: yup.string().nullable(true).when('respuesta_seccion', {
              is: true,
              then: (schema) => schema.required('La descripción de la sub-sección es requerida si la respuesta es Sí.'),
              otherwise: (schema) => schema.notRequired(),
            }),
            numero_de_intentos: yup.number().nullable(true).when('respuesta_seccion', {
              is: true,
              then: (schema) => bSectionKey !== 'actos_preparatorios' ? schema.required('El número de intentos es requerido.').min(0, 'Debe ser 0 o más.').typeError('Debe ser un número.') : schema.notRequired(),
              otherwise: (schema) => schema.notRequired(),
            }),
            sub_preguntas: yup.array().of(
              yup.object().shape({
                id: yup.string().required(),
                texto: yup.string().required(),
                respuesta: yup.boolean().nullable(true).when('$parent.$parent.$parent.respuesta_seccion', { // Accede a la respuesta de la sub-sección principal
                  is: true,
                  then: (schema) => schema.required('Este campo es requerido si la sub-sección principal es Sí.'),
                  otherwise: (schema) => schema.notRequired(),
                }),
                descripcion: yup.string().nullable(true).when('respuesta', {
                  is: true,
                  then: (schema) => schema.required('La descripción es requerida si la respuesta es Sí.'),
                  otherwise: (schema) => schema.notRequired(),
                }),
              })
            ).min(defaultSubPreguntas.comportamiento_suicida[bSectionKey]?.sub_preguntas?.length || 0, `Faltan sub-preguntas en ${bSectionKey}`).required(),
          });
          return acc;
        }, {}),
      }),
      grado_letalidad_lesiones: yup.number()
        .nullable(true)
        .min(0, 'Debe ser al menos 0')
        .max(5, 'Debe ser como máximo 5')
        .required('El grado de letalidad es requerido.')
        .typeError('Debe ser un número.'),
    });


    // --- Métodos del Componente ---

    // Función para obtener el título de las secciones de ideación
    const getSectionTitle = (key) => {
      const titles = {
        deseos_de_morir: 'Sección 1: Deseos de morir',
        pensamientos_suicidas_no_especificos: 'Sección 2: Pensamientos suicidas activos no específicos',
        ideacion_con_metodo_sin_plan_ni_intencion: 'Sección 3: Ideación suicida activa con cualquier método (no un plan) sin intención de actuar',
        ideacion_con_intencion_sin_plan_especifico: 'Sección 4: Ideación suicida activa con cierta intención de actuar, sin un plan específico',
        ideacion_con_plan_e_intencion: 'Sección 5: Ideación suicida activa con un plan específico e intención',
      };
      // Asegúrate de que defaultSubPreguntas[key]?.pregunta_principal_texto existe como fallback si el título no está en 'titles'
      return titles[key] || defaultSubPreguntas[key]?.pregunta_principal_texto || key;
    };

    // Función para obtener el título de las sub-secciones de comportamiento suicida
    const getBehaviorSubSectionTitle = (key) => {
      const titles = {
        intento_real: 'Intento Real',
        intento_interrumpido: 'Intento Interrumpido',
        intento_abortado: 'Intento Abortado',
        actos_preparatorios: 'Actos Preparatorios',
      };
      // Asegúrate de que defaultSubPreguntas.comportamiento_suicida[key]?.pregunta_principal_texto existe como fallback
      return titles[key] || defaultSubPreguntas.comportamiento_suicida[key]?.pregunta_principal_texto || key;
    };


    // Función para manejar el envío del formulario
    const handleSubmit = async (values, { resetForm }) => {
      isSubmitting.value = true;
      submissionSuccess.value = false;
      submissionError.value = null;

      try {
        console.log('Datos a enviar (antes de limpiar):', JSON.parse(JSON.stringify(values)));

        // Crear una copia profunda de los valores para limpiar sin afectar el estado del formulario en la UI
        const dataToSend = JSON.parse(JSON.stringify(values));

        // Lógica para limpiar datos si las secciones principales de ideación son "No"
        const deseosDeMorirNo = dataToSend.deseos_de_morir.respuesta_seccion === false;
        const pensamientosNoEspecificosNo = dataToSend.pensamientos_suicidas_no_especificos.respuesta_seccion === false;

        if (deseosDeMorirNo && pensamientosNoEspecificosNo) {
          // Si no hay ideación activa en las secciones 1 y 2, limpia los campos de intensidad
          dataToSend.ideationIntensity.mostSeriousIdeationType = null;
          dataToSend.ideationIntensity.mostSeriousIdeationDescription = '';
          dataToSend.ideationIntensity.frequency = null;

          // Limpia las secciones 3, 4 y 5
          ideationSections.slice(2).forEach(sectionKey => {
            if (dataToSend[sectionKey]) {
              dataToSend[sectionKey].respuesta_seccion = null;
              dataToSend[sectionKey].descripcion_seccion = null;
              // Asegura que las sub_preguntas se reinicialicen correctamente
              dataToSend[sectionKey].sub_preguntas = defaultSubPreguntas[sectionKey]?.sub_preguntas?.map(q => ({
                id: q.id,
                texto: q.texto,
                respuesta: null,
                descripcion: null,
              })) || [];
            }
          });
        }

        // Lógica para limpiar subpreguntas y descripciones si la respuesta_seccion es false para CUALQUIER sección
        ideationSections.forEach(sectionKey => {
          if (dataToSend[sectionKey] && dataToSend[sectionKey].respuesta_seccion === false) {
            dataToSend[sectionKey].descripcion_seccion = null;
            dataToSend[sectionKey].sub_preguntas.forEach(q => { q.respuesta = null; q.descripcion = null; });
          }
        });

        behaviorSubSections.forEach(bSectionKey => {
          if (dataToSend.comportamiento_suicida[bSectionKey] && dataToSend.comportamiento_suicida[bSectionKey].respuesta_seccion === false) {
            dataToSend.comportamiento_suicida[bSectionKey].descripcion_seccion = null;
            if (bSectionKey !== 'actos_preparatorios') {
              dataToSend.comportamiento_suicida[bSectionKey].numero_de_intentos = 0;
            }
            dataToSend.comportamiento_suicida[bSectionKey].sub_preguntas.forEach(q => { q.respuesta = null; q.descripcion = null; });
          }
        });


        console.log('Datos a enviar (después de limpiar):', dataToSend);

        // Realiza la petición POST a tu backend
        const response = await api.post('http://localhost:3000/api/suicide-assessments', dataToSend);
        console.log('Evaluación guardada exitosamente:', response.data);
        submissionSuccess.value = true;
        // Opcional: resetear el formulario después de guardar
        // resetForm(); // Comentar si no quieres resetear completamente el formulario

      } catch (error) {
        console.error('Error al guardar la evaluación:', error.response ? error.response.data : error.message);
        submissionError.value = error.response ? (error.response.data.msg || JSON.stringify(error.response.data)) : 'Error de conexión o inesperado.';
      } finally {
        isSubmitting.value = false;
      }
    };

    // Retorna todas las propiedades y métodos que el template necesita
    return {
      assessmentData,
      validationSchema,
      handleSubmit,
      isSubmitting,
      submissionSuccess,
      submissionError,
      ideationSections,
      behaviorSubSections,
      getSectionTitle,
      getBehaviorSubSectionTitle,
      shouldClearIdeationDetails, // Puede ser útil para lógica en el template
    };
  },
};
</script>

<style scoped>
/* Puedes añadir estilos específicos para este componente si no quieres depender solo de Tailwind */
/* Por ejemplo, para los inputs con error */
.border-red-500 {
  border-color: #ef4444 !important;
}
</style>