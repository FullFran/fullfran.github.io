---
title: "¿Pueden los imanes tener memoria?"
date: 2026-08-23
lang: es
description: "Empiezas con el modelo de Ising, cambias dos cosas, y acabas con una memoria que recupera un recuerdo entero a partir de un trozo roto."
---

Sí. Y esa es la parte aburrida de la respuesta.

La parte interesante es cuánto, y si podemos elegir qué. Porque tirando de ese hilo se llega, sin salirse de la física de un imán, a una memoria que te devuelve un recuerdo completo cuando le enseñas un trozo estropeado de él.

# Un imán ya se acuerda de algo

El modelo más tonto que describe un imán es el de Ising. Un montón de flechitas —espines— colocadas en una red, y cada una solo puede apuntar arriba o abajo. Más y menos uno, nada intermedio.

La energía del conjunto es una suma sobre parejas:

E = −½ Σ J_ij s_i s_j

Y lo único que dice esa fórmula es: si dos espines acoplados apuntan igual, el producto es positivo, el signo menos lo convierte en energía negativa, y al sistema le gusta. Vecinos de acuerdo bajan la energía. Vecinos en desacuerdo la suben.

Si J es positiva e igual para todos los vecinos, tienes un ferromagneto, y tiene exactamente dos estados de energía mínima: todos arriba, o todos abajo. Los dos igual de buenos. La naturaleza elige uno y se queda ahí.

Eso ya es memoria. Es un bit. Magnetizas el material en un sentido y se acuerda de en cuál, hasta que llegue alguien con calor o con otro campo. Y no es una metáfora: así es literalmente como un disco duro guarda información, regiones magnetizadas en un sentido o en el otro.

![Dominios magnéticos dentro de un solo grano de acero eléctrico, en una zona de una décima de milímetro de ancho, fotografiada al microscopio por efecto Kerr. Cada región clara u oscura es un trozo de metal donde todos los espines han acordado apuntar en el mismo sentido. Imagen de Zureks y Chris Vardon, [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/), vía [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Magnetic_domain_with_arrows_by_Zureks.png).](/img/dominios-magneticos.jpg)

Así que la pregunta buena no es si un imán puede recordar. Es si puede recordar más de una cosa, y si podemos decidir nosotros cuáles.

# La jugada de Hopfield

Dos cambios sobre Ising. Los dos son trampa, y los dos son la trampa correcta.

El primero: que se acabe lo de los vecinos. En un imán cada espín solo nota a los que tiene al lado. Aquí todos hablan con todos.

El segundo, y este es el bueno: dejar de tratar J como una constante de la naturaleza y tratarla como un parámetro de diseño. En un trozo de hierro los acoplamientos te vienen dados. Aquí los escribimos nosotros.

¿Y qué escribimos? Esto:

W = (1/N) Σ_μ p_μ p_μᵀ

Coges los patrones que quieres guardar y sumas el producto exterior de cada uno consigo mismo. En cristiano: dos neuronas que estén de acuerdo en los patrones almacenados acaban acopladas positivamente, y dos que se lleven la contraria acaban acopladas en negativo. Se llama regla de Hebb, es de 1949, y es de una pasada. Sin gradiente, sin iteración, sin entrenamiento.

Cada patrón que metes ahí excava un valle en el paisaje de energía.

# Recordar es rodar cuesta abajo

La dinámica es la de siempre en un imán: cada espín se alinea con el campo que le hacen los demás.

h_i = Σ_j W_ij s_j, y luego s_i pasa a ser el signo de h_i.

Eso es exactamente Metropolis a temperatura cero: solo se aceptan los movimientos que bajan la energía. Nada de excitación térmica, nada de escaparse de un mínimo. Cuesta abajo y punto.

Ahora le das un patrón estropeado y lo sueltas. El sistema rueda hasta el fondo del valle más cercano, que es el patrón entero.

Y aquí está lo que a mí me sigue pareciendo bonito después de años: el recuerdo no está guardado en ningún sitio que puedas señalar. No hay índice, no hay clave, no hay búsqueda. Está en la forma del paisaje. Recuperarlo no es buscarlo, es dejar caer el sistema y esperar.

En la implementación que he subido, con cuatro patrones y un cuarto de los bits cambiados a mano, los cuatro vuelven exactos en dos barridos. Los patrones almacenados están a una energía por neurona de unos −0,55; un estado aleatorio, a −0,0003. Los recuerdos son los valles, medido y no supuesto.

# Dos condiciones, y una que parece un detalle

Todo el teorema se apoya en dos cosas: que la matriz de acoplamientos sea simétrica y que su diagonal sea cero.

