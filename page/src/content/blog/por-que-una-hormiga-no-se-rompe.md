---
title: "¿Por qué una hormiga no se rompe?"
date: 2026-08-29
lang: es
description: "Un gato cayó 32 pisos sobre hormigón y salió del hospital a los dos días. La respuesta no está en el gato: está en dos exponentes que no son iguales."
---

En 1984, en Nueva York, un gato se cayó de un piso 32 sobre hormigón. Ciento diecisiete metros. Le dieron el alta a las cuarenta y ocho horas con un neumotórax leve y un diente astillado.

Eso está publicado, con nombres y apellidos, en el *Journal of the American Veterinary Medical Association*.

Y choca de frente con lo que cualquiera diría:

$$
\text{más alto} \;\to\; \text{más rápido} \;\to\; \text{más energía} \;\to\; \text{más daño}
$$

Cada flecha parece obvia. Las tres tienen algo mal. Y arreglarlas lleva a un sitio bastante más interesante que los gatos.

## Flecha uno: más alto no es más rápido

Cuando caes, el aire te empuja hacia arriba con una fuerza que crece con el cuadrado de la velocidad. Cuanto más rápido vas, más te frena.

$$
m\frac{dv}{dt} \;=\; mg \;-\; \tfrac{1}{2}\rho\, C_D A\, v^2
$$

Lo único que dice eso es: te tira la gravedad, te frena el aire, y el frenado depende de lo rápido que vayas. En algún momento los dos se igualan, y ahí dejas de acelerar. Esa velocidad sale de igualar los dos términos:

$$
v_c \;=\; \sqrt{\frac{2mg}{\rho\, C_D A}}
$$

Para un gato de cuatro kilos con las patas abiertas salen unos **103 km/h**. Y eso es todo. Da igual que el edificio tenga cuarenta metros o cuatrocientos.

<figure>
  <img src="/img/gatos-techo.png" alt="Gráfica de la velocidad de llegada frente a la altura de la caída. Sin aire la curva crece sin límite; con aire se aplana en una línea horizontal marcada a 103 kilómetros por hora." />
  <figcaption>Sin aire, la velocidad crece sin parar. Con aire hay un techo, y a partir de cierta altura sumar pisos deja de sumar velocidad.</figcaption>
</figure>

## Y ahora la parte bonita

Resolver la ecuación no es difícil si eliges bien la variable. Como lo que quieres es la velocidad en función de la altura y no del tiempo, usas que $\frac{dv}{dt} = v\frac{dv}{dh}$ y el tiempo desaparece del problema. Sale esto:

$$
v(h) \;=\; v_c\sqrt{1 - e^{-h/h_c}}, \qquad h_c = \frac{v_c^2}{2g}
$$

Fíjate en esa $h_c$. Como $v_c^2 = 2gh_c$, es exactamente **la altura desde la que tendrías que caer, sin aire, para llegar a la velocidad máxima**.

Lo cual significa que caer desde un rascacielos, para cualquier bicho, es idéntico —no parecido: idéntico— a caer desde su $h_c$ en el vacío.

Para un gato son cuarenta y dos metros. Para una mosca, cuarenta y tres centímetros.

<figure>
  <img src="/img/gatos-escalera.png" alt="Barras horizontales en escala logarítmica con la altura característica de seis animales: 43 centímetros la mosca, 76 la hormiga, 8 metros el ratón, 42 el gato, 95 el humano y 219 el caballo." />
  <figcaption>La altura a partir de la cual da igual caerse. Una mosca que se cae de un edificio de doscientos metros llega al suelo igual que si se cayera del borde de tu mesa. Y se cae de la mesa todos los días.</figcaption>
</figure>

Un caballo, en el otro extremo, no alcanza su velocidad máxima desde ningún edificio construido por nadie.

## La ley, y qué dicen los que la han medido

Si supones que los animales tienen todos más o menos la misma forma, la masa va con el cubo de su longitud y el área con el cuadrado. Metiendo eso en $v_c$:

$$
v_c \propto \sqrt{\frac{m}{A}} \propto \sqrt{\frac{L^3}{L^2}} = \sqrt{L} \;\;\Longleftrightarrow\;\; v_c \propto m^{1/6}
$$

Un exponente ridículamente pequeño. Multiplica la masa por un millón y la velocidad terminal sólo se multiplica por diez.

Lo interesante es que eso se puede contrastar. Cogí la ley, la anclé en el único punto que conocía —el gato— y la comparé con las velocidades terminales que se citan por ahí para otros animales.

<figure>
  <img src="/img/gatos-modelo-vs-medido.png" alt="Gráfica log-log de velocidad terminal frente a masa. Una recta azul representa la ley de un sexto anclada en el gato; los puntos medidos de hormiga, ratón, gato y humano caen prácticamente sobre ella, y la ardilla voladora queda claramente por debajo." />
  <figcaption>La ley tiene un solo parámetro libre, y ese lo fijé con el gato. Los demás animales caen encima sin que nadie los ajustara. La ardilla voladora es la única que se sale, y se sale a propósito.</figcaption>
</figure>

Siete órdenes de magnitud de masa, desde tres miligramos hasta ochenta kilos, y los puntos caen sobre la recta dentro de un factor de kilo y medio. Con un modelo de un solo término y áreas estimadas a ojo.

Y la excepción es la mejor parte: **la ardilla voladora está claramente por debajo de la ley**, porque despliega el patagio y consigue mucha más área de la que su tamaño le tocaría. Pesa lo mismo que un ratón y cae más despacio que él. Es evolución manipulando el exponente a mano.

*(Aviso honesto: esos valores medidos vienen de fuentes divulgativas, no de una compilación revisada por pares, y varían bastante entre unas y otras. Sirven como orden de magnitud, no como medida fina.)*

