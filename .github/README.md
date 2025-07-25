# Meli Challenge - Abuse Prevention

Solución planteada por Sebastián Barros 25-07-2025

[Email ✉️](sebastianbarros1995@gmail.com)

[Teléfono 📱](1158646174)

## 1. Problemática

Se necesita una pantalla de pre-confirmación donde los usuarios puedan revisar su información personal para evitar posibles abusos/errores en las compras.

###  1.1 Requisitos

* La página debe cargar lo antes posible y sólo poseer un loading (i.e., no cargar diferentes componentes por separado).
* El captcha debe cargarse y validarse instantáneamente (i.e., no utilizar selectores de imágenes)
* Simplicidad de UX.
* Diseño responsive.
* Evitar que el usuario vuelva a cargar información ya cargada.
* Soporte multilenguaje.

### 1.2 Constraints (Requisitos no funcionales)

* La página debe implementarse utilizando typescript y reutilizando estructuras y tipos preexistentes.
* Debe utilizarse React (o vanilla en el caso de no-script, se detallará más adelante).
* Diseño mobile-first.
* Debe conservar los query params (referrer y token) para enviarlos a la página siguiente.
* No debe ser disruptivo en el flujo ya existente (no tocar página anterior ni siguiente).

### 1.3 Herramientas

* I18n para el manejo multilenguaje
* Ambiente conformado por microfrontend (se asume la existencia de otros servicios/MFE encargados de la autenticación y que proveen los tokens y keys necesarios para la comunicación con el BE)
* 2 Apis:
  * meli-countries (se asume que contienen información sobre los diferentes dominios de Mercado Libre y código de país).
  * meli-users (se asume que contienen información sobre los datos de contacto de los usuarios)
* Utilización de reCAPTCHA v2 de Google para gestión de captchas.
---

## 2. Arquitectura propuesta

### A gran escala

Implementar un nuevo paso en el checkout*como una **página intermedia** (`/pre-confirmation`) que:

* Se monta como un microfrontend utilizando React y TypeScript.
* El servidor express donde estará montado ya existe, debe agregarse la ruta nueva.
* Recibe `referrer` y `token` vía query params y los conserva para enviarlos al step siguiente.
* La información de contacto del usuario ya existe en el sistema, por lo tanto es indispensable que aparezca precargada.
* Precargado el formulario, el único accionable que debería realizar el usuario (a menos que necesite cambiar los datos) es clickear el captcha.
* Debe poder regresar al paso anterior conservando el state general de la aplicación y los query params.

---

## 2. Componentes

### 2.1. Frontend

