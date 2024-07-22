RESIDENTES: 
EMAIL
enzo_3@gmail.com: CONTRASEÑA: Codigo2
bruno_1@gmail.com CONTRASEÑA: Codigo3
palquito_1@gmail.com CONTRASEÑA: Codigo4
Elias101@gmail.com CONTRASEÑA: Codigo1


ADMINISTRADORES: 
adminHar@gmail.com CONTRASEÑA: Codigo0
Dieguitogol@gmail.com  CONTRASEÑA:Codigo99


ESTADO: "PENDIENTE", EN PROCESO, RESUELTO







Funcionamientos creados. 

users.controller.js: 
PARA REGISTRARSE:

POST: http://localhost:3000/api/users/register 
JSON: {
  "nombre": "NUEVO",
  "email": "nuevo@gmail.com",
  "contraseña": "Contraseña1",
  "tipo": "Residente",
  "apartamento": "210"
} 
Y COMO RESPUESTA RECIBIMOS: 
{
  "message": "Usuario registrado exitosamente",
  "userId": 8
}


POST: http://localhost:3000/api/users/login 
JSON: {
  "email": "Elias101@gmail.com",
  "contraseña": "Codigo1"
}

COMO RESPUESTA: 
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NiwiaWF0IjoxNzIxMDc5OTk2LCJleHAiOjE3MjExNjYzOTZ9.GHcXlwLW0JRm6WoOV9N57C3al47HaLoOYrFwfUigvto",
  "user": {
    "id": 6,
    "nombre": "Elias Alasia",
    "tipo": "residente"
  }
}

Ese Token lo utilizariamos en incidencia en caso que tenga el usuario que reportar el token sirve para habilitarlo. 

incidencias.controller.js: 

POST: http://localhost:3000/api/incidencias
Headers: 
Authorization  Bearer <Agregas el Token>
EN BODY / Form: 
asunto: "Agregas el asunto"
descripcion "Agregas una descripcion"
tipo "Agregas un tipo"
estado "Agregas un estado"
ubicacion  "Agregas la ubicacion del incidente."

imagenes (Seleccionas la imagen)


GET: http://localhost:3000/api/incidencias
Headers: 
Authorization  Bearer <Agregas el Token> 
(Dependiendo del Token si sos residente te saldra de mensaje): 
{
  "message": "Saldria todas las incidencias creadas por ese mismo residente"
}
(Si sos Administrador te saldra de mensaje):
{
  "Todos los residentes que presentaron un reporte de alguna incidencia."
} 

GET: http://localhost:3000/api/incidencias/estado/:estado ("pendiente", "en proceso", "resuelto") 
Headers: 
Authorization  Bearer <Agregas el Token>
message: 
si es residente le saldran de todos sus  estado incidencias dependiendo si es: ("pendiente", "en proceso", "resuelto")
si es residente le saldra de todos los usuarios con el estado de su incidencias. ("pendiente", "en proceso", "resuelto")


PUT: http://localhost:3000/api/incidencias/:id
Headers: 
Authorization  Bearer <Agregas el Token>
EN BODY / Form: 
asunto: "Actualizar el asunto"
descripcion "Actualizar una descripcion"
tipo "Actualizar un tipo"
estado "Actualizar un estado"
ubicacion  "Actualizar la ubicacion del incidente."

imagenes (Seleccionas y Actualiza la imagen)

DELETE: http://localhost:3000/incidencias/:Id
Headers: 
Authorization  Bearer <Agregas el Token>
 message: 'Incidencia eliminada exitosamente'


 COMENTARIOS: 
 comentarios.controller.js

POST: http://localhost:3000/api/comentarios
Headers: 
Authorization  Bearer <Agregas el Token> (el residente solo puede comentar sus incidencias reportadas y el admin puede responder cualquier incidencia publicada por cualquier residente.)
BODY/JSON:
{
  "contenido": "Agregas comentario",
  "incidenciaId": 3
}

GET: http://localhost:3000/api/comentarios/{incidenciasid}
Headers: 
Authorization  Bearer <Agregas el Token> (el residente solo puede ver su mensajes 
con lo del admin y el administrador pueda ver los comentarios de incidencia que tienen los residentes con el.)
