# Taekwondo On User Management System Backend API

## Running a database with docker
```bash
# check ./env/local.pg.env for environment variables
docker compose -f ./docker/postgres/docker-compose.local.yaml up -d
```

## How to set up the project
```bash
# install ef tool
dotnet tool install --global dotnet-ef

# run the migrations
dotnet ef database update

# run the project
dotnet run
```

## Generating seed data
Uncomment the section below in Program.cs and run the project.  
Comment it out unless you want to generate every time you run this project.
```C#
await seeder.TestSeed();
```

## Resetting the database
This assumes you already have the database running in a container on your machine.
```bash
docker compose -f ./docker/postgres/docker-compose.local.yaml down -v
docker compose -f ./docker/postgres/docker-compose.local.yaml up
```


## Column Naming conventions
- Each column should be all lowercase, with each word separated by an underscore.
  - The actual property in the class will be pascal case (C# naming conventions)
  - If a field cannot be null in the db, use the [Required] attribute

## Updating the database

- The database is updated through migrations.
- To generate a migration, in the package manager console, type in `add-migration <<MEANINGFUL MIGRATION NAME>>`
  - this will create a new mirgration, with the given name, updating the database with any changes made to the
    classes in the **_AppDbContext_** class.
  - Any new additions to the class will be created
- when the migration is set up (the add-migration usually does a pretty good job at creating the migration),
  run the `update-database [<<MIGRATION NAME>>]` command to send the migration to the database
  - The migration name is optional. if it is not included, it will apply the newest migration to the database
  - when calling a specific migration, the date isn't needed (only the name inputted into `add-migration`)
    is needed.

> **_NOTE:_** If you are not using the package manager console in visual studio,
> [command references can be found here](https://learn.microsoft.com/en-us/ef/core/cli/dotnet).
> Most commands may need to be prefixed with `dotnet ef`

#### Accessing the Database From a WSL Instance

1. Open a new WSL instance
2. Run the command `docker exec -it postgres-tkdpg_local-1 psql -U <<USERNAME>> -d <<DB NAME>>`. Again, if you
   do not know the username or DB name, ask in the chat. We can get it to you.
3. You should now be in the psql shell within the terminal.
4. If you need to exit the psql shell, run the command `\q`.

#### Running the Reset command

- The reset command just deletes the tables in the database so the `update-database` command can apply its
  migrations on a fresh db.
- Again, this should be a **_VERY_** rare occurrance in the future, but in the early stages, as the foundation
  is still changing, this may have to be done.
- From within the terminal run the command

```
DROP TABLE "__EFMigrationsHistory", "Schedules", "ScheduleInstructorUser", "TimeSlots", "users", "ScheduleStudentUser";
```

- This will drop all of the tables in the database. Again, in the future, this should not be something we need
  to run
  - To ensure this was completed successfully, run the command `\dt`
    - command found here: https://stackoverflow.com/questions/769683/how-to-show-tables-in-postgresql
    - This command shows all tables that currently exist in the public schema.
- Once this is finished, run the `update-database` command. this will reapply all migrations to the DB.
