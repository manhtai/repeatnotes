defmodule RepeatNotesWeb.Router do
  use RepeatNotesWeb, :router

  pipeline :browser do
    plug(:accepts, ["html"])
    plug(:fetch_session)
    plug(:fetch_flash)
    plug(:protect_from_forgery)
    plug(:put_secure_browser_headers)
  end

  pipeline :api do
    plug(:accepts, ["json"])
    plug(RepeatNotesWeb.APIAuthPlug, otp_app: :repeatnotes)
  end

  pipeline :api_protected do
    plug(Pow.Plug.RequireAuthenticated,
      error_handler: RepeatNotesWeb.APIAuthErrorHandler
    )
  end

  scope "/api", RepeatNotesWeb do
    pipe_through :api

    resources("/registration", RegistrationController, singleton: true, only: [:create])
    resources("/session", SessionController, singleton: true, only: [:create, :delete])
    post("/session/renew", SessionController, :renew)
  end

  scope "/api", RepeatNotesWeb do
    pipe_through([:api, :api_protected])

    get("/me", SessionController, :me)
  end

  # Enables LiveDashboard only for development
  #
  # If you want to use the LiveDashboard in production, you should put
  # it behind authentication and allow only admins to access it.
  # If your application does not have an admins-only section yet,
  # you can use Plug.BasicAuth to set up some basic authentication
  # as long as you are also using SSL (which you should anyway).
  if Mix.env() in [:dev, :test] do
    import Phoenix.LiveDashboard.Router

    scope "/" do
      pipe_through(:browser)
      live_dashboard("/dashboard", metrics: RepeatNotesWeb.Telemetry)
    end
  end

  scope "/", RepeatNotesWeb do
    pipe_through :browser

    get "/", PageController, :index
    get "/*path", PageController, :index
  end
end
