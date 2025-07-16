// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      perspective: {
        'none': 'none',
        'sm': '500px',
        'md': '800px',
        'lg': '1000px',
        'xl': '1200px',
        'dramatic': '300px',
        'normal': '1000px',
      },
      transformStyle: {
        'preserve-3d': 'preserve-3d',
      },
      animation: {
        'rotate-cube': 'rotate-cube 8s linear infinite', 
        // Cambia la duración de 'blob' para que sea más lenta y visible el desplazamiento
        'blob': 'blob 25s cubic-bezier(0.4, 0, 0.2, 1) infinite', 
      },
      keyframes: {
        'rotate-cube': {
          '0%': { transform: 'rotateX(0deg) rotateY(0deg)' },
          '100%': { transform: 'rotateX(360deg) rotateY(360deg)' },
        },
        'blob': { // Aumenta significativamente los valores de translate y la variación de scale
          '0%': { transform: 'translate(0vw, 0vh) scale(1)' },
          '20%': { transform: 'translate(-5vw, 15vh) scale(1.2)' },
          '40%': { transform: 'translate(10vw, -10vh) scale(0.9)' },
          '60%': { transform: 'translate(-15vw, -5vh) scale(1.1)' },
          '80%': { transform: 'translate(5vw, 20vh) scale(1.3)' },
          '100%': { transform: 'translate(0vw, 0vh) scale(1)' },
        },
      },
      translate: {
        '10': '40px',
      }
    },
  },
  plugins: [],
}