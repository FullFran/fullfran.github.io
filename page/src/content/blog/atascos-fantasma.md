---
title: "¿Por qué el atasco va hacia atrás?"
date: 2026-09-25
lang: es
description: "Frenas porque frena el de delante y, cinco minutos después, llegas a la zona del atasco: no hay nada, ni accidente ni obras. Con treinta coches en un anillo y una regla de una línea se reproduce el atasco, se mide por qué retrocede, y se pierden dos predicciones firmadas por el camino."
draft: false
---

Vas por la autovía a velocidad constante. De repente frenas, porque frena el de delante. Sigues parando y arrancando durante varios minutos. Cuando por fin llegas a la zona donde esperabas un accidente, unas obras o un carril cerrado, no hay nada. Carretera vacía, los carriles libres.

No te lo has imaginado. El atasco era real, tenía coches parados dentro, y viajaba hacia atrás por la carretera mientras tú avanzabas hacia delante.

Lo primero que se piensa es que tiene que haber pasado algo: un cuello de botella, un carril que se estrecha, un accidente ya retirado. Causa puntual, efecto puntual. En 2008 Yuki Sugiyama y su equipo diseñaron un experimento pensado justo para eliminar esa posibilidad: 22 coches en una pista circular de 230 metros, sin cruces, sin semáforos, sin ningún estrechamiento, con la única instrucción de ir a unos 30 km/h manteniendo una distancia razonable con el de delante. A los pocos minutos, sin que nadie frenara por ningún motivo externo, apareció un atasco de cinco coches parados. Fuera de él, el tráfico seguía a unos 40 km/h; el atasco entero se desplazaba hacia atrás, a unos 20 km/h.

Los coches iban hacia delante. El atasco iba hacia atrás.

¿Bajo qué condiciones un flujo uniforme de coches se vuelve inestable, hasta el punto de que una perturbación minúscula acaba convirtiéndose en un atasco entero? ¿Y qué cambio mínimo en el comportamiento de los conductores lo impediría? Las respondo con un modelo de treinta coches en un anillo, predicción firmada antes de calcular, y dos predicciones mías que fallaron por el camino.

## Antes de tocar el código

La predicción se sella con fecha y hora, y no se toca después: lo que falla se cataloga aparte, no se corrige. La mía se selló el 25 de septiembre de 2026 a las 14:56. Contexto honesto, porque también cuenta: llevaba ya un rato dándole vueltas al tema y no era mi mejor momento de energía. Se nota en el sello: dejé dos campos en blanco.

| Pregunta | Lo que predije |
|---|---|
| Densidad crítica | «debe haber una densidad crítica... y debe ser calculable» |
| `τ=0,2 s` frente a `τ=1,5 s` | «la de mayor tiempo, porque hace un retraso mayor y los coches de más atrás encuentran una perturbación acumulada mayor» |
| Signo de la velocidad del atasco | «hacia atrás (sentido negativo)» |
| Fermi (1 km, 100 km/h) | «no me veo con ganas de estimarlo…» |

Cuatro respuestas, una sin arriesgar ningún número, y la hipótesis mínima en blanco. Se guarda tal cual, sin retocar después de verlas fallar o acertar.

Antes de tocar NumPy jugué también a «sigue al de delante» en mi laboratorio web: un coche que sigue a un líder que frena en un instante que no conoces de antemano. Mi resultado: retraso de reacción 0,85 s, distancia mínima 9,65 m, cero sobrecorrección. Al revisar el instrumento encontré dos fallos que inflaban ese número: la primera versión no dibujaba ningún coche, solo cifras, y el coche frenaba solo a 0,6 m/s² sin tocar ningún pedal, algo que el análisis contaba como reacción. Antes de confiar en 0,85 segundos tuve que confiar en que el aparato no se inventaba parte de la señal.

## El modelo, en un renglón

Para cada coche $i$ en la pista circular hacen falta cuatro cosas: su posición $x_i$, su velocidad $v_i$, su aceleración $a_i$ (lo que decide el conductor) y el hueco libre con el coche de delante, $s_i$. La regla que elegí, en lenguaje físico antes que en ecuación: cada conductor corrige su velocidad hacia la que le resulta cómoda para el hueco que tiene delante, con una constante de tiempo que dice cuánto de gradual es esa corrección.

$$
a_i = \frac{V(s_i) - v_i}{\tau}
$$

$V(s)$ es una rampa: cero con el coche pegado, la velocidad libre $v_0$ con hueco de sobra, y una recta entre medias. $\tau$ es un tiempo de *relajación*, no de reacción: el conductor empieza a corregir en el instante mismo en que ve el hueco, solo que de forma gradual. Es el Optimal Velocity Model, de Bando y colaboradores (1995).