## Flecha dos: llegar despacio no es no romperse

Aquí es donde el problema deja de ser aerodinámica.

Haz un animal el doble de largo. Su masa se multiplica por ocho, porque crece en tres direcciones a la vez. Pero la sección de sus huesos —que es lo que aguanta la carga— sólo se multiplica por cuatro, porque una sección es una superficie.

<figure>
  <img src="/img/gatos-cubo-cuadrado.png" alt="Dos curvas: el peso creciendo como el cubo del tamaño y la resistencia como el cuadrado. Al doblar el tamaño, marcadas las etiquetas por ocho y por cuatro." />
  <figcaption>El peso siempre gana. Cuanto más grande eres, más frágil eres en proporción a ti mismo.</figcaption>
</figure>

Así que la tensión que soportan tus huesos al aterrizar escala como

$$
\sigma = \frac{F}{A} \propto \frac{L^3}{L^2} = L
$$

Una hormiga soporta unas ciento cuarenta veces menos tensión que un gato en el mismo impacto. Un caballo, seis veces más.

Esto no lo he descubierto yo, ni de lejos. Lo escribió Galileo en 1638, en las *Dos nuevas ciencias*, donde dibuja el hueso de un animal grande engordado de forma monstruosa para explicar que un bicho no puede limitarse a crecer manteniendo la forma.

Y aquí está el detalle que me dejó tonto: **es el mismo libro que fundó el estudio de los cuerpos que caen**. Las dos mitades de la respuesta llevan juntas en el mismo volumen desde hace casi cuatrocientos años.

## Flecha tres: la energía no es el daño

Toda la energía que traes tiene que desaparecer. Eso no se negocia. Lo único que puedes elegir es **en cuánta distancia**.

$$
a = \frac{v^2}{2x}
$$

Frenar en un centímetro contra hormigón o en treinta contra un toldo, con la misma caída, son treinta veces menos golpe.

Un gato flexionando las patas aporta unos cinco centímetros. Encadenando las dos mitades —cuánto corre y cuánto frena— sale la altura a la que empieza a hacerse daño de verdad: **trece metros, tres pisos y medio**.

Pero lo bueno es lo otro. Existe una distancia de frenado por encima de la cual **ninguna altura es letal**:

$$
x_{\text{crítico}} = \frac{v_c^2}{2\,a_{\text{tol}}\,g} \approx 18{,}5\ \text{cm}
$$

Porque ni llegando a la velocidad máxima se supera lo que aguanta. El techo que pone el aire y el frenado que pone el suelo se cubren mutuamente.

## El fallo que no mordía

Al empezar esto estimé la masa y el área del gato a ojo, como se supone que hay que hacer. Me salió un animal de entre diez y veinte kilos con un área frontal de doscientos centímetros cuadrados.

Los dos números están mal. Un gato son cuatro o cinco kilos, y extendido cubre unos ochocientos centímetros cuadrados.

Parece un detalle. No lo es: con aquellos números la velocidad terminal salía **399 km/h** y la altura característica **625 metros**. O sea, el rozamiento no habría importado en ningún edificio del planeta, y toda la primera mitad de esta entrada —el techo, la escalera de animales, la mosca que se cae de la mesa— simplemente no existiría.

Dos brackets flojos borran el resultado que los propios brackets tenían que encontrar. Para eso está el paso de estimar antes de calcular: no es papeleo, es la parte donde se decide si vas a ver algo.

Y hay una segunda lección, más incómoda. Cuando al final medí cuánto se mueve el resultado al mover cada parámetro, salió esto: la masa, el área y el coeficiente de arrastre lo mueven un treinta por ciento. La distancia de frenado y la tolerancia lo mueven un factor cinco.

Es decir: **toda la aerodinámica elegante aporta un ±30 % al número final**, y lo que decide son los dos parámetros que estimé peor. Saberlo no invalida nada. Coloca cada resultado en su sitio, que es distinto de tenerlos todos revueltos creyendo que valen igual.

## A dónde lleva esto

La respuesta a por qué una hormiga no se rompe no tiene nada de hormiga. Es esto:

$$
A \propto L^{\alpha}, \quad B \propto L^{\beta} \quad\Longrightarrow\quad \frac{A}{B} \propto L^{\alpha-\beta}
$$

Si dos efectos que compiten crecen con exponentes distintos, su cociente depende del tamaño. Y al cruzar la unidad, cambia quién manda. **Las leyes son las mismas; los exponentes no.**

La misma estructura está en las vigas de Galileo, en los insectos que caminan sobre el agua —tensión superficial con $L^1$ contra peso con $L^3$—, en el tamaño máximo que puede tener un bicho antes de que el oxígeno no le llegue por difusión, y en por qué un ratón tiene que comer sin parar y un elefante tiene problemas para refrigerarse.

Y fuera de la física también: coordinar $n$ personas necesita del orden de $n^2$ canales mientras el trabajo hecho crece como $n$. Duplicar el equipo no duplica la producción.

El tamaño no es un parámetro más. Es el que decide en qué régimen del mismo conjunto de leyes te encuentras.

---

En la siguiente entrada, la otra mitad de la historia: de dónde sale la creencia de que los gatos se hacen **menos** daño desde más alto, por qué no sobrevive, y qué pasa cuando los datos que tienes son sólo los animales que llegaron vivos a la clínica.

- [El cuaderno completo](https://github.com/FullFran/reto-semanal) — la servilleta, la predicción sellada antes de mirar los datos, los tres modelos y el informe.
- El código son ocho módulos sin más dependencias que numpy: los controles se ejecutan, no se afirman.
