---
title: "De la pompa de jabón al cristal a la carta"
date: 2026-08-24
lang: es
description: "El problema que hay detrás de una pompa de jabón, de un espejo de LIGO y de diseñar un cristal para que refleje exactamente lo que tú quieras."
---

Una pompa de jabón es líquido incoloro y está violentamente coloreada. Un charco con una gota de aceite tiene colores. El caparazón de un escarabajo tiene colores y no lleva dentro ni un gramo de pigmento. Tus gafas tienen un reflejo violeta y la lente frontal de una cámara lo tiene verde. Un espejo láser parece un trozo de cristal y te devuelve el 99,999% de lo que le llega.

![Una pompa de jabón. El color no es un pigmento: es interferencia. Foto de Brocken Inaglory, [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/), vía [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Reflection_in_a_soap_bubble_edit.jpg).](/img/pompa-de-jabon.jpg)

Todas esas cosas son el mismo objeto: unas pocas capas de material transparente, cada una de un espesor que es una fracción de la longitud de onda, apiladas una encima de otra.

Ninguna tiene absorción haciendo el trabajo. El color no es un tinte. Es interferencia, el mismo fenómeno que dos altavoces cancelándose en una habitación, solo que ocurriendo quinientos billones de veces por segundo.

# El problema

Planteado del todo, que es como hay que plantearlo antes de tocar nada.

Tienes N capas paralelas, cada una con su índice de refracción y su espesor. Llega una onda plana desde fuera, con un ángulo y una longitud de onda. La pregunta es: qué fracción de la potencia se vuelve por donde vino, y qué fracción atraviesa.

Eso es todo. Esas dos fracciones se llaman R y T, y ese es el problema directo entero.

A eso se le llama el problema directo, y tiene un hermano mucho más divertido al que llegaré al final.

# Por qué la respuesta intuitiva está mal

El primer modelo que se le ocurre a cualquiera: la luz llega a la primera interfaz y rebota una fracción; lo que queda llega a la segunda y rebota otra; sumas las fracciones.

Está mal. Y está mal de una forma que merece la pena entender, porque el mismo error reaparece en toda la física de ondas.

Las potencias no se suman. Se suman las amplitudes. Las ondas parciales que salen de la pila son coherentes entre sí: llevan una fase relativa concreta, fijada por el camino de más que ha recorrido cada una. Lo que llega al detector es el módulo al cuadrado de la suma, no la suma de los módulos al cuadrado.

Los términos cruzados no son una corrección fina. Son el fenómeno. Si los tiras, la pompa de jabón es gris.

De ahí salen las dos cosas que convierten esto en una industria:

- Veinte interfaces que reflejan un 8% cada una pueden darte un 99,99%.
- Dos interfaces que reflejan un 2% cada una pueden darte un 0,0%.

Mismas ecuaciones. Lo único que cambia es la fase. Y un modelo que suma potencias no puede producir ninguna de las dos: no es una aproximación peor, es otra situación física.

# Para qué importa

El vidrio desnudo refleja alrededor de un 4% por cara. Suena despreciable hasta que cuentas caras. Un objetivo de seis lentes tiene doce, y 0,9574 elevado a doce da 0,59: se ha ido el 41% de la luz. Lo peor no es que se haya ido, es que no se ha ido a ninguna parte — está rebotando dentro del barrilete produciendo flare y comiéndose el contraste.

El silicio desnudo es peor. Con un índice cercano a 3,9, la cara frontal de una célula solar refleja un 35% antes de que el semiconductor tenga la menor oportunidad. Una sola capa de nitruro de silicio de un cuarto de onda lo deja en un 0,02% a la longitud de onda de diseño. Esa capa sola vale más que casi toda la optimización de proceso que viene después.

Y hay una lección de historia buenísima ahí: Rayleigh observó en 1886 que el vidrio empañado transmitía más luz que el vidrio recién pulido. Justo lo contrario de lo que diría cualquiera. Se tardó medio siglo en convertir esa rareza en una industria.

Hacia el otro extremo, cuando lo que quieres es reflejar:

- En litografía EUV, a 13,5 nanómetros, todos los materiales absorben y ninguno refracta de forma útil. No hay lentes. Todo el tren óptico son espejos multicapa de molibdeno y silicio, y cada uno te cuesta un 30%, que es justo por lo que hay los menos posibles.
- Un láser VCSEL tiene una ganancia por pasada de décimas de porcentaje, así que sus espejos tienen que pasar del 99,9%. Ningún metal llega ahí. Cuarenta pares de AlAs y GaAs sí.
- En LIGO, las masas de prueba son recubrimientos multicapa donde el presupuesto de pérdidas se mide en partes por millón, y el ruido térmico del propio recubrimiento es una de las cosas que limitan el instrumento.
- Y las alas de las mariposas Morpho llevaban haciéndolo bastante antes que Zeiss.

