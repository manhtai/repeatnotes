# This file is responsible for configuring your application
# and its dependencies with the aid of the Mix.Config module.
#
# This configuration file is loaded before any dependency and
# is restricted to this project.

# General application configuration
use Mix.Config

config :repeatnotes,
  ecto_repos: [RepeatNotes.Repo]

# Configures the endpoint
config :repeatnotes, RepeatNotesWeb.Endpoint,
  url: [host: "localhost"],
  secret_key_base: "Q0SSISGmbqxfkqsDeKQXw6pLaG7BWKAV2ckS4Bkh55UHv0dSsOpJt4ggO8xASw2W",
  render_errors: [view: RepeatNotesWeb.ErrorView, accepts: ~w(html json), layout: false],
  pubsub_server: RepeatNotes.PubSub,
  live_view: [signing_salt: "Adb2mONG"],
  instrumenters: [NewRelic.Phoenix.Instrumenter]

config :repeatnotes, :pow,
  user: RepeatNotes.Users.User,
  repo: RepeatNotes.Repo,
  cache_store_backend: Pow.Postgres.Store

config :pow, Pow.Postgres.Store, repo: RepeatNotes.Repo

# Configures Elixir's Logger
config :logger, :console,
  format: "$time $metadata[$level] $message\n",
  metadata: [:request_id]

# Use Jason for JSON parsing in Phoenix
config :phoenix, :json_library, Jason

# run shell command to "source .env" to load the environment variables.
# wrap in "try do"
try do
  # in case .env file does not exist.
  File.stream!("./.env")
  # remove excess whitespace
  |> Stream.map(&String.trim_trailing/1)
  # loop through each line
  |> Enum.each(fn line ->
    line
    # remove "export" from line
    |> String.replace("export ", "")
    # split on *first* "=" (equals sign)
    |> String.split("=", parts: 2)
    # stackoverflow.com/q/33055834/1148249
    |> Enum.reduce(fn value, key ->
      # set each environment variable
      System.put_env(key, value)
    end)
  end)
rescue
  _ -> IO.puts("no .env file found!")
end

# Mailers
sib_api_key = System.get_env("SENDINBLUE_API_KEY")

if sib_api_key != nil do
  config :repeatnotes, RepeatNotes.Mailers.Sendinblue,
    adapter: Swoosh.Adapters.Sendinblue,
    api_key: sib_api_key
end

config :repeatnotes, RepeatNotes.Mailers.Gmail, adapter: Swoosh.Adapters.Gmail

# Uploaders
config :waffle,
  version_timeout: 60_000,
  storage: Waffle.Storage.S3,
  asset_host: System.get_env("AWS_ASSET_HOST"),
  bucket: System.get_env("AWS_BUCKET_NAME")

config :ex_aws,
  json_codec: Jason,
  access_key_id: System.get_env("AWS_ACCESS_KEY_ID"),
  secret_access_key: System.get_env("AWS_SECRET_ACCESS_KEY"),
  region: System.get_env("AWS_REGION")

# Wasm file support
config :mime, :types, %{
  "application/wasm" => ["wasm"]
}

# Import environment specific config. This must remain at the bottom
# of this file so it overrides the configuration defined above.
import_config "#{Mix.env()}.exs"
