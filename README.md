# RepeatNotes

To start your Phoenix server:

  * Install dependencies with `mix deps.get`
  * Create and migrate your database with `mix ecto.setup`
  * Install Node.js dependencies with `yarn` inside the `assets` directory
  * Start Phoenix endpoint with `mix phx.server`

Now you can visit [`localhost:3333`](http://localhost:3333) from your browser.

## Deploy to Heroku


```
# Create a Heroku instance for your project
heroku apps:create my_heroku_app

# Set and add the buildpacks for your Heroku app
heroku buildpacks:set https://github.com/HashNuke/heroku-buildpack-elixir
heroku buildpacks:add https://github.com/gjaldon/heroku-buildpack-phoenix-static

# Deploy
git push heroku master
```