Con esas dos, si cambias un solo espín la energía varía en menos el cambio del espín por su campo local, que nunca es positivo. Es decir: la energía nunca sube. Es una función de Lyapunov, y por tanto la red no puede vagar eternamente. Tiene que parar.

Lo de la diagonal a cero merece un segundo. Si dejas que una neurona se acople consigo misma, puede cambiar de estado por la fuerza de su propio valor actual. Eso ya no es un recuerdo, es un biestable.

Y ahora el detalle que no es un detalle: ese argumento exige que las neuronas se actualicen de una en una. Si las actualizas todas a la vez, la garantía se cae. La energía puede subir y aparecen ciclos de periodo dos, con la red oscilando entre dos estados para siempre.

Eso no es un problema de implementación, es física. Por eso en el repo hay dos métodos y no uno, y por eso el test de "la energía nunca sube" no está en el contrato común: exigírselo a los dos métodos sería afirmar algo falso.

# Los recuerdos que nadie guardó

El paisaje tiene valles que no ha excavado nadie.

Para empezar, la imagen en espejo de cada recuerdo es también un recuerdo, con exactamente la misma energía. Si le das la vuelta a todos los espines, la energía no se entera: en la fórmula aparecen en parejas. Guardas cuatro patrones y te llevas ocho mínimos de regalo.

Luego están las mezclas. El signo de la suma de tres patrones almacenados suele ser un punto fijo que nadie pidió.

Y luego está lo que sale cuando lo pruebas de verdad, que fue lo más interesante del experimento. Un tablero de ajedrez sin ninguna relación con nada terminó exactamente sobre el espejo de uno de los recuerdos. Una variante ligeramente distinta de un patrón guardado no recuperó el original: se quedó atascada en un valle cercano que no era ningún recuerdo. Y la mezcla de tres patrones del libro de texto no era estable: se fue rodando hasta uno de ellos.

Eso último no es un fallo, es correlación. Mis patrones eran glifos que comparten mucha estructura, y esa estructura le cambia la forma al paisaje. Con patrones sin correlación la mezcla sí es estable, exactamente como dice la teoría, y el mismo script lo comprueba en la misma ejecución para que no me lo tenga que creer nadie.

# Cuánto cabe

Un número: alrededor de 0,138 patrones por neurona.

Por encima de eso, deja de funcionar. Y no deja de funcionar poco a poco, sino como una transición de fase, que es la señal de que esto sigue siendo física estadística y no una analogía bonita. En las medidas: por debajo del umbral el error es prácticamente cero para cualquier tamaño de red; justo por encima, el error crece más rápido cuanto más grande es la red. A una carga de 0,16, el error casi se triplica al pasar de cien neuronas a quinientas.

Una red más grande no aguanta mejor. Aguanta hasta más tarde, y luego se cae más de golpe. Como toda transición de fase, se afila con el tamaño.

# El fallo que no mordía

La versión de esto que escribí en 2024 dividía los acoplamientos entre el número de patrones en vez de entre el número de neuronas.

Da igual. O eso parecía: es un factor de escala global sobre toda la matriz, y a la función signo el factor de escala se la trae al pairo. La dinámica era correcta. Los recuerdos se recuperaban igual de bien. Cero síntomas.

Lo que rompe es la energía, que sí depende de la escala. Y por tanto rompe comparar energías entre redes entrenadas con distinto número de patrones. Que es, exactamente, lo único que hace el experimento de capacidad.

Un fallo invisible hasta que haces la única pregunta que lo necesita. De esos hay muchos más de los que parece, y por eso el número que citas tiene que salir del código que has ejecutado.

# A dónde lleva esto

Súbele la temperatura por encima de cero, para que acepte de vez en cuando un movimiento que sube la energía, y tienes una máquina de Boltzmann.

Cambia la energía explícita por una aprendida, y el descenso por un calendario de ruido, y tienes un modelo de difusión. Lo que hay detrás de la mitad de las imágenes que has visto generadas este año.

O sea que el camino desde "¿pueden los imanes tener memoria?" hasta Stable Diffusion es bastante más corto de lo que parece. Es el mismo truco todo el rato: defines un paisaje de energía y dejas que las cosas rueden hacia abajo.

- [La entrada de Hopfield](https://github.com/FullFran/first-principles/blob/main/hopfield/README.md) — las ecuaciones, los tres experimentos con sus números, y qué deja fuera a propósito.
- [El repositorio](https://github.com/FullFran/first-principles) — una carpeta por mecanismo, implementación mínima reconstruida desde las ecuaciones.
