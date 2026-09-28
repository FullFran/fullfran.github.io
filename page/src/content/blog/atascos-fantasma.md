---
title: "¿Por qué el atasco va hacia atrás?"
date: 2026-09-25
lang: es
description: "Frenas porque frena el de delante y, cinco minutos después, llegas a la zona del atasco: no hay nada, ni accidente ni obras. Con treinta coches en un anillo y una regla de una línea se reproduce el atasco, se mide por qué retrocede, y la intuición de que el culpable es reaccionar tarde resulta estar a medias equivocada."
draft: false
---

Vas por la autovía a velocidad constante. De repente frenas, porque frena el de delante. Paras, arrancas, vuelves a parar, y así varios minutos. Cuando por fin llegas a donde tenía que estar el accidente, las obras o el carril cerrado, no hay nada. Carretera vacía.

No te lo has imaginado. El atasco era real, tenía coches parados dentro. Y viajaba hacia atrás por la carretera mientras tú avanzabas hacia delante.

Lo primero que piensa uno es que algo ha tenido que pasar: un estrechamiento, un accidente que ya han retirado. Causa puntual, efecto puntual. En 2008 Yuki Sugiyama y su equipo montaron un experimento pensado justo para quitarse esa posibilidad de encima. 22 coches en una pista circular de 230 metros, sin cruces, sin semáforos, sin nada que estreche. Una sola instrucción: ir a unos 30 km/h guardando una distancia razonable con el de delante.

A los pocos minutos, sin que nadie frenara por ningún motivo, apareció un atasco de cinco coches parados. Y el atasco entero se desplazaba hacia atrás, a unos 20 km/h.

Los coches iban hacia delante. El atasco iba hacia atrás.

¿Cómo sale un atasco de la nada? ¿Y qué habría que cambiar en cómo conducimos para que no saliera?

## Lo que yo habría apostado

Si me hubieras preguntado antes de hacer ninguna cuenta, te habría dicho tres cosas. Que tiene que haber una densidad crítica: con pocos coches no pasa nada y, a partir de cierto punto, todo se rompe. Que el culpable es el tiempo de reacción: alguien que tarda 1,5 s en reaccionar tiene que ser mucho peor que alguien que tarda 0,2 s, porque le pasa al de detrás un frenazo más tardío y más acumulado. Y que el atasco va hacia atrás, porque es lo que se ve.

Parece razonable. Pero solo una de las tres es correcta del todo. Las otras dos aciertan la respuesta y fallan el porqué.

Para tener una referencia, medí mi propio tiempo de reacción con un juego de «sigue al de delante»: un coche que sigue a otro que frena cuando no te lo esperas. Me salieron 0,85 segundos. Guárdate ese número, porque luego resulta que no es el que importa.

## El modelo, en un renglón

Para cada coche hacen falta cuatro cosas: su posición $x_i$, su velocidad $v_i$, su aceleración $a_i$ (lo que decide el conductor) y el hueco libre con el de delante, $s_i$. La regla, dicha en cristiano: cada conductor corrige su velocidad hacia la que le resulta cómoda para el hueco que tiene, y lo hace poco a poco.

$$
a_i = \frac{V(s_i) - v_i}{\tau}
$$

$V(s)$ es la velocidad cómoda para un hueco $s$. Es una rampa: cero con el coche pegado, la velocidad libre $v_0$ con hueco de sobra, y una recta entre medias. Y $\tau$ dice cuánto de poco a poco. Ojo, que esto importa luego: $\tau$ no es un tiempo de reacción. El conductor empieza a corregir en el mismo instante en que ve el hueco, solo que despacio. Es un tiempo de relajación. El modelo es el Optimal Velocity Model, de Bando y colaboradores (1995).

Monté 30 coches en un anillo, todos en equilibrio: mismo hueco, misma velocidad. En $t=0$ uno solo pierde 3 m/s de golpe. Nada más. Y entonces cambio un único número, $\tau$, y miro qué pasa.

Con $\tau=0,5$ s el pinchazo se apaga solo y los 30 coches vuelven a ir todos iguales. Con $\tau=0,8$ s, el mismo pinchazo, y esta vez no se apaga. Durante unos 250 segundos parece que no pasa nada. Y de repente el flujo se rompe en tres atascos.

