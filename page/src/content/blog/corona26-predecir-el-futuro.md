---
title: "Lo más cerca que tenemos de predecir el futuro"
date: 2026-08-13
lang: es
description: "Intenté predecir la forma de la corona solar antes del eclipse del 12 de agosto. Lo que me devolvió el proyecto no fue el acierto."
---

Voy a defender una tesis discutible: la física y la ciencia de datos son lo más cerca que ha estado la humanidad de predecir el futuro. Sin bola de cristal, sin cartas, sin vísceras de animal. Coges unas ecuaciones, unas condiciones iniciales medidas con instrumentos carísimos, le das a ejecutar, y sale un número que dice qué va a pasar mañana.

Y a veces acierta.

Es brujería con papeleo. Y es enormemente adictivo.

El problema es que llevaba años sin practicarla de verdad. Me fui desplazando hacia la IA, los backends, los clientes, los despliegues, las reuniones, el negocio. Me gusta ese trabajo, me dedico a él y creo que se me da bien. Pero es otro deporte. Ahí quien valida lo que haces es un mundo hecho por personas: un test en verde, un cliente contento, una métrica que sube. Nada de eso es la Naturaleza contestándote.

Este verano me acordé.

# El pretexto: un eclipse

El 12 de agosto de 2026 hubo un eclipse total visible desde Colmenar Viejo. La pregunta que me hice no fue "¿lo voy a ver?", sino otra bastante más tonta y bastante más divertida:

¿Puedo predecir qué forma va a tener la corona antes de mirarla?

La corona no es decorativa. Su forma es el campo magnético del Sol hecho visible: las estructuras que ves en la totalidad son electrones dispersando luz a lo largo de líneas de campo. Si conoces el campo, puedes intentar dibujar la corona. Y el campo, en la cara visible, se mide todos los días.

Así nació [corona26](https://www.fullfran.com/corona26/).

# El pipeline

La cadena es más corta de lo que parece:

- Magnetograma fotosférico real de ADAPT-GONG, que es el campo magnético medido en la superficie del Sol.
- Extrapolación PFSS para sacar el campo en la corona y separar la topología abierta de la cerrada.
- Un proxy de densidad electrónica construido sobre esa topología.
- Un renderer de dispersión Thomson escrito desde cero, con integración a lo largo de la línea de visión.
- La corona sintética orientada exactamente como se vería desde Colmenar Viejo ese día, a esa hora.

Lo interesante no es ninguna de esas piezas por separado. Es que el error tiene barra.

ADAPT no da un mapa del Sol: da doce realizaciones distintas, porque la cara oculta no se ve y hay que modelar cómo evoluciona el flujo magnético mientras está fuera de nuestra vista. Multiplícalo por cinco valores razonables del radio de la superficie de fuente y tienes sesenta miembros en el ensemble. Sesenta coronas ligeramente distintas.

Esa dispersión es la predicción honesta. Una streamer que aparece en los sesenta miembros es una predicción. Una que aparece en tres es ruido con buena prensa.

# Congelar antes de mirar

La parte menos glamurosa del proyecto y la única imprescindible: antes del eclipse congelé el resultado. Un PNG concreto, en un commit concreto, declarado en público como la predicción oficial. Cualquier render posterior sería exploratorio y no puntuaría.

Esto no es burocracia. Es la frontera exacta entre hacer ciencia y hacer marketing. Si te permites volver a renderizar después de haber visto la corona, aciertas siempre y no has aprendido absolutamente nada.

# Y luego uno mira al cielo

Veredicto honesto: parcialmente apoyada.

La forma general estaba ahí. Una corona multipolar con tres o cuatro sectores anchos, que es justo lo que se ve en los fotogramas de la totalidad del feed de la ESA. Eso coincide.

Lo que no coincide: la corona real es mucho más abrupta. El reparto de brillo es menos equilibrado que el de mi proxy de densidad, que es suave por construcción y por tanto reparte de más. Y no hay puntuación oficial, porque para puntuar de verdad hace falta una observación con orientación, paridad y calibración verificables, y un feed de vídeo no las tiene.

Sobre el error dominante conviene ser claro, porque es el resultado más útil de todo esto: no es el renderer, ni el PFSS, ni la resolución. Es que no vemos la cara oculta del Sol. En agosto de 2026 estamos cerca del máximo solar y las regiones activas evolucionan en días. Una región que emerge en el farside y ancla un helmet streamer te rompe la predicción, y no hay malla lo bastante fina que arregle eso. Los grupos que lo hacen mejor lo hacen porque asimilan magnetogramas del otro lado, no porque calculen más fino.

# Lo que me llevo

No es el acierto parcial. Es otra cosa.

Lo mejor del proyecto no fue que algunas estructuras parecieran coincidir. Fue recordar lo que se siente al construir un modelo del mundo físico, hacer una predicción, congelarla, y después mirar a la Naturaleza para ver si estabas equivocado.

Es una sensación que no tiene equivalente en el software de producto. Aquí no negocias el criterio de aceptación. No hay una reunión donde se decida si el resultado es aceptable. Está el cielo, está tu PNG, y uno de los dos se equivocó.

Llevaba años echando de menos que mi trabajo tocara el mundo físico de verdad, y no solo servicios, APIs y despliegues. Este proyecto une las dos cosas: software serio, física de verdad y una observación que no te debe ningún favor.

El código está en [el repositorio](https://github.com/FullFran/corona26), y la predicción congelada junto con la comparación frente a los fotogramas de la totalidad está publicada en [la página del proyecto](https://www.fullfran.com/corona26/). Con su fecha y su commit, para que cualquiera pueda comprobar en qué me equivoqué.

Que es exactamente para lo que la publiqué.
