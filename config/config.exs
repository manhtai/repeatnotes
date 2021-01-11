# This file is responsible for configuring your application
# and its dependencies with the aid of the Mix.Config module.
#
# This configuration file is loaded before any dependency and
# is restricted to this project.

# General application configuration
use Mix.Config

config :repeatnotes,
  ecto_repos: [Repeatnotes.Repo]

# Configures the endpoint
config :repeatnotes, RepeatnotesWeb.Endpoint,
  url: [host: "localhost"],
  secret_key_base: "Q0SSISGmbqxfkqsDeKQXw6pLaG7BWKAV2ckS4Bkh55UHv0dSsOpJt4ggO8xASw2W",
  render_errors: [view: RepeatnotesWeb.ErrorView, accepts: ~w(html json), layout: false],
  pubsub_server: Repeatnotes.PubSub,
  live_view: [signing_salt: "Adb2mONG"]

# Configures Elixir's Logger
config :logger, :console,
  format: "$time $metadata[$level] $message\n",
  metadata: [:request_id]

# Use Jason for JSON parsing in Phoenix
config :phoenix, :json_library, Jason

# Import environment specific config. This must remain at the bottom
# of this file so it overrides the configuration defined above.
import_config "#{Mix.env()}.exs"