<figure>
  <img src="/img/atascos-espacio-tiempo.png" alt="Diagrama espacio-tiempo de treinta coches con tau=0,8 s. Tras 250 s aparecen tres bandas diagonales de velocidad baja que se desplazan hacia atrás." />
  <figcaption>Cada línea es un coche. Donde van rápido, casi horizontales y paralelas; donde un coche está parado, la línea se queda plana un rato. Esas franjas rojas se desplazan hacia la izquierda según pasa el tiempo: eso es el atasco, viajando hacia atrás.</figcaption>
</figure>

Esas franjas se mueven a −11,7 km/h. Hacia atrás, como tenía que ser. Misma pista, misma regla, mismo pinchazo, y cambiar un solo número le da la vuelta al resultado entero.

## Por qué un frenazo pequeño se hace más grande

Es aritmética de hueco. Mientras el de detrás corrige, el de delante ya ha frenado, y el hueco se ha encogido un poco. Para recuperarlo no basta con ir igual de despacio que él: hay que ir un rato más despacio todavía. O sea, que tu frenazo acaba siendo más grande que el que copiabas. El siguiente coche ve ese frenazo ya engordado y repite la jugada.

Eso es inestabilidad de cadena. No hace falta que nadie conduzca mal. Basta con que cada uno corrija un pelín tarde.

Para pasar de la intuición a un número hay que perturbar el equilibrio y ver si la perturbación crece o se muere. Y aparece una cosa más, $V'$: cuánto cambia la velocidad cómoda por cada metro de hueco (aquí, $V' \approx 0,83$ s⁻¹). El criterio no depende de $\tau$ solo, sino de su producto con $V'$:

$$
\tau \cdot V' > \frac{1}{1+\cos(2\pi/N)} \approx \frac{1}{2}
$$

Si el producto se queda por debajo, el equilibrio se traga la perturbación. Si lo pasa, la amplifica. Con $V' \approx 0,83$ sale $\tau_c \approx 0,61$ s, justo entre los 0,5 s que se apagaban y los 0,8 s que no. Lo comprobé con 1350 simulaciones, barriendo el hueco contra $\tau$.

<figure>
  <img src="/img/atascos-frontera.png" alt="Mapa de hueco de equilibrio frente a tau, 1350 simulaciones. Verde estable, naranja atasco, granate atasco con choques, con la frontera cerca de tau=0,61 s." />
  <figcaption>Verde: la perturbación se apaga. Naranja: se convierte en atasco. Granate: atasco con choques. La línea discontinua es la teoría lineal, τ·V'=1/2.</figcaption>
</figure>

La primera vez, la fórmula y las simulaciones solo coincidían en el 77,8 % de los casos. Y pensé que el modelo estaba mal. Pero no. El fallo estaba en cómo decidía yo si una pista era estable: miraba si las velocidades acababan todas iguales. Y hay una forma muy tonta de acabar todos a la misma velocidad, que es chocar y quedarse todos parados. Mi criterio estaba contando los choques como tráfico perfecto. Contando un choque como lo que es, la coincidencia sube al 100 %.

Y aquí cae la primera de mis apuestas. No hay una densidad a partir de la cual todo se rompe. Hay tres regímenes. Con poco tráfico todos van a $v_0$, y estable. Con los coches casi pegados todos van casi parados, y también estable, como un aparcamiento. Solo en medio, donde la velocidad depende del hueco, aparece la inestabilidad. Hace falta ir lento y nervioso a la vez.

## El cambio mínimo

Lo que arregla el atasco no es reaccionar más deprisa. Es mirar una cosa más: si el de delante se te está echando encima. Un término con la velocidad relativa, $\Delta v$:

$$
a_i = \frac{V(s_i)-v_i}{\tau} + \lambda\,\Delta v_i
$$

