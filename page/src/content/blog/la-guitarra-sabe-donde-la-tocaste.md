---
title: "La guitarra sabe dónde la tocaste"
date: 2026-09-12
lang: es
description: "Al pulsar una cuerda no solo la haces sonar: borras armónicos enteros. Cuáles faltan delata dónde pusiste el dedo, y eso se puede leer al revés hasta dos milímetros."
---

Toca la misma nota dos veces en la misma guitarra. Una junto al puente, otra sobre la boca.

El tono es idéntico. El sonido no se parece en nada.

Eso no es una sutileza de guitarrista. Es que al pulsar en un sitio concreto **borras armónicos enteros**. No los debilitas: los anulas. Y cuáles se anulan depende solo de dónde pusiste el dedo.

Lo que quiero contarte es que esa frase se puede leer al revés.

## La respuesta está en lo que falta

Una cuerda sujeta por los dos extremos solo puede vibrar en ciertas formas. El primer armónico es una panza. El segundo tiene un punto quieto en el centro. El tercero tiene dos puntos quietos. Cada armónico tiene sus **nodos**: sitios donde la cuerda, en esa forma concreta, no se mueve.

Y ahora la pregunta que lo resuelve todo: ¿qué pasa si tiras de la cuerda justo en el nodo de un armónico?

Que ese armónico no se entera. Estás desplazando la cuerda exactamente donde él vale cero. No puedes excitarlo.

El segundo armónico tiene su nodo en el centro exacto de la cuerda. Así que si pulsas en el centro, **el segundo armónico no suena**. Ni el cuarto, ni el sexto, ni ninguno de los pares, porque todos tienen un nodo ahí.

Pulsa a un cuarto de la cuerda y mueres el cuarto armónico, el octavo, el duodécimo.

## La ecuación

Tira de la cuerda en la posición $p$ (como fracción de su longitud) y suéltala. Su forma inicial es un triángulo. Descomponiendo ese triángulo en armónicos, la amplitud del armónico $n$ vale:

$$
A_n = \frac{2h}{n^2\pi^2\,p(1-p)}\,\sin(n\pi p)
$$

Fíjate en que hay dos factores haciendo cosas distintas.

El $1/n^2$ es la **envolvente**: dice que los graves mandan y los agudos se apagan. Es el que da el volumen de cada armónico.

El $\sin(n\pi p)$ es el **peine**: es el que anula armónicos enteros, y es el único de los dos que sabe dónde pusiste el dedo. Vale cero exactamente cuando $np$ es un número entero.

De ahí sale la regla completa:

> Si pulsas en $p = a/b$, con la fracción simplificada, **mueren todos los armónicos múltiplos de $b$**.

## Pruébalo

Debajo tienes el cálculo funcionando. Mueve la posición y mira cómo los dientes de cobre —los armónicos ausentes— se desplazan. Y dale a **Pulsar la cuerda** para oírlo.

<figure>
  <iframe src="/simuladores/peine-de-pulsacion.html" title="Simulador interactivo del espectro de una cuerda pulsada" loading="lazy" style="width:100%;height:min(88vh,920px);border:1px solid rgba(128,128,128,.35);border-radius:6px;"></iframe>
  <figcaption>El espectro de una cuerda pulsada. En verde los armónicos presentes, en cobre los que el punto de pulsación ha borrado.</figcaption>
</figure>

Si quieres ver de golpe de qué va todo esto, prueba el ajuste **Ponticello** y luego **Tasto**, y escucha los dos. Es el mismo tono, la misma cuerda y la misma tensión. Lo único que cambia es qué armónicos existen.

## Hay huecos que no se pueden tapar

Hasta aquí he hecho trampa: he supuesto que pulsas con un punto infinitamente fino. Un dedo real tiene anchura, y el vértice del triángulo se convierte en una meseta. Rehaciendo la cuenta con una meseta de anchura $w$:

