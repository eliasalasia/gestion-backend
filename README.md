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



