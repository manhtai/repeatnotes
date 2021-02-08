defmodule RepeatNotesWeb.SrsConfigController do
  use RepeatNotesWeb, :controller

  alias RepeatNotes.{Users, Srs}

  @spec show(Plug.Conn.t(), map()) :: Plug.Conn.t()
  def show(conn, _params) do
    with %{id: user_id} <- conn.assigns.current_user do
      srs_config = Users.get_srs_config(user_id)
      render(conn, "show.json", srs_config: srs_config)
    end
  end

  @spec update(Plug.Conn.t(), map()) :: Plug.Conn.t()
  def update(conn, %{"srs_config" => srs_config_params}) do
    with %{id: user_id} <- conn.assigns.current_user do
      params = Map.merge(srs_config_params, %{"user_id" => user_id})
      {:ok, srs_config} = Users.update_srs_config(user_id, params)

      # Cache new scheduler
      Srs.set_scheduler(user_id, srs_config)

      render(conn, "show.json", srs_config: srs_config)
    end
  end
end