$$
A_n = \frac{2hL}{n^2\pi^2}\left[\frac{\sin(n\pi a)}{a} + \frac{\sin(n\pi b)}{L-b}\right],
\qquad a = p - \tfrac{w}{2},\quad b = p + \tfrac{w}{2}
$$

Ahora los huecos ya no son cero exacto: se rellenan. Con una yema de 5 mm sobre una cuerda de 650 mm, el hueco pasa de ser infinitamente profundo a unos 30 dB, y se sigue rellenando a razón de 20 dB por cada década de anchura.

Salvo en un sitio.

Si desarrollas esa fórmula, el relleno resulta ser proporcional a $\frac{1}{a} - \frac{1}{L-b}$, que es la **asimetría** del punto de pulsación respecto a los dos extremos. Y en el centro exacto de la cuerda esa asimetría vale cero.

Lo comprobé subiendo la anchura hasta lo absurdo:

| anchura del dedo | hueco en $p=1/2$ | hueco en $p=1/4$ |
|---|---|---|
| 5 mm | 320 dB | 29.8 dB |
| 40 mm | 320 dB | ~10 dB |

Un dedo de **cuatro centímetros** no roza los armónicos ausentes de la pulsación central. Y el motivo no tiene nada que ver con triángulos: el centro es un punto de simetría, los armónicos pares son antisimétricos respecto a él, y el solape de algo simétrico con algo antisimétrico es cero **sea cual sea la forma**.

Hay dos clases de cero. Los que salen de una coincidencia aritmética son frágiles. Los que salen de una simetría son indestructibles.

## Darle la vuelta

Si el sitio decide qué falta, lo que falta delata el sitio. Eso es un **problema inverso**, y se puede atacar.

La clave está en invertir por lo correcto. La anchura del dedo cambia la *profundidad* de los huecos, pero no su *posición*. Así que si mides dónde están los mínimos en vez de cuánto bajan, tienes una medida robusta: no necesitas calibrar el micrófono, ni saber con cuánta fuerza se pulsó, ni modelar cómo se apaga la nota.

Antes de programarlo escribí mi predicción y la dejé firmada: pensé que acertaría con unos 2 cm de margen.

Salió **0.33 mm**. Fallé por un factor de sesenta.

Y el motivo de fallar es más interesante que el número. Yo había supuesto que la anchura del dedo emborrona la información. No lo hace, y hay una razón geométrica preciosa: el armónico $n$ tiene una longitud de onda de $2L/n$, que en el armónico 32 son 40 milímetros. **Ocho veces más ancho que el dedo.** Un contacto solo empieza a notarse en armónicos con $n \gtrsim L/w$, o sea alrededor del 130. Yo estaba mirando los primeros 32.

El dedo era invisible en la banda que estaba usando.

## Donde mi programa me mintió

Esta es la parte que de verdad me llevo.

Una cuerda no se suelta desde el reposo. El dedo resbala y le comunica **velocidad**, no solo posición. Son dos condiciones iniciales, y contribuyen de forma distinta: la de posición se apaga como $1/n^2$ y la de velocidad como $1/n$.

La de velocidad cae más despacio. Así que manda en los agudos y **aplana la envolvente**. Puedes verlo en el simulador de arriba: sube el deslizamiento del dedo y mira cómo se inclina el espectro entero.

Cuando metí eso en los datos de prueba, mi estimador no se degradó poco a poco. Colapsó. Contestaba, con total seguridad, que había pulsado pegado al puente.

El motivo es una degeneración del modelo, y es la lección de todo el proyecto:

> En ese modelo, $p$ controla **dos cosas a la vez**: dónde caen los ceros y con qué pendiente cae la envolvente.

Así que cuando algo aplanó la envolvente por su cuenta, el modelo lo explicó de la única forma que sabía: moviendo la posición. Con $p$ pequeño, $\sin(n\pi p) \approx n\pi p$ y la caída pasa de $1/n^2$ a $1/n$. Es decir, un dedo que resbala y un ponticello extremo le parecen lo mismo.

