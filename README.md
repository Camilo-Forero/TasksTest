<h1>Tasks Test</h1>
<p>Este es un proyecto para mostrar un CRUD con React en el front end y python en el backend.</p>
<p>Es un simple programa que se encarga de permitir llevar tareas de forma ordenada que permite:</p>
<ul>
    <li>Crear nuevas tareas</li>
    <li>Listar tareas</li>
    <li>Actualizar tareas</li>
    <li>Eliminar tareas</li>
</ul>
<h2>Backend</h2>
<p>las tecnologia utilizadas son: python con fastAPI y SQLalchemy como ORM. Tambien en el app.py se agrego una especie de migración con ello la tabla de estados esta inicializada junto con la de tareas </p>
<h2>DB</h2>
<p>Se uso SQLite para mas facilidad, al inicializarce el archivo "sql_app.db" que es la base de datos queda en un folde llamado data y por ello persiste la informacion</p>
<h2>Frontend</h2>
<p>Se uso React y bootstrap para los diseños, se hacen con las validaciones imbuidas de HTML5</p>
<h3>instrucciones de arranque</h3>
<ul>
    <li>clonar el repositorio, en el vienen incluido tanto el backend como el frontend</li>
    <li>correr el comando: <b>docker compose up --build</b> o <b>docker-compose up --build</b></li>
    <li>Para usarlo http://localhost:5173</li>
    <li>API URL http://localhost:8000</li>
</ul>
<h3>End points:</h3>
<ul>
    <li>GET /api/todos</li>
    <li>GET /api/todos/:id </li>
    <li>POST /api/todos</li>
    <li>PUT /api/todos/:id</li>
    <li>DELTE /api/todos/:id</li>
</ul>
