# Tres en Raya

## Descripción del Proyecto
Juego clásico de Tres en Raya desarrollado como aplicación web. Permite a dos jugadores competir por turnos, con funciones adicionales como personalización de nombres y avatares, registro de tiempo y movimientos, y un sistema completo de historial de partidas.

## Características Principales

- Juego para dos jugadores en el mismo dispositivo
- Personalización de nombres y avatares para cada jugador
- Marcador de puntuación acumulativa durante la sesión
- Contador de movimientos y cronómetro por partida
- Sistema de historial de partidas con persistencia de datos
- Filtrado del historial por ganador y rango de fechas
- Exportación de historial a formato JSON

## Instrucciones de Ejecución

1. Descarga o clona este repositorio en tu computadora
2. Navega a la carpeta del proyecto
3. Haz doble clic en el archivo `index.html`
4. El juego se abrirá en tu navegador predeterminado


## Estructura del Proyecto

```
tres_en_raya/
├── index.html              # Página principal del juego
├── historial.html          # Página de visualización del historial
├── README.md               # Este archivo
├── assets/
│   └── players/            # Imágenes de avatares
├── css/
│   ├── styles.css          # Estilos del juego
│   └── historial.css       # Estilos de la página de historial
└── js/
    ├── game.js             # Lógica principal del juego
    ├── storage.js          # Sistema de almacenamiento
    └── historial.js        # Lógica de la página de historial
```

## Decisiones Técnicas

### Sistema de Almacenamiento

Se eligió **localStorage** por las siguientes razones:

- **Simplicidad**: Para este proyecto, los datos son relativamente simples. localStorage ofrece una API más sencilla y directa.
- **Tamaño de datos**: El volumen de información es pequeño. Incluso almacenando cientos de partidas, no se supera el límite típico de 5-10MB de localStorage.
- **Compatibilidad**: localStorage tiene soporte prácticamente universal en todos los navegadores, incluso versiones antiguas.
- **Sin complejidad asíncrona**: localStorage es sincrónico, lo que simplifica el código y evita tener que manejar promesas o callbacks para operaciones básicas.

### Estructura de Datos

Cada partida se almacena con la siguiente estructura:

```javascript
{
  id: "identificador-único",
  jugador1: "Nombre del Jugador 1",
  jugador2: "Nombre del Jugador 2",
  ganador: "jugador1" | "jugador2" | "Empate",
  duracion: 45000,  // en milisegundos
  movimientos: 9,
  fecha: "2025-11-09T14:30:00.000Z",  // formato ISO 8601
  avatarJ1: "ruta/al/avatar1.svg",
  avatarJ2: "ruta/al/avatar2.svg"
}
```

Se usa el prefijo `ppw-tresenraya:` para todos los datos almacenados, evitando conflictos con otras aplicaciones que puedan usar localStorage en el mismo dominio.

### Organización del Código

- **Separación de responsabilidades**: El código está dividido en módulos lógicos (juego, almacenamiento, interfaz de historial).
- **CSS modular**: Los estilos están separados por funcionalidad (juego principal y página de historial).
- **Funciones reutilizables**: Se crearon funciones auxiliares para formatear fechas y duraciones que se usan en múltiples partes del código.

## Estándares Implementados

### HTML Semántico

- Uso correcto de etiquetas semánticas: `<header>`, `<section>`, `<footer>`
- Estructura lógica del documento con jerarquía de encabezados
- Atributos `alt` en todas las imágenes para mejorar la accesibilidad
- Elementos interactivos apropiados: `<button>` para acciones, `<a>` para navegación

### Accesibilidad

- Metaetiqueta `viewport` para adaptación a dispositivos móviles
- Atributo `lang` en el elemento HTML para lectores de pantalla
- Contraste adecuado entre texto y fondo
- Tamaños de fuente legibles
- Áreas de clic suficientemente grandes en dispositivos táctiles
- Navegación lógica con el teclado

### Diseño Responsivo

- Sistema de diseño adaptable para móviles (hasta 480px)
- Soporte para orientación horizontal en móviles
- Uso de unidades relativas y flexbox/grid para layouts fluidos
- Imágenes y contenedores que se ajustan al tamaño de la pantalla

### Buenas Prácticas de JavaScript

- Código organizado en funciones con responsabilidades claras
- Nombres de variables descriptivos
- Comentarios en funciones importantes
- Validaciones antes de operaciones críticas
- Manejo de errores con try-catch donde es necesario

### Validación de Datos

- Confirmación antes de eliminar el historial completo
- Validación de existencia de datos antes de procesarlos
- Formato consistente de fechas usando estándar ISO 8601
- Filtrado seguro de datos con múltiples criterios

## Cómo Jugar

1. Al iniciar, presiona "Nuevo juego" para ingresar los nombres de los jugadores
2. Selecciona los avatares para cada jugador
3. Los jugadores se turnan haciendo clic en las celdas del tablero
4. El primer jugador en formar una línea (horizontal, vertical o diagonal) gana
5. Si todas las celdas se llenan sin ganador, la partida termina en empate
6. Usa "Revancha" para jugar otra partida con los mismos jugadores
7. Visita la página de "Historial" para ver todas las partidas registradas

## Créditos

Proyecto desarrollado para la asignatura de Programación y Plataformas Web.