No falló en la cuenta. **Falló de mecanismo, y con toda la confianza del mundo.**

## Guitarras de verdad

Todo lo anterior invertía audio que generaba yo mismo con la misma física. Eso no es leer un sonido: es comprobar que sé deshacer mi propia cuenta.

El salto lo hice sobre 240 grabaciones reales de guitarra eléctrica con la distancia al puente anotada. Elegí eléctrica a propósito: **quita la caja de resonancia**, que es el factor que más miedo me daba, y a cambio mete uno nuevo pero de forma conocida, porque una pastilla lee la cuerda en un punto e impone **su propio peine**.

Lo primero fue mirar el dato antes de construirle nada encima:

```
  posición     n=1    2    3    4    5    6    7    8
   110 mm       -5   -2    0   -3  -12  -20  -12  -13    <- hueco en n=6
   170 mm       -1    0   -3  -14   -4   -5  -15  -15    <- hueco en n=4
```

Predicho en 5.9 y 3.8. Observado en 6 y 4. **El peine está ahí, en una guitarra de verdad.**

Y hay un detalle que lo confirma por partida doble: comparando las tres pastillas sobre la misma pulsación, todas comparten el hueco del armónico 4 —ese es el de la pulsación— pero con la pastilla del mástil se hunde a −28 dB y aparece otro en el 8. Porque el mástil está a unos 160 mm del puente y **los dos peines se solapan**.

Eso permitió una comprobación que nadie me regaló. Las distancias estaban anotadas, pero la longitud de la guitarra no. Así que la dejé como incógnita:

$$
L_{\text{estimada}} = 638 \pm 32~\text{mm}
\qquad\text{(real: 647.7 mm en una Fender)}
$$

Recuperé, solo del sonido, una medida física de un instrumento que no he visto nunca.

## El error que solo un paper podía destapar

Había algo raro: funcionaba en la cuerda más aguda y fallaba en las graves.

La respuesta estaba en un artículo de 2022 que mide la **inarmonicidad** de cuerdas reales. Una cuerda no es ideal: tiene rigidez, y sus armónicos no caen en múltiplos exactos de la fundamental sino en

$$
f_n = n f_0\sqrt{1 + Bn^2}
$$

Las cuerdas entorchadas graves tienen $B \approx 10^{-4}$, diez veces lo que yo había supuesto. Con ese valor, el armónico 40 se desplaza **128 cents**: más de un semitono. Mi ventana de búsqueda medía 21 cents.

A las cuerdas graves se les salían los armónicos de la ventana. No era un problema de inversión: era de medida.

Estimando $B$ en cada grabación, el error final quedó en **2.05 mm de mediana**, con el 78 % de los casos por debajo de un centímetro.

Para situarlo: el trabajo de referencia sobre este problema reporta 2.91 mm. No es una comparación de tú a tú —otra guitarra, otro montaje, otro protocolo de evaluación, y ellos además miden con la cadena de efectos puesta— así que no voy a decir que lo he mejorado. Lo que sí dice ese número es que estamos en el mismo orden de magnitud, y eso era exactamente lo que quería saber: que el método aguanta fuera del laboratorio.

Y hay una comprobación que me gusta más que el milímetro. Las $B$ que salieron del ajuste reproducen solas la tabla del artículo de 2022, sin que nadie se las diera: del orden de $10^{-4}$ en la sexta y de $10^{-5}$ en la prima. Eso no se puede ajustar por casualidad.

## Esto no va de guitarras

El patrón —**leer una posición en lo que falta**— está por todas partes.

Sabemos de qué está hecho el Sol por las longitudes de onda que **faltan** en su espectro. El helio se descubrió así en 1868, veintisiete años antes de aislarlo en la Tierra: un elemento entero encontrado en un hueco.

Las reflexiones *prohibidas* en un patrón de difracción revelan la simetría de un cristal. Matemáticamente es una regla de selección, que es exactamente lo que es $\sin(n\pi p) = 0$.