Monté 30 coches en una pista circular de 435 metros, todos en equilibrio: mismo hueco, misma velocidad. En $t=0$ uno solo pierde 3 m/s de golpe. El resto no se toca. Y entonces cambio solo un número, $\tau$, y miro qué pasa.

Con $\tau=0,5$ s la perturbación se apaga sola: al final los 30 coches vuelven a estar todos a 24,0 km/h, dispersión de velocidad cero. Con $\tau=0,8$ s, la misma perturbación, y esta vez no se apaga: tras unos 250 segundos de calma aparente el flujo se rompe en tres atascos que viajan hacia atrás, con velocidades entre 0 y 53,9 km/h según el coche.

<figure>
  <img src="/img/atascos-espacio-tiempo.png" alt="Diagrama espacio-tiempo de treinta coches con tau=0,8 s. Tras 250 s aparecen tres bandas diagonales de velocidad baja que se desplazan hacia atrás." />
  <figcaption>Cada línea es un coche. Donde van rápido, casi horizontales y paralelas; donde un coche está parado, la línea se queda plana un rato. Esas franjas rojas se desplazan hacia la izquierda según pasa el tiempo: eso es el atasco, viajando hacia atrás.</figcaption>
</figure>

Medida por correlación cruzada del perfil de velocidades (no siguiendo «al coche más lento»: con tres atascos a la vez ese coche cambia de identidad todo el rato), la velocidad de esas franjas es de −11,7 km/h. Negativa, tal como predije en el sello. Con la misma pista, la misma regla y el mismo pinchazo inicial, cambiar solo $\tau$ invierte el resultado entero.

## Por qué un frenazo pequeño se hace más grande

Es, en el fondo, aritmética de hueco. Durante el rato que tarda el de detrás en corregir, el de delante ya ha frenado y el hueco se ha comido un poco. Para recuperarlo hay que ir un rato más despacio que él, no solo igual de despacio: el frenazo propio acaba siendo mayor que el copiado. El siguiente coche ve ese frenazo ya mayor y repite el proceso sobre uno que venía más grande. Eso es *inestabilidad de cadena*: no hace falta que nadie conduzca mal, basta con que la corrección de cada uno llegue un poco tarde.

Convertir esa intuición en un número exige perturbar el equilibrio y mirar si crece o se extingue (estabilidad lineal). Falta $V'$, cuánto cambia la velocidad cómoda por cada metro de hueco (aquí, $V' \approx 0,83$ s⁻¹), y el criterio no depende de $\tau$ solo, sino de su producto con $V'$:

$$
\tau \cdot V' > \frac{1}{1+\cos(2\pi/N)} \approx \frac{1}{2}
$$

Por debajo de ese producto el equilibrio absorbe la perturbación; por encima, la amplifica. Con $V' \approx 0,83$, sale $\tau_c \approx 0,61$ s, justo entre los 0,5 s que se apagaban y los 0,8 s que no. Lo comprobé simulando 1350 pistas a la vez, barriendo el hueco de equilibrio contra $\tau$, y clasificando cada una según si la dispersión de velocidades crecía entre el segundo 300 y el 600.

<figure>
  <img src="/img/atascos-frontera.png" alt="Mapa de hueco de equilibrio frente a tau, 1350 simulaciones. Verde estable, naranja atasco, granate atasco con choques, con la frontera cerca de tau=0,61 s." />
  <figcaption>Verde: la perturbación se apaga. Naranja: se convierte en atasco. Granate: atasco con choques. La línea discontinua es la teoría lineal, τ·V'=1/2.</figcaption>
</figure>

La primera pasada dio un acuerdo del 77,8 % con la fórmula, y pensé que el modelo tenía un problema. No lo tenía: el fallo estaba en el criterio de medida. Las pistas que habían chocado acababan con todos los coches a velocidad cero, así que su dispersión también daba cero, y las contaba como estables sin serlo. Contando un choque como inestabilidad, el acuerdo sube al 100 %.

Del barrido salen, además, tres regímenes que no predije. Con poco tráfico (hueco mayor de 20 m) todos van a $v_0$: estable siempre. Con muchísimo tráfico (coches casi pegados) todos van casi parados, también estable, como un aparcamiento. Solo en la densidad intermedia la velocidad depende del hueco, y solo ahí aparece la inestabilidad: hace falta ir lento y nervioso a la vez.

## El cambio mínimo