1. Al montar la página:

   * Leer `referrer` y `token` de la URL. Estos datos se enviarán al BE en caso de que sea necesario algún tipo de tracking extra (i.e. herramientas como Amplitude).
   * Mediante la utilización de SSR, el servidor ya ha fetcheado la data necesaria y construido la pantalla para que el front-end sólo deba renderizarla. De esta manera se logra un único loading reduciendo al máximo los tiempos de espera (se asume que las api indicadas más arriba responden en tiempos que permitan lograr nuestro objetivo).
   * Para la gestión del Captcha se sugiere reCAPTCHA v2 ofrecido por google. En este punto podemos tomar 2 approachs:
     * 1. Utilizar casilla de verificación "No soy un robot" la cual sólo requiere un click del usuario y no pide resolver puzles ni otras verificaciones. El punto a favor de esta solución es que puede ser montado desde el lado del servidor junto al resto de la página, por lo que se renderiza instantáneamente. De la misma forma, este captcha necesita interacción del usuario (hacer click), por lo cual en el mejor de los casos estamos pidiendo 2 inputs al usuario: 1. resolver el captcha, 2. click en "continuar".
    >![captcha casilla](https://developers.google.com/static/recaptcha/images/newCaptchaAnchor.gif?hl=es-419)
     * 2. Utilizar la verificación de reCAPTCHA invisible. La ventaja de este captcha es que no requiere una interacción directa del usuario (a menos que se detecte tráfico sospechoso), sino que el mismo FE puede disparar una request de verificación ya sea en un first-load o cuando hace click en "continuar", reduciendo así la cantidad de acciones que debe realizar el usuario. La contra de este mecanismo es que, si bien corto, agregamos una request y un loading a la pantalla. A priori esto va en contra de los requerimientos, pero el trade-off loading vs input del usuario puede ser interesante para discutir con el equipo de producto y UX.
    >![captcha invisible](https://developers.google.com/static/recaptcha/images/invisible_badge.png?hl=es-419)
   * Mostrar los botones tanto de continuar como de volver hacia atrás, realizando cada uno la redirección correspondiente manteniendo los query params `token` y `referrer`.

#### Componentización/Armado de la pantalla

A nivel pantalla (casi rozando el código) se proponen 2 alternativas:

1. Manejar todo el formulario en un mismo componente que recibe la data fetcheada a partir de un contexto, teniendo los 3 inputs sugeridos (fullname, country y address) en el mismo archivo.
   * Pros:
     * Fácil manejo del estado del formulario.
     * Menos idas y venidas en el manejo de la información.
   * Contras:
     * El componente padre tiene mucha responsabilidad y conocimiento, ya que no sólo conoce el estado del formulario sino que también se lleva la responsabilidad del manejo de los inputs hijos.
     * Si el día de mañana se incrementa la cantidad de información a mostrar, esta solución no escala.
    
    A causa de las contras expuestas se sugiere ir por una alternativa más modular:

2. Manejar un componente padre que sólo se encargue del state del form y la acción de submit. Luego, renderiza distintos componentes que tienen diferentes responsabilidades. Los componentes obtienen la información de un contexto general de esta página, **no** reciben la data como prop.

    * `UserInfo`: muestra los datos del usuario y permite editarlos si necesario. Hoy en día se requiere el nombre completo, pero eventualmente podríamos agregar DNI/ID u otras opciones.
    * `Address`: muestra la información de la dirección del usuario. Se sugiere un único campo de texto con la dirección ya parseada del usuario y no diferentes inputs para seleccionar calle, altura, nro de dpto, etc. Desglozar tanto la dirección provocaría que el usuario tarde más de lo buscado en este paso. En caso de este campo sufrir modificaciones, el BE podría desglozar la dirección con ayuda de una IA para luego almacenar los campos por separado.
    * `CaptchaVerifier`: componente aislado para carga y verificación. Es importante aislarlo del formulario principal para no crear dependencias muy estrechas con la biblioteca a utilizar.
    * `ConfirmButton`: Renderizado de los botones "atrás" y "continuar", recibiendo los callbacks del componente padre. Debe poder leer el state del form y habilitarse/deshabilitarse en consecuencia.

#### 🎨 A nivel UI

* Layout responsive (se sugiere flexblox).
* Encarar el desarrollo utilizando la estrategia mobile-first.
* Cronometrar los tiempos de la pantalla (definir un máximo aceptable)
* Nunca bloquear la UI (loadings en particular).
* Reducir las animaciones al mínimo.
* Utilizar componentes ya definidos en el Design System de Mercado Libre (la única lib externa requerida debería ser reCAPTCHA v2)
  * Se asume que los componentes requeridos para esta pantalla se encuentran en el design system.
* Utilizar un dropdown de países que muestre tanto el nombre como bandera. El mismo debe funcionar sin trabarse por más que sean muchos países/imágenes a renderizar.

### 2.1.1 Otras consideraciones

Siendo Mercado Libre una empresa con diferentes productos, no podemos descartar que en el futuro se quiera implementar la misma pantalla en diferentes flujos (o incluso en Mercado Pago). Para ello vale la pena tener las siguientes ideas en mente a la hora de desarrollar:

* Desacoplar la pantalla en sí (URL, step del proceso de compra) del componente encargado de gestionar el formulario. 
  * Este componente podría ser reutilizado en diferentes flujos, al desacoplarlo del step de pre-verificación, podemos reutilizarlo sin mayores modificaciones.
* Es posible que se quiera experimentar con qué campos mostrar/no mostrar (por ej, para ciertos usuarios mostrar el DNI y para otros no, a nivel discovery), por lo que cada componente debe ser lo suficientemente inteligente para saber qué inputs renderizar en función de la data proporcionada por las APIs.

---

### 2.2. Backend

#### Lógica en el servidor

  * La ruta debe ser `/pre-confirmation`.
  * Debe verificar que los query params `token` y `referrer` estén presentes. Los mismos ya deberían estar sanitizados por pasos previos, pero debería haber un middleware que se encargue de checkearlos.
  * Sirve el HTML + la App de react ya hidratada, de forma que no deban hacerse queries client-side.
  * Verificación de headers de seguridad, CORS y validación de token/Bearers.
  * Será necesario un nuevo endpoint de validación del captcha. El mismo debe realizar una query a la API de Google utilizando el valor proporcionado por el frontend así como la secret KEY que debe vivir como variable de entorno en el backend.

---

## 3. Internacionalización (i18n)

* El idioma debe ser  por dominio (ej. `.com.ar`, `.com.br`). A partir de este dominio el backend hidrará los textos de la pantalla en función del idioma: esto es, para reducir los tiempos de carga del front, el mismo no debería incluir los JSONs con las traducciones, sino que estas deberían vivir a nivel backend y sólo servir las respectivas a ese dominio.
* En caso de que con el dominio no alcance para obtener el código de país referente a la traducción necesaria, se podría utilizar la api de meli-countries para obtener el código de país.

---

## 4. Performance

* Se utilizará una arquitectura SSR donde la única query dispara por el frontend debe ser para continuar al paso siguiente.
* El captcha debería venir precargado desde el backend, pero en caso de que la biblioteca de google realice alguna query de inicialización, se debe utilizar el fallback correspondiente.
* Los datos han de ser hidratados por el backend al momento de entrar a la pantalla.
* Se deben realizar verficaciones de Lighthouse para garantizar un alto score.
 
---

## 5. Otros

### Soporte para no-script (JavaScript deshabilitado)

* Para el caso no-script se sugieren 2 alternativas:
  * Devolver una versión de la página con datos estáticos y sin que el usuario pueda modificarlos.
  * Realizar un formulario básico de HTML sin estilos y con una redirección en el submit.
* En ambos casos se utilizaría sólo html nativo, sin react ni otras dependencias.
* Para la solución propuesta de reCaptcha, Google ofrece una versión no-script del mismo, renderizando un iframe con el contenido necesario para la validación.

### Casos de errores

* Permitir la re-validación del captcha en el caso de que la verificación fuese errónea.
* Manejar los errores en caso de que alguna de las APIs necesarias estén caídas y trackear los errores en alguna herramienta para este fin (i.e. Sentry)
* Con el objetivo de no frenar una compra/transacción, podría saltarse el paso de pre-verificación en caso de error. 
  * Se deben tomar las precauciones necesarias para que este error sea legítimo (i.e., API caída) y no provocado por un usuario malicioso con el objetivo de saltarse la verificación (i.e., payload modificado con una herramienta como Charles Proxy).

### Trackeo de información

* Se deben trackear las sesiones de los usuarios utilizando herramientas como amplitude y mouseflow para futuras mejoras e interacciones de la pantalla acorde el user-journey del usuario.
* Guardar analytics de cuántos usuarios cambiaron su información de contacto.

---

## Fin del flujo

* Se deben enviar los datos modificados al backend, el código de captcha para la verificación y los query params `referrer` y `token`.

---

## Posible estructura de carpetas para una POC.

```
/src
  /components
    AddressSummary.tsx
    UserInfoSummary.tsx
    CaptchaVerifier.tsx
    ConfirmButton.tsx
  /hooks
    usePreConfirmationContext.ts
  /contexts
    PreConfirmationContext.ts
    PreConfirmationProvidet.tsx
  /pages
    PreConfirmationCheck.tsx
  index.tsx
/server
  routes.ts
  captchaVerify.ts
/i18n
  es.json
  pt.json
```