$\lambda$ mide cuánto te importa que el hueco se esté cerrando, además de cuánto hueco hay. Es el Full Velocity Difference Model (Jiang y colaboradores, 2001), y es más o menos lo que hace un control de crucero adaptativo. La teoría dice que el umbral pasa a ser $\tau_c \approx 1/(2(V'-\lambda))$. Simulado sale algo por encima, porque un anillo de solo 30 coches tiene menos formas de oscilar:

| $\lambda$ | fórmula | simulado |
|---|---|---|
| 0,0 | 0,60 s | 0,65 s |
| 0,2 | 0,79 s | 0,90 s |
| 0,4 | 1,15 s | 1,30 s |
| 0,6 | 2,14 s | 2,65 s |

Con $\tau=0,8$ s, el mismo que antes rompía el flujo en tres atascos, y $\lambda=0,3$, no hay atasco. Nada.

<figure>
  <img src="/img/atascos-anticipacion.png" alt="El mismo diagrama espacio-tiempo con tau=0,8 s y anticipación lambda=0,3: líneas uniformes de principio a fin, sin ninguna banda de velocidad baja." />
  <figcaption>Mismo τ=0,8 s que antes rompía el flujo. Con λ=0,3, mirando también la velocidad relativa del de delante, no hay ninguna banda de velocidad baja.</figcaption>
</figure>

Hay un detalle curioso cerca del umbral: ahí crecer es lentísimo. Con $\lambda=0,6$ y $\tau$ apenas 0,05 s por encima del umbral, la perturbación se multiplica por 1,07 en 300 segundos. Se llama enlentecimiento crítico, y por eso Sugiyama tuvo que esperar minutos, no segundos, a que saliera su atasco.

Y aquí está el giro, el que tumba mi segunda apuesta. En este modelo no hay ningún tiempo de reacción. Ninguno. $\tau$ es relajación. Y aun así el atasco aparece, cuadra al 100 % con la teoría, y reproduce el experimento real (ahora lo vemos). Así que reaccionar tarde es una forma de producir el atasco, pero no la única: basta con corregir despacio comparado con lo sensible que eres al hueco, $\tau\cdot(V'-\lambda) > 1/2$. Suficiente no es lo mismo que necesario.

El conductor de 1,5 s sí es peor que el de 0,2 s. Pero no porque reaccione tarde, sino porque corrige despacio. Mis 0,85 segundos de reacción no pintan nada en esta cuenta.

Una cuenta de servilleta para ponerlo en escala. En autovía, a 100 km/h y con coches separados unos 35 m, si cada coche tarda en torno a un segundo en pasarle el frenazo al siguiente, un kilómetro detrás son unos 30 coches, y el frenazo llega en unos 30 segundos. Tú todavía no ves nada raro, y ya viene hacia ti.

## Contra el experimento real

Vale, pero un modelo que hace atascos no es lo mismo que un modelo que explica los atascos de verdad. Así que lo ajusté a Sugiyama usando solo lo que él les pidió a sus conductores: ir a 30 km/h, el hueco de su pista y 40 km/h de velocidad libre. Nada de la onda entra en el ajuste. Queda un único número libre, $\tau$.

Con $\tau=0,5$ s salen a la vez las dos cosas que midió Sugiyama: 5 coches parados y una onda a −20,0 km/h. En el experimento real, unos −20 km/h. Dos observaciones independientes con un solo número ajustado.

Pero el modelo tiene las costuras a la vista. Ya con $\tau=0,5$ s el hueco mínimo baja a 9 cm, y con $\tau=0,7$ s los coches chocan. Es que esta regla, sin $\lambda$, no se entera de lo rápido que se le echa encima el de delante. Los conductores de verdad sí se enteran, y por eso aguantan donde el modelo ya se rompe.

## De coches a fluido

Hay otra forma de contar esto que se olvida de los coches uno a uno. Mira la carretera como un fluido: densidad $\rho(x,t)$, velocidad $v(x,t)$ y flujo $q(x,t)=\rho v$ (coches que pasan por un punto por unidad de tiempo). La relación $q(\rho)$, el diagrama fundamental, convierte la regla de un conductor en una propiedad de la carretera entera. Con poca densidad el flujo sube, llega a un máximo y luego baja según se satura la vía. En este modelo el máximo son 2.204 coches por hora, a 41 coches por kilómetro.

<figure>
  <img src="/img/atascos-diagrama-fundamental.png" alt="A la izquierda, diagrama fundamental flujo frente a densidad con pico de 2204 coches por hora a 41 coches por kilómetro. A la derecha, el mismo atasco como campo de densidad, con bandas oscuras que se desplazan hacia atrás." />
  <figcaption>Izquierda: el diagrama fundamental de este modelo. Derecha: el mismo atasco de la primera figura, ahora como campo continuo ρ(x,t); las bandas oscuras son los mismos tres atascos, vistos como fluido en vez de como coches.</figcaption>
</figure>

Y como los coches ni aparecen ni desaparecen, hay una ley de conservación. De ahí sale la velocidad del frente de un atasco sin simular nada: es la pendiente de la recta que une en el diagrama el estado de antes y el de dentro del atasco (Rankine-Hugoniot). Con mis parámetros da −13,1 km/h frente a los −11,7 medidos. Con los de Sugiyama, −20,4 frente a −20,0.

Esto es lo que más me gusta de toda la semana. Una onda puede ir hacia atrás sin que ningún objeto vaya hacia atrás.

Pero con un límite. Esta versión fluida, la de Lighthill y Whitham (1955), es siempre estable: nunca predice que una perturbación crezca. Da por hecho que el tráfico está siempre en su equilibrio, y la inestabilidad vive justo en $\tau$, en lo que tarda en llegar a él. Explica muy bien hacia dónde va el atasco y a qué velocidad. Por qué nace, no.

## No hace falta que sean coches

Si quitas los coches, quedan tres preguntas. Cuánto responde cada uno a su vecino ($V'$). Cuánto tarda en corregir ($\tau$). Y si mira solo cómo están las cosas o también hacia dónde van ($\lambda$).

Un autoscaler que añade servidores según la longitud de una cola puede hacer lo mismo que el conductor lento: medir tarde y añadir capacidad cuando el pico ya casi ha pasado. Cuando un servicio empieza a fallar, cada cliente que reintenta le mete más carga justo cuando peor está, el mismo frenazo amplificándose de cliente en cliente. El backoff exponencial con jitter hace de $\lambda$: baja la agresividad en vez de subirla. Esto no lo he medido, es la misma idea por analogía.

Y hay uno que puedes comprobar mañana sin programar nada. El semáforo se pone verde y los coches no arrancan todos a la vez, sino uno detrás de otro. Ese frente de arranque también viaja hacia atrás, más o menos un coche por cada tiempo de reacción. Míralo la próxima vez que te toque esperar de segundo o tercero en la fila.

## Lo que queda sin cerrar

Vuelve a la autovía del principio. Frenaste porque frenó el de delante, y cinco minutos después llegaste a una carretera vacía. No hacía falta ningún accidente. Hacía falta, solamente, que alguien en la cadena corrigiera un poco despacio para lo sensible que era al hueco. El atasco no estaba en ese conductor. Estaba en cómo se pasó su frenazo al siguiente.

Me quedan dos cosas sin comprobar. La frontera me salió plana porque mi $V(s)$ es una rampa recta, con dos esquinas. Con una curva suave debería salir una frontera en forma de U, y no lo he mirado. Y todos mis coches eran idénticos: no sé cuánto se mueve el umbral si unos conductores son más nerviosos que otros. Lo que sí sé es que Sugiyama les dio a todos la misma instrucción, y el atasco salió igual.

### Referencias

- Y. Sugiyama et al. *Traffic jams without bottlenecks: experimental evidence for the physical mechanism of the formation of a jam.* New J. Phys. 10, 033001, 2008.
- M. Bando et al. *Dynamical model of traffic congestion and numerical simulation.* Phys. Rev. E 51, 1035, 1995.
- R. Jiang, Q. Wu, Z. Zhu. *Full velocity difference model for a car-following theory.* Phys. Rev. E 64, 017101, 2001.
- M. J. Lighthill, G. B. Whitham. *On kinematic waves II: a theory of traffic flow on long crowded roads.* Proc. R. Soc. A 229, 1955.