Los huecos de Kirkwood en el cinturón de asteroides son órbitas vacías en resonancia con Júpiter. La ausencia codifica la dinámica.

Y el más bonito: después de un terremoto muy grande, **la Tierra entera suena como una campana** durante días. La amplitud con la que se excita cada modo depende de dónde se rompió. Un foco en el nodo de un modo no lo excita, igual que no excitas el segundo armónico pulsando en el centro de la cuerda. Es la misma ecuación en una esfera elástica.

Con un detalle que cierra el círculo. En sismología, esa amplitud la controlan la posición de la fuente **y la del receptor**: el sismómetro también está en algún sitio y también pesa cada modo. Es literalmente mi problema de la pastilla. Y por eso, con una sola observación, fuente y receptor no se pueden separar.

Yo no lo resolví con dos sensores, sino con ocho pulsaciones distintas compartiendo una misma pastilla. La información no la da el número de sensores: la da el número de configuraciones independientes donde una incógnita cambia y la otra no.

## El límite

En 1966 Mark Kac preguntó si se puede **oír la forma de un tambor**. Es el hermano exacto de este problema, dado la vuelta: yo conozco la forma y busco la fuente; él conoce la fuente y busca la forma.

La respuesta llegó en 1992, y fue que no. Gordon, Webb y Wolpert construyeron dos tambores con formas distintas que suenan exactamente igual.

Pero el matiz es lo mejor de todo: **sí puedes oír el área, y el perímetro**. Hay cosas que el sonido te dice siempre y otras que no te va a decir nunca. Saber de qué lado cae tu pregunta es media respuesta.

## Lo que queda

Todo esto lo he hecho sin caja de resonancia, sobre una guitarra eléctrica enchufada directamente.

Y resulta que lo que este proyecto ha demostrado es que el punto débil de todo el método es la **envolvente**. Una caja de resonancia es, literalmente, un aparato para deformar envolventes.

Fui a buscar cuánto estropea eso la estimación. No lo ha medido nadie. La literatura describe el acoplamiento entre la tapa y el aire, pero no su efecto sobre esta pregunta.

Así que queda un hueco, y de los buenos. Hace falta una guitarra acústica y una regla.

---

De este proyecto me llevo tres cosas, y ninguna es el resultado.

Que perder una predicción firmada enseña más que acertarla, y solo funciona si la firmas antes.

Que un resultado que no empeora cuando empeoras las condiciones no es un resultado: es un error en el código. Tiré del hilo dos veces y las dos veces había uno.

Y la que me va a durar: **un parámetro que controla dos cosas a la vez te va a mentir**, y lo hará con la misma cara con la que te dice la verdad.

---

El cuaderno completo, con las predicciones firmadas, los errores catalogados y el código, está en [github.com/FullFran/reto-semanal](https://github.com/FullFran/reto-semanal). Es la segunda entrega de una serie donde ataco un problema de física por semana; la anterior iba sobre [por qué los gatos no caen mejor desde más alto](/blog/los-gatos-no-caen-mejor-desde-mas-alto).

### Referencias

- C. Traube, J. O. Smith III. *Estimating the Plucking Point on a Guitar String.* DAFx-00, 2000.
- Z. Mohamad, S. Dixon, C. Harte. *Estimating Pickup and Plucking Positions of Guitar Tones and Chords with Audio Effects.* DAFx-17, 2017.
- J. D. Tillman. *Response Effects of Guitar Pickup Position and Width.*
- N. G. Horton, T. R. Moore. *Modeling the magnetic pickup of an electric guitar.* Am. J. Phys. 77(2), 2009.
- C. J. Murray, S. B. Whitfield. *Inharmonicity in plucked guitar strings.* Am. J. Phys. 90(7), 2022.
- M. Kac. *Can One Hear the Shape of a Drum?* Am. Math. Monthly 73(4), 1966.
- C. Gordon, D. Webb, S. Wolpert. *One cannot hear the shape of a drum.* Bull. AMS 27(1), 1992.