El cambio mínimo que pedía la pregunta original resultó no ser reaccionar más deprisa. Fue añadir un término que mira la velocidad relativa con el de delante, $\Delta v$:

$$
a_i = \frac{V(s_i)-v_i}{\tau} + \lambda\,\Delta v_i
$$

$\lambda$ mide cuánto reacciona el conductor a que se le eche encima, además de al hueco: es el Full Velocity Difference Model (Jiang et al., 2001), lo que hace un control de crucero adaptativo. La fórmula predice $\tau_c \approx 1/(2(V'-\lambda))$; simulado sale algo por encima, porque el anillo de solo 30 coches admite menos modos de oscilación:

| $\lambda$ | fórmula | simulado |
|---|---|---|
| 0,0 | 0,60 s | 0,65 s |
| 0,2 | 0,79 s | 0,90 s |
| 0,4 | 1,15 s | 1,30 s |
| 0,6 | 2,14 s | 2,65 s |

Con $\tau=0,8$ s y $\lambda=0,3$, el mismo $\tau$ que antes rompía el flujo en tres atascos, la dispersión final baja a 0,02 km/h: no hay atasco.

<figure>
  <img src="/img/atascos-anticipacion.png" alt="El mismo diagrama espacio-tiempo con tau=0,8 s y anticipación lambda=0,3: líneas uniformes de principio a fin, sin ninguna banda de velocidad baja." />
  <figcaption>Mismo τ=0,8 s que antes rompía el flujo. Con λ=0,3, mirando también la velocidad relativa del de delante, no hay ninguna banda de velocidad baja.</figcaption>
</figure>

Cerca del umbral, crecer es extremadamente lento: con $\lambda=0,6$ y $\tau$ solo 0,05 s por encima del umbral, la dispersión apenas se multiplica por 1,07 en 300 segundos. Se llama *enlentecimiento crítico*, y es la razón de fondo por la que Sugiyama tuvo que esperar minutos, no segundos, a que su atasco apareciera.

Y aquí está el giro que de verdad me hizo revisar mi predicción: ningún módulo de este modelo incluye un retraso de reacción explícito, $\tau$ es relajación. Y aun así el atasco aparece, coincide al 100 % con la teoría lineal, y reproduce cuantitativamente el experimento real (lo compruebo abajo). Un retraso de reacción explícito es un mecanismo *suficiente* para producir un atasco así, no es *necesario*: basta con corregir despacio en relación con lo sensible que se es al hueco, $\tau\cdot(V'-\lambda) > 1/2$. Confundir suficiente con necesario es justo el error en el que caí al escribir mi propia predicción.

De las cuatro predicciones firmadas, la del signo ya ha quedado confirmada arriba. Las otras dos las acerté en la respuesta y fallé en el porqué: escribí «retraso» y di por hecho una densidad crítica creciente, y el modelo terminó hablando de relajación y de un producto que deja de crecer con la densidad. Y la de Fermi, en blanco a propósito, no cuenta ni como acierto ni como fallo: a posteriori, con coches separados unos 35 m a 100 km/h y un segundo de propagación por coche, salen unos 30 coches y unos 30 segundos para notar la perturbación un kilómetro más atrás.

## Contra el experimento real

Calibré $V(s)$ únicamente con lo que Sugiyama pidió a sus conductores: crucero a 30 km/h, hueco de equilibrio de su pista (5,95 m), y 40 km/h de velocidad libre; nada de la onda entra en el ajuste. Con ese único parámetro libre, $\tau=0,5$ s, salen a la vez los dos números que Sugiyama midió: 5 coches parados y una onda a −20,0 km/h (el experimento real dio unos −20 km/h). Dos observaciones independientes, un solo número ajustado. Ya en $\tau=0,5$ s el hueco mínimo baja a 9 cm; en $\tau=0,7$ s se vuelve negativo, el modelo choca, porque esta regla sin $\lambda$ ignora lo rápido que se le echa encima el de delante: los conductores reales anticipan, y la versión sin anticipación se rompe antes que ellos.

## De coches a fluido

Hay una segunda descripción, completa y distinta, que deja de contar coches: densidad $\rho(x,t)$, velocidad $v(x,t)$, y flujo $q(x,t)=\rho v$. La relación $q(\rho)$, el diagrama fundamental, convierte la regla de un conductor en una propiedad del flujo entero: sube mientras hay hueco de sobra, llega a una capacidad máxima y baja según se satura la vía. En este modelo esa capacidad sale en 2.204 coches por hora, a 41 coches por kilómetro.

<figure>
  <img src="/img/atascos-diagrama-fundamental.png" alt="A la izquierda, diagrama fundamental flujo frente a densidad con pico de 2204 coches por hora a 41 coches por kilómetro. A la derecha, el mismo atasco como campo de densidad, con bandas oscuras que se desplazan hacia atrás." />
  <figcaption>Izquierda: el diagrama fundamental de este modelo. Derecha: el mismo atasco de la primera figura, ahora como campo continuo ρ(x,t); las bandas oscuras son los mismos tres atascos, vistos como fluido en vez de como coches.</figcaption>
</figure>

Los coches no aparecen ni desaparecen, así que hay una ley de conservación, y de ahí sale la velocidad de un frente entre dos estados sin simular nada (Rankine-Hugoniot: la pendiente de la cuerda que une los dos puntos del diagrama). En mis parámetros propios da −13,1 km/h frente a −11,7 medidos (10 % de diferencia: dentro del atasco los coches quedan más apretados, 195 coches/km, de lo que asume la rama de equilibrio, unos 154). Con los de Sugiyama da −20,4 frente a −20,0 medidos. Una onda puede existir sin que ningún objeto viaje a su velocidad.

Con un límite: este modelo, de primer orden, con la curva $q(\rho)$ de equilibrio (Lighthill y Whitham, 1955), es siempre estable por construcción, nunca predice que una perturbación crezca. La inestabilidad vive en $\tau$, el tiempo que el flujo tarda en alcanzar ese equilibrio, algo que $q(\rho)$ da por hecho; los modelos de segundo orden (Payne-Whitham) sí la reintroducen.

## No hace falta que sean coches

El mecanismo se reduce a tres preguntas que no dependen de que haya coches: cuánto responde cada agente a su vecino ($V'$), cuánto tarda en corregir ($\tau$), y si mira solo el estado actual o también la tendencia ($\lambda$). $\tau\cdot(V'-\lambda)$ contra $1/2$ es la plantilla; lo que cambia es el sistema.

Un autoscaler que añade servidores según la longitud de una cola puede hacer lo mismo que el conductor lento: medir tarde y añadir capacidad cuando el pico casi ha pasado. Cuando un servicio empieza a fallar, cada cliente que reintenta le añade más carga justo cuando peor está, el mismo frenazo amplificándose de cliente en cliente; el backoff exponencial con jitter cumple el papel de $\lambda$, baja la agresividad en vez de subirla. No lo he medido esta semana, es la misma plantilla por analogía.

Hay uno que sí puedes comprobar mañana sin programar nada: el semáforo se pone verde y los coches arrancan uno a uno, no todos a la vez. Ese frente de arranque también viaja hacia atrás, a un ritmo parecido a un coche por tiempo de reacción, la misma cuenta de la velocidad del atasco, visible la próxima vez que esperes en el segundo o el tercer coche de la fila.

## Lo que queda sin cerrar

Vuelve a la autovía del principio. Frenaste porque frenó el de delante, y cinco minutos después llegaste a una carretera vacía. Ahora sabes que no hacía falta ningún accidente: hacía falta, solamente, que en algún punto de la cadena de coches alguien corrigiera un poco despacio en relación con lo sensible que era al hueco que tenía delante. El atasco nunca estuvo en ese conductor. Estuvo en cómo se propagó su frenazo al siguiente.

Con la misma honestidad con la que cuento lo que sí funcionó: la frontera me salió plana porque la $V(s)$ de mi modelo es una rampa recta, con dos esquinas; con una curva suave debería salir una frontera en forma de U, y no lo he comprobado. Y usé coches idénticos en todas las simulaciones: no sé cuánto cambia el umbral si unos conductores son más nerviosos que otros, solo que Sugiyama dio a los suyos la misma instrucción y el atasco apareció igual.

El código está en [el repositorio](https://github.com/FullFran/reto-semanal), carpeta `week-05-phantom-jams`: las cuatro simulaciones, las figuras, y el cuaderno con las predicciones selladas antes de ver ningún resultado.

### Referencias

- Y. Sugiyama et al. *Traffic jams without bottlenecks: experimental evidence for the physical mechanism of the formation of a jam.* New J. Phys. 10, 033001, 2008.
- M. Bando et al. *Dynamical model of traffic congestion and numerical simulation.* Phys. Rev. E 51, 1035, 1995.
- R. Jiang, Q. Wu, Z. Zhu. *Full velocity difference model for a car-following theory.* Phys. Rev. E 64, 017101, 2001.
- M. J. Lighthill, G. B. Whitham. *On kinematic waves II: a theory of traffic flow on long crowded roads.* Proc. R. Soc. A 229, 1955.
