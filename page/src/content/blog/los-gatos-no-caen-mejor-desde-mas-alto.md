---
title: "Los gatos no caen mejor desde más alto"
date: 2026-08-30
lang: es
description: "Un resultado precioso de 1987 que llevo oyendo toda la vida. Se sostiene sobre veintidós gatos, y su propia física no cuadra. Qué pasa cuando tus datos son sólo los que llegaron vivos."
---

Hay una idea que circula desde hace cuarenta años y que es maravillosa: los gatos que caen de **más** de siete pisos se hacen **menos** daño que los que caen de menos.

Contraintuitiva, memorable, con una explicación elegante detrás. Todo lo que uno quiere de un dato.

Y no aguanta.

Lo interesante no es que sea falsa. Es **cómo** se cae, porque se cae por tres sitios distintos y cada uno enseña algo diferente sobre qué se puede concluir de unos datos.

## De dónde sale

De un artículo de 1987, en el *Journal of the American Veterinary Medical Association*. Whitney y Mehlhaff recogieron los ciento treinta y dos gatos que llegaron al Animal Medical Center de Nueva York en cinco meses de 1984. Un trabajo honesto, bien documentado y con la frase que dio la vuelta al mundo:

> the rate of injury was approximately linear up to a distance fallen of approximately 7 stories. **Surprisingly, these injury rates did not continue to increase** with falls of >7 stories, and the fracture rate decreased.

Y la explicación que propusieron —ellos escriben *«we speculate»*, cosa que casi nadie repite— es de las que se quedan grabadas.

Un gato alcanza su velocidad terminal a unos cinco pisos. Una vez ahí ya no acelera, y como el oído interno detecta aceleración y no velocidad, el gato deja de notar que está cayendo. Se relaja, extiende las patas como una ardilla voladora, reparte el impacto por todo el cuerpo y se hace menos daño.

Es preciosa. Tiene mecanismo, tiene fisiología y explica el dato.

## Grieta uno: sus propios números

Cojamos su velocidad terminal —60 millas por hora, la que ellos citan— y metámosla en su propio modelo de rozamiento. La velocidad en función de la altura sale de resolver la caída con arrastre cuadrático:

$$
v(h) = v_c\sqrt{1 - e^{-h/h_c}}, \qquad h_c = \frac{v_c^2}{2g}
$$

Con sus 60 mph, $h_c$ son treinta y siete metros. Y a cinco pisos, dieciocho metros, el gato va al **63 %** de su velocidad terminal.

La aceleración que todavía nota es $g\left(1 - v^2/v_c^2\right)$, o sea:

<figure>
  <img src="/img/gatos-aceleracion.png" alt="Gráfica de la aceleración que aún nota el gato frente a la altura recorrida. A cinco pisos marca 0,61 g; hacen falta unos 23 pisos para bajar de 0,1 g." />
  <figcaption>A cinco pisos, el punto donde su mecanismo dice que el gato deja de notar la caída, todavía está acelerando a seis décimas de g. Para que la aceleración sea despreciable de verdad hacen falta veintitrés pisos.</figcaption>
</figure>

**Seis décimas de g.** Eso no es «dejar de notar que caes». Eso es más de la mitad de la gravedad terrestre tirando de ti hacia abajo.

Para bajar de una décima de g hacen falta unos veintitrés pisos. Su mecanismo necesita que la aceleración haya desaparecido en el cinco, y su propio modelo dice que aún queda casi toda.

No hace falta nada sofisticado para verlo. Sale de la ecuación que ellos mismos invocan.

## Grieta dos: cuántos gatos

La afirmación es sobre lo que pasa por encima del séptimo piso. ¿Cuántos gatos tenían por encima del séptimo piso?

Veintidós. Y por encima del noveno, trece.

<figure>
  <img src="/img/gatos-muestras.png" alt="Barras en escala logarítmica comparando el número de casos que sostiene cada afirmación: 13 y 22 gatos en el estudio de 1987, 10 en el de 2004 y 1125 en el de 2025." />
  <figcaption>La escala es logarítmica, que ya dice bastante. Las afirmaciones contraintuitivas salen de las barras rojas.</figcaption>
</figure>

Y no es un caso aislado. En 2004 un estudio croata de ciento diecinueve gatos reportó otro patrón bonito: los que caen del tercer piso se rompen huesos y los que caen del séptimo o más se dañan el tórax. Un trasvase limpio.

En ese estudio, el 92 % de las caídas fueron de dos a seis pisos. El grupo del «séptimo o más» son unos diez animales.

Dos afirmaciones célebres, el mismo error, veinte años de diferencia.

## La réplica

En 2025 se publicó la cohorte grande: mil ciento veinticinco gatos, en Berlín, entre 2004 y 2013.

No encuentra el giro. Encuentra, textualmente, *«a linear increase in injury severity with greater fall height»*, y lo contrasta de forma explícita con el modelo curvilíneo anterior.

Tampoco encuentra el trasvase de fracturas a tórax: **suben las dos cosas a la vez**. Contusión pulmonar y neumotórax, sí, pero también fracturas de fémur, de radio, de pelvis y de tibia.

## Y ahora la parte de verdad incómoda

Todos estos estudios tienen un problema que no se arregla con más gatos.

