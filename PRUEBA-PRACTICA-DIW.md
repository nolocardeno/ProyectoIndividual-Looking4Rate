# Prueba Práctica - DWEC (Cliente)

### Arquitectura:
##### ¿Por qué has colocado tus variables en la capa Settings y tus estilos en Components? ¿Qué pasaría si importaras Components antes que Settings en el manifiesto?
Basicamente, coloco las variables en la capa de settings por que esta es la que especifica las variables globales que se usaran en todo el proyecto. Y los estilos de los componentes en especifico los pongo en Components ya que estos estilos perteneceran a componentes concretos.
Es decir, aqui estamos aplicando orden para organizarnos las especifidades de nuestros estilos.
Si importara los estilos Components antes que los de Settings el proyecto daria error, ya que no se estaría cumpliendo la especifidad adecuada. Basicamente estariamos intentando importar estilos de componentes que ya deberian usar las variables que hay en Settings y esto daria error.

### Metodología:
##### Explica una ventaja real que te haya aportado usar BEM en este examen frente a usar selectores de etiqueta anidados (ej: div > button).
En general usar BEM, tanto en este examen como en todo el proyecto aporta orden y limpieza visual al codigo. Me evito anidamientos innecesarios en los estilos css y además me aseguro de que esos estilos sean reutilizables para los trozos concretos del codigo al que hacen referencia incluso si cambiamos cosas de esa misma estructura.
Por ejemplo, si tenemos una etiqueta span con una clase, esa clase es a la que hariamos referencia con BEM y no con anidamientos innecesarios si no usaramos esto. Entonces, si alguna vez cambiaramos esa etiqueta de span a otra etiqueta, esto nos permitiria que el estilo definido con BEM fuera reutilizable y facilmente reconocible.