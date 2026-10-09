# Marble · Prototipos de UI

Prototipos web independientes de la interfaz de carrera de un videojuego de canicas. HTML, CSS y JavaScript, sin dependencias de ejecución ni compilación.

## Abrir

Desde la carpeta del repositorio, inicia un servidor estático, por ejemplo `python -m http.server 4173`. Abre `http://localhost:4173/index.html` (hub) o `http://localhost:4173/prototype-01.html` (Cabina orbital). También se pueden abrir los HTML directamente. Las fuentes de Google son opcionales; hay fuentes de reserva.

## Cabina orbital

- Diálogo alternado entre Vega y el piloto, con retrato activo, avance y cierre.
- Tres habilidades: consulta al pulsar el módulo y activación desde el detalle o con Mayús, E y Q. Estado activo, recarga con cuenta atrás y disponibilidad.
- Minimapa retráctil con seis participantes, jugador ámbar y vista ampliada. Tecla M para recoger/desplegar.
- Controles de demo: pausa, conversación, recargas, disponibilidad, posición y reinicio.
- Espacio avanza el diálogo. Esc cierra la consulta, los controles o el diálogo; el mapa ampliado usa el cierre nativo de diálogo.
- Diseño adaptado a escritorio y pantallas pequeñas; foco visible y preferencia de movimiento reducido. Con movimiento reducido la escena permanece estática, mientras los datos y cooldowns siguen actualizándose.

## Alcance de la simulación

La pista es una ilustración animada en Canvas, no un juego 3D. El recorrido del mapa representa el circuito completo; la cámara muestra un sector de forma estilizada. Cada vuelta dura 45 segundos y la carrera de tres vueltas se repite. Los efectos de habilidades son visuales; no hay física, daño ni adelantamientos automáticos. La clasificación inicial es 3/6 y se modifica con el control de demo. La pausa congela también los cooldowns.

Los retratos e iconos son originales. Se mantiene la distribución de los mockups: comunicador abajo a la izquierda, habilidades abajo a la derecha y mapa arriba a la derecha. En pantallas estrechas el diálogo se sitúa encima de las habilidades; al consultar una habilidad se oculta temporalmente y vuelve al cerrar la consulta. La cámara acerca los participantes a la zona libre superior. Se sustituye el gesto de ratón ambiguo del tercer icono por Q para que la activación sea evaluable con teclado.

## Nuevas propuestas

Guardar cada propuesta en un nuevo HTML (`prototype-02.html`, etc.) y añadir su tarjeta al hub. No sobrescribir propuestas anteriores sin una solicitud de revisión.