**Son gatos que llegaron a una clínica.** No gatos que se cayeron. Un gato que muere en el impacto tiene bastantes menos posibilidades de acabar en la consulta de un veterinario que uno que se rompe una pata. Lo señaló Jared Diamond en *Nature* en 1988 y sigue siendo cierto.

Así que la supervivencia del 86,7 % que reporta el estudio grande no es la probabilidad de que un gato sobreviva a una caída. Es la probabilidad de que sobreviva **dado que llegó**. Falta el denominador, y no lo tiene nadie.

Lo bonito es que se puede acotar. Si llamas $r$ a la probabilidad de que un gato muerto acabe registrado, relativa a uno vivo, la supervivencia observada y la real se relacionan así:

$$
p_{\text{obs}} = \frac{p_{\text{real}}}{p_{\text{real}} + r\,(1-p_{\text{real}})}
$$

Despejas $r$, metes lo que predice el modelo y lo que se observa, y sale que haría falta que sólo **un 40 %** de los gatos muertos llegara a registrarse.

Pero el resultado que no me esperaba es otro: **$r$ sale prácticamente constante con la altura**. El mismo 0,4 abajo que arriba.

Y eso cambia la conclusión. Un sesgo constante infla la supervivencia a todas las alturas por igual, pero **no fabrica una tendencia con la altura donde no la hay**. Para inventar el máximo de 1987 haría falta que $r$ *creciera* con la altura, y no hay ninguna razón para que un gato muerto desde el piso veinte tenga más probabilidad de llegar al veterinario que uno del piso tres.

O sea: Diamond tenía razón en que la supervivencia publicada está inflada. Pero el giro de los siete pisos no se cae por el sesgo. Se cae por tener veintidós gatos.

El sesgo explica el nivel. No la forma.

## Lo que sí decide, y no es la altura

Si el daño lo marca cuánta distancia tienes para frenar, entonces la superficie sobre la que caes debería pesar tanto como la altura desde la que caes.

El estudio grande registra eso: **75,2 %** de lesiones graves sobre superficie dura frente al **50 %** sobre blanda, con diferencia significativa.

Un gato flexionando las patas aporta unos cinco centímetros de frenado. A velocidad terminal necesitaría dieciocho y medio. No le da: los otros trece los tiene que poner el suelo.

Y sin embargo, cuarenta años de discusión sobre este tema van sobre la altura.

## El dato que nadie sabe explicar

Dejo el mejor para el final, porque es el único sitio donde no tengo respuesta.

En los mil ciento veinticinco gatos hay una categoría de lesión que se comporta al revés que todas las demás: **las abrasiones en la cabeza son más frecuentes en las caídas más bajas y van decreciendo al aumentar la altura**.

Eso un modelo de impacto no lo puede producir. Si el daño depende de la velocidad y la velocidad crece con la altura, todo tiene que crecer con la altura. Una categoría que decrece exige algo que *mejore* al caer desde más alto.

La respuesta obvia sería que desde poca altura al gato no le da tiempo a orientarse. Y es una idea preciosa, porque el enderezamiento de un gato es de las cosas más elegantes que hace un animal: gira sin apoyarse en nada, con momento angular cero, sólo cambiando de forma. Lo modelaron Kane y Scher en 1969 como dos cilindros que se doblan y giran alternativamente.

El problema es que le bastan treinta centímetros y unas tres décimas de segundo. Y esas caídas «bajas» del estudio son de cuatro a cinco metros, o sea **un segundo entero**. Tres veces lo que necesita.

Ya se ha enderezado hace rato. Y sigue dándose en la cabeza.

Quedan tres salidas y sólo una es física: que falle otra cosa que también mejore con la altura; que el gato se golpee con barandillas o toldos *durante* la caída, lo cual no tiene nada que ver con el impacto; o que las caídas cortas sean más a menudo saltos deliberados y no accidentes.

Las dos últimas serían el sesgo de selección apareciendo por tercera vez, ahora disfrazado de mecanismo.

## A dónde lleva esto

Lo que más me ha gustado de todo esto no es haber tumbado un dato bonito. Es que las tres veces que algo se cayó, se cayó por la misma razón: **alguien miró un subconjunto y lo tomó por el todo**.

Veintidós gatos por encima del séptimo piso. Diez en el otro estudio. Y en el caso del sesgo, una población entera definida por haber sobrevivido lo suficiente para llegar a la consulta.

El antídoto no es más matemática. Es preguntar, cada vez, **de dónde salieron estos datos y quién no está aquí**. En este problema esa pregunta cambia la respuesta tres veces.

Y hay un premio de consolación que sí sobrevive intacto: los gatos aguantan mucho más que nosotros, y no por nada felino. Por cómo escalan el peso y la resistencia. Eso está en [la entrada anterior](/blog/por-que-una-hormiga-no-se-rompe), no depende de ningún dato clínico, y por tanto ningún sesgo de selección puede tocarlo.

- Whitney WO, Mehlhaff CJ. *High-rise syndrome in cats.* JAVMA 1987;191(11):1399–1403.
- Candela Andrade M et al. *High-rise syndrome in cats (part 2).* J Feline Med Surg 2025.
- Diamond J. *Why cats have nine lives.* Nature 1988;332:586–587.
- [El cuaderno completo](https://github.com/FullFran/reto-semanal) — incluida la predicción que sellé antes de mirar ninguno de estos datos, con sus errores dentro.