# Dónde deja de valer

Esta es la parte que casi siempre falta, y es la que más me interesa.

Todo lo anterior suma amplitudes, y eso exige que las ondas parciales mantengan una fase relativa estable. Solo la mantienen si el camino de ida y vuelta es más corto que la longitud de coherencia de la fuente:

- Luz solar: alrededor de una micra.
- Un LED: unas diez micras.
- Un láser de helio-neón: unos quince centímetros.

Por eso el campo se llama óptica de capas finas. Una capa de cien nanómetros es coherente para cualquier fuente. Un sustrato de vidrio de un milímetro no lo es: a la luz del día sus dos caras no interfieren, y ahí hay que sumar potencias mientras dentro del recubrimiento sigues sumando amplitudes. Cualquier recubrimiento real sobre un sustrato real necesita ese tratamiento mixto, y esta implementación no lo hace.

Pero mi favorita de toda la lista es otra, y es de las que solo se encuentran tocando. Para saber cómo se propaga la onda dentro de cada capa hay que sacar una raíz cuadrada, y una raíz cuadrada tiene dos ramas. Elegir entre ellas parece una decisión numérica y es una afirmación sobre la naturaleza: un medio pasivo atenúa, nunca amplifica.

Si eliges la rama equivocada, la conservación de la energía se te sigue cumpliendo perfectamente. Todos los tests en verde. Simplemente estás simulando un medio que amplifica la luz.

# Y luego, diseñar

Todo lo anterior es el problema directo: te dan la pila y calculas la curva. La gracia está en darle la vuelta.

Elige tú los índices y los espesores para que la reflexión sea exactamente la curva que quieres. Transparente aquí, espejo allá, y en este ángulo concreto. Eso es el problema inverso, y es lo que yo llamaba hacer cristales a la carta.

Ahí ya no hay fórmula que valga. El espacio de diseño es enorme, no es convexo, y las capas interactúan todas con todas: mueves una y le cambias la fase a todo lo que viene detrás. Así que se ataca por optimización. En mi caso, con algoritmos genéticos: poblaciones de pilas candidatas, las que más se acercan a la curva objetivo se cruzan y mutan, y vuelta a empezar unas cuantas miles de veces.

Y ahí es donde el problema directo deja de ser un ejercicio de clase y se convierte en la pieza crítica, por dos motivos.

Si tu solver es lento, no tienes diseño: el optimizador lo llama millones de veces y te comes el presupuesto de cómputo entero en la primera generación.

Y si tu solver es sutilmente incorrecto, es peor. El optimizador va a encontrar encantado el diseño que explota tu error. Te va a devolver una curva preciosa, con su mínimo perfecto donde lo pediste, y ese cristal no existe. Vuelve la rama de la raíz cuadrada: si la eliges mal, tu buscador de diseños se pone a buscar en un universo donde el vidrio amplifica la luz, y encuentra.

Por eso el directo tiene que ser exacto y barato antes que ninguna otra cosa.

# Por qué lo he publicado

He empezado a subir a un sitio las simulaciones de cosas fundamentales que he ido haciendo estos años. La idea es recopilarlas todas con un mismo estándar en vez de tenerlas repartidas en cuadernos de 2023 y 2024 que no hay quien lea.

Se llama first-principles y el objetivo es corto: una carpeta por mecanismo, implementación mínima reconstruida desde las ecuaciones. No compite con nada de producción. Si necesitas un solver de matriz de transferencia, instálate uno hecho; esto está para entenderlo.

Cada entrada tiene que llegar a tres niveles antes de existir: derivarlo, implementarlo y ser capaz de modificarlo prediciendo qué va a pasar. Nada entra por git mv: o se reescribe al estándar, o se queda archivado donde está. Y cada entrada declara qué deja fuera a propósito, porque saber dónde se acaba el modelo es justo el objetivo del ejercicio.

De momento hay dos entradas: el método de la matriz de transferencia y una red de Hopfield.

- [La derivación completa](https://github.com/FullFran/first-principles/blob/main/tmm/docs/physics.md) — el problema, las ecuaciones, qué mostró la simulación y dónde deja de ser verdad.
- [El repositorio](https://github.com/FullFran/first-principles) — el código, las reglas y lo que vaya cayendo.
